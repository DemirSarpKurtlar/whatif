// provisional timings (replaced once words.json exists)
const sc = (s, a, b, p = {}) => ({ a, b, draw: "px", p: { s, ...p } });
export default {
  END: 36.5, style: "flat", bg: "#0B0A1E", accent: "#FFD23F", xf: 0, capY: 1450,
  hot: ["electricity", "day"],
  title: { text: "What if electricity disappeared for one week?", end: 3.0, tag: "7 DAYS WITHOUT POWER", hot: ["electricity", "week"], y: 1400 },
  hook: { scene: 9, at: 0 }, cover: 1.5,
  scenes: [
    sc(0, 0, 3.0, { tOff: 1.0 }),
    sc(1, 3.0, 7.6, { d: 1, hr: [0, 24], bat: [[0, 1], [3.2, 0]], tFact: 1.0, tDead: 3.2 }),
    sc(2, 7.6, 14.0, { d: 2, hr: [0, 24], flow: [[0, 1], [2.0, 0]], tPump: 1.0, tTex: 2.6, cnt: [[0, 0], [2.6, 0], [4.2, 1]] }),
    sc(3, 14.0, 18.6, { d: 3, hr: [0, 24], tm: [[0, 0], [0.3, 0], [2.6, 1]], th: [[0, 0], [2.6, 0.1], [4.6, 1]], tNow: 2.8 }),
    sc(4, 18.6, 23.0, { d: 4, hr: [0, 24], fuel: [[0, 1], [4.4, 0.15]], tBig: 0.3 }),
    sc(5, 23.0, 26.4, { d: 5, hr: [0, 24], tFull: 1.8 }),
    sc(6, 26.4, 29.6, { d: 6, hr: [0, 24], tAtm: 1.0, tCash: 2.0 }),
    sc(7, 29.6, 33.4, { d: 7, hr: [0, 24], on: [[0, 0], [3.8, 0.7]], tDays: 2.2 }),
    sc(8, 33.4, 36.5, {}),
    sc(0, 100, 106, { ui: 0, hp: 1, drain: [[0, 0], [0.4, 0.05], [2.6, 1]] }),
  ],
  captions: [], bigs: [], huds: [], flashes: [],
};
