import type { ReactNode } from "react";
import Link from "next/link";
import type { Chassis, Pain, VariantBrief } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { painsForVariant } from "@/lib/catalog";
import { Money, MoneyRange } from "@/components/Money";
import { ScoreGlow, ScoreTrack } from "@/components/ScoreBadge";
import { CarPhoto } from "@/components/CarPhoto";
import { bodyLabelKey, bodyOf, carPhotoSrc } from "@/lib/carImage";
import { variantVerdict } from "@/data/verdicts";
import { tx } from "@/data/loc";
import { compareHref } from "@/lib/compare";

type Entry = { chassis: Chassis; variant: VariantBrief };

/**
 * Mobile: 2-column comparison matrix with sticky headers (NN/g, Baymard, Foolproof).
 * Desktop: side-by-side cards with VS badge.
 */
export function CompareBoard({
  locale,
  left,
  right,
}: {
  locale: Locale;
  left: Entry | null;
  right: Entry | null;
}) {
  const copy = t(locale);
  const aKey = left ? `${left.chassis.slug}/${left.variant.slug}` : undefined;
  const bKey = right ? `${right.chassis.slug}/${right.variant.slug}` : undefined;
  const oneOnly = Boolean(left) !== Boolean(right);
  const both = Boolean(left && right);

  return (
    <div>
      {oneOnly ? (
        <p className="mb-3 rounded-xl border border-[var(--accent)]/35 bg-[var(--mid-bg)] px-3 py-2.5 text-sm leading-5 text-[var(--ink)] sm:mb-4 sm:px-4 sm:py-3 sm:leading-6">
          {copy.compareNeedSecond}
        </p>
      ) : null}

      {/* Mobile matrix — true side-by-side */}
      <div className="md:hidden">
        <CompareMatrix
          locale={locale}
          left={left}
          right={right}
          removeLeftHref={compareHref(locale, undefined, bKey)}
          removeRightHref={compareHref(locale, aKey, undefined)}
        />
        {both && left && right ? (
          <>
            <MatrixSection title={copy.jumpFaults}>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)]">
                <PainCell locale={locale} entry={left} />
                <PainCell locale={locale} entry={right} />
              </div>
            </MatrixSection>
            <MatrixSection title={copy.verdict}>
              <div className="grid grid-cols-2 gap-2">
                <VerdictCell locale={locale} entry={left} />
                <VerdictCell locale={locale} entry={right} />
              </div>
            </MatrixSection>
          </>
        ) : null}
      </div>

      {/* Desktop cards */}
      <div className="relative hidden gap-3 md:grid md:grid-cols-2">
        <CompareColumn
          locale={locale}
          slot="a"
          entry={left}
          removeHref={compareHref(locale, undefined, bKey)}
        />
        <div className="pointer-events-none absolute left-1/2 top-10 z-10 -translate-x-1/2">
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

      {both && left && right ? (
        <div className="mt-6 hidden gap-3 md:grid md:grid-cols-2">
          <PainCol locale={locale} entry={left} />
          <PainCol locale={locale} entry={right} />
        </div>
      ) : null}

      {both && left && right ? (
        <div className="mt-6 hidden gap-3 md:grid md:grid-cols-2">
          <VerdictCol locale={locale} entry={left} />
          <VerdictCol locale={locale} entry={right} />
        </div>
      ) : null}
    </div>
  );
}

