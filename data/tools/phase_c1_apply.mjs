#!/usr/bin/env node
/**
 * Phase C1: expand public CarDossier years + warehouse/volume for e84/f48/f25/f15/g20.
 * No invented PLN — tables scraped 2026-09-22 (CarDossier public HTML).
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const NOW = "2026-09-22T23:30:00Z";

function parseBand(s) {
  const m = String(s).replace(/\s/g, "").match(/(\d+)[–-](\d+)/);
  return m ? [Number(m[1]), Number(m[2])] : [null, null];
}

/** market_model -> year rows from public tables (sept 2026 scrape) */
const TABLES = {
  "Seria 3": {
    url: "https://car-dossier.com/ceny/bmw/seria-3",
    listings: 31935,
    median: 26000,
    years: {
      2009: [19900, 15700, 25900, 1427, 250000],
      2010: [21500, 17000, 27900, 1313, 247000],
      2011: [24000, 19500, 31900, 1209, 241000],
      2012: [34000, 25900, 41000, 1375, 246000],
      2013: [36500, 30500, 45000, 1593, 238000],
      2014: [39900, 31900, 49000, 1145, 225000],
      2015: [44700, 36000, 53900, 936, 204000],
      2016: [50000, 41500, 62000, 903, 193000],
      2017: [55300, 45100, 66500, 782, 166000],
      2018: [58900, 49000, 70000, 704, 146000],
      2019: [88000, 67500, 105000, 1023, 130000],
      2020: [94500, 79900, 114900, 976, 121000],
      2021: [99900, 85900, 119900, 1096, 105000],
      2022: [114900, 95900, 134000, 872, 92000],
      2023: [143900, 123900, 160000, 997, 71000],
      2024: [174900, 149900, 189900, 490, 33000],
      2025: [189900, 179800, 217200, 448, 10000],
      2026: [216100, 197400, 238500, 323, null],
    },
  },
  "Seria 5": {
    url: "https://car-dossier.com/ceny/bmw/seria-5",
    listings: 24683,
    median: 38900,
    years: {
      2009: [23500, 17500, 29000, 638, 291000],
      2010: [32800, 25800, 39000, 1032, 280000],
      2011: [36000, 29900, 43500, 1584, 273000],
      2012: [38900, 32900, 45900, 1283, 258000],
      2013: [43900, 37000, 51500, 1238, 243000],
      2014: [49000, 42000, 56000, 1033, 236000],
      2015: [54900, 46900, 62400, 830, 220000],
      2016: [58900, 49900, 68900, 816, 199000],
      2017: [84000, 72000, 98900, 1115, 180000],
      2018: [88000, 75900, 106000, 1077, 164000],
      2019: [97700, 82000, 114900, 899, 143000],
      2020: [112000, 95000, 129900, 611, 137000],
      2021: [127400, 109300, 149400, 807, 122000],
      2022: [140000, 119900, 165000, 736, 104000],
      2023: [170000, 136800, 207900, 433, 69000],
      2024: [220000, 200000, 240000, 496, 37000],
      2025: [252900, 234900, 275800, 751, 17000],
      2026: [289900, 264800, 309900, 350, null],
    },
  },
  X5: {
    url: "https://car-dossier.com/ceny/bmw/x5",
    listings: 8136,
    median: 100000,
    years: {
      2009: [39900, 34800, 45900, 255, 284000],
      2010: [45000, 35900, 50000, 234, 261000],
      2011: [48900, 40000, 55000, 200, 265000],
      2012: [53000, 45000, 59100, 192, 233000],
      2013: [62000, 49000, 70000, 201, 234000],
      2014: [79300, 67000, 87900, 398, 220000],
      2015: [79900, 69800, 89900, 363, 199000],
      2016: [89500, 79900, 99700, 442, 181000],
      2017: [95500, 85900, 114500, 357, 160000],
      2018: [109900, 95000, 129900, 267, 158000],
      2019: [169900, 149000, 189000, 321, 125000],
      2020: [179900, 164200, 199900, 346, 125000],
      2021: [199900, 174900, 229900, 523, 111000],
      2022: [219900, 195900, 246000, 501, 93000],
      2023: [290000, 239900, 329700, 461, 65000],
      2024: [349000, 314100, 381100, 260, 38000],
      2025: [394900, 359900, 430000, 401, 7000],
      2026: [419000, 384900, 449000, 885, null],
    },
  },
  X3: {
    url: "https://car-dossier.com/ceny/bmw/x3",
    listings: 11337,
    median: 67500,
    years: {
      2009: [24000, 20900, 27900, 224, 253000],
      2010: [28900, 24900, 35900, 279, 247000],
      2011: [39900, 34900, 44900, 593, 240000],
      2012: [42900, 37000, 48900, 573, 229000],
      2013: [45500, 39900, 50000, 456, 212000],
      2014: [52600, 45900, 59500, 336, 202000],
      2015: [60000, 53000, 66900, 309, 191000],
      2016: [68600, 61900, 75000, 298, 155000],
      2017: [72000, 64900, 82800, 438, 153000],
      2018: [95900, 86000, 108000, 518, 133000],
      2019: [99900, 87900, 115000, 544, 120000],
      2020: [116500, 100000, 129900, 507, 104000],
      2021: [129900, 114000, 147900, 651, 90000],
      2022: [154900, 134900, 172900, 642, 79000],
      2023: [174900, 154900, 199900, 431, 59000],
      2024: [199900, 168700, 230900, 284, 26000],
      2025: [259900, 239900, 279900, 1135, 7000],
      2026: [280000, 261100, 300900, 617, null],
    },
  },
  X1: {
    url: "https://car-dossier.com/ceny/bmw/x1",
    listings: 7611,
    median: 57500,
    years: {
      2009: [27700, 24400, 30100, 96, 249000],
      2010: [27500, 24900, 30000, 615, 234000],
      2011: [29000, 25900, 32800, 710, 221000],
      2012: [30500, 26900, 35900, 589, 211000],
      2013: [34900, 29900, 38700, 472, 200000],
      2014: [37900, 33900, 42000, 465, 198000],
      2015: [46900, 39900, 54900, 287, 180000],
      2016: [59900, 52900, 65900, 581, 159000],
      2017: [63900, 55900, 70000, 554, 151000],
      2018: [67000, 59900, 73500, 440, 121000],
      2019: [74900, 65000, 82900, 401, 110000],
      2020: [79900, 70000, 92000, 341, 104000],
      2021: [89900, 79900, 99900, 384, 81000],
      2022: [115900, 89900, 135000, 277, 67000],
      2023: [142000, 122100, 159900, 375, 39000],
      2024: [159900, 144500, 179200, 328, 25000],
      2025: [189900, 161700, 204300, 310, 12000],
      2026: [198300, 182900, 218400, 385, null],
    },
  },
};

