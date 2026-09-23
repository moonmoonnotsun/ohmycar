/**
 * Registry of every external resource used for OhMyCar ratings / evidence.
 * Buy-price sources are listed but do NOT enter the 0–100 formula.
 * Tier C (forums/Reddit) discovers faults — never binds year windows alone.
 */
import type { Localized } from "@/data/types";
import { loc } from "@/data/loc";

export type SourceTier = "A" | "B" | "C" | "D";

/** How the row relates to the 0–100 formula */
export type SourceRole =
  | "score" // directly feeds a score bucket today
  | "score_supporting" // cited on pains / year windows that feed score
  | "discovery" // finds candidates; not score alone
  | "buy_only" // median buy PLN — never in 0–100
  | "links_only" // deep links, no stored numbers for score
  | "planned"; // wired later (partsReality / soft prior)

export type ScoreSourceRow = {
  id: string;
  name: Localized;
  url: string;
  /** Extra related URLs (API docs, public tables, etc.) */
  moreUrls?: { label: Localized; url: string }[];
  tier: SourceTier;
  role: SourceRole;
  /** Which score / product surface it feeds */
  feeds: Localized;
};

export const SCORE_SOURCES: ScoreSourceRow[] = [
  // —— Tier A: score-binding ——
  {
    id: "uokik",
    name: loc("UOKiK BIP (PL recalls)", "UOKiK BIP (akcje PL)", "UOKiK BIP (отзывы PL)"),
    url: "https://uokik.gov.pl/bip/tagi/bmw",
    tier: "A",
    role: "score",
    feeds: loc("campaigns bucket", "kubełek campaigns", "корзина campaigns"),
  },
  {
    id: "nhtsa_recalls",
    name: loc("NHTSA recalls API", "NHTSA API recalli", "NHTSA API отзывов"),
    url: "https://api.nhtsa.gov/recalls/recallsByVehicle",
    moreUrls: [
      {
        label: loc("Datasets & TSB zips", "Datasety i TSB", "Датасеты и TSB"),
        url: "https://www.nhtsa.gov/nhtsa-datasets-and-apis",
      },
    ],
    tier: "A",
    role: "score_supporting",
    feeds: loc("pain sources + year windows; campaigns secondary", "źródła usterek + okna lat; campaigns pomocniczo", "источники поломок + окна лет; campaigns вторично"),
  },
  {
    id: "nhtsa_tsb",
    name: loc("NHTSA TSB / manufacturer PDFs", "NHTSA TSB / PDF producenta", "NHTSA TSB / PDF производителя"),
    url: "https://www.nhtsa.gov/nhtsa-datasets-and-apis",
    moreUrls: [
      {
        label: loc("static.nhtsa.gov TSB host", "Host PDF TSB", "Хост PDF TSB"),
        url: "https://static.nhtsa.gov/odi/tsbs/",
      },
    ],
    tier: "A",
    role: "score_supporting",
    feeds: loc("catastrophe / painLoad via pain sources", "catastrophe / painLoad przez źródła usterek", "catastrophe / painLoad через источники поломок"),
  },
  {
    id: "bmw_vin_pl",
    name: loc("BMW Poland VIN recall checker", "BMW PL sprawdzanie VIN", "BMW PL проверка VIN"),
    url: "https://www.bmwgroup.com/en/general/regulations/recall/recall-polish.html",
    tier: "A",
    role: "links_only",
    feeds: loc("user VIN check (not scraped)", "sprawdzenie VIN przez użytkownika (bez scrapu)", "проверка VIN пользователем (без скрапа)"),
  },
  {
    id: "realoem",
    name: loc("RealOEM BMW", "RealOEM BMW", "RealOEM BMW"),
    url: "https://www.realoem.com/bmw/",
    tier: "A",
    role: "score_supporting",
    feeds: loc("engine × year fitment matrix", "macierz silnik × rok", "матрица мотор × год"),
  },
  {
    id: "workshop_pln",
    name: loc(
      "PL workshops (AutoKult, ADM, Smorawiński, …)",
      "Warsztaty PL (AutoKult, ADM, Smorawiński, …)",
      "Сервисы PL (AutoKult, ADM, Smorawiński, …)",
    ),
    url: "https://autokult.pl/",
    moreUrls: [
      { label: loc("ADM Serwis", "ADM Serwis", "ADM Serwis"), url: "https://admserwis.com/" },
      {
        label: loc("BMW Smorawiński", "BMW Smorawiński", "BMW Smorawiński"),
        url: "https://www.bmw-smorawinskigz.pl/",
      },
      {
        label: loc("kosztserwisu.pl labor", "kosztserwisu.pl robocizna", "kosztserwisu.pl работа"),
        url: "https://kosztserwisu.pl/cennik-napraw/",
      },
    ],
    tier: "A",
    role: "score",
    feeds: loc("fiveYearFix (quoted PLN bands)", "fiveYearFix (wycenione pasma PLN)", "fiveYearFix (котировки PLN)"),
  },
  {
    id: "wikipedia_engines",
    name: loc("Wikipedia engine pages", "Wikipedia — strony silników", "Wikipedia — страницы моторов"),
    url: "https://en.wikipedia.org/wiki/BMW_N47",
    moreUrls: [
      { label: loc("BMW N20", "BMW N20", "BMW N20"), url: "https://en.wikipedia.org/wiki/BMW_N20" },
      { label: loc("BMW N54", "BMW N54", "BMW N54"), url: "https://en.wikipedia.org/wiki/BMW_N54" },
      { label: loc("BMW B48", "BMW B48", "BMW B48"), url: "https://en.wikipedia.org/wiki/BMW_B48" },
    ],
    tier: "B",
    role: "score_supporting",
    feeds: loc("pain summaries + production windows (with citations)", "opisy usterek + okna produkcji (z cytatami)", "описания поломок + окна производства (с цитатами)"),
  },
  {
    id: "bbc_watchdog",
    name: loc("BBC Watchdog (N47 chain)", "BBC Watchdog (łańcuch N47)", "BBC Watchdog (цепь N47)"),
    url: "https://www.bbc.co.uk/programmes/b006mg74/features/bmw-chains-snap-n47-engine-2007-2009",
    tier: "B",
    role: "score_supporting",
    feeds: loc("N47 early year window", "wczesne okno lat N47", "раннее окно лет N47"),
  },
  {
    id: "wybor_kierowcow",
    name: loc("Wybór Kierowców", "Wybór Kierowców", "Wybór Kierowców"),
    url: "https://www.wyborkierowcow.pl/",
    tier: "B",
    role: "score_supporting",
    feeds: loc("PL engine risk articles (e.g. N47)", "artykuły o ryzyku silników (np. N47)", "статьи о риске моторов (напр. N47)"),
  },
  {
    id: "skanyx",
    name: loc("Skanyx BMW fault guides", "Skanyx — usterki BMW", "Skanyx — поломки BMW"),
    url: "https://skanyx.com/pl/blog/bmw-fault-codes-guide",
    tier: "B",
    role: "score_supporting",
    feeds: loc("fault patterns + typical PLN ranges", "wzorce usterek + typowe PLN", "паттерны поломок + типичные PLN"),
  },
  {
    id: "autobaza",
    name: loc("Autobaza auto-ekspert", "Autobaza auto-ekspert", "Autobaza auto-ekspert"),
    url: "https://www.autobaza.pl/",
    tier: "B",
    role: "score_supporting",
    feeds: loc("PL buy / fault articles", "artykuły PL o zakupie / usterkach", "статьи PL о покупке / поломках"),
  },
  {
    id: "honest_john",
    name: loc("Honest John", "Honest John", "Honest John"),
    url: "https://www.honestjohn.co.uk/",
    tier: "B",
    role: "score_supporting",
    feeds: loc("UK reliability notes (cited via wiki etc.)", "notatki UK (cytowane m.in. przez wiki)", "заметки UK (цитируются в т.ч. wiki)"),
  },

  // —— Soft priors (planned / capped) ——
  {
    id: "adac",
    name: loc("ADAC Pannenstatistik", "ADAC Pannenstatistik", "ADAC Pannenstatistik"),
    url: "https://www.adac.de/rund-ums-fahrzeug/unfall-schaden-panne/adac-pannenstatistik-2026/",
    tier: "D",
    role: "planned",
    feeds: loc("optional ±ε catastrophe (not wired yet)", "opcjonalne ±ε catastrophe (jeszcze nie)", "опционально ±ε catastrophe (ещё нет)"),
  },
  {
    id: "tuv",
    name: loc("TÜV Report", "TÜV Report", "TÜV Report"),
    url: "https://www.tuev-verband.de/presse/publikationen/reporte/tuev-report-autobild",
    tier: "D",
    role: "planned",
    feeds: loc("optional ±ε catastrophe (not wired yet)", "opcjonalne ±ε catastrophe (jeszcze nie)", "опционально ±ε catastrophe (ещё нет)"),
  },

  // —— Buy (NOT in score) ——
  {
    id: "cardossier",
    name: loc("CarDossier (asking medians)", "CarDossier (mediany ofert)", "CarDossier (медианы объявлений)"),
    url: "https://car-dossier.com/ceny/bmw",
    moreUrls: [
      {
        label: loc("Valuation API docs", "Dokumentacja API", "Документация API"),
        url: "https://car-dossier.com/en/api/",
      },
    ],
    tier: "A",
    role: "buy_only",
    feeds: loc("medianBuyPln only — never 0–100", "tylko medianBuyPln — nigdy 0–100", "только medianBuyPln — никогда 0–100"),
  },
  {
    id: "eurotax",
    name: loc("Eurotax / Autovista (optional)", "Eurotax / Autovista (opcjonalnie)", "Eurotax / Autovista (опционально)"),
    url: "https://eurotax.pl/autovista-api/",
    tier: "A",
    role: "planned",
    feeds: loc("buy dual-check (B2B)", "kontrola buy (B2B)", "проверка buy (B2B)"),
  },
  {
    id: "info_ekspert",
    name: loc("Info-Ekspert (optional)", "Info-Ekspert (opcjonalnie)", "Info-Ekspert (опционально)"),
    url: "https://infonet.info-ekspert.net/",
    tier: "A",
    role: "planned",
    feeds: loc("buy dual-check (B2B)", "kontrola buy (B2B)", "проверка buy (B2B)"),
  },

  // —— Parts (planned for partsReality) ——
  {
    id: "autodoc",
    name: loc("Autodoc", "Autodoc", "Autodoc"),
    url: "https://www.autodoc.pl/",
    tier: "A",
    role: "planned",
    feeds: loc("partsReality + deep links (stock sample pending)", "partsReality + linki (stock jeszcze nie)", "partsReality + ссылки (сток ещё нет)"),
  },
  {
    id: "intercars",
    name: loc("Inter Cars WebAPI", "Inter Cars WebAPI", "Inter Cars WebAPI"),
    url: "https://docs.webapi.intercars.eu/",
    moreUrls: [
      { label: loc("intercars.pl", "intercars.pl", "intercars.pl"), url: "https://intercars.pl/" },
    ],
    tier: "A",
    role: "planned",
    feeds: loc("partsReality (B2B BOM / stock)", "partsReality (B2B BOM / stock)", "partsReality (B2B BOM / сток)"),
  },

  // —— Listing deep links only ——
  {
    id: "otomoto",
    name: loc("OTOMOTO", "OTOMOTO", "OTOMOTO"),
    url: "https://www.otomoto.pl",
    tier: "A",
    role: "links_only",
    feeds: loc("buy deep links (no market scrape)", "linki kupna (bez scrapu cen)", "ссылки покупки (без скрапа цен)"),
  },
  {
    id: "mobile_de",
    name: loc("mobile.de", "mobile.de", "mobile.de"),
    url: "https://www.mobile.de",
    tier: "A",
    role: "links_only",
    feeds: loc("buy deep links", "linki kupna", "ссылки покупки"),
  },

  // —— Tier C discovery forums ——
  {
    id: "bimmerpost",
    name: loc("Bimmerpost", "Bimmerpost", "Bimmerpost"),
    url: "https://www.bimmerpost.com/",
    tier: "C",
    role: "discovery",
    feeds: loc("fault discovery only", "tylko odkrywanie usterek", "только обнаружение поломок"),
  },
  {
    id: "e90post",
    name: loc("E90Post", "E90Post", "E90Post"),
    url: "https://www.e90post.com/forums/",
    tier: "C",
    role: "discovery",
    feeds: loc("fault discovery only", "tylko odkrywanie usterek", "только обнаружение поломок"),
  },
  {
    id: "bimmerfest",
    name: loc("Bimmerfest", "Bimmerfest", "Bimmerfest"),
    url: "https://www.bimmerfest.com/",
    tier: "C",
    role: "discovery",
    feeds: loc("fault discovery only", "tylko odkrywanie usterek", "только обнаружение поломок"),
  },
  {
    id: "5series_net",
    name: loc("5Series.net", "5Series.net", "5Series.net"),
    url: "https://www.5series.net/",
    tier: "C",
    role: "discovery",
    feeds: loc("fault discovery only", "tylko odkrywanie usterek", "только обнаружение поломок"),
  },
  {
    id: "1addicts",
    name: loc("1Addicts", "1Addicts", "1Addicts"),
    url: "https://www.1addicts.com/",
    tier: "C",
    role: "discovery",
    feeds: loc("fault discovery only", "tylko odkrywanie usterek", "только обнаружение поломок"),
  },
  {
    id: "m3post",
    name: loc("M3Post", "M3Post", "M3Post"),
    url: "https://www.m3post.com/",
    tier: "C",
    role: "discovery",
    feeds: loc("fault discovery only", "tylko odkrywanie usterek", "только обнаружение поломок"),
  },
  {
    id: "xoutpost",
    name: loc("Xoutpost", "Xoutpost", "Xoutpost"),
    url: "https://www.xoutpost.com/",
    tier: "C",
    role: "discovery",
    feeds: loc("fault discovery only", "tylko odkrywanie usterek", "только обнаружение поломок"),
  },
  {
    id: "bmwklub",
    name: loc("BMW Klub Polska", "BMW Klub Polska", "BMW Klub Polska"),
    url: "https://www.bmwklubpolska.pl/forum/",
    tier: "C",
    role: "discovery",
    feeds: loc("fault discovery only", "tylko odkrywanie usterek", "только обнаружение поломок"),
  },
  {
    id: "bmwsport",
    name: loc("BMW-Sport.pl", "BMW-Sport.pl", "BMW-Sport.pl"),
    url: "https://www.bmw-sport.pl/",
    tier: "C",
    role: "discovery",
    feeds: loc("fault discovery only", "tylko odkrywanie usterek", "только обнаружение поломок"),
  },
  {
    id: "motor_talk",
    name: loc("Motor-Talk (DE)", "Motor-Talk (DE)", "Motor-Talk (DE)"),
    url: "https://www.motor-talk.de/",
    tier: "C",
    role: "discovery",
    feeds: loc("fault discovery only", "tylko odkrywanie usterek", "только обнаружение поломок"),
  },
  {
    id: "reddit_bmw",
    name: loc("Reddit r/BMW", "Reddit r/BMW", "Reddit r/BMW"),
    url: "https://www.reddit.com/r/BMW/",
    moreUrls: [
      { label: loc("r/E90", "r/E90", "r/E90"), url: "https://www.reddit.com/r/E90/" },
      { label: loc("r/F30", "r/F30", "r/F30"), url: "https://www.reddit.com/r/F30/" },
      { label: loc("r/BMWTech", "r/BMWTech", "r/BMWTech"), url: "https://www.reddit.com/r/BMWTech/" },
    ],
    tier: "C",
    role: "discovery",
    feeds: loc("fault discovery only — never sole year bound", "tylko discovery — nigdy same okno lat", "только discovery — никогда одно окно лет"),
  },
];

export function sourcesByRole(role: SourceRole) {
  return SCORE_SOURCES.filter((s) => s.role === role);
}
