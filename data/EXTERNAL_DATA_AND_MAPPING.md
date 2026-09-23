# External data, mapping & score — context store

**Audience:** humans + agents.  
**Region:** Poland (PLN asking prices, UOKiK, Autodoc/Inter Cars).  
**North star:** every number in the UI has a stored source URL or API payload. No invented medians, repair PLN, or incidence rates.

**Related docs**
| Doc | Role |
|-----|------|
| This file | Canonical registry of **external sources**, **warehouse mapping**, **score math** |
| [`COLLECTION_REQUESTS.md`](./COLLECTION_REQUESTS.md) | Volumes, request counts, sprint backlog for all cars |
| [`DATA_PIPELINE.md`](./DATA_PIPELINE.md) | Bootstrap pipeline + warehouse layout |
| [`NO_HYPOTHESIS_PLAN.md`](./NO_HYPOTHESIS_PLAN.md) | What must never be invented |
| [`ENGINE_YEAR_CELL_PLAN.md`](./ENGINE_YEAR_CELL_PLAN.md) | Phase F: chassis × model × engine × year + full source registry (forums/Reddit/TSB) |
| [`SOURCE_DISPLAY_REFINEMENT.md`](./SOURCE_DISPLAY_REFINEMENT.md) | Shared pain packs vs cell-honest source/Autodoc display (wrong engine/chassis links) |
| `warehouse/_meta/coverage_top10.json` | Per-chassis coverage flags |
| `warehouse/_meta/collection_log.json` | Run history |
| `warehouse/citations/market_and_official.json` | Short URL registry |

---

## 1. What one model (variant) needs

A user-facing report is `chassis × badge × engine × year`.

| Field | Required? | External family | Warehouse / app path |
|-------|-----------|-----------------|----------------------|
| Identity (code, body, years) | yes | RealOEM, Wikipedia, `chassis.ts` | `warehouse/chassis/{slug}.json` |
| Engine matrix | yes | RealOEM / TecDoc | `warehouse/engines/{slug}.json` |
| `medianBuyPln` | nice→complete | **CarDossier** | `buy_prices/` → `imported/buyMedians.json` → `marketBuy.ts` |
| Top pains (≥1 sourced) | yes for score | NHTSA TSB, UOKiK, wiki, specialist articles | `pains/` → `imported/pains.json` |
| Repair PLN (parts + labor + shop tiers) | nice→complete | Workshop sites, Autodoc/IC (BOM pending) | `repair_costs/jobs/` → pain `pln_bands` |
| Campaigns | yes for score | **UOKiK** BIP, NHTSA, BMW VIN checker | `campaigns/` → `imported/campaigns.json` |
| Score 0–100 | if pains exist | derived (not scraped) | `scoreEvidence.ts` + `rules_v1.json` |
| Buy / parts deep links | yes | OTOMOTO, mobile.de, Autodoc, Inter Cars | `links.ts` (URL builders only) |
| Verdict copy | optional | editorial | `verdicts.ts` — must not invent PLN |

**Buy price never enters the 0–100 formula.**

### Twins

`drivetrainOf` in `chassis.ts` (e.g. E91→e90, F31→f30) inherit engines/pains/score from the source chassis. Listing deep links may differ by body.

---

## 2. End-to-end flow

```text
External site / API
        │
        ▼
data/warehouse/*          ← provenance JSON (source_url, collected_at, raw when useful)
        │
        ▼
src/data/imported/*       ← FE overlay (buyMedians, pains, campaigns, autodocCars)
        │
        ├── marketBuy.ts / warehousePains.ts / campaigns import
        ├── catalog.ts    ← variants + scores
        └── UI (Briefing, FaultExplain, Money)
```

| Role | Does | Does not |
|------|------|----------|
| Agent / collector | Fetch allowed sources, write warehouse with URLs | Invent PLN, fake sample sizes, mark `signed` |
| App | Read imported JSON, derive score, build deep links | Scrape OTOMOTO market medians |
| Specialist (later) | Sign score packs | — |

---

## 3. External resources registry

### 3.1 Valuation / listing medians (we store numbers)

