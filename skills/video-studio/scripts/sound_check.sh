#!/bin/sh
# Listen to a finished film with earshot and write the evidence to <dir of film>/qa/sound/.
#   sh sound_check.sh final.mp4 [cues.json]
# Outputs: timeline.json, sheet.png (open it), critique.json, measure.json, summary.txt
set -e
FILM=$1; CUES=$2
[ -f "$FILM" ] || { echo "usage: sound_check.sh <film.mp4> [cues.json]"; exit 1; }
PY=${EARSHOT_PY:-$HOME/earshot/.venv/bin/python}
"$PY" -c 'import earshot' 2>/dev/null || { echo "earshot not found: set EARSHOT_PY to a python that imports earshot"; exit 1; }
FILM=$(cd "$(dirname "$FILM")" && pwd)/$(basename "$FILM")
OUT=$(dirname "$FILM")/qa/sound; mkdir -p "$OUT"
HAVECUES=""; [ -n "$CUES" ] && [ -f "$CUES" ] && HAVECUES=1
export EARSHOT_THREADS=${EARSHOT_THREADS:-3}
E() { "$PY" -m earshot "$@"; }
{
  echo "== measure"; E measure "$FILM" --music --out "$OUT/measure.json" 2>/dev/null
  echo; echo "== timeline"; if [ -n "$HAVECUES" ]; then E timeline "$FILM" --cues "$CUES" --out "$OUT/timeline.json" 2>/dev/null; else E timeline "$FILM" --out "$OUT/timeline.json" 2>/dev/null; fi
  echo; echo "== critique"; E critique "$FILM" --out "$OUT/critique.json" 2>/dev/null
} | tee "$OUT/summary.txt"
if [ -n "$HAVECUES" ]; then set -- --cues "$CUES"; else set --; fi
E sheet "$FILM" -o "$OUT/sheet.png" "$@" >/dev/null 2>&1 && echo "sheet: $OUT/sheet.png (open it)"
echo "evidence in $OUT"
