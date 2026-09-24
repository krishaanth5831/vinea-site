"use client";

import { prefersReducedMotion } from "@/lib/gsap";
import { CHROME, THEME_KEY } from "@/lib/theme";

/**
 * Flips between dark and light and remembers the choice.
 *
 * The icon shown is decided in CSS from `data-theme`, not from React state,
 * so the server markup is the same whichever theme the reader saved and
 * nothing mismatches on hydration.
 */
export function ThemeToggle() {
  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";

    const apply = () => {
      root.dataset.theme = next;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", CHROME[next]);
    };

    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* Private windows and blocked storage: the switch still works. */
    }

    if (!document.startViewTransition || prefersReducedMotion()) {
      apply();
      return;
    }

    /* The new theme opens as a circle from the switch itself. */
    const { clientX: x, clientY: y } = event;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 550,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between dark and light theme"
      className="grid size-10 place-items-center rounded-[3px] border border-line-strong text-muted transition-colors duration-200 hover:border-faint hover:text-fg"
    >
      <svg
        className="icon-sun"
        viewBox="0 0 16 16"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" />
      </svg>
      <svg
        className="icon-moon"
        viewBox="0 0 16 16"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M13.5 9.6A5.75 5.75 0 0 1 6.4 2.5a5.75 5.75 0 1 0 7.1 7.1Z" />
      </svg>
    </button>
  );
}
