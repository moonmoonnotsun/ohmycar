/** Compact ? control with hover/focus tooltip text. */
export function HintTip({ text, label = "Info" }: { text: string; label?: string }) {
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
        className="pointer-events-none absolute bottom-[calc(100%+0.4rem)] right-0 z-20 w-[min(16.5rem,70vw)] rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-left text-xs leading-5 text-[var(--ink)] opacity-0 shadow-[0_12px_32px_rgba(0,0,0,0.45)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
