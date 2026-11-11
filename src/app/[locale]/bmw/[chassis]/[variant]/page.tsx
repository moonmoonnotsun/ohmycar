import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { chassisList, getChassis } from "@/data/chassis";
import { getVariant, painsForVariant, relatedBodies, variantsFor } from "@/lib/catalog";
import { isLocale, locales } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { Money, MoneyRange } from "@/components/Money";
import { scoreBreakdown } from "@/lib/score";
import { ScoreGlow, ScoreWordLabel } from "@/components/ScoreBadge";
import { BuyBar, MarketLinks } from "@/components/Briefing";
import { PainPreview } from "@/components/PainPreview";
import { BodySwitcher } from "@/components/BodySwitcher";
import { CarPhoto } from "@/components/CarPhoto";
import { VerdictCallout, VerdictProsCons } from "@/components/VerdictBlock";
import { VariantSwitcher } from "@/components/VariantSwitcher";
import { CompareAddButton } from "@/components/CompareAddButton";
import { SpecIcon, type SpecIconKey } from "@/components/SpecIcons";
import { HintTip } from "@/components/HintTip";
import { StanceChip } from "@/components/StanceChip";
import { EngineGlance } from "@/components/EngineGlance";
import { GroupTitle } from "@/components/GroupTitle";
import { variantVerdict } from "@/data/verdicts";
import { bodyLabelKey, bodyOf } from "@/lib/carImage";

