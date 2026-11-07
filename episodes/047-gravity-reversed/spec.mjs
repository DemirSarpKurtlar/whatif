const C = { cam: 0, rise: 0, tilt: 0, panx: 0, shake: 0, ph: 0, pov: 0, wat: 1, lift: 0, wlift: 0, spin: 0, dust: 0, air: 0, splash: 0 };
export default {
  END: 8, gl: "720x1280",
  scenes: [
    { a: 0, b: 1, glsl: "lowcity", p: { ...C, splash: 1, rise: 3, tilt: -1.5, ph: 4 } },
    { a: 1, b: 2, glsl: "lowcity", p: { ...C, rise: -0.3, tilt: 4.5, ph: 2.0, spin: 0.8, cam: 0.9, panx: 2.5 } },
    { a: 2, b: 3, glsl: "lowcity", p: { ...C, rise: -0.5, tilt: 14, ph: 2.0, spin: 0.8, cam: 1, air: 1, dust: 1 } },
    { a: 3, b: 4, glsl: "lowcity", p: { ...C, ph: 3.2, pov: 1, tilt: -3, spin: 1 } },
    { a: 4, b: 5, glsl: "lowcity", p: { ...C, ph: 0.5, pov: 1, tilt: -1, spin: 0.3, dust: 0.8 } },
  ],
  captions: [],
};
