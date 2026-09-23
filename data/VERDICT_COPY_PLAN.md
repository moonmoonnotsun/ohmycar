# Verdict copy plan — AI briefs from fetched data

**Status:** Wave 2 complete 2026-09-23 — **100/100** hand chassis briefs  
**Priority:** high — pros / cons / summary are buyer-facing trust  
**North star:** **AI writes the prose; warehouse data supplies every claim.** No meta templates. No invented faults.

**Related:** [`NO_HYPOTHESIS_PLAN.md`](./NO_HYPOTHESIS_PLAN.md) · [`ENGINE_YEAR_CELL_PLAN.md`](./ENGINE_YEAR_CELL_PLAN.md) · [`SOURCE_DISPLAY_REFINEMENT.md`](./SOURCE_DISPLAY_REFINEMENT.md) · `src/data/verdicts.ts`

---

## 1. What “right” means

| Layer | Who writes it | Input | Output |
|-------|---------------|--------|--------|
| **Facts** | Pipeline / Phase F | pains, year windows, scores, engines on card | `chassisFacts` / `variantFacts` JSON |
| **Copy** | **AI** (this agent or batch script) | that fact pack only | `summary` / `good` / `bad` in en+pl+ru |
| **Ship** | Engineer | reviewed AI draft | `CHASSIS[slug]` or `volumeEngineVerdicts` / warehouse JSON |
| **Fallback** | Code Wave 0 | live catalog | Readable but stiff — **never** the long-term product voice |

**Yes:** pros, cons, summaries = **AI + our fetched data**.  
**No:** dumping pain titles, “PLN bands are approximate”, or “sourced scores are on this card” as the product voice.

Gold examples already in-repo (tone target): `e90`, `f30`, `e60`, `e70` in `verdicts.ts`.

---

## 2. Fact pack (required before AI writes)

For each chassis (and later each engine×year), build a pack from **live catalog / volume.ts + warehouse pains only**:

```text
slug, code, name, years, body
engines[]                     ← only engines that appear on this card (volume rows)
per engine:
  models + year list
  topPainId + title (scoped to card engines)
  other pains that apply (ids + year windows)
chassis pains[]               ← subframe, ELV, transfer-case, rust… if on pack
forbidden_engines[]           ← engines in shared pain titles NOT on this card
platform note                 ← e.g. F40/F48 UKL FWD vs F20 RWD
```

**AI prompt contract:** “Write buyer pros (1–2 sentences), cons (1–2), summary (3–5). Use only facts in the pack. Do not mention OhMyCar, PLN bands, or engines in `forbidden_engines`. Cite year windows when the pack has them. Tone like e90/f30. en + pl + ru.”

**OFH / family pains:** `n20-oil-filter` titles list many engines — on a B48-only card name **B48** (and B38 if present), never N20/N42/N46 from the shared title.

---

## 3. Quality bar (acceptance)

Pros / cons / summary must:

1. Name **this** generation (code + years + body / platform role).  
2. Name **engines on this card only**.  
3. Tie risks to **pain ids / year windows** already in warehouse (e.g. B48 OFH early 2017–19, N20 chain 2011–15, B47 EGR, transfer case).  
4. Prefer **concrete check actions** (“tight-turn transfer case”, “oil on undertray”, “lift sills”) over slogans.  
5. End sentences with `.` so `VerdictBlock` can bullet them.  
6. Stay short: good/bad ≈ 1–2 sentences; summary ≈ 3–5.  
7. Call out **badge ≠ motor** when the same badge spans engines (420i N20→B48, 420d N47→B47).

Must **not**:

- Invent incidence %, “reliable daily”, or unpaid campaign claims.  
- List N20/N42/… when the card is only B38/B48/B47.  
- Use app meta as a pro/con.  
- Contradict scores (don’t call worst row “safest”).  
- Paste raw pain titles with every engine code from the warehouse string.

---

## 4. Pipeline

```text
  warehouse + volume.ts + catalog scores
              │
              ▼
     buildFactPack(slug)     ← script or agent tool
              │
              ▼
     AI draft (en/pl/ru)     ← agent session / batch
              │
              ▼
     human skim (spot-check vs fact pack)
              │
              ▼
     write CHASSIS[slug] / ENGINES bands
              │
              ▼
     VerdictBlock (override beats Wave 0 derive)
```

