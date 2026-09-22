# Collection requests — what we need for every car

**Audience:** humans + agents collecting warehouse data.  
**Region:** Poland (PLN asking prices, UOKiK campaigns, Autodoc/Inter Cars parts).  
**North star:** every number in the UI has a stored source URL or API payload. No invented medians, repair PLN, or incidence rates.

**Related:** `DATA_PIPELINE.md`, `EXTERNAL_DATA_AND_MAPPING.md`, `NO_HYPOTHESIS_PLAN.md`, `warehouse/_meta/coverage_top10.json`.

---

## 0. Snapshot (2026-09-22)

| Layer | Today | Full catalog goal |
|-------|-------|-------------------|
| Chassis in app taxonomy | **100** (`src/data/chassis.ts`) | same |
| Chassis with warehouse identity + engines | **10** (top10) | **100** (twins can inherit engines) |
| Chassis with scored variants in UI | **~18** (~592 engine×year cells incl. twins) | all gold + volume + twins |
| Sourced pains | **22** | ~80–120 unique engine faults (many engines shared) |
| Pains with real repair PLN | **22** (workshop bands; Autodoc BOM still pending) | Autodoc/IC SKU lines |
| Buy year-rows (series-level) | **~55** overlay cells (public ≥2009) | API for <2009 |
| Buy fuel/badge splits | **5** API samples | diesel/petrol (then badge) per high-volume cell |
| Repair job quotes | **21** workshop-band files | Autodoc/IC BOM upgrade |
| Collection scripts | **none** (manual agent import) | scripted warehouse → `src/data/imported/` |

**Bottom line (2026-09-22 night):** top10 + gold (e36/e9x-m3/e53) + C1 volume (e84/f48/f25/f15/g20). Public buy expanded (X1 + more years). Still blocked: API for &lt;2009 buy, Autodoc SKU BOMs, B48/B58 sourced pains.

---

## 1. What one complete variant needs

A user-facing report for `chassis × model × engine × year` needs these fields:

| Field | Required for “complete”? | Source family | Notes |
|-------|--------------------------|---------------|-------|
| Identity (code, body, years) | yes | RealOEM + wiki + `chassis.ts` | Editorial OK if cited |
| Engine matrix row | yes | RealOEM / TecDoc | Year window must be real |
| `medianBuyPln` | nice → complete | CarDossier | Asking median; label series vs fuel |
| `expectedRepairPln` | nice → complete | Autodoc/IC + hours × labor | Null until quoted |
| Top pains (≥1 sourced) | yes for score | NHTSA TSB + UOKiK + wiki | ≥1 primary URL |
| Campaigns count | yes for score | UOKiK BIP | Zero is valid |
| Score 0–100 | yes if pains exist | `scoreEvidence` + `rules_v1` | Omits fix/parts until quotes |
| Deep links buy/parts | yes | OTOMOTO, Autodoc, IC, mobile.de | Links only — not scrapes |
| Verdict copy | optional | editorial | Must not invent PLN/engines |

**Buy price never enters the 0–100 formula.**

### Score buckets still empty until collection

| Bucket | Weight | Unlock when |
|--------|--------|-------------|
| catastrophe | 35% | sourced top pain (done for many) |
| painLoad | 20% | pains list for engine×year |
| campaigns | 10% | UOKiK mapped to chassis |
| fiveYearFix | 25% | **job PLN quotes** |
| partsReality | 10% | **parts stock/price sample** |

---

## 2. Volume math — how much data?

### 2.1 Phases

| Phase | Scope | Chassis files | Rough engine×year cells | Why |
|-------|-------|---------------|-------------------------|-----|
| **A — Finish top10** | e90 f30 e46 e60 f10 e39 e87 f20 e70 e83 (+ twins) | 10 | ~300 source / ~590 w/ twins | Ship honest scores + PLN |
| **B — Remaining gold** | e36, e9x-m3, e53 (+ twins if any) | +3 | ~40–80 | Already marketed as gold |
| **C — Volume rest** | F/G X1–X5, 1/2/4/5 common | ~25 | ~400–600 | PL listing volume |
| **D — Long tail** | M cars, 6/7/8, Z, i, classics | ~60 | optional | Links + identity first; scores later |