/** chassis production windows + market family */
const CHASSIS_BUY = {
  e90: { market: "Seria 3", years: [2005, 2012] },
  f30: { market: "Seria 3", years: [2012, 2019] },
  e46: { market: "Seria 3", years: [1998, 2006] },
  e36: { market: "Seria 3", years: [1990, 2000] },
  "e9x-m3": { market: "Seria 3", years: [2007, 2013] },
  g20: { market: "Seria 3", years: [2019, 2026] },
  e60: { market: "Seria 5", years: [2003, 2010] },
  f10: { market: "Seria 5", years: [2010, 2017] },
  e39: { market: "Seria 5", years: [1995, 2004] },
  e87: { market: "Seria 1", years: [2004, 2011] },
  f20: { market: "Seria 1", years: [2011, 2019] },
  e70: { market: "X5", years: [2006, 2013] },
  e53: { market: "X5", years: [1999, 2006] },
  f15: { market: "X5", years: [2013, 2018] },
  e83: { market: "X3", years: [2003, 2010] },
  f25: { market: "X3", years: [2010, 2017] },
  e84: { market: "X1", years: [2009, 2015] },
  f48: { market: "X1", years: [2015, 2022] },
};

// Keep Seria 1 from existing buyMedians (not re-scraped this run)
const existingBuy = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src/data/imported/buyMedians.json"), "utf8"),
);
const seria1Years = existingBuy.byChassisYear.e87 || {};
const seria1f20 = existingBuy.byChassisYear.f20 || {};
// Rebuild Seria 1 table from e87+f20 union for warehouse completeness
const SERIA1 = {
  url: "https://car-dossier.com/ceny/bmw/seria-1",
  listings: 13115,
  median: 22000,
  years: {},
};
for (const [y, row] of Object.entries({ ...seria1Years, ...seria1f20 })) {
  SERIA1.years[Number(y)] = [row.median, row.p25, row.p75, row.sample_size, null];
}
TABLES["Seria 1"] = SERIA1;

function yearRow(market, year) {
  const t = TABLES[market];
  const r = t?.years?.[year];
  if (!r) return null;
  const [median, p25, p75, sample, mileage] = r;
  return {
    median,
    p25,
    p75,
    sample_size: sample,
    mileage_median_km: mileage,
    source_url: t.url,
  };
}

