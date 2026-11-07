const C = { cam: 0, rise: 0, tilt: 0, panx: 0, shake: 0, ph: 0, pov: 0, wat: 1, lift: 0, wlift: 0, spin: 0, dust: 0, air: 0, splash: 0 };
const R = { cam: 0, rise: 0, tilt: 0, panx: 0, shake: 0, ph: 0 };
export default {
  END: 8, gl: "720x1280",
  scenes: [
    { a: 0, b: 1, glsl: "lowcity", p: { ...C } },
    { a: 1, b: 2, glsl: "lowcity", p: { ...C, rise: 9, tilt: -6, ph: 1.9, spin: 0.8, dust: 0.6, cam: 0.5 } },
    { a: 2, b: 3, glsl: "lowcity", p: { ...C, rise: -0.4, tilt: 9, ph: 2.0, spin: 0.8, cam: 0.8 } },
    { a: 3, b: 4, glsl: "room", p: { ...R, ph: 0.8 } },
    { a: 4, b: 5, glsl: "lowcity", p: { ...C, splash: 1, rise: 3, tilt: -1.5, ph: 4 } },
    { a: 5, b: 6, glsl: "lowcity", p: { ...C, ph: 2.1, rise: 4, tilt: 0, cam: 1, spin: 1 } },
    { a: 6, b: 7, glsl: "lowcity", p: { ...C, ph: 2.0, pov: 1, tilt: 30, air: 1, dust: 1, spin: 1 } },
  ],
  captions: [],
};
