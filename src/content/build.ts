import type { BuildContent } from "./types";
import { BOOK_A_CALL } from "./site";

/*
 * The cofounder page at /build. It is sent to people directly and is not in
 * the nav. It is written in the first person and is candid about the gaps:
 * nothing in a greenhouse, no crew recorded, no grower signed. "How we'd
 * start" promises no pay and no equity terms until those are decided. See
 * DECISIONS.md, "The cofounder page".
 */
export const build: BuildContent = {
  meta: {
    title: "Build Vinea with me",
    description:
      "Vinea is looking for a technical cofounder: someone who builds greenhouse robots that learn from crews, and sells them to growers.",
  },

  intro: {
    eyebrow: "Looking for a cofounder",
    heading: "Build Vinea with me",
    paragraphs: [
      "Hi, I'm Krishaanth. I'm building Vinea: robots that learn greenhouse work from the people who do it, and do that work inside the greenhouses growers already have. Picture a night shift, taught by the day crew.",
      "Dutch tomato growers can't find enough skilled people to harvest and deleaf, and the people who know the work best are leaving. Robot models can now learn a task by watching it done, but nobody has recordings of greenhouse work to learn from. That's the gap Vinea fills.",
      "I'm working on Vinea full-time, on my own so far. I'm looking for a technical cofounder who builds it with me and sells it with me. If that could be you, I'd like us to work on a real problem together first and find out how we work as a pair.",
    ],
  },

  how: {
    heading: "How it works",
    lead: "The crew already knows how to do every job in the greenhouse. Vinea records that know-how and turns it into robot skills.",
    steps: [
      {
        label: "Record",
        body: "Crews wear a small camera on the wrist during normal shifts. They work with their own hands and tools.",
      },
      {
        label: "Learn",
        body: "The recordings become robot demonstrations. A model learns where to reach, where to cut and how to hold.",
      },
      {
        label: "Work",
        body: "The skill runs on the robot, between the same rows, through the night.",
      },
    ],
    badge: "Concept render",
    spine:
      "Each skill becomes a module on SPINE, a base that rides the heating pipes every Dutch glasshouse already has. One base, and a new module for each job:",
    modules: [
      { name: "BLUSH", job: "harvests trusses" },
      { name: "SHEAR", job: "cuts old leaves" },
      { name: "HOIST", job: "lowers and rehangs" },
      { name: "RAVEN", job: "scouts" },
    ],
    flywheel:
      "Every robot also records its own work and the corrections people make. So each new job, and each new crop, starts from what the earlier ones taught it.",
  },

  hard: {
    heading: "The hard part",
    lead: "Building a robot that moves along the rows is the easier half. The hard half is a learned skill good enough that a grower trusts it over a person. These are the problems in the way.",
    items: [
      {
        title: "Learning from people instead of from a script.",
        body: "Today a scripted teacher in simulation makes the demonstrations. The real source is crew video: a human hand doing the job, which has to become the motion of a gripper with a completely different shape.",
      },
      {
        title: "Working on plants it has never seen.",
        body: "My learned harvesting skill does well on the scenes it trained on and falls apart on new ones. Every plant is different: leaves in the way, trusses at odd angles, stems that move when you touch them.",
      },
      {
        title: "Cutting and carrying without damage.",
        body: "Growers sell whole trusses. The robot has to cut the stalk cleanly, then carry the truss to the crate without it turning in the grip or knocking the plant next to it.",
      },
      {
        title: "Beating the person.",
        body: "Growers don't compare a robot with other robots. They compare it with their crew. It has to keep up with a skilled picker and keep going all night with nobody watching.",
      },
      {
        title: "Getting out of simulation.",
        body: "Most of the above works best in simulation today. Real plants, damp air, night light and a crew working in the next row are a different world.",
      },
    ],
  },

  now: {
    heading: "Where it stands",
    items: [
      "A desktop robot arm with a camera model that tells ripe from unripe tomatoes live, on real fruit.",
      "In simulation, the arm harvests whole trusses and cuts old leaves flush at the stem, on routes planned around everything it mustn't touch.",
      "The first learned skills are training on demonstrations from the scripted teacher. They aren't good enough yet.",
      "I meet Dutch tomato growers in person, in their greenhouses. One gave me their crew's speeds to measure a pilot against, and a letter of intent for that pilot is drafted.",
      "No grower has signed yet, no crew has been recorded yet, and nothing has run in a working greenhouse yet.",
    ],
    linksLead: "The code is public:",
  },

  why: {
    heading: "Why Vinea",
    quote: "The skill is in the crew.",
    paragraphs: [
      "I grew up mostly on my grandparents' farm in India, and I always knew I'd work on agriculture. Farm work is hard on the people who do it, and everything depends on having enough skilled hands. Greenhouses are the same story: the work wears bodies out, and growers can't find enough people to do it.",
      "Vinea starts with tomatoes in the Netherlands. Then peppers and cucumbers on the same pipe rails, then glasshouses across Europe and further. The long goal is robots that can learn any job under glass from the people who know it.",
    ],
  },

  who: {
    heading: "Who I'm looking for",
    lead: "A technical cofounder. We both build, and we both sell and talk to growers. There's no split where one of us writes the code and the other does the meetings.",
    items: [
      {
        title: "Strong enough technically to challenge my calls.",
        body: "You tell me an approach is wrong before I spend a week on it. Robot learning, robotics, mechanical or embedded work, ideally more than one.",
      },
      {
        title: "Has worked with industrial customers.",
        body: "You know how farms, factories or plants buy, and what they need to see before they trust a machine.",
      },
      {
        title: "Can sell something that doesn't exist yet.",
        body: "You know how to get a customer to commit to buying it if we're able to build it.",
      },
      {
        title: "Thinks differently from me.",
        body: "You come at the same problem from another angle. When we argue it out, we end up with a view we both believe in, because it has been tested from both sides.",
      },
    ],
  },

  start: {
    heading: "How we'd start",
    lead: "One step at a time, and either of us can stop after any step.",
    steps: [
      {
        when: "First",
        body: "A call, then a short stretch working together on one real problem, probably turning crew video into gripper motion.",
      },
      {
        when: "Then",
        body: "If that works, a longer project together: getting a learned skill onto real plants.",
      },
      {
        when: "If it clicks",
        body: "If we both want it, a real conversation about co-founding Vinea.",
      },
    ],
    after:
      "I'm in the Netherlands. The arm, the plants and the growers are all here, so I'd like us to work in the same room for part of the week.",
  },

  me: {
    heading: "About me",
    paragraphs: [
      "I have an electrical engineering background, and before Vinea I built drones at Degla AI, a YC-backed startup. Now I'm full-time on Vinea, in Antler's residency. Everything so far I did on my own: setting up the bench arm, the simulation, the ripeness model, the first learned skills, and the meetings with growers in their own greenhouses.",
      "What I'm still bad at: turning a grower's interest into a signed commitment, and working on the hardest technical problems with nobody to argue with.",
    ],
  },

  cta: {
    lead: "Message me back, or pick a time on my calendar.",
    button: { label: "Book a call", href: BOOK_A_CALL, tone: "primary" },
  },
};
