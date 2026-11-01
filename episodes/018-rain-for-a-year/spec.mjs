// Episode 018 — What if it rained everywhere on Earth for a whole year?
const F = { cx: 0, cy: 2.2, cz: 32, tx: 0, ty: 5, tz: -30, water: 0, statue: 0, dusk: 0, shake: 0, rain: 1, gloom: 0.45 };
const ST = { cam: 0, fling: 0, lean: 0, wind: 0, shake: 0, tilt: 0, dust: 0, panx: 0, rain: 1, gloom: 0.4 };
const ME = { cam: 0, yaw: 0, pitch: 0.25, lens: 0.85, sunel: 0.6, sunaz: 2.6, sunsize: 1, ash: 0, snow: 0, heat: 0, steam: 0, shake: 0, rain: 1, gloom: 0.5 };
const EA = { dist: 5.6, orb: 0.3, camy: 0, tx: 0, ty: 0, spin: 0, leak: 0, quake: 0, shake: 0, sun: 0.6, diag: 0, cloud: 0.5 };
const DE = { cam: 0, bloom: 0, rain: 0.3, gloom: 0.15, pitch: 0, yaw: 0 };
export default {
  END: 52.9,
  accent: "#8FD3FF",
  title: { text: "What if it rained everywhere for a whole year?", end: 3.9 },
  scenes: [
    { a: 0, b: 4.1, glsl: "floodrain", p: { ...F, cz: [34, 31], ty: [8, 5.5], rain: 0.5, gloom: 0.25 } },
    { a: 4.1, b: 11.85, glsl: "streetrain", p: { ...ST, cam: [0, 1.0], panx: [0, 0.4], tilt: [0.05, 0.12] },
      hud: { cat: "NOT A STORM", label: "RAINFALL", value: "1 mm / hour", sub: "EVERY HOUR · ON EVERY CITY, DESERT, MOUNTAIN", dot: "#8FD3FF" } },
    { a: 11.85, b: 16.5, glsl: "earthcloud", p: { ...EA, spin: [0.2, 0.6], cloud: [0.55, 0.9], sun: 0.4 },
      hud: { cat: "BY DECEMBER", label: "TOTAL RAIN, EVERYWHERE", value: "", sub: "8,760 HOURS × 1 MM", counter: { at: 1.4, dur: 2.8, from: 0, to: 8.8, dec: 1, suffix: " m", easing: "ease-out" }, dot: "#8FD3FF" } },
    { a: 16.5, b: 19.6, glsl: "floodrain", p: { ...F, cx: [-4, -2], cz: [30, 27], cy: 1.6, water: 0.05 },
      hud: { cat: "A NORMAL YEAR GIVES ABOUT 1 M", label: "THIS YEAR", value: "9× more", sub: "ON AVERAGE, ACROSS THE WHOLE PLANET", vcol: "#8FD3FF" } },
    { a: 19.6, b: 22.7, glsl: "meadowrain", p: { ...ME, cam: [0, 0.5], pitch: [0.2, 0.1], sunel: 0.4 },
      hud: { cat: "WITHIN WEEKS", label: "THE GROUND", value: "Saturated", sub: "NOWHERE LEFT FOR THE WATER TO GO" } },
    { a: 22.7, b: 26.85, glsl: "floodrain", p: { ...F, cx: [-3, 0], cz: [26, 22], cy: 1.2, ty: [3, 4], water: [[0, 0.05], [0.4, 0.05], [4.1, 0.9]], gloom: 0.55 },
      hud: { cat: "RIVERS BURST THEIR BANKS", label: "FLOODWATER", value: "", sub: "BASEMENTS, THEN SUBWAYS, FILL UP", counter: { at: 0.4, dur: 3.6, from: 0, to: 9, dec: 0, prefix: "+", suffix: " m", easing: "ease-in-out" } } },
    { a: 26.85, b: 30.5, glsl: "meadowrain", p: { ...ME, cam: [0.6, 1.1], pitch: [0.35, 0.3], yaw: [0.25, 0.35], shake: [[0, 0], [1.2, 0], [1.6, 0.35], [3.6, 0.15]], gloom: 0.6 },
      hud: { cat: "ON THE HILLS", label: "WATERLOGGED SOIL", value: "Starts to slide", sub: "LANDSLIDES ON EVERY SLOPE" } },
    { a: 30.5, b: 34.4, glsl: "earthcloud", p: { ...EA, dist: [5.0, 4.5], spin: [0.8, 1.0], cloud: 1.0, sun: 0.2 },
      hud: { cat: "ALL YEAR", label: "SUNLIGHT", value: "Blocked", sub: "A PLANET WRAPPED IN CLOUD", vcol: "#C9D3DE" } },
    { a: 34.4, b: 37.2, glsl: "meadowrain", p: { ...ME, cam: [1.1, 1.5], pitch: [0.15, 0.1], gloom: [0.6, 0.8], sunel: 0.25, snow: [0, 0.08] },
      hud: { cat: "DARKER AND COLDER", label: "MOST CROPS", value: "Rot", sub: "NO SUN TO RIPEN THEM, FIELDS UNDER WATER" } },
    { a: 37.2, b: 40.7, glsl: "desert", p: { ...DE, cam: [0, 0.6], rain: 0.5, gloom: 0.3 },
      hud: { cat: "BUT THE DRIEST PLACES", label: "NORMAL RAIN IN THE ATACAMA", value: "< 1 mm / yr", sub: "SOME SPOTS HAVE GONE YEARS WITHOUT RAIN", dot: "#F2C14E" } },
    { a: 40.7, b: 52.9, glsl: "desert", p: { ...DE, cam: [0.6, 2.6], bloom: [[0, 0], [2.0, 0.15], [7.0, 1.0]], rain: [0.5, 0.0], gloom: [0.3, 0.0], pitch: [0, -0.05], yaw: [0, 0.2] },
      hud: { cat: "THEY BLOOM", label: "DORMANT SEEDS", value: "Wake up", sub: "THE DESERTS TURN GREEN", dot: "#4FD1A5", vcol: "#B8F28A" } },
  ],
  captions: [
    [4.2, 6.7, "Not a storm, just a steady drizzle."], [6.96, 9.1, "One millimetre an hour, every hour,"],
    [9.28, 11.7, "on every city, desert and mountain."], [11.96, 12.9, "That sounds gentle."],
    [13.22, 16.4, "But by December, that's almost nine metres of water."], [16.64, 19.4, "Nine times what Earth normally gets in a year."],
    [19.7, 22.6, "Within weeks, the ground can't soak up any more."], [22.84, 24.4, "Rivers burst their banks."],
    [24.66, 26.8, "Basements, then subways, fill up."], [26.9, 30.3, "On the hills, waterlogged soil starts to slide."],
    [30.6, 32.7, "With clouds blocking the Sun all year,"], [32.88, 34.9, "the planet gets darker and colder,"],
    [35.08, 37.0, "and most crops rot in the fields."], [37.3, 40.3, "But the driest places on Earth do something strange."],
    [40.74, 43.4, "The Atacama, the Sahara... they bloom."], [43.76, 46.7, "Seeds that waited for decades finally wake up,"],
    [46.88, 48.5, "and the deserts turn green."],
  ],
  flashes: [],
  endCard: { at: 48.65, title: "What if it rained everywhere for a whole year?", small: ["SIMPLIFIED · A STEADY 1 MM/H DRIZZLE, EVERYWHERE", "EARTH'S AVERAGE IS ABOUT 1 M A YEAR"], cta: "WHERE WOULD YOU WAIT OUT THE YEAR?" },
};
