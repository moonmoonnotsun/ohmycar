import Link from "next/link";
import type { VariantBrief } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getChassis } from "@/data/chassis";
import { getPain } from "@/lib/catalog";
import { ScoreGlow } from "@/components/ScoreBadge";
import { scoreTone } from "@/lib/score";
import { CarPhoto } from "@/components/CarPhoto";
import { FaultHint } from "@/components/FaultExplain";

export function ComparePair({
  locale,
  chassisSlug,
  left,
  right,
}: {
  locale: Locale;
  chassisSlug: string;
  left: VariantBrief;
  right: VariantBrief;
}) {
  const copy = t(locale);
  const chassis = getChassis(chassisSlug);
  return (
    <section>
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">{copy.sameBadge}</p>
      <div className="mt-3 overflow-hidden rounded-3xl border border-white/8 bg-[var(--card)]">
        {chassis ? (
          <CarPhoto
            chassis={chassis}
            alt={chassis.name[locale]}
            className="h-36 w-full sm:h-40"
            tone="card"
            badge={chassis.code}
            emptyLabel={copy.photoSoon}
          />
        ) : null}
        <div className="grid grid-cols-2">
          <CompareHalf locale={locale} chassisSlug={chassisSlug} variant={left} label={copy.bestInFamily} />
          <CompareHalf locale={locale} chassisSlug={chassisSlug} variant={right} label={copy.avoid} edge />
        </div>
      </div>
    </section>
  );
}

function CompareHalf({
  locale,
  chassisSlug,
  variant,
  label,
  edge,
}: {
  locale: Locale;
  chassisSlug: string;
  variant: VariantBrief;
  label: string;
  edge?: boolean;
}) {
  const pain = getPain(variant.topPainId);
  const tone = scoreTone(variant.score);
  const labelColor = tone === "bad" ? "text-[var(--bad)]" : tone === "good" ? "text-[var(--good)]" : "text-[var(--mid)]";
  return (
    <div className={`relative ${edge ? "border-l border-white/8" : ""}`}>
      <Link href={`/${locale}/bmw/${chassisSlug}/${variant.slug}`} className="tap block p-4 sm:p-6">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${labelColor}`}>{label}</p>
        <p className="mt-3 font-display text-[3.4rem] leading-none sm:text-7xl">
          <ScoreGlow score={variant.score} className="tracking-tight" />
        </p>
        <p className="mt-4 text-sm font-semibold">
          {variant.year} {variant.model}
        </p>
        <p className="font-mono text-xs text-[var(--muted)]">{variant.engine}</p>
        <p className="mt-2 line-clamp-2 pr-8 text-xs leading-5 text-[var(--muted)]">
          {pain ? pain.title[locale] : "—"}
        </p>
      </Link>
      {pain ? (
        <div className="absolute right-3 bottom-3 z-10">
          <FaultHint locale={locale} pain={pain} showTitle={false} />
        </div>
      ) : null}
    </div>
  );
}
