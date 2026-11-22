import type { RoadmapContent } from "./types";

/*
 * What comes next, in order. The site carries no dates, so each stage says
 * when in words. `current` marks the stage Vinea is in; move it forward as
 * stages finish. The lanes show how far each module has got: raise a row's
 * `reached` when it passes a step.
 */
export const roadmap: RoadmapContent = {
  id: "roadmap",
  eyebrow: "Roadmap",
  heading: "What has to happen, in order.",
  here: "We are here",

  stages: [
    {
      when: "This autumn",
      label: "Now",
      title: "Skills in simulation, growers in person",
      items: [
        "Train the first harvesting and deleafing skills in simulation.",
        "Pitch Vinea to growers and ask for a pilot.",
      ],
      current: true,
    },
    {
      when: "This winter",
      label: "Next",
      title: "From simulation to real plants",
      items: [
        "Run the skills on the bench arm, on real tomato plants.",
        "Test the capture device on real picks.",
        "A first signed letter of intent for a pilot.",
      ],
    },
    {
      when: "Next season",
      label: "Then",
      title: "A pilot season in a grower's greenhouse",
      items: [
        "Modules on a fixed stand in a working greenhouse, measured against the crew.",
        "The first crew recordings on normal shifts, once consent and data rights are agreed with the crew.",
      ],
    },
    {
      when: "After the pilot",
      label: "Later",
      title: "The base, and renting it like a crew",
      items: [
        "The base that rides the heating pipes, carrying each module down the rows.",
        "Growers rent Vinea per robot with service included, priced below the labour it replaces.",
        "Then peppers and cucumbers on the same pipe rails, and glasshouses across Europe.",
      ],
    },
  ],

  lanes: {
    heading: "Where each module is",
    steps: ["Designed", "In simulation", "On real plants", "In a greenhouse"],
    moduleHeader: "Module",
    reachedLabel: "reached",
    notYetLabel: "not yet",
    rows: [
      { name: "BLUSH", job: "Harvests", reached: 2 },
      { name: "SHEAR", job: "Deleafs", reached: 2 },
      { name: "HOIST", job: "Lowers and rehangs", reached: 1 },
      { name: "SPINE", job: "The base", reached: 1 },
      { name: "RAVEN", job: "Scouts", reached: 0 },
    ],
  },
};
