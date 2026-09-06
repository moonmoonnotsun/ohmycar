import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { chassisList, getChassis } from "@/data/chassis";
import { getVariant, painsForVariant, relatedBodies, variantsFor } from "@/lib/catalog";
import { isLocale, locales } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { Money, MoneyRange } from "@/components/Money";
import { SCORE_WEIGHTS, scoreBreakdown } from "@/lib/score";
import { ScoreGlow, ScoreTrack } from "@/components/ScoreBadge";
import { BuyBar, MarketLinks, PainCard } from "@/components/Briefing";
import { BodySwitcher } from "@/components/BodySwitcher";
import { CarPhoto } from "@/components/CarPhoto";
import { VerdictBlock } from "@/components/VerdictBlock";
import { variantVerdict } from "@/data/verdicts";
import { bodyLabelKey, bodyOf } from "@/lib/carImage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; chassis: string; variant: string }>;
}): Promise<Metadata> {
  const { locale, chassis: slug, variant: variantSlug } = await params;
  if (!isLocale(locale)) return {};
  const chassis = getChassis(slug);
  const variant = getVariant(slug, variantSlug);
  if (!chassis || !variant) return {};
  return {
    title: `${chassis.code} ${variant.model} ${variant.engine} ${variant.year}`,
  };
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    chassisList.flatMap((chassis) =>
      variantsFor(chassis.slug).map((variant) => ({
        locale,
        chassis: chassis.slug,
        variant: variant.slug,
      })),
    ),
  );
}

export default async function VariantPage({
  params,
}: {
  params: Promise<{ locale: string; chassis: string; variant: string }>;
}) {
  const { locale, chassis: slug, variant: variantSlug } = await params;
  if (!isLocale(locale)) notFound();
  const chassis = getChassis(slug);
  const variant = getVariant(slug, variantSlug);
  if (!chassis || !variant) notFound();

  const copy = t(locale);
  const pains = painsForVariant(variant);
  const breakdown = scoreBreakdown(variant.inputs);
  const siblings = variantsFor(slug)
    .filter((item) => item.model === variant.model && item.engine === variant.engine)
    .sort((a, b) => a.year - b.year);
  const bodies = relatedBodies(slug);
  const body = copy[bodyLabelKey(bodyOf(chassis))];

  return (
    <div className="flex flex-col gap-7 pb-8 md:pb-0">
      <header className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:items-start">
        <div className="lg:col-start-2">
          <h1 className="font-display text-[2.1rem] leading-[1.05] tracking-tight sm:text-5xl">
            {variant.model}
            <span className="mt-1 block font-mono text-base font-medium tracking-normal text-[var(--muted)] sm:mt-0 sm:inline sm:ml-3">
              {variant.engine} · {variant.year} · {body}
            </span>
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {variant.fuel === "diesel" ? copy.fuelDiesel : copy.fuelPetrol} · {copy.hypothesis}
          </p>
          {siblings.length > 1 ? (
            <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
              {siblings.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${locale}/bmw/${slug}/${item.slug}`}
                  className={`h-tap inline-flex items-center rounded-full border px-4 text-sm tabular-nums ${
                    item.slug === variant.slug
                      ? "border-[var(--accent)] bg-[var(--card)] text-[var(--ink)]"
                      : "border-[var(--line)] bg-[var(--card)]"
                  }`}
                >
                  {item.year}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <CarPhoto
          chassis={chassis}
          alt={`${chassis.code} ${variant.model}`}
          className="h-40 w-full rounded-2xl border border-[var(--line)] lg:col-start-1 lg:row-start-1 lg:h-full lg:min-h-[10.5rem] lg:max-h-[13.5rem]"
          priority
          tone="card"
          emptyLabel={copy.photoSoon}
          badge={body}
        />
      </header>

      <BodySwitcher locale={locale} current={slug} bodies={bodies} compact from={variant} />

      <section>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">{copy.score}</p>
        <p className="mt-1 font-display text-[5.5rem] leading-none tracking-tight sm:text-8xl">
          <ScoreGlow score={variant.score} />
        </p>
        <ScoreTrack score={variant.score} />
        <p className="mt-3 text-xs text-[var(--muted)]">{copy.threeNumbers}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat label={copy.buy}>
            <Money value={variant.medianBuyPln} locale={locale} />
          </Stat>
          <Stat label={copy.repair}>
            <MoneyRange range={variant.expectedRepairPln} locale={locale} />
          </Stat>
        </div>
      </section>

      <VerdictBlock locale={locale} verdict={variantVerdict(variant, chassis, body)} />

      <section id="faults">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">{copy.jumpFaults}</h2>
        <div className="mt-3 flex flex-col gap-3">
          {pains.map((pain, i) => (
            <PainCard key={pain.id} locale={locale} pain={pain} featured={i === 0} />
          ))}
        </div>
      </section>

      <details className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
        <summary className="cursor-pointer text-sm font-semibold">{copy.formulaOpen}</summary>
        <dl className="mt-3 grid gap-1 text-sm">
          <Row label={`${copy.cat} (${SCORE_WEIGHTS.catastrophe}%)`} value={`−${breakdown.catastrophe.toFixed(1)}`} />
          <Row label={`${copy.fix} (${SCORE_WEIGHTS.fiveYearFix}%)`} value={`−${breakdown.fiveYearFix.toFixed(1)}`} />
          <Row label={`${copy.load} (${SCORE_WEIGHTS.painLoad}%)`} value={`−${breakdown.painLoad.toFixed(1)}`} />
          <Row label={`${copy.campaigns} (${SCORE_WEIGHTS.campaigns}%)`} value={`−${breakdown.campaigns.toFixed(1)}`} />
          <Row label={`${copy.parts} (${SCORE_WEIGHTS.partsReality}%)`} value={`−${breakdown.partsGap.toFixed(1)}`} />
        </dl>
        <Link href={`/${locale}/score`} className="mt-3 inline-block text-sm underline underline-offset-2">
          {copy.scoreMethod}
        </Link>
      </details>

      <MarketLinks locale={locale} chassis={chassis} variant={variant} />

      <BuyBar locale={locale} chassis={chassis} variant={variant} />
    </div>
  );
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3">
      <p className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <div className="mt-1 text-sm font-semibold tabular-nums sm:text-base">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[var(--line)] py-2 last:border-0">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
