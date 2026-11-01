// Episode 030 — What if you fell into an active volcano?
// lavalake.glsl: pit crater (rim 240 m above a lava lake at y = 0), crust plates + glowing cracks, gas, thermal view,
// stylized figure in a silver heat suit. Camera = (cx, cy, cz) + figure position when follow = 1.
const LL = { cx: 0, cy: 0, cz: 0, yaw: 0, pitch: 0, roll: 0, lens: 1.2, shake: 0, follow: 0,
  man: 0, fx: 0, fy: 0, fz: 0, pose: 0, froll: 0, ftilt: 0, fyaw: 0,
  crust: 0.8, glow: 1, so2: 0, co2: 0, steam: 0.25, heat: 0, therm: 0, sink: 0, cell: 0, ledge: 0 };
// standing on a rock outcrop at the rim, seen from behind and above
const LEDGE = { ...LL, man: 1, fx: 0, fy: 240, fz: 163, ledge: 1, follow: 1, cx: 0.4, cy: 4.0, cz: 5.0, pitch: -0.9 };
// resting on the crust, face up (camera follows the figure)
const LIE = { ...LL, man: 1, fx: 0, fy: 0.2, fz: 0, pose: 0.35, ftilt: 1.57, sink: 0.12, crust: 0.95, cell: 2.2, follow: 1, steam: 0 };
export default {
  END: 32.4,
  title: { text: "What if you fell into an active volcano?", end: 1.95 },
  hook: { scene: 1, at: 0.0 },
  cover: 4.2,
  scenes: [
    // 0 cold open (mostly behind the hook): at the edge of the crater
    { a: 0, b: 2.95, glsl: "lavalake", p: { ...LEDGE, cy: [4.6, 3.8], cz: [6.0, 4.6], pitch: [-0.85, -0.95] } },
    // 1 the fall
    { a: 2.95, b: 4.75, glsl: "lavalake", p: { ...LL, man: 1, follow: 1, fy: [[0, 205], [1.8, 9, "ease-in"]], pose: 1, ftilt: 1.45, froll: [0, 0.7], cy: 4.5, cz: 2.5, pitch: -1.2, lens: 0.75, shake: [0.05, 0.4] },
      hud: { at: 0.1, cat: "FORGET THE MOVIES", label: "YOU WOULD", value: "Not sink", sub: "LAVA IS NOT WATER", vcol: "#FFB36B" } },
    // 2 molten rock is dense
    { a: 4.75, b: 8.1, glsl: "lavalake", p: { ...LL, cy: [6, 4], cz: [40, 22], cx: [0, -6], yaw: [0, -0.15], pitch: -0.3, crust: 0.35, heat: 0.8, cell: 4, steam: 0 },
      hud: { cat: "MOLTEN ROCK", label: "DENSITY · LAVA vs YOU", value: "", sub: "LAVA ≈ 2.7 g/cm³ · YOUR BODY ≈ 1.0 g/cm³", vcol: "#FFB36B", counter: { at: 1.5, dur: 1.2, from: 1.0, to: 2.7, dec: 1, suffix: "×", easing: "ease-out" } } },
    // 3 landed on the crust
    { a: 8.1, b: 10.5, glsl: "lavalake", p: { ...LIE, cx: [3.5, 2.6], cy: [7.5, 5.8], cz: [1.5, 1.1], yaw: -1.3, pitch: [-1.15, -1.12], shake: [[0, 0.7], [0.6, 0]] },
      hud: { at: 0.15, cat: "WHERE YOU LAND", label: "NOT IN, BUT", value: "On top", sub: "A THIN CRUST OF COOLED LAVA", dot: "#4FD1A5" } },
    // 4 pull up: the crater air is the real danger
    { a: 10.5, b: 11.95, glsl: "lavalake", p: { ...LIE, cx: [2.5, 20], cy: [6, 55], cz: [1, 30], yaw: [-1.19, -0.59], pitch: [-1.15, -0.99], so2: [0, 0.35], steam: [0.3, 1.0] } },
    // 5 sulfur dioxide
    { a: 11.95, b: 13.9, glsl: "lavalake", p: { ...LL, cx: 60, cy: [130, 112], cz: 80, yaw: [-0.8, -0.7], pitch: -0.55, so2: 0.6, steam: 0.8 },
      hud: { cat: "GAS #1", label: "SULFUR DIOXIDE", value: "SO₂", sub: "BURNS YOUR EYES, THROAT AND LUNGS", dot: "#F2C14E", vcol: "#FFE07A" } },
    // 6 carbon dioxide pools low
    { a: 13.9, b: 15.55, glsl: "lavalake", p: { ...LL, cy: [90, 62], cz: [92, 72], pitch: [-0.62, -0.55], co2: [0, 1] },
      hud: { cat: "GAS #2 · INVISIBLE, SHOWN BLUE", label: "CARBON DIOXIDE", value: "CO₂", sub: "HEAVIER THAN AIR · POOLS LOW", dot: "#5CB8F0", vcol: "#9FD8FF" } },
    // 7 sinking into the CO2 layer
    { a: 15.55, b: 17.2, glsl: "lavalake", p: { ...LL, cy: [46, 24], cz: [62, 46], pitch: [-0.45, -0.25], co2: 1, shake: [0, 0.15] },
      hud: { cat: "ABOVE ~30 % CO₂", label: "A FEW BREATHS", value: "Knockout", sub: "UNCONSCIOUS ALMOST AT ONCE", dot: "#5CB8F0", vcol: "#FF6B5E" } },
    // 8 the cracks
    { a: 17.2, b: 19.85, glsl: "lavalake", p: { ...LL, cy: [3.6, 2.6], cz: [20, 12], pitch: -0.35, crust: 0.6, cell: 3, heat: 1, steam: 0 },
      hud: { cat: "UNDER THE CRUST", label: "THE CRACKS", value: "", sub: "CRUST ≈ 300-500 °C · MOLTEN ROCK BELOW", vcol: "#FFB36B", counter: { at: 1.4, dur: 0.8, from: 0, to: 1100, suffix: " °C", easing: "ease-out" } } },
    // 9 thermal camera: you vs the lake
    { a: 19.85, b: 22.6, glsl: "lavalake", p: { ...LIE, therm: 1, cx: [3.2, 4.0], cy: [6.0, 9.0], cz: 1.5, yaw: -1.3, pitch: -1.15 },
      hud: { at: 0.1, cat: "THERMAL VIEW", label: "RADIANT HEAT vs SKIN LIMIT", value: "", sub: "≈ 200 kW/m² · SKIN TOLERATES ≈ 2.5 kW/m²", vcol: "#FF6B5E", counter: { at: 0.7, dur: 1.0, from: 1, to: 80, suffix: "×", easing: "ease-out" } } },
    // 10 Nyiragongo: the lake far below the rim
    { a: 22.6, b: 26.15, glsl: "lavalake", p: { ...LL, cx: 120, cy: [252, 228], cz: 70, yaw: [-1.95, -1.85], pitch: [-0.72, -0.8], lens: 0.9, steam: 0.4 },
      hud: { cat: "NYIRAGONGO · DR CONGO", label: "LAVA LAKE BELOW THE RIM", value: "100s of m", sub: "≈ 1,150 °C · CRATER OVER 1 KM WIDE", dot: "#F2C14E" } },
    // 11 Erta Ale: mostly crust
    { a: 26.15, b: 28.45, glsl: "lavalake", p: { ...LL, cy: [470, 400], cz: 0.1, pitch: -1.5, crust: 0.97, roll: [0, 0.25], steam: 0.15 },
      hud: { cat: "ERTA ALE · ETHIOPIA", label: "LAKE COVERED BY CRUST", value: "> 90 %", sub: "GLOWING CRACKS BETWEEN THE PLATES", dot: "#F2C14E" } },
    // 12 outro (behind the end card)
    { a: 28.45, b: 32.4, glsl: "lavalake", p: { ...LEDGE, cy: [4.2, 3.6], cz: [5.2, 4.4] } },
  ],
  captions: [
    [2.14, 2.9, "Forget the movies."], [3.04, 4.6, "You wouldn't sink."],
    [4.84, 6.1, "Lava is molten rock,"], [6.3, 8.0, "nearly 3 times denser than your body."],
    [8.2, 10.4, "So you'd land on top, on a thin black crust."],
    [10.58, 11.85, "But the crater gets you first."],
    [12.08, 13.8, "Sulfur dioxide burns your throat."],
    [14.06, 15.4, "Carbon dioxide pools low,"], [15.62, 17.1, "and a few breaths can knock you out."],
    [17.34, 19.7, "Under the crust, cracks glow at 1,100 degrees."],
    [20.0, 22.4, "That heat is 80 times what your skin can stand."],
    [22.9, 26.1, "At Nyiragongo, the lava lake sits hundreds of metres below the rim."],
    [26.32, 28.3, "At Erta Ale, most of the lake is crust."],
  ],
  bigs: [{ at: 20.62, dur: 1.0, text: "80×", size: 300 }],
  flashes: [{ at: 8.1, dur: 0.3, color: "#FFB36B" }, { at: 19.85, dur: 0.25 }],
  endCard: { at: 28.45, title: "What if you fell into an active volcano?", small: ["LAVA DENSITY: DEGASSED BASALT · HEAT: BLACK-BODY AT 1,100 °C", "STYLIZED CRATER · CO₂ IS INVISIBLE IN REALITY"], cta: "WOULD YOU LOOK OVER THE EDGE?" },
};
