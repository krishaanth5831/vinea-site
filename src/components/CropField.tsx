/*
 * The texture behind the hero: rows of a glasshouse written out in monospace,
 * every glyph a plant. Generated from its indices rather than at random, so
 * the server and the browser draw the same field.
 */
const GLYPHS = ["|", "|", "¦", "|", "·", "|"];
const ROWS = 13;
const COLUMNS = 120;

function row(index: number) {
  let line = "";
  for (let column = 0; column < COLUMNS; column += 1) {
    line += GLYPHS[(index * 7 + column * 3) % GLYPHS.length];
  }
  return line;
}

export function CropField({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`crop-field pointer-events-none select-none ${className}`}
      style={{
        maskImage:
          "radial-gradient(120% 90% at 50% 40%, #000 15%, transparent 72%)",
        WebkitMaskImage:
          "radial-gradient(120% 90% at 50% 40%, #000 15%, transparent 72%)",
      }}
    >
      {Array.from({ length: ROWS }, (_, index) => (
        <div key={index} style={{ opacity: 0.22 + index * 0.045 }}>
          {row(index)}
        </div>
      ))}
    </div>
  );
}
