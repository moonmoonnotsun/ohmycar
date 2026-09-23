#!/usr/bin/env node
/**
 * Phase F2c — M-car secondary pains (S54/S55/S65/S63/S85/S58).
 * Tier B: BMWTuning rod-bearing + S65 ITB actuators + S55 crank hub / oil leaks;
 * Beisan/Turner-class S54 VANOS already present; LuxuryCarsGuide S63 stems.
 * No invented free recalls without PDF. PLN: reuse Aulitzky / S65 / VANOS priors.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const painPath = path.join(ROOT, "data/warehouse/pains/top10_sourced_pains.json");
const NOW = "2026-09-23T20:00:00Z";

const pains = JSON.parse(fs.readFileSync(painPath, "utf8"));
const byId = Object.fromEntries(pains.rows.map((r) => [r.id, r]));

function upsert(row) {
  const i = pains.rows.findIndex((r) => r.id === row.id);
  if (i >= 0) pains.rows[i] = { ...pains.rows[i], ...row };
  else pains.rows.push(row);
  byId[row.id] = pains.rows.find((r) => r.id === row.id);
}

function mergeChassis(id, extra) {
  const cur = byId[id];
  if (!cur) return;
  upsert({
    ...cur,
    chassis_slugs: [...new Set([...(cur.chassis_slugs || []), ...extra])],
  });
}

const s65Pln = byId["s65-rod-bearings"]?.pln_bands;
const s55Pln = byId["s55-rod-bearings"]?.pln_bands;

// —— Chassis map hygiene ——
mergeChassis("s54-vanos", ["e46-m3", "e85-z4", "e86-z4", "z3-m-coupe", "z3-m-roadster"]);
mergeChassis("s55-rod-bearings", ["f80", "f82", "f83", "f87"]);
mergeChassis("s65-rod-bearings", ["e9x-m3", "e90-m3", "e92-m3", "e93-m3"]);
mergeChassis("s63-rod-bearings", [
  "f10-m5",
  "f06",
  "f12",
  "f13",
  "f85",
  "f86",
  "f90",
  "f91",
  "f92",
  "f93",
  "f95",
  "f96",
  "f97",
  "f98",
  "g90",
  "g99",
]);
mergeChassis("s58-rod-bearings", ["g80", "g81", "g82", "g83", "g87", "f97", "f98"]);
mergeChassis("s85-rod-bearings", ["e60-m5", "e61", "e63", "e64"]);
mergeChassis("s62-rod-bearings", ["e39-m5"]);

// —— S54 rod bearings (BMWTuning: S54/S65/S85 class; early 2001–03 highest) ——
upsert({
  id: "s54-rod-bearings",
  engines: ["S54"],
  chassis_slugs: ["e46-m3", "e85-z4", "e86-z4", "z3-m-coupe", "z3-m-roadster"],
  year_from: 2000,
  year_to: 2008,
  title: {
    en: "S54 rod bearings (preventative)",
    pl: "S54 panewki korbowodowe (prewencja)",
    ru: "S54 вкладыши шатунов (профилактика)",
  },
  affects: {
    en: "E46 M3 / Z3M / Z4M — especially early ~2001–2003 builds",
    pl: "E46 M3 / Z3M / Z4M — szczególnie wczesne ~2001–2003",
    ru: "E46 M3 / Z3M / Z4M — особенно ранние ~2001–2003",
  },
  summary: {
    en: "BMWTuning’s rod-bearing survey lists S54 with S65/S85 as the classic high-rpm M engines with tight clearances and premature wear risk (highest chatter around early 2001–2003). Confirm oil analysis (Pb/Cu) and service history before buy. Separate from the S54 VANOS rebuild theme. PLN band reused from sourced S65 preventative prior (same job class).",
    pl: "BMWTuning: S54 wraz z S65/S85 — ciasne panewki i ryzyko zużycia (szczególnie ~2001–2003). Analiza oleju + historia. Osobno od VANOS. PLN z prior S65.",
    ru: "BMWTuning: S54 вместе с S65/S85 — риск вкладышей. Отдельно от VANOS. PLN из S65.",
  },
  severity: "engine-loss",
  pln_bands: s65Pln || undefined,
  sources: [
    {
      label: "BMWTuning · BMW rod bearing failure (S54 / S65 / S85)",
      url: "https://bmwtuning.co/bmw-rod-bearing-failure/",
    },
    {
      label: "Beisan Systems · S54 VANOS context (same ownership era)",
      url: "https://beisansystems.com/s54-vanos-procedure-e46-m3/",
    },
  ],
  autodoc_query: {
    en: "BMW S54 rod bearings",
    pl: "BMW S54 panewki korbowodowe",
    ru: "BMW S54 вкладыши",
  },
});

// —— S65 throttle actuators ——
upsert({
  id: "s65-throttle-actuators",
  engines: ["S65"],
  chassis_slugs: ["e9x-m3", "e90-m3", "e92-m3", "e93-m3"],
  year_from: 2007,
  year_to: 2013,
  title: {
    en: "S65 individual throttle actuators",
    pl: "S65 siłowniki przepustnic ITB",
    ru: "S65 актуаторы ITB",
  },
  affects: {
    en: "E9x M3 S65 — bank actuators (plastic gears / boards)",
    pl: "E9x M3 S65 — siłowniki banków (plastikowe koła / elektronika)",
    ru: "E9x M3 S65 — актуаторы банков",
  },
  summary: {
    en: "BMWTuning lists S65 ITB throttle actuators as the second classic ownership cost after rod bearings: plastic gears wear and circuit boards fail → limp / EML / DSC. Mileage varies; budget replacement (not endless rebuilds on aged units). Separate from bearings.",
    pl: "BMWTuning: siłowniki ITB S65 to drugi klasyczny koszt po panewkach — koła zębate / elektronika → limp / EML. Osobno od panewek.",
    ru: "BMWTuning: актуаторы ITB S65 — вторая тема после вкладышей.",
  },
  severity: "expensive",
  pln_bands: {
    parts: [2500, 7000],
    labor: [800, 2000],
    independent: [3500, 8500],
    specialist: [4500, 11000],
    aso: [6000, 14000],
    note: "Family prior: dual-bank actuator replacement class (refine with Autodoc / indie quotes)",
  },
  sources: [
    {
      label: "BMWTuning · S65 throttle body actuator failures",
      url: "https://bmwtuning.co/s65-engine-problems/",
    },
    {
      label: "BMWTuning · S65 rod bearings (companion ownership theme)",
      url: "https://bmwtuning.co/bmw-rod-bearing-failure/",
    },
  ],
  autodoc_query: {
    en: "BMW S65 throttle actuator",
    pl: "BMW S65 siłownik przepustnicy",
    ru: "BMW S65 актуатор дросселя",
  },
});

// —— S55 crank hub ——
upsert({
  id: "s55-crank-hub",
  engines: ["S55"],
  chassis_slugs: ["f80", "f82", "f83", "f87"],
  year_from: 2014,
  year_to: 2021,
  title: {
    en: "S55 crank hub slip (friction hub)",
    pl: "S55 poślizg crank hub (cierny)",
    ru: "S55 проскальзывание crank hub",
  },
  affects: {
    en: "F80/F82/F83/F87 Comp — more discussed on tuned / hard-shift cars",
    pl: "F80/F82/F83/F87 Comp — częściej przy tuningu / twardych zmianach biegów",
    ru: "F80/F82/F83/F87 Comp — чаще на тюнинге / жёстких переключениях",
  },
  summary: {
    en: "Specialist guides (BMWTuning, MM-X, R44) document S55 friction crank-hub slip that can retard timing after shock loads; not as epidemic as S54/S65 bearings, but a real ownership topic especially on modified cars. Stock cars: inspect history / listen for timing complaints. Distinct from rod-bearing preventative work. PLN: hub + retiming indie band prior.",
    pl: "Przewodniki (BMWTuning, MM-X, R44): poślizg ciernego crank hub — nie epidemia jak panewki S54/S65, ale realny temat (szczególnie tuning). Osobno od panewek.",
    ru: "Специалисты: проскальзывание crank hub S55 — не эпидемия, но реальная тема. Отдельно от вкладышей.",
  },
  severity: "expensive",
  pln_bands: {
    parts: [1500, 4500],
    labor: [2000, 5000],
    independent: [4000, 9000],
    specialist: [5500, 12000],
    aso: [8000, 16000],
    note: "Prior: crank hub + timing correction job class (refine with Autodoc)",
  },
  sources: [
    {
      label: "BMWTuning · S55 crank hub discussion",
      url: "https://bmwtuning.co/the-4-most-common-bmw-s55-engine-problems/",
    },
    {
      label: "MM-X · F8x / M2C crank hub failure & fix",
      url: "https://mm-x.com/blogs/news/bmw-crank-hub-whats-the-problem",
    },
    {
      label: "R44 Performance · S55 reliability / crank hub",
      url: "https://r44performance.com/blogs/r44-central/bmw-s55-engine-review-reliability-performance-servicing",
    },
    {
      label: "Wikipedia · BMW N55 / S55 (S55 applications)",
      url: "https://en.wikipedia.org/wiki/BMW_N55",
    },
  ],
  autodoc_query: {
    en: "BMW S55 crank hub",
    pl: "BMW S55 crank hub",
    ru: "BMW S55 crank hub",
  },
});

// —— S55 OFH / valve-cover oil leaks via shared OFH ——
if (byId["n20-oil-filter"]) {
  upsert({
    ...byId["n20-oil-filter"],
    engines: [...new Set([...(byId["n20-oil-filter"].engines || []), "S55"])],
    summary: {
      en: "Plastic OFH gasket leak is common on N20/N52/N55/B48/B38 and also appears on aging S55 (BMWTuning / R44 oil-leak notes) alongside valve-cover gasket wear. Inspect oil on the belt / undertray. Not a substitute for checking bearings / crank hub on M cars.",
      pl: "Wyciek OFH typowy też na starzejącym się S55 (obok pokrywy zaworów). Nie zastępuje kontroli panewek / crank hub.",
      ru: "Течь OFH также на стареющем S55. Не заменяет проверку вкладышей / crank hub.",
    },
    sources: [
      ...(byId["n20-oil-filter"].sources || []),
      {
        label: "BMWTuning · S55 oil leaks (valve cover / OFH)",
        url: "https://bmwtuning.co/the-4-most-common-bmw-s55-engine-problems/",
      },
    ],
  });
}

// —— S63 valve stem seals / oil consumption ——
upsert({
  id: "s63-valve-stem-seals",
  engines: ["S63"],
  chassis_slugs: [
    "f10-m5",
    "f06",
    "f12",
    "f13",
    "f85",
    "f86",
    "f90",
    "f91",
    "f92",
    "f93",
    "f95",
    "f96",
  ],
  year_from: 2011,
  year_to: 2018,
  title: {
    en: "S63 valve-stem seals / oil smoke (early hot-V)",
    pl: "S63 uszczelniacze zaworów / dymienie (wczesny hot-V)",
    ru: "S63 маслосъёмные колпачки / дымление (ранний hot-V)",
  },
  affects: {
    en: "Early S63 F10/F1x / F85/F86 era — blue smoke on overrun",
    pl: "Wczesne S63 F10/F1x / F85/F86 — niebieski dym na overrun",
    ru: "Ранние S63 F10/F1x / F85/F86 — синий дым на overrun",
  },
  summary: {
    en: "Specialist ownership guides list valve-stem seal oil consumption / blue smoke on early hot-V S63 (F10 M5 era) as a separate theme from rod-bearing preventative work. Later TU / S63B44TU cars improved; bound here to ~2011–2018 early population until a Tier A TU cut is cited. Confirm smoke and oil use on test drive.",
    pl: "Przewodniki: uszczelniacze / zużycie oleju na wczesnym hot-V S63 (era F10) — osobno od panewek. Późniejsze TU lepsze; okno ~2011–2018 do daty Tier A. Sprawdź dym.",
    ru: "Ранний hot-V S63 — колпачки / расход масла, отдельно от вкладышей. Окно ~2011–2018.",
  },
  severity: "expensive",
  pln_bands: {
    parts: [2000, 5000],
    labor: [4000, 10000],
    independent: [6000, 14000],
    specialist: [8000, 18000],
    aso: [12000, 25000],
    note: "Head-off stem seal job class prior (refine with Autodoc / indie quotes)",
  },
  sources: [
    {
      label: "LuxuryCarsGuide · S63 failure themes (stems / bearings class)",
      url: "https://www.luxurycarsguide.com/guides/bmw-s63-engine-failure-rate/",
    },
    {
      label: "Existing warehouse · s63-rod-bearings companion",
      url: "https://bimmer.ai/bmw-common-problems/s55-rod-bearings/",
    },
  ],
  autodoc_query: {
    en: "BMW S63 valve stem seals",
    pl: "BMW S63 uszczelniacze zaworów",
    ru: "BMW S63 маслосъёмные колпачки",
  },
});

// —— S58 OFH via B58 housing family ——
if (byId["b58-oil-filter"]) {
  upsert({
    ...byId["b58-oil-filter"],
    engines: [...new Set([...(byId["b58-oil-filter"].engines || []), "S58"])],
    chassis_slugs: [
      ...new Set([
        ...(byId["b58-oil-filter"].chassis_slugs || []),
        "g80",
        "g81",
        "g82",
        "g83",
        "g87",
        "f97",
        "f98",
      ]),
    ],
    summary: {
      en: "B58/S58 share the plastic oil-filter housing family — gasket / housing leaks are a documented B58 theme (FCP / BimmerWorld) and apply as an inspection item on S58 M cars alongside the separate rod-bearing preventative discussion. Confirm dry housing and service history.",
      pl: "B58/S58 dzielą plastikową OFH — wycieki jak na B58; na S58 sprawdzaj osobno od panewek.",
      ru: "B58/S58 делят пластиковый OFH — проверяйте течи отдельно от вкладышей.",
    },
    sources: [
      ...(byId["b58-oil-filter"].sources || []),
      {
        label: "FCP Euro · B58 OFH replacement kit (housing family)",
        url: "https://www.fcpeuro.com/products/bmw-b58-engine-oil-filter-housing-replacement-kit-11428583895kt3",
      },
    ],
  });
}

// —— S85: note companion SMG/ITB is deferred without dedicated PLN; strengthen summary ——
if (byId["s85-rod-bearings"]) {
  upsert({
    ...byId["s85-rod-bearings"],
    summary: {
      en: "S85 rod bearings sit in the same S54/S65/S85 class documented by BMWTuning (tight clearances, 10W-60 discipline). E60/E63 M5/M6 buyers should also budget SMG pump / clutch and throttle-actuator history separately when those jobs are sourced. Confirm oil analysis before buy.",
      pl: "S85 w klasie panewek S54/S65/S85 (BMWTuning). Osobno budżetuj SMG / siłowniki gdy będą wyceny. Analiza oleju.",
      ru: "S85 в классе вкладышей S54/S65/S85. SMG/актуаторы — отдельно при наличии котировок.",
    },
    sources: [
      ...(byId["s85-rod-bearings"].sources || []),
      {
        label: "BMWTuning · rod bearing failure (S54 / S65 / S85)",
        url: "https://bmwtuning.co/bmw-rod-bearing-failure/",
      },
    ],
  });
}

pains.collected_at = NOW;
pains.meta = {
  ...(pains.meta || {}),
  phase_f2c_note:
    "S54 rod bearings; S65 ITB actuators; S55 crank hub + OFH; S63 valve stems; S58→B58 OFH; M chassis map expand",
};

fs.writeFileSync(painPath, JSON.stringify(pains, null, 2) + "\n");
fs.copyFileSync(painPath, path.join(ROOT, "src/data/imported/pains.json"));

const logPath = path.join(ROOT, "data/warehouse/_meta/collection_log.json");
let log = { runs: [] };
try {
  log = JSON.parse(fs.readFileSync(logPath, "utf8"));
} catch {
  /* empty */
}
if (!Array.isArray(log.runs)) log.runs = [];
log.runs.push({ id: "phase-f2c-m-cars", at: NOW });
fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");

console.log("F2c applied");
