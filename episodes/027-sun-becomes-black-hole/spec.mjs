// Episode 027 — What if the Sun turned into a black hole right now?
const PK = { cam: 0, lift: 0, float: 0, rise: 0, shake: 0, panx: 0, tilt: 0, sun: 1, night: 0, frost: 0, ppl: 1, look: 2.5, glare: 0, mark: 0, lens: 0 };
const BH = { dist: 30, orb: 0.6, tilt: 0.14, srad: 1, sun: 0, ring: 1, glow: 0, tx: 0, lens: 0 };
const OR = { dist: 3.2, orb: 0.4, elev: 0.55, tx: 0, tz: 0, sun: 0, bh: 1, eang: -1.6, trail: 0, dark: 0, lit: 1, orbit: 1, ice: 0 };
const OC = { cam: 0, camy: 0, pitch: 0, ice: 0, under: 0 };
export default {
  END: 31.3,
  title: { text: "What if the Sun turned into a black hole right now?", end: 2.4 },
  hook: { scene: 6, at: 0.8 },
  cover: 6.1,
  elapsed: { start: 11.2, end: 18.6, label: "SINCE THE COLLAPSE", unit: " min", dec: 1, note: "TIME SPED UP", points: [[11.2, 0], [18.4, 8.33], [18.6, 8.33]] },
  scenes: [
    // 0 title: a normal sunny day in the park
    { a: 0, b: 2.4, glsl: "sunpark", p: { ...PK, cam: [0, 0.3] } },
    // 1 the Sun collapses to a 6 km black hole
    { a: 2.4, b: 6.4, glsl: "sunbh", p: { ...BH, dist: [[0, 70], [1.9, 44], [4.0, 30]], orb: [0.3, 0.6], tilt: [0.1, 0.14],
        srad: [[0, 10], [0.4, 10], [1.9, 1, "ease-in"]], sun: [[0, 1], [1.85, 1], [1.95, 0]],
        glow: [[0, 0], [1.4, 0.3], [1.9, 1], [2.7, 0]], ring: [[0, 0], [1.9, 0], [2.5, 1]] },
      hud: { cat: "ALL ITS MASS, CRUSHED", label: "THE SUN'S DIAMETER", value: "", sub: "THE MASS STAYS THE SAME", vcol: "#FFB36B",
        counter: { at: 0.4, dur: 1.5, from: 1391000, to: 6, suffix: " km", easing: "ease-in" } } },
    // 2 Earth's orbit unchanged
    { a: 6.4, b: 9.5, glsl: "orbit", p: { ...OR, dist: [3.5, 3.1], orb: [0.08, -0.42], eang: [-1.95, -1.45], trail: [0.2, 1.2], tx: [-0.18, 0.06], tz: [-0.46, -0.5] },
      hud: { at: 1.3, cat: "THE SURPRISE", label: "EARTH'S ORBIT", value: "Unchanged", sub: "IT DOESN'T FALL IN", dot: "#4FD1A5", vcol: "#9BF0CF" } },
    // 3 same mass, same pull
    { a: 9.5, b: 11.1, glsl: "orbit", p: { ...OR, dist: [3.1, 2.7], orb: [-0.42, -0.67], elev: [0.55, 0.45], eang: [-1.45, -1.2], trail: 1.2, tx: [0.06, 0.18], tz: [-0.5, -0.47] },
      hud: { cat: "SAME MASS · SAME PULL", label: "EARTH STILL ORBITS AT", value: "30 km/s", sub: "LIKE NOTHING HAPPENED", dot: "#4FD1A5" } },
    // 4 from your street: a normal sunny day
    { a: 11.1, b: 14.5, glsl: "sunpark", p: { ...PK, cam: [0.3, 0.9], look: [2.0, 2.6] },
      hud: { cat: "FROM YOUR STREET", label: "SUNLIGHT", value: "100%", sub: "A PERFECTLY NORMAL DAY", dot: "#F2C14E" } },
    // 5 the last sunlight is still on its way
    { a: 14.5, b: 16.6, glsl: "orbit", p: { ...OR, dist: [3.0, 2.8], orb: [-0.72, -0.92], elev: 0.6, eang: [-1.15, -0.95], trail: 1.2, dark: [0.3, 0.92], tx: [0.2, 0.29], tz: [-0.46, -0.41] },
      hud: { cat: "THE LAST SUNLIGHT", label: "STILL ON ITS WAY", value: "150 million km", sub: "AT THE SPEED OF LIGHT", dot: "#F2C14E" } },
    // 6 the sky goes black (no sunset)
    { a: 16.6, b: 19.8, glsl: "sunpark", p: { ...PK, cam: [0.6, 0.95], look: [2.2, 2.8],
        sun: [[0, 1], [1.78, 1, "linear"], [1.8, 0]], night: [[0, 0], [1.78, 0, "linear"], [1.86, 1]], glare: [[0, 0], [1.7, 0.8]] },
      hud: { at: 1.85, cat: "8 MIN 20 S LATER", label: "SUNLIGHT", value: "0%", sub: "NO SUNSET · INSTANT NIGHT", vcol: "#FF6B5E" } },
    // 7 one week: as cold as your freezer
    { a: 19.8, b: 22.4, glsl: "sunpark", p: { ...PK, cam: [0.9, 1.25], look: [0.6, 0.2], sun: 0, night: 1, ppl: 0, frost: [0.15, 0.85] },
      hud: { cat: "ONE WEEK LATER", label: "AVERAGE TEMPERATURE", value: "−18 °C", sub: "AS COLD AS YOUR FREEZER", dot: "#5CB8F0", vcol: "#BFE3FF" } },
    // 8 one year: oceans frozen over on top
    { a: 22.4, b: 24.8, glsl: "iceocean", p: { ...OC, cam: [0, 0.8], camy: [0.4, 0.0], ice: [[0, 0.15], [2.3, 1.0]] },
      hud: { cat: "ONE YEAR LATER", label: "THE OCEANS", value: "Frozen over", sub: "ICE ON TOP · −73 °C AVERAGE", dot: "#5CB8F0", vcol: "#BFE3FF" } },
    // 9 you couldn't even see the black hole
    { a: 24.8, b: 27.0, glsl: "sunpark", p: { ...PK, cam: 1.0, look: [3.0, 4.2], lens: [1.15, 1.6], sun: 0, night: 1, ppl: 0, frost: 0.9, mark: [[0, 0], [1.3, 0], [1.7, 1]] },
      hud: { cat: "WHERE THE SUN WAS", label: "THE BLACK HOLE", value: "Invisible", sub: "6 KM WIDE, 150 MILLION KM AWAY", vcol: "#FFD866" } },
    // 10 question over the bare black hole
    { a: 27.0, b: 31.3, glsl: "sunbh", p: { ...BH, dist: [27, 24], orb: [0.8, 1.0], tilt: [0.16, 0.2] } },
  ],
  captions: [
    [2.46, 3.45, "All its mass, crushed"], [3.48, 5.3, "into a ball just 6 km across."],
    [6.48, 7.4, "Here's the surprise:"], [7.8, 9.3, "Earth's orbit wouldn't change at all."],
    [9.6, 10.75, "Same mass, same pull."], [11.2, 13.2, "From your street, for 8 min 20 s,"],
    [13.32, 14.3, "it's a normal sunny day."], [14.68, 16.1, "That light was already on its way."],
    [16.66, 17.65, "Then, in an instant,"], [17.9, 18.8, "the sky goes black."], [19.0, 19.7, "No sunset."],
    [20.0, 20.6, "Within a week,"], [20.7, 22.2, "the planet is as cold as your freezer."],
    [22.6, 24.75, "Within a year, the oceans freeze over on top."],
    [24.92, 25.6, "And the black hole?"], [25.78, 26.85, "You couldn't even see it."],
    [27.1, 28.4, "What would you do with those 8 minutes?"],
  ],
  bigs: [{ at: 4.45, dur: 1.3, text: "6 km" }],
  flashes: [{ at: 4.3, dur: 0.4 }],
  endCard: { at: 28.6, title: "What if the Sun turned into a black hole right now?", small: ["SIMPLIFIED PHYSICS · FOR FUN", "THE SUN IS TOO LIGHT TO EVER BECOME ONE"], cta: "WHAT WOULD YOU DO IN THOSE 8 MINUTES?" },
};
