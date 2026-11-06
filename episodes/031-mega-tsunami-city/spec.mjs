// Episode 031 — What if a 100-metre mega-tsunami hit your city? (body POV from the beach)
// megawave.glsl: beach + city headland (30-storey tower), drawback (level), wave wall (wh height m, wz crest z m).
const MW = { cx: -20, cy: 1.7, cz: 10, yaw: 0.45, tilt: 0.03, lens: 0.95, shake: 0, level: 0, wh: 0, wz: -3000, fish: 0, dark: 0, boat: 1, spray: 0 };
// looking out to sea from the wet sand, sea already pulled back
const SEA = { ...MW, cx: 0, cy: 1.7, cz: 8, yaw: 0.12, tilt: 0.02, lens: 1.05, level: -6, spray: 1 };
const IN = { cx: 0, cy: 26, cz: 34, tx: 0, ty: 0, tz: -28, water: 4.5, front: 0, dark: 0.45, shake: 0 };
const FJ = { cx: 0, cy: 450, cz: 2500, tx: 0, ty: 250, tz: -3000, run: 0, foam: 0, mark: 0, shake: 0 };
const IM = { dist: 90, orb: 0.4, camh: 30, rock: 0, flash: 0, cav: 0, col: 0, ring: 15, wave: 1, shake: 0 };
export default {
  gl: "720x1280",
  END: 34.4,
  title: { text: "What if a 100-metre tsunami hit your city?", end: 1.8 },
  hook: { scene: 10, at: 0.3 },
  cover: 22.4,
  scenes: [
    // 0 cold open (hook plays under the title)
    { a: 0, b: 1.85, glsl: "megawave", p: { ...MW, cz: [12, 10] } },
    // 1 a normal day at the beach
    { a: 1.85, b: 3.85, glsl: "megawave", p: { ...MW, cz: [10, 8], yaw: [0.47, 0.43] },
      hud: { at: 0.15, cat: "YOUR CITY · A NORMAL MORNING", label: "SEA LEVEL", value: "Normal", sub: "WAVES UNDER HALF A METRE", dot: "#4FD1A5" } },
    // 2 the sea pulls back
    { a: 3.85, b: 5.4, glsl: "megawave", p: { ...MW, cz: [8, 6], yaw: [0.43, 0.3], level: [[0, 0], [0.2, 0], [1.55, -6, "ease-out"]] },
      hud: { at: 0.1, cat: "WITHOUT WARNING", label: "THE SEA", value: "Pulls back", sub: "THE WATER DRAINS AWAY FROM THE SHORE", vcol: "#FFB36B" } },
    // 3 the exposed seabed, stranded fish
    { a: 5.4, b: 8.4, glsl: "megawave", p: { ...MW, cx: 3, cy: 0.75, cz: [-28, -33], yaw: [0.15, 0.05], tilt: [-0.2, -0.16], lens: 1.0, level: -6, fish: 1 },
      hud: { cat: "EXPOSED SEABED", label: "THE SHORE MOVES OUT", value: "Hundreds of m", sub: "FISH STRANDED ON THE SAND", dot: "#F2C14E" } },
    // 4 the warning: a white line on the horizon
    { a: 8.4, b: 10.35, glsl: "megawave", p: { ...SEA, lens: 1.6, wh: 13, wz: [-1700, -1550], dark: [0, 0.15] },
      hud: { cat: "THE WARNING SIGN", label: "THE WAVE ARRIVES IN", value: "Minutes", sub: "RUN TO HIGH GROUND", vcol: "#FF6B5E", dot: "#FF3B4E" } },
    // 5 deep ocean: as fast as a jet
    { a: 10.35, b: 13.05, glsl: "deepsea", p: { ...IM, dist: [95, 82], orb: [0.35, 0.6], camh: [32, 24], ring: [[0, 18], [2.7, 62, "linear"]] },
      hud: { cat: "OUT IN THE DEEP OCEAN · 4-5 KM DEEP", label: "THE WAVE'S SPEED", value: "", sub: "YET UNDER 1 M TALL OUT HERE", vcol: "#FFD866", counter: { at: 0.9, dur: 1.3, from: 0, to: 800, suffix: " km/h", easing: "ease-out" } } },
    // 6 like a jet
    { a: 13.05, b: 14.0, glsl: "sky", p: { fly: [0.35, 0.75], climb: 0.08 },
      hud: { cat: "AS FAST AS", label: "A", value: "Jet airliner", sub: "CROSSES AN OCEAN IN LESS THAN A DAY", dot: "#5CB8F0" } },
    // 7 near shore it slows and grows
    { a: 14.0, b: 16.45, glsl: "megawave", p: { ...SEA, lens: 1.6, wh: [15, 26], wz: [-1450, -1050], dark: [0.15, 0.25], tilt: [0.02, 0.03] },
      hud: { cat: "NEAR THE SHORE", label: "IT SLOWS DOWN", value: "", sub: "AND THE WATER PILES UP HIGHER", vcol: "#FFB36B", counter: { at: 0.3, dur: 1.8, from: 800, to: 50, suffix: " km/h", easing: "ease-in-out" } } },
    // 8 2004
    { a: 16.45, b: 18.95, glsl: "megawave", p: { ...SEA, lens: 1.6, wh: [28, 31], wz: [-950, -820], dark: [0.25, 0.32], tilt: [0.03, 0.045] },
      hud: { cat: "2004 · INDIAN OCEAN", label: "WAVE HEIGHT", value: "30 m", sub: "ACEH, INDONESIA", dot: "#F2C14E" } },
    // 9 2011
    { a: 18.95, b: 20.3, glsl: "megawave", p: { ...SEA, lens: 1.6, wh: [40, 42], wz: [-720, -640], dark: [0.32, 0.4], tilt: [0.05, 0.07] },
      hud: { cat: "2011 · TŌHOKU, JAPAN", label: "RUN-UP", value: "40 m", sub: "MIYAKO, IWATE", dot: "#F2C14E" } },
    // 10 yours: 100 m
    { a: 20.3, b: 21.3, glsl: "megawave", p: { ...SEA, wh: 105, wz: [-360, -300], dark: 0.6, tilt: [0.22, 0.3], shake: [0.15, 0.4] } },
    // 11 scale: 30-storey tower
    { a: 21.3, b: 22.95, glsl: "megawave", p: { ...MW, cx: [-170, -185], cy: 14, cz: 250, yaw: [-0.02, 0.02], tilt: 0.1, lens: 1.3, level: -6, wz: [-352, -335], wh: 126, dark: 0.55, spray: 1 },
      hud: { cat: "FOR SCALE", label: "A 30-STOREY BUILDING", value: "≈ 90-100 m", sub: "THE WAVE IS TALLER", vcol: "#FF6B5E" } },
    // 12 inland
    { a: 22.95, b: 24.6, glsl: "inland", p: { ...IN, front: [[0, -7], [1.65, -40, "linear"]], cz: [36, 30], shake: 0.1 },
      hud: { cat: "THEN IT KEEPS GOING", label: "INLAND", value: "Up to 10 km", sub: "2011: 10 KM INLAND NEAR SENDAI", vcol: "#9FD8FF" } },
    // 13 Lituya Bay, wide
    { a: 24.6, b: 27.25, glsl: "fjord", p: { ...FJ, cx: [120, -80], cz: [2600, 2200] },
      hud: { at: 1.4, cat: "LITUYA BAY, ALASKA · 9 JULY 1958", label: "AN EARTHQUAKE DROPS", value: "A mountainside", sub: "30 MILLION m³ OF ROCK INTO THE BAY", dot: "#F2C14E" } },
    // 14 the run-up
    { a: 27.25, b: 30.45, glsl: "fjord", p: { ...FJ, cx: [320, 260], cy: 260, cz: [-900, -1150], tx: -100, ty: 330, tz: -3400, run: [[0, 0], [0.7, 0], [2.4, 524, "ease-out"]], foam: [[0, 0], [0.6, 1], [2.4, 1], [3.2, 0.2]], mark: [[0, 0], [2.4, 0], [2.8, 1]] },
      hud: { cat: "THE WAVE RAN UP THE SLOPE", label: "FOREST STRIPPED TO", value: "", sub: "CYAN LINE · YOUR 100 M WAVE", vcol: "#FF6B5E", counter: { at: 0.7, dur: 1.7, from: 0, to: 524, suffix: " m", easing: "ease-out" } } },
    // 15 under the wall
    { a: 30.45, b: 34.4, glsl: "megawave", p: { ...SEA, cz: 6, wh: 105, wz: [-170, -95], dark: [0.65, 0.8], tilt: [0.35, 0.55], lens: 0.95, shake: [0.3, 0.6] } },
  ],
  captions: [
    [2.04, 2.7, "You're on the beach."],
    [3.94, 5.1, "Then the sea pulls back."],
    [5.52, 6.9, "Hundreds of metres of seabed,"], [7.1, 8.3, "fish flapping on the sand."],
    [8.54, 9.3, "That's the warning."], [9.64, 10.1, "Run."],
    [10.44, 13.0, "In the deep ocean, it moved at 800 km/h,"], [13.14, 13.8, "like a jet."],
    [14.12, 16.1, "Near shore, it slows, and grows."],
    [16.6, 18.8, "In 2004, waves reached 30 metres."], [19.1, 20.2, "In 2011, 40."],
    [20.42, 21.2, "Yours is 100,"], [21.42, 22.8, "taller than a 30-storey building."],
    [23.04, 24.5, "It could push 10 km inland."], [24.72, 25.7, "And it's not the record."],
    [26.1, 27.2, "In 1958,"], [27.26, 30.3, "an Alaskan wave ran 524 metres up a mountain."],
    [30.64, 31.5, "How high would you climb?"],
  ],
  bigs: [{ at: 9.64, dur: 0.75, text: "RUN", color: "#FF6B5E", size: 240 }, { at: 20.84, dur: 0.5, text: "100 m", size: 230 }, { at: 29.1, dur: 1.2, text: "524 m", size: 230 }],
  flashes: [{ at: 9.62, dur: 0.3, color: "#FF3B4E" }, { at: 20.3, dur: 0.3 }, { at: 26.1, dur: 0.25 }],
  endCard: { at: 31.6, title: "What if a 100-metre tsunami hit your city?", small: ["REAL EVENTS: ACEH 2004 · TŌHOKU 2011 · LITUYA BAY 1958", "SIMPLIFIED · A 100 M WAVE IS HYPOTHETICAL"], cta: "HOW HIGH WOULD YOU CLIMB?" },
};
