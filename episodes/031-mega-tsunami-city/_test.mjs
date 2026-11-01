const MW = { cx: 10, cy: 1.7, cz: 60, yaw: 0.48, tilt: 0.05, lens: 0.9, shake: 0, level: 0, wh: 0, wz: -400, fish: 0, dark: 0, boat: 0, spray: 0 };
export default {
  END: 10,
  scenes: [
    { a: 0, b: 1, glsl: "megawave", p: { ...MW } },
    { a: 1, b: 2, glsl: "megawave", p: { ...MW, level: -6, fish: 1, boat: 1, yaw: 0.1, tilt: -0.12, cz: 30 } },
    { a: 2, b: 3, glsl: "megawave", p: { ...MW, level: -6, wh: 40, wz: -700, yaw: 0.25, dark: 0.3, spray: 1 } },
    { a: 3, b: 4, glsl: "megawave", p: { ...MW, level: -6, wh: 105, wz: -250, yaw: 0.2, tilt: 0.25, dark: 0.6, spray: 1, shake: 0.3 } },
    { a: 4, b: 5, glsl: "megawave", p: { ...MW, cx: 120, cy: 25, cz: 450, level: -6, wh: 105, wz: -100, yaw: 0.35, tilt: 0.08, lens: 1.2, dark: 0.5, spray: 1 } },
    { a: 5, b: 6, glsl: "megawave", p: { ...MW, cx: -95, cy: 93, cz: -60, level: -6, wh: 105, wz: -160, yaw: 0.0, tilt: 0.12, lens: 0.9, dark: 0.6, spray: 1 } },
  ],
  captions: [],
};
