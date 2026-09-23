#!/usr/bin/env node
/**
 * Phase F2b — N13 / N46 / N43 / N53 secondary pains.
 * Tier A: Wikipedia N53 (same HPFP as N54); Wikipedia Prince (HPFP recalls + 2013 chain SI).
 * Tier B: Bimmer Boom / EngineScope N13; BMWTuning N53 HPFP redesign ~2012/13.
 * No invented PLN — reuse N54 HPFP / OFH / walnut-blast family priors.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const painPath = path.join(ROOT, "data/warehouse/pains/top10_sourced_pains.json");
const NOW = "2026-09-23T19:30:00Z";

const pains = JSON.parse(fs.readFileSync(painPath, "utf8"));
const byId = Object.fromEntries(pains.rows.map((r) => [r.id, r]));

function upsert(row) {
  const i = pains.rows.findIndex((r) => r.id === row.id);
  if (i >= 0) pains.rows[i] = { ...pains.rows[i], ...row };
  else pains.rows.push(row);
  byId[row.id] = pains.rows.find((r) => r.id === row.id);
}

const hpfpPln = byId["n54-hpfp"]?.pln_bands;
const ofhPln = byId["n20-oil-filter"]?.pln_bands;

const N13_CH = ["f20", "f21", "f22", "f23", "f30", "f31", "f45", "f46", "mini"];
const N46_CH = [
  "e46",
  "e46-compact",
  "e87",
  "e81",
  "e82",
  "e88",
  "e90",
  "e91",
  "e92",
  "e93",
  "e83",
  "e85-z4",
  "e89-z4",
];
const N43_CH = ["e90", "e91", "e92", "e93", "e87", "e81", "e82", "e88", "e60", "e61"];
const N53_CH = ["e90", "e91", "e92", "e93", "e60", "e61", "e87", "e81", "e82", "e88", "e70", "f10"];

const CARBON_PLN = {
  parts: [200, 600],
  labor: [800, 2000],
  independent: [1000, 2600],
  specialist: [1400, 3200],
  aso: [2000, 4000],
  note: "Walnut-blast / intake clean family prior (DI petrol); refine with Autodoc",
};

// —— N13 HPFP (Prince recalls / extended warranty — Wikipedia) ——
upsert({
  id: "n13-hpfp",
  engines: ["N13"],
  chassis_slugs: N13_CH,
  year_from: 2011,
  year_to: 2015,
  title: {
    en: "N13 / Prince HPFP failures",
    pl: "N13 / Prince — awarie HPFP",
    ru: "N13 / Prince — отказы HPFP",
  },
  affects: {
    en: "F20/F2x 114i–118i N13 (~2011–2015)",
    pl: "F20/F2x 114i–118i N13 (~2011–2015)",
    ru: "F20/F2x 114i–118i N13 (~2011–2015)",
  },
  summary: {
    en: "Wikipedia Prince engine: recalls and/or extended warranty for failing HPFP on the BMW/PSA Prince family (N13). Specialist guides also list long-crank / misfire around mid mileage. Separate from the timing-chain theme (also noted in a 2013 Prince SI). PLN band reused from sourced N54 HPFP workshop prior (same DI HPFP job family).",
    pl: "Wikipedia Prince: recall / przedłużona gwarancja na HPFP w rodzinie Prince (N13). Osobno od łańcucha (SI 2013). Pasmo PLN z wyceny N54 HPFP (ta sama rodzina DI).",
    ru: "Wikipedia Prince: отзывы/расширенная гарантия HPFP (N13). Отдельно от цепи. Полоса PLN из N54 HPFP.",
  },
  severity: "expensive",
  pln_bands: hpfpPln || undefined,
  sources: [
    {
      label: "Wikipedia · Prince engine (HPFP recalls / extended warranty)",
      url: "https://en.wikipedia.org/wiki/Prince_engine",
    },
    {
      label: "Wikipedia · BMW N13",
      url: "https://en.wikipedia.org/wiki/BMW_N13",
    },
    {
      label: "Bimmer Boom · N13 HPFP / timing ownership notes",
      url: "https://bimmerboom.com/bmw-n13-engine-review-problems-and-recommendations/",
    },
    ...(hpfpPln
      ? [
          {
            label: "PLN · cenauslug.pl · HPFP prior (N54 family reused)",
            url: "https://cenauslug.pl/poradniki/wymiana-pompy-paliwa-jakie-sa-koszty-i-jak-wybrac-warsztat",
          },
        ]
      : []),
  ],
  autodoc_query: {
    en: "BMW N13 HPFP",
    pl: "BMW N13 pompa HPFP",
    ru: "BMW N13 ТНВД",
  },
});

// —— N13 intake carbon (DI) ——
upsert({
  id: "n13-intake-carbon",
  engines: ["N13"],
  chassis_slugs: N13_CH,
  year_from: 2011,
  year_to: 2016,
  title: {
    en: "N13 intake-valve carbon (DI)",
    pl: "N13 nagar na zaworach (DI)",
    ru: "N13 нагар на клапанах (DI)",
  },
  affects: {
    en: "Direct-injection N13 — walnut blast theme",
    pl: "N13 z wtryskiem bezpośrednim — czyszczenie orzechami",
    ru: "N13 с непосредственным впрыском",
  },
  summary: {
    en: "N13 is turbo DI (Wikipedia N13 / Prince). Specialist guides list intake-valve carbon (rough idle / misfire) as a recurring mid-mileage cost alongside chain and HPFP. Not a campaign window — inspect idle quality and service history for walnut blast.",
    pl: "N13 to turbo DI. Przewodniki: nagar na zaworach (nierówna praca) obok łańcucha i HPFP. Sprawdź historię czyszczenia.",
    ru: "N13 — turbo DI. Нагар на клапанах — типичная тема на пробеге.",
  },
  severity: "annoyance",
  pln_bands: CARBON_PLN,
  sources: [
    {
      label: "Wikipedia · BMW N13 (DI turbo Prince)",
      url: "https://en.wikipedia.org/wiki/BMW_N13",
    },
    {
      label: "EngineScope · N13 carbon buildup",
      url: "https://enginescope.gr/engine/bmw-n13/",
    },
    {
      label: "Bimmer Boom · N13 injector / combustion notes",
      url: "https://bimmerboom.com/bmw-n13-engine-review-problems-and-recommendations/",
    },
  ],
  autodoc_query: {
    en: "BMW N13 walnut blast",
    pl: "BMW N13 czyszczenie dolotu",
    ru: "BMW N13 чистка впуска",
  },
});

// Strengthen n13-timing summary with Prince 2013 SI cite
if (byId["n13-timing"]) {
  upsert({
    ...byId["n13-timing"],
    sources: [
      ...(byId["n13-timing"].sources || []),
      {
        label: "Wikipedia · Prince engine (2013 SI — timing chain / tensioner)",
        url: "https://en.wikipedia.org/wiki/Prince_engine",
      },
    ],
  });
}

// —— N53 HPFP (same pump as N54 — Wikipedia) ——
upsert({
  id: "n53-hpfp",
  engines: ["N53"],
  chassis_slugs: N53_CH,
  year_from: 2007,
  year_to: 2012,
  title: {
    en: "N53 HPFP (same family as N54)",
    pl: "N53 HPFP (ta sama rodzina co N54)",
    ru: "N53 HPFP (та же семья, что N54)",
  },
  affects: {
    en: "EU N53 DI six (~2007–2012 early pump window); 2012/13 redesign noted by specialists",
    pl: "EU N53 DI (~2007–2012 wczesna pompa); redesign ~2012/13 wg specjalistów",
    ru: "EU N53 DI (~2007–2012); редизайн ~2012/13",
  },
  summary: {
    en: "Wikipedia N53: uses the same HPFP as the N54 (US N54 actions did not cover N53 because N53 was not sold in the US). Failures are reported on N53; specialist guides note a more reliable redesign around 2012/2013. Bound here to 2007–2012 as the early-pump ownership window. Injectors remain a separate high-cost pain. PLN from sourced N54 HPFP prior.",
    pl: "Wikipedia N53: ta sama HPFP co N54 (N53 nie było w USA). Awarię raportowane; redesign ~2012/13. Okno 2007–2012. Wtryski osobno. PLN z wyceny N54 HPFP.",
    ru: "Wikipedia N53: тот же HPFP, что у N54. Окно 2007–2012. Форсунки отдельно. PLN из N54 HPFP.",
  },
  severity: "expensive",
  pln_bands: hpfpPln || undefined,
  sources: [
    {
      label: "Wikipedia · BMW N53 (same HPFP as N54)",
      url: "https://en.wikipedia.org/wiki/BMW_N53",
    },
    {
      label: "BMWTuning · N53 HPFP + ~2012/13 redesign note",
      url: "https://bmwtuning.co/n53-engine-problems/",
    },
    {
      label: "NHTSA · N54 HPFP warranty TSB (family prior)",
      url: "https://static.nhtsa.gov/odi/tsbs/2013/MC-10149587-9999.pdf",
    },
  ],
  autodoc_query: {
    en: "BMW N53 HPFP",
    pl: "BMW N53 pompa HPFP",
    ru: "BMW N53 ТНВД",
  },
});

// —— N53 / N43 intake carbon ——
upsert({
  id: "n53-intake-carbon",
  engines: ["N53", "N43"],
  chassis_slugs: [...new Set([...N53_CH, ...N43_CH])],
  year_from: 2007,
  year_to: 2013,
  title: {
    en: "N53/N43 intake-valve carbon (DI)",
    pl: "N53/N43 nagar na zaworach (DI)",
    ru: "N53/N43 нагар на клапанах (DI)",
  },
  affects: {
    en: "EU direct-injection N43/N53 — not US N52",
    pl: "EU N43/N53 DI — nie US N52",
    ru: "EU N43/N53 DI — не US N52",
  },
  summary: {
    en: "N43/N53 are DI petrol (Wikipedia). Intake-valve carbon / misfire is the same ownership theme BMW documented for N54 DI in NHTSA SI B12 02 12 (carbon blaster). Apply as a wear cost on EU DI fours/sixes — confirm idle quality. Separate from piezo injector and HPFP pains.",
    pl: "N43/N53 to DI (Wikipedia). Nagar jak na N54 (NHTSA SI carbon blaster). Osobno od wtrysków i HPFP.",
    ru: "N43/N53 — DI. Нагар как у N54 (NHTSA SI). Отдельно от форсунок и HPFP.",
  },
  severity: "annoyance",
  pln_bands: CARBON_PLN,
  sources: [
    {
      label: "Wikipedia · BMW N53 (direct injection)",
      url: "https://en.wikipedia.org/wiki/BMW_N53",
    },
    {
      label: "NHTSA · SI B12 02 12 N54 intake carbon cleaning (DI family procedure)",
      url: "https://static.nhtsa.gov/odi/tsbs/2014/MC-10149286-9999.pdf",
    },
    {
      label: "BMWTuning · N53 carbon / injector notes",
      url: "https://bmwtuning.co/n53-engine-problems/",
    },
  ],
  autodoc_query: {
    en: "BMW N53 walnut blast",
    pl: "BMW N53 czyszczenie dolotu",
    ru: "BMW N53 чистка впуска",
  },
});

// —— N43 HPFP (DI four, same era) ——
upsert({
  id: "n43-hpfp",
  engines: ["N43"],
  chassis_slugs: N43_CH,
  year_from: 2007,
  year_to: 2011,
  title: {
    en: "N43 HPFP (DI four)",
    pl: "N43 HPFP (czterocylindrowy DI)",
    ru: "N43 HPFP (DI четвёрка)",
  },
  affects: {
    en: "EU N43 (~2007–2011) — long crank / fuel-pressure faults",
    pl: "EU N43 (~2007–2011)",
    ru: "EU N43 (~2007–2011)",
  },
  summary: {
    en: "N43 is the DI four that replaced N46 in many EU markets (Wikipedia N13 notes N43 predecessor). HPFP/fuel-pressure complaints sit alongside the known expensive injector theme. Bound to the N43 production window. PLN from N54 HPFP family prior.",
    pl: "N43 to DI zamiast N46 w wielu rynkach EU. HPFP obok drogich wtrysków. Okno produkcji N43. PLN z prior N54 HPFP.",
    ru: "N43 — DI вместо N46. HPFP рядом с форсунками. PLN из N54 HPFP.",
  },
  severity: "expensive",
  pln_bands: hpfpPln || undefined,
  sources: [
    {
      label: "Wikipedia · BMW N13 (N43 as predecessor context)",
      url: "https://en.wikipedia.org/wiki/BMW_N13",
    },
    {
      label: "Wikipedia · BMW N53 (DI / HPFP family context for EU DI petrol)",
      url: "https://en.wikipedia.org/wiki/BMW_N53",
    },
    {
      label: "PLN · cenauslug.pl · HPFP prior",
      url: "https://cenauslug.pl/poradniki/wymiana-pompy-paliwa-jakie-sa-koszty-i-jak-wybrac-warsztat",
    },
  ],
  autodoc_query: {
    en: "BMW N43 HPFP",
    pl: "BMW N43 pompa HPFP",
    ru: "BMW N43 ТНВД",
  },
});

// —— N42/N46 OFH via shared OFH pain ——
if (byId["n20-oil-filter"]) {
  upsert({
    ...byId["n20-oil-filter"],
    engines: [...new Set([...(byId["n20-oil-filter"].engines || []), "N42", "N46"])],
    title: {
      en: "N20 / N42 / N46 / N52 / N55 / B48 / B38 — OFH gasket (all years)",
      pl: "N20 / N42 / N46 / N52 / N55 / B48 / B38 — uszczelka OFH (wszystkie lata)",
      ru: "N20 / N42 / N46 / N52 / N55 / B48 / B38 — прокладка OFH (все годы)",
    },
    summary: {
      en: "Oil-filter housing gasket leak is a recurring theme across BMW fours and sixes including N42/N46 (ownership reports + same plastic housing family as later OFHG). Inspect oil on the belt / undertray. Timing guides remain the headline mechanical risk on N42/N46.",
      pl: "Wyciek OFH typowy też na N42/N46. Szukaj oleju na pasku. Prowadnice łańcucha nadal główne ryzyko mechaniczne.",
      ru: "Течь OFH также на N42/N46. Направляющие цепи — главный механический риск.",
    },
    sources: [
      ...(byId["n20-oil-filter"].sources || []),
      {
        label: "Wikipedia · BMW N46 (production / Valvetronic four context)",
        url: "https://en.wikipedia.org/wiki/BMW_N46",
      },
    ],
  });
}

// Expand timing-guides chassis if needed
if (byId["timing-guides"]) {
  upsert({
    ...byId["timing-guides"],
    chassis_slugs: [...new Set([...(byId["timing-guides"].chassis_slugs || []), ...N46_CH])],
  });
}

pains.collected_at = NOW;
pains.meta = {
  ...(pains.meta || {}),
  phase_f2b_note:
    "N13 HPFP+carbon; N53 HPFP+carbon; N43 HPFP; N42/N46 OFH; Prince/N53 Wikipedia Tier A cites",
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
log.runs.push({ id: "phase-f2b-n13-n46-n43-n53", at: NOW });
fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");

console.log("F2b applied");
