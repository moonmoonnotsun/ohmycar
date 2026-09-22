# Verdict generation rules (AI + human edit)

**Purpose of this doc:** rules for writing or regenerating the Verdict block (`summary` / `good` / `bad`) for chassis pages and engine×year variants. Use when prompting an LLM, reviewing AI drafts, or hand-rewriting seed copy.

**Product context:** OhMyCar is a Poland-first **pre-inspection briefing** — chassis → engine → year → reliability hypothesis + PLN envelope + deep links. Not VIN history. Not ChatGPT. Not a mechanic’s sign-off.

**Related code (do not invent parallel schemas):**
- Render: `src/components/VerdictBlock.tsx`
- Lookup: `variantVerdict` / `chassisVerdict` in `src/data/verdicts.ts`
- Seed copy: `src/data/verdicts.ts`, `src/data/volumeEngineVerdicts.ts`
- Inputs: `VariantBrief`, `Chassis`, `Pain` in `src/data/types.ts`
- Provenance pipeline: `data/DATA_PIPELINE.md`

---

## 1. What Verdict is for

On a **variant** page the order is: identity → score + buy + repair → **Verdict** → fault cards → score formula → market links.

Verdict is the **glue**: one short briefing that connects the scored row to the main risk the buyer should budget/inspect for.

| Job | Do | Do not |
|-----|----|--------|
| Orient | Name this year + chassis code + badge + engine in plain language | Re-teach the whole product |
| Bridge | Tie the feel of the score to the top fault | Restate the 0–100 formula |
| Act | One concrete check (plate / lift / service history / job name) | Dump the full pain list |
| Disambiguate | Only when badge/year/engine collision is real for *this* row | List every engine it is “not” |
| Tone | Pre-inspection estimate | Cheerlead, roast, or forum-meta |

**Chassis** Verdict: generation + Poland listing/parts reality + shared body risks + “open the engine row.” Twins (`drivetrainOf`) add body delta only (`BODY_TAIL`), not a second engine sermon.

**Non-goals:** VIN report, chat essay, price quote, specialist sign-off, SEO fluff.

---

## 2. Output schema (must match app)

```ts
type Verdict = {
  summary: Localized; // en, pl, ru
  good: Localized;    // Advantages box
  bad: Localized;     // Disadvantages box
};
```

| Field | Length budget | Shape |
|-------|---------------|--------|
| `summary` | 2–4 sentences (mobile shows first 2) | Complete sentences. Fact → risk → one action. |
| `good` | 1–2 short sentences, ≤ ~90 chars EN preferred | Complete sentence(s). Why this row is still bought. |
| `bad` | 1–2 short sentences, ≤ ~90 chars EN preferred | Complete sentence(s). Main money/inspection downside. |

**Locales:** write EN from structured facts first; PL and RU must be real translations of the same claims — not EN dump, not “machine tone” RU. Same facts in all three; no locale-only claims.

**Templates allowed in seed files only:** `{year}` `{model}` `{engine}` `{code}` `{body}` — filled by `fill()` in `verdicts.ts`. AI drafts may use the same placeholders or already-filled values; never invent codes.

**Footer** (“Estimate — not confirmed by a mechanic”) is **i18n only** — never repeat it inside Verdict text.

---

## 3. Allowed ground truth (inputs)

Feed the model **only** facts present in these sources. Prefer structured fields over free prose from old verdicts.

### Required (variant)

| Input | Source | Use for |
|-------|--------|---------|
| `year`, `model`, `engine`, `fuel`, `chassisCode`, `chassisSlug` | `VariantBrief` | Identity |
| `score`, `scoreStatus` | `VariantBrief` | Soft tone only if status = `hypothesis`; never invent a score |
| `topPainId` → `Pain` (`title`, `summary`, `severity`, year window, PLN bands if present) | catalog / `e90.ts` / `volume.ts` | Primary risk |
| Year band / sibling engines on same badge | `EngineLine.years`, catalog matrix | When disambiguation is justified |
| Body word / twin | `BODY_TAIL`, `drivetrainOf` | Body-only delta |

