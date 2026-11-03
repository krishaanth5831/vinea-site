import { status } from "@/content";

import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { Thread } from "./Thread";

/** Where Vinea is today: the grower side and the bench side, side by side. */
export function Status() {
  return (
    <section id={status.id} aria-labelledby={`${status.id}-heading`} className="pb-section">
      <Thread />

      <Container className="mt-12">
        <SectionHead
          id={status.id}
          eyebrow={status.eyebrow}
          heading={status.heading}
          lead={status.lead}
        />

        <Reveal stagger className="mt-16 grid gap-4 md:grid-cols-2">
          {status.columns.map((column) => (
            <article
              key={column.title}
              className="rounded-[4px] border border-line bg-raised p-6 sm:p-8"
            >
              <h3 className="t-label m-0 text-fg">{column.title}</h3>
              <ul className="m-0 mt-6 flex list-none flex-col gap-4 p-0">
                {column.items.map((item) => (
                  <li key={item} className="flex gap-3.5 text-[1rem] leading-relaxed text-pretty">
                    <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 bg-fg" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Reveal>

        <p className="t-mono mt-10 mb-0 flex flex-wrap justify-center gap-x-7 gap-y-3 text-muted">
          {status.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:text-fg hover:decoration-fg"
            >
              {link.label}
            </a>
          ))}
        </p>
      </Container>
    </section>
  );
}
