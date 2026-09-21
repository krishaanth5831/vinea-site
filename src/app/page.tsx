import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Method } from "@/components/Method";
import { Objections } from "@/components/Objections";
import { Platform } from "@/components/Platform";
import { Status } from "@/components/Status";
import { Tasks } from "@/components/Tasks";

/**
 * One page, in the order the argument is made: the problem, the method that
 * found it, the jobs it turned up, what those point to, what growers say
 * against it, where the project actually stands, and how to reach it.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Method />
      <Tasks />
      <Platform />
      <Objections />
      <Status />
      <Contact />
    </>
  );
}
