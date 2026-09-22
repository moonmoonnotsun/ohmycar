import type { Localized } from "./types";
import type { Locale } from "@/lib/locale";
import type { SeedScoreInputs } from "./types";

export function loc(en: string, pl: string, ru = en): Localized {
  return { en, pl, ru };
}

export function tx(value: Localized, locale: Locale): string {
  if (locale === "pl") return value.pl;
  if (locale === "ru") return value.ru || value.en;
  return value.en;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function fillYears(
  years: number[],
  start: SeedScoreInputs,
  end: SeedScoreInputs,
): Record<number, SeedScoreInputs> {
  if (years.length === 1) return { [years[0]]: start };
  const last = years.length - 1;
  const out: Record<number, SeedScoreInputs> = {};
  for (let i = 0; i < years.length; i++) {
    const t = i / last;
    out[years[i]] = {
      catastrophe: lerp(start.catastrophe, end.catastrophe, t),
      expectedFix5yPln: lerp(start.expectedFix5yPln, end.expectedFix5yPln, t),
      painLoad: lerp(start.painLoad, end.painLoad, t),
      campaigns: lerp(start.campaigns, end.campaigns, t),
      partsReality: lerp(start.partsReality, end.partsReality, t),
    };
  }
  return out;
}

export function buy(years: number[], start: number, end: number): Record<number, number> {
  const out: Record<number, number> = {};
  const last = Math.max(years.length - 1, 1);
  for (let i = 0; i < years.length; i++) {
    out[years[i]] = Math.round(lerp(start, end, i / last) / 500) * 500;
  }
  return out;
}

export const n47Early: SeedScoreInputs = {
  catastrophe: 0.98,
  expectedFix5yPln: 16000,
  painLoad: 0.72,
  campaigns: 0.35,
  partsReality: 0.88,
};

export const n47Late: SeedScoreInputs = {
  catastrophe: 0.92,
  expectedFix5yPln: 14000,
  painLoad: 0.65,
  campaigns: 0.2,
  partsReality: 0.9,
};
