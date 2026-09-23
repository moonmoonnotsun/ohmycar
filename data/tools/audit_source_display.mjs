/**
 * Audit pain sources for cell-honest display + optional HTTP liveness.
 *
 *   node data/tools/audit_source_display.mjs
 *   node data/tools/audit_source_display.mjs --fetch
 *
 * Writes data/warehouse/_meta/source_link_audit.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const painsPath = path.join(root, "data/warehouse/pains/top10_sourced_pains.json");
const outPath = path.join(root, "data/warehouse/_meta/source_link_audit.json");

const doFetch = process.argv.includes("--fetch");

const ENGINE_RE = /\b(N\d{2}|M\d{2}|B\d{2}|S\d{2}|HA0|IBE0|IB1)\b/gi;
const CHASSIS_RE = /\b([EFGIZU]\d{2})\b/gi;
const SI_FALSE = /\bSI\s*B\d{2}\b/gi; // SI B11 etc. — not engine codes
const PRIOR_RE = /\b(prior|family|reused|applied to|same family)\b/i;

function stripSi(text) {
  return String(text || "").replace(SI_FALSE, " ");
}

function enginesIn(text) {
  return [...new Set((stripSi(text).toUpperCase().match(ENGINE_RE) || []))];
}

function chassisIn(text) {
  return [...new Set((String(text || "").toUpperCase().match(CHASSIS_RE) || []).map((c) => c.toLowerCase()))];
}

function sourceRole(s) {
  if (s.role) return s.role;
  if (PRIOR_RE.test(s.label || "")) return "family_prior";
  if (/^PLN\b/i.test(s.label || "")) return "pln_band";
  return "primary";
}

function appliesEngines(s) {
  if (s.applies_engines?.length) return s.applies_engines.map((e) => e.toUpperCase());
  return enginesIn(`${s.label || ""} ${s.url || ""}`);
}

function appliesChassis(s) {
  if (s.applies_chassis?.length) return s.applies_chassis.map((c) => c.toLowerCase());
  return chassisIn(`${s.label || ""}`);
}

async function checkUrl(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "user-agent": "OhMyCarSourceAudit/1.0" },
    });
    const ok = res.status >= 200 && res.status < 400;
    let snippet = "";
    if (ok) {
      const text = await res.text();
      snippet = text.replace(/\s+/g, " ").slice(0, 400);
    }
    return { url, status: res.status, ok, finalUrl: res.url, snippet };
  } catch (err) {
    return { url, status: 0, ok: false, error: String(err?.message || err) };
  } finally {
    clearTimeout(t);
  }
}

const doc = JSON.parse(fs.readFileSync(painsPath, "utf8"));
const rows = doc.rows;

const painReports = [];
const hardMismatches = [];
const autodocGaps = [];
const urls = new Map();

for (const pain of rows) {
  const packEngines = (pain.engines || []).map((e) => e.toUpperCase());
  const packChassis = (pain.chassis_slugs || []).map((c) => c.toLowerCase());
  const sources = pain.sources || [];

  const primaryCovered = new Set();
  const sourceRows = [];

  for (const s of sources) {
    const role = sourceRole(s);
    const eng = appliesEngines(s);
    const ch = appliesChassis(s);
    urls.set(s.url, s.label);

    let hard = false;
    if (role === "primary" && packEngines.length && eng.length) {
      for (const e of eng) {
        if (packEngines.includes(e)) primaryCovered.add(e);
      }
    }
    // Primary with no engine scope covers whole pack (e.g. BMW i3 wiki)
    if (role === "primary" && packEngines.length && !eng.length) {
      for (const e of packEngines) primaryCovered.add(e);
    }
    if (role === "primary" && !eng.length && packEngines.length === 0 && ch.length && packChassis.length) {
      // body primary scoped to chassis
      for (const c of ch) {
        if (packChassis.some((p) => p === c || p.startsWith(c))) primaryCovered.add(`ch:${c}`);
      }
    }

    if (hard) {
      hardMismatches.push({ painId: pain.id, label: s.label, url: s.url, eng, packEngines });
    }

    sourceRows.push({ label: s.label, url: s.url, role, applies_engines: eng, applies_chassis: ch, hard });
  }

  const uncoveredEngines = packEngines.filter((e) => !primaryCovered.has(e));

  const aq = pain.autodoc_query?.en || (typeof pain.autodoc_query === "string" ? pain.autodoc_query : "");
  const aqEng = enginesIn(aq);
  const byEng = pain.autodoc_query_by_engine || {};
  const aqMissing = packEngines.filter((e) => {
    if (byEng[e] || byEng[e.toLowerCase()]) return false;
    return !aqEng.includes(e);
  });
  if (aqMissing.length) autodocGaps.push({ painId: pain.id, packEngines, aq, aqMissing });

  painReports.push({
    id: pain.id,
    packEngines,
    chassisCount: packChassis.length,
    uncoveredEngines,
    aqMissing,
    sources: sourceRows,
  });
}

let http = null;
if (doFetch) {
  const list = [...urls.entries()];
  console.error(`Fetching ${list.length} unique URLs…`);
  http = [];
  for (let i = 0; i < list.length; i++) {
    const [url, label] = list[i];
    process.stderr.write(`  [${i + 1}/${list.length}] ${url.slice(0, 80)}\n`);
    const result = await checkUrl(url);
    http.push({ label, ...result });
  }
}

const summary = {
  collected_at: new Date().toISOString(),
  pains: rows.length,
  unique_urls: urls.size,
  hard_mismatches: hardMismatches.length,
  pains_with_uncovered_engines: painReports.filter((p) => p.uncoveredEngines.length).length,
  autodoc_gaps: autodocGaps.length,
  fetch_ran: doFetch,
  dead_urls: http ? http.filter((h) => !h.ok).length : null,
};

const out = {
  summary,
  hard_mismatches: hardMismatches,
  autodoc_gaps: autodocGaps,
  pains: painReports,
  http,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
console.log(JSON.stringify(summary, null, 2));
console.log(`Wrote ${path.relative(root, outPath)}`);
