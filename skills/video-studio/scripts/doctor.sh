#!/bin/sh
# Check what this machine can do for video-studio. Prints one line per tool and the env vars to set.
ok() { printf '  ok   %s\n' "$1"; }
no() { printf '  --   %s\n' "$1"; }
echo "video-studio doctor"
command -v node >/dev/null && ok "node $(node -v)" || no "node (needed for rendering)"
command -v ffmpeg >/dev/null && ok "ffmpeg" || no "ffmpeg (needed: brew install ffmpeg)"
command -v ffprobe >/dev/null && ok "ffprobe" || no "ffprobe"
node -e "require.resolve('playwright')" 2>/dev/null && ok "playwright (this folder)" || no "playwright not resolvable here (npm i -D playwright && npx playwright install chromium, in the project)"
KIT_DIR="${LOWPOLY_SKILL:-$HOME/.claude/skills/lowpoly-video}/kit"
[ -f "$KIT_DIR/vendor/post.js" ] && [ -f "$KIT_DIR/fonts/fredoka.woff2" ] && ok "engines + Three.js + fonts ($KIT_DIR)" || no "bundled engines kit ($KIT_DIR)"
PY=${EARSHOT_PY:-$HOME/earshot/.venv/bin/python}
if "$PY" -c 'import earshot' 2>/dev/null; then ok "earshot ($PY)"; else no "earshot: git clone https://github.com/Leonxlnx/earshot ~/earshot && cd ~/earshot && uv venv -p 3.11 && uv pip install -e '.[mcp]' && .venv/bin/python -m earshot doctor --fetch"; fi
LIB=${LEMO_OPUSCAR_HOME:-$HOME/lemo-opuscar}
if [ -f "$LIB/AGENTS.md" ]; then
  [ -d "$LIB/node_modules" ] && ok "lemo-opuscar library + core packages ($LIB)" || no "lemo-opuscar packages: sh <lemo-opuscar skill>/scripts/setup.sh deps"
else no "lemo-opuscar library (optional 68 extra styles): git clone --depth 1 https://github.com/lemomo-ai/lemo-opuscar ~/lemo-opuscar"; fi
echo "env: EARSHOT_PY=$PY  LOWPOLY_SKILL=${LOWPOLY_SKILL:-$HOME/.claude/skills/lowpoly-video}"