### 2.2 Estimated request counts (Phase A complete)

| Dataset | Unit | Est. calls / pages | Blocker |
|---------|------|--------------------|---------|
| CarDossier public HTML | series pages | 5–8 pages (already partly done) | none |
| CarDossier valuation API | series×year | ~80–120 (fill E46/E39 + early years) | API key |
| CarDossier valuation API | + fuel split | ×2 → **~160–240** | credits (8 ea) |
| CarDossier valuation API | + badge/model where API resolves `320d` | optional +50–100 | credits |
| UOKiK BIP crawl | tag pages + detail | ~50–150 HTML | none |
| NHTSA recallsByVehicle | make/model/year | ~200–400 GET | none |
| NHTSA TSB zip filter | BMW docs | 1–3 bulk downloads | disk |
| Autodoc / IC part quotes | per pain BOM line | **~21 pains × 3–8 SKUs** = 60–170 quotes | IC account / anti-bot |
| Labor hours | per pain | 21 worksheets | AIR/FRU or shop sheet |
| RealOEM engine matrices | per chassis | 10 (top10) then 90 | manual/semi |

**CarDossier credit ballpark (Phase A fuel splits):**  
200 calls × 8 credits = **1 600 credits** (~$16 if 1 credit = $0.01). Demo = 5/IP/day — not enough.

### 2.3 Estimated request counts (full catalog Phase B–D)

| Dataset | Est. | Notes |
|---------|------|-------|
| Chassis identity JSON | 90 files | wiki + OTOMOTO deep link + engine code list |
| Engine matrices | 40–70 unique drivetrains | twins inherit |
| CarDossier series×year | ~500–900 valuations | many years sparse → `INSUFFICIENT` |
| Fuel splits on high-volume only | +300–500 | don’t fuel-split every classic |
| New pains (unique engines) | +40–80 rows | N62, N63, B58, B57, S55… |
| Job quotes | +40–80 jobs | prioritize engine-loss / safety |
| UOKiK mapping | expand crawl | one campaign hits many slugs |

---

## 3. Exact requests by resource

Store every response under `data/warehouse/` with `collected_at`, `source_url` / `endpoint`, and raw payload when useful.

### 3.1 Buy prices — CarDossier

**Docs:** https://car-dossier.com/en/api/docs  
**Base:** `https://car-dossier.com/api/v1`  
**Auth:** `X-API-Key: …` (or 5 demo/day without key)

#### A) Public HTML (series year tables)

| Series | URL |
|--------|-----|
| BMW hub | https://car-dossier.com/ceny/bmw |
| Seria 3 | https://car-dossier.com/ceny/bmw/seria-3 |
| Seria 5 | https://car-dossier.com/ceny/bmw/seria-5 |
| Seria 1 | https://car-dossier.com/ceny/bmw/seria-1 |
| X5 | https://car-dossier.com/ceny/bmw/x5 |
| X3 | https://car-dossier.com/ceny/bmw/x3 |
| X1 / X6 / … | discover from hub |

**Collect per year-row:** `median`, `p25`, `p75`, `sample_size`, `collected_at`, page URL.  
**Write:** `buy_prices/cardossier_public_by_year.json` (append snapshot).

#### B) Valuation API (fill gaps + fuel)

```http
GET /market/valuation?make=BMW&model=3%20Series&year=2010&fuel_type=diesel
Header: X-API-Key: YOUR_KEY
```

| Param | Values |
|-------|--------|
| `make` | `BMW` |
| `model` | `3 Series`, `5 Series`, `1 Series`, `X5`, `X3`, or badge if resolved (`320d`) |
| `year` | production year |
| `fuel_type` | `diesel` \| `petrol` (or PL `Diesel` / `Benzyna`) |
| `gearbox` | optional `manual` / `automatic` |
| `mileage` | optional km (±30% band) |

