import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { chassisList, getChassis } from "@/data/chassis";
import type { Chassis, VariantBrief } from "@/data/types";
import { locales, isLocale, type Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { relatedBodies, summarizeVariants, variantsFor, fixBandForVariants } from "@/lib/catalog";
import { VariantExplorer } from "@/components/VariantExplorer";
import { ScoreGlow } from "@/components/ScoreBadge";
import { Money, FixBand } from "@/components/Money";
import { BodySwitcher } from "@/components/BodySwitcher";
import { CarPhoto } from "@/components/CarPhoto";
import { VerdictBlock } from "@/components/VerdictBlock";
import { chassisVerdict } from "@/data/verdicts";
import { bodyLabelKey, bodyOf } from "@/lib/carImage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; chassis: string }>;
}): Promise<Metadata> {
  const { locale, chassis: slug } = await params;
  const chassis = getChassis(slug);
  if (!chassis || !isLocale(locale)) return {};
  return {
    title: `${chassis.code} · ${chassis.name[locale]}`,
    description: `${chassis.code} ${chassis.years}`,
  };
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    chassisList.map((chassis) => ({ locale, chassis: chassis.slug })),
  );
}

export default async function ChassisPage({
  params,
}: {
  params: Promise<{ locale: string; chassis: string }>;
}) {
  const { locale, chassis: slug } = await params;
  if (!isLocale(locale)) notFound();
  const chassis = getChassis(slug);
  if (!chassis) notFound();

  const copy = t(locale);
  const variants = variantsFor(slug);
  const bodies = relatedBodies(slug);
  const summary = summarizeVariants(variants);
  const fixes = fixBandForVariants(variants);

  const body = copy[bodyLabelKey(bodyOf(chassis))];

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">{body}</p>
            <h1 className="mt-1 font-display text-5xl leading-none sm:text-7xl">{chassis.code}</h1>
            <p className="mt-2 text-base text-[var(--muted)]">
              {chassis.name[locale]} · {chassis.years}
            </p>
            {summary ? (
              <div className="mt-4">
                <FixBand range={fixes} locale={locale} hint />
              </div>
            ) : null}
            {bodies.length > 1 ? (
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">{copy.drivetrainNote}</p>
            ) : null}
          </div>
          <CarPhoto
            chassis={chassis}
            alt={`${chassis.code} ${chassis.name[locale]}`}
            className="h-[10.5rem] w-full shrink-0 rounded-2xl border border-[var(--line)] sm:h-[9.5rem] sm:w-[16rem] lg:h-[11rem] lg:w-[19rem]"
            priority
            tone="card"
            emptyLabel={copy.photoSoon}
            badge={body}
          />
        </div>
        <BodySwitcher locale={locale} current={slug} bodies={bodies} compact />
        {summary ? (
          <div className="grid grid-cols-2 gap-3">
            <FamilyPick
              locale={locale}
              href={`/${locale}/bmw/${slug}/${summary.best.slug}`}
              chassis={chassis}
              variant={summary.best}
              label={copy.bestInFamily}
              tone="good"
              crop="50% 55%"
              emptyLabel={copy.photoSoon}
            />
            <FamilyPick
              locale={locale}
              href={`/${locale}/bmw/${slug}/${summary.worst.slug}`}
              chassis={chassis}
              variant={summary.worst}
              label={copy.worstInFamily}
              tone="bad"
              crop="50% 55%"
              emptyLabel={copy.photoSoon}
            />
          </div>
        ) : null}
      </header>

      <VerdictBlock locale={locale} verdict={chassisVerdict(chassis)} />

      {variants.length > 0 ? (
        <VariantExplorer locale={locale} chassisSlug={slug} variants={variants} />
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--card)] p-6">
          <p className="font-medium">{copy.catalogOnly}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy.coming}</p>
          <p className="mt-3 text-sm">{copy.emptyScore}</p>
        </div>
      )}
    </div>
  );
}

function FamilyPick({
  locale,
  href,
  chassis,
  variant,
  label,
  tone,
  crop,
  emptyLabel,
}: {
  locale: Locale;
  href: string;
  chassis: Chassis;
  variant: VariantBrief;
  label: string;
  tone: "good" | "bad";
  crop: string;
  emptyLabel: string;
}) {
  const copy = t(locale);
  return (
    <Link
      href={href}
      className="tap group relative flex min-h-[11.5rem] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] sm:min-h-[12.5rem]"
    >
      <div className="relative z-10 min-w-0 w-[58%] p-3 pr-2 sm:p-4 sm:pr-3">
        <p
          className={`text-[10px] font-semibold uppercase tracking-wide ${
            tone === "good" ? "text-[var(--good)]" : "text-[var(--bad)]"
          }`}
        >
          {label}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p className="font-mono text-xl font-semibold leading-none tracking-tight sm:text-2xl">
            {variant.year}
          </p>
          <p className="inline-flex max-w-full rounded-lg border border-white/20 bg-[var(--wash)] px-2 py-1 text-sm font-semibold leading-none sm:text-base">
            {variant.model} {variant.engine}
          </p>
        </div>
        <p className="mt-3 font-display text-4xl leading-none">
          <ScoreGlow score={variant.score} locale={locale} />
        </p>
        <div className="mt-2">
          <FixBand range={variant.expectedRepairPln} locale={locale} compact />
        </div>
        <div className="mt-2">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{copy.buy}</p>
          <div className="mt-0.5">
            <Money value={variant.medianBuyPln} locale={locale} />
          </div>
        </div>
      </div>
      <CarPhoto
        chassis={chassis}
        alt={`${variant.year} ${variant.model} ${variant.engine}`}
        className="absolute inset-y-0 right-0 w-[46%]"
        tone="thumb"
        objectPosition={crop}
        emptyLabel={emptyLabel}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[var(--card)] to-transparent sm:w-14" />
      </CarPhoto>
    </Link>
  );
}
