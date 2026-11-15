import { Heard } from "@/components/Heard";
import { Hero } from "@/components/Hero";
import { Jobs } from "@/components/Jobs";
import { Learn } from "@/components/Learn";
import { Roadmap } from "@/components/Roadmap";
import { Status } from "@/components/Status";
import { Talk } from "@/components/Talk";
import { What } from "@/components/What";

/**
 * The home page, written for a grower. It says what Vinea is before why:
 * what it is building, a picture of it, the jobs it does, how it learns
 * them, what it does about the reasons growers haven't bought a robot, where
 * it stands today, what comes next, and the ask.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <What />
      <Jobs />
      <Learn />
      <Heard />
      <Status />
      <Roadmap />
      <Talk />
    </>
  );
}
