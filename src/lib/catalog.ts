import { chassisList, getChassis } from "@/data/chassis";
import { e90Engines } from "@/data/e90";
import { volumeEngines } from "@/data/volume";
import type { Chassis, EngineLine, Localized, Pain, VariantBrief } from "@/data/types";
import { loc } from "@/data/loc";
import { marketMedianBuyPln } from "@/lib/marketBuy";
import { getWarehousePain, resolvePainId, warehousePains } from "@/lib/warehousePains";
import { deriveEvidencePack } from "@/lib/scoreEvidence";

/** Faults come only from warehouse import — never hand-seeded PLN hypotheses. */
const allPains: Pain[] = warehousePains;

function enginesFor(sourceSlug: string): EngineLine[] | undefined {
  if (sourceSlug === "e90") return e90Engines;
  return volumeEngines[sourceSlug];
}

function painsForLine(
  chassisSlug: string,
  sourceSlug: string,
  engine: string,
  year: number,
  topPainId: string,
): Pain[] {
  const topId = resolvePainId(topPainId);
  return allPains
    .filter((pain) => {
      if (pain.engines.length === 0) {
        if (!pain.chassisSlugs?.length) return true;
        return pain.chassisSlugs.includes(chassisSlug) || pain.chassisSlugs.includes(sourceSlug);
      }
      return pain.engines.includes(engine);
    })
    .filter((pain) => {
      if (!pain.chassisSlugs?.length) return true;
      return pain.chassisSlugs.includes(chassisSlug) || pain.chassisSlugs.includes(sourceSlug);
    })
    .filter((pain) => {
      if (pain.yearFrom && year < pain.yearFrom) return false;
      if (pain.yearTo && year > pain.yearTo) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.id === topId) return -1;
      if (b.id === topId) return 1;
      return severityRank(a.severity) - severityRank(b.severity);
    });
}

function variantsFromLines(chassis: Chassis, lines: EngineLine[]): VariantBrief[] {
  const out: VariantBrief[] = [];
  const sourceSlug = drivetrainChassis(chassis.slug)?.slug ?? chassis.slug;

  for (const line of lines) {
    for (const year of line.years) {
      if (year < chassis.yearStart) continue;
      if (chassis.yearEnd && year > chassis.yearEnd) continue;

      const topPainId = resolvePainId(line.topPainId);
      const pains = painsForLine(chassis.slug, sourceSlug, line.engine, year, topPainId);
      const effectiveTop =
        pains.find((p) => p.id === topPainId)?.id ?? pains[0]?.id ?? topPainId;
      const pack = deriveEvidencePack({
        chassisSlug: chassis.slug,
        sourceSlug,
        pains,
        topPainId: effectiveTop,
      });
      const market = marketMedianBuyPln(sourceSlug, year, line.fuel);

      const brief: VariantBrief = {
        slug: `${year}-${line.model.toLowerCase()}-${line.engine.toLowerCase()}`,
        chassisSlug: chassis.slug,
        chassisCode: chassis.code,
        year,
        model: line.model,
        engine: line.engine,
        fuel: line.fuel,
        score: pack?.score ?? null,
        scoreStatus: pack?.scoreStatus ?? "insufficient",
        medianBuyPln: market?.median ?? null,
        expectedRepairPln: null,
        topPainId: effectiveTop,
        inputs: pack?.inputs ?? null,
        scoreIncomplete: pack?.incomplete,
      };
      brief.expectedRepairPln = fixBandForVariant(brief);
      out.push(brief);
    }
  }

  return out.sort((a, b) => {
    const as = a.score ?? -1;
    const bs = b.score ?? -1;
    return bs - as || a.year - b.year;
  });
}

export function drivetrainChassis(slug: string): Chassis | undefined {
  const chassis = getChassis(slug);
  if (!chassis) return undefined;
  if (chassis.drivetrainOf) return getChassis(chassis.drivetrainOf) ?? chassis;
  return chassis;
}

