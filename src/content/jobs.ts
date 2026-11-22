import type { JobsContent } from "./types";

/*
 * The modules and where each one is. The stage labels are honest on
 * purpose: nothing has run in a working greenhouse yet. Update a stage here
 * when it moves, and the module's lane (`reached`) in roadmap.ts with it:
 * the two are kept by hand, not read from one list.
 */
export const jobs: JobsContent = {
  id: "jobs",
  eyebrow: "The jobs",
  heading: "A module for every job in the crop.",
  lead: "You deal with one system for your crew's work, instead of a separate machine for each job.",

  stages: {
    sim: "In simulation",
    design: "Designed",
    soon: "Coming",
  },

  items: [
    {
      key: "harvest",
      name: "BLUSH",
      job: "Harvests",
      body: "Finds a truss that's ready by your own rule, cuts the stalk flush with a blade at the fingertips, and holds the truss on its way to the crate.",
      stage: "sim",
    },
    {
      key: "deleaf",
      name: "SHEAR",
      job: "Deleafs",
      body: "Cuts the old leaves below the ripening truss, flush at the stem, on a route planned around the fruit. Deleafing can run at night or over the weekend.",
      stage: "sim",
    },
    {
      key: "lower",
      name: "HOIST",
      job: "Lowers and rehangs",
      body: "Moves the hooks along the crop wire so the plant keeps growing at working height. The job has to be done across the greenhouse every week.",
      stage: "design",
    },
    {
      key: "scout",
      name: "RAVEN",
      job: "Scouts",
      body: "Watches for pests and disease from the robots already in the rows, so you get the sensing without another device to maintain.",
      stage: "soon",
    },
    {
      key: "base",
      name: "SPINE",
      job: "The base",
      body: "Rides the heating pipes and carries the module for the job. It comes last: until then, the modules work from a fixed stand.",
      stage: "design",
    },
  ],
};
