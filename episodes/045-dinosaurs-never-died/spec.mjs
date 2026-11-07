// Episode 045 — What if the asteroid had missed the dinosaurs?  Style: "Ink & Gold" (sumi-ink wash, silhouettes, gold leaf). See style.md (helpers copied from 038).
const G = "#C9A64B", GL = "#F2D68A";
export default {
  END: 39.3,
  bg: "#141312",
  accent: GL,
  xf: 0.35,
  title: { text: "What if the asteroid had missed the dinosaurs?", end: 2.9 },
  hook: { scene: 1, at: 0.0 },
  cover: 1.4,
  scenes: [
    // 0 the gold asteroid streaks in (first 2.9 s hidden behind the impact cold-open)
    { a: 0, b: 6.9, draw: "sky", p: { k: [[0, 0], [2.9, 0.1, "ease-in"], [6.9, 0.99]], look: [[0, 0.35], [4.0, 0.4], [6.4, 0.95]], zoom: [[0, 1.0], [6.9, 1.08]], cy: [[0, 960], [6.9, 1000]] },
      hud: { at: 3.2, cat: "66 MILLION YEARS AGO", label: "CHICXULUB · YUCATÁN, MEXICO", value: "~10 km wide", sub: "ONE ROCK FROM SPACE", dot: G, vcol: GL } },
    // 1 impact
    { a: 6.9, b: 8.45, cut: true, draw: "sky", p: { k: 1, hit: [[0, 0], [1.45, 1]], look: 0.95, zoom: [1.06, 1.12], cy: [1000, 1040], shake: [[0, 0.9], [0.4, 0.5], [1.5, 0.08]] } },
    // 2 three quarters of species vanish
    { a: 8.45, b: 10.9, draw: "extinct", p: { k: [[0, 0.02], [0.25, 0.05], [1.9, 0.78], [2.4, 1]], zoom: [1.04, 1.0] },
      hud: { at: 0.1, cat: "THE K-PG EXTINCTION", label: "SPECIES LOST", value: "0%", sub: "SURVIVORS: BIRDS, MAMMALS, TURTLES, CROCS", dot: G, vcol: GL, counter: { at: 0.15, dur: 1.7, from: 0, to: 75, suffix: "%", easing: "ease-out" } } },
    // 3 imagine it misses: the streak rises away over the herd
    { a: 10.9, b: 13.4, draw: "herd", p: { ast: [[0, 0.02], [1.6, 0.9], [2.5, 1]], zoom: [1.1, 1.0], cy: [1000, 960], walk: 1 },
      hud: { at: 0.15, cat: "ALTERNATE TIMELINE", label: "THE ASTEROID", value: "Misses", sub: "THE DINOSAURS CARRY ON", dot: G, vcol: GL } },
    // 4 165 My vs 66 My
    { a: 13.4, b: 16.2, draw: "timeline", p: { fill: [[0, 0], [0.4, 0], [1.6, 1]], rest: [[0, 0], [1.75, 0], [2.6, 1]], zoom: [1.06, 1.0] },
      hud: { at: 0.1, cat: "NON-AVIAN DINOSAURS", label: "THEY RULED FOR", value: "165 million yrs", sub: "VS 66 MILLION YEARS SINCE THE IMPACT", dot: G, vcol: GL } },
    // 5 tiny mammal under a fern, giant foot lands
    { a: 16.2, b: 19.9, draw: "fern", p: { step: [[0, 0], [1.5, 0], [2.7, 1, "ease-in"]], zoom: [[0, 1.25], [2.6, 1.12], [3.7, 1.1]], cx: [[0, 520], [3.7, 620]], cy: [[0, 1060], [3.7, 1020]], shake: [[0, 0], [2.68, 0], [2.75, 0.7], [3.4, 0.05]] },
      hud: { at: 0.1, cat: "MAMMALS BACK THEN", label: "MOSTLY SMALL", value: "Rat to badger", sub: "LIVING IN THE DINOSAURS' SHADOW", dot: G, vcol: GL } },
    // 6 would they ever grow big?
    { a: 19.9, b: 21.1, draw: "grow", p: { g: [[0, 0], [0.9, 1]], q: [[0, 0], [0.55, 0], [0.9, 1]], zoom: [1.0, 1.05] },
      hud: { at: 0.05, cat: "SPECULATION", label: "IN OUR TIMELINE: MAMMOTHS, WHALES, US", value: "Bigger?", sub: "WITH DINOSAURS AROUND, NOBODY KNOWS", dot: G, vcol: GL } },
    // 7 primates? humans? a city... but whose?
    { a: 21.1, b: 23.5, draw: "city", p: { q: [[0, 0], [1.65, 0], [2.0, 1]], zoom: [1.08, 1.0], cy: [980, 940], walk: 1 },
      hud: { at: 0.1, cat: "SPECULATION", label: "PRIMATES? HUMANS?", value: "Nobody knows", sub: "EVOLUTION HAS NO SCRIPT", dot: G } },
    // 8 the twist: the crow's shadow is a raptor
    { a: 23.5, b: 26.4, draw: "bird", p: { rev: [[0, 0], [1.2, 0], [2.3, 1]], flock: 0, zoom: [[0, 1.18], [2.9, 1.04]], cx: [460, 540], cy: [1000, 960] },
      hud: { at: 0.15, cat: "THE TWIST", label: "DINOSAURS", value: "Never fully died", sub: "ONE BRANCH SURVIVED THE IMPACT", dot: G, vcol: GL } },
    // 9 birds are dinosaurs: the flock
    { a: 26.4, b: 29.45, draw: "bird", p: { rev: 1, flock: [[0, 0.1], [2.2, 1]], zoom: [1.0, 0.94], cy: [960, 900] },
      hud: { at: 0.1, cat: "BIRDS = THEROPOD DINOSAURS", label: "LIVING SPECIES", value: "0", sub: "IOC WORLD BIRD LIST: ~11,000", dot: G, vcol: GL, counter: { at: 1.3, dur: 1.1, from: 0, to: 11000, suffix: "+", easing: "ease-out" } } },
    // 10 1982: start from Troodon
    { a: 29.45, b: 31.05, draw: "dinosauroid", p: { droid: 0, ghost: 1, q: 0, zoom: [1.3, 1.24], cx: [320, 340], cy: [1050, 1030] },
      hud: { at: 0.1, cat: "1982 · DALE RUSSELL", label: "STARTING FROM TROODON", value: "Big brain", sub: "A SMART, FEATHERED LITTLE THEROPOD", dot: G } },
    // 11 the dinosauroid rises from the ink
    { a: 31.05, b: 34.05, draw: "dinosauroid", p: { droid: [[0, 0], [1.6, 1]], ghost: 1, q: [[0, 0], [1.9, 0], [2.3, 1]], zoom: [1.0, 1.05], cy: [960, 900] },
      hud: { at: 0.2, cat: "A THOUGHT EXPERIMENT", label: "RUSSELL & SÉGUIN, 1982", value: "Dinosauroid", sub: "PURE SPECULATION · MANY EXPERTS DOUBT IT", dot: G, vcol: GL } },
    // 12 who would be watching this right now?
    { a: 34.05, b: 36.45, draw: "dinosauroid", p: { droid: 1, ghost: 0.6, q: 0, phone: [[0, 0], [1.0, 1]], zoom: [1.05, 1.22], cy: [900, 780] } },
  ],
  captions: [
    [3.4, 4.98, "66 million years ago,"], [5.16, 6.8, "a rock about 10 kilometres wide"], [6.88, 8.2, "slammed into Mexico."],
    [8.48, 10.5, "About three quarters of all species vanished."], [10.94, 11.9, "But imagine it misses."],
    [12.58, 13.66, "Dinosaurs had already ruled"], [13.9, 15.7, "for 165 million years."],
    [16.3, 17.5, "Mammals were mostly small,"], [17.66, 18.6, "rat to badger sized,"], [18.7, 19.85, "hiding under ferns."],
    [20.02, 20.95, "Would they ever grow big?"], [21.18, 23.25, "Would primates, or humans, ever appear?"],
    [23.62, 24.5, "Here's the twist."], [24.78, 26.2, "Dinosaurs never fully died."],
    [26.54, 27.7, "Birds are dinosaurs,"], [27.82, 29.42, "over 11,000 species of them."],
    [29.48, 30.95, "In 1982,"], [31.08, 33.9, "Dale Russell even imagined a big-brained dinosauroid."],
    [34.12, 36.35, "So who would be watching this video right now?"],
  ],
  bigs: [
    { at: 26.55, dur: 1.2, text: "Birds = dinosaurs", size: 118, color: GL },
  ],
  flashes: [{ at: 0.0, dur: 0.35, color: GL }, { at: 6.9, dur: 0.45, color: GL }, { at: 23.5, dur: 0.25, color: "#141312" }, { at: 31.05, dur: 0.25, color: GL }],
  endCard: { at: 36.45, title: "What if the asteroid had missed the dinosaurs?", small: ["SPECULATIVE · NOBODY KNOWS WHAT WOULD HAVE EVOLVED", "BIRDS ARE LIVING DINOSAURS (~11,000 SPECIES)"], cta: "WHO WOULD BE WATCHING THIS RIGHT NOW?" },
};
