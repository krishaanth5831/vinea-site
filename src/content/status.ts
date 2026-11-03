import type { StatusContent } from "./types";

/*
 * Where Vinea is today. Traction is stated plainly, including what hasn't
 * happened yet. No counts and no grower names: see DECISIONS.md, "Where it
 * stands".
 */
export const status: StatusContent = {
  id: "now",
  eyebrow: "Where it stands",
  heading: "Early, and building in the open.",
  lead: "Vinea is me, Krishaanth Ramaraj, building it alongside an Electrical Engineering degree at TU/e. Before this I built drones at Degla AI, a YC-backed startup.",

  columns: [
    {
      title: "With growers",
      items: [
        "I meet Dutch tomato growers in person, and walk in with a hypothesis for them to confirm or knock down instead of a blank page.",
        "Those meetings moved the bar: growers judge a robot against their crew, not against other robots.",
        "Large growers can move workers between sites when they're short. I'm now testing whether smaller growers feel the shortage more.",
        "Some growers have agreed to a second meeting, where I pitch Vinea and ask for a pilot. No grower has signed a letter of intent yet.",
      ],
    },
    {
      title: "On the bench",
      items: [
        "A desktop robot arm, with a camera model that tells ripe from unripe tomatoes live, on real fruit.",
        "A simulated greenhouse row where the arm cuts old leaves on routes planned around everything it mustn't touch.",
        "Harvest training data from an earlier, single-tomato version of the simulation, published openly. Harvesting is now moving to whole trusses.",
        "A design for the lowering module, and a plan for the crews' capture tool.",
        "Nothing has run in a working greenhouse yet.",
      ],
    },
  ],

  links: [
    { label: "B.L.U.S.H on GitHub", href: "https://github.com/krishaanth5831/B.L.U.S.H" },
    { label: "S.H.E.A.R on GitHub", href: "https://github.com/krishaanth5831/S.H.E.A.R" },
    { label: "H.O.I.S.T on GitHub", href: "https://github.com/krishaanth5831/H.O.I.S.T" },
  ],
};
