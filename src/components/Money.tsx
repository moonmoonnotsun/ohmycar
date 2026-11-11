import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { formatPlnAmount } from "@/lib/links";

/** Campaign / recall jobs stored as [0, 0] — show Free, not N/A. */
function isFreePlnRange(range: [number, number] | null | undefined): boolean {
  return Boolean(range && range[0] === 0 && range[1] === 0);
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
  variant = "pill",
  tone,
}: {
  range: [number, number] | null | undefined;
  locale: Locale;
  size?: "sm" | "md" | "lg";
  /** pill = badge (default). plain = tabular text for estimate rows. */
  variant?: "pill" | "plain";
  /** Match shop ladder: good=independent, mid=specialist, bad=ASO. */
  tone?: "good" | "mid" | "bad";
}) {
  if (!range) {
    return variant === "plain" ? (
      <span className="font-mono text-[13px] tabular-nums text-[var(--muted)]">{t(locale).na}</span>
    ) : (
      <MoneyNa locale={locale} size={size} />
    );
  }
  if (isFreePlnRange(range)) {
    if (variant === "plain") {
      const freeSize = size === "lg" ? "text-2xl sm:text-3xl" : size === "md" ? "text-base" : "text-[13px]";
      return (
        <span className={`font-semibold tracking-tight text-[var(--good)] ${freeSize}`}>
          {t(locale).free}
        </span>
      );
    }
    return <MoneyFree locale={locale} size={size} />;
  }
  const amount = `${formatPlnAmount(range[0], locale)}\u2060–\u2060${formatPlnAmount(range[1], locale)}`;
  const color = moneyToneClass(tone);
  if (variant === "plain") {
    const amountSize = size === "lg" ? "text-2xl sm:text-3xl" : size === "md" ? "text-base" : "text-[13px]";
    return (
      <span className={`inline-flex items-baseline gap-1.5 whitespace-nowrap ${amountSize} ${color}`}>
        <span className="font-mono font-semibold tabular-nums tracking-tight">{amount}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {locale === "pl" ? "zł" : "PLN"}
        </span>
      </span>
    );
  }
  return <MoneyCell amount={amount} locale={locale} size={size} tone={tone} />;
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
  const empty = !range;
  const free = isFreePlnRange(range);
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
      {hint && !empty && !free ? (
        <p className="mt-1 max-w-[16rem] text-xs leading-4 text-[var(--muted)]">{copy.repairHint}</p>
      ) : null}
    </div>
  );
}

function moneyToneClass(tone?: "good" | "mid" | "bad") {
  if (tone === "good") return "text-[var(--good)]";
  if (tone === "bad") return "text-[var(--bad)]";
  return "text-[var(--mid)]";
}

function moneyToneBg(tone?: "good" | "mid" | "bad") {
  if (tone === "good") return "bg-[var(--good-bg)]";
  if (tone === "bad") return "bg-[var(--bad-bg)]";
  return "bg-[var(--mid-bg)]";
}

function MoneyFree({ locale, size = "md" }: { locale: Locale; size?: "sm" | "md" | "lg" }) {
  const copy = t(locale);
  const amountSize = size === "lg" ? "text-xl sm:text-2xl" : size === "sm" ? "text-[13px]" : "text-[15px]";
  const pad = size === "lg" ? "px-3 py-1.5" : "px-2 py-1";
  return (
    <span
      className={`inline-flex w-max max-w-full items-baseline whitespace-nowrap rounded-lg bg-[var(--good-bg)] ${pad}`}
    >
      <span className={`font-semibold leading-none tracking-tight text-[var(--good)] ${amountSize}`}>
        {copy.free}
      </span>
    </span>
  );
}

function MoneyNa({ locale, size = "md" }: { locale: Locale; size?: "sm" | "md" | "lg" }) {
  const copy = t(locale);
  const amountSize = size === "lg" ? "text-xl sm:text-2xl" : size === "sm" ? "text-[13px]" : "text-[15px]";
  const pad = size === "lg" ? "px-3 py-1.5" : "px-2 py-1";
  return (
    <span
      className={`inline-flex w-max max-w-full items-baseline whitespace-nowrap rounded-lg bg-[var(--wash)] ${pad}`}
    >
      <span className={`font-mono font-semibold leading-none tracking-tight text-[var(--muted)] ${amountSize}`}>
        {copy.na}
      </span>
    </span>
  );
}

function MoneyCell({
  amount,
  locale,
  size = "md",
  tone,
}: {
  amount: string;
  locale: Locale;
  size?: "sm" | "md" | "lg";
  tone?: "good" | "mid" | "bad";
}) {
  const amountSize = size === "lg" ? "text-xl sm:text-2xl" : size === "sm" ? "text-[13px]" : "text-[15px]";
  const currencySize = size === "lg" ? "text-xs" : "text-[11px]";
  const pad = size === "lg" ? "px-3 py-1.5" : "px-2 py-1";
  const color = moneyToneClass(tone);
  return (
    <span
      className={`inline-flex w-max max-w-full items-baseline gap-1.5 whitespace-nowrap rounded-lg ${moneyToneBg(tone)} ${pad} ${color}`}
    >
      <span className={`font-mono font-semibold tabular-nums leading-none tracking-tight ${amountSize}`}>
        {amount}
      </span>
      <span className={`shrink-0 font-semibold uppercase tracking-wide ${currencySize}`}>
        {locale === "pl" ? "zł" : "PLN"}
      </span>
    </span>
  );
}
