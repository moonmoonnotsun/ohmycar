import type { EngineLine, SeedScoreInputs } from "./types";

function fillYears(
  years: number[],
  start: SeedScoreInputs,
  end: SeedScoreInputs,
): Record<number, SeedScoreInputs> {
  if (years.length === 1) return { [years[0]]: start };
  const last = years.length - 1;
  const out: Record<number, SeedScoreInputs> = {};
  for (let i = 0; i < years.length; i++) {
    const t = i / last;
    out[years[i]] = {
      catastrophe: lerp(start.catastrophe, end.catastrophe, t),
      expectedFix5yPln: lerp(start.expectedFix5yPln, end.expectedFix5yPln, t),
      painLoad: lerp(start.painLoad, end.painLoad, t),
      campaigns: lerp(start.campaigns, end.campaigns, t),
      partsReality: lerp(start.partsReality, end.partsReality, t),
    };
  }
  return out;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function buy(years: number[], start: number, end: number): Record<number, number> {
  const out: Record<number, number> = {};
  const last = Math.max(years.length - 1, 1);
  for (let i = 0; i < years.length; i++) {
    out[years[i]] = Math.round(lerp(start, end, i / last) / 500) * 500;
  }
  return out;
}

const n52: SeedScoreInputs = {
  catastrophe: 0.12,
  expectedFix5yPln: 3200,
  painLoad: 0.22,
  campaigns: 0.09,
  partsReality: 0.9,
};

const n47Early: SeedScoreInputs = {
  catastrophe: 0.98,
  expectedFix5yPln: 16000,
  painLoad: 0.72,
  campaigns: 0.35,
  partsReality: 0.88,
};

const n47Late: SeedScoreInputs = {
  catastrophe: 0.92,
  expectedFix5yPln: 14000,
  painLoad: 0.65,
  campaigns: 0.2,
  partsReality: 0.9,
};

export const e90Engines: EngineLine[] = [
  {
    model: "318i",
    engine: "N46",
    fuel: "petrol",
    years: [2005, 2006, 2007],
    topPainId: "timing-guides",
    medianBuyPlnByYear: buy([2005, 2006, 2007], 14000, 16500),
    repairPln: [1500, 4000],
    inputsByYear: fillYears(
      [2005, 2006, 2007],
      { catastrophe: 0.18, expectedFix5yPln: 4500, painLoad: 0.35, campaigns: 0.08, partsReality: 0.86 },
      { catastrophe: 0.2, expectedFix5yPln: 4800, painLoad: 0.38, campaigns: 0.08, partsReality: 0.84 },
    ),
  },
  {
    model: "318i",
    engine: "N43",
    fuel: "petrol",
    years: [2007, 2008, 2009, 2010, 2011],
    topPainId: "n43-injectors",
    medianBuyPlnByYear: buy([2007, 2008, 2009, 2010, 2011], 16000, 19500),
    repairPln: [4000, 9000],
    inputsByYear: fillYears(
      [2007, 2008, 2009, 2010, 2011],
      { catastrophe: 0.42, expectedFix5yPln: 9000, painLoad: 0.55, campaigns: 0.18, partsReality: 0.72 },
      { catastrophe: 0.38, expectedFix5yPln: 8200, painLoad: 0.5, campaigns: 0.14, partsReality: 0.75 },
    ),
  },
  {
    model: "320i",
    engine: "N46",
    fuel: "petrol",
    years: [2005, 2006, 2007],
    topPainId: "timing-guides",
    medianBuyPlnByYear: buy([2005, 2006, 2007], 15000, 17500),
    repairPln: [1500, 4000],
    inputsByYear: fillYears(
      [2005, 2006, 2007],
      { catastrophe: 0.18, expectedFix5yPln: 4500, painLoad: 0.34, campaigns: 0.08, partsReality: 0.86 },
      { catastrophe: 0.19, expectedFix5yPln: 4700, painLoad: 0.36, campaigns: 0.08, partsReality: 0.85 },
    ),
  },
  {
    model: "320i",
    engine: "N43",
    fuel: "petrol",
    years: [2007, 2008, 2009, 2010, 2011],
    topPainId: "n43-injectors",
    medianBuyPlnByYear: buy([2007, 2008, 2009, 2010, 2011], 17000, 21000),
    repairPln: [4000, 9000],
    inputsByYear: fillYears(
      [2007, 2008, 2009, 2010, 2011],
      { catastrophe: 0.4, expectedFix5yPln: 8800, painLoad: 0.52, campaigns: 0.16, partsReality: 0.73 },
      { catastrophe: 0.36, expectedFix5yPln: 8000, painLoad: 0.48, campaigns: 0.12, partsReality: 0.76 },
    ),
  },
  {
    model: "325i",
    engine: "N52",
    fuel: "petrol",
    years: [2005, 2006, 2007],
    topPainId: "water-pump",
    medianBuyPlnByYear: buy([2005, 2006, 2007], 18000, 22000),
    repairPln: [1500, 3500],
    inputsByYear: fillYears(
      [2005, 2006, 2007],
      { ...n52, catastrophe: 0.13, expectedFix5yPln: 3400 },
      { ...n52, catastrophe: 0.14, expectedFix5yPln: 3600, painLoad: 0.24 },
    ),
  },
  {
    model: "325i",
    engine: "N53",
    fuel: "petrol",
    years: [2007, 2008, 2009, 2010, 2011],
    topPainId: "n53-injectors",
    medianBuyPlnByYear: buy([2007, 2008, 2009, 2010, 2011], 19000, 24000),
    repairPln: [6000, 14000],
    inputsByYear: fillYears(
      [2007, 2008, 2009, 2010, 2011],
      { catastrophe: 0.7, expectedFix5yPln: 12000, painLoad: 0.62, campaigns: 0.22, partsReality: 0.55 },
      { catastrophe: 0.66, expectedFix5yPln: 11000, painLoad: 0.58, campaigns: 0.18, partsReality: 0.58 },
    ),
  },
  {
    model: "330i",
    engine: "N52",
    fuel: "petrol",
    years: [2005, 2006, 2007],
    topPainId: "water-pump",
    medianBuyPlnByYear: { 2005: 22000, 2006: 24000, 2007: 26500 },
    repairPln: [1500, 4000],
    inputsByYear: {
      2005: n52,
      2006: { ...n52, expectedFix5yPln: 3400, painLoad: 0.23 },
      2007: { ...n52, expectedFix5yPln: 3600, painLoad: 0.24, catastrophe: 0.13 },
    },
  },
  {
    model: "330i",
    engine: "N53",
    fuel: "petrol",
    years: [2007, 2008, 2009, 2010, 2011],
    topPainId: "n53-injectors",
    medianBuyPlnByYear: buy([2007, 2008, 2009, 2010, 2011], 20000, 25500),
    repairPln: [6000, 14000],
    inputsByYear: fillYears(
      [2007, 2008, 2009, 2010, 2011],
      { catastrophe: 0.72, expectedFix5yPln: 12500, painLoad: 0.64, campaigns: 0.24, partsReality: 0.52 },
      { catastrophe: 0.68, expectedFix5yPln: 11500, painLoad: 0.6, campaigns: 0.2, partsReality: 0.55 },
    ),
  },
  {
    model: "335i",
    engine: "N54",
    fuel: "petrol",
    years: [2006, 2007, 2008, 2009, 2010],
    topPainId: "n54-hpfp",
    medianBuyPlnByYear: buy([2006, 2007, 2008, 2009, 2010], 26000, 34000),
    repairPln: [4000, 10000],
    inputsByYear: fillYears(
      [2006, 2007, 2008, 2009, 2010],
      { catastrophe: 0.55, expectedFix5yPln: 11000, painLoad: 0.7, campaigns: 0.28, partsReality: 0.8 },
      { catastrophe: 0.5, expectedFix5yPln: 9500, painLoad: 0.62, campaigns: 0.22, partsReality: 0.82 },
    ),
  },
  {
    model: "335i",
    engine: "N55",
    fuel: "petrol",
    years: [2010, 2011, 2012],
    topPainId: "water-pump",
    medianBuyPlnByYear: { 2010: 36000, 2011: 39000, 2012: 42000 },
    repairPln: [2000, 6000],
    inputsByYear: fillYears(
      [2010, 2011, 2012],
      { catastrophe: 0.28, expectedFix5yPln: 6500, painLoad: 0.4, campaigns: 0.14, partsReality: 0.85 },
      { catastrophe: 0.24, expectedFix5yPln: 5800, painLoad: 0.36, campaigns: 0.12, partsReality: 0.87 },
    ),
  },
  {
    model: "318d",
    engine: "M47",
    fuel: "diesel",
    years: [2005, 2006, 2007],
    topPainId: "swirl-flaps",
    medianBuyPlnByYear: buy([2005, 2006, 2007], 13000, 15500),
    repairPln: [1500, 4000],
    inputsByYear: fillYears(
      [2005, 2006, 2007],
      { catastrophe: 0.32, expectedFix5yPln: 5500, painLoad: 0.42, campaigns: 0.1, partsReality: 0.88 },
      { catastrophe: 0.3, expectedFix5yPln: 5200, painLoad: 0.4, campaigns: 0.1, partsReality: 0.88 },
    ),
  },
  {
    model: "318d",
    engine: "N47",
    fuel: "diesel",
    years: [2007, 2008, 2009, 2010, 2011],
    topPainId: "n47-chain",
    medianBuyPlnByYear: buy([2007, 2008, 2009, 2010, 2011], 14500, 18500),
    repairPln: [4000, 14000],
    inputsByYear: fillYears([2007, 2008, 2009, 2010, 2011], n47Early, n47Late),
  },
  {
    model: "320d",
    engine: "M47",
    fuel: "diesel",
    years: [2005, 2006, 2007],
    topPainId: "swirl-flaps",
    medianBuyPlnByYear: buy([2005, 2006, 2007], 15500, 18500),
    repairPln: [1500, 4500],
    inputsByYear: fillYears(
      [2005, 2006, 2007],
      { catastrophe: 0.3, expectedFix5yPln: 5200, painLoad: 0.4, campaigns: 0.1, partsReality: 0.9 },
      { catastrophe: 0.28, expectedFix5yPln: 5000, painLoad: 0.38, campaigns: 0.1, partsReality: 0.9 },
    ),
  },
  {
    model: "320d",
    engine: "N47",
    fuel: "diesel",
    years: [2007, 2008, 2009, 2010, 2011, 2012],
    topPainId: "n47-chain",
    medianBuyPlnByYear: {
      2007: 15500,
      2008: 16500,
      2009: 17500,
      2010: 18500,
      2011: 19500,
      2012: 21000,
    },
    repairPln: [4000, 14000],
    inputsByYear: {
      ...fillYears([2007, 2008, 2009, 2010], n47Early, {
        catastrophe: 0.94,
        expectedFix5yPln: 14800,
        painLoad: 0.68,
        campaigns: 0.25,
        partsReality: 0.89,
      }),
      2011: n47Late,
      2012: { ...n47Late, catastrophe: 0.9, expectedFix5yPln: 13500, painLoad: 0.62 },
    },
  },
  {
    model: "325d",
    engine: "M57",
    fuel: "diesel",
    years: [2006, 2007, 2008, 2009, 2010],
    topPainId: "swirl-flaps",
    medianBuyPlnByYear: buy([2006, 2007, 2008, 2009, 2010], 20000, 28000),
    repairPln: [2000, 8000],
    inputsByYear: fillYears(
      [2006, 2007, 2008, 2009, 2010],
      { catastrophe: 0.22, expectedFix5yPln: 6000, painLoad: 0.36, campaigns: 0.12, partsReality: 0.86 },
      { catastrophe: 0.2, expectedFix5yPln: 5500, painLoad: 0.34, campaigns: 0.1, partsReality: 0.86 },
    ),
  },
  {
    model: "330d",
    engine: "M57",
    fuel: "diesel",
    years: [2005, 2006, 2007, 2008],
    topPainId: "swirl-flaps",
    medianBuyPlnByYear: buy([2005, 2006, 2007, 2008], 22000, 30000),
    repairPln: [2000, 8000],
    inputsByYear: fillYears(
      [2005, 2006, 2007, 2008],
      { catastrophe: 0.2, expectedFix5yPln: 5800, painLoad: 0.34, campaigns: 0.1, partsReality: 0.88 },
      { catastrophe: 0.18, expectedFix5yPln: 5400, painLoad: 0.32, campaigns: 0.1, partsReality: 0.88 },
    ),
  },
  {
    model: "330d",
    engine: "N57",
    fuel: "diesel",
    years: [2008, 2009, 2010, 2011, 2012],
    topPainId: "n57-timing",
    medianBuyPlnByYear: buy([2008, 2009, 2010, 2011, 2012], 28000, 38000),
    repairPln: [3000, 9000],
    inputsByYear: fillYears(
      [2008, 2009, 2010, 2011, 2012],
      { catastrophe: 0.38, expectedFix5yPln: 8000, painLoad: 0.45, campaigns: 0.16, partsReality: 0.8 },
      { catastrophe: 0.32, expectedFix5yPln: 7200, painLoad: 0.4, campaigns: 0.12, partsReality: 0.82 },
    ),
  },
  {
    model: "335d",
    engine: "M57",
    fuel: "diesel",
    years: [2006, 2007, 2008, 2009, 2010, 2011],
    topPainId: "swirl-flaps",
    medianBuyPlnByYear: buy([2006, 2007, 2008, 2009, 2010, 2011], 24000, 36000),
    repairPln: [2500, 9000],
    inputsByYear: fillYears(
      [2006, 2007, 2008, 2009, 2010, 2011],
      { catastrophe: 0.24, expectedFix5yPln: 7000, painLoad: 0.4, campaigns: 0.12, partsReality: 0.82 },
      { catastrophe: 0.22, expectedFix5yPln: 6500, painLoad: 0.38, campaigns: 0.1, partsReality: 0.82 },
    ),
  },
];
