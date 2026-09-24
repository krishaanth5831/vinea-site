import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-shell px-gutter ${className}`}>
      {children}
    </div>
  );
}

/** A small label in the pixel face, with a lit square beside it. */
export function Label({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`t-label m-0 inline-flex items-center gap-2.5 text-muted ${className}`}>
      <span aria-hidden="true" className="size-1.5 bg-fg" />
      {children}
    </p>
  );
}
