#!/usr/bin/env node
/**
 * Phase F2d — job JSON for new pains + S85 SMG/throttle + PLN on design-change pains.
 * Quotes: SMG Society €327.73 motor; Element Performance £945 S85 actuators;
 * family priors already on pain rows (N54 HPFP, S65 bearings, free recalls).
 * FX: 4.3 PLN/EUR, 5.2 PLN/GBP (warehouse convention).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const painPath = path.join(ROOT, "data/warehouse/pains/top10_sourced_pains.json");
const jobsDir = path.join(ROOT, "data/warehouse/repair_costs/jobs");
const NOW = "2026-09-23T20:30:00Z";
const EUR = 4.3;
const GBP = 5.2;

const pains = JSON.parse(fs.readFileSync(painPath, "utf8"));
const byId = Object.fromEntries(pains.rows.map((r) => [r.id, r]));

function upsert(row) {
  const i = pains.rows.findIndex((r) => r.id === row.id);
  if (i >= 0) pains.rows[i] = { ...pains.rows[i], ...row };
  else pains.rows.push(row);
  byId[row.id] = pains.rows.find((r) => r.id === row.id);
}

function bandFromPartsLabor(parts, labor) {
  const independent = [parts[0] + labor[0], parts[1] + labor[1]];
  return {
    parts,
    labor,
    independent,
    specialist: [Math.round(independent[0] * 1.15), Math.round(independent[1] * 1.25)],
    aso: [Math.round(independent[0] * 1.4), Math.round(independent[1] * 1.5)],
  };
}

function writeJob(painId, extras = {}) {
  const r = byId[painId];
  if (!r?.pln_bands?.independent) return false;
  const jobPath = path.join(jobsDir, `${painId}.json`);
  if (fs.existsSync(jobPath) && !extras.force) return false;
  const b = r.pln_bands;
  const job = {
    pain_id: painId,
    status: extras.status || "quoted_workshop_band",
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
    quotes: extras.quotes || [
      {
        tier: "specialist",
        pln_low: b.independent[0],
        pln_high: b.independent[1],
        label: extras.label || `Warehouse prior · ${painId}`,
        url: extras.url || r.sources?.[0]?.url || "",
      },
    ],
    confidence: extras.confidence || "pain_pln_bands_sync",
    split_note: b.note || extras.split_note || "Synced from pain.pln_bands",
    formula: "independent_full = parts_pln + labor_pln (when split present)",
    ...extras.fields,
  };
  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2) + "\n");
  return true;
}

// —— S85 SMG pump motor (common failure; full hydraulic unit is rare/expensive) ——
const smgMotorEur = [328, 328];
const smgLaborEur = [150, 350];
const smgParts = [Math.round(smgMotorEur[0] * EUR), Math.round(smgMotorEur[1] * EUR)];
const smgLabor = [Math.round(smgLaborEur[0] * EUR), Math.round(smgLaborEur[1] * EUR)];
upsert({
  id: "s85-smg-pump",
  engines: ["S85"],
  chassis_slugs: ["e60-m5", "e61", "e63", "e64"],
  year_from: 2005,
  year_to: 2010,
  title: {
    en: "S85 SMG III pump motor",
    pl: "S85 silnik pompy SMG III",
    ru: "S85 мотор насоса SMG III",
  },
  affects: {
    en: "E60/E61 M5 and E63/E64 M6 SMG — pump motor far more common than full hydraulic unit",
    pl: "E60/E61 M5 i E63/E64 M6 SMG — najczęściej silnik pompy, nie cały hydrauliczny zespół",
    ru: "E60/E61 M5 и E63/E64 M6 SMG — чаще мотор насоса, не весь гидроагрегат",
  },
  summary: {
    en: "E60 M5 / E63 M6 SMG III electric pump motors fail with age (slow build pressure / no-shift). SMG Society lists a DE-made motor kit at €327.73; indie owners report motor-only fixes vs dealer quotes for the full hydraulic assembly (BimmerWorld lists complete unit ~$9k). Confirm diagnosis before buying a full unit. Bleed requires ISTA. Separate from S85 rod bearings.",
    pl: "Silnik pompy SMG III pada z wiekiem. SMG Society: zestaw ~328€; pełny zespół hydrauliczny bywa cytowany ~tysiące $. Diagnoza przed zakupem. Odpowietrzenie ISTA. Osobno od panewek.",
    ru: "Мотор насоса SMG III. SMG Society ~328€; полный гидроагрегат намного дороже. Диагностика обязательна. Отдельно от вкладышей.",
  },
  severity: "stranded",
  pln_bands: {
    ...bandFromPartsLabor(smgParts, smgLabor),
    note: `SMG Society motor €328 @${EUR} + indie bleed/labor €150–350; full hydraulic unit is a different (much higher) path`,
  },
  sources: [
    {
      label: "SMG Society · E60/E63 SMG III pump motor €327.73",
      url: "https://www.smgsociety.com/product/pump-motor-bmw-e60-m5-e63-m6-smg-iii/",
    },
    {
      label: "BimmerWorld · complete SMG hydraulic unit (full-path contrast)",
      url: "https://www.bimmerworld.com/Driveline-Shifter/Transmissions-Accessories/SMG-Hydraulic-Pump-Motor-Unit-BMW-M5-M6-21542282998.html",
    },
    {
      label: "M5Board · SMG pump motor vs full unit DIY notes",
      url: "https://www.m5board.com/threads/smg-pump-motor-replacement.345297/",
    },
  ],
  autodoc_query: {
    en: "BMW E60 M5 SMG pump motor",
    pl: "BMW E60 M5 silnik pompy SMG",
    ru: "BMW E60 M5 мотор насоса SMG",
  },
});

// —— S85 throttle actuators ——
const actGbp = 945; // Element supply+fit both
const actPln = Math.round(actGbp * GBP);
upsert({
  id: "s85-throttle-actuators",
  engines: ["S85"],
  chassis_slugs: ["e60-m5", "e61", "e63", "e64"],
  year_from: 2005,
  year_to: 2010,
  title: {
    en: "S85 throttle actuators (ITB)",
    pl: "S85 siłowniki przepustnic (ITB)",
    ru: "S85 актуаторы дросселей (ITB)",
  },
  affects: {
    en: "E60/E63 M5/M6 — limp / EML / DSC when actuators fail",
    pl: "E60/E63 M5/M6 — limp / EML / DSC przy awarii siłowników",
    ru: "E60/E63 M5/M6 — limp / EML / DSC при отказе актуаторов",
  },
  summary: {
    en: "Same ITB-actuator wear theme as S65 (plastic gears / boards). Element Performance (UK) quotes rebuilt actuators supply-and-fit from £945 for the pair; US reman units list ~$390 each + core. Expect limp mode with EML/DSC. Separate from rod bearings and SMG pump.",
    pl: "Ten sam temat ITB co S65. Element Performance: rebuilt supply+fit od £945 za parę. Osobno od panewek i pompy SMG.",
    ru: "Та же тема ITB, что у S65. Element Performance от £945 за пару. Отдельно от вкладышей и SMG.",
  },
  severity: "expensive",
  pln_bands: {
    parts: [Math.round(360 * 4), Math.round(390 * 2 * 4)], // rough USD→PLN prior for reman pair
    labor: [800, 2000],
    independent: [Math.round(actPln * 0.85), actPln],
    specialist: [actPln, Math.round(actPln * 1.25)],
    aso: [Math.round(actPln * 1.4), Math.round(actPln * 1.7)],
    note: `Element Performance £945 supply+fit @${GBP} PLN/GBP; reman unit listings ~$390 ea (Euro Power Motorsports)`,
  },
  sources: [
    {
      label: "Element Performance · S85 throttle actuator supply+fit from £945",
      url: "https://www.elementperformance.co.uk/bmw-e60-m5",
    },
    {
      label: "Euro Power Motorsports · reman S85 throttle actuator ~$390 + core",
      url: "https://europowermotorsports.com/products/re-manufactured-bmw-m5-throttle-actuator-single-unit",
    },
    {
      label: "BMWTuning · S65 ITB actuators (same failure mode class)",
      url: "https://bmwtuning.co/s65-engine-problems/",
    },
  ],
  autodoc_query: {
    en: "BMW S85 throttle actuator",
    pl: "BMW S85 siłownik przepustnicy",
    ru: "BMW S85 актуатор дросселя",
  },
});

// —— Fill design-change pains that scored without PLN ——
const n20Chain = byId["n20-chain"]?.pln_bands;
const n63Cool = byId["n63-coolant-pipes"]?.pln_bands;
const b58Ofh = byId["b58-oil-filter"]?.pln_bands;

if (byId["b48-timing-pre-tu"] && !byId["b48-timing-pre-tu"].pln_bands?.independent && n20Chain) {
  upsert({
    ...byId["b48-timing-pre-tu"],
    pln_bands: {
      ...n20Chain,
      note: "Family prior from sourced N20/N26 chain job (pre-TU B48 timing layout check — not an N47 snap epidemic)",
    },
  });
}

if (byId["b58-pre-tu"] && !byId["b58-pre-tu"].pln_bands?.independent && b58Ofh) {
  upsert({
    ...byId["b58-pre-tu"],
    pln_bands: {
      parts: [800, 2500],
      labor: [600, 2000],
      independent: [1500, 4500],
      specialist: [2000, 5500],
      aso: [2800, 7000],
      note: "Pre-TU fuel/HPFP inspection residual band — softer than chain; OFH remains separate (b58-oil-filter)",
    },
  });
}

if (byId["n63-pre-tu"] && !byId["n63-pre-tu"].pln_bands?.independent && n63Cool) {
  upsert({
    ...byId["n63-pre-tu"],
    pln_bands: {
      ...n63Cool,
      note: "Family prior from sourced N63 coolant-pipes job (pre-TU high-risk window)",
    },
  });
}

if (byId["n63-post-tu2"] && !byId["n63-post-tu2"].pln_bands?.independent) {
  upsert({
    ...byId["n63-post-tu2"],
    pln_bands: {
      parts: [400, 1500],
      labor: [400, 1200],
      independent: [800, 2500],
      specialist: [1100, 3200],
      aso: [1500, 4000],
      note: "Post-TÜ2 residual inspection band (lower than pre-TU / pipes epidemic)",
    },
  });
}

pains.collected_at = NOW;
pains.meta = {
  ...(pains.meta || {}),
  phase_f2d_note:
    "S85 SMG motor + throttle actuators; job JSON sync for F1/F2 pains; PLN on B48/B58/N63 design-change rows",
};

fs.writeFileSync(painPath, JSON.stringify(pains, null, 2) + "\n");
fs.copyFileSync(painPath, path.join(ROOT, "src/data/imported/pains.json"));

// —— Write job files for any pain with PLN lacking a job ——
let written = 0;
for (const r of pains.rows) {
  if (!r.pln_bands?.independent) continue;
  const src = r.sources?.[0];
  const ok = writeJob(r.id, {
    label: src?.label || `Synced · ${r.id}`,
    url: src?.url || "",
    status: r.pln_bands.independent[0] === 0 && r.pln_bands.independent[1] === 0
      ? "campaign_free"
      : "quoted_workshop_band",
    quotes:
      r.id === "s85-smg-pump"
        ? [
            {
              tier: "parts",
              pln_low: smgParts[0],
              pln_high: smgParts[1],
              currency: "EUR",
              pln_note: `SMG Society €328 @${EUR}`,
              url: "https://www.smgsociety.com/product/pump-motor-bmw-e60-m5-e63-m6-smg-iii/",
            },
            {
              tier: "labor",
              pln_low: smgLabor[0],
              pln_high: smgLabor[1],
              currency: "EUR",
              pln_note: "Indie motor R&R + ISTA bleed prior €150–350",
              url: "https://www.m5board.com/threads/smg-pump-motor-replacement.345297/",
            },
          ]
        : r.id === "s85-throttle-actuators"
          ? [
              {
                tier: "specialist",
                pln_low: Math.round(actPln * 0.85),
                pln_high: actPln,
                currency: "GBP",
                pln_note: `Element Performance £945 supply+fit @${GBP}`,
                url: "https://www.elementperformance.co.uk/bmw-e60-m5",
              },
            ]
          : undefined,
  });
  if (ok) written++;
}

const logPath = path.join(ROOT, "data/warehouse/_meta/collection_log.json");
let log = { runs: [] };
try {
  log = JSON.parse(fs.readFileSync(logPath, "utf8"));
} catch {
  /* empty */
}
if (!Array.isArray(log.runs)) log.runs = [];
log.runs.push({ id: "phase-f2d-jobs-s85-smg", at: NOW, jobs_written: written });
fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");

console.log("F2d applied; new job files:", written);
