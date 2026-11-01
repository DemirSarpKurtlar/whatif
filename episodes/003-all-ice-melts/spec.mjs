// Episode 003 — What if all the ice on Earth melted at once?
const F = { cx: 0, cy: 2.2, cz: 32, tx: 0, ty: 5, tz: -30, water: 0, statue: 1, dusk: 0, shake: 0 };
const E = { dist: 5.4, orb: 0.3, camy: 0, tx: 0, ty: 0, spin: 0, leak: 0, quake: 0, shake: 0, sun: 0.6, diag: 0, ice: 1, sea: 0, coast: 0, current: 0, flow: 0 };
const ST = { cx: 11.0, cy: 6.0, cz: -0.5, tx: 7, ty: 6.8, tz: -6 }; // statue close framing
export default {
  END: 54.8,
  title: { text: "What if all the ice on Earth melted at once?", end: 3.4 },
  elapsed: { start: 6.5, end: 50.0, label: "SEA LEVEL", unit: " m", dec: 0, note: "ABOVE TODAY", points: [[6.6, 0], [16.6, 0], [20.2, 58], [24.8, 70], [50, 70]] },
  scenes: [
    { a: 0, b: 3.4, glsl: "flood", p: { ...F, cz: [34, 31], ty: [8, 5.5] } },
    { a: 3.4, b: 6.45, glsl: "flood", p: { ...F, cx: [-4, -2], cz: [30, 26], cy: 1.6 }, hud: { cat: "A CALM MORNING", label: "SEA LEVEL", value: "Normal", sub: "A COASTAL CITY · TODAY'S SHORELINE", dot: "#4FD1A5" } },
    { a: 6.45, b: 10.5, glsl: "earth3", p: { ...E, dist: [4.6, 4.0], camy: [1.8, 2.4], ty: [0.25, 0.4], spin: [0, 0.35], ice: [[0, 1], [0.4, 1], [4.0, 0.15]] }, hud: { cat: "EVERY GLACIER · EVERY ICE SHEET", label: "LAND ICE", value: "≈29 million km³", sub: "TURNS TO WATER AT ONCE", vcol: "#BFE3FF" } },
    { a: 10.5, b: 16.5, glsl: "earth3", p: { ...E, dist: [3.6, 3.3], camy: [2.6, 2.8], ty: [0.5, 0.6], spin: [0.4, 0.75], ice: [0.6, 0.35] } },
    { a: 16.5, b: 20.95, glsl: "earth3", p: { ...E, dist: [3.6, 3.3], camy: [-3.4, -3.6], ty: [-0.9, -1.0], spin: [1.0, 1.25], ice: [[0, 1], [0.3, 1], [4.2, 0.35]], sea: [[0, 0], [0.3, 0], [3.8, 0.75]] }, hud: { cat: "ANTARCTICA ALONE", label: "SEA LEVEL RISE", value: "+0 m", sub: "ABOUT 90% OF EARTH'S ICE", counter: { at: 0.1, dur: 3.6, from: 0, to: 58, prefix: "+", suffix: " m", easing: "linear" }, vcol: "#BFE3FF" } },
    { a: 20.95, b: 25.65, glsl: "flood", p: { ...F, statue: 0, cx: [-3, 0], cz: [26, 22], cy: [1.2, 1.2], ty: [3, 6], water: [[0, 0.2], [0.4, 0.2], [4.0, 7.0]] }, hud: { cat: "+ GREENLAND + MOUNTAIN GLACIERS", label: "THE OCEAN CLIMBS", value: "+70 m", sub: "ABOUT 230 FEET", vcol: "#9FD8FF" } },
    { a: 25.65, b: 28.15, glsl: "flood", p: { ...F, statue: 0, cx: [6, 9], cy: 8.0, cz: [-6, -9], tx: 2, ty: 7, tz: -22, water: 7.0 }, hud: { cat: "FOR SCALE", label: "70 METRES OF WATER", value: "20 storeys", sub: "A WHOLE BUILDING, UNDER THE SEA" } },
    { a: 28.15, b: 32.5, glsl: "flood", p: { ...F, ...ST, cx: [11.5, 10.8], cz: [0.0, -0.8], cy: [6.0, 8.0], ty: [6.8, 7.6], water: [[0, 0.3], [0.3, 0.3], [3.8, 7.0]] }, hud: { cat: "STATUE OF LIBERTY", label: "THE WATER LINE", value: "Chest-high", sub: "PEDESTAL 47 m · TORCH 93 m", dot: "#5CB8F0" } },
    { a: 32.5, b: 36.45, glsl: "flood", p: { ...F, statue: 0, cx: [-3, 1], cy: 8.4, cz: [12, 8], tx: [-2, 3], ty: 7.5, tz: -25, water: 7.0, dusk: [0.15, 0.45] } },
    { a: 36.45, b: 40.35, glsl: "earth3", p: { ...E, dist: [4.4, 3.9], camy: 0.6, spin: [1.6, 1.85], ice: 0, sea: 1, coast: [[0, 0], [0.3, 1]] }, hud: { cat: "4 IN 10 PEOPLE", label: "LIVE NEAR A COAST", value: "40%", sub: "WITHIN 100 km OF THE SEA", dot: "#F2C14E" } },
    { a: 40.35, b: 46.8, glsl: "earth3", p: { ...E, dist: [4.0, 3.6], camy: [0.9, 1.3], ty: [0.15, 0.3], spin: [2.3, 2.45], ice: 0, sea: 1, current: [[0, 0], [0.4, 1]], flow: [[0, 0, "ease-out"], [6.45, 2.2]] }, hud: { cat: "ALL THAT FRESH WATER", label: "THE CURRENT THAT WARMS EUROPE", value: "Stalling", sub: "SALTIER WATER SINKS · FRESHER WATER DOESN'T", dot: "#5CB8F0" } },
    { a: 46.8, b: 54.8, glsl: "earth3", p: { ...E, dist: [3.8, 5.6], camy: [0.4, 0.8], spin: [2.8, 3.3], ice: 0, sea: 1 }, hud: { cat: "IN A SINGLE DAY", label: "THE MAP OF THE WORLD", value: "Redrawn", sub: "NEW COASTLINES EVERYWHERE" } },
  ],
  huds: [
    { at: 10.5, dur: 3.6, cat: "FLOATING SEA ICE", label: "WHEN IT MELTS", value: "+0 m", sub: "IT'S ALREADY IN THE OCEAN", dot: "#4FD1A5" },
    { at: 14.1, dur: 2.4, cat: "ICE SITTING ON LAND", label: "THAT'S THE", value: "Problem", sub: "IT POURS NEW WATER INTO THE SEA" },
    { at: 32.5, dur: 0.85, cat: "UNDER THE SEA", label: "CITY", value: "Miami", sub: "USA" },
    { at: 33.35, dur: 0.85, cat: "UNDER THE SEA", label: "CITY", value: "Amsterdam", sub: "NETHERLANDS" },
    { at: 34.2, dur: 0.68, cat: "UNDER THE SEA", label: "CITY", value: "Venice", sub: "ITALY" },
    { at: 34.88, dur: 0.86, cat: "UNDER THE SEA", label: "CITY", value: "Shanghai", sub: "CHINA" },
    { at: 35.74, dur: 0.71, cat: "UNDER THE SEA", label: "ALL OF THEM", value: "Gone", sub: "UNDERWATER" },
  ],
  captions: [
    [3.56, 5.9, "It's a calm morning in a coastal city."],
    [6.6, 10.2, "Then every glacier and every ice sheet turns to water."],
    [10.64, 13.95, "Floating sea ice barely matters, it's already in the ocean."],
    [14.18, 16.2, "But the ice sitting on land does."],
    [16.6, 20.75, "Antarctica alone holds enough to raise the seas almost 60 metres."],
    [21.1, 25.2, "Add Greenland and the mountain glaciers, and the ocean climbs about 70 metres."],
    [25.74, 27.6, "That's a twenty storey building."],
    [28.24, 32.3, "The water swallows the Statue of Liberty's pedestal and stops at her chest."],
    [32.62, 36.2, "Miami, Amsterdam, Venice, Shanghai... gone."],
    [36.54, 40.1, "About 4 in 10 people live within 100 km of a coast."],
    [40.46, 43.5, "All that fresh water also dilutes the salty ocean,"],
    [43.7, 46.6, "and the current that keeps Europe mild starts to stall."],
    [46.94, 49.8, "The map of the world is redrawn in a single day."],
  ],
  flashes: [{ at: 6.6, dur: 0.35 }],
  endCard: { at: 50.0, title: "What if all the ice on Earth melted at once?", small: ["SIMPLIFIED PHYSICS · FOR FUN", "A REAL MELT WOULD TAKE THOUSANDS OF YEARS"], cta: "WOULD YOUR CITY STAY DRY?" },
};
