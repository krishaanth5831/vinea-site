import type { RoadmapContent } from "./types";

/*
 * What comes next, in order, without dates. `current` marks the stage
 * Vinea is in; move it forward as stages finish.
 */
export const roadmap: RoadmapContent = {
  id: "roadmap",
  eyebrow: "Roadmap",
  heading: "What has to happen, in order.",

  stages: [
    {
      label: "Now",
      title: "Grower meetings and skills in simulation",
      items: [
        "Pitch Vinea to growers and ask for a pilot.",
        "Train the first harvesting and deleafing skills in simulation.",
      ],
      current: true,
    },
    {
      label: "Next",
      title: "From simulation to real plants",
      items: [
        "Run the skills on the bench arm, on real tomato plants.",
        "Build the capture tool and test it on real picks.",
        "A first letter of intent for a pilot.",
      ],
    },
    {
      label: "Then",
      title: "A pilot season in a grower's greenhouse",
      items: [
        "Modules on a fixed stand in a working greenhouse, measured against the crew.",
        "The first crew recordings on normal shifts, once consent and data rights are agreed with the crew.",
      ],
    },
    {
      label: "Later",
      title: "SPINE, and renting it like a crew",
      items: [
        "The base that rides the heating pipes, carrying each module down the rows.",
        "Growers rent Vinea per robot with service included, priced below the labour it replaces. Pricing stays provisional until after the pilot.",
        "Then peppers and cucumbers on the same pipe rails, and glasshouses across Europe.",
      ],
    },
  ],
};
