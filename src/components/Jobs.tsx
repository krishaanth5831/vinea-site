import { jobs, what, type JobItem } from "@/content";
import { Container } from "./Container";
import { Render } from "./Render";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

/** Which render stands for each job. */
const ART: Record<JobItem["key"], string> = {
  harvest: "tool-harvest",
  deleaf: "tool-deleaf",
  lower: "hoist",
  scout: "scout",
  base: "base",
};

const ALT: Record<JobItem["key"], string> = {
  harvest: "A concept render of the harvest tool closing on the stalk of a ripe truss.",
  deleaf: "A concept render of the deleafing tool at the lowest leaves of a tomato plant.",
  lower: "A concept render of the lowering module's head resting on the crop wire, among the winding hooks the plants hang from.",
  scout: "A concept render of the cameras on the mast, facing the row.",
  base: "A concept render of the base's wheels on the heating pipes.",
};

/** The first two jobs are furthest along and get the wide tiles. */
const SPAN = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];

/**
 * A tile for every job: a picture of the tool at work, what it does, and how
 * far along it is. The stage is said in words and by the dot beside them,
 * which only beats on the modules being worked on now.
 */
export function Jobs() {
  return (
    <section id={jobs.id} aria-labelledby={`${jobs.id}-heading`} className="section">
      <Container>
        <SectionHead id={jobs.id} eyebrow={jobs.eyebrow} heading={jobs.heading} lead={jobs.lead} />
        <Reveal as="ul" stagger className="m-0 mt-16 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-6">
          {jobs.items.map((item, i) => (
            <li key={item.name} className={SPAN[i] ?? ""}>
              <article data-glow className={`card job stage-${item.stage}`}>
                <div className="job-art">
                  <Render
                    name={ART[item.key]}
                    alt={ALT[item.key]}
                    tag={what.badge}
                    ratio={i < 2 ? "16 / 10" : "4 / 3"}
                    sizes="(min-width: 64rem) 34rem, (min-width: 40rem) 50vw, 100vw"
                  />
                  <p className="stage-chip">
                    <span aria-hidden="true" className="stage-dot" />
                    {jobs.stages[item.stage]}
                  </p>
                </div>
                <div className="p-6 sm:p-7">
                  <p className="t-label m-0 text-accent">{item.name}</p>
                  <h3 className="mt-2.5 mb-0 text-[clamp(1.375rem,2vw,1.625rem)] leading-[1.15] font-medium tracking-[-0.03em]">
                    {item.job}
                  </h3>
                  <p className="mt-3 mb-0 leading-relaxed text-pretty text-muted">{item.body}</p>
                </div>
              </article>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
