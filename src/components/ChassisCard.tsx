import Link from "next/link";
import type { Chassis } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { chassisSummary, type ListMark } from "@/lib/catalog";
import { bodyLabelKey, bodyOf } from "@/lib/carImage";
import { CarPhoto } from "@/components/CarPhoto";
import { ScoreGlow } from "@/components/ScoreBadge";
import { FixBand } from "@/components/Money";

export function ChassisCard({
  chassis,
  locale,
  marks = [],
}: {
  chassis: Chassis;
  locale: Locale;
  marks?: ListMark[];
}) {
  const copy = t(locale);
  const summary = chassisSummary(chassis.slug);
  const fixes = summary?.fixBand;
  const body = copy[bodyLabelKey(bodyOf(chassis))];
  const split = Boolean(summary && summary.best.slug !== summary.worst.slug);

  return (
    <Link
      href={`/${locale}/bmw/${chassis.slug}`}
      className="group tap block overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] transition active:scale-[0.99]"
    >
      <CarPhoto
        chassis={chassis}
        alt={`${chassis.code} ${chassis.name[locale]}`}
        className="w-full"
        ratio="16 / 10"
        badge={body}
        emptyLabel={copy.photoSoon}
      >
        {marks.length > 0 ? (
          <div className="absolute left-2 top-2 z-10 flex flex-col items-start gap-1">
            {marks.includes("best") ? <MarkPill tone="good">{copy.listBest}</MarkPill> : null}
            {marks.includes("worst") ? <MarkPill tone="bad">{copy.listWorst}</MarkPill> : null}
          </div>
        ) : null}
      </CarPhoto>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-xl font-semibold tracking-tight">{chassis.code}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{chassis.name[locale]}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold tabular-nums tracking-tight text-[var(--ink)]">
                {chassis.years}
              </span>
              <span className="inline-flex h-7 items-center rounded-full border border-[var(--line)] px-2.5 text-xs font-semibold text-[var(--ink)]">
                {body}
              </span>
            </div>
            {summary ? (
              <div className="mt-3">
                <FixBand range={fixes} locale={locale} compact />
              </div>
            ) : null}
          </div>
          {summary ? (
            <div className="flex shrink-0 gap-4">
              <ScoreCol label={copy.cardBest} score={summary.best.score} engine={summary.best.engine} />
              {split ? (
                <ScoreCol label={copy.cardWorst} score={summary.worst.score} engine={summary.worst.engine} />
              ) : null}
            </div>
          ) : (
            <span className="rounded-full bg-[var(--wash)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              {copy.catalogOnly}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ChassisRow({
  chassis,
  locale,
  marks = [],
}: {
  chassis: Chassis;
  locale: Locale;
  marks?: ListMark[];
}) {
  const copy = t(locale);
  const summary = chassisSummary(chassis.slug);
  const fixes = summary?.fixBand;
  const body = copy[bodyLabelKey(bodyOf(chassis))];
  const split = Boolean(summary && summary.best.slug !== summary.worst.slug);

  return (
    <Link
      href={`/${locale}/bmw/${chassis.slug}`}
      className="tap flex min-h-14 items-start justify-between gap-3 border-b border-[var(--line)] px-1 py-3 last:border-0"
    >
      <CarPhoto
        chassis={chassis}
        alt=""
        className="h-12 w-[4.6rem] shrink-0 rounded-lg"
        tone="thumb"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="font-mono text-base font-semibold">{chassis.code}</p>
          {marks.includes("best") ? <MarkPill tone="good">{copy.listBest}</MarkPill> : null}
          {marks.includes("worst") ? <MarkPill tone="bad">{copy.listWorst}</MarkPill> : null}
        </div>
        <p className="mt-0.5 truncate text-sm text-[var(--muted)]">{chassis.name[locale]}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-semibold tabular-nums text-[var(--ink)]">{chassis.years}</span>
          <span className="inline-flex h-6 items-center rounded-full border border-[var(--line)] px-2 text-[11px] font-semibold text-[var(--ink)]">
            {body}
          </span>
        </div>
        {summary ? (
          <div className="mt-1">
            <FixBand range={fixes} locale={locale} compact />
          </div>
        ) : null}
      </div>
      {summary ? (
        <div className="flex shrink-0 gap-3 text-right">
          <ScoreCol compact label={copy.cardBest} score={summary.best.score} engine={summary.best.engine} />
          {split ? (
            <ScoreCol compact label={copy.cardWorst} score={summary.worst.score} engine={summary.worst.engine} />
          ) : null}
        </div>
      ) : (
        <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
          {copy.catalogOnly}
        </span>
      )}
    </Link>
  );
}

function ScoreCol({
  label,
  score,
  engine,
  compact = false,
}: {
  label: string;
  score: number | null;
  engine: string;
  compact?: boolean;
}) {
  return (
    <div className="min-w-[3.25rem] text-right">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
      <p className={`mt-0.5 font-display leading-none tracking-tight ${compact ? "text-lg" : "text-[1.65rem]"}`}>
        <ScoreGlow score={score} />
      </p>
      <p className="mt-1 font-mono text-xs text-[var(--muted)]">{engine}</p>
    </div>
  );
}

function MarkPill({
  tone,
  children,
}: {
  tone: "good" | "bad";
  children: string;
}) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${
        tone === "good" ? "bg-[var(--good)] text-[#04140c]" : "bg-[var(--bad)] text-white"
      }`}
    >
      {children}
    </span>
  );
}
