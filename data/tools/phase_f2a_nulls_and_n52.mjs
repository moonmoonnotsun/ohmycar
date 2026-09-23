#!/usr/bin/env node
/**
 * Phase F2a — null-score chassis maps + N52 multi-pain pack + B47 AdBlue.
 * Sources: NHTSA 17V-683 / 22V-119 / 23V-707 / SB-10076476; Wikipedia N52;
 * Turner / AmpAuto (valve cover + OFH); Bimmer.AI / Bimmer Garage (AdBlue).
 * No invented PLN — free recalls [0,0]; OFH/valve-cover reuse family priors.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const painPath = path.join(ROOT, "data/warehouse/pains/top10_sourced_pains.json");
const NOW = "2026-09-23T19:00:00Z";

const pains = JSON.parse(fs.readFileSync(painPath, "utf8"));
const byId = Object.fromEntries(pains.rows.map((r) => [r.id, r]));

function upsert(row) {
  const i = pains.rows.findIndex((r) => r.id === row.id);
  if (i >= 0) pains.rows[i] = { ...pains.rows[i], ...row };
  else pains.rows.push(row);
  byId[row.id] = pains.rows.find((r) => r.id === row.id);
}

function mergeChassis(id, extra) {
  const cur = byId[id];
  if (!cur) return;
  upsert({
    ...cur,
    chassis_slugs: [...new Set([...(cur.chassis_slugs || []), ...extra])],
  });
}

const FREE = {
  parts: [0, 0],
  labor: [0, 0],
  independent: [0, 0],
  specialist: [0, 0],
  aso: [0, 0],
  note: "Parts + labor. Campaign free when VIN open",
};

const N52_CHASSIS = [
  "e90",
  "e91",
  "e92",
  "e93",
  "e60",
  "e61",
  "e63",
  "e64",
  "e65",
  "e66",
  "e70",
  "e83",
  "e84",
  "e87",
  "e81",
  "e82",
  "e88",
  "e85-z4",
  "e86-z4",
  "e89-z4",
  "f10",
  "f11",
  "f25",
  "f01",
  "f07",
];

const B47_CHASSIS = [
  "f20",
  "f21",
  "f22",
  "f23",
  "f30",
  "f31",
  "f32",
  "f33",
  "f34",
  "f36",
  "f10",
  "f11",
  "f48",
  "f39",
  "f25",
  "f26",
  "f40",
  "f45",
  "f44",
  "f46",
  "g20",
  "g21",
  "g22",
  "g23",
  "g26",
  "g30",
  "g31",
  "g01",
  "g02",
  "u11",
];

// —— 1. Null-score map fixes ——
mergeChassis("b58-oil-filter", [
  "g21",
  "g22",
  "g23",
  "g26",
  "g31",
  "g06",
  "g07",
  "g29",
  "f32",
  "f36",
  "f90",
]);
mergeChassis("water-pump", ["e63", "e64", "e65", "e66", "e84", "f01"]);

if (byId["s55-rod-bearings"]) {
  upsert({
    ...byId["s55-rod-bearings"],
    year_from: 2014,
    year_to: 2021,
    summary: {
      en: "S55 rod-bearing wear theme on F80/F82/F87 M2/M3/M4 through end of F87 Competition (~2021). Confirm oil analysis / bearing service history. PLN from specialist preventative quotes.",
      pl: "Zużycie panewek S55 na F80/F82/F87 do końca F87 Competition (~2021). Sprawdź historię / analizę oleju.",
      ru: "Износ вкладышей S55 на F80/F82/F87 до конца F87 Competition (~2021).",
    },
  });
}

if (byId["e39-cooling"]) {
  upsert({
    ...byId["e39-cooling"],
    year_from: 1994,
    year_to: 2004,
  });
}

// —— 2. N52 OFH via shared OFH pain ——
if (byId["n20-oil-filter"]) {
  upsert({
    ...byId["n20-oil-filter"],
    engines: [...new Set([...(byId["n20-oil-filter"].engines || []), "N52"])],
    title: {
      en: "N20 / N52 / N55 / B48 / B38 — oil-filter housing gasket (all years)",
      pl: "N20 / N52 / N55 / B48 / B38 — uszczelka obudowy filtra oleju (wszystkie lata)",
      ru: "N20 / N52 / N55 / B48 / B38 — прокладка корпуса масляного фильтра (все годы)",
    },
    summary: {
      en: "Plastic OFH gasket leak is a documented ownership theme on N20/N52/N55/B48/B38 across production years (AmpAuto N52 leak trio; Skanyx OFHG family). Inspect oil on the accessory belt / undertray.",
      pl: "Wyciek uszczelki OFH — znany temat na N20/N52/N55/B48/B38 (AmpAuto N52; rodzina Skanyx OFHG). Szukaj oleju na pasku.",
      ru: "Течь OFH — известная тема на N20/N52/N55/B48/B38. Масло на ремне.",
    },
    sources: [
      ...(byId["n20-oil-filter"].sources || []),
      {
        label: "AmpAuto · N52 problems (valve cover / water pump / OFHG trio)",
        url: "https://www.ampauto.io/symptoms/bmw-n52-problems",
      },
    ],
  });
}

// —— 3. N52 PCV blow-by heater (safety recalls) ——
upsert({
  id: "n52-pcv-heater",
  engines: ["N52", "N51"],
  chassis_slugs: N52_CHASSIS,
  year_from: 2006,
  year_to: 2013,
  title: {
    en: "N52/N51 PCV blow-by heater (fire recall)",
    pl: "N52/N51 grzałka PCV blow-by (recall pożarowy)",
    ru: "N52/N51 нагреватель PCV blow-by (пожарный отзыв)",
  },
  affects: {
    en: "N51/N52/N52K (and related) MY ~2006–2013 — confirm VIN open/closed",
    pl: "N51/N52/N52K MY ~2006–2013 — potwierdź VIN",
    ru: "N51/N52/N52K MY ~2006–2013 — проверьте VIN",
  },
  summary: {
    en: "NHTSA 17V-683 (MY 2007–2011) and expansion 22V-119 (MY 2006–2013, production into Oct 2013): PCV valve heater (“blow-by heater”) can short and, in rare cases, increase fire risk. Free dealer remedy when VIN open. Wikipedia N52 lists the 2017 six-cylinder PCV heater campaign. Check status before buy — not a water-pump story.",
    pl: "NHTSA 17V-683 (MY 2007–2011) i rozszerzenie 22V-119 (MY 2006–2013): grzałka PCV może zwarciem podnieść ryzyko pożaru. Darmowa naprawa przy otwartym VIN. Wikipedia N52. Sprawdź status przed zakupem.",
    ru: "NHTSA 17V-683 / 22V-119: нагреватель PCV — риск пожара. Бесплатный ремонт при открытом VIN.",
  },
  severity: "safety",
  pln_bands: FREE,
  sources: [
    {
      label: "NHTSA · 17V-683 PCV blow-by heater (MY 2007–2011 N51/N52)",
      url: "https://static.nhtsa.gov/odi/rcl/2017/RCMN-17V683-7659.pdf",
    },
    {
      label: "NHTSA · 22V-119 PCV heater expansion (MY 2006–2013)",
      url: "https://static.nhtsa.gov/odi/rcl/2022/RCRIT-22V119-1582.pdf",
    },
    {
      label: "Wikipedia · BMW N52 (PCV heater fire recalls)",
      url: "https://en.wikipedia.org/wiki/BMW_N52",
    },
  ],
  autodoc_query: {
    en: "BMW N52 PCV heater",
    pl: "BMW N52 grzałka PCV",
    ru: "BMW N52 нагреватель PCV",
  },
});

// —— 4. VANOS adjuster bolts (N52 + N55) ——
upsert({
  id: "n52-vanos-bolts",
  engines: ["N52", "N51", "N55"],
  chassis_slugs: [
    ...N52_CHASSIS,
    "f30",
    "f31",
    "f32",
    "f33",
    "f34",
    "f10",
    "f25",
    "f15",
    "f16",
    "f22",
    "f87",
  ],
  year_from: 2010,
  year_to: 2013,
  title: {
    en: "VANOS adjuster bolts (23V-707)",
    pl: "Śruby VANOS (23V-707)",
    ru: "Болты VANOS (23V-707)",
  },
  affects: {
    en: "MY 2010–2013 inline-6 (N51/N52K/N52T/N55 class) — VIN check",
    pl: "MY 2010–2013 R6 (N51/N52/N55) — sprawdź VIN",
    ru: "MY 2010–2013 R6 (N51/N52/N55) — VIN",
  },
  summary: {
    en: "NHTSA 23V-707: VANOS assembly bolts can loosen/break on certain MY 2010–2013 inline-six BMWs (production ~2009-09 to 2012-07). May cause reduced power, no-restart, or rare stall. Free campaign when VIN open. Distinct from general VANOS solenoid wear.",
    pl: "NHTSA 23V-707: śruby VANOS mogą się poluzować/złamać (MY 2010–2013). Spadek mocy / brak rozruchu / rzadko zgaśnięcie. Kampania darmowa przy otwartym VIN.",
    ru: "NHTSA 23V-707: болты VANOS могут ослабнуть/сломаться (MY 2010–2013). Бесплатная кампания при открытом VIN.",
  },
  severity: "safety",
  pln_bands: FREE,
  sources: [
    {
      label: "NHTSA · 23V-707 VANOS adjuster bolts (MY 2010–2013)",
      url: "https://static.nhtsa.gov/odi/rcl/2023/RCRIT-23V707-5068.pdf",
    },
    {
      label: "Wikipedia · BMW N52 (2023 VANOS bolt recall note)",
      url: "https://en.wikipedia.org/wiki/BMW_N52",
    },
  ],
  autodoc_query: {
    en: "BMW VANOS bolts N52 N55",
    pl: "BMW śruby VANOS N52 N55",
    ru: "BMW болты VANOS N52 N55",
  },
});

// —— 5. Eccentric shaft sensor ——
upsert({
  id: "n52-eccentric-shaft",
  engines: ["N52", "N51"],
  chassis_slugs: N52_CHASSIS,
  year_from: 2004,
  year_to: 2015,
  title: {
    en: "Valvetronic eccentric shaft sensor / seal",
    pl: "Czujnik / uszczelka wałka mimośrodowego Valvetronic",
    ru: "Датчик / сальник эксцентрикового вала Valvetronic",
  },
  affects: {
    en: "N52/N51 Valvetronic — oil in connector ruins sensor",
    pl: "N52/N51 Valvetronic — olej w złączu niszczy czujnik",
    ru: "N52/N51 Valvetronic — масло в разъёме убивает датчик",
  },
  summary: {
    en: "NHTSA diagnostic SI for N51/N52/N52K/N52T: eccentric-shaft (Valvetronic) sensor faults often follow oil contamination at the sensor gasket/connector — inspect before replacing harness/DME. Ownership guides list this as a recurring N52 cost. Not the same as the VANOS bolt campaign.",
    pl: "NHTSA SI: błędy czujnika wałka mimośrodowego często po oleju w złączu — sprawdź uszczelkę przed wymianą wiązki/DME. Osobno od kampanii śrub VANOS.",
    ru: "NHTSA SI: ошибки датчика эксцентрика часто из‑за масла в разъёме. Отдельно от кампании болтов VANOS.",
  },
  severity: "expensive",
  pln_bands: {
    parts: [400, 1200],
    labor: [300, 900],
    independent: [700, 2100],
    specialist: [900, 2800],
    aso: [1200, 3500],
    note: "Family prior: OEM sensor + gasket/labor band (AmpAuto est. band converted loosely; refine with Autodoc)",
  },
  sources: [
    {
      label: "NHTSA · SI eccentric shaft sensor oil contamination (N51/N52)",
      url: "https://static.nhtsa.gov/odi/tsbs/2016/SB-10076476-5448.pdf",
    },
    {
      label: "AmpAuto · N52 eccentric shaft sensor",
      url: "https://www.ampauto.io/symptoms/bmw-n52-problems",
    },
    {
      label: "Wikipedia · BMW N52 (Valvetronic)",
      url: "https://en.wikipedia.org/wiki/BMW_N52",
    },
  ],
  autodoc_query: {
    en: "BMW N52 eccentric shaft sensor",
    pl: "BMW N52 czujnik wałka mimośrodowego",
    ru: "BMW N52 датчик эксцентрикового вала",
  },
});

// —— 6. Valve cover (plastic from MY2007 note; leak theme all years) ——
upsert({
  id: "n52-valve-cover",
  engines: ["N52", "N51"],
  chassis_slugs: N52_CHASSIS,
  year_from: 2004,
  year_to: 2015,
  title: {
    en: "N52 valve cover gasket / plastic cover + PCV",
    pl: "N52 pokrywa zaworów / plastik + PCV",
    ru: "N52 крышка клапанов / пластик + PCV",
  },
  affects: {
    en: "All N52 years; plastic cover crack theme stronger from MY ~2007 (Turner)",
    pl: "Wszystkie lata N52; plastik mocniej od MY ~2007 (Turner)",
    ru: "Все годы N52; пластик сильнее с MY ~2007 (Turner)",
  },
  summary: {
    en: "Valve-cover gasket leaks (oil smell / plug-well oil) are a core N52 ownership theme. Turner Motorsport documents the MY 2007 switch to a plastic cover that can crack and integrates non-serviceable PCV — often replaced as an assembly. Distinct from the PCV heater fire recall (wiring/heater). PLN: gasket-only vs full cover.",
    pl: "Wycieki pokrywy zaworów to rdzeń N52. Turner: od MY 2007 plastikowa pokrywa z PCV — często cała pokrywa. Osobno od recall grzałki PCV. PLN: sama uszczelka vs cała pokrywa.",
    ru: "Течи крышки клапанов — тема N52. Turner: с MY 2007 пластик с PCV. Отдельно от отзыва нагревателя PCV.",
  },
  severity: "expensive",
  pln_bands: {
    parts: [200, 1800],
    labor: [500, 1200],
    independent: [700, 2800],
    specialist: [900, 3500],
    aso: [1200, 4500],
    note: "PL gasket job ~300–1200 (automotoopinie premium band) up to full plastic cover assembly",
  },
  sources: [
    {
      label: "Turner Motorsport · N52 plastic valve cover (MY 2007+)",
      url: "https://www.turnermotorsport.com/p-395319-valve-cover/",
    },
    {
      label: "AmpAuto · N52 valve cover gasket",
      url: "https://www.ampauto.io/symptoms/bmw-n52-problems",
    },
    {
      label: "PLN · automotoopinie · valve cover gasket job band",
      url: "https://automotoopinie.pl/wymiana-uszczelki-pokrywy-zaworow-koszt/",
    },
    {
      label: "PL parts · grelkam N52 valve cover gasket set",
      url: "https://grelkam.pl/uszczelki/3743-zestaw-uszczelek-pokrywy-glowicy-bmw-e60-e61-e63-e64-e65-n52n.html",
    },
  ],
  autodoc_query: {
    en: "BMW N52 valve cover",
    pl: "BMW N52 pokrywa zaworów",
    ru: "BMW N52 крышка клапанов",
  },
});

// —— 7. B47/B57 AdBlue / SCR ——
upsert({
  id: "b47-adblue-scr",
  engines: ["B47", "B57"],
  chassis_slugs: [...B47_CHASSIS, "g05", "g07", "g11", "g30", "f15", "f16"],
  year_from: 2015,
  year_to: 2030,
  title: {
    en: "B47/B57 AdBlue / SCR / NOx sensors",
    pl: "B47/B57 AdBlue / SCR / czujniki NOx",
    ru: "B47/B57 AdBlue / SCR / датчики NOx",
  },
  affects: {
    en: "Euro 6 diesels with SCR (~2015+) — countdown / no-start risk",
    pl: "Diesle Euro 6 ze SCR (~2015+) — odliczanie / ryzyko braku startu",
    ru: "Дизели Euro 6 со SCR (~2015+) — отсчёт / риск не запуска",
  },
  summary: {
    en: "Specialist guides (Bimmer Garage / Bimmer.AI) list AdBlue quality faults, NOx sensors, dosing pump/heater and start-lock countdowns as common B47 (and modular B57) costs after Euro 6 SCR. This is separate from EGR cooler fire campaigns — confirm AdBlue warnings on every late diesel. PLN band from UK specialist ranges converted at ~5.2 PLN/£ as family prior until PL Autodoc quotes.",
    pl: "Przewodniki (Bimmer Garage / Bimmer.AI): AdBlue, NOx, pompa/grzałka i odliczanie blokady startu na B47/B57 po Euro 6 SCR. Osobno od kampanii chłodnicy EGR. Pasmo PLN z wycen UK (prior) do wycen Autodoc PL.",
    ru: "AdBlue/NOx/насос SCR на B47/B57 после Euro 6 — отдельно от кампаний EGR.",
  },
  severity: "expensive",
  pln_bands: {
    parts: [800, 3500],
    labor: [400, 1500],
    independent: [1500, 5500],
    specialist: [2000, 7000],
    aso: [2800, 9000],
    note: "Prior from Bimmer.AI UK £300–£1200 typical sensor/pump jobs → ~1500–6200 PLN @5.2; widen for ASO",
  },
  sources: [
    {
      label: "Bimmer.AI · B47 AdBlue / SCR buyer notes",
      url: "https://bimmer.ai/bmw-engines/b47/",
    },
    {
      label: "Bimmer Garage · B47 AdBlue and NOx sensor faults",
      url: "https://www.bimmergarage.co.uk/bmw-b47-common-issues/",
    },
    {
      label: "Wikipedia · BMW B47 (Euro 6 successor to N47)",
      url: "https://en.wikipedia.org/wiki/BMW_B47",
    },
  ],
  autodoc_query: {
    en: "BMW B47 AdBlue NOx sensor",
    pl: "BMW B47 AdBlue czujnik NOx",
    ru: "BMW B47 AdBlue датчик NOx",
  },
});

// Expand b47-egr chassis + honesty note on UK vs US recall scope
if (byId["b47-egr"]) {
  upsert({
    ...byId["b47-egr"],
    chassis_slugs: [...new Set([...(byId["b47-egr"].chassis_slugs || []), ...B47_CHASSIS])],
    summary: {
      en: "B47 (from 2014, Wikipedia) — EGR cooler / intake carbon are the typical high-mileage costs. UK diesel EGR cooler campaigns (Which?/DVSA 2018+) overlap many 20d badges in 2014–2017; confirm VIN. Do not assume every B47 is inside US NHTSA 18V-755 (that PDF scopes N47/N57). AdBlue/SCR is a separate pain on Euro 6 cars.",
      pl: "B47 (od 2014) — EGR/nagar. Kampanie UK EGR (Which?/DVSA) nachodzą na wiele 20d 2014–2017 — sprawdź VIN. US 18V-755 w PDF to N47/N57. AdBlue osobno na Euro 6.",
      ru: "B47 (с 2014) — EGR/нагар. UK-кампании EGR — проверяйте VIN. US 18V-755 в PDF — N47/N57. AdBlue отдельно.",
    },
    sources: [
      ...(byId["b47-egr"].sources || []),
      {
        label: "Which? · UK BMW diesel EGR cooler recall extension",
        url: "https://www.which.co.uk/news/article/bmw-extends-uk-recall-over-fire-risk-aavZB2R92Thr",
      },
    ],
  });
}

pains.collected_at = NOW;
pains.meta = {
  ...(pains.meta || {}),
  phase_f2a_note:
    "Null chassis maps (B58 G22/G26, E63 water-pump, S55→2021, E38 cooling→1994); N52 PCV/VANOS/valve-cover/eccentric/OFH; B47 AdBlue",
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
log.runs.push({ id: "phase-f2a-nulls-n52-b47", at: NOW });
fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");

console.log("F2a applied");
