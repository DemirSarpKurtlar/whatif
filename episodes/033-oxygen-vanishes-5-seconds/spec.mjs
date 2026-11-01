const PK = { cam: 0, lift: 0, float: 0, rise: 0, shake: 0, panx: 0, tilt: 0, fire: 0.5, smoke: 0, pop: 0, uv: 0, dim: 0, ears: 0 };
const ST = { cam: 0, drive: 0, exh: 0, lean: 0, crk: 0, myth: 0, shake: 0, tilt: 0, panx: 0 };
export default {
  END: 10, captions: [],
  scenes: [
    { a: 0, b: 2, glsl: "parkox", p: { ...PK, cam: 0.6 } },
    { a: 2, b: 4, glsl: "parkox", p: { ...PK, cam: 1.0, fire: 0, smoke: 1, pop: 1, ears: 1, shake: 0.3 } },
    { a: 4, b: 6, glsl: "parkox", p: { ...PK, cam: 0.5, fire: 0, tilt: 3.0, uv: 1, dim: 1 } },
    { a: 6, b: 8, glsl: "streetox", p: { ...ST, drive: 3, exh: 1 } },
    { a: 8, b: 10, glsl: "streetox", p: { ...ST, crk: 1, myth: 1, tilt: 0.6 } },
  ],
};
