import type { HowContent } from "./types";

export const how: HowContent = {
  id: "how",
  eyebrow: "How it works",
  heading: "From a crew's shift to a robot skill.",
  lead: "Crews make judgement calls all day: which truss is ready, which leaf comes off, where the whitefly starts. Those calls are what robots get wrong, so Vinea learns them from the crews.",

  steps: [
    {
      label: "Capture",
      title: "Crews record their normal shifts.",
      body: "For harvesting and deleafing, the crew works with a handheld tool shaped like the robot's gripper, with a camera looking along it, so every cut is recorded from the robot's point of view. For scouting, glasses and a microphone record where an experienced scout looks and what they say they see.",
    },
    {
      label: "Train",
      title: "Each job becomes a skill.",
      body: "The recordings teach a robot model the job, built on top of an open robot foundation model. Until crews record, I generate the demonstrations in simulation.",
    },
    {
      label: "Run",
      title: "One base, a module per job.",
      body: "Every skill runs on SPINE, a base that rides the heating pipes already laid between the rows. The module on top does the job. The greenhouse stays as it is.",
    },
    {
      label: "Learn",
      title: "It gets better as it works.",
      body: "Every robot records its own work, including each miss and each time a person steps in. That goes back into training, and each new crop starts from what the earlier ones taught it.",
    },
  ],
};
