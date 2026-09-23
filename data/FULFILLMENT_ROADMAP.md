# Full-catalog fulfillment roadmap (step by step)

**Goal:** every chassis in `src/data/chassis.ts` (100) has identity, engines, sourced pains where scored, buy medians where available, and deep links.  
**Rule:** no invented PLN. See `EXTERNAL_DATA_AND_MAPPING.md`.

---

## Phase order

| Step | Phase | Scope | Status |
|------|-------|-------|--------|
| **1** | A1 | Wire repair PLN → score `fiveYearFix` | **done 2026-09-22** |
| **2** | A2 | CarDossier API fill top10 buy &lt;2009 | blocked — need API key / wait demo reset |
| **3** | A3 | Fuel-split buy samples (diesel/petrol) | blocked — API credits |
| **4** | A4 | Autodoc/IC SKU BOM → `partsReality` | blocked — Cloudflare / B2B |
| **5** | B | Gold missing warehouse: **e36, e9x-m3, e53** | **done 2026-09-22** |
| **6** | C1 | Volume: **e84, f48, f25, f15, g20** + X1 / expanded buy tables | **done 2026-09-22** |
| **7** | C2 | Volume: **g30, f32/f36, e82, f40, f22, g01, g05** + Seria 4/2 | **done 2026-09-22** |
| **8** | C3 | Remaining volume + X2/X4/X6/X7/Seria 7 (**incl. g07/f01/g11**) | **done 2026-09-23** |
| **9** | D | Long tail M/6/7/8/Z/i/classics — identity + thin variants | **done 2026-09-23** |

---

## Step 1 (done) — score includes repair quotes

- `deriveEvidencePack` sets `expectedFix5yPln` from pain `pln_bands`
- UI copy updated (parts stock still omitted)
- `rules_v1.json` updated

## Step 5–8 (done) — gold + volume

See prior sections / `collection_log.json`.

## Step 9 (done) — Phase D long tail

- Warehouse identity + engines for **all remaining 44** famous/long-tail chassis
- Thin `volume.ts` lines so every chassis has ≥1 variant
- Scores only where reused sourced pains match (N54/N55/N52/N57/N62/M54/transfer-case…)
- Buy overlays: M3 / Seria 6 / Z4 public tables + series priors where years overlap

## Step 10 (done 2026-09-23) — Phase E pending pains

- Sourced jobs + pains: S54/S55/S62/S85/S63(+S68)/S58 VANOS·bearings, B58 OFH, B57 EGR, N63 coolant pipes, i3 HV battery, classic cooling
- Wired all `pending-*` volume lines → real `topPainId`
- Chassis verdict fallback now uses live scores (no fake “no 0–100 table” when scores exist); E36 M3 PL/RU copy cleaned

## Catalog snapshot (2026-09-23)

- **100 / 100** chassis have variants + sourced score/repair bands (where engine matched)
- Still blocked for “complete” honesty: API &lt;2009 buy, fuel splits, Autodoc BOM, deeper M/EV packages

## Phase F (next) — engine × year fidelity

**Plan doc:** [`ENGINE_YEAR_CELL_PLAN.md`](./ENGINE_YEAR_CELL_PLAN.md)

| Step | Scope | Status |
|------|-------|--------|
| **F0** | Honesty UX: year-window score copy; engine-preferring headline fault | **done 2026-09-23** |
| **F1a** | N47 chain early/mid/late + EGR years; N20 chain; N54 HPFP window | **done 2026-09-23** |
| **F1b** | B48/B58 pre-TU (wiki 2018); OFH cleanup; B47/N57 bounds; N57 chassis map | **done 2026-09-23** |
| **F1c** | N63 pre-TU / pipes / post-TÜ2; N62+swirl maps; N52/N43/N53 bounds; X5 N63 headline fix | **done 2026-09-23** |
| **F1d** | N13/N46 timing; M54/classic/E36 cooling bounds; Takata/i3/subframe/ELV years; B57 headline | **done 2026-09-23** |
| **F1e** | N55 early HPFP 2009–2013; N57 EGR chassis→F15/F16; B38 untagged from i3 HV → OFH | **done 2026-09-23** |
| **F2** | Expand pains so each volume engine lists all sourced problems | **in progress** — see [`PHASE_F2_PAIN_EXPANSION_PLAN.md`](./PHASE_F2_PAIN_EXPANSION_PLAN.md) |
| **F2a** | Null chassis maps; N52 PCV/VANOS/valve-cover/OFH; B47 AdBlue | **done 2026-09-23** |
| **F2b** | N13 HPFP+carbon; N53 HPFP+carbon; N43 HPFP; N42/N46 OFH | **done 2026-09-23** |
| **F2c** | S54 bearings; S65 ITB; S55 crank hub+OFH; S63 stems; S58 OFH | **done 2026-09-23** |
| **F2d** | S85 SMG+ITB; job JSON sync; PLN on design-change pains | **done 2026-09-23** |
| **F3** | PLN + partsReality per pain | partial — warehouse PLN done; Autodoc BOM blocked |
| **F4** | OFH supersessions / generation splits | **F4c done** — see [`PHASE_F4_OFH_SUPERSESSIONS.md`](./PHASE_F4_OFH_SUPERSESSIONS.md) |

**Why:** F4c: N20 plastic OFH SI B11 13 15 (2011–12); N62 levers SI B11 02 05 (2004–05). Vary **~120**. Next: more Tier A SIBs or unblock **A2/A4**.

## How to continue next sessions

1. Continue **F4d** (more NHTSA/SI year windows) or unblock **A2** CarDossier  
2. Unblock **A2** with CarDossier API key  
3. **A4** partsReality via IC/Autodoc  
4. Optional: hand-written CHASSIS verdicts for remaining long-tail — see [`VERDICT_COPY_PLAN.md`](./VERDICT_COPY_PLAN.md) (Wave 0 derived fallback shipped; Wave 1 hand polish next)
