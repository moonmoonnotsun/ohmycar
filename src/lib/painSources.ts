/**
 * Pain source display helpers — cell-honest labels / Autodoc queries.
 * See data/SOURCE_DISPLAY_REFINEMENT.md.
 */
import type { Locale } from "@/lib/locale";
import type { Localized, Pain } from "@/data/types";

export type PainSourceRole = "primary" | "family_prior" | "pln_band" | "context";

export type PainSource = {
  label: string;
  url: string;
  appliesEngines?: string[];
  appliesChassis?: string[];
  role?: PainSourceRole;
};

const ENGINE_IN_TEXT = /\b(N\d{2}|M\d{2}|B\d{2}|S\d{2}|HA0|IBE0|IB1)\b/gi;
const CHASSIS_IN_TEXT = /\b([EFGIZU]\d{2}(?:-[a-z0-9]+)?)\b/gi;
const PRIOR_RE = /\b(prior|family|reused|applied to|same family)\b/i;
/** NHTSA "SI B11 03 17" — B11 is a bulletin id, not an engine. */
const SI_FALSE = /\bSI\s*B\d{2}\b/gi;

function stripSiNoise(text: string): string {
  return text.replace(SI_FALSE, " ");
}

function enginesFromText(text: string): string[] {
  return [...new Set((stripSiNoise(text).match(ENGINE_IN_TEXT) ?? []).map((e) => e.toUpperCase()))];
}

function chassisFromText(text: string): string[] {
  return [...new Set((text.match(CHASSIS_IN_TEXT) ?? []).map((c) => c.toLowerCase()))];
}

function chassisStem(slug: string): string {
  return slug.split("-")[0].toUpperCase();
}

export function normalizePainSource(raw: {
  label: string;
  url: string;
  applies_engines?: string[];
  applies_chassis?: string[];
  role?: PainSourceRole;
}): PainSource {
  const label = raw.label;
  const url = raw.url;
  const appliesEngines =
    raw.applies_engines?.map((e) => e.toUpperCase()) ?? enginesFromText(`${label} ${url}`);
  const appliesChassis =
    raw.applies_chassis?.map((c) => c.toLowerCase()) ?? chassisFromText(label);
  let role = raw.role;
  if (!role && PRIOR_RE.test(label)) role = "family_prior";
  if (!role && /^PLN\b/i.test(label)) role = "pln_band";
  return {
    label,
    url,
    appliesEngines: appliesEngines.length ? appliesEngines : undefined,
    appliesChassis: appliesChassis.length ? appliesChassis : undefined,
    role,
  };
}

export function filterPainSources(
  sources: PainSource[],
  opts: { engine?: string; chassisSlug?: string },
): PainSource[] {
  const engine = opts.engine?.toUpperCase();
  const stem = opts.chassisSlug ? chassisStem(opts.chassisSlug) : undefined;

  const matched = sources.filter((s) => {
    const role = s.role ?? "primary";
    if (role === "family_prior" || role === "pln_band" || role === "context") return true;
    const engOk =
      !s.appliesEngines?.length || !engine || s.appliesEngines.includes(engine);
    const chOk =
      !s.appliesChassis?.length ||
      !opts.chassisSlug ||
      s.appliesChassis.some((c) => c.toLowerCase() === opts.chassisSlug!.toLowerCase() || c.toUpperCase() === stem);
    return engOk && chOk;
  });

  const pool = matched.length > 0 ? matched : sources.filter((s) => s.role === "family_prior" || s.role === "pln_band");
  const list = pool.length > 0 ? pool : sources;
  const seen = new Set<string>();
  return list.filter((s) => {
    if (seen.has(s.url)) return false;
    seen.add(s.url);
    return true;
  });
}

const PRICE_HOST =
  /cenauslug|polecany|smorawinski|autokult|kosztserwisu|hypertech|skanyx|admserwis|rozrzad\.pl|gearmar|bmwstore|oryginalne-czesci/i;

/** Sources that justify independent / specialist / ASO PLN bands. */
export function isPriceSource(source: PainSource): boolean {
  return (
    source.role === "pln_band" ||
    /^PLN\b/i.test(source.label) ||
    PRICE_HOST.test(source.url)
  );
}

export function filterPriceSources(
  sources: PainSource[],
  opts: { engine?: string; chassisSlug?: string } = {},
): PainSource[] {
  return filterPainSources(sources, opts).filter(isPriceSource);
}

export function displaySourceLabel(
  source: PainSource,
  opts: { engine?: string; chassisSlug?: string; familyPriorPrefix?: string },
): string {
  const engine = opts.engine?.toUpperCase();
  const stem = opts.chassisSlug ? chassisStem(opts.chassisSlug) : undefined;
  const role = source.role ?? "primary";
  const engMismatch =
    Boolean(source.appliesEngines?.length && engine && !source.appliesEngines.includes(engine));
  const chMismatch = Boolean(
    source.appliesChassis?.length &&
      opts.chassisSlug &&
      !source.appliesChassis.some(
        (c) => c.toLowerCase() === opts.chassisSlug!.toLowerCase() || c.toUpperCase() === stem,
      ),
  );
  const prefix = opts.familyPriorPrefix ?? "Family prior";
  if (role === "family_prior" || engMismatch || chMismatch) {
    if (new RegExp(`^${prefix}\\b`, "i").test(source.label) || /^Family prior/i.test(source.label)) {
      return source.label;
    }
    return `${prefix} · ${source.label}`;
  }
  return source.label;
}

export function autodocQueryFor(pain: Pain, locale: Locale, engine?: string): string {
  const byEng = engine && pain.autodocQueryByEngine?.[engine];
  if (byEng) return byEng[locale] || byEng.en;
  const base = pain.autodocQuery[locale] || pain.autodocQuery.en;
  if (!engine) return base;
  const packEngines = pain.engines.map((e) => e.toUpperCase());
  const hit = enginesFromText(base);
  if (!hit.length) {
    return /\bBMW\b/i.test(base) ? base.replace(/\bBMW\b/i, `BMW ${engine}`) : `${base} ${engine}`;
  }
  const upper = engine.toUpperCase();
  if (packEngines.includes(upper) && !hit.includes(upper)) {
    for (const code of hit) {
      if (packEngines.includes(code) && code !== upper) {
        return base.replace(new RegExp(`\\b${code}\\b`, "i"), engine);
      }
    }
  }
  return base;
}
