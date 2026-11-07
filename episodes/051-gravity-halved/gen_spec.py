# Generates spec.mjs + sfx.json for 051 from words.json timings.  usage: python3 gen_spec.py
import json, os, re
EP = os.path.dirname(os.path.abspath(__file__)) + "/"
W = json.load(open(os.environ.get("WORDS", EP + "words.json")))
norm = lambda x: re.sub(r"[^a-z0-9]", "", x.lower())
NW = [norm(w["w"]) for w in W]
_last = [0]
def find(phrase, after=None):
    """index of the first word of `phrase` (searching forward from the previous match)"""
    toks = [norm(t) for t in phrase.split()]
    st = _last[0] if after is None else after
    for i in range(st, len(NW)):
        if NW[i:i + len(toks)] == toks:
            _last[0] = i + 1; return i
    raise SystemExit(f"phrase not found: {phrase!r} after {st}")
r2 = lambda x: round(x, 2)
def s(i): return W[i]["s"]
def e(i): return W[i]["e"]

iT = find("What if Earth's"); iTe = find("half") ; iA = find("Last time"); iB = find("This time"); iBh = find("half")
iC = find("Seventy kilos"); iC2 = find("thirty-five") if "thirtyfive" in NW else find("thirty")
iD = find("Your jump"); iDm = find("full metre"); iE = find("so the average"); iEd = find("dunk")
iF = find("A dropped"); iF2 = find("slower")
iG = find("Air pressure"); iGe = find("Everest"); iH = find("Storm waves"); iI = find("Bones and"); iJ = find("Trees grow")
iK = find("Over millions"); iKs = find("space"); iL = find("And in orbit"); iLs = find("suddenly"); iM = find("Even the Moon")
iN = find("Would you rather"); iNd = find("dunk"); iNm = find("Moon")
LAST = len(W) - 1
END = r2(e(LAST) + 2.6)
ENDC = r2(s(iN) - 0.08)
b = lambda i: r2(s(i) - 0.05)

C = '{ cam: 0, rise: 0, tilt: 0, panx: 0, shake: 0, ph: 0, pov: 0, wat: 1, lift: 0, wlift: 0, spin: 0, dust: 0, air: 0, splash: 0, hop: 0, tree: 0, gee: 0 }'
K = '{ cx: 4.2, cy: 1.9, cz: 4.2, tx: 0, ty: 1.9, tz: 0.2, lens: 1.25, shake: 0, jt: 0, ghost: 0, phone: 0, drop: 0 }'
O = '{ cx: -4, cy: 9, cz: 38, tx: 10, ty: 13, tz: -46, S: 1, shake: 0, dark: 0.5 }'
B = '{ dist: 7, orb: 0.3, camy: 1.5, tx: 0, ty: 0, lens: 1.6, cyc: 0, et: 0, leak: 0, moon: 0, mq: 6, met: 0, sats: 1, shake: 0 }'
sc = []
def scene(a, bb, g, p, hud=None, extra=""):
    sc.append((r2(a), r2(bb), g, p, hud, extra))

T0 = r2(e(iTe) + 0.15)     # title end
# 0: under the title (hook replaces it while the title is up)
scene(0, b(iA), "lowcity", '{ ...C, cam: [0, 0.3], hop: 0.5 }')
# A: last time (Part 4 recap: everything thrown up by the 1-second flip, ph = 2 s = peak)
scene(b(iA), b(iB), "lowcity", '{ ...C, cam: [0, 0.15], rise: [4.6, 5.0], tilt: [1.9, 2.3], panx: [-0.8, 0.0], ph: [1.7, 2.0], spin: 0.8, dust: 0.4 }',
      '{ cat: "PART 4 · GRAVITY FLIPPED", label: "LAST TIME YOU FLEW", value: "10 m up", sub: "THIS TIME · IT HALVES", dot: "#FFB36B" }')
