# Engine × year cell plan — full fidelity for every chassis

**Status:** in progress (Phase F) — started 2026-09-23  
**Goal:** every user-facing row is an honest **`chassis × model × engine × year`** cell, not a copy-paste of one engine-family pack across 10 years.  
**Rule:** no invented PLN, incidence %, or year windows. Forums/Reddit **discover** faults; **primary** sources (TSB / recall / specialist article with dates) **bound** years and unlock score impact.

### Progress log

| Date | Change |
|------|--------|
| 2026-09-23 | F1a: split `n47-chain` → early 2007–2009 / mid 2010–2011 / late 2012–2015; `n20-chain` 2011–2015 + late; `n54-hpfp` 2007–2010 + late injectors; EGR cooler 2012–2018; OFH documented all-years + B48TU note. Catalog prefers engine year-sibling as headline. Scores diverge (e.g. E90 N47 21.8 / 25.4 / 40.4). |
| 2026-09-23 | F1b: `b48-timing-pre-tu` / `b58-pre-tu` (Wikipedia TU 2018); OFH engines cleaned (B58 dedicated); B47+N57 year bounds; N57 chassis_slugs expanded to F10/E90/…. G30 B48 **76.6 (2017–18) → 91.5 (2019+)**. |
| 2026-09-23 | F1c: N63 pre-TU (≤2011) + coolant pipes ≤2016 + post-TÜ2 residual; N62/swirl chassis maps; M57 late flaps; N52/N43/N53 year bounds; X5/X6 N63 `topPainId` → coolant. |
| 2026-09-23 | F1d: N13 2011–2016; N46 timing main/late; M54/classic/E36/E39 cooling bounds; Takata 2000–2019; i3/subframe/ELV years; B57 `topPainId` → b57-egr. Open-bound pains → 4. |
| 2026-09-23 | F1e: `n55-hpfp-early` 2009–2013 (FCP/NHTSA SI B12 05 16); N57 EGR chassis→F15/F16/F01…; B38 removed from `i3-hv-battery`, OFH headline. Vary ~77→92. |
| 2026-09-23 | F2 plan: [`PHASE_F2_PAIN_EXPANSION_PLAN.md`](./PHASE_F2_PAIN_EXPANSION_PLAN.md). F2a: null **29→0**; N52 multi-pain + B47 AdBlue; vary **92→102**. |
| 2026-09-23 | F2b: N13 HPFP+carbon; N53 HPFP (Wiki=N54 pump)+carbon; N43 HPFP; N42/N46 OFH. Scores: F20 N13 **54**; E90 N53 **29.6**; N43 **40.2**. |
| 2026-09-23 | F2c: S54 bearings; S65 ITB; S55 crank hub+OFH; S63 stems; S58 OFH. E46 M3 **33.3**; F80 **25.7**; vary **105**. |
| 2026-09-23 | F2d: S85 SMG+ITB; **63/63** pain↔job PLN sync; G30 B48 pre-TU **72.5**; E60 M5 **21.2**. |
| 2026-09-23 | F4a: B48 OFH housing 2017–19 + SIB 11 10 25 bushing 2025–26; i3 60/94/120Ah; i4 HV fix. G20 B48 **91.5 / 69.9**; vary **113**. |
| 2026-09-23 | F4b: `n63-valve-stem-oil` 2017–19 + `n63-post-tu2` from 2020; `b57-egr-cooler-recall` 22V-614 G30 540d; `s68-too-new` (drop S63 prior). G15 N63 **75.4 / 91.7**; G90 **92.5**; vary **115**. |
| 2026-09-23 | F4c: `n20-oil-filter-early` SI B11 13 15 (2011–12); `n62-valvetronic-early` SI B11 02 05 (2004–05). E60 N62 **69.6 / 58.2 / 69.6**; E84 N20 **31.4 / 38.7**; vary **120**. |

