import { Heard } from "@/components/Heard";
import { Question } from "@/components/Question";
import { Story } from "@/components/Story";
import { Talk } from "@/components/Talk";

/**
 * One page, one line through it. The story comes apart and collapses to
 * square one; a thread falls from that square through the question, the
 * refusals, and into the ask, where the mark grows back.
 */
export default function Home() {
  return (
    <>
      <Story />
      <Question />
      <Heard />
      <Talk />
    </>
  );
}
