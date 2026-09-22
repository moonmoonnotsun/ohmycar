import type { Chassis } from "@/data/types";
import { publicUrl } from "@/lib/asset";
import carPhotos from "@/data/imported/carPhotos.json";

export type BodyStyle =
  | "sedan"
  | "touring"
  | "coupe"
  | "cabrio"
  | "suv"
  | "hatch"
  | "roadster"
  | "gt";

const PHOTOS = carPhotos.photos as Record<string, string>;

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

export function bodyLabelKey(
  body: BodyStyle,
): "bodySedan" | "bodyTouring" | "bodyCoupe" | "bodyCabrio" | "bodySuv" | "bodyHatch" | "bodyRoadster" | "bodyGt" {
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
