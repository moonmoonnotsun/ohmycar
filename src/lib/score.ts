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

export function scoreFromInputs(inputs: ScoreInputs): number {
  const catastrophe = clamp01(inputs.catastrophe) * SCORE_WEIGHTS.catastrophe;
  const fiveYearFix =
    Math.min(inputs.expectedFix5yPln / FIX_PLN_CAP, 1) * SCORE_WEIGHTS.fiveYearFix;
  const painLoad = clamp01(inputs.painLoad) * SCORE_WEIGHTS.painLoad;
  const campaigns = clamp01(inputs.campaigns) * SCORE_WEIGHTS.campaigns;
  const partsGap = (1 - clamp01(inputs.partsReality)) * SCORE_WEIGHTS.partsReality;
  const raw = 100 - catastrophe - fiveYearFix - painLoad - campaigns - partsGap;
  return Math.round(Math.min(100, Math.max(0, raw)) * 10) / 10;
}

export function scoreBreakdown(inputs: ScoreInputs) {
  const catastrophe = clamp01(inputs.catastrophe) * SCORE_WEIGHTS.catastrophe;
  const fiveYearFix =
    Math.min(inputs.expectedFix5yPln / FIX_PLN_CAP, 1) * SCORE_WEIGHTS.fiveYearFix;
  const painLoad = clamp01(inputs.painLoad) * SCORE_WEIGHTS.painLoad;
  const campaigns = clamp01(inputs.campaigns) * SCORE_WEIGHTS.campaigns;
  const partsGap = (1 - clamp01(inputs.partsReality)) * SCORE_WEIGHTS.partsReality;
  return {
    catastrophe,
    fiveYearFix,
    painLoad,
    campaigns,
    partsGap,
    total: scoreFromInputs(inputs),
  };
}

export function scoreTone(score: number): "good" | "mid" | "bad" {
  if (score >= 75) return "good";
  if (score >= 50) return "mid";
  return "bad";
}
