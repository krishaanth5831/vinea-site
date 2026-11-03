import { Heard } from "@/components/Heard";
import { How } from "@/components/How";
import { Modules } from "@/components/Modules";
import { Question } from "@/components/Question";
import { Roadmap } from "@/components/Roadmap";
import { Status } from "@/components/Status";
import { Story } from "@/components/Story";
import { Talk } from "@/components/Talk";

/**
 * One page, one line through it. The story says why Vinea exists; a thread
 * falls from it through the bar robots have to clear, why growers haven't
 * bought, how Vinea works, the modules, where it stands and what comes
 * next, and into the ask, where the mark grows back.
 */
export default function Home() {
  return (
    <>
      <Story />
      <Question />
      <Heard />
      <How />
      <Modules />
      <Status />
      <Roadmap />
      <Talk />
    </>
  );
}