**Related**
| Doc | Role |
|-----|------|
| [`EXTERNAL_DATA_AND_MAPPING.md`](./EXTERNAL_DATA_AND_MAPPING.md) | Source families + score math today |
| [`COLLECTION_REQUESTS.md`](./COLLECTION_REQUESTS.md) | Volume / sprint backlog |
| [`NO_HYPOTHESIS_PLAN.md`](./NO_HYPOTHESIS_PLAN.md) | What must never be invented |
| [`FULFILLMENT_ROADMAP.md`](./FULFILLMENT_ROADMAP.md) | Phase checklist |
| [`DATA_PIPELINE.md`](./DATA_PIPELINE.md) | Warehouse layout |

---

## 0. Why this plan exists

### 0.1 What users see today (broken fidelity)

| Surface | Behavior |
|---------|----------|
| Year rows (e.g. G30 530i B48 2017…2023) | Same score, same headline fault, same repair PLN |
| Buy price | Changes by year (CarDossier) |
| Catalog reality check (2026-09-23) | **~1658** engine×year cells, **~1620** scored; **~250** same-engine year-spans are **flat**; only **~4** engine lines change score by year |

So the UI *looks* year-granular. The **evidence pack is engine-family-granular**. That is why 2018 and 2023 B48 both show **91.5**.

### 0.2 What “true” means for OhMyCar

```text
Cell = chassis × model(badge) × engine × year

Score(cell) = f( pains that APPLY to that year,
                 repair PLN for those pains,
                 campaigns that APPLY to that chassis [/ year window],
                 optional partsReality )

Buy(cell)   = asking median (series → fuel → badge when available)
Issues list = ALL sourced pains matched to that cell (not only topPainId)
```

**Real world:** same engine code over 10 years gets revisions, TSBs, part changes.  
**App today:** one pain often has `year_from`/`year_to` empty → every year inherits it.

### 0.3 Snapshot of current warehouse (baseline)

| Layer | Count (2026-09-23) |
|-------|---------------------|
| Chassis in app | 100 |
| Unique engines in variants | 42 |
| Engine×year cells | ~1658 |
| Sourced pains | **36** |
| Pains with year bounds | **11** (mostly M-car bearings / VANOS / N47 open-ended / N63 / B57) |
| Pains without year bounds | **25** ← main reason years look identical |

---

## 1. Definition of a complete cell

A cell is **complete** when every field below is either filled with cited evidence or explicitly `null` / `insufficient` (never faked).

| # | Field | Required for score? | Required for “honest row”? | Source family |
|---|-------|---------------------|----------------------------|---------------|
| 1 | Identity: chassis code, body, production years | — | yes | RealOEM, Wikipedia |
| 2 | Badge/model + engine code + fuel | — | yes | RealOEM / TecDoc |
| 3 | Year is inside engine fitment window | — | yes | RealOEM |
| 4 | **Pain list** for this engine×year (≥0) | yes if score shown | yes — list *all* matched | §3 registry |
| 5 | Each pain has `year_from`/`year_to` when source states a window | yes | yes | TSB / PUMA / press / wiki |
| 6 | Headline (top) pain for sort/badge | yes | yes | severity + product rule |
| 7 | Repair PLN bands on pains that claim costs | for `fiveYearFix` | show N/A until quoted | workshops / Autodoc / IC |
| 8 | Campaigns on chassis (+ year if recall window known) | yes | yes | UOKiK, NHTSA, BMW VIN |
| 9 | Buy median PLN | no (never in score) | nice→complete | CarDossier |
| 10 | Parts availability sample | for `partsReality` | nice | IC / Autodoc |
| 11 | Deep links buy + parts | no | yes | OTOMOTO, mobile.de, Autodoc, IC |
| 12 | Trace: every number → URL + `collected_at` | yes | yes | warehouse JSON |

### 1.1 “All existing problems must be listed”

Product rule for Phase F:

1. **Discovery pass** (forums/Reddit/press) → candidate fault titles per engine.  
2. **Promotion pass** → each candidate becomes a warehouse `pain` only with **≥1 primary URL** (see tier table §2).  
3. **Match pass** → for each cell, UI lists **every pain** where:
   - engine ∈ `pain.engines` (or chassis-only pain), and  
   - chassis ∈ `pain.chassis_slugs` (if set), and  
   - `year_from ≤ year ≤ year_to` (null bound = open).  
