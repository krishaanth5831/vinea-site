import type { Cta as CtaContent } from "@/content";

const base =
  "group inline-flex items-center gap-3 border px-6 py-3 text-[0.9375rem] font-medium transition-colors duration-200 ease-[var(--ease-quiet)]";

const tones = {
  primary: "border-ink bg-ink text-paper hover:border-signal hover:bg-signal",
  secondary: "border-line-strong text-ink hover:border-ink hover:bg-raised",
} as const;

export function Cta({ cta }: { cta: CtaContent }) {
  return (
    <a href={cta.href} className={`${base} ${tones[cta.tone]}`}>
      {cta.label}
      <span
        aria-hidden="true"
        className="transition-transform duration-200 ease-[var(--ease-quiet)] group-hover:translate-x-1"
      >
        →
      </span>
    </a>
  );
}
