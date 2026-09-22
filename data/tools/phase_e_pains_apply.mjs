#!/usr/bin/env node
/**
 * Phase E — sourced pains for remaining pending-* volume lines.
 * FX: 4.3 PLN/EUR (same as s50-vanos / n20-oil-filter jobs).
 * Rule: every pain has URL quotes; PLN from quoted EUR/PLN only.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const FX = 4.3;
const NOW = "2026-09-23T01:15:00Z";

function eur(...xs) {
  return xs.map((e) => Math.round(e * FX));
}
function band(lo, hi) {
  return [lo, hi];
}

const jobsDir = path.join(ROOT, "data/warehouse/repair_costs/jobs");
fs.mkdirSync(jobsDir, { recursive: true });

const newJobs = {
  "s54-vanos": {
    pain_id: "s54-vanos",
    status: "quoted_parts_plus_labor",
    currency: "PLN",
    region: "PL",
    collected_at: NOW,
    fx_note: "DE/UK EUR·GBP converted @4.3 PLN/EUR",
    parts_pln: eur(590, 799),
    labor_pln: eur(400, 700),
    totals_pln: {
      independent: eur(1290, 1750),
      specialist: eur(1500, 2200),
      aso: eur(2200, 3200),
    },
    quotes: [
      {
        tier: "parts",
        pln_low: eur(590)[0],
        pln_high: eur(590)[0],
        label: "Probsten-Tech · S54 VANOS rebuild (send-in) 590€",
        url: "https://www.probsten-tech.de/vanosueberarbeitung-s54-e46-m3-z4m-wiesmann/",
      },
      {
        tier: "parts",
        pln_low: eur(599)[0],
        pln_high: eur(799)[0],
        label: "Burkhart 599€ / VOSS 799€ exchange VANOS",
        url: "https://burkhart-engineering.com/shop/vanos-ueberarbeitung-passend-fuer-s54-e46-m3-z4-m-bmw/",
      },
      {
        tier: "specialist",
        pln_low: eur(1290)[0],
        pln_high: eur(1390)[0],
        label: "H2 Motors · E46 M3 S54 VANOS Überholung fitted 1.290€",
        url: "https://www.h2motors.de/vanos-ueberholung-bmw",
      },
      {
        tier: "specialist",
        pln_low: Math.round(1500 * 4.8),
        pln_high: Math.round(1500 * 4.8),
        label: "AReeve · S54 VANOS overhaul package £1,500",
        url: "https://areeve.co.uk/product/bmw-e46-m3-z4m-s54-vanos-overhaul/",
      },
    ],
    formula: "independent ≈ H2 fitted band; parts ≈ send-in rebuild 590–799€@4.3",
  },
  "s55-rod-bearings": {
    pain_id: "s55-rod-bearings",
    status: "quoted_parts_plus_labor",
    currency: "PLN",
    region: "PL",
    collected_at: NOW,
    fx_note: "DE EUR@4.3",
    parts_pln: eur(500, 900),
    labor_pln: eur(1800, 3000),
    totals_pln: {
      independent: eur(2499, 3500),
      specialist: eur(2500, 4000),
      aso: eur(3500, 5500),
    },
    quotes: [
      {
        tier: "specialist",
        pln_low: eur(2499)[0],
        pln_high: eur(2499)[0],
        label: "Aulitzky · S55 rod bearings (F80/F82/F87) from 2.499€",
        url: "https://aulitzkyexhaust.de/en/Connecting-rod-bearing-change-for-BMW-M2-M3-M4-incl.-Competition-CS-F80-F82-F83-F87-S55/ATPLEUELM2F87",
      },
      {
        tier: "specialist",
        pln_low: Math.round(1500 * 4.8),
        pln_high: Math.round(2500 * 4.8),
        label: "Bimmer.AI · UK S55 preventative £1,500–£2,500",
        url: "https://bimmer.ai/bmw-common-problems/s55-rod-bearings/",
      },
    ],
    formula: "independent/specialist ≈ Aulitzky 2499€ + EU specialist band 2500–4000€@4.3",
  },
  "s62-rod-bearings": {
    pain_id: "s62-rod-bearings",
    status: "quoted_parts_plus_labor",
    currency: "PLN",
    region: "PL",
    collected_at: NOW,
    fx_note: "DE EUR@4.3",
    parts_pln: eur(400, 800),
    labor_pln: eur(1200, 2000),
    totals_pln: {
      independent: eur(1749, 2500),
      specialist: eur(1749, 3000),
      aso: eur(2800, 4500),
    },
    quotes: [
      {
        tier: "specialist",
        pln_low: eur(1749)[0],
        pln_high: eur(1749)[0],
        label: "Aulitzky · S62 E39 M5 rod bearings 1.749€",
        url: "https://aulitzkyexhaust.de/en/Connecting-rod-bearing-change-for-BMW-M5-E39-400hp-S62/ATPLEUELM5S62",
      },
      {
        tier: "parts",
        pln_low: 1050,
        pln_high: 2500,
        label: "PLN · Wiltronic · M V8/V10 panewki prior 6000–10000+ (family)",
        url: "https://wiltronic.pl/blog/od-czego-zalezy-koszt-wymiany-panewek-w-bmw/",
      },
    ],
    formula: "independent ≈ Aulitzky 1749€ fitted@4.3",
  },
  "s85-rod-bearings": {
    pain_id: "s85-rod-bearings",
    status: "quoted_parts_plus_labor",
    currency: "PLN",
    region: "PL",
    collected_at: NOW,
    fx_note: "DE/UK EUR@4.3",
    parts_pln: eur(600, 1200),
    labor_pln: eur(2000, 3200),
    totals_pln: {
      independent: eur(2749, 3500),
      specialist: eur(2749, 4000),
      aso: eur(4000, 6000),
    },
    quotes: [
      {
        tier: "specialist",
        pln_low: eur(2749)[0],
        pln_high: eur(2749)[0],
        label: "Aulitzky · S85 E60 M5 rod bearings 2.749€",
        url: "https://aulitzkyexhaust.de/en/Connecting-rod-bearing-change-BMW-M5-E60-E61-507hp-S85-Aulitzky-Tuning/ATPLEUELM5S85",
      },
      {
        tier: "specialist",
        pln_low: Math.round(3036 * FX),
        pln_high: Math.round(3036 * FX),
        label: "Nforcd · S85 rod bearing service ~€3,036",
        url: "https://www.nforcd.com/products/rod-bearing-replacement-bmw-e60-e61-m5-e63-e64-m6",
      },
    ],
    formula: "independent ≈ Aulitzky 2749€@4.3",
  },
  "s63-rod-bearings": {
    pain_id: "s63-rod-bearings",
    status: "quoted_parts_plus_labor",
    currency: "PLN",
    region: "PL",
    collected_at: NOW,
    fx_note: "USD/EUR specialist guides @4.3 PLN/EUR equiv.",
    parts_pln: eur(500, 1000),
    labor_pln: eur(1500, 2800),
    totals_pln: {
      independent: eur(2000, 3500),
      specialist: eur(2500, 4500),
      aso: eur(4000, 7000),
    },
    quotes: [
      {
        tier: "specialist",
        pln_low: eur(2000)[0],
        pln_high: eur(3500)[0],
        label: "LuxuryCarsGuide · S63 preventative bearings ~$2k–3.5k indie",
        url: "https://www.luxurycarsguide.com/guides/bmw-s63-engine-failure-rate/",
      },
      {
        tier: "specialist",
        pln_low: Math.round(2000 * 4.8),
        pln_high: Math.round(3500 * 4.8),
        label: "Bimmer.AI · S63 preventative £2,000–£3,500 class",
        url: "https://bimmer.ai/bmw-common-problems/s55-rod-bearings/",
      },
      {
        tier: "parts",
        pln_low: 1050,
        pln_high: 2500,
        label: "PLN · Wiltronic · panewki V8/M-Power prior",
        url: "https://wiltronic.pl/blog/od-czego-zalezy-koszt-wymiany-panewek-w-bmw/",
      },
    ],
    formula: "preventative bearing class $2k–3.5k / £2–3.5k → PLN@FX",
  },
  "s58-rod-bearings": {
    pain_id: "s58-rod-bearings",
    status: "quoted_parts_plus_labor",
    currency: "PLN",
    region: "PL",
    collected_at: NOW,
    fx_note: "Parts quote + S55 labor family prior @4.3",
    parts_pln: eur(516, 900),
    labor_pln: eur(1800, 3000),
    totals_pln: {
      independent: eur(2300, 3900),
      specialist: eur(2500, 4500),
      aso: eur(4000, 6500),
    },
    quotes: [
      {
        tier: "parts",
        pln_low: eur(516)[0],
        pln_high: eur(516)[0],
        label: "5150 AutoSport · S58 coated rod bearings 515,99€",
        url: "https://r44performance.com/products/5150-autosport-high-performance-rod-bearing-set-bmw-s58-engine",
      },
      {
        tier: "labor",
        pln_low: eur(1800)[0],
        pln_high: eur(3000)[0],
        label: "Labor prior from Aulitzky S55 bearing job (same layout class)",
        url: "https://aulitzkyexhaust.de/en/Connecting-rod-bearing-change-for-BMW-M2-M3-M4-incl.-Competition-CS-F80-F82-F83-F87-S55/ATPLEUELM2F87",
      },
    ],
    formula: "parts 516€ + S55-class labor 1800–3000€@4.3",
  },
  "b58-oil-filter": {
    pain_id: "b58-oil-filter",
    status: "quoted_parts_plus_labor",
    currency: "PLN",
    region: "PL",
    collected_at: NOW,
    fx_note: "USD shop bands ≈ PLN@4.0; housing kit FCP $705",
    parts_pln: band(200, 2800),
    labor_pln: band(1000, 2500),
    totals_pln: {
      independent: band(1200, 4500),
      specialist: band(1600, 5500),
      aso: band(2500, 7000),
    },
    quotes: [
      {
        tier: "parts",
        pln_low: 180,
        pln_high: 180,
        label: "BimmerWorld · B58 OFH gasket set ~$45",
        url: "https://www.bimmerworld.com/Engine/Gaskets/BMW-Oil-Filter-Housing-Gasket-Set-11428583896.html",
      },
      {
        tier: "parts",
        pln_low: 2800,
        pln_high: 2800,
        label: "FCP Euro · B58 oil filter housing kit ~$705",
        url: "https://www.fcpeuro.com/products/bmw-b58-engine-oil-filter-housing-replacement-kit-11428583895kt3",
      },
      {
        tier: "specialist",
        pln_low: 1200,
        pln_high: 6000,
        label: "Tysautoworks · gasket $300–800 / housing $800–1500+",
        url: "https://tysautoworksperformance.com/blogs/news/bmw-b58-oil-filter-housing-leak-cost-symptoms-when-to-fix-it-540i-340i-440i-guide",
      },
    ],
    formula: "gasket job low end; full housing kit + labor high end",
  },
  "n63-coolant-pipes": {
    pain_id: "n63-coolant-pipes",
    status: "quoted_parts_plus_labor",
    currency: "PLN",
    region: "PL",
    collected_at: NOW,
    fx_note: "EUR aluminum pipe jobs + USD RepairPal @4.3",
    parts_pln: eur(300, 800),
    labor_pln: eur(200, 600),
    totals_pln: {
      independent: eur(500, 1200),
      specialist: eur(600, 1500),
      aso: eur(1000, 2200),
    },
    quotes: [
      {
        tier: "specialist",
        pln_low: eur(500)[0],
        pln_high: eur(800)[0],
        label: "TempaDrive forum · N63 aluminum coolant pipes 500–800€",
        url: "https://forum.tempadrive.com/t/bmw-n63-hot-v-twin-turbo-v8-problems-guide",
      },
      {
        tier: "specialist",
        pln_low: Math.round(400 * 4.0),
        pln_high: Math.round(1200 * 4.0),
        label: "BimmerBoom / RepairPal class $400–1,200 total",
        url: "https://bimmerboom.com/bmw-n63-turbo-coolant-line-replacement-cost-insights/",
      },
    ],
    formula: "aluminum coolant pipe preventative 500–800€@4.3",
  },
  "i3-hv-battery": {
    pain_id: "i3-hv-battery",
    status: "quoted_parts_plus_labor",
    currency: "PLN",
    region: "PL",
    collected_at: NOW,
    fx_note: "PL Allegro + CZ EUR@4.3",
    parts_pln: band(6500, 30100),
    labor_pln: band(1000, 4000),
    totals_pln: {
      independent: band(6500, 29000),
      specialist: band(19350, 35000),
      aso: band(40000, 80000),
    },
    quotes: [
      {
        tier: "specialist",
        pln_low: 6500,
        pln_high: 6500,
        label: "e-dakro · regeneracja baterii i3 od 6 500 zł",
        url: "https://e-dakro.pl/regeneracja-baterii-trakcyjnych-kiedy-warto-i-ile-mozna-zaoszczedzic/",
      },
      {
        tier: "specialist",
        pln_low: 29000,
        pln_high: 29000,
        label: "Allegro Lokalnie · i3 upgrade 154Ah 29 000 zł (Poznań)",
        url: "https://allegrolokalnie.pl/oferta/bmw-i3-wymiana-baterii-60ah-94ah-120ah-na-154ah-or-upgrade-zasiegu",
      },
      {
        tier: "parts",
        pln_low: eur(4500)[0],
        pln_high: eur(7000)[0],
        label: "i3upgrade · new OEM 94/120Ah 4.500–7.000€ excl. VAT",
        url: "https://www.i3upgrade.cz/en/cenik.html",
      },
    ],
    formula: "regen low; PL upgrade / OEM pack mid–high; ASO outlier not used for independent",
  },
  "classic-cooling": {
    pain_id: "classic-cooling",
    status: "quoted_parts_plus_labor",
    currency: "PLN",
    region: "PL",
    collected_at: NOW,
    fx_note: "Family prior e36-cooling + S38 pump OEM ~400€",
    parts_pln: band(400, 1720),
    labor_pln: band(400, 1200),
    totals_pln: {
      independent: band(800, 2500),
      specialist: band(1200, 3500),
      aso: band(2000, 5000),
    },
    quotes: [
      {
        tier: "parts",
        pln_low: eur(400)[0],
        pln_high: eur(400)[0],
        label: "M5Board · S38 OEM water pump historically ~400€",
        url: "https://www.m5board.com/threads/s38-water-pump-rebuild.608383/",
      },
      {
        tier: "parts",
        pln_low: Math.round(595 * 4.0),
        pln_high: Math.round(595 * 4.0),
        label: "M5Board · S38 water pump rebuild service $595",
        url: "https://www.m5board.com/threads/e34m5-s38-b36-s38-b38-water-pump-rebuilt-service-with-core-exchange.618583/",
      },
      {
        tier: "specialist",
        pln_low: 800,
        pln_high: 2200,
        label: "Family prior · e36-cooling independent band (plastics refresh)",
        url: "http://www.bimmerboard.com/forums/posts/1269691",
      },
    ],
    formula: "classic M20/M30/S14/S38 cooling refresh ≈ e36-cooling + pump OEM quotes",
  },
  "b57-egr": {
    pain_id: "b57-egr",
    status: "quoted_parts_plus_labor",
    currency: "PLN",
    region: "PL",
    collected_at: NOW,
    fx_note: "B47 workshop band reused as B57 family prior (same EGR/carbon theme)",
    parts_pln: band(800, 2000),
    labor_pln: band(1500, 3000),
    totals_pln: {
      independent: band(2500, 5000),
      specialist: band(3200, 6000),
      aso: band(4500, 8000),
    },
    quotes: [
      {
        tier: "specialist",
        pln_low: 2500,
        pln_high: 5000,
        label: "Skanyx · EGR cooler band (B47 prior applied to B57)",
        url: "https://skanyx.com/pl/blog/bmw-m57-engine-buyer-guide-525d-530d-535d-obd2",
      },
      {
        tier: "specialist",
        pln_low: 2500,
        pln_high: 5000,
        label: "Warehouse · b47-egr job bands (modular diesel family)",
        url: "https://en.wikipedia.org/wiki/BMW_B57",
      },
    ],
    formula: "same independent band as b47-egr.json",
  },
};

for (const [id, job] of Object.entries(newJobs)) {
  fs.writeFileSync(path.join(jobsDir, `${id}.json`), JSON.stringify(job, null, 2) + "\n");
}

const painPath = path.join(ROOT, "data/warehouse/pains/top10_sourced_pains.json");
const pains = JSON.parse(fs.readFileSync(painPath, "utf8"));

// Extend existing rows
const byId = Object.fromEntries(pains.rows.map((r) => [r.id, r]));

if (byId["e36-cooling"]) {
  // Keep e36-cooling for E36-family plastics only — classics use classic-cooling.
  const e = byId["e36-cooling"];
  const classicChassis = new Set([
    "e12",
    "e21",
    "e23",
    "e24",
    "e28",
    "e28-m5",
    "e30",
    "e30-m3",
    "e31",
    "e32",
    "e34-m5",
  ]);
  const classicEngines = new Set(["M20", "M30", "M10", "S14", "S38"]);
  e.engines = (e.engines || []).filter((x) => !classicEngines.has(x));
  e.chassis_slugs = (e.chassis_slugs || []).filter((x) => !classicChassis.has(x));
}

if (byId["n20-oil-filter"]) {
  byId["n20-oil-filter"].engines = [
    ...new Set([...(byId["n20-oil-filter"].engines || []), "B58"]),
  ];
}

if (byId["s65-rod-bearings"]) {
  // keep S65-only; new S85 pain separate
}

if (byId["eu-winter-rust"]) {
  const r = byId["eu-winter-rust"];
  r.chassis_slugs = [
    ...new Set([
      ...(r.chassis_slugs || []),
      "e23",
      "e32",
      "e31",
      "e28",
      "e30",
      "e12",
      "e21",
      "e24",
    ]),
  ];
}

const NEW_PAINS = [
  {
    id: "s54-vanos",
    engines: ["S54"],
    chassis_slugs: ["e46-m3", "z3-m-coupe", "e85-z4"],
    year_from: 2000,
    year_to: 2008,
    title: {
      en: "S54 VANOS seals / unit",
      pl: "VANOS S54 — uszczelnienia / jednostka",
      ru: "VANOS S54 — уплотнения / блок",
    },
    affects: {
      en: "E46 M3 / Z3 M / Z4 M — S54 double VANOS",
      pl: "E46 M3 / Z3 M / Z4 M — podwójny VANOS S54",
      ru: "E46 M3 / Z3 M / Z4 M — двойной VANOS S54",
    },
    summary: {
      en: "S54 VANOS rattle and lost power are a known wear item. Send-in rebuilds and fitted overhauls are widely quoted in DE/UK.",
      pl: "Stuk VANOS i utrata mocy w S54 to znane zużycie. Przebudowy wysyłkowe i montaż w warsztacie są powszechnie wyceniane w DE/UK.",
      ru: "Стук VANOS и потеря тяги на S54 — известный износ. Переборки с отправкой и работа под ключ широко котируются в DE/UK.",
    },
    severity: "expensive",
    pln_bands: {
      parts: newJobs["s54-vanos"].parts_pln,
      labor: newJobs["s54-vanos"].labor_pln,
      independent: newJobs["s54-vanos"].totals_pln.independent,
      specialist: newJobs["s54-vanos"].totals_pln.specialist,
      aso: newJobs["s54-vanos"].totals_pln.aso,
      note: "From warehouse/repair_costs/jobs/s54-vanos.json",
    },
    sources: newJobs["s54-vanos"].quotes.map((q) => ({ label: `PLN · ${q.label}`, url: q.url })),
    autodoc_query: {
      en: "BMW S54 VANOS seals",
      pl: "BMW S54 uszczelnienia VANOS",
      ru: "BMW S54 уплотнения VANOS",
    },
    confidence: "specialist_rebuild_quotes+pln_fx",
  },
  {
    id: "s55-rod-bearings",
    engines: ["S55"],
    chassis_slugs: ["f80", "f82", "f87"],
    year_from: 2014,
    year_to: 2020,
    title: {
      en: "Rod bearings (S55)",
      pl: "Panewki korbowodowe (S55)",
      ru: "Вкладыши шатунов (S55)",
    },
    affects: {
      en: "F80 M3 / F82 M4 / F87 M2 Competition — preventative bearings",
      pl: "F80 M3 / F82 M4 / F87 M2 Competition — wymiana profilaktyczna",
      ru: "F80 M3 / F82 M4 / F87 M2 Competition — превентивная замена",
    },
    summary: {
      en: "S55 rod bearings are treated as planned M-car maintenance. German specialists publish fitted packages from ~2.500€.",
      pl: "Panewki S55 traktuje się jak planowy serwis aut M. Niemieccy specjaliści publikują pakiety od ~2.500€.",
      ru: "Вкладыши S55 считают плановым ТО для M. Немецкие специалисты публикуют пакеты от ~2.500€.",
    },
    severity: "engine-loss",
    pln_bands: {
      parts: newJobs["s55-rod-bearings"].parts_pln,
      labor: newJobs["s55-rod-bearings"].labor_pln,
      independent: newJobs["s55-rod-bearings"].totals_pln.independent,
      specialist: newJobs["s55-rod-bearings"].totals_pln.specialist,
      aso: newJobs["s55-rod-bearings"].totals_pln.aso,
      note: "From warehouse/repair_costs/jobs/s55-rod-bearings.json",
    },
    sources: newJobs["s55-rod-bearings"].quotes.map((q) => ({ label: `PLN · ${q.label}`, url: q.url })),
    autodoc_query: {
      en: "BMW S55 rod bearings",
      pl: "BMW S55 panewki korbowodowe",
      ru: "BMW S55 вкладыши шатунов",
    },
    confidence: "specialist_package_quote+pln_fx",
  },
  {
    id: "s62-rod-bearings",
    engines: ["S62"],
    chassis_slugs: ["e39-m5"],
    year_from: 1998,
    year_to: 2003,
    title: {
      en: "Rod bearings (S62 V8)",
      pl: "Panewki korbowodowe (S62 V8)",
      ru: "Вкладыши шатунов (S62 V8)",
    },
    affects: {
      en: "E39 M5 S62 — preventative rod bearings",
      pl: "E39 M5 S62 — profilaktyczna wymiana panewek",
      ru: "E39 M5 S62 — превентивная замена вкладышей",
    },
    summary: {
      en: "S62 shares the M-car rod-bearing theme. Aulitzky publishes a fitted E39 M5 package at 1.749€.",
      pl: "S62 dzieli temat panewek aut M. Aulitzky publikuje pakiet E39 M5 za 1.749€.",
      ru: "S62 делит тему вкладышей M-машин. Aulitzky публикует пакет E39 M5 за 1.749€.",
    },
    severity: "engine-loss",
    pln_bands: {
      parts: newJobs["s62-rod-bearings"].parts_pln,
      labor: newJobs["s62-rod-bearings"].labor_pln,
      independent: newJobs["s62-rod-bearings"].totals_pln.independent,
      specialist: newJobs["s62-rod-bearings"].totals_pln.specialist,
      aso: newJobs["s62-rod-bearings"].totals_pln.aso,
      note: "From warehouse/repair_costs/jobs/s62-rod-bearings.json",
    },
    sources: newJobs["s62-rod-bearings"].quotes.map((q) => ({ label: `PLN · ${q.label}`, url: q.url })),
    autodoc_query: {
      en: "BMW S62 rod bearings",
      pl: "BMW S62 panewki",
      ru: "BMW S62 вкладыши",
    },
    confidence: "specialist_package_quote+pln_fx",
  },
  {
    id: "s85-rod-bearings",
    engines: ["S85"],
    chassis_slugs: ["e60-m5", "e63"],
    year_from: 2005,
    year_to: 2010,
    title: {
      en: "Rod bearings (S85 V10)",
      pl: "Panewki korbowodowe (S85 V10)",
      ru: "Вкладыши шатунов (S85 V10)",
    },
    affects: {
      en: "E60/E61 M5 and E63/E64 M6 — S85 preventative bearings",
      pl: "E60/E61 M5 i E63/E64 M6 — panewki S85",
      ru: "E60/E61 M5 и E63/E64 M6 — вкладыши S85",
    },
    summary: {
      en: "S85 V10 rod bearings are a documented preventative job. Fitted DE/UK packages sit around 2.750–3.050€.",
      pl: "Panewki S85 V10 to udokumentowany serwis profilaktyczny. Pakiety DE/UK ok. 2.750–3.050€.",
      ru: "Вкладыши S85 V10 — документированное превентивное ТО. Пакеты DE/UK около 2.750–3.050€.",
    },
    severity: "engine-loss",
    pln_bands: {
      parts: newJobs["s85-rod-bearings"].parts_pln,
      labor: newJobs["s85-rod-bearings"].labor_pln,
      independent: newJobs["s85-rod-bearings"].totals_pln.independent,
      specialist: newJobs["s85-rod-bearings"].totals_pln.specialist,
      aso: newJobs["s85-rod-bearings"].totals_pln.aso,
      note: "From warehouse/repair_costs/jobs/s85-rod-bearings.json",
    },
    sources: newJobs["s85-rod-bearings"].quotes.map((q) => ({ label: `PLN · ${q.label}`, url: q.url })),
    autodoc_query: {
      en: "BMW S85 rod bearings",
      pl: "BMW S85 panewki",
      ru: "BMW S85 вкладыши",
    },
    confidence: "specialist_package_quote+pln_fx",
  },
  {
    id: "s63-rod-bearings",
    engines: ["S63", "S68"],
    chassis_slugs: ["f10-m5", "f90", "g90", "f85", "f86", "f97"],
    year_from: 2011,
    year_to: 2030,
    title: {
      en: "Rod bearings (S63 / S68 V8)",
      pl: "Panewki korbowodowe (S63 / S68 V8)",
      ru: "Вкладыши шатунов (S63 / S68 V8)",
    },
    affects: {
      en: "F10/F90 M5 and related S63; S68 PHEV uses same bearing theme until dedicated quotes",
      pl: "F10/F90 M5 i pokrewne S63; S68 PHEV — ten sam temat panewek do czasu osobnych wycen",
      ru: "F10/F90 M5 и родственные S63; S68 PHEV — та же тема вкладышей до отдельных котировок",
    },
    summary: {
      en: "S63 hot-V V8 carriers often budget preventative rod bearings. S68 reuses the M V8 bearing theme until a dedicated package is published.",
      pl: "Właściciele S63 często planują profilaktyczne panewki. S68 korzysta z tego samego tematu V8 M, dopóki nie ma osobnego pakietu.",
      ru: "Владельцы S63 часто закладывают превентивные вкладыши. S68 использует ту же тему V8 M, пока нет отдельного пакета.",
    },
    severity: "engine-loss",
    pln_bands: {
      parts: newJobs["s63-rod-bearings"].parts_pln,
      labor: newJobs["s63-rod-bearings"].labor_pln,
      independent: newJobs["s63-rod-bearings"].totals_pln.independent,
      specialist: newJobs["s63-rod-bearings"].totals_pln.specialist,
      aso: newJobs["s63-rod-bearings"].totals_pln.aso,
      note: "From warehouse/repair_costs/jobs/s63-rod-bearings.json; S68 family prior",
    },
    sources: newJobs["s63-rod-bearings"].quotes.map((q) => ({ label: `PLN · ${q.label}`, url: q.url })),
    autodoc_query: {
      en: "BMW S63 rod bearings",
      pl: "BMW S63 panewki",
      ru: "BMW S63 вкладыши",
    },
    confidence: "specialist_guide+pln_fx+family_prior_s68",
  },
  {
    id: "s58-rod-bearings",
    engines: ["S58"],
    chassis_slugs: ["g80", "g81", "g82", "g87", "f97"],
    year_from: 2019,
    year_to: 2030,
    title: {
      en: "Rod bearings (S58)",
      pl: "Panewki korbowodowe (S58)",
      ru: "Вкладыши шатунов (S58)",
    },
    affects: {
      en: "G80/G81 M3, G82 M4, G87 M2, X3M — S58",
      pl: "G80/G81 M3, G82 M4, G87 M2, X3M — S58",
      ru: "G80/G81 M3, G82 M4, G87 M2, X3M — S58",
    },
    summary: {
      en: "S58 coated bearing kits are sold for ~516€; labor follows the S55 preventative class until a dedicated fitted package is listed.",
      pl: "Zestawy panewek S58 kosztują ~516€; robocizna jak klasa S55, dopóki nie ma osobnego pakietu montażu.",
      ru: "Комплекты вкладышей S58 ~516€; работа как класс S55, пока нет отдельного пакета монтажа.",
    },
    severity: "engine-loss",
    pln_bands: {
      parts: newJobs["s58-rod-bearings"].parts_pln,
      labor: newJobs["s58-rod-bearings"].labor_pln,
      independent: newJobs["s58-rod-bearings"].totals_pln.independent,
      specialist: newJobs["s58-rod-bearings"].totals_pln.specialist,
      aso: newJobs["s58-rod-bearings"].totals_pln.aso,
      note: "From warehouse/repair_costs/jobs/s58-rod-bearings.json",
    },
    sources: newJobs["s58-rod-bearings"].quotes.map((q) => ({ label: `PLN · ${q.label}`, url: q.url })),
    autodoc_query: {
      en: "BMW S58 rod bearings",
      pl: "BMW S58 panewki",
      ru: "BMW S58 вкладыши",
    },
    confidence: "parts_quote+s55_labor_family_prior",
  },
  {
    id: "b58-oil-filter",
    engines: ["B58"],
    chassis_slugs: [
      "g11",
      "g15",
      "g70",
      "g30",
      "g20",
      "g01",
      "g02",
      "g05",
      "f22",
      "f30",
      "g42",
      "g60",
    ],
    title: {
      en: "B58 oil filter housing gasket / housing",
      pl: "Uszczelka / obudowa filtra oleju B58",
      ru: "Прокладка / корпус масляного фильтра B58",
    },
    affects: {
      en: "B58 40i / 740i / 840i — oil/coolant leak at filter housing",
      pl: "B58 40i / 740i / 840i — wyciek oleju/płynu przy obudowie filtra",
      ru: "B58 40i / 740i / 840i — течь масла/антифриза у корпуса фильтра",
    },
    summary: {
      en: "B58 oil filter housing gaskets (or the whole plastic housing) are a common leak. Labor is high because of the intake path.",
      pl: "Uszczelki obudowy filtra B58 (albo cały plastik) to częsty wyciek. Robocizna wysoka przez dostęp od dolotu.",
      ru: "Прокладки корпуса фильтра B58 (или весь пластик) — частая течь. Работа дорогая из‑за доступа через впуск.",
    },
    severity: "annoyance",
    pln_bands: {
      parts: newJobs["b58-oil-filter"].parts_pln,
      labor: newJobs["b58-oil-filter"].labor_pln,
      independent: newJobs["b58-oil-filter"].totals_pln.independent,
      specialist: newJobs["b58-oil-filter"].totals_pln.specialist,
      aso: newJobs["b58-oil-filter"].totals_pln.aso,
      note: "From warehouse/repair_costs/jobs/b58-oil-filter.json",
    },
    sources: newJobs["b58-oil-filter"].quotes.map((q) => ({ label: `PLN · ${q.label}`, url: q.url })),
    autodoc_query: {
      en: "BMW B58 oil filter housing gasket",
      pl: "BMW B58 uszczelka obudowy filtra oleju",
      ru: "BMW B58 прокладка корпуса масляного фильтра",
    },
    confidence: "parts_catalog+shop_cost_guide",
  },
  {
    id: "n63-coolant-pipes",
    engines: ["N63"],
    chassis_slugs: ["g11", "g15", "f01", "f10", "e70", "f15", "f16"],
    year_from: 2008,
    year_to: 2020,
    title: {
      en: "N63 hot-V coolant pipes",
      pl: "Rury chłodzenia N63 (hot-V)",
      ru: "Патрубки охлаждения N63 (hot-V)",
    },
    affects: {
      en: "N63 V8 — brittle plastic coolant pipes in the hot V",
      pl: "V8 N63 — kruche plastikowe rury chłodzenia w hot-V",
      ru: "V8 N63 — хрупкие пластиковые патрубки в hot-V",
    },
    summary: {
      en: "N63 plastic coolant pipes in the turbo valley fail with age. Aluminum replacements are a common preventative quote (~500–800€).",
      pl: "Plastikowe rury chłodzenia N63 w dolinie turbo pękają z wiekiem. Aluminiowa wymiana to częsta wycena profilaktyczna (~500–800€).",
      ru: "Пластиковые патрубки N63 в развале турбин трескаются с возрастом. Алюминиевая замена — частая превентивная котировка (~500–800€).",
    },
    severity: "overheat",
    pln_bands: {
      parts: newJobs["n63-coolant-pipes"].parts_pln,
      labor: newJobs["n63-coolant-pipes"].labor_pln,
      independent: newJobs["n63-coolant-pipes"].totals_pln.independent,
      specialist: newJobs["n63-coolant-pipes"].totals_pln.specialist,
      aso: newJobs["n63-coolant-pipes"].totals_pln.aso,
      note: "From warehouse/repair_costs/jobs/n63-coolant-pipes.json",
    },
    sources: newJobs["n63-coolant-pipes"].quotes.map((q) => ({ label: `PLN · ${q.label}`, url: q.url })),
    autodoc_query: {
      en: "BMW N63 coolant pipe",
      pl: "BMW N63 rura chłodzenia",
      ru: "BMW N63 патрубок охлаждения",
    },
    confidence: "forum_quote+repairpal_class+pln_fx",
  },
  {
    id: "i3-hv-battery",
    engines: ["IBE0", "IB1", "Range Extender", "B38"],
    chassis_slugs: ["i3", "i4", "i8"],
    title: {
      en: "HV battery / pack service",
      pl: "Bateria HV / serwis pakietu",
      ru: "Тяговая батарея / сервис пакета",
    },
    affects: {
      en: "i3 / i4 / i8 — traction battery capacity loss or failure",
      pl: "i3 / i4 / i8 — utrata pojemności lub awaria baterii trakcyjnej",
      ru: "i3 / i4 / i8 — потеря ёмкости или отказ тяговой батареи",
    },
    summary: {
      en: "EV pack work dominates ownership risk. PL regen from ~6.500 zł; OEM/upgrade packs are five-figure PLN. i8 B38 hybrid still inherits pack-cost class.",
      pl: "Praca przy pakiecie HV dominuje ryzyko. Regeneracja w PL od ~6.500 zł; pakiety OEM/upgrade to pięciocyfrowe kwoty. Hybryda i8 B38 dziedziczy klasę kosztów pakietu.",
      ru: "Работы по HV-пакету доминируют риск. Регенерация в PL от ~6.500 zł; OEM/апгрейд — пятизначные суммы. Гибрид i8 B38 наследует класс стоимости пакета.",
    },
    severity: "expensive",
    pln_bands: {
      parts: newJobs["i3-hv-battery"].parts_pln,
      labor: newJobs["i3-hv-battery"].labor_pln,
      independent: newJobs["i3-hv-battery"].totals_pln.independent,
      specialist: newJobs["i3-hv-battery"].totals_pln.specialist,
      aso: newJobs["i3-hv-battery"].totals_pln.aso,
      note: "From warehouse/repair_costs/jobs/i3-hv-battery.json",
    },
    sources: newJobs["i3-hv-battery"].quotes.map((q) => ({ label: `PLN · ${q.label}`, url: q.url })),
    autodoc_query: {
      en: "BMW i3 battery",
      pl: "BMW i3 bateria",
      ru: "BMW i3 батарея",
    },
    confidence: "pl_quote+eu_oem_pack_quote",
  },
  {
    id: "classic-cooling",
    engines: ["M10", "M20", "M30", "S14", "S38"],
    chassis_slugs: [
      "e12",
      "e21",
      "e23",
      "e24",
      "e28",
      "e28-m5",
      "e30",
      "e30-m3",
      "e31",
      "e32",
      "e34-m5",
    ],
    title: {
      en: "Classic cooling / water pump",
      pl: "Chłodzenie klasyków / pompa wody",
      ru: "Охлаждение классики / помпа",
    },
    affects: {
      en: "Pre-2000 sixes and early M engines — pumps, radiators, aged hoses",
      pl: "Szóstki sprzed 2000 i wczesne M — pompy, chłodnice, stare przewody",
      ru: "Шестёрки до 2000 и ранние M — помпы, радиаторы, старые шланги",
    },
    summary: {
      en: "Age cooling failures (pump, radiator, hoses) are the routine bill on classics. S38 pump OEM/rebuild quotes anchor the parts side.",
      pl: "Awaria chłodzenia z wieku (pompa, chłodnica, przewody) to rutynowy rachunek klasyków. Wyceny pompy S38 kotwiczą stronę części.",
      ru: "Возрастные отказы охлаждения (помпа, радиатор, шланги) — рутинный счёт классики. Котировки помпы S38 якорят сторону запчастей.",
    },
    severity: "overheat",
    pln_bands: {
      parts: newJobs["classic-cooling"].parts_pln,
      labor: newJobs["classic-cooling"].labor_pln,
      independent: newJobs["classic-cooling"].totals_pln.independent,
      specialist: newJobs["classic-cooling"].totals_pln.specialist,
      aso: newJobs["classic-cooling"].totals_pln.aso,
      note: "From warehouse/repair_costs/jobs/classic-cooling.json",
    },
    sources: newJobs["classic-cooling"].quotes.map((q) => ({ label: `PLN · ${q.label}`, url: q.url })),
    autodoc_query: {
      en: "BMW M30 water pump",
      pl: "BMW M30 pompa wody",
      ru: "BMW M30 помпа",
    },
    confidence: "oem_forum_quote+e36_cooling_family_prior",
  },
  {
    id: "b57-egr",
    engines: ["B57"],
    chassis_slugs: ["g11", "g30", "g01", "g05", "g07", "g15"],
    year_from: 2015,
    year_to: 2030,
    title: {
      en: "B57 EGR / intake carbon",
      pl: "B57 EGR / nagar w dolocie",
      ru: "B57 EGR / нагар во впуске",
    },
    affects: {
      en: "B57 30d / 40d / 750d — EGR cooler and intake carbon",
      pl: "B57 30d / 40d / 750d — chłodnica EGR i nagar",
      ru: "B57 30d / 40d / 750d — EGR и нагар",
    },
    summary: {
      en: "B57 modular diesel follows the B47 EGR/carbon theme more than an N47 chain story. PLN band reused from sourced B47 workshop prior.",
      pl: "Diesle B57 idą raczej tematami EGR/nagar jak B47, nie łańcuchem N47. Pasmo PLN z wyceny warsztatowej B47.",
      ru: "Дизели B57 ближе к теме EGR/нагара B47, чем к цепи N47. Полоса PLN из цеховой котировки B47.",
    },
    severity: "expensive",
    pln_bands: {
      parts: newJobs["b57-egr"].parts_pln,
      labor: newJobs["b57-egr"].labor_pln,
      independent: newJobs["b57-egr"].totals_pln.independent,
      specialist: newJobs["b57-egr"].totals_pln.specialist,
      aso: newJobs["b57-egr"].totals_pln.aso,
      note: "From warehouse/repair_costs/jobs/b57-egr.json — B47 family prior",
    },
    sources: newJobs["b57-egr"].quotes.map((q) => ({ label: `PLN · ${q.label}`, url: q.url })),
    autodoc_query: {
      en: "BMW B57 EGR cooler",
      pl: "BMW B57 chłodnica EGR",
      ru: "BMW B57 охладитель EGR",
    },
    confidence: "wiki+b47_family_prior",
  },
];

for (const p of NEW_PAINS) {
  if (byId[p.id]) {
    Object.assign(byId[p.id], p);
  } else {
    pains.rows.push(p);
    byId[p.id] = p;
  }
}

pains.collected_at = NOW;
pains.meta = {
  ...(pains.meta || {}),
  phase_e_note: "Filled pending M/EV/classic/B58/B57/N63 pains with sourced PLN quotes",
};

fs.writeFileSync(painPath, JSON.stringify(pains, null, 2) + "\n");
fs.copyFileSync(painPath, path.join(ROOT, "src/data/imported/pains.json"));

// Wire volume.ts pending → real pain ids
const volPath = path.join(ROOT, "src/data/volume.ts");
let vol = fs.readFileSync(volPath, "utf8");
const map = {
  '"pending-s54"': '"s54-vanos"',
  '"pending-s55"': '"s55-rod-bearings"',
  '"pending-s62"': '"s62-rod-bearings"',
  '"pending-s85"': '"s85-rod-bearings"',
  '"pending-s63"': '"s63-rod-bearings"',
  '"pending-s68"': '"s63-rod-bearings"',
  '"pending-s58"': '"s58-rod-bearings"',
  '"pending-s38"': '"classic-cooling"',
  '"pending-s14"': '"classic-cooling"',
  '"pending-classic"': '"classic-cooling"',
  '"pending-b58"': '"b58-oil-filter"',
  '"pending-b57"': '"b57-egr"',
  '"pending-n63"': '"n63-coolant-pipes"',
  '"pending-ev"': '"i3-hv-battery"',
  '"pending-b38"': '"i3-hv-battery"',
};
for (const [from, to] of Object.entries(map)) {
  vol = vol.split(from).join(to);
}
// Remove stale comments about no B58 pain
vol = vol.replace(/\s*\/\/ No sourced B58 pain yet[^\n]*/g, "");
fs.writeFileSync(volPath, vol);

console.log("jobs", Object.keys(newJobs).length);
console.log("new pains", NEW_PAINS.map((p) => p.id).join(", "));
console.log("volume pending left", (vol.match(/pending-/g) || []).length);
