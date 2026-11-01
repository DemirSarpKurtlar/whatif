#!/usr/bin/env python3
"""Data-driven sound design. Usage: sfx.py <episode_dir>  (reads sfx.json, writes bed.wav)

sfx.json:
{ "END": 60.7,
  "outdoor": [[0, 12.6], [22.45, 38.95]],      # wind/park ambience ranges
  "space":   [[12.6, 22.45]],                    # low drone ranges
  "tension": [[9.3, 56.45]],                     # sub drone under the stakes
  "pad": "minor" | "major" | "none",
  "arp": [[0, 8.4], [53.35, 60.2]],              # gentle plucked arpeggio ranges
  "events": [ {"k": "whoosh", "t": 12.4, "d": 0.9, "g": -20}, ... ] }
Event kinds: powerdown, boom, riser, whoosh, whoosh_down, bloops, jet, hiss, quake, tick, thuds,
             chime, splash, rain, wind_gust, crack, heartbeat, alarm, glitch, sparkle, rumble, freeze
"""
import json, sys, os
import numpy as np, scipy.signal as ss, scipy.io.wavfile as wf

SR = 48000
ep = sys.argv[1]
C = json.load(open(os.path.join(ep, "sfx.json")))
END = C["END"]; N = int(SR * END)
rng = np.random.default_rng(7)
mus = np.zeros(N); fx = np.zeros(N)
T = lambda t: int(t * SR)
db = lambda d: 10 ** (d / 20)
def env(n, a=0.01, r=0.3):
    e = np.ones(n); na = max(1, min(n // 2, int(a * SR))); nr = max(1, min(n // 2, int(r * SR)))
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr) ** 2; return e
def flt(x, f, kind, o=2):
    b, a = ss.butter(o, np.array(f) / (SR / 2), kind); return ss.lfilter(b, a, x)
lp = lambda x, f, o=2: flt(x, f, "low", o)
hp = lambda x, f, o=2: flt(x, f, "high", o)
bp = lambda x, f1, f2, o=2: flt(x, [f1, f2], "band", o)
def add(buf, t, x, g=1.0):
    i = T(t)
    if i >= N: return
    j = min(N, i + len(x)); buf[i:j] += x[: j - i] * g
def brown(n):
    x = np.cumsum(rng.standard_normal(n)); x = hp(x, 20); return x / (np.max(np.abs(x)) + 1e-9)
white = lambda n: rng.standard_normal(n)
def tt(d): n = T(d); return n, np.arange(n) / SR
def mask(ranges, smooth=2.0, floor=0.0):
    m = np.full(N, floor)
    for a, b in ranges: m[T(a):T(b)] = 1.0
    return lp(m, smooth, 1)
t = np.arange(N) / SR

# ---- beds
if C.get("outdoor"):
    fx += lp(brown(N), 500) * db(-30) * (1 + 0.3 * np.sin(2 * np.pi * 0.13 * t)) * mask(C["outdoor"], 3, 0.12)
if C.get("space"):
    d = (np.sin(2 * np.pi * 55 * t) + 0.5 * np.sin(2 * np.pi * 82.4 * t + 1) + 0.25 * np.sin(2 * np.pi * 164.8 * t)) * db(-31)
    mus += d * mask(C["space"], 1.5) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.2 * t))
if C.get("tension"):
    d = (np.sin(2 * np.pi * 41.2 * t) + 0.5 * np.sin(2 * np.pi * 61.7 * t)) * db(-30)
    mus += d * mask(C["tension"], 1.5) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.5 * t))
note = lambda m: 440 * 2 ** ((m - 69) / 12)
pad = C.get("pad", "minor")
if pad != "none":
    chords = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 55, 60, 64], [55, 59, 62, 67]] if pad == "minor" else \
             [[48, 52, 55, 60], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]]
    k = 0; st = 0.0
    while st < END:
        ln = min(9.5, END - st); n, x0 = tt(ln); x = np.zeros(n)
        for m in chords[k % 4]:
            f = note(m); x += np.sin(2 * np.pi * f * x0) + 0.25 * np.sin(2 * np.pi * 2 * f * x0 + 0.3) + 0.12 * np.sin(2 * np.pi * 3 * f * x0)
        add(mus, st, lp(x, 1800) * env(n, 2.0, 2.5), db(-34)); st += 8.0; k += 1
