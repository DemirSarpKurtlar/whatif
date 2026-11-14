const PL = { dist: 9.0, orb: 0.35, camy: 0.6, tx: 0.0, ty: 2.2, md: 3.6, ma: 0.25, pl: 1.25, ring: 0, ghost: 0, gr: 7.2, bulge: 0, ecl: 0, umb: 0.137, spin: 0, brake: 0 };
const CO = { cam: 0, level: 0, surge: 0, night: 0, moon: 0, shake: 0, tilt: 0, panx: 0, wet: 0, milky: 0, curve: 0, yaw: 0, camh: 0, mrad: 0.025, mlight: 1, ecl: 0, srad: 0.013 };
export default { END: 10, gl: "720x1280", hook: false,
  scenes: [
    { a: 0, b: 1, glsl: "planets", p: { ...PL, ghost: 1, ring: 1 } },
    { a: 1, b: 2, glsl: "planets", p: { ...PL, bulge: 1, dist: 6, ty: 0.8, camy: 0.2, ma: 0.6 } },
    { a: 2, b: 3, glsl: "planets", p: { ...PL, ecl: 1, ma: 0.9, dist: 5, ty: 0.3, orb: 0.9 } },
    { a: 3, b: 4, glsl: "coast", p: { ...CO, night: 1, moon: 1, mrad: 0.05, mlight: 2.2 } },
    { a: 4, b: 5, glsl: "coast", p: { ...CO, night: 1, moon: 1, mrad: 0.025, mlight: 1 } },
    { a: 5, b: 6, glsl: "coast", p: { ...CO, yaw: 0.55, level: 2.5, camh: 1.5 } },
    { a: 6, b: 7, glsl: "coast", p: { ...CO, ecl: 1, mrad: 0.026 } },
    { a: 7, b: 8, glsl: "coast", p: { ...CO, ecl: 0.6, mrad: 0.026 } },
    { a: 8, b: 9, glsl: "coast", p: { ...CO, yaw: 0.55, level: 0 } },
  ], captions: [] };
