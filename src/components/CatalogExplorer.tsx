"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Chassis, ChassisFamily } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t, type Copy } from "@/lib/i18n";
import { ChassisRow } from "@/components/ChassisCard";
import { listScoreMarks } from "@/lib/catalog";

const GROUPS: { title: keyof Copy; families: ChassisFamily[] }[] = [
  { title: "family3", families: ["3", "4"] },
  { title: "family5", families: ["5"] },
  { title: "family1", families: ["1", "2"] },
  { title: "familyX", families: ["x"] },
  { title: "familyRest", families: ["luxury", "z", "i"] },
];

export function CatalogExplorer({
  locale,
  chassis,
}: {
  locale: Locale;
  chassis: Chassis[];
}) {
  const copy = t(locale);
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<keyof Copy | "all">("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return chassis.filter((item) => {
      if (group !== "all") {
        const spec = GROUPS.find((g) => g.title === group);
        if (spec && !spec.families.includes(item.family)) return false;
      }
      if (!needle) return true;
      return item.search.some((term) => term.includes(needle));
    });
  }, [chassis, q, group]);

  const grouped = GROUPS.map((item) => ({
    ...item,
    items: filtered.filter((c) => item.families.includes(c.family)),
  })).filter((item) => item.items.length > 0);

  return (
    <div>
      <div className="sticky top-[5.75rem] z-30 -mx-4 border-b border-[var(--line)] bg-[var(--paper)]/95 px-4 py-3 backdrop-blur-md sm:top-[6.25rem] sm:mx-0 sm:rounded-2xl sm:border">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={copy.catalogFilter}
          className="h-12 w-full rounded-xl border border-white/10 bg-[var(--card)] px-3 text-base outline-none ring-[var(--accent)] focus:border-[var(--accent)] focus:ring-1"
          autoComplete="off"
          spellCheck={false}
        />
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          <Chip active={group === "all"} onClick={() => setGroup("all")}>
            {copy.familyAll}
          </Chip>
          {GROUPS.map((item) => (
            <Chip key={item.title} active={group === item.title} onClick={() => setGroup(item.title)}>
              {copy[item.title]}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-[var(--muted)]">
        {filtered.length} {copy.chassisCount}
      </p>

      {grouped.map((item) => {
        const marks = listScoreMarks(item.items);
        return (
        <section key={item.title} className="mt-6">
          <h2 className="mb-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
            {copy[item.title]} · {item.items.length}
          </h2>
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] px-4">
            {item.items.map((c) => (
              <ChassisRow
                key={c.slug}
                chassis={c}
                locale={locale}
                marks={marks.get(c.slug) ?? []}
              />
            ))}
          </div>
        </section>
        );
      })}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-tap shrink-0 rounded-full border px-3.5 text-sm ${
        active
          ? "border-[var(--accent)] bg-[var(--card)] text-[var(--ink)]"
          : "tap border-[var(--line)] bg-[var(--card)]"
      }`}
    >
      {children}
    </button>
  );
}
