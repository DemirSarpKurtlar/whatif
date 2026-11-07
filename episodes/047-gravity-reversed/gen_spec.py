# Generates spec.mjs + sfx.json for 047 from word timings. usage: python3 gen_spec.py words.json
# usage: gen.py words.json [idxmap.json]   (idxmap: script-token index -> words.json index, when tokenisation differs)
import json, sys
W = json.load(open(sys.argv[1]))
M = json.load(open(sys.argv[2])) if len(sys.argv) > 2 else None
def ix(i): return M[str(i)] if M else i
def s(i): return W[ix(i)]["s"]
def e(i): return W[ix(i)]["e"]
r2 = lambda x: round(x, 2)
import os
EP = os.path.dirname(os.path.abspath(__file__)) + "/"
F = s(18) + 0.1            # the flip (on "flips")
T1 = s(34) - 0.05          # ph = 1.0 (one second) -> just before "You coast"
T2 = e(41) + 0.1           # ph = 2.0 (peak) after "storeys"
FALL0 = s(80) - 0.05       # fall starts at "You drop"
IMP = s(85) + 0.12         # impact on "hit"
END = r2(e(104) + 3.0)
ENDC = r2(s(99) - 0.08)
caps = [(7,14,"Last time, it doubled and pinned you down."),(15,18,"This time, it flips."),
  (19,26,"In one second, you fall up 5 metres,"),(27,33,"still rising at 35 km/h."),
  (34,39,"You coast up to 10 metres."),(40,41,"Three storeys."),
  (42,48,"Cars, dogs and people everywhere lift off."),(49,54,"Only things bolted down stay put."),
  (55,61,"Lakes and oceans peel off their beds"),(62,65,"as one giant sheet."),
  (66,70,"The air pulls upward too,"),(71,74,"and your ears pop."),
  (75,79,"Then gravity pulls you back."),(80,83,"You drop 3 storeys"),(84,92,"and hit the ground at 50 km/h."),
  (93,98,"Indoors, you'd only hit the ceiling.")]
capl = ",\n    ".join(f'[{r2(s(a)-0.04)}, {r2(e(b)+0.06)}, "{t}"]' for a,b,t in caps)
def lin(pairs):  # keyframes with linear easing, times relative to scene start
    return "[" + ", ".join(f'[{r2(t)}, {r2(v)}, "linear"]' for t,v in pairs) + "]"
sc = []
def scene(a, b, glsl, p, hud=None, extra=""):
    sc.append((r2(a), r2(b), glsl, p, hud, extra))
B = {}
B["s1"] = s(7) - 0.05; B["s2"] = s(15) - 0.05; B["s3"] = s(19) - 0.05; B["s3b"] = s(27) - 0.05
B["s4"] = T1; B["s5"] = s(42) - 0.05; B["s6"] = s(49) - 0.05; B["s7"] = s(55) - 0.05; B["s8"] = s(66) - 0.05
B["s9"] = s(75) - 0.05; B["s10"] = FALL0; B["s10b"] = IMP; B["s11"] = s(93) - 0.05
# ph mapping helpers (slow motion): F..T1 -> 0..1, T1..T2 -> 1..2
def phAt(t):
    if t <= F: return 0.0
    if t <= T1: return (t - F) / (T1 - F)
    if t <= T2: return 1.0 + (t - T1) / (T2 - T1)
    return 2.0
def phSeg(a, b):  # ph keyframes for scene [a,b] following the main slow-motion clock
    pts = [a, b] + [x for x in (F, T1, T2) if a < x < b]
    pts = sorted(set(pts))
    return lin([(t - a, phAt(t)) for t in pts])
scene(0, B["s1"], "lowcity", "{ ...C, cam: [0, 0.35] }")
scene(B["s1"], B["s2"], "lowcity", "{ ...C, cam: [0.35, 0.7], panx: [0, 0.4] }",
  '{ cat: "PART 3 · GRAVITY ×2", label: "LAST TIME YOU WERE", value: "Pinned down", sub: "THIS TIME · IT FLIPS", dot: "#FFB36B" }')
