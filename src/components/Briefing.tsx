import type { Chassis, Pain, VariantBrief } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { autodocBmwUrl, autodocUrl, interCarsUrl, mobileDeUrl, otomotoUrl, partsQuery } from "@/lib/links";
import { FaultDiagram, SourceList, WorkshopPrices } from "@/components/FaultExplain";
import { GroupTitle } from "@/components/GroupTitle";
import { SeverityPill } from "@/components/SeverityPill";
import { OutboundLink } from "@/components/OutboundLink";
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
  const base = {
    locale,
    chassis_slug: chassis.slug,
    variant_slug: variant.slug,
    surface: "buy_bar",
  };
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur-md md:hidden">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-2 px-4 pt-3 safe-bottom">
        <OutboundLink
          href={otomotoUrl(chassis, variant)}
          destination="otomoto"
          props={base}
          className="h-tap inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-transparent px-3 text-sm font-medium text-[var(--ink)]"
        >
          {copy.otomoto}
        </OutboundLink>
        <OutboundLink
          href={autodocBmwUrl(locale, chassis, variant)}
          destination="autodoc_bmw"
          props={base}
          className="h-tap inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-transparent px-3 text-sm font-medium text-[var(--ink)]"
        >
          {copy.autodoc}
        </OutboundLink>
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
  const base = {
    locale,
    chassis_slug: chassis.slug,
    variant_slug: variant.slug,
    surface: "market_links",
  };
  return (
    <section className="grid gap-3 sm:grid-cols-2 sm:gap-4">
      <div className="rounded-2xl border-2 border-[var(--line)] bg-[var(--card)] p-3.5 sm:p-5">
        <GroupTitle>{copy.whereCar}</GroupTitle>
        <div className="mt-1 flex flex-col gap-2 border-t border-[var(--line)] pt-3 sm:mt-1.5 sm:pt-4">
          <OutboundLink className={linkClass} href={otomotoUrl(chassis, variant)} destination="otomoto" props={base}>
            {copy.openOtomoto}
          </OutboundLink>
          <OutboundLink className={linkClass} href={mobileDeUrl(chassis, variant)} destination="mobile_de" props={base}>
            {copy.mobile}
          </OutboundLink>
        </div>
      </div>
      <div className="rounded-2xl border-2 border-[var(--line)] bg-[var(--card)] p-3.5 sm:p-5">
        <GroupTitle>{copy.whereParts}</GroupTitle>
        <div className="mt-1 flex flex-col gap-2 border-t border-[var(--line)] pt-3 sm:mt-1.5 sm:pt-4">
          <OutboundLink
            className={linkClass}
            href={autodocBmwUrl(locale, chassis, variant)}
            destination="autodoc_bmw"
            props={base}
          >
            {copy.openParts}
          </OutboundLink>
          <OutboundLink className={linkClass} href={interCarsUrl(query)} destination="intercars" props={base}>
            {copy.intercars}
          </OutboundLink>
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
      {/* MotorFiable-style metadata row before the title */}
      <div className="flex flex-wrap items-center gap-2">
        <SeverityPill locale={locale} severity={pain.severity} />
        {variant?.engine ? (
          <span className="rounded-full border border-[var(--line)] bg-[var(--wash)] px-2 py-0.5 font-mono text-[11px] font-medium text-[var(--ink)]">
            {variant.engine}
          </span>
        ) : null}
        {pain.yearFrom != null || pain.yearTo != null ? (
          <span className="text-[11px] font-medium tabular-nums text-[var(--muted)]">
            {pain.yearFrom != null && pain.yearTo != null && pain.yearFrom !== pain.yearTo
              ? `${pain.yearFrom}–${pain.yearTo}`
              : String(pain.yearFrom ?? pain.yearTo)}
          </span>
        ) : null}
      </div>
      <h3 className="mt-2.5 min-w-0 text-[17px] font-semibold leading-snug tracking-tight">
        {pain.title[locale]}
      </h3>
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
        <OutboundLink
          className="inline-flex h-10 w-fit items-center rounded-full border border-[var(--line)] bg-[var(--wash)] px-3.5 text-[13px] font-medium text-[var(--ink)] hover:border-[var(--accent)]/50"
          href={autodocUrl(
            autodocQueryFor(pain, locale, variant?.engine),
            locale,
            chassis,
            variant,
          )}
          destination="autodoc"
          props={{
            locale,
            surface: "pain_card",
            pain_id: pain.id,
            chassis_slug: chassis?.slug ?? variant?.chassisSlug,
            variant_slug: variant?.slug,
          }}
        >
          {copy.autodoc}: {autodocQueryFor(pain, locale, variant?.engine)}
        </OutboundLink>
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
