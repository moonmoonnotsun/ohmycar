"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/locale";
import { locales, switchLocalePath } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const LANG_CODE: Record<Locale, string> = {
  en: "EN",
  pl: "PL",
  ru: "RU",
};

export function Header({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const pathname = usePathname() || `/${locale}`;
  const parts = pathname.split("/").filter(Boolean);
  const onCatalog = parts[1] === "bmw" && !parts[2];
  const onScore = parts[1] === "score";
  const onCompare = parts[1] === "compare";
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    function onPointer(event: PointerEvent) {
      if (!langRef.current?.contains(event.target as Node)) setLangOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLangOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [langOpen]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const publish = () => {
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    };
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-white/8 bg-[var(--paper)] safe-top"
    >      <div className="mx-auto flex h-12 items-center justify-between gap-3 px-4 sm:h-14 sm:px-6 md:max-w-5xl">
        <Link href={`/${locale}`} className="min-w-0 shrink-0 font-display text-[1.35rem] leading-none sm:text-[1.5rem]">
          <span className="text-[var(--accent)]">Oh</span>MyCar
        </Link>
        <nav className="flex items-center gap-0.5 text-sm sm:gap-1">
          <Link
            href={`/${locale}/bmw`}
            className={`h-tap inline-flex items-center rounded-full border px-2.5 font-medium sm:px-3 ${
              onCatalog
                ? "border-[var(--accent)] text-[var(--ink)]"
                : "tap border-transparent text-[var(--muted)]"
            }`}
          >
            <span className="md:hidden">{copy.catalogShort}</span>
            <span className="hidden md:inline">{copy.catalog}</span>
          </Link>
          <Link
            href={`/${locale}/compare`}
            className={`h-tap inline-flex items-center rounded-full border px-2.5 font-medium sm:px-3 ${
              onCompare
                ? "border-[var(--accent)] text-[var(--ink)]"
                : "tap border-transparent text-[var(--muted)]"
            }`}
          >
            {copy.compare}
          </Link>
          <Link
            href={`/${locale}/score`}
            className={`hidden h-tap items-center rounded-full border px-2.5 font-medium sm:inline-flex sm:px-3 ${
              onScore
                ? "border-[var(--accent)] text-[var(--ink)]"
                : "tap border-transparent text-[var(--muted)]"
            }`}
          >
            {copy.scoreShort}
          </Link>
          <div ref={langRef} className="relative ml-1">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={copy.lang}
              onClick={() => setLangOpen((open) => !open)}
              className="h-tap inline-flex items-center gap-1 rounded-full border border-[var(--accent)] bg-[var(--card)] px-3 font-mono text-xs font-semibold tracking-wide"
            >
              {LANG_CODE[locale]}
              <span className="text-[9px] text-[var(--muted)]" aria-hidden>
                ▾
              </span>
            </button>
            {langOpen ? (
              <ul
                role="listbox"
                aria-label={copy.lang}
                className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[4.5rem] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] py-1 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
              >
                {locales.map((item) => (
                  <li key={item} role="option" aria-selected={item === locale}>
                    <Link
                      href={switchLocalePath(pathname, locale, item)}
                      onClick={() => setLangOpen(false)}
                      className={`flex h-10 items-center justify-center font-mono text-xs font-semibold tracking-wide ${
                        item === locale
                          ? "bg-[var(--accent)] text-[var(--paper)]"
                          : "tap text-[var(--ink)]"
                      }`}
                    >
                      {LANG_CODE[item]}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </nav>
      </div>
      <Breadcrumbs locale={locale} />
    </header>
  );
}
