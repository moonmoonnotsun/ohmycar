import { scoreTone } from "@/lib/score";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";

const colors = {
  good: "bg-[var(--good-bg)] text-[var(--good)]",
  mid: "bg-[var(--mid-bg)] text-[var(--mid)]",
  bad: "bg-[var(--bad-bg)] text-[var(--bad)]",
  none: "bg-[var(--wash)] text-[var(--muted)]",
};

const glow = {
  good: "score-good",
  mid: "score-mid",
  bad: "score-bad",
};

const track = {
  good: "var(--good)",
  mid: "var(--mid)",
  bad: "var(--bad)",
};

export function ScoreBadge({
  score,
  size = "md",
  locale,
  tone: toneOverride,
}: {
  score: number | null | undefined;
  size?: "sm" | "md" | "lg";
  locale?: Locale;
  tone?: "good" | "mid" | "bad";
}) {
  const sizes = {
    sm: "text-sm px-2 py-0.5",
    md: "text-base px-2.5 py-1",
    lg: "text-3xl px-3 py-1.5",
  };
  if (score == null) {
    const label = locale ? t(locale).scorePendingShort : "—";
    return (
      <span className={`inline-flex items-baseline rounded-lg font-semibold tabular-nums ${sizes[size]} ${colors.none}`}>
        {label}
      </span>
    );
  }
  const tone = toneOverride ?? scoreTone(score);
  return (
    <span className={`inline-flex items-baseline rounded-lg font-semibold tabular-nums ${sizes[size]} ${colors[tone]}`}>
      {score.toFixed(1)}
    </span>
  );
}

export function ScoreGlow({
  score,
  className = "",
  locale,
}: {
  score: number | null | undefined;
  className?: string;
  locale?: Locale;
}) {
  if (score == null) {
    return (
      <span className={`tabular-nums text-[var(--muted)] ${className}`}>
        {locale ? t(locale).scorePendingShort : "—"}
      </span>
    );
  }
  return <span className={`tabular-nums ${glow[scoreTone(score)]} ${className}`}>{score.toFixed(1)}</span>;
}

export function ScoreTrack({
  score,
  tone: toneOverride,
  compact = false,
}: {
  score: number | null | undefined;
  tone?: "good" | "mid" | "bad";
  compact?: boolean;
}) {
  if (score == null) {
    return <div className={`relative rounded-full bg-white/10 ${compact ? "mt-1.5 h-1" : "mt-3 h-1.5"}`} />;
  }
  const tone = toneOverride ?? scoreTone(score);
  return (
    <div className={`relative rounded-full bg-white/10 ${compact ? "mt-1.5 h-1" : "mt-3 h-1.5"}`}>
      <div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ width: `${score}%`, background: track[tone] }}
      />
    </div>
  );
}

const circleRim = {
  good: "border-[var(--good)] text-[var(--good)]",
  mid: "border-[var(--mid)] text-[var(--mid)]",
  bad: "border-[var(--bad)] text-[var(--bad)]",
  none: "border-white/35 text-white/70",
};

/** Compact score disc for photo overlays (mobile hero). Same tones as year pills. */
export function ScoreCircle({
  score,
  locale,
  label,
  className = "",
}: {
  score: number | null | undefined;
  locale?: Locale;
  label?: string;
  className?: string;
}) {
  const tone = score == null ? "none" : scoreTone(score);
  const value = score == null ? (locale ? t(locale).scorePendingShort : "—") : score.toFixed(1);
  return (
    <span
      className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full border-2 bg-black/65 px-1.5 font-semibold tabular-nums shadow-[0_4px_16px_rgba(0,0,0,0.45)] backdrop-blur-sm ${circleRim[tone]} ${className}`}
      aria-label={label ? `${label}: ${score == null ? "—" : score.toFixed(1)} / 100` : undefined}
    >
      <span className="font-display text-[0.8rem] leading-none tracking-tight">{value}</span>
    </span>
  );
}
