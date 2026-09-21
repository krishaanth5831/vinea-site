import type { TasksContent } from "./types";

export const tasks: TasksContent = {
  meta: {
    id: "what-the-greenhouse-needs",
    eyebrow: "What the greenhouse actually needs",
    heading: "A map of the jobs, and what makes each one resist a machine.",
  },

  lead:
    "These are the candidate tasks under evaluation. This is a map of the territory, not a product spec. Each one is here because growers raised it, and each one carries the reason it is harder than it looks.",

  tasks: [
    {
      name: "Harvesting",
      summary: "Cutting ripe trusses and getting them into a crate without marking the fruit.",
      pain:
        "This is the job growers name first. It happens on the crop's schedule, not on the schedule of whoever is available that morning, and a truss left too long is a truss sold for less.",
      hard:
        "Ripeness is a judgement made per truss, and neighbouring trusses on the same plant disagree. The cut has to take the stem cleanly — pull instead of cut and the fruit comes off the truss. The wire, the vine and the leaf are all in the way of the approach, and the truss is rarely hanging where a model expects it.",
      status: "under evaluation",
    },
    {
      name: "Deleafing and pruning",
      summary: "Taking leaf off the lower plant so light and air reach the fruit.",
      pain:
        "Repetitive, physically low-skill, and it competes for exactly the same people at exactly the same moment as harvesting. It is the job that slips when the house is busy, and it slipping shows up later in the crop.",
      hard:
        "You are cutting leaf that sits against stem, and the tool has to tell the difference every time. How much leaf should come off is not fixed — it moves with light, crop stage and what the grower is steering the plant toward. Damage from a bad cut does not announce itself until much later.",
      status: "under evaluation",
    },
    {
      name: "Scouting",
      summary: "Finding pest and disease early, and knowing where in the house you found it.",
      pain:
        "Problems get found by whoever happens to walk past, which means they get found late. Growers describe this as the job they would most like to stop relying on luck for.",
      hard:
        "The early signs are faint and look like several other things. Coverage matters more than being right about any single plant, so a machine that inspects beautifully but slowly solves nothing. A finding is only worth anything if it is tied to a precise place in the house, which makes this a navigation problem as much as a vision one.",
      status: "under evaluation",
    },
    {
      name: "Crop work",
      summary: "Lowering, twisting and clipping the vine as the plant grows past the wire.",
      pain:
        "Awkward, physical, done overhead, and it has to happen on time. Growers talk about this one in terms of their people's shoulders and backs.",
      hard:
        "The plant is flexible and every one of them hangs differently, so there is no repeatable pose to plan against. The forces involved are small, but the failure is not: snap a head and that plant is done producing.",
      status: "under evaluation",
    },
    {
      name: "Transport",
      summary: "Moving full crates out of the aisle and empties back in.",
      pain:
        "People who should be picking spend part of their day pushing. It is the clearest case of skilled time going into unskilled movement.",
      hard:
        "Technically the most tractable job on this list, and that is the problem. It is already crowded with suppliers, and on its own it rarely justifies bringing a new machine into the house. It earns its place as something a platform also does, not as the reason to build one.",
      status: "under evaluation",
    },
  ],

  discardedTitle: "Ruled out, and why",

  discarded: [
    {
      claim: "A harvest-only robot",
      because:
        "It works when there is fruit to cut and stands still the rest of the time. The comparison a grower makes is not against an idle machine — it is against a person who moves to the next job when this one is done.",
    },
    {
      claim: "Anything that needs the house rebuilt around it",
      because:
        "New rails, new gantries or a changed row layout turn a machine decision into a building decision. Growers stop the conversation there, and they are right to.",
    },
    {
      claim: "Full autonomy, end to end, as the first step",
      because:
        "Every task above contains a judgement that is still being characterised. Promising the whole house before one tool works in one aisle is the failure mode this method exists to avoid.",
    },
    {
      claim: "Building to a task no grower raised",
      because:
        "Several jobs look automatable from outside the house and never came up inside it. Absence from the conversations is information, and it is treated as such.",
    },
  ],
};
