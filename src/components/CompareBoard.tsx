import type { ReactNode } from "react";
import Link from "next/link";
import type { Chassis, VariantBrief } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { painsForVariant } from "@/lib/catalog";
import { Money, MoneyRange } from "@/components/Money";
import { ScoreGlow, ScoreTrack } from "@/components/ScoreBadge";
import { CarPhoto } from "@/components/CarPhoto";
import { bodyLabelKey, bodyOf } from "@/lib/carImage";
import { variantVerdict } from "@/data/verdicts";
import { tx } from "@/data/loc";
import { compareHref } from "@/lib/compare";

export function CompareBoard({
  locale,
  left,
  right,
}: {
  locale: Locale;
  left: { chassis: Chassis; variant: VariantBrief } | null;
  right: { chassis: Chassis; variant: VariantBrief } | null;
}) {
  const copy = t(locale);
  const aKey = left ? `${left.chassis.slug}/${left.variant.slug}` : undefined;
  const bKey = right ? `${right.chassis.slug}/${right.variant.slug}` : undefined;
  const oneOnly = Boolean(left) !== Boolean(right);

  return (
    <div>
      {oneOnly ? (
        <p className="mb-4 rounded-xl border border-[var(--accent)]/35 bg-[var(--mid-bg)] px-4 py-3 text-sm leading-6 text-[var(--ink)]">
          {copy.compareNeedSecond}
        </p>
      ) : null}

      <div className="relative grid gap-3 md:grid-cols-2">
        <CompareColumn
          locale={locale}
          slot="a"
          entry={left}
          removeHref={compareHref(locale, undefined, bKey)}
        />
        <div className="pointer-events-none absolute left-1/2 top-10 z-10 hidden -translate-x-1/2 md:block">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--paper)] font-mono text-xs font-semibold text-[var(--muted)]">
            {copy.compareVs}
          </span>
        </div>
        <CompareColumn
          locale={locale}
          slot="b"
          entry={right}
          removeHref={compareHref(locale, aKey, undefined)}
        />
      </div>

      {left && right ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <PainCol locale={locale} entry={left} />
          <PainCol locale={locale} entry={right} />
        </div>
      ) : null}

      {left && right ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <VerdictCol locale={locale} entry={left} />
          <VerdictCol locale={locale} entry={right} />
        </div>
      ) : null}
    </div>
  );
}

function CompareColumn({
  locale,
  slot,
  entry,
  removeHref,
}: {
  locale: Locale;
  slot: "a" | "b";
  entry: { chassis: Chassis; variant: VariantBrief } | null;
  removeHref: string;
}) {
  const copy = t(locale);
  if (!entry) {
    const isFirst = slot === "a";
    return (
      <div className="flex min-h-[16rem] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--card)] p-6 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
          {isFirst ? copy.compareSlot1 : copy.compareSlot2}
        </p>
        <p className="mt-3 font-display text-xl tracking-tight text-[var(--ink)]">
          {isFirst ? copy.comparePickFirst : copy.comparePickSecond}
        </p>
        <p className="mt-2 max-w-[16rem] text-sm leading-6 text-[var(--muted)]">{copy.comparePickHint}</p>
        <Link
          href={`/${locale}/bmw`}
          className="tap mt-5 inline-flex h-11 items-center justify-center rounded-full border border-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent)]"
        >
          {copy.compareBrowse}
        </Link>
      </div>
    );
  }

  const { chassis, variant } = entry;
  const body = copy[bodyLabelKey(bodyOf(chassis))];

  return (
    <article className="relative rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            {slot === "a" ? copy.compareSlot1 : copy.compareSlot2}
          </p>
          <p className="mt-1 font-mono text-xs text-[var(--muted)]">{chassis.code}</p>
          <h2 className="mt-1 font-display text-xl tracking-tight">
            {variant.model}
            <span className="mt-0.5 block font-mono text-sm font-medium text-[var(--muted)]">
              {variant.engine} · {variant.year}
            </span>
          </h2>
        </div>
        <Link
          href={removeHref}
          className="tap inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] text-sm text-[var(--muted)]"
          aria-label={copy.compareRemove}
        >
          ×
        </Link>
      </div>

      <CarPhoto
        chassis={chassis}
        alt={`${chassis.code} ${variant.model}`}
        className="mt-3 h-36 w-full rounded-xl"
        tone="card"
        emptyLabel={copy.photoSoon}
        badge={body}
      />

      <p className="mt-4 font-display text-5xl leading-none tracking-tight">
        <ScoreGlow score={variant.score} locale={locale} />
        <span className="ml-1 font-mono text-sm font-medium text-[var(--muted)]">/ 100</span>
      </p>
      <ScoreTrack score={variant.score} />

      <dl className="mt-4 grid gap-2 text-sm">
        <Spec label={copy.engine} value={`${variant.engine}`} />
        <Spec
          label={copy.fuelType}
          value={variant.fuel === "diesel" ? copy.fuelDiesel : copy.fuelPetrol}
        />
        <Spec label={copy.bodyType} value={body} />
        <Spec label={copy.years} value={String(variant.year)} />
      </dl>

      <div className="mt-4 grid gap-3 border-t border-[var(--line)] pt-4">
        <MoneyRow label={copy.buy}>
          <Money value={variant.medianBuyPln} locale={locale} />
        </MoneyRow>
        <MoneyRow label={copy.repair}>
          <MoneyRange range={variant.expectedRepairPln} locale={locale} />
        </MoneyRow>
      </div>

      <Link
        href={`/${locale}/bmw/${chassis.slug}/${variant.slug}`}
        className="mt-4 inline-flex text-sm font-medium text-[var(--accent)] underline underline-offset-2"
      >
        {copy.openBrief}
      </Link>
    </article>
  );
}

function PainCol({
  locale,
  entry,
}: {
  locale: Locale;
  entry: { chassis: Chassis; variant: VariantBrief };
}) {
  const copy = t(locale);
  const pains = painsForVariant(entry.variant).slice(0, 2);
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">{copy.jumpFaults}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {pains.length === 0 ? (
          <li className="text-sm text-[var(--muted)]">—</li>
        ) : (
          pains.map((pain) => (
            <li key={pain.id} className="text-sm leading-5">
              <span className="font-medium">{pain.title[locale]}</span>
              <span className="mt-0.5 block text-xs text-[var(--muted)]">{pain.summary[locale]}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function VerdictCol({
  locale,
  entry,
}: {
  locale: Locale;
  entry: { chassis: Chassis; variant: VariantBrief };
}) {
  const copy = t(locale);
  const body = copy[bodyLabelKey(bodyOf(entry.chassis))];
  const verdict = variantVerdict(entry.variant, entry.chassis, body);
  const tone =
    entry.variant.score == null
      ? "mid"
      : entry.variant.score >= 75
        ? "good"
        : entry.variant.score >= 50
          ? "mid"
          : "bad";
  const box =
    tone === "good"
      ? "bg-[var(--good-bg)] text-[var(--good)]"
      : tone === "bad"
        ? "bg-[var(--bad-bg)] text-[var(--bad)]"
        : "bg-[var(--mid-bg)] text-[var(--mid)]";

  return (
    <div className={`rounded-2xl px-4 py-3 ${box}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide">{copy.verdict}</p>
      <p className="mt-1 text-sm leading-6 text-[var(--ink)]">{tx(verdict.summary, locale)}</p>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}

function MoneyRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