**Priority:** AI editorial override **wins**. Wave 0 `deriveChassisVerdict` stays as safety net for unfinished slugs only.

Optional later: `data/warehouse/verdicts/{slug}.json` + import — same shape, easier diffs.

---

## 5. Waves

| Wave | What | Status |
|------|------|--------|
| **0** | Code fallback from live scores/pains (no meta spam) | **done** |
| **1a** | AI briefs: **g20/g21, g30/g31, f15/f16, g05/g06/g07** | **done** |
| **1b** | AI briefs: **f25/g01/g02, f48/f39, f32/f36, f40** | **done** |
| **2** | AI briefs: remaining volume + M / Z / i / 6–8 / classics | **done** (100/100 `CHASSIS`) |
| **3** | AI engine×year bands where chassis brief isn’t enough (N20 vs B48 years, etc.) | pending |
| **S** | Source display scoping ([`SOURCE_DISPLAY_REFINEMENT.md`](./SOURCE_DISPLAY_REFINEMENT.md)) | parallel |

---

## 6. Fact cheat-sheets (fetched)

### Wave 1a

| Slug | Engines on card | Headline themes (warehouse) |
|------|-----------------|------------------------------|
| **g20/g21** | B48, B58 | B48 OFH gasket + early housing 2017–19 / bushing 2025–26; B58 OFH |
| **g30/g31** | B47, B57, B48, B58 | B47 EGR (+ AdBlue); B57 EGR + **22V-614** 540d 2017–18; B48 OFH early/late; B58 OFH |
| **f15/f16** | N55, N57, N63 | N55 water pump / OFH; N57 timing + EGR cooler window; N63 coolant pipes ≤2016, valve stems 2017–19; transfer case on xDrive |
| **g05/g06/g07** | B57, B58 | B57 EGR/AdBlue; B58 / transfer-case on petrol xDrive |

### Wave 1b

| Slug | Engines on card | Headline themes (warehouse) |
|------|-----------------|------------------------------|
| **f25** | N47, N20, N55 | N47 chain mid/late on gen; N20 chain 2011–15 + early OFH housing 2011–12; N55 pump; **transfer case** |
| **g01/g02** | B47, B48, B58 | B47 EGR/AdBlue; B48 OFH early 2017–19 + gasket; B58 / transfer case (M40i) |
| **f48** | B47, B48 | B47 EGR/AdBlue; B48 OFH; transfer case on xDrive (UKL) |
| **f39** | B38, B48, B47 | Same UKL OFH + B47 EGR as F48; fewer listings |
| **f32** | N20, B48, N55, N47, B47 | F30 table: N20→B48 420i, N47→B47 420d, N55 435i |
| **f36** | N20, B48, B47 | Same without N55 row on card |
| **f40** | B38, B48, B47 | FWD UKL (not F20 RWD); OFH on B38/B48; B47 EGR/AdBlue |

Body twins (g21, g31, f16, g06, g02, f36, f39…): same engines as sibling + salt/load-area or coupe note via `BODY_TAIL`.

---

## 7. Checklist

- [x] Method refined: **AI + fact pack**, not templates  
- [x] Wave 0 derive fallback  
- [x] Wave 1a AI chassis briefs shipped (`g20/g21`, `g30/g31`, `f15/f16`, `g05/g06/g07`)  
- [x] Wave 1b AI chassis briefs shipped (`f25/g01/g02`, `f48/f39`, `f32/f36`, `f40`)  
- [x] Wave 2 long-tail — **100/100** chassis have hand `CHASSIS` overrides  
- [ ] Wave 3 engine×year bands (where badge spans motors)  
- [ ] Spot-check F16 / G20 / G30 / G05 / F25 / F40 / M / i3 in UI  
- [ ] Optional warehouse `verdicts/*.json`

---

## 8. Agent runbook (each slug)

1. Dump fact pack (engines from `volume.ts`, pain ids + years from warehouse).  
2. Draft `summary` / `good` / `bad` in en, pl, ru (e90 voice).  
3. Self-check against §3 quality bar (esp. `forbidden_engines`).  
4. Insert into `CHASSIS` in `verdicts.ts` (+ `BODY_TAIL` if Touring/coupe).  
5. Verify `chassisVerdict(slug)` returns the hand override (not derive).
