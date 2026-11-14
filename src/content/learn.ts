import type { LearnContent } from "./types";

/*
 * How a job gets from a crew to a robot. The capture device is not chosen
 * yet, so the copy says what it does and not what it is. The honest line
 * about today (a scripted teacher, no crew recordings) stays in.
 */
export const learn: LearnContent = {
  id: "how",
  eyebrow: "How it learns",
  heading: "Your crew shows the job. The robot learns it.",
  lead: "Crews make judgement calls all day: which truss is ready, which leaf comes off. Those calls are what robots get wrong, so Vinea is building robots that learn them from the people who make them.",

  steps: [
    {
      label: "Record",
      title: "Your crew works a normal shift.",
      body: "A small capture device records how they reach, cut and hold. The work itself doesn't change.",
    },
    {
      label: "Learn",
      title: "Each job becomes a skill.",
      body: "The recordings of one job train the robot to do that job. Many people doing it many times is what makes the skill steady.",
    },
    {
      label: "Work",
      title: "The robot does it the same way.",
      body: "The skill runs on the module for that job. Every miss, and every time a person steps in, goes back into training.",
    },
  ],

  note: "Crew recording hasn't started. Today a scripted teacher in simulation stands in for the crew.",
};
