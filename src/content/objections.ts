import type { ObjectionsContent } from "./types";

export const objections: ObjectionsContent = {
  meta: {
    id: "pushback",
    eyebrow: "What growers push back on",
    heading: "The most useful thing anyone has said was an objection.",
  },

  lead:
    "Asking open questions means hearing that the idea is wrong. That is the point of asking them, and the sharpest version of it came back plainly.",

  objection:
    "A grower described the harvesting machines they had seen this way: they cut the vine instead of the stem, the fruit comes off the truss on the way into the crate, and the whole thing moves down the row slower than a person does. Until that changes, the comparison is not close.",

  objectionNote:
    "That is evidence the method works, not a testimonial. No grower here is a design partner, an endorsement or a customer, and none has been asked to be.",

  answeredTitle: "What can be answered",

  answered: [
    {
      title: "The cut is the tool's first job, not a detail",
      body:
        "Taking the stem cleanly, and knowing stem from vine before the blade moves, is the requirement a harvesting tool either meets or does not. A tool that pulls fruit off the truss is not a working tool at an early stage — it is a tool that has failed its only test.",
    },
    {
      title: "Damage is a design constraint, not a tolerance",
      body:
        "Fruit that gets marked between the plant and the crate has already cost the grower the difference. That is treated as something the tool must not do, rather than something to be traded against how quickly it works.",
    },
    {
      title: "The platform argument does not rest on winning one task",
      body:
        "A machine that beats a person at harvesting is not what the conversations point to. What they point to is a machine that is worth having in the house because it does several jobs. That case survives a tool being unremarkable at any one of them.",
    },
  ],

  unansweredTitle: "What cannot be answered yet",

  unanswered: [
    {
      title: "Speed",
      body:
        "Nothing honest can be said about how fast a machine moves down a row until there is a machine to measure. The objection stands unanswered, and it will stay on this page until it is answered with something measured rather than something claimed.",
    },
    {
      title: "Whether a tool can make the ripeness call",
      body:
        "Judging a truss is the part of harvesting that growers describe as skill. Whether that judgement can be made reliably enough by a machine is an open question here, not a solved one.",
    },
    {
      title: "How it behaves across houses and crops",
      body:
        "Houses differ, crops differ, and how much of that a platform can absorb is unknown. Anyone claiming otherwise before a pilot is guessing.",
    },
  ],

  blockersTitle: "Known adoption blockers",

  blockers: [
    {
      title: "Capital in an unproven machine",
      body:
        "Growers have put money into equipment that did not do what it said. That memory is doing work in every conversation, and it sets the standard of proof a new machine has to meet.",
    },
    {
      title: "Who fixes it when it stops mid-row",
      body:
        "A machine that stops in season, in the aisle, during picking, is worse than no machine. Service and recovery are part of the product, and growers raise them before they raise capability.",
    },
    {
      title: "Hygiene and what moves between houses",
      body:
        "Anything travelling from one house to another is a crop-safety question before it is a logistics one. A platform that swaps tools has to answer this about the tools as well as the chassis.",
    },
    {
      title: "Having seen demonstrations before",
      body:
        "Growers have watched machines work under conditions that do not resemble their house. Scepticism is earned, and the only real answer to it is a machine running in their aisle, which does not exist yet.",
    },
  ],
};
