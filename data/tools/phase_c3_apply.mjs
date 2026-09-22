#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const NOW = "2026-09-23T00:05:00Z";
const buy = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/imported/buyMedians.json"), "utf8"));
const wh = JSON.parse(fs.readFileSync(path.join(ROOT, "data/warehouse/buy_prices/cardossier_public_by_year.json"), "utf8"));

const TABLES = {
  X2: {
    url: "https://car-dossier.com/ceny/bmw/x2",
    listings: 1749,
    median: 94900,
    years: {
      2018: [77800, 68900, 84500, 351, 104000],
      2019: [80000, 69900, 89900, 267, 101000],
      2020: [82000, 76000, 89900, 160, 90000],
      2021: [91200, 80000, 105400, 150, 73000],
      2022: [96900, 87900, 108400, 166, 71000],
      2023: [110000, 102000, 127700, 64, 40000],
      2024: [165900, 157200, 179900, 223, 21000],
      2025: [205200, 187900, 227200, 260, 8000],
      2026: [216500, 203200, 233100, 104, null],
    },
  },
  X4: {
    url: "https://car-dossier.com/ceny/bmw/x4",
    listings: 2223,
    median: 133000,
    years: {
      2014: [68000, 63000, 78500, 77, 194000],
      2015: [70900, 65000, 77000, 210, 187000],
      2016: [80000, 74000, 86900, 212, 163000],
      2017: [86900, 79900, 94900, 193, 151000],
      2018: [109900, 89900, 127200, 200, 128000],
      2019: [127400, 116900, 140900, 247, 127000],
      2020: [140000, 129900, 154900, 125, 105000],
      2021: [159000, 139900, 174700, 222, 85000],
      2022: [180000, 169900, 195000, 185, 74000],
      2023: [199900, 180000, 219900, 174, 60000],
      2024: [234900, 209900, 249900, 207, 21000],
      2025: [259900, 239900, 283800, 170, 4000],
    },
  },
  X6: {
    url: "https://car-dossier.com/ceny/bmw/x6",
    listings: 2569,
    median: 129500,
    years: {
      2009: [49900, 44500, 56700, 183, 253000],
      2010: [56000, 48000, 61900, 193, 244000],
      2011: [59000, 49000, 67900, 113, 238000],
      2012: [60000, 49600, 66900, 97, 245000],
      2013: [65000, 56200, 73000, 114, 215000],
      2014: [85000, 75000, 105000, 59, 196000],
      2015: [104000, 89900, 119900, 203, 188000],
      2016: [106900, 98800, 119600, 144, 175000],
      2017: [119900, 108500, 140000, 160, 158000],
      2018: [139000, 130800, 149900, 96, 136000],
      2019: [160900, 138500, 199900, 83, 123000],
      2020: [226000, 200000, 239900, 149, 111000],
      2021: [239900, 220000, 259900, 165, 97000],
      2022: [265000, 250000, 280000, 105, 89000],
      2023: [318800, 280000, 345500, 112, 54000],
      2024: [364900, 317500, 399900, 87, 29000],
      2025: [411800, 376900, 437200, 210, 6000],
      2026: [446000, 400900, 483600, 210, null],
    },
  },
};

// Reuse existing series years from buyMedians for Seria 4/2/X1/5
function yearsFromExisting(sourceUrlIncludes) {
  const out = {};
  for (const years of Object.values(buy.byChassisYear)) {
    for (const [y, row] of Object.entries(years)) {
      if (row.source_url?.includes(sourceUrlIncludes)) {
        out[Number(y)] = [row.median, row.p25, row.p75, row.sample_size, null];
      }
    }
  }
  return out;
}

