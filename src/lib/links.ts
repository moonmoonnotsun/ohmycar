import type { Locale } from "@/lib/locale";
import type { Chassis, VariantBrief } from "@/data/types";
import { engineYearSpan } from "@/lib/catalog";
import autodocCars from "@/data/imported/autodocCars.json";

/** OTOMOTO model-family slug from chassis identity. */
function otomotoSeries(chassis: Chassis): string | null {
  const blob = `${chassis.slug} ${chassis.code} ${chassis.name.en} ${chassis.name.pl}`.toLowerCase();
  if (/\bx1\b|e84|f48|u11/.test(blob)) return "x1";
  if (/\bx2\b|f39/.test(blob)) return "x2";
  if (/\bx3\b|e83|f25|g01|f97/.test(blob)) return "x3";
  if (/\bx4\b|f26|g02/.test(blob)) return "x4";
  if (/\bx5\b|e53|e70|f15|g05|f85/.test(blob)) return "x5";
  if (/\bx6\b|e71|f16|g06|f86/.test(blob)) return "x6";
  if (/\bx7\b|g07/.test(blob)) return "x7";
  if (/\bz3\b/.test(blob)) return "z3";
  if (/\bz4\b|e85|e89/.test(blob)) return "z4";
  if (/\bi3\b/.test(blob)) return "i3";
  if (/\bi4\b/.test(blob)) return "i4";
  if (/\bi8\b/.test(blob)) return "i8";
  if (/\bm3\b/.test(blob) && chassis.family === "3") return "seria-3";
  if (/\bm4\b/.test(blob)) return "seria-4";
  if (/\bm5\b/.test(blob)) return "seria-5";
  if (chassis.family === "3") return "seria-3";
  if (chassis.family === "4") return "seria-4";
  if (chassis.family === "5") return "seria-5";
  if (chassis.family === "1") return "seria-1";
  if (chassis.family === "2") return "seria-2";
  if (chassis.family === "luxury") {
    if (/seria 6|6 series|e24|e63|f13/.test(blob)) return "seria-6";
    if (/seria 7|7 series|e23|e32|e38|e65|f01|g11|g70/.test(blob)) return "seria-7";
    if (/seria 8|8 series|e31|g15/.test(blob)) return "seria-8";
  }
  return null;
}

function yearSpan(chassis: Chassis, variant?: VariantBrief): [number, number] {
  if (variant) {
    return engineYearSpan(variant.chassisSlug, variant.model, variant.engine) ?? [variant.year, variant.year];
  }
  return [chassis.yearStart, chassis.yearEnd ?? chassis.yearStart];
}

