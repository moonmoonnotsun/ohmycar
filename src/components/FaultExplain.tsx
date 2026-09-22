"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import type { Chassis, Pain, VariantBrief } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { autodocUrl } from "@/lib/links";
import { MoneyRange } from "@/components/Money";

const SEV: Record<Pain["severity"], { key: keyof ReturnType<typeof t>; bar: string }> = {
  "engine-loss": { key: "sevEngine", bar: "bg-[var(--bad)]" },
  safety: { key: "sevSafety", bar: "bg-[var(--bad)]" },
  expensive: { key: "sevExpensive", bar: "bg-[var(--mid)]" },
  overheat: { key: "sevOverheat", bar: "bg-[var(--mid)]" },
  stranded: { key: "sevStranded", bar: "bg-[var(--mid)]" },
  annoyance: { key: "sevAnnoyance", bar: "bg-[var(--muted)]" },
};

export function FaultDiagram({
  locale,
  src,
  alt,
  compact,
}: {
  locale: Locale;
  src?: string;
  alt?: string;
  compact?: boolean;
}) {
  const copy = t(locale);
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#0c0e14] ${
        compact ? "aspect-[4/3] max-w-[13rem]" : "aspect-[16/10]"
      }`}
    >
      {src ? (
        <img src={src} alt={alt ?? ""} className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border border-dashed border-[var(--line)] text-[var(--muted)]">
          <svg viewBox="0 0 88 56" className="h-14 w-[5.5rem]" aria-hidden>
            <rect x="10" y="18" width="68" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="24" cy="44" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="64" cy="44" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M22 18 V12 H38 V18 M50 18 V10 H70 V18" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M18 28 h12 M40 26 h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em]">{copy.faultDiagramSoon}</p>
        </div>
      )}
    </div>
  );
}

export function FaultHint({
  locale,
  pain,
  chassis,
  variant,
  showTitle = true,
}: {
  locale: Locale;
  pain?: Pain;
  chassis?: Chassis;
  variant?: VariantBrief;
  showTitle?: boolean;
}) {
  const copy = t(locale);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!pain) return <span className="text-[var(--muted)]">—</span>;

  const sev = SEV[pain.severity];

  function open(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    dialog.current?.showModal();
  }

  function close(e?: MouseEvent) {
    e?.stopPropagation();
    dialog.current?.close();
  }

  const sheet = (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      className="fault-dialog"
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === dialog.current) close(e);
      }}
      onCancel={(e) => e.stopPropagation()}
    >
      <div className="fault-dialog-head">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            {copy[sev.key]}
          </p>
          <h2 id={titleId} className="mt-1 text-lg font-semibold leading-snug">
            {pain.title[locale]}
          </h2>
        </div>
        <button
          type="button"
          onClick={close}
          className="grid size-12 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-[var(--wash)] text-[var(--ink)]"
          aria-label={copy.faultClose}
        >
          <svg viewBox="0 0 24 24" className="block size-5" aria-hidden>
            <path
              d="M7 7 17 17M17 7 7 17"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <div className="fault-dialog-body">
        <FaultDiagram locale={locale} src={pain.diagram} alt={pain.title[locale]} />
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{copy.faultWhat}</p>
        <p className="mt-1 text-sm leading-6">{pain.summary[locale]}</p>
        <p className="mt-3 text-sm">
          <span className="text-[var(--muted)]">{copy.affects}: </span>
          {pain.affects[locale]}
        </p>
        <WorkshopPrices locale={locale} pain={pain} />
        <a
          className="mt-4 inline-flex h-tap items-center text-sm font-medium underline underline-offset-2"
          href={autodocUrl(pain.autodocQuery[locale], locale, chassis, variant)}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {copy.autodoc}: {pain.autodocQuery[locale]}
        </a>
        <SourceList locale={locale} sources={pain.sources} />
      </div>
    </dialog>
  );

  return (
    <span className="relative inline-flex max-w-full items-center gap-1.5">
      {showTitle ? <span className="min-w-0 truncate">{pain.title[locale]}</span> : null}
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={`${copy.faultHint}: ${pain.title[locale]}`}
        onClick={open}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-sm font-semibold leading-none text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
      >
        ?
      </button>
      {mounted ? createPortal(sheet, document.body) : null}
    </span>
  );
}

export function SourceList({
  locale,
  sources,
}: {
  locale: Locale;
  sources: Pain["sources"];
}) {
  const copy = t(locale);
  if (sources.length === 0) return null;

  const price = sources.filter((s) => /^PLN\b/i.test(s.label) || /cenauslug|polecany|smorawinski|autokult|kosztserwisu|hypertech|skanyx|admserwis|rozrzad\.pl|gearmar|bmwstore|oryginalne-czesci/i.test(s.url));
  const priceUrls = new Set(price.map((s) => s.url));
  const fault = sources.filter((s) => !priceUrls.has(s.url));

  return (
    <div className="mt-3 space-y-3">
      {fault.length > 0 ? (
        <SourceGroup title={copy.sources} items={fault} />
      ) : null}
      {price.length > 0 ? (
        <SourceGroup title={copy.priceSources} items={price} />
      ) : null}
    </div>
  );
}

function SourceGroup({ title, items }: { title: string; items: Pain["sources"] }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{title}</p>
      <ul className="mt-1.5 flex flex-col gap-1">
        {items.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="break-all text-[13px] text-[var(--muted)] underline decoration-[var(--line)] underline-offset-2 hover:text-[var(--ink)]"
              onClick={(e) => e.stopPropagation()}
            >
              {source.label.replace(/^PLN\s*·\s*/i, "")}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * RepairPal-style estimate: lead with typical independent total,
 * then parts/labor receipt rows, then specialist/ASO comparison.
 */
export function WorkshopPrices({ locale, pain }: { locale: Locale; pain: Pain }) {
  const copy = t(locale);
  const hasTotals = Boolean(pain.plnIndependent || pain.plnSpecialist || pain.plnAso);
  const hasSplit = Boolean(pain.plnParts || pain.plnLabor);
  const isFree = pain.plnIndependent?.[0] === 0 && pain.plnIndependent?.[1] === 0;

  if (!hasTotals && !hasSplit) {
    return (
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        {pain.plnNote ?? copy.plnPendingHint}
      </p>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper)]/60">
      {/* Hero total — primary glance value */}
      <div className="px-4 pb-3 pt-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          {copy.plnTypical}
        </p>
        <div className="mt-1.5 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
          <MoneyRange range={pain.plnIndependent} locale={locale} size="lg" />
          <p className="pb-0.5 text-[12px] text-[var(--muted)]">{copy.plnIndepShop}</p>
        </div>
        {isFree ? (
          <p className="mt-1.5 text-[12px] leading-5 text-[var(--muted)]">{pain.plnNote}</p>
        ) : null}
      </div>

      {/* Parts + labor receipt */}
      {hasSplit && !isFree ? (
        <div className="border-t border-[var(--line)] px-4 py-2.5">
          <ReceiptRow label={copy.plnParts} range={pain.plnParts} locale={locale} />
          <ReceiptRow label={`+ ${copy.plnLabor}`} range={pain.plnLabor} locale={locale} />
          <div className="mt-1.5 flex items-baseline justify-between gap-3 border-t border-dashed border-[var(--line)] pt-2">
            <span className="text-[12px] font-semibold text-[var(--ink)]">{copy.plnFullSum}</span>
            <MoneyRange range={pain.plnIndependent} locale={locale} size="sm" />
          </div>
        </div>
      ) : null}

      {/* Shop ladder — all three tiers on one PLN axis */}
      {(pain.plnSpecialist || pain.plnAso) && !isFree ? (
        <div className="border-t border-[var(--line)] px-4 py-2.5">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            {copy.plnShopCompare}
          </p>
          <ShopLadder
            locale={locale}
            independent={pain.plnIndependent}
            specialist={pain.plnSpecialist}
            aso={pain.plnAso}
          />
          <div className="mt-2 space-y-0.5">
            <ReceiptRow label={copy.independent} range={pain.plnIndependent} locale={locale} quiet />
            <ReceiptRow label={copy.specialist} range={pain.plnSpecialist} locale={locale} quiet />
            <ReceiptRow label={copy.aso} range={pain.plnAso} locale={locale} quiet />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ReceiptRow({
  label,
  range,
  locale,
  quiet,
}: {
  label: string;
  range: [number, number] | null | undefined;
  locale: Locale;
  quiet?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className={`min-w-0 text-[12px] ${quiet ? "text-[var(--muted)]" : "text-[var(--ink)]"}`}>
        {label}
      </span>
      <MoneyRange range={range} locale={locale} size="sm" />
    </div>
  );
}

/** Three shop tiers as stacked tracks — no overlapping translucent mush. */
function ShopLadder({
  locale,
  independent,
  specialist,
  aso,
}: {
  locale: Locale;
  independent: [number, number] | null;
  specialist: [number, number] | null;
  aso: [number, number] | null;
}) {
  const copy = t(locale);
  const lows = [independent?.[0], specialist?.[0], aso?.[0]].filter((n): n is number => n != null);
  const highs = [independent?.[1], specialist?.[1], aso?.[1]].filter((n): n is number => n != null);
  if (lows.length === 0 || highs.length === 0) return null;

  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const span = Math.max(max - min, 1);

  function track(range: [number, number] | null, tone: string, label: string) {
    if (!range) return null;
    const left = ((range[0] - min) / span) * 100;
    const width = Math.max(((range[1] - range[0]) / span) * 100, 3);
    return (
      <div className="flex items-center gap-2" title={`${label}: ${range[0]}–${range[1]} PLN`}>
        <span className="w-[4.5rem] shrink-0 truncate text-[10px] text-[var(--muted)]">{label}</span>
        <div className="relative h-1.5 min-w-0 flex-1 rounded-full bg-[var(--wash)]">
          <span
            className={`absolute top-0 h-full rounded-full ${tone}`}
            style={{ left: `${left}%`, width: `${width}%` }}
            aria-hidden
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5" role="img" aria-label={copy.plnShopCompare}>
      {track(independent, "bg-[var(--good)]", copy.independent)}
      {track(specialist, "bg-[var(--mid)]", copy.specialist)}
      {track(aso, "bg-[var(--bad)]", copy.aso)}
      <div className="flex justify-between pt-0.5 font-mono text-[10px] tabular-nums text-[var(--muted)]">
        <span>{min.toLocaleString(locale === "pl" ? "pl-PL" : locale === "ru" ? "ru-RU" : "en-GB")}</span>
        <span>{max.toLocaleString(locale === "pl" ? "pl-PL" : locale === "ru" ? "ru-RU" : "en-GB")} PLN</span>
      </div>
    </div>
  );
}
