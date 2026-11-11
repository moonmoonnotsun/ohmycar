"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { Locale } from "@/lib/locale";
import type { ScoreStatus } from "@/data/types";
import { t } from "@/lib/i18n";
import { tx } from "@/data/loc";
import type { Verdict } from "@/data/verdicts";
import { StanceChip } from "@/components/StanceChip";
import { GroupTitle } from "@/components/GroupTitle";
import { scoreStance } from "@/lib/score";

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

function statusCopy(locale: Locale, status?: ScoreStatus): string {
  const copy = t(locale);
  if (status === "signed") return copy.signed;
  if (status === "insufficient") return copy.scoreInsufficient;
  return copy.scoreEvidence;
}

/**
 * Clean MotorFiable-style verdict card:
 * section label → white card → title + stance tag → meta → prose.
 */
export function VerdictCallout({
  locale,
  verdict,
  score,
  status,
  title,
  meta,
}: {
  locale: Locale;
  verdict: Verdict;
  score?: number | null;
  status?: ScoreStatus;
  /** e.g. "2011 520i N20" or chassis name */
  title?: string;
  /** e.g. "F10 · Sedan · Petrol" */
  meta?: string;
}) {
  const copy = t(locale);
  const [open, setOpen] = useState(false);
  const summary = tx(verdict.summary, locale);
  const { preview, truncated } = firstSentences(summary, 2);
  const stance = scoreStance(score);
  const heading = title?.trim() || copy.verdict;

  return (
    <section className="h-full rounded-2xl border-2 border-[var(--line)] bg-[var(--card)] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <GroupTitle>{copy.verdictOur}</GroupTitle>
        {stance ? <StanceChip locale={locale} stance={stance} variant="tag" /> : null}
      </div>
      <div className="mt-1 border-t border-[var(--line)] pt-4 sm:mt-1.5 sm:pt-5">
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-snug tracking-tight text-[var(--ink)] sm:text-[1.05rem]">
            {heading}
          </h3>
          {meta ? <p className="mt-1 text-xs leading-5 text-[var(--muted)] sm:text-[13px]">{meta}</p> : null}
        </div>

        <p className="mt-4 hidden text-[15px] leading-7 text-[var(--ink)]/90 sm:block">{summary}</p>
        <div className="mt-4 sm:hidden">
          <p className="text-[15px] leading-7 text-[var(--ink)]/90">{open || !truncated ? summary : preview}</p>
          {truncated ? (
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="mt-3 inline-flex h-tap items-center text-sm font-semibold text-[var(--ink)] underline underline-offset-2"
            >
              {open ? copy.showLess : copy.showMore}
            </button>
          ) : null}
        </div>

        <p className="mt-4 border-t border-[var(--line)] pt-3 text-[11px] leading-5 text-[var(--muted)]">
          {statusCopy(locale, status)}
        </p>
      </div>
    </section>
  );
}

export function VerdictProsCons({
  locale,
  verdict,
}: {
  locale: Locale;
  verdict: Verdict;
}) {
  const copy = t(locale);
  const goodItems = bullets(tx(verdict.good, locale));
  const badItems = bullets(tx(verdict.bad, locale));

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="tone-good rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 pl-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-[var(--good)]" strokeWidth={2} aria-hidden />
          <p className="text-sm font-semibold text-[var(--good)]">{copy.commonAdvantages}</p>
        </div>
        <ul className="mt-3 space-y-2">
          {(goodItems.length ? goodItems : [tx(verdict.good, locale)]).map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-[var(--ink)]">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--good)]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="tone-bad rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 pl-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-5 text-[var(--bad)]" strokeWidth={2} aria-hidden />
          <p className="text-sm font-semibold text-[var(--bad)]">{copy.commonIssues}</p>
        </div>
        <ul className="mt-3 space-y-2">
          {(badItems.length ? badItems : [tx(verdict.bad, locale)]).map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-[var(--ink)]">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--bad)]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Full block: callout + pros/cons (chassis pages, legacy callers). */
export function VerdictBlock({
  locale,
  verdict,
  status,
  score,
  title,
  meta,
}: {
  locale: Locale;
  verdict: Verdict;
  status?: ScoreStatus;
  score?: number | null;
  title?: string;
  meta?: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <VerdictCallout
        locale={locale}
        verdict={verdict}
        score={score}
        status={status}
        title={title}
        meta={meta}
      />
      <VerdictProsCons locale={locale} verdict={verdict} />
    </section>
  );
}
