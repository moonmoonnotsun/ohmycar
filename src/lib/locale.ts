export const locales = ["en", "pl", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "pl" || value === "ru";
}

export function localeFromAccept(header: string): Locale {
  const first = header.split(",")[0]?.trim().toLowerCase() ?? "";
  if (first.startsWith("pl")) return "pl";
  if (first.startsWith("ru")) return "ru";
  return "en";
}

export function switchLocalePath(pathname: string, from: Locale, to: Locale): string {
  if (from === to) return pathname || `/${to}`;
  const next = pathname.replace(`/${from}`, `/${to}`);
  return next.startsWith("/") ? next : `/${to}`;
}
