import { site } from "@/content";

import { Container, Mono } from "./Section";

export function Footer() {
  return (
    <footer className="border-t border-line py-16">
      <Container className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Mono>Vinea</Mono>
          <p className="t-h3 mt-4 mb-0">{site.person}</p>
          <div className="mt-4 flex flex-col gap-1.5 text-[0.9375rem] text-muted">
            <a
              href={`mailto:${site.email}`}
              className="w-fit transition-colors duration-200 ease-[var(--ease-quiet)] hover:text-signal"
            >
              {site.email}
            </a>
            <p className="m-0">{site.location}</p>
          </div>
        </div>

        <nav aria-label="Elsewhere" className="flex gap-8">
          {site.footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="t-mono text-muted transition-colors duration-200 ease-[var(--ease-quiet)] hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
