import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { CompareView } from "@/components/CompareView";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: t(locale).compareTitle };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = t(locale);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header>
        <h1 className="font-display text-[2.1rem] leading-none tracking-tight sm:text-5xl">{copy.compareTitle}</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">{copy.compareSub}</p>
      </header>

      <Suspense
        fallback={
          <p className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--card)] px-4 py-8 text-center text-sm text-[var(--muted)]">
            {copy.compareEmpty}
          </p>
        }
      >
        <CompareView locale={locale} />
      </Suspense>
    </div>
  );
}
