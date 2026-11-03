import { modules, type ModuleStage } from "@/content";

import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { Thread } from "./Thread";

/** How far along each stage is, drawn as three cells. */
const FILLED: Record<ModuleStage, number> = { idea: 0, design: 1, sim: 2 };

/**
 * The platform as rows: the module's name and job, what it does, and how
 * far along it is. SPINE sits last, under a heavier rule, as the base the
 * others ride on.
 */
export function Modules() {
  return (
    <section id={modules.id} aria-labelledby={`${modules.id}-heading`} className="pb-section">
      <Thread />

      <Container className="mt-12">
        <SectionHead
          id={modules.id}
          eyebrow={modules.eyebrow}
          heading={modules.heading}
          lead={modules.lead}
        />

        <Reveal as="ul" stagger className="m-0 mt-16 list-none border-t border-line p-0">
          {modules.items.map((item) => {
            const base = item.name === "SPINE";
            return (
              <li
                key={item.name}
                className={`grid gap-3 border-b py-7 md:grid-cols-[12rem_minmax(0,1fr)_11rem] md:items-baseline md:gap-10 ${
                  base ? "border-line-strong border-t-2" : "border-line"
                }`}
              >
                <div className="flex items-baseline gap-3 md:flex-col md:gap-1.5">
                  <span className="t-label text-fg">{item.name}</span>
                  <span className="text-[0.9375rem] text-muted">{item.job}</span>
                </div>
                <p className="m-0 max-w-[46ch] text-[1.0625rem] leading-relaxed text-pretty">
                  {item.body}
                </p>
                <p className="t-mono m-0 flex items-center gap-2.5 text-muted md:justify-end">
                  <span aria-hidden="true" className="flex gap-[3px]">
                    {[0, 1].map((cell) => (
                      <span
                        key={cell}
                        className={`block size-2 ${cell < FILLED[item.stage] ? "bg-fg" : "bg-line-strong"}`}
                      />
                    ))}
                  </span>
                  {modules.stages[item.stage]}
                </p>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