| ID | Site / API | What we take | How collected | Maps to |
|----|------------|--------------|---------------|---------|
| **cardossier_public** | https://car-dossier.com/ceny/bmw/{seria-3,seria-5,seria-1,x5,x3} | Year table: median, p25–p75, sample, mileage | HTML scrape of public year tables | `buy_prices/cardossier_public_*.json` → `byChassisYear[slug][year]` |
| **cardossier_api** | `GET https://car-dossier.com/api/v1/market/valuation` | Median/avg/p25/p75/sample; optional `fuel_type` | API (key or 5 demo/day) | `buy_prices/cardossier_api_live_samples.json` → `fuelSpecificSamples` |
| Docs | https://car-dossier.com/en/api/ | Auth, credits | — | — |

**Chassis → CarDossier market family** (`src/lib/marketBuy.ts`):

| Chassis slug | Market model | Public URL |
|--------------|--------------|------------|
| e90, f30, e46 (+ twins) | Seria 3 | `/ceny/bmw/seria-3` |
| e60, f10, e39 (+ twins) | Seria 5 | `/ceny/bmw/seria-5` |
| e87, f20 (+ twins) | Seria 1 | `/ceny/bmw/seria-1` |
| e70 | X5 | `/ceny/bmw/x5` |
| e83 | X3 | `/ceny/bmw/x3` |

**Lookup order in app:** diesel fuel-specific API sample (if year+market match) → else series×year public median → else `null` (UI N/A).

**Caveats**
- Series-level asking medians, **not** badge-specific (335i ≠ all Seria 3).
- Public HTML currently starts ~**2009**; earlier years need API.
- Not transaction (sold) prices.

**Not used for stored medians (links only or future):** Eurotax, Info-Ekspert, OTOMOTO read API (none for market read).

---

### 3.2 Campaigns / recalls (score + Safety pains)

| ID | Site / API | What we take | How collected | Maps to |
|----|------------|--------------|---------------|---------|
| **uokik** | https://uokik.gov.pl/bip/tagi/bmw (+ detail pages) | Campaign title, severity, PL vehicles, chassis tags | HTML crawl | `campaigns/uokik_bmw_*.json` → `imported/campaigns.json` |
| **bmw_vin_pl** | https://www.bmwgroup.com/en/general/regulations/recall/recall-polish.html | VIN open/closed (user checks) | Deep link only | Pain copy / UI link |
| **nhtsa_recalls** | `GET https://api.nhtsa.gov/recalls/recallsByVehicle?make=BMW&model=…&modelYear=…` | US recall rows | REST | `campaigns/nhtsa_*.json` (evidence / samples) |
| **nhtsa_tsb** | https://www.nhtsa.gov/nhtsa-datasets-and-apis | TSB PDFs / indexes | Manual / bulk zip | Pain `sources[]` |

**Score mapping:** UOKiK rows with `chassis_slugs` including variant chassis (or drivetrain source) feed `campaigns` bucket. NHTSA is supporting evidence, not the primary PL campaign input today.

---

### 3.3 Faults / reliability priors (pains)

| ID | Site | What we take | Maps to |
|----|------|--------------|---------|
| Wikipedia engine pages | e.g. N47, N52, N54 | Known failure modes | Pain `summary` + `sources` |
| NHTSA TSB PDFs | static.nhtsa.gov | Warranty / TSB language | Pain `sources` |
| Specialist / press PL | AutoKult, ADM, AutoTechnik, Skanyx, … | Documented faults + sometimes PLN | Pain + job quotes |
| ADAC / TÜV | pannenstatistik, TÜV report | Future priors only — **not** wired into score floats | `citations/` |

Each pain must have **≥1 primary URL**. Severity tags: `engine-loss | safety | expensive | overheat | stranded | annoyance`.

---

### 3.4 Repair PLN (parts + labor)

| ID | Site | What we take | How | Maps to |
|----|------|--------------|-----|---------|
| Workshop / ASO published bands | Smorawiński, ADM, AutoKult, cenauslug, polecanymechanik, Hypertech, GearMar, … | Job totals and/or parts+labor ranges | Manual research + store URL | `repair_costs/jobs/{painId}.json` |
| Labor rates PL | kosztserwisu.pl, Auto Świat, Bawaria Motors | PLN/hour by tier | Cited table | `repair_costs/pl_labor_rates_2026.json` |
| Parts shops | rozrzad.pl, oryginalne-czesci.pl, repair-set.pl, … | Kit / unit PLN | Manual | Job `parts_pln` / quotes |
| **Autodoc** | autodoc.pl / .co.uk / .ru | Deep-link search; **SKU scrape blocked** (Cloudflare) | URL builder only today | `links.ts` + pain `autodoc_query` |
| **Inter Cars** | intercars.pl / WebAPI | Future BOM / stock | Needs B2B | `parts/` (placeholder) |
| RealOEM | realoem.com | OEM numbers / diagrams | Manual | `oemHint`, diagrams |

