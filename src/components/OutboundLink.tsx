"use client";

import type { ReactNode } from "react";
import { track, type AnalyticsProps } from "@/lib/analytics";

export function OutboundLink({
  href,
  className,
  children,
  destination,
  props,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  destination: string;
  props?: AnalyticsProps;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => {
        track("Outbound Link Clicked", {
          destination,
          url: href,
          ...props,
        });
      }}
    >
      {children}
    </a>
  );
}
