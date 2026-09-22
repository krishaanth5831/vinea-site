import type { ReactNode } from "react";

/** A registration mark, as a drawing would carry at each corner of a plate. */
function Mark({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 block size-[7px] rounded-full border border-line-strong bg-paper ${className}`}
    />
  );
}

/**
 * A hairline plate with registration marks at its corners. The page's only
 * container: no shadows, no fills, just the rule and its corners.
 */
export function Frame({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li" | "figure";
}) {
  return (
    <Tag className={`relative border border-line ${className}`}>
      <Mark className="-left-[4px] -top-[4px]" />
      <Mark className="-right-[4px] -top-[4px]" />
      <Mark className="-bottom-[4px] -left-[4px]" />
      <Mark className="-bottom-[4px] -right-[4px]" />
      {children}
    </Tag>
  );
}
