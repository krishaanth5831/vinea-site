import type { QuestionContent } from "./types";

/*
 * Once the one question every grower call turned on. Since the grower
 * meetings of late October it's the bar those calls set: growers compare a
 * robot with a person, not with other robots.
 */
export const question: QuestionContent = {
  id: "bar",
  eyebrow: "The bar",

  question: "A robot gets the job only when it beats the person doing it today.",

  body:
    "Growers don't compare robots with each other. They compare them with their crew, and today the crew is still faster and more careful. In an independent Wageningen trial, a harvest robot left half the ripe trusses on the plant and needed a person to step in again and again. Vinea builds against the crew, not the other robots.",
};
