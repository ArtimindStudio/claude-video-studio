#!/usr/bin/env bash
# Check the local tools used by video-studio (Starter Lite & Complete Pro Edition).
set -u

HERE="$(cd "$(dirname "$0")" && pwd)"
ok()   { printf "  \033[32mok\033[0m   %s\n" "$1"; }
miss() { printf "  \033[33m--\033[0m   %s\n" "$1"; }

echo "video-studio doctor"

command -v node >/dev/null     && ok "node $(node -v)"           || miss "node (install Node 20+)"
command -v ffmpeg >/dev/null   && ok "ffmpeg"                    || miss "ffmpeg (brew install ffmpeg)"
command -v ffprobe >/dev/null  && ok "ffprobe"                   || miss "ffprobe (comes with ffmpeg)"

if node -e "require('playwright')" 2>/dev/null; then
  ok "playwright (local node_modules)"
elif [ -d "$HOME/Library/Caches/ms-playwright" ] || [ -d "$HOME/.cache/ms-playwright" ]; then
  ok "playwright browsers cache"
else
  miss "playwright (run: npm i -D playwright && npx playwright install chromium)"
fi

PRO_KIT="${LOWPOLY_SKILL:-$HOME/.claude/skills/lowpoly-video}/kit"
LITE_KIT="$HERE/../kit"
if [ -d "$PRO_KIT/engines/lowpoly" ] && [ -f "$PRO_KIT/vendor/post.js" ]; then
  ok "Complete Pro Studio (17 commands + 3 engines + 10 style cards + MotionKit)"
elif [ -f "$LITE_KIT/scene_v2/whiteboard.html" ]; then
  ok "Starter Lite Studio (/video-studio + /whiteboard-video + render_html.mjs)"
  miss "Pro Studio Pack (15 more commands, Three.js Low-Poly/Pixel/Flat engines, MotionKit & 252 SFX): https://aiartimind.com/claude-video-guide/"
else
  miss "studio kit assets"
fi

EARSHOT_PY="${EARSHOT_PY:-$HOME/earshot/.venv/bin/python}"
if [ -x "$EARSHOT_PY" ] && "$EARSHOT_PY" -c "import earshot" 2>/dev/null; then
  ok "earshot ($EARSHOT_PY)"
elif command -v earshot >/dev/null; then
  ok "earshot ($(command -v earshot))"
else
  miss "earshot (optional audio QA): git clone https://github.com/Leonxlnx/earshot ~/earshot"
fi
