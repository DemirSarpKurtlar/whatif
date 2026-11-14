// 054 — What if electricity disappeared for one week? (day by day)  Style: Higgsfield "Pixel Night" (16-bit pixel art,
// retro game HUD, neon night city) — same kit as 035/044 (draw/px.js: 180x320 pixel canvas, 6x nearest upscale, own 5x7 font).
// Format = our best-watched 035 "hour by hour", here a giant DAY 1..7 counter (dayHud) that flips on every "Day N" word.
// HUD cards and big numbers are drawn IN-SCENE with the pixel font, so the engine's sans "huds"/"bigs" stay empty on purpose.
// s: 0 city · 1 phone/tower · 2 tap · 3 freezer · 4 hospital · 5 gas · 6 cash · 7 grid restart · 8 roof (scene 9 = hook only)
const sc = (s, a, b, p = {}) => ({ a, b, draw: "px", p: { s, ...p } });
const hr = [0, 24];
export default {
  END: 39.2,
  style: "flat",
  bg: "#0B0A1E",
  accent: "#FFD23F",
  xf: 0,
  capY: 1450,
  hot: ["phone", "batteries", "taps", "sputter", "pumps", "power", "texas", "boil", "freezer", "cold", "thawing", "hospitals", "alone", "gas", "electric", "useless", "cards", "atms", "cash", "returns", "grid", "days", "break"],
  title: { text: "What if electricity disappeared for one week?", end: 2.32, tag: "7 DAYS WITHOUT POWER", hot: ["electricity", "week"], y: 1400 },
  // cold open: "PLAYER: YOUR CITY / ELECTRICITY" HP bar drains to 0% while the skyline blacks out
  hook: { scene: 9, at: 0 },
  cover: 1.2,
  scenes: [
    sc(0, 0, 2.35, { ui: 0, tOff: -5 }),                                                              // 0 dark city (under the hook)
    sc(1, 2.35, 7.7, { d: 1, hr, bat: [[0, 1], [1.9, 0.6], [4.25, 0]], tFact: 1.85, tDead: 4.25 }),     // 1 DAY 1: tower battery 4-8 h -> no signal
    sc(2, 7.7, 14.85, { d: 2, hr, flow: [[0, 1], [0.8, 0.6], [2.3, 0]], tPump: 2.0, tTex: 3.45, cnt: [[0, 0], [3.45, 0], [5.4, 1]] }), // 2 DAY 2: tap dry, Texas
    sc(3, 14.85, 19.75, { d: 3, hr, tm: [[0, 0], [2.1, 0], [3.0, 1]], th: [[0, 0], [3.2, 0.1], [4.9, 1]], tNow: 3.25 }),             // 3 DAY 3: freezer 48 h
    sc(4, 19.75, 24.25, { d: 4, hr, fuel: [[0, 1], [4.5, 0.12]], tBig: 0.8 }),                         // 4 DAY 4: hospital 96 h
    sc(5, 24.25, 28.1, { d: 5, hr, tFull: 2.12 }),                                                     // 5 DAY 5: gas pumps
    sc(6, 28.1, 31.78, { d: 6, hr, tAtm: 1.62, tCash: 2.56 }),                                         // 6 DAY 6: no cards, no ATMs, cash
    sc(7, 31.78, 35.4, { d: 7, hr, on: [[0, 0], [3.6, 0.7]], tDays: 2.75 }),                          // 7 DAY 7: black start
    sc(8, 35.4, 39.2, { z: [1.2, 1.3], fx: 80, fy: 175 }),                                             // 8 rooftop question
    sc(0, 100, 106, { ui: 1, hp: 1, drain: [[0, 0], [0.3, 0.05], [1.85, 1]], tEnd: 1.9 }),            // 9 hook only (off-timeline)
  ],
  captions: [
    [2.42, 3.8, "Day 1: your phone works,"],
    [3.82, 5.36, "until cell tower batteries die"],
    [5.38, 6.75, "after 4 to 8 hours."],
    [7.78, 9.3, "Day 2: taps sputter."],
    [9.72, 10.85, "Water pumps need power."],
    [11.14, 12.5, "In Texas in 2021,"],
    [12.56, 13.64, "nearly 15 million people"],
    [13.66, 14.72, "had to boil their water."],
    [14.92, 16.5, "Day 3: a full freezer stays cold"],
    [16.52, 17.85, "about 48 hours."],
    [18.1, 19.15, "Now it's thawing."],
    [19.8, 21.5, "Day 4: 96 hours."],
    [21.76, 22.9, "That's how long hospitals"],
    [22.9, 23.85, "must plan to run alone."],
    [24.3, 26.15, "Day 5: gas pumps are electric."],
    [26.38, 27.65, "Full tanks, useless."],
    [28.15, 29.5, "Day 6: no cards,"],
    [29.7, 30.55, "no ATMs."],
    [30.66, 31.35, "Only cash."],
    [31.84, 33.4, "Day 7: power returns,"],
    [33.5, 35.3, "but restarting a dead grid takes days."],
    [35.7, 36.74, "Which day would break you?"],
  ],
  bigs: [],
  huds: [],
  flashes: [
    { at: 2.35, dur: 0.2, color: "#FFD23F" },
    { at: 7.7, dur: 0.2, color: "#FFD23F" },
    { at: 14.85, dur: 0.2, color: "#FF8A3D" },
    { at: 19.75, dur: 0.2, color: "#FF8A3D" },
    { at: 24.25, dur: 0.2, color: "#FF3B4E" },
    { at: 28.1, dur: 0.2, color: "#FF3B4E" },
    { at: 31.78, dur: 0.25, color: "#7CFF6B" },
  ],
  endCard: {
    at: 36.78, series: "WHAT IF · PIXEL NIGHT", title: "Which day breaks you?",
    choices: [{ k: "A", text: "Day 1: no signal" }, { k: "B", text: "Day 2: no water" }],
    cta: "A OR B? TELL US BELOW", small: ["SAVE THIS FOR PART 2", "FOLLOW FOR MORE WHAT IFS"],
  },
};