d2 = B["s3"] - B["s2"]; fl = F - B["s2"]
scene(B["s2"], B["s3"], "lowcity", f'{{ ...C, cam: [0.7, 0.85], panx: 0.4, ph: {phSeg(B["s2"], B["s3"])}, pov: 1, shake: [[0, 0], [{r2(fl-0.05)}, 0], [{r2(fl+0.05)}, 0.9], [{r2(d2)}, 0.35]], dust: [[0, 0], [{r2(fl)}, 0], [{r2(d2)}, 0.6]] }}',
  f'{{ cat: "FOR ONE SECOND", label: "GRAVITY", value: "", sub: "POINTING UP", vcol: "#FF6B5E", counter: {{ at: {r2(max(0.2, fl-0.25))}, dur: 0.5, from: 9.81, to: -9.81, dec: 2, suffix: " m/s²", easing: "ease-in-out" }} }}')
d3 = B["s3b"] - B["s3"]
scene(B["s3"], B["s3b"], "lowcity", f'{{ ...C, cam: 0.85, panx: 0.4, pov: 1, ph: {phSeg(B["s3"], B["s3b"])}, tilt: [0, -1.5], spin: [0.1, 0.45], dust: 0.7, shake: [0.35, 0.15] }}',
  f'{{ cat: "YOU FALL UP", label: "HEIGHT", value: "", sub: "4.9 M AFTER 1 SECOND", vcol: "#FFD866", counter: {{ at: 0, dur: {r2(d3)}, from: {r2(4.905*phAt(B["s3"])**2)}, to: {r2(4.905*phAt(B["s3b"])**2)}, dec: 1, suffix: " m", easing: "ease-in" }} }}')
d3b = B["s4"] - B["s3b"]
scene(B["s3b"], B["s4"], "lowcity", f'{{ ...C, cam: 0.85, panx: 0.4, pov: 1, ph: {phSeg(B["s3b"], B["s4"])}, tilt: [-1.5, -3.5], spin: [0.45, 0.7], dust: 0.7, shake: 0.12 }}',
  f'{{ cat: "AFTER 1 SECOND · 4.9 M UP", label: "STILL RISING AT", value: "", sub: "GRAVITY IS BACK · YOU COAST", vcol: "#FF6B5E", counter: {{ at: 0.1, dur: {r2(min(1.4, d3b-0.3))}, from: 0, to: 35, suffix: " km/h", easing: "ease-out" }} }}', ", cut: true")
d4 = B["s5"] - B["s4"]
scene(B["s4"], B["s5"], "lowcity", f'{{ ...C, cam: 0.85, panx: 0.4, pov: 1, ph: {phSeg(B["s4"], B["s5"])}, tilt: [-3.5, -8.5], spin: [0.7, 0.85], dust: 0.6 }}',
  f'{{ cat: "COASTING UP", label: "PEAK HEIGHT", value: "", sub: "≈ 3 STOREYS UP", vcol: "#FFD866", counter: {{ at: 0.1, dur: {r2(min(2.2, d4-0.5))}, from: 4.9, to: 9.8, dec: 1, suffix: " m", easing: "ease-out" }} }}', ", cut: true")
scene(B["s5"], B["s6"], "lowcity", '{ ...C, cam: [0, 0.15], rise: [4.6, 5.2], tilt: [1.9, 2.5], panx: [-0.8, 0.6], ph: [1.96, 2.04], spin: 0.8, dust: 0.4 }',
  '{ cat: "EVERYWHERE ON EARTH", label: "EVERYTHING LOOSE", value: "Lifts off", sub: "PEOPLE · CARS · DOGS", dot: "#5CB8F0" }')
scene(B["s6"], B["s7"], "lowcity", '{ ...C, cam: [0.8, 0.95], rise: -0.3, tilt: [3.8, 4.8], panx: [2.2, 2.7], ph: 2.0, spin: 0.8, dust: 0.3 }',
  '{ cat: "ANCHORED", label: "TREES · BUILDINGS", value: "Stay put", sub: "ANYTHING BOLTED DOWN HOLDS", dot: "#4FD1A5" }')
scene(B["s7"], B["s8"], "lowcity", '{ ...C, cam: 1, rise: [3.6, 4.6], tilt: [0.3, -0.4], panx: [-1.2, 1.0], ph: [2.0, 2.06], spin: 0.9 }',
  '{ cat: "LAKES & OCEANS", label: "THE WATER LIFTS", value: "~10 m", sub: "THE BED BELOW IS LEFT BARE", dot: "#5CB8F0" }')
