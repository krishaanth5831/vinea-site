/**
 * One of the concept renders. They are made by scripts/blender and saved at
 * two widths; the browser picks. `tag` is the label that says what the
 * picture is, and every render on the site carries it.
 */
export function Render({
  name,
  alt,
  tag,
  ratio = "16 / 9",
  sizes = "(min-width: 72rem) 68rem, 100vw",
  className = "",
  eager = false,
}: {
  name: string;
  alt: string;
  tag?: string;
  ratio?: string;
  sizes?: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <span className={`render ${className}`} style={{ aspectRatio: ratio }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/renders/${name}.webp`}
        srcSet={`/renders/${name}-sm.webp 800w, /renders/${name}.webp 1600w`}
        sizes={sizes}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
      {tag ? <span className="render-tag">{tag}</span> : null}
    </span>
  );
}