### Optional (when present and cited)

| Input | Source | Caveat |
|-------|--------|--------|
| `medianBuyPln` | warehouse overlay / seed | **Series/year asking**, not engine-specific — do not narrate as “this 330d costs X” |
| `expectedRepairPln` | catalog | Quote only if you need a money cue; UI already shows tiles |
| Campaigns | warehouse `campaigns/` | Severity/context only; never invent VIN clearance |
| Chassis identity | `chassis/*.json`, `chassis.ts` | Years, code, market name |

### Forbidden as invented facts

- Engine codes not on the row
- Year ranges outside `EngineLine.years` / pain windows
- Repair PLN, buy medians, sample sizes without warehouse/seed values
- `signed` status
- Engine-specific market prices (pipeline gap)
- “Forum says”, Reddit, YouTube, ChatGPT opinion
- Cross-generation badge advice (“later 3 Series is better”) unless comparing a sibling **already in catalog** for a real mix-up

**Pipeline rule:** numeric market/campaign facts need provenance (`DATA_PIPELINE.md`). Verdict prose is editorial **hypothesis** until a specialist signs the pack — still must not invent numbers.

---

## 4. Content recipes

### 4.1 Variant recipe (model + engine + year)

**Summary (2–4 sentences):**

1. **Identity** — year, chassis code, badge, engine. One clause. No “The {year} {code} {model} with the {engine} is…” template every time; vary openings.
2. **Typical failure** — name the job tied to `topPainId` (or the year-band risk). Say what it is *not* only if buyers confuse two jobs (e.g. swirl flaps ≠ N47 rear chain).
3. **Buyer action** — plate check, lift (rust/subframe), service history, or “budget {pain} before you buy.”
4. **Optional** — one confuse-with sibling (same badge, different engine/year) **if** the catalog has that collision.

**Good:** why someone still buys this row — parts reality, known job, simpler vs sibling, fuel cost, specialist familiarity in Poland. **Must be a sentence**, not a noun pile.

**Bad:** the dominant downside — top pain, age/rust when it outcosts the engine job, thirst/complexity vs a sibling. **Must be a sentence.** At most one “not X” if it prevents a real mix-up.

### 4.2 Chassis recipe

1. Generation + years + what it is in Poland (common / parts / salt).
2. Shared body/chassis risks (rust, iDrive, transfer case) that apply across engines.
3. Tell the reader the badge does not name the engine — open the engine×year row.
4. Twins: append short body-only note (Touring rails, coupe years, X3 sills) — do not re-list every engine.

### 4.3 Year bands

Split bands when the fault mode changes (M47 vs N47, N52 vs N53, N20 vs B48, early vs late N47). One band = one primary story. Do not merge incompatible risk windows into one Verdict.

### 4.4 Fallback when underspecified

If engine×year has no curated band and pain/score are thin:

- Use `composedVerdict`-style: score (estimate) + named top pain + chassis good/bad.
- Mark for human edit. Do **not** hallucinate a dramatic narrative.

---

## 5. Disambiguation policy (anti-“Not an X” spam)

Product core: same badge can be different cars. Disambiguation is valuable **once**, not as filler.

**Allow one** of these when grounded:

- Confirm engine on the plate / VIN sticker when the badge sat on multiple engines.
- “2005–2007 320d ≠ 2008 320d” style year contrast when bands differ.
- Name the confuse-with sibling (N47 vs M47, N52 vs N53, N57 vs M57, N20 vs B48).

**Ban reflexive contrasts:**

- Saying “not N47” on every petrol or every non-N47 diesel.
- “Not an E90” / “Not a young crossover” as empty punchlines.
- Stacking three “not X” clauses in one summary.
- Engine-code peacocking (“Confirm M57”) when the page already selected M57 and there is no badge collision.

**Rule of thumb:** if removing the “not X” loses no actionable info, delete it.

---

## 6. Voice

