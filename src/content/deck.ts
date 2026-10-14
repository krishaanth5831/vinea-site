import type { DeckContent } from "./types";

const BOOK_A_CALL =
  "mailto:krishaanth@getvinea.nl?subject=Talking%20about%20glasshouse%20work" as const;

const LINKEDIN = "https://www.linkedin.com/in/krishaanth-ramaraj-230046282" as const;

/**
 * The pitch deck, from "Vinea Pitch Deck v5 Send" in the vault, trimmed for a
 * public page that growers read as well as investors:
 *
 * - the data-licensing paragraph is cut from the business model (investors
 *   only, by the narrative's own rule);
 * - the line about eternal.ag's founder's earlier company is cut;
 * - the thank-you slide carries the getvinea.nl address, not a gmail one;
 * - "Where the hours go" says what the WUR shares are shares *of*: the six
 *   main crop jobs, not every hour on the farm.
 *
 * Figures are allowed here, and only here and on /roi. Each slide that has
 * one names its source. See DECISIONS.md, "The deck and the calculator".
 */
export const deck: DeckContent = {
  meta: {
    title: "Vinea — the deck",
    description:
      "Vinea turns the way greenhouse crews work into robot skills, and runs them on one platform inside the greenhouses growers already have. The pitch, slide by slide, with sources.",
  },

  intro: {
    eyebrow: "The deck",
    heading: "Vinea, slide by slide.",
    lead: "What Vinea builds, why growers need it now, and how they would pay for it. Every figure names its source.",
    ctas: [
      { label: "Start reading", href: "#cover", tone: "primary" },
      {
        label: "Download the PDF",
        href: "/vinea-deck.pdf",
        tone: "secondary",
        download: "Vinea deck.pdf",
      },
    ],
    hint: "On a keyboard, the arrow keys move between slides.",
  },

  pdf: { href: "/vinea-deck.pdf", filename: "Vinea deck.pdf" },

  slides: [
    {
      id: "cover",
      kicker: "Greenhouse robotics",
      corner: { label: "Krishaanth Ramaraj · Founder" },
      title: ["Vinea"],
      body: [
        "Vinea turns the way greenhouse crews work into robot skills, and runs them on one platform inside the greenhouses growers already have.",
      ],
      layout: "cover",
    },
    {
      id: "the-problem",
      kicker: "The problem",
      title: ["Still done", "by hand"],
      body: [
        "Greenhouses still run on hands. Harvesting, deleafing, lowering and rehanging the plants and scouting for pests are all done manually, all season. The crews come through agencies, and every season they are harder to find and cost more, on margins that are already thin.",
      ],
    },
    {
      id: "the-cost",
      kicker: "The cost",
      corner: {
        label: "Source: Agrimatie (WUR), 2021",
        href: "https://www.groentennieuws.nl/article/9385193/nederlandse-glasgroentetelers-zien-kosten-met-21-stijgen-in-2021/",
      },
      title: ["A third of", "the bill"],
      body: [
        "In 2021 the average Dutch greenhouse vegetable farm paid almost €975,000 in wages, out of almost €2.9 million in total costs. That is more than it spent on energy. One Westland tomato grower told us that harvesting alone costs €5 per m² every year.",
      ],
      figure: {
        kind: "cells",
        total: 30,
        lit: 10,
        columns: 10,
        caption: "Wages against total costs, average Dutch greenhouse vegetable farm, 2021",
      },
    },
    {
      id: "the-margin",
      kicker: "The margin",
      corner: {
        label: "Source: Agrimatie (WUR), 2025",
        href: "https://www.groentennieuws.nl/article/9794873/inkomen-glastuinbouw-gedaald-door-stijging-kosten/",
      },
      title: ["One in five", "at a loss"],
      body: [
        "In 2025, 20% of Dutch greenhouse vegetable farms made a loss, the first time in more than ten years. Revenue rose 8%, while costs and depreciation rose 13%.",
      ],
      figure: {
        kind: "cells",
        total: 5,
        lit: 1,
        columns: 5,
        caption: "Farms with negative income, 2025",
      },
    },
    {
      id: "the-workforce",
      kicker: "The workforce",
      corner: {
        label: "Source: RaboResearch, 2025",
        href: "https://topsectortu.nl/wp-content/uploads/2025/03/RaboResearch_Global-greenhouse-update_2025.pdf",
      },
      title: ["Four in five", "from abroad"],
      body: [
        "About 67,000 people work in Dutch greenhouses, and an estimated 80% of them come from abroad, now more often from Romania and Bulgaria than from Poland. The number of workers per hectare has barely moved since 2000, so growing a greenhouse still means hiring more people.",
      ],
      figure: {
        kind: "cells",
        total: 5,
        lit: 4,
        columns: 5,
        caption: "Greenhouse workers from abroad, estimated",
      },
    },
    {
      id: "the-work",
      kicker: "The work",
      corner: { label: "Source: Wageningen UR", href: "https://edepot.wur.nl/176513" },
      title: ["Where the", "hours go"],
      body: [
        "A hectare of greenhouse tomatoes takes about 9,450 hours of work a year. Of the six main crop jobs, harvesting takes 29% of the hours, removing old leaves 26%, and de-shooting and twisting the plants another 21%. BLUSH and SHEAR are built for the first two.",
      ],
      figure: {
        kind: "split",
        parts: [
          { label: "Harvesting", share: 0.29, tag: "BLUSH" },
          { label: "Removing old leaves", share: 0.26, tag: "SHEAR" },
          { label: "De-shooting and twisting", share: 0.21 },
          { label: "Clipping, lowering, truss pruning", share: 0.24 },
        ],
        caption: "Hours across the six main crop jobs, tomato",
      },
    },
    {
      id: "the-insight",
      kicker: "The insight",
      title: ["Skill lives", "in the crew"],
      body: [
        "This work is skilled. Knowing which tomato is ready, which leaf comes off and where the whitefly starts is judgement people build up on the job. That judgement lives in the crew, and the crew is the part growers can no longer hire. When a crew leaves, its know-how leaves with it.",
      ],
    },
    {
      id: "how-it-works",
      kicker: "How it works",
      title: ["Crews teach", "the robots"],
      body: [
        "Crews wear capture gear on their normal shifts. For hands-on jobs they hold a tool with the same jaws as our robot, plus a camera, so what they do maps straight onto what the robot can do. For scouting, we track where an experienced scout looks while they say what they see. Each job's recordings train a robot skill on top of an open robot foundation model.",
      ],
    },
    {
      id: "the-capture-kit",
      kicker: "The product",
      title: ["The capture", "kit"],
      body: [
        "For picking, deleafing and rehanging, the crew uses a handheld tool with the same soft fin-ray jaws as the robot and a camera looking along them. Every grip, cut and release is recorded from the robot's point of view, so it trains a skill without translation. For scouting, eye-tracking glasses and a microphone record where an experienced scout looks and what they say they see, so the recording labels itself.",
      ],
    },
    {
      id: "the-platform",
      kicker: "The platform",
      title: ["Modules for", "every job"],
      body: [
        "Each skill runs on SPINE, a base that rides the heating pipes already in the greenhouse. On top sits the module for the job: BLUSH harvests, SHEAR deleafs, HOIST lowers and rehangs, and RAVEN scouts. A new job means recording the crew doing it and shipping a module, and the greenhouse stays as it is.",
      ],
      figure: {
        kind: "modules",
        base: "SPINE",
        modules: [
          { name: "BLUSH", job: "Harvests" },
          { name: "SHEAR", job: "Deleafs" },
          { name: "HOIST", job: "Lowers and rehangs" },
          { name: "RAVEN", job: "Scouts" },
        ],
      },
    },
    {
      id: "how-blush-picks",
      kicker: "The product",
      title: ["How BLUSH", "picks"],
      body: [
        "A camera above the row finds a ripe tomato within reach and marks it. A robot foundation model, trained on crew recordings, steers the arm to that fruit. Just before the jaws close, a second camera on the gripper checks the colour around the stem and calls off the pick if the fruit isn't ready. The soft fin-ray jaws wrap around the tomato instead of squeezing it.",
      ],
      figure: { kind: "steps", steps: ["Find", "Steer", "Check", "Wrap"] },
    },
    {
      id: "why-now",
      kicker: "Why now",
      corner: {
        label: "Source: AI Business, Nov 2024",
        href: "https://aibusiness.com/automation/startup-looks-to-develop-physical-artificial-intelligence-raises-400m",
      },
      title: ["Learning", "from people"],
      body: [
        "Robot foundation models can now learn a new task from recorded demonstrations, and Physical Intelligence alone raised $400 million in 2024 to build them. What these models lack is data from inside working greenhouses, and nobody is collecting it there. Vinea collects it from the crews who already do the work.",
      ],
    },
    {
      id: "the-competition",
      kicker: "The competition",
      corner: { label: "Sources: press releases" },
      title: ["Years in.", "Millions in."],
      body: [],
      figure: {
        kind: "table",
        columns: ["Company", "Since", "Raised"],
        rows: [
          ["MetoMotion (GRoW)", "2016", "A $5M round led by Ridder in 2021"],
          ["SAIA Agrobotics", "2017", "Over €20M. Needs a rebuilt greenhouse"],
          ["Four Growers", "2018", "$15M, with Y Combinator among the backers"],
          ["eternal.ag", "2025", "€8M in 2026"],
          ["Tortuga AgTech", "—", "$50M over eight years, then its assets went to Oishii in 2025"],
        ],
      },
    },
    {
      id: "adoption",
      kicker: "Adoption",
      corner: { label: "Sources: WUR, trade press" },
      title: ["Still in", "trials"],
      body: [
        "Priva's deleafing robot launched in 2021 with a first production run of 50, for more than 9,000 hectares of Dutch glass. In a WUR test in 2025, GRoW picked half the trusses staff had marked ripe, stopped twice in 90 minutes and needed a hand six times. inaho had five trial places for 2026. A WUR researcher expects five to ten years before robots are the norm.",
      ],
    },
    {
      id: "progress",
      kicker: "Progress",
      title: ["From sim", "to real"],
      body: [
        "I built a simulation where a robot harvests a whole greenhouse. Now it's becoming real: a robot arm learns from demonstrations I record, and a camera model tells ripe from unripe tomatoes live, on real fruit. Next come ripeness checks on the gripper and a test greenhouse where the arm picks cherry tomatoes. Today I teach the arm by hand; at scale, crews teach it as they work.",
      ],
    },
    {
      id: "the-flywheel",
      kicker: "The flywheel",
      title: ["It learns", "as it works"],
      body: [
        "Once deployed, every robot records its own work: each pick, each miss and each time a person steps in, so the whole fleet keeps improving. Each new crop starts from what earlier crops taught it, because picking a pepper has a lot in common with picking a tomato. The more greenhouses Vinea runs in, the less new data each new crop and each new greenhouse needs.",
      ],
    },
    {
      id: "where-it-goes",
      kicker: "Where it goes",
      corner: {
        label: "Source: RaboResearch, 2025",
        href: "https://topsectortu.nl/wp-content/uploads/2025/03/RaboResearch_Global-greenhouse-update_2025.pdf",
      },
      title: ["Every crop", "under glass"],
      body: [
        "The world has about 70,000 hectares of high-tech greenhouses. About half of them are in Europe, and half of that area grows tomatoes. We start with tomatoes in Dutch greenhouses, then add peppers and cucumbers on the same pipe rails. Dutch builders put up glasshouses all over the world, so from there we follow the Dutch greenhouse until any crop under glass can run on SPINE.",
      ],
      figure: {
        kind: "steps",
        steps: ["Tomatoes, Netherlands", "Peppers and cucumbers", "Across Europe", "Any crop under glass"],
      },
    },
    {
      id: "business-model",
      kicker: "Business model",
      title: ["Rent it", "like a crew"],
      body: [
        "Growers rent Vinea the way they would hire a crew: a pilot season, then a monthly fee per robot with service included, always priced below the labour it replaces. Pricing stays provisional until after the pilot.",
      ],
      links: [{ label: "Work out what it saves you", href: "/roi", tone: "secondary" }],
    },
    {
      id: "why-me",
      kicker: "Why me",
      title: ["Krishaanth", "Ramaraj"],
      body: [
        "At Degla AI, a YC-backed drone startup, I built and tuned drones, precision work of the kind Vinea needs. I made the harvest simulation and I'm building the real robot myself, while studying Electrical Engineering at TU/e and bartending on the side. I've interviewed tomato growers on what labour costs them and why they haven't bought a robot yet, and built Vinea around their answers.",
      ],
    },
    {
      id: "lets-talk",
      kicker: "LinkedIn",
      title: ["Let's", "talk"],
      body: ["Connect with me on LinkedIn, or write to me directly."],
      layout: "talk",
      links: [
        { label: "Connect on LinkedIn", href: LINKEDIN, tone: "primary" },
        { label: "Book a call", href: BOOK_A_CALL, tone: "secondary" },
      ],
    },
    {
      id: "thank-you",
      kicker: "Krishaanth Ramaraj · Founder",
      title: ["Thank you"],
      body: [],
      layout: "end",
      links: [
        { label: "Book a call", href: BOOK_A_CALL, tone: "primary" },
        { label: "Run your numbers", href: "/roi", tone: "secondary" },
      ],
    },
  ],

  outro: {
    eyebrow: "Next",
    heading: "What would it save your greenhouse?",
    lead: "Put in your hectares and the jobs you'd hand over, and see the hours and the money, job by job.",
    ctas: [
      { label: "Run your numbers", href: "/roi", tone: "primary" },
      { label: "Book a call", href: BOOK_A_CALL, tone: "secondary" },
    ],
  },
};
