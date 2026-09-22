#!/usr/bin/env node
/**
 * Phase D: warehouse identity (+ engines) for all remaining famous/long-tail chassis.
 * Also emits a volume seed snippet JSON for app wiring.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const NOW = "2026-09-23T00:30:00Z";

/** @type {Array<{slug:string,code:string,family:string,years:[number,number|null],market:string,otomoto:string,wiki:string,engines:string[],lines:Array<{model:string,engine:string,fuel:string,years:number[],topPainId:string}>}>} */
const TAIL = [
  // Classics 3
  { slug: "e21", code: "E21", family: "3", years: [1975, 1983], market: "Seria 3", otomoto: "seria-3",
    wiki: "https://en.wikipedia.org/wiki/BMW_3_Series_(E21)", engines: ["M10", "M20"],
    lines: [{ model: "320i", engine: "M20", fuel: "petrol", years: range(1977, 1983), topPainId: "pending-classic" }] },
  { slug: "e30", code: "E30", family: "3", years: [1983, 1994], market: "Seria 3", otomoto: "seria-3",
    wiki: "https://en.wikipedia.org/wiki/BMW_3_Series_(E30)", engines: ["M10", "M20", "M40", "M42"],
    lines: [{ model: "325i", engine: "M20", fuel: "petrol", years: range(1985, 1991), topPainId: "pending-classic" }] },
  { slug: "e30-m3", code: "E30 M3", family: "3", years: [1986, 1991], market: "Seria 3", otomoto: "seria-3",
    wiki: "https://en.wikipedia.org/wiki/BMW_M3#E30", engines: ["S14"],
    lines: [{ model: "M3", engine: "S14", fuel: "petrol", years: range(1986, 1991), topPainId: "pending-s14" }] },
  { slug: "e36-m3", code: "E36 M3", family: "3", years: [1992, 1999], market: "Seria 3", otomoto: "seria-3",
    wiki: "https://en.wikipedia.org/wiki/BMW_M3#E36", engines: ["S50", "S52"],
    lines: [{ model: "M3", engine: "S50", fuel: "petrol", years: range(1992, 1999), topPainId: "pending-s50" }] },
  { slug: "e46-m3", code: "E46 M3", family: "3", years: [2000, 2006], market: "Seria 3", otomoto: "seria-3",
    wiki: "https://en.wikipedia.org/wiki/BMW_M3#E46", engines: ["S54"],
    lines: [{ model: "M3", engine: "S54", fuel: "petrol", years: range(2000, 2006), topPainId: "pending-s54" }] },
  { slug: "f80", code: "F80", family: "3", years: [2014, 2018], market: "M3", otomoto: "seria-3",
    wiki: "https://en.wikipedia.org/wiki/BMW_M3#F80", engines: ["S55"],
    lines: [{ model: "M3", engine: "S55", fuel: "petrol", years: range(2014, 2018), topPainId: "pending-s55" }] },
  { slug: "g80", code: "G80", family: "3", years: [2021, 2026], market: "M3", otomoto: "seria-3",
    wiki: "https://en.wikipedia.org/wiki/BMW_M3#G80", engines: ["S58"],
    lines: [{ model: "M3", engine: "S58", fuel: "petrol", years: range(2021, 2026), topPainId: "pending-s58" }] },
  { slug: "g81", code: "G81", family: "3", years: [2022, 2026], market: "M3", otomoto: "seria-3",
    wiki: "https://en.wikipedia.org/wiki/BMW_M3#G81", engines: ["S58"],
    lines: [{ model: "M3", engine: "S58", fuel: "petrol", years: range(2022, 2026), topPainId: "pending-s58" }] },
  // M4
  { slug: "f82", code: "F82", family: "4", years: [2014, 2020], market: "M4", otomoto: "seria-4",
    wiki: "https://en.wikipedia.org/wiki/BMW_M4#F82", engines: ["S55"],
    lines: [{ model: "M4", engine: "S55", fuel: "petrol", years: range(2014, 2020), topPainId: "pending-s55" }] },
  { slug: "g82", code: "G82", family: "4", years: [2021, 2026], market: "M4", otomoto: "seria-4",
    wiki: "https://en.wikipedia.org/wiki/BMW_M4#G82", engines: ["S58"],
    lines: [{ model: "M4", engine: "S58", fuel: "petrol", years: range(2021, 2026), topPainId: "pending-s58" }] },
  // 5 classics / M5
  { slug: "e12", code: "E12", family: "5", years: [1972, 1981], market: "Seria 5", otomoto: "seria-5",
    wiki: "https://en.wikipedia.org/wiki/BMW_5_Series_(E12)", engines: ["M10", "M30"],
    lines: [{ model: "528i", engine: "M30", fuel: "petrol", years: range(1975, 1981), topPainId: "pending-classic" }] },
  { slug: "e28", code: "E28", family: "5", years: [1981, 1988], market: "Seria 5", otomoto: "seria-5",
    wiki: "https://en.wikipedia.org/wiki/BMW_5_Series_(E28)", engines: ["M10", "M20", "M30"],
    lines: [{ model: "528i", engine: "M30", fuel: "petrol", years: range(1981, 1987), topPainId: "pending-classic" }] },
  { slug: "e28-m5", code: "E28 M5", family: "5", years: [1985, 1988], market: "Seria 5", otomoto: "seria-5",
    wiki: "https://en.wikipedia.org/wiki/BMW_M5#E28", engines: ["S38"],
    lines: [{ model: "M5", engine: "S38", fuel: "petrol", years: range(1985, 1988), topPainId: "pending-s38" }] },
  { slug: "e34", code: "E34", family: "5", years: [1988, 1996], market: "Seria 5", otomoto: "seria-5",
    wiki: "https://en.wikipedia.org/wiki/BMW_5_Series_(E34)", engines: ["M20", "M30", "M50", "M60"],
    lines: [{ model: "525i", engine: "M50", fuel: "petrol", years: range(1990, 1995), topPainId: "e36-cooling" }] },
  { slug: "e34-m5", code: "E34 M5", family: "5", years: [1988, 1995], market: "Seria 5", otomoto: "seria-5",
    wiki: "https://en.wikipedia.org/wiki/BMW_M5#E34", engines: ["S38"],
    lines: [{ model: "M5", engine: "S38", fuel: "petrol", years: range(1988, 1995), topPainId: "pending-s38" }] },
  { slug: "e39-m5", code: "E39 M5", family: "5", years: [1998, 2003], market: "Seria 5", otomoto: "seria-5",
    wiki: "https://en.wikipedia.org/wiki/BMW_M5#E39", engines: ["S62"],
    lines: [{ model: "M5", engine: "S62", fuel: "petrol", years: range(1998, 2003), topPainId: "pending-s62" }] },
  { slug: "e60-m5", code: "E60 M5", family: "5", years: [2005, 2010], market: "Seria 5", otomoto: "seria-5",
    wiki: "https://en.wikipedia.org/wiki/BMW_M5#E60", engines: ["S85"],
    lines: [{ model: "M5", engine: "S85", fuel: "petrol", years: range(2005, 2010), topPainId: "pending-s85" }] },
  { slug: "f10-m5", code: "F10 M5", family: "5", years: [2011, 2016], market: "Seria 5", otomoto: "seria-5",
    wiki: "https://en.wikipedia.org/wiki/BMW_M5#F10", engines: ["S63"],
    lines: [{ model: "M5", engine: "S63", fuel: "petrol", years: range(2011, 2016), topPainId: "pending-s63" }] },
  { slug: "f90", code: "F90", family: "5", years: [2017, 2023], market: "Seria 5", otomoto: "seria-5",
    wiki: "https://en.wikipedia.org/wiki/BMW_M5#F90", engines: ["S63"],
    lines: [{ model: "M5", engine: "S63", fuel: "petrol", years: range(2017, 2023), topPainId: "pending-s63" }] },
  { slug: "g90", code: "G90", family: "5", years: [2024, 2026], market: "Seria 5", otomoto: "seria-5",
    wiki: "https://en.wikipedia.org/wiki/BMW_M5#G90", engines: ["S68"],
    lines: [{ model: "M5", engine: "S68", fuel: "petrol", years: range(2024, 2026), topPainId: "pending-s68" }] },
  // 1/2 M
  { slug: "e82-1m", code: "E82 1M", family: "1", years: [2011, 2012], market: "Seria 1", otomoto: "seria-1",
    wiki: "https://en.wikipedia.org/wiki/BMW_1_Series_M_Coupe", engines: ["N54"],
    lines: [{ model: "1M", engine: "N54", fuel: "petrol", years: [2011, 2012], topPainId: "n54-hpfp" }] },
  { slug: "f87", code: "F87", family: "2", years: [2016, 2021], market: "Seria 2", otomoto: "seria-2",
    wiki: "https://en.wikipedia.org/wiki/BMW_M2#F87", engines: ["N55", "S55"],
    lines: [
      { model: "M2", engine: "N55", fuel: "petrol", years: range(2016, 2018), topPainId: "water-pump" },
      { model: "M2", engine: "S55", fuel: "petrol", years: range(2018, 2021), topPainId: "pending-s55" },
    ] },
  { slug: "g42", code: "G42", family: "2", years: [2021, 2026], market: "Seria 2", otomoto: "seria-2",
    wiki: "https://en.wikipedia.org/wiki/BMW_2_Series_(G42)", engines: ["B48", "B58"],
    lines: [
      { model: "220i", engine: "B48", fuel: "petrol", years: range(2021, 2026), topPainId: "n20-oil-filter" },
      { model: "M240i", engine: "B58", fuel: "petrol", years: range(2021, 2026), topPainId: "pending-b58" },
    ] },
  { slug: "g87", code: "G87", family: "2", years: [2023, 2026], market: "Seria 2", otomoto: "seria-2",
    wiki: "https://en.wikipedia.org/wiki/BMW_M2#G87", engines: ["S58"],
    lines: [{ model: "M2", engine: "S58", fuel: "petrol", years: range(2023, 2026), topPainId: "pending-s58" }] },
  // X M
  { slug: "f97", code: "F97", family: "x", years: [2019, 2026], market: "X3", otomoto: "x3",
    wiki: "https://en.wikipedia.org/wiki/BMW_X3_M", engines: ["S58"],
    lines: [{ model: "X3 M", engine: "S58", fuel: "petrol", years: range(2019, 2026), topPainId: "transfer-case" }] },
  { slug: "f85", code: "F85", family: "x", years: [2015, 2019], market: "X5", otomoto: "x5",
    wiki: "https://en.wikipedia.org/wiki/BMW_X5_M#F85", engines: ["S63"],
    lines: [{ model: "X5 M", engine: "S63", fuel: "petrol", years: range(2015, 2019), topPainId: "transfer-case" }] },
  { slug: "f86", code: "F86", family: "x", years: [2015, 2019], market: "X6", otomoto: "x6",
    wiki: "https://en.wikipedia.org/wiki/BMW_X6_M#F86", engines: ["S63"],
    lines: [{ model: "X6 M", engine: "S63", fuel: "petrol", years: range(2015, 2019), topPainId: "transfer-case" }] },
  // 6 series
  { slug: "e24", code: "E24", family: "luxury", years: [1976, 1989], market: "Seria 6", otomoto: "seria-6",
    wiki: "https://en.wikipedia.org/wiki/BMW_6_Series_(E24)", engines: ["M30"],
    lines: [{ model: "635CSi", engine: "M30", fuel: "petrol", years: range(1978, 1989), topPainId: "pending-classic" }] },
  { slug: "e63", code: "E63", family: "luxury", years: [2003, 2010], market: "Seria 6", otomoto: "seria-6",
    wiki: "https://en.wikipedia.org/wiki/BMW_6_Series_(E63)", engines: ["N62", "N52", "M57"],
    lines: [
      { model: "630i", engine: "N52", fuel: "petrol", years: range(2004, 2010), topPainId: "water-pump" },
      { model: "650i", engine: "N62", fuel: "petrol", years: range(2004, 2010), topPainId: "n62-valvetronic" },
      { model: "635d", engine: "M57", fuel: "diesel", years: range(2007, 2010), topPainId: "swirl-flaps" },
    ] },
  { slug: "f13", code: "F13", family: "luxury", years: [2011, 2018], market: "Seria 6", otomoto: "seria-6",
    wiki: "https://en.wikipedia.org/wiki/BMW_6_Series_(F06/F12/F13)", engines: ["N55", "N63", "N57"],
    lines: [
      { model: "640i", engine: "N55", fuel: "petrol", years: range(2011, 2018), topPainId: "water-pump" },
      { model: "650i", engine: "N63", fuel: "petrol", years: range(2011, 2018), topPainId: "pending-n63" },
      { model: "640d", engine: "N57", fuel: "diesel", years: range(2011, 2018), topPainId: "n57-timing" },
    ] },
  // 7 classics + g70
  { slug: "e23", code: "E23", family: "luxury", years: [1977, 1986], market: "Seria 7", otomoto: "seria-7",
    wiki: "https://en.wikipedia.org/wiki/BMW_7_Series_(E23)", engines: ["M30"],
    lines: [{ model: "735i", engine: "M30", fuel: "petrol", years: range(1979, 1986), topPainId: "pending-classic" }] },
  { slug: "e32", code: "E32", family: "luxury", years: [1986, 1994], market: "Seria 7", otomoto: "seria-7",
    wiki: "https://en.wikipedia.org/wiki/BMW_7_Series_(E32)", engines: ["M30", "M60", "M70"],
    lines: [{ model: "735i", engine: "M30", fuel: "petrol", years: range(1986, 1992), topPainId: "pending-classic" }] },
  { slug: "e38", code: "E38", family: "luxury", years: [1994, 2001], market: "Seria 7", otomoto: "seria-7",
    wiki: "https://en.wikipedia.org/wiki/BMW_7_Series_(E38)", engines: ["M60", "M62", "M73"],
    lines: [{ model: "740i", engine: "M62", fuel: "petrol", years: range(1994, 2001), topPainId: "e39-cooling" }] },
  { slug: "e65", code: "E65", family: "luxury", years: [2001, 2008], market: "Seria 7", otomoto: "seria-7",
    wiki: "https://en.wikipedia.org/wiki/BMW_7_Series_(E65)", engines: ["N62", "M67"],
    lines: [{ model: "745i", engine: "N62", fuel: "petrol", years: range(2001, 2008), topPainId: "n62-valvetronic" }] },
  { slug: "g70", code: "G70", family: "luxury", years: [2022, 2026], market: "Seria 7", otomoto: "seria-7",
    wiki: "https://en.wikipedia.org/wiki/BMW_7_Series_(G70)", engines: ["B58", "N74"],
    lines: [{ model: "740i", engine: "B58", fuel: "petrol", years: range(2022, 2026), topPainId: "pending-b58" }] },
  // 8
  { slug: "e31", code: "E31", family: "luxury", years: [1989, 1999], market: "Seria 8", otomoto: "seria-8",
    wiki: "https://en.wikipedia.org/wiki/BMW_8_Series_(E31)", engines: ["M60", "M62", "S70"],
    lines: [{ model: "840i", engine: "M60", fuel: "petrol", years: range(1993, 1996), topPainId: "pending-classic" }] },
  { slug: "g15", code: "G15", family: "luxury", years: [2018, 2026], market: "Seria 8", otomoto: "seria-8",
    wiki: "https://en.wikipedia.org/wiki/BMW_8_Series_(G15)", engines: ["B58", "N63"],
    lines: [
      { model: "840i", engine: "B58", fuel: "petrol", years: range(2018, 2026), topPainId: "pending-b58" },
      { model: "850i", engine: "N63", fuel: "petrol", years: range(2018, 2026), topPainId: "pending-n63" },
    ] },
  // Z
  { slug: "z3", code: "E36/7 Z3", family: "z", years: [1995, 2002], market: "Z3", otomoto: "z3",
    wiki: "https://en.wikipedia.org/wiki/BMW_Z3", engines: ["M44", "M52", "S50", "S54"],
    lines: [{ model: "2.8", engine: "M52", fuel: "petrol", years: range(1996, 2000), topPainId: "e36-cooling" }] },
  { slug: "z3-m-coupe", code: "Z3 M Coupe", family: "z", years: [1998, 2002], market: "Z3", otomoto: "z3",
    wiki: "https://en.wikipedia.org/wiki/BMW_Z3_M", engines: ["S50", "S54"],
    lines: [{ model: "M Coupe", engine: "S54", fuel: "petrol", years: range(2001, 2002), topPainId: "pending-s54" }] },
  { slug: "e85-z4", code: "E85 Z4", family: "z", years: [2002, 2008], market: "Z4", otomoto: "z4",
    wiki: "https://en.wikipedia.org/wiki/BMW_Z4_(E85)", engines: ["M54", "N52", "S54"],
    lines: [
      { model: "3.0i", engine: "M54", fuel: "petrol", years: range(2002, 2005), topPainId: "m54-cooling" },
      { model: "3.0si", engine: "N52", fuel: "petrol", years: range(2006, 2008), topPainId: "water-pump" },
    ] },
  { slug: "e89-z4", code: "E89 Z4", family: "z", years: [2009, 2016], market: "Z4", otomoto: "z4",
    wiki: "https://en.wikipedia.org/wiki/BMW_Z4_(E89)", engines: ["N52", "N54", "N20"],
    lines: [
      { model: "sDrive30i", engine: "N52", fuel: "petrol", years: range(2009, 2011), topPainId: "water-pump" },
      { model: "sDrive35i", engine: "N54", fuel: "petrol", years: range(2009, 2016), topPainId: "n54-hpfp" },
      { model: "sDrive28i", engine: "N20", fuel: "petrol", years: range(2011, 2016), topPainId: "n20-chain" },
    ] },
  // i
  { slug: "i3", code: "I01 i3", family: "i", years: [2013, 2022], market: "i3", otomoto: "i3",
    wiki: "https://en.wikipedia.org/wiki/BMW_i3", engines: ["IBE0"],
    lines: [{ model: "i3", engine: "IBE0", fuel: "petrol", years: range(2013, 2022), topPainId: "pending-ev" }] },
  { slug: "i4", code: "G26 i4", family: "i", years: [2021, 2026], market: "i4", otomoto: "i4",
    wiki: "https://en.wikipedia.org/wiki/BMW_i4", engines: ["HA0"],
    lines: [{ model: "eDrive40", engine: "HA0", fuel: "petrol", years: range(2021, 2026), topPainId: "pending-ev" }] },
  { slug: "i8", code: "I12 i8", family: "i", years: [2014, 2020], market: "i8", otomoto: "i8",
    wiki: "https://en.wikipedia.org/wiki/BMW_i8", engines: ["B38"],
    lines: [{ model: "i8", engine: "B38", fuel: "petrol", years: range(2014, 2020), topPainId: "pending-b38" }] },
];

