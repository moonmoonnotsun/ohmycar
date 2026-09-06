import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { FIX_PLN_CAP, SCORE_WEIGHTS } from "@/lib/score";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ScorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = t(locale);

  const rows = [
    { w: SCORE_WEIGHTS.catastrophe, label: copy.cat },
    { w: SCORE_WEIGHTS.fiveYearFix, label: `${copy.fix} (${locale === "pl" ? `cap ${FIX_PLN_CAP} PLN` : `${FIX_PLN_CAP} PLN cap`})` },
    { w: SCORE_WEIGHTS.painLoad, label: copy.load },
    { w: SCORE_WEIGHTS.campaigns, label: copy.campaigns },
    { w: SCORE_WEIGHTS.partsReality, label: copy.parts },
  ];

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-4xl leading-tight sm:text-5xl">{copy.scoreMethod}</h1>
      <p className="text-[var(--muted)]">{copy.formulaTitle}</p>
      <ul className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)]">
        {rows.map((row) => (
          <li key={row.label} className="border-b border-[var(--line)] px-4 py-4 last:border-0">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm leading-6">{row.label}</p>
              <p className="shrink-0 font-mono text-sm tabular-nums">{row.w}%</p>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--wash)]">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${row.w}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="text-sm leading-6 text-[var(--muted)]">{copy.threeNumbers}</p>
      <p className="text-sm leading-6 text-[var(--muted)]">{copy.disclaimer}</p>
    </div>
  );
}
