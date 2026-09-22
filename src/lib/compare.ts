import type { Locale } from "@/lib/locale";

const STORAGE_KEY = "ohmycar-compare";

export type CompareSlots = { a?: string; b?: string };

export function compareHref(locale: Locale, a?: string, b?: string) {
  const params = new URLSearchParams();
  if (a) params.set("a", a);
  if (b) params.set("b", b);
  const q = params.toString();
  // trailingSlash: true in next.config — keep hrefs aligned with static export.
  return q ? `/${locale}/compare/?${q}` : `/${locale}/compare/`;
}

export function readCompareSlots(): CompareSlots {
  if (typeof sessionStorage === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CompareSlots;
    return { a: parsed.a, b: parsed.b };
  } catch {
    return {};
  }
}

export function writeCompareSlots(slots: CompareSlots) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
  } catch {
    /* ignore quota / private mode */
  }
}
