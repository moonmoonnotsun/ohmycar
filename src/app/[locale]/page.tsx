import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchBox } from "@/components/SearchBox";
import { ChassisCard } from "@/components/ChassisCard";
import { ComparePair } from "@/components/ComparePair";
import { chassisList } from "@/data/chassis";
import { getVariant, listScoreMarks } from "@/lib/catalog";
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
  const featured = ["e90", "e46", "f30", "e60", "e39", "f10", "e87", "e70", "e53", "e83"]
    .map((slug) => chassisList.find((item) => item.slug === slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const marks = listScoreMarks(featured);
  const n52 = getVariant("e90", "2006-330i-n52");
  const n47 = getVariant("e90", "2008-320d-n47");

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      <section className="pt-6 sm:pt-14">
        <h1 className="font-display text-[2rem] leading-none tracking-tight sm:text-5xl">{copy.tagline}</h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)] sm:text-base">{copy.sub}</p>
        <div className="mt-6 sm:mt-8">
          <SearchBox locale={locale} hero />
        </div>
      </section>

      {n52 && n47 ? <ComparePair locale={locale} chassisSlug="e90" left={n52} right={n47} /> : null}

      <section>
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

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">{copy.catalogShort}</h2>
          <Link href={`/${locale}/bmw`} className="text-sm font-medium text-[var(--accent)]">
            {copy.allBmw}
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((chassis) => (
            <ChassisCard
              key={chassis.slug}
              chassis={chassis}
              locale={locale}
              marks={marks.get(chassis.slug) ?? []}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
