"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import type { Chassis, ChassisFamily } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t, type Copy } from "@/lib/i18n";
import { CarPhoto } from "@/components/CarPhoto";
import { ChassisCard } from "@/components/ChassisCard";
import { MoneyRange } from "@/components/Money";
import { ScoreGlow } from "@/components/ScoreBadge";
import { chassisSummary, listScoreMarks, type ListMark } from "@/lib/catalog";
import { bodyLabelKey, bodyOf, type BodyStyle } from "@/lib/carImage";

const GROUPS: { title: keyof Copy; families: ChassisFamily[] }[] = [
  { title: "family3", families: ["3", "4"] },
  { title: "family5", families: ["5"] },
  { title: "family1", families: ["1", "2"] },
  { title: "familyX", families: ["x"] },
  { title: "familyRest", families: ["luxury", "z", "i"] },
];

const BODIES: BodyStyle[] = ["sedan", "touring", "coupe", "cabrio", "suv", "hatch", "roadster", "gt"];

/** Min width for mobile horizontal scroll; `fr` tracks fill wide screens. */
const CATALOG_MIN = "min-w-[46rem] w-full";
const CATALOG_COLS =
  "grid grid-cols-[minmax(14rem,1.8fr)_minmax(5.5rem,0.7fr)_minmax(5.5rem,0.7fr)_minmax(7.5rem,1.1fr)_minmax(4.5rem,0.55fr)] items-center gap-x-3 sm:gap-x-4";
/** Side padding lives on the scroll content so gutters move with the table (not clipped by borders). */
const CATALOG_GUTTER = "px-4";

type SortKey = "code" | "year" | "body" | "repair" | "score";
type SortDir = "asc" | "desc";
type EraKey = "all" | "classic" | "y2000" | "y2010" | "now";

type ChassisMeta = {
  chassis: Chassis;
  body: BodyStyle;
  score: number | null;
  repairLo: number | null;
  repairHi: number | null;
  yearStart: number;
  yearEnd: number;
};

const DEFAULT_DIR: Record<SortKey, SortDir> = {
  code: "asc",
  year: "desc",
  body: "asc",
  repair: "asc",
  score: "desc",
};

function eraMatch(era: EraKey, yearStart: number, yearEnd: number): boolean {
  if (era === "all") return true;
  if (era === "classic") return yearStart <= 1999;
  if (era === "y2000") return yearEnd >= 2000 && yearStart <= 2009;
  if (era === "y2010") return yearEnd >= 2010 && yearStart <= 2017;
  return yearEnd >= 2018 || yearStart >= 2018;
}

function compareMeta(a: ChassisMeta, b: ChassisMeta, key: SortKey, dir: SortDir): number {
  const mul = dir === "asc" ? 1 : -1;
  let raw = 0;
  if (key === "code") raw = a.chassis.code.localeCompare(b.chassis.code);
  else if (key === "year") raw = a.yearStart - b.yearStart || a.yearEnd - b.yearEnd;
  else if (key === "body") raw = a.body.localeCompare(b.body);
  else if (key === "repair") {
    const ar = a.repairHi ?? (dir === "asc" ? Number.POSITIVE_INFINITY : -1);
    const br = b.repairHi ?? (dir === "asc" ? Number.POSITIVE_INFINITY : -1);
    raw = ar - br;
  } else {
    const as = a.score ?? (dir === "asc" ? Number.POSITIVE_INFINITY : -1);
    const bs = b.score ?? (dir === "asc" ? Number.POSITIVE_INFINITY : -1);
    raw = as - bs;
  }
  return raw * mul || a.chassis.code.localeCompare(b.chassis.code);
}

