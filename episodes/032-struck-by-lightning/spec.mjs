const ST = { cam: 1, rise: 0, tilt: 0, panx: 0, yaw: 0, zoom: 0, shake: 0, rain: 1, flash: 0, dark: 0,
  bolt: 0, bx: 0.05, by: 1.72, bz: 0.3, seed: 1, heat: 0, you: 1, hair: 0, glow: 0, side: 0, rings: 0, ripple: 0 };
export default {
  END: 10, captions: [], huds: [], bigs: [], flashes: [],
  scenes: [
    { a: 0, b: 2, glsl: "parkstorm", p: { ...ST, hair: 1 } },
    { a: 2, b: 4, glsl: "parkstorm", p: { ...ST, bolt: 1, flash: 0.6, hair: 1 } },
    { a: 4, b: 6, glsl: "parkstorm", p: { ...ST, glow: 1, flash: 0.2 } },
    { a: 6, b: 8, glsl: "parkstorm", p: { ...ST, cam: 0.3, you: 0, yaw: -6, bolt: 1, bx: -3.6, by: 5.4, bz: -6.0, side: 1, rings: 1, ripple: 0.5, flash: 0.5 } },
    { a: 8, b: 10, glsl: "parkstorm", p: { ...ST, you: 0, cam: 0.2, tilt: 3, bolt: 1, bx: 8, by: 0, bz: -40, seed: 4, flash: 0.3 } },
  ],
};