4. Score uses the **full matched set** for `painLoad` + headline for `catastrophe` + quoted PLN for `fiveYearFix` — same formula as today, **different inputs per year**.

If a forum says “early B48 leaks more” but we have no dated primary source → keep as **candidate** in `_meta/pain_candidates.json`, **do not** invent a year split or change the score.

---

## 2. Evidence tiers (critical)

| Tier | Examples | Allowed use |
|------|----------|-------------|
| **A — Primary (score-binding)** | NHTSA TSB/recall PDF, UOKiK campaign, BMW SI/PUMA with production dates, RealOEM fitment, workshop quote with URL + PLN | Sets `year_from`/`year_to`, severity, PLN, campaigns |
| **B — Secondary (corroboration)** | Wikipedia engine page, AutoKult / ADM / Wybór Kierowców / Skanyx with clear dates, ADAC/TÜV series stats | Supports summary copy; may propose windows **only if** dates are explicit and cross-checked |
| **C — Discovery (not score alone)** | Reddit, forums, YouTube comments, Facebook groups | Finds fault names + “people say 2007–2009”; **never** sole source for year bounds or incidence |
| **D — Soft prior only** | ADAC Pannenstatistik, TÜV Report | Optional ±ε on catastrophe (capped), cited; never sole input |

**Promotion rule:** C → B/A requires a Tier A/B URL before the pain affects score.

---

## 3. Full external resource registry

Use these systematically. Prefer PL for PLN; DE/US for TSB & community density; UK for diesel chain history.

### 3.1 Official / regulatory (Tier A)

| ID | Resource | URL | What to extract | Maps to |
|----|----------|-----|-----------------|---------|
| uokik | UOKiK BIP BMW tag | https://uokik.gov.pl/bip/tagi/bmw | Campaign title, PL vehicles, chassis tags, dates | `campaigns/` |
| bmw_vin_pl | BMW Poland recall checker | https://www.bmwgroup.com/en/general/regulations/recall/recall-polish.html | VIN open/closed (user); deep link | UI / pain copy |
| nhtsa_recalls | NHTSA recalls API | https://api.nhtsa.gov/recalls/recallsByVehicle | make/model/**year** recalls | `campaigns/nhtsa_*.json` |
| nhtsa_tsb | NHTSA datasets / TSB zips | https://www.nhtsa.gov/nhtsa-datasets-and-apis | TSB #, component, model years | pain `sources[]`, year windows |
| nhtsa_static | Static TSB PDFs | https://static.nhtsa.gov/odi/tsbs/… | Exact production language | pain sources |
| epa_carbum | (optional US) | various | emissions campaigns | secondary |
| kba_de | KBA recalls (DE) | https://www.kba.de/ | EU recall notices | campaigns secondary |
| dvsa_uk | DVSA recalls | https://www.gov.uk/check-vehicle-recall | UK recall by reg | secondary |

### 3.2 Identity / fitment (Tier A for matrix)

| ID | Resource | URL | Extract |
|----|----------|-----|---------|
| realoem | RealOEM BMW | https://www.realoem.com/bmw/ | badge × engine × yearFrom–yearTo, OEM diagrams |
| wikipedia_chassis | Generation pages | e.g. https://en.wikipedia.org/wiki/BMW_5_Series_(G30) | code, years, bodies |
| wikipedia_engine | Engine pages | e.g. https://en.wikipedia.org/wiki/BMW_N47 | known failures + cited windows |
| tecdoc | TecDoc / Autodoc vehicle tree | via Autodoc catalog | car IDs → `autodocCars.json` |
| newtis | NewTIS / TIS (where accessible) | dealer/tech portals | SI text, labor ops (hours) |
| bmw_air | AIR / FRU times | dealer systems | labor hours for jobs |

### 3.3 Valuation / buy PLN (not in score)

| ID | Resource | URL | Extract |
|----|----------|-----|---------|
| cardossier_public | CarDossier public tables | https://car-dossier.com/ceny/bmw/… | year median, p25–p75, sample |
| cardossier_api | Valuation API | https://car-dossier.com/en/api/ | year + fuel (+ badge when possible) |
| eurotax_pl | Eurotax / Autovista | https://eurotax.pl/autovista-api/ | optional dual-check (B2B) |
| info_ekspert | Info-Ekspert | https://infonet.info-ekspert.net/ | optional dual-check |

