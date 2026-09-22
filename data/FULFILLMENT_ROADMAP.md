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

## How to continue next sessions

1. Unblock **A2** with CarDossier API key  
2. Deepen dedicated quotes (S68-specific, i4 pack, N63 valve stems)  
3. **A4** partsReality via IC/Autodoc  
4. Optional: hand-written CHASSIS verdicts for remaining long-tail (fallback is now score-aware)
