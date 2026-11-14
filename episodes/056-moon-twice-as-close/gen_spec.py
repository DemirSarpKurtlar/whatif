# Generates spec.mjs + sfx.json for 056 from words.json timings.  usage: python3 gen_spec.py
# Scene cuts are anchored to spoken words (found by text, in order), so a re-voice only needs a re-run.
import json, os, re
EP = os.path.dirname(os.path.abspath(__file__)) + "/"
W = json.load(open(EP + "words.json"))
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
_cur = [0]
def find(word, start=None):
    """index of the next spoken word matching `word` (prefix match), searching forward from the last hit"""
    i0 = _cur[0] if start is None else start
    for i in range(i0, len(W)):
        if norm(W[i]["w"]).startswith(norm(word)) and norm(word):
            _cur[0] = i + 1
            return i
    raise SystemExit(f"word not found: {word!r} after index {i0}: {[w['w'] for w in W[i0:i0+12]]}")
s = lambda i: W[i]["s"]; e = lambda i: W[i]["e"]
r2 = lambda x: round(x, 2)

iClose = find("close")
iAt = find("At")
iLooks = find("looks")
iSky = find("sky")
iBut = find("But")
iEight = find("eight")
iCubed = find("cubed")
iA = find("A")
iSixteen = find("sixteen")
iEvery = find("Every")
iThirteen = find("thirteen")
iFloods = find("floods")
iDrains = find("drains")
iAway = find("away")
iMoon = find("Moon")
iTen = find("ten")
iDays = find("days")
iTotal = find("Total")
iTen2 = find("ten")
iLasting = find("lasting")
iHalf = find("half")
iHour = find("hour")
iFull = find("Full")
iBrighter = find("brighter")
iAnd = find("And")
iSixty = find("sixty")
iHarder = find("harder")
iWould = find("Would")
iSea = find("sea")
LAST = e(len(W) - 1)

T = {}
T["title"] = r2(e(iClose) + 0.15)
T["b1"] = r2(s(iLooks) - 0.08)      # -> sky view
T["b2"] = r2(s(iBut) - 0.08)        # -> tidal bulge
T["b3"] = r2(s(iA) - 0.06)          # -> tide rises
T["b4"] = r2(s(iEvery) - 0.06)      # -> floods the town
T["b5"] = r2(s(iMoon) - 0.25)       # -> fast orbit
T["b6"] = r2(s(iTotal) - 0.06)      # -> eclipse shadow
T["b7"] = r2(s(iLasting) - 0.06)    # -> totality at the beach
T["b8"] = r2(s(iFull) - 0.06)       # -> bright full moon
T["b9"] = r2(s(iAnd) - 0.06)        # -> spin brakes
T["b10"] = r2(s(iWould) - 0.06)     # -> question
ENDC = r2(LAST + 0.45)
END = r2(ENDC + 3.6)

PL = 'const PL = { dist: 14.0, orb: 0.3, camy: 1.0, tx: 0.0, ty: 3.3, md: 3.6, ma: 0.0, pl: 0.9, ring: 0, ghost: 0, gr: 7.2, bulge: 0, ecl: 0, umb: 0.137, spin: 0, brake: 0 };'
CO = 'const CO = { cam: 0, level: 0, surge: 0, night: 0, moon: 0, shake: 0, tilt: 0, panx: 0, wet: 0, milky: 0, curve: 0, yaw: 0, camh: 0, mrad: 0.025, mlight: 1, ecl: 0, srad: 0.013 };'

def d(a, b): return r2(T[b] - T[a]) if isinstance(a, str) else None
sc = []
def scene(a, b, glsl, p, hud=None, extra=""):
    h = f",\n      hud: {hud}" if hud else ""
    sc.append(f'    {{ a: {r2(a)}, b: {r2(b)}, glsl: "{glsl}"{extra}, p: {p}{h} }},')

# 0 · title + the Moon moves in from its old orbit (ghost ring/Moon stay behind)
L0 = T["b1"]
scene(0, T["b1"], "planets",
  f'{{ ...PL, ring: [[0, 0], [{r2(s(iAt))}, 0.4], [{r2(L0)}, 1]], ghost: [[0, 0], [{r2(s(iAt))}, 1]], md: [[0, 7.2], [{r2(s(iAt)+0.1)}, 7.2], [{r2(L0-0.3)}, 3.6]], ma: [0.05, -0.05], dist: [15.0, 13.5], orb: [0.2, 0.32], spin: [0, 0.3] }}',
  f'{{ at: {r2(s(iAt)-0.1)}, cat: "HALF THE DISTANCE", label: "EARTH → MOON", value: "", sub: "TODAY · 384,400 KM", dot: "#F2C14E", counter: {{ at: 0.1, dur: {r2(L0 - s(iAt) - 0.5)}, from: 384400, to: 192200, suffix: " km", easing: "ease-in-out" }} }}')
