#!/bin/sh
# Rebuild this flat video in one command. LOOP=1 for a seamless loop (lowpoly-video references/loop.md). BED=<library bed id> to change the music.
set -e; cd "$(dirname "$0")"; . "$HOME/.claude/skills/lowpoly-video/scripts/env.sh"
DUR=${DUR:-$(python3 -c "import json;w=json.load(open('words.json'));import os;print(round(w[-1]['e']+(0.3 if os.environ.get('LOOP')=='1' else 0.9),2))")}
node "$LOWPOLY_SKILL/scripts/render_gpu.mjs" --html src/index.html --seconds $DUR --width 1080 --height 1920 --fps 30 --output render/silent.mp4 --overwrite
[ -f cues.json ] && "$EARSHOT_PY" -I "$VS_SCRIPTS/sfx_from_cues.py" --cues cues.json --out audio/sfx.wav --duration $DUR --preset calm
sh "$LOWPOLY_SKILL/scripts/mix.sh" . $DUR ${BED:-thoughtful-midrange}
ffmpeg -v error -y -i render/silent.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart final.mp4
sh "$LOWPOLY_SKILL/scripts/qa.sh" .
if [ "${LOOP:-0}" = "1" ]; then sh "$LOWPOLY_SKILL/scripts/loop_check.sh" .; fi
