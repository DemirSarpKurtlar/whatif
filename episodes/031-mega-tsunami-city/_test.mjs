const MW = { cx: 10, cy: 1.7, cz: 15, yaw: 0.42, tilt: 0.02, lens: 0.9, shake: 0, level: 0, wh: 0, wz: -400, fish: 0, dark: 0, boat: 0, spray: 0 };
const IN = { cx: 0, cy: 30, cz: 40, tx: 0, ty: 0, tz: -60, water: 2.0, front: -20, dark: 0.3, shake: 0 };
const FJ = { cx: 0, cy: 260, cz: 1500, tx: 0, ty: 350, tz: -1600, run: 524, foam: 0, mark: 1, shake: 0 };
const IM = { dist: 80, orb: 0.4, camh: 14, rock: 0, flash: 0, cav: 0, col: 0, ring: 40, wave: 1, shake: 0 };
export default {
  END: 10,
  scenes: [
    { a: 0, b: 1, glsl: "megawave", p: { ...MW } },
    { a: 1, b: 2, glsl: "megawave", p: { ...MW, level: -6, fish: 1, boat: 1, cx: 6, cz: -25, cy: 0.9, yaw: 0.1, tilt: -0.22, lens: 1.0 } },
    { a: 2, b: 3, glsl: "megawave", p: { ...MW, level: -6, wh: 105, wz: -330, yaw: 0.2, tilt: 0.3, dark: 0.6, spray: 1, shake: 0.3 } },
    { a: 3, b: 4, glsl: "megawave", p: { ...MW, cx: 120, cy: 12, cz: 450, level: -6, wh: 112, wz: -100, yaw: 0.35, tilt: 0.08, lens: 1.2, dark: 0.5, spray: 1 } },
    { a: 4, b: 5, glsl: "megawave", p: { ...MW, cx: -95, cy: 97, cz: -70, level: -6, wh: 105, wz: -220, yaw: 0.0, tilt: -0.05, lens: 0.9, dark: 0.6, spray: 1 } },
    { a: 5, b: 6, glsl: "inland", p: { ...IN } },
    { a: 6, b: 7, glsl: "fjord", p: { ...FJ } },
    { a: 7, b: 8, glsl: "deepsea", p: { ...IM } },
    { a: 8, b: 9, glsl: "sky", p: { fly: 0.5, climb: 0.2 } },
  ],
  captions: [],
};
