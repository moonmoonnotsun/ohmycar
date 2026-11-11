"use client";

export type FaultTocItem = { id: string; label: string };

function jumpTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

export function FaultToc({
  title,
  items,
  mode,
}: {
  title: string;
  items: FaultTocItem[];
  mode: "chips" | "aside";
}) {
  if (items.length === 0) return null;

  if (mode === "chips") {
    return (
      <nav aria-label={title} className="lg:hidden">
        <p className="text-sm font-semibold tracking-tight text-[var(--ink)]">{title}</p>
        <ul className="-mx-1 mt-2.5 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                className="tap inline-flex h-9 items-center rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 text-sm font-medium text-[var(--ink)]"
                onClick={(e) => {
                  e.preventDefault();
                  jumpTo(item.id);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <aside className="relative hidden min-h-0 lg:block">
      <nav
        aria-label={title}
        className="sticky top-[calc(var(--header-h,3.5rem)+1rem)] z-10 rounded-xl border border-[var(--line)] bg-[var(--card)] p-3.5 shadow-[0_1px_0_var(--hairline)]"
      >
        <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--ink)]">{title}</p>
        <ul className="mt-3 space-y-0.5">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="tap block rounded-md px-2 py-2 text-sm font-semibold leading-snug text-[var(--ink)]/75 hover:bg-[var(--wash)] hover:text-[var(--ink)]"
                onClick={(e) => {
                  e.preventDefault();
                  jumpTo(item.id);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
