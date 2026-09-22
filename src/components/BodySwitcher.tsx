import type { Chassis, VariantBrief } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { publicUrl } from "@/lib/asset";
import { bodyLabelKey, bodyOf } from "@/lib/carImage";
import { CarPhoto } from "@/components/CarPhoto";
import { getVariant } from "@/lib/catalog";

export function BodySwitcher({
  locale,
  current,
  bodies,
  compact = false,
  from,
}: {
  locale: Locale;
  current: string;
  bodies: Chassis[];
  compact?: boolean;
  /** On a year+engine briefing, only show bodies that actually had that year. */
  from?: VariantBrief;
}) {
  const copy = t(locale);
  const listed = from
    ? bodies.filter((item) => Boolean(getVariant(item.slug, from.slug)))
    : bodies;
  if (listed.length < 2) return null;

  return (
    <section>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
        {copy.pickBody}
      </p>
      <div className={`flex gap-2 ${compact ? "overflow-x-auto no-scrollbar pb-1" : "grid grid-cols-4"}`}>
        {listed.map((item) => {
          const active = item.slug === current;
          const body = copy[bodyLabelKey(bodyOf(item))];
          const href = from
            ? publicUrl(`/${locale}/bmw/${item.slug}/${from.slug}/`)
            : publicUrl(`/${locale}/bmw/${item.slug}/`);
          return (
            <a
              key={item.slug}
              href={href}
              className={`overflow-hidden rounded-xl border ${
                compact ? "w-[6.75rem] shrink-0" : "min-w-0"
              } ${active ? "border-[var(--accent)]" : "tap border-[var(--line)]"}`}
            >
              <CarPhoto
                chassis={item}
                alt={`${item.code} ${body}`}
                className={compact ? "h-[3.35rem] w-full" : "h-[4.25rem] w-full sm:h-[5.25rem]"}
                tone="thumb"
                emptyLabel={copy.photoSoon}
              />
              <div className="px-2 py-1.5">
                <p className="font-mono text-xs font-semibold">{item.code}</p>
                <p className="truncate text-[10px] uppercase tracking-wide text-[var(--muted)]">{body}</p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
