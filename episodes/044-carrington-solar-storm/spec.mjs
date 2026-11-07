// 044 — What if the 1859 Carrington solar storm hit today?  Style: Higgsfield "Pixel Night" (16-bit pixel art,
// retro game HUD, neon night city) — same kit as 035 (draw/px.js: 180x320 pixel canvas, 6x nearest upscale, own 5x7 font).
// HUD cards and big numbers are drawn IN-SCENE with the pixel font, so the engine's sans "huds"/"bigs" stay empty on purpose.
// s: 0 observatory · 1 flare · 2 cme · 3 aurora town · 4 reader · 5 telegraph · 6 grid · 7 transformer · 8 gps
//    9 satellites · 10 cost · 11 near miss · 12 roof   (scene 13 = cold-open hook only, off-timeline)
const sc = (s, a, b, p = {}) => ({ a, b, draw: "px", p: { s, ...p } });
export default {
  END: 35.8,
  style: "flat",
  bg: "#0B0A1E",
  accent: "#FFD23F",
  xf: 0,
  capY: 1450,
  hot: ["carrington", "blinding", "flash", "sun", "blast", "earth", "auroras", "cuba", "newspapers", "telegraph", "spark", "unplugged", "grids", "transformers", "burn", "gps", "drifts", "satellites", "glitch", "bill", "missed", "week", "ready"],
  title: { text: "What if the 1859 Carrington solar storm hit today?", end: 2.95, tag: "BIGGEST SOLAR STORM EVER", hot: ["carrington", "solar", "storm"], y: 1400 },
  // cold open: the modern grid under a blood-red aurora, "POWER GRID" HP draining while the city goes dark
  hook: { scene: 13, at: 0 },
  cover: 1.5,
  scenes: [
    sc(0, 0, 5.4, { tFlash: 4.7, z: [1.0, 1.08], fy: 182, fx: 112 }),                         // 0 Carrington's observatory -> white flash
    sc(1, 5.4, 6.42, { tFl: 0.0, tCme: 0.5, noin: 1 }),                                          // 1 flare close-up, CME launches
    sc(2, 6.42, 8.8, { cnt: [[0, 0], [1.62, 1]], tImp: 1.62 }),                                   // 2 CME crossing space, T+17:36, impact
    sc(3, 8.8, 10.95, { tLat: 0.15, z: [1.0, 1.05] }),                                           // 3 aurora over an 1859 town, latitude -> Cuba
    sc(4, 10.95, 12.75, { tBig: 0.4, z: [1.0, 1.06], fy: 150 }),                                 // 4 reading a newspaper by aurora light
    sc(5, 12.75, 16.55, { tZap: 0.6, tNoBat: 1.3, z: [1.2, 1.32], fx: 88, fy: 168 }),           // 5 sparking telegraph, batteries unplugged
    sc(6, 16.55, 18.82, { z: [1.0, 1.05] }),                                                      // 6 1859 > TODAY: grid surging
    sc(7, 18.82, 22.55, { heat: [[0, 0], [1.1, 1]], tBoom: 1.2, tWait: 1.9 }),                   // 7 transformer overheats, burns out, 12+ months
    sc(8, 22.55, 23.7, { glit: [[0, 0.1], [0.45, 1]], tG: 0.35 }),                               // 8 GPS drift (tractor, May 2024)
    sc(9, 23.7, 25.6, { tHit: 0.3, tFact: 0.62 }),                                                // 9 satellites glitch, 2022 Starlink loss
    sc(10, 25.6, 28.6, { cnt: [[0, 0], [0.2, 0], [1.95, 1]], tRange: 2.15 }),                    // 10 the bill: up to $2.6 trillion
    sc(11, 28.6, 32.15, { tCme: 0.25, tMiss: 2.1, z: [1.0, 1.06], fy: 150 }),                    // 11 July 2012 near miss
    sc(12, 32.15, 35.8, { tMay: 0.3, z: [1.2, 1.32], fx: 88, fy: 170 }),                         // 12 rooftop question under the aurora
    sc(6, 100, 106, { ui: 0, hp: 1, drain: [[0, 0], [0.45, 0.04], [2.7, 1]] }),                   // 13 hook only (off-timeline)
  ],
  captions: [
    [3.15, 4.6, "Richard Carrington sees a blinding"],
    [4.62, 5.95, "white flash on the Sun."],
    [6.4, 7.6, "17 hours later,"],
    [7.64, 8.75, "the blast hits Earth."],
    [8.8, 10.8, "Auroras glow as far south as Cuba."],
    [10.98, 12.72, "People read newspapers by their light."],
    [12.78, 13.98, "Telegraph lines spark,"],
    [14.02, 16.2, "and some keep working with the batteries unplugged."],
    [16.6, 18.7, "Today, that current hits power grids."],
    [18.84, 20.5, "Giant transformers can burn out,"],
    [20.55, 22.45, "and replacing one can take a year."],
    [22.6, 23.62, "GPS drifts."],
    [23.72, 24.8, "Satellites glitch."],
    [24.88, 26.5, "One study puts the US bill"],
    [26.52, 28.5, "at up to 2.6 trillion dollars."],
    [28.64, 30.66, "In 2012, a storm just as strong"],
    [30.68, 32.08, "missed Earth by one week."],
    [32.18, 33.35, "Would you be ready?"],
  ],
  bigs: [],
  huds: [],
  flashes: [
    { at: 4.7, dur: 0.3, color: "#FFFFFF" },
    { at: 5.4, dur: 0.2, color: "#FFD23F" },
    { at: 8.05, dur: 0.25, color: "#FF4FA3" },
    { at: 16.55, dur: 0.2, color: "#FF3B4E" },
    { at: 20.02, dur: 0.3, color: "#FF8A3D" },
    { at: 24.0, dur: 0.15, color: "#FFFFFF" },
  ],
  endCard: {
    at: 33.35, series: "WHAT IF · PIXEL NIGHT", title: "Storm warning: 17 hours",
    choices: [{ k: "A", text: "Stock up and unplug" }, { k: "B", text: "Go watch the aurora" }],
    cta: "A OR B? TELL US BELOW", small: ["SAVE THIS FOR PART 2", "FOLLOW FOR MORE WHAT IFS"],
  },
};
