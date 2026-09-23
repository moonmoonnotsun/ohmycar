/**
 * Phase S — annotate pain sources for cell-honest display + fill engine gaps.
 *
 *   node data/tools/phase_s_source_scope.mjs
 *
 * Mutates data/warehouse/pains/top10_sourced_pains.json
 * Then copy to src/data/imported/pains.json (same script).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const warehousePath = path.join(root, "data/warehouse/pains/top10_sourced_pains.json");
const importedPath = path.join(root, "src/data/imported/pains.json");

const ENGINE_RE = /\b(N\d{2}|M\d{2}|B\d{2}|S\d{2}|HA0|IBE0|IB1)\b/gi;
const CHASSIS_RE = /\b([EFGIZU]\d{2})\b/gi;
const SI_FALSE = /\bSI\s*B\d{2}\b/gi;
const PRIOR_RE = /\b(prior|family|reused|applied to|same family)\b/i;

/** Known Wikipedia engine pages (validated naming convention). */
const WIKI_ENGINE = {
  N13: "https://en.wikipedia.org/wiki/BMW_N13",
  N20: "https://en.wikipedia.org/wiki/BMW_N20",
  N26: "https://en.wikipedia.org/wiki/BMW_N20", // N26 covered on N20 page
  N42: "https://en.wikipedia.org/wiki/BMW_N42",
  N43: "https://en.wikipedia.org/wiki/BMW_N43",
  N46: "https://en.wikipedia.org/wiki/BMW_N46",
  N47: "https://en.wikipedia.org/wiki/BMW_N47",
  N51: "https://en.wikipedia.org/wiki/BMW_N52", // US twin, documented on N52
  N52: "https://en.wikipedia.org/wiki/BMW_N52",
  N53: "https://en.wikipedia.org/wiki/BMW_N53",
  N54: "https://en.wikipedia.org/wiki/BMW_N54",
  N55: "https://en.wikipedia.org/wiki/BMW_N55",
  N57: "https://en.wikipedia.org/wiki/BMW_N57",
  N62: "https://en.wikipedia.org/wiki/BMW_N62",
  N63: "https://en.wikipedia.org/wiki/BMW_N63",
  M10: "https://en.wikipedia.org/wiki/BMW_M10",
  M20: "https://en.wikipedia.org/wiki/BMW_M20",
  M30: "https://en.wikipedia.org/wiki/BMW_M30",
  M40: "https://en.wikipedia.org/wiki/BMW_M40",
  M42: "https://en.wikipedia.org/wiki/BMW_M42",
  M43: "https://en.wikipedia.org/wiki/BMW_M43",
  M47: "https://en.wikipedia.org/wiki/BMW_M47",
  M50: "https://en.wikipedia.org/wiki/BMW_M50",
  M52: "https://en.wikipedia.org/wiki/BMW_M52",
  M54: "https://en.wikipedia.org/wiki/BMW_M54",
  M57: "https://en.wikipedia.org/wiki/BMW_M57",
  M60: "https://en.wikipedia.org/wiki/BMW_M60",
  M62: "https://en.wikipedia.org/wiki/BMW_M62",
  B38: "https://en.wikipedia.org/wiki/BMW_B38",
  B47: "https://en.wikipedia.org/wiki/BMW_B47",
  B48: "https://en.wikipedia.org/wiki/BMW_B48",
  B57: "https://en.wikipedia.org/wiki/BMW_B57",
  B58: "https://en.wikipedia.org/wiki/BMW_B58",
  S14: "https://en.wikipedia.org/wiki/BMW_S14",
  S38: "https://en.wikipedia.org/wiki/BMW_S38",
  S50: "https://en.wikipedia.org/wiki/BMW_S50",
  S52: "https://en.wikipedia.org/wiki/BMW_S52",
  S54: "https://en.wikipedia.org/wiki/BMW_S54",
  S55: "https://en.wikipedia.org/wiki/BMW_S55",
  S58: "https://en.wikipedia.org/wiki/BMW_S58",
  S63: "https://en.wikipedia.org/wiki/BMW_S63",
  S65: "https://en.wikipedia.org/wiki/BMW_S65",
  S68: "https://en.wikipedia.org/wiki/BMW_S68",
  S62: "https://en.wikipedia.org/wiki/BMW_S62",
  S85: "https://en.wikipedia.org/wiki/BMW_S85",
};