# 1 · night sky: the Moon doubles in width
D = T["b2"] - T["b1"]
scene(T["b1"], T["b2"], "coast",
  f'{{ ...CO, night: 1, moon: 1, cam: [0, 0.5], tilt: [0.02, 0.06], mrad: [[0, 0.025], [0.5, 0.025], [{r2(min(D-0.4, 2.6))}, 0.05]], mlight: [[0, 1], [{r2(D)}, 1.6]], yaw: [0.05, -0.05] }}',
  '{ cat: "IN YOUR SKY", label: "THE MOON LOOKS", value: "2× wider", sub: "4× THE AREA · 1° ACROSS", dot: "#F2C14E" }')
# 2 · tidal bulge grows (Moon on the side)
D = T["b3"] - T["b2"]
scene(T["b2"], T["b3"], "planets",
  f'{{ ...PL, md: 3.0, ma: [0.62, 0.7], pl: 1.87, dist: [10.5, 9.0], ty: 1.5, camy: 0.4, bulge: [[0, 0.1], [{r2(s(iEight)-T["b2"])}, 0.2], [{r2(s(iEight)-T["b2"]+1.2)}, 1.0]], spin: [0.3, 0.8] }}',
  f'{{ cat: "TIDAL FORCE ∝ 1 / DISTANCE³", label: "TIDAL PULL", value: "", sub: "HALF THE DISTANCE · 2³ = 8", vcol: "#FF6B5E", counter: {{ at: {r2(s(iEight)-T["b2"]-0.1)}, dur: 1.1, from: 1, to: 8, prefix: "×", easing: "ease-out" }} }}', ", cut: true")
# 3 · a 2 m tide becomes 16 m (beach, water climbs)
D = T["b4"] - T["b3"]
scene(T["b3"], T["b4"], "coast",
  f'{{ ...CO, yaw: [0.22, 0.32], cam: [0.2, 0.45], level: [[0, 0.0], [0.4, 0.1], [{r2(D)}, 1.9]], camh: [[0, 0], [{r2(D)}, 0.6]], surge: 0, wet: 1 }}',
  f'{{ cat: "TIDE RANGE · SIMPLIFIED", label: "LOW TO HIGH WATER", value: "", sub: "8× TODAY\'S LUNAR TIDE", dot: "#5CB8F0", counter: {{ at: 0.3, dur: {r2(max(0.8, e(iSixteen)-T["b3"]-0.4))}, from: 2, to: 16, suffix: " m", easing: "ease-in-out" }} }}')
# 4 · every 13 h the sea floods the seafront town, then drains (dusk)
D = T["b4b"] = None
D = T["b5"] - T["b4"]
pk = s(iFloods) - T["b4"] + 0.6; dr = s(iDrains) - T["b4"]
scene(T["b4"], T["b5"], "coast",
  f'{{ ...CO, yaw: [0.5, 0.62], cam: [0.0, 0.3], night: [0.15, 0.55], moon: 1, mrad: 0.05, level: [[0, 0.6], [{r2(pk)}, 2.7], [{r2(dr)}, 2.6], [{r2(D)}, 0.4]], camh: [[0, 0.6], [{r2(pk)}, 1.6], [{r2(D)}, 0.8]], shake: [[0, 0], [{r2(pk-0.8)}, 0.25], [{r2(pk+0.4)}, 0]], surge: 0 }}',
  '{ cat: "TWICE PER 26.7-HOUR LUNAR DAY", label: "HIGH TIDE EVERY", value: "13 hours", sub: "THEN THE SEA PULLS BACK", dot: "#5CB8F0" }')
# 5 · the Moon whips around a smaller orbit (view from above)
D = T["b6"] - T["b5"]
scene(T["b5"], T["b6"], "planets",
  f'{{ ...PL, ring: 1, ghost: 1, gr: 6.0, md: 3.0, pl: 1.6, orb: 0.3, dist: [10.5, 9.5], ty: 0.0, camy: 6.0, ma: [[0, 1.2, "linear"], [{r2(D)}, {r2(1.2 + D*1.9)}, "linear"]], spin: [0.8, 3.0] }}',
  f'{{ cat: "KEPLER: PERIOD ∝ DISTANCE^1.5", label: "ONE ORBIT", value: "", sub: "TODAY · 27.3 DAYS", dot: "#F2C14E", counter: {{ at: 0.3, dur: {r2(min(1.8, D-0.6))}, from: 27.3, to: 9.7, dec: 1, suffix: " days", easing: "ease-in-out" }} }}')
