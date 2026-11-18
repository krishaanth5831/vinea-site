import type { DeckContent } from "./types";
import { BOOK_A_CALL } from "./site";

const LINKEDIN = "https://www.linkedin.com/in/krishaanth-ramaraj-230046282" as const;

/**
 * The pitch deck, from "Vinea Pitch Deck v9 Send" in the vault (13 slides,
 * 2026-11-18), trimmed and corrected for a public page that growers read as
 * well as investors:
 *
 * - the data-licensing paragraph is cut from the business model (investors
 *   only, by the narrative's own rule);
 * - the pilot line ("a grower has seen the full-system demo") is cut, under
 *   the site's rule that traction is only ever stated as a denial;
 * - "on top of an open robot foundation model" stays out of the text, as it
 *   was taken out on 2026-11-14: today's training is a smaller model taught
 *   by a scripted teacher in simulation. The explainer clips still carry
 *   that label, as the concept they illustrate;
 * - the WUR shares say what they are shares *of*: the six main crop jobs;
 * - Polybot stays "backed by SPRIND", and the contact links use site.ts.
 *
 * The clips and stills are the deck's own (see `public/deck/`), and each one
 * says what it is. The simulation footage is here because the owner asked
 * for the deck's clips on the site; the home page still has none. See
 * DECISIONS.md, "The deck moves to v9 Send".
 *
 * Figures are allowed here, and only here and on /roi. Each slide that has
 * one names its source.
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
    lead: "What Vinea builds, how crews teach the robots, and how growers would pay for it. Every figure names its source, and every picture says what it is.",
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
        "Robots that learn greenhouse work from the people who do it.",
        "Vinea turns the way greenhouse crews work into robot skills, and runs them on one platform inside the greenhouses growers already have.",
      ],
      layout: "cover",
      figure: {
        kind: "media",
        items: [
          {
            name: "cover",
            type: "video",
            ratio: "16/9",
            alt: "A picker cuts a truss of tomatoes along a path, and a robot arm on a rail base cuts the same truss along the same path.",
            caption: "Concept illustration",
          },
        ],
      },
    },
    {
      id: "the-problem",
      kicker: "The problem",
      corner: {
        label: "Sources: Wageningen UR, 2005–2010",
        href: "https://edepot.wur.nl/176513",
        more: [
          {
            label: "Agrimatie, 2021",
            href: "https://www.groentennieuws.nl/article/9385193/nederlandse-glasgroentetelers-zien-kosten-met-21-stijgen-in-2021/",
          },
          {
            label: "Agrimatie, 2025",
            href: "https://www.groentennieuws.nl/article/9794873/inkomen-glastuinbouw-gedaald-door-stijging-kosten/",
          },
          {
            label: "RaboResearch, 2025",
            href: "https://topsectortu.nl/wp-content/uploads/2025/03/RaboResearch_Global-greenhouse-update_2025.pdf",
          },
        ],
      },
      title: ["Still done", "by hand"],
      body: [
        "A hectare of greenhouse tomatoes takes about 9,450 hours of work a year. Of the six main crop jobs, harvesting takes 29% of the hours, removing old leaves 26% and de-shooting and twisting the plants 21%, with scouting on top. Crews do all of it by hand, hired through the same agencies every grower competes for, and the area one worker looks after has barely changed since 2000.",
      ],
      figure: {
        kind: "stats",
        stats: [
          {
            value: "A third",
            text: "of the average Dutch greenhouse vegetable farm's costs in 2021 were wages: almost €975,000 of almost €2.9 million.",
          },
          {
            value: "1 in 5",
            text: "Dutch greenhouse vegetable farms made a loss in 2025, the first time in more than ten years.",
          },
          {
            value: "80%",
            text: "of the 67,000 people working in Dutch greenhouses come from abroad, by RaboResearch's estimate.",
          },
        ],
      },
    },
    {
      id: "the-competition",
      kicker: "The competition",
      corner: {
        label: "Sources: press releases",
        more: [
          {
            label: "AgriDirect, WUR",
            href: "https://www.proeftuinprecisielandbouw.nl/nppl_r-jaarevent-tuinbouw-4-werkomstandigheden-beinvloeden-prestatie-oogstrobots/",
          },
        ],
      },
      title: ["Years in.", "Millions in."],
      body: [
        "Most of these robots are still in trials. In 2019, 11% of Dutch glasshouse growers used a robot of any kind; in a 2025 WUR test, GRoW picked half the trusses staff marked ripe and needed a person six times in 1.5 hours. Most still do one job.",
      ],
      figure: {
        kind: "table",
        columns: ["Company", "Since", "Raised"],
        rows: [
          ["MetoMotion (GRoW)", "2016", "A $5M round led by Ridder in 2021"],
          ["SAIA Agrobotics", "2017", "Over €20M. The greenhouse is rebuilt around a fixed robot"],
          ["Four Growers", "2018", "$15M, with Y Combinator among the backers"],
          ["Priva Kompano", "—", "Deleafing. Already sold to growers, who co-funded it"],
          ["eternal.ag", "2025", "€8M in 2026, with a platform planned"],
          ["Polybot", "2025", "Backed by SPRIND. Learns truss harvesting from human demos"],
          ["Tortuga AgTech", "—", "$50M over eight years, then its assets went to Oishii in 2025"],
        ],
      },
    },
    {
      id: "the-insight",
      kicker: "The insight",
      corner: {
        label: "Source: AI Business, Nov 2024",
        href: "https://aibusiness.com/automation/startup-looks-to-develop-physical-artificial-intelligence-raises-400m",
      },
      title: ["Skill lives", "in the crew"],
      body: [
        "What these robots get wrong are judgement calls: which truss is ready, which leaf comes off, where the whitefly starts. Crews make those calls all day, and the crew is the part growers can no longer hire.",
        "Robot foundation models now learn new tasks from recorded demonstrations, and Physical Intelligence raised $400 million in 2024 to build them. What they lack is data from inside working greenhouses.",
      ],
      figure: {
        kind: "media",
        items: [
          {
            name: "insight",
            type: "image",
            ratio: "8/9",
            alt: "A picker in a tomato row, with three calls ringed: which truss is ready, which leaf comes off, where the whitefly starts.",
            caption: "Illustration",
          },
        ],
      },
    },
    {
      id: "record",
      kicker: "How it works · 1 of 3",
      title: ["Crews record", "their work"],
      body: [
        "Pickers wear small cameras on both wrists during normal shifts and work with their own hands and snips. Every cut is recorded twice: what the camera sees, and how the hand moves.",
      ],
      figure: {
        kind: "media",
        items: [
          {
            name: "record",
            type: "video",
            ratio: "16/9",
            alt: "A picker with a camera on the wrist cuts a ripe truss; the wrist camera's view and the hand's path are shown beside them.",
            caption: "Concept illustration",
          },
        ],
      },
    },
    {
      id: "train",
      kicker: "How it works · 2 of 3",
      title: ["Every cut is", "training data"],
      body: [
        "Software turns each hand movement into the motion of a robot gripper: the snips closing become the jaws closing. All the recorded cuts train one harvesting skill.",
      ],
      figure: {
        kind: "media",
        items: [
          {
            name: "train",
            type: "video",
            ratio: "16/9",
            alt: "The picker's hand path becomes a gripper path, and the recorded cuts stack up into one harvesting skill.",
            caption: "Concept illustration",
          },
        ],
      },
    },
    {
      id: "deploy",
      kicker: "How it works · 3 of 3",
      title: ["The robot does", "the same job"],
      body: [
        "The skill runs on a module that rides the heating pipes already in the greenhouse and repeats the crew's motion on the same crop. Every robot records its own work too, so the skill keeps improving.",
      ],
      figure: {
        kind: "media",
        items: [
          {
            name: "deploy",
            type: "video",
            ratio: "16/9",
            alt: "A robot arm on a rail base follows the same path, cuts the same truss into the crate, and its run flows back into training.",
            caption: "Concept illustration",
          },
        ],
      },
    },
    {
      id: "tested-in-simulation",
      kicker: "Progress · BLUSH",
      title: ["Tested in", "simulation"],
      body: [
        "BLUSH, the first module, cuts whole trusses the way crews do. A camera on the mast finds a truss whose tip fruit has coloured, the picking model steers the arm to its stem, and a blade at the fingertips cuts it while pads hold the truss.",
        "Here BLUSH's learned skill cuts a ripe truss on a plant layout it never trained on and lays it in the crate, in a physics simulation of the SO-101 arm on my bench. It learned from scripted runs; in greenhouses it will learn from crew recordings. Next, the same pipeline runs on the real arm in the test greenhouse.",
      ],
      figure: {
        kind: "media",
        items: [
          {
            name: "blush-sim",
            type: "video",
            ratio: "16/9",
            alt: "In simulation, a yellow robot arm reaches into a row of tomato trusses, cuts one and lays it in a blue crate.",
            caption: "Simulation · learned skill, one take",
          },
        ],
      },
    },
    {
      id: "the-platform",
      kicker: "The platform",
      title: ["One base,", "many jobs"],
      body: [
        "Every skill runs on SPINE, a base that rides the heating pipes, with a module on top for each job: BLUSH harvests, SHEAR deleafs, HOIST lowers and rehangs, RAVEN scouts. A new job means recording the crew and shipping a module, and the greenhouse stays as it is.",
        "Top: the base swaps SHEAR for BLUSH, in a scripted mock-up with stand-in arms. Bottom: SHEAR cuts an old leaf in a scripted training run in simulation.",
      ],
      figure: {
        kind: "media",
        items: [
          {
            name: "module-swap",
            type: "video",
            ratio: "16/9",
            alt: "In a greenhouse mock-up, a rail base parks one module at a stand and picks up another.",
            caption: "Scripted mock-up, sped up · stand-in arms",
          },
          {
            name: "shear-sim",
            type: "video",
            ratio: "16/9",
            alt: "In simulation, a yellow robot arm reaches into a tomato plant and cuts an old leaf at the stem.",
            caption: "Simulation · scripted training run",
          },
        ],
      },
    },
    {
      id: "the-market",
      kicker: "The market",
      corner: {
        label: "Sources: RaboResearch, CBS, a grower",
        href: "https://topsectortu.nl/wp-content/uploads/2025/03/RaboResearch_Global-greenhouse-update_2025.pdf",
      },
      title: ["Dutch glass", "first"],
      body: [
        "Vinea starts where the crop, the pipe rails and the crews are the same, and widens from there. Harvesting alone costs a tomato grower €50,000 per hectare a year, by one Westland grower's figure. Deleafing, lowering and scouting come on top, and each new crop starts from what earlier crops taught the robots.",
      ],
      figure: {
        kind: "table",
        columns: ["Market", "Area", "Harvesting, per year"],
        rows: [
          ["SOM · The ten largest Dutch tomato growers", "More than 880 ha", "Over €44 million"],
          ["SAM · Dutch tomatoes, peppers, cucumbers", "3,980 ha", "€199 million"],
          ["TAM · World, high-tech glass", "About 70,000 ha", "€3.5 billion at Dutch cost"],
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
      figure: {
        kind: "media",
        items: [
          {
            name: "business-sim",
            type: "image",
            ratio: "8/9",
            alt: "A cut truss of tomatoes lying in a blue crate beside the robot's open gripper.",
            caption: "Simulation",
          },
        ],
      },
    },
    {
      id: "why-me",
      kicker: "Why me",
      title: ["Krishaanth", "Ramaraj"],
      body: [
        "At Degla AI, a YC-backed drone startup, I built and tuned drones. I made the harvest simulation and I'm building the real robot myself, in Antler's residency in Amsterdam. I study Electrical Engineering at TU/e and now work on Vinea full time. I've asked tomato growers what labour costs them and why they haven't bought a robot yet, and built Vinea around their answers.",
      ],
      figure: {
        kind: "media",
        items: [
          {
            name: "why-me-sim",
            type: "image",
            ratio: "8/9",
            alt: "Close up, the robot's fingers close on the stem of a tomato truss.",
            caption: "Simulation of the arm I'm building",
          },
        ],
      },
    },
    {
      id: "lets-talk",
      kicker: "Krishaanth Ramaraj · Founder",
      title: ["Let's", "talk"],
      body: ["Connect on LinkedIn, book a call, or write to me directly."],
      layout: "end",
      links: [
        { label: "Connect on LinkedIn", href: LINKEDIN, tone: "primary" },
        { label: "Book a call", href: BOOK_A_CALL, tone: "secondary" },
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
