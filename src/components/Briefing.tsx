import type { Chassis, Pain, VariantBrief } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { autodocBmwUrl, autodocUrl, interCarsUrl, mobileDeUrl, otomotoUrl, partsQuery } from "@/lib/links";
import { FaultDiagram, SourceList, WorkshopPrices } from "@/components/FaultExplain";

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
          className="h-tap inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-3 text-sm font-semibold text-[var(--paper)]"
        >
          {copy.otomoto}
        </a>
        <a
          href={autodocBmwUrl(locale, chassis, variant)}
          target="_blank"
          rel="noreferrer"
          className="h-tap inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-3 text-sm font-semibold text-[var(--paper)]"
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
    "h-tap inline-flex items-center rounded-xl border border-[var(--line)] bg-[var(--wash)] px-4 text-sm font-medium text-[var(--ink)]";
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">{copy.whereCar}</h2>
        <div className="mt-4 flex flex-col gap-2">
          <a className={linkClass} href={otomotoUrl(chassis, variant)} target="_blank" rel="noreferrer">
            {copy.openOtomoto}
          </a>
          <a className={linkClass} href={mobileDeUrl(chassis, variant)} target="_blank" rel="noreferrer">
            {copy.mobile}
          </a>
        </div>
      </div>
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">{copy.whereParts}</h2>
        <div className="mt-4 flex flex-col gap-2">
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
  featured,
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
    <article className="relative overflow-x-clip rounded-xl border border-[var(--line)] bg-[var(--wash)] p-4 pl-5">
      <span className={`absolute inset-y-0 left-0 w-1 ${sev.bar}`} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="min-w-0 text-base font-semibold leading-snug">{pain.title[locale]}</h3>
        <span className="inline-flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            {featured ? copy.topPain : copy[sev.key]}
          </span>
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pain.summary[locale]}</p>
      <p className="mt-2 text-sm">
        <span className="text-[var(--muted)]">{copy.affects}: </span>
        {pain.affects[locale]}
      </p>
      <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
        {pain.plnIndependent ? copy.plnNote : copy.plnPending}
      </p>
      <WorkshopPrices locale={locale} pain={pain} />
      <a
        className="mt-3 inline-flex h-tap items-center text-sm font-medium underline underline-offset-2"
        href={autodocUrl(pain.autodocQuery[locale], locale, chassis, variant)}
        target="_blank"
        rel="noreferrer"
      >
        {copy.autodoc}: {pain.autodocQuery[locale]}
      </a>
      <SourceList locale={locale} sources={pain.sources} />
      <details className="mt-3">
        <summary className="text-sm text-[var(--muted)]">{copy.faultDiagram}</summary>
        <div className="mt-2">
          <FaultDiagram locale={locale} src={pain.diagram} alt={pain.title[locale]} compact />
        </div>
      </details>
    </article>
  );
}
