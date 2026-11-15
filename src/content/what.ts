import type { WhatContent } from "./types";

/*
 * What the robot is, said next to a picture of it. The picture is a concept
 * render, and the page says so on the picture itself: nothing here has been
 * built at full size yet.
 */
export const what: WhatContent = {
  id: "what",
  eyebrow: "What it is",
  heading: "One base on your pipes. A module for each job.",
  lead: "The base rides the heating pipes between your rows. On it sits the module for the job: an arm and the tool that job needs. The greenhouse stays as it is.",
  badge: "Concept render",

  scan: { ready: "Ready", wait: "Not yet" },

  beats: [
    {
      key: "look",
      name: "It looks first",
      body: "Cameras on the mast read the row. It picks a truss that's ready by your own rule and leaves the rest on the plant.",
    },
    {
      key: "reach",
      name: "Then it goes in",
      body: "The arm reaches past the fruit to the stalk, and cuts it with a blade at the fingertips.",
    },
    {
      key: "carry",
      name: "It keeps hold",
      body: "The truss is held by its stalk all the way to the crate. Nothing squeezes the fruit.",
    },
    {
      key: "swap1",
      name: "The module changes",
      body: "When the job changes, the harvest module comes off the base and another goes on.",
    },
    {
      key: "deleaf",
      name: "Same base, deleafing",
      body: "SHEAR cuts the old leaves below the ripening truss, flush at the stem, and takes them away in its bin.",
    },
    {
      key: "swap2",
      name: "And again",
      body: "The base stays on the pipes. What it carries changes with the job.",
    },
    {
      key: "lower",
      name: "Same base, lowering",
      body: "HOIST is a different machine: a mast that carries a head up to the crop wire the plants hang from.",
    },
    {
      key: "wire",
      name: "At the crop wire",
      body: "The head comes up under the wire and rests its wheels on it, beside the winding hook a plant hangs from.",
    },
    {
      key: "flip",
      name: "It lets the plant down",
      body: "It turns the hook about the wire, which lets out twine a loop at a time, and holds the plant while it comes down.",
    },
  ],

  parts: [
    {
      key: "base",
      name: "The base",
      body: "Rides the heating pipes already laid between your rows. Nothing in the greenhouse is rebuilt.",
    },
    {
      key: "module",
      name: "The module",
      body: "An arm and a tool built for one job. It works the crop from the path, at the height the work is.",
    },
    {
      key: "swap",
      name: "The swap",
      body: "When the job changes, the base takes on a different module.",
    },
  ],

  modulesLabel: "Same base, different job",
  modules: [
    {
      key: "harvest",
      label: "Harvest",
      name: "BLUSH",
      line: "Cuts the truss stalk with a blade at the fingertips and holds the truss on its way to the crate.",
    },
    {
      key: "deleaf",
      label: "Deleaf",
      name: "SHEAR",
      line: "Cuts the old leaves below the ripening truss, flush at the stem.",
    },
    {
      key: "lower",
      label: "Lower",
      name: "HOIST",
      line: "A mast that reaches the crop wire and lets each plant down, so it keeps growing at working height.",
    },
  ],
};
