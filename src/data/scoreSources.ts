/**
 * Registry of every external *site / API / forum* used in OhMyCar.
 * One row per resource family — not every Wikipedia engine page or every PLN quote URL.
 * Buy-price sources never enter 0–100. Tier C discovery never binds year windows alone.
 */
import type { Localized } from "@/data/types";
import { loc } from "@/data/loc";

export type SourceTier = "A" | "B" | "C" | "D";

export type SourceRole =
  | "score"
  | "score_supporting"
  | "discovery"
  | "buy_only"
  | "links_only"
  | "planned";

/** Product surface where this resource shows up */
export type SourceGroup =
  | "official"
  | "score_evidence"
  | "pln_quotes"
  | "buy_market"
  | "parts"
  | "discovery"
  | "planned";

export type ScoreSourceRow = {
  id: string;
  name: Localized;
  url: string;
  moreUrls?: { label: Localized; url: string }[];
  tier: SourceTier;
  role: SourceRole;
  group: SourceGroup;
  /** Where in the product / pipeline this data is used */
  feeds: Localized;
};

export const SOURCE_GROUP_ORDER: SourceGroup[] = [
  "official",
  "score_evidence",
  "pln_quotes",
  "buy_market",
  "parts",
  "discovery",
  "planned",
];

export const SCORE_SOURCES: ScoreSourceRow[] = [
  // —— Official / regulatory ——
  {
    id: "uokik",
    name: loc("UOKiK BIP (PL recalls)", "UOKiK BIP (akcje PL)", "UOKiK BIP (отзывы PL)"),
    url: "https://uokik.gov.pl/bip/tagi/bmw",
    tier: "A",
    role: "score",
    group: "official",
    feeds: loc(
      "Campaigns bucket in 0–100; campaign links on variant pages",
      "Kubełek campaigns w 0–100; linki akcji na kartach",
      "Корзина campaigns в 0–100; ссылки отзывов на карточках",
    ),
  },
  {
    id: "nhtsa_recalls",
    name: loc("NHTSA recalls API", "NHTSA API recalli", "NHTSA API отзывов"),
    url: "https://api.nhtsa.gov/recalls/recallsByVehicle",
    moreUrls: [
      {
        label: loc("Datasets & APIs", "Datasety i API", "Датасеты и API"),
        url: "https://www.nhtsa.gov/nhtsa-datasets-and-apis",
      },
    ],
    tier: "A",
    role: "score_supporting",
    group: "official",
    feeds: loc(
      "Pain sources + year windows; secondary campaigns evidence",
      "Źródła usterek + okna lat; pomocniczo campaigns",
      "Источники поломок + окна лет; вторично campaigns",
    ),
  },
  {
    id: "nhtsa_tsb",
    name: loc("NHTSA TSB / SI PDFs (static.nhtsa.gov)", "NHTSA TSB / SI PDF", "NHTSA TSB / SI PDF"),
    url: "https://static.nhtsa.gov/odi/tsbs/",
    moreUrls: [
      {
        label: loc("NHTSA datasets hub", "Hub datasetów NHTSA", "Хаб датасетов NHTSA"),
        url: "https://www.nhtsa.gov/nhtsa-datasets-and-apis",
      },
      {
        label: loc("OEM DTC mirror samples", "Próbki OEM DTC", "Образцы OEM DTC"),
        url: "https://static.oemdtc.com/",
      },
    ],
    tier: "A",
    role: "score_supporting",
    group: "official",
    feeds: loc(
      "Fault cards (primary PDFs); catastrophe / painLoad year windows",
      "Karty usterek (PDF primary); okna lat catastrophe / painLoad",
      "Карточки поломок (PDF primary); окна лет catastrophe / painLoad",
    ),
  },
  {
    id: "bmw_vin_pl",
    name: loc("BMW Poland VIN recall checker", "BMW PL sprawdzanie VIN", "BMW PL проверка VIN"),
    url: "https://www.bmwgroup.com/en/general/regulations/recall/recall-polish.html",
    tier: "A",
    role: "links_only",
    group: "official",
    feeds: loc(
      "User VIN check link (not scraped into score)",
      "Link sprawdzenia VIN (bez scrapu do oceny)",
      "Ссылка проверки VIN (без скрапа в оценку)",
    ),
  },
  {
    id: "bmw_press",
    name: loc("BMW Group PressClub", "BMW Group PressClub", "BMW Group PressClub"),
    url: "https://www.press.bmwgroup.com/",
    tier: "A",
    role: "score_supporting",
    group: "official",
    feeds: loc(
      "Fault cards — official capacity / model notes (e.g. i3 battery gens)",
      "Karty usterek — oficjalne notatki (np. generacje baterii i3)",
      "Карточки поломок — офиц. заметки (напр. поколения батареи i3)",
    ),
  },
  {
    id: "which_uk",
    name: loc("Which? (UK diesel campaigns)", "Which? (kampanie diesli UK)", "Which? (кампании дизелей UK)"),
    url: "https://www.which.co.uk/",
    tier: "B",
    role: "score_supporting",
    group: "official",
    feeds: loc(
      "Fault cards — B47 EGR campaign context (VIN check)",
      "Karty usterek — kontekst kampanii EGR B47 (VIN)",
      "Карточки поломок — контекст кампании EGR B47 (VIN)",
    ),
  },
  {
    id: "courtlistener",
    name: loc("CourtListener (US filings)", "CourtListener (pisma US)", "CourtListener (документы US)"),
    url: "https://www.storage.courtlistener.com/",
    tier: "B",
    role: "score_supporting",
    group: "official",
    feeds: loc(
      "Fault cards — class-action context (e.g. N63 oil consumption)",
      "Karty usterek — kontekst class action (np. N63 olej)",
      "Карточки поломок — контекст class action (напр. N63 масло)",
    ),
  },

  // —— Score evidence (identity + priors) ——
  {
    id: "realoem",
    name: loc("RealOEM BMW", "RealOEM BMW", "RealOEM BMW"),
    url: "https://www.realoem.com/bmw/",
    tier: "A",
    role: "score_supporting",
    group: "score_evidence",
    feeds: loc(
      "Engine × year fitment (catalog identity)",
      "Dopasowanie silnik × rok (tożsamość katalogu)",
      "Соответствие мотор × год (идентичность каталога)",
    ),
  },
  {
    id: "wikipedia_engines",
    name: loc("Wikipedia (BMW engine pages)", "Wikipedia (strony silników BMW)", "Wikipedia (страницы моторов BMW)"),
    url: "https://en.wikipedia.org/",
    tier: "B",
    role: "score_supporting",
    group: "score_evidence",
    feeds: loc(
      "Fault summaries + production windows (with other citations) — one site, many engine pages",
      "Opisy usterek + okna produkcji (z innymi cytatami) — jedna witryna, wiele stron silników",
      "Описания поломок + окна производства (с другими цитатами) — один сайт, много страниц моторов",
    ),
  },
  {
    id: "bbc_watchdog",
    name: loc("BBC Watchdog", "BBC Watchdog", "BBC Watchdog"),
    url: "https://www.bbc.co.uk/programmes/b006mg74/features/bmw-chains-snap-n47-engine-2007-2009",
    tier: "B",
    role: "score_supporting",
    group: "score_evidence",
    feeds: loc(
      "Fault cards — N47 early chain year window",
      "Karty usterek — wczesne okno łańcucha N47",
      "Карточки поломок — раннее окно цепи N47",
    ),
  },
  {
    id: "wybor_kierowcow",
    name: loc("Wybór Kierowców", "Wybór Kierowców", "Wybór Kierowców"),
    url: "https://www.wyborkierowcow.pl/",
    tier: "B",
    role: "score_supporting",
    group: "score_evidence",
    feeds: loc(
      "Fault cards — PL engine-risk articles",
      "Karty usterek — artykuły PL o ryzyku silników",
      "Карточки поломок — статьи PL о риске моторов",
    ),
  },
  {
    id: "skanyx",
    name: loc("Skanyx", "Skanyx", "Skanyx"),
    url: "https://skanyx.com/",
    tier: "B",
    role: "score_supporting",
    group: "score_evidence",
    feeds: loc(
      "Fault cards + typical PLN ranges on guides",
      "Karty usterek + typowe PLN w przewodnikach",
      "Карточки поломок + типичные PLN в гайдах",
    ),
  },
  {
    id: "autobaza",
    name: loc("Autobaza", "Autobaza", "Autobaza"),
    url: "https://www.autobaza.pl/",
    tier: "B",
    role: "score_supporting",
    group: "score_evidence",
    feeds: loc(
      "Fault / buy articles cited on cards",
      "Artykuły o usterkach / zakupie na kartach",
      "Статьи о поломках / покупке на карточках",
    ),
  },
  {
    id: "honest_john",
    name: loc("Honest John", "Honest John", "Honest John"),
    url: "https://www.honestjohn.co.uk/",
    tier: "B",
    role: "score_supporting",
    group: "score_evidence",
    feeds: loc(
      "Reliability notes cited via fault sources",
      "Notatki reliability cytowane w źródłach usterek",
      "Заметки reliability в источниках поломок",
    ),
  },
  {
    id: "ampauto",
    name: loc("AmpAuto", "AmpAuto", "AmpAuto"),
    url: "https://ampauto.io/",
    tier: "B",
    role: "score_supporting",
    group: "score_evidence",
    feeds: loc(
      "Fault cards — engine problem roundups (e.g. N52)",
      "Karty usterek — zestawienia problemów (np. N52)",
      "Карточки поломок — обзоры проблем (напр. N52)",
    ),
  },
  {
    id: "vehicleflaws",
    name: loc("VehicleFlaws / complaint digests", "VehicleFlaws / skargi", "VehicleFlaws / жалобы"),
    url: "https://vehicleflaws.com/",
    tier: "B",
    role: "score_supporting",
    group: "score_evidence",
    feeds: loc(
      "Fault cards — NHTSA complaint-class cost notes",
      "Karty usterek — notatki kosztów z klasy skarg NHTSA",
      "Карточки поломок — заметки о стоимости из жалоб NHTSA",
    ),
  },
  {
    id: "ownerspecs",
    name: loc("OwnerSpecs", "OwnerSpecs", "OwnerSpecs"),
    url: "https://ownerspecs.com/",
    tier: "B",
    role: "score_supporting",
    group: "score_evidence",
    feeds: loc(
      "Fault cards — capacity / oil-spec notes (e.g. S68)",
      "Karty usterek — pojemność / spec oleju (np. S68)",
      "Карточки поломок — ёмкость / спек масла (напр. S68)",
    ),
  },

  // —— PLN repair quotes (fiveYearFix) ——
  {
    id: "workshop_pl_media",
    name: loc("PL workshop media (AutoKult, …)", "Media warsztatów PL (AutoKult, …)", "Медиа сервисов PL (AutoKult, …)"),
    url: "https://autokult.pl/",
    moreUrls: [
      { label: loc("ADM Serwis", "ADM Serwis", "ADM Serwis"), url: "https://admserwis.com/" },
      {
        label: loc("BMW Smorawiński", "BMW Smorawiński", "BMW Smorawiński"),
        url: "https://www.bmw-smorawinskigz.pl/",
      },
      { label: loc("Car Media", "Car Media", "Car Media"), url: "https://car-media.pl/" },
      { label: loc("Automotoopinie", "Automotoopinie", "Automotoopinie"), url: "https://automotoopinie.pl/" },
    ],
    tier: "A",
    role: "score",
    group: "pln_quotes",
    feeds: loc(
      "fiveYearFix PLN bands + fault-card cost citations",
      "Pasma PLN fiveYearFix + cytaty kosztów na kartach",
      "Полосы PLN fiveYearFix + цитаты цен на карточках",
    ),
  },
  {
    id: "pl_price_aggregators",
    name: loc("PL repair price aggregators", "Agregatory cen napraw PL", "Агрегаторы цен ремонта PL"),
    url: "https://kosztserwisu.pl/cennik-napraw/",
    moreUrls: [
      { label: loc("cenauslug.pl", "cenauslug.pl", "cenauslug.pl"), url: "https://cenauslug.pl/" },
      { label: loc("polecanymechanik.pl", "polecanymechanik.pl", "polecanymechanik.pl"), url: "https://polecanymechanik.pl/" },
      { label: loc("pojazdy.net", "pojazdy.net", "pojazdy.net"), url: "https://pojazdy.net/" },
    ],
    tier: "A",
    role: "score",
    group: "pln_quotes",
    feeds: loc(
      "fiveYearFix — labor/parts band quotes on fault cards",
      "fiveYearFix — wyceny robocizny/części na kartach",
      "fiveYearFix — вилки работы/запчастей на карточках",
    ),
  },
  {
    id: "pl_parts_shops",
    name: loc("PL parts / specialist shops", "Sklepy części / specjaliści PL", "Магазины запчастей / специалисты PL"),
    url: "https://oryginalne-czesci.pl/",
    moreUrls: [
      { label: loc("Wiltronic", "Wiltronic", "Wiltronic"), url: "https://wiltronic.pl/" },
      { label: loc("Diesel-Partner", "Diesel-Partner", "Diesel-Partner"), url: "https://diesel-partner.pl/" },
      { label: loc("rozrzad.pl", "rozrzad.pl", "rozrzad.pl"), url: "https://rozrzad.pl/" },
      { label: loc("GearMar / xDrive", "GearMar / xDrive", "GearMar / xDrive"), url: "https://gearmar.pl/" },
      { label: loc("Hypertech", "Hypertech", "Hypertech"), url: "https://hypertech.com.pl/" },
      { label: loc("BMG Tuning", "BMG Tuning", "BMG Tuning"), url: "https://bmgtuning.pl/" },
      { label: loc("Kata-Serwis", "Kata-Serwis", "Kata-Serwis"), url: "https://kata-serwis.pl/" },
      { label: loc("Motoran", "Motoran", "Motoran"), url: "https://motoran.pl/" },
      { label: loc("e-dakro (i3 regen)", "e-dakro (regen i3)", "e-dakro (regen i3)"), url: "https://e-dakro.pl/" },
      { label: loc("bmwstore.pl", "bmwstore.pl", "bmwstore.pl"), url: "https://bmwstore.pl/" },
      { label: loc("repair-set / e-motoryzacyjny", "repair-set / e-motoryzacyjny", "repair-set / e-motoryzacyjny"), url: "https://e-motoryzacyjny.pl/" },
      { label: loc("AutoTechnik", "AutoTechnik", "AutoTechnik"), url: "https://autotechnik.tech/" },
      { label: loc("Bosch Sawa", "Bosch Sawa", "Bosch Sawa"), url: "https://bosch-sawa.pl/" },
    ],
    tier: "A",
    role: "score",
    group: "pln_quotes",
    feeds: loc(
      "fiveYearFix — parts & specialist job quotes on fault cards",
      "fiveYearFix — wyceny części i specjalistów na kartach",
      "fiveYearFix — цены запчастей и специалистов на карточках",
    ),
  },
  {
    id: "eu_uk_specialists",
    name: loc("EU / UK BMW specialists & parts", "Specjaliści / części EU·UK", "Специалисты / запчасти EU·UK"),
    url: "https://bmwtuning.co/",
    moreUrls: [
      { label: loc("BimmerWorld", "BimmerWorld", "BimmerWorld"), url: "https://www.bimmerworld.com/" },
      { label: loc("FCP Euro", "FCP Euro", "FCP Euro"), url: "https://www.fcpeuro.com/" },
      { label: loc("Turner Motorsport", "Turner Motorsport", "Turner Motorsport"), url: "https://www.turnermotorsport.com/" },
      { label: loc("Aulitzky Exhaust", "Aulitzky Exhaust", "Aulitzky Exhaust"), url: "https://aulitzkyexhaust.de/" },
      { label: loc("Bimmer.AI", "Bimmer.AI", "Bimmer.AI"), url: "https://bimmer.ai/" },
      { label: loc("BimmerBoom", "BimmerBoom", "BimmerBoom"), url: "https://bimmerboom.com/" },
      { label: loc("R44 / 5150 AutoSport", "R44 / 5150 AutoSport", "R44 / 5150 AutoSport"), url: "https://r44performance.com/" },
      { label: loc("Probsten-Tech", "Probsten-Tech", "Probsten-Tech"), url: "https://probsten-tech.de/" },
      { label: loc("VORLING", "VORLING", "VORLING"), url: "https://vorling.de/" },
      { label: loc("H2 Motors", "H2 Motors", "H2 Motors"), url: "https://h2motors.de/" },
      { label: loc("Burkhart Engineering", "Burkhart Engineering", "Burkhart Engineering"), url: "https://burkhart-engineering.com/" },
      { label: loc("AReeve Performance", "AReeve Performance", "AReeve Performance"), url: "https://areeve.co.uk/" },
      { label: loc("Nforcd", "Nforcd", "Nforcd"), url: "https://nforcd.com/" },
      { label: loc("Beisan Systems", "Beisan Systems", "Beisan Systems"), url: "https://beisansystems.com/" },
      { label: loc("Mr Vanos", "Mr Vanos", "Mr Vanos"), url: "https://mrvanos.com/" },
      { label: loc("Element Performance", "Element Performance", "Element Performance"), url: "https://elementperformance.co.uk/" },
      { label: loc("Bimmer Garage UK", "Bimmer Garage UK", "Bimmer Garage UK"), url: "https://bimmergarage.co.uk/" },
      { label: loc("LuxuryCarsGuide", "LuxuryCarsGuide", "LuxuryCarsGuide"), url: "https://luxurycarsguide.com/" },
      { label: loc("Tysautoworks", "Tysautoworks", "Tysautoworks"), url: "https://tysautoworksperformance.com/" },
      { label: loc("Euro Power Motorsports", "Euro Power Motorsports", "Euro Power Motorsports"), url: "https://europowermotorsports.com/" },
      { label: loc("i3upgrade.cz", "i3upgrade.cz", "i3upgrade.cz"), url: "https://i3upgrade.cz/" },
      { label: loc("EngineScope", "EngineScope", "EngineScope"), url: "https://enginescope.gr/" },
      { label: loc("Bimmer Bytes", "Bimmer Bytes", "Bimmer Bytes"), url: "https://bimmerbytes.com/" },
    ],
    tier: "A",
    role: "score",
    group: "pln_quotes",
    feeds: loc(
      "fiveYearFix — converted specialist quotes on fault cards (M / OFH / EV packs, …)",
      "fiveYearFix — wyceny specjalistów na kartach (M / OFH / EV, …)",
      "fiveYearFix — котировки специалистов на карточках (M / OFH / EV, …)",
    ),
  },
  {
    id: "allegro_lokalnie",
    name: loc("Allegro Lokalnie (parts / packs)", "Allegro Lokalnie (części / pakiety)", "Allegro Lokalnie (запчасти / пакеты)"),
    url: "https://allegrolokalnie.pl/",
    tier: "B",
    role: "score_supporting",
    group: "pln_quotes",
    feeds: loc(
      "Fault cards — occasional PLN market quotes (e.g. i3 packs)",
      "Karty usterek — okazjonalne wyceny rynkowe (np. pakiety i3)",
      "Карточки поломок — разовые рыночные цены (напр. пакеты i3)",
    ),
  },

  // —— Buy market (never 0–100) ——
  {
    id: "cardossier",
    name: loc("CarDossier", "CarDossier", "CarDossier"),
    url: "https://car-dossier.com/ceny/bmw",
    moreUrls: [
      {
        label: loc("Valuation API docs", "Dokumentacja API", "Документация API"),
        url: "https://car-dossier.com/en/api/",
      },
    ],
    tier: "A",
    role: "buy_only",
    group: "buy_market",
    feeds: loc(
      "medianBuyPln on variant money block — never enters 0–100",
      "medianBuyPln w bloku pieniędzy — nigdy nie wchodzi w 0–100",
      "medianBuyPln в блоке денег — никогда не входит в 0–100",
    ),
  },
  {
    id: "otomoto",
    name: loc("OTOMOTO", "OTOMOTO", "OTOMOTO"),
    url: "https://www.otomoto.pl",
    tier: "A",
    role: "links_only",
    group: "buy_market",
    feeds: loc(
      "Buy deep links on cards (no price scrape into score)",
      "Linki kupna na kartach (bez scrapu cen do oceny)",
      "Ссылки покупки на карточках (без скрапа цен в оценку)",
    ),
  },
  {
    id: "mobile_de",
    name: loc("mobile.de", "mobile.de", "mobile.de"),
    url: "https://www.mobile.de",
    tier: "A",
    role: "links_only",
    group: "buy_market",
    feeds: loc(
      "Buy deep links on cards",
      "Linki kupna na kartach",
      "Ссылки покупки на карточках",
    ),
  },
  {
    id: "olx",
    name: loc("OLX Motoryzacja", "OLX Motoryzacja", "OLX Авто"),
    url: "https://www.olx.pl/motoryzacja/samochody/",
    tier: "A",
    role: "links_only",
    group: "buy_market",
    feeds: loc(
      "Buy deep links (listings)",
      "Linki kupna (ogłoszenia)",
      "Ссылки покупки (объявления)",
    ),
  },

  // —— Parts stock (planned) ——
  {
    id: "autodoc",
    name: loc("Autodoc", "Autodoc", "Autodoc"),
    url: "https://www.autodoc.pl/",
    tier: "A",
    role: "planned",
    group: "parts",
    feeds: loc(
      "Planned partsReality + outbound catalog deep links",
      "Planowane partsReality + linki katalogu",
      "Планируется partsReality + ссылки каталога",
    ),
  },
  {
    id: "intercars",
    name: loc("Inter Cars WebAPI", "Inter Cars WebAPI", "Inter Cars WebAPI"),
    url: "https://docs.webapi.intercars.eu/",
    moreUrls: [{ label: loc("intercars.pl", "intercars.pl", "intercars.pl"), url: "https://intercars.pl/" }],
    tier: "A",
    role: "planned",
    group: "parts",
    feeds: loc(
      "Planned partsReality (B2B BOM / stock)",
      "Planowane partsReality (B2B BOM / stock)",
      "Планируется partsReality (B2B BOM / сток)",
    ),
  },
  {
    id: "bmw_oe_shop",
    name: loc("BMW OE parts portals", "Portale części OE BMW", "Порталы OE-запчастей BMW"),
    url: "https://www.shop.bmw.ca/",
    tier: "B",
    role: "score_supporting",
    group: "parts",
    feeds: loc(
      "Fault cards — OE supersession / part-number notes",
      "Karty usterek — supersession / numery części OE",
      "Карточки поломок — supersession / номера OE",
    ),
  },

  // —— Discovery forums / Reddit ——
  {
    id: "bimmerpost",
    name: loc("Bimmerpost", "Bimmerpost", "Bimmerpost"),
    url: "https://www.bimmerpost.com/",
    tier: "C",
    role: "discovery",
    group: "discovery",
    feeds: loc(
      "Fault discovery only — never sole year window",
      "Tylko discovery — nigdy same okno lat",
      "Только discovery — никогда одно окно лет",
    ),
  },
  {
    id: "e90post",
    name: loc("E90Post", "E90Post", "E90Post"),
    url: "https://www.e90post.com/forums/",
    tier: "C",
    role: "discovery",
    group: "discovery",
    feeds: loc("Fault discovery only", "Tylko discovery usterek", "Только discovery поломок"),
  },
  {
    id: "bimmerfest",
    name: loc("Bimmerfest", "Bimmerfest", "Bimmerfest"),
    url: "https://www.bimmerfest.com/",
    tier: "C",
    role: "discovery",
    group: "discovery",
    feeds: loc("Fault discovery only", "Tylko discovery usterek", "Только discovery поломок"),
  },
  {
    id: "5series_net",
    name: loc("5Series.net", "5Series.net", "5Series.net"),
    url: "https://www.5series.net/",
    tier: "C",
    role: "discovery",
    group: "discovery",
    feeds: loc("Fault discovery only", "Tylko discovery usterek", "Только discovery поломок"),
  },
  {
    id: "1addicts",
    name: loc("1Addicts", "1Addicts", "1Addicts"),
    url: "https://www.1addicts.com/",
    tier: "C",
    role: "discovery",
    group: "discovery",
    feeds: loc("Fault discovery only", "Tylko discovery usterek", "Только discovery поломок"),
  },
  {
    id: "m3post",
    name: loc("M3Post", "M3Post", "M3Post"),
    url: "https://www.m3post.com/",
    tier: "C",
    role: "discovery",
    group: "discovery",
    feeds: loc("Fault discovery only", "Tylko discovery usterek", "Только discovery поломок"),
  },
  {
    id: "m5board",
    name: loc("M5Board", "M5Board", "M5Board"),
    url: "https://www.m5board.com/",
    tier: "C",
    role: "discovery",
    group: "discovery",
    feeds: loc(
      "Discovery + occasional PLN/context quotes on M fault cards",
      "Discovery + okazjonalne wyceny/kontekst na kartach M",
      "Discovery + разовые цены/контекст на карточках M",
    ),
  },
  {
    id: "xoutpost",
    name: loc("Xoutpost", "Xoutpost", "Xoutpost"),
    url: "https://www.xoutpost.com/",
    tier: "C",
    role: "discovery",
    group: "discovery",
    feeds: loc(
      "Discovery + SI / X-model fault citations",
      "Discovery + cytaty SI / usterek X",
      "Discovery + цитаты SI / поломок X",
    ),
  },
  {
    id: "bmwklub",
    name: loc("BMW Klub Polska", "BMW Klub Polska", "BMW Klub Polska"),
    url: "https://www.bmwklubpolska.pl/forum/",
    tier: "C",
    role: "discovery",
    group: "discovery",
    feeds: loc("Fault discovery (PL forum)", "Discovery usterek (forum PL)", "Discovery поломок (форум PL)"),
  },
  {
    id: "bmwsport",
    name: loc("BMW-Sport.pl", "BMW-Sport.pl", "BMW-Sport.pl"),
    url: "https://www.bmw-sport.pl/",
    tier: "C",
    role: "discovery",
    group: "discovery",
    feeds: loc("Fault discovery (PL)", "Discovery usterek (PL)", "Discovery поломок (PL)"),
  },
  {
    id: "motor_talk",
    name: loc("Motor-Talk (DE)", "Motor-Talk (DE)", "Motor-Talk (DE)"),
    url: "https://www.motor-talk.de/",
    tier: "C",
    role: "discovery",
    group: "discovery",
    feeds: loc("Fault discovery (DE)", "Discovery usterek (DE)", "Discovery поломок (DE)"),
  },
  {
    id: "smgsociety",
    name: loc("SMG Society", "SMG Society", "SMG Society"),
    url: "https://smgsociety.com/",
    tier: "C",
    role: "discovery",
    group: "discovery",
    feeds: loc(
      "Fault cards — SMG pump / gearbox context (E60 M5 class)",
      "Karty usterek — kontekst pompy SMG (klasa E60 M5)",
      "Карточки поломок — контекст насоса SMG (класс E60 M5)",
    ),
  },
  {
    id: "tempadrive",
    name: loc("TempaDrive forum", "Forum TempaDrive", "Форум TempaDrive"),
    url: "https://forum.tempadrive.com/",
    tier: "C",
    role: "discovery",
    group: "discovery",
    feeds: loc(
      "Fault cards — N63 coolant-pipe cost discussion",
      "Karty usterek — dyskusja kosztów rur N63",
      "Карточки поломок — обсуждение цен патрубков N63",
    ),
  },
  {
    id: "bimmerboard",
    name: loc("Bimmerboard", "Bimmerboard", "Bimmerboard"),
    url: "https://www.bimmerboard.com/",
    tier: "C",
    role: "discovery",
    group: "discovery",
    feeds: loc("Fault discovery (classic cooling etc.)", "Discovery (chłodzenie klasyków itd.)", "Discovery (охлаждение классики и т.п.)"),
  },
  {
    id: "reddit_bmw",
    name: loc("Reddit (r/BMW and related)", "Reddit (r/BMW i pokrewne)", "Reddit (r/BMW и смежные)"),
    url: "https://www.reddit.com/r/BMW/",
    moreUrls: [
      { label: loc("r/E90", "r/E90", "r/E90"), url: "https://www.reddit.com/r/E90/" },
      { label: loc("r/F30", "r/F30", "r/F30"), url: "https://www.reddit.com/r/F30/" },
      { label: loc("r/BMWTech", "r/BMWTech", "r/BMWTech"), url: "https://www.reddit.com/r/BMWTech/" },
    ],
    tier: "C",
    role: "discovery",
    group: "discovery",
    feeds: loc(
      "Fault discovery only — never sole year bound",
      "Tylko discovery — nigdy same okno lat",
      "Только discovery — никогда одно окно лет",
    ),
  },

  // —— Planned soft priors / dual-check ——
  {
    id: "adac",
    name: loc("ADAC Pannenstatistik", "ADAC Pannenstatistik", "ADAC Pannenstatistik"),
    url: "https://www.adac.de/rund-ums-fahrzeug/unfall-schaden-panne/adac-pannenstatistik-2026/",
    tier: "D",
    role: "planned",
    group: "planned",
    feeds: loc(
      "Planned optional ±ε on catastrophe (not wired)",
      "Planowane opcjonalne ±ε catastrophe (niepodłączone)",
      "Планируется опционально ±ε catastrophe (не подключено)",
    ),
  },
  {
    id: "tuv",
    name: loc("TÜV Report", "TÜV Report", "TÜV Report"),
    url: "https://www.tuev-verband.de/presse/publikationen/reporte/tuev-report-autobild",
    tier: "D",
    role: "planned",
    group: "planned",
    feeds: loc(
      "Planned optional ±ε on catastrophe (not wired)",
      "Planowane opcjonalne ±ε catastrophe (niepodłączone)",
      "Планируется опционально ±ε catastrophe (не подключено)",
    ),
  },
  {
    id: "eurotax",
    name: loc("Eurotax / Autovista", "Eurotax / Autovista", "Eurotax / Autovista"),
    url: "https://eurotax.pl/autovista-api/",
    tier: "A",
    role: "planned",
    group: "planned",
    feeds: loc(
      "Planned buy dual-check (B2B) — not in live medians yet",
      "Planowana kontrola buy (B2B) — jeszcze nie w medianach",
      "Планируется проверка buy (B2B) — ещё не в медианах",
    ),
  },
  {
    id: "info_ekspert",
    name: loc("Info-Ekspert", "Info-Ekspert", "Info-Ekspert"),
    url: "https://infonet.info-ekspert.net/",
    tier: "A",
    role: "planned",
    group: "planned",
    feeds: loc(
      "Planned buy dual-check (B2B) — not in live medians yet",
      "Planowana kontrola buy (B2B) — jeszcze nie w medianach",
      "Планируется проверка buy (B2B) — ещё не в медианах",
    ),
  },
];

export function sourcesByRole(role: SourceRole) {
  return SCORE_SOURCES.filter((s) => s.role === role);
}

export function sourcesByGroup(group: SourceGroup) {
  return SCORE_SOURCES.filter((s) => s.group === group);
}
