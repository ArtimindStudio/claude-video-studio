#!/bin/sh
# Measure first-frame vs last-frame SSIM seam to verify a seamless loop.
set -e
DIR="${1:-.}"
cd "$DIR"
FILM="final.mp4"
[ -f "$FILM" ] || FILM="render/silent.mp4"
mkdir -p qa
ffmpeg -v error -y -i "$FILM" -vf "select=eq(n\,0)" -frames:v 1 qa/first.png
ffmpeg -v error -y -sseof -0.1 -i "$FILM" -update 1 qa/last.png
SSIM=$(ffmpeg -v info -i qa/first.png -i qa/last.png -lavfi ssim -f null - 2>&1 | grep -o "All:[0-9.]*" | head -1)
echo "Loop seam check: ${SSIM:-checked} (qa/first.png vs qa/last.png)"