# 6 · eclipse shadow sweeping Earth
D = T["b7"] - T["b6"]
scene(T["b6"], T["b7"], "planets",
  f'{{ ...PL, md: 3.0, pl: 0.85, orb: 0.6, dist: [7.4, 6.8], ty: 1.0, camy: 0.3, ecl: 1, ma: [1.12, 1.3], spin: [3.0, 3.3] }}',
  f'{{ cat: "SHADOW ≈ 1,750 KM WIDE", label: "TOTAL SOLAR ECLIPSES", value: "", sub: "PER YEAR · TODAY < 1", vcol: "#FFD866", counter: {{ at: {r2(max(0.3, s(iTen2)-T["b6"]-0.9))}, dur: 0.9, from: 0.7, to: 10, dec: 0, prefix: "≈ ", easing: "ease-out" }} }}', ", cut: true")
# 7 · totality from the beach
D = T["b8"] - T["b7"]
scene(T["b7"], T["b8"], "coast",
  f'{{ ...CO, mrad: 0.026, srad: 0.013, ecl: [[0, 0.55], [{r2(min(1.0, D*0.45))}, 1.0]], cam: [0.1, 0.35], tilt: [0.05, 0.08] }}',
  '{ cat: "THE MOON NOW OUT-SIZES THE SUN", label: "TOTALITY", value: "Up to 30 min", sub: "TODAY\'S RECORD · 7.5 MIN", dot: "#F2C14E" }')
# 8 · full moon 4x brighter
D = T["b9"] - T["b8"]
scene(T["b8"], T["b9"], "coast",
  f'{{ ...CO, night: 1, moon: 1, mrad: 0.05, yaw: [0.35, 0.15], cam: [0.3, 0.6], tilt: [0.04, 0.07], mlight: [[0, 1.0], [{r2(min(1.4, D*0.6))}, 2.6]] }}',
  '{ cat: "MOONLIGHT ∝ 1 / DISTANCE²", label: "FULL MOON", value: "4× brighter", sub: "READ A BOOK BY IT", dot: "#F2C14E" }', ", cut: true")
# 9 · Earth's spin brakes 64x harder
D = T["b10"] - T["b9"]
scene(T["b9"], T["b10"], "planets",
  f'{{ ...PL, md: 3.0, ma: 0.66, pl: 1.87, dist: [8.5, 7.8], ty: 1.4, camy: 0.4, bulge: 1, brake: [0, 1], spin: [[0, 1.0, "linear"], [{r2(D)}, {r2(1.0 + D*0.9)}, "linear"]] }}',
  f'{{ cat: "TIDAL TORQUE ∝ 1 / DISTANCE⁶", label: "EARTH\'S SPIN BRAKES", value: "", sub: "+25 MIN TO THE DAY PER MILLION YEARS", vcol: "#FF6B5E", counter: {{ at: 0.3, dur: {r2(max(0.8, e(iHarder)-T["b9"]-0.4))}, from: 1, to: 64, prefix: "×", easing: "ease-out" }} }}')
# 10 · the question: flooded town under a giant moon
D = END - T["b10"]
scene(T["b10"], END, "coast",
  f'{{ ...CO, yaw: [0.45, 0.6], cam: [0.1, 0.35], night: 0.85, moon: 1, mrad: 0.05, mlight: 2.2, level: [2.0, 2.4], camh: 1.3 }}')

caps = [
  (iAt, iSky, "At 192,000 km, it looks twice as wide, and 4× bigger in the sky."),
  (iBut, iCubed, "But tides pull 8× harder, because tidal force grows with distance cubed."),
  (iA, iSixteen, "A 2 metre tide becomes 16."),
  (iEvery, iAway, "Every 13 hours, the sea floods into coastal cities, then drains away."),
  (iMoon, iDays, "The Moon now circles Earth in under 10 days."),
  (iTotal, iTen2 + 1, "Total solar eclipses jump from less than 1 a year to about 10,"),
  (iLasting, iHour, "lasting up to half an hour."),
  (iFull, iBrighter, "Full moons shine 4× brighter."),
  (iAnd, iHarder, "And Earth's spin brakes 64× harder."),
]
def split_cap(a, b, text):
    # long phrases are split in two at a comma / mid word so captions stay two lines max
    return [(a, b, text)]
capl = []
for a, b, t in caps:
    capl.append(f'[{r2(s(a)-0.04)}, {r2(e(b)+0.06)}, "{t}"]')

