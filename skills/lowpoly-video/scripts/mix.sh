#!/bin/sh
# Mix optional VO (audio/vo.wav or audio/vo.mp3), music bed (BED_FILE or audio/bed.wav), and SFX (audio/sfx.wav) into audio/mix.wav.
# Usage: sh mix.sh <project_dir> <duration_sec> [bed_name]
set -e
DIR="${1:-.}"
DUR="${2:-3}"
BED_NAME="${3:-thoughtful-midrange}"
cd "$DIR"
mkdir -p audio

BED="${BED_FILE:-}"
if [ -z "$BED" ]; then
  if [ -f "audio/bed.wav" ]; then BED="audio/bed.wav";
  elif [ -f "audio/music.wav" ]; then BED="audio/music.wav";
  fi
fi

VO=""
if [ -f "audio/vo.wav" ]; then VO="audio/vo.wav";
elif [ -f "audio/vo.mp3" ]; then VO="audio/vo.mp3";
fi

SFX=""
[ -f "audio/sfx.wav" ] && SFX="audio/sfx.wav"

if [ -z "$VO" ] && [ -z "$BED" ] && [ -z "$SFX" ]; then
  ffmpeg -v error -y -f lavfi -i "anullsrc=r=48000:cl=stereo" -t "$DUR" -c:a pcm_s24le audio/mix.wav
  exit 0
fi

python3 - "$DUR" "$VO" "$BED" "$SFX" <<'PY'
import subprocess, sys
dur = float(sys.argv[1])
vo, bed, sfx = sys.argv[2], sys.argv[3], sys.argv[4]
inputs = []
filters = []
labels = []
idx = 0
if vo:
    inputs += ["-i", vo]
    filters.append(f"[{idx}:a]aresample=48000,aformat=channel_layouts=stereo,volume=1.0[vo]")
    labels.append("[vo]")
    idx += 1
if bed:
    inputs += ["-stream_loop", "-1", "-i", bed]
    vol = "0.18" if vo else "0.55"
    fade_out = max(0.0, dur - 0.6)
    filters.append(f"[{idx}:a]atrim=0:{dur},aresample=48000,aformat=channel_layouts=stereo,volume={vol},afade=t=out:st={fade_out:.2f}:d=0.6[bed]")
    labels.append("[bed]")
    idx += 1
if sfx:
    inputs += ["-i", sfx]
    filters.append(f"[{idx}:a]atrim=0:{dur},aresample=48000,aformat=channel_layouts=stereo,volume=0.85[sfx]")
    labels.append("[sfx]")
    idx += 1

if len(labels) == 1:
    fc = ";".join(filters) + f";{labels[0]}alimiter=limit=0.89[out]"
else:
    fc = ";".join(filters) + f";{''.join(labels)}amix=inputs={len(labels)}:normalize=0,alimiter=limit=0.89[out]"

subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", fc, "-map", "[out]", "-t", str(dur), "-c:a", "pcm_s24le", "audio/mix.wav"], check=True)
PY
