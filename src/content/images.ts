/**
 * The photographs. Free stock from Pexels, colour-graded toward the palette
 * and served from this domain — nothing is hotlinked. Credits are carried in
 * CREDITS.md and shown under the plates.
 */

export type SiteImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
  creditUrl: string;
};

export const images = {
  truss: {
    src: "/images/truss-on-the-vine.jpg",
    width: 1400,
    height: 933,
    alt: "Trusses on the vine at every stage at once — green, turning and fully ripe fruit hanging on the same plants.",
    credit: "Cá Bảo",
    creditUrl:
      "https://www.pexels.com/photo/ripe-and-unripe-cherry-tomatoes-on-the-vine-37443334/",
  },
  row: {
    src: "/images/high-wire-row.jpg",
    width: 1400,
    height: 2100,
    alt: "A high-wire row close up, leaf and stem dense around the fruit at picking height.",
    credit: "Fer Martinez Gonzalez",
    creditUrl: "https://www.pexels.com/photo/plantation-of-tomatoes-8180574/",
  },
  corridor: {
    src: "/images/glasshouse-corridor.jpg",
    width: 1400,
    height: 933,
    alt: "The central corridor of a commercial glasshouse, rows running away on both sides under a diffusing screen.",
    credit: "Rajeeb roy",
    creditUrl:
      "https://www.pexels.com/photo/modern-greenhouse-with-rows-of-growing-tomatoes-38551884/",
  },
  hand: {
    src: "/images/hand-at-the-vine.jpg",
    width: 1400,
    height: 2101,
    alt: "A hand reaching into the plant and taking hold of fruit on the stem.",
    credit: "Anna Tarazevich",
    creditUrl:
      "https://www.pexels.com/photo/a-hand-touching-the-fruits-on-a-plant-7299950/",
  },
  crates: {
    src: "/images/stacked-crates.jpg",
    width: 1400,
    height: 933,
    alt: "A worker in the aisle of a large glasshouse with crates alongside.",
    credit: "Fatih Kopcal",
    creditUrl:
      "https://www.pexels.com/photo/worker-in-large-greenhouse-farm-setting-32738498/",
  },
} as const satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;
