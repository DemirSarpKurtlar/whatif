// Episode 036 — What if you climbed a ladder to the Moon?  Style: Higgsfield "Blueprint Line" (wireframe blueprint on navy).
// All scenes are one 2D canvas draw file (draw/bp.js); p.sc picks the drawing sheet, p.D is filled in from the scene length.
const sc = (a, b, n, p = {}, extra = {}) => ({ a, b, draw: "bp", p: { sc: n, D: +(b - a).toFixed(2), h: 1, ...p }, ...extra });
const TAG = "#2F7FD0";
export default {
  END: 34.6,
  style: "flat",
  bg: "#0E2B58",
  accent: "#7FD3FF",
  xf: 0.22,
  capY: 1420,
  hot: ["moon", "ladder", "space", "float", "nothing", "snaps", "station"],
  title: { text: "What if you climbed a ladder to the Moon?", end: 2.05, hot: ["ladder", "moon"] },
  hook: { scene: 11, at: 0.3 }, // scene 11 = ISS pass without the altitude cell, hidden behind the end card
  cover: 13.75,
  scenes: [
    sc(0, 2.05, 0, { h: 0 }),
    sc(2.05, 4.3, 1),
    sc(4.3, 7.95, 2),
    sc(7.95, 10.4, 3, { alt: 1, plane: 0.0 }),
    sc(10.4, 12.25, 4, { alt: 1 }),
    sc(12.25, 16.0, 5, { alt: 1, iss: 0.05 }),
    sc(16.0, 18.1, 6, { alt: 1 }),
    sc(18.1, 22.45, 7, { alt: 1, f: 2.2 }),
    sc(22.45, 27.2, 8, { th: [[0, -1.3], [0.5, -1.2], [3.25, 0], [4.3, 3.3], [4.75, 3.4]], hh: 1.3, dp: 3.0, da: 3.9 }),
    sc(27.2, 28.55, 9, { snap: 0.4 }),
    sc(28.55, 31.2, 10, { rej: 1.5 }),
    sc(31.2, 34.6, 5, { iss: 0.05 }),
  ],
  elapsed: { start: 7.95, end: 22.45, label: "ALTITUDE", unit: " km", dec: 0, note: "1 RUNG / S",
    points: [[7.95, 10.5], [9.2, 11], [10.0, 12], [10.62, 100], [12.46, 408], [16.32, 20200], [18.7, 35786], [22.45, 35786]] },
  huds: [
    { at: 10.5, dur: 1.75, cat: "EDGE OF SPACE", dot: TAG },
    { at: 12.36, dur: 3.6, cat: "SPACE STATION", dot: TAG },
    { at: 16.14, dur: 1.9, cat: "GPS ORBIT", dot: TAG },
    { at: 18.26, dur: 4.1, cat: "GEOSTATIONARY", dot: TAG },
  ],
  captions: [
    [2.1, 4.25, "It's 384,000 kilometres up."],
    [4.38, 6.2, "At one rung per second, non-stop,"], [6.28, 7.9, "that's 40 years."],
    [8.12, 10.3, "10 hours in, airliners pass beneath your feet."],
    [10.5, 12.2, "Day 4, you cross the edge of space."],
    [12.36, 13.95, "Day 16, the space station rushes past"], [13.96, 15.95, "at almost 8 kilometres per second."],
    [16.14, 18.1, "2 years: GPS satellites."],
    [18.26, 20.55, "Nearly 4 years: geostationary orbit,"], [20.66, 22.4, "where you weigh nothing and simply float."],
    [22.62, 23.75, "But the Moon won't wait."], [23.88, 25.65, "Every month it swings 40,000 kilometres"], [25.68, 27.2, "closer, then farther."],
    [27.32, 28.5, "The ladder snaps."], [28.64, 30.7, "And no material on Earth could hold it anyway."],
  ],
  bigs: [
    { at: 6.46, dur: 1.4, text: "40 YEARS", tag: "NON-STOP", y: 1180, size: 150, color: "#E8F4FF", tagBg: "#7FD3FF", tagFg: "#0B2653" },
    { at: 27.6, dur: 0.85, text: "SNAP", y: 640, size: 190, color: "#FF5E5E" },
  ],
  flashes: [{ at: 11.6, dur: 0.2, color: "#BFE9FF" }, { at: 27.6, dur: 0.3, color: "#FFD9D9" }],
  endCard: { at: 30.75, series: "LADDER TO THE MOON · DWG L-1", title: "How far would you go?", cta: "WHERE WOULD YOU STOP?", small: ["11 KM · 100 KM · 408 KM · 35,786 KM?", "NOT TO SCALE · SIMPLIFIED PHYSICS", "FOLLOW FOR MORE WHAT IFS"] },
};
