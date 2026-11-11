import type { Chassis, Pain, VariantBrief } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { publicUrl } from "@/lib/asset";
import { formatPlnBandCompact } from "@/lib/links";
import { HardLink } from "@/components/HardLink";
import { SeverityPill } from "@/components/SeverityPill";

const SEV_BAR: Record<Pain["severity"], string> = {
  "engine-loss": "bg-[var(--bad)]",
  safety: "bg-[var(--bad)]",
  expensive: "bg-[var(--mid)]",
  overheat: "bg-[var(--mid)]",
  stranded: "bg-[var(--mid)]",
  annoyance: "bg-[var(--muted)]",
};

function yearLabel(pain: Pain): string | null {
  if (pain.yearFrom != null && pain.yearTo != null && pain.yearFrom !== pain.yearTo) {
    return `${pain.yearFrom}–${pain.yearTo}`;
  }
  if (pain.yearFrom != null) return String(pain.yearFrom);
  if (pain.yearTo != null) return String(pain.yearTo);
  return null;
}

function indieGlance(pain: Pain, locale: Locale): { text: string; toned: boolean } {
  const copy = t(locale);
  const band = pain.plnIndependent;
  if (band && band[0] === 0 && band[1] === 0) {
    return { text: copy.free, toned: true };
  }
  if (band && !(band[0] <= 0 && band[1] <= 0)) {
    return { text: formatPlnBandCompact(band, locale), toned: true };
  }
  return { text: copy.faultNoPln, toned: false };
}

/** Compact MotorFiable-style fault row — detail lives on the fault page. */
export function PainPreview({
  locale,
  pain,
  chassis,
  variant,
}: {
  locale: Locale;
  pain: Pain;
  chassis: Chassis;
  variant?: VariantBrief;
}) {
  const copy = t(locale);
  const href = publicUrl(`/${locale}/bmw/${chassis.slug}/fault/${pain.id}/`);
  const years = yearLabel(pain);
  const price = indieGlance(pain, locale);
  const analytics = {
    locale,
    chassis_slug: chassis.slug,
    variant_slug: variant?.slug,
    pain_id: pain.id,
    surface: "pain_preview",
  };

  return (
    <article className="relative overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--card)]">
      <span className={`absolute inset-y-0 left-0 w-1 ${SEV_BAR[pain.severity]}`} aria-hidden />
      <div className="p-3.5 pl-4 sm:p-4 sm:pl-5">
        <div className="flex flex-wrap items-center gap-2">
          <SeverityPill locale={locale} severity={pain.severity} />
          {variant?.engine ? (
            <span className="rounded-md border border-[var(--line)] bg-[var(--wash)] px-2 py-0.5 font-mono text-[11px] font-medium text-[var(--ink)]">
              {variant.engine}
            </span>
          ) : null}
          {years ? (
            <span className="text-[11px] font-medium tabular-nums text-[var(--muted)]">{years}</span>
          ) : null}
        </div>

        <HardLink
          href={href}
          analyticsEvent="Fault Preview Opened"
          analyticsProps={analytics}
          className="mt-2 block text-base font-semibold leading-snug tracking-tight text-[var(--ink)] hover:underline sm:text-[17px]"
        >
          {pain.title[locale]}
        </HardLink>

        <p className="mt-1.5 line-clamp-3 text-sm leading-6 text-[var(--muted)]">{pain.summary[locale]}</p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-[12px] font-semibold tabular-nums ${
              price.toned
                ? "bg-[var(--mid-bg)] text-[var(--mid)]"
                : "bg-[var(--wash)] text-[var(--muted)]"
            }`}
          >
            {price.text}
          </span>
          <HardLink
            href={href}
            analyticsEvent="Fault Preview Opened"
            analyticsProps={analytics}
            className="text-[13px] font-semibold text-[var(--ink)] underline underline-offset-2"
          >
            {copy.openFaultReport} →
          </HardLink>
        </div>
      </div>
    </article>
  );
}
