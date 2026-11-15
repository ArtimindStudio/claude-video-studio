"""Render an SFX stem from a cue list with the earshot sound bank.

Run with the earshot interpreter (it has numpy, soundfile and earshot):
  $EARSHOT_PY -I sfx_from_cues.py --cues cues.json --out audio/sfx.wav --duration 32.5 \
      [--music audio/music.wav] [--kit audio/kit.json] [--preset launch]

cues.json: [{"t": 1.20, "role": "pop"}, {"t": 4.0, "role": "whoosh.short"}, {"t": 9.5, "role": "bell", "pitch": "E5"}, ...]
Roles (launch preset): tick, tick.crisp, tock, hit, land, land.light, pop, whoosh.short, whoosh.long, riser, swell,
drop, key, key.space, key.return, click, click.confirm, snap, bell, text.
Each take is placed so its sync point (onset or peak) lands on the cue plus the role's measured offset, levelled
against the music bed when --music is given (else the role's level_db), runs spaced by min_gap_ms, takes
round-robined. Writes the stem (48 kHz stereo, 24-bit) and <out>.placements.json.
"""
import argparse
import json
import os
import subprocess
import sys

import numpy as np
import soundfile as sf

SR = 48000


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--cues', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--duration', type=float, required=True, help='stem length in seconds (the video length)')
    ap.add_argument('--music', help='music bed WAV, to level each effect against it')
    ap.add_argument('--kit', help='kit.json (default: <out dir>/kit.json, created from --preset)')
    ap.add_argument('--preset', default='launch', choices=['launch', 'calm', 'crisp', 'minimal'])
    a = ap.parse_args()

    from earshot.forge import kit as K

    out_dir = os.path.dirname(os.path.abspath(a.out))
    kit_json = a.kit or os.path.join(out_dir, 'kit.json')
    if not os.path.exists(kit_json):
        subprocess.run([sys.executable, '-m', 'earshot', 'kit', 'init', '--preset', a.preset, '-o', kit_json], check=True)
    kit_dir = os.path.join(out_dir, 'kit')
    lock = K.kit_render(kit_json, kit_dir) if hasattr(K, 'kit_render') else K.render(kit_json, kit_dir)
    if isinstance(lock, str) or lock is None:
        lock = json.load(open(os.path.join(kit_dir, 'kit.lock.json')))
    roles = lock['roles']

    cues = json.load(open(a.cues))
    cues = cues.get('cues', cues) if isinstance(cues, dict) else cues
    by_role = {}
    for c in cues:
        by_role.setdefault(c['role'], []).append(c)

    n = int(round(a.duration * SR))
    mix = np.zeros((n, 2), dtype=np.float64)
    placements, skipped = [], []
    for role_name, items in by_role.items():
        role = roles.get(role_name)
        if not role or not role.get('takes'):
            skipped.append(role_name)
            continue
        times = [c['t'] for c in items]
        if role.get('min_gap_ms'):
            spaced = K.space_run(times, role['min_gap_ms'])
            items = [dict(c, t=t) for c, t in zip(sorted(items, key=lambda c: c['t']), spaced)]
        for i, c in enumerate(sorted(items, key=lambda c: c['t'])):
            takes = role['takes']
            if c.get('pitch'):
                pt = [t for t in takes if (t.get('pitch') or '') == c['pitch']]
                takes = pt or takes
            take = takes[i % len(takes)]
            y, sr = sf.read(os.path.join(kit_dir, take['file']), always_2d=True)
            if sr != SR:
                raise SystemExit(f'take {take["file"]} is {sr} Hz, expected {SR}')
            if y.shape[1] == 1:
                y = np.repeat(y, 2, axis=1)
            bed = K.bed_level(a.music, c['t']) if a.music else None
            g = 10 ** ((K.gain_db(take, role, bed) + float(c.get('gain_db', 0))) / 20)
            start = K.place(take, role, c['t'])
            s = int(round(start * SR))
            if s < 0:
                y, s = y[-s:], 0
            e = min(n, s + len(y))
            if e > s:
                mix[s:e] += y[: e - s] * g
            placements.append({'t': c['t'], 'role': role_name, 'file': take['file'], 'start_s': round(start, 4),
                               'gain_db': round(20 * np.log10(g), 2), 'bed_lufs': bed})

    peak = float(np.max(np.abs(mix))) if n else 0.0
    if peak > 0.98:
        mix *= 0.98 / peak
    sf.write(a.out, mix, SR, subtype='PCM_24')
    json.dump({'kit': kit_json, 'placements': placements, 'skipped_roles': skipped, 'peak_before_trim': peak},
              open(a.out + '.placements.json', 'w'), indent=1)
    print(f'wrote {a.out}: {len(placements)} effects, roles skipped: {skipped or "none"}, peak {peak:.2f}')


if __name__ == '__main__':
    main()
