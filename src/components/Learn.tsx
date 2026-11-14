import { learn } from "@/content";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

/*
 * One small drawing, three ways. A truss hangs from a stem on the right, and
 * a hand's reach towards its stalk is a line of light.
 */
const TRAILS = [
  "M24 150 C92 150 152 60 247 69",
  "M24 122 C100 112 160 42 247 69",
  "M24 172 C112 170 172 92 247 69",
];
const MEAN = "M24 146 C98 142 160 62 247 69";

function Plant() {
  return (
    <g>
      <path d="M262 0 C257 62 267 124 260 190" className="art-stem" />
      <path d="M261 70 C240 66 227 79 225 100 C224 118 227 136 227 152" className="art-stalk" />
      {[
        [214, 104, 9.5],
        [237, 116, 9.5],
        [215, 129, 9],
        [237, 141, 8.5],
        [225, 156, 7.5],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} className="art-fruit" />
      ))}
      <path d="M262 40 C282 30 300 36 312 50 C296 56 278 54 262 40" className="art-leaf" />
      <path d="M260 20 C238 6 220 10 206 24 C224 34 244 32 260 20" className="art-leaf" />
    </g>
  );
}

/** Record: a few people reach for the stalk, each a little differently. */
function RecordArt() {
  return (
    <svg viewBox="0 0 320 190" className="learn-art art-record" aria-hidden="true">
      <Plant />
      {TRAILS.map((d, i) => (
        <g key={d} style={{ "--n": i } as React.CSSProperties}>
          <path d={d} pathLength={1} className="art-trail" />
          <circle r="4.5" className="art-hand" style={{ offsetPath: `path("${d}")` }} />
        </g>
      ))}
      <g className="art-rec">
        <rect x="18" y="16" width="46" height="20" rx="10" />
        <circle cx="30" cy="26" r="4" />
        <path d="M40 26h14" />
      </g>
    </svg>
  );
}

/** Learn: the reaches settle into one. */
function LearnArt() {
  return (
    <svg viewBox="0 0 320 190" className="learn-art art-learn" aria-hidden="true">
      <Plant />
      {TRAILS.map((d) => (
        <path key={d} d={d} className="art-ghost" />
      ))}
      <path d={MEAN} pathLength={1} className="art-mean" />
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          r="3"
          className="art-pulse"
          style={{ offsetPath: `path("${MEAN}")`, "--n": i } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

/** Work: the tool takes the same line to the stalk and closes on it. */
function WorkArt() {
  return (
    <svg viewBox="0 0 320 190" className="learn-art art-work" aria-hidden="true">
      <Plant />
      <path d={MEAN} className="art-guide" />
      <g className="art-tool" style={{ offsetPath: `path("${MEAN}")` }}>
        <rect x="-30" y="-8" width="16" height="16" rx="4" className="art-palm" />
        <rect x="-15" y="-8" width="17" height="4" rx="2" className="art-jaw art-jaw-a" />
        <rect x="-15" y="4" width="17" height="4" rx="2" className="art-jaw art-jaw-b" />
      </g>
      <circle cx="247" cy="69" r="6" className="art-cut" />
    </svg>
  );
}

const ART = [RecordArt, LearnArt, WorkArt];

/**
 * How a job gets from a crew to a robot, in three steps. Each has a small
 * moving drawing of the same reach: recorded, learned, then done.
 */
export function Learn() {
  return (
    <section id={learn.id} aria-labelledby={`${learn.id}-heading`} className="section">
      <Container>
        <SectionHead id={learn.id} eyebrow={learn.eyebrow} heading={learn.heading} lead={learn.lead} />
        <Reveal as="ol" stagger className="learn-steps m-0 mt-16 grid list-none gap-4 p-0 md:grid-cols-3">
          {learn.steps.map((step, i) => {
            const Art = ART[i];
            return (
              <li key={step.label}>
                <article data-glow className="card flex h-full flex-col overflow-hidden">
                  <div className="learn-frame">
                    <Art />
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
