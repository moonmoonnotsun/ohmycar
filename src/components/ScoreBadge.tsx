import { scoreTone } from "@/lib/score";

const colors = {
  good: "bg-[var(--good-bg)] text-[var(--good)]",
  mid: "bg-[var(--mid-bg)] text-[var(--mid)]",
  bad: "bg-[var(--bad-bg)] text-[var(--bad)]",
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
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const tone = scoreTone(score);
  const sizes = {
    sm: "text-sm px-2 py-0.5",
    md: "text-base px-2.5 py-1",
    lg: "text-3xl px-3 py-1.5",
  };
  return (
    <span className={`inline-flex items-baseline rounded-lg font-semibold tabular-nums ${sizes[size]} ${colors[tone]}`}>
      {score.toFixed(1)}
    </span>
  );
}

export function ScoreGlow({
  score,
  className = "",
}: {
  score: number;
  className?: string;
}) {
  return <span className={`tabular-nums ${glow[scoreTone(score)]} ${className}`}>{score.toFixed(1)}</span>;
}

export function ScoreTrack({ score }: { score: number }) {
  const tone = scoreTone(score);
  return (
    <div className="relative mt-4 h-1.5 rounded-full bg-white/10">
      <div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ width: `${score}%`, background: track[tone] }}
      />
    </div>
  );
}
