# OhMyCar data pipeline — context for humans & agents

**Region:** Poland (PLN).  
**Scope of this bootstrap:** top 10 volume/gold chassis.  
**Rule:** every numeric market/campaign fact must come from a real source URL or API response stored under `data/warehouse/`. Do not invent medians, repair PLN, or “signed” scores.

Last bootstrap run: `2026-09-22-top10-bootstrap` → see `_meta/collection_log.json`.

---

## 1. Product ↔ data

OhMyCar is a **pre-inspection briefing**: chassis → engine → year → reliability hypothesis + PLN repair envelope + deep links to buy car/parts.

| Product field | Warehouse dataset | Refresh |
|---------------|-------------------|---------|
| Catalog card | `chassis/` | rare |
| Engine × year matrix | `engines/` (seeded later from RealOEM/TecDoc) | rare |
| `medianBuyPln` | `buy_prices/` | weekly (BE later) |
| `campaigns` score input | `campaigns/` (UOKiK + NHTSA) | weekly |
| Pains / faults | `pains/` | quarterly |
| Repair PLN bands | `repair_costs/` + `parts/` | monthly |
| Score 0–100 | derived via `src/lib/score.ts` | on publish |
| Score status | always `hypothesis` until specialist signs | human |

**Buy price never enters the 0–100 formula.**

---

## 2. Top 10 chassis (this batch)

| # | Slug | Code | Years | Market name (PL listings) |
|---|------|------|-------|---------------------------|
| 1 | e90 | E90 | 2005–2012 | Seria 3 |
| 2 | f30 | F30 | 2012–2019 | Seria 3 |
| 3 | e46 | E46 | 1998–2006 | Seria 3 |
| 4 | e60 | E60 | 2003–2010 | Seria 5 |
| 5 | f10 | F10 | 2010–2017 | Seria 5 |
| 6 | e39 | E39 | 1995–2004 | Seria 5 |
| 7 | e87 | E87 | 2004–2011 | Seria 1 |
| 8 | f20 | F20 | 2011–2019 | Seria 1 |
| 9 | e70 | E70 | 2006–2013 | X5 |
| 10 | e83 | E83 | 2003–2010 | X3 |

Drivetrain twins (E91/E92/E93 → E90, F31 → F30, etc.) inherit engine tables; listing deep links may differ by body.

Coverage flags: `data/warehouse/_meta/coverage_top10.json`.

---

## 3. Warehouse layout

```text
data/
  DATA_PIPELINE.md          ← this file
  warehouse/
    chassis/                ← identity + source links
    buy_prices/             ← PLN asking medians (real imports)
    campaigns/              ← UOKiK + NHTSA
    pains/                  ← faults with citations (PLN null until quoted)
    repair_costs/           ← labor rates (public sources)
    parts/                  ← outbound Autodoc / Inter Cars / RealOEM
    citations/              ← resource registry
    engines/                ← (next) RealOEM engine matrices
    score_inputs/           ← (next) derived inputs from warehouse only
    _meta/                  ← coverage + collection logs
```

**Contract for BE:** ingest these JSON files (or migrate 1:1 into Postgres tables with the same field names). Prefer **append-only** `buy_price` and `campaign` snapshots with `collected_at`.

---

## 4. How collection works (roles)

```text
┌──────────────────────┐
│ Agent (Cursor)       │  research public pages + allowed APIs
│                      │  write warehouse JSON with source URLs
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ data/warehouse/*     │  provenance-first datasets
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
 FE seed     BE (soon)
 (optional)  store + cron refresh
```

| Role | Does | Does not |
|------|------|----------|
| **Agent** | Import from real sources, cite URLs, mark gaps | Invent PLN, fake sample sizes, mark `signed` |
| **BE** | Persist, version, refresh valuations/campaigns | Scrape OTOMOTO listings without a legal basis |
| **Specialist** | Sign score packs | — |

---

## 5. All resources (canonical list)

### 5.1 Buy prices / market (PL)

| Resource | Use | Access | URL |
|----------|-----|--------|-----|
| **CarDossier public stats** | Year medians, P25/P75, sample sizes | Public HTML | https://car-dossier.com/ceny/bmw |
| Seria 3 | E90/F30 (and series-level) | | https://car-dossier.com/ceny/bmw/seria-3 |
| Seria 5 | E60/F10 | | https://car-dossier.com/ceny/bmw/seria-5 |
| Seria 1 | E87/F20 | | https://car-dossier.com/ceny/bmw/seria-1 |
| X5 | E70 | | https://car-dossier.com/ceny/bmw/x5 |
| X3 | E83 | | https://car-dossier.com/ceny/bmw/x3 |
| **CarDossier Market API** | Filtered valuation (fuel, gearbox, mileage) | 5 free/IP/day; paid credits | https://car-dossier.com/en/api/ |
| Eurotax PL | Insurance-grade valuation | Business API | https://eurotax.pl/autovista-api/ |
| Info-Ekspert | PL base market values | Subscription | https://infonet.info-ekspert.net/ |

