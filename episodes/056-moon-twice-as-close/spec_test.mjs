const PL = { dist: 14.0, orb: 0.3, camy: 1.0, tx: 0.0, ty: 3.3, md: 3.6, ma: 0.0, pl: 0.9, ring: 1, ghost: 1, gr: 7.2, bulge: 0, ecl: 0, umb: 0.137, spin: 0, brake: 0 };
const CO = { cam: 0, level: 0, surge: 0, night: 0, moon: 0, shake: 0, tilt: 0, panx: 0, wet: 0, milky: 0, curve: 0, yaw: 0, camh: 0, mrad: 0.025, mlight: 1, ecl: 0, srad: 0.013 };
export default { END: 10, gl: "720x1280", hook: false,
  scenes: [
    { a: 0, b: 1, glsl: "planets", p: { ...PL } },
    { a: 1, b: 2, glsl: "planets", p: { ...PL, ghost: 0, ring: 0, bulge: 1, dist: 10, ty: 1.5, camy: 0.4, ma: 0.5, md: 3.0, pl: 1.87 } },
    { a: 2, b: 3, glsl: "planets", p: { ...PL, ghost: 0, ring: 1, dist: 10, ty: 0.0, camy: 6, orb: 0.3, pl: 1.6, ma: 2.0, md: 3.0 } },
    { a: 3, b: 4, glsl: "planets", p: { ...PL, ghost: 0, ring: 0, ecl: 1, dist: 7, ty: 1.0, camy: 0.3, ma: 1.2, md: 3.0, pl: 0.85, orb: 0.6 } },
  ], captions: [] };
