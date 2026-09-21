import type { Cta as CtaContent } from "@/content";

const base =
  "inline-flex items-center justify-center rounded-sm px-6 py-3 text-sm font-medium tracking-[0.01em] transition-colors duration-200 ease-[var(--ease-quiet)]";

const tones = {
  primary: "bg-accent text-paper hover:bg-ink",
  secondary:
    "border border-line-strong text-ink hover:border-ink hover:bg-accent-soft",
} as const;

export function Cta({ cta }: { cta: CtaContent }) {
  return (
    <a href={cta.href} className={`${base} ${tones[cta.tone]}`}>
      {cta.label}
    </a>
  );
}
