const LL = { cx: 0, cy: 0, cz: 0, yaw: 0, pitch: 0, roll: 0, lens: 1.2, shake: 0, follow: 0, man: 0, fx: 0, fy: 0, fz: 0, pose: 0, froll: 0, ftilt: 0, fyaw: 0, crust: 0.8, glow: 1, so2: 0, co2: 0, steam: 0.0, heat: 0, therm: 0, sink: 0, cell: 0 };
export default { END: 8, captions: [], scenes: [
  { a: 0, b: 1, glsl: "lavalake", p: { ...LL, cx: 0, cy: 262, cz: 150, pitch: -0.85 } },
  { a: 1, b: 2, glsl: "lavalake", p: { ...LL, man: 1, fx: 0, fy: 200, fz: 0, pose: 1, ftilt: 1.45, follow: 1, cx: 0, cy: 6, cz: 4, pitch: -1.1, lens: 0.75 } },
  { a: 2, b: 3, glsl: "lavalake", p: { ...LL, man: 1, fx: 0, fy: 0.2, fz: 0, pose: 0.35, ftilt: -1.57, sink: 0.12, follow: 1, cx: 3.5, cy: 7, cz: 1.5, yaw: -1.3, pitch: -1.15, cell: 2.2 } },
  { a: 3, b: 4, glsl: "lavalake", p: { ...LL, cx: 0, cy: 12, cz: 60, pitch: -0.25, crust: 0.4, heat: 1 } },
  { a: 4, b: 5, glsl: "lavalake", p: { ...LL, cx: 0, cy: 90, cz: 100, pitch: -0.6, co2: 1, so2: 0.0 } },
  { a: 5, b: 6, glsl: "lavalake", p: { ...LL, cx: 0, cy: 40, cz: 60, pitch: -0.5, so2: 0.6, man: 1, fx: 0, fy: 0.2, fz: 45, ftilt: -1.57, pose: 0.35 } },
  { a: 6, b: 7, glsl: "lavalake", p: { ...LL, man: 1, fx: 0, fy: 241, fz: 166, follow: 1, cx: 0.6, cy: 2.4, cz: 4.2, pitch: -0.62 } },
  { a: 7, b: 8, glsl: "lavalake", p: { ...LL, cx: 0, cy: 420, cz: 0.1, pitch: -1.5, crust: 0.95 } },
] };
