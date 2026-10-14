import type { DeckContent } from "./types";

const BOOK_A_CALL =
  "mailto:krishaanth@getvinea.nl?subject=Talking%20about%20glasshouse%20work" as const;

const LINKEDIN = "https://www.linkedin.com/in/krishaanth-ramaraj-230046282" as const;

/**
 * The pitch deck, from "Vinea Pitch Deck v6 Send" in the vault, trimmed for a
 * public page that growers read as well as investors:
 *
 * - the data-licensing paragraph is cut from the business model (investors
 *   only, by the narrative's own rule);
 * - the line about eternal.ag's founder's earlier company is cut;
 * - the thank-you slide carries the getvinea.nl address, not a gmail one;
 * - the WUR shares say what they are shares *of*: the six main crop jobs,
 *   not every hour on the farm.
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
      corner: { label: "Source: Wageningen UR, 2005–2010", href: "https://edepot.wur.nl/176513" },
      title: ["Still done", "by hand"],
      body: [
        "Greenhouses still run on hands. A hectare of greenhouse tomatoes takes about 9,450 hours of work a year. Of the six main crop jobs, harvesting takes 29% of the hours, removing old leaves 26%, and de-shooting and twisting the plants another 21%. Scouting for pests comes on top. Crews do all of it, all season, and every one of those hours is paid.",
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
      id: "the-cost",
      kicker: "The cost",
      corner: {
        label: "Source: Agrimatie (WUR), 2021",
        href: "https://www.groentennieuws.nl/article/9385193/nederlandse-glasgroentetelers-zien-kosten-met-21-stijgen-in-2021/",
      },
      title: ["A third of", "the bill"],
      body: [
        "In 2021 the average Dutch greenhouse vegetable farm paid almost €975,000 in wages, out of almost €2.9 million in total costs. One Westland tomato grower told us that harvesting alone costs €5 per m² every year. Since then, costs have risen faster than what growers earn.",
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
        "In 2025, 20% of Dutch greenhouse vegetable farms made a loss, the first time in more than ten years. Across Dutch greenhouse horticulture, revenue rose 8% while costs and depreciation rose 13%. A grower can't fix that by hiring fewer people, because the crop still needs the same hours.",
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
        "About 67,000 people work in Dutch greenhouses, and an estimated 80% of them come from abroad, increasingly from Romania and Bulgaria rather than Poland. The area one worker looks after has barely changed since 2000, so a bigger greenhouse still means more people, hired from the same agencies every grower is competing for.",
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
      id: "the-competition",
      kicker: "The competition",
      corner: { label: "Sources: press releases" },
      title: ["Years in.", "Millions in."],
      body: ["Robots were meant to fix this, and the money has been there for years."],
      figure: {
        kind: "table",
        columns: ["Company", "Since", "Raised"],
        rows: [
          ["MetoMotion (GRoW)", "2016", "A $5M round led by Ridder in 2021"],
          ["SAIA Agrobotics", "2017", "Over €20M. The greenhouse is rebuilt around a fixed robot"],
          ["Four Growers", "2018", "$15M, with Y Combinator among the backers"],
          ["eternal.ag", "2025", "€8M in 2026"],
          ["Tortuga AgTech", "—", "$50M over eight years, then its assets went to Oishii in 2025"],
        ],
      },
    },
    {
      id: "adoption",
      kicker: "Adoption",
      corner: {
        label: "Sources: AgriDirect, WUR, trade press",
        href: "https://www.proeftuinprecisielandbouw.nl/nppl_r-jaarevent-tuinbouw-4-werkomstandigheden-beinvloeden-prestatie-oogstrobots/",
      },
      title: ["Still in", "trials"],
      body: [
        "In a 2019 survey of over 1,400 Dutch growers, 11% of glasshouse growers used a robot of any kind, mostly for spraying, and 2.6% planned to invest in robotics. In a 2025 WUR test, GRoW picked half the trusses staff marked ripe; 40% of ripe trusses failed its picking conditions, and in 1.5 hours it stopped twice and needed a person six times.",
        "eternal.ag has run one robot at Van Noord Growers since September 2025 and planned three for summer 2026. Four Growers reports up to 50% labour savings at Westburg. Each robot does one job, and the crop has to fit the machine.",
      ],
    },
    {
      id: "the-insight",
      kicker: "The insight",
      title: ["Skill lives", "in the crew"],
      body: [
        "What these robots get wrong are judgement calls: which truss is ready, which leaf comes off, where the whitefly starts. Crews make those calls all day, from experience built up on the job. That judgement lives in the crew, and the crew is the part growers can no longer hire. When a crew leaves at the end of the season, its know-how leaves with it.",
      ],
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
        "That judgement can now be taught. Robot foundation models learn a new task from recorded demonstrations, and Physical Intelligence alone raised $400 million in 2024 to build them. What these models lack is data from inside working greenhouses, and nobody records it there, because the people with the skill are out on the crop rows.",
      ],
    },
    {
      id: "how-it-works",
      kicker: "How it works",
      title: ["Crews teach", "the robots"],
      body: [
        "Vinea records crews on their normal shifts, and the work itself doesn't change. For picking, deleafing and rehanging, the crew uses a handheld tool with the same soft fin-ray jaws as the robot and a camera looking along them, so every grip and cut is recorded from the robot's point of view.",
        "For scouting, eye-tracking glasses and a microphone record where an experienced scout looks and what they say they see, so the recording labels itself. Each job's recordings train a robot skill on top of an open robot foundation model.",
      ],
    },
    {
      id: "the-platform",
      kicker: "The platform",
      title: ["Modules for", "every job"],
      body: [
        "Every skill runs on SPINE, a base that rides the heating pipes already laid between the crop rows. On top sits the module for the job: BLUSH harvests, SHEAR deleafs, HOIST lowers and rehangs, and RAVEN scouts. A new job means recording the crew doing it and shipping a module. The greenhouse stays as it is, and the grower deals with one platform for the whole crew's work.",
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
        "BLUSH is the first module. A camera above the row finds a ripe tomato within reach and marks it. The picking model, trained on crew recordings, steers the arm to that fruit. Just before the jaws close, a second camera on the gripper checks the colour around the stem and calls off the pick if the fruit isn't ready. The soft fin-ray jaws wrap around the tomato instead of squeezing it.",
      ],
      figure: { kind: "steps", steps: ["Find", "Steer", "Check", "Wrap"] },
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
      id: "the-expansion-plan",
      kicker: "The expansion plan",
      corner: {
        label: "Sources: CBS, RaboResearch, 2025",
        href: "https://topsectortu.nl/wp-content/uploads/2025/03/RaboResearch_Global-greenhouse-update_2025.pdf",
      },
      title: ["Dutch glass", "first"],
      body: [
        "We start where the crop, the pipe rails and the crews are the same, and widen from there. Dutch tomatoes cover 1,767 hectares, over half of it farmed by the ten largest growers. Dutch peppers and cucumbers add another 2,213 hectares on the same pipe rails.",
        "Europe has 33,637 hectares of high-tech greenhouses, about half of the world's 70,000. Dutch builders put up glasshouses everywhere, and SPINE follows the ones with pipe rails.",
      ],
      figure: {
        kind: "steps",
        steps: ["Dutch tomatoes", "Dutch peppers and cucumbers", "Europe", "The world"],
      },
    },
    {
      id: "the-market",
      kicker: "The market",
      corner: {
        label: "Sources: RaboResearch, CBS",
        href: "https://topsectortu.nl/wp-content/uploads/2025/03/RaboResearch_Global-greenhouse-update_2025.pdf",
      },
      title: ["World vs", "Netherlands"],
      body: [
        "Harvesting alone costs a Westland grower €5 per m², or €50,000 per hectare a year. The world has 3.72 million hectares of greenhouses of every kind. Deleafing, lowering and scouting come on top: in tomatoes, harvesting is under a third of the hours.",
      ],
      figure: {
        kind: "table",
        columns: ["Market", "Area", "Harvesting, per year"],
        rows: [
          ["TAM · World, high-tech glass", "About 70,000 ha", "€3.5 billion at Dutch cost"],
          ["SAM · Dutch tomatoes, peppers, cucumbers", "3,980 ha", "€199 million"],
          ["SOM · The ten largest Dutch tomato growers", "More than 880 ha", "Over €44 million"],
        ],
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