const panel = "rounded-2xl border-2 border-[var(--line)] bg-[var(--card)] p-3.5 sm:p-4";

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
  const bodies = relatedBodies(slug);
  const body = copy[bodyLabelKey(bodyOf(chassis))];
  const verdict = variantVerdict(variant, chassis, body);

  return (
    <div className="flex flex-col gap-3 pb-28 sm:gap-4 md:pb-0">
      <section className={panel}>
        <div className="flex flex-col gap-3 sm:gap-5 lg:grid lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:items-start lg:gap-x-6">
          <div className="flex flex-col gap-2.5 sm:gap-3">
            <CarPhoto
              chassis={chassis}
              alt={`${chassis.code} ${variant.model}`}
              className="h-36 w-full rounded-xl border border-[var(--line)] sm:h-44 lg:h-full lg:min-h-[12rem] lg:max-h-[14rem]"
              priority
              tone="card"
              emptyLabel={copy.photoSoon}
              badge={chassis.code}
            />
            <CompareAddButton locale={locale} chassisSlug={slug} variantSlug={variant.slug} />
          </div>

          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="font-display text-[1.85rem] font-bold leading-[1.1] tracking-tight sm:text-[2.35rem]">
                  {chassis.name[locale]}
                  <span className="font-bold text-[var(--muted)]"> ({chassis.code})</span>
                </h1>
                <p className="mt-1 text-xs text-[var(--muted)] sm:mt-2 sm:text-sm">
                  {chassis.years}
                  <span className="mx-1.5 text-[var(--line)]" aria-hidden>
                    ·
                  </span>
                  {body}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-3.5 sm:gap-2.5">
                  <span className="text-lg font-semibold tracking-tight text-[var(--ink)] tabular-nums sm:text-[1.5rem]">
                    {variant.year}
                  </span>
                  <span className="inline-flex h-7 items-center rounded-full border border-[var(--line)] bg-[var(--wash)] px-2.5 text-xs font-medium text-[var(--ink)] sm:h-8 sm:px-3 sm:text-sm">
                    {variant.model} {variant.engine}
                  </span>
                </div>
              </div>
              <StanceChip locale={locale} score={variant.score} variant="tag" className="mt-0.5" />
            </div>
            <div className="mt-3.5 sm:mt-5">
              <VariantSwitcher locale={locale} chassisSlug={slug} variant={variant} />
            </div>
          </div>
        </div>

        <div className="mt-3.5 grid gap-3 border-t border-[var(--line)] pt-3.5 sm:mt-5 sm:grid-cols-2 sm:items-stretch sm:gap-4 sm:pt-4 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-6">
          <div className="flex h-full flex-col rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2.5 sm:px-3.5 sm:py-3">
            <div className="flex items-center gap-1">
              <p className="text-[12px] font-semibold text-[var(--muted)]">{copy.score}</p>
              <HintTip text={copy.threeNumbers} label={copy.score} />
            </div>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <p className="font-display text-[2.6rem] leading-none tracking-tight tabular-nums sm:text-[3rem]">
                <ScoreGlow
                  score={variant.score}
                  locale={locale}
                  className="!rounded-lg !px-2.5 !py-1 sm:!rounded-lg sm:!px-3 sm:!py-1.5"
                />
                <span className="ml-1.5 align-baseline font-mono text-sm font-medium text-[var(--muted)]">
                  / 100
                </span>
              </p>
              <ScoreWordLabel score={variant.score} locale={locale} className="text-sm" />
            </div>
            <Link
              href={`/${locale}/score`}
              className="mt-auto pt-2 inline-block text-[11px] text-[var(--muted)] underline underline-offset-2 hover:text-[var(--ink)]"
            >
              {copy.scoreMethod}
            </Link>
          </div>

          {bodies.length > 1 ? (
            <div className="flex h-full min-w-0 flex-col justify-center">
              <BodySwitcher locale={locale} current={slug} bodies={bodies} compact from={variant} />
            </div>
          ) : null}
        </div>
      </section>

      <VerdictCallout
        locale={locale}
        verdict={verdict}
        score={variant.score}
        status={variant.scoreStatus}
        title={`${variant.year} ${variant.model} ${variant.engine}`}
        meta={`${chassis.code} · ${body} · ${
          variant.fuel === "diesel" ? copy.fuelDiesel : copy.fuelPetrol
        }`}
      />

      <section className="grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:items-stretch">
        <div className={panel}>
          <GroupTitle as="h2">{copy.engine}</GroupTitle>
          <dl className="mt-1 border-t border-[var(--line)] pt-3 sm:pt-4">
            <SpecRow icon="engine" label={copy.engine} value={variant.engine} />
            <SpecRow
              icon="fuel"
              label={copy.fuelType}
              value={variant.fuel === "diesel" ? copy.fuelDiesel : copy.fuelPetrol}
            />
            <SpecRow icon="body" label={copy.bodyType} value={body} />
            <SpecRow icon="year" label={copy.year} value={String(variant.year)} last />
          </dl>
        </div>

        <div className={panel}>
          <div className="flex items-center justify-between gap-2">
            <GroupTitle as="h2">{copy.typicalCosts}</GroupTitle>
            <HintTip text={copy.repairHint} label={copy.typicalCosts} />
          </div>
          <div className="mt-1 border-t border-[var(--line)] pt-3 sm:pt-4">
            <div>
              <Money value={variant.medianBuyPln} locale={locale} size="lg" />
              <p className="mt-1 text-xs text-[var(--muted)] sm:mt-1.5 sm:text-sm">{copy.buy}</p>
            </div>
            <div className="mt-2.5 border-t border-[var(--line)] pt-2.5 sm:mt-3 sm:pt-3">
              <MoneyRange range={variant.expectedRepairPln} locale={locale} size="lg" />
              <p className="mt-1 text-xs text-[var(--muted)] sm:mt-1.5 sm:text-sm">{copy.repair}</p>
            </div>
          </div>
        </div>
      </section>

      <VerdictProsCons locale={locale} verdict={verdict} />

      <section id="faults" className={panel}>
        <GroupTitle>{copy.jumpFaults}</GroupTitle>
        <div className="mt-1 flex flex-col gap-2 border-t border-[var(--line)] pt-3 sm:mt-1.5 sm:gap-2.5 sm:pt-4">
          {pains.map((pain) => (
            <PainPreview
              key={pain.id}
              locale={locale}
              pain={pain}
              chassis={chassis}
              variant={variant}
            />
          ))}
        </div>
      </section>

      <EngineGlance
        locale={locale}
        chassisSlug={slug}
        chassisCode={chassis.code}
        variants={variantsFor(slug)}
        excludeEngine={variant.engine}
      />

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
      className={`flex items-center gap-2.5 py-2 sm:gap-3 sm:py-2.5 ${last ? "" : "border-b border-[var(--line)]"}`}
    >
      <SpecIcon name={icon} className="size-4 shrink-0 text-[var(--ink)] sm:size-[1.15rem]" />
      <dt className="min-w-0 flex-1 text-xs text-[var(--muted)] sm:text-sm">{label}</dt>
      <dd className="shrink-0 text-xs font-semibold tabular-nums text-[var(--ink)] sm:text-sm">{value}</dd>
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
