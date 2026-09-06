import { chassisList, getChassis } from "@/data/chassis";
import { e90Engines, e90Pains } from "@/data/e90";
import { volumeEngines, volumePains } from "@/data/volume";
import type { Chassis, EngineLine, Localized, Pain, VariantBrief } from "@/data/types";
import { loc } from "@/data/loc";
import { scoreFromInputs } from "@/lib/score";

const allPains: Pain[] = [...e90Pains, ...volumePains];
const painById = new Map<string, Pain>();
for (const pain of allPains) {
  if (!painById.has(pain.id)) painById.set(pain.id, pain);
}

function enginesFor(sourceSlug: string): EngineLine[] | undefined {
  if (sourceSlug === "e90") return e90Engines;
  return volumeEngines[sourceSlug];
}

function variantsFromLines(chassis: Chassis, lines: EngineLine[]): VariantBrief[] {
  const out: VariantBrief[] = [];
  for (const line of lines) {
    for (const year of line.years) {
      if (year < chassis.yearStart) continue;
      if (chassis.yearEnd && year > chassis.yearEnd) continue;
      const inputs = line.inputsByYear[year];
      if (!inputs) continue;
      const brief: VariantBrief = {
        slug: `${year}-${line.model.toLowerCase()}-${line.engine.toLowerCase()}`,
        chassisSlug: chassis.slug,
        chassisCode: chassis.code,
        year,
        model: line.model,
        engine: line.engine,
        fuel: line.fuel,
        score: scoreFromInputs(inputs),
        scoreStatus: "hypothesis",
        medianBuyPln: line.medianBuyPlnByYear[year] ?? 0,
        expectedRepairPln: line.repairPln,
        topPainId: line.topPainId,
        inputs,
      };
      brief.expectedRepairPln = fixBandForVariant(brief);
      out.push(brief);
    }
  }
  return out.sort((a, b) => b.score - a.score || a.year - b.year);
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

function painFitsChassis(pain: Pain, variant: VariantBrief, sourceSlug: string): boolean {
  if (!pain.chassisSlugs?.length) return true;
  return pain.chassisSlugs.includes(variant.chassisSlug) || pain.chassisSlugs.includes(sourceSlug);
}

export function painsForVariant(variant: VariantBrief): Pain[] {
  const source = drivetrainChassis(variant.chassisSlug);
  if (!source || !enginesFor(source.slug)) return [];
  return allPains
    .filter((pain) => pain.engines.includes(variant.engine))
    .filter((pain) => painFitsChassis(pain, variant, source.slug))
    .filter((pain) => {
      if (pain.yearFrom && variant.year < pain.yearFrom) return false;
      if (pain.yearTo && variant.year > pain.yearTo) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.id === variant.topPainId) return -1;
      if (b.id === variant.topPainId) return 1;
      return severityRank(a.severity) - severityRank(b.severity);
    });
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
  return painById.get(id);
}

function roundPln(n: number) {
  return Math.round(n / 100) * 100;
}

/** Independent-PL envelope: headline job floor → headline high plus other jobs’ floors. */
export function fixBandForVariant(variant: VariantBrief): [number, number] {
  const pains = painsForVariant(variant);
  if (pains.length === 0) return variant.expectedRepairPln;
  const headline = pains.find((pain) => pain.id === variant.topPainId) ?? pains[0];
  const restLow = pains
    .filter((pain) => pain.id !== headline.id)
    .reduce((sum, pain) => sum + pain.plnIndependent[0], 0);
  return [roundPln(headline.plnIndependent[0]), roundPln(headline.plnIndependent[1] + restLow)];
}

export function chassisFixBand(slug: string): [number, number] | null {
  return fixBandForVariants(variantsFor(slug));
}

export function fixBandForVariants(variants: VariantBrief[]): [number, number] | null {
  if (variants.length === 0) return null;
  return [
    Math.min(...variants.map((item) => item.expectedRepairPln[0])),
    Math.max(...variants.map((item) => item.expectedRepairPln[1])),
  ];
}

export type SearchHit = {
  chassis: Chassis;
  reason?: Localized;
};

const BADGE_HITS: { query: string; slugs: string[]; reason: Localized }[] = [
  {
    query: "330i",
    slugs: ["e46", "e90", "f30", "g20"],
    reason: loc("Same badge, four cars", "Ten sam znaczek, cztery auta", "Один шильдик, четыре машины"),
  },
  {
    query: "330d",
    slugs: ["e46", "e90", "f30", "g20"],
    reason: loc("3.0 diesel — split the generations", "Diesel 3.0 — rozdziel generacje", "Дизель 3.0 — не смешивай поколения"),
  },
  {
    query: "320d",
    slugs: ["e46", "e90", "f30", "g20", "e87"],
    reason: loc(
      "Poland’s default diesel — do not blend N47 with B47",
      "Najczęstszy diesel w PL — nie mieszaj N47 z B47",
      "Главный дизель в Польше — не мешай N47 с B47",
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
  return variantsFor(chassis.slug).length > 0;
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
  return {
    count: variants.length,
    best: variants.reduce((a, b) => (a.score >= b.score ? a : b)),
    worst: variants.reduce((a, b) => (a.score <= b.score ? a : b)),
  };
}

export function chassisSummary(slug: string) {
  const variants = variantsFor(slug);
  const summary = summarizeVariants(variants);
  if (!summary) return null;
  return { ...summary, fixBand: fixBandForVariants(variants)! };
}

export type ListMark = "best" | "worst";

/** Among scored chassis in this list: highest best-engine, lowest worst-engine. */
export function listScoreMarks(items: Chassis[]): Map<string, ListMark[]> {
  const scored = items
    .map((chassis) => ({ chassis, summary: summarizeVariants(variantsFor(chassis.slug)) }))
    .filter((item): item is { chassis: Chassis; summary: NonNullable<typeof item.summary> } => Boolean(item.summary));
  const marks = new Map<string, ListMark[]>();
  if (scored.length === 0) return marks;

  const best = scored.reduce((a, b) => (a.summary.best.score >= b.summary.best.score ? a : b));
  const worst = scored.reduce((a, b) => (a.summary.worst.score <= b.summary.worst.score ? a : b));
  const add = (slug: string, mark: ListMark) => {
    const current = marks.get(slug) ?? [];
    if (!current.includes(mark)) marks.set(slug, [...current, mark]);
  };
  add(best.chassis.slug, "best");
  add(worst.chassis.slug, "worst");
  return marks;
}

export { chassisList };
