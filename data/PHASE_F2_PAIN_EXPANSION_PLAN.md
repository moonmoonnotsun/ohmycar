# Phase F2 — Pain expansion & null-score fidelity

**Status:** in progress — started 2026-09-23  
**Parent:** [`ENGINE_YEAR_CELL_PLAN.md`](./ENGINE_YEAR_CELL_PLAN.md) · [`FULFILLMENT_ROADMAP.md`](./FULFILLMENT_ROADMAP.md)  
**Rule:** forums/Reddit discover; **Tier A/B** bound years and unlock score. No invented PLN or year windows.

---

## 0. Why F2 (after F1a–e)

F1 made ~**92** engine lines **vary by year**. Remaining accuracy gaps are different:

| Gap | Count (2026-09-23 post-F1e) | Effect in app |
|-----|----------------------------|---------------|
| Same-engine year-spans still **flat** | ~166 | Often correct until redesign dates exist |
| Engines with **≤2** warehouse pains | ~40 | Issues list + score understate ownership risk |
| Variants with **`score: null`** | ~29 | Broken cell (matched pains = 0) |
| Pains without PLN bands | ~4 | `fiveYearFix` incomplete |
| Buy &lt;2009 / fuel splits / Autodoc BOM | blocked | A2–A4 |

**F2 goal:** every volume engine has **≥3 sourced pains** where literature supports it, and **zero null scores** caused by missing chassis maps.

---

## 1. Null-score root causes (audited)

| Cluster | Cells | Root cause | Fix |
|---------|-------|------------|-----|
| **g22 / g23 / g26 B58** | 20 | `b58-oil-filter.chassis_slugs` missing G22/G23/G26 | Expand chassis map |
| **e63 N52** | 7 | `water-pump.chassis_slugs` missing E63/E64 | Expand chassis map |
| **f87 S55 2021** | 1 | `s55-rod-bearings.year_to: 2020` | Extend to 2021 (F87 Comp end) |
| **e38 M62 1994** | 1 | `e39-cooling.year_from: 1995` | Extend to 1994 |

Script: `data/tools/phase_f2a_nulls_and_n52.mjs`

---

## 2. Research registry (deep dive — Wave A)

### 2.1 N52 — secondary pains (engine had only `water-pump`)

| Pain ID | Bound | Tier | Primary sources | PLN policy |
|---------|-------|------|-----------------|------------|
| `n52-pcv-heater` | **2006–2013** | **A** | NHTSA **17V-683** (MY 2007–2011) + expansion **22V-119** (MY 2006–2013, prod ~2005-01 → 2013-10); Wikipedia N52 recalls | Free campaign `[0,0]` when VIN open |
| `n52-vanos-bolts` | **2010–2013** | **A** | NHTSA **23V-707** (prod 2009-09 → 2012-07; MY 2010–2013); also **N55** | Free campaign `[0,0]` |
| `n52-eccentric-shaft` | **2004–2015** | **A/B** | NHTSA SI (SB-10076476 / eccentric shaft sensor oil contamination diagnostic) | Family prior from specialist bands; prefer OEM sensor |
| `n52-valve-cover` | **2004–2015** | **B** | Turner Motorsport (plastic cover from **MY 2007**); AmpAuto / FCP-class ownership guides; PL gasket kits (grelkam N52 set) | Independent ~700–2500 PLN (gasket vs full plastic cover) |
| `n52-ofh` *or* add N52 → `n20-oil-filter` | all N52 years | **B** | AmpAuto / Jalopnik ownership guides (OFHG across 2005–2013) | Reuse OFH Skanyx prior |

**Wikipedia N52 (Tier A context):** production **2004–2015**; electric water pump vs M54; Valvetronic; 3-stage DISA on higher-output / N51 — DISA **not** promoted until chassis-specific RealOEM intake maps exist (avoid false positives on 2-stage cars).

**Year-score expectation after Wave A:**
- 2006–2009: PCV heater (safety) → large score drop vs pump-only
- 2010–2013: PCV + VANOS bolts (safety) → worst window
- 2014–2015: wear pack (pump / OFH / valve cover) without those campaigns

### 2.2 B58 — chassis fidelity + optional TSB

| Item | Bound | Tier | Sources |
|------|-------|------|---------|
| OFH chassis expand | all years | map fix | BimmerWorld fitment: G22/G23/G26 M440i B58 |
| Coolant bushing TSB | investigate | **A** | NHTSA SI **11 10 25** (coolant leak from OFH bushing) — optional later split if model-year population is clear |

### 2.3 B47 / B57 — second pain (AdBlue/SCR)

| Pain ID | Bound | Tier | Sources | Careful note |
|---------|-------|------|---------|--------------|
| `b47-adblue-scr` | **2015–2030** (Euro 6 SCR era) | **B** | Bimmer Garage / Bimmer.AI B47 guides (NOx / AdBlue countdown) | Not a US NHTSA EGR cooler ID |
| Existing `b47-egr` | 2014– | **B** | Wikipedia B47 + Skanyx EGR prior | Keep |
| UK EGR cooler campaigns | **VIN** | **A/B** | Which? / DVSA R/2018/… diesel lists overlapping **2014–2017** 20d badges; Trevor Burgess claims B47+N57 | **Do not** invent “B47 ∈ 18V-755” — US PDF is N47/N57. Promote dedicated `b47-egr-cooler-campaign` only after VIN-class PDF names B47 explicitly |

**B57:** reuse AdBlue pain engines `["B47","B57"]` — same modular SCR theme.

