import type { Chassis, ChassisFamily, ChassisTag, Localized } from "./types";

function ruFromEn(en: string): string {
  return en
    .replaceAll("3 Series", "3 серия")
    .replaceAll("4 Series", "4 серия")
    .replaceAll("5 Series", "5 серия")
    .replaceAll("6 Series", "6 серия")
    .replaceAll("7 Series", "7 серия")
    .replaceAll("8 Series", "8 серия")
    .replaceAll("1 Series", "1 серия")
    .replaceAll("2 Series", "2 серия")
    .replaceAll("sedan", "седан")
    .replaceAll("coupe", "купе")
    .replaceAll("cabrio", "кабриолет")
    .replaceAll("hatch", "хэтчбек")
    .replaceAll("Roadster", "родстер")
    .replaceAll("Compact", "компакт");
}

function chassis(opts: {
  slug: string;
  code: string;
  name: { en: string; pl: string; ru?: string };
  years: string;
  yearStart: number;
  yearEnd: number | null;
  tag: ChassisTag;
  family: ChassisFamily;
  gold?: boolean;
  drivetrainOf?: string;
  engines?: string[];
  extraSearch?: string[];
}): Chassis {
  const name: Localized = {
    en: opts.name.en,
    pl: opts.name.pl,
    ru: opts.name.ru ?? ruFromEn(opts.name.en),
  };
  const years = opts.yearEnd == null && opts.years.endsWith("–") ? `${opts.years}now` : opts.years;
  return {
    ...opts,
    years,
    name,
    search: [
      opts.slug,
      opts.code,
      opts.code.replace(/\s+/g, ""),
      name.pl,
      name.en,
      name.ru,
      years,
      ...(opts.engines ?? []),
      ...(opts.extraSearch ?? []),
    ].map((s) => s.toLowerCase()),
  };
}