**Not used as market-read API:** OTOMOTO official API is **dealer write/post only** — https://www.otomoto.pl/news/przeglad-funkcji-api

**Imported this run:**  
`buy_prices/cardossier_public_by_year.json` (43 year-rows)  
`buy_prices/cardossier_api_live_samples.json` (5 live API calls)

**Caveat:** public year tables are **series-level** (all engines), asking prices, Sep 2026. Engine-specific medians need more API calls + mapping. E46/E39 years older than published table → marked `insufficient` (no invention).

### 5.2 Where to buy cars (deep links only)

| Site | URL | Notes |
|------|-----|-------|
| OTOMOTO | https://www.otomoto.pl | Primary PL |
| mobile.de | https://www.mobile.de | DE import; partner Search API |
| OLX | https://www.olx.pl/motoryzacja/samochody/ | Secondary |
| Allegro Lokalnie | https://allegrolokalnie.pl/oferty/osobowe/bmw-4032 | Secondary |

App builders: `src/lib/links.ts`.

### 5.3 Campaigns / recalls

| Resource | Region | URL |
|----------|--------|-----|
| **UOKiK BIP tag BMW** | PL official | https://uokik.gov.pl/bip/tagi/bmw |
| UOKiK E90/E87/E83 batch | PL | https://uokik.gov.pl/bip/samochody-bmw |
| UOKiK F-series batch | PL | https://uokik.gov.pl/bip/samochody-bmw-1 |
| UOKiK E83/E87/E90 | PL | https://uokik.gov.pl/bip/samochody-bmw-rozne-modele |
| BMW VIN recall checker | PL | https://www.bmwgroup.com/en/general/regulations/recall/recall-polish.html |
| BMW.pl recalls | PL | https://www.bmw.pl/pl/footer/quick-link/bmw-vehicle-recalls.html |
| **NHTSA datasets & APIs** | US (discovery) | https://www.nhtsa.gov/nhtsa-datasets-and-apis |
| NHTSA recallsByVehicle | US | `https://api.nhtsa.gov/recalls/recallsByVehicle?make=BMW&model=3%20SERIES&modelYear=YYYY` |

**Imported:** `campaigns/uokik_bmw_top10_relevant.json`, `campaigns/nhtsa_recalls_samples.json` (29 recall rows).

VIN open/closed status is **not** bulk-published by UOKiK (RODO) — user checks VIN at inspection time.

### 5.4 Faults / TSBs / reliability priors

| Resource | URL | Role |
|----------|-----|------|
| NHTSA TSB / manufacturer communications zips | https://www.nhtsa.gov/nhtsa-datasets-and-apis | Primary evidence for pains |
| Example N54 HPFP TSB PDF | https://static.nhtsa.gov/odi/tsbs/2013/MC-10149587-9999.pdf | Cited |
| Example N20 chain TSB PDF | https://static.nhtsa.gov/odi/tsbs/2017/MC-10142923-0001.pdf | Cited |
| Example N47/N57 EGR ELW PDF | https://static.nhtsa.gov/odi/tsbs/2024/MC-10249439-0001.pdf | Cited |
| Wikipedia engine pages | e.g. https://en.wikipedia.org/wiki/BMW_N47 | Secondary identity |
| ADAC Pannenstatistik | https://www.adac.de/rund-ums-fahrzeug/unfall-schaden-panne/adac-pannenstatistik-2026/ | Soft series prior (not engine-level) |
| TÜV Report | https://www.tuev-verband.de/presse/publikationen/reporte/tuev-report-autobild | Soft series prior |

**Imported pains:** `pains/top10_sourced_pains.json` — **PLN bands null** until parts+labor quoted.

### 5.5 Parts (buy parts + price signal)

| Resource | URL | Access |
|----------|-----|--------|
| Autodoc.pl | https://www.autodoc.pl | Consumer PLN; deep links |
| Inter Cars | https://www.intercars.pl | B2B API: https://docs.webapi.intercars.eu/ic-api/contracts/api |
| RealOEM | https://www.realoem.com/bmw/ | OEM numbers / diagrams |
| TecDoc / TecAlliance | commercial | Vehicle↔parts fitment, country=PL |

**Imported:** outbound link catalog only (`parts/outbound_catalog.json`). No scraped part prices yet (need Inter Cars account or controlled Autodoc sampling next).

### 5.6 Repair labor (PL)

| Resource | URL |
|----------|-----|
| kosztserwisu.pl cennik 2026 | https://kosztserwisu.pl/cennik-napraw/ |
| kosztserwisu.pl BMW | https://kosztserwisu.pl/modele-samochodow/bmw/ |
| Auto Świat independent vs ASO | https://www.auto-swiat.pl/porady/eksploatacja/niezalezny-serwis-zamiast-aso-ile-mozna-zaoszczedzic-skad-biora-sie-roznice-w-cenach/t2n1tvc |
| Bawaria Motors Service 4+ | https://www.bawariamotors.pl/serwis-i-czesci/promocyjna-oferta-bmw-4-letnie/ |

**Imported:** `repair_costs/pl_labor_rates_2026.json` (rates only).

