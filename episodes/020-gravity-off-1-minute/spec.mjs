// Episode 020 — What if gravity switched off for 1 minute? (Part 2)
const PK = { cam: 0, lift: 0, float: 0, rise: 0, shake: 0, panx: 0, tilt: 0 };
const EA = { dist: 5.6, orb: 0.3, camy: 0, tx: 0, ty: 0, spin: 0, leak: 0, quake: 0, shake: 0, sun: 0.6, diag: 0 };
export default {
  END: 35.0,
  title: { text: "What if gravity switched off for 1 minute?", end: 2.42 },
  hook: { scene: 5, at: 1.2 },
  elapsed: { start: 6.95, end: 24.75, note: "TIME SPED UP", points: [[6.95, 0], [13.0, 10], [14.6, 30], [16.3, 60], [24.75, 60]] },
  scenes: [
    { a: 0, b: 2.45, glsl: "park", p: { ...PK, cam: [0, 0.4] } },
    { a: 2.45, b: 6.9, glsl: "park", p: { ...PK, cam: [0.4, 1.0], lift: [[0, 0], [1.0, 0.9], [3.1, 1.0], [3.7, 0, "ease-in"], [4.45, 0]], rise: [[0, 0], [1.0, 0.8], [3.1, 0.9], [3.7, 0, "ease-in"], [4.45, 0]], shake: [[0, 0], [3.65, 0], [3.75, 0.5], [4.2, 0]] }, hud: { cat: "PART 1 · 10 SECONDS", label: "YOU FLOATED", value: "+1 m", sub: "AND LANDED FINE", dot: "#4FD1A5" } },
    { a: 6.9, b: 10.25, glsl: "earth", p: { ...EA, dist: [5.6, 4.0], ty: [0, 0.5], spin: [0, 0.4], diag: [[0, 0], [0.8, 0], [3.3, 0.6]] }, hud: { at: 0.1, cat: "THIS TIME · 60 SECONDS", label: "GRAVITY", value: "0.00 m/s²", sub: "THE GROUND FALLS AWAY FASTER AND FASTER", vcol: "#FF6B5E" } },
    { a: 10.25, b: 12.95, glsl: "earth", p: { ...EA, dist: [4.0, 3.2], ty: [0.5, 0.75], tx: [0, -0.2], spin: [0.4, 0.7], diag: [0.6, 1.0] }, hud: { cat: "EARTH KEEPS SPINNING", label: "YOU MOVE IN A", value: "Straight line", sub: "THE GROUND CURVES AWAY BENEATH YOU" } },
    { a: 12.95, b: 14.55, glsl: "park", p: { ...PK, cam: 1.0, lift: [0.6, 1.0], rise: [0.5, 1.0], tilt: [-0.3, -0.6] }, hud: { cat: "10 SECONDS", label: "HEIGHT", value: "1 m", sub: "STILL HARMLESS", dot: "#4FD1A5" } },
    { a: 14.55, b: 16.25, glsl: "park", p: { ...PK, cam: 1.0, lift: [1.0, 8.5], rise: [1.0, 9.0], tilt: [-0.6, -4.0] }, hud: { cat: "30 SECONDS", label: "HEIGHT", value: "9 m", sub: "A THIRD-FLOOR WINDOW", dot: "#F2C14E" } },
    { a: 16.25, b: 19.75, glsl: "park", p: { ...PK, cam: [1.0, 0.3], lift: [8.5, 33], rise: [[0, 9], [3.0, 35, "ease-out"], [3.5, 35]], tilt: [[0, -4], [3.0, -22], [3.5, -23]] }, hud: { cat: "60 SECONDS", label: "HEIGHT", value: "9 m", sub: "≈ 12 STOREYS UP", vcol: "#FF6B5E", counter: { at: 0.1, dur: 2.8, from: 9, to: 35, suffix: " m" } } },
    { a: 19.75, b: 22.25, glsl: "earth", p: { ...EA, dist: [4.6, 4.1], spin: [0.9, 1.05], leak: [0.1, 0.9] }, hud: { cat: "HIGH ABOVE YOU", label: "THE AIR", value: "Drifting away", sub: "INTO SPACE", dot: "#5CB8F0" } },
    { a: 22.25, b: 24.25, glsl: "sky", p: { fly: [0.3, 1], climb: [0.2, 1] }, hud: { cat: "EVERY PLANE", label: "STILL", value: "Climbing", sub: "LIFT WITH NO WEIGHT" } },
    { a: 24.25, b: 28.65, glsl: "park", p: { ...PK, cam: 0.6, lift: [[0, 33], [0.55, 33], [2.8, 0, "ease-in"], [4.4, 0]], rise: [[0, 35], [0.55, 35], [2.8, 0.2, "ease-in"], [4.4, 0.2]], tilt: [[0, -23], [0.55, -23], [2.6, -2], [2.8, 0], [4.4, 0]], shake: [[0, 0], [2.75, 0], [2.85, 1.0], [4.4, 0.15]] } },
    { a: 28.65, b: 35.0, glsl: "earth", p: { ...EA, dist: [7.5, 8.5], orb: [0.9, 1.0], spin: [1.4, 1.5], sun: 1.6, tx: [-0.6, -0.8] } },
  ],
  huds: [
    { at: 24.8, dur: 1.25, cat: "GRAVITY SNAPS BACK", label: "GRAVITY", value: "9.81 m/s²", sub: "EVERYTHING FALLS AT ONCE", dot: "#4FD1A5" },
    { at: 26.06, dur: 2.55, cat: "FROM 12 STOREYS", label: "IMPACT SPEED", value: "0 km/h", sub: "LIKE A CAR CRASH", vcol: "#FF6B5E", counter: { at: 0.2, dur: 1.4, from: 0, to: 95, suffix: " km/h" } },
  ],
  captions: [
    [2.48, 3.95, "Last time, 10 seconds was harmless."], [4.44, 6.2, "You floated up a metre and landed fine."],
    [7.04, 8.6, "But the longer it lasts,"], [8.68, 10.1, "the faster the ground falls away."],
    [10.36, 11.6, "Earth keeps spinning."], [11.66, 12.9, "You fly in a straight line."],
    [13.06, 14.5, "10 seconds: 1 metre."], [14.64, 16.2, "30 seconds: 9 metres."],
    [16.34, 18.3, "60 seconds: 35 metres."], [18.5, 19.7, "That's 12 storeys up."],
    [19.8, 22.1, "Above you, the air is drifting off into space."], [22.3, 24.0, "Every plane is still climbing."],
    [24.32, 25.9, "Then gravity snaps back."], [26.06, 28.6, "From 12 storeys, you hit the ground at 95 km/h."],
    [28.72, 30.1, "10 seconds was a ride."], [30.28, 31.2, "One minute is a fall."],
  ],
  bigs: [{ at: 17.25, dur: 1.2, text: "35 m" }, { at: 28.75, dur: 1.4, text: "RIDE" }, { at: 30.3, dur: 1.2, text: "FALL" }],
  flashes: [{ at: 6.95, dur: 0.45 }, { at: 24.8, dur: 0.3 }, { at: 27.05, dur: 0.25 }],
  endCard: { at: 31.3, title: "What if gravity switched off for 1 minute?", small: ["PART 2 · SIMPLIFIED PHYSICS", "ASSUMES NEW YORK'S LATITUDE"], cta: "WHERE WOULD YOU GRAB ON?" },
};
