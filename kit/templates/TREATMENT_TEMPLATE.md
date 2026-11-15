# Treatment Template (`TREATMENT.md`)

Copy this file into your film folder as `TREATMENT.md`. Fill out all eight sections and approve them before writing any drawing code. Keep the script's words, order, names and facts unchanged.

---

## Project metadata

- **Working title:**
- **Format:** 1080x1920 (9:16 vertical) at 30 fps
- **Target duration:** (from `ffprobe` on `audio/vo.wav`, or estimated at 130 to 160 words/min)
- **Style:** (one style from `03_styles/STYLE_CHOOSER.md`)
- **Engine:** HTML seek page (`window.renderFrame(f)`) or Remotion (`MotionKit.tsx`)

---

## 1. Three candidate structures and the chosen one

*Write three distinct structural approaches in 2 to 3 lines each (for example: a single journey; before and after; a countdown or list that turns; problem, failed fix, real fix). The first idea for a style is usually its cliche. Choose one and state why it fits the script best.*

1. **Candidate A (Structure type):**
   - How it unfolds:
2. **Candidate B (Structure type):**
   - How it unfolds:
3. **Candidate C (Structure type):**
   - How it unfolds:

- **Chosen structure and why:**

---

## 2. Logline and arc

*One sentence stating the core point, followed by one subject, one goal, one turn, and an ending that echoes the opening.*

- **Logline:**
- **Setup (first 1 to 3 s hook):**
- **Turn (where the state or meaning shifts):**
- **Ending (bookend, scale reveal, or the thing done right the second time):**
- **Native move at the peak:** (one transition only this medium can do)

---

## 3. Benchmark

*Pick one or two reference works (an ad, launch film, title sequence, or explainer) that set the bar for this style and topic.*

- **Reference work(s):**
- **What to learn:** (composition, pacing, camera grammar, colour logic, score shape)
- **What not to take:** (characters, designs, melodies, specific shots, logos, fonts)

---

## 4. Shot list

*At least four different camera moves and real framing changes across the film (push, pull, parallax, focus pull, frame within frame). Every shot must state why it is framed and moved that way.*

| Shot | Beats covered | Framing (wide/full/medium/close/insert) | Camera move | Duration (s) | Why this shot |
|:---|:---|:---|:---|:---|:---|
| S1 | | | | | |
| S2 | | | | | |
| S3 | | | | | |
| S4 | | | | | |

---

## 5. Beat sheet (second by second)

*Every beat shows visual proof of the exact claim in the script. Nothing rests longer than 1.5 s (36 frames at 30 fps). A new image, state or highlight lands every 0.5 to 1.5 s on a spoken noun.*

| ID | Start (s) | End (s) | Narration / Spoken words | Purpose | Subject & Action | Visual proof | Camera | Required on-screen text | Transition | Continuity keys |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| B01 | 0.00 | | | Hook | | | | | | |
| B02 | | | | | | | | | | |
| B03 | | | | Turn | | | | | | |
| B04 | | | | Payoff | | | | | | |

---

## 6. Cue map

*Lock picture and sound to the same grid before animating. Aim for 0 ms cue error.*

- **Music tempo and bar grid:** (for example: 124 BPM, 1 bar = 1.935 s)
- **Acceleration window:** (where quick changes stack up)
- **Breath / near-silence window:** (held pause before the turn)

| Time (s) | Frame (30 fps) | Visual event on screen | Sound role (`cues.json`) | Caption / Text landing |
|:---|:---|:---|:---|:---|
| 0.10 | 3 | Opening state lands | `land.light` or `hit` | First hook phrase |
| | | | | |

---

## 7. Sound table per section

*Three layers: ambience/bed, foley/SFX in the style's material, and music. Master target: -14 LUFS integrated, true peak at or below -1 dBTP (-1.5 dBTP for AAC).*

| Section | Time range (s) | Ambience / Bed | Main Foley / SFX roles | Music state (level, ducking, bar edits) |
|:---|:---|:---|:---|:---|
| Opening / Hook | | | | Starts within 0.5 s; ducked 6 to 12 dB under VO |
| Body | | | | Steady drive; step down 6 to 12 dB for 0.3 to 0.5 s before big hit |
| Turn & Ending | | | | Near-silence before turn; full body level in last 3 s, 0.1 to 0.5 s fade |

---

## 8. Caption and title design + continuity bible

*Type is part of the style. Keep captions out of the bottom 10 to 15 % and top 8 % of the 1080x1920 frame.*

- **Headline font, weight and treatment:** (word-by-word build, second half in accent or italic)
- **Caption font, size and zone:** (1 to 3 words per phrase on shorts; phrase sits muted, each word turns solid as spoken; held at least 1.8 s and spoken line + 0.6 s)
- **Palette tokens:** (background, primary ink, muted text, single accent, hairline)
- **Continuity keys:** (card footprint, corner radii, border width, icon container sizes, lighting direction)