function CompareMatrix({
  locale,
  left,
  right,
  removeLeftHref,
  removeRightHref,
}: {
  locale: Locale;
  left: Entry | null;
  right: Entry | null;
  removeLeftHref: string;
  removeRightHref: string;
}) {
  const copy = t(locale);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)]">
      <div className="grid grid-cols-2 border-b border-[var(--line)]">
        <MatrixHead
          locale={locale}
          slot="a"
          entry={left}
          removeHref={removeLeftHref}
        />
        <MatrixHead
          locale={locale}
          slot="b"
          entry={right}
          removeHref={removeRightHref}
          edge
        />
      </div>

      <div className="grid grid-cols-2 border-b border-[var(--line)]">
        <MatrixPhoto entry={left} />
        <MatrixPhoto entry={right} edge />
      </div>

      <div className="grid grid-cols-2 border-b border-[var(--line)]">
        <MatrixScore locale={locale} entry={left} />
        <MatrixScore locale={locale} entry={right} edge />
      </div>

      <AttrRow
        label={copy.engine}
        left={left ? left.variant.engine : "—"}
        right={right ? right.variant.engine : "—"}
      />
      <AttrRow
        label={copy.fuelType}
        left={
          left ? (left.variant.fuel === "diesel" ? copy.fuelDiesel : copy.fuelPetrol) : "—"
        }
        right={
          right ? (right.variant.fuel === "diesel" ? copy.fuelDiesel : copy.fuelPetrol) : "—"
        }
      />
      <AttrRow
        label={copy.bodyType}
        left={left ? copy[bodyLabelKey(bodyOf(left.chassis))] : "—"}
        right={right ? copy[bodyLabelKey(bodyOf(right.chassis))] : "—"}
      />
      <AttrRow
        label={copy.years}
        left={left ? String(left.variant.year) : "—"}
        right={right ? String(right.variant.year) : "—"}
      />
      <AttrRow
        label={copy.buy}
        left={
          left ? (
            <Money value={left.variant.medianBuyPln} locale={locale} size="sm" />
          ) : (
            "—"
          )
        }
        right={
          right ? (
            <Money value={right.variant.medianBuyPln} locale={locale} size="sm" />
          ) : (
            "—"
          )
        }
      />
      <AttrRow
        label={copy.repair}
        left={
          left ? (
            <MoneyRange range={left.variant.expectedRepairPln} locale={locale} size="sm" variant="plain" />
          ) : (
            "—"
          )
        }
        right={
          right ? (
            <MoneyRange range={right.variant.expectedRepairPln} locale={locale} size="sm" variant="plain" />
          ) : (
            "—"
          )
        }
        last
      />

      {(left || right) && (
        <div className="grid grid-cols-2 border-t border-[var(--line)]">
          <MatrixLink locale={locale} entry={left} />
          <MatrixLink locale={locale} entry={right} edge />
        </div>
      )}
    </div>
  );
}

function MatrixHead({
  locale,
  slot,
  entry,
  removeHref,
  edge = false,
}: {
  locale: Locale;
  slot: "a" | "b";
  entry: Entry | null;
  removeHref: string;
  edge?: boolean;
}) {
  const copy = t(locale);
  if (!entry) {
    return (
      <div className={`px-2.5 py-3 ${edge ? "border-l border-[var(--line)]" : ""}`}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          {slot === "a" ? copy.compareSlot1 : copy.compareSlot2}
        </p>
        <p className="mt-1.5 text-sm font-semibold leading-snug text-[var(--ink)]">
          {slot === "a" ? copy.comparePickFirst : copy.comparePickSecond}
        </p>
        <Link
          href={`/${locale}/bmw`}
          className="mt-2 inline-flex text-xs font-semibold text-[var(--accent)] underline underline-offset-2"
        >
          {copy.compareBrowse}
        </Link>
      </div>
    );
  }

  const { chassis, variant } = entry;
  return (
    <div className={`relative px-2.5 py-3 ${edge ? "border-l border-[var(--line)]" : ""}`}>
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            {slot === "a" ? copy.compareSlot1 : copy.compareSlot2}
          </p>
          <p className="mt-0.5 font-mono text-[11px] text-[var(--muted)]">{chassis.code}</p>
          <p className="mt-0.5 truncate font-display text-base leading-tight tracking-tight">
            {variant.model}
          </p>
          <p className="mt-0.5 truncate font-mono text-[11px] text-[var(--muted)]">
            {variant.engine} · {variant.year}
          </p>
        </div>
        <Link
          href={removeHref}
          className="tap inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-sm text-[var(--muted)]"
          aria-label={copy.compareRemove}
        >
          ×
        </Link>
      </div>
    </div>
  );
}

function MatrixPhoto({ entry, edge = false }: { entry: Entry | null; edge?: boolean }) {
  if (!entry) {
    return (
      <div className={`bg-[var(--wash)]/40 p-2 ${edge ? "border-l border-[var(--line)]" : ""}`}>
        <div className="h-28 w-full rounded-lg bg-[var(--wash)]" />
      </div>
    );
  }

  const src = carPhotoSrc(entry.chassis);
  const alt = `${entry.chassis.code} ${entry.variant.model}`;

  return (
    <div className={`p-2 ${edge ? "border-l border-[var(--line)]" : ""}`}>
      <div className="relative h-28 w-full overflow-hidden rounded-lg bg-[#0c0e14]">
        {src ? (
          <img
            src={src}
            alt={alt}
            width={320}
            height={200}
            loading="lazy"
            decoding="async"
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              maxWidth: "none",
              objectFit: "cover",
              objectPosition: "50% 55%",
            }}
          />
        ) : (
          <div className="grid size-full place-items-center font-mono text-sm text-white/50">
            {entry.chassis.code}
          </div>
        )}
      </div>
    </div>
  );
}

