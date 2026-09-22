export type ChassisTag = "volume" | "famous" | "both";
export type ChassisFamily = "3" | "4" | "5" | "1" | "2" | "x" | "luxury" | "z" | "i";
export type Fuel = "petrol" | "diesel";
/** hypothesis removed from runtime — only evidence packs or insufficient. */
export type ScoreStatus = "evidence_derived" | "signed" | "insufficient";
export type PainSeverity =
  | "engine-loss"
  | "expensive"
  | "overheat"
  | "safety"
  | "stranded"
  | "annoyance";

export type Localized = { en: string; pl: string; ru: string };

export type Chassis = {
  slug: string;
  code: string;
  name: Localized;
  years: string;
  yearStart: number;
  yearEnd: number | null;
  tag: ChassisTag;
  family: ChassisFamily;
  gold?: boolean;
  /** Shared drivetrain briefing, e.g. E91 → e90 */
  drivetrainOf?: string;
  engines?: string[];
  search: string[];
};

export type ScoreInputs = {
  catastrophe: number;
  /** Null until job quotes exist — bucket omitted from score. */
  expectedFix5yPln: number | null;
  painLoad: number;
  campaigns: number;
  /** Null until parts stock quotes exist — bucket omitted from score. */
  partsReality: number | null;
};

/** Legacy seed shape only — ignored at runtime. */
export type SeedScoreInputs = {
  catastrophe: number;
  expectedFix5yPln: number;
  painLoad: number;
  campaigns: number;
  partsReality: number;
};

export type EngineLine = {
  model: string;
  engine: string;
  fuel: Fuel;
  years: number[];
  topPainId: string;
  /** Seed only — ignored at runtime (warehouse buy overlay or null). */
  medianBuyPlnByYear?: Record<number, number>;
  /** Seed only — ignored at runtime. */
  repairPln?: [number, number];
  /** Seed only — ignored at runtime (evidence pack replaces). */
  inputsByYear?: Record<number, SeedScoreInputs>;
};

export type Pain = {
  id: string;
  engines: string[];
  yearFrom?: number;
  yearTo?: number;
  title: Localized;
  affects: Localized;
  summary: Localized;
  severity: PainSeverity;
  /** Null until parts+labor quote collected — never invent PLN. */
  plnIndependent: [number, number] | null;
  plnSpecialist: [number, number] | null;
  plnAso: [number, number] | null;
  /** Optional buy-parts band (PLN). When set with labor, UI shows Parts + Labor = Full. */
  plnParts: [number, number] | null;
  /** Optional labor-only band (PLN), usually independent-shop prior. */
  plnLabor: [number, number] | null;
  plnNote?: string;
  oemHint?: string;
  autodocQuery: Localized;
  sources: { label: string; url: string }[];
  /** Limit a shared pain to these chassis (and their drivetrain twins). */
  chassisSlugs?: string[];
  /** Optional diagram of the failing part. Empty = placeholder. */
  diagram?: string;
};

export type VariantBrief = {
  slug: string;
  chassisSlug: string;
  chassisCode: string;
  year: number;
  model: string;
  engine: string;
  fuel: Fuel;
  /** Null when no warehouse pain evidence for this cell. */
  score: number | null;
  scoreStatus: ScoreStatus;
  /** Null when no CarDossier warehouse row. */
  medianBuyPln: number | null;
  /** Null until at least one warehouse pain has quoted PLN bands. */
  expectedRepairPln: [number, number] | null;
  topPainId: string;
  inputs: ScoreInputs | null;
  scoreIncomplete?: string[];
};
