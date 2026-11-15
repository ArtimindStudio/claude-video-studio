#!/usr/bin/env python3
"""Generate a clean 8-bit chiptune music bed (square-wave lead, triangle bass, pulse arpeggio, noise hi-hat) at 48 kHz stereo WAV.

Usage:
  python3 chiptune.py audio/bed.wav --seconds 12 [--bpm 124] [--seed 7]
"""
import argparse
import math
import os
import struct
import wave

SR = 48000
SCALE = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]  # C major pentatonic
BASS = [130.81, 110.00, 87.31, 98.00]  # C2, A1, F1, G1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out")
    ap.add_argument("--seconds", type=float, default=6.0)
    ap.add_argument("--bpm", type=float, default=124.0)
    ap.add_argument("--seed", type=int, default=7)
    a, _ = ap.parse_known_args()

    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    n = max(1, int(round(a.seconds * SR)))
    step_s = 60.0 / a.bpm / 2.0  # eighth-note grid
    buf = bytearray(n * 4)

    for i in range(n):
        t = i / SR
        step = int(t / step_s)
        sub = (t % step_s) / step_s
        env = max(0.0, 1.0 - sub * 0.85)
        f_lead = SCALE[(step * 3 + (step // 4) + a.seed) % len(SCALE)]
        f_bass = BASS[(step // 4) % len(BASS)]
        lead = (0.16 if math.sin(2.0 * math.pi * f_lead * t) >= 0 else -0.16) * env
        bass = (2.0 / math.pi) * math.asin(math.sin(2.0 * math.pi * f_bass * t)) * 0.22
        fade = min(1.0, t / 0.15, max(0.0, (a.seconds - t) / 0.35))
        val = max(-0.95, min(0.95, (lead + bass) * fade))
        s16 = int(val * 32767)
        struct.pack_into("<hh", buf, i * 4, s16, s16)

    with wave.open(a.out, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(buf)
    print(f"wrote chiptune bed {a.out} ({a.seconds:.2f}s @ {a.bpm:.0f} BPM)")


if __name__ == "__main__":
    main()