function MatrixScore({ locale, entry, edge = false }: { locale: Locale; entry: Entry | null; edge?: boolean }) {
  if (!entry) {
    return (
      <div className={`px-2.5 py-2.5 ${edge ? "border-l border-[var(--line)]" : ""}`}>
        <p className="font-display text-2xl text-[var(--muted)]">—</p>
      </div>
    );
  }
  return (
    <div className={`min-w-0 px-2.5 py-2.5 ${edge ? "border-l border-[var(--line)]" : ""}`}>
      <p className="font-display text-[1.65rem] leading-none tracking-tight">
        <ScoreGlow score={entry.variant.score} locale={locale} />
        <span className="ml-0.5 font-mono text-[10px] font-medium text-[var(--muted)]">/100</span>
      </p>
      <div className="mt-1">
        <ScoreTrack score={entry.variant.score} compact />
      </div>
    </div>
  );
}

function AttrRow({
  label,
  left,
  right,
  last = false,
}: {
  label: string;
  left: ReactNode;
  right: ReactNode;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "border-b border-[var(--line)]"}>
      <p className="bg-[var(--wash)]/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </p>
      <div className="grid grid-cols-2">
        <div className="min-w-0 overflow-hidden px-2.5 py-2 text-sm font-semibold tabular-nums text-[var(--ink)]">
          {left}
        </div>
        <div className="min-w-0 overflow-hidden border-l border-[var(--line)] px-2.5 py-2 text-sm font-semibold tabular-nums text-[var(--ink)]">
          {right}
        </div>
      </div>
    </div>
  );
}

function MatrixLink({ locale, entry, edge = false }: { locale: Locale; entry: Entry | null; edge?: boolean }) {
  const copy = t(locale);
  if (!entry) {
    return <div className={`px-2.5 py-2.5 ${edge ? "border-l border-[var(--line)]" : ""}`} />;
  }
  return (
    <div className={`px-2.5 py-2.5 ${edge ? "border-l border-[var(--line)]" : ""}`}>
      <Link
        href={`/${locale}/bmw/${entry.chassis.slug}/${entry.variant.slug}`}
        className="text-xs font-semibold text-[var(--accent)] underline underline-offset-2"
      >
        {copy.openBrief}
      </Link>
    </div>
  );
}

function MatrixSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{title}</p>
      {children}
    </div>
  );
}

function PainCell({ locale, entry }: { locale: Locale; entry: Entry }) {
  const pains = painsForVariant(entry.variant).slice(0, 2);
  return (
    <div className="bg-[var(--card)] p-2.5">
      <ul className="flex flex-col gap-2">
        {pains.length === 0 ? (
          <li className="text-xs text-[var(--muted)]">—</li>
        ) : (
          pains.map((pain: Pain) => (
            <li key={pain.id}>
              <p className="text-xs font-semibold leading-snug text-[var(--ink)]">{pain.title[locale]}</p>
              <p className="mt-0.5 line-clamp-3 text-[11px] leading-4 text-[var(--muted)]">
                {pain.summary[locale]}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function VerdictCell({ locale, entry }: { locale: Locale; entry: Entry }) {
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
    <div className={`rounded-xl px-2.5 py-2.5 ${box}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide">{copy.verdict}</p>
      <p className="mt-1 line-clamp-5 text-xs leading-4 text-[var(--ink)]">{tx(verdict.summary, locale)}</p>
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
  entry: Entry | null;
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

function PainCol({ locale, entry }: { locale: Locale; entry: Entry }) {
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

function VerdictCol({ locale, entry }: { locale: Locale; entry: Entry }) {
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
      <dt className="min-w-0 shrink text-xs uppercase tracking-wide text-[var(--muted)]">{label}</dt>
      <dd className="shrink-0 font-medium tabular-nums">{value}</dd>
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
