import { navCta, site } from "@/content";

import { Button } from "./Button";
import { Container } from "./Container";
import { HeaderShell } from "./HeaderShell";
import { Logo } from "./Mark";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <HeaderShell>
      <Container className="flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          <a href="#main" aria-label={site.name} className="text-fg">
            <Logo />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {site.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.875rem] text-muted transition-colors duration-200 hover:text-fg"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Button cta={navCta} small />
        </div>
      </Container>
    </HeaderShell>
  );
}
