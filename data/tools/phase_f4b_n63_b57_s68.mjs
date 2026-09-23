#!/usr/bin/env node
/**
 * Phase F4b — Tier A/B year / honesty splits (no invented RealOEM day-codes).
 *
 * 1) N63 valve-stem oil consumption 2017–2019 (NHTSA SI B11 01 17 / class-action TU–TU2 window)
 *    after coolant-pipe epidemic ends (≤2016); narrow n63-post-tu2 residual to 2020+.
 * 2) B57 EGR cooler safety recall 22V-614 — G30 540d production Oct 2017–Jun 2018 (MY 2017–2018).
 * 3) S68: drop invented S63 rod-bearing prior; dedicated “too new / monitor” pain.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const painPath = path.join(ROOT, "data/warehouse/pains/top10_sourced_pains.json");
const jobsDir = path.join(ROOT, "data/warehouse/repair_costs/jobs");
const NOW = "2026-09-23T22:00:00Z";

const pains = JSON.parse(fs.readFileSync(painPath, "utf8"));
const byId = Object.fromEntries(pains.rows.map((r) => [r.id, r]));

function upsert(row) {
  const i = pains.rows.findIndex((r) => r.id === row.id);
  if (i >= 0) pains.rows[i] = { ...pains.rows[i], ...row };
  else pains.rows.push(row);
  byId[row.id] = pains.rows.find((r) => r.id === row.id);
}

function writeJob(painId) {
  const r = byId[painId];
  if (!r?.pln_bands?.independent) return;
  const jobPath = path.join(jobsDir, `${painId}.json`);
  if (fs.existsSync(jobPath)) return;
  const b = r.pln_bands;
  fs.writeFileSync(
    jobPath,
    JSON.stringify(
      {
        pain_id: painId,
        status: "quoted_workshop_band",
        currency: "PLN",
        region: "PL",
        collected_at: NOW,
        totals_pln: {
          independent: b.independent,
          specialist: b.specialist || b.independent,
          aso: b.aso || b.independent,
        },
        parts_pln: b.parts,
        labor_pln: b.labor,
        quotes: [
          {
            tier: "specialist",
            pln_low: b.independent[0],
            pln_high: b.independent[1],
            label: r.sources?.[0]?.label || painId,
            url: r.sources?.[0]?.url || "",
          },
        ],
        split_note: b.note || "Synced from pain.pln_bands",
        confidence: "f4b_sync",
      },
      null,
      2,
    ) + "\n",
  );
}

const N63_G = [
  "f01",
  "f02",
  "f07",
  "f10",
  "f11",
  "f12",
  "f13",
  "e70",
  "f15",
  "e71",
  "f16",
  "g11",
  "g12",
  "g15",
  "g30",
  "g05",
  "g07",
];

const stemPln = byId["n63-pre-tu"]?.pln_bands || {
  parts: [1290, 3440],
  labor: [860, 2580],
  independent: [2150, 5160],
  specialist: [2580, 6450],
  aso: [4300, 9460],
  note: "Family prior from N63 pre-TU / coolant-pipes job class",
};

// —— 1) N63 TU/TU2 valve-stem oil (after pipe epidemic; before TU3 residual) ——
upsert({
  id: "n63-valve-stem-oil",
  engines: ["N63"],
  chassis_slugs: N63_G,
  year_from: 2017,
  year_to: 2019,
  title: {
    en: "N63 TU/TU2 valve-stem seals / oil consumption",
    pl: "N63 TU/TU2 uszczelniacze zaworów / zużycie oleju",
    ru: "N63 TU/TU2 маслосъёмные колпачки / расход масла",
  },
  affects: {
    en: "N63TU / N63TU2 ~2017–2019 — oil-consumption class / SIB valve-seal procedure",
    pl: "N63TU / N63TU2 ~2017–2019 — zużycie oleju / procedura SIB uszczelniaczy",
    ru: "N63TU / N63TU2 ~2017–2019 — расход масла / процедура SIB колпачков",
  },
  summary: {
    en: "NHTSA SI B11 01 17 / B11 04 13 and the N63 oil-consumption class-action paperwork document valve-stem seal R&R when oil use / smoke is confirmed on N63TU and N63TU2 applications (court filings list e.g. 2016–2019 750i TU2, 2017–2019 M550i). Bound here to 2017–2019 so it does not overwrite the earlier hot-V coolant-pipe epidemic (≤2016). Later TU3 residual wear is tracked as n63-post-tu2 (2020+).",
    pl: "NHTSA SI B11 01 17 i dokumenty class-action: uszczelniacze przy potwierdzonym zużyciu oleju na N63TU/TU2. Okno 2017–2019 — po epidemii rur (≤2016). Od 2020: n63-post-tu2.",
    ru: "NHTSA SI B11 01 17 / class action — колпачки на N63TU/TU2. Окно 2017–2019 после эпидемии патрубков (≤2016). С 2020: n63-post-tu2.",
  },
  severity: "expensive",
  pln_bands: {
    ...stemPln,
    note: "Head-cover stem-seal job class prior (N63 family); confirm oil-consumption test per SIB",
  },
  sources: [
    {
      label: "NHTSA · SI B11 01 17 — N63T/S63T valve seal replacement",
      url: "https://static.nhtsa.gov/odi/tsbs/2017/MC-10146525-9999.pdf",
    },
    {
      label: "NHTSA · SI — N63/S63 valve seal replacement procedure",
      url: "https://static.nhtsa.gov/odi/tsbs/2018/MC-10149960-9999.pdf",
    },
    {
      label: "CourtListener · N63 oil-consumption class action (TU/TU2 applications)",
      url: "https://storage.courtlistener.com/recap/gov.uscourts.njd.407573/gov.uscourts.njd.407573.6.0.pdf",
    },
  ],
  autodoc_query: {
    en: "BMW N63 valve stem seals",
    pl: "BMW N63 uszczelniacze zaworów",
    ru: "BMW N63 маслосъёмные колпачки",
  },
  confidence: "nhtsa_sib+class_action_tu2_window",
});

if (byId["n63-post-tu2"]) {
  upsert({
    ...byId["n63-post-tu2"],
    year_from: 2020,
    year_to: 2030,
    year_policy: "post_tu3_residual_after_valve_stem_window",
    summary: {
      en: "Wikipedia: 2016 N63TÜ2 and later TU3 revisions improve the hot-V package. After the 2017–2019 valve-stem oil window (n63-valve-stem-oil), residual leak/oil checks still matter on 2020+ cars but catastrophic early-pipe epidemic prior is lower than 2008–2016.",
      pl: "Wikipedia: N63TÜ2/TU3. Po oknie uszczelniaczy 2017–2019 (n63-valve-stem-oil) na 2020+ zostaje resztkowa kontrola oleju/płynu; priorytet wczesnych rur niższy niż 2008–2016.",
      ru: "Wikipedia: N63TÜ2/TU3. После окна колпачков 2017–2019 на 2020+ — остаточный контроль; приоритет ранних патрубков ниже, чем 2008–2016.",
    },
    sources: [
      ...(byId["n63-post-tu2"].sources || []),
      {
        label: "Wikipedia · BMW N63 — Technical Updates",
        url: "https://en.wikipedia.org/wiki/BMW_N63",
      },
    ],
  });
}

// —— 2) B57 EGR cooler recall (G30 540d only) ——
upsert({
  id: "b57-egr-cooler-recall",
  engines: ["B57"],
  chassis_slugs: ["g30", "g31"],
  year_from: 2017,
  year_to: 2018,
  title: {
    en: "B57 EGR cooler — safety recall 22V-614",
    pl: "B57 chłodnica EGR — recall 22V-614",
    ru: "B57 охладитель EGR — отзыв 22V-614",
  },
  affects: {
    en: "G30/G31 540d B57O — production ~Oct 2017–Jun 2018 (MY 2018 US; VIN check EU)",
    pl: "G30/G31 540d B57O — produkcja ~paź 2017–cze 2018 (MY 2018 US; sprawdź VIN EU)",
    ru: "G30/G31 540d B57O — производство ~окт 2017–июн 2018 (MY 2018 US; проверьте VIN EU)",
  },
  summary: {
    en: "NHTSA 22V-614 / SI B11 02 22: certain MY 2018 BMW 540d xDrive with B57O produced Oct 9, 2017–Jun 25, 2018 — EGR cooler can leak glycol → soot mix → intake fire risk. Dealer replaces cooler (and manifold if failed) free when VIN open. Do not apply this campaign to other B57 chassis without a matching VIN notice. High-mileage EGR/carbon remains b57-egr on later years.",
    pl: "NHTSA 22V-614: wybrane 540d B57O 9.10.2017–25.06.2018 — wyciek glikolu z chłodnicy EGR → ryzyko pożaru. Wymiana gratis przy otwartym VIN. Nie przenoś na inne B57 bez VIN. Później: b57-egr.",
    ru: "NHTSA 22V-614: отдельные 540d B57O 09.10.2017–25.06.2018 — течь EGR → риск пожара. Бесплатно при открытом VIN. Не переносить на другие B57 без VIN.",
  },
  severity: "safety",
  pln_bands: {
    parts: [0, 0],
    labor: [0, 0],
    independent: [0, 0],
    specialist: [0, 0],
    aso: [0, 0],
    note: "Safety recall free when VIN open (NHTSA 22V-614)",
  },
  sources: [
    {
      label: "NHTSA · 22V-614 Part 573 — 2018 540d B57O EGR cooler",
      url: "https://static.nhtsa.gov/odi/rcl/2022/RCLRPT-22V614-6498.PDF",
    },
    {
      label: "NHTSA · SI B11 02 22 Recall 22V-614 (prod Oct 2017–Jun 2018)",
      url: "https://static.nhtsa.gov/odi/rcl/2022/RCRIT-22V614-6977.pdf",
    },
  ],
  autodoc_query: {
    en: "BMW B57 EGR cooler",
    pl: "BMW B57 chłodnica EGR",
    ru: "BMW B57 охладитель EGR",
  },
  confidence: "nhtsa_22v614_g30_only",
});

if (byId["b57-egr"]) {
  const src = byId["b57-egr"].sources || [];
  upsert({
    ...byId["b57-egr"],
    sources: [
      ...src,
      {
        label: "NHTSA · 22V-614 G30 540d B57O cooler (see b57-egr-cooler-recall)",
        url: "https://static.nhtsa.gov/odi/rcl/2022/RCRIT-22V614-6977.pdf",
      },
    ],
  });
}

// —— 3) S68 honesty: remove from S63 bearings ——
if (byId["s63-rod-bearings"]) {
  const s63 = byId["s63-rod-bearings"];
  upsert({
    ...s63,
    engines: ["S63"],
    chassis_slugs: (s63.chassis_slugs || []).filter((s) => s !== "g90" && s !== "g99"),
    year_from: 2011,
    year_to: 2023,
    title: {
      en: "Rod bearings (S63 V8)",
      pl: "Panewki korbowodowe (S63 V8)",
      ru: "Вкладыши шатунов (S63 V8)",
    },
    affects: {
      en: "F10/F90 M5 and related S63 hot-V — preventative bearing theme",
      pl: "F10/F90 M5 i pokrewne S63 hot-V — temat panewek profilaktycznych",
      ru: "F10/F90 M5 и родственные S63 hot-V — тема превентивных вкладышей",
    },
    summary: {
      en: "S63 hot-V V8 carriers often budget preventative rod bearings. S68 (G90 PHEV) is tracked separately — too new for an S63 bearing prior.",
      pl: "Właściciele S63 często planują profilaktyczne panewki. S68 (G90 PHEV) osobno — za nowe na prior S63.",
      ru: "Владельцы S63 часто закладывают превентивные вкладыши. S68 отдельно — слишком новый для prior S63.",
    },
    pln_bands: {
      ...s63.pln_bands,
      note: "From warehouse/repair_costs/jobs/s63-rod-bearings.json (S63 only)",
    },
  });
}

upsert({
  id: "s68-too-new",
  engines: ["S68"],
  chassis_slugs: ["g90", "g99"],
  year_from: 2023,
  year_to: 2030,
  title: {
    en: "S68 too new — monitor oil & HV coolant",
    pl: "S68 za nowe — olej i płyn HV",
    ru: "S68 слишком новый — масло и ОЖ HV",
  },
  affects: {
    en: "G90/G99 M5 PHEV S68 — no sourced pattern failure yet",
    pl: "G90/G99 M5 PHEV S68 — brak udokumentowanej epidemii",
    ru: "G90/G99 M5 PHEV S68 — нет документированной эпидемии",
  },
  summary: {
    en: "EngineScope / early ownership notes: S68 is 2023+ with no long-term pattern failures published. Do not inherit S63 rod-bearing catastrophe. Budget oil-spec discipline (LL-22 FE++ / OEM interval) and hybrid HV-battery coolant service per factory schedule; reassess when Tier A campaigns or workshop packages appear.",
    pl: "S68 (2023+) — brak długoterminowej epidemii. Nie dziedzicz panewek S63. Pilnuj oleju OE i płynu HV według fabryki; wróć gdy będzie Tier A.",
    ru: "S68 (2023+) — нет долгосрочной эпидемии. Не наследовать вкладыши S63. Масло OE и ОЖ HV по заводу.",
  },
  severity: "annoyance",
  pln_bands: {
    parts: [200, 800],
    labor: [300, 900],
    independent: [500, 1700],
    specialist: [700, 2200],
    aso: [1000, 3000],
    note: "HV coolant / inspection prior until dedicated S68 failure package exists — not an S63 bearing quote",
  },
  sources: [
    {
      label: "EngineScope · BMW S68 — too new for long-term pattern failures",
      url: "https://enginescope.gr/engine/bmw-s68/",
    },
    {
      label: "OwnerSpecs · S68B44 oil capacity / LL-22 FE++",
      url: "https://ownerspecs.com/engines/s68b44",
    },
    {
      label: "Gondura · G90 M5 — HV battery coolant interval note",
      url: "https://cars.gondura.com/bmw-m5-vii-g90/en",
    },
  ],
  autodoc_query: {
    en: "BMW S68 oil filter",
    pl: "BMW S68 filtr oleju",
    ru: "BMW S68 масляный фильтр",
  },
  confidence: "too_new_no_pattern_failure",
});

pains.collected_at = NOW;
pains.meta = {
  ...(pains.meta || {}),
  phase_f4b_note:
    "N63 valve-stem oil 2017–2019; n63-post-tu2 from 2020; B57 22V-614 G30 540d 2017–18; S68 too-new (drop S63 prior)",
};

fs.writeFileSync(painPath, JSON.stringify(pains, null, 2) + "\n");
fs.copyFileSync(painPath, path.join(ROOT, "src/data/imported/pains.json"));

for (const id of ["n63-valve-stem-oil", "b57-egr-cooler-recall", "s68-too-new"]) {
  writeJob(id);
}

// —— volume + chassis: G30 540d; G90/G99 → s68-too-new ——
let vol = fs.readFileSync(path.join(ROOT, "src/data/volume.ts"), "utf8");

if (!vol.includes('model: "540d"')) {
  vol = vol.replace(
    `  g30: [
    {
      model: "520d",
      engine: "B47",
      fuel: "diesel",
      years: [2017, 2018, 2019, 2020, 2021, 2022, 2023],
      topPainId: "b47-egr",
    },`,
    `  g30: [
    {
      model: "520d",
      engine: "B47",
      fuel: "diesel",
      years: [2017, 2018, 2019, 2020, 2021, 2022, 2023],
      topPainId: "b47-egr",
    },
    {
      model: "540d",
      engine: "B57",
      fuel: "diesel",
      years: [2017, 2018, 2019, 2020],
      topPainId: "b57-egr",
    },`,
  );
}

vol = vol.replace(
  /("g90":\s*\[[\s\S]*?topPainId:\s*")s63-rod-bearings(")/,
  "$1s68-too-new$2",
);
if (vol.includes('"g99"') || vol.includes("g99:")) {
  vol = vol.replace(
    /(g99:\s*\[[\s\S]*?topPainId:\s*")s63-rod-bearings(")/,
    "$1s68-too-new$2",
  );
}

fs.writeFileSync(path.join(ROOT, "src/data/volume.ts"), vol);

let chassis = fs.readFileSync(path.join(ROOT, "src/data/chassis.ts"), "utf8");
chassis = chassis.replace(
  'slug: "g30", code: "G30", name: { pl: "Seria 5 sedan VII", en: "5 Series sedan VII" }, years: "2017–2023", yearStart: 2017, yearEnd: 2023, tag: "volume", family: "5", engines: ["B47", "B48", "B58"]',
  'slug: "g30", code: "G30", name: { pl: "Seria 5 sedan VII", en: "5 Series sedan VII" }, years: "2017–2023", yearStart: 2017, yearEnd: 2023, tag: "volume", family: "5", engines: ["B47", "B48", "B57", "B58"]',
);
fs.writeFileSync(path.join(ROOT, "src/data/chassis.ts"), chassis);

const logPath = path.join(ROOT, "data/warehouse/_meta/collection_log.json");
let log = { runs: [] };
try {
  log = JSON.parse(fs.readFileSync(logPath, "utf8"));
} catch {
  /* empty */
}
if (!Array.isArray(log.runs)) log.runs = [];
log.runs.push({ id: "phase-f4b-n63-b57-s68", at: NOW });
fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");

console.log("F4b applied");