export const chassisList: Chassis[] = [
  chassis({ slug: "e21", code: "E21", name: { pl: "Seria 3 I", en: "3 Series I" }, years: "1975–1983", yearStart: 1975, yearEnd: 1983, tag: "famous", family: "3", extraSearch: ["seria 3", "3 series"] }),
  chassis({ slug: "e30", code: "E30", name: { pl: "Seria 3 II", en: "3 Series II" }, years: "1983–1994", yearStart: 1983, yearEnd: 1994, tag: "famous", family: "3", extraSearch: ["seria 3", "3 series"] }),
  chassis({ slug: "e30-m3", code: "E30 M3", name: { pl: "M3 I (S14)", en: "M3 I (S14)" }, years: "1986–1991", yearStart: 1986, yearEnd: 1991, tag: "famous", family: "3", engines: ["S14"], extraSearch: ["m3"] }),
  chassis({ slug: "e36", code: "E36", name: { pl: "Seria 3 III", en: "3 Series III" }, years: "1990–2000", yearStart: 1990, yearEnd: 2000, tag: "both", family: "3", gold: true, engines: ["M40", "M43", "M50", "M52"], extraSearch: ["seria 3", "3 series"] }),
  chassis({ slug: "e36-compact", code: "E36 Compact", name: { pl: "3 Compact", en: "3 Compact" }, years: "1994–2000", yearStart: 1994, yearEnd: 2000, tag: "volume", family: "3", drivetrainOf: "e36", extraSearch: ["compact"] }),
  chassis({ slug: "e36-m3", code: "E36 M3", name: { pl: "M3 II", en: "M3 II" }, years: "1992–1999", yearStart: 1992, yearEnd: 1999, tag: "famous", family: "3", engines: ["S50", "S52"], extraSearch: ["m3"] }),
  chassis({ slug: "e46", code: "E46", name: { pl: "Seria 3 IV", en: "3 Series IV" }, years: "1998–2006", yearStart: 1998, yearEnd: 2006, tag: "both", family: "3", gold: true, engines: ["M54", "M47", "M57"], extraSearch: ["seria 3", "3 series", "330i", "330d", "320d"] }),
  chassis({ slug: "e46-compact", code: "E46 Compact", name: { pl: "3 Compact", en: "3 Compact" }, years: "2000–2004", yearStart: 2000, yearEnd: 2004, tag: "volume", family: "3", drivetrainOf: "e46" }),
  chassis({ slug: "e46-m3", code: "E46 M3", name: { pl: "M3 III (S54)", en: "M3 III (S54)" }, years: "2000–2006", yearStart: 2000, yearEnd: 2006, tag: "famous", family: "3", engines: ["S54"], extraSearch: ["m3"] }),
  chassis({ slug: "e90", code: "E90", name: { pl: "Seria 3 sedan V", en: "3 Series sedan V" }, years: "2005–2012", yearStart: 2005, yearEnd: 2012, tag: "volume", family: "3", gold: true, engines: ["N52", "N53", "N54", "N55", "N47", "M47", "M57", "N57", "N43", "N46"], extraSearch: ["seria 3", "3 series", "330i", "320d", "335i", "330d"] }),
  chassis({ slug: "e91", code: "E91", name: { pl: "Seria 3 Touring V", en: "3 Series Touring V" }, years: "2005–2012", yearStart: 2005, yearEnd: 2012, tag: "volume", family: "3", drivetrainOf: "e90", extraSearch: ["touring", "kombi", "seria 3", "320d", "330i"] }),
  chassis({ slug: "e92", code: "E92", name: { pl: "Seria 3 coupe V", en: "3 Series coupe V" }, years: "2006–2013", yearStart: 2006, yearEnd: 2013, tag: "volume", family: "3", drivetrainOf: "e90", extraSearch: ["coupe", "seria 3", "335i"] }),
  chassis({ slug: "e93", code: "E93", name: { pl: "Seria 3 cabrio V", en: "3 Series cabrio V" }, years: "2007–2013", yearStart: 2007, yearEnd: 2013, tag: "volume", family: "3", drivetrainOf: "e90", extraSearch: ["cabrio", "seria 3"] }),
  chassis({ slug: "e9x-m3", code: "E9x M3", name: { pl: "M3 IV (S65 V8)", en: "M3 IV (S65 V8)" }, years: "2007–2013", yearStart: 2007, yearEnd: 2013, tag: "famous", family: "3", gold: true, engines: ["S65"], extraSearch: ["m3", "e90 m3", "e92 m3"] }),
  chassis({ slug: "f30", code: "F30", name: { pl: "Seria 3 sedan VI", en: "3 Series sedan VI" }, years: "2012–2019", yearStart: 2012, yearEnd: 2019, tag: "volume", family: "3", gold: true, engines: ["N20", "N55", "B48", "N47", "B47"], extraSearch: ["seria 3", "3 series", "330i", "320d"] }),
  chassis({ slug: "f31", code: "F31", name: { pl: "Seria 3 Touring VI", en: "3 Series Touring VI" }, years: "2012–2019", yearStart: 2012, yearEnd: 2019, tag: "volume", family: "3", drivetrainOf: "f30", extraSearch: ["touring", "kombi"] }),
  chassis({ slug: "f34", code: "F34", name: { pl: "Seria 3 GT", en: "3 Series GT" }, years: "2013–2019", yearStart: 2013, yearEnd: 2019, tag: "volume", family: "3", drivetrainOf: "f30" }),
  chassis({ slug: "f80", code: "F80", name: { pl: "M3 V (S55)", en: "M3 V (S55)" }, years: "2014–2018", yearStart: 2014, yearEnd: 2018, tag: "famous", family: "3", engines: ["S55"], extraSearch: ["m3"] }),
  chassis({ slug: "g20", code: "G20", name: { pl: "Seria 3 sedan VII", en: "3 Series sedan VII" }, years: "2019–2026", yearStart: 2019, yearEnd: 2026, tag: "volume", family: "3", engines: ["B48", "B58"], extraSearch: ["seria 3", "330i", "330e"] }),
  chassis({ slug: "g21", code: "G21", name: { pl: "Seria 3 Touring VII", en: "3 Series Touring VII" }, years: "2019–2026", yearStart: 2019, yearEnd: 2026, tag: "volume", family: "3", drivetrainOf: "g20" }),
  chassis({ slug: "g80", code: "G80", name: { pl: "M3 VI (S58)", en: "M3 VI (S58)" }, years: "2021–", yearStart: 2021, yearEnd: null, tag: "famous", family: "3", extraSearch: ["m3"] }),
  chassis({ slug: "g81", code: "G81", name: { pl: "M3 Touring", en: "M3 Touring" }, years: "2022–", yearStart: 2022, yearEnd: null, tag: "famous", family: "3" }),
  chassis({ slug: "f32", code: "F32", name: { pl: "Seria 4 coupe", en: "4 Series coupe" }, years: "2013–2020", yearStart: 2013, yearEnd: 2020, tag: "volume", family: "4", engines: ["N20", "N55", "N47", "B47", "B48"] }),
  chassis({ slug: "f33", code: "F33", name: { pl: "Seria 4 cabrio", en: "4 Series cabrio" }, years: "2013–2020", yearStart: 2013, yearEnd: 2020, tag: "volume", family: "4", drivetrainOf: "f32" }),
  chassis({ slug: "f36", code: "F36", name: { pl: "4 Gran Coupé", en: "4 Gran Coupé" }, years: "2014–2021", yearStart: 2014, yearEnd: 2021, tag: "volume", family: "4", engines: ["N20", "B47", "B48"] }),
  chassis({ slug: "f82", code: "F82", name: { pl: "M4 I", en: "M4 I" }, years: "2014–2020", yearStart: 2014, yearEnd: 2020, tag: "famous", family: "4", extraSearch: ["m4"] }),
  chassis({ slug: "g22", code: "G22", name: { pl: "Seria 4 coupe II", en: "4 Series coupe II" }, years: "2020–", yearStart: 2020, yearEnd: null, tag: "volume", family: "4", engines: ["B48", "B58"] }),
  chassis({ slug: "g23", code: "G23", name: { pl: "Seria 4 cabrio II", en: "4 Series cabrio II" }, years: "2020–", yearStart: 2020, yearEnd: null, tag: "volume", family: "4", drivetrainOf: "g22" }),
  chassis({ slug: "g26", code: "G26", name: { pl: "4 Gran Coupé", en: "4 Gran Coupé" }, years: "2021–", yearStart: 2021, yearEnd: null, tag: "volume", family: "4", drivetrainOf: "g22" }),
  chassis({ slug: "g82", code: "G82", name: { pl: "M4 II", en: "M4 II" }, years: "2021–", yearStart: 2021, yearEnd: null, tag: "famous", family: "4", extraSearch: ["m4"] }),
  chassis({ slug: "i4", code: "G26 i4", name: { pl: "i4 EV", en: "i4 EV" }, years: "2021–", yearStart: 2021, yearEnd: null, tag: "famous", family: "i", extraSearch: ["i4", "ev"] }),
  chassis({ slug: "e12", code: "E12", name: { pl: "Seria 5 I", en: "5 Series I" }, years: "1972–1981", yearStart: 1972, yearEnd: 1981, tag: "famous", family: "5" }),
  chassis({ slug: "e28", code: "E28", name: { pl: "Seria 5 II", en: "5 Series II" }, years: "1981–1988", yearStart: 1981, yearEnd: 1988, tag: "famous", family: "5" }),
  chassis({ slug: "e28-m5", code: "E28 M5", name: { pl: "Pierwsze M5", en: "First M5" }, years: "1985–1988", yearStart: 1985, yearEnd: 1988, tag: "famous", family: "5", extraSearch: ["m5"] }),
  chassis({ slug: "e34", code: "E34", name: { pl: "Seria 5 III", en: "5 Series III" }, years: "1988–1996", yearStart: 1988, yearEnd: 1996, tag: "famous", family: "5" }),
  chassis({ slug: "e34-m5", code: "E34 M5", name: { pl: "M5 II", en: "M5 II" }, years: "1988–1995", yearStart: 1988, yearEnd: 1995, tag: "famous", family: "5", extraSearch: ["m5"] }),
  chassis({ slug: "e39", code: "E39", name: { pl: "Seria 5 IV", en: "5 Series IV" }, years: "1995–2004", yearStart: 1995, yearEnd: 2004, tag: "both", family: "5", gold: true, engines: ["M52", "M54", "M57", "M62"], extraSearch: ["seria 5", "530d"] }),
  chassis({ slug: "e39-m5", code: "E39 M5", name: { pl: "M5 III (S62)", en: "M5 III (S62)" }, years: "1998–2003", yearStart: 1998, yearEnd: 2003, tag: "famous", family: "5", extraSearch: ["m5"] }),
  chassis({ slug: "e60", code: "E60", name: { pl: "Seria 5 sedan V", en: "5 Series sedan V" }, years: "2003–2010", yearStart: 2003, yearEnd: 2010, tag: "both", family: "5", gold: true, engines: ["M57", "N47", "N62"], extraSearch: ["seria 5", "530d", "535d"] }),
  chassis({ slug: "e61", code: "E61", name: { pl: "Seria 5 Touring V", en: "5 Series Touring V" }, years: "2004–2010", yearStart: 2004, yearEnd: 2010, tag: "volume", family: "5", drivetrainOf: "e60" }),
  chassis({ slug: "e60-m5", code: "E60 M5", name: { pl: "M5 IV (S85 V10)", en: "M5 IV (S85 V10)" }, years: "2005–2010", yearStart: 2005, yearEnd: 2010, tag: "famous", family: "5", engines: ["S85"], extraSearch: ["m5"] }),
  chassis({ slug: "f10", code: "F10", name: { pl: "Seria 5 sedan VI", en: "5 Series sedan VI" }, years: "2010–2017", yearStart: 2010, yearEnd: 2017, tag: "volume", family: "5", gold: true, engines: ["N47", "N57", "N20", "N63"], extraSearch: ["seria 5", "530d"] }),
  chassis({ slug: "f11", code: "F11", name: { pl: "Seria 5 Touring VI", en: "5 Series Touring VI" }, years: "2010–2017", yearStart: 2010, yearEnd: 2017, tag: "volume", family: "5", drivetrainOf: "f10" }),
  chassis({ slug: "f10-m5", code: "F10 M5", name: { pl: "M5 V (S63)", en: "M5 V (S63)" }, years: "2011–2016", yearStart: 2011, yearEnd: 2016, tag: "famous", family: "5", extraSearch: ["m5"] }),
  chassis({ slug: "g30", code: "G30", name: { pl: "Seria 5 sedan VII", en: "5 Series sedan VII" }, years: "2017–2023", yearStart: 2017, yearEnd: 2023, tag: "volume", family: "5", engines: ["B47", "B48", "B57", "B58"] }),
  chassis({ slug: "g31", code: "G31", name: { pl: "Seria 5 Touring VII", en: "5 Series Touring VII" }, years: "2017–2024", yearStart: 2017, yearEnd: 2024, tag: "volume", family: "5", drivetrainOf: "g30" }),
  chassis({ slug: "f90", code: "F90", name: { pl: "M5 VI", en: "M5 VI" }, years: "2017–2023", yearStart: 2017, yearEnd: 2023, tag: "famous", family: "5", extraSearch: ["m5"] }),
  chassis({ slug: "g60", code: "G60", name: { pl: "Seria 5 sedan VIII", en: "5 Series sedan VIII" }, years: "2024–", yearStart: 2024, yearEnd: null, tag: "volume", family: "5", engines: ["B48", "B58"] }),
  chassis({ slug: "g90", code: "G90", name: { pl: "M5 VII PHEV", en: "M5 VII PHEV" }, years: "2024–", yearStart: 2024, yearEnd: null, tag: "famous", family: "5", extraSearch: ["m5"] }),
  chassis({ slug: "e87", code: "E87", name: { pl: "Seria 1 hatch I", en: "1 Series hatch I" }, years: "2004–2011", yearStart: 2004, yearEnd: 2011, tag: "volume", family: "1", gold: true, engines: ["N46", "N52", "N47", "M47"], extraSearch: ["seria 1", "120d", "n47"] }),
  chassis({ slug: "e82", code: "E82", name: { pl: "Seria 1 coupe", en: "1 Series coupe" }, years: "2007–2013", yearStart: 2007, yearEnd: 2013, tag: "volume", family: "1", engines: ["N52", "N54", "N55", "N47"], extraSearch: ["135i", "n54"] }),
  chassis({ slug: "e82-1m", code: "E82 1M", name: { pl: "1M Coupe", en: "1M Coupe" }, years: "2011–2012", yearStart: 2011, yearEnd: 2012, tag: "famous", family: "1" }),
  chassis({ slug: "e88", code: "E88", name: { pl: "Seria 1 cabrio", en: "1 Series cabrio" }, years: "2007–2014", yearStart: 2007, yearEnd: 2014, tag: "volume", family: "1", drivetrainOf: "e82" }),
  chassis({ slug: "f20", code: "F20", name: { pl: "Seria 1 hatch II", en: "1 Series hatch II" }, years: "2011–2019", yearStart: 2011, yearEnd: 2019, tag: "volume", family: "1", gold: true, engines: ["N13", "N47", "B47"], extraSearch: ["seria 1", "118d", "120d"] }),
  chassis({ slug: "f40", code: "F40", name: { pl: "Seria 1 hatch III FWD", en: "1 Series hatch III FWD" }, years: "2019–2024", yearStart: 2019, yearEnd: 2024, tag: "volume", family: "1", engines: ["B38", "B48", "B47"] }),
  chassis({ slug: "f22", code: "F22", name: { pl: "Seria 2 coupe", en: "2 Series coupe" }, years: "2014–2021", yearStart: 2014, yearEnd: 2021, tag: "volume", family: "2", engines: ["N20", "N55", "B48", "B47"] }),
  chassis({ slug: "f45", code: "F45", name: { pl: "2 Active Tourer", en: "2 Active Tourer" }, years: "2014–2021", yearStart: 2014, yearEnd: 2021, tag: "volume", family: "2", engines: ["B38", "B48", "B47"] }),
  chassis({ slug: "f87", code: "F87", name: { pl: "M2 I", en: "M2 I" }, years: "2016–2021", yearStart: 2016, yearEnd: 2021, tag: "famous", family: "2", extraSearch: ["m2"] }),
  chassis({ slug: "g42", code: "G42", name: { pl: "Seria 2 coupe II", en: "2 Series coupe II" }, years: "2021–", yearStart: 2021, yearEnd: null, tag: "famous", family: "2" }),
  chassis({ slug: "g87", code: "G87", name: { pl: "M2 II", en: "M2 II" }, years: "2023–", yearStart: 2023, yearEnd: null, tag: "famous", family: "2", extraSearch: ["m2"] }),
  chassis({ slug: "e81", code: "E81", name: { pl: "Seria 1 3-drzwiowa", en: "1 Series 3-door" }, years: "2007–2012", yearStart: 2007, yearEnd: 2012, tag: "volume", family: "1", drivetrainOf: "e87" }),
  chassis({ slug: "f44", code: "F44", name: { pl: "2 Gran Coupé", en: "2 Gran Coupé" }, years: "2020–", yearStart: 2020, yearEnd: null, tag: "volume", family: "2", engines: ["B38", "B48", "B47"] }),
  chassis({ slug: "e84", code: "E84", name: { pl: "X1 I", en: "X1 I" }, years: "2009–2015", yearStart: 2009, yearEnd: 2015, tag: "volume", family: "x", engines: ["N47", "N20", "N52"], extraSearch: ["x1"] }),
  chassis({ slug: "f48", code: "F48", name: { pl: "X1 II", en: "X1 II" }, years: "2015–2022", yearStart: 2015, yearEnd: 2022, tag: "volume", family: "x", engines: ["B47", "B48"], extraSearch: ["x1"] }),
  chassis({ slug: "u11", code: "U11", name: { pl: "X1 III", en: "X1 III" }, years: "2022–", yearStart: 2022, yearEnd: null, tag: "volume", family: "x", engines: ["B38", "B48", "B47"], extraSearch: ["x1"] }),
  chassis({ slug: "f39", code: "F39", name: { pl: "X2 I", en: "X2 I" }, years: "2018–2023", yearStart: 2018, yearEnd: 2023, tag: "volume", family: "x", engines: ["B38", "B48", "B47"], extraSearch: ["x2"] }),
  chassis({ slug: "e83", code: "E83", name: { pl: "X3 I", en: "X3 I" }, years: "2003–2010", yearStart: 2003, yearEnd: 2010, tag: "volume", family: "x", gold: true, engines: ["M54", "M47", "M57"], extraSearch: ["x3"] }),
  chassis({ slug: "f25", code: "F25", name: { pl: "X3 II", en: "X3 II" }, years: "2010–2017", yearStart: 2010, yearEnd: 2017, tag: "volume", family: "x", engines: ["N47", "N20", "N55"], extraSearch: ["x3"] }),
  chassis({ slug: "g01", code: "G01", name: { pl: "X3 III", en: "X3 III" }, years: "2017–2024", yearStart: 2017, yearEnd: 2024, tag: "volume", family: "x", engines: ["B47", "B48", "B58"], extraSearch: ["x3"] }),
  chassis({ slug: "f97", code: "F97", name: { pl: "X3 M", en: "X3 M" }, years: "2019–", yearStart: 2019, yearEnd: null, tag: "famous", family: "x", extraSearch: ["x3 m"] }),
  chassis({ slug: "f26", code: "F26", name: { pl: "X4 I", en: "X4 I" }, years: "2014–2018", yearStart: 2014, yearEnd: 2018, tag: "volume", family: "x", engines: ["N20", "N55", "N47", "B47"], extraSearch: ["x4"] }),
  chassis({ slug: "g02", code: "G02", name: { pl: "X4 II", en: "X4 II" }, years: "2018–", yearStart: 2018, yearEnd: null, tag: "volume", family: "x", engines: ["B47", "B48", "B58"], extraSearch: ["x4"] }),
  chassis({ slug: "e53", code: "E53", name: { pl: "X5 I", en: "X5 I" }, years: "1999–2006", yearStart: 1999, yearEnd: 2006, tag: "both", family: "x", gold: true, engines: ["M54", "M62", "M57"], extraSearch: ["x5"] }),
  chassis({ slug: "e70", code: "E70", name: { pl: "X5 II", en: "X5 II" }, years: "2006–2013", yearStart: 2006, yearEnd: 2013, tag: "volume", family: "x", gold: true, engines: ["M57", "N57", "N63", "N55"], extraSearch: ["x5"] }),
  chassis({ slug: "f15", code: "F15", name: { pl: "X5 III", en: "X5 III" }, years: "2013–2018", yearStart: 2013, yearEnd: 2018, tag: "volume", family: "x", engines: ["N57", "N55", "N63"], extraSearch: ["x5"] }),
  chassis({ slug: "g05", code: "G05", name: { pl: "X5 IV", en: "X5 IV" }, years: "2018–", yearStart: 2018, yearEnd: null, tag: "volume", family: "x", engines: ["B57", "B58"], extraSearch: ["x5"] }),
  chassis({ slug: "f85", code: "F85", name: { pl: "X5 M", en: "X5 M" }, years: "2015–2019", yearStart: 2015, yearEnd: 2019, tag: "famous", family: "x" }),
  chassis({ slug: "e71", code: "E71", name: { pl: "X6 I", en: "X6 I" }, years: "2008–2014", yearStart: 2008, yearEnd: 2014, tag: "volume", family: "x", engines: ["N55", "N57", "N63"], extraSearch: ["x6"] }),
  chassis({ slug: "f16", code: "F16", name: { pl: "X6 II", en: "X6 II" }, years: "2014–2019", yearStart: 2014, yearEnd: 2019, tag: "volume", family: "x", engines: ["N55", "N57", "N63"], extraSearch: ["x6"] }),
  chassis({ slug: "g06", code: "G06", name: { pl: "X6 III", en: "X6 III" }, years: "2019–", yearStart: 2019, yearEnd: null, tag: "volume", family: "x", engines: ["B57", "B58"], extraSearch: ["x6"] }),
  chassis({ slug: "f86", code: "F86", name: { pl: "X6 M", en: "X6 M" }, years: "2015–2019", yearStart: 2015, yearEnd: 2019, tag: "famous", family: "x" }),
  chassis({ slug: "g07", code: "G07", name: { pl: "X7", en: "X7" }, years: "2019–", yearStart: 2019, yearEnd: null, tag: "volume", family: "x", engines: ["B57", "B58"], extraSearch: ["x7"] }),
  chassis({ slug: "e24", code: "E24", name: { pl: "Seria 6 coupe", en: "6 Series coupe" }, years: "1976–1989", yearStart: 1976, yearEnd: 1989, tag: "famous", family: "luxury" }),
  chassis({ slug: "e63", code: "E63", name: { pl: "Seria 6 II", en: "6 Series II" }, years: "2003–2010", yearStart: 2003, yearEnd: 2010, tag: "famous", family: "luxury" }),
  chassis({ slug: "f13", code: "F13", name: { pl: "Seria 6 coupe", en: "6 Series coupe" }, years: "2011–2018", yearStart: 2011, yearEnd: 2018, tag: "famous", family: "luxury" }),
  chassis({ slug: "e23", code: "E23", name: { pl: "Seria 7 I", en: "7 Series I" }, years: "1977–1986", yearStart: 1977, yearEnd: 1986, tag: "famous", family: "luxury" }),
  chassis({ slug: "e32", code: "E32", name: { pl: "Seria 7 II", en: "7 Series II" }, years: "1986–1994", yearStart: 1986, yearEnd: 1994, tag: "famous", family: "luxury" }),
  chassis({ slug: "e38", code: "E38", name: { pl: "Seria 7 III", en: "7 Series III" }, years: "1994–2001", yearStart: 1994, yearEnd: 2001, tag: "famous", family: "luxury" }),
  chassis({ slug: "e65", code: "E65", name: { pl: "Seria 7 IV iDrive", en: "7 Series IV iDrive" }, years: "2001–2008", yearStart: 2001, yearEnd: 2008, tag: "famous", family: "luxury" }),
  chassis({ slug: "f01", code: "F01", name: { pl: "Seria 7 V", en: "7 Series V" }, years: "2008–2015", yearStart: 2008, yearEnd: 2015, tag: "volume", family: "luxury", engines: ["N57", "N63"] }),
  chassis({ slug: "g11", code: "G11", name: { pl: "Seria 7 VI", en: "7 Series VI" }, years: "2015–2022", yearStart: 2015, yearEnd: 2022, tag: "volume", family: "luxury", engines: ["B57", "B58", "N63"] }),
  chassis({ slug: "g70", code: "G70", name: { pl: "Seria 7 VII", en: "7 Series VII" }, years: "2022–", yearStart: 2022, yearEnd: null, tag: "famous", family: "luxury" }),
  chassis({ slug: "e31", code: "E31", name: { pl: "Seria 8 I", en: "8 Series I" }, years: "1989–1999", yearStart: 1989, yearEnd: 1999, tag: "famous", family: "luxury" }),
  chassis({ slug: "g15", code: "G15", name: { pl: "Seria 8 II", en: "8 Series II" }, years: "2018–", yearStart: 2018, yearEnd: null, tag: "famous", family: "luxury" }),
  chassis({ slug: "z3", code: "E36/7 Z3", name: { pl: "Z3 roadster", en: "Z3 roadster" }, years: "1995–2002", yearStart: 1995, yearEnd: 2002, tag: "famous", family: "z", extraSearch: ["z3"] }),
  chassis({ slug: "z3-m-coupe", code: "Z3 M Coupe", name: { pl: "Z3 M Coupe", en: "Z3 M Coupe" }, years: "1998–2002", yearStart: 1998, yearEnd: 2002, tag: "famous", family: "z", extraSearch: ["clownshoe", "z3m"] }),
  chassis({ slug: "e85-z4", code: "E85 Z4", name: { pl: "Z4 I", en: "Z4 I" }, years: "2002–2008", yearStart: 2002, yearEnd: 2008, tag: "famous", family: "z", extraSearch: ["z4"] }),
  chassis({ slug: "e89-z4", code: "E89 Z4", name: { pl: "Z4 II", en: "Z4 II" }, years: "2009–2016", yearStart: 2009, yearEnd: 2016, tag: "famous", family: "z", extraSearch: ["z4"] }),
  chassis({ slug: "i3", code: "I01 i3", name: { pl: "i3", en: "i3" }, years: "2013–2022", yearStart: 2013, yearEnd: 2022, tag: "famous", family: "i", extraSearch: ["i3", "ev"] }),
  chassis({ slug: "i8", code: "I12 i8", name: { pl: "i8 PHEV", en: "i8 PHEV" }, years: "2014–2020", yearStart: 2014, yearEnd: 2020, tag: "famous", family: "i", extraSearch: ["i8"] }),
];

export const chassisBySlug = new Map(chassisList.map((item) => [item.slug, item]));

export function getChassis(slug: string): Chassis | undefined {
  return chassisBySlug.get(slug);
}
