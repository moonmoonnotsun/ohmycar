import { notFound } from "next/navigation";
import { CatalogExplorer } from "@/components/CatalogExplorer";
import { chassisList } from "@/data/chassis";
import { isLocale, locales } from "@/lib/locale";
import { t } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = t(locale);

  return (
    <div>
      <header className="mb-5">
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">{copy.catalog}</h1>
        <p className="mt-2 text-[var(--muted)]">
          {chassisList.length} {copy.chassisCount} · E90 {copy.gold.toLowerCase()}
        </p>
      </header>
      <CatalogExplorer locale={locale} chassis={chassisList} />
    </div>
  );
}
