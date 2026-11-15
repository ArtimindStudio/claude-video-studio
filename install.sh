#!/bin/sh
# Install Claude Video Studio (skills, engines, shared kit, and slash commands) into Claude Code, Antigravity, and Codex.
# Usage:
#   sh install.sh                  # installs globally into ~/.claude/{skills,commands} (plus ~/.codex/skills if ~/.codex exists)
#   sh install.sh --project [DIR]  # installs into DIR/.claude/{skills,commands} and DIR/.agent/skills

set -e
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
MODE="user"
TARGET_ROOT="$HOME"

if [ "${1:-}" = "--project" ]; then
  MODE="project"
  TARGET_ROOT="${2:-$(pwd)}"
fi

SKILLS_DST="$TARGET_ROOT/.claude/skills"
CMDS_DST="$TARGET_ROOT/.claude/commands"
mkdir -p "$SKILLS_DST" "$CMDS_DST"

# 1. Install all skills
for skill_path in "$REPO_DIR"/skills/*; do
  [ -d "$skill_path" ] || continue
  skill_name="$(basename "$skill_path")"
  rm -rf "$SKILLS_DST/$skill_name"
  cp -R "$skill_path" "$SKILLS_DST/$skill_name"
done

# 2. Bundle shared kit (Three.js, post.js, fonts, engines, scene_v2, MotionKit) inside lowpoly-video/kit and pixel-video/kit
mkdir -p "$SKILLS_DST/lowpoly-video/kit" "$SKILLS_DST/pixel-video/kit"
cp -R "$REPO_DIR"/kit/* "$SKILLS_DST/lowpoly-video/kit/"
cp -R "$REPO_DIR"/kit/fonts "$SKILLS_DST/pixel-video/kit/fonts"
cp -R "$REPO_DIR"/kit/vendor "$SKILLS_DST/pixel-video/kit/vendor"

# 3. Install all slash commands (/lowpoly-video, /pixel-video, /flat-video, /whiteboard-video, etc.)
cp -R "$REPO_DIR"/commands/*.md "$CMDS_DST/"

# 4. Mirror to .agent/skills (Antigravity) or ~/.codex/skills (Codex) when applicable
if [ "$MODE" = "project" ] && [ -d "$TARGET_ROOT/.agent" ]; then
  mkdir -p "$TARGET_ROOT/.agent/skills"
  for skill_path in "$SKILLS_DST"/*; do
    [ -d "$skill_path" ] || continue
    skill_name="$(basename "$skill_path")"
    rm -rf "$TARGET_ROOT/.agent/skills/$skill_name"
    cp -R "$skill_path" "$TARGET_ROOT/.agent/skills/$skill_name"
  done
elif [ "$MODE" = "user" ] && [ -d "$HOME/.codex" ]; then
  mkdir -p "$HOME/.codex/skills"
  cp -R "$SKILLS_DST"/* "$HOME/.codex/skills/"
fi

chmod +x "$SKILLS_DST"/video-studio/scripts/*.sh "$SKILLS_DST"/video-studio/scripts/*.mjs 2>/dev/null || true
chmod +x "$SKILLS_DST"/lowpoly-video/scripts/*.sh "$SKILLS_DST"/lowpoly-video/scripts/*.mjs 2>/dev/null || true
chmod +x "$SKILLS_DST"/pixel-video/scripts/* 2>/dev/null || true

echo "Installed Claude Video Studio into $TARGET_ROOT/.claude/"
echo "  Skills:   video-studio, lowpoly-video, pixel-video, flat-video, animation-studio, real-sound, earshot"
echo "  Commands: /video-studio, /lowpoly-video, /pixel-video, /flat-video, /whiteboard-video, /ukiyoe-video,"
echo "            /stickman-video, /doodle-video, /keynote-video, /watercolor-video, /clay-video,"
echo "            /chalkboard-video, /dankoe-video, /glowsketch-video, /comicart-video, /editorial-short, /sound-check"
echo ""
sh "$SKILLS_DST/video-studio/scripts/doctor.sh" || true
