"use client";

import { useEffect } from "react";
import { writeCompareSlots } from "@/lib/compare";

/** Keep sessionStorage in sync with the shareable compare URL. */
export function CompareSlotSync({ a, b }: { a?: string; b?: string }) {
  useEffect(() => {
    writeCompareSlots({ a, b });
  }, [a, b]);
  return null;
}
