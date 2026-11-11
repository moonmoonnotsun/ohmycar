import type { ReactNode } from "react";

/** Compact ? control with hover/focus tooltip. */
export function HintTip({
  text,
  label = "Info",
}: {
  text: ReactNode;
  label?: string;
}) {
  return (
    <span className="group relative inline-flex shrink-0">
      <button
        type="button"
        aria-label={label}
        className="tap inline-flex size-5 items-center justify-center rounded-full border border-[var(--line)] text-[10px] font-semibold leading-none text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
      >
        ?
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+0.4rem)] left-1/2 z-20 w-[min(16.5rem,70vw)] -translate-x-1/2 rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2.5 text-left text-xs leading-5 text-[var(--ink)] opacity-0 shadow-[var(--shadow)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 sm:left-auto sm:right-0 sm:translate-x-0"
      >
        {text}
      </span>
    </span>
  );
}
