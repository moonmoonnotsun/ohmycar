import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";
import type { VariantBrief } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getChassis } from "@/data/chassis";
import { engineYearSpan, getPain } from "@/lib/catalog";
import { CarPhoto } from "@/components/CarPhoto";

export function ComparePair({
  locale,
  chassisSlug,
  left,
  right,
  analysisHref,
  compareHref,
}: {
  locale: Locale;
  chassisSlug: string;
  left: VariantBrief;
  right: VariantBrief;
  analysisHref: string;
  compareHref: string;
}) {
  const copy = t(locale);
  const chassis = getChassis(chassisSlug);
  const bestSpan = engineYearSpan(chassisSlug, left.model, left.engine);
  const bestYearsLabel = bestSpan
    ? bestSpan[0] === bestSpan[1]
      ? String(bestSpan[0])
      : `${bestSpan[0]} – ${bestSpan[1]}`
    : chassis?.years;
  const cardTitle = chassis
    ? seriesCardTitle(chassis.family, chassis.code, chassis.name[locale])
    : chassisSlug.toUpperCase();

  return (
    <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
          {copy.sameBadgeEyebrow}
        </p>
        <h2 className="mt-3 font-display text-[2.25rem] leading-[1.05] tracking-tight text-[var(--ink)] sm:text-[2.85rem]">
          {copy.sameBadge}
        </h2>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)] sm:text-[0.95rem] sm:leading-7">
          {copy.sameBadgeLead}
        </p>
        <Link
          href={compareHref}
          className="tap mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent)]"
        >
          {copy.compareThese}
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="min-w-0 rounded-2xl border border-[var(--line)] bg-[var(--card)]">
        <div className="grid md:grid-cols-2 md:items-stretch">
          <div className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-t-2xl md:aspect-auto md:min-h-[22rem] md:rounded-l-2xl md:rounded-tr-none">
            {chassis ? (
              <CarPhoto
                chassis={chassis}
                alt={chassis.name[locale]}
                className="absolute inset-0 size-full rounded-none border-0"
                tone="card"
                badge={chassis.code}
                emptyLabel={copy.photoSoon}
                objectPosition="40% 55%"
              />
            ) : (
              <div className="absolute inset-0 bg-[var(--wash)]" />
            )}
          </div>

          <div className="flex min-w-0 flex-col border-t border-[var(--line)] p-4 pb-5 md:border-l md:border-t-0 md:p-5 md:pb-5">
            <div className="flex items-start gap-3">
              <BmwMark />
              <div className="min-w-0">
                <p className="text-base font-semibold tracking-tight text-[var(--ink)]">{cardTitle}</p>
                {chassis ? (
                  <p className="mt-0.5 text-sm text-[var(--muted)]">{chassis.years.replaceAll("–", " – ")}</p>
                ) : null}
              </div>
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              {copy.engineMatters}
            </p>

            <div className="mt-2.5 flex flex-col gap-2">
              <EngineRow locale={locale} chassisSlug={chassisSlug} variant={left} role="best" />
              <EngineRow locale={locale} chassisSlug={chassisSlug} variant={right} role="worst" />
            </div>

            {bestYearsLabel ? (
              <Link
                href={`/${locale}/bmw/${chassisSlug}/${left.slug}`}
                className="group mt-3 flex items-center gap-3 border-t border-[var(--line)] pt-3"
              >
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--wash)] text-[var(--muted)] transition-colors group-hover:border-white/20 group-hover:text-[var(--ink)]">
                  <CalendarDays className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    {copy.bestYears}
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold text-[var(--ink)]">{bestYearsLabel}</span>
                </span>
                <ChevronRight
                  className="size-4 shrink-0 text-[var(--muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--ink)]"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </Link>
            ) : null}

            <div className="mt-5">
              <Link
                href={analysisHref}
                className="tap inline-flex h-10 items-center text-sm font-medium text-[var(--muted)] underline underline-offset-2"
              >
                {copy.openAnalysis}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EngineRow({
  locale,
  chassisSlug,
  variant,
  role,
}: {
  locale: Locale;
  chassisSlug: string;
  variant: VariantBrief;
  role: "best" | "worst";
}) {
  const copy = t(locale);
  const pain = getPain(variant.topPainId);
  const isBest = role === "best";
  const dot = isBest ? "bg-[var(--good)]" : "bg-[var(--bad)]";
  const scoreBg = isBest ? "bg-[var(--good)]" : "bg-[var(--bad)]";
  const sub = pain?.title[locale] ?? (variant.fuel === "diesel" ? copy.fuelDiesel : copy.fuelPetrol);

  return (
    <Link
      href={`/${locale}/bmw/${chassisSlug}/${variant.slug}`}
      className="tap flex items-center gap-2.5 rounded-xl bg-white/[0.04] px-2.5 py-2.5 sm:gap-3 sm:px-3"
    >
      <span className={`size-2.5 shrink-0 rounded-full ${dot}`} aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-[var(--ink)]">
          {variant.model} {variant.engine}
        </span>
        <span className="mt-0.5 block truncate text-xs text-[var(--muted)]">{sub}</span>
      </span>
      <span
        className={`inline-flex min-w-[2.85rem] shrink-0 items-center justify-center rounded-md px-2 py-1 font-mono text-[13px] font-bold tabular-nums text-[#0a0b0f] ${scoreBg}`}
      >
        {variant.score != null ? variant.score.toFixed(1) : copy.scorePendingShort}
      </span>
    </Link>
  );
}

function seriesCardTitle(family: string, code: string, fullName: string) {
  if (family === "3" || family === "4" || family === "5" || family === "1" || family === "2") {
    return `${family} Series (${code})`;
  }
  if (family === "x") return `${fullName.split(" ")[0] ?? "X"} (${code})`;
  return code;
}

function BmwMark() {
  return (
    <svg viewBox="0 0 32 32" className="mt-0.5 size-8 shrink-0" aria-hidden>
      <circle cx="16" cy="16" r="15" fill="#0c0e14" stroke="#9aa1ad" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="11.5" fill="#f4f5f7" />
      <path d="M16 16 L16 4.5 A11.5 11.5 0 0 1 27.5 16 Z" fill="#1c69d4" />
      <path d="M16 16 L16 27.5 A11.5 11.5 0 0 1 4.5 16 Z" fill="#1c69d4" />
      <circle cx="16" cy="16" r="11.5" fill="none" stroke="#0c0e14" strokeWidth="0.7" />
    </svg>
  );
}
