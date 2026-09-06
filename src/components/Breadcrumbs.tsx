"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getChassis } from "@/data/chassis";
import { getVariant } from "@/lib/catalog";
import { bodyLabelKey, bodyOf } from "@/lib/carImage";

type Crumb = {
  href: string;
  label: string;
  hint?: string;
  current?: boolean;
};

export function Breadcrumbs({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const pathname = usePathname() || `/${locale}`;
  const crumbs = crumbsFor(pathname, locale);
  if (crumbs.length < 2) return null;

  return (
    <div className="border-t border-white/6">
      <nav aria-label={copy.breadcrumb} className="relative mx-auto md:max-w-5xl">
        <ol className="flex items-center gap-0.5 overflow-x-auto px-4 py-1.5 no-scrollbar sm:px-6">
          {crumbs.map((crumb, i) => (
            <li key={crumb.href} className="flex shrink-0 items-center gap-0.5">
              {i > 0 ? <Chevron /> : null}
              {crumb.current ? (
                <span
                  aria-current="page"
                  title={crumb.hint}
                  className="inline-flex h-8 max-w-[11rem] items-center truncate rounded-full border border-[var(--accent)] px-2.5 font-mono text-[11px] font-semibold text-[var(--ink)] sm:max-w-none sm:text-xs"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  title={crumb.hint}
                  className={`inline-flex h-8 items-center rounded-full px-2.5 text-[11px] font-medium text-[var(--muted)] underline decoration-white/15 underline-offset-4 hover:bg-white/6 hover:text-[var(--accent)] sm:text-xs`}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--paper)] to-transparent sm:hidden"
        />
      </nav>
    </div>
  );
}

function crumbsFor(pathname: string, locale: Locale): Crumb[] {
  const copy = t(locale);
  const parts = pathname.split("/").filter(Boolean);
  const home: Crumb = { href: `/${locale}`, label: copy.navHome };
  if (parts.length <= 1) return [home];

  const section = parts[1];
  if (section === "score") {
    return [home, { href: `/${locale}/score`, label: copy.scoreShort, current: true }];
  }
  if (section !== "bmw") return [home];

  const crumbs: Crumb[] = [
    home,
    { href: `/${locale}/bmw`, label: copy.catalogShort, hint: copy.catalog, current: parts.length === 2 },
  ];
  if (parts.length === 2) return crumbs;

  const chassis = getChassis(parts[2]);
  if (!chassis) {
    crumbs.push({ href: pathname, label: parts[2].toUpperCase(), current: true });
    return crumbs;
  }
  const body = copy[bodyLabelKey(bodyOf(chassis))];
  crumbs.push({
    href: `/${locale}/bmw/${chassis.slug}`,
    label: chassis.code,
    hint: `${chassis.code} · ${body}`,
    current: parts.length === 3,
  });
  if (parts.length === 3) return crumbs;

  const variant = getVariant(chassis.slug, parts[3]);
  crumbs.push({
    href: pathname,
    label: variant ? `${variant.model} · ${variant.engine} · ${variant.year}` : parts[3],
    current: true,
  });
  return crumbs;
}

function Chevron() {
  return (
    <span aria-hidden className="px-0.5 text-[10px] text-[var(--accent)]">
      ›
    </span>
  );
}
