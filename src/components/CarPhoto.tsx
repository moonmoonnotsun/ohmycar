import type { CSSProperties, ReactNode } from "react";
import type { Chassis, ChassisFamily } from "@/data/types";
import { carPhotoSrc } from "@/lib/carImage";

export function CarPhoto({
  chassis,
  alt,
  className = "",
  priority = false,
  tone = "card",
  ratio,
  badge,
  emptyLabel: _emptyLabel,
  children,
  objectPosition = "50% 58%",
}: {
  chassis: Chassis;
  alt: string;
  className?: string;
  priority?: boolean;
  tone?: "hero" | "card" | "thumb";
  ratio?: `${number} / ${number}`;
  badge?: string;
  emptyLabel?: string;
  children?: ReactNode;
  objectPosition?: string;
}) {
  const src = carPhotoSrc(chassis);
  const style: CSSProperties | undefined = ratio ? { aspectRatio: ratio } : undefined;
  return (
    <div
      className={`car-photo relative overflow-hidden bg-[#0c0e14] ${className}`}
      style={style}
      role={src ? undefined : "img"}
      aria-label={src ? undefined : alt}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          width={1536}
          height={1024}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "low"}
          draggable={false}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            maxWidth: "none",
            objectFit: "cover",
            objectPosition,
          }}
        />
      ) : (
        <CodePlaceholder chassis={chassis} compact={tone === "thumb"} />
      )}
      {src && tone !== "thumb" ? (
        <div
          className={`pointer-events-none absolute inset-0 ${
            tone === "hero"
              ? "bg-gradient-to-t from-black/75 via-black/10 to-black/15"
              : "bg-gradient-to-t from-black/50 via-transparent to-black/10"
          }`}
        />
      ) : null}
      {badge ? (
        <span className="absolute bottom-2 left-2 z-10 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          {badge}
        </span>
      ) : null}
      {children}
    </div>
  );
}

const FAMILY_GLOW: Record<ChassisFamily, [string, string]> = {
  "3": ["rgba(245,196,0,0.42)", "rgba(255,72,72,0.16)"],
  "4": ["rgba(245,196,0,0.34)", "rgba(168,92,255,0.18)"],
  "5": ["rgba(120,168,255,0.32)", "rgba(245,196,0,0.16)"],
  "1": ["rgba(255,152,64,0.34)", "rgba(245,196,0,0.16)"],
  "2": ["rgba(255,152,64,0.30)", "rgba(255,80,80,0.14)"],
  x: ["rgba(62,224,143,0.26)", "rgba(245,196,0,0.16)"],
  luxury: ["rgba(176,148,255,0.30)", "rgba(245,196,0,0.12)"],
  z: ["rgba(255,92,112,0.28)", "rgba(245,196,0,0.16)"],
  i: ["rgba(80,200,255,0.28)", "rgba(62,224,143,0.14)"],
};

function hash(slug: string): number {
  let n = 0;
  for (const ch of slug) n = (n * 33 + ch.charCodeAt(0)) >>> 0;
  return n;
}

function CodePlaceholder({ chassis, compact }: { chassis: Chassis; compact?: boolean }) {
  const n = hash(chassis.slug);
  const [glowA, glowB] = FAMILY_GLOW[chassis.family];
  const angle = 118 + (n % 48);

  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(${angle}deg, #16181f 0%, #0a0b10 55%, #12141c 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute -left-1/4 -top-1/3 h-[90%] w-[80%] rounded-full blur-2xl"
        style={{ background: glowA }}
      />
      <div
        className="pointer-events-none absolute -bottom-1/3 -right-1/4 h-[85%] w-[75%] rounded-full blur-2xl"
        style={{ background: glowB }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,transparent_38%,rgba(0,0,0,0.28)_100%)]" />
      <div className="relative z-[1] flex h-full flex-col items-center justify-center px-2 text-center">
        <p
          className={`font-display leading-none tracking-tight text-white ${
            compact ? "text-[1.35rem] sm:text-2xl" : "text-[2.35rem] sm:text-5xl"
          }`}
        >
          {chassis.code}
        </p>
        {compact ? null : (
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 sm:text-[11px]">
            {chassis.years}
          </p>
        )}
      </div>
    </div>
  );
}
