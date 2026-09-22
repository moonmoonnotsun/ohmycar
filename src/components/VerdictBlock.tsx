"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { Locale } from "@/lib/locale";
import type { ScoreStatus } from "@/data/types";
import { t } from "@/lib/i18n";
import { tx } from "@/data/loc";
import type { Verdict } from "@/data/verdicts";

function firstSentences(text: string, count: number) {
  const bits =
    text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((part) => part.trim()).filter(Boolean) ?? [text];
  if (bits.length <= count) return { preview: text, truncated: false };
  return { preview: bits.slice(0, count).join(" "), truncated: true };
}

function bullets(text: string): string[] {
  return text
    .split(/[.;]\s+/)
    .map((part) => part.replace(/[.!?]+$/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function VerdictBlock({
  locale,
  verdict,
  status,
}: {
  locale: Locale;
  verdict: Verdict;
  status?: ScoreStatus;
}) {
  const copy = t(locale);
  const [open, setOpen] = useState(false);
  const summary = tx(verdict.summary, locale);
  const { preview, truncated } = firstSentences(summary, 2);
  const goodItems = bullets(tx(verdict.good, locale));
  const badItems = bullets(tx(verdict.bad, locale));
  const statusLabel =
    status === "evidence_derived"
      ? copy.scoreEvidence
      : status === "signed"
        ? copy.signed
        : status === "insufficient"
          ? copy.scoreInsufficient
          : copy.scoreEvidence;

  return (
    <section className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--good-bg)] p-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-[var(--good)]" strokeWidth={1.75} aria-hidden />
            <p className="text-sm font-semibold text-[var(--good)]">{copy.commonAdvantages}</p>
          </div>
          <ul className="mt-3 space-y-2">
            {(goodItems.length ? goodItems : [tx(verdict.good, locale)]).map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-[var(--ink)]">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--good)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--bad-bg)] p-5">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 text-[var(--bad)]" strokeWidth={1.75} aria-hidden />
            <p className="text-sm font-semibold text-[var(--bad)]">{copy.commonIssues}</p>
          </div>
          <ul className="mt-3 space-y-2">
            {(badItems.length ? badItems : [tx(verdict.bad, locale)]).map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-[var(--ink)]">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--bad)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
        <p className="hidden text-[15px] leading-7 text-[var(--muted)] sm:block">{summary}</p>
        <div className="sm:hidden">
          <p className="text-[15px] leading-7 text-[var(--muted)]">{open || !truncated ? summary : preview}</p>
          {truncated ? (
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="mt-3 inline-flex h-tap items-center rounded-full border border-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent)]"
            >
              {open ? copy.showLess : copy.showMore}
            </button>
          ) : null}
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">{statusLabel}</p>
      </div>
    </section>
  );
}
