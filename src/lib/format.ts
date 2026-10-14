/*
 * Number formats for the calculator. Module-level, so their identities are
 * stable and an animated figure can depend on one without re-running.
 */

const euro = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const euroCents = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const whole = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const tenth = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });

export const formatEuro = (n: number) => euro.format(Math.round(n));
export const formatEuroCents = (n: number) => euroCents.format(n);
export const formatWhole = (n: number) => whole.format(Math.round(n));
export const formatTenth = (n: number) => tenth.format(n);
export const formatPercent = (fraction: number) => `${tenth.format(fraction * 100)}%`;

/** Euros, shortened for chart axes: €1.2M, €840k. */
export function formatEuroShort(n: number): string {
  if (n >= 1_000_000) return `€${tenth.format(n / 1_000_000)}M`;
  if (n >= 1_000) return `€${whole.format(n / 1_000)}k`;
  return `€${whole.format(n)}`;
}
