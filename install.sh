#!/bin/sh
# Claude Video Studio (Starter Lite) — One-Command Installer
# Installs the free Starter Lite skill (video-studio + doctor.sh + render_html.mjs + 13 Motion Rules)
# and 2 slash commands (/video-studio, /whiteboard-video) into Claude Code, Antigravity, and Codex.
#
# Usage:
#   sh install.sh                # installs globally into ~/.claude, ~/.gemini/antigravity, ~/.codex
#   sh install.sh --project .    # installs into a specific project directory
set -e

REPO_ROOT="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
MODE="global"
TARGET_PROJECT=""

while [ $# -gt 0 ]; do
  case "$1" in
    --project|-p)
      MODE="project"
      TARGET_PROJECT="${2:-.}"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

install_into() {
  DEST_SKILLS="$1"
  DEST_COMMANDS="$2"
  mkdir -p "$DEST_SKILLS"
  rm -rf "$DEST_SKILLS/video-studio"
  cp -R "$REPO_ROOT/skills/video-studio" "$DEST_SKILLS/video-studio"
  cp -R "$REPO_ROOT/kit" "$DEST_SKILLS/video-studio/kit"
  chmod +x "$DEST_SKILLS/video-studio/scripts/"*.sh 2>/dev/null || true

  if [ -n "$DEST_COMMANDS" ]; then
    mkdir -p "$DEST_COMMANDS"
    cp "$REPO_ROOT/commands/"*.md "$DEST_COMMANDS/"
  fi
}

if [ "$MODE" = "project" ]; then
  PROJ="$(CDPATH= cd -- "$TARGET_PROJECT" && pwd)"
  echo "==> Installing Claude Video Studio (Starter Lite) into project: $PROJ"
  install_into "$PROJ/.claude/skills" "$PROJ/.claude/commands"
  install_into "$PROJ/.agent/skills" ""
else
  echo "==> Installing Claude Video Studio (Starter Lite) globally ($HOME)"
  install_into "$HOME/.claude/skills" "$HOME/.claude/commands"
  install_into "$HOME/.gemini/antigravity/skills" ""
  install_into "$HOME/.codex/skills" ""
fi

echo ""
echo "Claude Video Studio (Starter Lite) installed."
echo "  Included free:  video-studio skill, doctor.sh, render_html.mjs, 13 Motion Rules, seek-page-starter.html"
echo "  Slash commands: /video-studio, /whiteboard-video (Style 01: Whiteboard sketch)"
echo "  Upgrade to Pro: https://aiartimind.com/claude-video-guide/ (unlocks all 17 commands, Three.js Low-Poly/Pixel/Flat engines, 10 Style Cards, MotionKit & 252 SFX)"
echo ""
if [ -f "$HOME/.claude/skills/video-studio/scripts/doctor.sh" ]; then
  sh "$HOME/.claude/skills/video-studio/scripts/doctor.sh" || true
fi