d8 = B["s9"] - B["s8"]
scene(B["s8"], B["s9"], "lowcity", '{ ...C, cam: 1, rise: -0.5, tilt: [11, 15], ph: 2.0, spin: 0.9, air: [0, 1], dust: 1 }',
  f'{{ cat: "DURING THAT SECOND", label: "AIR PRESSURE", value: "", sub: "−8% · LIKE CLIMBING 680 M", vcol: "#FFB36B", counter: {{ at: 0.4, dur: {r2(min(2.0, d8-0.8))}, from: 101.3, to: 93.5, dec: 1, suffix: " kPa", easing: "ease-in-out" }} }}')
scene(B["s9"], B["s10"], "lowcity", '{ ...C, cam: 0.85, panx: 0.4, pov: 1, ph: [2.0, 2.15], tilt: [-6, -9], spin: 0.85, shake: 0.08 }',
  '{ cat: "AT THE TOP · T = 2 S", label: "GRAVITY", value: "9.81 m/s²", sub: "NORMAL SINCE 1 S · NOW YOU FALL", dot: "#4FD1A5" }')
dF = B["s10b"] - B["s10"]
scene(B["s10"], B["s10b"], "lowcity", f'{{ ...C, cam: 0.85, panx: 0.4, pov: 1, ph: [[0, 2.15, "linear"], [{r2(dF)}, 3.414]], tilt: [[0, -9], [{r2(dF)}, -1.5]], spin: 0.85, shake: [0.1, 0.4] }}',
  f'{{ cat: "FROM 3 STOREYS", label: "FALL SPEED", value: "", sub: "TAKES 1.4 S", vcol: "#FF6B5E", counter: {{ at: 0, dur: {r2(dF)}, from: 3, to: 50, suffix: " km/h", easing: "linear" }} }}')
d10b = B["s11"] - B["s10b"]
scene(B["s10b"], B["s11"], "lowcity", f'{{ ...C, cam: [0.85, 0.6], panx: 0.4, rise: [0, 1.4], tilt: [[0, -1.5], [0.6, -0.6], [{r2(d10b)}, -0.2]], ph: 4.0, spin: 0.85, shake: [[0, 1.2], [0.6, 0.4], [{r2(d10b)}, 0.1]], splash: [[0, 0.4], [0.7, 1.0], [{r2(d10b)}, 0.6]], dust: [0.3, 0] }}',
  '{ at: 0.3, cat: "SAME MOMENT · T = 3.4 S", label: "THE WATER", value: "Crashes back", sub: "SPLASHING OVER EVERY QUAY", dot: "#5CB8F0" }', ", cut: true")
d11 = END - B["s11"]
hitc = s(98) - B["s11"]
scene(B["s11"], END, "room", f'{{ cam: [0, 0.45], rise: 0, tilt: [0, 0.25], panx: 0, shake: [[0, 0], [{r2(hitc-0.05)}, 0], [{r2(hitc+0.05)}, 0.8], [{r2(hitc+0.8)}, 0.1]], ph: [[0, 0, "linear"], [{r2(hitc)}, 0.43, "linear"], [{r2(d11)}, 0.95]] }}',
  f'{{ cat: "INDOORS", label: "HEAD HITS THE CEILING", value: "", sub: "THEN A ~1 M DROP", vcol: "#FFD866", counter: {{ at: 0.1, dur: {r2(max(0.4, hitc-0.1))}, from: 0, to: 15, suffix: " km/h", easing: "linear" }} }}')
lines = []
for a, b, g, p, h, x in sc:
    hs = f",\n      hud: {h}" if h else ""
    lines.append(f'    {{ a: {a}, b: {b}, glsl: "{g}"{x}, p: {p}{hs} }},')