export function variantsFor(slug: string): VariantBrief[] {
  const chassis = getChassis(slug);
  if (!chassis) return [];
  const source = drivetrainChassis(slug);
  if (!source) return [];
  const lines = enginesFor(source.slug);
  if (!lines) return [];
  return variantsFromLines(chassis, lines);
}

export function getVariant(chassisSlug: string, variantSlug: string): VariantBrief | undefined {
  return variantsFor(chassisSlug).find((item) => item.slug === variantSlug);
}

/** Unique model badges for a chassis, petrol first then diesel, numeric-aware name order. */
export function modelsFor(chassisSlug: string): string[] {
  const byModel = new Map<string, VariantBrief["fuel"]>();
  for (const row of variantsFor(chassisSlug)) {
    if (!byModel.has(row.model)) byModel.set(row.model, row.fuel);
  }
  return [...byModel.entries()]
    .sort((a, b) => {
      if (a[1] !== b[1]) return a[1] === "petrol" ? -1 : 1;
      return a[0].localeCompare(b[0], undefined, { numeric: true });
    })
    .map(([model]) => model);
}

export type YearOption = {
  year: number;
  variant: VariantBrief;
  score: number | null;
};

/** One chip per year for a model. Highest score wins when several engines share a year. */
export function yearOptionsForModel(
  chassisSlug: string,
  model: string,
  preferEngine?: string,
): YearOption[] {
  const rows = variantsFor(chassisSlug).filter((item) => item.model === model);
  const byYear = new Map<number, VariantBrief[]>();
  for (const row of rows) {
    const list = byYear.get(row.year) ?? [];
    list.push(row);
    byYear.set(row.year, list);
  }
  return [...byYear.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, list]) => {
      const variant = pickPreferred(list, preferEngine);
      return { year, variant, score: variant.score };
    });
}

function pickPreferred(
  list: VariantBrief[],
  preferEngine?: string,
  preferFuel?: VariantBrief["fuel"],
): VariantBrief {
  let pool = list;
  if (preferEngine) {
    const matched = pool.filter((item) => item.engine === preferEngine);
    if (matched.length) pool = matched;
  }
  if (preferFuel) {
    const matched = pool.filter((item) => item.fuel === preferFuel);
    if (matched.length) pool = matched;
  }
  return [...pool].sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || b.year - a.year)[0];
}

/** Resolve a briefing cell when switching model/year chips. */
export function resolveVariant(opts: {
  chassisSlug: string;
  model: string;
  year?: number;
  preferEngine?: string;
  preferFuel?: VariantBrief["fuel"];
}): VariantBrief | undefined {
  const { chassisSlug, model, year, preferEngine, preferFuel } = opts;
  const rows = variantsFor(chassisSlug).filter((item) => item.model === model);
  if (rows.length === 0) return undefined;

  if (year != null) {
    const atYear = rows.filter((item) => item.year === year);
    if (atYear.length) return pickPreferred(atYear, preferEngine, preferFuel);
    const years = [...new Set(rows.map((item) => item.year))];
    const nearest = years.reduce((best, value) =>
      Math.abs(value - year) < Math.abs(best - year) ? value : best,
    );
    return pickPreferred(
      rows.filter((item) => item.year === nearest),
      preferEngine,
      preferFuel,
    );
  }

  return pickPreferred(rows, preferEngine, preferFuel);
}

/** Parse `chassis/variant` compare slot keys. */
export function parseCompareSlot(raw: string | null | undefined): {
  chassisSlug: string;
  variantSlug: string;
} | null {
  if (!raw) return null;
  const parts = raw.split("/").filter(Boolean);
  if (parts.length !== 2) return null;
  const [chassisSlug, variantSlug] = parts;
  if (!getVariant(chassisSlug, variantSlug)) return null;
  return { chassisSlug, variantSlug };
}

export function compareSlotKey(chassisSlug: string, variantSlug: string) {
  return `${chassisSlug}/${variantSlug}`;
}

