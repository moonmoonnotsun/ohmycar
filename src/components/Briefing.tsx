import type { Chassis, Pain, VariantBrief } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { autodocBmwUrl, autodocUrl, interCarsUrl, mobileDeUrl, otomotoUrl, partsQuery } from "@/lib/links";
import { FaultDiagram, SourceList, WorkshopPrices } from "@/components/FaultExplain";
import { SeverityPill } from "@/components/SeverityPill";
import { autodocQueryFor } from "@/lib/painSources";

export function BuyBar({
  locale,
  chassis,
  variant,
}: {
  locale: Locale;
  chassis: Chassis;
  variant: VariantBrief;
}) {
  const copy = t(locale);
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur-md md:hidden">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-2 px-4 pt-3 safe-bottom">
        <a
          href={otomotoUrl(chassis, variant)}
          target="_blank"
          rel="noreferrer"
          className="h-tap inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-transparent px-3 text-sm font-medium text-[var(--ink)]"
        >
          {copy.otomoto}
        </a>
        <a
          href={autodocBmwUrl(locale, chassis, variant)}
          target="_blank"
          rel="noreferrer"
          className="h-tap inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-transparent px-3 text-sm font-medium text-[var(--ink)]"
        >
          {copy.autodoc}
        </a>
      </div>
    </div>
  );
}

export function MarketLinks({
  locale,
  chassis,
  variant,
}: {
  locale: Locale;
  chassis: Chassis;
  variant: VariantBrief;
}) {
  const copy = t(locale);
  const query = partsQuery(chassis, variant);
  const linkClass =
    "h-tap inline-flex items-center rounded-xl border border-[var(--line)] bg-[var(--wash)] px-3 text-sm font-medium text-[var(--ink)] sm:px-4";
  return (
    <section className="grid gap-3 sm:grid-cols-2 sm:gap-4">
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3.5 sm:p-5">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">{copy.whereCar}</h2>
        <div className="mt-3 flex flex-col gap-2 sm:mt-4">
          <a className={linkClass} href={otomotoUrl(chassis, variant)} target="_blank" rel="noreferrer">
            {copy.openOtomoto}
          </a>
          <a className={linkClass} href={mobileDeUrl(chassis, variant)} target="_blank" rel="noreferrer">
            {copy.mobile}
          </a>
        </div>
      </div>
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3.5 sm:p-5">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">{copy.whereParts}</h2>
        <div className="mt-3 flex flex-col gap-2 sm:mt-4">
          <a className={linkClass} href={autodocBmwUrl(locale, chassis, variant)} target="_blank" rel="noreferrer">
            {copy.openParts}
          </a>
          <a className={linkClass} href={interCarsUrl(query)} target="_blank" rel="noreferrer">
            {copy.intercars}
          </a>
        </div>
      </div>
    </section>
  );
}

const SEV: Record<Pain["severity"], { key: keyof ReturnType<typeof t>; bar: string }> = {
  "engine-loss": { key: "sevEngine", bar: "bg-[var(--bad)]" },
  safety: { key: "sevSafety", bar: "bg-[var(--bad)]" },
  expensive: { key: "sevExpensive", bar: "bg-[var(--mid)]" },
  overheat: { key: "sevOverheat", bar: "bg-[var(--mid)]" },
  stranded: { key: "sevStranded", bar: "bg-[var(--mid)]" },
  annoyance: { key: "sevAnnoyance", bar: "bg-[var(--muted)]" },
};

export function PainCard({
  locale,
  pain,
  chassis,
  variant,
}: {
  locale: Locale;
  pain: Pain;
  chassis?: Chassis;
  variant?: VariantBrief;
  featured?: boolean;
}) {
  const copy = t(locale);
  const sev = SEV[pain.severity];
  return (
    <article className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 pl-5 sm:p-5 sm:pl-6">
      <span className={`absolute inset-y-0 left-0 w-1 ${sev.bar}`} aria-hidden />
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="min-w-0 max-w-[18rem] text-[17px] font-semibold leading-snug tracking-tight sm:max-w-none">
          {pain.title[locale]}
        </h3>
        <SeverityPill locale={locale} severity={pain.severity} />
      </div>
      <p className="mt-2 max-w-prose text-sm leading-6 text-[var(--muted)]">{pain.summary[locale]}</p>
      <p className="mt-2 text-[13px] leading-5">
        <span className="text-[var(--muted)]">{copy.affects} · </span>
        <span className="text-[var(--ink)]/90">{pain.affects[locale]}</span>
      </p>
      <WorkshopPrices
        locale={locale}
        pain={pain}
        engine={variant?.engine}
        chassisSlug={variant?.chassisSlug ?? chassis?.slug}
      />
      <div className="mt-3 flex flex-col gap-2 border-t border-[var(--line)] pt-3">
        <a
          className="inline-flex h-10 w-fit items-center rounded-full border border-[var(--line)] bg-[var(--wash)] px-3.5 text-[13px] font-medium text-[var(--ink)] hover:border-[var(--accent)]/50"
          href={autodocUrl(
            autodocQueryFor(pain, locale, variant?.engine),
            locale,
            chassis,
            variant,
          )}
          target="_blank"
          rel="noreferrer"
        >
          {copy.autodoc}: {autodocQueryFor(pain, locale, variant?.engine)}
        </a>
        <SourceList
          locale={locale}
          sources={pain.sources}
          engine={variant?.engine}
          chassisSlug={variant?.chassisSlug ?? chassis?.slug}
        />
        <details className="group">
          <summary className="cursor-pointer text-[13px] text-[var(--muted)] hover:text-[var(--ink)]">
            {copy.faultDiagram}
          </summary>
          <div className="mt-2">
            <FaultDiagram locale={locale} src={pain.diagram} alt={pain.title[locale]} compact />
          </div>
        </details>
      </div>
    </article>
  );
}