cover = r2((B["s5"] + B["s6"]) / 2 + 0.3)
spec = f'''// Episode 047 — What if gravity reversed for 1 second? (Gravity Part 4)  Style: Higgsfield "Lowpoly Skyline" (see style.md)
// Shaders: shaders/lowcity.glsl (bright faceted low-poly waterfront city, params listed at its top) + shaders/room.glsl (indoor beat).
// `ph` = physical seconds since gravity flipped; the shader turns it into the real kinematics (4.9 m at 1 s, peak 9.8 m at 2 s,
// landing at 3.41 s / 50 km/h). The whole event is shown in slow motion; the ELAPSED clock shows real seconds.
// Generated from words.json timings (timing constants below), then hand-checked in previews.
const C = {{ cam: 0, rise: 0, tilt: 0, panx: 0, shake: 0, ph: 0, pov: 0, wat: 1, lift: 0, wlift: 0, spin: 0, dust: 0, air: 0, splash: 0 }};
export default {{
  END: {END},
  gl: "720x1280",
  title: {{ text: "What if gravity reversed for 1 second?", end: {r2(e(6)+0.15)} }},
  hook: {{ scene: 6, at: 0.6 }},
  cover: {cover},
  elapsed: {{ start: {r2(F)}, end: {r2(IMP+1.2)}, label: "REAL TIME", unit: " s", dec: 2, note: "SLOW MOTION", points: [[{r2(F)}, 0], [{r2(T1)}, 1.0], [{r2(T2)}, 2.0], [{r2(B["s9"])}, 2.0], [{r2(B["s10"])}, 2.15], [{r2(IMP)}, 3.41], [{r2(IMP+1.2)}, 3.41]] }},
  scenes: [
{chr(10).join(lines)}
  ],
  captions: [
    {capl},
  ],
  bigs: [{{ at: {r2(s(38))}, dur: 1.0, text: "10 m" }}, {{ at: {r2(s(89))}, dur: 1.1, text: "50 km/h", size: 200, color: "#FF6B5E" }}],
  flashes: [{{ at: {r2(F)}, dur: 0.35 }}, {{ at: {r2(T1)}, dur: 0.2 }}, {{ at: {r2(IMP)}, dur: 0.35, color: "#FF3B4E" }}, {{ at: {r2(s(98)+0.05)}, dur: 0.2 }}],
  endCard: {{ at: {ENDC}, title: "What if gravity reversed for 1 second?", small: ["GRAVITY PART 4 · SIMPLIFIED PHYSICS", "UNIFORM FLIP · THE GROUND ITSELF HOLDS"], cta: "WHERE WOULD YOU RATHER BE STANDING?" }},
}};
'''
open(EP + "spec.mjs", "w").write(spec)
sfx = {"END": END,
  "outdoor": [[0, r2(B["s11"])]],
  "tension": [[r2(F), r2(B["s11"])]],
  "pad": "minor",
  "arp": [[0, r2(F - 0.1)], [ENDC, r2(END - 0.4)]],
  "events": [
    {"k": "whoosh", "t": r2(e(6) - 0.1), "d": 0.7, "g": -24},
    {"k": "whoosh", "t": r2(B["s2"]), "d": 0.6, "g": -24, "f0": 300, "f1": 1500},
    {"k": "powerdown", "t": r2(F - 0.15)},
    {"k": "boom", "t": r2(F)}, {"k": "whoosh", "t": r2(F + 0.05), "d": 1.8, "g": -18, "f0": 200, "f1": 2500},
    {"k": "riser", "t": r2(B["s3"] + 0.2), "d": r2(T1 - B["s3"] - 0.2), "g": -22},
    {"k": "tick", "t": r2(T1)}, {"k": "whoosh", "t": r2(T1), "d": 1.0, "g": -22, "f0": 400, "f1": 1600},
    {"k": "tick", "t": r2(s(38))},
    {"k": "whoosh", "t": r2(B["s5"] - 0.1), "d": 0.8, "g": -22},
    {"k": "thuds", "t": r2(B["s6"] + 0.2)},
    {"k": "whoosh", "t": r2(B["s7"] - 0.1), "d": 1.4, "g": -20, "f0": 150, "f1": 900},
    {"k": "rumble", "t": r2(B["s7"] + 0.1), "d": 2.5, "g": -22},
    {"k": "hiss", "t": r2(B["s8"]), "d": 2.4},
    {"k": "whoosh_down", "t": r2(B["s9"]), "d": 0.8, "g": -20},
    {"k": "whoosh_down", "t": r2(B["s10"]), "d": r2(IMP - B["s10"] + 0.1), "g": -16},
    {"k": "boom", "t": r2(IMP)}, {"k": "crack", "t": r2(IMP)}, {"k": "thuds", "t": r2(IMP + 0.03)}, {"k": "rumble", "t": r2(IMP), "d": 2.2, "g": -16},
    {"k": "whoosh", "t": r2(B["s11"] - 0.1), "d": 0.6, "g": -24},
    {"k": "thuds", "t": r2(s(98) + 0.05)},
    {"k": "chime", "t": ENDC}]}
open(EP + "sfx.json", "w").write(json.dumps(sfx, indent=1))
print("END", END, "F", r2(F), "T1", r2(T1), "T2", r2(T2), "IMP", r2(IMP), "ENDC", ENDC, "cover", cover)
for k, v in B.items(): print(k, r2(v), end="  ")