function painFitsChassis(pain: Pain, variant: VariantBrief, sourceSlug: string): boolean {
  if (!pain.chassisSlugs?.length) return true;
  return pain.chassisSlugs.includes(variant.chassisSlug) || pain.chassisSlugs.includes(sourceSlug);
}

export function painsForVariant(variant: VariantBrief): Pain[] {
  const source = drivetrainChassis(variant.chassisSlug);
  if (!source || !enginesFor(source.slug)) return [];
  return painsForLine(
    variant.chassisSlug,
    source.slug,
    variant.engine,
    variant.year,
    variant.topPainId,
  ).filter((pain) => painFitsChassis(pain, variant, source.slug));
}

function severityRank(severity: Pain["severity"]): number {
  const order: Pain["severity"][] = [
    "engine-loss",
    "safety",
    "expensive",
    "overheat",
    "stranded",
    "annoyance",
  ];
  return order.indexOf(severity);
}

export function getPain(id: string): Pain | undefined {
  return getWarehousePain(id);
}

export function engineYearSpan(chassisSlug: string, model: string, engine: string): [number, number] | null {
  const years = variantsFor(chassisSlug)
    .filter((item) => item.model === model && item.engine === engine)
    .map((item) => item.year);
  if (years.length === 0) return null;
  return [Math.min(...years), Math.max(...years)];
}

function roundPln(n: number) {
  return Math.round(n / 100) * 100;
}

/** Independent-PL envelope from warehouse-quoted pains only. Null if none quoted yet. */
export function fixBandForVariant(variant: VariantBrief): [number, number] | null {
  const pains = painsForVariant(variant);
  // Skip free/campaign [0,0] bands (e.g. Takata) — same rule as scoreEvidence.
  const quoted = pains.filter((pain) => {
    const band = pain.plnIndependent;
    return Boolean(band && !(band[0] <= 0 && band[1] <= 0));
  });
  if (quoted.length === 0) return null;
  const topId = resolvePainId(variant.topPainId);
  const headline = quoted.find((pain) => pain.id === topId) ?? quoted[0];
  const hi = headline.plnIndependent!;
  const restLow = quoted
    .filter((pain) => pain.id !== headline.id)
    .reduce((sum, pain) => sum + (pain.plnIndependent?.[0] ?? 0), 0);
  const band: [number, number] = [roundPln(hi[0]), roundPln(hi[1] + restLow)];
  if (band[0] <= 0 && band[1] <= 0) return null;
  return band;
}

export function chassisFixBand(slug: string): [number, number] | null {
  return fixBandForVariants(variantsFor(slug));
}

export function fixBandForVariants(variants: VariantBrief[]): [number, number] | null {
  const bands = variants.map((item) => item.expectedRepairPln).filter((b): b is [number, number] => Boolean(b));
  if (bands.length === 0) return null;
  return [Math.min(...bands.map((b) => b[0])), Math.max(...bands.map((b) => b[1]))];
}

export type SearchHit = {
  chassis: Chassis;
  reason?: Localized;
};

const BADGE_HITS: { query: string; slugs: string[]; reason: Localized }[] = [
  {
    query: "330i",
    slugs: ["e46", "e90", "f30", "g20"],
    reason: loc(
      "Same badge — E90 NA six vs F30 turbo four",
      "Ten sam znaczek — E90 wolnossąca szóstka vs F30 turbo czwórka",
      "Один шильдик — E90 атмосферная шестёрка vs F30 турбо четвёрка",
    ),
  },
  {
    query: "330d",
    slugs: ["e46", "e90", "f30", "g20"],
    reason: loc("3.0 diesel — split the generations", "Diesel 3.0 — rozdziel generacje", "Дизель 3.0 — не путайте поколения"),
  },
  {
    query: "320d",
    slugs: ["e46", "e90", "f30", "g20", "e87"],
    reason: loc(
      "The common diesel in Poland — do not mix N47 with B47",
      "Najczęstszy diesel w PL — nie mieszaj N47 z B47",
      "Частый дизель в Польше — не путайте N47 с B47",
    ),
  },
];

