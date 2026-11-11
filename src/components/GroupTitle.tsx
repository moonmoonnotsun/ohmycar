import type { ElementType, ReactNode } from "react";

/** Shared section / group title — fault page + variant details. */
export function GroupTitle({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag
      className={`text-[1.2rem] font-bold leading-snug tracking-tight text-[var(--ink)] sm:text-[1.35rem] ${className}`}
    >
      {children}
    </Tag>
  );
}
