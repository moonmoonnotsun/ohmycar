import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { chassisList, getChassis } from "@/data/chassis";
import {
  painOnChassis,
  painsForChassis,
  variantsTouchingPain,
} from "@/lib/catalog";
import { isLocale, locales } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { autodocUrl } from "@/lib/links";
import { autodocQueryFor } from "@/lib/painSources";
import { MoneyRange } from "@/components/Money";
import { SeverityPill } from "@/components/SeverityPill";
import { EngineGlance } from "@/components/EngineGlance";
import { FaultDiagram, SourceList, WorkshopPrices } from "@/components/FaultExplain";
import { FaultToc, type FaultTocItem } from "@/components/FaultToc";
import { GroupTitle } from "@/components/GroupTitle";
import { OutboundLink } from "@/components/OutboundLink";
import type { Pain } from "@/data/types";

const sectionScroll = "scroll-mt-[calc(var(--header-h,3.5rem)+0.75rem)]";
const sectionBlock =
  "rounded-2xl border-2 border-[var(--line)] bg-[var(--card)] p-4 sm:p-5 md:p-6";

function FaultSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${sectionScroll} ${sectionBlock}`}>
      <GroupTitle>{title}</GroupTitle>
      <div className="mt-1 border-t border-[var(--line)] pt-4 sm:mt-1.5 sm:pt-5">{children}</div>
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; chassis: string; pain: string }>;
}): Promise<Metadata> {
  const { locale, chassis: slug, pain: painId } = await params;
  if (!isLocale(locale)) return {};
  const chassis = getChassis(slug);
  const pain = painOnChassis(slug, painId);
  if (!chassis || !pain) return {};
  return {
    title: `${pain.title[locale]} · ${chassis.code}`,
    description: pain.summary[locale].slice(0, 160),
  };
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    chassisList.flatMap((chassis) =>
      painsForChassis(chassis.slug).map((pain) => ({
        locale,
        chassis: chassis.slug,
        pain: pain.id,
      })),
    ),
  );
}

function yearLabel(pain: Pain): string {
  if (pain.yearFrom != null && pain.yearTo != null && pain.yearFrom !== pain.yearTo) {
    return `${pain.yearFrom}–${pain.yearTo}`;
  }
  if (pain.yearFrom != null) return String(pain.yearFrom);
  if (pain.yearTo != null) return String(pain.yearTo);
  return "—";
}

function GlanceCell({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-3.5 sm:p-4">
      <p className="text-[13px] font-semibold leading-snug text-[var(--ink)]">{label}</p>
      <div className="mt-2.5 min-h-[1.85rem]">{children}</div>
      {hint ? <p className="mt-1.5 text-[12px] leading-4 text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}

function GlancePln({
  range,
  locale,
  tone,
}: {
  range: [number, number] | null | undefined;
  locale: import("@/lib/locale").Locale;
  tone?: "good" | "mid" | "bad";
}) {
  const copy = t(locale);
  if (!range) {
    return <p className="text-xl font-semibold tracking-tight text-[var(--muted)]">{copy.faultNoPln}</p>;
  }
  return <MoneyRange range={range} locale={locale} size="md" tone={tone} />;
}

export default async function FaultPage({
  params,
}: {
  params: Promise<{ locale: string; chassis: string; pain: string }>;
}) {
  const { locale, chassis: slug, pain: painId } = await params;
  if (!isLocale(locale)) notFound();
  const chassis = getChassis(slug);
  const pain = painOnChassis(slug, painId);
  if (!chassis || !pain) notFound();

  const copy = t(locale);
  const related = variantsTouchingPain(slug, pain.id);
  const sample = related[0];
  const engine = sample?.engine ?? pain.engines[0];
  const hasDiagram = Boolean(pain.diagram);
  const sourceCount = pain.sources.length;
  const sourcesLabel =
    sourceCount === 1 ? copy.faultSourceOne : copy.faultSourcesCount.replace("{n}", String(sourceCount));

  const tocItems: FaultTocItem[] = [
    { id: "applies", label: copy.faultHowToCheck },
    { id: "repair", label: copy.repair },
  ];
  if (hasDiagram) tocItems.push({ id: "diagram", label: copy.faultDiagram });
  tocItems.push({ id: "sources", label: copy.sources });
  if (related.length > 0) {
    tocItems.push({
      id: "engines",
      label: copy.faultRelatedVariants.replace("{code}", chassis.code),
    });
  }

  return (
    <div className="flex flex-col gap-5 pb-28 sm:gap-6 md:pb-8">
      <header className="min-w-0">
        <p className="font-display text-[1.35rem] font-bold leading-snug tracking-tight text-[var(--ink)] sm:text-[1.6rem]">
          {chassis.code}
          <span className="mx-1.5 font-normal text-[var(--muted)]" aria-hidden>
            ·
          </span>
          {chassis.name[locale]}
          {engine ? (
            <>
              <span className="mx-1.5 font-normal text-[var(--muted)]" aria-hidden>
                ·
              </span>
              <span className="font-mono font-semibold">{engine}</span>
            </>
          ) : null}
        </p>
        <h1 className="mt-2 font-display text-[1.85rem] font-bold leading-[1.1] tracking-tight sm:text-[2.35rem]">
          {pain.title[locale]}
        </h1>
      </header>

      <aside className="rounded-xl border border-[var(--line)] border-l-4 border-l-[var(--ink)] bg-[var(--wash)] p-4 sm:p-5">
        <p className="text-[15px] leading-7 text-[var(--ink)] sm:text-base sm:leading-7">
          {pain.summary[locale]}
        </p>
      </aside>

      <section className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4" aria-label={copy.repair}>
        <GlanceCell label={copy.independent} hint={copy.publishedFigure}>
          <GlancePln range={pain.plnIndependent} locale={locale} tone="good" />
        </GlanceCell>
        <GlanceCell label={copy.specialist} hint={copy.publishedFigure}>
          <GlancePln range={pain.plnSpecialist} locale={locale} tone="mid" />
        </GlanceCell>
        <GlanceCell label={copy.aso} hint={copy.publishedFigure}>
          <GlancePln range={pain.plnAso} locale={locale} tone="bad" />
        </GlanceCell>
        <GlanceCell label={copy.faultYearsAffected}>
          <p className="text-xl font-semibold tabular-nums tracking-tight text-[var(--ink)]">
            {yearLabel(pain)}
          </p>
        </GlanceCell>
      </section>

      <div className="flex flex-wrap items-center gap-2.5">
        <SeverityPill locale={locale} severity={pain.severity} />
        <span className="text-sm text-[var(--muted)]">{sourcesLabel}</span>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-8 xl:gap-10">
        <div className="min-w-0 space-y-4 sm:space-y-5">
          <FaultToc title={copy.faultOnThisPage} items={tocItems} mode="chips" />

          <FaultSection id="applies" title={copy.faultHowToCheck}>
            <p className="text-[15px] leading-7 text-[var(--ink)] sm:text-base">
              <span className="font-semibold">{copy.affects}</span>
              <span className="text-[var(--muted)]"> · </span>
              {pain.affects[locale]}
            </p>
          </FaultSection>

          <FaultSection id="repair" title={copy.repair}>
            <WorkshopPrices locale={locale} pain={pain} engine={engine} chassisSlug={slug} />
          </FaultSection>

          {hasDiagram ? (
            <FaultSection id="diagram" title={copy.faultDiagram}>
              <FaultDiagram locale={locale} src={pain.diagram} alt={pain.title[locale]} />
            </FaultSection>
          ) : null}

          <FaultSection id="sources" title={copy.sources}>
            <SourceList
              locale={locale}
              sources={pain.sources}
              engine={engine}
              chassisSlug={slug}
              nestUnderHeading
            />
            <OutboundLink
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full border border-[var(--line)] bg-[var(--wash)] px-4 text-sm font-medium text-[var(--ink)] sm:w-auto"
              href={autodocUrl(autodocQueryFor(pain, locale, engine), locale, chassis, sample)}
              destination="autodoc"
              props={{
                locale,
                surface: "fault_page",
                pain_id: pain.id,
                chassis_slug: slug,
                variant_slug: sample?.slug,
              }}
            >
              {copy.autodoc}: {autodocQueryFor(pain, locale, engine)}
            </OutboundLink>
          </FaultSection>

          {related.length > 0 ? (
            <section id="engines" className={`${sectionScroll} ${sectionBlock}`}>
              <EngineGlance
                locale={locale}
                chassisSlug={slug}
                chassisCode={chassis.code}
                variants={related}
                heading={copy.faultRelatedVariants.replace("{code}", chassis.code)}
                lead={copy.otherEnginesLead}
                showWhenSingle
              />
            </section>
          ) : null}
        </div>

        <FaultToc title={copy.faultOnThisPage} items={tocItems} mode="aside" />
      </div>
    </div>
  );
}
