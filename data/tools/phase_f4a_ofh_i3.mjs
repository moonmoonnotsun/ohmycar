#!/usr/bin/env node
/**
 * Phase F4a — OFH supersessions + i3 battery generations.
 * Tier A: NHTSA SIB 11 10 25 (B48/B46 coolant OFH bushing; redesigned bush 11 42 8 490 951).
 * Tier B: BimmerWorld B48 plastic housing multi-supersession since 2017.
 * Tier A: Wikipedia / BMW Press i3 60Ah → 94Ah (2017) → 120Ah (2019).
 * No invented RealOEM day-codes without ETK scrape.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const painPath = path.join(ROOT, "data/warehouse/pains/top10_sourced_pains.json");
const jobsDir = path.join(ROOT, "data/warehouse/repair_costs/jobs");
const NOW = "2026-09-23T21:00:00Z";

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
        confidence: "f4a_sync",
      },
      null,
      2,
    ) + "\n",
  );
}

const ofhPln = byId["n20-oil-filter"]?.pln_bands;
const housingPln = {
  parts: [800, 2500],
  labor: [1200, 3000],
  independent: [2000, 5500],
  specialist: [2800, 7000],
  aso: [4000, 9500],
  note: "NHTSA owner reports ~$2000–3500 OFH housing R&R; PLN band prior @~4 PLN/USD indie path",
};

const B48_G = ["g20", "g21", "g22", "g23", "g26", "g30", "g31", "g01", "g02", "g29", "g42", "g45", "g60"];

// —— Early B48 plastic OFH housing crack (multi-supersession since 2017) ——
upsert({
  id: "b48-ofh-housing-early",
  engines: ["B48"],
  chassis_slugs: ["g30", "g31", "f30", "f31", "f32", "f33", "f36", "f22", "f39", "f48", "g01", "g02", ...B48_G],
  year_from: 2017,
  year_to: 2019,
  title: {
    en: "B48 early plastic OFH housing crack",
    pl: "B48 wczesna plastikowa obudowa OFH (pęknięcia)",
    ru: "B48 ранний пластиковый корпус OFH (трещины)",
  },
  affects: {
    en: "Early B48 (~2017–2019) — housing body crack, not only gasket",
    pl: "Wczesne B48 (~2017–2019) — pęknięcie korpusu, nie tylko uszczelka",
    ru: "Ранние B48 (~2017–2019) — трещина корпуса, не только прокладка",
  },
  summary: {
    en: "BimmerWorld documents BMW superseding the B46/B48 oil-filter housing several times since 2017; a common failure is the plastic housing flange/gasket seat cracking (coolant or oil leak), beyond the ordinary OFH gasket. Aluminum aftermarket housings exist specifically because the plastic design cracked. Distinct from the later SIB 11 10 25 bushing/insert fix. Still inspect gasket leaks on all years (n20-oil-filter).",
    pl: "BimmerWorld: BMW kilka razy zmieniał obudowę B46/B48 od 2017 — pęknięcia plastiku (nie tylko uszczelka). Osobno od SIB 11 10 25 (tuleja). Uszczelka nadal we wszystkich latach.",
    ru: "BimmerWorld: с 2017 несколько supersession корпуса B48 — трещины пластика. Отдельно от SIB 11 10 25.",
  },
  severity: "overheat",
  pln_bands: housingPln,
  sources: [
    {
      label: "BimmerWorld · B46/B48 aluminum OFH kit (plastic crack / supersessions since 2017)",
      url: "https://www.bimmerworld.com/Engine/Gaskets/Aluminum-Oil-Filter-Housing-with-Cap-Filter-and-Gaskets-B46-B48-Engine.html",
    },
    {
      label: "BMW shop · OFH 11428596283 supersedes 11428593771 / 86673 / 76429",
      url: "https://shop.bmw.ca/p/Bmw__430i/Oil-filter-housing/72049350/11428596283.html",
    },
    {
      label: "NHTSA complaint class · B48 OFH housing failure cost notes",
      url: "https://vehicleflaws.com/complaint/11570175",
    },
  ],
  autodoc_query: {
    en: "BMW B48 oil filter housing",
    pl: "BMW B48 obudowa filtra oleju",
    ru: "BMW B48 корпус масляного фильтра",
  },
});

// —— Late B48 coolant bushing (SIB 11 10 25) ——
upsert({
  id: "b48-ofh-coolant-bushing",
  engines: ["B48"],
  chassis_slugs: B48_G,
  year_from: 2025,
  year_to: 2026,
  title: {
    en: "B48 OFH coolant bushing (SIB 11 10 25)",
    pl: "B48 tuleja chłodziwa OFH (SIB 11 10 25)",
    ru: "B48 втулка ОЖ OFH (SIB 11 10 25)",
  },
  affects: {
    en: "G20/G22/G26/G30/G01… with B46D / B48P / XB1G — VIN confirm",
    pl: "G20/G22/G26/G30/G01… B46D / B48P / XB1G — potwierdź VIN",
    ru: "G20/G22/G26/G30/G01… B46D / B48P / XB1G — VIN",
  },
  summary: {
    en: "NHTSA SIB 11 10 25 (2025-12-12): coolant leaks from the oil-filter housing when the bushing/insert deforms under seal pressure. Correction is redesigned bush 11 42 8 490 951 + gasket set 11 42 9 886 567. Scoped to listed G-series chassis with B46D / B48P / XB1G. Bound here to MY 2025–2026 (B48P transition per fitment guides); confirm VIN/AIR. Separate from ordinary OFH oil-gasket leaks.",
    pl: "NHTSA SIB 11 10 25: wyciek chłodziwa z OFH przez deformację tulei — nowa tuleja + zestaw uszczelek. Chassis G z B46D/B48P/XB1G. Okno MY 2025–2026; VIN. Osobno od uszczelki oleju.",
    ru: "NHTSA SIB 11 10 25: течь ОЖ из OFH — новая втулка. MY 2025–2026; VIN. Отдельно от масляной прокладки.",
  },
  severity: "overheat",
  pln_bands: housingPln,
  sources: [
    {
      label: "NHTSA · SIB 11 10 25 coolant leaking from oil filter housing",
      url: "https://static.nhtsa.gov/odi/tsbs/2026/MC-11026946-0001.pdf",
    },
    {
      label: "BimmerWorld · G20/G22 B46/B48 OFH assembly fitment (B48P 2025+)",
      url: "https://www.bimmerworld.com/Engine/BMW-Oil-System/Oil-Filter-Housing-Assembly-B46-B48-G20-G22-G26-G30-G29-G01-G02.html",
    },
  ],
  autodoc_query: {
    en: "BMW B48 oil filter housing bushing",
    pl: "BMW B48 tuleja obudowy filtra oleju",
    ru: "BMW B48 втулка корпуса фильтра",
  },
});

// Keep gasket OFH all-years note
if (byId["n20-oil-filter"]) {
  upsert({
    ...byId["n20-oil-filter"],
    summary: {
      en: "Plastic OFH gasket leak remains common across N20/N52/N55/B48/B38/N42/N46/S55. On B48, also check early housing cracks (~2017–2019) and late coolant-bushing SIB 11 10 25 (MY 2025–2026 B48P class) as separate pains. Inspect oil on the belt / undertray.",
      pl: "Uszczelka OFH nadal we wszystkich latach. Na B48 osobno: pęknięcia korpusu ~2017–2019 i tuleja chłodziwa SIB 11 10 25 (MY 2025–2026).",
      ru: "Прокладка OFH во все годы. На B48 отдельно: трещины корпуса ~2017–2019 и втулка ОЖ SIB 11 10 25.",
    },
  });
}

// —— i3 battery generations (Wikipedia + BMW Press) ——
const i3Base = byId["i3-hv-battery"];
if (i3Base) {
  // Narrow original to 60Ah window
  upsert({
    ...i3Base,
    id: "i3-hv-battery",
    year_from: 2013,
    year_to: 2016,
    title: {
      en: "i3 HV battery — 60Ah / 22 kWh generation",
      pl: "i3 bateria HV — generacja 60Ah / 22 kWh",
      ru: "i3 HV батарея — поколение 60Ah / 22 кВт·ч",
    },
    summary: {
      en: "Wikipedia / BMW Press: launch i3 pack is 60Ah (~22 kWh gross). Highest age + smallest capacity among i3 generations — budget regeneration or pack replacement (PL warehouse quotes spanning regen → OEM upgrade). Confirm SOH and which Ah pack is fitted.",
      pl: "Wikipedia / BMW Press: startowa bateria 60Ah (~22 kWh). Najstarsza / najmniejsza — regeneracja lub wymiana. Sprawdź SOH i Ah.",
      ru: "Wikipedia / BMW Press: стартовая 60Ah. Проверьте SOH и Ah.",
    },
  });

  upsert({
    id: "i3-hv-94ah",
    engines: i3Base.engines?.filter((e) => e !== "B38") || ["IBE0", "IB1", "HA0", "Range Extender"],
    chassis_slugs: ["i3"],
    year_from: 2017,
    year_to: 2018,
    title: {
      en: "i3 HV battery — 94Ah / 33 kWh generation",
      pl: "i3 bateria HV — generacja 94Ah / 33 kWh",
      ru: "i3 HV батарея — поколение 94Ah / 33 кВт·ч",
    },
    affects: {
      en: "MY 2017–2018 i3 / i3s (94Ah)",
      pl: "MY 2017–2018 i3 / i3s (94Ah)",
      ru: "MY 2017–2018 i3 / i3s (94Ah)",
    },
    summary: {
      en: "BMW Press (2017): 94Ah / 33 kWh pack (>50% capacity vs 60Ah) without exterior size change. Still a high-cost HV ownership item — SOH and regen/upgrade quotes apply. Wikipedia lists this mid generation between 60Ah and 120Ah.",
      pl: "BMW Press 2017: 94Ah / 33 kWh. Nadal drogi temat HV — SOH / regeneracja. Wikipedia: generacja środkowa.",
      ru: "BMW Press 2017: 94Ah / 33 кВт·ч. Проверьте SOH.",
    },
    severity: "expensive",
    pln_bands: {
      ...(i3Base.pln_bands || {}),
      note: "Same PL regen/OEM quote envelope as i3-hv-battery; mid pack",
    },
    sources: [
      {
        label: "BMW Press · 2017 i3 94Ah",
        url: "https://www.press.bmwgroup.com/usa/article/detail/T0259560EN_US/the-new-2017-bmw-i3-94-ah-:-more-range-paired-to-high-level-dynamic-performance?language=en_US",
      },
      {
        label: "Wikipedia · BMW i3 battery generations",
        url: "https://en.wikipedia.org/wiki/BMW_i3_(hatchback)",
      },
      ...(i3Base.sources || []).slice(0, 2),
    ],
    autodoc_query: {
      en: "BMW i3 HV battery 94Ah",
      pl: "BMW i3 bateria HV 94Ah",
      ru: "BMW i3 тяговая батарея 94Ah",
    },
  });

  upsert({
    id: "i3-hv-120ah",
    engines: i3Base.engines?.filter((e) => e !== "B38") || ["IBE0", "IB1", "HA0"],
    chassis_slugs: ["i3"],
    year_from: 2019,
    year_to: 2022,
    title: {
      en: "i3 HV battery — 120Ah / 42.2 kWh generation",
      pl: "i3 bateria HV — generacja 120Ah / 42,2 kWh",
      ru: "i3 HV батарея — поколение 120Ah / 42,2 кВт·ч",
    },
    affects: {
      en: "MY 2019–2022 i3 / i3s (120Ah); REx dropped in EU",
      pl: "MY 2019–2022 i3 / i3s (120Ah); REx wycofany w EU",
      ru: "MY 2019–2022 i3 / i3s (120Ah)",
    },
    summary: {
      en: "BMW Press (2019): 120Ah / 42.2 kWh pack — largest i3 generation. Replacement/upgrade quotes sit at the high end of the PL envelope; still verify SOH. Wikipedia: production ended 2022.",
      pl: "BMW Press 2019: 120Ah / 42,2 kWh — największa generacja. Wyceny wymiany w górnym paśmie; SOH. Wikipedia: produkcja do 2022.",
      ru: "BMW Press 2019: 120Ah / 42,2 кВт·ч. Проверьте SOH.",
    },
    severity: "expensive",
    pln_bands: {
      parts: [12000, 29000],
      labor: [1500, 4000],
      independent: [10000, 29000],
      specialist: [12000, 32000],
      aso: [15000, 38000],
      note: "Upper end of existing i3 OEM upgrade / regen envelope for largest pack",
    },
    sources: [
      {
        label: "BMW Press · 2019 i3 120Ah",
        url: "https://www.press.bmwgroup.com/usa/article/detail/T0285420EN_US/the-new-2019-bmw-i3-120ah-and-i3s-120ah?language=en_US",
      },
      {
        label: "Wikipedia · BMW i3 battery generations",
        url: "https://en.wikipedia.org/wiki/BMW_i3_(hatchback)",
      },
      ...(i3Base.sources || []).slice(0, 2),
    ],
    autodoc_query: {
      en: "BMW i3 HV battery 120Ah",
      pl: "BMW i3 bateria HV 120Ah",
      ru: "BMW i3 тяговая батарея 120Ah",
    },
  });
}

pains.collected_at = NOW;
pains.meta = {
  ...(pains.meta || {}),
  phase_f4a_note:
    "B48 early OFH housing 2017–2019; B48 coolant bushing SIB 11 10 25 (2025–2026); i3 60/94/120Ah split",
};

fs.writeFileSync(painPath, JSON.stringify(pains, null, 2) + "\n");
fs.copyFileSync(painPath, path.join(ROOT, "src/data/imported/pains.json"));

for (const id of [
  "b48-ofh-housing-early",
  "b48-ofh-coolant-bushing",
  "i3-hv-94ah",
  "i3-hv-120ah",
  "i3-hv-battery",
]) {
  writeJob(id);
}

// volume topPain for i3 — leave i3-hv-battery; pickEffectiveTop will pick matching year sibling
let vol = fs.readFileSync(path.join(ROOT, "src/data/volume.ts"), "utf8");
// Ensure i3 lines still point at family; year sibling resolution handles 94/120 via engines+years
fs.writeFileSync(path.join(ROOT, "src/data/volume.ts"), vol);

const logPath = path.join(ROOT, "data/warehouse/_meta/collection_log.json");
let log = { runs: [] };
try {
  log = JSON.parse(fs.readFileSync(logPath, "utf8"));
} catch {
  /* empty */
}
if (!Array.isArray(log.runs)) log.runs = [];
log.runs.push({ id: "phase-f4a-ofh-i3", at: NOW });
fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");

console.log("F4a applied");
