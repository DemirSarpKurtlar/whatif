// Episode 008 — What if you jumped into a tunnel straight through the Earth?
const EC = { dist: 4.6, orb: 1.25, camy: 1.3, cut: 0, pos: -3, line: 0, spin: 0, zoomy: 0 };
const TU = { depth: 0, speed: 0, look: 0, roll: 0, sky: 0 };
const P = (min) => Math.cos((2 * Math.PI * min) / 84.4); // dot position along the axis for a given fall time
export default {
  END: 57.1,
  title: { text: "What if you jumped into a tunnel through the Earth?", end: 3.9 },
  elapsed: { start: 10.8, end: 48.9, label: "FALL TIME", unit: " min", dec: 1, note: "NO AIR · NO FRICTION",
    points: [[10.8, 0], [16.0, 0.8], [22.16, 10], [30.32, 21.1], [41.24, 42.2], [48.9, 42.2]] },
  scenes: [
    { a: 0, b: 3.9, glsl: "earthcut", p: { ...EC, dist: [4.4, 4.0], orb: [0.55, 0.7], spin: [0, 0.2], line: [[0, 0], [1.2, 0], [3.6, 1]] } },
    { a: 3.9, b: 10.6, glsl: "earthcut", p: { ...EC, dist: [4.8, 4.2], orb: [1.0, 1.3], camy: [1.4, 1.1], cut: [[0, 0], [0.4, 1]], line: 1, spin: [0.2, 0.5] },
      hud: { cat: "THE TUNNEL", label: "POLE TO POLE", value: "12,714 km", sub: "ALL THE AIR PUMPED OUT" } },
    { a: 10.6, b: 15.9, glsl: "tunnel", p: { ...TU, depth: [0, 12], look: [[0, 2.6], [0.9, 2.6], [2.2, 0.15]], sky: [[0, 0.9], [1.0, 0.9], [5.3, 0.05]], speed: [0, 0.4], roll: [0, 0.4] },
      hud: { at: 1.6, cat: "THE DEEPEST HOLE EVER DUG", label: "KOLA SUPERDEEP BOREHOLE", value: "12.2 km", sub: "YOU PASS IT IN UNDER A MINUTE", dot: "#F2C14E" } },
    { a: 15.9, b: 22.0, glsl: "tunnel", p: { ...TU, depth: [12, 900], speed: [0.4, 0.8], roll: [0.4, 1.4], look: [0.15, 0.35] },
      hud: { cat: "THE WHOLE WAY DOWN", label: "YOU FEEL", value: "Weightless", sub: "FREE FALL · LIKE AN ASTRONAUT", dot: "#5CB8F0" } },
    { a: 22.0, b: 25.1, glsl: "earthcut", p: { ...EC, cut: 1, line: 1, dist: [3.8, 3.5], orb: [1.2, 1.35], camy: 0.9, pos: [P(8.3), P(10.5)], spin: 0.5, zoomy: 0.3 },
      hud: { cat: "10 MINUTES IN", label: "YOUR SPEED", value: "", sub: "FASTER THAN A RIFLE BULLET", counter: { at: 0.1, dur: 2.4, from: 0, to: 5.4, dec: 1, suffix: " km/s", easing: "ease-out" } } },
    { a: 25.1, b: 30.2, glsl: "tunnel", p: { ...TU, depth: [2700, 4300], speed: [0.8, 1.0], roll: [1.4, 2.2], look: [0.2, 0.5] },
      hud: { cat: "AROUND YOU", label: "THE ROCK GLOWS", value: "5,000 °C", sub: "THE MOLTEN OUTER CORE", vcol: "#FFB36B" } },
    { a: 30.2, b: 35.9, glsl: "tunnel", p: { ...TU, depth: [5900, 6800], speed: 1.0, roll: [2.2, 3.4], look: [0.1, 0.3] },
      hud: { cat: "21 MINUTES IN · THE CENTRE", label: "TOP SPEED", value: "7.9 km/s", sub: "28,000 KM/H THROUGH THE INNER CORE", vcol: "#FFE7A8" } },
    { a: 35.9, b: 41.1, glsl: "earthcut", p: { ...EC, cut: 1, line: 1, dist: [3.8, 4.4], orb: [1.35, 1.1], camy: [0.8, 1.2], pos: [P(23), P(39)], spin: [0.5, 0.7] },
      hud: { cat: "PAST THE CENTRE", label: "GRAVITY NOW", value: "Pulls you back", sub: "YOU SLOW DOWN ALL THE WAY UP" } },
    { a: 41.1, b: 48.9, glsl: "tunnel", p: { ...TU, depth: [12650, 12714], speed: [0.5, 0.0], look: [[0, 0.4], [2.0, 3.1], [7.8, 3.1]], sky: [[0, 0.05], [2.0, 0.3], [6.0, 0.9], [7.8, 1.0]], roll: [3.4, 3.6] },
      hud: { at: 0.3, cat: "42 MINUTES LATER", label: "YOUR SPEED", value: "0 m/s", sub: "YOU STOP RIGHT AT THE EDGE", dot: "#4FD1A5" } },
    { a: 48.9, b: 57.1, glsl: "earthcut", p: { ...EC, cut: 1, line: 1, dist: [4.4, 5.2], orb: [1.1, 0.9], camy: 1.3, pos: [[0, P(42.2)], [0.6, P(42.2)], [3.6, P(56)]], spin: [0.7, 1.0] },
      hud: { cat: "MISS THE GRAB", label: "ROUND TRIP", value: "84 min", sub: "OVER AND OVER · FOREVER" } },
  ],
  captions: [
    [4.02, 5.8, "It runs from pole to pole,"], [5.94, 7.7, "12,700 km long,"], [8.58, 10.2, "with all the air pumped out."],
    [10.8, 11.9, "You step off the edge."], [12.36, 15.0, "The deepest hole humans ever dug was 12 km."], [15.98, 17.7, "You pass it in under a minute."],
    [17.96, 20.0, "And the whole way down, you feel weightless,"], [20.6, 21.9, "like an astronaut."],
    [22.16, 25.0, "Ten minutes in, you're moving faster than a rifle bullet."], [25.16, 27.6, "Around you, the rock glows."],
    [28.04, 29.9, "5,000 degrees."], [30.32, 33.2, "21 minutes in, you reach the centre of the Earth,"], [33.34, 35.6, "at almost 8 km per second."],
    [36.0, 37.9, "Now gravity pulls you backwards."], [38.22, 40.9, "You slow down, all the way up the other side."],
    [41.24, 42.9, "42 minutes after you jumped,"], [43.22, 45.4, "you rise out of the hole at the opposite pole..."],
    [45.68, 48.6, "and stop, perfectly, right at the edge."], [49.16, 51.8, "Miss the grab, and you fall all the way back."], [52.06, 52.7, "Forever."],
  ],
  bigs: [{ at: 41.2, dur: 1.4, text: "42 min", size: 220 }],
  flashes: [{ at: 30.3, dur: 0.5, color: "#FFE2B0" }, { at: 10.8, dur: 0.25 }],
  endCard: { at: 52.75, title: "What if you jumped into a tunnel through the Earth?", small: ["SIMPLIFIED PHYSICS · UNIFORM-DENSITY EARTH", "A REAL TUNNEL WOULD MELT, OF COURSE"], cta: "WOULD YOU TAKE THE JUMP?" },
};