dB = b(iC) - b(iB); hB = s(iBh) - b(iB)
scene(b(iB), b(iC), "lowcity", f'{{ ...C, cam: [0.3, 0.6], panx: [0.0, 0.3], shake: [[0, 0], [{r2(hB-0.05)}, 0], [{r2(hB+0.05)}, 0.5], [{r2(dB)}, 0]] }}',
      f'{{ cat: "EARTH\'S MASS × ½", label: "GRAVITY", value: "", sub: "HALF THE PULL · SAME SIZE PLANET", vcol: "#5CB8F0", counter: {{ at: {r2(max(0.2, hB-0.3))}, dur: 0.7, from: 9.81, to: 4.91, dec: 2, suffix: " m/s²", easing: "ease-in-out" }} }}')
dC = b(iD) - b(iC)
scene(b(iC), b(iD), "lowcity", f'{{ ...C, cam: [0.6, 0.85], panx: [0.3, 0.6], hop: 0.35, tilt: [0, 0.3] }}',
      f'{{ cat: "YOUR WEIGHT", label: "70 KG FEELS LIKE", value: "", sub: "HALF THE LOAD ON YOUR LEGS", vcol: "#FFD866", counter: {{ at: 0.2, dur: {r2(min(1.6, dC-0.4))}, from: 70, to: 35, suffix: " kg", easing: "ease-in-out" }} }}')
# D: the jump (slow motion, half-g player vs 1 g ghost), apex at jt = 0.64
dD = b(iE) - b(iD)
scene(b(iD), b(iE), "court", f'{{ ...K, cx: [4.6, 4.0], cy: [1.6, 2.0], cz: [5.0, 4.4], ty: [1.5, 2.1], jt: [[0, 0, "linear"], [{r2(dD)}, 0.64, "ease-out"]], ghost: 0.9 }}',
      f'{{ cat: "SAME LEGS · HALF GRAVITY", label: "JUMP HEIGHT", value: "", sub: "GHOST = TODAY · 0.5 M", vcol: "#FFD866", counter: {{ at: 0.2, dur: {r2(min(2.4, dD-0.3))}, from: 0.5, to: 1.0, dec: 2, suffix: " m", easing: "ease-out" }} }}', ", cut: true")
# E: the dunk (other angle)
dE = b(iF) - b(iE)
scene(b(iE), b(iF), "court", f'{{ ...K, cx: [5.2, 4.8], cy: [1.9, 2.2], cz: [-0.3, -0.2], tx: 0, ty: [2.2, 2.5], tz: 0.2, jt: [[0, 0.25, "linear"], [{r2(min(1.3, dE*0.6))}, 0.95, "linear"], [{r2(dE)}, 1.4, "ease-out"]], ghost: 0.7, shake: [[0, 0], [{r2(min(1.3, dE*0.6))}, 0.5], [{r2(dE)}, 0.1]] }}',
      '{ cat: "RIM 3.05 M · TODAY YOU REACH 2.83", label: "YOUR HAND REACHES", value: "3.33 m", sub: "THE AVERAGE MAN CAN DUNK", dot: "#FF8A3D" }', ", cut: true")
# F: phone drop
dF = b(iG) - b(iF)
scene(b(iF), b(iG), "court", f'{{ ...K, cx: [4.3, 4.1], cy: [1.0, 0.9], cz: [5.9, 5.6], tx: 3.2, ty: [0.75, 0.6], tz: 3.4, phone: 1, ghost: 0.9, drop: [[0, 0, "linear"], [0.3, 0, "linear"], [{r2(min(2.6, dF-0.3))}, 0.72, "linear"], [{r2(dF)}, 0.72]] }}',
      f'{{ cat: "DROPPED PHONE · 1.2 M", label: "IMPACT SPEED", value: "", sub: "4.9 → 3.4 M/S · LANDS 41% LATER", vcol: "#5CB8F0", counter: {{ at: 0.3, dur: {r2(min(2.3, dF-0.6))}, from: 0, to: -29, suffix: " %", easing: "linear" }} }}', ", cut: true")
