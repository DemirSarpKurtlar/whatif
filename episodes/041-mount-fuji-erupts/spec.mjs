// Episode 041 — What if Mount Fuji erupted today?  Style: "Woodblock Wave" (ukiyo-e print, indigo sea, paper label plaques). See style.md.
// Scenes are 2D canvas (draw/*.js are GENERATED: edit src/lib.js + src/<scene>.js, then `python3 src/build.py`).
// In-scene cream plaques carry the numbers (the reference's "paper label plaques"), so no engine HUDs are used;
// every caption gets an indigo plaque drawn by the scene code (src/lib.js capPlaque, needs p.sid = scene index).
export default {
  END: 36.4,
  bg: "#1B2233",
  accent: "#FF9A73",
  xf: 0.35,
  title: { text: "What if Mount Fuji erupted today?", end: 2.6 },
  hook: { scene: 1, at: 1.4 },
  cover: 1.4,
  scenes: [
    { a: 0, b: 2.6, draw: "fuji", p: { sid: 0, zoom: [1.0, 1.04], wave: 1 } },
    { a: 2.6, b: 6.4, draw: "fuji", p: { sid: 1, wave: [[0, 0.6], [1.2, 1]], zoom: [1.0, 1.08], erupt: [[0, 0.12], [3.2, 1]], dark: [[0, 0], [3.8, 0.5]], lab: 1, labk: [[0, 0], [0.5, 1]], day: [[0, 1], [0.4, 1], [2.75, 16]] } },
    { a: 6.4, b: 8.95, draw: "map", p: { sid: 2, zoom: [1.0, 1.05], route: [[0, 0], [0.3, 0], [1.3, 1]], drift: [[0, 0.1], [2.5, 1]], labk: [[0, 0], [0.5, 1]], name: 0 } },
    { a: 8.95, b: 10.55, draw: "city", p: { sid: 3, zoom: [1.0, 1.04], morph: [[0, 0], [0.3, 0], [1.25, 1]], lab: 1, labk: [[0, 0], [0.4, 1]] } },
    { a: 10.55, b: 13.65, draw: "city", p: { sid: 4, zoom: [1.0, 1.1], cy: [960, 900], morph: 1, grey: [[0, 0], [2.6, 1]], ash: [[0, 0], [1.0, 0], [3.0, 0.9]], cover: [[0, 0], [3.1, 0.45]], plume: [[0, 0.35], [1.4, 1]], lab: 2, labk: [[0, 0], [0.45, 1]] } },
    { a: 13.65, b: 15.95, draw: "train", p: { sid: 5, zoom: [1.0, 1.06], tx: [[0, 0.3], [1.8, 1, "ease-out"]], vel: [[0, 0.2], [0.8, 1], [1.8, 0]], sig: [[0, 0, "hold"], [1.6, 1]], ash: 0.6, cover: [[0, 0.1], [2.3, 0.5]], labk: [[0, 0], [0.45, 1]] } },
    { a: 15.95, b: 19.3, draw: "power", p: { sid: 6, zoom: [1.0, 1.06], rain: 1, ash: 0.5, spark: [[0, 0], [2.3, 0], [2.42, 1], [3.0, 0.35], [3.35, 0]], dark: [[0, 0], [2.6, 0], [2.95, 1]], cover: [[0, 0.2], [3.3, 0.5]], labk: [[0, 0], [0.45, 1]] } },
    { a: 19.3, b: 21.95, draw: "street", p: { sid: 7, zoom: [1.0, 1.05], depth: [[0, 0], [1.1, 1]], spin: [[0, 0], [1.1, 0], [1.4, 1]], ash: 0.8, labk: [[0, 0], [0.35, 1]] } },
    { a: 21.95, b: 24.85, draw: "volume", p: { sid: 8, zoom: [1.06, 1.0], grow: [[0, 0], [2.1, 1]], dims: [[0, 0], [1.9, 0], [2.6, 1]], ash: 0.3, labk: [[0, 0], [1.15, 0], [1.55, 1]] } },
    { a: 24.85, b: 28.6, draw: "dome", p: { sid: 9, fill: [[0, 0], [1.9, 1]], out: [[0, 0], [2.2, 0], [2.8, 1]], n: [[0, 0], [2.3, 0], [3.2, 1]], labk: [[0, 0], [1.4, 0], [1.8, 1]] } },
    { a: 28.6, b: 31.6, draw: "fuji", p: { sid: 10, zoom: [1.08, 1.0], cy: [1000, 960], wave: 1, lab: 2, labk: [[0, 0], [1.1, 0], [1.55, 1]] } },
    { a: 31.6, b: 33.9, draw: "city", p: { sid: 11, zoom: [1.04, 1.1], morph: 1, grey: 0.65, ash: 0.7, cover: 0.7, plume: 1, lab: 3, labk: [[0, 0], [0.45, 0], [1.6, 1]] } },
  ],
  captions: [
    [2.7, 4.6, "Last time, in 1707,"], [4.8, 6.4, "ash fell for 16 days."],
    [6.6, 8.9, "It reached Edo, 100 km away."], [9.1, 10.5, "Edo is now Tokyo."],
    [10.6, 11.7, "Within about two hours,"], [11.75, 13.6, "the sky over the capital turns grey."],
    [13.75, 14.85, "Half a millimetre of ash,"], [14.88, 15.95, "and the trains stop."],
    [16.1, 17.3, "3 millimetres of wet ash"], [17.32, 17.95, "on power lines,"], [18.0, 19.3, "and the lights can go out."],
    [19.4, 21.6, "10 centimetres, and ordinary cars can't move."],
    [22.15, 23.15, "That eruption threw out"], [23.2, 24.85, "1.7 billion cubic metres of ash."],
    [24.9, 28.4, "Enough to fill Tokyo Dome nearly 1,400 times."],
    [29.0, 31.4, "Fuji has been silent for 319 years."],
    [31.95, 33.6, "Would you stay, or run?"],
  ],
  bigs: [],
  huds: [],
  flashes: [{ at: 2.62, dur: 0.3, color: "#F1E6CC" }, { at: 18.37, dur: 0.18, color: "#DDE8FF" }, { at: 23.98, dur: 0.25, color: "#F1E6CC" }],
  endCard: { at: 33.9, title: "What if Mount Fuji erupted today?", small: ["NO SIGNS OF AN ERUPTION RIGHT NOW", "ASH FALL DEPENDS ON WIND AND RAIN", "SOURCES: JAPAN CABINET OFFICE · JMA"], cta: "WOULD YOU STAY, OR RUN?" },
};