**Deep links only (no scrape):** OTOMOTO, mobile.de, OLX, Allegro Lokalnie — see `warehouse/citations/market_and_official.json`.

### 3.4 Repair PLN / parts (Tier A when URL+price saved)

| ID | Resource | URL / note | Extract |
|----|----------|------------|---------|
| autodoc | Autodoc.pl / .co.uk / .ru | https://www.autodoc.pl | offer PLN + URL (Cloudflare often blocks bots) |
| intercars | Inter Cars WebAPI | https://docs.webapi.intercars.eu/ | OEM/TecDoc BOM + stock |
| kosztserwisu | Labor rates PL | https://kosztserwisu.pl/cennik-napraw/ | PLN/h by tier |
| workshop_pl | Specialist / indie quotes | Smorawiński, ADM, GearMar, Hypertech, polecanymechanik, cenauslug, … | job totals |
| parts_kits | Kit shops | rozrzad.pl, oryginalne-czesci.pl, repair-set.pl, … | kit PLN |
| pelican | Pelican Parts tech articles | https://www.pelicanparts.com/ | DIY procedures (hours estimate secondary) |
| fcpeuro | FCP Euro | https://www.fcpeuro.com/ | US parts refs (convert carefully; prefer PL) |

### 3.5 Specialist / press — PL (Tier B, often Tier A for PLN)

| ID | Resource | URL pattern / examples | Use |
|----|----------|------------------------|-----|
| autokult | AutoKult | https://autokult.pl/ | faults + sometimes PLN |
| adm | AutoTechnik / ADM | specialist BMW PL | jobs, OFH, chain |
| wyborkierowcow | Wybór Kierowców | https://www.wyborkierowcow.pl/ | engine roundups (N47 etc.) |
| autobaza | Autobaza auto-ekspert | https://www.autobaza.pl/ | N47 / buy warnings |
| skanyx | Skanyx blog | https://skanyx.com/pl/blog/ | N52/N54/N55 fault codes + typical PLN |
| autoswiat | Auto Świat | https://www.auto-swiat.pl/ | labor ASO vs indie |
| moto_pl | Moto.pl / Interia Moto | various | secondary articles |
| scrap_pl | Scrap / workshop blogs | various | quote candidates |

### 3.6 Specialist / press — DE / EU / UK / US (Tier B)

| ID | Resource | URL | Use |
|----|----------|-----|-----|
| adac_pannen | ADAC Pannenstatistik | https://www.adac.de/…/adac-pannenstatistik-2026/ | soft prior by series×reg year |
| tuv_report | TÜV Report | https://www.tuev-verband.de/…/tuev-report-autobild | soft prior |
| auto_motor_sport | auto motor und sport | https://www.auto-motor-und-sport.de/ | DE reliability features |
| honest_john | Honest John | https://www.honestjohn.co.uk/ | UK owner reliability feedback (discovery→promote) |
| what_car | What Car? | https://www.whatcar.com/ | reliability surveys (series-level) |
| consumer_reports | Consumer Reports | paywalled | US survey — discovery only unless licensed |
| bmwblog | BMWBlog | https://www.bmwblog.com/ | news / SI mentions |
| bimmernorth | BimmerWorld / similar | various | parts + tech notes |

### 3.7 Community forums — discovery (Tier C)

**English / international**

