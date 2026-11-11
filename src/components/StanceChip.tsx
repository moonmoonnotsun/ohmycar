import { AlertCircle, AlertTriangle, ShieldCheck, type LucideIcon } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { scoreStance, type ScoreStance } from "@/lib/score";

const stanceClass: Record<ScoreStance, string> = {
  prefer: "border-[var(--good)] bg-[var(--good-bg)] text-[var(--good)]",
  caution: "border-[var(--mid)] bg-[var(--mid-bg)] text-[var(--mid)]",
  avoid: "border-[var(--bad)] bg-[var(--bad-bg)] text-[var(--bad)]",
};

const stanceIcon: Record<ScoreStance, LucideIcon> = {
  prefer: ShieldCheck,
  caution: AlertTriangle,
  avoid: AlertCircle,
};

export function StanceChip({
  locale,
  score,
  stance: stanceOverride,
  variant = "pill",
  className = "",
}: {
  locale: Locale;
  score?: number | null;
  stance?: ScoreStance | null;
  /** pill = hero chips; tag = MotorFiable-style verdict corner tag */
  variant?: "pill" | "tag";
  className?: string;
}) {
  const copy = t(locale);
  const stance = stanceOverride ?? scoreStance(score);
  if (!stance) return null;

  const label =
    stance === "prefer" ? copy.stancePrefer : stance === "caution" ? copy.stanceCaution : copy.stanceAvoid;
  const Icon = stanceIcon[stance];

  const shape =
    variant === "tag"
      ? "h-8 gap-1.5 rounded-md px-3 text-[12px] font-semibold"
      : "h-7 gap-1 rounded-full px-2.5 text-[11px] font-semibold tracking-wide";

  return (
    <span className={`inline-flex shrink-0 items-center border ${shape} ${stanceClass[stance]} ${className}`}>
      <Icon className={variant === "tag" ? "size-3.5" : "size-3"} strokeWidth={2.25} aria-hidden />
      {label}
    </span>
  );
}
