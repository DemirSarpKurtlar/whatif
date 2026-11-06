const sc = (s, a, b, p = {}) => ({ a, b, draw: "ops", p: { s, ...p } });
export default {
  END: 40, style: "flat", bg: "#000000", xf: 0, capY: 1560,
  title: { text: "What if a city-killer asteroid were spotted heading for Earth today?", end: 3.0, tag: "PLANETARY DEFENSE", y: 1560 },
  hook: false,
  scenes: [
    sc(0, 0, 4, { tLock: 1.2 }), sc(1, 4, 8, { n: [0, 9], obs: [0, 200] }), sc(2, 8, 12, { tHit: 1.0, tor: [[0, 0], [1, 0], [2.5, 8]] }),
    sc(3, 12, 16), sc(4, 16, 20), sc(5, 20, 24, { dr: [0, 1], out: [[0, 0], [3, 0], [3.5, 1]] }), sc(6, 24, 28), sc(7, 28, 32), sc(8, 32, 36, { clr: [0, 0.4] }), sc(9, 36, 40, { clr: 0.45 }),
  ],
  captions: [[0.5, 3.5, "Hour zero: a sky survey like ATLAS flags a faint dot"]], bigs: [], huds: [], flashes: [],
};
