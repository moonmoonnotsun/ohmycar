import imported from "@/data/imported/pains.json";
import type { Localized, Pain, PainSeverity } from "@/data/types";

type WarehouseRow = {
  id: string;
  engines: string[] | null;
  chassis_slugs?: string[];
  year_from?: number;
  year_to?: number;
  title: Localized;
  affects: Localized;
  summary: Localized;
  severity: PainSeverity;
  pln_bands: null | {
    independent: [number, number];
    specialist: [number, number];
    aso: [number, number];
    parts?: [number, number] | null;
    labor?: [number, number] | null;
    note?: string;
  };
  pln_note?: string;
  sources: { label: string; url: string }[];
  autodoc_query: Localized | string;
  oemHint?: string;
  diagram?: string;
};

function asLocalized(value: Localized | string): Localized {
  if (typeof value === "string") return { en: value, pl: value, ru: value };
  return { en: value.en, pl: value.pl, ru: value.ru || value.en };
}

function toPain(row: WarehouseRow): Pain {
  const bands = row.pln_bands;
  return {
    id: row.id,
    engines: row.engines ?? [],
    yearFrom: row.year_from,
    yearTo: row.year_to,
    title: asLocalized(row.title),
    affects: asLocalized(row.affects),
    summary: asLocalized(row.summary),
    severity: row.severity,
    plnIndependent: bands ? bands.independent : null,
    plnSpecialist: bands ? bands.specialist : null,
    plnAso: bands ? bands.aso : null,
    plnParts: bands?.parts ?? null,
    plnLabor: bands?.labor ?? null,
    plnNote: bands?.note ?? row.pln_note,
    oemHint: row.oemHint,
    autodocQuery: asLocalized(row.autodoc_query),
    sources: row.sources,
    chassisSlugs: row.chassis_slugs,
    diagram: row.diagram,
  };
}

const importedMeta = imported as unknown as {
  id_aliases?: Record<string, string>;
  meta?: { id_aliases?: Record<string, string>; phase_e_note?: string };
  rows: WarehouseRow[];
};

const aliases = importedMeta.id_aliases ?? importedMeta.meta?.id_aliases ?? {};
const rows = importedMeta.rows.map(toPain);

export const warehousePains: Pain[] = rows;

const byId = new Map<string, Pain>();
for (const pain of warehousePains) byId.set(pain.id, pain);
for (const [from, to] of Object.entries(aliases)) {
  const target = byId.get(to);
  if (target) byId.set(from, target);
}

export function resolvePainId(id: string): string {
  return aliases[id] ?? id;
}

export function getWarehousePain(id: string): Pain | undefined {
  return byId.get(id) ?? byId.get(resolvePainId(id));
}
