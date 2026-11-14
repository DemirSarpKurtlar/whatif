// Episode 057 — What if Yellowstone's supervolcano erupted?  Style: "Woodblock Wave" (ukiyo-e print, as 041). See style.md.
// Scenes are 2D canvas (draw/*.js are GENERATED: edit src/lib.js + src/<scene>.js, then `python3 src/build.py`).
// Numbers live on in-scene cream plaques; every caption gets an indigo plaque drawn by the scene code (src/lib.js capPlaque, needs p.sid = scene index).
export default {
  END: 35.0,
  bg: "#1B2233",
  accent: "#FF9A73",
  xf: 0.35,
  title: { text: "What if Yellowstone's supervolcano erupted?", end: 2.55 },
  hook: { scene: 1, at: 0.2 },
  cover: 1.4,
  scenes: [
    { a: 0, b: 3.5, draw: "park", p: { sid: 0, zoom: [1.0, 1.05], gey: [[0, 0.3], [1.0, 1]], lab: 1, labk: [[0, 0], [2.55, 0], [2.95, 1]] } },
    { a: 3.5, b: 4.95, draw: "park", p: { sid: 1, zoom: [1.05, 1.0], gey: 0.4, erupt: [[0, 0.1], [2.6, 1, "ease-out"]], dark: [[0, 0.2], [2.4, 0.9]], shake: [[0, 0.5], [1.4, 0.15]], bx: [[0, 0], [1.45, -40]], lab: 2, labk: [[0, 0], [0.35, 1]] } },
    { a: 4.95, b: 10.6, draw: "volume", p: { sid: 2, zoom: [[0, 1.06], [5.65, 1.0]], grow: [[0, 0], [0.4, 0], [3.4, 1, "ease-out"]], small: [[0, 0], [4.0, 0], [4.5, 1]], ash: [[0, 0.5], [3.5, 0.15]], labk: [[0, 0], [0.35, 1]], lab2k: [[0, 0], [2.75, 0], [3.15, 1]] } },
    { a: 10.6, b: 13.6, draw: "timeline", p: { sid: 3, cx: [[0, 420], [2.4, 1742, "ease-out"]], zoom: [[0, 0.62], [1.2, 0.62], [2.6, 1.0]], pop: [[0, 0], [0.9, 3, "linear"]], lab: 1, labk: [[0, 0], [0.8, 0], [1.2, 1]] } },
    { a: 13.6, b: 17.85, draw: "usmap", p: { sid: 4, zoom: [1.0, 1.06], cx: 548, spread: [[0, 0], [0.15, 0], [2.6, 1, "ease-out"]], mpls: [[0, 0], [2.3, 0], [2.7, 1]], labk: [[0, 0], [0.35, 1]], legk: [[0, 0], [1.6, 0], [2.0, 1]] } },
    { a: 17.85, b: 20.9, draw: "cool", p: { sid: 5, zoom: [1.0, 1.05], haze: [[0, 0], [2.4, 1]], drop: [[0, 0], [1.4, 0], [2.6, 1]], labk: [[0, 0], [1.4, 0], [1.8, 1]] } },
    { a: 20.9, b: 25.1, draw: "chamber", p: { sid: 6, zoom: [[0, 1.0], [1.9, 1.0], [3.2, 1.9]], cy: [[0, 960], [1.9, 960], [3.2, 880]], glow: [[0, 0], [2.0, 0], [2.8, 1]], labk: [[0, 0], [0.3, 1]], lab2k: [[0, 0], [2.3, 0], [2.7, 1]] } },
    { a: 25.1, b: 27.95, draw: "odds", p: { sid: 7, zoom: [[0, 7], [2.6, 1.0, "ease-out"]], labk: [[0, 0], [0.4, 0.55], [1.3, 0.55], [1.7, 1]] } },
    { a: 27.95, b: 30.75, draw: "park", p: { sid: 8, zoom: [1.0, 1.05], gey: 0.3, lava: [[0, 0], [0.4, 0], [1.6, 1]], blast: [[0, 0], [1.15, 0], [2.8, 0.75, "linear"]], lab: 3, labk: [[0, 0], [0.3, 0.45], [1.2, 0.45], [1.7, 1]] } },
    { a: 30.75, b: 32.45, draw: "park", p: { sid: 9, zoom: [1.06, 1.12], cy: [960, 900], gey: [[0, 0.2], [0.9, 1]], lab: 4, labk: [[0, 0], [0.4, 1]] } },
  ],
  captions: [
    [3.16, 4.5, "It has happened before."],
    [5.06, 6.6, "2.1 million years ago,"], [6.78, 7.7, "one blast threw out"], [7.72, 10.4, "2,450 cubic kilometres of ash."],
    [10.78, 13.3, "The last, 631,000 years ago."],
    [13.72, 15.6, "Ash would fall across much of the United States,"], [15.82, 17.5, "centimetres deep as far as Minneapolis."],
    [17.98, 20.5, "Sulfur haze could cool the planet by a few degrees for years."],
    [21.04, 22.9, "But the magma below is mostly solid,"], [23.22, 24.85, "only 5 to 15 percent melt."],
    [25.22, 26.3, "The yearly odds?"], [26.4, 27.9, "About 1 in 730,000."],
    [27.98, 30.5, "A lava flow or steam blast is far more likely."],
    [30.82, 32.4, "Would you still visit Old Faithful?"],
  ],
  bigs: [],
  huds: [],
  flashes: [{ at: 3.52, dur: 0.3, color: "#F1E6CC" }, { at: 8.3, dur: 0.2, color: "#F1E6CC" }, { at: 29.1, dur: 0.18, color: "#F1E6CC" }],
  endCard: { at: 32.45, title: "What if Yellowstone's supervolcano erupted?", small: ["NO SIGNS OF A SUPER-ERUPTION TODAY", "ODDS: ABOUT 1 IN 730,000 PER YEAR", "SOURCE: USGS YELLOWSTONE VOLCANO OBSERVATORY"], cta: "WOULD YOU STILL VISIT OLD FAITHFUL?" },
};
