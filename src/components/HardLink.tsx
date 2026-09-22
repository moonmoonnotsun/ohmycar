"use client";

import type { MouseEvent, ReactNode } from "react";

/**
 * Full document navigation.
 * Next 16 App Router soft-nav/prefetch against `output: "export"` + basePath
 * often swallows clicks on internal links (RSC .txt path mismatch).
 */
export function HardLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  function go(event: MouseEvent<HTMLAnchorElement>) {
    // Allow modified clicks (new tab / download) to use the native href.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    window.location.assign(href);
  }

  return (
    <a href={href} className={className} onClick={go}>
      {children}
    </a>
  );
}
