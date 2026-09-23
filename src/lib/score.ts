import type { ScoreInputs } from "@/data/types";

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Start at 100, subtract. Buy-price is never an input. */
export const SCORE_WEIGHTS = {
  catastrophe: 35,
  fiveYearFix: 25,
  painLoad: 20,
  campaigns: 10,
  partsReality: 10,
} as const;

/** PLN that saturates the 5-year-fix bucket. */
export const FIX_PLN_CAP = 20_000;

/** Full five-bucket scorer — only when every field is quoted (signed packs later). */
export function scoreFromInputs(inputs: {
  catastrophe: number;
  expectedFix5yPln: number;
  painLoad: number;
  campaigns: number;
  partsReality: number;
}): number {
  const catastrophe = clamp01(inputs.catastrophe) * SCORE_WEIGHTS.catastrophe;
  const fiveYearFix =
    Math.min(inputs.expectedFix5yPln / FIX_PLN_CAP, 1) * SCORE_WEIGHTS.fiveYearFix;
  const painLoad = clamp01(inputs.painLoad) * SCORE_WEIGHTS.painLoad;
  const campaigns = clamp01(inputs.campaigns) * SCORE_WEIGHTS.campaigns;
  const partsGap = (1 - clamp01(inputs.partsReality)) * SCORE_WEIGHTS.partsReality;
  const raw = 100 - catastrophe - fiveYearFix - painLoad - campaigns - partsGap;
  return Math.round(Math.min(100, Math.max(0, raw)) * 10) / 10;
}

/** @deprecated Prefer evidenceBreakdown from scoreEvidence for partial packs. */
export function scoreBreakdown(inputs: ScoreInputs | null) {
  if (!inputs) {
    return { catastrophe: 0, fiveYearFix: 0, painLoad: 0, campaigns: 0, partsGap: 0, total: 0 };
  }
  const totalW =
    SCORE_WEIGHTS.catastrophe +
    SCORE_WEIGHTS.painLoad +
    SCORE_WEIGHTS.campaigns +
    (inputs.expectedFix5yPln != null ? SCORE_WEIGHTS.fiveYearFix : 0) +
    (inputs.partsReality != null ? SCORE_WEIGHTS.partsReality : 0);
  const scale = (w: number) => (totalW > 0 ? (w / totalW) * 100 : 0);
  return {
    catastrophe: clamp01(inputs.catastrophe) * scale(SCORE_WEIGHTS.catastrophe),
    fiveYearFix:
      inputs.expectedFix5yPln != null
        ? Math.min(inputs.expectedFix5yPln / FIX_PLN_CAP, 1) * scale(SCORE_WEIGHTS.fiveYearFix)
        : 0,
    painLoad: clamp01(inputs.painLoad) * scale(SCORE_WEIGHTS.painLoad),
    campaigns: clamp01(inputs.campaigns) * scale(SCORE_WEIGHTS.campaigns),
    partsGap:
      inputs.partsReality != null
        ? (1 - clamp01(inputs.partsReality)) * scale(SCORE_WEIGHTS.partsReality)
        : 0,
    total: 0,
  };
}

/** Shared risk colors for score + year pills. Soft mid band so ~45–70 aren’t all-red. */
export function scoreTone(score: number): "good" | "mid" | "bad" {
  if (score >= 70) return "good";
  if (score >= 40) return "mid";
  return "bad";
}
