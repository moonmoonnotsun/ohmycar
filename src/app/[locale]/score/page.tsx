import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/locale";
import { t, type Copy } from "@/lib/i18n";
import { FIX_PLN_CAP, SCORE_WEIGHTS } from "@/lib/score";
import {
  SCORE_SOURCES,
  SOURCE_GROUP_ORDER,
  type SourceGroup,
  type SourceRole,
  type SourceTier,
} from "@/data/scoreSources";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function roleLabel(copy: Copy, role: SourceRole): string {
  switch (role) {
    case "score":
      return copy.scoreRoleScore;
    case "score_supporting":
      return copy.scoreRoleSupporting;
    case "discovery":
      return copy.scoreRoleDiscovery;
    case "buy_only":
      return copy.scoreRoleBuy;
    case "links_only":
      return copy.scoreRoleLinks;
    case "planned":
      return copy.scoreRolePlanned;
  }
}

function tierLabel(copy: Copy, tier: SourceTier): string {
  switch (tier) {
    case "A":
      return copy.scoreTierA;
    case "B":
      return copy.scoreTierB;
    case "C":
      return copy.scoreTierC;
    case "D":
      return copy.scoreTierD;
  }
}

function groupLabel(copy: Copy, group: SourceGroup): string {
  switch (group) {
    case "official":
      return copy.scoreGroupOfficial;
    case "score_evidence":
      return copy.scoreGroupEvidence;
    case "pln_quotes":
      return copy.scoreGroupPln;
    case "buy_market":
      return copy.scoreGroupBuy;
    case "parts":
      return copy.scoreGroupParts;
    case "discovery":
      return copy.scoreGroupDiscovery;
    case "planned":
      return copy.scoreGroupPlanned;
  }
}

function roleTone(role: SourceRole): string {
  if (role === "score" || role === "score_supporting") return "text-[var(--good)]";
  if (role === "discovery") return "text-[var(--muted)]";
  if (role === "buy_only") return "text-[var(--mid)]";
  return "text-[var(--muted)]";
}

export default async function ScorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const copy = t(locale);

  const rows = [
    { w: SCORE_WEIGHTS.catastrophe, label: copy.cat },
    {
      w: SCORE_WEIGHTS.fiveYearFix,
      label: `${copy.fix} (${locale === "pl" ? `cap ${FIX_PLN_CAP} PLN` : `${FIX_PLN_CAP} PLN cap`})`,
    },
    { w: SCORE_WEIGHTS.painLoad, label: copy.load },
    { w: SCORE_WEIGHTS.campaigns, label: copy.campaigns },
    { w: SCORE_WEIGHTS.partsReality, label: copy.parts },
  ];

  const grouped = SOURCE_GROUP_ORDER.map((group) => ({
    group,
    sources: SCORE_SOURCES.filter((s) => s.group === group),
  })).filter((g) => g.sources.length > 0);

  return (
    <div className="flex max-w-5xl flex-col gap-6">
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
      <p className="text-sm leading-6 text-[var(--muted)]">{copy.scoreEvidence}</p>
      <p className="text-sm leading-6 text-[var(--muted)]">{copy.threeNumbers}</p>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-2xl tracking-tight sm:text-3xl">{copy.scoreSourcesTitle}</h2>
          <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">{copy.scoreSourcesLead}</p>
        </div>

        {grouped.map(({ group, sources }) => (
          <div key={group} className="flex flex-col gap-2">
            <h3 className="text-sm font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
              {groupLabel(copy, group)}
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--card)]">
              <table className="w-full min-w-[52rem] text-left text-sm">
                <thead className="border-b border-[var(--line)] text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
                  <tr>
                    <th scope="col" className="px-3 py-3 font-medium sm:px-4">
                      {copy.scoreSrcColName}
                    </th>
                    <th scope="col" className="px-3 py-3 font-medium sm:px-4">
                      {copy.scoreSrcColUrl}
                    </th>
                    <th scope="col" className="px-3 py-3 font-medium sm:px-4">
                      {copy.scoreSrcColTier}
                    </th>
                    <th scope="col" className="px-3 py-3 font-medium sm:px-4">
                      {copy.scoreSrcColRole}
                    </th>
                    <th scope="col" className="px-3 py-3 font-medium sm:px-4">
                      {copy.scoreSrcColFeeds}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sources.map((src) => (
                    <tr key={src.id} className="border-b border-[var(--line)] last:border-0 align-top">
                      <td className="px-3 py-3 font-medium text-[var(--ink)] sm:px-4">{src.name[locale]}</td>
                      <td className="px-3 py-3 sm:px-4">
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-[var(--accent)] underline-offset-2 hover:underline"
                        >
                          {src.url.replace(/^https?:\/\//, "")}
                        </a>
                        {src.moreUrls?.length ? (
                          <ul className="mt-1.5 space-y-1 text-xs text-[var(--muted)]">
                            <li className="font-medium uppercase tracking-wide">{copy.scoreSourcesMore}</li>
                            {src.moreUrls.map((extra) => (
                              <li key={extra.url}>
                                <a
                                  href={extra.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[var(--accent)] underline-offset-2 hover:underline"
                                >
                                  {extra.label[locale]}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-[var(--muted)] sm:px-4">
                        {tierLabel(copy, src.tier)}
                      </td>
                      <td className={`px-3 py-3 whitespace-nowrap font-medium sm:px-4 ${roleTone(src.role)}`}>
                        {roleLabel(copy, src.role)}
                      </td>
                      <td className="px-3 py-3 text-[var(--muted)] sm:px-4">{src.feeds[locale]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      <p className="text-sm leading-6 text-[var(--muted)]">{copy.disclaimer}</p>
    </div>
  );
}
