"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAnalytics, trackPageViewed } from "@/lib/analytics";

/**
 * Client-only Mixpanel bootstrap + page views.
 * Static export does full reloads often (HardLink), so we also fire on mount.
 */
export function AnalyticsProvider() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const lastKey = useRef<string>("");

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const query = searchParams.toString();
    const key = `${pathname}?${query}`;
    if (key === lastKey.current) return;
    lastKey.current = key;

    const compareA = searchParams.get("a") ?? undefined;
    const compareB = searchParams.get("b") ?? undefined;
    trackPageViewed(pathname, {
      compare_a: compareA,
      compare_b: compareB,
      has_query: Boolean(query),
    });
  }, [pathname, searchParams]);

  return null;
}
