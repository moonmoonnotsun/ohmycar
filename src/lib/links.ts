import type { Locale } from "@/lib/locale";
import type { Chassis, VariantBrief } from "@/data/types";
import { engineYearSpan } from "@/lib/catalog";

function otomotoSeries(chassis: Chassis): string | null {
  if (chassis.family === "3") return "seria-3";
  if (chassis.family === "4") return "seria-4";
  if (chassis.family === "5") return "seria-5";
  if (chassis.family === "1" || chassis.family === "2") return "seria-1";
  if (chassis.slug === "e83") return "x3";
  if (chassis.slug === "e70" || chassis.slug === "e53") return "x5";
  if (chassis.family === "x") return "x5";
  return null;
}

function yearSpan(chassis: Chassis, variant?: VariantBrief): [number, number] {
  if (variant) {
    return engineYearSpan(variant.chassisSlug, variant.model, variant.engine) ?? [variant.year, variant.year];
  }
  return [chassis.yearStart, chassis.yearEnd ?? chassis.yearStart];
}

export function otomotoUrl(chassis: Chassis, variant?: VariantBrief): string {
  const [from, to] = yearSpan(chassis, variant);
  const parts = ["osobowe", "bmw"];
  const series = otomotoSeries(chassis);
  if (series) parts.push(series);
  if (variant?.model) parts.push(`ver-${variant.model.toLowerCase()}`);
  const params = new URLSearchParams();
  params.set("search[filter_float_year:from]", String(from));
  params.set("search[filter_float_year:to]", String(to));
  return `https://www.otomoto.pl/${parts.join("/")}?${params.toString()}`;
}

export function mobileDeUrl(chassis: Chassis, variant?: VariantBrief): string {
  const [from, to] = yearSpan(chassis, variant);
  const params = new URLSearchParams({
    dam: "0",
    isSearchRequest: "true",
    s: "Car",
    vc: "Car",
    ms: "3500",
    minfirstRegistrationDate: String(from),
    maxfirstRegistrationDate: String(to),
  });
  if (variant) params.set("q", `${variant.model} ${chassis.code}`);
  else params.set("q", chassis.code);
  return `https://suchen.mobile.de/fahrzeuge/search.html?${params.toString()}`;
}

export function autodocUrl(query: string, locale: Locale): string {
  const host =
    locale === "pl" ? "https://www.autodoc.pl" : locale === "ru" ? "https://www.autodoc.ru" : "https://www.autodoc.co.uk";
  return `${host}/search?keyword=${encodeURIComponent(query)}`;
}

export function interCarsUrl(query: string): string {
  return `https://www.intercars.pl/szukaj/?q=${encodeURIComponent(query)}`;
}

function nbspLocale(locale: Locale): boolean {
  return locale === "pl" || locale === "ru";
}

function formatPlnNumber(value: number, locale: Locale): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, nbspLocale(locale) ? "\u00a0" : ",");
}

function formatThousands(value: number, locale: Locale): string {
  const k = value / 1000;
  const n = Number.isInteger(k) ? String(k) : k.toFixed(1).replace(".", nbspLocale(locale) ? "," : ".");
  return n;
}

export function formatPlnAmount(value: number, locale: Locale): string {
  return formatPlnNumber(value, locale);
}

export function formatPln(value: number, locale: Locale): string {
  const n = formatPlnNumber(value, locale);
  return locale === "pl" ? `${n}\u00a0zł` : `PLN ${n}`;
}

export function formatPlnBand(range: [number, number], locale: Locale): string {
  const a = formatPlnNumber(range[0], locale);
  const b = formatPlnNumber(range[1], locale);
  return locale === "pl" ? `${a}–${b}\u00a0zł` : `PLN ${a}–${b}`;
}

export function formatPlnCompact(value: number, locale: Locale): string {
  if (value >= 1000) {
    return locale === "pl"
      ? `${formatThousands(value, locale)}\u00a0tys.\u00a0zł`
      : `PLN ${formatThousands(value, locale)}k`;
  }
  return formatPln(value, locale);
}

export function formatPlnBandCompact(range: [number, number], locale: Locale): string {
  if (range[0] >= 1000 && range[1] >= 1000) {
    const a = formatThousands(range[0], locale);
    const b = formatThousands(range[1], locale);
    return locale === "pl" ? `${a}–${b}\u00a0tys.\u00a0zł` : `PLN ${a}–${b}k`;
  }
  return formatPlnBand(range, locale);
}
