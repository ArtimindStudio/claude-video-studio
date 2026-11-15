#!/bin/sh
# Verify final.mp4 stream dimensions, codec, duration, and sample preview frames.
set -e
DIR="${1:-.}"
cd "$DIR"
FILM="${2:-final.mp4}"
[ -f "$FILM" ] || FILM="render/silent.mp4"
[ -f "$FILM" ] || { echo "qa.sh: no final.mp4 or render/silent.mp4 found in $DIR"; exit 1; }
mkdir -p qa
ffprobe -v error -show_streams -show_format -of json "$FILM" > qa/probe.json
python3 - "$FILM" <<'PY'
import json, sys
d = json.load(open("qa/probe.json"))
v = next((s for s in d.get("streams", []) if s.get("codec_type") == "video"), None)
assert v, "No video stream in output"
print(f"QA OK: {sys.argv[1]} -> {v.get('codec_name')} {v.get('width')}x{v.get('height')} @ {v.get('avg_frame_rate')} ({float(d.get('format', {}).get('duration', 0)):.2f}s)")
PY