for a, b in C.get("arp", []):
    s = a; i = 0
    seq = [69, 72, 76, 81, 76, 72] if pad != "major" else [72, 76, 79, 84, 79, 76]
    while s < b:
        n, x0 = tt(0.9); add(mus, s, np.sin(2 * np.pi * note(seq[i % 6] + 12) * x0) * np.exp(-x0 * 4), db(-36)); s += 0.5; i += 1

# ---- event generators
def whoosh(t0, d=0.9, g=-20, f0=300, f1=3000):
    n, x0 = tt(d); x = white(n); out = np.zeros(n); seg = T(0.02)
    for s in range(0, n, seg):
        fc = f0 + (f1 - f0) * (s / n)
        blk = bp(x[max(0, s - seg * 4): s + seg], max(60, fc * 0.6), min(20000, fc * 1.4))
        out[s: s + seg] = blk[-len(out[s: s + seg]):]
    add(fx, t0, out * np.sin(np.pi * x0 / d) ** 2, db(g))
def E_whoosh(e): whoosh(e["t"], e.get("d", 0.9), e.get("g", -20), e.get("f0", 300), e.get("f1", 3000))
def E_whoosh_down(e): whoosh(e["t"], e.get("d", 0.6), e.get("g", -18), 3000, 250)
def E_powerdown(e):
    t0 = e["t"]; n, x0 = tt(1.0); add(fx, t0 - 1.0, hp(white(n), 2000) * (x0 / 1.0) ** 2, db(-24))
    n, x0 = tt(1.4); f = 420 * np.exp(-x0 * 2.6) + 35; add(fx, t0, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x0 * 1.5), db(e.get("g", -12)))
    n, x0 = tt(2.0); add(fx, t0, np.sin(2 * np.pi * 42 * x0) * np.exp(-x0 * 2.0), db(-8))
    add(fx, t0, lp(white(T(0.6)), 1500) * env(T(0.6), 0.002, 0.55), db(-18))
def E_boom(e):
    n, x0 = tt(1.6); add(fx, e["t"], np.sin(2 * np.pi * (60 * np.exp(-x0 * 1.2) + 30) * x0) * np.exp(-x0 * 2.2), db(e.get("g", -6)))
    add(fx, e["t"], lp(white(T(0.25)), 3000) * env(T(0.25), 0.001, 0.24), db(e.get("g", -6) - 8))
def E_riser(e):
    d = e.get("d", 2.4); n, x0 = tt(d); add(fx, e["t"], hp(white(n), 1500) * (x0 / d) ** 2.5, db(e.get("g", -24)))
    f = 200 + 600 * (x0 / d) ** 2; add(fx, e["t"], np.sin(2 * np.pi * np.cumsum(f) / SR) * (x0 / d) ** 2 * 0.5, db(e.get("g", -24)))
def E_bloops(e):
    for k in range(e.get("n", 8)):
        t0 = e["t"] + k * e.get("span", 4.0) / e.get("n", 8) + rng.uniform(0, 0.15)
        n, x0 = tt(0.18); f = 300 + 500 * x0 / 0.18 * (1 + 0.3 * (k % 3))
        add(fx, t0, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x0 * 18), db(e.get("g", -20)))
def E_jet(e):
    d = e.get("d", 6); n, x0 = tt(d); add(fx, e["t"], bp(white(n), 150, 1200) * (0.3 + 0.7 * x0 / d) * env(n, 0.6, 0.5), db(e.get("g", -22)))
def E_hiss(e):
    d = e.get("d", 3); n, x0 = tt(d); add(fx, e["t"], hp(white(n), 3500) * (x0 / d) * env(n, 0.3, 0.4), db(e.get("g", -26)))
def E_quake(e):
    d = e.get("d", 5); n, x0 = tt(d)
    q = lp(brown(n), 90, 3) * (0.3 + 0.7 * x0 / d) * (1 + 0.5 * np.sin(2 * np.pi * 7 * x0)) * env(n, 0.4, 0.15)
    add(fx, e["t"], q, db(e.get("g", -6)))
    for k in range(int(d / 0.55)):
        n2, y = tt(0.5); add(fx, e["t"] + 0.2 + k * 0.52, lp(brown(n2), 180) * np.exp(-y * 6), db(e.get("g", -6) - 8))
def E_rumble(e):
    d = e.get("d", 3); n, x0 = tt(d); add(fx, e["t"], lp(brown(n), 120, 3) * env(n, 0.5, 0.8), db(e.get("g", -10)))
