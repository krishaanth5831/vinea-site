"""
Encodes a folder of numbered frames into an MP4, using the encoder that
ships inside Blender, so nothing else has to be installed.

    blender -b -P encode.py -- <folder> <prefix> <fps> <out.mp4>

Frames are <folder>/<prefix>-000.png onwards.
"""

import os
import sys
from pathlib import Path

import bpy

folder, prefix, fps, out = sys.argv[sys.argv.index("--") + 1 :]
frames = sorted(p.name for p in Path(folder).glob(f"{prefix}-[0-9][0-9][0-9].png"))
if not frames:
    raise SystemExit("no frames")

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
editor = scene.sequence_editor_create()
strips = editor.strips if hasattr(editor, "strips") else editor.sequences
strip = strips.new_image("frames", os.path.join(folder, frames[0]), channel=1, frame_start=1)
for name in frames[1:]:
    strip.elements.append(name)

first = bpy.data.images.load(os.path.join(folder, frames[0]))
width, height = first.size
render = scene.render
render.resolution_x, render.resolution_y = width - width % 2, height - height % 2
render.resolution_percentage = 100
render.fps = int(fps)
scene.frame_start, scene.frame_end = 1, len(frames)
# The frames are finished pictures: no second pass of tone mapping.
scene.view_settings.view_transform = "Standard"
render.image_settings.file_format = "FFMPEG"
render.ffmpeg.format = "MPEG4"
render.ffmpeg.codec = "H264"
render.ffmpeg.constant_rate_factor = "HIGH"
render.ffmpeg.ffmpeg_preset = "GOOD"
render.ffmpeg.gopsize = 12
render.ffmpeg.audio_codec = "NONE"
render.use_file_extension = False
render.filepath = out
bpy.ops.render.render(animation=True)
print("encoded", out, len(frames), "frames")
