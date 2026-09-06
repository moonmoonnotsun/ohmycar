import type { EngineLine, Pain, ScoreInputs } from "./types";

function fillYears(
  years: number[],
  start: ScoreInputs,
  end: ScoreInputs,
): Record<number, ScoreInputs> {
  if (years.length === 1) return { [years[0]]: start };
  const last = years.length - 1;
  const out: Record<number, ScoreInputs> = {};
  for (let i = 0; i < years.length; i++) {
    const t = i / last;
    out[years[i]] = {
      catastrophe: lerp(start.catastrophe, end.catastrophe, t),
      expectedFix5yPln: lerp(start.expectedFix5yPln, end.expectedFix5yPln, t),
      painLoad: lerp(start.painLoad, end.painLoad, t),
      campaigns: lerp(start.campaigns, end.campaigns, t),
      partsReality: lerp(start.partsReality, end.partsReality, t),
    };
  }
  return out;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function buy(years: number[], start: number, end: number): Record<number, number> {
  const out: Record<number, number> = {};
  const last = Math.max(years.length - 1, 1);
  for (let i = 0; i < years.length; i++) {
    out[years[i]] = Math.round(lerp(start, end, i / last) / 500) * 500;
  }
  return out;
}

const n52: ScoreInputs = {
  catastrophe: 0.12,
  expectedFix5yPln: 3200,
  painLoad: 0.22,
  campaigns: 0.09,
  partsReality: 0.9,
};

const n47Early: ScoreInputs = {
  catastrophe: 0.98,
  expectedFix5yPln: 16000,
  painLoad: 0.72,
  campaigns: 0.35,
  partsReality: 0.88,
};

const n47Late: ScoreInputs = {
  catastrophe: 0.92,
  expectedFix5yPln: 14000,
  painLoad: 0.65,
  campaigns: 0.2,
  partsReality: 0.9,
};

export const e90Engines: EngineLine[] = [
  {
    model: "318i",
    engine: "N46",
    fuel: "petrol",
    years: [2005, 2006, 2007],
    topPainId: "timing-guides",
    medianBuyPlnByYear: buy([2005, 2006, 2007], 14000, 16500),
    repairPln: [1500, 4000],
    inputsByYear: fillYears(
      [2005, 2006, 2007],
      { catastrophe: 0.18, expectedFix5yPln: 4500, painLoad: 0.35, campaigns: 0.08, partsReality: 0.86 },
      { catastrophe: 0.2, expectedFix5yPln: 4800, painLoad: 0.38, campaigns: 0.08, partsReality: 0.84 },
    ),
  },
  {
    model: "318i",
    engine: "N43",
    fuel: "petrol",
    years: [2007, 2008, 2009, 2010, 2011],
    topPainId: "n43-injectors",
    medianBuyPlnByYear: buy([2007, 2008, 2009, 2010, 2011], 16000, 19500),
    repairPln: [4000, 9000],
    inputsByYear: fillYears(
      [2007, 2008, 2009, 2010, 2011],
      { catastrophe: 0.42, expectedFix5yPln: 9000, painLoad: 0.55, campaigns: 0.18, partsReality: 0.72 },
      { catastrophe: 0.38, expectedFix5yPln: 8200, painLoad: 0.5, campaigns: 0.14, partsReality: 0.75 },
    ),
  },
  {
    model: "320i",
    engine: "N46",
    fuel: "petrol",
    years: [2005, 2006, 2007],
    topPainId: "timing-guides",
    medianBuyPlnByYear: buy([2005, 2006, 2007], 15000, 17500),
    repairPln: [1500, 4000],
    inputsByYear: fillYears(
      [2005, 2006, 2007],
      { catastrophe: 0.18, expectedFix5yPln: 4500, painLoad: 0.34, campaigns: 0.08, partsReality: 0.86 },
      { catastrophe: 0.19, expectedFix5yPln: 4700, painLoad: 0.36, campaigns: 0.08, partsReality: 0.85 },
    ),
  },
  {
    model: "320i",
    engine: "N43",
    fuel: "petrol",
    years: [2007, 2008, 2009, 2010, 2011],
    topPainId: "n43-injectors",
    medianBuyPlnByYear: buy([2007, 2008, 2009, 2010, 2011], 17000, 21000),
    repairPln: [4000, 9000],
    inputsByYear: fillYears(
      [2007, 2008, 2009, 2010, 2011],
      { catastrophe: 0.4, expectedFix5yPln: 8800, painLoad: 0.52, campaigns: 0.16, partsReality: 0.73 },
      { catastrophe: 0.36, expectedFix5yPln: 8000, painLoad: 0.48, campaigns: 0.12, partsReality: 0.76 },
    ),
  },
  {
    model: "325i",
    engine: "N52",
    fuel: "petrol",
    years: [2005, 2006, 2007],
    topPainId: "water-pump",
    medianBuyPlnByYear: buy([2005, 2006, 2007], 18000, 22000),
    repairPln: [1500, 3500],
    inputsByYear: fillYears(
      [2005, 2006, 2007],
      { ...n52, catastrophe: 0.13, expectedFix5yPln: 3400 },
      { ...n52, catastrophe: 0.14, expectedFix5yPln: 3600, painLoad: 0.24 },
    ),
  },
  {
    model: "325i",
    engine: "N53",
    fuel: "petrol",
    years: [2007, 2008, 2009, 2010, 2011],
    topPainId: "n53-injectors",
    medianBuyPlnByYear: buy([2007, 2008, 2009, 2010, 2011], 19000, 24000),
    repairPln: [6000, 14000],
    inputsByYear: fillYears(
      [2007, 2008, 2009, 2010, 2011],
      { catastrophe: 0.7, expectedFix5yPln: 12000, painLoad: 0.62, campaigns: 0.22, partsReality: 0.55 },
      { catastrophe: 0.66, expectedFix5yPln: 11000, painLoad: 0.58, campaigns: 0.18, partsReality: 0.58 },
    ),
  },
  {
    model: "330i",
    engine: "N52",
    fuel: "petrol",
    years: [2005, 2006, 2007],
    topPainId: "water-pump",
    medianBuyPlnByYear: { 2005: 22000, 2006: 24000, 2007: 26500 },
    repairPln: [1500, 4000],
    inputsByYear: {
      2005: n52,
      2006: { ...n52, expectedFix5yPln: 3400, painLoad: 0.23 },
      2007: { ...n52, expectedFix5yPln: 3600, painLoad: 0.24, catastrophe: 0.13 },
    },
  },
  {
    model: "330i",
    engine: "N53",
    fuel: "petrol",
    years: [2007, 2008, 2009, 2010, 2011],
    topPainId: "n53-injectors",
    medianBuyPlnByYear: buy([2007, 2008, 2009, 2010, 2011], 20000, 25500),
    repairPln: [6000, 14000],
    inputsByYear: fillYears(
      [2007, 2008, 2009, 2010, 2011],
      { catastrophe: 0.72, expectedFix5yPln: 12500, painLoad: 0.64, campaigns: 0.24, partsReality: 0.52 },
      { catastrophe: 0.68, expectedFix5yPln: 11500, painLoad: 0.6, campaigns: 0.2, partsReality: 0.55 },
    ),
  },
  {
    model: "335i",
    engine: "N54",
    fuel: "petrol",
    years: [2006, 2007, 2008, 2009, 2010],
    topPainId: "n54-hpfp",
    medianBuyPlnByYear: buy([2006, 2007, 2008, 2009, 2010], 26000, 34000),
    repairPln: [4000, 10000],
    inputsByYear: fillYears(
      [2006, 2007, 2008, 2009, 2010],
      { catastrophe: 0.55, expectedFix5yPln: 11000, painLoad: 0.7, campaigns: 0.28, partsReality: 0.8 },
      { catastrophe: 0.5, expectedFix5yPln: 9500, painLoad: 0.62, campaigns: 0.22, partsReality: 0.82 },
    ),
  },
  {
    model: "335i",
    engine: "N55",
    fuel: "petrol",
    years: [2010, 2011, 2012],
    topPainId: "water-pump",
    medianBuyPlnByYear: { 2010: 36000, 2011: 39000, 2012: 42000 },
    repairPln: [2000, 6000],
    inputsByYear: fillYears(
      [2010, 2011, 2012],
      { catastrophe: 0.28, expectedFix5yPln: 6500, painLoad: 0.4, campaigns: 0.14, partsReality: 0.85 },
      { catastrophe: 0.24, expectedFix5yPln: 5800, painLoad: 0.36, campaigns: 0.12, partsReality: 0.87 },
    ),
  },
  {
    model: "318d",
    engine: "M47",
    fuel: "diesel",
    years: [2005, 2006, 2007],
    topPainId: "swirl-flaps",
    medianBuyPlnByYear: buy([2005, 2006, 2007], 13000, 15500),
    repairPln: [1500, 4000],
    inputsByYear: fillYears(
      [2005, 2006, 2007],
      { catastrophe: 0.32, expectedFix5yPln: 5500, painLoad: 0.42, campaigns: 0.1, partsReality: 0.88 },
      { catastrophe: 0.3, expectedFix5yPln: 5200, painLoad: 0.4, campaigns: 0.1, partsReality: 0.88 },
    ),
  },
  {
    model: "318d",
    engine: "N47",
    fuel: "diesel",
    years: [2007, 2008, 2009, 2010, 2011],
    topPainId: "n47-chain",
    medianBuyPlnByYear: buy([2007, 2008, 2009, 2010, 2011], 14500, 18500),
    repairPln: [4000, 14000],
    inputsByYear: fillYears([2007, 2008, 2009, 2010, 2011], n47Early, n47Late),
  },
  {
    model: "320d",
    engine: "M47",
    fuel: "diesel",
    years: [2005, 2006, 2007],
    topPainId: "swirl-flaps",
    medianBuyPlnByYear: buy([2005, 2006, 2007], 15500, 18500),
    repairPln: [1500, 4500],
    inputsByYear: fillYears(
      [2005, 2006, 2007],
      { catastrophe: 0.3, expectedFix5yPln: 5200, painLoad: 0.4, campaigns: 0.1, partsReality: 0.9 },
      { catastrophe: 0.28, expectedFix5yPln: 5000, painLoad: 0.38, campaigns: 0.1, partsReality: 0.9 },
    ),
  },
  {
    model: "320d",
    engine: "N47",
    fuel: "diesel",
    years: [2007, 2008, 2009, 2010, 2011, 2012],
    topPainId: "n47-chain",
    medianBuyPlnByYear: {
      2007: 15500,
      2008: 16500,
      2009: 17500,
      2010: 18500,
      2011: 19500,
      2012: 21000,
    },
    repairPln: [4000, 14000],
    inputsByYear: {
      ...fillYears([2007, 2008, 2009, 2010], n47Early, {
        catastrophe: 0.94,
        expectedFix5yPln: 14800,
        painLoad: 0.68,
        campaigns: 0.25,
        partsReality: 0.89,
      }),
      2011: n47Late,
      2012: { ...n47Late, catastrophe: 0.9, expectedFix5yPln: 13500, painLoad: 0.62 },
    },
  },
  {
    model: "325d",
    engine: "M57",
    fuel: "diesel",
    years: [2006, 2007, 2008, 2009, 2010],
    topPainId: "swirl-flaps",
    medianBuyPlnByYear: buy([2006, 2007, 2008, 2009, 2010], 20000, 28000),
    repairPln: [2000, 8000],
    inputsByYear: fillYears(
      [2006, 2007, 2008, 2009, 2010],
      { catastrophe: 0.22, expectedFix5yPln: 6000, painLoad: 0.36, campaigns: 0.12, partsReality: 0.86 },
      { catastrophe: 0.2, expectedFix5yPln: 5500, painLoad: 0.34, campaigns: 0.1, partsReality: 0.86 },
    ),
  },
  {
    model: "330d",
    engine: "M57",
    fuel: "diesel",
    years: [2005, 2006, 2007, 2008],
    topPainId: "swirl-flaps",
    medianBuyPlnByYear: buy([2005, 2006, 2007, 2008], 22000, 30000),
    repairPln: [2000, 8000],
    inputsByYear: fillYears(
      [2005, 2006, 2007, 2008],
      { catastrophe: 0.2, expectedFix5yPln: 5800, painLoad: 0.34, campaigns: 0.1, partsReality: 0.88 },
      { catastrophe: 0.18, expectedFix5yPln: 5400, painLoad: 0.32, campaigns: 0.1, partsReality: 0.88 },
    ),
  },
  {
    model: "330d",
    engine: "N57",
    fuel: "diesel",
    years: [2008, 2009, 2010, 2011, 2012],
    topPainId: "n57-timing",
    medianBuyPlnByYear: buy([2008, 2009, 2010, 2011, 2012], 28000, 38000),
    repairPln: [3000, 9000],
    inputsByYear: fillYears(
      [2008, 2009, 2010, 2011, 2012],
      { catastrophe: 0.38, expectedFix5yPln: 8000, painLoad: 0.45, campaigns: 0.16, partsReality: 0.8 },
      { catastrophe: 0.32, expectedFix5yPln: 7200, painLoad: 0.4, campaigns: 0.12, partsReality: 0.82 },
    ),
  },
  {
    model: "335d",
    engine: "M57",
    fuel: "diesel",
    years: [2006, 2007, 2008, 2009, 2010, 2011],
    topPainId: "swirl-flaps",
    medianBuyPlnByYear: buy([2006, 2007, 2008, 2009, 2010, 2011], 24000, 36000),
    repairPln: [2500, 9000],
    inputsByYear: fillYears(
      [2006, 2007, 2008, 2009, 2010, 2011],
      { catastrophe: 0.24, expectedFix5yPln: 7000, painLoad: 0.4, campaigns: 0.12, partsReality: 0.82 },
      { catastrophe: 0.22, expectedFix5yPln: 6500, painLoad: 0.38, campaigns: 0.1, partsReality: 0.82 },
    ),
  },
];

export const e90Pains: Pain[] = [
  {
    id: "n47-chain",
    engines: ["N47"],
    yearFrom: 2007,
    title: {
      pl: "Łańcuch rozrządu (tył silnika)",
      en: "Timing chain (rear of engine)",
      ru: "Цепь ГРМ (со стороны коробки)",
    },
    affects: {
      pl: "N47 318d / 320d / 118d / 120d / 520d, zwłaszcza wczesne lata i wysokie przebiegi",
      en: "N47 318d / 320d / 118d / 120d / 520d, especially early years and high mileage",
      ru: "N47 318d / 320d / 118d / 120d / 520d, особенно ранние годы и большой пробег",
    },
    summary: {
      pl: "Łańcuch siedzi od strony skrzyni. Gdy pęknie albo przeskoczy, często kończy się silnikiem do wymiany. To nie jest usterka „wszystkich E90”.",
      en: "The chain sits at the gearbox end. When it snaps or jumps, the engine is often a write-off. This is not an “all E90” fault.",
      ru: "Цепь стоит со стороны коробки. Обрыв или перескок часто заканчивается мотором под замену. Это не поломка «всех E90».",
    },
    severity: "engine-loss",
    plnIndependent: [4000, 8000],
    plnSpecialist: [7000, 12000],
    plnAso: [12000, 22000],
    oemHint: "timing chain kit N47",
    autodocQuery: {
      pl: "BMW E90 N47 łańcuch rozrządu",
      en: "BMW E90 N47 timing chain",
      ru: "BMW E90 N47 цепь ГРМ",
    },
    sources: [
      {
        label: "EngineScope N47 (competitor score, not ours)",
        url: "https://enginescope.com",
      },
    ],
  },
  {
    id: "n54-hpfp",
    engines: ["N54"],
    title: {
      pl: "Pompa HPFP i wtryskiwacze",
      en: "HPFP and injectors",
      ru: "ТНВД и форсунки",
    },
    affects: {
      pl: "335i twin-turbo (N54), nie N55 i nie diesle",
      en: "335i twin-turbo (N54), not N55 and not diesels",
      ru: "335i twin-turbo (N54), не N55 и не дизели",
    },
    summary: {
      pl: "Wysokociśnieniowa pompa paliwa i piezo-wtryski to droga para. Objawy: trudny rozruch, utrata mocy, błędy mieszanki.",
      en: "High-pressure fuel pump and piezo injectors are an expensive pair. Symptoms: hard starts, limp power, mixture faults.",
      ru: "ТНВД и пьезофорсунки — дорогая пара. Симптомы: трудный пуск, потеря тяги, ошибки смеси.",
    },
    severity: "expensive",
    plnIndependent: [4000, 10000],
    plnSpecialist: [7000, 14000],
    plnAso: [12000, 20000],
    autodocQuery: {
      pl: "BMW E90 N54 pompa HPFP wtryskiwacze",
      en: "BMW E90 N54 HPFP injectors",
      ru: "BMW E90 N54 ТНВД форсунки",
    },
    sources: [],
  },
  {
    id: "n53-injectors",
    engines: ["N53"],
    title: {
      pl: "Wtryskiwacze i pompa HPFP (N53 EU)",
      en: "Injectors and HPFP (EU N53)",
      ru: "Форсунки и ТНВД (EU N53)",
    },
    affects: {
      pl: "325i / 330i z wtryskiem bezpośrednim N53 (Europa). USA miało N52 dłużej.",
      en: "EU 325i / 330i with N53 direct injection. The US kept N52 longer.",
      ru: "EU 325i / 330i с непосредственным впрыском N53. В США N52 держали дольше.",
    },
    summary: {
      pl: "N53 to nie N52. Bezpośredni wtrysk na wolnossącym rzędowym sixie psuje się drożej niż pompa wody.",
      en: "N53 is not N52. Direct injection on the NA inline-six fails more expensively than a water pump.",
      ru: "N53 — не N52. Непосредственный впрыск на атмосферной рядной шестёрке ломается дороже помпы.",
    },
    severity: "expensive",
    plnIndependent: [6000, 14000],
    plnSpecialist: [9000, 16000],
    plnAso: [14000, 22000],
    autodocQuery: {
      pl: "BMW E90 N53 wtryskiwacze",
      en: "BMW E90 N53 injectors",
      ru: "BMW E90 N53 форсунки",
    },
    sources: [],
  },
  {
    id: "n43-injectors",
    engines: ["N43"],
    title: {
      pl: "Wtryskiwacze N43 / NOx",
      en: "N43 injectors / NOx",
      ru: "Форсунки N43 / NOx",
    },
    affects: {
      pl: "318i / 320i z N43 (wtrysk bezpośredni, 4 cylindry)",
      en: "318i / 320i with N43 (direct injection, four-cylinder)",
      ru: "318i / 320i с N43 (непосредственный впрыск, четыре цилиндра)",
    },
    summary: {
      pl: "Czterocylindrowy DI z tego pokolenia nie jest „bezpieczną benzyną”. Wtryski i sonda NOx potrafią zjeść budżet oględzin.",
      en: "This generation’s four-cylinder DI is not the “safe petrol”. Injectors and the NOx sensor can eat a viewing budget.",
      ru: "Четырёхцилиндровый DI этого поколения — не «безопасный бензин». Форсунки и датчик NOx съедают бюджет осмотра.",
    },
    severity: "expensive",
    plnIndependent: [4000, 9000],
    plnSpecialist: [6000, 12000],
    plnAso: [10000, 16000],
    autodocQuery: {
      pl: "BMW E90 N43 wtryskiwacze",
      en: "BMW E90 N43 injectors",
      ru: "BMW E90 N43 форсунки",
    },
    sources: [],
  },
  {
    id: "water-pump",
    engines: ["N52", "N54", "N55"],
    title: {
      pl: "Elektryczna pompa wody / termostat",
      en: "Electric water pump / thermostat",
      ru: "Электрическая помпа / термостат",
    },
    affects: {
      pl: "Rzędowe szóstki N52 / N54 / N55",
      en: "N52 / N54 / N55 inline-sixes",
      ru: "Рядные шестёрки N52 / N54 / N55",
    },
    summary: {
      pl: "Pompa jest elektryczna i pada bez wielkiego ostrzeżenia. Na N52 to typowy, nie katastroficzny koszt. Na N54/N55 i tak sprawdzaj układ chłodzenia.",
      en: "The pump is electric and dies with little warning. On N52 this is a typical, not catastrophic, bill. On N54/N55 still check cooling.",
      ru: "Помпа электрическая и умирает почти без предупреждения. На N52 это типичный, не катастрофический счёт. На N54/N55 всё равно смотри охлаждение.",
    },
    severity: "overheat",
    plnIndependent: [1000, 2500],
    plnSpecialist: [1800, 3500],
    plnAso: [3000, 5500],
    autodocQuery: {
      pl: "BMW E90 N52 pompa wody elektryczna",
      en: "BMW E90 N52 electric water pump",
      ru: "BMW E90 N52 электрическая помпа",
    },
    sources: [],
  },
  {
    id: "swirl-flaps",
    engines: ["M47", "M57"],
    title: {
      pl: "Klapki w kolektorze (swirl flaps)",
      en: "Intake swirl flaps",
      ru: "Вихревые заслонки впуска",
    },
    affects: {
      pl: "Diesle M47 / M57 — 320d wczesny, 330d, 335d, 325d",
      en: "M47 / M57 diesels — early 320d, 330d, 335d, 325d",
      ru: "Дизели M47 / M57 — ранний 320d, 330d, 335d, 325d",
    },
    summary: {
      pl: "Obrotowe klapki potrafią odpaść do kolektora. To inna usterka niż łańcuch N47 — nie mieszaj ich na jednej stronie „E90 diesel”.",
      en: "The flaps can break off into the intake. This is a different fault from the N47 chain — do not blend them on one “E90 diesel” page.",
      ru: "Заслонки могут отломиться во впуск. Это другая поломка, чем цепь N47 — не мешай их на одной странице «дизель E90».",
    },
    severity: "expensive",
    plnIndependent: [1500, 3500],
    plnSpecialist: [2500, 5000],
    plnAso: [4000, 8000],
    autodocQuery: {
      pl: "BMW E90 M57 klapki kolektora",
      en: "BMW E90 M57 swirl flaps",
      ru: "BMW E90 M57 вихревые заслонки",
    },
    sources: [],
  },
  {
    id: "n57-timing",
    engines: ["N57"],
    title: {
      pl: "Rozrząd / łańcuch N57 (łagodniej niż N47)",
      en: "N57 timing chain (milder than N47)",
      ru: "Цепь ГРМ N57 (мягче, чем N47)",
    },
    affects: {
      pl: "330d / 530d / X5 40d z N57, nie mylić z N47 320d",
      en: "N57 330d / 530d / X5 40d, not the N47 320d",
      ru: "N57 330d / 530d / X5 40d, не N47 320d",
    },
    summary: {
      pl: "N57 nie jest tak sławny jak N47, ale to wciąż łańcuchowy diesel z przebiegami typowymi dla Polski. Sprawdzaj szumy i historię serwisową.",
      en: "N57 is not as infamous as N47, but it is still a chain diesel with Poland-typical mileage. Check noise and service history.",
      ru: "N57 не так печально знаменит, как N47, но это всё ещё цепной дизель с польским пробегом. Слушай шум и смотри сервисную историю.",
    },
    severity: "expensive",
    plnIndependent: [3000, 8000],
    plnSpecialist: [5000, 11000],
    plnAso: [9000, 16000],
    autodocQuery: {
      pl: "BMW E90 N57 łańcuch rozrządu",
      en: "BMW E90 N57 timing chain",
      ru: "BMW E90 N57 цепь ГРМ",
    },
    sources: [],
  },
  {
    id: "timing-guides",
    engines: ["N46", "N42"],
    title: {
      pl: "Prowadnice łańcucha N42 / N46",
      en: "N42 / N46 chain guides",
      ru: "Направляющие цепи N42 / N46",
    },
    affects: {
      pl: "E46 318i N42 i E90/E87 318i / 320i z N46",
      en: "E46 318i N42 and E90/E87 318i / 320i with N46",
      ru: "E46 318i N42 и E90/E87 318i / 320i с N46",
    },
    summary: {
      pl: "Czterocylindrowa benzyna z tego okresu psuje prowadnice, nie HPFP. To nadal nie N52.",
      en: "This four-cylinder petrol wears chain guides, not a HPFP. It is still not an N52.",
      ru: "Эта бензиновая четвёрка ест направляющие цепи, не ТНВД. Это всё ещё не N52.",
    },
    severity: "expensive",
    plnIndependent: [1500, 4000],
    plnSpecialist: [2500, 5500],
    plnAso: [4000, 8000],
    autodocQuery: {
      pl: "BMW E90 N46 łańcuch rozrządu",
      en: "BMW E90 N46 timing chain",
      ru: "BMW E90 N46 цепь ГРМ",
    },
    sources: [],
  },
  {
    id: "subframe-rust",
    engines: ["N52", "N53", "N54", "N55", "N47", "M47", "M57", "N57", "N43", "N46"],
    title: {
      pl: "Tylna belka / rdza (zima EU)",
      en: "Rear subframe / rust (EU winters)",
      ru: "Задний подрамник / ржавчина (зимы EU)",
    },
    affects: {
      pl: "E90/E91, zwłaszcza Touring i auta z solą drogową",
      en: "E90/E91, especially Touring and road-salt cars",
      ru: "E90/E91, особенно Touring и машины после дорожной соли",
    },
    summary: {
      pl: "Belka i mocowania wahaczy to killer oględzin w Polsce. Nie zależy od diesla vs benzyna — zależy od spawów i historii.",
      en: "Subframe and control-arm mounts are a viewing killer in Poland. Not diesel vs petrol — welds and history.",
      ru: "Подрамник и крепления рычагов — убийца осмотра в Польше. Не дизель против бензина — швы и история.",
    },
    severity: "safety",
    plnIndependent: [800, 6000],
    plnSpecialist: [1500, 9000],
    plnAso: [3000, 14000],
    autodocQuery: {
      pl: "BMW E90 wahacz tylny belka",
      en: "BMW E90 rear control arm subframe",
      ru: "BMW E90 задний рычаг подрамник",
    },
    sources: [],
  },
  {
    id: "elv-cas",
    engines: ["N52", "N53", "N54", "N55", "N47", "M47", "M57", "N57", "N43", "N46"],
    title: {
      pl: "Blokada kierownicy / CAS",
      en: "Electric steering lock / CAS",
      ru: "Электрозамок руля / CAS",
    },
    affects: {
      pl: "Elektronika E-series — auto nie odblokowuje kierownicy",
      en: "E-series electronics — the car will not unlock the steering",
      ru: "Электрика E-series — машина не разблокирует руль",
    },
    summary: {
      pl: "Zostajesz na parkingu. Moduł i kodowanie, nie silnik. Sprawdź czy auto odpala z kluczyka bez kombinowania.",
      en: "You are stranded. Module and coding, not the engine. Check that the car starts from the key without drama.",
      ru: "Ты на стоянке. Модуль и кодировка, не мотор. Проверь, что машина заводится с ключа без танцев.",
    },
    severity: "stranded",
    plnIndependent: [500, 2000],
    plnSpecialist: [900, 2800],
    plnAso: [1500, 4000],
    autodocQuery: {
      pl: "BMW E90 ELV blokada kierownicy",
      en: "BMW E90 ELV steering lock",
      ru: "BMW E90 ELV замок руля",
    },
    sources: [],
  },
];

export const e90PainsById = new Map(e90Pains.map((pain) => [pain.id, pain]));
