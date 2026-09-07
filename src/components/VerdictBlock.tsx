"use client";

import { useState } from "react";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { tx } from "@/data/loc";
import type { Verdict } from "@/data/verdicts";

function firstSentences(text: string, count: number) {
  const bits =
    text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((part) => part.trim()).filter(Boolean) ?? [text];
  if (bits.length <= count) return { preview: text, truncated: false };
  return { preview: bits.slice(0, count).join(" "), truncated: true };
}

export function VerdictBlock({ locale, verdict }: { locale: Locale; verdict: Verdict }) {
  const copy = t(locale);
  const [open, setOpen] = useState(false);
  const summary = tx(verdict.summary, locale);
  const { preview, truncated } = firstSentences(summary, 2);

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">{copy.verdict}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-[var(--good-bg)] px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--good)]">{copy.verdictGood}</p>
          <p className="mt-1.5 text-sm leading-6">{tx(verdict.good, locale)}</p>
        </div>
        <div className="rounded-xl bg-[var(--bad-bg)] px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--bad)]">{copy.verdictBad}</p>
          <p className="mt-1.5 text-sm leading-6">{tx(verdict.bad, locale)}</p>
        </div>
      </div>
      <p className="mt-4 hidden text-[15px] leading-7 text-[var(--muted)] sm:block">{summary}</p>
      <div className="sm:hidden">
        <p className="mt-4 text-[15px] leading-7 text-[var(--muted)]">{open || !truncated ? summary : preview}</p>
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
      <p className="mt-3 text-xs text-[var(--muted)]">{copy.hypothesis}</p>
    </section>
  );
}