# G: air pressure halves
dG = b(iH) - b(iG)
scene(b(iG), b(iH), "lowcity", '{ ...C, cam: [0, 0.2], rise: [2.0, 3.5], tilt: [1.5, 4.0], panx: [-0.4, 0.4], hop: 0.6, air: [0.1, 1.0] }',
      f'{{ cat: "SAME AIR · HALF THE WEIGHT", label: "AIR PRESSURE", value: "", sub: "= EVEREST BASE CAMP · 5,400 M", vcol: "#FFB36B", counter: {{ at: 0.3, dur: {r2(min(2.0, dG-0.6))}, from: 101.3, to: 50.7, dec: 1, suffix: " kPa", easing: "ease-in-out" }} }}')
# H: storm waves x2
dH = b(iI) - b(iH)
scene(b(iH), b(iI), "ocean", f'{{ ...O, S: [[0, 1.0], [{r2(dH)}, 2.0]], cy: [9, 11], shake: [0.1, 0.5] }}',
      f'{{ cat: "SAME WIND · 20 M/S", label: "STORM WAVES", value: "", sub: "TWICE AS TALL · TWICE AS LONG", vcol: "#5CB8F0", counter: {{ at: 0.1, dur: {r2(max(0.6, dH-0.3))}, from: 8.6, to: 17.1, dec: 1, suffix: " m", easing: "ease-in-out" }} }}', ", cut: true")
# I: bones & muscles
scene(b(iI), b(iJ), "lowcity", '{ ...C, cam: [0.75, 0.95], panx: [0.6, 0.2], hop: 1.0, tilt: [0.4, 0.8] }',
      '{ cat: "OVER MONTHS", label: "BONES & MUSCLES", value: "Weaken", sub: "LESS LOAD · IN 0 G: ~1%/MONTH BONE LOSS", dot: "#FF6B5E" }')
# J: trees grow taller
dJ = b(iK) - b(iJ)
scene(b(iJ), b(iK), "lowcity", '{ ...C, cam: [0.8, 0.95], rise: -0.3, tilt: [3.8, 5.2], panx: [2.2, 2.7], tree: [0, 0.26] }',
      f'{{ cat: "OVER GENERATIONS", label: "MAX TREE HEIGHT", value: "", sub: "HALF THE WEIGHT TO HOLD UP", vcol: "#4FD1A5", counter: {{ at: 0.1, dur: {r2(max(0.6, dJ-0.3))}, from: 0, to: 26, prefix: "+", suffix: " %", easing: "ease-in-out" }} }}')
# K: air leaks into space
dK = b(iL) - b(iK)
scene(b(iK), b(iL), "orbit", '{ ...B, dist: [6.2, 5.4], orb: [0.1, 0.35], camy: 0.8, tx: 0.3, ty: 0.6, leak: [0.15, 1.0], sats: 0 }',
      f'{{ cat: "OVER MILLIONS OF YEARS", label: "ESCAPE SPEED", value: "", sub: "AIR LEAKS INTO SPACE FASTER", vcol: "#5CB8F0", counter: {{ at: 0.3, dur: {r2(min(2.0, dK-0.6))}, from: 11.2, to: 7.9, dec: 1, suffix: " km/s", easing: "ease-in-out" }} }}', ", cut: true")
# L: satellites at escape speed
dL = b(iM) - b(iL); hL = s(iLs) - b(iL)
scene(b(iL), b(iM), "orbit", f'{{ ...B, dist: [7.5, 8.5], orb: [0.25, 0.45], camy: [1.6, 2.2], cyc: [[0, 0, "linear"], [{r2(hL)}, {r2(hL*1.2)}, "linear"], [{r2(dL)}, {r2(hL*1.2)}]], et: [[0, 0, "linear"], [{r2(hL)}, 0, "linear"], [{r2(dL)}, {r2(max(4.0, (dL-hL)*6))}, "ease-in"]], leak: 0.3, shake: [[0, 0], [{r2(hL)}, 0.4], [{r2(hL+0.6)}, 0]] }}',
      '{ cat: "ISS · GPS · EVERY CIRCULAR ORBIT", label: "ORBITAL SPEED", value: "= Escape speed", sub: "√(GM/r) = √(2·½GM/r)", dot: "#FFD866" }', ", cut: true")