function range(a, b) {
  const out = [];
  for (let y = a; y <= b; y++) out.push(y);
  return out;
}

for (const t of TAIL) {
  const yEnd = t.years[1] ?? t.years[0];
  const chassis = {
    slug: t.slug,
    code: t.code,
    family: t.family,
    years: [t.years[0], yEnd],
    market_model: t.market,
    otomoto: t.otomoto,
    gold: false,
    engines: t.engines,
    wiki: t.wiki,
    realoem_hint: "https://www.realoem.com/bmw/",
    region: "PL",
    status: "catalog_confirmed",
    phase: "D_long_tail",
    sources: [
      { provider: "wikipedia", url: t.wiki, role: "generation_identity" },
      { provider: "realoem", url: "https://www.realoem.com/bmw/", role: "parts_and_type_codes" },
      { provider: "ohmycar_chassis_ts", url: "src/data/chassis.ts", role: "product_taxonomy" },
      { provider: "otomoto", url: `https://www.otomoto.pl/osobowe/bmw/${t.otomoto}`, role: "market_deep_link" },
    ],
    collected_at: NOW,
  };
  fs.writeFileSync(path.join(ROOT, `data/warehouse/chassis/${t.slug}.json`), JSON.stringify(chassis, null, 2) + "\n");
  fs.writeFileSync(
    path.join(ROOT, `data/warehouse/engines/${t.slug}.json`),
    JSON.stringify({
      chassis_slug: t.slug,
      region: "PL",
      collected_at: NOW,
      confidence: "sourced_curated",
      phase: "D_long_tail",
      sources: [{ label: "Wikipedia", url: t.wiki }, { label: "RealOEM", url: "https://www.realoem.com/bmw/" }],
      lines: t.lines.map(({ model, engine, fuel, years }) => ({ model, engine, fuel, years })),
      line_count: t.lines.length,
    }, null, 2) + "\n",
  );
}

fs.writeFileSync(
  path.join(ROOT, "data/warehouse/_meta/phase_d_volume_seed.json"),
  JSON.stringify({ collected_at: NOW, count: TAIL.length, rows: TAIL.map((t) => ({ slug: t.slug, lines: t.lines })) }, null, 2) + "\n",
);

console.log("Phase D identity written:", TAIL.length);
