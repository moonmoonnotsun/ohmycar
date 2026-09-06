import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SetLang } from "@/components/SetLang";
import { isLocale, locales } from "@/lib/locale";
import { Disclaimer } from "@/components/Disclaimer";
import { AskChat } from "@/components/AskChat";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <SetLang locale={locale} />
      <Header locale={locale} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-8 pt-4 sm:px-6 sm:pt-8">{children}</main>
      <footer className="mx-auto w-full max-w-5xl px-4 pb-28 sm:px-6 md:pb-10">
        <Disclaimer locale={locale} />
      </footer>
      <BottomNav locale={locale} />
      <AskChat locale={locale} />
    </>
  );
}
