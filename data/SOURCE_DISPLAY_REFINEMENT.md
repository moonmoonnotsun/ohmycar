# Source display refinement — wrong links on the right car

**Status:** implemented 2026-09-23 (schema + UI filter + warehouse scope pass + URL audit)  
**Audience:** product + data agents  
**Region:** PL buyer UI (fault cards on `chassis × model × engine × year`)

**Related**
| Doc | Role |
|-----|------|
| [`ENGINE_YEAR_CELL_PLAN.md`](./ENGINE_YEAR_CELL_PLAN.md) | Honest year cells; pains still shared across engines/chassis |
| [`EXTERNAL_DATA_AND_MAPPING.md`](./EXTERNAL_DATA_AND_MAPPING.md) | Warehouse → import → UI |
| [`NO_HYPOTHESIS_PLAN.md`](./NO_HYPOTHESIS_PLAN.md) | Every number needs a URL — display must also **fit** the open cell |
| `src/lib/catalog.ts` `painsForLine` | Match pains to cell |
| `src/lib/painSources.ts` | Normalize / filter / Autodoc-by-engine |
| `src/components/FaultExplain.tsx` `SourceList` | Filters sources to engine/chassis; prefixes family prior |
| `src/components/Briefing.tsx` | Autodoc chip via `autodocQueryFor` |
| `data/tools/phase_s_source_scope.mjs` | Annotate + wiki fill + autodoc_by_engine |
| `data/tools/audit_source_display.mjs` | Mismatch + optional `--fetch` liveness → `_meta/source_link_audit.json` |

### Done checklist (2026-09-23)

- [x] Extend source shape (`applies_engines` / `applies_chassis` / `role`) + `autodoc_query_by_engine`
- [x] `SourceList(engine, chassisSlug)` + family-prior i18n prefix
- [x] `autodocQueryFor(pain, locale, engine)`
- [x] Warehouse annotate all 74 pains; wiki fill for uncovered engines/chassis
- [x] HTTP audit (`--fetch`); remove/replace true 404s; keep 403 bot-blocks (browser OK)
- [x] Audit: 0 hard mismatches, 0 uncovered engines, 0 autodoc gaps
- [x] Spot-check: `e88` N54 water-pump → N54 wiki + Autodoc N54; `e31` rust → E31 wiki + family prior E90/E39

---

## 1. Problem (user-visible)

On a variant page, fault cards show **Sources** / **PLN price sources** / Autodoc chips that name **another engine or chassis**.

### Confirmed examples

| Open cell | Fault | What user sees | Why it feels wrong |
|-----------|--------|----------------|--------------------|
| `e31 / 1993-840i-m60` | `eu-winter-rust` | Wikipedia E90 + E39 | E31 is on the pack; sources were written for salt-rust poster cars |
| `e88 / 2010-135i-n54` | `water-pump` | Wikipedia N52 ×2; Autodoc “N52 N55” | Pack is N52+N54+N55; wiki evidence is N52-centric |
| Same class | `subframe-rust`, `elv-cas`, OFH / HPFP “family prior” labels | E46 / E90 / N54 priors on non-matching cells | Shared PLN bands + discovery sources reused |

**Important:** matching is often *mechanically correct* (N54 does share the electric-pump theme). The bug is **display provenance**: we show the pack’s full citation list as if every URL were about *this* badge/engine/chassis.

Trust hit: buyer thinks the report is for the wrong car.

---

## 2. Root cause

### 2.1 Data model: one pain → many cells

Pains are **engine-family / body-family packs**:

```text
pain.engines[]        → which engines inherit the fault
pain.chassis_slugs[]  → which chassis inherit the fault
pain.year_from/to     → optional window
pain.sources[]        → flat list { label, url }   ← NO per-engine / per-chassis scope
pain.autodoc_query    → single Localized string    ← NO per-engine variant
pain.affects          → single Localized blurb     ← often lists poster cars only
```

Collection rule (intentional for Phase F speed): **collect once per engine family, attach many `chassis_slugs`**. That is correct for score/PLN reuse. It is wrong for naïve UI dump of `sources[]`.

### 2.2 UI: no context filter

```text
painsForVariant(variant)  →  Briefing / FaultExplain
                              SourceList(sources)     // all URLs
                              autodocQuery[locale]    // one string
```

`SourceList` never receives `variant.engine` / `chassis.slug`. Autodoc chip never templates the open engine.

### 2.3 Score vs display

| Layer | Uses | OK if shared? |
|-------|------|----------------|
| Score `fiveYearFix` | independent PLN midpoint | Yes — family prior, labeled in warehouse |
| Severity / year window | pack metadata | Yes if windows are honest |
| **Source list in UI** | every URL | **No** — looks like wrong car |
| Autodoc chip text | pack query | **No** — omits/wrong engines |