**Also useful later:**

```http
GET /market/price-history?make=BMW&model=3%20Series&year=2015
GET /market/liquidity?make=BMW&model=3%20Series&year=2015
GET /market/regional?make=BMW&model=3%20Series&year=2015
```

**Priority query list (Phase A):**

1. Every missing year for **E46 / E39** (public tables start ~2009).  
2. Early **E90 / E60 / E83 / E87** years before public table.  
3. For each top10 year with sample ≥50: repeat with `fuel_type=diesel` and `petrol`.  
4. Optional: badge-level where API matches (`320d`, `330i`).

**UI rule:** until fuel-specific exists, show series median and label *asking median, series-level*.

**Do not:** scrape OTOMOTO for market medians (no legal read API).

#### C) Optional dual-check (B2B)

| Source | URL | When |
|--------|-----|------|
| Eurotax PL | https://eurotax.pl/autovista-api/ | insurance-grade check |
| Info-Ekspert | https://infonet.info-ekspert.net/ | base values |

Never silently replace CarDossier asking median without a UI label.

---

### 3.2 Campaigns / recalls

#### UOKiK (primary PL)

| Step | Request |
|------|---------|
| 1 | Crawl https://uokik.gov.pl/bip/tagi/bmw |
| 2 | Follow every BIP notice link (full crawl already started → `campaigns/uokik_bmw_full_crawl.json`) |
| 3 | Extract: title, date, chassis codes, `vehicles_in_pl` if published, severity class |
| 4 | Map codes → `chassis_slugs[]` |
| 5 | Publish score-facing subset → `src/data/imported/campaigns.json` |

**Known batches:**

- https://uokik.gov.pl/bip/samochody-bmw  
- https://uokik.gov.pl/bip/samochody-bmw-1  
- https://uokik.gov.pl/bip/samochody-bmw-rozne-modele  

VIN open/closed is **not** bulk — user uses BMW VIN checker at inspection time:  
https://www.bmwgroup.com/en/general/regulations/recall/recall-polish.html

#### NHTSA (secondary / discovery)

```http
GET https://api.nhtsa.gov/recalls/recallsByVehicle?make=BMW&model=3%20SERIES&modelYear=2012
GET https://api.nhtsa.gov/recalls/recallsByVehicle?make=BMW&model=X5&modelYear=2010
```

Also: https://www.nhtsa.gov/nhtsa-datasets-and-apis (TSB / manufacturer communications zips).

**Collect:** `CampaignNumber`, `Component`, `Summary`, `ModelYear`, URL.  
**Write:** `campaigns/nhtsa_*.json` — cite in pains; map into score only with an explicit rubric.

---

### 3.3 Faults / pains

| Source | How to request | Store |
|--------|----------------|-------|
| NHTSA TSB ZIP | Download BMW manufacturer communications from NHTSA datasets page | PDF URL + fault id |
| Example TSB PDFs | Direct `static.nhtsa.gov/odi/tsbs/...` links already used | `sources[]` |
| Wikipedia engine | `https://en.wikipedia.org/wiki/BMW_N47` (etc.) | secondary |
| ADAC Pannenstatistik | https://www.adac.de/.../adac-pannenstatistik-2026/ | soft series prior only (±ε) |
| TÜV Report | https://www.tuev-verband.de/.../tuev-report-autobild | soft series prior only |

**Per pain record (required shape):**

```json
{
  "id": "n47-chain",
  "engines": ["N47"],
  "chassis_slugs": ["e90", "f30", "..."],
  "year_from": 2007,
  "year_to": null,
  "severity": "engine-loss|safety|overheat|expensive|stranded|annoyance",
  "title": { "en": "...", "pl": "...", "ru": "..." },
  "summary": { "en": "...", "pl": "...", "ru": "..." },
  "affects": { "en": "...", "pl": "...", "ru": "..." },
  "sources": [{ "label": "...", "url": "https://..." }],
  "autodoc_query": { "en": "...", "pl": "...", "ru": "..." },
  "pln_bands": null
}
```