export function searchChassis(raw: string): SearchHit[] {
  const q = raw.trim().toLowerCase();
  if (!q) return [];

  const badge = BADGE_HITS.find((item) => q === item.query || q.includes(item.query));
  if (badge && q.length <= 8) {
    return badge.slugs
      .map((slug) => getChassis(slug))
      .filter((item): item is Chassis => Boolean(item))
      .map((chassis) => ({ chassis, reason: badge.reason }));
  }

  const scored = chassisList
    .map((chassis) => {
      const hay = chassis.search.join(" ");
      let rank = 0;
      if (chassis.slug === q || chassis.code.toLowerCase() === q) rank = 100;
      else if (chassis.search.some((term) => term === q)) rank = 90;
      else if (chassis.search.some((term) => term.startsWith(q))) rank = 70;
      else if (hay.includes(q)) rank = 40;
      if (chassis.gold && rank > 0) rank += 5;
      return { chassis, rank };
    })
    .filter((item) => item.rank > 0)
    .sort((a, b) => b.rank - a.rank || a.chassis.yearStart - b.chassis.yearStart);

  return scored.slice(0, 12).map((item) => ({ chassis: item.chassis }));
}

export function relatedBodies(slug: string): Chassis[] {
  const source = drivetrainChassis(slug);
  if (!source) return [];
  const family = chassisList.filter(
    (item) => item.slug === source.slug || item.drivetrainOf === source.slug,
  );
  return family.length > 1 ? family : [];
}

export function isScoredChassis(chassis: Chassis): boolean {
  return variantsFor(chassis.slug).some((v) => v.score != null);
}

export function variantFacets(variants: VariantBrief[]) {
  return {
    years: [...new Set(variants.map((item) => item.year))].sort((a, b) => a - b),
    engines: [...new Set(variants.map((item) => item.engine))].sort(),
    models: [...new Set(variants.map((item) => item.model))].sort(),
    fuels: [...new Set(variants.map((item) => item.fuel))],
  };
}

export function summarizeVariants(variants: VariantBrief[]) {
  if (variants.length === 0) return null;
  const scored = variants.filter((item) => item.score != null);
  const pool = scored.length > 0 ? scored : variants;
  return {
    count: variants.length,
    scoredCount: scored.length,
    hasScore: scored.length > 0,
    best: pool.reduce((a, b) => ((a.score ?? -1) >= (b.score ?? -1) ? a : b)),
    worst: pool.reduce((a, b) => ((a.score ?? 999) <= (b.score ?? 999) ? a : b)),
  };
}

export function chassisSummary(slug: string) {
  const variants = variantsFor(slug);
  const summary = summarizeVariants(variants);
  if (!summary) return null;
  return { ...summary, fixBand: fixBandForVariants(variants) };
}

export type ListMark = "best" | "worst";

/** Among chassis with evidence scores: highest best-engine, lowest worst-engine. */
export function listScoreMarks(items: Chassis[]): Map<string, ListMark[]> {
  const scored = items
    .map((chassis) => ({ chassis, summary: summarizeVariants(variantsFor(chassis.slug)) }))
    .filter(
      (item): item is { chassis: Chassis; summary: NonNullable<typeof item.summary> } =>
        Boolean(item.summary?.hasScore),
    );
  const marks = new Map<string, ListMark[]>();
  if (scored.length === 0) return marks;

  const best = scored.reduce((a, b) =>
    (a.summary.best.score ?? -1) >= (b.summary.best.score ?? -1) ? a : b,
  );
  const worst = scored.reduce((a, b) =>
    (a.summary.worst.score ?? 999) <= (b.summary.worst.score ?? 999) ? a : b,
  );
  const add = (slug: string, mark: ListMark) => {
    const current = marks.get(slug) ?? [];
    if (!current.includes(mark)) marks.set(slug, [...current, mark]);
  };
  add(best.chassis.slug, "best");
  add(worst.chassis.slug, "worst");
  return marks;
}

export { chassisList };