So: **shared packs are fine; unscoped display is not.**

---

## 3. Audit snapshot (imported pains, 2026-09-23)

Source: `src/data/imported/pains.json` (`rows`).

| Metric | Count |
|--------|------:|
| Total pains | 74 |
| Multi-engine packs | 21 |
| Body-only (empty `engines`) | 5 |
| Wide chassis (≥6 slugs) | 49 |
| Multi-engine packs whose **source labels omit ≥1 engine** on the pack | **15** |
| Autodoc queries missing ≥1 pack engine (or skewed) | **14** |
| Explicit “family prior / reused” PLN labels (honest but ugly on wrong cell) | ~22 |

### 3.1 Multi-engine packs with source-label skew (engines on pack vs engines named in sources)

| Pain ID | Pack engines | Sources primarily name | Uncovered on labels |
|---------|--------------|------------------------|---------------------|
| `water-pump` | N52, N54, N55 | N52 | N54, N55 |
| `timing-guides` | N46, N42 | N46 (+ stray N52) | N42 |
| `m54-cooling` | M54, M52 | M54 | M52 |
| `n20-oil-filter` | N20, N55, B48, B38, N52, N42, N46, S55 | N20/B48/N52/… | N55, B38, N42 |
| `e39-cooling` | M52, M62 | M54 prior | M52, M62 |
| `e36-cooling` | M40…S52 | (generic) | all engines |
| `b58-oil-filter` | B58, S58 | B58 | S58 |
| `classic-cooling` | M10…S38 | S38 | M10, M20, M30, S14 |
| `n52-vanos-bolts` | N52, N51, N55 | N52 | N51, N55 |
| `n52-valve-cover` | N52, N51 | N52 | N51 |
| `b47-adblue-scr` | B47, B57 | B47/N47 | B57 |
| `n53-intake-carbon` | N53, N43 | N53 (+ N54 family SI) | N43 |
| `i3-hv-*` | IBE0 / IB1 / REx | (shop URLs, no engine codes) | all codes |

### 3.2 Body packs with chassis skew

| Pain ID | Chassis on pack | Sources name | Affects text |
|---------|-----------------|--------------|--------------|
| `eu-winter-rust` | 17 (incl. **e31**, e36, e46, …) | E90, E39 wiki | E46 / E39 / E60 / E87 / X3 / X5 |
| `subframe-rust` | e90–e93 | E90 wiki + **E46** PLN | E90/E91 |
| `elv-cas` | e90–e93 | E90 | E-series electronics |

### 3.3 Autodoc query skew (examples)

| Pain | Pack | Autodoc EN | Gap |
|------|------|------------|-----|
| `water-pump` | N52/N54/N55 | `… N52 N55` | **N54 missing** |
| `swirl-flaps` | M47/M57 | `… M57` | M47 |
| `n47-n57-egr-cooler` | N47/N57 | `… N47` | N57 |
| `b58-oil-filter` | B58/S58 | `… B58` | S58 |

---

## 4. Solution principles

1. **Do not invent** new Tier-A facts to “fix” labels — reuse existing URLs with honest scoping.
2. **Keep shared packs** for score/PLN (Phase F economics). Split packs only when year/engine evidence truly diverges.
3. **Display must be cell-honest:** every visible source must either (a) name this engine/chassis, or (b) be explicitly marked **family prior**.
4. **Autodoc chip** must include the **open engine** (and prefer chassis-aware deep links already in `links.ts`).
5. **Affects** line should not list only poster cars when the open chassis is absent from that sentence.

---

## 5. Recommended solution (hybrid)

### Phase S0 — Schema (warehouse + import)

Extend each source object (backward compatible):

```json
{
  "label": "Wikipedia · BMW N52 (electric water pump)",
  "url": "https://en.wikipedia.org/wiki/BMW_N52",
  "tier": "B",
  "applies_engines": ["N52"],
  "applies_chassis": [],
  "role": "primary"
}
```

| Field | Meaning |
|-------|---------|
| `applies_engines` | If non-empty, show only when `variant.engine` ∈ list. Empty = all pack engines |
| `applies_chassis` | If non-empty, show only when open chassis (or drivetrain twin) ∈ list |
| `role` | `primary` \| `family_prior` \| `pln_band` \| `context` |

Default when fields missing (migration):

- Infer `applies_engines` from engine codes in `label`/`url` if they intersect `pain.engines`.
- Else if label matches `/prior|family|reused|applied to/i` → `role: family_prior`, show everywhere **with** UI prefix.
- Else → treat as pack-wide (today’s behavior) until curated.

Optional autodoc map:

