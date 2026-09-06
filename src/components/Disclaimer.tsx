import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export function Disclaimer({ locale }: { locale: Locale }) {
  return <p className="max-w-3xl text-xs leading-5 text-[var(--muted)]">{t(locale).disclaimer}</p>;
}
