"use client";

import { useSearchParams } from "next/navigation";
import { getChassis } from "@/data/chassis";
import { getVariant, parseCompareSlot } from "@/lib/catalog";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { CompareBoard } from "@/components/CompareBoard";
import { CompareSlotSync } from "@/components/CompareSlotSync";

/** Client-side slots — static export cannot read searchParams on the server. */
export function CompareView({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const searchParams = useSearchParams();
  const a = searchParams.get("a") ?? undefined;
  const b = searchParams.get("b") ?? undefined;
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

  return (
    <>
      <CompareSlotSync a={a} b={b} />
      {!left && !right ? (
        <p className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--card)] px-4 py-8 text-center text-sm text-[var(--muted)]">
          {copy.compareEmpty}
        </p>
      ) : (
        <CompareBoard locale={locale} left={left} right={right} />
      )}
    </>
  );
}
