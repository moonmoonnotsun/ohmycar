import type { ReactNode } from "react";
import type { VariantBrief } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { publicUrl } from "@/lib/asset";
import { HardLink } from "@/components/HardLink";
import { HintTip } from "@/components/HintTip";
import { modelsFor, resolveVariant, yearOptionsForModel } from "@/lib/catalog";
import { scoreTone } from "@/lib/score";

function yearTone(score: number | null): "good" | "mid" | "bad" | "none" {
  if (score == null) return "none";
  return scoreTone(score);
}

function yearDotClass(score: number | null): string {
  const tone = yearTone(score);
  if (tone === "good") return "bg-[var(--good)]";
  if (tone === "mid") return "bg-[var(--year-dot-mid)]";
  if (tone === "bad") return "bg-[var(--bad)]";
  return "bg-[var(--muted)]";
}

/** Hard nav href — soft Link nav is unreliable on static export + basePath. */
function variantHref(locale: Locale, chassisSlug: string, slug: string) {
  return publicUrl(`/${locale}/bmw/${chassisSlug}/${slug}/`);
}

function SwitcherRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
      <div className="flex shrink-0 items-center gap-1.5 sm:min-w-[5.25rem]">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">{label}</p>
        {hint}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function YearRiskLegend({ locale }: { locale: Locale }) {
  const copy = t(locale);
  return (
    <div className="inline-flex items-center gap-2 text-[11px] leading-none text-[var(--muted)] sm:gap-2.5 sm:text-[12px]">
      <span className="inline-flex items-center gap-1.5">
        <span className="size-2 shrink-0 rounded-full bg-[var(--good)]" aria-hidden />
        <span>{copy.riskLower}</span>
      </span>
      <span
        className="block h-1.5 w-14 shrink-0 rounded-full bg-gradient-to-r from-[var(--good)] via-[var(--mid)] to-[var(--bad)]"
        aria-hidden
      />
      <span className="inline-flex items-center gap-1.5">
        <span className="size-2 shrink-0 rounded-full bg-[var(--bad)]" aria-hidden />
        <span>{copy.riskHigher}</span>
      </span>
    </div>
  );
}

export function VariantSwitcher({
  locale,
  chassisSlug,
  variant,
}: {
  locale: Locale;
  chassisSlug: string;
  variant: VariantBrief;
}) {
  const copy = t(locale);
  const models = modelsFor(chassisSlug);
  const years = yearOptionsForModel(chassisSlug, variant.model);
  const showModels = models.length > 1;
  const showYears = years.length > 1;

  return (
    <div className={`flex flex-col ${showModels ? "border-t border-[var(--line)] pt-3.5 sm:pt-4" : ""}`}>
      {showModels ? (
        <SwitcherRow label={copy.pickEngines}>
          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 no-scrollbar sm:flex-wrap sm:overflow-visible">
            {models.map((model) => {
              const active = model === variant.model;
              const target =
                resolveVariant({
                  chassisSlug,
                  model,
                  year: variant.year,
                  preferEngine: variant.engine,
                  preferFuel: variant.fuel,
                }) ?? resolveVariant({ chassisSlug, model, preferFuel: variant.fuel });
              if (!target) return null;
              return (
                <HardLink
                  key={model}
                  href={variantHref(locale, chassisSlug, target.slug)}
                  analyticsEvent={active ? undefined : "Variant Switched"}
                  analyticsProps={
                    active
                      ? undefined
                      : {
                          locale,
                          chassis_slug: chassisSlug,
                          switch_type: "model",
                          from_model: variant.model,
                          to_model: model,
                          to_variant_slug: target.slug,
                        }
                  }
                  className={`inline-flex h-9 shrink-0 items-center rounded-full border-2 border-solid px-3 text-sm tabular-nums sm:h-tap sm:px-3.5 ${
                    active
                      ? "border-[var(--ink)] bg-[var(--wash)] font-semibold text-[var(--ink)]"
                      : "border-[var(--line)] bg-[var(--wash)]/70 font-medium text-[var(--ink)]"
                  }`}
                >
                  {model}
                </HardLink>
              );
            })}
          </div>
        </SwitcherRow>
      ) : null}

      {showModels && showYears ? (
        <div className="my-2.5 h-px w-full bg-[var(--hairline)] sm:my-3.5" aria-hidden />
      ) : null}

      {showYears ? (
        <div>
          <SwitcherRow
            label={copy.pickYears}
            hint={
              <HintTip label={copy.pickYears} text={<YearRiskLegend locale={locale} />} />
            }
          >
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1.5 pb-0.5 pt-1.5 no-scrollbar sm:flex-wrap sm:gap-2 sm:overflow-visible">
              {years.map(({ year, variant: row, score }) => {
                // Color/link = canonical year cell for this model (best score).
                // Do not prefer current engine — that made 2015 flip N47↔B47 when browsing years.
                const active = year === variant.year;
                const href =
                  resolveVariant({
                    chassisSlug,
                    model: variant.model,
                    year,
                    preferFuel: variant.fuel,
                  }) ?? row;
                return (
                  <HardLink
                    key={`${year}-${row.slug}`}
                    href={variantHref(locale, chassisSlug, href.slug)}
                    analyticsEvent={active ? undefined : "Variant Switched"}
                    analyticsProps={
                      active
                        ? undefined
                        : {
                            locale,
                            chassis_slug: chassisSlug,
                            switch_type: "year",
                            model: variant.model,
                            from_year: variant.year,
                            to_year: year,
                            to_variant_slug: href.slug,
                            score,
                          }
                    }
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex h-9 shrink-0 items-center rounded-full border-2 border-solid px-3 text-sm tabular-nums sm:h-tap sm:px-3.5 ${
                      active
                        ? "border-[var(--ink)] bg-[var(--wash)] font-semibold text-[var(--ink)]"
                        : "border-[var(--line)] bg-[var(--wash)]/70 font-medium text-[var(--ink)]"
                    }`}
                  >
                    <span
                      className={`absolute -right-1 -top-1 size-2.5 rounded-full ring-2 ring-[var(--card)] ${yearDotClass(score)}`}
                      aria-hidden
                    />
                    {year}
                  </HardLink>
                );
              })}
            </div>
          </SwitcherRow>
        </div>
      ) : null}
    </div>
  );
}
