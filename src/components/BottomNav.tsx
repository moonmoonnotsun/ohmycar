"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export function BottomNav({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const pathname = usePathname() || `/${locale}`;
  const parts = pathname.split("/").filter(Boolean);
  const onVariant = parts[1] === "bmw" && Boolean(parts[3]);
  if (onVariant) return null;

  const home = `/${locale}`;
  const catalog = `/${locale}/bmw`;
  const gold = `/${locale}/bmw/e90`;
  const onHome = parts.length === 1;
  const onCatalog = parts[1] === "bmw" && !parts[2];
  const onGold = parts[2] === "e90" || parts[2] === "e91" || parts[2] === "e92" || parts[2] === "e93";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/8 bg-[var(--paper)]/90 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-5xl grid-cols-3 px-2 pt-1 safe-bottom">
        <Tab href={home} active={onHome} label={copy.navHome} />
        <Tab href={catalog} active={onCatalog} label={copy.catalogShort} />
        <Tab href={gold} active={onGold} label={copy.navGold} />
      </div>
    </nav>
  );
}

function Tab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`flex h-12 flex-col items-center justify-center text-[11px] font-semibold tracking-wide ${
        active ? "text-[var(--accent)]" : "text-[var(--muted)]"
      }`}
    >
      <span className={`mb-0.5 h-1 w-4 rounded-full ${active ? "bg-[var(--accent)]" : "bg-transparent"}`} />
      {label}
    </Link>
  );
}
