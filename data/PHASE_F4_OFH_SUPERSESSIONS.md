# Phase F4 — OFH supersessions & generation splits

**Status:** F4c done 2026-09-23  
**Parent:** [`ENGINE_YEAR_CELL_PLAN.md`](./ENGINE_YEAR_CELL_PLAN.md) · [`FULFILLMENT_ROADMAP.md`](./FULFILLMENT_ROADMAP.md)

## Goal

Split remaining **flat** year-spans where Tier A/B documents a **part redesign / generation**, without inventing RealOEM day-codes we cannot scrape.

## F4a applied

| Pain | Years | Source | Effect |
|------|-------|--------|--------|
| `b48-ofh-housing-early` | 2017–2019 | BimmerWorld multi-supersession since 2017; BMW P/N chain | G30/G20 early B48 score drop |
| `b48-ofh-coolant-bushing` | 2025–2026 | **NHTSA SIB 11 10 25** (bush 11 42 8 490 951) | G20 late B48 **91.5 → 69.9** |
| `i3-hv-battery` / `94ah` / `120ah` | 2013–16 / 17–18 / 19–22 | Wikipedia + BMW Press | i3 generation headlines |
| `i4-hv-battery` | 2021–2026 | Wikipedia i4 (fix nulls after i3 split) | i4 scored again |

**Metrics:** vary **105 → 113**; nulls **0**.

## F4b applied

| Pain | Years | Source | Effect |
|------|-------|--------|--------|
| `n63-valve-stem-oil` | 2017–2019 | NHTSA SI B11 01 17 / valve-seal SIBs + class-action TU/TU2 | G15 N63 **75.4** (2018) vs **91.7** (2022) |
| `n63-post-tu2` | 2020–2030 | Narrowed residual after stem window | Post-TU3 residual only |
| `b57-egr-cooler-recall` | 2017–2018 | **NHTSA 22V-614** G30 540d B57O Oct 2017–Jun 2018 | G30 540d **55.2** vs later **69.2**; volume + chassis engines |
| `s68-too-new` | 2023–2030 | EngineScope / OwnerSpecs — no pattern failure | Drop invented S63 bearing prior; G90 **92.5** |

**Metrics:** vary **113 → 115**; nulls **0**.

## F4c applied

| Pain | Years | Source | Effect |
|------|-------|--------|--------|
| `n20-oil-filter-early` | 2011–2012 | **NHTSA SI B11 13 15** plastic OFH → aluminum (prod Aug 2011–Mar 2012) | E84 N20 **31.4** (2011) vs **38.7** (2013); F30/F10 chain years drop |
| `n62-valvetronic` / `-early` / `-late` | 2001–03 / **2004–05** / 2006–10 | **BMW SI B11 02 05** intermediate levers (prod Jun 2004–Feb 2005) | E60 N62 **69.6 / 58.2 / 69.6** |

**Metrics:** vary **115 → 120**; nulls **0**.

## Deferred (need ETK day-codes or VIN-class PDFs)

- Exact RealOEM gasket supersession dates for N55 OFH (still all-years gasket theme)
- B47 early/late EGR without B47-named recall PDF
- B58 OFH bushing (SIB scoped B46/B48 only)
- Aluminum vs plastic housing cut by engine code (B48C/D vs B48X) without plate-level data
- Broader B57 cooler campaigns beyond G30 VIN class

## Scripts

- `data/tools/phase_f4a_ofh_i3.mjs`
- `data/tools/phase_f4a_i4_fix.mjs`
- `data/tools/phase_f4b_n63_b57_s68.mjs`
- `data/tools/phase_f4c_n20_ofh_n62_levers.mjs`
