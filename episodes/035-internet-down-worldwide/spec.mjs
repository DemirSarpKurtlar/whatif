// 035 — What if the internet went down worldwide for 24 hours?  Style: Higgsfield "Pixel Night" (16-bit pixel art,
// retro game HUD, neon night city). All scenes are draw/px.js (180x320 pixel canvas, 6x nearest upscale);
// p.s picks the sub-scene. HUD cards and big numbers are drawn IN-SCENE with a 5x7 pixel font (see style.md),
// so the engine's sans "huds"/"bigs" stay empty on purpose; captions/title/end card use the flat overlay style.
// s: 0 city · 1 shop · 2 airport · 3 bsod · 4 leaderboard · 5 hospital · 6 stocks · 7 phone · 8 gps · 9 ocean · 10 globe · 11 roof
const sc = (s, a, b, p = {}) => ({ a, b, draw: "px", p: { s, ...p } });
export default {
  END: 37.6,
  style: "flat",
  bg: "#0B0A1E",
  accent: "#FFD23F",
  xf: 0,
  capY: 1450,
  hot: ["internet", "cash", "king", "flights", "stall", "bigger", "paper", "freezes", "gps", "satellites", "cables", "dark", "bill"],
  title: { text: "What if the internet went down worldwide for 24 hours?", end: 2.9, tag: "24 HOURS OFFLINE", hot: ["internet", "worldwide"], y: 1400 },
  // cold open: undersea cables glowing, then dying right as the title ends (dedicated off-timeline hook scene, index 12)
  hook: { scene: 12, at: 0 },
  cover: 1.4,
  scenes: [
    sc(0, 0, 3.62, { tOff: 2.85, z: 1.0 }),                                                       // 0 neon city -> CONNECTION LOST
    sc(1, 3.62, 6.9, { tFail: 0.48, tCash: 1.3, z: [1.0, 1.05], fy: 150 }),                     // 1 hour 1: card terminal declines, cash
    sc(2, 6.9, 8.6, { tFlip: 0.2 }),                                                              // 2 hour 3: departures board flips
    sc(3, 8.6, 13.7, { blue: [[0, 0], [1.5, 0.06], [3.0, 1]], cnt: [[0, 0], [2.05, 0], [2.95, 1]], tCnt: 2.05, tPlane: 3.64 }), // 3 2024 blue screens
    sc(4, 13.7, 15.0, { tNew: 0.2 }),                                                             // 4 leaderboard: new record
    sc(5, 15.0, 16.95, { tPaper: 0.62, z: [1.0, 1.04], fy: 165 }),                               // 5 hour 6: hospital paper
    sc(6, 16.95, 18.5, { tHalt: 0.68 }),                                                          // 6 trading frozen
    sc(7, 18.5, 20.75, { msgs: [[0, 0.3], [0.55, 1.25], [1.05, 2.25], [1.55, 3.3], [2.25, 4.4]] }), // 7 SMS + calls
    sc(8, 20.75, 24.2, { tOk: 0.3, tSat: 1.6, z: [1.0, 1.08], fy: 170 }),                        // 8 GPS satellite
    sc(9, 24.2, 29.6, { tBig: 1.0, dark: [[0, 0], [4.45, 0], [4.85, 1]], tDark: 4.6 }),          // 9 hour 12: undersea cables go dark
    sc(10, 29.6, 33.1, { tBill: 1.2 }),                                                           // 10 hour 24: globe + $40B
    sc(11, 33.1, 37.6, { z: [1.25, 1.4], fx: 88, fy: 175 }),                                      // 11 rooftop question
    sc(9, 100, 106, { ui: 0, hp: 1, dark: [[0, 0], [2.3, 0], [2.6, 1]] }),                               // 12 hook only (off-timeline)
  ],
  captions: [
    [3.02, 4.45, "Hour one: card machines freeze."],
    [4.94, 6.3, "Cash is king again."],
    [7.06, 8.5, "Hour three: flights stall."],
    [8.7, 9.6, "In 2024,"],
    [9.76, 12.0, "one bad update crashed 8.5 million computers"],
    [12.0, 13.5, "and grounded thousands of flights."],
    [13.86, 14.9, "This is bigger."],
    [15.02, 16.85, "Hour six: hospitals switch to paper."],
    [17.06, 18.4, "Online trading freezes."],
    [18.6, 20.6, "Calls and texts still work on some networks,"],
    [20.84, 22.25, "and GPS still guides you,"],
    [22.34, 23.9, "because satellites aren't the internet."],
    [24.28, 25.15, "Hour 12:"],
    [25.22, 26.95, "99% of data between continents"],
    [26.98, 28.26, "runs through undersea cables,"],
    [28.28, 29.1, "and they've gone dark."],
    [29.2, 30.55, "Hour 24:"],
    [30.64, 32.95, "the bill hits an estimated $40 billion."],
    [33.28, 34.7, "What's the first thing you'd do?"],
  ],
  bigs: [],
  huds: [],
  flashes: [
    { at: 2.85, dur: 0.22, color: "#FF3B4E" },
    { at: 4.12, dur: 0.18, color: "#FF3B4E" },
    { at: 13.9, dur: 0.2, color: "#FFD23F" },
    { at: 28.75, dur: 0.25, color: "#000000" },
  ],
  endCard: {
    at: 34.75, series: "WHAT IF · PIXEL NIGHT", title: "What's the first thing you'd do?",
    choices: [{ k: "A", text: "Hunt down some cash" }, { k: "B", text: "Go outside and enjoy it" }],
    cta: "A OR B? TELL US BELOW", small: ["SAVE THIS FOR PART 2", "FOLLOW FOR MORE WHAT IFS"],
  },
};
