# Directing

A film is judged in this order: **sound, rhythm, camera, directing**. Good frames are only the start.

## 1. Intake

- Read everything given: script, VO file, images, logos, style, format, length, caption wish, prior turns.
- Script present: its words, order, names, facts and payoff are locked. Rewrite only on request.
- VO present: `ffprobe` its real length; that is the duration. Never speed up or cut supplied speech.
  No VO: estimate 130-160 words/min plus pauses.
- Captions (subtitles) differ from essential on-screen text (chart labels, signs, UI). "No captions" keeps labels.
- User assets are the source of truth; stylize them into the chosen look. Never invent logos or voices.
- Ask ONE question only when blocked (no idea at all, two exclusive directions, missing identity-critical asset).
  Otherwise choose and write the default into `project.json`.

## 2. Benchmark first

Pick one or two reference works that set the bar for this style AND topic. Write down what to learn
(composition, pacing, camera grammar, colour logic, score shape) and what not to take (characters, designs,
melodies, specific shots, logos, fonts). The benchmark lifts quality more than any rule.

## 3. Story

- One subject, one goal, one turn; it ends differently from how it began.
- **Hook in the first 1-3 s**: the strongest result, number or tension first. No slow logo opener.
- An ending that echoes (bookend, scale reveal, the thing done right the second time).
- **One native move** at the emotional peak: a transition only this medium can do (a fold that becomes the cut,
  ink that blooms into the next scene, a grid snapping into the logo).
- Cut extras. One gag readable at thumbnail size beats three that need explaining.

## 4. Treatment (`TREATMENT.md`, before any drawing)

1. Three candidate structures (journey, before/after, countdown, list that turns...), the chosen one and why.
   The first idea for a style is usually its cliché.
2. Logline and arc: setup, turn, ending.
3. Benchmark: learn / don't take.
4. Shot list: framing (wide/full/medium/close/insert), angle, camera move, duration, and **why**.
5. Beat sheet second by second: `id, start, end, narration, purpose, subject, action, visual proof, camera,
   required text, transition, continuity keys`.
6. Cue map: tempo, bar grid, where every cut, key action and caption lands.
7. Sound table per section: ambience bed, main foley/SFX, music state.
8. Caption and title design (type is part of the style).

Continuity bible: character silhouette, proportions, clothes, props, palette, light direction, type. Nothing
changes between shots unless scripted.

## 5. Camera and performance

- At least four different camera moves and real framing changes. 2D has a camera: push, pull, parallax, focus
  pull, frame within frame.
- One signature shot people remember (oner, scale reveal, medium-made transition).
- Transitions are one consistent grammar made from the medium; no default crossfades.
- At key moments the subject fills at least a third of frame height, clear silhouette, not against an edge.
- Anticipation, action, follow-through on every meaningful move. Blend poses with easing, never snap inside an
  `if` (except a deliberate one-frame comic pop). Check expressions at final size.

## 6. Rhythm and reading time

- Write the cue map before animating; picture locks to the grid. Aim for 0 ms cue error.
- Vary pace: fast and slow, one clear acceleration, one breath (held pause or long take).
- One action, one sound, one cut, but not a cut on every beat.
- Visual change every 0.5-1.5 s tied to a spoken noun (shorts); nothing rests longer than ~1.0-1.5 s.
- Reading time: hold a caption >= 1.8 s and >= spoken line + 0.6 s; after text lands hold
  `letters / 15 + 1.5` s (English); title cards >= 4 s in films (shorts: >= 1.5 s). Faster = fewer words per screen.

## 7. Failures seen most

Subject too small or on the edge; too dark or colour on same colour; captions over the subject; a gag too fast to
read; blank frames in a transition; a tracking effect that loses its subject after a camera move (use one
world-to-screen function); the same template with a new palette; decorative beats that prove nothing.