**Job → pain mapping**

```text
jobs/{painId}.json
  parts_pln: [lo, hi]      → pln_bands.parts
  labor_pln: [lo, hi]      → pln_bands.labor
  totals_pln.independent   → pln_bands.independent  (= parts+labor when split cited)
  totals_pln.specialist    → pln_bands.specialist
  totals_pln.aso           → pln_bands.aso
  quotes[].url             → pain sources (label prefixed “PLN · …”)
```

**Honesty rules**
- Prefer cited workshop bands over guessing.
- If specialist/ASO lack a direct quote, document uplift in the job file (do not silently invent).
- Free campaigns (Takata): `[0,0]` → UI **Free**.
- UI shows “PLN price sources” separately from fault sources (`FaultExplain.SourceList`).

---

### 3.5 Deep links only (no scraped market)

| ID | Site | Builder | Purpose |
|----|------|---------|---------|
| otomoto | otomoto.pl | `otomotoUrl()` | Buy car (PL) |
| mobile_de | mobile.de | `mobileDeUrl()` | Buy car (DE import) |
| autodoc | autodoc.pl/.co.uk/.ru | `autodocBmwUrl` / `autodocUrl` | Parts search |
| intercars | intercars.pl | `interCarsUrl()` | Parts search |

OTOMOTO official API is **dealer write/post**, not market-read — we do **not** scrape listing medians from OTOMOTO.

---

### 3.6 Identity / engines

| ID | Site | What we take | Maps to |
|----|------|--------------|---------|
| RealOEM | realoem.com/bmw | Badge × engine × year windows | `engines/`, RealOEM hints on chassis |
| Wikipedia generation pages | en.wikipedia.org | Code, years, body | `chassis/` `sources` |
| TecDoc / Autodoc car IDs | autodoc catalog | Partial vehicle path IDs | `imported/autodocCars.json` |

---

## 4. Warehouse → app file map

| Warehouse | Imported / runtime | Consumer |
|-----------|--------------------|----------|
| `buy_prices/*` | `src/data/imported/buyMedians.json` | `marketBuy.ts` → `medianBuyPln` |
| `pains/top10_sourced_pains.json` | `imported/pains.json` | `warehousePains.ts` → Fault cards |
| `campaigns/uokik_*.json` (+ nhtsa samples) | `imported/campaigns.json` | `scoreEvidence.campaignScoreForChassis` |
| `repair_costs/jobs/*.json` | folded into pain `pln_bands` + sources | WorkshopPrices UI |
| `repair_costs/pl_labor_rates_2026.json` | (rates only; BOM pending) | Future job calculator |
| `score_inputs/rules_v1.json` | mirrored in `scoreEvidence.ts` | Score |
| `chassis/`, `engines/` | taxonomy still partly `chassis.ts` | Catalog |
| `citations/market_and_official.json` | registry | Docs / agents |

---

## 5. How the 0–100 rating is calculated

**Code:** `src/lib/scoreEvidence.ts`, weights in `src/lib/score.ts`, policy in `warehouse/score_inputs/rules_v1.json`.  
**Rule id:** `score-evidence-v1`.

### 5.1 Full weight table (when all buckets present)

| Bucket | Weight | Meaning | Unlocks when |
|--------|--------|---------|--------------|
| catastrophe | 35% | Severity of headline pain | Sourced top pain |
| fiveYearFix | 25% | Expected repair PLN / 20 000 cap | Job quotes wired into score inputs |
| painLoad | 20% | Sum of severity weights on all pains | Pains list |
| campaigns | 10% | UOKiK intensity on chassis | Mapped campaigns |
| partsReality | 10% | Inverse of parts availability/price reality | Autodoc/IC stock sample |

**Buy PLN is never a score input.**

