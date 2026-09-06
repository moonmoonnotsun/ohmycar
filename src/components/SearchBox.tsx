"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { searchChassis } from "@/lib/catalog";
import { bodyLabelKey, bodyOf } from "@/lib/carImage";
import { CarPhoto } from "@/components/CarPhoto";

const QUICK = ["E90", "320d", "N47", "330i", "E46", "E39"] as const;

export function SearchBox({ locale, hero = false }: { locale: Locale; hero?: boolean }) {
  const copy = t(locale);
  const [q, setQ] = useState("");
  const hits = useMemo(() => searchChassis(q), [q]);

  return (
    <div className="w-full">
      <label className="sr-only" htmlFor="chassis-search">
        {copy.searchPlaceholder}
      </label>
      <div className="relative">
        <input
          id="chassis-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={copy.searchPlaceholder}
          autoFocus={hero}
          className={`w-full rounded-2xl border bg-white/[0.06] px-4 pr-12 text-[var(--ink)] outline-none ring-[var(--accent)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-1 ${
            hero
              ? "h-16 border-[var(--accent)]/55 text-lg shadow-[0_0_0_4px_rgba(245,196,0,0.08)] sm:h-[4.5rem] sm:px-5 sm:text-xl"
              : "h-14 border-white/12 text-base sm:h-16 sm:text-lg"
          }`}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          inputMode="search"
        />
        {q ? (
          <button
            type="button"
            onClick={() => setQ("")}
            className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full text-lg text-[var(--muted)]"
            aria-label={copy.resetFilters}
          >
            ×
          </button>
        ) : null}
      </div>
      {hero && !q.trim() ? (
        <p className="mt-2.5 text-sm text-[var(--muted)]">{copy.searchHint}</p>
      ) : null}
      {!q.trim() ? (
        <div className={`flex gap-2 overflow-x-auto no-scrollbar pb-1 ${hero ? "mt-4" : "mt-3"}`}>
          {QUICK.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setQ(chip)}
              className={`tap shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 font-mono font-medium ${
                hero ? "h-11 text-[15px]" : "h-tap text-sm"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      ) : (
        <ul className="mt-3 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)]">
          {hits.length === 0 ? (
            <li className="px-4 py-4 text-sm text-[var(--muted)]">{copy.noResults}</li>
          ) : (
            hits.map((hit) => (
              <li key={hit.chassis.slug} className="border-b border-[var(--line)] last:border-0">
                <Link
                  href={`/${locale}/bmw/${hit.chassis.slug}`}
                  className="flex items-start gap-3 px-4 py-3 active:bg-[var(--wash)]"
                >
                  <CarPhoto
                    chassis={hit.chassis}
                    alt=""
                    className="h-12 w-[4.5rem] shrink-0 rounded-md"
                    tone="thumb"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block">
                      <span className="font-mono text-base font-semibold">{hit.chassis.code}</span>
                      <span className="ml-2 text-sm text-[var(--muted)]">
                        {copy[bodyLabelKey(bodyOf(hit.chassis))]}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-sm leading-5 text-[var(--muted)]">
                      {hit.chassis.name[locale]} · {hit.chassis.years}
                    </span>
                    {hit.reason ? (
                      <span className="mt-1 block text-xs leading-5 text-[var(--ink)]/80">
                        {hit.reason[locale]}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
