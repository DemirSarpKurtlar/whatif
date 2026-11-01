const ST = { alt: 11, rad: 320, pitch: -0.3, roll: 0, lens: 1.25, fish: 0.5, shake: 0,
  man: 0, mx: 0, my: 0, md: 4, pose: 1, froll: 0, ftilt: 0, fyaw: 0, cap: 0, chute: 0, mach: 0, streak: 0, frost: 0,
  pl: 0, plx: 0, ply: 0, pld: 130, ppit: 0, pyaw: 0, proll: 0, brk: 0, trail: 0, cloud: 0, blk: 0, snow: 0, red: 0 };
export default { END: 6, title: { text: "x", end: 0 }, hook: false, captions: [], huds: [], bigs: [], flashes: [], endCard: { at: 99, title: "x", cta: "x" },
  scenes: [
    { a: 0, b: 1, glsl: "plunge", p: { ...ST, pitch: -0.1, pl: 1, plx: 0, ply: 6, pld: 140, pyaw: 0.4, trail: 1 } },
    { a: 1, b: 2, glsl: "plunge", p: { ...ST, pitch: 0.9, pl: 1, plx: 10, ply: 0, pld: 220, ppit: -1.5708, pyaw: 0.6, trail: 1, man: 1, md: 7, my: -0.6, froll: 0.6, ftilt: 0.4 } },
    { a: 2, b: 3, glsl: "plunge", p: { ...ST, pitch: -0.8, fish: 0.4, man: 1, my: -0.15, md: 6, blk: 0.55, frost: 0.0, red: 0.6 } },
    { a: 3, b: 4, glsl: "plunge", p: { ...ST, alt: 0.6, pitch: -1.1, fish: 0.4, man: 1, my: -0.15, md: 9, snow: 1 } },
    { a: 4, b: 5, glsl: "plunge", p: { ...ST, alt: 1.2, pitch: -0.9, pl: 1, brk: 1, plx: 0, ply: -5, pld: 70, ppit: 0.5, pyaw: 0.8, proll: 0.4, snow: 1 } },
    { a: 5, b: 6, glsl: "plunge", p: { ...ST, alt: 3.0, pitch: -0.8, man: 1, md: 9, cloud: 0.6 } },
  ] };
