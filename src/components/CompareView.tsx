"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getChassis } from "@/data/chassis";
import { getVariant, parseCompareSlot } from "@/lib/catalog";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { CompareBoard } from "@/components/CompareBoard";
import { compareHref, readCompareSlots, writeCompareSlots } from "@/lib/compare";

/** Client-side slots — static export cannot read searchParams on the server. */
export function CompareView({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const a = searchParams.get("a") ?? undefined;
  const b = searchParams.get("b") ?? undefined;
  const [ready, setReady] = useState(Boolean(a || b));
  const seenUrl = useRef(Boolean(a || b));

  // Header → bare /compare restores tray once.
  // Clearing both cars writes an empty tray (no revive loop).
  useEffect(() => {
    if (a || b) {
      writeCompareSlots({ a, b });
      seenUrl.current = true;
      setReady(true);
      return;
    }
    if (!seenUrl.current) {
      seenUrl.current = true;
      const stored = readCompareSlots();
      if (stored.a || stored.b) {
        router.replace(compareHref(locale, stored.a, stored.b));
        return;
      }
    } else {
      writeCompareSlots({});
    }
    setReady(true);
  }, [a, b, locale, router]);

  if (!ready) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--card)] px-4 py-8 text-center text-sm text-[var(--muted)]">
        {copy.compareEmpty}
      </p>
    );
  }

  const leftSlot = parseCompareSlot(a);
  const rightSlot = parseCompareSlot(b);

  const left =
    leftSlot && getChassis(leftSlot.chassisSlug) && getVariant(leftSlot.chassisSlug, leftSlot.variantSlug)
      ? {
          chassis: getChassis(leftSlot.chassisSlug)!,
          variant: getVariant(leftSlot.chassisSlug, leftSlot.variantSlug)!,
        }
      : null;
  const right =
    rightSlot && getChassis(rightSlot.chassisSlug) && getVariant(rightSlot.chassisSlug, rightSlot.variantSlug)
      ? {
          chassis: getChassis(rightSlot.chassisSlug)!,
          variant: getVariant(rightSlot.chassisSlug, rightSlot.variantSlug)!,
        }
      : null;

  if (!left && !right) {
    return <CompareEmptyGuide locale={locale} />;
  }

  return <CompareBoard locale={locale} left={left} right={right} />;
}

function CompareEmptyGuide({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const steps = [copy.compareHow1, copy.compareHow2, copy.compareHow3];

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-7">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
        {copy.compareHowTitle}
      </p>
      <ol className="mt-4 flex flex-col gap-3">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3 text-sm leading-6 text-[var(--ink)]">
            <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-[var(--line)] font-mono text-xs text-[var(--muted)]">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <Link
        href={`/${locale}/bmw`}
        className="tap mt-6 inline-flex h-11 items-center justify-center rounded-full border border-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent)]"
      >
        {copy.compareBrowse}
      </Link>
    </div>
  );
}
