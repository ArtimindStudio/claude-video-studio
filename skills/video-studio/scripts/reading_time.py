#!/usr/bin/env python3
"""Reading-time calculator and beat duration checker for timeline.json (Chapter 6).

Rules from Chapter 6 ("Build the timeline first"):
- Voice estimation (when no VO exists yet): 130 to 160 spoken words per minute (default 145 wpm).
- Minimum hold for a caption phrase: >= 1.8 s, and >= spoken line duration + 0.6 s.
- Minimum hold after text finishes animating in: letters / 15 + 1.5 s (where letters is non-space character count).
- Minimum hold for a title card in a short: >= 1.5 s.

Usage:
  python3 reading_time.py                     # checks timeline.template.json in the same folder
  python3 reading_time.py path/to/timeline.json [--wpm 145] [--in-dur 0.4]
  python3 reading_time.py --text "Old cards blur out while new ones rise in."
"""
import argparse
import json
import sys
from pathlib import Path


def count_words(text: str) -> int:
    return len([w for w in text.strip().split() if w])


def count_letters(text: str) -> int:
    return sum(1 for ch in text if not ch.isspace())


def spoken_seconds(text: str, wpm: float = 145.0) -> float:
    words = count_words(text)
    return (words / wpm) * 60.0 if words else 0.0


def min_caption_hold(text: str, spoken_dur: float | None = None, wpm: float = 145.0, in_dur: float = 0.4) -> dict:
    words = count_words(text)
    letters = count_letters(text)
    est_spoken = spoken_dur if spoken_dur is not None else spoken_seconds(text, wpm)
    rule_phrase_floor = 1.8
    rule_spoken_plus = est_spoken + 0.6
    rule_letters_after_in = in_dur + (letters / 15.0) + 1.5
    required = max(rule_phrase_floor, rule_spoken_plus, rule_letters_after_in)
    return {
        "words": words,
        "letters": letters,
        "spoken_s": round(est_spoken, 2),
        "min_phrase_s": round(rule_phrase_floor, 2),
        "min_spoken_plus_s": round(rule_spoken_plus, 2),
        "min_after_anim_s": round(rule_letters_after_in, 2),
        "required_s": round(required, 2),
    }


def check_timeline(path: Path, wpm: float = 145.0, in_dur: float = 0.4) -> int:
    data = json.loads(path.read_text(encoding="utf-8"))
    beats = data.get("beats", data if isinstance(data, list) else [])
    words_list = data.get("words", []) if isinstance(data, dict) else []

    print(f"Timeline reading-time check: {path.name} ({len(beats)} beats, {wpm:.0f} wpm reference)")
    print("-" * 86)
    print(f"{'Beat ID':<14} {'Start':>6} {'End':>6} {'Dur(s)':>7} {'Req(s)':>7} {'Status':<8} Caption")
    print("-" * 86)

    flagged = 0
    for i, b in enumerate(beats):
        bid = str(b.get("id", f"beat_{i+1:02d}"))
        start = float(b.get("start", b.get("t0", 0.0)))
        end = float(b.get("end", b.get("t1", 0.0)))
        dur = max(0.0, end - start)
        caption = str(b.get("caption", b.get("text", b.get("claim", "")))).strip()
        if not caption:
            print(f"{bid:<14} {start:>6.2f} {end:>6.2f} {dur:>7.2f} {'0.00':>7} {'OK':<8} (no caption)")
            continue

        spoken_dur = b.get("spoken_duration")
        if spoken_dur is None and words_list:
            beat_words = [
                w for w in words_list
                if isinstance(w, dict) and float(w.get("t0", w.get("start", 0.0))) >= start - 0.05
                and float(w.get("t1", w.get("end", 0.0))) <= end + 0.05
            ]
            if beat_words:
                t_first = float(beat_words[0].get("t0", beat_words[0].get("start", start)))
                t_last = float(beat_words[-1].get("t1", beat_words[-1].get("end", end)))
                spoken_dur = max(0.0, t_last - t_first)

        metrics = min_caption_hold(caption, float(spoken_dur) if spoken_dur is not None else None, wpm=wpm, in_dur=in_dur)
        req = metrics["required_s"]
        ok = dur + 1e-6 >= req
        status = "OK" if ok else "TOO LONG"
        if not ok:
            flagged += 1
        short_cap = caption if len(caption) <= 36 else caption[:33] + "..."
        print(f"{bid:<14} {start:>6.2f} {end:>6.2f} {dur:>7.2f} {req:>7.2f} {status:<8} {short_cap}")
        if not ok:
            max_letters = max(0, int((dur - in_dur - 1.5) * 15))
            print(
                f"  -> Fix: extend beat '{bid}' to >= {req:.2f} s, or trim caption to <= {max_letters} letters "
                f"(currently {metrics['letters']} letters, {metrics['words']} words)."
            )

    print("-" * 86)
    if flagged:
        print(f"Result: {flagged} beat(s) flagged. Show fewer words or extend beat duration.")
        return 1
    print("Result: all beats pass Chapter 6 reading-time rules.")
    return 0


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("timeline", nargs="?", help="Path to timeline.json (default: timeline.template.json next to script)")
    ap.add_argument("--text", help="Calculate reading and speaking time for a single string")
    ap.add_argument("--wpm", type=float, default=145.0, help="Spoken words per minute (Chapter 6 range: 130-160, default 145)")
    ap.add_argument("--in-dur", type=float, default=0.4, help="Entrance animation duration in seconds (default 0.4 s = 12 frames at 30 fps)")
    args = ap.parse_args()

    if args.text:
        m = min_caption_hold(args.text, wpm=args.wpm, in_dur=args.in_dur)
        print(json.dumps(m, indent=2))
        return

    default_path = Path(__file__).resolve().parent / "timeline.template.json"
    target = Path(args.timeline) if args.timeline else default_path
    if not target.exists():
        sys.exit(f"File not found: {target}")
    sys.exit(check_timeline(target, wpm=args.wpm, in_dur=args.in_dur))


if __name__ == "__main__":
    main()
