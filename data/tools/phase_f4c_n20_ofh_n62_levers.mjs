#!/usr/bin/env node
/**
 * Phase F4c — Tier A year splits (no invented RealOEM day-codes).
 *
 * 1) N20 plastic OFH Service Action SI B11 13 15 — prod Aug 2011–Mar 2012
 *    (E84/E89/F10/F25/F30). Distinct from all-years gasket theme.
 * 2) N62 Valvetronic intermediate levers SI B11 02 05 — prod Jun 2004–Feb 2005
 *    (E53/E60/E63/E64/E65/E66). Sibling early window under n62-valvetronic.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const painPath = path.join(ROOT, "data/warehouse/pains/top10_sourced_pains.json");
const jobsDir = path.join(ROOT, "data/warehouse/repair_costs/jobs");
const NOW = "2026-09-23T23:00:00Z";

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
        confidence: "f4c_sync",
      },
      null,
      2,
    ) + "\n",
  );
}

const ofhGasket = byId["n20-oil-filter"]?.pln_bands;
const housingPln = {
  parts: [800, 2200],
  labor: [1200, 2800],
  independent: [2000, 5000],
  specialist: [2800, 6500],
  aso: [4000, 9000],
  note: "Aluminum OFH housing R&R after plastic failure; SI B11 13 15 was free when open — unpaid used cars pay indie/ASO path",
};

// —— 1) N20 plastic OFH Service Action (Aug 2011 – Mar 2012) ——
upsert({
  id: "n20-oil-filter-early",
  engines: ["N20"],
  chassis_slugs: ["e84", "e89", "f10", "f25", "f30", "f31"],
  year_from: 2011,
  year_to: 2012,
  title: {
    en: "N20 early plastic OFH housing (Service Action)",
    pl: "N20 wczesna plastikowa obudowa OFH (Service Action)",
    ru: "N20 ранний пластиковый корпус OFH (Service Action)",
  },
  affects: {
    en: "N20 E84/E89/F10/F25/F30 produced Aug 2011–Mar 2012 — black plastic housing",
    pl: "N20 E84/E89/F10/F25/F30 prod. sie 2011–mar 2012 — czarny plastik",
    ru: "N20 E84/E89/F10/F25/F30 произв. авг 2011–мар 2012 — чёрный пластик",
  },
  summary: {
    en: "NHTSA SI B11 13 15 Service Action: on E84/E89/F10/F25/F30 with N20 built August 2011–March 2012, the black plastic oil-filter housing can fail and leak oil and/or coolant. Dealers inspect and replace plastic with aluminum (P/N 11 42 8 637 812) when the action is open. Distinct from the common all-years OFH gasket leak (n20-oil-filter). Confirm VIN / whether aluminum housing is already fitted.",
    pl: "NHTSA SI B11 13 15: N20 E84/E89/F10/F25/F30 sie 2011–mar 2012 — plastikowa obudowa OFH może przeciekać (olej/płyn). Wymiana na aluminium gdy akcja otwarta. Osobno od uszczelki OFH we wszystkich latach.",
    ru: "NHTSA SI B11 13 15: N20 авг 2011–мар 2012 — пластиковый корпус OFH может течь. Замена на алюминий при открытой акции. Отдельно от прокладки во все годы.",
  },
  severity: "overheat",
  pln_bands: housingPln,
  sources: [
    {
      label: "NHTSA · SI B11 13 15 — N20 inspect/replace plastic OFH (Aug 2011–Mar 2012)",
      url: "https://static.nhtsa.gov/odi/tsbs/2015/MC-10151399-9999.pdf",
    },
    {
      label: "NHTSA · SI B11 13 15 (July 2015 revision)",
      url: "https://static.nhtsa.gov/odi/tsbs/2015/MC-10146945-9999.pdf",
    },
  ],
  autodoc_query: {
    en: "BMW N20 oil filter housing",
    pl: "BMW N20 obudowa filtra oleju",
    ru: "BMW N20 корпус масляного фильтра",
  },
  confidence: "nhtsa_sib_111315_production_window",
});

if (byId["n20-oil-filter"]) {
  const g = byId["n20-oil-filter"];
  upsert({
    ...g,
    summary: {
      en: "Plastic OFH gasket leak remains common across N20/N52/N55/B48/B38/N42/N46/S55. On early N20 (Aug 2011–Mar 2012) also check SI B11 13 15 plastic housing Service Action (n20-oil-filter-early). On B48, also check early housing cracks (~2017–2019) and late coolant-bushing SIB 11 10 25 (MY 2025–2026) as separate pains. Inspect oil on the belt / undertray.",
      pl: "Uszczelka OFH nadal we wszystkich latach. Wczesne N20 (sie 2011–mar 2012): SI B11 13 15 plastikowa obudowa (n20-oil-filter-early). B48: pęknięcia ~2017–2019 i tuleja SIB 11 10 25.",
      ru: "Прокладка OFH во все годы. Ранний N20 (авг 2011–мар 2012): SI B11 13 15 пластиковый корпус. B48: трещины ~2017–2019 и втулка SIB 11 10 25.",
    },
    sources: [
      ...(g.sources || []),
      {
        label: "NHTSA · SI B11 13 15 N20 plastic OFH (see n20-oil-filter-early)",
        url: "https://static.nhtsa.gov/odi/tsbs/2015/MC-10151399-9999.pdf",
      },
    ],
  });
}

// —— 2) N62 intermediate levers (Jun 2004 – Feb 2005) ——
// Non-overlapping windows so year-sibling resolves like n47-chain / -mid / -late.
const n62Base = byId["n62-valvetronic"];
const leverPln = {
  parts: [2500, 6000],
  labor: [4000, 9000],
  independent: [6500, 15000],
  specialist: [8500, 18000],
  aso: [12000, 25000],
  note: "Both banks Valvetronic intermediate levers (×16) + valve covers — SI B11 02 05 job class prior",
};

const n62GeneralPln = n62Base?.pln_bands || {
  independent: [1500, 3500],
  specialist: [2500, 5000],
  aso: [4000, 8000],
};
const n62Chassis = n62Base?.chassis_slugs || ["e53", "e60", "e61", "e63", "e64", "e65", "e66", "e70"];
const n62Sources = [
  ...(n62Base?.sources || []),
  {
    label: "BMW SI B11 02 05 early levers (see n62-valvetronic-early)",
    url: "https://xoutpost.com/attachments/x5-e53-forum/38547d1261255308-rough-idle-cold-days-sib-11-02-05.pdf",
  },
];

if (n62Base) {
  upsert({
    ...n62Base,
    year_from: 2001,
    year_to: 2003,
    year_policy: "pre_sib_110205_window",
    summary: {
      en: "N62 (Wikipedia 2001–2010) Valvetronic V8 — eccentric-shaft / coolant themes on early pre-2004 cars. Jun 2004–Feb 2005 lever tolerance issue is n62-valvetronic-early; 2006+ residual is n62-valvetronic-late.",
      pl: "N62 — Valvetronic/chłodzenie na wczesnych autach przed 2004. Cze 2004–lut 2005: n62-valvetronic-early; od 2006: n62-valvetronic-late.",
      ru: "N62 — Valvetronic/охлаждение до 2004. Июн 2004–фев 2005: n62-valvetronic-early; с 2006: n62-valvetronic-late.",
    },
    sources: n62Sources,
  });
}

upsert({
  id: "n62-valvetronic-early",
  engines: ["N62"],
  chassis_slugs: ["e53", "e60", "e61", "e63", "e64", "e65", "e66"],
  year_from: 2004,
  year_to: 2005,
  title: {
    en: "N62 early Valvetronic intermediate levers",
    pl: "N62 wczesne dźwignie pośrednie Valvetronic",
    ru: "N62 ранние промежуточные рычаги Valvetronic",
  },
  affects: {
    en: "N62 E53/E60/E63/E64/E65/E66 produced Jun 2004–Feb 2005 — cold-start misfire",
    pl: "N62 E53/E60/E63/E64/E65/E66 prod. cze 2004–lut 2005 — nierówna praca na zimnym",
    ru: "N62 E53/E60/E63/E64/E65/E66 произв. июн 2004–фев 2005 — холодный холостой ход",
  },
  summary: {
    en: "BMW SI B11 02 05: N62 vehicles produced June 2004–February 2005 can suffer rough idle / misfire faults after cold start from incorrect Valvetronic intermediate-lever tolerances (lever stamp dates ~04 180–04 324). Correction replaces the full set of 16 levers (same classification) after the tolerance test. Distinct from general N62 Valvetronic wear outside this production window.",
    pl: "SI B11 02 05: N62 cze 2004–lut 2005 — nierówny jałowy / wypadanie zapłonów po zimnym starcie (tolerancje dźwigni Valvetronic). Wymiana kompletu 16 dźwigni.",
    ru: "SI B11 02 05: N62 июн 2004–фев 2005 — неровный ХХ / пропуски после холодного пуска. Замена комплекта 16 рычагов.",
  },
  severity: "expensive",
  pln_bands: leverPln,
  sources: [
    {
      label: "BMW SI B11 02 05 — N62 intermediate levers (prod 06/04–02/05)",
      url: "https://xoutpost.com/attachments/x5-e53-forum/38547d1261255308-rough-idle-cold-days-sib-11-02-05.pdf",
    },
    {
      label: "5Series.net · SI B11 02 05 text (May 2005 / Jan 2006)",
      url: "https://5series.net/forums/attachments/e60-discussion-2/1-year-old-545-required-major-engine-repair-24356/tis-17547d1144522526",
    },
  ],
  autodoc_query: {
    en: "BMW N62 Valvetronic intermediate lever",
    pl: "BMW N62 dźwignia Valvetronic",
    ru: "BMW N62 рычаг Valvetronic",
  },
  confidence: "bmw_sib_110205_production_window",
});

upsert({
  id: "n62-valvetronic-late",
  engines: ["N62"],
  chassis_slugs: n62Chassis,
  year_from: 2006,
  year_to: 2010,
  title: n62Base?.title || {
    en: "N62 Valvetronic / coolant (post-2005)",
    pl: "N62 Valvetronic / płyn (po 2005)",
    ru: "N62 Valvetronic / ОЖ (после 2005)",
  },
  affects: {
    en: "N62 from ~2006 — residual Valvetronic / coolant themes after lever SI window",
    pl: "N62 od ~2006 — resztkowy Valvetronic / chłodzenie po oknie dźwigni",
    ru: "N62 с ~2006 — остаточный Valvetronic / охлаждение после окна рычагов",
  },
  summary: {
    en: "After the Jun 2004–Feb 2005 intermediate-lever Service Information window, later N62 cars still need Valvetronic / plastic cooling inspection. No separate Watchdog-style year epidemic sourced for 2006–2010 beyond general wear.",
    pl: "Po oknie dźwigni SI B11 02 05 nadal sprawdzaj Valvetronic / plastik chłodzenia na N62 2006–2010.",
    ru: "После окна рычагов SI B11 02 05 на N62 2006–2010 всё равно проверяйте Valvetronic / пластик охлаждения.",
  },
  severity: "expensive",
  pln_bands: n62GeneralPln,
  sources: n62Sources,
  autodoc_query: n62Base?.autodoc_query || {
    en: "BMW N62 Valvetronic actuator",
    pl: "BMW N62 siłownik Valvetronic",
    ru: "BMW N62 актуатор Valvetronic",
  },
  confidence: "wiki_prior_post_lever_window",
});

pains.collected_at = NOW;
pains.meta = {
  ...(pains.meta || {}),
  phase_f4c_note:
    "N20 plastic OFH SI B11 13 15 (2011–12); N62 intermediate levers SI B11 02 05 (2004–05)",
};

fs.writeFileSync(painPath, JSON.stringify(pains, null, 2) + "\n");
fs.copyFileSync(painPath, path.join(ROOT, "src/data/imported/pains.json"));

for (const id of ["n20-oil-filter-early", "n62-valvetronic-early", "n62-valvetronic-late"]) {
  writeJob(id);
}

const logPath = path.join(ROOT, "data/warehouse/_meta/collection_log.json");
let log = { runs: [] };
try {
  log = JSON.parse(fs.readFileSync(logPath, "utf8"));
} catch {
  /* empty */
}
if (!Array.isArray(log.runs)) log.runs = [];
log.runs.push({ id: "phase-f4c-n20-ofh-n62-levers", at: NOW });
fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");

console.log("F4c applied", { housing: !!ofhGasket });