// --- warehouse buy file ---
const rows = [];
for (const [slug, cfg] of Object.entries(CHASSIS_BUY)) {
  const [y0, y1] = cfg.years;
  for (let y = y0; y <= y1; y++) {
    const r = yearRow(cfg.market, y);
    if (!r) continue;
    rows.push({
      key: `${slug}|${y}|all_fuels`,
      chassis_slug: slug,
      region: "PL",
      currency: "PLN",
      year: y,
      market_model: cfg.market,
      fuel_filter: null,
      median: r.median,
      p25: r.p25,
      p75: r.p75,
      sample_size: r.sample_size,
      mileage_median_km: r.mileage_median_km,
      price_type: "asking_offer",
      note: "Series-level median (all engines/bodies). Chassis attribution by production year window.",
      source: {
        provider: "cardossier_public_stats",
        url: r.source_url,
        updated: "2026-09",
      },
      collected_at: NOW,
      confidence: "market_public_stats",
    });
  }
}

const buyWarehouse = {
  dataset: "buy_prices",
  region: "PL",
  collected_at: NOW,
  disclaimer: "Asking (offer) prices from aggregated PL market listings. Series-level.",
  model_totals: Object.fromEntries(
    Object.entries(TABLES).map(([name, t]) => [
      name,
      { median: t.median, listings: t.listings, url: t.url },
    ]),
  ),
  rows,
};
fs.writeFileSync(
  path.join(ROOT, "data/warehouse/buy_prices/cardossier_public_by_year.json"),
  JSON.stringify(buyWarehouse, null, 2) + "\n",
);

// --- imported buyMedians ---
const byChassisYear = {};
const year_gaps_needing_api = {};
for (const [slug, cfg] of Object.entries(CHASSIS_BUY)) {
  byChassisYear[slug] = {};
  const [y0, y1] = cfg.years;
  const gaps = [];
  for (let y = y0; y <= y1; y++) {
    const r = yearRow(cfg.market, y);
    if (!r) {
      gaps.push(y);
      continue;
    }
    byChassisYear[slug][String(y)] = {
      median: r.median,
      p25: r.p25,
      p75: r.p75,
      sample_size: r.sample_size,
      source_url: r.source_url,
    };
  }
  year_gaps_needing_api[slug] = gaps;
}

const buyMedians = {
  meta: {
    collected_at: NOW,
    source: "cardossier_public_stats",
    price_type: "asking_offer_series_level",
    disclaimer:
      "Medians are series-level by year, not badge/engine-specific. Public HTML tables; earlier years need CarDossier API.",
    urls: Object.fromEntries(
      Object.entries(TABLES).map(([name, t]) => [
        name.toLowerCase().replace(/\s+/g, "-"),
        t.url,
      ]),
    ),
    year_gaps_needing_api,
    phase_c1_note:
      "Added X1 public table; expanded Seria 3/5, X3, X5 year coverage for g20/f15/f25/e84/f48.",
  },
  byChassisYear,
  fuelSpecificSamples: existingBuy.fuelSpecificSamples ?? [],
};
fs.writeFileSync(
  path.join(ROOT, "src/data/imported/buyMedians.json"),
  JSON.stringify(buyMedians, null, 2) + "\n",
);

// --- chassis + engines warehouse ---
function writeChassis(slug, code, family, years, market, otomoto, engines, wiki, gold = false) {
  const doc = {
    slug,
    code,
    family,
    years,
    market_model: market,
    otomoto,
    gold,
    engines,
    wiki,
    realoem_hint: "https://www.realoem.com/bmw/",
    region: "PL",
    status: "catalog_confirmed",
    sources: [
      { provider: "wikipedia", url: wiki, role: "generation_identity" },
      { provider: "realoem", url: "https://www.realoem.com/bmw/", role: "parts_and_type_codes" },
      { provider: "ohmycar_chassis_ts", url: "src/data/chassis.ts", role: "product_taxonomy" },
      {
        provider: "otomoto",
        url: `https://www.otomoto.pl/osobowe/bmw/${otomoto}`,
        role: "market_deep_link",
      },
    ],
    collected_at: NOW,
  };
  fs.writeFileSync(
    path.join(ROOT, `data/warehouse/chassis/${slug}.json`),
    JSON.stringify(doc, null, 2) + "\n",
  );
}