out = f"""// Episode 056 — What if the Moon were twice as close?  Style: Park Skyline 3D (reuses + adapts 015's shaders, see style.md)
// Generated by gen_spec.py from words.json (scene cuts anchored to spoken words). Physics: calc.py / sources.md.
{PL}
{CO}
export default {{
  END: {END},
  gl: "720x1280",
  title: {{ text: "What if the Moon were twice as close?", end: {T["title"]} }},
  hook: {{ scene: 4, at: {r2(s(iFloods) - T["b4"] - 0.2)} }},
  cover: {r2(T["b7"] + 1.2)},
  scenes: [
{chr(10).join(sc)}
  ],
  captions: [
    {(","+chr(10)+"    ").join(capl)},
  ],
  bigs: [{{ at: {r2(s(iSixteen))}, dur: 0.9, text: "16 m", color: "#5CB8F0" }}, {{ at: {r2(s(iHalf))}, dur: 1.0, text: "30 min", size: 220, color: "#FFD866" }}],
  flashes: [{{ at: {T["b2"]}, dur: 0.2 }}, {{ at: {r2(T["b7"] + min(1.0, (T["b8"]-T["b7"])*0.45))}, dur: 0.3 }}],
  endCard: {{ at: {ENDC}, title: "What if the Moon were twice as close?", small: ["SIMPLIFIED PHYSICS · SAME MOON AT 192,200 KM", "TIDES ×8 · ORBIT 9.7 DAYS · ~10 TOTAL ECLIPSES / YR"], cta: "WOULD YOU STILL LIVE BY THE SEA?" }},
}};
"""
open(EP + "spec.mjs", "w").write(out)

ev = [
  {"k": "riser", "t": 0.1, "d": 1.6, "g": -26}, {"k": "whoosh", "t": T["title"] - 0.3, "d": 0.8, "g": -22},
  {"k": "whoosh_down", "t": r2(s(iAt)), "d": 2.4, "g": -18}, {"k": "rumble", "t": r2(s(iAt) + 0.3), "d": 2.4, "g": -22},
  {"k": "whoosh", "t": T["b1"] - 0.1, "d": 0.7, "g": -24}, {"k": "sparkle", "t": r2(T["b1"] + 1.0), "g": -28},
  {"k": "whoosh", "t": T["b2"] - 0.15, "d": 0.6, "g": -22}, {"k": "boom", "t": r2(s(iEight)), "g": -18},
  {"k": "whoosh", "t": T["b3"] - 0.1, "d": 0.7, "g": -24}, {"k": "splash", "t": r2(T["b3"] + 0.5), "g": -24},
  {"k": "rumble", "t": r2(T["b3"] + 0.4), "d": 2.0, "g": -24},
  {"k": "whoosh", "t": T["b4"] - 0.1, "d": 0.7, "g": -24}, {"k": "splash", "t": r2(s(iFloods)), "g": -16}, {"k": "rumble", "t": r2(s(iFloods) - 0.3), "d": 2.4, "g": -18},
  {"k": "whoosh", "t": r2(s(iDrains)), "d": 1.4, "g": -22, "f0": 2400, "f1": 300},
  {"k": "whoosh", "t": T["b5"] - 0.1, "d": 0.6, "g": -22}, {"k": "tick", "t": r2(T["b5"] + 0.4)}, {"k": "tick", "t": r2(T["b5"] + 0.9)}, {"k": "tick", "t": r2(T["b5"] + 1.4)},
  {"k": "whoosh", "t": T["b6"] - 0.1, "d": 0.6, "g": -22}, {"k": "riser", "t": r2(T["b6"] + 0.2), "d": max(1.0, T["b7"] - T["b6"] - 0.2), "g": -26},
  {"k": "boom", "t": r2(T["b7"] + min(1.0, (T["b8"] - T["b7"]) * 0.45)), "g": -16}, {"k": "chime", "t": r2(s(iHalf))},
  {"k": "whoosh", "t": T["b8"] - 0.1, "d": 0.6, "g": -24}, {"k": "sparkle", "t": r2(s(iBrighter)), "g": -26},
  {"k": "whoosh", "t": T["b9"] - 0.1, "d": 0.6, "g": -22}, {"k": "rumble", "t": r2(T["b9"] + 0.2), "d": T["b10"] - T["b9"], "g": -18},
  {"k": "whoosh", "t": T["b10"] - 0.1, "d": 0.8, "g": -24}, {"k": "splash", "t": r2(T["b10"] + 0.3), "g": -28},
  {"k": "chime", "t": ENDC + 0.1},
]
sfx = {"END": END, "space": [[0, T["b1"]], [T["b2"], T["b3"]], [T["b5"], T["b7"]], [T["b9"], T["b10"]]],
       "outdoor": [[T["b1"], T["b2"]], [T["b3"], T["b5"]], [T["b7"], T["b9"]], [T["b10"], ENDC]],
       "tension": [[T["b2"], T["b5"]], [T["b9"], ENDC]], "pad": "major", "arp": [[0, T["b1"]], [ENDC, END - 0.3]], "events": ev}
open(EP + "sfx.json", "w").write(json.dumps(sfx, indent=1))
print("END", END, "ENDC", ENDC, T)