function otomotoVersionSlug(model: string): string {
  return model
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Market listing deep link for the current chassis / variant years. */
export function otomotoUrl(chassis: Chassis, variant?: VariantBrief): string {
  const [from, to] = yearSpan(chassis, variant);
  const parts = ["osobowe", "bmw"];
  const series = otomotoSeries(chassis);
  if (series) parts.push(series);
  if (variant?.model) parts.push(`ver-${otomotoVersionSlug(variant.model)}`);
  parts.push(`od-${from}`);

  const params = new URLSearchParams();
  params.set("search[filter_float_year:to]", String(to));
  if (variant?.fuel === "diesel") params.set("search[filter_enum_fuel_type]", "diesel");
  if (variant?.fuel === "petrol") params.set("search[filter_enum_fuel_type]", "petrol");

  return `https://www.otomoto.pl/${parts.join("/")}?${params.toString()}`;
}

/** German market listing deep link (BMW make + year band + model text). */
export function mobileDeUrl(chassis: Chassis, variant?: VariantBrief): string {
  const [from, to] = yearSpan(chassis, variant);
  const params = new URLSearchParams({
    dam: "false",
    isSearchRequest: "true",
    s: "Car",
    vc: "Car",
    // BMW make; empty model slots keep the filter open
    ms: "3500;;;",
    fr: `${from}:${to}`,
  });
  if (variant) params.set("q", `${variant.model} ${chassis.code}`.trim());
  else params.set("q", chassis.code);
  return `https://suchen.mobile.de/fahrzeuge/search.html?${params.toString()}`;
}

type AutodocCategory = {
  id: number;
  /** Locale-specific path slug; Autodoc redirects wrong SEO slugs to the canonical one by id. */
  slug: { pl: string; en: string; ru: string };
  match: RegExp;
};

/**
 * Confirmed Autodoc category ids (slug+id). `/search?keyword=` is a soft-404 —
 * deep-link category or OEM pages instead.
 */
const AUTODOC_CATEGORIES: AutodocCategory[] = [
  {
    id: 15065,
    slug: {
      pl: "zestaw-lancucha-rozrzadu",
      en: "timing-chain-kit",
      ru: "komplekt-tsepi-grm",
    },
    match: /timing\s*chain\s*kit|zestaw\s*(łańcucha|lancucha)|комплект\s*цепи/i,
  },
  {
    id: 10511,
    slug: { pl: "lancuch_rozrzadu", en: "timing-chain", ru: "tsep-grm" },
    match: /timing\s*chain|łańcuch|lancuch|цепь\s*грм|vanos|prowadnic/i,
  },
  {
    id: 12903,
    slug: {
      pl: "pompa_wtryskowa_pompa_wysokiego_ciznienia",
      en: "high-pressure-fuel-pump",
      ru: "tnvd",
    },
    match: /hpfp|high\s*pressure\s*fuel|pompa\s*(hpfp|wysokiego)|тнвд/i,
  },
  {
    id: 12899,
    slug: {
      pl: "wtryskiwacz_koncoewka_wtrysku_korpus_wtryskiwacza_pde",
      en: "injector",
      ru: "forsunka",
    },
    match: /injector|wtryskiwacz|форсун/i,
  },
  {
    id: 10817,
    slug: { pl: "pompa_paliwa", en: "fuel-pump", ru: "toplivnyy-nasos" },
    match: /fuel\s*pump|pompa\s*paliwa|топливн(ый|ого)\s*нас/i,
  },
  {
    id: 10572,
    slug: {
      pl: "obudowa_filtra_oleju_uszczelka",
      en: "oil-filter-housing",
      ru: "korpus-maslyanogo-filtra",
    },
    match: /oil\s*filter\s*housing|obudow[ay]\s*filtr|uszczelka\s*obudowy|прокладк.*(масл|корпус)/i,
  },
  {
    id: 10191,
    slug: { pl: "pompa_wodna", en: "water-pump", ru: "pompa-vody" },
    match: /water\s*pump|pompa\s*wod|электрическ(ая|ой)\s*помп|termostat|thermostat/i,
  },
  {
    id: 10212,
    slug: { pl: "zbiornik_wyroewnawczy", en: "expansion-tank", ru: "rasshiritelnyy-bachok" },
    match: /expansion\s*tank|zbiornik\s*wyr|расширительн/i,
  },
  {
    id: 10671,
    slug: {
      pl: "wahacz_poprzeczny_podluzny_ukozny",
      en: "control-arm",
      ru: "rychag",
    },
    match: /control\s*arm|subframe|wahacz|belka|подрамник|рычаг/i,
  },
  {
    id: 10329,
    slug: {
      pl: "uszczelka_kolektora_dolotowego",
      // Autodoc UK canonical slug (other SEO variants redirect by id).
      en: "gasket-intake-manifold",
      ru: "prokladka-vpusknogo-kollektora",
    },
    match: /swirl\s*flap|klapk|kolektor|intake\s*manifold|вихрев|заслонк/i,
  },
];

function autodocHost(locale: Locale): string {
  if (locale === "pl") return "https://www.autodoc.pl";
  if (locale === "ru") return "https://www.autodoc.ru";
  return "https://www.autodoc.co.uk";
}

function autodocPartsRoot(locale: Locale): string {
  if (locale === "pl") return "czesci-zapasowe";
  if (locale === "ru") return "zapchasti";
  return "car-parts";
}

function autodocSlugLocale(locale: Locale): "pl" | "en" | "ru" {
  if (locale === "pl" || locale === "ru") return locale;
  return "en";
}

/** Strip spaces from OEM-looking part numbers (e.g. "11 21 7 571 037"). */
function extractOemNumber(query: string): string | null {
  const compact = query.replace(/[\s-]/g, "");
  // BMW OE numbers are digit-led (optionally one trailing letter). Reject free-text
  // like "BMW E90 wahacz" which also contains digits after space-stripping.
  if (/^\d{8,12}[A-Z]?$/i.test(compact)) return compact.toUpperCase();
  return null;
}

function resolveAutodocCategory(query: string): AutodocCategory | null {
  for (const cat of AUTODOC_CATEGORIES) {
    if (cat.match.test(query)) return cat;
  }
  return null;
}

/**
 * Autodoc model-family path (EN canonical). Local sites rewrite
 * e.g. `3er-reihe` → `seria-3` on PL, and select step 2 in the car picker.
 */
function autodocSeriesSlug(chassis: Chassis): string | null {
  const blob = `${chassis.slug} ${chassis.code} ${chassis.name.en}`.toLowerCase();
  if (/\bx1\b|e84|f48|u11/.test(blob)) return "x1";
  if (/\bx2\b|f39/.test(blob)) return "x2";
  if (/\bx3\b|e83|f25|g01|f97/.test(blob)) return "x3";
  if (/\bx4\b|f26|g02/.test(blob)) return "x4";
  if (/\bx5\b|e53|e70|f15|g05|f85/.test(blob)) return "x5";
  if (/\bx6\b|e71|f16|g06|f86/.test(blob)) return "x6";
  if (/\bx7\b|g07/.test(blob)) return "x7";
  if (/\bz3\b/.test(blob)) return "z3";
  if (/\bz4\b|e85|e89/.test(blob)) return "z4";
  if (/\bi3\b/.test(blob)) return "i3";
  if (/\bi4\b/.test(blob)) return "i4";
  if (/\bi8\b/.test(blob)) return "i8";
  if (chassis.family === "3") return "3er-reihe";
  if (chassis.family === "4") return "4er-reihe";
  if (chassis.family === "5") return "5er-reihe";
  if (chassis.family === "1") return "1er-reihe";
  if (chassis.family === "2") return "2-series";
  if (chassis.family === "luxury") {
    if (/6 series|e24|e63|f13|g15/.test(blob) && !/7 series|8 series/.test(blob)) return "6er-reihe";
    if (/7 series|e23|e32|e38|e65|f01|g11|g70/.test(blob)) return "7er-reihe";
    if (/8 series|e31|g14|g15|g16/.test(blob)) return "8-e31";
  }
  return null;
}

/**
 * Autodoc generation / body path that pre-selects the chassis in the picker.
 * Keys are OhMyCar chassis slugs; values are Autodoc EN path segments.
 */
const AUTODOC_GENERATION: Record<string, string> = {
  e21: "3-e21",
  e30: "3-e30",
  e36: "3-e36",
  "e36-compact": "3-compact-e36",
  e46: "3-e46",
  "e46-compact": "3-compact-e46",
  e90: "3-e90",
  e91: "3-touring-e91",
  e92: "3-coupe-e92",
  e93: "3-convertible-e93",
  f30: "3-f30-f35-f80",
  f31: "3-touring-f31",
  f34: "3-gran-turismo-f34",
  f80: "3-f30-f35-f80",
  g20: "3-g20",
  g21: "3-touring-g21",
  e39: "5-e39",
  e60: "5-e60",
  e61: "5-touring-e61",
  f10: "5-f10-f18",
  f11: "5-touring-f11",
  g30: "5-g30",
  g31: "5-touring-g31",
  e87: "1-e87",
  e81: "1-e81",
  e82: "1-coupe-e82",
  e88: "1-convertible-e88",
  f20: "1-f20",
  f40: "1-f40",
  e84: "x1-e84",
  f48: "x1-f48",
  e83: "x3-e83",
  f25: "x3-f25",
  g01: "x3-g01",
  e53: "x5-e53",
  e70: "x5-e70",
  f15: "x5-f15-f85",
  g05: "x5-g05",
  e71: "x6-e71",
  f16: "x6-f16",
  g06: "x6-g06",
};

type AutodocEngineRow = {
  id: number;
  slug: string;
  hp: number | null;
  yearFrom: number | null;
  yearTo: number | null;
};

/** `318d` / `320d xDrive` → Autodoc badge slug `318-d` / `320-d-xdrive`. */
export function modelToAutodocSlug(model: string): string {
  const compact = model.toLowerCase().replace(/\s+/g, "");
  const withDrive = compact.replace(/xdrive$/, "-xdrive");
  return withDrive.replace(/^(\d+)([a-z].*)$/i, "$1-$2");
}

/**
 * Resolve TecDoc segment `{id}-{slug}` for Autodoc engine step.
 * Prefers year-overlapping rows when Autodoc published years.
 */
export function resolveAutodocEngineSegment(
  chassis?: Chassis | null,
  variant?: VariantBrief | null,
): string | null {
  if (!chassis || !variant) return null;
  const entry = (autodocCars.byChassis as Record<string, { engines?: AutodocEngineRow[] }>)[
    chassis.slug
  ];
  const engines = entry?.engines;
  if (!engines?.length) return null;

  const want = modelToAutodocSlug(variant.model);
  const wantFlat = want.replace(/-/g, "");
  let pool = engines.filter((e) => e.slug === want);
  if (!pool.length) pool = engines.filter((e) => e.slug.replace(/-/g, "") === wantFlat);
  if (!pool.length) return null;

  const yearHits = pool.filter(
    (e) =>
      e.yearFrom != null &&
      e.yearTo != null &&
      variant.year >= e.yearFrom &&
      variant.year <= e.yearTo,
  );
  const pick = (yearHits.length ? yearHits : pool).slice().sort((a, b) => {
    // Prefer rows that published a year window, then higher id stability
    const ay = a.yearFrom != null ? 0 : 1;
    const by = b.yearFrom != null ? 0 : 1;
    return ay - by || a.id - b.id;
  })[0];
  return `${pick.id}-${pick.slug}`;
}

/** `/series/generation[/engine]` so Autodoc selects make + model (+ engine when known). */
export function autodocVehiclePath(
  chassis?: Chassis | null,
  variant?: VariantBrief | null,
): string {
  if (!chassis) return "";
  const series = autodocSeriesSlug(chassis);
  if (!series) return "";
  const generation = AUTODOC_GENERATION[chassis.slug];
  if (!generation) return `/${series}`;
  const engine = resolveAutodocEngineSegment(chassis, variant);
  return engine ? `/${series}/${generation}/${engine}` : `/${series}/${generation}`;
}

function withAutodocVehicle(
  base: string,
  chassis?: Chassis | null,
  variant?: VariantBrief | null,
): string {
  return `${base}${autodocVehiclePath(chassis, variant)}`;
}

/** BMW vehicle parts catalog (when free-text search is unavailable). */
export function autodocBmwUrl(
  locale: Locale,
  chassis?: Chassis | null,
  variant?: VariantBrief | null,
): string {
  const host = autodocHost(locale);
  const root =
    locale === "pl" ? "autoczesci/bmw" : locale === "ru" ? "avtozapchasti/bmw" : "spares/bmw";
  return withAutodocVehicle(`${host}/${root}`, chassis, variant);
}

/**
 * Autodoc deep link from a part query / OEM number.
 * Never uses `/search?keyword=` (404). Pass chassis + variant so model/engine are pre-selected.
 */
export function autodocUrl(
  query: string,
  locale: Locale,
  chassis?: Chassis | null,
  variant?: VariantBrief | null,
): string {
  const host = autodocHost(locale);
  const root = autodocPartsRoot(locale);
  const oem = extractOemNumber(query);
  if (oem) return `${host}/${root}/oem/${oem}`;

  const cat = resolveAutodocCategory(query);
  if (cat) {
    const slug = cat.slug[autodocSlugLocale(locale)];
    return withAutodocVehicle(`${host}/${root}/${slug}-${cat.id}/bmw`, chassis, variant);
  }

  return autodocBmwUrl(locale, chassis, variant);
}

/** Free-text parts search that still works for Inter Cars. */
export function interCarsUrl(query: string): string {
  return `https://intercars.pl/szukaj/?q=${encodeURIComponent(query)}`;
}

/** Canonical parts query from the open briefing page. */
export function partsQuery(chassis: Chassis, variant: VariantBrief): string {
  return [chassis.code, variant.model, variant.engine].filter(Boolean).join(" ");
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

export function formatPlnBand(range: [number, number] | null | undefined, locale: Locale): string {
  if (!range || (range[0] <= 0 && range[1] <= 0)) {
    return "N/A";
  }
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

export function formatPlnBandCompact(range: [number, number] | null | undefined, locale: Locale): string {
  if (!range) return formatPlnBand(range, locale);
  if (range[0] >= 1000 && range[1] >= 1000) {
    const a = formatThousands(range[0], locale);
    const b = formatThousands(range[1], locale);
    return locale === "pl" ? `${a}–${b}\u00a0tys.\u00a0zł` : `PLN ${a}–${b}k`;
  }
  return formatPlnBand(range, locale);
}
