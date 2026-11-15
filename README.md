# Claude Video Studio — Starter Lite (Open-Core Edition)

Make short `9:16` and `16:9` code-rendered videos in **Claude Code**, **Google Antigravity**, and **OpenAI Codex** where every frame is a deterministic function of time (`window.__seek(f)`), captured at 30 fps via headless Chromium and encoded with `ffmpeg`.

This repository is the **free Starter Lite edition** paired with the free 6-page excerpt of **[Make High-Quality Video With Claude](https://aiartimind.com/claude-video-guide/)**.

<p align="center">
  <img src="examples/01_whiteboard.webp" width="260" alt="Style 01: Whiteboard sketch animated loop (included in Starter Lite)">
</p>

---

## 1-Command Install (macOS / Linux / Git Bash)

```bash
git clone https://github.com/ArtimindStudio/claude-video-studio.git ~/.claude/claude-video-studio && sh ~/.claude/claude-video-studio/install.sh
```

**Windows PowerShell:**
```powershell
git clone https://github.com/ArtimindStudio/claude-video-studio.git "$HOME\.claude\claude-video-studio"; powershell -ExecutionPolicy Bypass -File "$HOME\.claude\claude-video-studio\install.ps1"
```

---

## 10-Minute Quickstart (Build Your First Video Today)

1. **Check your local tools (`node`, `ffmpeg`, `playwright`):**
   ```bash
   sh ~/.claude/skills/video-studio/scripts/doctor.sh
   ```
2. **Render the included 90-frame Whiteboard reference scene (`1080x1920 @ 30fps`):**
   ```bash
   node ~/.claude/skills/video-studio/scripts/render_html.mjs \
     ~/.claude/skills/video-studio/kit/scene_v2/whiteboard.html \
     --frames 90 --fps 30 --out whiteboard_demo.mp4
   ```
3. **Direct a new Whiteboard explainer in Claude Code:**
   ```text
   /whiteboard-video Build a 15-second 1080x1920 explainer showing why code-rendered video beats diffusion on sharp typography, with progressive black marker draw-on and a #7C3AED violet callout circle.
   ```

---

## Starter Lite (Free) vs. Complete Studio Edition ($29)

The same 3-second Night Writer script rendered across all 10 code-video engines in the Complete Studio Edition:

![10 Claude Video Styles Contact Sheet](examples/contact_sheet.jpg)

| Capability | Starter Lite (This Repo · Free) | Complete Studio Edition ([$29 Guide & Pro Kit](https://aiartimind.com/claude-video-guide/)) |
|---|---|---|
| **Director's Guide PDF & Web Edition** | Free 6-Page Starter Excerpt ([Download PDF](https://aiartimind.com/claude-video-guide/#sampler)) | **Full 45-Page Guide** across 15 chapters (`GUIDE_v1.pdf` + `GUIDE_v1.html`) |
| **Environment & Frame Renderer** | `doctor.sh` + `render_html.mjs` + `seek-page-starter.html` | Full 4-pass build kit + `reading_time.py` + `sound_check.sh` |
| **Pre-Trained Slash Commands** | **2 commands:** `/video-studio`, `/whiteboard-video` | **All 17 commands:** `/lowpoly-video`, `/pixel-video`, `/flat-video`, `/whiteboard-video`, `/ukiyoe-video`, `/stickman-video`, `/doodle-video`, `/keynote-video`, `/watercolor-video`, `/clay-video`, `/chalkboard-video`, `/dankoe-video`, `/glowsketch-video`, `/comicart-video`, `/editorial-short`, `/video-studio`, `/sound-check` |
| **Code Video Engines & Style Cards** | **1 style:** `01 Whiteboard sketch` (`whiteboard.html`) | **All 10 Style Cards** + **3 dedicated GPU/2D engines** (`lowpoly` Three.js WebGL + GTAO/Bloom/DOF `post.js`, `pixel` 180x320 Bayer dither, `flat` 2D vector) + all 10 `scene_v2/*.html` files |
| **Motion Rules & Code Library** | `MOTION_RULES_POSTER.md` (13 rules reference) | **The MotionKit** — 11 drop-in functions (`BlurSwap`, `drift`, `stagger`, `CountUp`, `SpokenCaption`, etc.) in plain JS (`motion-kit.js`) and React/Remotion (`MotionKit.tsx`) |
| **Frame-Exact Sound & Audio Mix** | Manual `ffmpeg` muxing | **`sfx_from_cues.py` (252 code SFX)** + `chiptune.py` + `-14 LUFS` sidechain ducking & `earshot` QA |
| **Copy-Paste Film Recipes** | 1 starter explainer prompt | **6 complete film recipes** with beat sheets, timings, cue specs & prompts |

👉 **[Get the Complete 45-Page Guide & Pro Starter Kit ($29) →](https://aiartimind.com/claude-video-guide/)**