const WIKI_CHASSIS = {
  e12: "https://en.wikipedia.org/wiki/BMW_5_Series_(E12)",
  e21: "https://en.wikipedia.org/wiki/BMW_3_Series_(E21)",
  e23: "https://en.wikipedia.org/wiki/BMW_7_Series_(E23)",
  e24: "https://en.wikipedia.org/wiki/BMW_6_Series_(E24)",
  e28: "https://en.wikipedia.org/wiki/BMW_5_Series_(E28)",
  e30: "https://en.wikipedia.org/wiki/BMW_3_Series_(E30)",
  e31: "https://en.wikipedia.org/wiki/BMW_8_Series_(E31)",
  e32: "https://en.wikipedia.org/wiki/BMW_7_Series_(E32)",
  e34: "https://en.wikipedia.org/wiki/BMW_5_Series_(E34)",
  e36: "https://en.wikipedia.org/wiki/BMW_3_Series_(E36)",
  e38: "https://en.wikipedia.org/wiki/BMW_7_Series_(E38)",
  e39: "https://en.wikipedia.org/wiki/BMW_5_Series_(E39)",
  e46: "https://en.wikipedia.org/wiki/BMW_3_Series_(E46)",
  e53: "https://en.wikipedia.org/wiki/BMW_X5_(E53)",
  e60: "https://en.wikipedia.org/wiki/BMW_5_Series_(E60)",
  e61: "https://en.wikipedia.org/wiki/BMW_5_Series_(E60)",
  e65: "https://en.wikipedia.org/wiki/BMW_7_Series_(E65)",
  e70: "https://en.wikipedia.org/wiki/BMW_X5_(E70)",
  e83: "https://en.wikipedia.org/wiki/BMW_X3_(E83)",
  e87: "https://en.wikipedia.org/wiki/BMW_1_Series_(E87)",
  e90: "https://en.wikipedia.org/wiki/BMW_3_Series_(E90)",
  e91: "https://en.wikipedia.org/wiki/BMW_3_Series_(E90)",
  e92: "https://en.wikipedia.org/wiki/BMW_3_Series_(E90)",
  e93: "https://en.wikipedia.org/wiki/BMW_3_Series_(E90)",
};

function stripSi(text) {
  return String(text || "").replace(SI_FALSE, " ");
}
function enginesIn(text) {
  return [...new Set((stripSi(text).toUpperCase().match(ENGINE_RE) || []))];
}
function chassisIn(text) {
  return [...new Set((String(text || "").toLowerCase().match(CHASSIS_RE) || []))];
}

function loc(en, pl, ru) {
  return { en, pl: pl || en, ru: ru || en };
}

function annotateSource(s, packEngines, packChassis) {
  const out = { ...s };
  const eng = out.applies_engines?.length
    ? out.applies_engines.map((e) => e.toUpperCase())
    : enginesIn(`${out.label} ${out.url}`);
  const ch = out.applies_chassis?.length
    ? out.applies_chassis.map((c) => c.toLowerCase())
    : chassisIn(out.label);

  let role = out.role;
  if (!role && PRIOR_RE.test(out.label)) role = "family_prior";
  if (!role && /^PLN\b/i.test(out.label)) role = "pln_band";
  if (!role) role = "primary";

  // Primary source that only names engines outside the pack → family prior
  if (role === "primary" && packEngines.length && eng.length && eng.every((e) => !packEngines.includes(e))) {
    role = "family_prior";
  }
  // Primary chassis wiki not on pack → family prior
  if (
    role === "primary" &&
    !packEngines.length &&
    packChassis.length &&
    ch.length &&
    ch.every((c) => !packChassis.some((p) => p === c || p.startsWith(c)))
  ) {
    role = "family_prior";
  }

  if (eng.length) out.applies_engines = eng.filter((e) => !packEngines.length || packEngines.includes(e) || role === "family_prior");
  if (role === "primary" && eng.length && packEngines.length) {
    out.applies_engines = eng.filter((e) => packEngines.includes(e));
    if (!out.applies_engines.length) {
      role = "family_prior";
      out.applies_engines = eng;
    }
  }
  if (ch.length) out.applies_chassis = ch;
  out.role = role;
  return out;
}

function ensureEngineWiki(pain, engine) {
  const url = WIKI_ENGINE[engine];
  if (!url) return null;
  const sources = pain.sources || [];
  if (sources.some((s) => s.url === url && (s.applies_engines || []).map((e) => e.toUpperCase()).includes(engine))) {
    return null;
  }
  // Also skip if same URL already present without applies — we'll annotate
  if (sources.some((s) => s.url === url)) {
    const existing = sources.find((s) => s.url === url);
    const apps = new Set([...(existing.applies_engines || []).map((e) => e.toUpperCase()), engine]);
    existing.applies_engines = [...apps];
    existing.role = existing.role || "primary";
    return null;
  }
  return {
    label: `Wikipedia · BMW ${engine}`,
    url,
    applies_engines: [engine],
    role: "primary",
  };
}

