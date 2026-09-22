#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const NOW = "2026-09-22T23:55:00Z";
const existing = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src/data/imported/buyMedians.json"), "utf8"),
);

const NEW_TABLES = {
  "Seria 4": {
    url: "https://car-dossier.com/ceny/bmw/seria-4",
    listings: 4114,
    median: 89500,
    years: {
      2013: [61000, 56000, 68900, 83, 180000],
      2014: [64100, 55000, 73600, 504, 187000],
      2015: [64900, 55500, 76000, 575, 174000],
      2016: [70000, 59900, 83900, 408, 168000],
      2017: [78900, 68000, 94500, 349, 147000],
      2018: [82000, 67400, 98900, 285, 115000],
      2019: [84900, 69900, 97200, 220, 114000],
      2020: [130000, 99000, 165000, 105, 86000],
      2021: [155000, 130000, 183900, 254, 75000],
      2022: [169000, 147900, 199000, 302, 67000],
      2023: [184800, 159900, 199900, 283, 54000],
      2024: [195900, 178000, 216900, 232, 37000],
      2025: [244900, 224900, 283300, 372, 13000],
      2026: [299500, 273200, 339900, 142, null],
    },
  },
  "Seria 2": {
    url: "https://car-dossier.com/ceny/bmw/seria-2",
    listings: 3835,
    median: 64900,
    years: {
      2014: [43000, 36500, 58600, 164, 172000],
      2015: [39900, 32900, 53000, 591, 176000],
      2016: [43000, 36200, 51500, 491, 165000],
      2017: [46500, 38800, 58200, 347, 145000],
      2018: [49900, 40900, 62000, 248, 142000],
      2019: [55000, 47400, 62800, 174, 125000],
      2020: [80000, 59900, 95000, 279, 82000],
      2021: [89900, 73200, 98900, 371, 88000],
      2022: [98000, 82600, 119900, 382, 64000],
      2023: [109900, 89000, 139900, 324, 45000],
      2024: [129900, 119900, 150500, 143, 22000],
      2025: [164900, 149900, 194900, 245, 7000],
      2026: [179500, 174900, 197000, 75, null],
    },
  },
  "Seria 1": {
    url: "https://car-dossier.com/ceny/bmw/seria-1",
    listings: 13115,
    median: 22000,
    years: {
      2009: [15000, 11900, 18500, 1012, 216000],
      2010: [16300, 12900, 19900, 797, 218000],
      2011: [20500, 16800, 25500, 728, 209000],
      2012: [25900, 21900, 30600, 1000, 198000],
      2013: [27000, 23000, 31900, 762, 192000],
      2014: [28900, 24900, 34900, 645, 190000],
      2015: [36000, 29900, 43900, 544, 169000],
      2016: [42000, 34900, 50900, 516, 165000],
      2017: [45000, 36900, 54000, 386, 137000],
      2018: [52500, 44800, 59900, 319, 129000],
      2019: [63500, 51300, 74900, 278, 105000],
      2020: [72900, 60200, 81800, 302, 85000],
      2021: [82900, 70400, 92000, 339, 68000],
      2022: [84900, 74900, 99100, 279, 72000],
      2023: [92900, 84900, 99900, 306, 44000],
      2024: [96000, 92900, 119900, 318, 30000],
      2025: [139900, 125000, 150400, 202, 9000],
      2026: [149900, 133500, 162900, 183, null],
    },
  },
};

const EXTRA_CHASSIS = {
  g30: { market: "Seria 5", years: [2017, 2023] },
  f32: { market: "Seria 4", years: [2013, 2020] },
  f36: { market: "Seria 4", years: [2014, 2021] },
  e82: { market: "Seria 1", years: [2007, 2013] },
  f40: { market: "Seria 1", years: [2019, 2024] },
  f22: { market: "Seria 2", years: [2014, 2021] },
  g01: { market: "X3", years: [2017, 2024] },
  g05: { market: "X5", years: [2018, 2026] },
};

