// Episode 029 — What if you fell out of a plane at cruising altitude?
// plunge.glsl (adapted from 025 stratos): alt (km), rad (exaggerated planet radius), camera pitch/roll/lens/fish,
// falling passenger in camera space (m), airliner in camera space (m, pl/brk), cloud fly-through, blackout, snowy forest.
const PL = { alt: 11, rad: 320, pitch: -0.3, roll: 0, lens: 1.25, fish: 0.5, shake: 0,
  man: 0, mx: 0, my: 0, md: 7, pose: 1, froll: 0, ftilt: 0, fyaw: 0, cap: 0, chute: 0, mach: 0, streak: 0, frost: 0,
  pl: 0, plx: 0, ply: 0, pld: 140, ppit: 0, pyaw: 0, proll: 0, brk: 0, trail: 0, cloud: 0, blk: 0, snow: 1, red: 0, dim: 0 };
// looking down at yourself, belly-down
const FALL = { ...PL, pitch: -1.05, fish: 0.45, man: 1, my: -0.1, md: 7 };
// looking up at the airliner you just fell out of (belly view)
const UP = { ...PL, pitch: 0.95, pl: 1, ppit: -1.5708, trail: 1, man: 1 };
// the broken piece of a plane (Vulović record)
const WR = { ...PL, pl: 1, brk: 1, dim: 1 };
export default {
  END: 33.4,
  title: { text: "What if you fell out of a plane at cruising altitude?", end: 2.05 },
  hook: { scene: 4, at: 1.4 },
  cover: 4.7,
  elapsed: { start: 9.55, end: 20.25, label: "FREE FALL", unit: " s", dec: 0, note: "TIME SPED UP",
    points: [[9.55, 0], [11.0, 15], [13.3, 28], [15.55, 52], [16.7, 62], [18.15, 85], [19.7, 160], [20.25, 160]] },
  scenes: [
    // 0 cruising airliner (only visible without the hook)
    { a: 0, b: 2.05, glsl: "plunge", p: { ...PL, pitch: -0.08, pl: 1, plx: [-8, 4], ply: 4, pld: 150, pyaw: 0.4, trail: 1 } },
    // 1 11 km up
    { a: 2.05, b: 3.9, glsl: "plunge", p: { ...PL, pitch: [-0.06, -0.1], roll: [0.02, -0.02], pl: 1, plx: [-6, 6], ply: [10, 9], pld: [150, 160], pyaw: [0.35, 0.45], trail: 1 },
      hud: { at: 0.4, cat: "CRUISING ALTITUDE", label: "ALTITUDE", value: "11 km", sub: "HIGHER THAN MOUNT EVEREST" } },
    // 2 you fall away from the plane: −56 °C
    { a: 3.9, b: 5.75, glsl: "plunge", p: { ...UP, plx: [4, 8], ply: [26, 80], pld: [130, 300, "ease-out"], pyaw: [0.5, 0.75], md: 7, mx: [-0.4, -0.2], my: [-1.2, -1.5], froll: [0.4, 1.5], ftilt: [0.3, 0.6], frost: [0.0, 0.55] },
      hud: { at: 0.1, cat: "OUTSIDE THE PLANE", label: "AIR TEMPERATURE", value: "−56 °C", sub: "STANDARD AIR AT 11 KM", dot: "#5CB8F0", vcol: "#BFE6FF" } },
    // 3 thin air: tunnel vision closes in
    { a: 5.75, b: 9.45, glsl: "plunge", p: { ...FALL, alt: [10.9, 10.8], md: [6, 6.6], froll: [0.2, 0.5], frost: 0.35,
        red: [[0, 0], [1.2, 0.2], [3.7, 0.85]], blk: [[0, 0], [1.2, 0.1], [2.0, 0.3], [2.3, 0.22], [2.8, 0.55], [3.1, 0.48], [3.7, 0.95]] },
      hud: { at: 1.1, cat: "ONLY 22% OF THE AIR PRESSURE", label: "BEFORE YOU BLACK OUT", value: "", sub: "TIME OF USEFUL CONSCIOUSNESS", vcol: "#FF6B5E", counter: { at: 0.1, dur: 2.4, from: 30, to: 0, suffix: " s", easing: "linear" } } },
    // 4 you drop: 300 km/h in 15 s
    { a: 9.45, b: 13.3, glsl: "plunge", p: { ...FALL, alt: [10.7, 10.0], md: [4.5, 8], my: [0.0, -0.15], froll: [0.0, 1.3], ftilt: [0.0, 0.25], streak: [[0, 0.1], [1.0, 0.5], [3.0, 0.9]], shake: [0.05, 0.3], red: 0.3 },
      hud: { at: 0.9, cat: "15 SECONDS IN", label: "YOUR SPEED", value: "", sub: "THE THIN AIR BARELY SLOWS YOU", vcol: "#FFD866", counter: { at: 0.15, dur: 1.6, from: 0, to: 300, suffix: " km/h", easing: "ease-out" } } },
    // 5 out cold while the air brakes you
    { a: 13.3, b: 15.55, glsl: "plunge", p: { ...FALL, alt: [9.0, 7.2], md: [8, 8.5], froll: [1.3, 1.9], ftilt: 0.25, streak: [0.8, 0.4], shake: [0.25, 0.1], red: 0.75, blk: [0.66, 0.74] },
      hud: { at: 0.1, cat: "YOU'RE OUT COLD · THE AIR THICKENS", label: "YOUR SPEED", value: "", sub: "THICKER AIR = MORE DRAG", vcol: "#FF6B5E", counter: { at: 0.6, dur: 1.4, from: 300, to: 200, suffix: " km/h", easing: "ease-in-out" } } },
    // 6 you wake up
    { a: 15.55, b: 17.3, glsl: "plunge", p: { ...FALL, alt: [6.4, 5.9], md: 7.5, froll: [1.9, 2.2], ftilt: [0.25, 0.1], streak: 0.3, red: [[0, 0.8], [1.0, 0.7], [1.5, 0]], blk: [[0, 0.95], [0.95, 0.9], [1.4, 0.0, "ease-out"]] },
      hud: { at: 1.0, cat: "ABOUT 1 MINUTE IN", label: "ALTITUDE", value: "6 km", sub: "ENOUGH OXYGEN TO WAKE UP", dot: "#4FD1A5" } },
    // 7 still falling: through the clouds
    { a: 17.3, b: 18.15, glsl: "plunge", p: { ...FALL, alt: [3.2, 2.6], md: 7.5, froll: [2.2, 2.35], snow: 1, streak: 0.4, cloud: [[0, 0.1], [0.4, 0.55], [0.85, 0.0]] } },
    // 8 the whole fall: almost 3 minutes — snowy forest coming up
    { a: 18.15, b: 20.3, glsl: "plunge", p: { ...FALL, alt: [2.4, 0.8], pitch: [-1.1, -1.15], md: [7.5, 8.5], my: [0.1, 0.25], froll: [2.35, 2.6], snow: 1, streak: 0.35, shake: 0.12, dim: 1 } },
    // 9 Vulović 1972: a piece of the plane, 10 km up
    { a: 20.3, b: 22.6, glsl: "plunge", p: { ...WR, alt: [10.2, 9.6], pitch: [-0.5, -0.6], fish: 0.7, plx: [-3, 3], ply: [-2, -8], pld: [70, 78], ppit: [0.4, 1.1], pyaw: [0.7, 1.5], proll: [0.2, 0.7] },
      hud: { at: 0.05, cat: "26 JANUARY 1972 · JAT FLIGHT 367", label: "FLIGHT ATTENDANT VESNA VULOVIĆ", value: "10,160 m", sub: "HIGHEST FALL SURVIVED WITHOUT A PARACHUTE", dot: "#F2C14E" } },
    // 10 still falling, inside the wreckage
    { a: 22.6, b: 25.2, glsl: "plunge", p: { ...WR, alt: [2.2, 1.2], pitch: -1.0, fish: 0.5, snow: 1, plx: [2, -2], ply: [4, 0], pld: [80, 92], ppit: [1.1, 1.8], pyaw: [1.5, 2.2], proll: [0.7, 1.1] },
      hud: { at: 0.4, cat: "GUINNESS WORLD RECORD", label: "SHE WAS INSIDE", value: "The wreckage", sub: "BADLY INJURED, BUT ALIVE", dot: "#F2C14E" } },
    // 11 a snowy, wooded slope
    { a: 25.2, b: 27.25, glsl: "plunge", p: { ...WR, alt: [0.5, 0.3], pitch: [-0.85, -0.95], roll: [0.22, 0.26], fish: 0.5, snow: 1, plx: [0, 1], ply: [-2, -8], pld: [70, 78], ppit: [1.8, 2.2], pyaw: [2.2, 2.5], proll: [1.1, 1.3] },
      hud: { at: 0.25, cat: "WHAT SOFTENED THE IMPACT", label: "A STEEP SLOPE WITH", value: "Snow & trees", sub: "SURVIVALS LIKE THIS ARE EXTREMELY RARE", dot: "#4FD1A5" } },
    // 12 a record, not a plan: airliners keep cruising overhead
    { a: 27.25, b: 33.4, glsl: "plunge", p: { ...UP, man: 0, alt: 1.0, pitch: 1.0, plx: [-30, 10], ply: 160, pld: 520, pyaw: 0.6 } },
  ],
  captions: [
    [2.44, 3.6, "You're 11 km up."],
    [3.98, 5.6, "The air is −56 degrees,"], [5.86, 8.5, "and so thin you have about 30 seconds before you black out."],
    [9.52, 9.95, "You drop."], [10.36, 13.1, "15 seconds in, you're doing 300 km/h."],
    [13.46, 15.2, "Then the air thickens and brakes you to 200."],
    [15.64, 17.0, "A minute later, you wake up."], [17.32, 17.95, "Still falling."],
    [18.14, 19.8, "The whole fall takes almost 3 minutes."],
    [20.32, 22.48, "In 1972, Vesna Vulović"], [22.5, 24.98, "survived a 10 km fall inside the wreckage."],
    [25.24, 26.95, "It landed on a snowy, wooded slope."],
    [27.3, 28.42, "That's a record, not a plan."],
  ],
  bigs: [{ at: 19.05, dur: 1.15, text: "≈ 3 MIN", size: 200 }, { at: 27.95, dur: 0.6, text: "NOT A PLAN", size: 130 }],
  flashes: [{ at: 9.5, dur: 0.3 }, { at: 16.62, dur: 0.35 }, { at: 20.3, dur: 0.25 }],
  endCard: { at: 28.5, title: "What if you fell out of a plane at cruising altitude?", small: ["RECORD: VESNA VULOVIĆ, JAT FLIGHT 367, 1972", "SIMPLIFIED PHYSICS · NOT SURVIVAL ADVICE"], cta: "AWAKE FOR THE LANDING, OR NOT?" },
};
