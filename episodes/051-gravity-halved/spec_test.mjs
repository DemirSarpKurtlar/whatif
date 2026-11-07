const K = { cx: 4.2, cy: 1.9, cz: 4.2, tx: 0, ty: 1.9, tz: 0.2, lens: 1.25, shake: 0, jt: 0, ghost: 0, phone: 0, drop: 0 };
const C = { cam: 0, rise: 0, tilt: 0, panx: 0, shake: 0, ph: 0, pov: 0, wat: 1, lift: 0, wlift: 0, spin: 0, dust: 0, air: 0, splash: 0, hop: 0, tree: 0, gee: 0 };
export default {
  END: 20, gl: "720x1280",
  scenes: [
    { a: 0, b: 1, glsl: "court", p: { ...K, jt: 0.64, ghost: 0.0 } },
    { a: 1, b: 2, glsl: "court", p: { ...K, jt: 0.32, ghost: 1.0 } },
    { a: 2, b: 3, glsl: "court", p: { ...K, jt: 0.9, ghost: 1.0 } },
    { a: 3, b: 4, glsl: "court", p: { ...K, cx: 2.2, cy: 0.9, cz: 3.0, tx: 1.2, ty: 0.65, tz: 1.6, phone: 1, drop: 0.45, ghost: 1 } },
    { a: 4, b: 5, glsl: "lowcity", p: { ...C, cam: 0.5, hop: 1.0 } },
    { a: 5, b: 6, glsl: "lowcity", p: { ...C, cam: [0.8, 0.95], rise: -0.3, tilt: [3.8, 4.8], panx: [2.2, 2.7], tree: 0.26 } },
    { a: 6, b: 7, glsl: "lowcity", p: { ...C, cam: [0, 0.15], rise: [4.6, 5.2], tilt: [1.9, 2.5], panx: [-0.8, 0.6], hop: 1.0, air: 1 } },
  ],
  captions: [],
};
