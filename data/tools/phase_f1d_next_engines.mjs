#!/usr/bin/env node
/**
 * Phase F1d — N13/N42/N46 timing, M54/classic cooling bounds, Takata/i3 years,
 * B57 headline fix. Document all-years where no sourced epidemic window exists.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const painPath = path.join(ROOT, "data/warehouse/pains/top10_sourced_pains.json");
const volPath = path.join(ROOT, "src/data/volume.ts");
const NOW = "2026-09-23T17:15:00Z";

const pains = JSON.parse(fs.readFileSync(painPath, "utf8"));
const byId = Object.fromEntries(pains.rows.map((r) => [r.id, r]));

function upsert(row) {
  const i = pains.rows.findIndex((r) => r.id === row.id);
  if (i >= 0) pains.rows[i] = { ...pains.rows[i], ...row };
  else pains.rows.push(row);
  byId[row.id] = pains.rows.find((r) => r.id === row.id);
}

// —— N13 (Prince / F20 116i–125i era) ——
if (byId["n13-timing"]) {
  upsert({
    ...byId["n13-timing"],
    year_from: 2011,
    year_to: 2016,
    chassis_slugs: ["f20", "f21", "f22", "f23", "f45", "f46", "mini"],
    summary: {
      en: "BMW N13 1.6 turbo (Prince family, ~2011–2016 in F20/F2x). Timing chain, HPFP and intake carbon show up together at higher mileage — not a “cheap 116i”. Confirm cold-start rattle and service history. Production window from BMW Prince/N13 fitment years.",
      pl: "BMW N13 1.6 turbo (rodzina Prince, ~2011–2016 w F20/F2x). Łańcuch, HPFP i nagar wychodzą razem przy wyższym przebiegu — to nie „tani 116i”. Sprawdź stuk na zimno i historię.",
      ru: "BMW N13 1.6 turbo (Prince, ~2011–2016 в F20/F2x). Цепь, ТНВД и нагар выходят вместе на пробеге — это не «дешёвый 116i».",
    },
    sources: [
      ...(byId["n13-timing"].sources || []),
      { label: "Wikipedia · Prince engine / N13 family", url: "https://en.wikipedia.org/wiki/Prince_engine" },
    ],
  });
}

// —— N42/N46 timing guides ——
if (byId["timing-guides"]) {
  upsert({
    ...byId["timing-guides"],
    year_from: 2001,
    year_to: 2011,
    chassis_slugs: ["e46", "e46-compact", "e87", "e81", "e82", "e88", "e90", "e91", "e92", "e93", "e83", "e85-z4", "e89-z4"],
    title: {
      en: "N42/N46 timing chain guides (main window)",
      pl: "Prowadnice łańcucha N42/N46 (główne okno)",
      ru: "Направляющие цепи N42/N46 (основное окно)",
    },
    summary: {
      en: "N42/N46 four-cylinder petrol (N46 produced ~2004–2015 per Wikipedia; continued in high-sulfur markets after N43). Chain guide wear is the known theme — rattle at start, not an N52/HPFP story. Bound here to the densest ownership window ~2001–2011; later N46 still inspect for noise.",
      pl: "N42/N46 (N46 ~2004–2015, Wikipedia; dalej w rynkach high-sulfur po N43). Zużycie prowadnic łańcucha — stuk na starcie, nie N52/HPFP. Główne okno ~2001–2011; późniejsze N46 też słuchaj.",
      ru: "N42/N46 (N46 ~2004–2015). Износ направляющих цепи — стук на запуске. Основное окно ~2001–2011.",
    },
    sources: [
      ...(byId["timing-guides"].sources || []),
      { label: "Wikipedia · BMW N46 (production 2004–2015)", url: "https://en.wikipedia.org/wiki/BMW_N46" },
    ],
  });
}

upsert({
  id: "timing-guides-late",
  engines: ["N46"],
  chassis_slugs: byId["timing-guides"]?.chassis_slugs,
  year_from: 2012,
  year_to: 2015,
  title: {
    en: "N46 timing guides — late production residual",
    pl: "Prowadnice N46 — późna produkcja (resztkowe)",
    ru: "Направляющие N46 — поздняя продукция",
  },
  affects: {
    en: "Late N46 ~2012–2015 (markets without N43)",
    pl: "Późne N46 ~2012–2015 (rynki bez N43)",
    ru: "Поздние N46 ~2012–2015 (рынки без N43)",
  },
  summary: {
    en: "Later N46 cars (where N43 was not sold) still use a timing-chain four-cylinder. Guide wear is less discussed than early E9x years but cold-start noise should still be checked.",
    pl: "Późniejsze N46 (gdzie nie było N43) nadal mają łańcuch. Prowadnice rzadziej w dyskusji niż wczesne E9x, ale stuk na zimno nadal sprawdź.",
    ru: "Поздние N46 (где не было N43) всё ещё с цепью. Стук на холодную всё равно слушайте.",
  },
  severity: "expensive",
  pln_bands: byId["timing-guides"]?.pln_bands
    ? structuredClone(byId["timing-guides"].pln_bands)
    : null,
  sources: byId["timing-guides"]?.sources || [],
  autodoc_query: byId["timing-guides"]?.autodoc_query,
  confidence: "n46_late_residual",
});

// —— M54 DISA / cooling ——
if (byId["m54-disa"]) {
  upsert({
    ...byId["m54-disa"],
    year_from: 2000,
    year_to: 2006,
    chassis_slugs: ["e46", "e46-compact", "e39", "e53", "e60", "e83", "e85-z4", "e86-z4"],
    summary: {
      en: "M54 (2000–2006 per Wikipedia) DISA intake flap shaft wears; the valve can break into the intake. Cold-start rattle is typical. Applies across M54 production years.",
      pl: "M54 (2000–2006, Wikipedia) — wałek DISA się zużywa; klapa może wpaść do dolotu. Typowy stuk na zimno. Cała produkcja M54.",
      ru: "M54 (2000–2006) — вал DISA изнашивается. На всю продукцию M54.",
    },
    sources: [
      ...(byId["m54-disa"].sources || []),
      { label: "Wikipedia · BMW M54 (production 2000–2006)", url: "https://en.wikipedia.org/wiki/BMW_M54" },
    ],
  });
}
if (byId["m54-cooling"]) {
  upsert({
    ...byId["m54-cooling"],
    year_from: 1998,
    year_to: 2006,
    year_policy: "m52_m54_cooling_plastics",
    summary: {
      en: "Radiator, expansion tank and thermostat housings go brittle on M52/M54-era cars (late 1990s–2006). Overheating can damage the head. Age/wear across the generation — not a single Watchdog year.",
      pl: "Chłodnica, zbiornik i obudowy termostatu kruszeją na M52/M54 (koniec lat 90.–2006). Przegrzanie grozi głowicy. Zużycie generacji — nie jedno okno Watchdog.",
      ru: "Радиатор, бачок и корпуса термостата на M52/M54 (конец 90-х–2006). Перегрев опасен для ГБЦ.",
    },
  });
}

// —— Classic / E36 cooling: generation windows ——
if (byId["classic-cooling"]) {
  upsert({
    ...byId["classic-cooling"],
    year_from: 1968,
    year_to: 1995,
    year_policy: "all_classic_production_years",
    summary: {
      en: "Age cooling failures (pump, radiator, hoses) are the routine bill on M10/M20/M30/S14/S38 classics across their production years. No sourced single-year epidemic — treat every year as cooling-inspect-first. S38 pump OEM/rebuild quotes anchor PLN where quoted.",
      pl: "Awaria chłodzenia (pompa, chłodnica, węże) to typowy rachunek klasyków M10/M20/M30/S14/S38 we wszystkich latach produkcji. Brak jednego okna epidemii — każdy rocznik = najpierw chłodzenie.",
      ru: "Отказы охлаждения — типичный счёт на классике M10/M20/M30/S14/S38 во все годы производства.",
    },
  });
}
if (byId["e36-cooling"]) {
  upsert({
    ...byId["e36-cooling"],
    year_from: 1990,
    year_to: 2000,
    chassis_slugs: ["e36", "e36-compact", "e36-m3", "e34", "e34-m5", "z3", "z3-m-coupe"],
    year_policy: "e36_generation_cooling",
    summary: {
      en: "Aged plastics and early plastic-impeller water pumps are the classic E36-era cooling failure mode (roughly 1990–2000 fitment). A full cooling refresh is routine when history is unknown — same theme across the generation, not a 1992-vs-1998 Watchdog split.",
      pl: "Starzejący się plastik i wczesne pompy z plastikowym wirnikiem — klasyczna awaria chłodzenia ery E36 (~1990–2000). Pełne odświeżenie chłodzenia to norma przy nieznanej historii.",
      ru: "Стареющий пластик и ранние помпы — классика охлаждения эры E36 (~1990–2000).",
    },
  });
}
if (byId["e39-cooling"]) {
  upsert({
    ...byId["e39-cooling"],
    year_from: 1995,
    year_to: 2004,
    chassis_slugs: ["e39", "e39-m5", "e38", "e53"],
  });
}

// —— Takata PL: bound to common campaign model years ——
if (byId["takata-airbag-pl"]) {
  upsert({
    ...byId["takata-airbag-pl"],
    year_from: 2000,
    year_to: 2019,
    summary: {
      en: "Official PL UOKiK recall campaigns for driver airbag inflators on listed chassis. Typical open VIN windows span ~2000s–2010s model years — confirm with BMW Poland VIN checker. Repair is free when the campaign is open. Bound 2000–2019 so it does not headline unrelated modern years without a VIN hit.",
      pl: "Oficjalne kampanie UOKiK poduszek Takata na wymienionych podwoziach. Typowe okna VIN to lata ~2000–2010. — potwierdź VIN BMW PL. Naprawa gratis gdy kampania otwarta. Granica 2000–2019, żeby nie nagłówkować nowszych lat bez VIN.",
      ru: "Кампании UOKiK Takata на перечисленных шасси. Типичные окна VIN ~2000–2010-е — подтвердите VIN BMW PL. Граница 2000–2019.",
    },
  });
}

// —— i3 / B38 HV ——
if (byId["i3-hv-battery"]) {
  upsert({
    ...byId["i3-hv-battery"],
    year_from: 2013,
    year_to: 2026,
    year_policy: "ev_pack_all_listed_years",
    summary: {
      en: "HV pack cost dominates i3/i4/i8 (and some B38 hybrid) ownership from launch (~2013+) through current years. PL regen quotes from ~6.500 zł; OEM/upgrade packs are five-figure PLN. No sourced year where pack risk disappears — inspect SOH / warranty on every example.",
      pl: "Koszt paczki HV dominuje i3/i4/i8 (i części B38) od startu (~2013+) do dziś. Regen PL od ~6.500 zł; paczki OEM to pięciocyfrowe PLN. Brak roku bez ryzyka paczki — sprawdzaj SOH/gwarancję.",
      ru: "Стоимость HV-пакета доминирует i3/i4/i8 с ~2013+. Нет года без риска пакета — проверяйте SOH/гарантию.",
    },
  });
}

// —— subframe / elv: E9x generation ——
if (byId["subframe-rust"]) {
  upsert({
    ...byId["subframe-rust"],
    year_from: 2005,
    year_to: 2013,
  });
}
if (byId["elv-cas"]) {
  upsert({
    ...byId["elv-cas"],
    year_from: 2004,
    year_to: 2013,
    chassis_slugs: byId["elv-cas"].chassis_slugs || ["e90", "e91", "e92", "e93", "e87", "e60", "e70"],
  });
}

pains.id_aliases = {
  ...(pains.id_aliases || {}),
  "n46-timing-late": "timing-guides-late",
};

pains.collected_at = NOW;
pains.meta = {
  ...(pains.meta || {}),
  phase_f1d_note:
    "N13/N46 timing windows; M54/classic/E36 cooling bounds; Takata/i3/subframe/ELV years; B57 topPain fix in volume",
};

fs.writeFileSync(painPath, JSON.stringify(pains, null, 2) + "\n");
fs.copyFileSync(painPath, path.join(ROOT, "src/data/imported/pains.json"));

// B57 lines wrongly headlined with transfer-case → b57-egr
let vol = fs.readFileSync(volPath, "utf8");
const before = (vol.match(/engine:\s*"B57"[\s\S]{0,120}?topPainId:\s*"transfer-case"/g) || []).length;
vol = vol.replace(
  /engine:\s*"B57"([\s\S]{0,120}?)topPainId:\s*"transfer-case"/g,
  'engine: "B57"$1topPainId: "b57-egr"',
);
fs.writeFileSync(volPath, vol);
console.log("B57 transfer→b57-egr replacements:", before);

const logPath = path.join(ROOT, "data/warehouse/_meta/collection_log.json");
let log = { runs: [] };
try {
  log = JSON.parse(fs.readFileSync(logPath, "utf8"));
} catch {
  /* empty */
}
if (!Array.isArray(log.runs)) log.runs = [];
log.runs.push({ id: "phase-f1d-n13-n46-classic-takata", at: NOW });
fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");

console.log("F1d applied");
