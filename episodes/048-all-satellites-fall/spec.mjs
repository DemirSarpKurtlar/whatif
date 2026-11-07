const sc = (s, a, b, p = {}) => ({ a, b, draw: "px", p: { s, ...p } });
export default {
  END: 37, style: "flat", bg: "#0B0A1E", accent: "#FFD23F", xf: 0, capY: 1450,
  hot: [],
  title: { text: "What if every satellite fell out of the sky?", end: 2.8, tag: "ALL 17,000 OF THEM", hot: ["satellite", "fell"], y: 1400 },
  hook: { scene: 10, at: 0 }, cover: 1.5,
  scenes: [
    sc(0, 2.8, 6.6, { tDrop: 1.5 }), sc(1, 6.6, 8.8), sc(2, 8.8, 13.6, { tBreak: 1.6, tSplash: 3.2 }), sc(3, 13.6, 16.2, { tLost: 0.4 }),
    sc(4, 16.2, 19), sc(5, 19, 22), sc(6, 22, 25.5, { cnt: [[0, 0], [2, 1]] }), sc(7, 25.5, 30.5, { data: [[0, 0], [2, 1]], tUnk: 2.6 }),
    sc(8, 30.5, 33, { prog: [[0, 0], [1.5, 1]], tCrash: 2.0 }), sc(9, 33, 37),
    sc(1, 100, 106, { ui: 0, hp: 1, drain: [[0, 0], [0.4, 0.05], [2.7, 1]] }),
  ],
  captions: [], bigs: [], huds: [], flashes: [],
};
