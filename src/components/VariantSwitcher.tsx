import type { ReactNode } from "react";
import type { VariantBrief } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { publicUrl } from "@/lib/asset";
import { HardLink } from "@/components/HardLink";
import { modelsFor, resolveVariant, yearOptionsForModel } from "@/lib/catalog";
import { scoreTone } from "@/lib/score";

function yearTone(score: number | null): "good" | "mid" | "bad" | "none" {
  if (score == null) return "none";
  return scoreTone(score);
}

function yearRiskClass(score: number | null, active: boolean): string {
  const tone = yearTone(score);
  const rim =
    tone === "good"
      ? {
          border: "border-[var(--good)]",
          bg: "bg-[rgba(62,224,143,0.06)]",
          text: "text-[var(--good)]",
        }
      : tone === "mid"
        ? {
            border: "border-[var(--mid)]",
            bg: "bg-[rgba(245,196,0,0.06)]",
            text: "text-[var(--mid)]",
          }
        : tone === "bad"
          ? {
              border: "border-[var(--bad)]",
              bg: "bg-[rgba(255,75,75,0.06)]",
              text: "text-[var(--bad)]",
            }
          : {
              border: "border-[var(--line)]",
              bg: "bg-transparent",
              text: "text-[var(--muted)]",
            };

  // Only the selected year keeps a risk-colored rim; idle years are borderless.
  if (active) {
    return `border border-solid ${rim.border} ${rim.bg} ${rim.text}`;
  }
  return `border border-solid border-transparent ${rim.bg} ${rim.text}`;
}

/** Hard nav href — soft Link nav is unreliable on static export + basePath. */
function variantHref(locale: Locale, chassisSlug: string, slug: string) {
  return publicUrl(`/${locale}/bmw/${chassisSlug}/${slug}/`);
}

function SwitcherRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
      <p className="shrink-0 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)] sm:w-[5.25rem]">
        {label}
      </p>
      <div className="min-w-0 flex-1">{children}</div>
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
    <div className="flex flex-col">
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
                  className={`inline-flex h-9 shrink-0 items-center rounded-full border px-3 text-sm font-medium tabular-nums sm:h-tap sm:px-3.5 ${
                    active
                      ? "border-[var(--accent)] bg-transparent text-[var(--accent)]"
                      : "border-[var(--line)] bg-transparent text-[var(--muted)]"
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
        <div className="my-2.5 h-px w-full bg-white/12 sm:my-3.5" aria-hidden />
      ) : null}

      {showYears ? (
        <div>
          <SwitcherRow label={copy.pickYears}>
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 no-scrollbar sm:flex-wrap sm:gap-2 sm:overflow-visible">
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
                    className={`inline-flex h-9 shrink-0 items-center rounded-full px-3 text-sm font-medium tabular-nums sm:h-tap sm:px-3.5 ${yearRiskClass(score, active)}`}
                  >
                    {year}
                  </HardLink>
                );
              })}
            </div>
          </SwitcherRow>

          <div className="mt-2.5 flex justify-start sm:mt-4 sm:pl-[calc(5.25rem+0.75rem)] md:justify-end md:pl-0">
            <div className="inline-flex items-center gap-2 text-[11px] leading-none text-[var(--muted)] sm:gap-3 sm:text-[12px]">
              <span className="inline-flex items-center gap-1.5 sm:gap-2">
                <span className="size-2 shrink-0 rounded-full bg-[var(--good)] sm:size-2.5" aria-hidden />
                <span>{copy.riskLower}</span>
              </span>
              <span
                className="block h-1.5 w-16 shrink-0 rounded-full bg-gradient-to-r from-[var(--good)] via-[var(--mid)] to-[var(--bad)] sm:h-2 sm:w-24"
                aria-hidden
              />
              <span className="inline-flex items-center gap-1.5 sm:gap-2">
                <span className="size-2 shrink-0 rounded-full bg-[var(--bad)] sm:size-2.5" aria-hidden />
                <span>{copy.riskHigher}</span>
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
