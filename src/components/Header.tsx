"use client";

import { useEffect, useState } from "react";

import { navCta, site } from "@/content";

import { Cta } from "./Cta";
import { Container } from "./Section";

export function Header() {
  const [open, setOpen] = useState(false);

  /* Escape closes the small-screen menu, as a disclosure should. */
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-4">
        <a
          href="#main"
          className="font-display text-xl tracking-[-0.01em] text-ink"
        >
          {site.name}
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {site.nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors duration-200 ease-[var(--ease-quiet)] hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <Cta cta={navCta} />
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className="text-sm text-ink md:hidden"
        >
          {open ? "close" : "menu"}
        </button>
      </Container>

      {/*
        Rendered only when open so it cannot be tabbed into while hidden.
      */}
      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-paper md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {site.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-muted"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3">
              <Cta cta={navCta} />
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
