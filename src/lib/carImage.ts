import type { Chassis } from "@/data/types";
import { publicUrl } from "@/lib/asset";

export type BodyStyle =
  | "sedan"
  | "touring"
  | "coupe"
  | "cabrio"
  | "suv"
  | "hatch"
  | "roadster"
  | "gt";

const PHOTOS: Record<string, string> = {
  e90: "/cars/e90.jpg",
  e91: "/cars/e91.jpg",
  e92: "/cars/e92.jpg",
  e93: "/cars/e93.jpg",
  "e9x-m3": "/cars/e92.jpg",
  e46: "/cars/e46.jpg",
  f30: "/cars/f30.jpg",
  f31: "/cars/f31.jpg",
  e60: "/cars/e60.jpg",
  e61: "/cars/e61.jpg",
  e39: "/cars/e39.jpg",
  f10: "/cars/f10.jpg",
  f11: "/cars/f11.jpg",
  e87: "/cars/e87.jpg",
  e81: "/cars/e81.jpg",
  e70: "/cars/e70.jpg",
  e53: "/cars/e53.jpg",
  e83: "/cars/e83.jpg",
  f20: "/cars/f20.jpg",
};

export function bodyOf(chassis: Chassis): BodyStyle {
  const h = `${chassis.slug} ${chassis.code} ${chassis.name.en} ${chassis.name.pl}`.toLowerCase();
  if (chassis.family === "x") return "suv";
  if (/cabrio/.test(h)) return "cabrio";
  if (/roadster/.test(h) || (chassis.family === "z" && !/coupe/.test(h))) return "roadster";
  if (/touring|kombi/.test(h)) return "touring";
  if (/active tourer|hatch|compact|3-door|3-drzwiowa/.test(h) || chassis.slug === "i3") return "hatch";
  if (/\bgt\b|gran turismo/.test(h)) return "gt";
  if (/coupe|gran coupé|gran coupe/.test(h) || chassis.slug === "i4" || chassis.slug === "i8") return "coupe";
  return "sedan";
}

export function carPhotoSrc(chassis: Chassis): string | null {
  const src = PHOTOS[chassis.slug];
  return src ? publicUrl(src) : null;
}

export function bodyLabelKey(body: BodyStyle): "bodySedan" | "bodyTouring" | "bodyCoupe" | "bodyCabrio" | "bodySuv" | "bodyHatch" | "bodyRoadster" | "bodyGt" {
  const map = {
    sedan: "bodySedan",
    touring: "bodyTouring",
    coupe: "bodyCoupe",
    cabrio: "bodyCabrio",
    suv: "bodySuv",
    hatch: "bodyHatch",
    roadster: "bodyRoadster",
    gt: "bodyGt",
  } as const;
  return map[body];
}
