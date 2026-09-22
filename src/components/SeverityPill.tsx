"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import type { PainSeverity } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t, type Copy } from "@/lib/i18n";

const ORDER: PainSeverity[] = [
  "engine-loss",
  "safety",
  "overheat",
  "expensive",
  "stranded",
  "annoyance",
];

const META: Record<
  PainSeverity,
  { label: keyof Copy; help: keyof Copy; tone: "bad" | "mid" | "muted" }
> = {
  "engine-loss": { label: "sevEngine", help: "sevHelpEngine", tone: "bad" },
  safety: { label: "sevSafety", help: "sevHelpSafety", tone: "bad" },
  overheat: { label: "sevOverheat", help: "sevHelpOverheat", tone: "mid" },
  expensive: { label: "sevExpensive", help: "sevHelpExpensive", tone: "mid" },
  stranded: { label: "sevStranded", help: "sevHelpStranded", tone: "mid" },
  annoyance: { label: "sevAnnoyance", help: "sevHelpAnnoyance", tone: "muted" },
};

const pillTone = {
  bad: "border-[var(--bad)]/55 text-[var(--bad)]",
  mid: "border-[var(--mid)]/55 text-[var(--mid)]",
  muted: "border-[var(--line)] text-[var(--muted)]",
};

const textTone = {
  bad: "text-[var(--bad)]",
  mid: "text-[var(--mid)]",
  muted: "text-[var(--muted)]",
};

const dotTone = {
  bad: "bg-[var(--bad)]",
  mid: "bg-[var(--mid)]",
  muted: "bg-[var(--muted)]",
};

/** Severity pill + ? that opens a modal explaining every fault type. */
export function SeverityPill({
  locale,
  severity,
}: {
  locale: Locale;
  severity: PainSeverity;
}) {
  const copy = t(locale);
  const meta = META[severity];
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        <h2 id={titleId} className="text-lg font-semibold leading-snug">
          {copy.sevHelpTitle}
        </h2>
        <button
          type="button"
          onClick={close}
          className="grid size-12 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-[var(--wash)] text-[var(--ink)]"
          aria-label={copy.faultClose}
        >
          <svg viewBox="0 0 24 24" className="block size-5" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <div className="fault-dialog-body px-4 py-4">
        <p className="text-sm leading-6 text-[var(--muted)]">{copy.sevHelpLead}</p>
        <ul className="mt-4 flex flex-col gap-3">
          {ORDER.map((key) => {
            const row = META[key];
            const active = key === severity;
            return (
              <li
                key={key}
                className={`rounded-xl border px-3.5 py-3 ${
                  active ? "border-[var(--accent)] bg-[var(--mid-bg)]" : "border-[var(--line)] bg-[var(--card)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`size-2.5 shrink-0 rounded-full ${dotTone[row.tone]}`} aria-hidden />
                  <span className={`text-sm font-semibold ${textTone[row.tone]}`}>
                    {copy[row.label]}
                  </span>
                  {active ? (
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                      {copy.sevHelpThis}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">{copy[row.help]}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </dialog>
  );

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={`tap inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[10px] font-semibold uppercase tracking-wide ${pillTone[meta.tone]}`}
        aria-label={`${copy[meta.label]} — ${copy.sevHelpOpen}`}
      >
        {copy[meta.label]}
        <span
          className="inline-flex size-3.5 items-center justify-center rounded-full border border-current/40 text-[9px] leading-none"
          aria-hidden
        >
          ?
        </span>
      </button>
      {mounted ? createPortal(sheet, document.body) : null}
    </>
  );
}
