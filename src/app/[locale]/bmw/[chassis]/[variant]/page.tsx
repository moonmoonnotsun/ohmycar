import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { chassisList, getChassis } from "@/data/chassis";
import { getVariant, painsForVariant, relatedBodies, variantsFor } from "@/lib/catalog";
import { isLocale, locales } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { Money, MoneyRange } from "@/components/Money";
import { scoreBreakdown } from "@/lib/score";
import { ScoreGlow, ScoreTrack } from "@/components/ScoreBadge";
import { BuyBar, MarketLinks, PainCard } from "@/components/Briefing";
import { BodySwitcher } from "@/components/BodySwitcher";
import { CarPhoto } from "@/components/CarPhoto";
import { VerdictBlock } from "@/components/VerdictBlock";
import { VariantSwitcher } from "@/components/VariantSwitcher";
import { CompareAddButton } from "@/components/CompareAddButton";
import { SpecIcon, type SpecIconKey } from "@/components/SpecIcons";
import { HintTip } from "@/components/HintTip";
import { variantVerdict } from "@/data/verdicts";
import { bodyLabelKey, bodyOf } from "@/lib/carImage";

const panel = "rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4";

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
  const statusLabel =
    variant.scoreStatus === "evidence_derived"
      ? copy.scoreEvidence
      : variant.scoreStatus === "signed"
        ? copy.signed
        : copy.scoreInsufficient;
  const bodies = relatedBodies(slug);
  const body = copy[bodyLabelKey(bodyOf(chassis))];

  return (
    <div className="flex flex-col gap-4 pb-8 md:pb-0">
      <section className={panel}>
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:items-start lg:gap-6">
          <div className="flex flex-col gap-4">
            <CarPhoto
              chassis={chassis}
              alt={`${chassis.code} ${variant.model}`}
              className="h-44 w-full rounded-xl border border-[var(--line)] lg:h-full lg:min-h-[12rem] lg:max-h-[14rem]"
              priority
              tone="card"
              emptyLabel={copy.photoSoon}
              badge={chassis.code}
            />
            <CompareAddButton locale={locale} chassisSlug={slug} variantSlug={variant.slug} />
          </div>
          <div className="min-w-0">
            <div className="min-w-0">
              <h1 className="font-display text-[2rem] leading-[1.05] tracking-tight sm:text-4xl">
                {chassis.name[locale]}
                <span className="text-[var(--muted)]"> ({chassis.code})</span>
              </h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {chassis.years}
                <span className="mx-1.5 text-[var(--line)]" aria-hidden>
                  ·
                </span>
                {body}
              </p>
              <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                <span className="text-[1.35rem] font-semibold tracking-tight text-[var(--ink)] tabular-nums sm:text-[1.5rem]">
                  {variant.year}
                </span>
                <span className="inline-flex h-8 items-center rounded-full border border-[var(--line)] bg-[var(--wash)] px-3 text-sm font-medium text-[var(--ink)]">
                  {variant.model} {variant.engine}
                </span>
              </div>
              <p className="mt-2.5 text-sm leading-6 text-[var(--muted)]">{statusLabel}</p>
            </div>
            <div className="mt-5">
              <VariantSwitcher locale={locale} chassisSlug={slug} variant={variant} />
            </div>
          </div>
        </div>
        {bodies.length > 1 ? (
          <div className="mt-5 border-t border-[var(--line)] pt-4">
            <BodySwitcher locale={locale} current={slug} bodies={bodies} compact from={variant} />
          </div>
        ) : null}
      </section>

      <section className="grid gap-3 lg:grid-cols-3 lg:items-stretch">
        <div className={panel}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">{copy.score}</p>
            <HintTip text={copy.threeNumbers} label={copy.score} />
          </div>
          <p className="mt-2 font-display text-[3.5rem] leading-none tracking-tight sm:text-[4rem]">
            <ScoreGlow score={variant.score} locale={locale} />
            <span className="ml-1 align-baseline font-mono text-sm font-medium text-[var(--muted)]">/ 100</span>
          </p>
          <ScoreTrack score={variant.score} />
        </div>

        <div className={panel}>
          <dl>
            <SpecRow icon="engine" label={copy.engine} value={variant.engine} />
            <SpecRow
              icon="fuel"
              label={copy.fuelType}
              value={variant.fuel === "diesel" ? copy.fuelDiesel : copy.fuelPetrol}
            />
            <SpecRow icon="body" label={copy.bodyType} value={body} />
            <SpecRow icon="year" label={copy.years} value={String(variant.year)} last />
          </dl>
        </div>

        <div className={panel}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              {copy.typicalCosts}
            </p>
            <HintTip text={copy.repairHint} label={copy.typicalCosts} />
          </div>
          <div className="mt-3">
            <Money value={variant.medianBuyPln} locale={locale} size="lg" />
            <p className="mt-1.5 text-sm text-[var(--muted)]">{copy.buy}</p>
          </div>
          <div className="mt-3 border-t border-[var(--line)] pt-3">
            <MoneyRange range={variant.expectedRepairPln} locale={locale} size="lg" />
            <p className="mt-1.5 text-sm text-[var(--muted)]">{copy.repair}</p>
          </div>
        </div>
      </section>

      <VerdictBlock locale={locale} verdict={variantVerdict(variant, chassis, body)} status={variant.scoreStatus} />

      <section id="faults" className={panel}>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">{copy.jumpFaults}</h2>
        <div className="mt-4 flex flex-col gap-3">
          {pains.map((pain, i) => (
            <PainCard
              key={pain.id}
              locale={locale}
              pain={pain}
              chassis={chassis}
              variant={variant}
              featured={i === 0}
            />
          ))}
        </div>
      </section>

      {variant.inputs ? (
        <details className={panel}>
          <summary className="cursor-pointer text-sm font-semibold">{copy.formulaOpen}</summary>
          <p className="mt-2 text-xs text-[var(--muted)]">{copy.scoreEvidence}</p>
          <dl className="mt-3 grid gap-1 text-sm">
            <Row label={copy.cat} value={`−${breakdown.catastrophe.toFixed(1)}`} />
            {variant.inputs.expectedFix5yPln != null ? (
              <Row label={copy.fix} value={`−${breakdown.fiveYearFix.toFixed(1)}`} />
            ) : (
              <Row label={copy.fix} value={copy.plnPending} />
            )}
            <Row label={copy.load} value={`−${breakdown.painLoad.toFixed(1)}`} />
            <Row label={copy.campaigns} value={`−${breakdown.campaigns.toFixed(1)}`} />
            {variant.inputs.partsReality != null ? (
              <Row label={copy.parts} value={`−${breakdown.partsGap.toFixed(1)}`} />
            ) : (
              <Row label={copy.parts} value={copy.plnPending} />
            )}
          </dl>
          <Link href={`/${locale}/score`} className="mt-3 inline-block text-sm underline underline-offset-2">
            {copy.scoreMethod}
          </Link>
        </details>
      ) : null}

      <MarketLinks locale={locale} chassis={chassis} variant={variant} />

      <BuyBar locale={locale} chassis={chassis} variant={variant} />
    </div>
  );
}

function SpecRow({
  icon,
  label,
  value,
  last,
}: {
  icon: SpecIconKey;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 py-2.5 ${last ? "" : "border-b border-[var(--line)]"}`}
    >
      <SpecIcon name={icon} className="size-[1.15rem] shrink-0 text-[var(--accent)]" />
      <dt className="min-w-0 flex-1 text-sm text-[var(--muted)]">{label}</dt>
      <dd className="shrink-0 text-sm font-semibold tabular-nums text-[var(--ink)]">{value}</dd>
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
