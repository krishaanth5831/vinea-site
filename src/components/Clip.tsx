"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * A short, silent, looping render. It plays only while it is on screen, and
 * not at all under reduced motion, where its poster frame stands in.
 */
export function Clip({ name, label }: { name: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || prefersReducedMotion()) return;
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    watcher.observe(video);
    return () => watcher.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="clip"
      src={`/renders/${name}.mp4`}
      poster={`/renders/${name}.webp`}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}
