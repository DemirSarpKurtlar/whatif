// Episode 015 — What if Earth shrank to the size of the Moon?
const PL = { dist: 7.6, orb: 0.25, camy: 0.3, tx: 0.3, ty: 1.0, er: 1.0, mx: 0.6, my: 2.0, mz: 0.0, spin: 0, leak: 0, path: 0, ghost: 0 };
const PK = { cam: 0, lift: 0, float: 0, rise: 0, shake: 0, panx: 0, tilt: 0 };
const CO = { cam: 0, level: 0, surge: 0, night: 0, moon: 0, shake: 0, tilt: 0, panx: 0, wet: 0, milky: 0, curve: 0 };
export default {
  END: 51.9,
  title: { text: "What if Earth shrank to the size of the Moon?", end: 3.0 },
  scenes: [
    { a: 0, b: 3.0, glsl: "planets", p: { ...PL, dist: [8.2, 7.6], orb: [0.2, 0.28], spin: [0, 0.1] } },
    { a: 3.0, b: 9.2, glsl: "planets", p: { ...PL, dist: [7.6, 6.0], orb: [0.28, 0.4], tx: 0.3, ty: [1.0, 1.1], spin: [0.1, 0.5], er: [[0, 1.0], [0.4, 1.0], [3.6, 0.273]], ghost: [[0, 0], [0.4, 0], [1.2, 1]] },
      hud: { cat: "SAME ROCK · SAME DENSITY", label: "EARTH'S DIAMETER", value: "", sub: "THE SIZE OF THE MOON", counter: { at: 0.4, dur: 3.2, from: 12742, to: 3475, suffix: " km", easing: "ease-in-out" } } },
    { a: 9.2, b: 16.2, glsl: "park", p: { ...PK, cam: [0, 0.9], lift: [[0, 0], [3.0, 0], [4.0, 0.35], [5.2, 0], [7.0, 0]] },
      hud: { cat: "STEP OUTSIDE", label: "GRAVITY", value: "27 %", sub: "70 KG SUDDENLY FEELS LIKE 19 KG", dot: "#4FD1A5" } },
    { a: 16.2, b: 19.5, glsl: "park", p: { ...PK, cam: [0.9, 1.3], tilt: [0.1, 0.5], lift: [[0, 0], [1.1, 1.9], [2.0, 2.05], [3.3, 0.6]] },
      hud: { cat: "EVERYONE CAN DUNK", label: "YOU CAN JUMP", value: "4× higher", sub: "SAME LEGS · A QUARTER OF THE PULL", dot: "#4FD1A5" } },
    { a: 19.5, b: 27.3, glsl: "coastcurve", p: { ...CO, cam: [0, 0.8], panx: [0.9, 1.2], tilt: [0.03, -0.03], curve: [[0, 0], [2.0, 0], [6.0, 1]] },
      hud: { cat: "THE HORIZON CREEPS CLOSER", label: "EDGE OF THE WORLD", value: "", sub: "HALF AS FAR AS TODAY", counter: { at: 2.0, dur: 4.0, from: 4.7, to: 2.4, dec: 1, suffix: " km", easing: "ease-in-out" } } },
    { a: 27.3, b: 34.0, glsl: "planets", p: { ...PL, er: 0.273, dist: [5.6, 5.0], orb: [0.5, 0.75], tx: 0.3, ty: 1.0, spin: [0.5, 0.8], camy: [0.6, 0.9] },
      hud: { cat: "THEN THE SKY CHANGES", label: "EARTH'S MASS", value: "2 %", sub: "FAR TOO LITTLE TO HOLD THE MOON", vcol: "#FF6B5E" } },
    { a: 34.0, b: 37.2, glsl: "planets", p: { ...PL, er: 0.273, dist: [5.0, 7.5], orb: [0.75, 0.85], tx: [0.3, 0.5], ty: [1.0, 1.7], camy: [0.9, 1.2], spin: [0.8, 0.9], mx: [0.6, 1.1], my: [2.0, 3.4], mz: [0.0, -1.2], path: [[0, 0], [0.3, 1], [3.2, 1]] },
      hud: { cat: "THE MOON", label: "SET FREE", value: "Drifts away", sub: "INTO ITS OWN ORBIT AROUND THE SUN", dot: "#F2C14E" } },
    { a: 37.2, b: 42.4, glsl: "planets", p: { ...PL, er: 0.273, mx: 1.1, my: 3.4, mz: -1.2, dist: [2.2, 1.7], orb: [0.1, 0.3], tx: [0.3, 0.1], ty: 0, camy: [0.4, 0.3], spin: [0.9, 1.2] },
      hud: { cat: "AND THE AIR?", label: "ESCAPE SPEED", value: "", sub: "WHAT A MOLECULE NEEDS TO FLY OFF FOREVER", counter: { at: 1.3, dur: 3.4, from: 11.2, to: 3.0, dec: 1, suffix: " km/s", easing: "ease-in-out" } } },
    { a: 42.4, b: 51.9, glsl: "planets", p: { ...PL, er: 0.273, mx: 1.1, my: 3.4, mz: -1.2, dist: [1.7, 2.3], orb: [0.3, 0.55], tx: [0.1, 0.2], ty: 0, camy: [0.3, 0.5], spin: [1.2, 1.6], leak: [[0, 0], [0.8, 0], [4.0, 1]] },
      hud: { cat: "OVER MILLIONS OF YEARS", label: "THE ATMOSPHERE", value: "Leaks away", sub: "SLOWLY, INTO SPACE", dot: "#5CB8F0" } },
  ],
  captions: [
    [3.04, 6.8, "Same rock, same density, just a planet about a quarter as wide."], [6.94, 8.9, "And you stay exactly the same size."],
    [9.28, 11.1, "Step outside, and you feel light."], [11.42, 13.0, "Gravity drops to about a quarter,"],
    [13.08, 16.0, "so a 70 kilo person suddenly weighs like 19."], [16.34, 18.0, "You can jump four times higher."],
    [18.24, 19.4, "Everyone can dunk."], [19.62, 21.4, "The horizon creeps closer too."],
    [21.72, 25.7, "Standing on a beach, the edge of the world is just 2.5 km away,"], [25.94, 27.1, "half as far as today."],
    [27.42, 28.7, "Then the sky changes."], [28.98, 31.6, "Earth now has barely 2 % of its mass,"],
    [31.76, 33.8, "far too little to hold on to the Moon."], [34.02, 37.0, "It drifts away, into its own orbit around the Sun."],
    [37.24, 38.2, "And the air?"], [38.44, 42.2, "Escape speed drops from 11 km per second to just three."],
    [42.48, 46.2, "Over millions of years, the atmosphere slowly leaks into space."],
  ],
  flashes: [{ at: 3.4, dur: 0.3 }],
  endCard: { at: 46.4, title: "What if Earth shrank to the size of the Moon?", small: ["SIMPLIFIED PHYSICS · FOR FUN", "SAME DENSITY · YOU STAY FULL SIZE"], cta: "AIR OR A 4× HIGHER JUMP?" },
};
