# Plan: zero hypothesis in app data

## Status (2026-09-22 evening)

**Done without API keys (Phase A + partial E):**
- App no longer serves seed scores or seed buy medians.
- Scores = `evidence_derived` from warehouse pains + UOKiK (`rules_v1`), omitting fix/parts until quotes.
- Faults = warehouse only with source links.
- Missing buy/repair → pending / insufficient UI.

**Still blocked on accounts:** CarDossier key (buy gaps), Inter Cars (parts PLN), AIR hours (job PLN), specialist `signed`.


---

## 0. North star

```text
warehouse (cited JSON)  →  score_inputs / buy / pains / jobs  →  app import
                              ↑
                     no seed floats in src/data for product facts
```

| Allowed in app | Forbidden in app |
|----------------|------------------|
| CarDossier median with `source_url` + `sample_size` | `buy()` lerp medians |
| Pain with ≥1 primary URL | Pain without sources |
| Job PLN = parts quote + hours × cited rate | Seed `repairPln` / `expectedFix5yPln` guesses |
| Score only if `score_inputs/{slug}.json` exists and `status=evidence_derived` or `signed` | Hardcoded `catastrophe` / `painLoad` / … in `e90.ts` / `volume.ts` |
| Copy that cites a pain/campaign ID | Verdict prose asserting rates without citation |
| `insufficient` empty states | Silent fake “pretty” numbers |

**Scores stay off (or unlabeled “no pack”) until evidence packs exist.** That is the only honest way to have “no hypothesis.”

---

## 1. What is still hypothesis today (must die)

### 1.1 Product facts still invented (~everything that moves a score)

| Surface | Path | Reality |
|---------|------|---------|
| **0–100 score** | `e90.ts` / `volume.ts` → `inputsByYear` → `scoreFromInputs` | **58 engine lines**, all guessed; years often `fillYears` lerp |
| `scoreStatus` | `catalog.ts` always `"hypothesis"` | Honest label on dishonest numbers |
| `catastrophe`, `painLoad`, `campaigns`, `partsReality` | ScoreInputs 0–1 floats | No PL incidence / stock series behind them |
| `expectedFix5yPln` | Same | Not from quoted jobs |
| Seed buy medians | `medianBuyPlnByYear` | Used when warehouse miss (~171/299 cells) |
| Seed `repairPln` | EngineLine | Dead for UI but still invented in seed |
| Chassis / engine verdicts | `verdicts.ts`, `volumeEngineVerdicts.ts` | Hand prose; not evidence-gated |
| Chat claims | `lib/chat.ts` | Repeats score + prose |
| Formula constants | `SCORE_WEIGHTS`, `FIX_PLN_CAP` | Policy knobs — OK if published; not “market data” |

### 1.2 Already real (keep; expand)

| Dataset | Status |
|---------|--------|
| Pains (22) + source URLs | Wired; PLN null except free Takata |
| CarDossier series×year buy (~41 rows) + 5 API samples | Overlay when present |
| UOKiK / NHTSA campaign files | In warehouse; **not** feeding score |
| Labor rate table PL 2026 | In warehouse; **not** feeding jobs |
| Chassis taxonomy years/names | Editorial OK if cross-checked RealOEM/wiki |

### 1.3 Cannot invent even with “research”

| Field | Honest blocker |
|-------|----------------|
| True PL **failure probability** | No claim/actuarial feed |
| **Sold** prices | Only asking aggregates |
| Bulk **VIN** open/closed | RODO; BMW interactive only |
| OTOMOTO listing scrape medians | No legal/API basis for read market |

So “zero hypothesis” ≠ “magic incidence rates.” It means: **derive only what sources support; hide the rest.**

---

## 2. Target architecture

### 2.1 Warehouse tables (source of truth)

```text
data/warehouse/
  chassis/           # identity (already)
  engines/           # RealOEM matrix → app catalog (replace e90/volume engines)
  buy_prices/        # snapshots append-only
  pains/             # faults + sources (+ pln_bands when quoted)
  campaigns/         # UOKiK primary, NHTSA secondary
  repair_costs/
    pl_labor_rates_*.json
    jobs_{painId}.json      # NEW: parts lines + hours + formula result
  parts/             # quotes + outbound links
  score_inputs/      # NEW: one file per chassis slug (or per engine×year)
  _meta/
    coverage_top10.json
    validation_log.json     # NEW: pass/fail per cell
```

### 2.2 App import contract

| Import | Builds |
|--------|--------|
| `src/data/imported/buyMedians.json` | buy overlay only |
| `src/data/imported/pains.json` | faults only |
| `src/data/imported/scoreInputs.json` | **only** evidence-derived packs |
| `src/data/imported/engines.json` | engine×year matrix (no score floats) |

`catalog.ts` rules:

