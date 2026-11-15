#!/bin/sh
# Environment variables for lowpoly-video, pixel-video, flat-video, and video-studio build scripts.
# Note: in POSIX sh, $0 inside a sourced script is the caller's path, so default to $HOME/.claude/skills/*.
LOWPOLY_SKILL="${LOWPOLY_SKILL:-$HOME/.claude/skills/lowpoly-video}"
PIXEL_SKILL="${PIXEL_SKILL:-$HOME/.claude/skills/pixel-video}"
FLAT_SKILL="${FLAT_SKILL:-$HOME/.claude/skills/flat-video}"
VS_SKILL="${VS_SKILL:-$HOME/.claude/skills/video-studio}"
VS_SCRIPTS="${VS_SCRIPTS:-$VS_SKILL/scripts}"

if [ -z "${EARSHOT_PY:-}" ]; then
  if [ -x "$HOME/earshot/.venv/bin/python" ]; then
    EARSHOT_PY="$HOME/earshot/.venv/bin/python"
  elif [ -x ".venv/bin/python" ]; then
    EARSHOT_PY="$(pwd)/.venv/bin/python"
  else
    EARSHOT_PY="python3"
  fi
fi

if [ -z "${WHISPER_PY:-}" ]; then
  if [ -x ".venv/bin/python" ]; then
    WHISPER_PY="$(pwd)/.venv/bin/python"
  elif [ -x "$EARSHOT_PY" ]; then
    WHISPER_PY="$EARSHOT_PY"
  else
    WHISPER_PY="python3"
  fi
fi

export LOWPOLY_SKILL PIXEL_SKILL FLAT_SKILL VS_SKILL VS_SCRIPTS EARSHOT_PY WHISPER_PY