### 2.4 Explicitly deferred (no Tier A/B year cut yet)

| Topic | Why deferred |
|-------|----------------|
| B47 early timing chain 2014–2016 | Specialist claim only; no TSB year population confirmed |
| N52 DISA | Only 3-stage intake engines — needs RealOEM/intake map |
| RealOEM OFH gasket supersessions | Need part-change dates before early/late OFH split |
| Post-TU G20 B48 flat 2019+ | Correct until OFH redesign dates |
| S58 bearings all-years | Correct until redesign/campaign |

---

## 3. Execution waves

| Wave | Script | Scope | Exit criteria |
|------|--------|-------|---------------|
| **F2a** | `phase_f2a_nulls_and_n52.mjs` | Null chassis maps + N52 PCV/VANOS/valve-cover/OFH/eccentric + B47 AdBlue | null scores → 0 (map cases); N52 ≥4 pains; B47 ≥2 |
| **F2b** | `phase_f2b_n13_n46_n43_n53.mjs` | N13 HPFP+carbon; N53 HPFP+carbon; N43 HPFP; N42/N46 OFH | each ≥3 sourced pains |
| **F2c** | `phase_f2c_m_cars.mjs` | S54 bearings; S65 ITB; S55 crank hub+OFH; S63 stems; S58 OFH | M engines ≥2 pains |
| **F2d** | `phase_f2d_jobs_and_s85.mjs` | S85 SMG+ITB; job JSON sync; PLN on B48/B58/N63 design rows | every pain has `pln_bands` + job file |
| **F3/A4** | blocked | Autodoc/IC `partsReality` SKU BOM | — |

---

## 4. Chassis fan-out (after N52 pains land)

| Engine | Touch first |
|--------|-------------|
| N52 | e90/e91/e92/e93, e60/e61, e63/e64, e70, e83, e87, e82, e89-z4, f10, f25, e84 |
| B58 | g20/g21, **g22/g23/g26**, g30, g01, g05, f22, g42 |
| B47 | f48, f30, g30, g01, f45, f40 |

Twins inherit drivetrain chassis maps.

---

## 5. Operating rules (same as F1)

1. Never bound years from Reddit alone.  
2. Never invent PLN — reuse family prior with labeled `fx_note` / source URL.  
3. Free recalls → `[0,0]` + `severity: safety` (Takata pattern).  
4. After each wave: copy warehouse → `src/data/imported/pains.json`, flat/null report, `collection_log.json`, update this doc + FULFILLMENT.  
5. Prefer expanding **pain list** over silent `inputsByYear` floats (runtime ignores seed floats).

---

## 6. Progress log

| Date | Change |
|------|--------|
| 2026-09-23 | Plan created from null audit + NHTSA 17V-683 / 22V-119 / 23V-707 + N52/B47 specialist registry |
| 2026-09-23 | **F2a applied:** null scores **29→0**; N52 PCV/VANOS/valve-cover/eccentric/OFH; B47 AdBlue; vary **92→102**. E90 N52 **45.8 (2005) → 37.8 (2006+ PCV)**. |
| 2026-09-23 | **F2b applied:** N13 HPFP+carbon; N53 HPFP (Wiki=same as N54)+carbon; N43 HPFP; N42/N46→OFH. F20 N13 **63.3→54**; E90 N53 **35.8→29.6**; E90 N43 **46.4→40.2**. |
| 2026-09-23 | **F2c applied:** S54 rod bearings; S65 ITB actuators; S55 crank hub+OFH; S63 valve stems; S58→B58 OFH. E46 M3 **→33.3**; F80 S55 **38.2→25.7**; vary **102→105**. |
| 2026-09-23 | **F2d applied:** S85 SMG motor + throttle actuators; **63/63** pains have PLN + job JSON; G30 B48 pre-TU **76.6→72.5** (PLN now in fix); E60 M5 **37.4→21.2**. |

---

## 7. Source URL index (Wave A)

| Label | URL |
|-------|-----|
| NHTSA 17V-683 PCV heater | https://static.nhtsa.gov/odi/rcl/2017/RCMN-17V683-7659.pdf |
| NHTSA 22V-119 PCV expansion | https://static.nhtsa.gov/odi/rcl/2022/RCRIT-22V119-1582.pdf |
| NHTSA 23V-707 VANOS bolts | https://static.nhtsa.gov/odi/rcl/2023/RCRIT-23V707-5068.pdf |
| NHTSA eccentric shaft SI | https://static.nhtsa.gov/odi/tsbs/2016/SB-10076476-5448.pdf |
| Wikipedia N52 | https://en.wikipedia.org/wiki/BMW_N52 |
| Turner N52 valve cover | https://www.turnermotorsport.com/p-395319-valve-cover/ |
| AmpAuto N52 problems | https://www.ampauto.io/symptoms/bmw-n52-problems |
| BimmerWorld B58 OFH G22/G26 | https://www.bimmerworld.com/Engine/BMW-Oil-System/OEM-Oil-Filter-Housing-Gasket-Set-11428583896.html |
| Bimmer.AI B47 | https://bimmer.ai/bmw-engines/b47/ |
| Bimmer Garage B47 | https://www.bimmergarage.co.uk/bmw-b47-common-issues/ |
| Which? UK EGR diesel extension | https://www.which.co.uk/news/article/bmw-extends-uk-recall-over-fire-risk-aavZB2R92Thr |
| NHTSA SI coolant OFH bushing | https://static.nhtsa.gov/odi/tsbs/2026/MC-11026946-0001.pdf |