1. Variant exists only if engines matrix has the year.  
2. `medianBuyPln` = warehouse or **null** (UI: insufficient).  
3. `expectedRepairPln` = quoted pain jobs or **null**.  
4. `score` = computed only if score_inputs row exists; else **no score** (not 0, not hypothesis).  
5. Delete seed `inputsByYear`, seed buys, seed repairPln from shipping app data.

### 2.3 Score input derivation (written, testable)

Do **not** hand-tune floats per year. Publish a deterministic mapper + unit tests.

```text
catastrophe   = f( top pain severity, TSB/recall class, optional ADAC/TÜV soft prior capped )
painLoad      = f( count of sourced pains for engine×year, max severity )
campaigns     = f( UOKiK open campaigns for chassis, severity rubric )
expectedFix5y = Σ ( pain.job_pln_independent_mid × expected_jobs_5y[pain] )
partsReality  = f( Inter Cars stock hit-rate on pain BOM )   # else omit bucket
```

| Input | Evidence required before non-null |
|-------|-----------------------------------|
| `catastrophe` | ≥1 primary source on headline pain (TSB/UOKiK/wiki+NHTSA) + severity enum mapping table |
| `painLoad` | Pains list for that engine×year from warehouse |
| `campaigns` | ≥0 UOKiK rows mapped to chassis (0 = real zero, not guess) |
| `expectedFix5yPln` | ≥1 job quote for headline pain; others optional |
| `partsReality` | IC (or documented Autodoc) stock sample; else **drop weight** and renormalize |

**Soft priors (ADAC/TÜV):** optional ±ε on catastrophe only, capped (e.g. ±0.05), always cited. Never the sole input.

**`signed`:** specialist reviews pack → `status: signed`. Until then `evidence_derived` is OK to show if every field has a trace; or keep score hidden until signed — product choice (recommend: show `evidence_derived` with badge).

---

## 3. Source matrix (execute against)

### 3.1 Buy PLN

| Source | Use | Barrier | Validation |
|--------|-----|---------|------------|
| **CarDossier public** | Series×year asking median | Free HTML | `sample_size`, URL, snapshot date |
| **CarDossier API** | Fuel/gearbox/mileage filter; E46/E39/&lt;2009 | Key (5/day free → paid) | Store raw JSON; `INSUFFICIENT_DATA` → missing |
| Eurotax / Info-Ekspert | Optional dual check | B2B $ | Never silently replace asking median without label |

**UI label:** “asking median, series-level” until fuel-specific cell exists.

### 3.2 Faults

| Source | Use |
|--------|-----|
| NHTSA TSB zips + PDF URLs | Primary documented fault |
| UOKiK BIP | PL campaigns / safety |
| NHTSA recalls API | Secondary |
| Wikipedia / BBC | Identity / narrative only |
| ADAC / TÜV | Soft series prior only |

### 3.3 Repair PLN

```text
job_pln[tier] = Σ parts_pln + labor_hours × rate[tier]
```

| Piece | Source |
|-------|--------|
| Parts | Inter Cars WebAPI (preferred) or controlled Autodoc quotes |
| Hours | BMW AIR/AOS FRU (preferred) or documented worksheet |
| Rates | `pl_labor_rates_2026.json` (kosztserwisu / Auto Świat) |

No job file → pain PLN stays null → repair column pending.

### 3.4 Campaigns → score

1. Full crawl `uokik.gov.pl/bip/tagi/bmw`.  
2. Map chassis codes → slugs.  
3. Severity rubric (airbag &gt; fire &gt; emissions &gt; other) × optional `vehicles_in_pl` bands.  
4. Output 0–1 with formula version in JSON.

### 3.5 Parts reality

Inter Cars inventory hit-rate on BOM for top pains. No IC account → omit `partsReality` from formula (renormalize weights) rather than invent 0.8.

---

## 4. Phased rewrite (no hypothesis at each gate)

Each phase ends with: **app cannot show a fake value for that domain.**

### Phase A — Kill seed fallbacks (code, 1–2 days)

**Goal:** missing real data looks empty, not pretty-fake.

1. `medianBuyPln: number | null` — no seed buy overlay.  
2. Remove `scoreFromInputs` unless warehouse pack present → UI “no score pack”.  
3. Delete or stop shipping `inputsByYear` / seed buys / `repairPln` from runtime.  
4. Gate verdicts: only render if linked `painIds` / `campaignIds` exist; else short generic.  
5. Chat: refuse score/repair claims when null.  
6. Coverage CI: fail if any variant has score without `score_inputs` row.

**Exit:** App may look “empty” on scores/buys for many cars — correct.

### Phase B — Buy PLN complete (API, ~1 week with key)