```json
"autodoc_query_by_engine": {
  "N52": { "en": "BMW electric water pump N52", "pl": "…", "ru": "…" },
  "N54": { "en": "BMW electric water pump N54", "pl": "…", "ru": "…" },
  "N55": { "en": "BMW electric water pump N55", "pl": "…", "ru": "…" }
}
```

Fallback: interpolate `pain.autodoc_query` replacing a known engine token, or append open engine code.

### Phase S1 — UI filter (fast trust fix)

**Files:** `FaultExplain.tsx` `SourceList`, `Briefing.tsx`, types in `warehousePains.ts` / `types.ts`.

```text
SourceList({ locale, sources, engine, chassisSlug })
  1. Keep source if applies_* empty OR matches cell
  2. If role === family_prior (or only non-matching engines named):
       prefix label: "Family prior · …"
  3. Dedupe identical URLs
  4. If filter empties the list → show family_prior leftovers, never empty if pack had sources
```

Autodoc button: `autodocQueryFor(pain, variant.engine, locale)`.

Affects (optional S1.5): if `pain.affects` does not contain open `chassis.code` / engine, show:

```text
What it applies to · {engine} on {code} (family pack: {affects})
```

or shorten to engine-first line from pack `engines` ∩ cell.

### Phase S2 — Curate worst packs (data)

Priority order (user-visible volume × skew):

1. **`water-pump`** — add N54/N55 wiki or NHTSA/cooling SI where they exist; scope N52 wiki to `applies_engines: ["N52"]`; fix autodoc map.
2. **`eu-winter-rust`** — scope E90/E39 wiki to those chassis; for long-tail (e31, e28, …) either drop wiki from display or add chassis-specific body sources; rewrite `affects` to “EU salt body rust — age-dependent” + optional poster list in `context`.
3. **`subframe-rust` / `elv-cas`** — stop showing E46 PLN on E90-only pack without `applies_chassis`, or expand pack honestly.
4. **OFH mega-pack `n20-oil-filter`** — split or scope sources by engine (already partially multi-engine chaos).
5. **HPFP / EGR family priors** — keep URLs, force `role: family_prior` + clear labels (many already say “prior”).

Deliverable: warehouse edit → re-import `pains.json` (existing pipeline). No score change if PLN unchanged.

### Phase S3 — Guardrails

- Script `data/tools/audit_source_display.mjs`: fail CI (or warn in collection log) when  
  `pain.engines.length > 1` and some engine never appears in any `primary` source label/`applies_engines`.
- Agent rule in `COLLECTION_REQUESTS` / Phase F: **new sources must set `applies_*` or `role: family_prior`.**
- Do not use forum-only URLs to “fill” missing engines (NO_HYPOTHESIS).

---

## 6. Alternatives considered

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **A. Split every pack per engine×chassis** | Perfect labels | Explodes warehouse; duplicates PLN | Only when evidence diverges |
| **B. UI-only hide foreign engine names** | Fast | Hides real family evidence; empty lists | Insufficient alone |
| **C. Hybrid scope fields + UI filter + curate top packs** | Honest, cheap, keeps score | Needs migration + curation | **Chosen** |
| **D. Replace all wiki with generic “BMW electric water pump”** | Clean labels | Weaker provenance; may invent | Reject |

---

## 7. Acceptance criteria

For **every** variant page fault card:

1. No source **title** implies a different engine **unless** prefixed `Family prior ·`.
2. Autodoc chip text includes the **open** engine code (or chassis-neutral part name + engine).
3. Body-rust / electronics packs do not show only E90/E39 wiki on e31/e28/… without prior labeling or chassis-scoped sources.
4. Score / PLN bands unchanged unless a curated quote is intentionally replaced.
5. Audit script reports **0** “hard mismatches” (unscoped foreign engine in `role: primary`).

### Definition of “hard mismatch”

A source with `role: primary` (or missing role after migration treated as primary) whose `applies_engines` (or inferred codes in label) is non-empty and **does not include** `variant.engine`, while still being shown.

---

## 8. Implementation checklist

- [x] Extend `Pain["sources"]` type + `warehousePains.ts` mapping
- [x] `SourceList(engine, chassisSlug)` filter + family-prior prefix (i18n)
- [x] `autodocQueryFor(pain, engine, locale)` + `autodoc_query_by_engine`
- [x] Curate / annotate packs via `phase_s_source_scope.mjs` + re-import
- [x] `audit_source_display.mjs` + note in `collection_log.json`
- [x] Link this doc from `EXTERNAL_DATA_AND_MAPPING.md` related table
- [x] Spot-check: `e88/2010-135i-n54` water-pump; `e31/1993-840i-m60` rust

**Re-run:** `node data/tools/phase_s_source_scope.mjs` then `node data/tools/audit_source_display.mjs [--fetch]`

---

## 9. One-line product rule

> **Shared evidence packs are allowed. Unscoped source lists on a specific car are not.**
