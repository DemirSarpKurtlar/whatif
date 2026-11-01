// Episode 034 — What if you fell into Jupiter?
// jupiter.glsl: depth (km below the cloud tops) drives the cloud-deck colour/darkness; figure space in metres.
const JP = { depth: 0, look: 0.5, orb: 1.3, md: 5.5, ty: 0, tx: 0, lens: 1.25, sink: 3, man: 1, burn: 0, bolt: 0, zap: 0, zx: -1.5,
  probe: 0, alive: 0, px: 0, py: 0, pz: 0, chute: 0, press: 0, liq: 0, metal: 0, space: 0, pd: 3, pdy: 0, spin: -0.7, cut: 0, wy: 1.6,
  you: 0, gauge: 0, shake: 0 };
const SP = { ...JP, space: 1, look: 0.25, md: 9, ty: 0.6, lens: 1.4, pdy: 0.25, sink: 0 };
export default {
  END: 34.6,
  title: { text: "What if you fell into Jupiter?", end: 1.6 },
  hook: { scene: 6, at: 0.9 },
  cover: 14.53,
  elapsed: { start: 6.9, end: 30.4, label: "DEPTH", unit: " km", dec: 0, note: "TIME SPED UP",
    points: [[6.9, 0], [8.7, 6], [10.7, 14], [12.8, 32], [13.6, 50], [16.2, 52], [17.0, 150], [24.8, 150], [26.0, 1000], [27.7, 3000], [29.4, 8000], [30.4, 12000]] },
  scenes: [
    // 0 cold open (mostly covered by the hook): drifting toward Jupiter
    { a: 0, b: 1.6, glsl: "jupiter", p: { ...SP, pd: [3.4, 3.0] } },
    // 1 falling in from space
    { a: 1.6, b: 4.0, glsl: "jupiter", p: { ...SP, pd: [[0, 3.0], [2.4, 1.55, "ease-in"]], pdy: [0.25, 0.42], md: [9, 7.5], spin: [-0.7, -0.62], shake: [[0, 0], [2.4, 0.25]] },
      hud: { at: 0.5, cat: "ARRIVAL SPEED", label: "YOU HIT THE CLOUDS AT", value: "", sub: "≈ 215,000 KM/H", vcol: "#FFD866", counter: { at: 0.15, dur: 1.2, from: 0, to: 60, suffix: " km/s", easing: "ease-in" } } },
    // 2 entry: blazing like a meteor above the cloud tops
    { a: 4.0, b: 5.9, glsl: "jupiter", p: { ...JP, depth: [-60, -8], burn: 1, look: 0.28, lens: 1.0, sink: 14, shake: 0.25, orb: [1.25, 1.35] },
      hud: { at: 0.15, cat: "ATMOSPHERIC ENTRY", label: "THE AIR AHEAD OF YOU", value: "Plasma", sub: "GALILEO'S HEAT SHIELD HIT ≈ 15,500 °C", vcol: "#FF9A4D", dot: "#FF9A4D" } },
    // 3 into the cloud tops: no ground
    { a: 5.9, b: 8.7, glsl: "jupiter", p: { ...JP, depth: [[0, -8], [1.0, 0, "linear"], [2.8, 6]], burn: [[0, 1], [1.0, 0.6], [1.6, 0]], look: [0.35, 0.9], orb: [1.35, 1.5], lens: [1.0, 1.2], sink: [14, 3], shake: [[0, 0.25], [1.2, 0]], gauge: [[0, 0], [1.0, 0], [1.6, 1]] },
      hud: { at: 1.4, cat: "JUPITER'S SURFACE", label: "SOLID GROUND", value: "None", sub: "JUST GAS THAT KEEPS GETTING DENSER", vcol: "#FF6B5E" } },
    // 4 layer 1: ammonia ice
    { a: 8.7, b: 10.7, glsl: "jupiter", p: { ...JP, depth: [6, 14], look: [0.9, 0.6], orb: [1.5, 1.7], lens: 1.2, gauge: 1 },
      hud: { at: 0.15, cat: "LAYER 1 · THE CLOUD TOPS", label: "CLOUDS OF", value: "Ammonia ice", sub: "THE WHITE STRIPES YOU SEE FROM SPACE", dot: "#F2EBDD" } },
    // 5 layer 2: ammonium hydrosulfide
    { a: 10.7, b: 12.8, glsl: "jupiter", p: { ...JP, depth: [14, 32], look: [0.6, 0.4], orb: [1.7, 1.9], sink: 4, gauge: 1 },
      hud: { at: 0.15, cat: "LAYER 2", label: "CLOUDS OF", value: "NH4SH", sub: "AMMONIUM HYDROSULFIDE · SMELLS OF ROTTEN EGGS", dot: "#C98A55", vcol: "#E9B98A" } },
    // 6 layer 3: water clouds and lightning
    { a: 12.8, b: 16.2, glsl: "jupiter", p: { ...JP, depth: [[0, 32], [0.8, 50], [3.4, 52]], look: [0.25, 0.12], orb: [1.2, 1.0], sink: [[0, 10], [0.8, 3]], bolt: 1, gauge: 1,
        zap: [[0, 0], [1.45, 0, "linear"], [1.5, 1], [1.6, 1, "linear"], [1.66, 0.3, "linear"], [1.72, 1], [1.95, 0], [2.15, 0, "linear"], [2.2, 0.9], [2.45, 0]] },
      hud: { at: 0.3, cat: "LAYER 3 · 50 KM DOWN", label: "CLOUDS OF", value: "Water", sub: "WHERE JUPITER'S LIGHTNING IS BORN", dot: "#7FB2FF", vcol: "#BFE0FF" } },
    // 7 150 km: pressure
    { a: 16.2, b: 19.6, glsl: "jupiter", p: { ...JP, depth: [[0, 52], [0.8, 150, "ease-out"], [3.4, 150]], sink: [[0, 14], [0.8, 1]], press: [[0, 0], [1.6, 0], [3.4, 0.6]], look: [0.2, 0.15], orb: [1.0, 0.8], md: [5.5, 5.0], shake: [[0, 0.3], [0.8, 0]], gauge: 1 },
      hud: { at: 0.85, cat: "150 KM DOWN", label: "PRESSURE", value: "", sub: "22 × THE AIR PRESSURE ON EARTH", vcol: "#FF6B5E", counter: { at: 1.3, dur: 0.6, from: 1, to: 22, suffix: " bar", easing: "ease-out" } } },
    // 8 150 km: heat
    { a: 19.6, b: 21.3, glsl: "jupiter", p: { ...JP, depth: 150, sink: 1, press: [0.6, 0.8], look: 0.15, orb: [0.8, 0.7], md: [5.0, 4.6], gauge: 1 },
      hud: { at: 0.1, cat: "150 KM DOWN", label: "TEMPERATURE", value: "", sub: "HOTTER THAN BOILING WATER", vcol: "#FF6B5E", dot: "#FF9A4D", counter: { at: 0.2, dur: 1.0, from: 20, to: 153, suffix: " °C", easing: "ease-out" } } },
    // 9 the Galileo probe goes silent
    { a: 21.3, b: 24.8, glsl: "jupiter", p: { ...JP, depth: 150, probe: 1, chute: 1, alive: [[0, 1], [1.95, 1, "linear"], [2.0, 0]], px: -1.8, py: [[0, -0.3], [3.5, 1.4]], pz: -0.8, md: 9, look: 0.1, orb: [0.95, 0.8], ty: 0.9, press: 0.5, sink: 0.6, gauge: 1 },
      hud: { at: 0.6, cat: "GALILEO PROBE · DEC 1995", label: "IT TRANSMITTED FOR", value: "", sub: "THEN THE HEAT AND PRESSURE SILENCED IT", dot: "#F2C14E", counter: { at: 0.2, dur: 1.3, from: 0, to: 58, suffix: " min", easing: "ease-out" } } },
    // 10 you keep sinking: thousands of km
    { a: 24.8, b: 27.7, glsl: "jupiter", p: { ...JP, depth: [[0, 150], [1.2, 1000, "ease-in"], [2.9, 3000]], liq: [[0, 0], [1.6, 0], [2.9, 0.7]], sink: [[0, 1], [1.0, 14]], shake: [[0, 0], [0.8, 0.35]], look: [0.15, -0.2], orb: [0.7, 0.2], md: [5.0, 4.6], press: [0.5, 0.8], gauge: 1 } },
    // 11 liquid hydrogen
    { a: 27.7, b: 29.4, glsl: "jupiter", p: { ...JP, depth: [3000, 8000], liq: [0.7, 1], sink: 6, look: [-0.2, -0.3], orb: [0.2, -0.2], md: 4.6, press: 0.6, shake: 0.1, gauge: 1 },
      hud: { at: 0.2, cat: "THOUSANDS OF KM DOWN", label: "THE HYDROGEN TURNS", value: "Liquid", sub: "THE GAS AROUND YOU BECOMES A FLUID", dot: "#FF7A3D", vcol: "#FFB36B" } },
    // 12 metallic hydrogen
    { a: 29.4, b: 30.45, glsl: "jupiter", p: { ...JP, depth: [8000, 12000], liq: 1, metal: [[0, 0], [0.5, 0, "linear"], [0.7, 1]], sink: 6, look: -0.3, orb: [-0.2, -0.4], md: 4.6, press: 0.6, gauge: 1 },
      hud: { at: 0.5, cat: "≈ 10,000 KM+ · MILLIONS OF BAR", label: "THEN INTO", value: "Metal", sub: "IT CONDUCTS ELECTRICITY", dot: "#7FB2FF", vcol: "#D6E4FF" } },
    // 13 cutaway: where you are
    { a: 30.45, b: 34.6, glsl: "jupiter", p: { ...SP, man: 0, cut: 1, pd: [4.3, 4.8], pdy: 0, look: 0.2, orb: 0.3, ty: 0, lens: 1.3, wy: 1.35, you: 0.17, spin: 0.4 } },
  ],
  captions: [
    [1.7, 3.95, "You'd hit the clouds at 60 km a second,"],
    [4.04, 5.75, "blazing like a meteor."],
    [5.96, 7.2, "Say your suit survives."], [7.32, 8.75, "There's no ground to land on."],
    [8.86, 10.62, "You sink through white ammonia ice clouds,"],
    [10.78, 12.9, "then brown clouds that smell like rotten eggs."],
    [13.0, 14.25, "50 km down,"], [14.3, 16.15, "lightning flashes in clouds of water."],
    [16.28, 17.75, "At 150 km,"], [17.82, 19.6, "the pressure is 22 times Earth's,"],
    [19.72, 21.4, "and it's hotter than boiling water."],
    [21.46, 23.06, "That's where NASA's Galileo probe"], [23.06, 24.9, "went silent in 1995."],
    [24.96, 25.68, "But you keep sinking."], [25.68, 27.8, "Thousands of km down,"],
    [27.84, 29.2, "the hydrogen turns into a liquid."], [29.44, 30.48, "Then into metal."],
    [30.52, 31.5, "How deep would you make it?"],
  ],
  bigs: [{ at: 2.6, dur: 1.0, text: "60 km/s", size: 200 }, { at: 18.4, dur: 0.9, text: "×22" }],
  flashes: [{ at: 4.0, dur: 0.35, color: "#FFB36B" }, { at: 14.3, dur: 0.12, color: "#DDE8FF" }, { at: 15.0, dur: 0.1, color: "#DDE8FF" }, { at: 29.95, dur: 0.3, color: "#CFE0FF" }],
  endCard: { at: 31.6, title: "What if you fell into Jupiter?", small: ["GALILEO PROBE · 7 DEC 1995 · 58 MIN · ≈ 150 KM", "STYLISED · TIME SPED UP · DEPTHS APPROXIMATE"], cta: "HOW DEEP WOULD YOU MAKE IT?" },
};
