import type { MethodContent } from "./types";

export const method: MethodContent = {
  meta: {
    id: "how-we-work",
    eyebrow: "How we work",
    heading: "The method is the only thing here that is finished.",
  },

  lead:
    "Vinea started from growers, not from a machine. That ordering is the whole discipline: the job is to find out what a glasshouse actually needs before deciding what to build for it. Everything further down this page is downstream of something a grower said.",

  steps: [
    {
      title: "Go task by task, not house by house",
      body:
        "A glasshouse is not one problem. It is harvesting, deleafing, scouting, crop work and transport, each with its own timing, its own people and its own way of going wrong. Asking about the house gets you a tour. Asking about a single job gets you the part that hurts.",
    },
    {
      title: "Ask open, never leading",
      body:
        "The question is what happens in this job and what goes wrong in it. The question is not whether a grower would buy a robot that does it. A leading question returns the answer you walked in with, and that answer is worth nothing.",
    },
    {
      title: "Write down what was said, not what was useful",
      body:
        "The temptation is to keep the parts that fit the idea. The parts that do not fit are the ones that change it, so they get written down in the grower's own words and kept in front of the work.",
    },
    {
      title: "Discard out loud",
      body:
        "Anything that stops surviving contact with growers gets dropped and the reason gets recorded. A discovery project that never discards anything is not discovering.",
    },
  ],

  columns: [
    {
      title: "What we ask",
      items: [
        "Walk me through this job. Who does it, when, and what happens if it slips?",
        "Which part of it goes wrong most often, and what does that cost you?",
        "What have you already tried here, and why did you stop?",
        "What would have to be true before you would let a machine near this?",
        "If you could hand one job over tomorrow, which one, and why that one?",
      ],
    },
    {
      title: "What we hear",
      items: [
        "The pain is not spread evenly. Some jobs are merely dull; a few are the ones growers name unprompted.",
        "The job a grower would hand over first is rarely the job the market is loudest about.",
        "Growers have seen machines before, and they describe what those machines did to the crop with some precision.",
        "Almost every complaint is about a judgement made per plant, not about the walking between plants.",
      ],
    },
    {
      title: "What we discard",
      items: [
        "Anything that only works in one crop, one house or one part of the season.",
        "Anything that asks the grower to rebuild the house around the machine.",
        "A machine that does a single job and stands still the rest of the year.",
        "Any claim we cannot trace back to something a grower actually said.",
      ],
    },
  ],

  conclusion:
    "Run that loop through enough of the house and the same conclusion keeps surfacing: no single-task robot clears the bar a grower sets, because the bar is a person who does several jobs. What survives is one chassis that swaps tools and does several of them in the same house.",
};
