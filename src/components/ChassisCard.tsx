import Link from "next/link";
import type { Chassis } from "@/data/types";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { isScoredChassis } from "@/lib/catalog";
import { bodyLabelKey, bodyOf } from "@/lib/carImage";
import { CarPhoto } from "@/components/CarPhoto";

export function ChassisCard({
  chassis,
  locale,
}: {
  chassis: Chassis;
  locale: Locale;
}) {
  const copy = t(locale);
  const scored = isScoredChassis(chassis);
  const body = copy[bodyLabelKey(bodyOf(chassis))];
  return (
    <Link
      href={`/${locale}/bmw/${chassis.slug}`}
      className="tap block overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] transition active:scale-[0.99]"
    >
      <CarPhoto
        chassis={chassis}
        alt={`${chassis.code} ${chassis.name[locale]}`}
        className="w-full"
        ratio="16 / 10"
        badge={body}
        emptyLabel={copy.photoSoon}
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-xl font-semibold tracking-tight">{chassis.code}</p>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              scored ? "bg-[var(--accent)] text-[var(--paper)]" : "bg-[var(--wash)] text-[var(--muted)]"
            }`}
          >
            {scored ? copy.gold : copy.catalogOnly}
          </span>
        </div>
        <p className="mt-1 text-sm text-[var(--muted)]">{chassis.name[locale]}</p>
        <p className="mt-3 text-xs tabular-nums text-[var(--muted)]">{chassis.years}</p>
      </div>
    </Link>
  );
}

export function ChassisRow({
  chassis,
  locale,
}: {
  chassis: Chassis;
  locale: Locale;
}) {
  const copy = t(locale);
  const scored = isScoredChassis(chassis);
  const body = copy[bodyLabelKey(bodyOf(chassis))];
  return (
    <Link
      href={`/${locale}/bmw/${chassis.slug}`}
      className="tap flex min-h-14 items-center justify-between gap-3 border-b border-[var(--line)] px-1 py-3 last:border-0"
    >
      <CarPhoto
        chassis={chassis}
        alt=""
        className="h-12 w-[4.6rem] shrink-0 rounded-lg"
        tone="thumb"
      />
      <div className="min-w-0 flex-1">
        <p className="font-mono text-base font-semibold">{chassis.code}</p>
        <p className="truncate text-sm text-[var(--muted)]">
          {body} · {chassis.name[locale]} · {chassis.years}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
          scored ? "bg-[var(--accent)] text-[var(--paper)]" : "text-[var(--muted)]"
        }`}
      >
        {scored ? copy.gold : copy.catalogOnly}
      </span>
    </Link>
  );
}