1. Register CarDossier API.  
2. Fill E46/E39/E53 + years &lt;2009 + petrol/diesel for Seria 1/3/5/X.  
3. Append snapshots; regenerate `imported/buyMedians.json`.  
4. Mark thin cells `insufficient` (n&lt;10).  
5. UI: show sample size + “series” vs “diesel/petrol” badge.

**Exit:** No seed buy numbers remain in app.

### Phase C — Repair jobs for top pains (IC + hours, 1–2 weeks)

Priority BOM (order):

1. `n47-chain`  
2. `n20-chain`  
3. `n54-hpfp`  
4. `n47-n57-egr-cooler`  
5. `swirl-flaps`  
6. `water-pump`  
7. `timing-guides` / `m54-cooling` / `b47-egr`  

Per job file: OEM/IC SKUs, unit PLN, date, hours source, rates version, three tiers.

**Exit:** Headline pains show real PLN; `expectedRepairPln` non-null where jobs exist.

### Phase D — Campaign + TSB depth (1 week)

1. Full UOKiK tag crawl.  
2. NHTSA TSB zip filter → attach PDFs to every pain.  
3. Expand pains where TSB proves a fault currently missing.  
4. Publish `campaigns` mapper → 0–1.

### Phase E — `score_inputs/` generator (1 week)

1. Spec + tests for mapper (`scripts/build-score-inputs.ts`).  
2. Emit `warehouse/score_inputs/{slug}.json` with per engine×year:

```json
{
  "engine": "N47",
  "year": 2009,
  "inputs": { "catastrophe": 0.0, "expectedFix5yPln": 0, "painLoad": 0.0, "campaigns": 0.0, "partsReality": null },
  "traces": {
    "catastrophe": { "rule": "sev-v1", "painId": "n47-chain", "sources": ["…"] },
    "expectedFix5yPln": { "jobs": ["jobs_n47-chain.json"], "assumption": "jobs5y-v1" }
  },
  "status": "evidence_derived",
  "incomplete": ["partsReality"]
}
```

3. If `expectedFix5yPln` has no job → **omit score** for that cell (or omit fiveYearFix bucket and renormalize — pick one policy and freeze it).  
4. Import into app; delete seed score path.

**Exit:** Every on-screen score has a trace to warehouse files.

### Phase F — Specialist sign + soft priors (ongoing)

1. Specialist reviews packs → `signed`.  
2. Optional ADAC/TÜV ε, cited.  
3. Engines matrix from RealOEM as sole catalog.  
4. Archive/delete dead seed score/buy fields.

---

## 5. Validation checklist (every cell)

Before a value may appear in UI:

- [ ] `source_url` or API endpoint on record  
- [ ] `collected_at` ISO  
- [ ] `confidence` / `status` honest (`missing` / `insufficient` / `evidence_derived` / `signed`)  
- [ ] No lerp across years without a real row each year  
- [ ] Sample size stored for market stats  
- [ ] Score row includes `traces` for each used input  
- [ ] `_meta/validation_log.json` updated  
- [ ] App build fails if seed hypothesis files are imported for product facts  

---

## 6. Blockers (need you)

| Blocker | Why |
|---------|-----|
| **CarDossier API key** | E46/E39, &lt;2009, fuel splits |
| **Inter Cars B2B** | Real parts PLN + stock (`partsReality`) |
| **BMW AIR/AOS** (or accept worksheet hours) | Labor hours |
| **Policy choice** | Hide score until signed vs show `evidence_derived` |
| **OK with empty UI during Phase A?** | Required for zero hypothesis |

---

## 7. Suggested sprint order (calendar)

| Week | Deliverable |
|------|-------------|
| **0** | Phase A merge: kill seed score/buy fallbacks; empty states |
| **1** | CarDossier key → buy coverage; UI badges |
| **2** | IC account → first 3–5 job quotes; repair column live |
| **3** | UOKiK full + TSB attach; campaign mapper |
| **4** | `build-score-inputs` + app import; delete seed inputs |
| **5** | Specialist pass on top10 N47/N20/N54 packs → first `signed` |

---

## 8. Definition of done (“no hypothesis in app data”)

1. `rg` / CI: no `inputsByYear` / seed `medianBuyPlnByYear` / seed `repairPln` used at runtime.  
2. Every visible buy PLN → CarDossier (or labeled Eurotax) record.  
3. Every visible repair PLN → `jobs_*.json` quote.  
4. Every visible score → `score_inputs` with traces; status ≠ hypothesis.  
5. Every fault card → ≥1 source URL (already).  
6. Verdict/chat never invent rates; only cite warehouse IDs.  
7. Coverage matrix: `score_inputs_from_warehouse: true` for shipped chassis; else chassis is catalog-only.

---

## 9. Immediate next action

**Do Phase A first** (code only, no accounts): stop serving hypothesis scores and seed buys tomorrow. That alone enforces the rule you asked for. Parallel: you register CarDossier + Inter Cars so Phases B–C are not blocked.
