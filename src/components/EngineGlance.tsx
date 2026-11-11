import Link from "next/link";
import type { PainSeverity, VariantBrief } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { ScoreBadge } from "@/components/ScoreBadge";
import { GroupTitle } from "@/components/GroupTitle";
import { getPain, painsForVariant } from "@/lib/catalog";

type EngineRow = {
  engine: string;
  model: string;
  yearFrom: number;
  yearTo: number;
  best: VariantBrief;
  faultCount: number;
  severity: PainSeverity | null;
};

const severityTone: Record<PainSeverity, { wrap: string; labelKey: "sevEngine" | "sevSafety" | "sevOverheat" | "sevExpensive" | "sevStranded" | "sevAnnoyance" }> = {
  "engine-loss": { wrap: "bg-[var(--bad-bg)] text-[var(--bad)]", labelKey: "sevEngine" },
  safety: { wrap: "bg-[var(--bad-bg)] text-[var(--bad)]", labelKey: "sevSafety" },
  overheat: { wrap: "bg-[var(--mid-bg)] text-[var(--mid)]", labelKey: "sevOverheat" },
  expensive: { wrap: "bg-[var(--mid-bg)] text-[var(--mid)]", labelKey: "sevExpensive" },
  stranded: { wrap: "bg-[var(--mid-bg)] text-[var(--mid)]", labelKey: "sevStranded" },
  annoyance: { wrap: "bg-[var(--wash)] text-[var(--muted)]", labelKey: "sevAnnoyance" },
};

function rankEngines(variants: VariantBrief[]): EngineRow[] {
  const map = new Map<string, VariantBrief[]>();
  for (const row of variants) {
    const list = map.get(row.engine) ?? [];
    list.push(row);
    map.set(row.engine, list);
  }

  const rows: EngineRow[] = [...map.entries()].map(([engine, list]) => {
    const best = list.reduce((a, b) => ((a.score ?? -1) >= (b.score ?? -1) ? a : b));
    const worst = list.reduce((a, b) => ((a.score ?? 999) <= (b.score ?? 999) ? a : b));
    const years = list.map((item) => item.year);
    const painIds = new Set<string>();
    for (const item of list) {
      for (const pain of painsForVariant(item)) painIds.add(pain.id);
    }
    const riskPain = getPain(worst.topPainId);
    return {
      engine,
      model: best.model,
      yearFrom: Math.min(...years),
      yearTo: Math.max(...years),
      best,
      faultCount: painIds.size,
      severity: riskPain?.severity ?? null,
    };
  });

  rows.sort((a, b) => (b.best.score ?? -1) - (a.best.score ?? -1));
  return rows;
}

function faultLabel(locale: Locale, count: number): string {
  const copy = t(locale);
  if (count === 1) return copy.faultCountOne;
  return copy.faultCountMany.replace("{n}", String(count));
}

/**
 * MotorFiable-style engine list: name · years · faults · severity · score.
 * Used on chassis + variant (“other engines”) pages.
 */
export function EngineGlance({
  locale,
  chassisSlug,
  chassisCode,
  variants,
  excludeEngine,
  heading: headingOverride,
  lead,
  showWhenSingle = false,
}: {
  locale: Locale;
  chassisSlug: string;
  chassisCode?: string;
  variants: VariantBrief[];
  /** When set, hide that engine and title as “other engines”. */
  excludeEngine?: string;
  /** Override default heading (e.g. fault page related engines). */
  heading?: string;
  lead?: string;
  /** Show even when only one engine remains (fault-page related list). */
  showWhenSingle?: boolean;
}) {
  const copy = t(locale);
  const rows = rankEngines(variants).filter((row) =>
    excludeEngine ? row.engine !== excludeEngine : true,
  );
  if (rows.length === 0) return null;
  if (!excludeEngine && !showWhenSingle && rows.length < 2) return null;

  const heading =
    headingOverride ??
    (excludeEngine
      ? copy.otherEngines.replace("{code}", chassisCode ?? chassisSlug.toUpperCase())
      : copy.enginesAtGlance);

  return (
    <section>
      <GroupTitle>{heading}</GroupTitle>
      <p className="mt-1 text-xs leading-5 text-[var(--muted)] sm:text-[13px]">
        {lead ?? copy.otherEnginesLead}
      </p>
      <div className="mt-4 overflow-hidden rounded-xl border-2 border-[var(--line)] bg-[var(--wash)] sm:mt-5">
        <ul className="divide-y divide-[var(--line)]">
          {rows.map((row) => {
            const sev = row.severity ? severityTone[row.severity] : null;
            const years =
              row.yearFrom === row.yearTo ? String(row.yearFrom) : `${row.yearFrom}–${row.yearTo}`;
            return (
              <li key={row.engine} className="bg-[var(--card)] first:rounded-t-[0.7rem] last:rounded-b-[0.7rem]">
                <Link
                  href={`/${locale}/bmw/${chassisSlug}/${row.best.slug}/`}
                  className="tap flex items-center gap-3 px-3.5 py-3.5 sm:gap-4 sm:px-4 sm:py-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold tracking-tight text-[var(--ink)] sm:text-base">
                      {row.model}{" "}
                      <span className="font-mono font-medium text-[var(--muted)]">{row.engine}</span>
                    </p>
                    <p className="mt-0.5 text-xs tabular-nums text-[var(--muted)] sm:text-[13px]">
                      {years}
                      {row.faultCount > 0 ? ` · ${faultLabel(locale, row.faultCount)}` : null}
                    </p>
                  </div>
                  {sev ? (
                    <span
                      className={`hidden shrink-0 items-center rounded-md px-2 py-1 text-[11px] font-semibold sm:inline-flex ${sev.wrap}`}
                    >
                      {copy[sev.labelKey]}
                    </span>
                  ) : null}
                  <ScoreBadge score={row.best.score} size="md" locale={locale} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
