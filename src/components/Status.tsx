import { status } from "@/content";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

/** Where Vinea is today: who is building it, the grower side and the bench side. */
export function Status() {
  return (
    <section id={status.id} aria-labelledby={`${status.id}-heading`} className="section">
      <Container>
        <SectionHead
          id={status.id}
          eyebrow={status.eyebrow}
          heading={status.heading}
          lead={status.lead}
        />
        <Reveal as="ul" stagger className="m-0 mt-8 flex list-none flex-wrap justify-center gap-2.5 p-0">
          {status.facts.map((fact) => (
            <li key={fact} className="chip">
              {fact}
            </li>
          ))}
        </Reveal>
        <Reveal stagger className="mt-14 grid gap-4 md:grid-cols-2">
          {status.columns.map((column) => (
            <article key={column.title} data-glow className="card p-6 sm:p-8">
              <h3 className="t-label m-0 text-accent">{column.title}</h3>
              <ul className="m-0 mt-6 flex list-none flex-col gap-4 p-0">
                {column.items.map((item) => (
                  <li key={item} className="flex gap-3.5 leading-relaxed text-pretty">
                    <span aria-hidden="true" className="mt-[0.62em] size-1.5 shrink-0 rounded-full bg-accent" />
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
              className="link-line"
            >
              {link.label}
            </a>
          ))}
        </p>
      </Container>
    </section>
  );
}
