#!/usr/bin/env node
/**
 * Phase F1b — next engines: B48/B58 pre-TU windows, clean OFH engines,
 * B47/N57/N55 year policy. No invented PLN — reuse existing bands or omit.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const painPath = path.join(ROOT, "data/warehouse/pains/top10_sourced_pains.json");
const NOW = "2026-09-23T16:45:00Z";

const pains = JSON.parse(fs.readFileSync(painPath, "utf8"));
const byId = Object.fromEntries(pains.rows.map((r) => [r.id, r]));

function upsert(row) {
  const i = pains.rows.findIndex((r) => r.id === row.id);
  if (i >= 0) pains.rows[i] = { ...pains.rows[i], ...row };
  else pains.rows.push(row);
  byId[row.id] = pains.rows.find((r) => r.id === row.id);
}

function clonePln(id) {
  return structuredClone(byId[id].pln_bands);
}

// —— OFH: N20 + N55 only on n20-oil-filter (B58 has dedicated pain; B48 stays here) ——
{
  const ofh = byId["n20-oil-filter"];
  upsert({
    ...ofh,
    engines: ["N20", "N55", "B48"],
    year_policy: "all_production_years",
    affects: {
      en: "N20 / N55 / B48 — oil down the side of the block (all years)",
      pl: "N20 / N55 / B48 — olej po boku bloku (wszystkie lata)",
      ru: "N20 / N55 / B48 — масло по боку блока (все годы)",
    },
    summary: {
      en: "Plastic oil-filter housing gasket leak is common on N20/N55/B48 across production years. B48TU (2018) revised timing/HPFP/cooling (Wikipedia) but does not remove OFH leak risk. Inspect oil on the accessory belt.",
      pl: "Wyciek uszczelki OFH typowy dla N20/N55/B48 we wszystkich latach. B48TU (2018) zmienił rozrząd/HPFP/chłodzenie (Wikipedia), ale nie kasuje ryzyka OFH. Szukaj oleju na pasku.",
      ru: "Течь OFH типична для N20/N55/B48 во все годы. B48TU (2018) менял ГРМ/ТНВД/охлаждение (Wikipedia), но риск OFH не снимает. Масло на ремне.",
    },
  });
  delete byId["n20-oil-filter"].year_from;
  delete byId["n20-oil-filter"].year_to;
}

// —— B48 pre-TU (Wikipedia: revised 2018 B48TU — one-part chain, cooling, HPFP) ——
upsert({
  id: "b48-timing-pre-tu",
  engines: ["B48"],
  year_from: 2014,
  year_to: 2018,
  title: {
    en: "B48 pre-TU layout (two-part chain / early cooling)",
    pl: "B48 przed TU (łańcuch dwuczęściowy / wczesne chłodzenie)",
    ru: "B48 до TU (двухчастная цепь / раннее охлаждение)",
  },
  affects: {
    en: "B48 model years ~2014–2018 before Technical Update",
    pl: "B48 lata ~2014–2018 przed Technical Update",
    ru: "B48 модельные годы ~2014–2018 до Technical Update",
  },
  summary: {
    en: "Wikipedia: B48 was revised in 2018 as B48TU — one-part timing chain (was two-part), separate head/block cooling circuits, and Bosch HDP6/HDEV6 HPFP/injectors. Pre-TU cars use the earlier layout. This is a documented design change, not an N47-class snap epidemic — still check cold-start noise and cooling before buy. OFH leak risk remains separately.",
    pl: "Wikipedia: w 2018 B48TU — łańcuch jednoczęściowy (wcześniej dwuczęściowy), osobne obiegi chłodzenia, HPFP/wtryski HDP6/HDEV6. Auta przed TU mają wcześniejszy układ. To udokumentowana zmiana konstrukcji, nie epidemia jak N47 — nadal sprawdź hałas na zimno i chłodzenie. OFH osobno.",
    ru: "Wikipedia: в 2018 B48TU — одночастная цепь (раньше двухчастная), раздельное охлаждение, ТНВД/форсунки HDP6/HDEV6. До TU — ранняя компоновка. Это задокументированное изменение, не эпидемия как N47 — всё равно слушайте холодный старт и охлаждение. OFH отдельно.",
  },
  severity: "expensive",
  pln_bands: null,
  pln_note: "No separate pre-TU chain job quote yet — severity from sourced design window only; OFH PLN stays on n20-oil-filter.",
  sources: [
    {
      label: "Wikipedia · BMW B48 — Technical Update 2018 (B48TU)",
      url: "https://en.wikipedia.org/wiki/BMW_B48",
    },
  ],
  autodoc_query: {
    en: "BMW B48 timing chain",
    pl: "BMW B48 łańcuch rozrządu",
    ru: "BMW B48 цепь ГРМ",
  },
  confidence: "wiki_tu_window_no_separate_pln",
});

// —— B58 pre-TU (Wikipedia: B58TU 2018 fuel pressure / HPFP / injectors / GPF) ——
upsert({
  id: "b58-pre-tu",
  engines: ["B58"],
  year_from: 2015,
  year_to: 2018,
  title: {
    en: "B58 pre-TU fuel / emissions layout",
    pl: "B58 przed TU — układ paliwa / emisji",
    ru: "B58 до TU — топливо / выбросы",
  },
  affects: {
    en: "B58 model years ~2015–2018 before B58TU",
    pl: "B58 lata ~2015–2018 przed B58TU",
    ru: "B58 модельные годы ~2015–2018 до B58TU",
  },
  summary: {
    en: "Wikipedia: B58 revised in 2018 as B58TU — higher fuel pressure, updated HPFP/injectors, particulate filter and other changes. Pre-TU cars use the earlier fuel system. OFH housing leaks remain common on B58 (see b58-oil-filter) across years.",
    pl: "Wikipedia: B58TU 2018 — wyższe ciśnienie paliwa, nowe HPFP/wtryski, filtr cząstek i inne zmiany. Auta przed TU mają wcześniejszy układ. Wycieki OFH na B58 nadal typowe (b58-oil-filter) we wszystkich latach.",
    ru: "Wikipedia: B58TU 2018 — выше давление топлива, новые ТНВД/форсунки, сажевый фильтр и др. До TU — ранняя топливная система. Течи OFH на B58 по-прежнему типичны (b58-oil-filter) во все годы.",
  },
  severity: "expensive",
  pln_bands: null,
  pln_note: "No separate pre-TU job quote — design window only; OFH PLN on b58-oil-filter.",
  sources: [
    {
      label: "Wikipedia · BMW B58 — Technical Update 2018 (B58TU)",
      url: "https://en.wikipedia.org/wiki/BMW_B58",
    },
  ],
  autodoc_query: {
    en: "BMW B58 high pressure fuel pump",
    pl: "BMW B58 pompa HPFP",
    ru: "BMW B58 ТНВД",
  },
  confidence: "wiki_tu_window_no_separate_pln",
});

// Ensure B58 OFH is all-years
if (byId["b58-oil-filter"]) {
  upsert({
    ...byId["b58-oil-filter"],
    year_policy: "all_production_years",
    summary: {
      ...(byId["b58-oil-filter"].summary || {}),
      en:
        (byId["b58-oil-filter"].summary?.en || "") +
        " Applies across B58 years; B58TU does not remove OFH leak risk.",
      pl:
        (byId["b58-oil-filter"].summary?.pl || "") +
        " Dotyczy wszystkich lat B58; B58TU nie kasuje ryzyka OFH.",
      ru:
        (byId["b58-oil-filter"].summary?.ru || "") +
        " На все годы B58; B58TU не снимает риск OFH.",
    },
  });
  delete byId["b58-oil-filter"].year_from;
  delete byId["b58-oil-filter"].year_to;
}

// —— B47: bind production start ——
if (byId["b47-egr"]) {
  upsert({
    ...byId["b47-egr"],
    year_from: 2014,
    year_to: 2030,
    year_policy: "all_b47_production_until_sourced_split",
    summary: {
      en: "B47 (from 2014, successor to N47 per Wikipedia) — timing chain is less of a theme than N47; EGR cooler and intake carbon are the typical high-mileage costs. No sourced early/late EGR risk split yet — same pack across B47 years until Tier A dates exist. Confirm B47 on the engine plate.",
      pl: "B47 (od 2014, następca N47 — Wikipedia) — łańcuch rzadziej niż N47; EGR i nagar to typowe koszty. Brak źródłowego podziału early/late EGR — ten sam pakiet do czasu dat Tier A. Potwierdź B47 na tabliczce.",
      ru: "B47 (с 2014, наслед N47 — Wikipedia) — цепь реже N47; EGR и нагар — типичные расходы. Нет sourced split early/late — один пакет до дат Tier A. Подтвердите B47 на шильдике.",
    },
    sources: [
      ...(byId["b47-egr"].sources || []),
      { label: "Wikipedia · BMW B47 (production from 2014)", url: "https://en.wikipedia.org/wiki/BMW_B47" },
    ],
  });
}

// —— N57 timing: production window ——
if (byId["n57-timing"]) {
  upsert({
    ...byId["n57-timing"],
    year_from: 2008,
    year_to: 2019,
    summary: {
      en: "N57 (2008–2019 per Wikipedia) fails less often than N47, but it is still a timing-chain diesel. Check timing noise and service history. EGR cooler theme is year-scoped separately (n47-n57-egr-cooler, ~2012–2018).",
      pl: "N57 (2008–2019, Wikipedia) psuje się rzadziej niż N47, ale to nadal diesel z łańcuchem. Sprawdź hałas i historię. Chłodnica EGR osobno (n47-n57-egr-cooler, ~2012–2018).",
      ru: "N57 (2008–2019, Wikipedia) ломается реже N47, но это дизель с цепью. Проверьте шум и историю. EGR отдельно (n47-n57-egr-cooler, ~2012–2018).",
    },
  });
}

// —— N55: water pump + OFH all years (document) ——
if (byId["water-pump"]) {
  upsert({
    ...byId["water-pump"],
    year_policy: "all_production_years_n52_n54_n55",
    summary: {
      en: "Electric water pump is a known wear item on N52/N54/N55 across production years (not a single Watchdog-style window). Can fail without clear warning — check cooling on every example. N55 also commonly shares OFH gasket leaks (n20-oil-filter).",
      pl: "Elektryczna pompa wody to zużycie na N52/N54/N55 we wszystkich latach (nie jedno okno jak Watchdog). Może paść bez ostrzeżenia — sprawdź chłodzenie. N55 też często OFH (n20-oil-filter).",
      ru: "Электрическая помпа — износ на N52/N54/N55 во все годы (не одно окно как Watchdog). Может отказать без предупреждения. У N55 также часто OFH (n20-oil-filter).",
    },
  });
}

pains.id_aliases = {
  ...(pains.id_aliases || {}),
  "b48-pre-tu": "b48-timing-pre-tu",
  "b58-timing-pre-tu": "b58-pre-tu",
};

pains.collected_at = NOW;
pains.meta = {
  ...(pains.meta || {}),
  phase_f1b_note:
    "B48/B58 pre-TU windows (wiki 2018 TU); OFH engines cleaned; B47/N57 year bounds; N55 water-pump all-years policy",
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
log.runs.push({ id: "phase-f1b-b48-b58-b47-n57", at: NOW });
fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");

console.log("F1b done:", ["b48-timing-pre-tu", "b58-pre-tu"].map((id) => `${id} ${byId[id].year_from}-${byId[id].year_to}`).join(" | "));
