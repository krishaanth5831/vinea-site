import type { TalkContent } from "./types";
import { BOOK_A_CALL, INVESTOR_HELLO } from "./site";

export const talk: TalkContent = {
  id: "talk",
  eyebrow: "Talk to me",
  heading: ["Grow under glass?", "Let's talk."],
  lead: "I'm looking for growers who will put a robot up against their own crew, and for engineers who have kept machines running in a greenhouse every day.",

  ctas: [
    { label: "Book a call", href: BOOK_A_CALL, tone: "primary" },
    { label: "Investor? Say hello", href: INVESTOR_HELLO, tone: "secondary" },
  ],
};
