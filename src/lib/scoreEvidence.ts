import campaignsDoc from "@/data/imported/campaigns.json";
import type { Pain, PainSeverity, ScoreInputs, ScoreStatus } from "@/data/types";
import { SCORE_WEIGHTS, FIX_PLN_CAP } from "@/lib/score";

/** Documented in data/warehouse/score_inputs/rules_v1.json */
export const SCORE_RULE_ID = "score-evidence-v1";

const CATASTROPHE: Record<PainSeverity, number> = {
  "engine-loss": 0.9,
  safety: 0.6,
  expensive: 0.4,
  overheat: 0.45,
  stranded: 0.35,
  annoyance: 0.12,
};

const PAIN_WEIGHT: Record<PainSeverity, number> = {
  "engine-loss": 1.0,
  safety: 0.7,
  expensive: 0.45,
  overheat: 0.5,
  stranded: 0.4,
  annoyance: 0.15,
};

type CampaignRow = {
  chassis_slugs: string[];
  severity: string;
  vehicles_in_pl?: number;
  source?: { url?: string };
  id: string;
};

const campaignRows = (campaignsDoc.rows ?? []) as CampaignRow[];

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function campaignScoreForChassis(chassisSlug: string, sourceSlug: string): {
  value: number;
  campaignIds: string[];
  sources: string[];
} {
  const hits = campaignRows.filter(
    (row) => row.chassis_slugs.includes(chassisSlug) || row.chassis_slugs.includes(sourceSlug),
  );
  if (hits.length === 0) return { value: 0, campaignIds: [], sources: [] };

  const scored = hits.map((row) => {
    const base = row.severity === "safety" ? 0.45 : 0.2;
    const volume = Math.min(0.25, (row.vehicles_in_pl ?? 0) / 200_000);
    return clamp01(base + volume);
  });
  let value = Math.max(...scored);
  if (hits.length > 1) value = clamp01(value + 0.05 * (hits.length - 1));
  value = Math.min(0.85, value);

  return {
    value,
    campaignIds: hits.map((row) => row.id),
    sources: hits.map((row) => row.source?.url).filter((u): u is string => Boolean(u)),
  };
}

export type EvidencePack = {
  inputs: ScoreInputs;
  score: number;
  scoreStatus: ScoreStatus;
  incomplete: string[];
  traces: {
    ruleId: string;
    topPainId: string;
    catastropheFrom: PainSeverity;
    campaignIds: string[];
    painIds: string[];
    sourceUrls: string[];
  };
};

/**
 * Build score from warehouse pains + UOKiK only.
 * Returns null if there is no sourced pain evidence for this variant.
 */
export function deriveEvidencePack(args: {
  chassisSlug: string;
  sourceSlug: string;
  pains: Pain[];
  topPainId: string;
}): EvidencePack | null {
  const { chassisSlug, sourceSlug, pains, topPainId } = args;
  if (pains.length === 0) return null;

  const headline = pains.find((p) => p.id === topPainId) ?? pains[0];
  const catastrophe = CATASTROPHE[headline.severity];
  const painLoad = clamp01(pains.reduce((sum, p) => sum + PAIN_WEIGHT[p.severity], 0) / 2.5);
  const camp = campaignScoreForChassis(chassisSlug, sourceSlug);

  const incomplete = ["fiveYearFix", "partsReality"];
  const inputs: ScoreInputs = {
    catastrophe,
    expectedFix5yPln: null,
    painLoad,
    campaigns: camp.value,
    partsReality: null,
  };

  const score = scoreFromEvidenceInputs(inputs);
  const sourceUrls = [
    ...pains.flatMap((p) => p.sources.map((s) => s.url)),
    ...camp.sources,
  ];

  return {
    inputs,
    score,
    scoreStatus: "evidence_derived",
    incomplete,
    traces: {
      ruleId: SCORE_RULE_ID,
      topPainId: headline.id,
      catastropheFrom: headline.severity,
      campaignIds: camp.campaignIds,
      painIds: pains.map((p) => p.id),
      sourceUrls: [...new Set(sourceUrls)],
    },
  };
}

/** Renormalize weights among present buckets; omit null PLN / parts. */
export function scoreFromEvidenceInputs(inputs: ScoreInputs): number {
  type Bucket = { weight: number; fraction: number };
  const buckets: Bucket[] = [
    { weight: SCORE_WEIGHTS.catastrophe, fraction: clamp01(inputs.catastrophe) },
    { weight: SCORE_WEIGHTS.painLoad, fraction: clamp01(inputs.painLoad) },
    { weight: SCORE_WEIGHTS.campaigns, fraction: clamp01(inputs.campaigns) },
  ];
  if (inputs.expectedFix5yPln != null) {
    buckets.push({
      weight: SCORE_WEIGHTS.fiveYearFix,
      fraction: Math.min(inputs.expectedFix5yPln / FIX_PLN_CAP, 1),
    });
  }
  if (inputs.partsReality != null) {
    buckets.push({
      weight: SCORE_WEIGHTS.partsReality,
      fraction: 1 - clamp01(inputs.partsReality),
    });
  }

  const totalW = buckets.reduce((sum, b) => sum + b.weight, 0);
  if (totalW <= 0) return 0;
  const penalty = buckets.reduce((sum, b) => sum + b.fraction * ((b.weight / totalW) * 100), 0);
  const raw = 100 - penalty;
  return Math.round(Math.min(100, Math.max(0, raw)) * 10) / 10;
}

export function evidenceBreakdown(inputs: ScoreInputs) {
  type Row = { key: string; points: number };
  const totalW =
    SCORE_WEIGHTS.catastrophe +
    SCORE_WEIGHTS.painLoad +
    SCORE_WEIGHTS.campaigns +
    (inputs.expectedFix5yPln != null ? SCORE_WEIGHTS.fiveYearFix : 0) +
    (inputs.partsReality != null ? SCORE_WEIGHTS.partsReality : 0);

  const scale = (w: number) => (totalW > 0 ? (w / totalW) * 100 : 0);
  const rows: Row[] = [
    { key: "catastrophe", points: clamp01(inputs.catastrophe) * scale(SCORE_WEIGHTS.catastrophe) },
    { key: "painLoad", points: clamp01(inputs.painLoad) * scale(SCORE_WEIGHTS.painLoad) },
    { key: "campaigns", points: clamp01(inputs.campaigns) * scale(SCORE_WEIGHTS.campaigns) },
  ];
  if (inputs.expectedFix5yPln != null) {
    rows.push({
      key: "fiveYearFix",
      points: Math.min(inputs.expectedFix5yPln / FIX_PLN_CAP, 1) * scale(SCORE_WEIGHTS.fiveYearFix),
    });
  }
  if (inputs.partsReality != null) {
    rows.push({
      key: "partsGap",
      points: (1 - clamp01(inputs.partsReality)) * scale(SCORE_WEIGHTS.partsReality),
    });
  }
  return {
    catastrophe: rows.find((r) => r.key === "catastrophe")!.points,
    fiveYearFix: rows.find((r) => r.key === "fiveYearFix")?.points ?? 0,
    painLoad: rows.find((r) => r.key === "painLoad")!.points,
    campaigns: rows.find((r) => r.key === "campaigns")!.points,
    partsGap: rows.find((r) => r.key === "partsGap")?.points ?? 0,
    omitted: [
      ...(inputs.expectedFix5yPln == null ? (["fiveYearFix"] as const) : []),
      ...(inputs.partsReality == null ? (["partsReality"] as const) : []),
    ],
    total: scoreFromEvidenceInputs(inputs),
  };
}