### 5.2 Current production behavior (2026-09)

`fiveYearFix` and `partsReality` are **omitted** (`expectedFix5yPln` / `partsReality` = null).  
Remaining weights **renormalize to 100%**.

UI copy may say: *“Score from sources (faults + UOKiK) — repair/parts quotes not included yet”* — this refers to the **formula**, even if repair PLN is already shown on fault cards.

```text
score = 100 − Σ ( fraction_i × scaled_weight_i )

catastrophe = CATASTROPHE[headline.severity]
  engine-loss 0.9 · safety 0.6 · expensive 0.4 · overheat 0.45 · stranded 0.35 · annoyance 0.12

painLoad = min(1, Σ PAIN_WEIGHT[severity] / 2.5)

campaigns = max over UOKiK hits on chassis:
  base(safety 0.45 else 0.2) + min(0.25, vehicles_in_pl/200000)
  + 0.05 × (extra rows); cap 0.85; no hits → 0

fiveYearFix (when present) = min(expectedFix5yPln / 20000, 1)
partsGap (when present)    = 1 − partsReality
```

### 5.3 Status labels

| Status | Meaning |
|--------|---------|
| `evidence_derived` | Score from warehouse pains + UOKiK (current) |
| `insufficient` / null score | No sourced pains for that cell |
| `signed` | Future specialist-approved pack |

---

## 6. Top-10 chassis ↔ market (bootstrap set)

| Slug | Code | Years | CarDossier family |
|------|------|-------|-------------------|
| e90 | E90 | 2005–2012 | Seria 3 |
| f30 | F30 | 2012–2019 | Seria 3 |
| e46 | E46 | 1998–2006 | Seria 3 |
| e60 | E60 | 2003–2010 | Seria 5 |
| f10 | F10 | 2010–2017 | Seria 5 |
| e39 | E39 | 1995–2004 | Seria 5 |
| e87 | E87 | 2004–2011 | Seria 1 |
| f20 | F20 | 2011–2019 | Seria 1 |
| e70 | E70 | 2006–2013 | X5 |
| e83 | E83 | 2003–2010 | X3 |

Coverage detail: `warehouse/_meta/coverage_top10.json`.  
Full-catalog phases B–D: `COLLECTION_REQUESTS.md`.

---

## 7. Collection checklist (per new chassis)

1. Write `warehouse/chassis/{slug}.json` + `engines/{slug}.json` (or inherit via `drivetrainOf`).
2. Map years → CarDossier family; pull public table and/or API; append buy rows.
3. Attach UOKiK campaigns (`chassis_slugs`); sample NHTSA if useful.
4. Ensure ≥1 sourced pain per major engine; create `repair_costs/jobs/{painId}.json` with URLs.
5. Sync pains `pln_bands` + merge quote URLs into `sources`.
6. Regenerate `src/data/imported/{buyMedians,pains,campaigns}.json`.
7. Update `_meta/coverage_*.json` + `collection_log.json`.

---

## 8. Forbidden / blocked

| Action | Why |
|--------|-----|
| Invent median / repair PLN / incidence % | Product honesty |
| Scrape OTOMOTO for market stats | No legal/API basis for read |
| Treat Autodoc search page HTML as quoted PLN without saving offer URL + price | Anti-bot + provenance |
| Put buy price into 0–100 score | Product rule |
| Mark score `signed` without specialist | Process |

**Current blockers:** CarDossier API key (years &lt;2009 + fuel splits); Autodoc/IC authenticated BOM; `partsReality` wiring.

---

## 9. Quick “where is X?” index

| Question | Answer |
|----------|--------|
| Where are buy URLs? | Job/pain sources + CarDossier URLs in `buyMedians` / warehouse buy files |
| Where is score math? | `src/lib/scoreEvidence.ts` + `rules_v1.json` |
| Where is chassis→Seria mapping? | `src/lib/marketBuy.ts` `chassisToMarketModel` |
| Where are OTOMOTO links built? | `src/lib/links.ts` |
| What still to collect for all BMWs? | `COLLECTION_REQUESTS.md` §0–2 |
| Last collection run? | `warehouse/_meta/collection_log.json` |

---

*Last updated: 2026-09-22 — aligns with top10 workshop-band PLN + public CarDossier ≥2009.*