Formula later: `job_pln = parts_pln + labor_hours × rate_tier`.

### 5.7 Identity / catalog

| Resource | URL |
|----------|-----|
| RealOEM | https://www.realoem.com/bmw/ |
| Wikipedia generation pages | linked per `chassis/*.json` |
| App taxonomy | `src/data/chassis.ts` |

---

## 6. What was imported vs still open

### Done (real sources)

- 10 chassis identity files with wiki + OTOMOTO deep links  
- CarDossier public year medians mapped onto top10 production windows (where years exist)  
- 5 live CarDossier API valuations (diesel samples)  
- 3 UOKiK campaigns affecting top10  
- 29 NHTSA recall records for sample years  
- 5 pains with citation URLs (no fake PLN)  
- PL labor rate table with citations  
- Parts outbound links  

### Gaps (do not fill with AI guesses)

1. **E46 / E39 buy year-rows** — public CarDossier tables start ~2009; need paid API or other source.  
2. **Engine-specific buy medians** (e.g. 320d N47 vs 330i N52) — more valuation API calls + fuel/badge filters.  
3. **Repair PLN per pain** — Autodoc/IC part quotes + hours.  
4. **Full engines/** matrices from RealOEM.  
5. **score_inputs/** rebuilt only from warehouse evidence.  
6. **Signed** scores — specialist.  
7. **Raw listing store** — BE + CarDossier/Eurotax, not DIY OTOMOTO scrape.

---

## 7. Next collection sprints

1. Register CarDossier API key → fill E46/E39 + diesel/petrol splits for E90/F30/F10.  
2. Expand UOKiK: crawl every link under https://uokik.gov.pl/bip/tagi/bmw → full `campaigns/`.  
3. Bulk NHTSA TSB zip filter for BMW → attach to pains.  
4. Sample Autodoc.pl prices for top 10 pain OEM queries → first `repair_costs/jobs_*.json`.  
5. RealOEM engine lines → `engines/{slug}.json`.  
6. Script: warehouse → optional patch of `medianBuyPlnByYear` in app seed (still `hypothesis`).  
7. BE: ingest warehouse, cron CarDossier + UOKiK.

---

## 8. Agent checklist (every future import)

- [ ] Source URL or API endpoint stored on the record  
- [ ] `collected_at` ISO timestamp  
- [ ] `confidence` / `status` set honestly (`missing` if gap)  
- [ ] No invented PLN or sample sizes  
- [ ] Update `_meta/collection_log.json` and coverage matrix  
- [ ] Prefer append snapshots over silent overwrite for buy prices  

---

## 9. Example real numbers from this run (for sanity)

Live API (2026-09-22), PLN asking, CarDossier:

| Query | Median | Sample |
|-------|--------|--------|
| Seria 3 2010 diesel | 20 900 | 939 |
| Seria 3 2015 diesel | 41 900 | 699 |
| Seria 5 2012 diesel | 37 900 | 1 186 |
| X5 2010 | 45 000 | 260 |
| Seria 1 2012 diesel | 25 999 | 574 |

UOKiK: E81/E83/E84/E87/E90/E91 airbag campaign — **10 405** vehicles in PL  
(https://uokik.gov.pl/bip/samochody-bmw).

---

## 10. Relation to existing app seed

`src/data/e90.ts`, `volume.ts`, etc. still contain **hand-seeded hypothesis** buy/score numbers from before this warehouse.  
They are **not** automatically overwritten by this import. Next step is a deliberate migration script once engine-level buy coverage is good enough.

### App wiring (no BE yet)

- `src/data/imported/buyMedians.json` — generated from warehouse CarDossier imports  
- `src/lib/marketBuy.ts` — lookup helper  
- `src/lib/catalog.ts` — **overlays** `medianBuyPln` from warehouse when a chassis+year (or diesel API sample) exists; otherwise keeps hand-seeded prior  
- `src/data/imported/pains.json` — copy of `warehouse/pains/top10_sourced_pains.json`  
- `src/lib/warehousePains.ts` — **only** fault source for the UI (titles, summaries, source links)  
- Repair PLN on pains is **null** until Autodoc/IC quotes exist; UI shows “pending quote” (except free UOKiK campaign rows)

Scores: runtime **evidence_derived** from warehouse pains + UOKiK via `src/lib/scoreEvidence.ts` + `score_inputs/rules_v1.json` (fiveYearFix + partsReality omitted until quotes). Seed `inputsByYear` / buy / repairPln are **ignored at runtime**.  
Buy PLN: warehouse only (null if missing). Repair PLN: warehouse pain quotes only (almost all pending).

---

## 11. Blockers / questions for you

1. **CarDossier API key** — demo quota is 5/day; needed for E46/E39 years + engine/fuel splits. Register: https://car-dossier.com/en/api/  
2. **Inter Cars B2B** — needed for real parts PLN (Autodoc is Cloudflare-blocked for bots).  
3. Confirm OK that buy prices shown in UI are **series-level** medians (same year for 320d and 330i) until fuel/badge-specific API fills in.
