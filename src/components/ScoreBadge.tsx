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
}: {
  score: number | null | undefined;
  tone?: "good" | "mid" | "bad";
}) {
  if (score == null) {
    return <div className="relative mt-3 h-1.5 rounded-full bg-white/10" />;
  }
  const tone = toneOverride ?? scoreTone(score);
  return (
    <div className="relative mt-3 h-1.5 rounded-full bg-white/10">
      <div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ width: `${score}%`, background: track[tone] }}
      />
    </div>
  );
}