const EXTRA = {
  f39: { market: "X2", years: [2018, 2023], table: "X2" },
  u11: { market: "X1", years: [2022, 2026], fromUrl: "x1" },
  f26: { market: "X4", years: [2014, 2018], table: "X4" },
  g02: { market: "X4", years: [2018, 2025], table: "X4" },
  e71: { market: "X6", years: [2008, 2014], table: "X6" },
  f16: { market: "X6", years: [2014, 2019], table: "X6" },
  g06: { market: "X6", years: [2019, 2026], table: "X6" },
  g22: { market: "Seria 4", years: [2020, 2026], fromUrl: "seria-4" },
  f45: { market: "Seria 2", years: [2014, 2021], fromUrl: "seria-2" },
  f44: { market: "Seria 2", years: [2020, 2026], fromUrl: "seria-2" },
  g60: { market: "Seria 5", years: [2024, 2026], fromUrl: "seria-5" },
};

function rowFor(cfg, y) {
  if (cfg.table) {
    const r = TABLES[cfg.table].years[y];
    if (!r) return null;
    return {
      median: r[0], p25: r[1], p75: r[2], sample_size: r[3],
      mileage_median_km: r[4], source_url: TABLES[cfg.table].url,
    };
  }
  // from existing byChassisYear via URL fragment
  for (const years of Object.values(buy.byChassisYear)) {
    const row = years[String(y)];
    if (row?.source_url?.includes(cfg.fromUrl)) {
      return { ...row, mileage_median_km: null };
    }
  }
  // X1 from f48/e84
  if (cfg.fromUrl === "x1") {
    // hardcode remaining from C1 scrape we already have in f48
    const x1 = {
      2022: [115900, 89900, 135000, 277],
      2023: [142000, 122100, 159900, 375],
      2024: [159900, 144500, 179200, 328],
      2025: [189900, 161700, 204300, 310],
      2026: [198300, 182900, 218400, 385],
    };
    const r = x1[y];
    if (!r) return null;
    return { median: r[0], p25: r[1], p75: r[2], sample_size: r[3], mileage_median_km: null, source_url: "https://car-dossier.com/ceny/bmw/x1" };
  }
  if (cfg.fromUrl === "seria-5") {
    const s5 = {
      2024: [220000, 200000, 240000, 496],
      2025: [252900, 234900, 275800, 751],
      2026: [289900, 264800, 309900, 350],
    };
    const r = s5[y];
    if (!r) return null;
    return { median: r[0], p25: r[1], p75: r[2], sample_size: r[3], mileage_median_km: null, source_url: "https://car-dossier.com/ceny/bmw/seria-5" };
  }
  return null;
}

buy.meta.collected_at = NOW;
buy.meta.urls = {
  ...(buy.meta.urls || {}),
  x2: TABLES.X2.url,
  x4: TABLES.X4.url,
  x6: TABLES.X6.url,
};
buy.meta.phase_c3_note = "X2/X4/X6 tables; f39/u11/f26/g02/e71/f16/g06/g22/f45/f44/g60";
buy.meta.year_gaps_needing_api = buy.meta.year_gaps_needing_api || {};

wh.collected_at = NOW;
wh.model_totals = {
  ...wh.model_totals,
  X2: { median: 94900, listings: 1749, url: TABLES.X2.url },
  X4: { median: 133000, listings: 2223, url: TABLES.X4.url },
  X6: { median: 129500, listings: 2569, url: TABLES.X6.url },
};
const keys = new Set(wh.rows.map((r) => r.key));

for (const [slug, cfg] of Object.entries(EXTRA)) {
  buy.byChassisYear[slug] = {};
  const gaps = [];
  for (let y = cfg.years[0]; y <= cfg.years[1]; y++) {
    const r = rowFor(cfg, y);
    if (!r) {
      gaps.push(y);
      continue;
    }
    buy.byChassisYear[slug][String(y)] = {
      median: r.median, p25: r.p25, p75: r.p75, sample_size: r.sample_size, source_url: r.source_url,
    };
    const key = `${slug}|${y}|all_fuels`;
    if (!keys.has(key)) {
      wh.rows.push({
        key, chassis_slug: slug, region: "PL", currency: "PLN", year: y,
        market_model: cfg.market, fuel_filter: null,
        median: r.median, p25: r.p25, p75: r.p75, sample_size: r.sample_size,
        mileage_median_km: r.mileage_median_km ?? null, price_type: "asking_offer",
        note: "Series-level median (all engines/bodies). Chassis attribution by production year window.",
        source: { provider: "cardossier_public_stats", url: r.source_url, updated: "2026-09" },
        collected_at: NOW, confidence: "market_public_stats",
      });
      keys.add(key);
    }
  }
  buy.meta.year_gaps_needing_api[slug] = gaps;
  console.log(slug, Object.keys(buy.byChassisYear[slug]).length, "gaps", gaps);
}

