import type { HeardContent } from "./types";

export const heard: HeardContent = {
  id: "heard",
  eyebrow: "What growers told me",
  heading: "Why they haven't bought a robot.",
  lead: "Each of these is a bar Vinea has to clear. Next to each is how it plans to.",
  answerLabel: "What Vinea does about it",

  items: [
    {
      title: "Too rough",
      worry: "Rubber grippers knock fruit off the truss.",
      answer:
        "The harvest tool never squeezes the fruit. It cuts the stalk with a blade at the fingertips and holds the truss by that stalk, the way a picker does.",
    },
    {
      title: "Too slow",
      worry: "A person still picks many times faster than the robots on the market.",
      answer:
        "The pilot measures the robot against your crew, on your own speeds. It also works the hours a crew doesn't: nights and weekends.",
    },
    {
      title: "Too fixed",
      worry: "A crew can be scaled up for the busy weeks and let go after. A robot you buy is a commitment for years.",
      answer:
        "You rent Vinea per robot, the way you hire a crew, with service included. Pricing stays provisional until after the pilot.",
    },
    {
      title: "Too risky",
      worry: "They've paid for machines that didn't deliver. And when one stops mid-row, who fixes it?",
      answer:
        "It starts with one pilot season on a fixed stand, measured against your crew. Service is part of the rent, so a stopped robot is Vinea's to fix.",
    },
  ],

  note: "From grower meetings and Dutch trade press. The newest ask: collect every leaf the robot cuts, so none stays on the floor to spread disease. That is now a requirement for the deleafing module.",
};