function ensureChassisWiki(pain, slug) {
  const stem = slug.split("-")[0].toLowerCase();
  const url = WIKI_CHASSIS[stem];
  if (!url) return null;
  const sources = pain.sources || [];
  if (sources.some((s) => s.url === url)) {
    const existing = sources.find((s) => s.url === url);
    const apps = new Set([...(existing.applies_chassis || []).map((c) => c.toLowerCase()), stem]);
    existing.applies_chassis = [...apps];
    if (!existing.role || existing.role === "primary") {
      // keep primary for this chassis
      existing.role = "primary";
    }
    return null;
  }
  return {
    label: `Wikipedia · BMW ${stem.toUpperCase()}`,
    url,
    applies_chassis: [stem],
    role: "primary",
  };
}

function buildAutodocByEngine(pain) {
  const engines = (pain.engines || []).map((e) => e.toUpperCase());
  if (engines.length <= 1) return undefined;
  const base = pain.autodoc_query;
  const en0 = typeof base === "string" ? base : base?.en || "";
  const pl0 = typeof base === "string" ? base : base?.pl || en0;
  const ru0 = typeof base === "string" ? base : base?.ru || en0;

  function forEngine(template, eng) {
    let out = template;
    const named = enginesIn(out);
    // Remove all pack engine tokens, then insert the open engine once after BMW or at end.
    for (const code of engines) {
      out = out.replace(new RegExp(`\\b${code}\\b`, "gi"), " ");
    }
    out = out.replace(/\s+/g, " ").replace(/\s*,\s*/g, " ").trim();
    if (/\bBMW\b/i.test(out)) {
      out = out.replace(/\bBMW\b/i, `BMW ${eng}`);
    } else if (named.length || engines.length) {
      out = `${out} ${eng}`.trim();
    }
    return out.replace(/\s+/g, " ").trim();
  }

  const by = {};
  for (const eng of engines) {
    by[eng] = loc(forEngine(en0, eng), forEngine(pl0, eng), forEngine(ru0, eng));
  }
  return by;
}

/** Pack-specific extras beyond generic wiki fill. */
const PACK_EXTRAS = {
  "water-pump": {
    // electric pump is documented on N52 wiki; N54/N55 get engine pages + N52 as family prior
    demoteUrls: {
      "https://en.wikipedia.org/wiki/BMW_N52": { applies_engines: ["N52"], role: "primary" },
    },
  },
  "eu-winter-rust": {
    force: (pain) => {
      for (const s of pain.sources) {
        if (/E90/i.test(s.label)) {
          s.applies_chassis = ["e90", "e91", "e92", "e93"];
          s.role = "family_prior"; // salt theme prior when shown off-chassis via role
        }
        if (/E39/i.test(s.label)) {
          s.applies_chassis = ["e39"];
          s.role = "family_prior";
        }
        if (/^PLN\b/i.test(s.label)) s.role = "pln_band";
      }
      // Long-tail chassis: generation wiki as primary body context
      const extras = [];
      for (const slug of pain.chassis_slugs || []) {
        const add = ensureChassisWiki(pain, slug);
        if (add) extras.push(add);
      }
      return extras;
    },
  },
  "subframe-rust": {
    force: (pain) => {
      for (const s of pain.sources) {
        if (/E90/i.test(s.label) && /Wikipedia/i.test(s.label)) {
          s.applies_chassis = ["e90", "e91", "e92", "e93"];
          s.role = "primary";
        }
        if (/E46/i.test(s.label)) {
          s.role = "family_prior";
          s.applies_chassis = ["e46"];
        }
        if (/^PLN\b/i.test(s.label)) s.role = "pln_band";
      }
      return [];
    },
  },
  "elv-cas": {
    force: (pain) => {
      for (const s of pain.sources) {
        if (/E90/i.test(s.label) && /Wikipedia/i.test(s.label)) {
          s.applies_chassis = ["e90", "e91", "e92", "e93"];
          s.role = "primary";
        }
        if (/^PLN\b/i.test(s.label)) s.role = "pln_band";
      }
      return [];
    },
  },
  "s62-rod-bearings": {
    force: (pain) => {
      for (const s of pain.sources) {
        if (/^PLN\b/i.test(s.label)) s.role = s.role || "pln_band";
      }
      return [
        {
          label: "Wikipedia · BMW S62",
          url: "https://en.wikipedia.org/wiki/BMW_S62",
          applies_engines: ["S62"],
          role: "primary",
        },
      ];
    },
  },
  "s85-smg-pump": {
    force: (pain) => {
      for (const s of pain.sources) {
        s.applies_engines = ["S85"];
        if (!s.role) s.role = "primary";
      }
      pain.autodoc_query = {
        en: "BMW S85 SMG pump motor",
        pl: "BMW S85 pompa SMG",
        ru: "BMW S85 насос SMG",
      };
      return [
        {
          label: "Wikipedia · BMW S85",
          url: "https://en.wikipedia.org/wiki/BMW_S85",
          applies_engines: ["S85"],
          role: "primary",
        },
      ];
    },
  },
  "i3-hv-battery": {
    force: (pain) => {
      for (const s of pain.sources) {
        if (/^PLN\b/i.test(s.label)) s.role = "pln_band";
      }
      return [
        {
          label: "Wikipedia · BMW i3 (battery)",
          url: "https://en.wikipedia.org/wiki/BMW_i3",
          role: "primary",
        },
      ];
    },
  },
  "i3-hv-94ah": {
    force: (pain) => {
      for (const s of pain.sources) {
        if (/^PLN\b/i.test(s.label)) s.role = "pln_band";
      }
      return [
        {
          label: "Wikipedia · BMW i3 (battery generations)",
          url: "https://en.wikipedia.org/wiki/BMW_i3",
          role: "primary",
        },
      ];
    },
  },
  "i3-hv-120ah": {
    force: (pain) => {
      for (const s of pain.sources) {
        if (/^PLN\b/i.test(s.label)) s.role = "pln_band";
      }
      return [
        {
          label: "Wikipedia · BMW i3 (120 Ah)",
          url: "https://en.wikipedia.org/wiki/BMW_i3",
          role: "primary",
        },
      ];
    },
  },
  "i4-hv-battery": {
    force: (pain) => {
      for (const s of pain.sources) {
        if (/i4/i.test(s.label) || /i4/i.test(s.url)) {
          s.applies_engines = ["HA0"];
          s.role = "primary";
        }
        if (/i3/i.test(s.label) && !/i4/i.test(s.label)) s.role = "family_prior";
      }
      pain.autodoc_query = {
        en: "BMW i4 high voltage battery",
        pl: "BMW i4 bateria HV",
        ru: "BMW i4 батарея HV",
      };
      pain.autodoc_query_by_engine = {
        HA0: {
          en: "BMW i4 high voltage battery",
          pl: "BMW i4 bateria HV",
          ru: "BMW i4 батарея HV",
        },
      };
      return [];
    },
  },
};

