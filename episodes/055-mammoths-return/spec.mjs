// Episode 055 — What if woolly mammoths came back?  Style: "Ink & Gold" (sumi-ink wash, silhouettes, gold leaf), same look as 038/045. See style.md.
// draw/*.js are built from draw/_build (helpers copied from 045 + 055 silhouettes) with draw/_build/build.sh
const G = "#C9A64B", GL = "#F2D68A";
export default {
  END: 35.6,
  bg: "#141312",
  accent: GL,
  xf: 0.35,
  title: { text: "What if woolly mammoths came back?", end: 2.45 },
  hook: { scene: 6, at: 0.0 },
  cover: 1.4,
  scenes: [
    // 0 Wrangel Island, the last herd (first 2.45 s hidden behind the herd cold-open)
    { a: 0, b: 6.0, draw: "island", p: { zoom: [[0, 1.0], [2.4, 1.02], [6.0, 1.4]], cx: [[0, 540], [6.0, 545]], cy: [[0, 960], [6.0, 900]], ring: [[0, 0], [2.9, 0], [3.9, 1]] },
      hud: { at: 2.6, cat: "THE LAST WOOLLY MAMMOTHS", label: "WRANGEL ISLAND · ARCTIC OCEAN", value: "0 yrs ago", sub: "A HERD OF ~200-300 HELD ON HERE", dot: G, vcol: GL, counter: { at: 2.9, dur: 1.6, from: 0, to: 4000, suffix: " yrs ago", easing: "ease-out" } } },
    // 1 the pyramids were already standing
    { a: 6.0, b: 7.7, draw: "pyramid", p: { k: [[0, 0], [1.2, 1]], zoom: [1.06, 1.0] },
      hud: { at: 0.05, cat: "SAME MOMENT IN HISTORY", label: "GREAT PYRAMID OF GIZA", value: "Centuries old", sub: "BUILT c. 2560 BC · LAST MAMMOTHS c. 2000 BC", dot: G, vcol: GL } },
    // 2 Colossal edits Asian elephant cells
    { a: 7.7, b: 12.95, draw: "dna", p: { ed: [[0, 0], [3.0, 0.06], [4.7, 1]], zoom: [[0, 1.15], [5.25, 1.0]] },
      hud: { at: 0.15, cat: "COLOSSAL BIOSCIENCES · 2026", label: "PLANNED GENE EDITS · ASIAN ELEPHANT CELLS", value: "0", sub: "THE MAMMOTH'S CLOSEST LIVING RELATIVE", dot: G, vcol: GL, counter: { at: 3.5, dur: 1.2, from: 0, to: 150, suffix: "+", easing: "ease-out" } } },
    // 3 elephant -> mammoth traits
    { a: 12.95, b: 15.45, draw: "morph", p: { hair: [[0, 0], [0.1, 0], [0.7, 1]], l1: [[0, 0], [0.1, 0], [0.6, 1]], ear: [[0, 0], [0.55, 0], [1.05, 1]], l2: [[0, 0], [0.55, 0], [1.05, 1]], m: [[0, 0], [1.15, 0], [1.85, 1]], l3: [[0, 0], [1.15, 0], [1.65, 1]], zoom: [1.0, 1.05] },
      hud: { at: 0.1, cat: "THE TARGET", label: "A COLD-ADAPTED ELEPHANT", value: "Mammoth-like", sub: "NOT AN EXACT COPY OF THE EXTINCT ANIMAL", dot: G, vcol: GL } },
    // 4 22 months
    { a: 15.45, b: 17.75, draw: "womb", p: { mo: [[0, 0], [0.2, 0], [1.8, 1]], grow: [[0, 0], [2.2, 1]], zoom: [1.04, 1.0] },
      hud: { at: 0.05, cat: "ELEPHANT PREGNANCY", label: "LONGEST OF ANY LAND MAMMAL", value: "0 months", sub: "ASIAN ELEPHANTS: 18-22 MONTHS", dot: G, vcol: GL, counter: { at: 0.2, dur: 1.6, from: 0, to: 22, suffix: " months", easing: "linear" } } },
    // 5 first calf: early 2030s
    { a: 17.75, b: 20.45, draw: "calf", p: { sun: [[0, 0], [2.7, 1]], walk: 0.7, zoom: [1.1, 1.0], cy: [1000, 960] },
      hud: { at: 0.1, cat: "COLOSSAL'S TIMELINE", label: "FIRST MAMMOTH-LIKE CALF", value: "Early 2030s", sub: "PUSHED BACK FROM 2028 · NO FIXED DATE", dot: G, vcol: GL } },
    // 6 speculation: herds of six-tonne giants in Siberia (also the cold-open)
    { a: 20.45, b: 22.95, draw: "herd", p: { bull: [[0, 0.3], [1.8, 1]], walk: 1, tr: [[0, 0], [1.6, 0], [2.4, 0.8]], zoom: [1.0, 1.07], cy: [960, 940] },
      hud: { at: 0.15, cat: "SPECULATION", label: "A BULL WOOLLY MAMMOTH", value: "~6 tonnes", sub: "UP TO ~3.4 M AT THE SHOULDER", dot: G, vcol: GL } },
    // 7 Pleistocene Park: trampled snow, colder soil
    { a: 22.95, b: 27.3, draw: "soil", p: { tr: [[0, 0.12], [3.0, 0.8], [4.35, 0.95]], cool: [[0, 0], [3.0, 0], [4.0, 1]], zoom: [1.04, 1.0] },
      hud: { at: 0.1, cat: "PLEISTOCENE PARK · SIBERIA", label: "AVERAGE YEARLY SOIL TEMPERATURE", value: "0.0 °C", sub: "HORSES, BISON, REINDEER · SNOW DEPTH HALVED", dot: G, vcol: GL, counter: { at: 3.0, dur: 1.0, from: 0, to: -1.9, dec: 1, suffix: " °C", easing: "ease-out" } } },
    // 8 permafrost holds twice the carbon in the air
    { a: 27.3, b: 30.45, draw: "carbon", p: { f: [[0, 0], [0.3, 0], [1.9, 1]], x2: [[0, 0], [1.6, 0], [2.1, 1]], zoom: [1.05, 1.0] },
      hud: { at: 0.1, cat: "FROZEN PERMAFROST", label: "CARBON LOCKED IN NORTHERN SOILS", value: "~2× the air", sub: "~1,500 BILLION TONNES · THAWING RELEASES IT", dot: G, vcol: GL } },
    // 9 would you meet one?
    { a: 30.45, b: 32.75, draw: "meet", p: { tr: [[0, 0], [1.5, 0.9]], arm: [[0, 0], [0.5, 0], [1.2, 1]], q: [[0, 0], [1.2, 0], [1.6, 1]], zoom: [1.0, 1.1], cy: [960, 920] } },
  ],
  captions: [
    [2.56, 4.1, "The last ones lived on Wrangel Island"], [4.24, 5.9, "until just 4,000 years ago,"], [6.06, 7.5, "after the pyramids were built."],
    [7.8, 9.0, "Now Colossal Biosciences"], [9.02, 10.6, "is editing Asian elephant cells,"], [10.8, 12.9, "aiming for over 150 gene changes:"],
    [13.02, 15.2, "thick hair, small ears, extra fat."],
    [15.52, 17.7, "An elephant pregnancy lasts up to 22 months,"], [17.82, 19.06, "so the first calf is expected"], [19.08, 20.4, "in the early 2030s."],
    [20.6, 22.8, "Picture six-tonne giants roaming Siberia."],
    [23.08, 24.45, "At Pleistocene Park,"], [24.6, 25.9, "grazing herds trampled the snow,"], [25.94, 27.3, "cooling the soil almost two degrees."],
    [27.34, 28.84, "And frozen permafrost"], [28.86, 30.4, "holds twice the carbon in our air."],
    [30.58, 31.6, "So would you meet one,"], [31.62, 32.7, "or let them stay extinct?"],
  ],
  bigs: [],
  flashes: [{ at: 0.0, dur: 0.35, color: GL }, { at: 7.7, dur: 0.3, color: GL }, { at: 20.45, dur: 0.3, color: GL }, { at: 22.95, dur: 0.25, color: "#141312" }],
  endCard: { at: 32.75, title: "What if woolly mammoths came back?", small: ["SPECULATIVE · NO MAMMOTH HAS BEEN REVIVED YET", "COLOSSAL: FIRST CALF EXPECTED IN THE EARLY 2030s"], cta: "WOULD YOU MEET ONE, OR LET THEM STAY EXTINCT?" },
};
