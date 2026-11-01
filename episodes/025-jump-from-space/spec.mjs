// Episode 025 — What if you jumped from the edge of space?
// stratos.glsl: alt (km), rad (exaggerated planet radius), pitch/roll/lens/fish camera, jumper in camera space (m).
const ST = { alt: 39, rad: 320, pitch: -0.3, roll: 0, lens: 1.25, fish: 0.6, shake: 0,
  man: 0, mx: 0, my: 0, md: 4, pose: 1, froll: 0, ftilt: 0, fyaw: 0, cap: 0, chute: 0, mach: 0, streak: 0, frost: 0 };
// looking straight down at yourself in free fall (helmet-cam / chase view)
const FALL = { ...ST, pitch: -0.8, fish: 0.4, man: 1, my: -0.15, md: 10, pose: 1 };
export default {
  END: 34.9,
  title: { text: "What if you jumped from the edge of space?", end: 1.95 },
  hook: { scene: 6, at: 1.7 },
  cover: 3.3,
  elapsed: { start: 8.45, end: 24.4, label: "FREE FALL", unit: " s", dec: 0, note: "TIME SPED UP",
    points: [[8.45, 0], [15.9, 34], [17.0, 50], [23.98, 260], [24.4, 260]] },
  scenes: [
    // 0 cold open: inside the capsule door, Earth far below
    { a: 0, b: 2.05, glsl: "stratos", p: { ...ST, cap: 1, man: 1, pose: 0, mx: 0, my: -0.1, md: 4.6, pitch: [-0.22, -0.28], fish: 0.5 } },
    // 1 step off
    { a: 2.05, b: 4.45, glsl: "stratos", p: { ...ST, cap: [1, 0.85], man: 1, pose: [[0, 0], [1.6, 0], [2.4, 0.5]], mx: 0, my: [[0, -0.1], [1.5, -0.1], [2.4, -0.9, "ease-in"]], md: [4.6, 5.0], ftilt: [[0, 0], [1.5, 0], [2.4, 0.5]], pitch: [-0.28, -0.4], fish: 0.5 },
      hud: { at: 0.2, cat: "YOU · ON THE STEP", label: "ALTITUDE", value: "39 km", sub: "3× HIGHER THAN AIRLINERS FLY" } },
    // 2 the sky is black
    { a: 4.45, b: 6.1, glsl: "stratos", p: { ...ST, pitch: [0.0, -0.08], roll: [0.05, 0.0], fish: 0.8 },
      hud: { cat: "39 KM UP", label: "THE SKY", value: "Black", sub: "99% OF THE AIR IS BELOW YOU", dot: "#5CB8F0" } },
    // 3 the Earth curves
    { a: 6.1, b: 8.4, glsl: "stratos", p: { ...ST, rad: 110, pitch: [-0.5, -0.6], roll: [0.0, -0.04], fish: [1.2, 1.5], alt: [39, 38.5] },
      hud: { cat: "BELOW YOU", label: "THE HORIZON", value: "Curved", sub: "YOU SEE 700 KM IN EVERY DIRECTION" } },
    // 4 silent fall
    { a: 8.4, b: 11.5, glsl: "stratos", p: { ...FALL, alt: [38.5, 36.5], froll: [0.0, 0.9], md: [8.5, 11], streak: 0.05 },
      hud: { cat: "AIR PRESSURE", label: "COMPARED TO THE GROUND", value: "< 1%", sub: "NO WIND · NO SOUND", dot: "#4FD1A5" } },
    // 5 armstrong limit
    { a: 11.5, b: 14.0, glsl: "stratos", p: { ...FALL, alt: [36.5, 34.5], md: [6.5, 5.5], my: [0.0, 0.1], froll: [0.9, 1.4], ftilt: [0.2, 0.35], streak: 0.15 },
      hud: { cat: "ABOVE 19 KM · ARMSTRONG LIMIT", label: "WATER BOILS AT", value: "37 °C", sub: "YOUR BODY TEMPERATURE", vcol: "#FF6B5E" } },
    // 6 sound barrier
    { a: 14.0, b: 16.55, glsl: "stratos", p: { ...FALL, alt: [34.5, 32.5], md: [10, 8.5], froll: [1.4, 2.6], roll: [0, 0.3], streak: [0.3, 0.9], mach: [[0, 0], [1.88, 0], [1.9, 0.02], [2.55, 1.0]], shake: [[0, 0.05], [1.85, 0.1], [1.95, 1.0], [2.55, 0.4]] },
      hud: { cat: "34 SECONDS IN", label: "SPEED", value: "Mach 1", sub: "FASTER THAN SOUND · NO PLANE NEEDED", vcol: "#FFD866" } },
    // 7 top speed
    { a: 16.55, b: 19.45, glsl: "stratos", p: { ...FALL, alt: [32.5, 28], md: [8.5, 9.5], froll: [2.6, 3.4], roll: [0.3, 0.6], streak: 1.0, shake: 0.35, fish: 1.1 },
      hud: { cat: "TOP SPEED · 50 SECONDS IN", label: "YOUR SPEED", value: "", sub: "1,357 KM/H · A WORLD RECORD", vcol: "#FF6B5E", counter: { at: 0.2, dur: 1.6, from: 1.0, to: 1.25, dec: 2, prefix: "Mach ", easing: "ease-out" } } },
    // 8 thicker, colder air
    { a: 19.45, b: 22.55, glsl: "stratos", p: { ...FALL, alt: [20, 12], md: [9.5, 11], froll: [3.4, 3.6], roll: [0.6, 0.65], streak: [0.6, 0.2], frost: [0.3, 0.9], shake: [0.25, 0.05] },
      hud: { cat: "20 TO 11 KM", label: "AIR TEMPERATURE", value: "−56 °C", sub: "THICKER AIR SLOWS YOU DOWN", dot: "#5CB8F0", vcol: "#BFE6FF" } },
    // 9 parachute
    { a: 22.55, b: 24.95, glsl: "stratos", p: { ...ST, alt: [3.0, 2.6], pitch: [-0.3, -0.12], fish: 0.5, man: 1, pose: [[0, 1], [1.2, 1], [2.0, 0.1]], my: [[0, -0.3], [1.2, -0.3], [2.4, -0.7]], md: [[0, 10], [1.2, 12], [2.4, 18]], chute: [[0, 0], [1.15, 0], [1.6, 1.0, "back"], [2.4, 1.0]], ftilt: [[0, 1.2], [1.2, 1.2], [2.0, 0]] },
      hud: { cat: "AFTER 4 MIN 20 S OF FREE FALL", label: "PARACHUTE", value: "Open", sub: "YOU FELL 36 KM", dot: "#4FD1A5" } },
    // 10 the record holders
    { a: 24.95, b: 27.65, glsl: "stratos", p: { ...ST, alt: [39, 41.5], pitch: [-0.3, -0.36], fish: 1.2, roll: [-0.05, 0.03] } },
    // 11 not even space
    { a: 27.65, b: 31.2, glsl: "stratos", p: { ...ST, alt: [[0, 41.5], [3.5, 100, "ease-in-out"]], pitch: [[0, -0.28], [3.5, -0.62]], fish: [1.0, 1.15] },
      hud: { at: 1.8, cat: "THE KÁRMÁN LINE", label: "SPACE STARTS AT", value: "100 km", sub: "THEY GOT LESS THAN HALFWAY", vcol: "#FFD866" } },
    // 12 outro
    { a: 31.2, b: 34.9, glsl: "stratos", p: { ...ST, alt: 100, pitch: -0.62, fish: 1.15, roll: [0, 0.06] } },
  ],
  huds: [
    { at: 25.0, dur: 1.15, cat: "OCTOBER 2012", label: "FELIX BAUMGARTNER", value: "39.0 km", sub: "FASTEST FREE FALL · 1,357 KM/H", dot: "#F2C14E" },
    { at: 26.15, dur: 1.5, cat: "OCTOBER 2014", label: "ALAN EUSTACE", value: "41.4 km", sub: "2.5 KM HIGHER", dot: "#F2C14E" },
  ],
  captions: [
    [2.12, 4.3, "You step off a balloon, 39 km up."],
    [4.56, 5.95, "Above you, the sky is black."], [6.18, 7.7, "Below, the Earth curves."],
    [8.5, 11.4, "There's almost no air, so no wind, no sound."],
    [11.66, 13.9, "Without your suit, the spit on your tongue would boil."],
    [14.12, 16.4, "34 seconds in, you break the sound barrier."],
    [16.6, 19.3, "You hit 1,357 km/h."],
    [19.64, 22.4, "Then thicker air brakes you, at −56 degrees."],
    [22.74, 24.6, "Four minutes in, your parachute opens."],
    [25.06, 26.1, "Felix Baumgartner did this."], [26.16, 27.5, "Alan Eustace went higher,"],
    [27.8, 29.2, "and neither of them reached space."], [29.5, 31.0, "That starts at 100 km."],
  ],
  bigs: [{ at: 15.95, dur: 0.9, text: "MACH 1", size: 220 }, { at: 28.45, dur: 0.95, text: "NOT SPACE", size: 170 }],
  flashes: [{ at: 4.42, dur: 0.3 }, { at: 15.9, dur: 0.35 }, { at: 23.75, dur: 0.25 }],
  endCard: { at: 31.25, title: "What if you jumped from the edge of space?", small: ["RECORD JUMPS: BAUMGARTNER 2012 · EUSTACE 2014", "EARTH'S CURVE EXAGGERATED FOR CLARITY"], cta: "WOULD YOU TAKE THE JUMP?" },
};