# M: the Moon drifts away
dM = b(iN) - b(iM)
scene(b(iM), b(iN) + 0.1, "orbit", f'{{ ...B, dist: [18, 30], orb: [0.5, 0.65], camy: [9, 16], ty: 0.0, cyc: 3.0, et: [10, 22], moon: 1, mq: 3.4, met: [[0, 0.3, "linear"], [{r2(dM)}, 8.0, "ease-in"]], leak: 0.2 }}',
      '{ cat: "HILL SPHERE NOW 1.2 MILLION KM", label: "THE MOON", value: "Drifts away", sub: "THE SUN TAKES IT · TIDES SHRINK", dot: "#C9CED6" }', ", cut: true")
# N: behind the end card
scene(b(iN) + 0.1, END, "court", f'{{ ...K, cx: 4.8, cy: 2.0, cz: -0.2, tx: 0, ty: 2.3, tz: 0.2, jt: [0.3, 1.4], ghost: 0 }}')

lines = []
for a, bb, g, p, h, x in sc:
    hs = f",\n      hud: {h}" if h else ""
    lines.append(f'    {{ a: {a}, b: {bb}, glsl: "{g}"{x}, p: {p}{hs} }},')
def cap(i, j, t): return f'[{r2(s(i)-0.04)}, {r2(e(j)+0.06)}, "{t}"]'
caps = [
  cap(iA, iB - 1, "Last time, it flipped."), cap(iB, iC - 1, "This time, you weigh half."),
  cap(iC, iD - 1, "Seventy kilos feels like thirty-five."),
  cap(iD, iDm - 2, "Your jump doubles,"), cap(iDm - 1, iE - 1, "from half a metre to a full metre,"),
  cap(iE, iF - 1, "so the average man can dunk."),
  cap(iF, iF + 5, "A dropped phone hits the floor"), cap(iF + 6, iG - 1, "29% slower."),
  cap(iG, iG + 3, "Air pressure halves too,"), cap(iG + 4, iH - 1, "like breathing at Everest Base Camp."),
  cap(iH, iI - 1, "Storm waves grow twice as tall."), cap(iI, iJ - 1, "Bones and muscles weaken."), cap(iJ, iK - 1, "Trees grow taller."),
  cap(iK, iK + 3, "Over millions of years,"), cap(iK + 4, iL - 1, "air leaks into space."),
  cap(iL, iL + 2, "And in orbit,"), cap(iL + 3, iM - 1, "every satellite is suddenly at escape speed."),
  cap(iM, iN - 1, "Even the Moon drifts away."),
]
cover = r2(b(iE) + 0.9)
spec = f'''// Episode 051 — What if Earth's gravity was cut in half? (Gravity Part 5)  Style: Higgsfield "Lowpoly Skyline" (see style.md)
// Shaders (shaders/): lowcity (plaza, from 047 + hop/tree), court (jump + dunk + phone drop vs a 1 g ghost), ocean (storm sea x2),
// orbit (satellites on exact parabolic escape paths, the Moon leaving, air leaking). Physics: calc.py / sources.md.
// Generated by gen_spec.py from words.json timings, then checked in previews.
const C = {C};
const K = {K};
const O = {O};
const B = {B};
export default {{
  END: {END},
  gl: "720x1280",
  title: {{ text: "What if Earth's gravity was cut in half?", end: {T0} }},
  hook: {{ scene: 5, at: 0.0 }},
  cover: {cover},
  scenes: [
{chr(10).join(lines)}
  ],
  captions: [
    {(","+chr(10)+"    ").join(caps)},
  ],
  bigs: [{{ at: {r2(s(iDm))}, dur: 0.9, text: "1 m" }}, {{ at: {r2(s(iEd))}, dur: 0.9, text: "DUNK", size: 210, color: "#FF8A3D" }}, {{ at: {r2(s(iGe)-0.1)}, dur: 1.0, text: "½ air", size: 200, color: "#FFB36B" }}, {{ at: {r2(s(iLs)+0.05)}, dur: 1.0, text: "ESCAPE", size: 190, color: "#FFD866" }}],
  flashes: [{{ at: {r2(s(iBh))}, dur: 0.3 }}, {{ at: {r2(s(iEd))}, dur: 0.2 }}, {{ at: {r2(b(iH))}, dur: 0.25 }}, {{ at: {r2(s(iLs))}, dur: 0.3, color: "#FFD866" }}],
  endCard: {{ at: {ENDC}, title: "What if Earth's gravity was cut in half?", small: ["GRAVITY PART 5 · SIMPLIFIED PHYSICS", "EARTH'S MASS HALVED · SAME SIZE · ORBITS NOT TO SCALE"], cta: "WOULD YOU RATHER DUNK, OR KEEP THE MOON?" }},
}};
'''
open(EP + "spec.mjs", "w").write(spec)
sfx = {"END": END,
  "outdoor": [[0, r2(b(iK))]],
  "space": [[r2(b(iK)), r2(ENDC)]],
  "tension": [[r2(b(iG)), r2(ENDC)]],
  "pad": "major",
  "arp": [[0, r2(b(iG))], [ENDC, r2(END - 0.4)]],
  "events": [
    {"k": "whoosh", "t": r2(T0 - 0.1), "d": 0.7, "g": -24},
    {"k": "whoosh", "t": r2(b(iA)), "d": 0.6, "g": -24, "f0": 300, "f1": 1500},
    {"k": "powerdown", "t": r2(s(iBh) - 0.15)}, {"k": "boom", "t": r2(s(iBh))},
    {"k": "tick", "t": r2(b(iC) + 0.3)},
    {"k": "whoosh", "t": r2(b(iD)), "d": 1.6, "g": -20, "f0": 200, "f1": 1800},
    {"k": "tick", "t": r2(s(iDm))},
    {"k": "whoosh", "t": r2(b(iE)), "d": 0.9, "g": -20},
    {"k": "thuds", "t": r2(s(iEd))}, {"k": "crack", "t": r2(s(iEd)), "g": -20},
    {"k": "whoosh_down", "t": r2(b(iF) + 0.3), "d": 1.4, "g": -22},
    {"k": "thuds", "t": r2(b(iF) + min(2.6, b(iG) - b(iF) - 0.3) + 0.0)},
    {"k": "hiss", "t": r2(b(iG)), "d": 2.4},
    {"k": "wind_gust", "t": r2(b(iH) - 0.1), "d": 2.4, "g": -16}, {"k": "splash", "t": r2(b(iH) + 0.6), "g": -16},
    {"k": "rumble", "t": r2(b(iH)), "d": 2.0, "g": -20},
    {"k": "thuds", "t": r2(b(iI) + 0.4), "g": -18},
    {"k": "riser", "t": r2(b(iJ)), "d": r2(b(iK) - b(iJ)), "g": -24},
    {"k": "whoosh", "t": r2(b(iK) - 0.1), "d": 1.2, "g": -22, "f0": 150, "f1": 900}, {"k": "hiss", "t": r2(b(iK) + 0.2), "d": 2.0, "g": -30},
    {"k": "powerdown", "t": r2(s(iLs) - 0.2)}, {"k": "boom", "t": r2(s(iLs))},
    {"k": "whoosh", "t": r2(s(iLs) + 0.05), "d": 1.8, "g": -18, "f0": 200, "f1": 2500},
    {"k": "whoosh", "t": r2(b(iM)), "d": 2.0, "g": -22, "f0": 600, "f1": 200},
    {"k": "chime", "t": ENDC}]}
open(EP + "sfx.json", "w").write(json.dumps(sfx, indent=1))
print("END", END, "title", T0, "ENDC", ENDC, "cover", cover)
for a, bb, g, *_ in sc: print(f"{a:6.2f}-{bb:6.2f} {g}")
