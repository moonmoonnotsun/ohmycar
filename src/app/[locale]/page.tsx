import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchBox } from "@/components/SearchBox";
import { CatalogExplorer } from "@/components/CatalogExplorer";
import { ComparePair } from "@/components/ComparePair";
import { chassisList } from "@/data/chassis";
import { getVariant } from "@/lib/catalog";
import { compareHref } from "@/lib/compare";
import { isLocale, locales } from "@/lib/locale";
import { t } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = t(locale);
  const best = getVariant("f30", "2016-330i-b48");
  const worst = getVariant("f30", "2012-320d-n47");
  const compareUrl =
    best && worst ? compareHref(locale, `f30/${best.slug}`, `f30/${worst.slug}`) : `/${locale}/compare/`;

  const scoreBasis = [
    copy.basisCat,
    copy.basisLoad,
    copy.basisFix,
    copy.basisCampaigns,
    copy.basisParts,
  ];

  return (
    <div className="flex flex-col gap-8 sm:gap-16">
      <section className="pt-3 sm:pt-14">
        <h1 className="font-display text-[1.75rem] leading-none tracking-tight sm:text-5xl">{copy.tagline}</h1>
        <p className="mt-1.5 max-w-md text-sm leading-5 text-[var(--muted)] sm:mt-2 sm:text-base sm:leading-6">{copy.sub}</p>
        <div className="mt-4 sm:mt-8">
          <SearchBox locale={locale} hero />
        </div>
      </section>

      {best && worst ? (
        <ComparePair
          locale={locale}
          chassisSlug="f30"
          left={best}
          right={worst}
          analysisHref={`/${locale}/bmw/f30`}
          compareHref={compareUrl}
        />
      ) : null}

      <section className="hidden sm:block">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
            {copy.scoreBasedOn}
          </h2>
          <p className="text-xs text-[var(--muted)] sm:text-sm">{copy.scoreBuyOut}</p>
        </div>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {scoreBasis.map((label, i) => (
            <li
              key={label}
              className="rounded-2xl border border-[var(--line)] bg-[var(--card)] px-3 py-3"
            >
              <p className="font-mono text-[11px] font-semibold text-[var(--accent)]">{i + 1}</p>
              <p className="mt-1 text-sm font-medium leading-5">{label}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-5 text-[var(--muted)] sm:text-sm">
          {copy.threeNumbers}{" "}
          <Link href={`/${locale}/score`} className="font-medium text-[var(--accent)] underline underline-offset-2">
            {copy.scoreMethod}
          </Link>
        </p>
      </section>

      <section className="hidden sm:block">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">{copy.howTitle}</h2>
        <ol className="mt-3 grid grid-cols-3 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)]">
          {[
            [copy.how1t, copy.how1d],
            [copy.how2t, copy.how2d],
            [copy.how3t, copy.how3d],
          ].map(([title, body], i) => (
            <li
              key={title}
              className="border-l border-[var(--line)] px-2 py-3 first:border-l-0 sm:px-4 sm:py-4"
            >
              <p className="font-mono text-[11px] font-semibold text-[var(--accent)]">{i + 1}</p>
              <p className="mt-1 text-[13px] font-semibold leading-snug sm:text-base">{title}</p>
              <p className="mt-1 hidden text-sm leading-5 text-[var(--muted)] sm:block">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="catalog">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">{copy.catalogShort}</h2>
          <Link href={`/${locale}/bmw`} className="text-sm font-medium text-[var(--accent)]">
            {copy.catalog}
          </Link>
        </div>
        <CatalogExplorer locale={locale} chassis={chassisList} layout="cards" />
      </section>
    </div>
  );
}
