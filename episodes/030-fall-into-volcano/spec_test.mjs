const LL = { cx: 0, cy: 0, cz: 0, yaw: 0, pitch: 0, roll: 0, lens: 1.2, shake: 0, follow: 0, man: 0, fx: 0, fy: 0, fz: 0, pose: 0, froll: 0, ftilt: 0, fyaw: 0, crust: 0.8, glow: 1, so2: 0, co2: 0, steam: 0, heat: 0, therm: 0, sink: 0, cell: 0, ledge: 0 };
const LIE = { man: 1, fx: 0, fy: 0.2, fz: 0, pose: 0.35, ftilt: 1.57, sink: 0.12, crust: 0.95, cell: 2.2 };
export default { END: 8, captions: [], scenes: [
  { a: 0, b: 1, glsl: "lavalake", p: { ...LL, man: 1, fx: 0, fy: 240.0, fz: 163, ledge: 1, follow: 1, cx: 1.0, cy: 5.5, cz: 4.5, pitch: -0.95 } },
  { a: 1, b: 2, glsl: "lavalake", p: { ...LL, ...LIE, therm: 1, follow: 1, cx: 3.5, cy: 7, cz: 1.5, yaw: -1.3, pitch: -1.15 } },
  { a: 2, b: 3, glsl: "lavalake", p: { ...LL, cx: 0, cy: 3, cz: 20, pitch: -0.35, crust: 0.6, cell: 3, heat: 1 } },
  { a: 3, b: 4, glsl: "lavalake", p: { ...LL, cx: 60, cy: 130, cz: 80, yaw: -0.8, pitch: -0.55, so2: 1, steam: 1 } },
  { a: 4, b: 5, glsl: "lavalake", p: { ...LL, cx: 0, cy: 70, cz: 90, pitch: -0.55, co2: 1 } },
  { a: 5, b: 6, glsl: "lavalake", p: { ...LL, man: 1, fx: 0, fy: 90, fz: 0, pose: 1, ftilt: 1.45, follow: 1, cx: 0, cy: 4.5, cz: 3, pitch: -1.15, lens: 0.75 } },
  { a: 6, b: 7, glsl: "lavalake", p: { ...LL, cx: 0, cy: 18, cz: 40, pitch: -0.3, crust: 0.3, heat: 0.6 } },
  { a: 7, b: 8, glsl: "lavalake", p: { ...LL, cx: 0, cy: 420, cz: 0.1, pitch: -1.5, crust: 0.97 } },
] };
