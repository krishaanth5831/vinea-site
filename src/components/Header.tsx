import { navCta, site } from "@/content";

import { Button } from "./Button";
import { Container } from "./Container";
import { HeaderShell } from "./HeaderShell";
import { Logo } from "./Mark";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <HeaderShell>
      <Container className="flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          {/*
            Plain anchors between pages, on purpose: a full navigation is what
            lets the browser run the cross-page view transition, and it gives
            each page a fresh Lenis and ScrollTrigger setup.
          */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#main" aria-label={site.name} className="text-fg">
            <Logo />
          </a>

          <NavLinks links={site.nav} />
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Button cta={navCta} small />
        </div>
      </Container>
    </HeaderShell>
  );
}
