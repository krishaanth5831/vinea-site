import { site } from "@/content";

import { Container } from "./Container";
import { Logo } from "./Mark";

export function Footer() {
  const links = [
    ...site.footerLinks,
    { label: "Email", href: `mailto:${site.email}` as const, external: false },
  ];

  return (
    <footer className="border-t border-line py-14">
      <Container className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4">
          <Logo className="text-fg" />
          <p className="t-mono m-0 text-muted">{site.location}</p>
        </div>

        <nav aria-label="Elsewhere" className="flex gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noreferrer noopener" }
                : {})}
              className="t-mono text-muted transition-colors duration-200 hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
