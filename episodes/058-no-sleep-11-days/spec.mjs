// 058 — What if you didn't sleep for 11 days? (day by day)  Style: Higgsfield "Pixel Night" (16-bit pixel art, retro game
// HUD) — same kit as 035/044/054 (draw/px.js: 180x320 pixel canvas, 6x nearest upscale, own 5x7 font) + new bedroom scenes.
// Format = our best-watched countdowns (035 hour-by-hour, 054 day-by-day): giant HOUR/DAY counter + HOURS AWAKE ticker +
// a PLAYER ENERGY bar (topHud) that flips with a flash on every "Hour/Day N". Engine sans huds/bigs stay empty on purpose.
// s: 0 bedroom intro · 1 hour 17 BAC · 2 microsleep · 3 day 3 desk · 4 hallucination · 5 day 11 record · 6 14 h sleep
//    7 don't try this · 8 question   (scene index 10 = hook only, off-timeline)
const sc = (s, a, b, p = {}) => ({ a, b, draw: "px", p: { s, ...p } });
// scene boundaries (s) from words.json
const T = { intro: 2.3, h17: 6.2, d2: 11.0, d3: 16.0, d4: 19.8, d11: 25.5, slept: 29.0, guin: 31.0, ask: 35.0, end: 38.0, END: 39.6 };
const at = (k) => T[k];
export default {
  END: T.END,
  style: "flat",
  bg: "#0B0A1E",
  accent: "#FFD23F",
  xf: 0,
  capY: 1450,
  hot: ["randy", "gardner", "seventeen", "alcohol", "microsleeps", "seconds", "open", "moody", "clumsy", "forgetting", "hallucinations", "paranoia", "football", "record", "fourteen", "straight", "guinness", "dangerous", "don't", "awake"],
  title: { text: "What if you didn't sleep for 11 days?", end: T.intro, tag: "11 DAYS AWAKE", hot: ["sleep", "11"], y: 1400 },
  // cold open: "PLAYER: YOU / ENERGY" bar crashes to 0% while the bedroom glitches
  hook: { scene: 10, at: 0 },
  cover: 1.2,
  scenes: [
    sc(0, 0, T.intro, { ui: 0, hrs: 0 }),                                                                                  // 0 bedroom under the hook
    sc(0, T.intro, T.h17, { hrs: 0, tY: 0.1, tR: 1.6 }),                                                                   // 1 1964, Randy Gardner, 17
    sc(1, T.h17, T.d2, { hrs: [[0, 0], [0.6, 17]], bac: [[0, 0], [1.6, 0], [2.6, 0.5]], tA: 0.7, tB: 2.0 }),               // 2 HOUR 17 = 0.05% BAC
    sc(2, T.d2, T.d3, { hrs: [[0, 24], [5, 36]], bo: [[0, 0], [1.6, 0, "linear"], [1.62, 1, "linear"], [3.2, 1, "linear"], [3.22, 0, "linear"]], boAt: 1.62, tA: 0.1, tB: 3.3 }), // 3 DAY 2 microsleeps
    sc(3, T.d3, T.d4, { hrs: [[0, 48], [3.8, 60]], tA: 0.6, tC: 1.2, tF: 1.8 }),                                           // 4 DAY 3 moody/clumsy/forgetful
    sc(4, T.d4, T.d11, { hrs: [[0, 72], [5.7, 84]], tA: 0.6, tP: 1.6, tH: 3.0 }),                                          // 5 DAY 4 hallucinations
    sc(5, T.d11, T.slept, { hrs: [[0, 240], [2.5, 264]], cnt: [[0, 0], [2.5, 1]], tA: 0.1, tR: 2.6 }),                      // 6 DAY 11 record
    sc(6, T.slept, T.guin, { sl: [[0, 0], [1.8, 1]], tA: 0.1 }),                                                           // 7 slept 14 h
    sc(7, T.guin, T.ask, { tG: 0.1, tD: 2.6 }),                                                                            // 8 Guinness + don't try this
    sc(8, T.ask, T.END, { z: [1.15, 1.25], fx: 105, fy: 188 }),                                                            // 9 question
    sc(0, 100, 106, { hp: [[0, 1], [0.3, 0.95], [1.9, 0]], tEnd: 1.95 }),                                                   // 10 hook only (off-timeline)
  ],
  captions: [],
  bigs: [],
  huds: [],
  flashes: [
    { at: T.h17, dur: 0.2, color: "#FFD23F" },
    { at: T.d2, dur: 0.2, color: "#FFD23F" },
    { at: T.d3, dur: 0.2, color: "#FF8A3D" },
    { at: T.d4, dur: 0.25, color: "#FF4FA3" },
    { at: T.d11, dur: 0.25, color: "#FF3B4E" },
    { at: T.slept, dur: 0.2, color: "#7CFF6B" },
    { at: T.guin + 2.6, dur: 0.2, color: "#FF3B4E" },
  ],
  endCard: {
    at: T.end, series: "WHAT IF · PIXEL NIGHT", title: "How long have you stayed awake?",
    choices: [{ k: "A", text: "Under 24 hours" }, { k: "B", text: "Over 24 hours" }],
    cta: "A OR B? TELL US BELOW", small: ["SAVE THIS FOR PART 2", "FOLLOW FOR MORE WHAT IFS"],
  },
};
