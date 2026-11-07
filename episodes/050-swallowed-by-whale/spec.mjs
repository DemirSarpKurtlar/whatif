// Episode 050 — What if a whale swallowed you?  Style: "Woodblock Wave" (as 041/046). See style.md.
// Scenes are 2D canvas (draw/*.js are GENERATED: edit src/lib.js + src/<scene>.js, then `python3 src/build.py`).
export default {
  END: 36,
  bg: "#070D1C",
  accent: "#FF9A73",
  xf: 0.35,
  title: { text: "What if a whale swallowed you?", end: 2.2 },
  hook: { scene: 7, at: 0.6 },
  cover: 1.2,
  scenes: [
    { a: 0, b: 4.5, draw: "blue", p: { sid: 0, zoom: [1.0, 1.05], wx: [[0, 520], [4.5, 140]], labk: [[0, 0], [2.3, 0], [2.6, 1]], nok: [[0, 0], [3.9, 0], [4.2, 1]] } },
    { a: 4.5, b: 7.5, draw: "throat", p: { sid: 1, ring: [[0, 0], [0.5, 1]], ball: [[0, 0], [1.6, 0], [2.2, 1]], bust: 0, cmp: 0 } },
    { a: 7.5, b: 9.2, draw: "throat", p: { sid: 2, bust: [[0, 0], [0.5, 1]], cmp: [[0, 0], [0.7, 0], [1.2, 1]] } },
    { a: 9.2, b: 14.5, draw: "sperm", p: { sid: 3, cx: 520, zoom: [1.12, 1.2], gape: [[0, 0], [1.0, 0], [1.8, 1]], sq: [[0, 0], [1.8, 0], [2.3, 1]], slide: [[0, 0], [3.0, 0], [5.3, 1]], rule: [[0, 0], [3.3, 0], [4.0, 1]], labk: [[0, 0], [0.4, 1]], lab2k: [[0, 0], [2.0, 0], [2.4, 1]] } },
    { a: 14.5, b: 18.5, draw: "stomach", p: { sid: 4, mode: 1, cy: [[0, 600], [4, 700]], slide: [[0, 0], [1.6, 1]], sq: [[0, 0], [2.0, 0], [2.4, 1]], labk: [[0, 0], [0.8, 1]], lab2k: [[0, 0], [2.2, 0], [2.6, 1]] } },
    { a: 18.5, b: 22, draw: "stomach", p: { sid: 5, mode: 2, cy: [[0, 800], [1.2, 1080]], zoom: [1.0, 1.1], sq: 0.4, labk: [[0, 0], [0.5, 1]], lab2k: [[0, 0], [1.9, 0], [2.3, 1]] } },
    { a: 22, b: 26, draw: "humpback", p: { sid: 6, lab: 1, rise: [[0, 0], [1.5, 1]], gape: [[0, 0.3], [0.6, 1], [2.6, 1], [3.4, 0]], labk: [[0, 0], [0.4, 1]] } },
    { a: 26, b: 29, draw: "humpback", p: { sid: 7, lab: 2, rise: 1, gape: [[0, 1], [0.4, 0]], xray: [[0, 0], [0.5, 1]], timer: [[0, 0], [2.8, 1]], labk: [[0, 0], [0.3, 1]] } },
    { a: 29, b: 31.5, draw: "humpback", p: { sid: 8, lab: 3, rise: 1, gape: [[0, 0], [0.3, 1]], xray: [[0, 1], [0.3, 0]], spit: [[0, 0], [1.6, 1]], labk: [[0, 0], [1.2, 0], [1.6, 1]] } },
    { a: 31.5, b: 34, draw: "stomach", p: { sid: 9, mode: 3, zoom: 0.92, cy: 1100, sq: 0.6, labk: [[0, 0], [0.6, 0], [1.6, 1]] } },
  ],
  captions: [],
  bigs: [],
  huds: [],
  flashes: [],
  endCard: { at: 34, title: "What if a whale swallowed you?", small: ["BLUE WHALE THROAT ≈ 20 cm · SPERM WHALE: 4 STOMACHS", "2021: DIVER IN A HUMPBACK'S MOUTH, UP TO 40 s", "SOURCES: NOAA · SCIENCE FRIDAY · BOSTON GLOBE"], cta: "SQUEEZE OR ACID?" },
};
