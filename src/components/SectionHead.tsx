import { Label } from "./Container";
import { Reveal } from "./Reveal";
import { SplitReveal } from "./SplitReveal";

/** The centred label, heading and lead every home section opens with. */
export function SectionHead({
  id,
  eyebrow,
  heading,
  lead,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  lead?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <Reveal>
        <Label>{eyebrow}</Label>
      </Reveal>
      <SplitReveal id={`${id}-heading`} className="t-h2 mt-7 mb-0 max-w-[18ch]">
        {heading}
      </SplitReveal>
      {lead ? (
        <Reveal>
          <p className="t-lead mt-6 mb-0 max-w-[38rem] text-pretty text-muted">{lead}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
