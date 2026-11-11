"use client";

import mixpanel from "mixpanel-browser";
import type { Locale } from "@/lib/locale";
import { isLocale } from "@/lib/locale";

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

export type PageType = "home" | "catalog" | "chassis" | "variant" | "compare" | "score" | "other";

export type PageContext = {
  locale: Locale;
  path: string;
  pageType: PageType;
  chassisSlug?: string;
  variantSlug?: string;
};

let ready = false;

function token(): string | undefined {
  const value = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN?.trim();
  return value || undefined;
}

export function initAnalytics() {
  if (ready || typeof window === "undefined") return;
  const projectToken = token();
  if (!projectToken) return;

  mixpanel.init(projectToken, {
    track_pageview: false,
    persistence: "localStorage",
    ignore_dnt: false,
    batch_requests: true,
    api_host: "https://api-js.mixpanel.com",
  });

  ready = true;
}

export function track(event: string, props?: AnalyticsProps) {
  if (typeof window === "undefined") return;
  initAnalytics();
  if (!ready) return;

  const cleaned: Record<string, string | number | boolean> = {};
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value === undefined || value === null) continue;
      cleaned[key] = value;
    }
  }

  mixpanel.track(event, cleaned);
}

export function registerSuperProps(props: AnalyticsProps) {
  if (typeof window === "undefined") return;
  initAnalytics();
  if (!ready) return;

  const cleaned: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null) continue;
    cleaned[key] = value;
  }
  mixpanel.register(cleaned);
}

/** Strip optional basePath and normalize trailing slash for analytics. */
export function analyticsPath(pathname: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  let path = pathname || "/";
  if (base && path.startsWith(base)) path = path.slice(base.length) || "/";
  if (!path.startsWith("/")) path = `/${path}`;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
}

export function pageContextFromPath(pathname: string): PageContext {
  const path = analyticsPath(pathname);
  const parts = path.split("/").filter(Boolean);
  const localePart = parts[0];
  const locale: Locale = isLocale(localePart) ? localePart : "en";
  const section = parts[1];
  const chassisSlug = section === "bmw" && parts[2] ? parts[2] : undefined;
  const variantSlug = chassisSlug && parts[3] ? parts[3] : undefined;

  let pageType: PageType = "other";
  if (!section) pageType = "home";
  else if (section === "bmw" && !chassisSlug) pageType = "catalog";
  else if (section === "bmw" && chassisSlug && !variantSlug) pageType = "chassis";
  else if (section === "bmw" && chassisSlug && variantSlug) pageType = "variant";
  else if (section === "compare") pageType = "compare";
  else if (section === "score") pageType = "score";

  return { locale, path, pageType, chassisSlug, variantSlug };
}

export function trackPageViewed(pathname: string, extra?: AnalyticsProps) {
  const ctx = pageContextFromPath(pathname);
  registerSuperProps({ locale: ctx.locale });
  track("Page Viewed", {
    locale: ctx.locale,
    path: ctx.path,
    page_type: ctx.pageType,
    chassis_slug: ctx.chassisSlug,
    variant_slug: ctx.variantSlug,
    ...extra,
  });

  if (ctx.pageType === "chassis" && ctx.chassisSlug) {
    track("Chassis Viewed", {
      locale: ctx.locale,
      chassis_slug: ctx.chassisSlug,
    });
  }

  if (ctx.pageType === "variant" && ctx.chassisSlug && ctx.variantSlug) {
    track("Variant Viewed", {
      locale: ctx.locale,
      chassis_slug: ctx.chassisSlug,
      variant_slug: ctx.variantSlug,
    });
  }
}