| ID | Forum | URL | Typical gold |
|----|-------|-----|--------------|
| bimmerpost | Bimmerpost | https://f30.bimmerpost.com/ / https://www.bimmerpost.com/ | F30/F3x, G20, M cars |
| e90post | E90Post | https://www.e90post.com/forums/ | E9x N47/N54/N52 |
| e46fanatics | E46Fanatics | https://forum.e46fanatics.com/ | E46 M54 cooling, VANOS |
| bimmerfest | Bimmerfest | https://www.bimmerfest.com/ | multi-gen (N47 threads) |
| 5series_net | 5Series.net | https://www.5series.net/ | E39/E60/F10/G30 |
| 1addicts | 1Addicts | https://www.1addicts.com/ | E87/F20 |
| xoutpost | Xoutpost | https://www.xoutpost.com/ | X3/X5 transfer case, N47 |
| 2addicts | 2Addicts | https://www.2addicts.com/ | N47 PUMA / chain windows |
| m3post | M3Post | https://www.m3post.com/ | S54/S55/S58 bearings |
| zpost | ZPost | https://www.zpost.com/ | Z3/Z4 |
| bobistheoilguy | BITOG | https://bobistheoilguy.com/ | oil / OFH / interval debates |

**German**

| ID | Forum | URL | Use |
|----|-------|-----|-----|
| motor_talk | Motor-Talk BMW | https://www.motor-talk.de/ | DE owner faults |
| bmw_syndikat | BMW-Syndikat | https://www.bmw-syndikat.de/ | tech depth |
| puma_index | PUMA index mirrors | https://www.puma-index.de/ (historically cited) | SI/PUMA production intervals (**verify PDF**) |

**Polish**

| ID | Forum | URL | Use |
|----|-------|-----|-----|
| bmwklub | BMW Klub Polska | https://www.bmwklubpolska.pl/forum/ | PL ownership + PLN anecdotes |
| bmwsport | BMW-Sport.pl | https://www.bmw-sport.pl/ | E90 N47 threads, LCI notes |
| forum_bmwportal | BMW Portal / related PL boards | search current host | regional quirks |
| elektroda | Elektroda motoryzacja | https://www.elektroda.pl/ | DIY diagnostics |

**UK**

| ID | Forum | URL | Use |
|----|-------|-----|-----|
| bmwcarclub | BMW Car Club forums | various | UK diesel chain history |
| pistonheads | PistonHeads | https://www.pistonheads.com/ | buy threads / known traps |

### 3.8 Reddit (Tier C — discovery only)

| Subreddit | URL | Focus |
|-----------|-----|-------|
| r/BMW | https://www.reddit.com/r/BMW/ | general |
| r/E90 | https://www.reddit.com/r/E90/ | E9x OFHG, water pump, N54 |
| r/F30 | https://www.reddit.com/r/F30/ | N20/N55/B48 |
| r/BMWTech | https://www.reddit.com/r/BMWTech/ | diagnosis |
| r/BmwTech | (same family) | DIY |
| r/stickshift / r/Cartalk | occasional | weak signal |
| r/whatcarshouldIbuy | buy advice | discovery |
| localized PL: search “BMW N47” on r/Polska_wpz / automotive PL subs | discovery |

**Reddit protocol:** save permalink + quote; open a `pain_candidate`; find Tier A/B before warehouse pain.

### 3.9 Video / social (Tier C, sometimes B if workshop shows invoice)

| ID | Channel type | Examples | Use |
|----|--------------|----------|-----|
| yt_indie | Indie BMW shops | ADM, many “BMW N47 chain” teardowns | symptoms, labor reality |
| yt_pl | PL channels | Warsztaty BMW PL | PLN anecdotes → confirm with quote URL |
| fb_groups | FB “BMW E90 Polska” etc. | closed groups | discovery only |

### 3.10 Already in warehouse citations

Keep in sync with `data/warehouse/citations/market_and_official.json` (otomoto, mobile.de, cardossier, eurotax, uokik, nhtsa, adac, tuv).

---

## 4. Current pains → year-window backlog

Every pain below must eventually have **sourced** `year_from`/`year_to` (or documented “applies all production years of this engine”).

### 4.1 Already year-bounded (verify & tighten)

| Pain ID | Engines | Current bounds | Action |
|---------|---------|----------------|--------|
| n47-chain | N47 | 2007 → open | Split **worst** ~2007-03–2009-01 vs mid 2009–2011 vs post-2011 per PUMA/wiki; do **not** leave open-ended if sources disagree |
| s50-vanos | S50 | 1995–2000 | verify |
| s54-vanos | S54 | 2000–2008 | verify |
| s65-rod-bearings | S65 | 2007–2013 | verify |
| s55-rod-bearings | S55 | 2014–2020 | verify |
| s62 / s85 / s63 / s58 bearings | M engines | set | verify |
| n63-coolant-pipes | N63 | 2008–2020 | may need TU split |
| b57-egr | B57 | 2015–2030 | tighten if recall windows exist |