function yearRow(market, year) {
  // Prefer NEW_TABLES, else existing byChassisYear via market urls in meta
  const t = NEW_TABLES[market];
  if (t?.years?.[year]) {
    const [median, p25, p75, sample, mileage] = t.years[year];
    return { median, p25, p75, sample_size: sample, mileage_median_km: mileage, source_url: t.url };
  }
  // Fall back: scan existing chassis mapped to same market
  for (const [slug, years] of Object.entries(existing.byChassisYear)) {
    const row = years[String(year)];
    if (!row) continue;
    if (row.source_url?.includes(marketSlug(market))) return { ...row, mileage_median_km: null };
  }
  return null;
}

function marketSlug(market) {
  return market.toLowerCase().replace(/\s+/g, "-");
}

// Merge buyMedians
const byChassisYear = { ...existing.byChassisYear };
const gaps = { ...(existing.meta.year_gaps_needing_api || {}) };

for (const [slug, cfg] of Object.entries(EXTRA_CHASSIS)) {
  byChassisYear[slug] = {};
  const [y0, y1] = cfg.years;
  const g = [];
  for (let y = y0; y <= y1; y++) {
    const r = yearRow(cfg.market, y);
    if (!r) {
      g.push(y);
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
  gaps[slug] = g;
}

// Refresh e87/f20/f40 Seria 1 years from NEW_TABLES
for (const [slug, range] of [
  ["e87", [2004, 2011]],
  ["f20", [2011, 2019]],
  ["f40", [2019, 2024]],
  ["e82", [2007, 2013]],
]) {
  byChassisYear[slug] = byChassisYear[slug] || {};
  const g = [];
  for (let y = range[0]; y <= range[1]; y++) {
    const r = yearRow("Seria 1", y);
    if (!r) {
      g.push(y);
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
  gaps[slug] = g;
}

const urls = {
  ...(existing.meta.urls || {}),
  "seria-4": NEW_TABLES["Seria 4"].url,
  "seria-2": NEW_TABLES["Seria 2"].url,
  "seria-1": NEW_TABLES["Seria 1"].url,
};

const buyMedians = {
  meta: {
    ...existing.meta,
    collected_at: NOW,
    urls,
    year_gaps_needing_api: gaps,
    phase_c2_note: "Added Seria 4/2 tables; refreshed Seria 1; chassis g30/f32/f36/e82/f40/f22/g01/g05",
  },
  byChassisYear,
  fuelSpecificSamples: existing.fuelSpecificSamples ?? [],
};
fs.writeFileSync(
  path.join(ROOT, "src/data/imported/buyMedians.json"),
  JSON.stringify(buyMedians, null, 2) + "\n",
);

// Append warehouse buy rows for new chassis
const buyWhPath = path.join(ROOT, "data/warehouse/buy_prices/cardossier_public_by_year.json");
const buyWh = JSON.parse(fs.readFileSync(buyWhPath, "utf8"));
buyWh.collected_at = NOW;
buyWh.model_totals = {
  ...buyWh.model_totals,
  "Seria 4": { median: 89500, listings: 4114, url: NEW_TABLES["Seria 4"].url },
  "Seria 2": { median: 64900, listings: 3835, url: NEW_TABLES["Seria 2"].url },
  "Seria 1": { median: 22000, listings: 13115, url: NEW_TABLES["Seria 1"].url },
};
const existingKeys = new Set(buyWh.rows.map((r) => r.key));
for (const [slug, cfg] of Object.entries(EXTRA_CHASSIS)) {
  const [y0, y1] = cfg.years;
  for (let y = y0; y <= y1; y++) {
    const r = yearRow(cfg.market, y);
    if (!r) continue;
    const key = `${slug}|${y}|all_fuels`;
    if (existingKeys.has(key)) continue;
    buyWh.rows.push({
      key,
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
      source: { provider: "cardossier_public_stats", url: r.source_url, updated: "2026-09" },
      collected_at: NOW,
      confidence: "market_public_stats",
    });
  }
}
fs.writeFileSync(buyWhPath, JSON.stringify(buyWh, null, 2) + "\n");

function writeChassis(slug, code, family, years, market, otomoto, engines, wiki) {
  const doc = {
    slug, code, family, years, market_model: market, otomoto, gold: false, engines, wiki,
    realoem_hint: "https://www.realoem.com/bmw/", region: "PL", status: "catalog_confirmed",
    sources: [
      { provider: "wikipedia", url: wiki, role: "generation_identity" },
      { provider: "realoem", url: "https://www.realoem.com/bmw/", role: "parts_and_type_codes" },
      { provider: "ohmycar_chassis_ts", url: "src/data/chassis.ts", role: "product_taxonomy" },
      { provider: "otomoto", url: `https://www.otomoto.pl/osobowe/bmw/${otomoto}`, role: "market_deep_link" },
    ],
    collected_at: NOW,
  };
  fs.writeFileSync(path.join(ROOT, `data/warehouse/chassis/${slug}.json`), JSON.stringify(doc, null, 2) + "\n");
}
function writeEngines(slug, wiki, lines) {
  const doc = {
    chassis_slug: slug, region: "PL", collected_at: NOW, confidence: "sourced_curated",
    sources: [
      { label: "Wikipedia generation page", url: wiki },
      { label: "RealOEM BMW catalog", url: "https://www.realoem.com/bmw/" },
    ],
    lines, line_count: lines.length,
  };
  fs.writeFileSync(path.join(ROOT, `data/warehouse/engines/${slug}.json`), JSON.stringify(doc, null, 2) + "\n");
}

const batch = [
  {
    slug: "g30", code: "G30", family: "5", years: [2017, 2023], market: "Seria 5", otomoto: "seria-5",
    wiki: "https://en.wikipedia.org/wiki/BMW_5_Series_(G30)", engines: ["B47", "B48", "B58"],
    lines: [
      { model: "520d", engine: "B47", fuel: "diesel", years: [2017, 2018, 2019, 2020, 2021, 2022, 2023] },
      { model: "530i", engine: "B48", fuel: "petrol", years: [2017, 2018, 2019, 2020, 2021, 2022, 2023] },
      { model: "540i", engine: "B58", fuel: "petrol", years: [2017, 2018, 2019, 2020, 2021, 2022, 2023] },
    ],
  },
  {
    slug: "f32", code: "F32", family: "4", years: [2013, 2020], market: "Seria 4", otomoto: "seria-4",
    wiki: "https://en.wikipedia.org/wiki/BMW_4_Series_(F32)", engines: ["N20", "N55", "B47", "B48"],
    lines: [
      { model: "420i", engine: "N20", fuel: "petrol", years: [2013, 2014, 2015, 2016] },
      { model: "420i", engine: "B48", fuel: "petrol", years: [2016, 2017, 2018, 2019, 2020] },
      { model: "435i", engine: "N55", fuel: "petrol", years: [2013, 2014, 2015, 2016] },
      { model: "420d", engine: "B47", fuel: "diesel", years: [2015, 2016, 2017, 2018, 2019, 2020] },
      { model: "420d", engine: "N47", fuel: "diesel", years: [2013, 2014, 2015] },
    ],
  },
  {
    slug: "f36", code: "F36", family: "4", years: [2014, 2021], market: "Seria 4", otomoto: "seria-4",
    wiki: "https://en.wikipedia.org/wiki/BMW_4_Series_(F32)#Gran_Coupé_(F36)", engines: ["N20", "B47", "B48"],
    lines: [
      { model: "420i", engine: "N20", fuel: "petrol", years: [2014, 2015, 2016] },
      { model: "420i", engine: "B48", fuel: "petrol", years: [2016, 2017, 2018, 2019, 2020, 2021] },
      { model: "420d", engine: "B47", fuel: "diesel", years: [2015, 2016, 2017, 2018, 2019, 2020, 2021] },
    ],
  },
  {
    slug: "e82", code: "E82", family: "1", years: [2007, 2013], market: "Seria 1", otomoto: "seria-1",
    wiki: "https://en.wikipedia.org/wiki/BMW_1_Series_(E82)", engines: ["N52", "N54", "N47"],
    lines: [
      { model: "125i", engine: "N52", fuel: "petrol", years: [2008, 2009, 2010, 2011, 2012, 2013] },
      { model: "135i", engine: "N54", fuel: "petrol", years: [2007, 2008, 2009, 2010] },
      { model: "135i", engine: "N55", fuel: "petrol", years: [2010, 2011, 2012, 2013] },
      { model: "120d", engine: "N47", fuel: "diesel", years: [2007, 2008, 2009, 2010, 2011, 2012, 2013] },
    ],
  },
  {
    slug: "f40", code: "F40", family: "1", years: [2019, 2024], market: "Seria 1", otomoto: "seria-1",
    wiki: "https://en.wikipedia.org/wiki/BMW_1_Series_(F40)", engines: ["B38", "B48", "B47"],
    lines: [
      { model: "118i", engine: "B38", fuel: "petrol", years: [2019, 2020, 2021, 2022, 2023, 2024] },
      { model: "120i", engine: "B48", fuel: "petrol", years: [2019, 2020, 2021, 2022, 2023, 2024] },
      { model: "118d", engine: "B47", fuel: "diesel", years: [2019, 2020, 2021, 2022, 2023, 2024] },
    ],
  },
  {
    slug: "f22", code: "F22", family: "2", years: [2014, 2021], market: "Seria 2", otomoto: "seria-2",
    wiki: "https://en.wikipedia.org/wiki/BMW_2_Series_(F22)", engines: ["N20", "N55", "B48", "B47"],
    lines: [
      { model: "220i", engine: "N20", fuel: "petrol", years: [2014, 2015, 2016] },
      { model: "220i", engine: "B48", fuel: "petrol", years: [2016, 2017, 2018, 2019, 2020, 2021] },
      { model: "230i", engine: "N55", fuel: "petrol", years: [2014, 2015, 2016] },
      { model: "220d", engine: "B47", fuel: "diesel", years: [2015, 2016, 2017, 2018, 2019, 2020, 2021] },
    ],
  },
  {
    slug: "g01", code: "G01", family: "x", years: [2017, 2024], market: "X3", otomoto: "x3",
    wiki: "https://en.wikipedia.org/wiki/BMW_X3_(G01)", engines: ["B47", "B48", "B58"],
    lines: [
      { model: "20d", engine: "B47", fuel: "diesel", years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { model: "30i", engine: "B48", fuel: "petrol", years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { model: "M40i", engine: "B58", fuel: "petrol", years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    ],
  },
  {
    slug: "g05", code: "G05", family: "x", years: [2018, 2026], market: "X5", otomoto: "x5",
    wiki: "https://en.wikipedia.org/wiki/BMW_X5_(G05)", engines: ["B57", "B58"],
    lines: [
      { model: "30d", engine: "B57", fuel: "diesel", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
      { model: "40i", engine: "B58", fuel: "petrol", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    ],
  },
];

for (const b of batch) {
  writeChassis(b.slug, b.code, b.family, b.years, b.market, b.otomoto, b.engines, b.wiki);
  writeEngines(b.slug, b.wiki, b.lines);
}

console.log("C2 chassis", batch.map((b) => b.slug).join(","));
console.log(
  "buy counts",
  Object.fromEntries(Object.keys(EXTRA_CHASSIS).map((s) => [s, Object.keys(byChassisYear[s] || {}).length])),
);
console.log("gaps", Object.fromEntries(Object.entries(gaps).filter(([s]) => EXTRA_CHASSIS[s])));
