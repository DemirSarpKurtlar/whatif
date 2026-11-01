const MO = { dist: 4.2, orb: 0.25, camy: 1.0, ty: 1.15, tx: 0, lens: 1.4, vapor: 0, boil: 0, steam: 0, swell: 0, arms: 0, fall: 0, dark: 0, thermal: 0, shake: 0, man: 1, lander: 0, earth: 0.3, eaz: 0, eel: 0 };
export default {
  END: 8,
  scenes: [
    { a: 0, b: 1, glsl: "moon", p: { ...MO, vapor: 1, camy: 0.8, ty: 1.3 } },
    { a: 1, b: 2, glsl: "moon", p: { ...MO, dist: 1.0, camy: 1.6, ty: 1.58, orb: 0.35, boil: 1, lens: 1.6 } },
    { a: 2, b: 3, glsl: "moon", p: { ...MO, swell: 1, steam: 1, arms: 1 } },
    { a: 3, b: 4, glsl: "moon", p: { ...MO, thermal: 1, dist: 7, camy: 2.5, ty: 0.6 } },
    { a: 4, b: 5, glsl: "moon", p: { ...MO, dist: 12, camy: 0.6, ty: 2.5, lander: 1, orb: 0.6 } },
    { a: 5, b: 8, glsl: "moon", p: { ...MO, fall: 1, dark: 0.3, ty: 0.3, tx: -0.7, camy: 1.4, dist: 3.2 } },
  ],
  captions: [],
};
