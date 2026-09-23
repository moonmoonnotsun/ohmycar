#!/usr/bin/env node
/**
 * Phase F1c — N52/N62/N63/M47/M57/N43/N53 year policy + chassis map fixes.
 * Sources: Wikipedia N63 TU 2012/2016/2018, N52/N62/M57 production years.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const painPath = path.join(ROOT, "data/warehouse/pains/top10_sourced_pains.json");
const NOW = "2026-09-23T17:00:00Z";

const pains = JSON.parse(fs.readFileSync(painPath, "utf8"));
const byId = Object.fromEntries(pains.rows.map((r) => [r.id, r]));

function upsert(row) {
  const i = pains.rows.findIndex((r) => r.id === row.id);
  if (i >= 0) pains.rows[i] = { ...pains.rows[i], ...row };
  else pains.rows.push(row);
  byId[row.id] = pains.rows.find((r) => r.id === row.id);
}

// —— N63 pre-2012 TU (Wikipedia: 2012 TU added Valvetronic, new valve stem seals, etc.) ——
upsert({
  id: "n63-pre-tu",
  engines: ["N63"],
  chassis_slugs: ["f01", "f02", "f07", "f10", "f12", "f13", "e70", "f15", "e71", "f16", "g11", "g12", "g15", "g30"],
  year_from: 2008,
  year_to: 2011,
  title: {
    en: "N63 pre-2012 TU (early valve stems / layout)",
    pl: "N63 przed TU 2012 (wczesne uszczelniacze / układ)",
    ru: "N63 до TU 2012 (ранние маслосъёмные / компоновка)",
  },
  affects: {
    en: "Early N63 ~2008–2011 before Technical Update",
    pl: "Wczesny N63 ~2008–2011 przed Technical Update",
    ru: "Ранний N63 ~2008–2011 до Technical Update",
  },
  summary: {
    en: "Wikipedia: 2012 N63TU added Valvetronic, new valve stem seals, revised turbos/fuel system and a second coolant pump. Pre-TU cars keep the earlier hot-V layout. Coolant-pipe brittle failures are tracked separately (n63-coolant-pipes). Not an N47-class chain epidemic — still inspect oil consumption, coolant and valley leaks.",
    pl: "Wikipedia: N63TU 2012 dodał Valvetronic, nowe uszczelniacze zaworów, turbiny/paliwo i drugą pompę chłodzenia. Auta przed TU mają wcześniejszy hot-V. Kruche rury chłodzenia osobno (n63-coolant-pipes). Nie epidemia jak N47 — sprawdź zużycie oleju, płyn i wycieki w dolinie.",
    ru: "Wikipedia: N63TU 2012 добавил Valvetronic, новые маслосъёмные колпачки, турбины/топливо и второй насос ОЖ. До TU — ранняя hot-V. Хрупкие патрубки отдельно (n63-coolant-pipes). Не эпидемия как N47 — расход масла, ОЖ и течи в развале.",
  },
  severity: "expensive",
  pln_bands: null,
  pln_note: "Design-window only until dedicated valve-stem PLN job is quoted.",
  sources: [
    {
      label: "Wikipedia · BMW N63 — 2012 Technical Update (N63TU)",
      url: "https://en.wikipedia.org/wiki/BMW_N63",
    },
  ],
  autodoc_query: {
    en: "BMW N63 valve stem seals",
    pl: "BMW N63 uszczelniacze zaworów",
    ru: "BMW N63 маслосъёмные колпачки",
  },
  confidence: "wiki_tu_2012_window",
});

// N63 mid: after 2012 TU but before 2016 TÜ2 (still coolant pipe theme)
if (byId["n63-coolant-pipes"]) {
  const pipes = byId["n63-coolant-pipes"];
  upsert({
    ...pipes,
    chassis_slugs: [
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
    ],
    year_from: 2008,
    year_to: 2016,
    summary: {
      en: "N63 plastic coolant pipes in the turbo valley fail with age. Wikipedia documents 2012 and 2016 Technical Updates (valve stems, cooling, turbos) — pipe/brittle-plastic risk is strongest on earlier hot-V cars through the mid-2010s. Aluminum replacements are a common preventative quote.",
      pl: "Plastikowe rury chłodzenia N63 w dolinie turbo pękają z wiekiem. Wikipedia: TU 2012 i 2016 — ryzyko plastiku najmocniejsze na wcześniejszych hot-V do połowy lat 2010. Aluminiowa wymiana to częsta wycena profilaktyczna.",
      ru: "Пластиковые патрубки N63 в развале турбин трескаются с возрастом. Wikipedia: TU 2012 и 2016 — риск пластика сильнее на ранних hot-V до середины 2010-х.",
    },
    sources: [
      ...(pipes.sources || []),
      {
        label: "Wikipedia · BMW N63 — 2012 / 2016 Technical Updates",
        url: "https://en.wikipedia.org/wiki/BMW_N63",
      },
    ],
  });
}

upsert({
  id: "n63-post-tu2",
  engines: ["N63"],
  chassis_slugs: byId["n63-coolant-pipes"]?.chassis_slugs,
  year_from: 2017,
  year_to: 2030,
  title: {
    en: "N63 post-2016 TÜ2 residual hot-V wear",
    pl: "N63 po TÜ2 2016 — resztkowe zużycie hot-V",
    ru: "N63 после TÜ2 2016 — остаточный износ hot-V",
  },
  affects: {
    en: "N63 after 2016 Technical Update (TÜ2) — improved but not maintenance-free",
    pl: "N63 po TU 2016 (TÜ2) — lepszy, ale nie bezobsługowy",
    ru: "N63 после TU 2016 (TÜ2) — лучше, но не без обслуживания",
  },
  summary: {
    en: "Wikipedia: 2016 N63TÜ2 is a major update (twin-scroll turbos and more). Residual hot-V oil/coolant inspection still matters; catastrophic early-pipe epidemic prior is lower than 2008–2016. Budget for leaks and oil consumption checks.",
    pl: "Wikipedia: N63TÜ2 2016 to duża aktualizacja (m.in. twin-scroll). Nadal sprawdzaj olej/płyn w hot-V; priorytet katastrofy wczesnych rur niższy niż 2008–2016.",
    ru: "Wikipedia: N63TÜ2 2016 — крупное обновление. Всё равно проверяйте масло/ОЖ в hot-V; приоритет ранних патрубков ниже, чем 2008–2016.",
  },
  severity: "annoyance",
  pln_bands: null,
  sources: [
    {
      label: "Wikipedia · BMW N63 — 2016 Technical Update (N63TÜ2)",
      url: "https://en.wikipedia.org/wiki/BMW_N63",
    },
  ],
  autodoc_query: {
    en: "BMW N63 coolant pipe",
    pl: "BMW N63 rura chłodzenia",
    ru: "BMW N63 патрубок охлаждения",
  },
  confidence: "wiki_tu_2016_residual",
});

// —— N62 Valvetronic: production window + chassis map ——
if (byId["n62-valvetronic"]) {
  upsert({
    ...byId["n62-valvetronic"],
    year_from: 2001,
    year_to: 2010,
    chassis_slugs: ["e60", "e61", "e63", "e64", "e65", "e66", "e53", "e70"],
    year_policy: "all_n62_production",
    summary: {
      en: "N62 (2001–2010 per Wikipedia) pioneered Valvetronic on a V8. Eccentric-shaft / Valvetronic wear and plastic cooling parts are the typical themes across production years — no Watchdog-style single year epidemic sourced yet. Inspect cold idle and cooling.",
      pl: "N62 (2001–2010, Wikipedia) — Valvetronic na V8. Zużycie wałka mimośrodowego / Valvetronic i plastik chłodzenia typowe we wszystkich latach — brak jednego okna jak Watchdog. Sprawdź jałowy bieg i chłodzenie.",
      ru: "N62 (2001–2010, Wikipedia) — Valvetronic на V8. Износ эксцентрикового вала / Valvetronic и пластик охлаждения типичны во все годы.",
    },
    sources: [
      ...(byId["n62-valvetronic"].sources || []),
      { label: "Wikipedia · BMW N62 (production 2001–2010)", url: "https://en.wikipedia.org/wiki/BMW_N62" },
    ],
  });
}

// —— Swirl flaps M47/M57 ——
if (byId["swirl-flaps"]) {
  upsert({
    ...byId["swirl-flaps"],
    year_from: 1998,
    year_to: 2010,
    chassis_slugs: [
      "e46",
      "e46-compact",
      "e39",
      "e38",
      "e53",
      "e60",
      "e61",
      "e65",
      "e83",
      "e70",
      "e90",
      "e91",
      "e92",
      "e93",
      "e87",
      "e63",
      "e64",
    ],
    summary: {
      en: "Plastic swirl flaps in the intake on M47/M57 diesels can break and enter the engine. Risk is a known theme on these engines through the 2000s (production M57 to ~2013; flap failures most discussed on earlier plastic designs). Blanking / delete is a common independent fix — confirm flaps or blanks at inspection.",
      pl: "Plastikowe klapy wirowe w dolocie M47/M57 mogą pękać i wpaść do silnika. Temat lat 2000 (M57 do ~2013). Zaślepki to częsta naprawa niezależna — sprawdź klapy/zaślepki na oględzinach.",
      ru: "Пластиковые вихревые заслонки M47/M57 могут сломаться и попасть в мотор. Тема 2000-х (M57 до ~2013). Заглушки — частый независимый ремонт.",
    },
    sources: [
      ...(byId["swirl-flaps"].sources || []),
      { label: "Wikipedia · BMW M57 (production 1998–2013)", url: "https://en.wikipedia.org/wiki/BMW_M57" },
    ],
  });
}

// Late M57 without early flap epidemic prior (residual)
upsert({
  id: "swirl-flaps-late",
  engines: ["M57"],
  chassis_slugs: byId["swirl-flaps"]?.chassis_slugs,
  year_from: 2011,
  year_to: 2013,
  title: {
    en: "M57 intake / swirl residual (late years)",
    pl: "M57 dolot / klapy — lata późne",
    ru: "M57 впуск / заслонки — поздние годы",
  },
  affects: {
    en: "Late M57 ~2011–2013 — still check intake hardware",
    pl: "Późne M57 ~2011–2013 — nadal sprawdź dolot",
    ru: "Поздние M57 ~2011–2013 — всё равно проверьте впуск",
  },
  summary: {
    en: "Later M57 cars still deserve an intake inspection, but the classic early plastic swirl-flap failure story is less dominant than on 1998–2010 examples. Confirm blanks/flaps and smoke on boost leaks.",
    pl: "Późniejsze M57 nadal wymagają wglądu w dolot, ale klasyczna awaria wczesnych klap jest mniej dominująca niż w 1998–2010. Potwierdź zaślepki/klapy.",
    ru: "Поздние M57 всё равно требуют осмотра впуска; классика ранних заслонок менее доминирует, чем в 1998–2010.",
  },
  severity: "annoyance",
  pln_bands: byId["swirl-flaps"]?.pln_bands
    ? structuredClone(byId["swirl-flaps"].pln_bands)
    : null,
  sources: byId["swirl-flaps"]?.sources || [],
  autodoc_query: byId["swirl-flaps"]?.autodoc_query,
  confidence: "residual_late_m57",
});

// —— N52 water pump: production window ——
if (byId["water-pump"]) {
  upsert({
    ...byId["water-pump"],
    year_from: 2004,
    year_to: 2015,
    year_policy: "all_n52_n54_n55_in_window",
    chassis_slugs: [
      "e90",
      "e91",
      "e92",
      "e93",
      "e60",
      "e61",
      "e83",
      "e70",
      "e71",
      "e87",
      "e82",
      "e88",
      "e89-z4",
      "f10",
      "f25",
      "f30",
      "e85-z4",
    ],
    summary: {
      en: "Electric water pump is a design wear item on N52 (2004–2015), N54 and N55 — Wikipedia notes the N52 electric pump vs belt-driven M54. Failure can be sudden. Check cooling on every example; no single Watchdog year window sourced beyond the engine family lifetime.",
      pl: "Elektryczna pompa wody to element zużycia na N52 (2004–2015), N54 i N55 — Wikipedia: pompa elektryczna vs paskowa M54. Awaria bywa nagła. Brak jednego okna Watchdog poza żywotnością rodziny.",
      ru: "Электрическая помпа — износ на N52 (2004–2015), N54 и N55. Отказ бывает внезапным. Нет одного окна Watchdog вне срока семейства.",
    },
    sources: [
      ...(byId["water-pump"].sources || []),
      { label: "Wikipedia · BMW N52 (electric water pump)", url: "https://en.wikipedia.org/wiki/BMW_N52" },
    ],
  });
}

// —— N53 / N43 injectors: EU petrol DI window ——
if (byId["n53-injectors"]) {
  upsert({
    ...byId["n53-injectors"],
    year_from: 2007,
    year_to: 2013,
    chassis_slugs: ["e90", "e91", "e92", "e93", "e60", "e61", "e87", "e81", "e82", "e88"],
  });
}
if (byId["n43-injectors"]) {
  upsert({
    ...byId["n43-injectors"],
    year_from: 2007,
    year_to: 2011,
    chassis_slugs: ["e90", "e91", "e92", "e93", "e87", "e81", "e82", "e88"],
  });
}

// —— transfer case: document; keep chassis list ——
if (byId["transfer-case"]) {
  upsert({
    ...byId["transfer-case"],
    year_policy: "all_listed_xdrive_years",
    summary: {
      ...(typeof byId["transfer-case"].summary === "object"
        ? byId["transfer-case"].summary
        : {}),
      en:
        (byId["transfer-case"].summary?.en || "") +
        " Applies across listed xDrive chassis years until a sourced production-window split exists.",
      pl:
        (byId["transfer-case"].summary?.pl || "") +
        " Dotyczy wymienionych lat xDrive, dopóki nie ma źródłowego okna produkcji.",
      ru:
        (byId["transfer-case"].summary?.ru || "") +
        " На перечисленные годы xDrive, пока нет sourced окна производства.",
    },
  });
}

pains.id_aliases = {
  ...(pains.id_aliases || {}),
  "n63-early": "n63-pre-tu",
  "m57-swirl-late": "swirl-flaps-late",
};

pains.collected_at = NOW;
pains.meta = {
  ...(pains.meta || {}),
  phase_f1c_note:
    "N63 pre-TU / coolant / post-TÜ2; N62+swirl chassis maps; N52/N43/N53 year bounds",
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
log.runs.push({ id: "phase-f1c-n52-n62-n63-m57", at: NOW });
fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");

console.log("F1c applied");
