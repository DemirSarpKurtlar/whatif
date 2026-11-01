// Episode 005 — What if the Moon disappeared tonight?
const CO = { cam: 0, level: -0.35, surge: 0, night: 1, moon: 1, shake: 0, tilt: 0.9, panx: 0, wet: 0, milky: 0 };
const EA = { dist: 6.0, orb: 0.3, camy: 0, tx: 0, ty: 0, spin: 0, leak: 0, quake: 0, shake: 0, sun: 0.8, diag: 0 };
export default {
  END: 52.3,
  title: { text: "What if the Moon disappeared tonight?", end: 2.1 },
  scenes: [
    { a: 0, b: 2.1, glsl: "coast", p: { ...CO, cam: [0, 0.25], tilt: [1.1, 1.0] } },
    { a: 2.1, b: 7.5, glsl: "coast", p: { ...CO, cam: [0.25, 0.9], tilt: [1.0, 0.75], panx: [0, -0.4] },
      hud: { cat: "A CLEAR NIGHT", label: "FULL MOON LIGHT", value: "0.25 lux", sub: "LIGHTING UP THE SAND AND THE WATER", dot: "#F2C14E" } },
    { a: 7.5, b: 11.55, glsl: "coast", p: { ...CO, cam: [0.9, 1.05], tilt: [0.85, 1.0], moon: [[0, 1], [1.82, 1], [2.0, 0]], night: 1 },
      hud: { at: 0.5, cat: "THE MOON IS GONE", label: "ITS LAST LIGHT STILL ARRIVING", value: "1.3 s", sub: "384,400 KM AT THE SPEED OF LIGHT", vcol: "#FF6B5E", counter: { at: 0.52, dur: 1.3, from: 1.3, to: 0, dec: 1, suffix: " s", easing: "linear" } } },
    { a: 11.55, b: 14.55, glsl: "earth", p: { ...EA, dist: [7.5, 6.2], orb: [0.2, 0.4], spin: [0.2, 0.4] },
      hud: { cat: "EARTH, ALONE", label: "DISTANCE TO THE MOON", value: "384,400 km", sub: "NOW JUST EMPTY SPACE" } },
    { a: 14.55, b: 22.6, glsl: "coast", p: { ...CO, moon: 0, tilt: [0.9, 1.6], cam: [1.05, 1.4], panx: [-0.4, 0.3], milky: [[0, 0], [2.0, 0], [7.0, 1]] },
      hud: { cat: "THE SKY GOES DARK", label: "A FULL MOON OUTSHINES STARLIGHT", value: "100×", sub: "NOW THE STARS TAKE OVER", dot: "#5CB8F0" } },
    { a: 22.6, b: 30.55, glsl: "coast", p: { ...CO, moon: 0, milky: 1, night: [[0, 0.75], [1.2, 0]], tilt: [0.1, -0.05], cam: [0.4, 1.2], wet: 1, level: [-0.55, -0.42] },
      hud: { at: 0.6, cat: "BY MORNING", label: "HIGH TIDE", value: "⅓ as high", sub: "ONLY THE SUN PULLS ON THE OCEANS NOW", dot: "#4FD1A5" } },
    { a: 30.55, b: 34.2, glsl: "coast", p: { ...CO, moon: 0, milky: 0.6, night: 0.85, tilt: [0.2, 0.45], cam: [1.2, 1.5], panx: [0.4, 0.9], level: -0.42 },
      hud: { cat: "CORAL REEFS", label: "MASS SPAWNING, TIMED BY MOONLIGHT", value: "No calendar", sub: "MILLIONS OF YEARS OF RHYTHM, LOST", dot: "#FF8FB1" } },
    { a: 34.2, b: 41.6, glsl: "earth", p: { ...EA, dist: [6.0, 5.0], orb: [0.4, 0.9], camy: [0.0, 1.2], spin: [0.4, 1.1], sun: 1.2 },
      hud: { cat: "TODAY", label: "EARTH'S AXIAL TILT", value: "23.4°", sub: "HELD STEADY BY THE MOON'S PULL" } },
    { a: 41.6, b: 47.4, glsl: "earth", p: { ...EA, dist: [5.0, 4.4], orb: [0.9, 1.6], camy: [1.2, -0.8], spin: [1.1, 1.6], sun: 1.2, shake: [0, 0.15] },
      hud: { cat: "WITHOUT IT · OVER MILLIONS OF YEARS", label: "THE TILT COULD SWING TO", value: "23°", sub: "BRUTAL SEASONS", vcol: "#FF6B5E", counter: { at: 1.0, dur: 3.6, from: 23, to: 85, dec: 0, suffix: "°", easing: "ease-in-out" } } },
    { a: 47.4, b: 52.3, glsl: "coast", p: { ...CO, moon: 0, milky: 1, tilt: 1.4, cam: [1.4, 1.5] } },
  ],
  captions: [
    [2.18, 3.9, "It's a clear night on the beach."], [4.4, 7.2, "The full Moon lights up the sand and the water."],
    [7.54, 8.6, "Then it's gone."], [8.86, 11.3, "For 1.3 seconds, you can still see it."],
    [11.68, 14.3, "That's how long its last light takes to reach you."], [14.64, 16.2, "Then the sky goes dark."],
    [16.6, 19.9, "A full Moon is over 100 times brighter than starlight,"], [20.02, 22.3, "so suddenly the Milky Way appears."],
    [22.72, 25.2, "By morning, the tide comes in weaker."], [25.46, 27.7, "Only the Sun pulls on the oceans now,"],
    [27.8, 30.3, "so tides shrink to about a third."], [30.68, 34.0, "Coral reefs that spawn by moonlight lose their calendar."],
    [34.34, 36.4, "But the biggest change is slow."], [36.84, 41.2, "Today, the Moon holds Earth's tilt steady, near 23 degrees."],
    [41.86, 45.6, "Without it, over millions of years, that tilt could swing wildly,"], [46.04, 47.3, "bringing brutal seasons."],
  ],
  flashes: [{ at: 9.32, dur: 0.35, color: "#DDE6FF" }],
  endCard: { at: 47.4, title: "What if the Moon disappeared tonight?", small: ["SIMPLIFIED PHYSICS · FOR FUN", "THE MOON CAN'T ACTUALLY VANISH"], cta: "WHERE WOULD YOU WANT TO BE?" },
};
