import type { Locale } from "@/lib/locale";
import type { Chassis, VariantBrief } from "@/data/types";
import { bodyOf } from "@/lib/carImage";

function otomotoBody(chassis: Chassis): string | null {
  const style = bodyOf(chassis);
  if (style === "touring") return "kombi";
  if (style === "coupe") return "coupe";
  if (style === "cabrio") return "cabrio";
  if (style === "hatch") return "hatchback";
  if (style === "suv") return "suv";
  if (chassis.slug === "e90") return "sedan";
  return null;
}

export function otomotoUrl(chassis: Chassis, variant?: VariantBrief): string {
  const params = new URLSearchParams();
  params.set("search[filter_float_year:from]", String(variant?.year ?? chassis.yearStart));
  params.set(
    "search[filter_float_year:to]",
    String(variant?.year ?? chassis.yearEnd ?? 2026),
  );
  const q = ["bmw", chassis.code, variant?.model, variant?.engine].filter(Boolean).join(" ");
  params.set("q", q);
  const body = otomotoBody(chassis);
  if (body) {
    params.set("search[filter_enum_body_type]", body);
  }
  return `https://www.otomoto.pl/osobowe/bmw?${params.toString()}`;
}

export function mobileDeUrl(chassis: Chassis, variant?: VariantBrief): string {
  const params = new URLSearchParams({
    dam: "0",
    isSearchRequest: "true",
    s: "Car",
    vc: "Car",
    ms: "3500",
    minfirstRegistrationDate: String(variant?.year ?? chassis.yearStart),
    maxfirstRegistrationDate: String(variant?.year ?? chassis.yearEnd ?? 2026),
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
