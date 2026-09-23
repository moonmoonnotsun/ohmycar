#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const painPath = path.join(ROOT, "data/warehouse/pains/top10_sourced_pains.json");
const NOW = "2026-09-23T21:15:00Z";

const p = JSON.parse(fs.readFileSync(painPath, "utf8"));
const base = p.rows.find((r) => r.id === "i3-hv-120ah");
const row = {
  id: "i4-hv-battery",
  engines: ["HA0"],
  chassis_slugs: ["i4"],
  year_from: 2021,
  year_to: 2026,
  title: {
    en: "i4 HV battery (eDrive pack)",
    pl: "i4 bateria HV (pakiet eDrive)",
    ru: "i4 HV батарея (пакет eDrive)",
  },
  affects: {
    en: "i4 eDrive40 / similar HA0 packs",
    pl: "i4 eDrive40 / podobne pakiety HA0",
    ru: "i4 eDrive40 / пакеты HA0",
  },
  summary: {
    en: "i4 uses a different HV pack generation than i3 (Wikipedia i4 / eDrive). Treat pack SOH and replacement cost as the headline EV ownership risk. PLN band reused from sourced i3 large-pack quotes as family prior until i4-specific PL quotes land.",
    pl: "i4 ma inny pakiet HV niż i3. SOH i koszt wymiany to główny temat EV. Pasmo PLN z wycen i3 (duży pakiet) jako prior do wycen i4.",
    ru: "i4 — другой HV-пакет, чем i3. SOH и замена — главная тема. PLN из котировок i3 (большой пакет) как prior.",
  },
  severity: "expensive",
  pln_bands: base.pln_bands,
  sources: [
    { label: "Wikipedia · BMW i4", url: "https://en.wikipedia.org/wiki/BMW_i4" },
    ...(base.sources || []).slice(0, 2),
  ],
  autodoc_query: {
    en: "BMW i4 HV battery",
    pl: "BMW i4 bateria HV",
    ru: "BMW i4 тяговая батарея",
  },
};

const idx = p.rows.findIndex((r) => r.id === "i4-hv-battery");
if (idx >= 0) p.rows[idx] = { ...p.rows[idx], ...row };
else p.rows.push(row);

for (const id of ["i3-hv-battery", "i3-hv-94ah", "i3-hv-120ah"]) {
  const r = p.rows.find((x) => x.id === id);
  if (r) r.engines = (r.engines || []).filter((e) => e !== "HA0");
}

p.collected_at = NOW;
fs.writeFileSync(painPath, JSON.stringify(p, null, 2) + "\n");
fs.copyFileSync(painPath, path.join(ROOT, "src/data/imported/pains.json"));

fs.writeFileSync(
  path.join(ROOT, "data/warehouse/repair_costs/jobs/i4-hv-battery.json"),
  JSON.stringify(
    {
      pain_id: "i4-hv-battery",
      status: "quoted_workshop_band",
      currency: "PLN",
      region: "PL",
      collected_at: NOW,
      totals_pln: {
        independent: row.pln_bands.independent,
        specialist: row.pln_bands.specialist,
        aso: row.pln_bands.aso,
      },
      parts_pln: row.pln_bands.parts,
      labor_pln: row.pln_bands.labor,
      quotes: [
        {
          tier: "specialist",
          pln_low: row.pln_bands.independent[0],
          pln_high: row.pln_bands.independent[1],
          label: "i3 large-pack prior applied to i4",
          url: "https://en.wikipedia.org/wiki/BMW_i4",
        },
      ],
      split_note: "Family prior from i3-hv-120ah",
      confidence: "f4a_i4_fix",
    },
    null,
    2,
  ) + "\n",
);

let vol = fs.readFileSync(path.join(ROOT, "src/data/volume.ts"), "utf8");
vol = vol.replace(
  /engine:\s*"HA0"([\s\S]{0,120}?)topPainId:\s*"i3-hv-battery"/g,
  'engine: "HA0"$1topPainId: "i4-hv-battery"',
);
fs.writeFileSync(path.join(ROOT, "src/data/volume.ts"), vol);
console.log("i4 null fix applied");
