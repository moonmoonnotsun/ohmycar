import { Banknote, CalendarDays, CarFront, Fuel, Wrench, type LucideIcon } from "lucide-react";

/**
 * Lucide has no engine glyph — custom path on the same 24×24 / stroke
 * contract so it reads at the same size as Fuel / CarFront / CalendarDays.
 */
function EngineIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M6 12h2l1.5-4h5L16 12h2v3h2v4h-2v2H6v-2H4v-4h2z" />
      <path d="M9 15h4" />
      <path d="M14 8V6h3v2" />
    </svg>
  );
}

const icons = {
  engine: EngineIcon,
  fuel: Fuel,
  body: CarFront,
  year: CalendarDays,
  buy: Banknote,
  repair: Wrench,
} as const;

export type SpecIconKey = keyof typeof icons;

export function SpecIcon({
  name,
  className = "size-4",
}: {
  name: SpecIconKey;
  className?: string;
}) {
  if (name === "engine") return <EngineIcon className={className} />;
  const Lucide = icons[name] as LucideIcon;
  return <Lucide className={className} strokeWidth={1.75} aria-hidden />;
}
