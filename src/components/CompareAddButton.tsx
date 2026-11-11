"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { compareSlotKey } from "@/lib/catalog";
import { compareHref, readCompareSlots, writeCompareSlots } from "@/lib/compare";
import { track } from "@/lib/analytics";

export function CompareAddButton({
  locale,
  chassisSlug,
  variantSlug,
}: {
  locale: Locale;
  chassisSlug: string;
  variantSlug: string;
}) {
  const copy = t(locale);
  const router = useRouter();
  const key = compareSlotKey(chassisSlug, variantSlug);
  const [label, setLabel] = useState(copy.addToCompare);

  useEffect(() => {
    const slots = readCompareSlots();
    if (slots.a === key || slots.b === key) {
      setLabel(copy.compareInTray);
    } else if (!slots.a) {
      setLabel(copy.addToCompare);
    } else if (!slots.b) {
      setLabel(copy.compareAddSecond);
    } else {
      setLabel(copy.compareReplace);
    }
  }, [key, copy.addToCompare, copy.compareInTray, copy.compareAddSecond, copy.compareReplace]);

  return (
    <button
      type="button"
      onClick={() => {
        const slots = readCompareSlots();
        let a = slots.a;
        let b = slots.b;
        if (a === key || b === key) {
          track("Compare Opened", {
            locale,
            chassis_slug: chassisSlug,
            variant_slug: variantSlug,
            source: "already_in_tray",
            pair_complete: Boolean(a && b),
          });
          router.push(compareHref(locale, a, b));
          return;
        }
        let slot: "a" | "b" | "replace_b" = "a";
        if (!a) {
          a = key;
          slot = "a";
        } else if (!b) {
          b = key;
          slot = "b";
        } else {
          b = key; // third pick replaces car 2
          slot = "replace_b";
        }
        writeCompareSlots({ a, b });
        track("Compare Added", {
          locale,
          chassis_slug: chassisSlug,
          variant_slug: variantSlug,
          slot,
          pair_complete: Boolean(a && b),
        });
        router.push(compareHref(locale, a, b));
      }}
      className="tap inline-flex h-tap w-full shrink-0 items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--card)] px-3.5 text-sm font-medium text-[var(--ink)] hover:border-[var(--ink)]"
    >
      <Bookmark className="size-4" strokeWidth={1.75} aria-hidden />
      {label}
    </button>
  );
}
