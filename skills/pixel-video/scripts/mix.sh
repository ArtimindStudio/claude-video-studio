#!/bin/sh
# Mix pixel-video audio (optional VO, chiptune bed, and SFX) into audio/mix.wav.
set -e
SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
sh "$SKILL_DIR/../lowpoly-video/scripts/mix.sh" "$@"