export function CatalogExplorer({
  locale,
  chassis,
  layout = "table",
}: {
  locale: Locale;
  chassis: Chassis[];
  /** table = dense /bmw list; cards = photo grid (home). */
  layout?: "table" | "cards";
}) {
  const copy = t(locale);
  const isCards = layout === "cards";
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<keyof Copy | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>(isCards ? "score" : "code");
  const [sortDir, setSortDir] = useState<SortDir>(isCards ? "desc" : "asc");
  const [bodies, setBodies] = useState<Set<BodyStyle>>(() => new Set());
  const [era, setEra] = useState<EraKey>("all");
  const [scoredOnly, setScoredOnly] = useState(false);
  const [goldOnly, setGoldOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const headScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);

  const meta = useMemo<ChassisMeta[]>(() => {
    return chassis.map((item) => {
      const summary = chassisSummary(item.slug);
      return {
        chassis: item,
        body: bodyOf(item),
        score: summary?.best.score ?? null,
        repairLo: summary?.fixBand?.[0] ?? null,
        repairHi: summary?.fixBand?.[1] ?? null,
        yearStart: item.yearStart,
        yearEnd: item.yearEnd ?? 2030,
      };
    });
  }, [chassis]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return meta.filter((row) => {
      if (group !== "all") {
        const spec = GROUPS.find((g) => g.title === group);
        if (spec && !spec.families.includes(row.chassis.family)) return false;
      }
      if (bodies.size > 0 && !bodies.has(row.body)) return false;
      if (!eraMatch(era, row.yearStart, row.yearEnd)) return false;
      if (scoredOnly && row.score == null) return false;
      if (goldOnly && !row.chassis.gold) return false;
      if (!needle) return true;
      return row.chassis.search.some((term) => term.includes(needle));
    });
  }, [meta, q, group, bodies, era, scoredOnly, goldOnly]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => compareMeta(a, b, sortKey, sortDir)),
    [filtered, sortKey, sortDir],
  );

  const marks = useMemo(
    () => listScoreMarks(sorted.map((row) => row.chassis)),
    [sorted],
  );

  const activeFilterCount =
    (bodies.size > 0 ? 1 : 0) + (era !== "all" ? 1 : 0) + (scoredOnly ? 1 : 0) + (goldOnly ? 1 : 0);
  const hasExtraFilters = activeFilterCount > 0;

  function clearFilters() {
    setBodies(new Set());
    setEra("all");
    setScoredOnly(false);
    setGoldOnly(false);
  }

  function toggleBody(body: BodyStyle) {
    setBodies((prev) => {
      const next = new Set(prev);
      if (next.has(body)) next.delete(body);
      else next.add(body);
      return next;
    });
  }

  function onSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir(DEFAULT_DIR[key]);
  }

  function syncScroll(source: "head" | "body") {
    if (syncing.current) return;
    const from = source === "head" ? headScrollRef.current : bodyScrollRef.current;
    const to = source === "head" ? bodyScrollRef.current : headScrollRef.current;
    if (!from || !to) return;
    syncing.current = true;
    to.scrollLeft = from.scrollLeft;
    requestAnimationFrame(() => {
      syncing.current = false;
    });
  }

  useEffect(() => {
    const head = headScrollRef.current;
    const body = bodyScrollRef.current;
    if (head && body) body.scrollLeft = head.scrollLeft;
  }, [sorted.length, filtersOpen]);

  const eras: { key: EraKey; label: string }[] = [
    { key: "all", label: copy.eraAll },
    { key: "classic", label: copy.eraClassic },
    { key: "y2000", label: copy.era2000 },
    { key: "y2010", label: copy.era2010 },
    { key: "now", label: copy.eraNow },
  ];

  return (
    <div>
      <div className="sticky top-[var(--header-h,3.5rem)] z-30 -mx-4 border-b border-[var(--line)] bg-[var(--paper)] px-4 py-2.5 sm:mx-0 sm:rounded-2xl sm:border sm:py-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={copy.catalogFilter}
          className="h-11 w-full rounded-xl border border-white/10 bg-[var(--card)] px-3 text-base outline-none ring-[var(--accent)] focus:border-[var(--accent)] focus:ring-1 sm:h-12"
          autoComplete="off"
          spellCheck={false}
        />

        <div className="mt-2.5 flex items-center gap-2 sm:mt-3">
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-1 no-scrollbar">
            <Chip active={group === "all"} onClick={() => setGroup("all")}>
              {copy.familyAll}
            </Chip>
            {GROUPS.map((item) => (
              <Chip key={item.title} active={group === item.title} onClick={() => setGroup(item.title)}>
                {copy[item.title]}
              </Chip>
            ))}
          </div>

          <button
            type="button"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((v) => !v)}
            className={`tap inline-flex h-tap shrink-0 items-center justify-center gap-2 rounded-full border px-3.5 text-sm font-medium ${
              filtersOpen || hasExtraFilters
                ? "border-[var(--accent)] text-[var(--ink)]"
                : "border-[var(--line)] text-[var(--muted)]"
            }`}
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.75} aria-hidden />
            {copy.filter}
            {hasExtraFilters ? (
              <span className="font-mono text-xs text-[var(--accent)]">{activeFilterCount}</span>
            ) : null}
            <ChevronDown
              className={`size-3.5 transition ${filtersOpen ? "rotate-180" : ""}`}
              strokeWidth={2}
              aria-hidden
            />
          </button>
        </div>

        {filtersOpen ? (
          <div className="mt-3 space-y-3 border-t border-[var(--line)] pt-3">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                {copy.pickBody}
              </p>
              <div className="flex flex-wrap gap-2">
                {BODIES.map((body) => (
                  <Chip key={body} active={bodies.has(body)} onClick={() => toggleBody(body)}>
                    {copy[bodyLabelKey(body)]}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                {copy.filterEra}
              </p>
              <div className="flex flex-wrap gap-2">
                {eras.map((item) => (
                  <Chip key={item.key} active={era === item.key} onClick={() => setEra(item.key)}>
                    {item.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Chip active={scoredOnly} onClick={() => setScoredOnly((v) => !v)}>
                {copy.filterScored}
              </Chip>
              <Chip active={goldOnly} onClick={() => setGoldOnly((v) => !v)}>
                {copy.filterGold}
              </Chip>
              {hasExtraFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="tap inline-flex h-tap items-center gap-1.5 rounded-full px-3 text-sm font-medium text-[var(--muted)] underline decoration-white/15 underline-offset-4 hover:text-[var(--ink)]"
                >
                  <X className="size-3.5" strokeWidth={2} aria-hidden />
                  {copy.resetFilters}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {hasExtraFilters && !filtersOpen ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {[...bodies].map((body) => (
              <ActivePill key={body} onClear={() => toggleBody(body)}>
                {copy[bodyLabelKey(body)]}
              </ActivePill>
            ))}
            {era !== "all" ? (
              <ActivePill onClear={() => setEra("all")}>
                {eras.find((item) => item.key === era)?.label}
              </ActivePill>
            ) : null}
            {scoredOnly ? (
              <ActivePill onClear={() => setScoredOnly(false)}>{copy.filterScored}</ActivePill>
            ) : null}
            {goldOnly ? (
              <ActivePill onClear={() => setGoldOnly(false)}>{copy.filterGold}</ActivePill>
            ) : null}
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-[var(--muted)] underline decoration-white/15 underline-offset-4 hover:text-[var(--ink)]"
            >
              {copy.resetFilters}
            </button>
          </div>
        ) : null}

        <p className="mt-3 text-sm text-[var(--muted)]">
          {filtered.length} {copy.chassisCount}
          {hasExtraFilters || q.trim() || group !== "all" ? (
            <span className="text-[var(--muted)]/70"> · {chassis.length}</span>
          ) : null}
        </p>

        {isCards && filtered.length > 0 ? (
          <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-[var(--line)] pt-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              {copy.catalogSort}
            </span>
            {(
              [
                ["score", copy.score],
                ["year", copy.sortYear],
                ["repair", copy.sortRepair],
                ["code", copy.catalogChassis],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => onSort(key)}
                className={`inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-xs font-semibold ${
                  sortKey === key
                    ? "border-[var(--accent)] text-[var(--ink)]"
                    : "border-[var(--line)] text-[var(--muted)]"
                }`}
              >
                {label}
                {sortKey === key ? (
                  sortDir === "asc" ? (
                    <ArrowUp className="size-3 text-[var(--accent)]" strokeWidth={2} aria-hidden />
                  ) : (
                    <ArrowDown className="size-3 text-[var(--accent)]" strokeWidth={2} aria-hidden />
                  )
                ) : null}
              </button>
            ))}
          </div>
        ) : null}

        {!isCards && filtered.length > 0 ? (
          <div
            ref={headScrollRef}
            onScroll={() => syncScroll("head")}
            className="-mx-4 mt-2 overflow-x-auto border-t border-[var(--line)] no-scrollbar"
          >
            <div className={`${CATALOG_MIN} ${CATALOG_GUTTER}`}>
              <div
                role="row"
                className={`${CATALOG_COLS} py-2 text-[11px] uppercase tracking-[0.12em]`}
              >
                <SortHead
                  label={copy.catalogChassis}
                  active={sortKey === "code"}
                  dir={sortDir}
                  onClick={() => onSort("code")}
                />
                <SortHead
                  label={copy.sortYear}
                  active={sortKey === "year"}
                  dir={sortDir}
                  onClick={() => onSort("year")}
                />
                <SortHead
                  label={copy.pickBody}
                  active={sortKey === "body"}
                  dir={sortDir}
                  onClick={() => onSort("body")}
                />
                <SortHead
                  label={copy.sortRepair}
                  active={sortKey === "repair"}
                  dir={sortDir}
                  onClick={() => onSort("repair")}
                  align="right"
                />
                <SortHead
                  label={copy.score}
                  active={sortKey === "score"}
                  dir={sortDir}
                  onClick={() => onSort("score")}
                  align="right"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--card)] px-4 py-8 text-center text-sm text-[var(--muted)]">
          {copy.catalogNoMatch}
        </p>
      ) : isCards ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((row) => (
            <ChassisCard
              key={row.chassis.slug}
              chassis={row.chassis}
              locale={locale}
              marks={marks.get(row.chassis.slug) ?? []}
            />
          ))}
        </div>
      ) : (
        <div
          ref={bodyScrollRef}
          onScroll={() => syncScroll("body")}
          className="-mx-4 mt-2 overflow-x-auto sm:mx-0 sm:rounded-2xl sm:border sm:border-[var(--line)] sm:bg-[var(--card)]"
        >
          <div
            className={`${CATALOG_MIN} ${CATALOG_GUTTER} bg-[var(--card)] sm:bg-transparent`}
            role="table"
            aria-label={copy.catalog}
          >
            {sorted.map((row) => (
              <CatalogTableRow
                key={row.chassis.slug}
                locale={locale}
                row={row}
                marks={marks.get(row.chassis.slug) ?? []}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SortHead({
  label,
  active,
  dir,
  onClick,
  align = "left",
  className = "",
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  align?: "left" | "right";
  className?: string;
}) {
  const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap font-semibold uppercase tracking-[0.12em] ${
        align === "right" ? "justify-self-end" : ""
      } ${active ? "text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--ink)]"} ${className}`}
    >
      {label}
      <Icon className={`size-3.5 shrink-0 ${active ? "text-[var(--accent)]" : ""}`} strokeWidth={2} aria-hidden />
    </button>
  );
}

function CatalogTableRow({
  locale,
  row,
  marks,
}: {
  locale: Locale;
  row: ChassisMeta;
  marks: ListMark[];
}) {
  const copy = t(locale);
  const { chassis, body, score, repairLo, repairHi } = row;
  const summary = chassisSummary(chassis.slug);
  const bodyLabel = copy[bodyLabelKey(body)];
  const repair: [number, number] | null =
    repairLo != null && repairHi != null ? [repairLo, repairHi] : null;

  return (
    <Link
      href={`/${locale}/bmw/${chassis.slug}`}
      role="row"
      className={`catalog-row ${CATALOG_COLS} border-b border-[var(--line)] py-3 last:border-0 hover:bg-white/[0.04]`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <CarPhoto
          chassis={chassis}
          alt=""
          className="h-11 w-[4.2rem] shrink-0 rounded-lg"
          tone="thumb"
        />
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-base font-semibold text-[var(--ink)]">{chassis.code}</span>
            {marks.includes("best") ? <MarkPill tone="good">{copy.listBest}</MarkPill> : null}
            {marks.includes("worst") ? <MarkPill tone="bad">{copy.listWorst}</MarkPill> : null}
          </span>
          <span className="mt-0.5 block truncate text-sm text-[var(--muted)]">{chassis.name[locale]}</span>
        </span>
      </span>

      <span className="whitespace-nowrap font-semibold tabular-nums text-[var(--ink)]">{chassis.years}</span>

      <span className="inline-flex">
        <span className="inline-flex h-7 items-center rounded-full border border-[var(--line)] px-2.5 text-xs font-semibold text-[var(--ink)]">
          {bodyLabel}
        </span>
      </span>

      <span className="justify-self-end">
        <MoneyRange range={repair} locale={locale} size="sm" />
      </span>

      <span className="justify-self-end text-right">
        {summary?.hasScore ? (
          <>
            <span className="font-display text-lg leading-none tracking-tight">
              <ScoreGlow score={score} />
            </span>
            <span className="mt-1 block font-mono text-xs text-[var(--muted)]">{summary.best.engine}</span>
          </>
        ) : (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            {copy.catalogOnly}
          </span>
        )}
      </span>
    </Link>
  );
}

function MarkPill({ tone, children }: { tone: "good" | "bad"; children: string }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
        tone === "good" ? "bg-[var(--good)] text-[#04140c]" : "bg-[var(--bad)] text-white"
      }`}
    >
      {children}
    </span>
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
      aria-pressed={active}
      className={`h-tap shrink-0 rounded-full border px-3.5 text-sm font-medium ${
        active
          ? "border-[var(--accent)] bg-[var(--card)] text-[var(--ink)] shadow-[0_0_0_1px_var(--accent)]"
          : "tap border-[var(--line)] bg-[var(--card)] text-[var(--muted)]"
      }`}
    >
      {children}
    </button>
  );
}

function ActivePill({ onClear, children }: { onClear: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="tap inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--accent)]/50 bg-[var(--mid-bg)] px-2.5 text-xs font-medium text-[var(--ink)]"
    >
      {children}
      <X className="size-3" strokeWidth={2} aria-hidden />
    </button>
  );
}
