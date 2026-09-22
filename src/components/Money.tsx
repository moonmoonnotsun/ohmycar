import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { formatPlnAmount } from "@/lib/links";

function isEmptyPlnRange(range: [number, number] | null | undefined): boolean {
  if (!range) return true;
  return range[0] <= 0 && range[1] <= 0;
}

export function Money({
  value,
  locale,
  size = "md",
}: {
  value: number | null | undefined;
  locale: Locale;
  size?: "sm" | "md" | "lg";
}) {
  if (value == null || value <= 0) {
    return <MoneyNa locale={locale} size={size} />;
  }
  return <MoneyCell amount={formatPlnAmount(value, locale)} locale={locale} size={size} />;
}

export function MoneyRange({
  range,
  locale,
  size = "sm",
}: {
  range: [number, number] | null | undefined;
  locale: Locale;
  size?: "sm" | "md" | "lg";
}) {
  if (isEmptyPlnRange(range)) {
    return <MoneyNa locale={locale} size={size} />;
  }
  const amount = `${formatPlnAmount(range![0], locale)}\u2060–\u2060${formatPlnAmount(range![1], locale)}`;
  return <MoneyCell amount={amount} locale={locale} size={size} />;
}

export function FixBand({
  range,
  locale,
  hint = false,
  compact = false,
}: {
  range: [number, number] | null | undefined;
  locale: Locale;
  hint?: boolean;
  compact?: boolean;
}) {
  const copy = t(locale);
  const empty = isEmptyPlnRange(range);
  return (
    <div>
      <p
        className={`font-semibold uppercase tracking-[0.14em] text-[var(--muted)] ${
          compact ? "text-[11px]" : "text-xs"
        }`}
      >
        {copy.repair}
      </p>
      <div className={compact ? "mt-0.5" : "mt-1"}>
        <MoneyRange range={range} locale={locale} />
      </div>
      {hint && !empty ? (
        <p className="mt-1 max-w-[16rem] text-xs leading-4 text-[var(--muted)]">{copy.repairHint}</p>
      ) : null}
    </div>
  );
}

function MoneyNa({ locale, size = "md" }: { locale: Locale; size?: "sm" | "md" | "lg" }) {
  const copy = t(locale);
  const amountSize = size === "lg" ? "text-xl sm:text-2xl" : size === "sm" ? "text-[13px]" : "text-[15px]";
  const pad = size === "lg" ? "px-3 py-1.5" : "px-2 py-1";
  return (
    <span
      className={`inline-flex max-w-full shrink-0 items-baseline whitespace-nowrap rounded-lg bg-[var(--mid-bg)] ${pad}`}
    >
      <span
        className={`font-mono font-semibold leading-none tracking-tight text-[var(--ink)] ${amountSize}`}
      >
        {copy.na}
      </span>
    </span>
  );
}

function MoneyCell({
  amount,
  locale,
  size = "md",
}: {
  amount: string;
  locale: Locale;
  size?: "sm" | "md" | "lg";
}) {
  const amountSize = size === "lg" ? "text-xl sm:text-2xl" : size === "sm" ? "text-[13px]" : "text-[15px]";
  const currencySize = size === "lg" ? "text-xs" : "text-[11px]";
  const pad = size === "lg" ? "px-3 py-1.5" : "px-2 py-1";
  return (
    <span
      className={`inline-flex max-w-full shrink-0 items-baseline gap-1.5 whitespace-nowrap rounded-lg bg-[var(--mid-bg)] ${pad}`}
    >
      <span
        className={`font-mono font-semibold tabular-nums leading-none tracking-tight whitespace-nowrap text-[var(--ink)] ${amountSize}`}
      >
        {amount}
      </span>
      <span className={`${currencySize} font-semibold uppercase tracking-wide text-[var(--accent)]`}>
        {locale === "pl" ? "zł" : "PLN"}
      </span>
    </span>
  );
}