fs.writeFileSync(path.join(ROOT, "src/data/imported/buyMedians.json"), JSON.stringify(buy, null, 2) + "\n");
fs.writeFileSync(path.join(ROOT, "data/warehouse/buy_prices/cardossier_public_by_year.json"), JSON.stringify(wh, null, 2) + "\n");

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
  fs.writeFileSync(
    path.join(ROOT, `data/warehouse/engines/${slug}.json`),
    JSON.stringify({
      chassis_slug: slug, region: "PL", collected_at: NOW, confidence: "sourced_curated",
      sources: [{ label: "Wikipedia", url: wiki }, { label: "RealOEM", url: "https://www.realoem.com/bmw/" }],
      lines, line_count: lines.length,
    }, null, 2) + "\n",
  );
}

const batch = [
  {
    slug: "f39", code: "F39", family: "x", years: [2018, 2023], market: "X2", otomoto: "x2",
    wiki: "https://en.wikipedia.org/wiki/BMW_X2", engines: ["B38", "B48", "B47"],
    lines: [
      { model: "18i", engine: "B38", fuel: "petrol", years: [2018, 2019, 2020, 2021, 2022, 2023] },
      { model: "20i", engine: "B48", fuel: "petrol", years: [2018, 2019, 2020, 2021, 2022, 2023] },
      { model: "20d", engine: "B47", fuel: "diesel", years: [2018, 2019, 2020, 2021, 2022, 2023] },
    ],
  },
  {
    slug: "u11", code: "U11", family: "x", years: [2022, 2026], market: "X1", otomoto: "x1",
    wiki: "https://en.wikipedia.org/wiki/BMW_X1_(U11)", engines: ["B38", "B48", "B47"],
    lines: [
      { model: "18i", engine: "B38", fuel: "petrol", years: [2022, 2023, 2024, 2025, 2026] },
      { model: "20i", engine: "B48", fuel: "petrol", years: [2022, 2023, 2024, 2025, 2026] },
      { model: "20d", engine: "B47", fuel: "diesel", years: [2022, 2023, 2024, 2025, 2026] },
    ],
  },
  {
    slug: "f26", code: "F26", family: "x", years: [2014, 2018], market: "X4", otomoto: "x4",
    wiki: "https://en.wikipedia.org/wiki/BMW_X4_(F26)", engines: ["N20", "N55", "N47", "B47"],
    lines: [
      { model: "20i", engine: "N20", fuel: "petrol", years: [2014, 2015, 2016, 2017, 2018] },
      { model: "35i", engine: "N55", fuel: "petrol", years: [2014, 2015, 2016, 2017, 2018] },
      { model: "20d", engine: "N47", fuel: "diesel", years: [2014, 2015] },
      { model: "20d", engine: "B47", fuel: "diesel", years: [2015, 2016, 2017, 2018] },
    ],
  },
  {
    slug: "g02", code: "G02", family: "x", years: [2018, 2025], market: "X4", otomoto: "x4",
    wiki: "https://en.wikipedia.org/wiki/BMW_X4_(G02)", engines: ["B47", "B48", "B58"],
    lines: [
      { model: "20d", engine: "B47", fuel: "diesel", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025] },
      { model: "30i", engine: "B48", fuel: "petrol", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025] },
      { model: "M40i", engine: "B58", fuel: "petrol", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025] },
    ],
  },
  {
    slug: "e71", code: "E71", family: "x", years: [2008, 2014], market: "X6", otomoto: "x6",
    wiki: "https://en.wikipedia.org/wiki/BMW_X6_(E71)", engines: ["N55", "N57", "N63"],
    lines: [
      { model: "35i", engine: "N55", fuel: "petrol", years: [2008, 2009, 2010, 2011, 2012, 2013, 2014] },
      { model: "30d", engine: "N57", fuel: "diesel", years: [2008, 2009, 2010, 2011, 2012, 2013, 2014] },
      { model: "50i", engine: "N63", fuel: "petrol", years: [2008, 2009, 2010, 2011, 2012, 2013, 2014] },
    ],
  },
  {
    slug: "f16", code: "F16", family: "x", years: [2014, 2019], market: "X6", otomoto: "x6",
    wiki: "https://en.wikipedia.org/wiki/BMW_X6_(F16)", engines: ["N55", "N57", "N63"],
    lines: [
      { model: "35i", engine: "N55", fuel: "petrol", years: [2014, 2015, 2016, 2017, 2018, 2019] },
      { model: "30d", engine: "N57", fuel: "diesel", years: [2014, 2015, 2016, 2017, 2018, 2019] },
      { model: "50i", engine: "N63", fuel: "petrol", years: [2014, 2015, 2016, 2017, 2018, 2019] },
    ],
  },
  {
    slug: "g06", code: "G06", family: "x", years: [2019, 2026], market: "X6", otomoto: "x6",
    wiki: "https://en.wikipedia.org/wiki/BMW_X6_(G06)", engines: ["B57", "B58"],
    lines: [
      { model: "30d", engine: "B57", fuel: "diesel", years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
      { model: "40i", engine: "B58", fuel: "petrol", years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    ],
  },
  {
    slug: "g22", code: "G22", family: "4", years: [2020, 2026], market: "Seria 4", otomoto: "seria-4",
    wiki: "https://en.wikipedia.org/wiki/BMW_4_Series_(G22)", engines: ["B48", "B58"],
    lines: [
      { model: "420i", engine: "B48", fuel: "petrol", years: [2020, 2021, 2022, 2023, 2024, 2025, 2026] },
      { model: "430i", engine: "B48", fuel: "petrol", years: [2020, 2021, 2022, 2023, 2024, 2025, 2026] },
      { model: "M440i", engine: "B58", fuel: "petrol", years: [2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    ],
  },
  {
    slug: "f45", code: "F45", family: "2", years: [2014, 2021], market: "Seria 2", otomoto: "seria-2",
    wiki: "https://en.wikipedia.org/wiki/BMW_2_Series_Active_Tourer", engines: ["B38", "B48", "B47"],
    lines: [
      { model: "218i", engine: "B38", fuel: "petrol", years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021] },
      { model: "220i", engine: "B48", fuel: "petrol", years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021] },
      { model: "218d", engine: "B47", fuel: "diesel", years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021] },
    ],
  },
  {
    slug: "f44", code: "F44", family: "2", years: [2020, 2026], market: "Seria 2", otomoto: "seria-2",
    wiki: "https://en.wikipedia.org/wiki/BMW_2_Series_Gran_Coupé", engines: ["B38", "B48", "B47"],
    lines: [
      { model: "218i", engine: "B38", fuel: "petrol", years: [2020, 2021, 2022, 2023, 2024, 2025, 2026] },
      { model: "220i", engine: "B48", fuel: "petrol", years: [2020, 2021, 2022, 2023, 2024, 2025, 2026] },
      { model: "220d", engine: "B47", fuel: "diesel", years: [2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    ],
  },
  {
    slug: "g60", code: "G60", family: "5", years: [2024, 2026], market: "Seria 5", otomoto: "seria-5",
    wiki: "https://en.wikipedia.org/wiki/BMW_5_Series_(G60)", engines: ["B48", "B58"],
    lines: [
      { model: "520i", engine: "B48", fuel: "petrol", years: [2024, 2025, 2026] },
      { model: "540i", engine: "B58", fuel: "petrol", years: [2024, 2025, 2026] },
    ],
  },
];

for (const b of batch) {
  writeChassis(b.slug, b.code, b.family, b.years, b.market, b.otomoto, b.engines, b.wiki);
  writeEngines(b.slug, b.wiki, b.lines);
}
console.log("warehouse", batch.map((b) => b.slug).join(","));
