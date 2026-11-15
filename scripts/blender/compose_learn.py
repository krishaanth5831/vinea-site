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
FADE = 8  # frames at the end of each loop that dissolve into its first


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
        # Bloom: what is bright in the layer, blurred wide and added back.
        black = Image.new("RGBA", size, (0, 0, 0, 255))
        black.alpha_composite(layer)
        bright = black.convert("RGB").point(lambda v: max(0, v - 120) * 2)
        scale = size[0] / 720
        halo = ImageChops.add(bright.filter(ImageFilter.GaussianBlur(4 * scale)), bright.filter(ImageFilter.GaussianBlur(14 * scale)))
        still = ImageChops.screen(still, halo)
        still.save(full / path.name)
    # A loop has to end where it starts. Where it doesn't, the last frames
    # fade into the first one, so the restart is a dissolve and not a jump.
    for name in ("record", "learn", "work"):
        loop = sorted(full.glob(f"{name}-[0-9][0-9][0-9].png"))
        if len(loop) <= FADE:
            continue
        first = Image.open(loop[0]).convert("RGB")
        for n, path in enumerate(loop[-FADE:]):
            Image.blend(Image.open(path).convert("RGB"), first, (n + 1) / (FADE + 1)).save(path)
    print(len(frames), "frames composed at", size)
    for name in ("record", "learn", "work"):
        poster = full / f"{name}-034.png"
        if poster.exists():
            Image.open(poster).save(OUT / f"learn-{name}.webp", "WEBP", quality=84, method=6)


if __name__ == "__main__":
    main(sys.argv[1])
