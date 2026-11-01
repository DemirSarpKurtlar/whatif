const A = { tz: 0, tx: 0, depth: 0, look: 0, dist: 5.5, orb: 0.35, sink: 0.4, lamp: 0, aim: 0.5, wreck: 0, floor: 0, shrimp: 0, press: 0, gauge: 1, ty: 0 };
export default {
  END: 20, title: { text: "x", end: 0 }, hook: false,
  scenes: [
    { a: 0, b: 2, glsl: "abyss", p: { ...A, depth: 8, look: 0.9, gauge: 0 } },
    { a: 2, b: 4, glsl: "abyss", p: { ...A, depth: 150, look: 0.2 } },
    { a: 4, b: 6, glsl: "abyss", p: { ...A, depth: 1200, lamp: 1, aim: 2.5, look: 0.1 } },
    { a: 6, b: 8, glsl: "abyss", p: { ...A, depth: 3800, lamp: 1, wreck: 1, aim: 2.77, dist: 6.5, orb: -0.25, tx: 0.5, look: -0.3, ty: -0.6 } },
    { a: 8, b: 10, glsl: "abyss", p: { ...A, depth: 6000, lamp: 1, sink: 8, aim: 2.3 } },
    { a: 10, b: 12, glsl: "abyss", p: { ...A, depth: 10935, lamp: 1, floor: 1, press: 0.8, look: -0.3, aim: 2.6 } },
    { a: 12, b: 14, glsl: "abyss", p: { ...A, depth: 10935, lamp: 1, floor: 1, shrimp: 1, look: -0.7, dist: 3.0, ty: -1.05, tz: -1.6, aim: 2.8, orb: 0.9, gauge: 0 } },
    { a: 14, b: 16, glsl: "trenchcut", p: { ev: 0.5, gap: 0, you: 1, splash: 0.5, pull: 0 } },
    { a: 16, b: 18, glsl: "trenchcut", p: { ev: 1, gap: 1, you: 0, splash: 0, pull: 0 } },
  ],
  captions: [[16.2, 17.8, "Drop Mount Everest in, and its peak"]],
};