### 4.2 Must get year windows (highest product impact)

| Pain ID | Engines | Why years matter | Primary hunt targets |
|---------|---------|------------------|----------------------|
| n20-oil-filter | N20, B48, N55, B58 | B48 2017≠2023 housing revisions; N20 early vs late | NHTSA SI, RealOEM part supersessions, Skanyx/ADM |
| b58-oil-filter | B58 | TU / housing changes | same |
| n20-chain | N20, N26 | early timing failures denser | TSB + forums→TSB |
| n54-hpfp | N54 | revised HPFP by year | TSB index / wiki |
| n53-injectors / n43-injectors | N53, N43 | EU petrol piezo era | press + TSB |
| water-pump | N52/N54/N55 | wear vs design era | secondary; may stay open with note |
| n47-n57-egr-cooler | N47, N57 | recall model years 2013–2018 class | NHTSA 18V-755 / 21V-907 class docs |
| b47-egr | B47 | later diesel | UOKiK + TSB |
| transfer-case | xDrive chassis | generation-specific | chassis-slugs + years |
| classic-cooling / e36-cooling / e39 / m54 | classics | often all years — **document** “all years” explicitly | specialist |

### 4.3 Missing pains to create (examples — expand via §3 discovery)

Not exhaustive. Each needs Tier A/B before score.

| Engine / area | Candidate faults to research |
|---------------|------------------------------|
| N52 | OFHG *, valve cover *, DISA (partially have water-pump); eccentric shaft sensor |
| N54 | wastegate rattle, injectors index, charge pipe, HPFP (have), coils |
| N55 | OFHG (today via n20-oil-filter), HPFP (later), VANOS solenoids |
| N57 | swirl / intake, timing (have), EGR (have) |
| N62 / N63 | valve stem seals, additional coolant (have pipes), turbos |
| B48 / B58 | OFH (have), belt/oil ingestion path, VANOS, cooling plastic |
| B47 / B57 | AdBlue / SCR, EGR, timing chain (if any) |
| M47 / M57 | swirl flaps (have), EGR, turbos |
| S63 / S68 | rod bearings (have), valve stems, oil consumption |
| i4 / iX / newer | HV battery / software — only with sourced campaigns |

\* May be separate pains or year-scoped children of existing IDs.

### 4.4 Example: how N47 should look after Phase F

| Production window (must cite) | Relative risk | Score effect |
|-------------------------------|---------------|--------------|
| ~2007-03 → 2009-01 | highest chain snap risk | higher catastrophe / painLoad (same pain id or `n47-chain-early`) |
| ~2009-01 → 2011-03 | reduced / revised parts | mid |
| after ~2011-03 | guides revised; lower snap risk per BMW notes | lower or different headline |

Sources to bind windows: Wikipedia N47 citations, BBC Watchdog, PUMA 43863106 / diligence notes (via verified PDF), PL articles (Wybór Kierowców, Autobaza), E90Post / 2Addicts threads **only as discovery**.

---

## 5. Warehouse schema upgrades

### 5.1 Pain record (required fields going forward)

```json
{
  "id": "n47-chain-early",
  "engines": ["N47"],
  "chassis_slugs": ["e90", "e60", "e87", "e84", "e83", "f10", "..."],
  "year_from": 2007,
  "year_to": 2009,
  "production_note": {
    "en": "Highest risk window cited …",
    "source_urls": ["https://..."]
  },
  "severity": "engine-loss",
  "sources": [{ "label": "...", "url": "https://...", "tier": "A" }],
  "pln_bands": { "...": "unchanged shape" },
  "supersedes": null,
  "related_pain_ids": ["n47-chain"]
}
```

Rules:

- Prefer **split pain IDs** (`n47-chain-early` / `-mid` / `-late`) over one open-ended row when risk differs materially.  
- Or one id with tight bounds + separate pains for other windows.  
- `tier` on each source URL for audit.

