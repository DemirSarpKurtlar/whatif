// provisional test spec
const sc = (i, a, b, p = {}) => ({ a, b, draw: "px", p: { s: i, ...p } });
export default {
  END: 40, style: "flat", bg: "#0B0A1E", xf: 0, capY: 1450,
  scenes: [
    sc(0, 0, 3, { tOff: 0.8 }), sc(1, 3, 6, { tFail: 0.9, tCash: 2.0 }), sc(2, 6, 9), sc(3, 9, 12, { blue: [0, 1], cnt: [0, 1], tPlane: 2 }),
    sc(4, 12, 15), sc(5, 15, 18), sc(6, 18, 21), sc(7, 21, 24, { msgs: [0, 4] }), sc(8, 24, 27), sc(9, 27, 30, { dark: [[0, 0], [2, 0], [2.5, 1]], tDark: 2.5 }),
    sc(10, 30, 33), sc(11, 33, 40),
  ],
  captions: [[1.5, 2.9, "Hour one: card machines freeze."], [10, 11.9, "Hour twelve: 99% of data"]],
};