**Severity meanings (UI tags):** Engine / Safety / Overheat / Expensive / Immobilised / Minor — see product copy in `i18n` (`sevHelp*`).

**Backlog engines without dedicated pains yet (examples):** N62, N63, N73, S54, S55, S58, B57, B58, XB7, early M57 quirks beyond current set, F-series transfer case expansion, etc.

---

### 3.4 Repair PLN (parts + labor)

```text
job_pln[tier] = Σ(parts_pln) + labor_hours × rate[tier]
tiers = independent | specialist | ASO
```

#### Labor rates (done — refresh yearly)

- https://kosztserwisu.pl/cennik-napraw/  
- https://kosztserwisu.pl/modele-samochodow/bmw/  
- Auto Świat independent vs ASO article (cited in warehouse)  
→ `repair_costs/pl_labor_rates_2026.json`

#### Parts quotes (missing)

| Source | Access | Request pattern |
|--------|--------|-----------------|
| **Inter Cars WebAPI** | B2B account | https://docs.webapi.intercars.eu/ic-api/contracts/api — search by OEM / TecDoc |
| **Autodoc.pl** | consumer | Search `autodoc_query`; save offer price + URL (Cloudflare often blocks bots) |
| **RealOEM** | public | https://www.realoem.com/bmw/ — OEM numbers / diagrams only |

**Per pain create:** `repair_costs/jobs/{painId}.json`

```json
{
  "pain_id": "n47-chain",
  "collected_at": "ISO",
  "labor_hours": { "independent": 12.0, "source": "..." },
  "parts": [
    { "sku": "...", "name": "...", "qty": 1, "pln": 0, "source_url": "..." }
  ],
  "totals_pln": { "independent": null, "specialist": null, "aso": null },
  "status": "quoted|partial|missing"
}
```

**Phase A target:** quote all **21** non-free pains (chain, HPFP, VANOS, EGR, subframe, water pump, …).

#### Hours sources

| Preferred | Fallback |
|-----------|----------|
| BMW AIR / AOS FRU times | Documented independent worksheet with URL/PDF |

---

### 3.5 Identity / engines

| Source | URL | Collect |
|--------|-----|---------|
| RealOEM | https://www.realoem.com/bmw/ | badge × engine × fuel × yearFrom–yearTo |
| Wikipedia generation | per chassis `sources` | name, years, body |
| TecDoc / Autodoc car IDs | already partial in `imported/autodocCars.json` | expand to all chassis |

**Write:** `warehouse/chassis/{slug}.json`, `warehouse/engines/{slug}.json`.  
**Twins** (`e91→e90`, `f31→f30`, …): inherit engines; separate chassis file only for body listing links.

---

### 3.6 Where to buy (deep links only — already wired)

| Site | Role | Builder |
|------|------|---------|
| OTOMOTO | primary PL listings | `src/lib/links.ts` |
| mobile.de | DE import | same |
| Autodoc / Inter Cars | parts | same |

No listing scrape. No OTOMOTO market-read API.

---

## 4. Coverage checklist matrix

Copy into `_meta/` when expanding.

