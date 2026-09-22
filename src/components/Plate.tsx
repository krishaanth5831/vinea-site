import Image from "next/image";

import { images, type ImageKey } from "@/content";

/**
 * A photograph, framed and captioned like a plate in a manual. Graded back
 * toward the page so it sits inside the drawing rather than beside it.
 */
export function Plate({
  name,
  className = "",
  ratio = "aspect-[4/3]",
}: {
  name: ImageKey;
  className?: string;
  ratio?: string;
}) {
  const image = images[name];
  return (
    <figure className={`m-0 ${className}`}>
      <div className={`relative ${ratio} overflow-hidden border border-line`}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 22rem, 100vw"
          className="size-full object-cover"
          style={{ filter: "grayscale(0.82) contrast(1.06) sepia(0.14)" }}
        />
      </div>
      <figcaption className="t-mono mt-3 text-muted">
        plate{" "}
        <span className="text-line-strong">/</span>{" "}
        <a
          href={image.creditUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="transition-colors duration-200 ease-[var(--ease-quiet)] hover:text-ink"
        >
          {image.credit}
        </a>
      </figcaption>
    </figure>
  );
}