### 5.2 New warehouse files

```text
data/warehouse/
  pains/
    top10_sourced_pains.json          # existing — migrate to multi-file later
    by_engine/{engine}.json           # optional split
  _meta/
    pain_candidates.json              # Tier C discoveries awaiting promotion
    cell_coverage.json                # per chassis×engine×year flags
    year_window_log.json              # who set year_from/to + URL
  score_inputs/
    rules_v1.json                     # keep
    {chassisSlug}.json                # optional cached packs per year
```

### 5.3 Cell coverage row

```json
{
  "chassis": "g30",
  "model": "530i",
  "engine": "B48",
  "year": 2018,
  "pains_matched": ["n20-oil-filter"],
  "pains_missing_candidates": ["b48-ofh-tu1"],
  "year_bounds_confident": false,
  "buy": true,
  "campaigns": true,
  "score_ok": true,
  "notes": "OFH still family-wide; need RealOEM supersession dates"
}
```

### 5.4 App behavior changes (implementation later)

| Change | File / area | Effect |
|--------|-------------|--------|
| Match pains with strict year windows | `catalog.ts` `painsForLine` | years diverge when data exists |
| UI: list **all** matched pains, not only headline | Fault / year row expand | “all problems listed” |
| UI honesty badge | Briefing / table | “Engine-family evidence” vs “Year-window evidence” |
| Stop implying year insight when bounds open | copy | reduces fake precision |
| Optional: collapse identical consecutive years | UX | only if packs byte-identical |

Score formula (`scoreEvidence.ts`) **stays**; inputs become year-correct.

---

## 6. Collection workflow (per engine, then fan-out to chassis)

Engines are shared across many chassis — **collect once per engine**, attach `chassis_slugs`.

```text
For each unique engine code (42 today → grow):
  1. RealOEM: list badges + year fitment windows per chassis
  2. Wikipedia engine page + NHTSA TSB search (make=BMW, component keywords)
  3. Discovery: 3 forums + 2 Reddit subs + 2 PL articles (§3)
  4. Write pain_candidates[] with permalinks
  5. Promote to pains with Tier A/B + year_from/to
  6. Quote PLN → repair_costs/jobs/{id}.json
  7. Map chassis_slugs from RealOEM + volume.ts
  8. Rebuild imported/pains.json
  9. Run cell_coverage validator (flat-score report must shrink)
```

### 6.1 Per chassis checklist (after engines done)

1. Confirm `warehouse/engines/{slug}.json` years match RealOEM.  
2. Confirm every volume/e90 engine line years ⊆ fitment.  
3. UOKiK campaigns tagged to slug.  
4. NHTSA sample for representative model years.  
5. Buy medians for years ≥2009 public; API for older / fuel.  
6. UI: expanding a year shows full pain list + sources.  
7. Update `cell_coverage.json` + `collection_log.json`.

### 6.2 Validator (must automate)

```text
assert: for each engine with ≥2 years,
  if all matched pain ids identical AND all bounds open
    → flag "FAMILY_PACK_ONLY" (honest, but not year-fidelity)
  if any pain bound differs across years
    → expect score or pain list delta OR explicit equal-risk citation
```

Success metric for Phase F:

| Metric | Today | Target |
|--------|-------|--------|
| Pains with explicit year policy | 11/36 | **36/36** (bound or documented all-years) |
| Same-engine lines that **vary** by year when sources claim revision | ~4 | **majority of revised engines** (N47, N20, N54, B48/B58, N63, …) |
| Cells flagged FAMILY_PACK_ONLY | ~most | shrinking each sprint |
| Candidate queue promoted / month | 0 process | ≥10 promotions |

---

## 7. Phased execution plan

### Phase F0 — Honesty UX (3–5 days, no new external accounts)

1. Label scores: “Based on engine-family faults; year windows incomplete.”  
2. Year expand: show **all** matched pains (not one line only).  
3. Add `FAMILY_PACK_ONLY` flag in `cell_coverage` generator script.  
4. Link this doc from `FULFILLMENT_ROADMAP.md`.