const doc = JSON.parse(fs.readFileSync(warehousePath, "utf8"));
let added = 0;
let annotated = 0;

for (const pain of doc.rows) {
  const packEngines = (pain.engines || []).map((e) => e.toUpperCase());
  const packChassis = (pain.chassis_slugs || []).map((c) => c.toLowerCase());

  pain.sources = (pain.sources || []).map((s) => {
    annotated++;
    return annotateSource(s, packEngines, packChassis);
  });

  const extra = PACK_EXTRAS[pain.id];
  if (extra?.demoteUrls) {
    for (const s of pain.sources) {
      const rule = extra.demoteUrls[s.url];
      if (rule) Object.assign(s, rule);
    }
  }
  if (extra?.force) {
    const more = extra.force(pain) || [];
    for (const m of more) {
      pain.sources.push(m);
      added++;
    }
  }

  // Fill missing engine wiki primaries for multi-engine (and single) packs
  if (packEngines.length) {
    const covered = new Set();
    for (const s of pain.sources) {
      if ((s.role || "primary") !== "primary") continue;
      for (const e of s.applies_engines || []) covered.add(e.toUpperCase());
    }
    for (const eng of packEngines) {
      if (covered.has(eng)) continue;
      if (/EXTENDER|RANGE/i.test(eng)) continue;
      const wiki = ensureEngineWiki(pain, eng);
      if (wiki) {
        pain.sources.push(wiki);
        added++;
        covered.add(eng);
      }
    }
  }

  // Body-only wide packs: ensure chassis wiki for each slug when no primary chassis cover
  if (!packEngines.length && packChassis.length >= 3 && !extra?.force) {
    for (const slug of packChassis) {
      const wiki = ensureChassisWiki(pain, slug);
      if (wiki) {
        pain.sources.push(wiki);
        added++;
      }
    }
  }

  const byEng = buildAutodocByEngine(pain);
  if (byEng) pain.autodoc_query_by_engine = byEng;

  // Dedupe identical url + role + applies signature
  const seen = new Set();
  pain.sources = pain.sources.filter((s) => {
    const key = `${s.url}|${s.role}|${(s.applies_engines || []).join(",")}|${(s.applies_chassis || []).join(",")}|${s.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

doc.source_scope_pass = {
  at: new Date().toISOString(),
  note: "phase_s_source_scope: applies_engines/chassis + role + wiki fill + autodoc_query_by_engine",
  sources_annotated: annotated,
  sources_added: added,
};

fs.writeFileSync(warehousePath, JSON.stringify(doc, null, 2) + "\n");
fs.writeFileSync(importedPath, JSON.stringify(doc, null, 2) + "\n");
console.log(JSON.stringify(doc.source_scope_pass, null, 2));
console.log("Wrote warehouse + imported pains.json");
