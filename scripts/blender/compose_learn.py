"""
Puts the "How it learns" loops together: lays each frame of the moving layer
over the still background, adds the glow the lines of light should have, and
writes whole frames ready to be encoded, plus a poster for each loop.

    python scripts/blender/compose_learn.py <renders>/learn

Then encode with Blender, which carries its own video encoder:

    blender -b -P scripts/blender/encode.py -- <renders>/learn/full record 24 public/renders/learn-record.mp4

Needs Pillow.
"""

import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

OUT = Path(__file__).resolve().parents[2] / "public" / "renders"
# Frames at the end of each loop that dissolve into its first. Record and
# Learn come back to where they started by themselves; Work ends with the
# truss in the crate, so it has to fade back to a plant that still has one.
FADE = {"record": 0, "learn": 0, "work": 8}
# The frame of each loop that stands in for it where it can't play.
POSTER = {"record": 36, "learn": 30, "work": 22}


def main(folder: str) -> None:
    src = Path(folder)
    full = src / "full"
    full.mkdir(exist_ok=True)
    frames = sorted(src.glob("*-[0-9][0-9][0-9].png"))
    if not frames:
        raise SystemExit("no frames in " + folder)
    size = Image.open(frames[0]).size
    plate = Image.open(src / "plate.png").convert("RGB").resize(size, Image.LANCZOS)
    for path in frames:
        layer = Image.open(path).convert("RGBA")
        still = plate.convert("RGBA")
        still.alpha_composite(layer)
        still = still.convert("RGB")
        # Bloom: only what is close to white in the layer, blurred wide and
        # added back. A lower threshold catches the white capture unit and the
        # see-through arms too, and washes both out.
        black = Image.new("RGBA", size, (0, 0, 0, 255))
        black.alpha_composite(layer)
        bright = black.convert("RGB").point(lambda v: min(255, int(max(0, v - 185) * 1.4)))
        scale = size[0] / 720
        halo = ImageChops.add(bright.filter(ImageFilter.GaussianBlur(4 * scale)), bright.filter(ImageFilter.GaussianBlur(14 * scale)))
        still = ImageChops.screen(still, halo)
        still.save(full / path.name)
    # A loop has to end where it starts. Where it doesn't, the last frames
    # fade into the first one, so the restart is a dissolve and not a jump.
    for name in ("record", "learn", "work"):
        loop = sorted(full.glob(f"{name}-[0-9][0-9][0-9].png"))
        fade = FADE[name]
        if not fade or len(loop) <= fade:
            continue
        first = Image.open(loop[0]).convert("RGB")
        for n, path in enumerate(loop[-fade:]):
            Image.blend(Image.open(path).convert("RGB"), first, (n + 1) / (fade + 1)).save(path)
    print(len(frames), "frames composed at", size)
    for name in ("record", "learn", "work"):
        poster = full / f"{name}-{POSTER[name]:03d}.png"
        if poster.exists():
            Image.open(poster).save(OUT / f"learn-{name}.webp", "WEBP", quality=84, method=6)


if __name__ == "__main__":
    main(sys.argv[1])
