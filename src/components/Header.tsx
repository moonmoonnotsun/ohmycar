"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/locale";
import { locales, switchLocalePath } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const LANG_NAME: Record<Locale, string> = {
  en: "English",
  pl: "Polski",
  ru: "Русский",
};

export function Header({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const pathname = usePathname() || `/${locale}`;
  const router = useRouter();
  const parts = pathname.split("/").filter(Boolean);
  const onCatalog = parts[1] === "bmw" && !parts[2];
  const onScore = parts[1] === "score";

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[var(--paper)]/80 backdrop-blur-xl safe-top">
      <div className="mx-auto flex h-12 items-center justify-between gap-3 px-4 sm:h-14 sm:px-6 md:max-w-5xl">
        <Link href={`/${locale}`} className="min-w-0 shrink-0 font-display text-[1.35rem] leading-none sm:text-[1.5rem]">
          <span className="text-[var(--accent)]">Oh</span>MyCar
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href={`/${locale}/bmw`}
            className={`hidden h-tap items-center rounded-full border px-3 font-medium md:inline-flex ${
              onCatalog
                ? "border-[var(--accent)] text-[var(--ink)]"
                : "tap border-transparent text-[var(--muted)]"
            }`}
          >
            {copy.catalog}
          </Link>
          <Link
            href={`/${locale}/score`}
            className={`h-tap inline-flex items-center rounded-full border px-3 font-medium ${
              onScore
                ? "border-[var(--accent)] text-[var(--ink)]"
                : "tap border-transparent text-[var(--muted)]"
            }`}
          >
            {copy.scoreShort}
          </Link>
          <div className="relative ml-1 inline-flex">
            <label htmlFor="lang-select" className="sr-only">
              {copy.lang}
            </label>
            <select
              id="lang-select"
              value={locale}
              onChange={(event) => {
                const next = event.target.value as Locale;
                if (locales.includes(next)) router.push(switchLocalePath(pathname, locale, next));
              }}
              className="lang-select h-tap appearance-none rounded-full border border-white/12 bg-[var(--card)] pl-3 pr-8 text-xs font-semibold text-[var(--ink)] outline-none ring-[var(--accent)] focus:border-[var(--accent)] focus:ring-1"
            >
              {locales.map((item) => (
                <option key={item} value={item}>
                  {LANG_NAME[item]}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[var(--muted)]">
              ▾
            </span>
          </div>
        </nav>
      </div>
      <Breadcrumbs locale={locale} />
    </header>
  );
}
