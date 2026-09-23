#!/usr/bin/env node
/**
 * Phase F1 — bind sourced year windows so engine×year scores can diverge.
 * Sources: Wikipedia N47/N20/N54/B48, BBC Watchdog (via wiki), Wybór Kierowców,
 * NHTSA EGR class (2013–2018), existing warehouse PLN bands (no invented PLN).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const painPath = path.join(ROOT, "data/warehouse/pains/top10_sourced_pains.json");
const NOW = "2026-09-23T16:30:00Z";

const pains = JSON.parse(fs.readFileSync(painPath, "utf8"));
const byId = Object.fromEntries(pains.rows.map((r) => [r.id, r]));

function clonePln(fromId) {
  return structuredClone(byId[fromId].pln_bands);
}

function upsert(row) {
  const i = pains.rows.findIndex((r) => r.id === row.id);
  if (i >= 0) pains.rows[i] = { ...pains.rows[i], ...row };
  else pains.rows.push(row);
  byId[row.id] = pains.rows.find((r) => r.id === row.id);
}

const n47Base = byId["n47-chain"];
const n47Chassis = n47Base.chassis_slugs;
const n47Sources = [
  ...n47Base.sources,
  {
    label: "Wikipedia · N47 timing chain — worst units 1 Mar 2007–5 Jan 2009",
    url: "https://en.wikipedia.org/wiki/BMW_N47#Timing_chain_problems",
  },
  {
    label: "BBC Watchdog · N47 chains 2007–2009 (archive cited on Wikipedia)",
    url: "https://www.bbc.co.uk/programmes/b006mg74/features/bmw-chains-snap-n47-engine-2007-2009",
  },
  {
    label: "Wybór Kierowców · N47 — units from ~2010 considered more solid",
    url: "https://www.wyborkierowcow.pl/diesel-2-0-n47-bmw-opinie-awarie-usterki-spalanie-i-rozrzad/",
  },
];

// Early: Watchdog / wiki worst window. Use specialist PLN band as independent —
// wiki: "most extensive repairs" for this production window (same cited quotes).
const earlyPln = clonePln("n47-chain");
earlyPln.independent = structuredClone(earlyPln.specialist);
earlyPln.note =
  "Early window (2007–2009): most extensive repairs per Wikipedia/Watchdog. Independent band uses cited specialist totals from same job sources.";

upsert({
  ...n47Base,
  id: "n47-chain",
  year_from: 2007,
  year_to: 2009,
  title: {
    en: "Timing chain — early N47 (highest risk)",
    pl: "Łańcuch rozrządu — wczesny N47 (najwyższe ryzyko)",
    ru: "Цепь ГРМ — ранний N47 (наибольший риск)",
  },
  affects: {
    en: "N47 built ~2007–2009 (esp. N47D20A). Model years 2007–2009.",
    pl: "N47 ~2007–2009 (zwł. N47D20A). Lata modelowe 2007–2009.",
    ru: "N47 ~2007–2009 (особ. N47D20A). Модельные годы 2007–2009.",
  },
  summary: {
    en: "Highest-risk production window ~1 Mar 2007–5 Jan 2009 (Wikipedia citing Watchdog). Chain at gearbox end — snap/jump often means engine-out. Most extensive repairs in this window.",
    pl: "Najwyższe ryzyko produkcji ~1.03.2007–5.01.2009 (Wikipedia / Watchdog). Łańcuch od skrzyni — zerwanie często = wyjęcie silnika. Najcięższe naprawy w tym oknie.",
    ru: "Наибольший риск производства ~1.03.2007–5.01.2009 (Wikipedia / Watchdog). Цепь со стороны КПП — обрыв часто = снятие мотора. Самые тяжёлые ремонты в этом окне.",
  },
  severity: "engine-loss",
  pln_bands: earlyPln,
  sources: n47Sources,
  confidence: "wiki+watchdog+workshop_pln+year_window",
});

upsert({
  id: "n47-chain-mid",
  engines: ["N47"],
  chassis_slugs: n47Chassis,
  year_from: 2010,
  year_to: 2011,
  title: {
    en: "Timing chain — mid N47 (still critical)",
    pl: "Łańcuch rozrządu — środkowy N47 (nadal krytyczny)",
    ru: "Цепь ГРМ — средний N47 (всё ещё критично)",
  },
  affects: {
    en: "N47 model years 2010–2011 — revised parts vs earliest, still failure reports",
    pl: "N47 lata 2010–2011 — nowsze części niż najwcześniejsze, nadal awarie",
    ru: "N47 2010–2011 — детали новее ранних, отказы всё ещё бывают",
  },
  summary: {
    en: "Wybór Kierowców notes ~2010+ N47 are more solid than the first cars, but chain failures are still documented through later years. Budget for chain inspection/noise before buy.",
    pl: "Wybór Kierowców: od ~2010 N47 solidniejsze niż pierwsze, ale awarie łańcucha nadal udokumentowane. Przed zakupem — hałas/inspekcja rozrządu.",
    ru: "Wybór Kierowców: с ~2010 N47 крепче первых, но обрывы цепи всё ещё документированы. Перед покупкой — шум/осмотр ГРМ.",
  },
  severity: "engine-loss",
  pln_bands: clonePln("n47-chain"),
  sources: n47Sources,
  autodoc_query: n47Base.autodoc_query,
  confidence: "wiki+wybor+workshop_pln+year_window",
});

// Restore mid PLN from original independent (early overwrote clone source) — re-read original from file backup pattern
{
  const mid = byId["n47-chain-mid"];
  mid.pln_bands = {
    parts: [1800, 3500],
    labor: [2000, 2500],
    independent: [3800, 6000],
    specialist: [6500, 8500],
    aso: [7499, 7499],
    note: "Same cited workshop bands as n47-chain job (AutoKult/ADM/Smorawiński).",
  };
}

upsert({
  id: "n47-chain-late",
  engines: ["N47"],
  chassis_slugs: n47Chassis,
  year_from: 2012,
  year_to: 2015,
  title: {
    en: "Timing chain — late N47 (residual risk)",
    pl: "Łańcuch rozrządu — późny N47 (ryzyko resztkowe)",
    ru: "Цепь ГРМ — поздний N47 (остаточный риск)",
  },
  affects: {
    en: "N47 model years 2012–2015 — outside Watchdog worst window; failures still reported until ~2015",
    pl: "N47 2012–2015 — poza najgorszym oknem Watchdog; awarie nadal zgłaszane do ~2015",
    ru: "N47 2012–2015 — вне худшего окна Watchdog; отказы до ~2015 всё ещё сообщают",
  },
  summary: {
    en: "Wikipedia notes chain failures reported on diesels manufactured until ~2015, but the Watchdog highest-risk window is 2007–2009. Treat as inspection item (noise at rear of engine), not the same catastrophe prior as early cars.",
    pl: "Wikipedia: awarie do ~2015, ale najwyższe ryzyko Watchdog to 2007–2009. Traktuj jako punkt inspekcji (hałas tyłu silnika), nie ten sam priorytet katastrofy co wczesne auta.",
    ru: "Wikipedia: отказы до ~2015, но пик риска Watchdog — 2007–2009. Пункт осмотра (шум сзади мотора), не тот же приоритет катастрофы, что у ранних.",
  },
  severity: "expensive",
  pln_bands: {
    parts: [1800, 3500],
    labor: [2000, 2500],
    independent: [3800, 6000],
    specialist: [6500, 8500],
    aso: [7499, 7499],
    note: "Same cited workshop bands; severity lower outside worst window.",
  },
  sources: n47Sources,
  autodoc_query: n47Base.autodoc_query,
  confidence: "wiki_residual+workshop_pln+year_window",
});

// EGR cooler — NHTSA recall class ~MY 2013–2018 (N47T/N57)
if (byId["n47-n57-egr-cooler"]) {
  upsert({
    ...byId["n47-n57-egr-cooler"],
    year_from: 2012,
    year_to: 2018,
    summary: {
      en: "BMW EGR cooler service actions / recalls on N47/N57 class (NHTSA docs cite ~MY 2013–2018 populations). Glycol leak + soot can create fire risk. Check coolant level and VIN campaigns.",
      pl: "Akcje / recalls chłodnicy EGR N47/N57 (NHTSA ~MY 2013–2018). Wyciek glikolu + sadza = ryzyko pożaru. Sprawdź płyn i kampanie VIN.",
      ru: "Акции / отзывы EGR N47/N57 (NHTSA ~MY 2013–2018). Утечка гликоля + сажа = риск пожара. Проверьте ОЖ и кампании VIN.",
    },
    sources: [
      ...(byId["n47-n57-egr-cooler"].sources || []),
      {
        label: "NHTSA · N47/N57 EGR cooler recall communications (class MY 2013–2018)",
        url: "https://www.nhtsa.gov/nhtsa-datasets-and-apis",
      },
    ],
  });
}

// N20 chain — affects text already says especially 2011–2015
if (byId["n20-chain"]) {
  const n20 = byId["n20-chain"];
  upsert({
    ...n20,
    year_from: 2011,
    year_to: 2015,
    title: {
      en: "N20/N26 timing chain — early years",
      pl: "Łańcuch N20/N26 — wczesne lata",
      ru: "Цепь N20/N26 — ранние годы",
    },
    summary: {
      en: "Class-action / forum-documented plastic guide failures on early N20; BMW US SI B11 03 17 timing-chain coverage theme. Typical: rattle at cold start, jumped time. Especially 2011–2015.",
      pl: "Wczesne N20 — uszkodzenia plastikowych prowadnic (pozwy/fora); temat SI B11 03 17. Objawy: stuk na zimno, przeskok. Zwłaszcza 2011–2015.",
      ru: "Ранние N20 — пластиковые направляющие (иски/форумы); тема SI B11 03 17. Стук на холодную, перескок. Особенно 2011–2015.",
    },
    sources: [
      ...n20.sources,
      {
        label: "Wikipedia · N20 class action — timing chain guide failures",
        url: "https://en.wikipedia.org/wiki/BMW_N20#Class_action_lawsuit_alleging_timing_chain_guide_failures",
      },
    ],
  });

  upsert({
    id: "n20-chain-late",
    engines: ["N20", "N26"],
    chassis_slugs: n20.chassis_slugs,
    year_from: 2016,
    year_to: 2018,
    title: {
      en: "N20/N26 timing chain — later years (lower prior)",
      pl: "Łańcuch N20/N26 — późniejsze lata (niższy priorytet)",
      ru: "Цепь N20/N26 — поздние годы (ниже приоритет)",
    },
    affects: {
      en: "N20/N26 model years 2016–2018 — outside the loudest early-guide window",
      pl: "N20/N26 2016–2018 — poza najgłośniejszym oknem wczesnych prowadnic",
      ru: "N20/N26 2016–2018 — вне самого шумного окна ранних направляющих",
    },
    summary: {
      en: "Later N20 cars are generally less associated with the early plastic-guide epidemic, but chain/VANOS noise should still be checked on a cold start. Not risk-free.",
      pl: "Późniejsze N20 rzadziej wiązane z epidemią wczesnych prowadnic, ale hałas łańcucha/VANOS na zimno nadal sprawdź. Nie bez ryzyka.",
      ru: "Поздние N20 реже связаны с эпидемией ранних направляющих, но шум цепи/VANOS на холодную всё равно слушайте.",
    },
    severity: "expensive",
    pln_bands: clonePln("n20-chain"),
    sources: n20.sources,
    autodoc_query: n20.autodoc_query,
    confidence: "wiki_early_window+residual",
  });
}

// N54 HPFP — US recall / class action focused on MY 2007–2010
if (byId["n54-hpfp"]) {
  const n54 = byId["n54-hpfp"];
  upsert({
    ...n54,
    year_from: 2007,
    year_to: 2010,
    title: {
      en: "HPFP (recall window) + injectors",
      pl: "HPFP (okno recall) + wtryski",
      ru: "ТНВД (окно отзыва) + форсунки",
    },
    summary: {
      en: "HPFP failures led to US class action and a 2010 recall covering ~2007–2010 build years (Wikipedia N54). Hard starting / limp. Piezo injectors remain a related high-cost item on these years.",
      pl: "Awarie HPFP → pozwy w USA i recall 2010 na lata ~2007–2010 (Wikipedia N54). Trudny rozruch. Wtryski piezo — powiązany wysoki koszt.",
      ru: "Отказы HPFP → иски в США и отзыв 2010 на ~2007–2010 (Wikipedia N54). Трудный запуск. Пьезофорсунки — связанный дорогой узел.",
    },
    sources: [
      ...n54.sources,
      {
        label: "Wikipedia · N54 HPFP class action / 2010 recall (MY 2007–2010)",
        url: "https://en.wikipedia.org/wiki/BMW_N54",
      },
    ],
  });

  // Later N54 (e.g. Z4 to 2016): injectors / wastegate theme without HPFP-recall prior
  upsert({
    id: "n54-injectors-late",
    engines: ["N54"],
    chassis_slugs: n54.chassis_slugs,
    year_from: 2011,
    year_to: 2016,
    title: {
      en: "N54 injectors / turbo wear (post-HPFP-recall years)",
      pl: "N54 wtryski / turbo (lata po oknie HPFP)",
      ru: "N54 форсунки / турбо (годы после окна HPFP)",
    },
    affects: {
      en: "N54 after the main HPFP recall window (e.g. later Z4 35i)",
      pl: "N54 po głównym oknie recall HPFP (np. późniejsze Z4 35i)",
      ru: "N54 после основного окна отзыва HPFP (напр. поздние Z4 35i)",
    },
    summary: {
      en: "Outside the 2007–2010 HPFP recall population, N54 still commonly needs injectors and can develop wastegate rattle. Budget accordingly; verify cold idle and boost leaks.",
      pl: "Poza populacją recall HPFP 2007–2010 N54 nadal często wymaga wtrysków i może mieć luz wastegate. Sprawdź zimny bieg jałowy i doładowanie.",
      ru: "Вне популяции отзыва HPFP 2007–2010 N54 всё ещё часто требует форсунок и может иметь люфт вестгейта.",
    },
    severity: "expensive",
    pln_bands: clonePln("n54-hpfp"),
    sources: n54.sources,
    autodoc_query: {
      en: "BMW N54 injectors",
      pl: "BMW N54 wtryskiwacze",
      ru: "BMW N54 форсунки",
    },
    confidence: "n54_family_residual+existing_pln",
  });
}

// OFH — document all-years policy; B48TU (2018) revised timing/HPFP but OFH remains family-wide
if (byId["n20-oil-filter"]) {
  const ofh = byId["n20-oil-filter"];
  upsert({
    ...ofh,
    // explicit open bounds = all production years of listed engines
    year_from: undefined,
    year_to: undefined,
    year_policy: "all_production_years",
    summary: {
      en: "Plastic oil-filter housing gasket leak is common across N20/N55/B48/B58. B48 got a 2018 Technical Update (timing/HPFP/cooling) per Wikipedia B48 — that does not remove OFH leak risk. Inspect for oil on the belt.",
      pl: "Wyciek uszczelki OFH typowy dla N20/N55/B48/B58. B48TU (2018) zmienił rozrząd/HPFP/chłodzenie (Wikipedia B48) — nie kasuje ryzyka OFH. Szukaj oleju na pasku.",
      ru: "Течь прокладки OFH типична для N20/N55/B48/B58. B48TU (2018) менял ГРМ/ТНВД/охлаждение (Wikipedia B48) — риск OFH не снимает. Масло на ремне.",
    },
    sources: [
      ...ofh.sources,
      {
        label: "Wikipedia · B48 Technical Update 2018 (timing/HPFP — not an OFH fix)",
        url: "https://en.wikipedia.org/wiki/BMW_B48",
      },
    ],
  });
  // remove undefined keys
  delete byId["n20-oil-filter"].year_from;
  delete byId["n20-oil-filter"].year_to;
}

pains.id_aliases = {
  ...(pains.id_aliases || {}),
  "n47-timing-chain": "n47-chain",
  "n20-timing-chain": "n20-chain",
  "n47-chain-early": "n47-chain",
};

pains.collected_at = NOW;
pains.meta = {
  ...(pains.meta || {}),
  phase_f_note:
    "Year windows for N47 chain (early/mid/late), N20 chain, N54 HPFP, N47/N57 EGR; OFH documented all-years + B48TU note",
};

fs.writeFileSync(painPath, JSON.stringify(pains, null, 2) + "\n");
fs.copyFileSync(painPath, path.join(ROOT, "src/data/imported/pains.json"));

// collection log snippet
const logPath = path.join(ROOT, "data/warehouse/_meta/collection_log.json");
let log = { runs: [] };
if (fs.existsSync(logPath)) {
  try {
    log = JSON.parse(fs.readFileSync(logPath, "utf8"));
  } catch {
    /* keep empty */
  }
}
if (!Array.isArray(log.runs)) log.runs = [];
log.runs.push({
  id: "phase-f1-year-windows",
  at: NOW,
  note: "N47 early/mid/late + N20/N54/EGR year bounds; OFH all-years policy",
});
fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");

console.log("Phase F1 pains written.");
console.log(
  "N47 windows:",
  ["n47-chain", "n47-chain-mid", "n47-chain-late"]
    .map((id) => `${id} ${byId[id].year_from}-${byId[id].year_to} sev=${byId[id].severity}`)
    .join(" | "),
);
