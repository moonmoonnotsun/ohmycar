import buyMedians from "@/data/imported/buyMedians.json";

type YearRow = {
  median: number;
  p25: number;
  p75: number;
  sample_size: number;
  source_url: string;
};

type FuelSample = {
  year: number;
  fuel: string | null;
  market_model: string;
  median: number;
  p25: number;
  p75: number;
  sample_size: number;
  source_query: string;
  docs: string;
};

const byChassisYear = buyMedians.byChassisYear as Record<string, Record<string, YearRow>>;
const fuelSamples = (buyMedians.fuelSpecificSamples ?? []) as FuelSample[];

/** Map drivetrain source → CarDossier market family for diesel live samples. */
const chassisToMarketModel: Record<string, string> = {
  e90: "Seria 3",
  f30: "Seria 3",
  e46: "Seria 3",
  e60: "Seria 5",
  f10: "Seria 5",
  e39: "Seria 5",
  e87: "Seria 1",
  f20: "Seria 1",
  e70: "X5",
  e83: "X3",
};

/**
 * Prefer fuel-specific live API sample when available, else series-level
 * public year median from CarDossier. Returns null if warehouse has no row
 * (keeps hand-seeded value). Never invents numbers.
 */
export function marketMedianBuyPln(
  chassisSlug: string,
  year: number,
  fuel: "petrol" | "diesel",
): { median: number; source: string; sampleSize: number } | null {
  const market = chassisToMarketModel[chassisSlug];
  if (fuel === "diesel" && market) {
    const hit = fuelSamples.find(
      (s) => s.year === year && s.fuel === "diesel" && s.market_model === market,
    );
    if (hit) {
      return {
        median: hit.median,
        source: `cardossier_api:${hit.source_query}`,
        sampleSize: hit.sample_size,
      };
    }
  }

  const row = byChassisYear[chassisSlug]?.[String(year)];
  if (!row) return null;
  return {
    median: row.median,
    source: row.source_url,
    sampleSize: row.sample_size,
  };
}

export function marketBuyMeta() {
  return buyMedians.meta;
}
