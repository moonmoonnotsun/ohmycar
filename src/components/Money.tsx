import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { formatPlnAmount } from "@/lib/links";

export function Money({ value, locale }: { value: number; locale: Locale }) {
  return <MoneyCell amount={formatPlnAmount(value, locale)} locale={locale} />;
}

export function MoneyRange({ range, locale }: { range: [number, number]; locale: Locale }) {
  const amount = `${formatPlnAmount(range[0], locale)}\u2060–\u2060${formatPlnAmount(range[1], locale)}`;
  return <MoneyCell amount={amount} locale={locale} size="sm" />;
}

export function FixBand({
  range,
  locale,
  hint = false,
  compact = false,
}: {
  range: [number, number];
  locale: Locale;
  hint?: boolean;
  compact?: boolean;
}) {
  const copy = t(locale);
  return (
    <div>
      <p
        className={`font-semibold uppercase tracking-[0.16em] text-[var(--muted)] ${
          compact ? "text-[9px]" : "text-[10px]"
        }`}
      >
        {copy.repair}
      </p>
      <div className={compact ? "mt-0.5" : "mt-1"}>
        <MoneyRange range={range} locale={locale} />
      </div>
      {hint ? <p className="mt-1 max-w-[16rem] text-[11px] leading-4 text-[var(--muted)]">{copy.repairHint}</p> : null}
    </div>
  );
}

function MoneyCell({
  amount,
  locale,
  size = "md",
}: {
  amount: string;
  locale: Locale;
  size?: "sm" | "md";
}) {
  return (
    <span className="inline-flex max-w-full shrink-0 items-baseline gap-1 whitespace-nowrap rounded-lg bg-[var(--mid-bg)] px-2 py-1">
      <span
        className={`font-mono font-semibold tabular-nums leading-none tracking-tight whitespace-nowrap text-[var(--ink)] ${
          size === "sm" ? "text-[13px]" : "text-[15px]"
        }`}
      >
        {amount}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
        {locale === "pl" ? "zł" : "PLN"}
      </span>
    </span>
  );
}
