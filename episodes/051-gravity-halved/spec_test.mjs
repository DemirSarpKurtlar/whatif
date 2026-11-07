const K = { cx: 4.2, cy: 1.9, cz: 4.2, tx: 0, ty: 1.9, tz: 0.2, lens: 1.25, shake: 0, jt: 0, ghost: 0, phone: 0, drop: 0 };
const O = { cx: -4, cy: 9, cz: 38, tx: 10, ty: 13, tz: -46, S: 1, shake: 0, dark: 0.5 };
const B = { dist: 7, orb: 0.3, camy: 1.5, tx: 0, ty: 0, lens: 1.6, cyc: 0, et: 0, leak: 0, moon: 0, mq: 6, met: 0, sats: 1, shake: 0 };
export default {
  END: 20, gl: "720x1280",
  scenes: [
    { a: 0, b: 1, glsl: "court", p: { ...K, cx: 4.0, cy: 1.0, cz: 5.6, tx: 3.2, ty: 0.7, tz: 3.4, phone: 1, drop: 0.45, ghost: 1 } },
    { a: 1, b: 2, glsl: "ocean", p: { ...O, S: 1 } },
    { a: 2, b: 3, glsl: "ocean", p: { ...O, S: 2 } },
    { a: 3, b: 4, glsl: "orbit", p: { ...B, cyc: 2 } },
    { a: 4, b: 5, glsl: "orbit", p: { ...B, cyc: 2, et: 8 } },
    { a: 5, b: 6, glsl: "orbit", p: { ...B, leak: 1, dist: 4.5, sats: 0 } },
    { a: 6, b: 7, glsl: "orbit", p: { ...B, dist: 16, moon: 1, mq: 5, met: 12, cyc: 2, et: 30, camy: 5 } },
  ],
  captions: [],
};
