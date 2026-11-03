import type { ModulesContent } from "./types";

/*
 * The platform and where each part of it is. The stage labels are honest
 * on purpose: nothing has run in a working greenhouse yet. Update a stage
 * here when it moves; the page reads it from this list.
 */
export const modules: ModulesContent = {
  id: "modules",
  eyebrow: "The platform",
  heading: "A module for every job in the crop.",
  lead: "A grower deals with one platform for the crew's work, instead of a separate machine for each job.",

  stages: {
    sim: "In simulation",
    design: "Designed",
    idea: "Not started",
  },

  items: [
    {
      name: "BLUSH",
      job: "Harvests",
      body: "Finds a truss that's ready by the grower's own rule, cuts the stalk flush with a blade at the fingertips, and holds the truss on its way to the crate.",
      stage: "sim",
    },
    {
      name: "SHEAR",
      job: "Deleafs",
      body: "Cuts the old leaves below the ripening truss, flush at the stem, on a route planned around the fruit. Deleafing can run at night or over the weekend.",
      stage: "sim",
    },
    {
      name: "HOIST",
      job: "Lowers and rehangs",
      body: "Moves the hooks along the crop wire so the plant keeps growing at working height. The job has to be done across the greenhouse every week, before the weekend.",
      stage: "design",
    },
    {
      name: "RAVEN",
      job: "Scouts",
      body: "Watches for pests and disease from the robots already in the rows, so the grower gets the sensing without another device to maintain.",
      stage: "idea",
    },
    {
      name: "SPINE",
      job: "The base",
      body: "Rides the heating pipes between the rows and carries the module for the job. It comes last: until then, the modules work from a fixed stand.",
      stage: "idea",
    },
  ],
};
