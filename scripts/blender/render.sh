#!/usr/bin/env bash
# Runs the scene script in Blender with a hard memory cap, at the lowest CPU
# priority, on the CPU only. The GPU is left alone on purpose: this machine
# trains robot policies on it.
#
#   scripts/blender/render.sh --out /tmp/renders --format PNG --jobs plate:1600x900:36
#   scripts/blender/render.sh --out /tmp/renders --format PNG --seq 0-156 --width 1120 --height 630 --samples 20
#
# BLENDER points at a portable Blender build; MEM is the cap.
set -euo pipefail

BLENDER="${BLENDER:-$HOME/.cache/vinea-site-tools/blender-4.5.16-linux-x64/blender}"
MEM="${MEM:-4G}"
HERE="$(cd "$(dirname "$0")" && pwd)"
SCRIPT="${SCRIPT:-$HERE/vinea_scene.py}"

exec systemd-run --user --scope --quiet \
  -p MemoryMax="$MEM" -p MemorySwapMax=0 \
  nice -n 19 "$BLENDER" -b --factory-startup -noaudio -P "$SCRIPT" -- "$@"
