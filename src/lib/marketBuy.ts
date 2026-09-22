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
  e36: "Seria 3",
  "e9x-m3": "Seria 3",
  g20: "Seria 3",
  e21: "Seria 3",
  e30: "Seria 3",
  "e30-m3": "Seria 3",
  "e36-m3": "Seria 3",
  "e46-m3": "Seria 3",
  f80: "M3",
  g80: "M3",
  g81: "M3",
  e60: "Seria 5",
  f10: "Seria 5",
  e39: "Seria 5",
  g30: "Seria 5",
  g60: "Seria 5",
  e12: "Seria 5",
  e28: "Seria 5",
  "e28-m5": "Seria 5",
  e34: "Seria 5",
  "e34-m5": "Seria 5",
  "e39-m5": "Seria 5",
  "e60-m5": "Seria 5",
  "f10-m5": "Seria 5",
  f90: "Seria 5",
  g90: "Seria 5",
  e87: "Seria 1",
  f20: "Seria 1",
  e82: "Seria 1",
  "e82-1m": "Seria 1",
  f40: "Seria 1",
  f22: "Seria 2",
  f45: "Seria 2",
  f44: "Seria 2",
  f87: "Seria 2",
  g42: "Seria 2",
  g87: "Seria 2",
  f32: "Seria 4",
  f36: "Seria 4",
  g22: "Seria 4",
  f82: "M4",
  g82: "M4",
  e70: "X5",
  e53: "X5",
  f15: "X5",
  g05: "X5",
  f85: "X5",
  e83: "X3",
  f25: "X3",
  g01: "X3",
  f97: "X3",
  e84: "X1",
  f48: "X1",
  u11: "X1",
  f39: "X2",
  f26: "X4",
  g02: "X4",
  e71: "X6",
  f16: "X6",
  g06: "X6",
  f86: "X6",
  g07: "X7",
  f01: "Seria 7",
  g11: "Seria 7",
  g70: "Seria 7",
  e23: "Seria 7",
  e32: "Seria 7",
  e38: "Seria 7",
  e65: "Seria 7",
  e24: "Seria 6",
  e63: "Seria 6",
  f13: "Seria 6",
  e31: "Seria 8",
  g15: "Seria 8",
  z3: "Z3",
  "z3-m-coupe": "Z3",
  "e85-z4": "Z4",
  "e89-z4": "Z4",
  i3: "i3",
  i4: "i4",
  i8: "i8",
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
