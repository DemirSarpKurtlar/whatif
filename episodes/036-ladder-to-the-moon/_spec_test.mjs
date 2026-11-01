const sc = (a, b, n, p = {}, extra = {}) => ({ a, b, draw: "bp", p: { sc: n, D: b - a, h: 1, ...p }, ...extra });
export default {
  END: 40, style: "flat", bg: "#0E2B58", xf: 0.25, capY: 1420,
  title: { text: "What if you climbed a ladder to the Moon?", end: 2.4, hot: ["ladder", "moon"] },
  hook: { scene: 5, at: 0.0 },
  scenes: [
    sc(0, 2.4, 0), sc(2.4, 5.4, 1), sc(5.4, 9, 2), sc(9, 12, 3, { alt: 1 }), sc(12, 14.5, 4, { alt: 1 }), sc(14.5, 18.5, 5, { alt: 1 }),
    sc(18.5, 20.6, 6, { alt: 1 }), sc(20.6, 25.4, 7, { alt: 1 }), sc(25.4, 30.6, 8), sc(30.6, 32, 9), sc(32, 35, 10),
  ],
  captions: [[2.5, 5.3, "It's 384,000 kilometres up."], [9.1, 11.9, "Ten hours in, airliners pass beneath your feet."]],
  elapsed: { start: 9, end: 25.4, label: "ALTITUDE", unit: " km", dec: 0, note: "1 RUNG / S", points: [[9, 0], [9.5, 11], [12.2, 100], [14.6, 408], [18.6, 20200], [20.8, 35786], [25.4, 35786]] },
  huds: [{ at: 14.6, dur: 3.8, cat: "DAY 16", dot: "#2F7FD0" }],
  bigs: [{ at: 8, dur: 1, text: "40 YEARS", tag: "NON-STOP", y: 1180, size: 150, color: "#E8F4FF", tagBg: "#7FD3FF", tagFg: "#0B2653" }],
};