def E_tick(e):
    for f, g in [(1760, 0), (2640, -6)]:
        n, x0 = tt(1.0); add(fx, e["t"], np.sin(2 * np.pi * f * x0) * np.exp(-x0 * 5), db(e.get("g", -20) + g))
def E_thuds(e):
    for k in range(e.get("n", 6)):
        n, x0 = tt(0.25); t0 = e["t"] + k * 0.06 + rng.uniform(0, 0.03)
        add(fx, t0, lp(white(n), 400) * np.exp(-x0 * 25) + np.sin(2 * np.pi * 70 * x0) * np.exp(-x0 * 20), db(e.get("g", -12) - k))
def E_chime(e):
    for f, g in [(880, 0), (1318.5, -4), (1760, -8)]:
        n, x0 = tt(2.5); add(fx, e["t"], np.sin(2 * np.pi * f * x0) * np.exp(-x0 * 1.6), db(e.get("g", -24) + g))
def E_splash(e):
    n, x0 = tt(1.2); add(fx, e["t"], bp(white(n), 400, 6000) * np.exp(-x0 * 3.5) * env(n, 0.005, 0.6), db(e.get("g", -14)))
    add(fx, e["t"], lp(brown(n), 200) * np.exp(-x0 * 4), db(e.get("g", -14) + 2))
def E_rain(e):
    d = e.get("d", 4); n, x0 = tt(d); x = hp(white(n), 1200) * env(n, 0.8, 0.8)
    drops = (rng.random(n) > 0.9993) * rng.uniform(0.3, 1.0, n); x += hp(np.convolve(drops, np.exp(-np.arange(200) / 30), "same"), 800) * 3
    add(fx, e["t"], x, db(e.get("g", -26)))
def E_wind_gust(e):
    d = e.get("d", 2.5); n, x0 = tt(d); add(fx, e["t"], bp(brown(n), 150, 900) * np.sin(np.pi * x0 / d) ** 2, db(e.get("g", -14)))
def E_crack(e):
    n, x0 = tt(0.6); add(fx, e["t"], hp(white(n), 600) * np.exp(-x0 * 14), db(e.get("g", -12)))
    n, x0 = tt(1.5); add(fx, e["t"], lp(brown(n), 150) * np.exp(-x0 * 2.5), db(e.get("g", -12) + 3))
def E_heartbeat(e):
    for k in range(e.get("n", 4)):
        for off, g in [(0, 0), (0.22, -4)]:
            n, x0 = tt(0.25); add(fx, e["t"] + k * e.get("every", 0.9) + off, np.sin(2 * np.pi * 50 * x0) * np.exp(-x0 * 18), db(e.get("g", -10) + g))
def E_alarm(e):
    d = e.get("d", 2); n, x0 = tt(d); f = 700 + 250 * (np.sin(2 * np.pi * 2 * x0) > 0)
    add(fx, e["t"], np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.3 * env(n, 0.02, 0.2), db(e.get("g", -30)))
def E_glitch(e):
    n, x0 = tt(0.35); x = np.sign(np.sin(2 * np.pi * np.cumsum(rng.choice([200, 800, 1600, 3200], n)) / SR)) * (rng.random(n) > 0.3)
    add(fx, e["t"], lp(x, 6000) * env(n, 0.002, 0.1) * 0.4, db(e.get("g", -22)))
def E_sparkle(e):
    for k in range(10):
        n, x0 = tt(0.4); f = rng.uniform(2000, 5000)
        add(fx, e["t"] + k * 0.07, np.sin(2 * np.pi * f * x0) * np.exp(-x0 * 12), db(e.get("g", -30)))
def E_freeze(e):
    n, x0 = tt(1.6); x = hp(white(n), 2500) * np.exp(-x0 * 2.5)
    for k in range(12):
        n2, y = tt(0.05); add(fx, e["t"] + rng.uniform(0, 1.0), hp(white(n2), 3000) * np.exp(-y * 120), db(e.get("g", -18)))
    add(fx, e["t"], x, db(e.get("g", -18) - 4))

G = globals()
for e in C.get("events", []):
    fn = G.get("E_" + e["k"])
    if fn is None: print("unknown event", e["k"]); continue
    fn(e)
out = mus + fx
st = np.stack([out, np.roll(out, int(0.012 * SR))], 1)
pk = np.max(np.abs(st))
if pk > 0.95: st *= 0.95 / pk
wf.write(os.path.join(ep, "bed.wav"), SR, (st * 32767).astype(np.int16))
print("bed.wav ok, peak", round(float(pk), 3))
