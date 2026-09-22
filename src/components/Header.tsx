"use client";

import { useEffect, useState } from "react";

import { navCta, site } from "@/content";

import { Container } from "./Section";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/88 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-6">
        <a href="#main" className="flex items-baseline gap-2.5">
          <span className="text-[1.375rem] font-semibold tracking-[-0.04em]">
            {site.name}
          </span>
          <span className="t-mono hidden text-signal sm:block">◆</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {site.nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="t-mono text-muted transition-colors duration-200 ease-[var(--ease-quiet)] hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href={navCta.href}
            className="t-mono border border-ink bg-ink px-4 py-2.5 text-paper transition-colors duration-200 ease-[var(--ease-quiet)] hover:border-signal hover:bg-signal"
          >
            {navCta.label}
          </a>
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className="t-mono text-ink lg:hidden"
        >
          {open ? "close" : "menu"}
        </button>
      </Container>

      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-paper lg:hidden">
          <Container className="flex flex-col py-3">
            {site.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="t-mono border-b border-line py-4 text-muted"
              >
                {link.label}
              </a>
            ))}
            <a
              href={navCta.href}
              onClick={() => setOpen(false)}
              className="t-mono mt-4 w-fit border border-ink bg-ink px-4 py-2.5 text-paper"
            >
              {navCta.label}
            </a>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