| Wanted | Unwanted |
|--------|----------|
| Calm, specific, Poland pre-inspection | Telegram fragments: “Torque, parts, known.” |
| Complete sentences in good/bad | Comma-lists pretending to be sentences |
| Concrete job names (water pump, swirl flaps, rear timing chain) | Vague “known”, “forum”, “strong diesel” |
| Estimate posture without repeating the footer | Meta: “Forum reputation is not a score”, “Not ChatGPT” |
| One idea per sentence | Cheerleading / roasting the car |
| Polish market reality (salt, lift, specialists, parts) | US/UK-only references |

**Language feel:** informed buyer note — short, not cute, not macho, not SEO. Prefer verbs and nouns that name jobs and parts over adjectives.

---

## 7. Anti-patterns (ban list)

Drawn from current seed corpus (`verdicts.ts`, `volumeEngineVerdicts.ts`). Do not regenerate these shapes:

| Anti-pattern | Bad example | Fix |
|--------------|-------------|-----|
| Telegram good/bad | `Torque, parts, known.` | `Parts and torque are easy; the known job is swirl flaps, not a rear chain.` |
| Noun-pile bad | `Flaps and 20-year rust. Not an N57.` | `Budget swirl flaps and body rust; this is not a later N57 330d.` |
| Template monotony | Every summary starts `The {year} {code} {model} with the {engine} is…` | Rotate openings; lead with risk or confuse-with when useful |
| False contrast spam | `Not an E90 and not an N47 timing chain.` on E46 petrol | Drop irrelevant contrasts |
| Product-meta in car copy | `Forum reputation is not a score.` | Keep product voice in README/i18n |
| Duplicate UI | Restating buy median + full score weights + all pains | Point to tiles / fault cards |
| Invented money | “Usually 8–12k PLN to fix” without seed/warehouse | Omit or use provided bands only |
| Engine hallucination | Calling E46 330d an N57 | Engine must equal `VariantBrief.engine` |
| BODY_TAIL echo | Summary already about rust + tail about salt rust | One rust mention total |

---

## 8. Positive exemplars (keep this quality)

**Variant — early E90 330i N52** (`verdicts.ts` `330i-N52`): names cooling job vs engine-out, Poland parts, chassis pains (rust/CAS), one confuse-with (N53). Good/bad are full sentences.

**Variant — E90 320d M47** (`320d-M47`): year-band contrast with N47 is earned; plate check is justified; flaps named.

**Chassis — E90:** Poland density, N52 vs N47 split, salt/subframe, badge≠engine — actionable without telegram tone.

**Negative exemplar — E46 330d M57 good/bad:** `The strong E46 diesel. Torque, parts, known.` / `Flaps and 20-year rust. Not an N57.` — sense is thin, style is fragment spam. Rewrite to sentences tied to `topPainId: swirl-flaps` + age rust vs flap cost.

---

## 9. Anti-hallucination checklist (before accept)

- [ ] `engine` string matches the catalog line exactly (case/code)
- [ ] `year` ∈ engine line years and chosen band `[from, to]`
- [ ] Top pain engines/years include this row (or pain omitted)
- [ ] At most one disambiguation clause; it names a real sibling mix-up
- [ ] No PLN / sample sizes inventing; buy not described as engine-specific
- [ ] No `signed` claim; scoreStatus respected
- [ ] Twin/body: only BODY_TAIL-level body facts
- [ ] good/bad are complete sentences (not comma lists)
- [ ] summary ≤ 4 sentences; first 2 still make sense alone (mobile)
- [ ] pl/ru claim-parity with en
- [ ] Does not duplicate Money tiles, PainCard bodies, or hypothesis footer

---

## 10. Prompt pack (for AI generation)

Use as system/developer instructions. Fill the USER block with JSON facts only.

### System

```text
You write OhMyCar Verdict copy: pre-inspection BMW buyer briefings for Poland.
Output JSON only: { "summary": {"en","pl","ru"}, "good": {"en","pl","ru"}, "bad": {"en","pl","ru"} }.
Rules: complete sentences; 2–4 sentence summary; good/bad ≤2 short sentences each.
Use ONLY provided facts. Never invent engines, years, PLN, campaigns, or signed scores.
At most one badge/engine disambiguation when a real collision is listed.
Name the top pain as the primary risk. Do not restate the score formula or the mechanic disclaimer.
Ban telegram fragments, comma-lists, and reflexive "Not an X" filler.
Tone: calm, specific, estimate — not ChatGPT cheerleading.
```

