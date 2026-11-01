// Episode 006 — What if every human on Earth jumped at the same time?
const C = { cx: 0, cy: 14, cz: 18, tx: 0, ty: 0, tz: -10, jump: 0, arms: 0, dusk: 0, shake: 0, road: 0 };
const PK = { cam: 0, lift: 0, float: 0, rise: 0, shake: 0, panx: 0, tilt: 0 };
const EA = { dist: 5.4, orb: 0.3, camy: 0, tx: 0, ty: 0, spin: 0, leak: 0, quake: 0, shake: 0, sun: 0.6, diag: 0 };
const JUMP_UP = [[0, 0], [2.0, 0, "ease-out"], [2.45, 1.0], [3.1, 1.0]]; // jump at 13.82 within scene starting 11.8
export default {
  END: 55.6,
  title: { text: "What if every human on Earth jumped at the same time?", end: 3.45 },
  scenes: [
    { a: 0, b: 3.45, glsl: "crowd", p: { ...C, cy: [18, 15], cz: [22, 18], tz: -12 } },
    { a: 3.45, b: 5.6, glsl: "park", p: { ...PK, cam: [0.2, 0.9] }, hud: { cat: "STEP ONE", label: "EVERYONE ON EARTH", value: "Meets up", sub: "IN ONE PLACE", dot: "#4FD1A5" } },
    { a: 5.6, b: 11.8, glsl: "crowd", p: { ...C, cy: [9, 42], cz: [10, 34], tz: [-8, -30] }, hud: { cat: "8.2 BILLION PEOPLE", label: "SHOULDER TO SHOULDER", value: "≈ Rhode Island", sub: "ONE SMALL US STATE · ~4,000 km²" } },
    { a: 11.8, b: 14.75, glsl: "crowd", p: { ...C, cx: 0.1, cy: [4.4, 4.0], cz: [6, 5], tx: 0.1, ty: 0.8, tz: -10, jump: JUMP_UP, arms: [[0, 0], [1.8, 0], [2.2, 1]] } },
    { a: 14.75, b: 20.0, glsl: "crowd", p: { ...C, cy: [6, 9], cz: [9, 11], tz: -9, jump: 1.0, arms: 1 }, hud: { cat: "ALL OF US, TOGETHER", label: "TOTAL WEIGHT", value: "0", sub: "≈ 5 × 10¹¹ kg", counter: { at: 0.6, dur: 2.0, from: 0, to: 500, suffix: " billion kg", easing: "ease-out" } } },
    { a: 20.0, b: 23.05, glsl: "earth", p: { ...EA, dist: [5.2, 4.6], spin: [0.2, 0.45] }, hud: { cat: "BUT EARTH", label: "IS HEAVIER BY", value: "10 trillion×", sub: "EARTH ≈ 6 × 10²⁴ kg", dot: "#5CB8F0" } },
    { a: 23.05, b: 27.6, glsl: "atom", p: { cam: [0.3, 1.1], zoom: [0.8, 1.15] }, hud: { cat: "WHEN WE PUSH OFF", label: "EARTH MOVES", value: "< 1/1000 atom", sub: "≈ 0.00000000000004 m", dot: "#5CB8F0" } },
    { a: 27.6, b: 33.2, glsl: "crowd", p: { ...C, cx: [0.1, 0.4], cy: [4.6, 5.2], cz: [6, 7.5], tx: 0.1, ty: 0.8, tz: -10, jump: [[0, 1.0], [0.4, 1.0, "ease-in"], [0.75, 0], [5.6, 0]], arms: [[0, 1], [0.75, 1], [1.4, 0]], shake: [[0, 0], [0.74, 0], [0.8, 1.0], [2.5, 0.25], [5.6, 0]] }, hud: { at: 0.8, cat: "THEN WE LAND", label: "THE ROAR", value: "Deafening", sub: "LOUDER THAN ANY STADIUM · HEARD FOR KILOMETRES" } },
    { a: 33.2, b: 35.2, glsl: "earth", p: { ...EA, dist: [4.8, 4.6], spin: [0.5, 0.6] }, hud: { cat: "AND THE PLANET?", label: "BARELY NOTICES", value: "≈ Nothing", sub: "NO QUAKE · NO ORBIT CHANGE", dot: "#4FD1A5" } },
    { a: 35.2, b: 43.2, glsl: "crowd", p: { ...C, cx: [0, 3], cy: [20, 28], cz: [16, 22], tx: [2, 6], tz: -20, road: 1, dusk: [0.15, 0.45] } },
    { a: 43.2, b: 47.85, glsl: "crowd", p: { ...C, cx: [5, 6], cy: [9, 7], cz: [12, 8], tx: 7, ty: 0.5, tz: -12, road: 1, dusk: [0.5, 0.75] } },
    { a: 47.85, b: 55.6, glsl: "crowd", p: { ...C, cy: [30, 60], cz: [26, 50], tz: -30, road: 1, dusk: [0.75, 0.9] }, hud: { cat: "THE JUMP WAS EASY", label: "THE DISASTER IS", value: "Leaving", sub: "SO... WOULD YOU JUMP?", vcol: "#FF6B5E" } },
  ],
  huds: [
    { at: 35.2, dur: 4.16, cat: "THE REAL PROBLEM", label: "WHAT COMES NEXT", value: "Leaving", sub: "8 BILLION PEOPLE · ONE TINY STATE" },
    { at: 43.2, dur: 2.2, cat: "GETTING EVERYONE HOME", label: "WOULD TAKE", value: "Months", sub: "TRAFFIC JAM TO THE HORIZON" },
    { at: 39.36, dur: 3.84, cat: "ONE TINY STATE", label: "WAYS OUT", value: "1 airport", sub: "+ A HANDFUL OF ROADS", dot: "#F2C14E" },
    { at: 45.4, dur: 2.45, cat: "FOOD AND WATER", label: "RUN OUT IN", value: "Days", sub: "NOBODY IS WORKING THE FARMS", vcol: "#FF6B5E" },
  ],
  captions: [
    [3.62, 5.4, "First, we'd all have to meet up."],
    [5.76, 8.3, "Eight billion people, packed shoulder to shoulder,"],
    [8.44, 11.4, "fit inside an area the size of one small American state."],
    [12.32, 13.6, "On the count of three..."],
    [14.8, 17.9, "Together, we weigh around 500 billion kilograms."],
    [18.4, 19.85, "That sounds enormous."],
    [20.04, 22.9, "But Earth is more than 10 trillion times heavier."],
    [23.18, 27.4, "So when we push off, the planet moves less than a thousandth of the width of an atom."],
    [27.7, 28.6, "Then we land."],
    [28.68, 32.9, "A roar louder than any stadium, heard for kilometres around..."],
    [33.32, 34.9, "and the ground barely notices."],
    [35.28, 37.5, "The real problem is what comes next."],
    [37.86, 40.4, "Eight billion people, one tiny state,"],
    [40.7, 43.0, "a handful of roads and a single airport."],
    [43.34, 45.3, "Getting everyone home would take months,"],
    [45.46, 47.7, "and the food and water would run out within days."],
    [47.98, 49.2, "The jump was easy."],
    [49.38, 51.2, "Leaving is the disaster."],
  ],
  bigs: [{ at: 12.94, dur: 0.85, text: "3", size: 300 }, { at: 13.82, dur: 0.9, text: "JUMP!", size: 200, y: 760 }],
  flashes: [{ at: 13.82, dur: 0.3 }, { at: 28.34, dur: 0.35 }],
  endCard: { at: 51.3, title: "What if every human on Earth jumped at the same time?", small: ["SIMPLIFIED PHYSICS · FOR FUN", "INSPIRED BY XKCD WHAT IF? #8"], cta: "SO... WOULD YOU JUMP?" },
};
