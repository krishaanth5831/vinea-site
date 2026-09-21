import { tasks } from "@/content";

import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { Section } from "./Section";

export function Tasks() {
  return (
    <Section meta={tasks.meta} lead={tasks.lead} raised>
      {/* Long enough that each job reveals on its own as it is reached. */}
      <div className="mt-16 flex flex-col">
        {tasks.tasks.map((task) => (
          <Reveal
            key={task.name}
            className="border-t border-line-strong py-10 first:border-t-0 first:pt-0"
          >
            <div className="grid gap-8 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-12">
              <div>
                <h3 className="font-display text-[1.625rem] leading-[1.2] tracking-[-0.015em]">
                  {task.name}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-[1.6] text-muted">
                  {task.summary}
                </p>
                <p className="mt-5 inline-block border border-line-strong px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted">
                  {task.status}
                </p>
              </div>

              <dl className="grid gap-8 sm:grid-cols-2">
                <div>
                  <dt className="font-sans text-xs uppercase tracking-[0.18em] text-muted">
                    What growers say
                  </dt>
                  <dd className="mt-4 text-[0.9375rem] leading-[1.7] text-ink">
                    {task.pain}
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-xs uppercase tracking-[0.18em] text-muted">
                    Why it is hard
                  </dt>
                  <dd className="mt-4 text-[0.9375rem] leading-[1.7] text-ink">
                    {task.hard}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        ))}
      </div>

      <RevealGroup className="mt-20">
        <RevealItem>
          <h3 className="font-sans text-xs uppercase tracking-[0.18em] text-muted">
            {tasks.discardedTitle}
          </h3>
        </RevealItem>
        <div className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2">
          {tasks.discarded.map((entry) => (
            <RevealItem key={entry.claim} className="bg-paper p-8">
              <p className="font-display text-lg leading-[1.3] tracking-[-0.01em] text-muted line-through decoration-line-strong decoration-1">
                {entry.claim}
              </p>
              <p className="mt-4 text-[0.9375rem] leading-[1.7] text-ink">
                {entry.because}
              </p>
            </RevealItem>
          ))}
        </div>
      </RevealGroup>
    </Section>
  );
}
