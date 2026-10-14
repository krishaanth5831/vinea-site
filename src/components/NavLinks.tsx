"use client";

import { usePathname } from "next/navigation";

import type { NavLink } from "@/content";

/**
 * The header's links. A client component only so the page you are on can be
 * marked as current; the links themselves are plain anchors.
 *
 * The home page's own sections only fit from `lg` up. Between `md` and `lg`
 * the header carries just the pages, which is what a reader on a tablet
 * most needs to find.
 */
export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
      {links.map((link) => {
        const section = link.href.startsWith("/#");
        const current = !section && link.href === pathname;
        return (
          <a
            key={link.href}
            href={link.href}
            aria-current={current ? "page" : undefined}
            className={`text-[0.875rem] transition-colors duration-200 hover:text-fg aria-[current=page]:text-fg ${
              section ? "hidden text-muted lg:inline" : "text-muted"
            }`}
          >
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}
