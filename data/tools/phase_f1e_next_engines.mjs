#!/usr/bin/env node
/**
 * Phase F1e — N55 early HPFP (pre-2014), N57 EGR chassis expand,
 * B38 mis-tagged as i3 battery → OFH, M54 DISA all-years note.
 * No invented PLN — reuse N54 HPFP / OFH bands where family prior applies.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const painPath = path.join(ROOT, "data/warehouse/pains/top10_sourced_pains.json");
const volPath = path.join(ROOT, "src/data/volume.ts");
const NOW = "2026-09-23T18:00:00Z";

const pains = JSON.parse(fs.readFileSync(painPath, "utf8"));
const byId = Object.fromEntries(pains.rows.map((r) => [r.id, r]));

function upsert(row) {
  const i = pains.rows.findIndex((r) => r.id === row.id);
  if (i >= 0) pains.rows[i] = { ...pains.rows[i], ...row };
  else pains.rows.push(row);
  byId[row.id] = pains.rows.find((r) => r.id === row.id);
}

const N55_CHASSIS = [
  "e82",
  "e90",
  "e91",
  "e92",
  "e93",
  "e70",
  "e71",
  "f10",
  "f11",
  "f07",
  "f06",
  "f12",
  "f13",
  "f25",
  "f26",
  "f15",
  "f16",
  "f30",
  "f31",
  "f32",
  "f33",
  "f34",
  "f36",
  "f22",
  "f23",
  "f87",
  "g11",
];

const N57_EGR_CHASSIS = [
  "e90",
  "e91",
  "e92",
  "e93",
  "e60",
  "e61",
  "e70",
  "e71",
  "f10",
  "f11",
  "f07",
  "f01",
  "f02",
  "f12",
  "f13",
  "f15",
  "f16",
  "f25",
  "f30",
  "f31",
  "e87",
  "f20",
];

// —— Fix: i3 HV battery must not claim B38 petrol ——
if (byId["i3-hv-battery"]) {
  upsert({
    ...byId["i3-hv-battery"],
    engines: (byId["i3-hv-battery"].engines || []).filter((e) => e !== "B38"),
    chassis_slugs: ["i3", "i4", "i8"],
    year_from: 2013,
    year_to: 2026,
    summary: {
      en: "i3 / iX family HV battery degradation and pack replacement cost (IBE0/IB1/HA0/REX — not B38 petrol). PLN from PL regenerators and OEM pack quotes.",
      pl: "Bateria HV i3/iX (IBE0/IB1/HA0/REX — nie benzyna B38). PLN z regeneracji PL i wycen OEM.",
      ru: "Тяговая батарея i3/iX (IBE0/IB1/HA0/REX — не бензин B38). PLN из регенерации и OEM.",
    },
  });
}

// —— B38 → share modular OFH theme (n20-oil-filter) ——
if (byId["n20-oil-filter"]) {
  const eng = new Set([...(byId["n20-oil-filter"].engines || []), "B38"]);
  upsert({
    ...byId["n20-oil-filter"],
    engines: [...eng],
    title: {
      en: "N20 / N55 / B48 / B38 — oil-filter housing gasket (all years)",
      pl: "N20 / N55 / B48 / B38 — uszczelka obudowy filtra oleju (wszystkie lata)",
      ru: "N20 / N55 / B48 / B38 — прокладка корпуса масляного фильтра (все годы)",
    },
    summary: {
      en: "Plastic oil-filter housing gasket leak is common on N20/N55/B48 and modular B38 across production years. Not an HV-battery story. Inspect oil on the accessory belt / undertray.",
      pl: "Wyciek uszczelki OFH typowy dla N20/N55/B48 i modularnego B38 we wszystkich latach. To nie bateria HV. Szukaj oleju na pasku / osłonie.",
      ru: "Течь OFH типична для N20/N55/B48 и модульного B38 во все годы. Это не HV-батарея. Масло на ремне / защите.",
    },
  });
}

// —— N55 early HPFP (pre-2014 MY redesign) ——
const hpfpPln = byId["n54-hpfp"]?.pln_bands;
upsert({
  id: "n55-hpfp-early",
  engines: ["N55"],
  chassis_slugs: N55_CHASSIS,
  year_from: 2009,
  year_to: 2013,
  title: {
    en: "N55 early HPFP (pre-2014 redesign)",
    pl: "N55 wczesna HPFP (przed redesignem 2014)",
    ru: "N55 ранний HPFP (до редизайна 2014)",
  },
  affects: {
    en: "N55 petrol ~2009–2013 (N54-style pump); 2014+ roller/tappet pump is a different part",
    pl: "N55 benzyna ~2009–2013 (pompa jak N54); od MY 2014 inna konstrukcja roller/tappet",
    ru: "N55 бензин ~2009–2013 (насос как N54); с MY 2014 другой roller/tappet",
  },
  summary: {
    en: "Early N55 used an N54-style HPFP prone to internal o-ring failure (long crank / limp). FCP Euro and specialist guides document the 2014 model-year switch to a roller/tappet pump. NHTSA SI B12 05 16 also scopes Continental HPFP vapor issues on N55 produced to 3/2012. Confirm pump revision / service history on pre-2014 cars. PLN band reused from sourced N54 HPFP workshop prior (same early pump family).",
    pl: "Wczesne N55 miały HPFP w stylu N54 (uszczelka o-ring → długi rozruch / limp). FCP Euro: zmiana na roller/tappet od MY 2014. NHTSA SI B12 05 16: Continental HPFP do 3/2012. Sprawdź rewizję pompy. Pasmo PLN z wyceny N54 HPFP (ta sama wczesna rodzina).",
    ru: "Ранние N55 — HPFP как N54 (o-ring → долгий запуск / limp). FCP Euro: смена на roller/tappet с MY 2014. NHTSA SI B12 05 16: Continental до 3/2012. Полоса PLN из N54 HPFP.",
  },
  severity: "expensive",
  pln_bands: hpfpPln || undefined,
  sources: [
    {
      label: "FCP Euro · N55 early vs 2014+ HPFP redesign",
      url: "https://www.fcpeuro.com/blog/the-definitive-guide-to-the-bmw-n55-engine-common-faults-tech-specs-upgrades",
    },
    {
      label: "Bimmer Bytes · N55 HPFP pre-2014 vs late part numbers",
      url: "https://www.bimmerbytes.com/n55.html",
    },
    {
      label: "NHTSA · SI B12 05 16 N55 Continental HPFP / vapor (to 3/2012)",
      url: "https://static.oemdtc.com/NHTSA-PDFs/SB-10076479-5448.pdf",
    },
    {
      label: "Wikipedia · BMW N55 (production context)",
      url: "https://en.wikipedia.org/wiki/BMW_N55",
    },
    ...(hpfpPln
      ? [
          {
            label: "PLN · cenauslug.pl · HPFP parts/labor prior (N54 family reused for early N55)",
            url: "https://cenauslug.pl/poradniki/wymiana-pompy-paliwa-jakie-sa-koszty-i-jak-wybrac-warsztat",
          },
        ]
      : []),
  ],
  autodoc_query: {
    en: "BMW N55 HPFP",
    pl: "BMW N55 pompa HPFP",
    ru: "BMW N55 ТНВД HPFP",
  },
});

// —— N57 EGR cooler: expand chassis to F15/F16/F01… (NHTSA 18V-755 / 21V-907 class) ——
if (byId["n47-n57-egr-cooler"]) {
  upsert({
    ...byId["n47-n57-egr-cooler"],
    chassis_slugs: N57_EGR_CHASSIS,
    year_from: 2012,
    year_to: 2018,
    summary: {
      en: "NHTSA recalls 18V-755 / 21V-907 — N47/N57 EGR cooler glycol leak → intake fire risk on MY ~2013–2018 diesels (US population; same cooler theme in EU). Confirm recall closed before buy. Timing chain remains a separate N57 cost theme outside the campaign window.",
      pl: "NHTSA 18V-755 / 21V-907 — chłodnica EGR N47/N57 (glikol → ryzyko pożaru) MY ~2013–2018. Sprawdź zamknięcie kampanii. Łańcuch N57 osobno poza oknem recall.",
      ru: "NHTSA 18V-755 / 21V-907 — EGR cooler N47/N57 MY ~2013–2018. Проверьте закрытие отзывов. Цепь N57 отдельно.",
    },
    sources: [
      ...(byId["n47-n57-egr-cooler"].sources || []),
      {
        label: "NHTSA · 18V-755 EGR cooler (N47/N57 MY 2013–2018)",
        url: "https://static.nhtsa.gov/odi/rcl/2018/RCRIT-18V755-3062.pdf",
      },
      {
        label: "NHTSA · 21V-907 EGR cooler follow-up (N47/N57)",
        url: "https://static.nhtsa.gov/odi/rcl/2021/RCRIT-21V907-8803.pdf",
      },
    ],
  });
}

// —— water-pump: include volume N55 chassis still missing ——
if (byId["water-pump"]) {
  const ch = new Set([...(byId["water-pump"].chassis_slugs || []), ...N55_CHASSIS]);
  upsert({
    ...byId["water-pump"],
    chassis_slugs: [...ch],
    year_from: 2004,
    year_to: 2015,
  });
}

// —— M54 DISA: keep full production window; no unsourced early/late split ——
if (byId["m54-disa"]) {
  upsert({
    ...byId["m54-disa"],
    year_from: 2000,
    year_to: 2006,
    summary: {
      en: "M54 DISA flap/actuator wear across the engine’s production years (~2000–2006). Plastic flap failure is a known ownership theme (Wikipedia M54 + PL repair-kit market). No Tier A early/late redesign year sourced yet — same pack for all M54 years until RealOEM supersession dates exist.",
      pl: "Zużycie DISA M54 w latach produkcji (~2000–2006). Plastikowa klapa — znany temat (Wikipedia + zestawy PL). Brak daty Tier A early/late — ten sam pakiet do supersession RealOEM.",
      ru: "Износ DISA M54 (~2000–2006). Пластиковая заслонка — известная тема. Нет Tier A early/late — один пакет до дат RealOEM.",
    },
  });
}

pains.collected_at = NOW;
pains.meta = {
  ...(pains.meta || {}),
  phase_f1e_note:
    "N55 early HPFP 2009–2013; N57 EGR chassis expand (F15/F16/…); B38 removed from i3-hv + OFH tag; M54 DISA all-years note",
};

fs.writeFileSync(painPath, JSON.stringify(pains, null, 2) + "\n");
fs.copyFileSync(painPath, path.join(ROOT, "src/data/imported/pains.json"));

// B38 lines wrongly headlined with i3-hv-battery → n20-oil-filter
let vol = fs.readFileSync(volPath, "utf8");
const before = (vol.match(/engine:\s*"B38"[\s\S]{0,120}?topPainId:\s*"i3-hv-battery"/g) || []).length;
vol = vol.replace(
  /engine:\s*"B38"([\s\S]{0,120}?)topPainId:\s*"i3-hv-battery"/g,
  'engine: "B38"$1topPainId: "n20-oil-filter"',
);

// Prefer N55 early HPFP headline where years overlap (volume topPain still used as soft preference)
const n55Before = (vol.match(/engine:\s*"N55"[\s\S]{0,120}?topPainId:\s*"water-pump"/g) || []).length;
// Leave water-pump as default topPainId — pickEffectiveTop prefers severity; HPFP (expensive) beats pump (overheat) when both match.

fs.writeFileSync(volPath, vol);
console.log("B38 i3→OFH replacements:", before);
console.log("N55 water-pump headlines left (severity picks HPFP when in window):", n55Before);

const logPath = path.join(ROOT, "data/warehouse/_meta/collection_log.json");
let log = { runs: [] };
try {
  log = JSON.parse(fs.readFileSync(logPath, "utf8"));
} catch {
  /* empty */
}
if (!Array.isArray(log.runs)) log.runs = [];
log.runs.push({ id: "phase-f1e-n55-hpfp-n57-egr-b38", at: NOW });
fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");

console.log("F1e applied");
