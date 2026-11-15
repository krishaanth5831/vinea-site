import { learn } from "@/content";
import { Clip } from "./Clip";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

const CLIPS = ["learn-record", "learn-learn", "learn-work"];

/**
 * How a job gets from a crew to a robot, in three steps. Each has a short
 * rendered loop of the same reach to a truss: recorded, learned, then done.
 * The loops come from scripts/blender (the `--learn` pass).
 */
export function Learn() {
  return (
    <section id={learn.id} aria-labelledby={`${learn.id}-heading`} className="section">
      <Container>
        <SectionHead id={learn.id} eyebrow={learn.eyebrow} heading={learn.heading} lead={learn.lead} />
        <Reveal as="ol" stagger className="learn-steps m-0 mt-16 grid list-none gap-4 p-0 md:grid-cols-3">
          {learn.steps.map((step, i) => {
            return (
              <li key={step.label}>
                <article data-glow className="card flex h-full flex-col overflow-hidden">
                  <div className="learn-frame">
                    <Clip name={CLIPS[i]} label={step.alt} />
                    <span className="render-tag">{learn.badge}</span>
                  </div>
                  <div className="flex grow flex-col p-6 sm:p-7">
                    <p className="t-label m-0 flex items-center gap-3 text-accent">
                      <span aria-hidden="true" className="learn-pips">
                        {learn.steps.map((other, j) => (
                          <span key={other.label} className={j <= i ? "is-on" : ""} />
                        ))}
                      </span>
                      {step.label}
                    </p>
                    <h3 className="mt-4 mb-0 text-[clamp(1.25rem,1.9vw,1.5rem)] leading-[1.15] font-medium tracking-[-0.03em] text-balance">
                      {step.title}
                    </h3>
                    <p className="mt-3 mb-0 leading-relaxed text-pretty text-muted">{step.body}</p>
                  </div>
                </article>
              </li>
            );
          })}
        </Reveal>
        <Reveal>
          <p className="note-line mx-auto mt-10 mb-0">{learn.note}</p>
        </Reveal>
      </Container>
    </section>
  );
}