function writeEngines(slug, wiki, lines) {
  const doc = {
    chassis_slug: slug,
    region: "PL",
    collected_at: NOW,
    confidence: "sourced_curated",
    sources: [
      { label: "Wikipedia generation page", url: wiki },
      { label: "RealOEM BMW catalog", url: "https://www.realoem.com/bmw/" },
      { label: "App seed cross-check", url: "src/data/volume.ts" },
    ],
    lines,
    line_count: lines.length,
  };
  fs.writeFileSync(
    path.join(ROOT, `data/warehouse/engines/${slug}.json`),
    JSON.stringify(doc, null, 2) + "\n",
  );
}

const batch = [
  {
    slug: "e84",
    code: "E84",
    family: "x",
    years: [2009, 2015],
    market: "X1",
    otomoto: "x1",
    wiki: "https://en.wikipedia.org/wiki/BMW_X1_(E84)",
    engines: ["N47", "N20", "N52"],
    lines: [
      { model: "18d", engine: "N47", fuel: "diesel", years: [2009, 2010, 2011, 2012, 2013, 2014, 2015] },
      { model: "20d", engine: "N47", fuel: "diesel", years: [2009, 2010, 2011, 2012, 2013, 2014, 2015] },
      { model: "20i", engine: "N20", fuel: "petrol", years: [2011, 2012, 2013, 2014, 2015] },
      { model: "28i", engine: "N52", fuel: "petrol", years: [2009, 2010, 2011, 2012] },
    ],
  },
  {
    slug: "f48",
    code: "F48",
    family: "x",
    years: [2015, 2022],
    market: "X1",
    otomoto: "x1",
    wiki: "https://en.wikipedia.org/wiki/BMW_X1_(F48)",
    engines: ["B47", "B48"],
    lines: [
      { model: "18d", engine: "B47", fuel: "diesel", years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022] },
      { model: "20d", engine: "B47", fuel: "diesel", years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022] },
      { model: "20i", engine: "B48", fuel: "petrol", years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022] },
    ],
  },
  {
    slug: "f25",
    code: "F25",
    family: "x",
    years: [2010, 2017],
    market: "X3",
    otomoto: "x3",
    wiki: "https://en.wikipedia.org/wiki/BMW_X3_(F25)",
    engines: ["N47", "N20", "N55"],
    lines: [
      { model: "20d", engine: "N47", fuel: "diesel", years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017] },
      { model: "28i", engine: "N20", fuel: "petrol", years: [2012, 2013, 2014, 2015, 2016, 2017] },
      { model: "35i", engine: "N55", fuel: "petrol", years: [2010, 2011, 2012, 2013, 2014, 2015, 2016] },
    ],
  },
  {
    slug: "f15",
    code: "F15",
    family: "x",
    years: [2013, 2018],
    market: "X5",
    otomoto: "x5",
    wiki: "https://en.wikipedia.org/wiki/BMW_X5_(F15)",
    engines: ["N57", "N55", "N63"],
    lines: [
      { model: "25d", engine: "N57", fuel: "diesel", years: [2013, 2014, 2015, 2016, 2017, 2018] },
      { model: "30d", engine: "N57", fuel: "diesel", years: [2013, 2014, 2015, 2016, 2017, 2018] },
      { model: "35i", engine: "N55", fuel: "petrol", years: [2013, 2014, 2015, 2016, 2017, 2018] },
      { model: "50i", engine: "N63", fuel: "petrol", years: [2013, 2014, 2015, 2016, 2017, 2018] },
    ],
  },
  {
    slug: "g20",
    code: "G20",
    family: "3",
    years: [2019, 2026],
    market: "Seria 3",
    otomoto: "seria-3",
    wiki: "https://en.wikipedia.org/wiki/BMW_3_Series_(G20)",
    engines: ["B48", "B58"],
    lines: [
      { model: "320i", engine: "B48", fuel: "petrol", years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
      { model: "330i", engine: "B48", fuel: "petrol", years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
      { model: "330e", engine: "B48", fuel: "petrol", years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
      { model: "M340i", engine: "B58", fuel: "petrol", years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    ],
  },
];

for (const b of batch) {
  writeChassis(b.slug, b.code, b.family, b.years, b.market, b.otomoto, b.engines, b.wiki);
  writeEngines(b.slug, b.wiki, b.lines);
}

console.log("buy rows", rows.length);
console.log("chassis batch", batch.map((b) => b.slug).join(","));
console.log(
  "gaps sample",
  Object.fromEntries(
    Object.entries(year_gaps_needing_api).filter(([, g]) => g.length).slice(0, 8),
  ),
);