| Slug | identity | engines | buy_years | buy_fuel | uokik | nhtsa | pains≥1 | jobs_pln | parts_reality |
|------|----------|---------|-----------|----------|-------|-------|---------|----------|---------------|
| e90 | ✅ | ✅ | partial | sample | ✅ | sample | ✅ | ❌ | ❌ |
| f30 | ✅ | ✅ | ✅ | sample | ✅ | ❌ | ✅ | ❌ | ❌ |
| e46 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| e60 | ✅ | ✅ | partial | ❌ | ❌ | sample | ✅ | ❌ | ❌ |
| f10 | ✅ | ✅ | ✅ | sample | ✅ | ❌ | ✅ | ❌ | ❌ |
| e39 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| e87 | ✅ | ✅ | partial | sample | ✅ | sample | ✅ | ❌ | ❌ |
| f20 | ✅ | ✅ | ✅ | sample | ✅ | ❌ | ✅ | ❌ | ❌ |
| e70 | ✅ | ✅ | ✅ | sample | ❌ | sample | ✅ | ❌ | ❌ |
| e83 | ✅ | ✅ | partial | ❌ | ✅ | sample | ✅ | ❌ | ❌ |
| e36 / e9x-m3 / e53 | ✅ | ✅ | e9x≥2009; e36/e53 API | ❌ | thin | ❌ | ✅ | ✅ jobs | ❌ |
| e84 / f48 / f25 / f15 | ✅ | ✅ | ✅ public | ❌ | ❌ | ❌ | ✅ reuse | ✅ reuse | ❌ |
| g20 | ✅ | ✅ | ✅ public | ❌ | ❌ | ❌ | ✅ B48 OFHG; B58 pending | thin | ❌ |
| other ~80 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 5. Sprint plan (recommended order)

### Sprint 1 — Unlock PLN + finish top10 honesty (1–2 weeks)

1. CarDossier API key → E46/E39 years + early E90/E60/E83.  
2. Fuel splits for F30/E90/F10/E70 high-sample years.  
3. Quote **top 10 pains by severity** (engine-loss + safety first) → `jobs_*.json`.  
4. Map full UOKiK crawl → score `campaigns.json`.  
5. Script: warehouse → `src/data/imported/{buyMedians,pains,campaigns}.json`.

### Sprint 2 — Parts reality + engines truth

1. Inter Cars B2B → stock/price samples for pain BOMs → `partsReality`.  
2. RealOEM pass on top10 engines (replace curated guesses).  
3. Warehouse files for **e53, e36, e9x-m3**.

### Sprint 3 — Volume expansion

1. Chassis+engines for next 20 PL-volume codes (X1 F48/E84, X5 F15, G20, F25…).  
2. CarDossier series×year for those families.  
3. New pains only for engines not already covered.

### Sprint 4 — Long tail

1. Identity + OTOMOTO/Autodoc links for remaining chassis.  
2. Scores only when ≥1 sourced pain exists; otherwise `insufficient` UI (already supported).

---

## 6. Agent import checklist (every batch)

- [ ] Source URL or API endpoint on each row  
- [ ] `collected_at` ISO  
- [ ] Honest `status` / `confidence` (`missing` if empty)  
- [ ] No invented PLN or sample sizes  
- [ ] Update `_meta/collection_log.json` + coverage matrix  
- [ ] Append buy snapshots (don’t silently overwrite history)  
- [ ] Rebuild `src/data/imported/*` before ship  
- [ ] UI still shows pending when null — never fake pretty numbers  

---

## 7. Blockers (need humans)

| Blocker | Why | Link |
|---------|-----|------|
| **CarDossier API key** | E46/E39 + fuel splits; demo 5/day | https://car-dossier.com/en/api/ |
| **Inter Cars B2B** | Real parts PLN / stock | https://docs.webapi.intercars.eu/ |
| **Labor hours source** | Job totals without guessing | AIR/FRU or shop worksheets |
| **Specialist sign-off** | `scoreStatus: signed` | human |
| **Legal** | No OTOMOTO listing scrape for medians | use CarDossier |

---

## 8. Short answer

**To finish “all other cars” honestly you need:**

1. **~90 chassis identity + engine matrices** (twins inherit).  
2. **Hundreds of CarDossier valuations** (series×year, then fuel on volume cells).  
3. **~40–80 more sourced pains** for engines not in the current 22.  
4. **~60–100 repair job quotes** (parts + hours × labor) — the biggest product gap today.  
5. **Full UOKiK mapping** + selective NHTSA.  
6. **No** homemade OTOMOTO scrape; **no** invented scores.

**Minimum to make top10 feel “done”:** Sprint 1 only — buy gaps + job PLN for headline pains + campaigns wired. Everything else can stay `insufficient` / pending in the UI.