### User (variant)

```text
Write a Verdict for this variant.

identity: { year, chassisCode, chassisSlug, model, engine, fuel, bodyLabel? }
score: { value, status }          // status is hypothesis|signed
topPain: { id, title, summary, severity, yearFrom?, yearTo? } | null
repairPln: [low, high] | null     // optional; do not invent
buyPln: number | null             // series-level asking only; optional; do not invent
confuseWith: [{ model, engine, years, reason }]  // empty if none
bodyTail: string | null           // twin body note only
bannedClaims: string[]            // pipeline gaps, e.g. "no engine-specific buy"

Follow data/VERDICT_GENERATION.md recipes. Return JSON only.
```

### User (chassis)

```text
Write a chassis-level Verdict.

chassis: { code, slug, years, name, engines?, drivetrainOf? }
polandNotes: { common?, rust?, parts? }   // only if provided
bodyTail: string | null

Tell the reader to open engine×year rows. No invented scores.
Return JSON only.
```

### Reviewer pass (second call or human)

```text
Reject or rewrite if: telegram good/bad; >1 "not X"; invented PLN/engine;
summary opens with the same template as every other row; meta product slogans;
first two sentences fail as a mobile preview.
```

---

## 11. Keying & storage (keep app compatible)

| Page | Function | Key |
|------|----------|-----|
| Chassis | `chassisVerdict(chassis)` | `CHASSIS[slug]` |
| Variant (E90 family) | `variantVerdict` | `ENGINES["{model}-{engine}"]` year band |
| Variant (other) | `variantVerdict` | `ENGINES["{source}:{model}-{engine}"]` where `source = drivetrainOf ?? slug` |
| Miss | `composedVerdict` | score + top pain + chassis good/bad |

When adding AI output to seed files, keep `band(from, to, summaryEn, summaryPl, goodEn, goodPl, badEn, badPl, summaryRu, goodRu, badRu)` argument order used by existing `band()` helpers.

---

## 12. Worked rewrite (E46 330d M57 — anti-cringe)

**Inputs (conceptual):** year 2003, E46, 330d, M57, diesel; topPain `swirl-flaps`; age rust often exceeds flap job; confuse-with later 330d N57 / N47 fours.

**Reject (current seed sense/style):**
- good: `The strong E46 diesel. Torque, parts, known.`
- bad: `Flaps and 20-year rust. Not an N57.`

**Accept (same facts, better sense):**

- **good:** `This M57 six still has common parts and known specialists in Poland; the usual job is swirl flaps, not a gearbox-end chain.`
- **bad:** `Budget flap work and body rust on a lift — a rotten shell often costs more than the intake repair.`
- **summary:** `A 2003 E46 330d with the M57 is the diesel six of this generation: swirl flaps and EGR are the usual engine costs. Confirm M57 on the plate so you do not confuse it with a later N57 330d or an N47 four. After twenty years of Polish salt, inspect the subframe and sills before you celebrate a cheap flaps quote.`

(Then translate claim-parity to PL/RU.)

---

## 13. Compliance with the data pipeline

- Verdicts remain **editorial hypotheses** until score packs are specialist-signed.
- Do not invent medians, repair PLN, or sample sizes — see `DATA_PIPELINE.md`.
- Prefer warehouse pains/engines/chassis identity when migrating off hand seed.
- Buy narration: series/year only; never claim engine-resolved asking prices until the warehouse supports them.

---

## 14. Definition of done

A Verdict is done when:

1. A buyer scanning good/bad knows **why buy** and **what to budget/inspect**.
2. Summary alone (first two sentences) works on mobile.
3. Checklist in §9 passes.
4. No banned anti-patterns from §7.
5. Stored under the correct key/band for `variantVerdict` / `chassisVerdict`.
`)