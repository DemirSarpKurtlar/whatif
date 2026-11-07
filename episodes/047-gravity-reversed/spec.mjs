const C = { cam: 0, rise: 0, tilt: 0, panx: 0, shake: 0, ph: 0, pov: 0, wat: 0, lift: 0, wlift: 0, spin: 0, dust: 0, air: 0, splash: 0 };
const R = { cam: 0, rise: 0, tilt: 0, panx: 0, shake: 0, ph: 0 };
export default {
  END: 8, gl: "720x1280",
  scenes: [
    { a: 0, b: 1, glsl: "lowcity", p: { ...C } },
    { a: 1, b: 2, glsl: "lowcity", p: { ...C, rise: 6, tilt: -4, ph: 1.0, spin: 0.6, dust: 1 } },
    { a: 2, b: 3, glsl: "room", p: { ...R } },
    { a: 3, b: 4, glsl: "room", p: { ...R, ph: 0.8 } },
    { a: 4, b: 5, glsl: "lowcity", p: { ...C, splash: 1, rise: 3, tilt: -1.5 } },
    { a: 5, b: 6, glsl: "lowcity", p: { ...C, ph: 1.6, pov: 1, wat: 1, tilt: -6, spin: 1 } },
  ],
  captions: [],
};
