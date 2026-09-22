"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type KeyboardEvent, type MouseEvent } from "react";
import type { Fuel, VariantBrief } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { Money, MoneyRange } from "@/components/Money";
import { ScoreBadge } from "@/components/ScoreBadge";
import { FaultHint } from "@/components/FaultExplain";
import { getPain } from "@/lib/catalog";
import { getChassis } from "@/data/chassis";

type SortKey = "score" | "buy" | "repair";

type EngineGroup = {
  engine: string;
  fuel: Fuel;
  models: string[];
  yearFrom: number;
  yearTo: number;
  best: number | null;
  worst: number | null;
  count: number;
  topPainId: string;
  minBuy: number | null;
  minRepair: number | null;
  maxRepair: number | null;
  rows: VariantBrief[];
};

export function VariantExplorer({
  locale,
  chassisSlug,
  variants,
}: {
  locale: Locale;
  chassisSlug: string;
  variants: VariantBrief[];
}) {
  const chassis = getChassis(chassisSlug);
  const copy = t(locale);
  const [fuel, setFuel] = useState<Fuel | "all">("all");
  const [sort, setSort] = useState<SortKey>("score");
  const [open, setOpen] = useState<Set<string>>(() => new Set());

  const groups = useMemo(() => {
    const filtered = variants.filter((item) => (fuel === "all" ? true : item.fuel === fuel));
    const map = new Map<string, VariantBrief[]>();
    for (const row of filtered) {
      const list = map.get(row.engine) ?? [];
      list.push(row);
      map.set(row.engine, list);
    }
    const out: EngineGroup[] = [...map.entries()].map(([engine, list]) => {
      const years = list.map((item) => item.year);
      const worst = list.reduce((a, b) => ((a.score ?? 999) <= (b.score ?? 999) ? a : b));
      const rows = [...list].sort((a, b) => {
        if (sort === "buy") {
          const ab = a.medianBuyPln ?? Number.POSITIVE_INFINITY;
          const bb = b.medianBuyPln ?? Number.POSITIVE_INFINITY;
          return ab - bb || (b.score ?? -1) - (a.score ?? -1);
        }
        if (sort === "repair") {
          const ar = a.expectedRepairPln?.[1] ?? Number.POSITIVE_INFINITY;
          const br = b.expectedRepairPln?.[1] ?? Number.POSITIVE_INFINITY;
          return ar - br || (b.score ?? -1) - (a.score ?? -1);
        }
        return (b.score ?? -1) - (a.score ?? -1) || b.year - a.year;
      });
      const repairLows = list.map((item) => item.expectedRepairPln?.[0]).filter((n): n is number => n != null);
      const repairHighs = list.map((item) => item.expectedRepairPln?.[1]).filter((n): n is number => n != null);
      const buyVals = list.map((item) => item.medianBuyPln).filter((n): n is number => n != null);
      const scoreVals = list.map((item) => item.score).filter((n): n is number => n != null);
      return {
        engine,
        fuel: list[0].fuel,
        models: [...new Set(list.map((item) => item.model))],
        yearFrom: Math.min(...years),
        yearTo: Math.max(...years),
        best: scoreVals.length ? Math.max(...scoreVals) : null,
        worst: scoreVals.length ? Math.min(...scoreVals) : null,
        count: list.length,
        topPainId: worst.topPainId,
        minBuy: buyVals.length ? Math.min(...buyVals) : null,
        minRepair: repairLows.length ? Math.min(...repairLows) : null,
        maxRepair: repairHighs.length ? Math.max(...repairHighs) : null,
        rows,
      };
    });
    out.sort((a, b) => {
      if (sort === "buy") {
        const ab = a.minBuy ?? Number.POSITIVE_INFINITY;
        const bb = b.minBuy ?? Number.POSITIVE_INFINITY;
        return ab - bb;
      }
      if (sort === "repair") {
        const ar = a.maxRepair ?? Number.POSITIVE_INFINITY;
        const br = b.maxRepair ?? Number.POSITIVE_INFINITY;
        return ar - br;
      }
      return (b.best ?? -1) - (a.best ?? -1);
    });
    return out;
  }, [variants, fuel, sort]);

  function toggle(engine: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(engine)) next.delete(engine);
      else next.add(engine);
      return next;
    });
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label={copy.fuelAll}
          className="grid grid-cols-3 rounded-lg bg-[var(--wash)] p-1 sm:inline-grid sm:w-[22rem]"
        >
          {(
            [
              ["all", copy.fuelAll],
              ["petrol", copy.fuelPetrol],
              ["diesel", copy.fuelDiesel],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={fuel === key}
              onClick={() => setFuel(key)}
              className={`h-9 rounded-md border text-sm font-medium ${
                fuel === key
                  ? "border-[var(--accent)] bg-[var(--paper)] text-[var(--ink)]"
                  : "border-transparent text-[var(--muted)] hover:border-[var(--line)] hover:bg-white/[0.04] hover:text-[var(--ink)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-sm text-[var(--muted)]">
          {groups.length} {copy.engines}
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--card)] p-5 text-sm text-[var(--muted)]">
          {copy.noVariantMatch}
        </p>
      ) : (
        <>
          <ul className="mt-4 flex flex-col gap-2 md:hidden">
            {groups.map((group) => (
              <MobileGroup
                key={group.engine}
                locale={locale}
                chassisSlug={chassisSlug}
                group={group}
                open={open.has(group.engine)}
                onToggle={() => toggle(group.engine)}
              />
            ))}
          </ul>

          <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--card)] md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--line)] text-xs uppercase tracking-wide text-[var(--muted)]">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    <SortButton active={sort === "score"} onClick={() => setSort("score")}>
                      {copy.engine}
                    </SortButton>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    {copy.year}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    <SortButton active={sort === "score"} onClick={() => setSort("score")}>
                      {copy.sortScore}
                    </SortButton>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    {copy.topPain}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    <SortButton active={sort === "repair"} onClick={() => setSort("repair")}>
                      {copy.sortRepair}
                    </SortButton>
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    <SortButton active={sort === "buy"} onClick={() => setSort("buy")} prominent>
                      {copy.sortBuy}
                    </SortButton>
                  </th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <EngineBlock
                    key={group.engine}
                    locale={locale}
                    chassisSlug={chassisSlug}
                    group={group}
                    expanded={open.has(group.engine)}
                    onToggle={() => toggle(group.engine)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function SortButton({
  active,
  onClick,
  children,
  prominent,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
  prominent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 font-medium uppercase tracking-wide ${
        active || prominent ? "text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--ink)]"
      }`}
    >
      {children}
      <span aria-hidden className="font-mono text-[10px]">
        {active ? "↓" : ""}
      </span>
    </button>
  );
}

function EngineBlock({
  locale,
  chassisSlug,
  group,
  expanded,
  onToggle,
}: {
  locale: Locale;
  chassisSlug: string;
  group: EngineGroup;
  expanded: boolean;
  onToggle: () => void;
}) {
  const copy = t(locale);
  const router = useRouter();
  const pain = getPain(group.topPainId);
  const chassis = getChassis(chassisSlug);

  function goYear(event: MouseEvent<HTMLTableRowElement>, href: string) {
    if ((event.target as HTMLElement).closest("a, button, dialog")) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    router.push(href);
  }

  function onGroupClick(event: MouseEvent<HTMLTableRowElement>) {
    if ((event.target as HTMLElement).closest("button, a, dialog")) return;
    onToggle();
  }

  function onGroupKey(event: KeyboardEvent<HTMLTableRowElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  }

  return (
    <>
      <tr
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={onGroupClick}
        onKeyDown={onGroupKey}
        className={`tap-row group cursor-pointer select-none border-b border-[var(--line)] ${
          expanded ? "bg-[var(--wash)]" : "bg-[var(--wash)]/50"
        }`}
      >
        <th scope="row" className="px-4 py-3 font-normal">
          <span className="flex items-center gap-2 text-left">
            <span className="font-mono text-xs text-[var(--muted)] group-hover:text-[var(--accent)]" aria-hidden>
              {expanded ? "▾" : "▸"}
            </span>
            <span>
              <span className="font-mono text-base font-semibold">{group.engine}</span>
              <span className="mt-0.5 block text-xs text-[var(--muted)]">
                {group.models.join(" · ")} · {group.fuel === "diesel" ? copy.fuelDiesel : copy.fuelPetrol}
              </span>
            </span>
          </span>
        </th>
        <td className="px-4 py-3 font-mono text-base font-semibold tabular-nums text-[var(--ink)]">
          {group.yearFrom}–{group.yearTo}
        </td>
        <td className="px-4 py-3 text-right">
          <ScoreBadge score={group.best} size="sm" locale={locale} />
          {group.best != null && group.worst != null && group.best !== group.worst ? (
            <span className="mt-1 block text-[10px] text-[var(--muted)]">
              {group.worst.toFixed(1)}–{group.best.toFixed(1)}
            </span>
          ) : null}
        </td>
        <td className="px-4 py-3">
          <FaultHint locale={locale} pain={pain} chassis={chassis} />
        </td>
        <td className="px-4 py-3 text-right whitespace-nowrap">
          <MoneyRange
            range={
              group.minRepair != null && group.maxRepair != null
                ? [group.minRepair, group.maxRepair]
                : null
            }
            locale={locale}
          />
        </td>
        <td className="px-4 py-3 text-right whitespace-nowrap">
          <Money value={group.minBuy} locale={locale} />
        </td>
      </tr>
      {expanded
        ? group.rows.map((row) => {
            const rowPain = getPain(row.topPainId);
            const href = `/${locale}/bmw/${chassisSlug}/${row.slug}`;
            return (
              <tr
                key={row.slug}
                onClick={(event) => goYear(event, href)}
                className="tap-row group cursor-pointer border-b border-[var(--line)] last:border-0"
              >
                <td className="py-2.5 pr-4 pl-10">
                  <Link href={href} className="font-semibold group-hover:text-[var(--accent)]">
                    {row.model} {row.engine}
                  </Link>
                </td>
                <td className="px-4 py-2.5 font-mono text-base font-semibold tabular-nums text-[var(--ink)]">{row.year}</td>
                <td className="px-4 py-2.5 text-right">
                  <ScoreBadge score={row.score} size="sm" locale={locale} />
                </td>
                <td className="px-4 py-2.5">
                  <FaultHint locale={locale} pain={rowPain} chassis={chassis} variant={row} />
                </td>
                <td className="px-4 py-2.5 text-right whitespace-nowrap">
                  <MoneyRange range={row.expectedRepairPln} locale={locale} />
                </td>
                <td className="px-4 py-2.5 text-right whitespace-nowrap">
                  <Money value={row.medianBuyPln} locale={locale} />
                </td>
              </tr>
            );
          })
        : null}
    </>
  );
}

function MobileGroup({
  locale,
  chassisSlug,
  group,
  open,
  onToggle,
}: {
  locale: Locale;
  chassisSlug: string;
  group: EngineGroup;
  open: boolean;
  onToggle: () => void;
}) {
  const copy = t(locale);
  const pain = getPain(group.topPainId);
  const chassis = getChassis(chassisSlug);
  return (
    <li
      className={`rounded-2xl border-2 bg-[var(--card)] ${
        open ? "border-[var(--accent)]" : "border-[var(--line)]"
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("button, a, dialog")) return;
          onToggle();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if ((event.target as HTMLElement).closest("button, a, dialog")) return;
            onToggle();
          }
        }}
        className="tap cursor-pointer select-none"
      >
        <div className="p-4 text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-xl font-semibold">{group.engine}</p>
              <p className="mt-0.5 text-sm text-[var(--muted)]">{group.models.join(" · ")}</p>
              <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-[var(--ink)]">
                {group.yearFrom}–{group.yearTo}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <ScoreBadge score={group.best} size="sm" locale={locale} />
            </div>
          </div>
          <div className="mt-3">
            <Money value={group.minBuy} locale={locale} />
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-sm">
            <span className="min-w-0">{pain ? pain.title[locale] : "—"}</span>
            {pain ? <FaultHint locale={locale} pain={pain} chassis={chassis} showTitle={false} /> : null}
          </p>
          <p className="mt-2 text-xs text-[var(--muted)]">
            {group.fuel === "diesel" ? copy.fuelDiesel : copy.fuelPetrol} · {copy.sortRepair}
          </p>
          <div className="mt-1.5">
            <MoneyRange
            range={
              group.minRepair != null && group.maxRepair != null
                ? [group.minRepair, group.maxRepair]
                : null
            }
            locale={locale}
          />
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
            className="mt-3 inline-flex h-tap w-full items-center justify-center gap-2 rounded-xl border border-[var(--accent)] bg-[var(--mid-bg)] text-sm font-semibold text-[var(--ink)]"
          >
            {open ? copy.hideYears : copy.openYears}
            <span className="font-mono text-xs text-[var(--muted)]">{group.count}</span>
            <span aria-hidden>{open ? "▴" : "▾"}</span>
          </button>
        </div>
      </div>
      {open ? (
        <ul className="border-t border-[var(--accent)]/40 bg-[var(--wash)]">
          {group.rows.map((row) => {
            const rowPain = getPain(row.topPainId);
            const href = `/${locale}/bmw/${chassisSlug}/${row.slug}`;
            return (
              <li key={row.slug} className="border-b border-[var(--line)] last:border-0">
                <Link href={href} className="tap block px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 text-sm font-semibold">
                      <span className="font-mono tabular-nums">{row.year}</span> {row.model}
                    </p>
                    <ScoreBadge score={row.score} size="sm" locale={locale} />
                  </div>
                  <div className="mt-2">
                    <Money value={row.medianBuyPln} locale={locale} />
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                    <span className="min-w-0">{rowPain ? rowPain.title[locale] : "—"}</span>
                    {rowPain ? (
                      <FaultHint locale={locale} pain={rowPain} chassis={chassis} variant={row} showTitle={false} />
                    ) : null}
                  </p>
                  <div className="mt-1.5">
                    <MoneyRange range={row.expectedRepairPln} locale={locale} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
}
