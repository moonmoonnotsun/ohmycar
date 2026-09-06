import type { Locale } from "@/lib/locale";
import { formatPlnAmount } from "@/lib/links";

export function Money({ value, locale }: { value: number; locale: Locale }) {
  return <MoneyCell amount={formatPlnAmount(value, locale)} locale={locale} />;
}

export function MoneyRange({ range, locale }: { range: [number, number]; locale: Locale }) {
  const amount = `${formatPlnAmount(range[0], locale)}\u2060–\u2060${formatPlnAmount(range[1], locale)}`;
  return <MoneyCell amount={amount} locale={locale} size="sm" />;
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