### Phase F1 — Year windows for top volume engines (2–3 weeks)

Priority engines (PL listing volume × risk):

1. **N47** (split early/mid/late)  
2. **N20 / N26** (chain + OFH)  
3. **N54** (HPFP revision years)  
4. **N55** (OFH / related)  
5. **B48 / B58** (OFH / housing revisions)  
6. **N57 / B47** (EGR / timing)  
7. **N52** (water pump + OFHG as separate pains if sourced)

Deliverable: new/split pains with Tier A sources → scores diverge on E90/F30/F10/G30 year tables.

### Phase F2 — Expand pain catalog (all problems listed)

1. Discovery sprints per engine using §3.7–3.8.  
2. Promote to warehouse until each volume engine has **≥3** sourced pains where literature supports it (not padded).  
3. Chassis-only pains (subframe, ELV, Takata, transfer case) get year/chassis windows from recalls.

### Phase F3 — PLN + parts per pain

1. Job quotes for every score-affecting pain.  
2. Inter Cars / Autodoc BOM → `partsReality`.  
3. Re-enable full weight table without renormalizing away fix/parts.

### Phase F4 — Long-tail engines & classics

M / 6 / 7 / 8 / Z / i / classic cooling: same process, lower priority; allow `insufficient` when no Tier A pain.

### Phase F5 — Optional soft priors

ADAC/TÜV ±ε only after F1, capped, never alone.

---

## 8. Priority chassis order (fan-out)

When an engine is done, touch these chassis first (twins inherit):

| Wave | Chassis | Why |
|------|---------|-----|
| 1 | e90 (+e91/92/93), f30 (+f31/34), e87, f20, e60, f10, e70, e83, e84 | volume + N47/N20/N54 |
| 2 | g30, g20, f32/f36, f15, f25, f48 | B48/B58/B47 |
| 3 | e46, e39, e36 | classic cooling / M54 |
| 4 | M cars (e9x-m3, f80, g80, …) | already better year bounds |
| 5 | Remaining long tail | identity already done |

---

## 9. Agent / human operating rules

1. **Never** set `year_from`/`year_to` from Reddit alone.  
2. **Never** invent PLN or “failure rate %”.  
3. Prefer splitting pains over silent float tweaks per year.  
4. Every warehouse write: `collected_at`, `source_url`, honest `status`.  
5. Append buy snapshots; don’t silently overwrite history.  
6. After each batch: rebuild `src/data/imported/*`, run flat-score report, update `collection_log.json`.  
7. Legal: no OTOMOTO market scrape; no bulk VIN personal data.

---

## 10. Blockers

| Blocker | Blocks | Link / note |
|---------|--------|-------------|
| CarDossier API key | buy &lt;2009, fuel/badge splits | https://car-dossier.com/en/api/ |
| Inter Cars B2B | partsReality | https://docs.webapi.intercars.eu/ |
| Autodoc bot protection | bulk parts PLN | manual offer capture |
| AIR/FRU access | precise labor hours | indie worksheets fallback |
| Specialist sign-off | `signed` scores | human |
| TSB PDF archive time | year windows | NHTSA bulk zips |

---

## 11. Success definition (product)

A user opening **G30 · 530i · B48 · 2018** vs **2023** should either:

- see **different** pain sets / scores because Tier A sources document a revision window, **or**  
- see the **same** pack with an explicit note: “No sourced production-window difference for this fault yet” (honest sameness),

—and never the silent implication that “we researched each year and they happen to be identical.”

---

## 12. Immediate next actions (start here)

1. Implement F0 honesty labeling + full pain list on year rows.  
2. Open `pain_candidates.json` and run discovery for **N47** + **B48** (forums §3.7 + Reddit §3.8 + PL press §3.5).  
3. Bind N47 early window from Tier A/B → split pain → re-score E90/F10/F30 diesels by year.  
4. Repeat for B48 OFH supersessions via RealOEM + SI.  
5. Track progress in `FULFILLMENT_ROADMAP.md` Phase F checklist.

---

*This plan does not authorize inventing year differences. It authorizes collecting them.*
