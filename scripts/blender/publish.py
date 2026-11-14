"""
Turns what Blender rendered into the files the site serves, under
public/renders.

    python scripts/blender/publish.py <folder of renders>

Stills become a WebP at full width and a smaller one for phones. If the
folder holds the scroll sequence (plate.png and seq/NNNN.png), the plate and
every frame of the moving layer are written to public/renders/seq, and the
stills that stand in for the sequence on a phone are made by laying a frame
over the plate. Needs Pillow. Safe to run again as more renders arrive.
"""

import sys
from pathlib import Path

from PIL import Image

# What each render is called on the site.
NAMES = {"aisle-harvest": "aisle", "base-harvest": "base", "scout-harvest": "scout"}
# The part of the frame the moving layer covers: left, top, right, bottom.
# Must match CROP in vinea_scene.py (which counts from the bottom).
CROP = (0.24, 0.0, 0.76, 0.74)
# The frames that stand in for the sequence where it isn't played.
STANDINS = {"what-harvest": 31, "what-deleaf": 99, "what-lower": 150}
OUT = Path(__file__).resolve().parents[2] / "public" / "renders"


def save(image: Image.Image, name: str, small: int = 800) -> None:
    image.save(OUT / f"{name}.webp", "WEBP", quality=82, method=6)
    half = image.copy()
    half.thumbnail((small, small))
    half.save(OUT / f"{name}-sm.webp", "WEBP", quality=78, method=6)
    print(name, image.size, (OUT / f"{name}.webp").stat().st_size // 1024, "KB")


def main(folder: str) -> None:
    src = Path(folder)
    OUT.mkdir(parents=True, exist_ok=True)
    for path in sorted(src.glob("*.png")) + sorted(src.glob("*.jpg")):
        if path.stem == "plate" or path.stem.startswith("full-"):
            continue
        save(Image.open(path).convert("RGB"), NAMES.get(path.stem, path.stem))

    plate_path = src / "plate.png"
    frames = sorted((src / "seq").glob("*.png")) if (src / "seq").is_dir() else []
    if not plate_path.exists():
        return
    (OUT / "seq").mkdir(exist_ok=True)
    plate = Image.open(plate_path).convert("RGB")
    plate.save(OUT / "seq" / "plate.webp", "WEBP", quality=84, method=6)
    total = 0
    for path in frames:
        out = OUT / "seq" / f"{int(path.stem):03d}.webp"
        if not out.exists() or out.stat().st_mtime < path.stat().st_mtime:
            Image.open(path).convert("RGBA").save(out, "WEBP", quality=80, alpha_quality=85, method=4)
        total += out.stat().st_size
    print("sequence:", len(frames), "frames,", total // 1024, "KB")

    width, height = plate.size
    box = tuple(round(v * (width if i % 2 == 0 else height)) for i, v in enumerate(CROP))
    for name, frame in STANDINS.items():
        path = src / "seq" / f"{frame:04d}.png"
        if not path.exists():
            continue
        layer = Image.open(path).convert("RGBA").resize((box[2] - box[0], box[3] - box[1]), Image.LANCZOS)
        still = plate.convert("RGBA")
        still.alpha_composite(layer, (box[0], box[1]))
        save(still.convert("RGB"), name)


if __name__ == "__main__":
    main(sys.argv[1])
