import { site } from "@/content";

import { Container } from "./Section";

export function Footer() {
  return (
    <footer className="border-t border-line py-16">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-baseline sm:justify-between">
        <div className="flex flex-col gap-2 text-sm text-muted">
          <p className="font-display text-lg tracking-[-0.01em] text-ink">
            {site.person}
          </p>
          <a
            href={`mailto:${site.email}`}
            className="w-fit transition-colors duration-200 ease-[var(--ease-quiet)] hover:text-ink"
          >
            {site.email}
          </a>
          <p>{site.location}</p>
        </div>

        <nav aria-label="Elsewhere" className="flex gap-6 text-sm text-muted">
          {site.footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors duration-200 ease-[var(--ease-quiet)] hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
