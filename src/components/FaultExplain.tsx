"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import type { Pain } from "@/data/types";
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
  showTitle = true,
}: {
  locale: Locale;
  pain?: Pain;
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
        <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">{copy.plnNote}</p>
        <WorkshopPrices locale={locale} pain={pain} />
        <a
          className="mt-4 inline-flex h-tap items-center text-sm font-medium underline underline-offset-2"
          href={autodocUrl(pain.autodocQuery[locale], locale)}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {copy.autodoc}: {pain.autodocQuery[locale]}
        </a>
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

export function WorkshopPrices({ locale, pain }: { locale: Locale; pain: Pain }) {
  const copy = t(locale);
  const cells = [
    { label: copy.independent, range: pain.plnIndependent },
    { label: copy.specialist, range: pain.plnSpecialist },
    { label: copy.aso, range: pain.plnAso },
  ];
  return (
    <dl className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="flex items-center justify-between gap-3 rounded-xl bg-[var(--wash)] px-3 py-2.5 sm:flex-col sm:items-center sm:justify-start sm:px-2 sm:py-2 sm:text-center"
        >
          <dt className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            {cell.label}
          </dt>
          <dd className="min-w-0 sm:mt-1">
            <MoneyRange range={cell.range} locale={locale} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
