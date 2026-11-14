// 058 — What if you didn't sleep for 11 days? (day by day)  Style: Higgsfield "Pixel Night" (16-bit pixel art, retro game
// HUD) — same kit as 035/044/054 (draw/px.js: 180x320 pixel canvas, 6x nearest upscale, own 5x7 font) + new bedroom scenes.
// Format = our best-watched countdowns (035 hour-by-hour, 054 day-by-day): giant HOUR/DAY counter + HOURS AWAKE ticker +
// a PLAYER ENERGY bar (topHud) that flips with a flash on every "Hour/Day N". Engine sans huds/bigs stay empty on purpose.
// s: 0 bedroom intro · 1 hour 17 BAC · 2 microsleep · 3 day 3 desk · 4 hallucination · 5 day 11 record · 6 14 h sleep
//    7 don't try this · 8 question   (scene index 10 = hook only, off-timeline)
const sc = (s, a, b, p = {}) => ({ a, b, draw: "px", p: { s, ...p } });
// scene boundaries (s) from words.json
const T = { intro: 1.84, h17: 5.1, d2: 9.9, d3: 14.32, d4: 17.1, d11: 21.62, slept: 25.08, guin: 26.44, ask: 30.0, end: 30.85, END: 33.4 };
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
    sc(0, T.intro, T.h17, { hrs: 0, tY: 0.1, tR: 1.66 }),                                                                  // 1 1964, Randy Gardner, 17
    sc(1, T.h17, T.d2, { hrs: [[0, 0], [0.4, 17]], bac: [[0, 0], [2.9, 0], [3.6, 0.5]], tA: 0.86, tB: 2.9 }),              // 2 HOUR 17 = 0.05% BAC
    sc(2, T.d2, T.d3, { hrs: [[0, 24], [4.4, 36]], bo: [[0, 0], [2.3, 0, "linear"], [2.32, 1, "linear"], [4.0, 1, "linear"], [4.02, 0, "linear"]], boAt: 2.32, tE: 3.36, tA: 1.26 }), // 3 DAY 2 microsleeps
    sc(3, T.d3, T.d4, { hrs: [[0, 48], [2.8, 60]], tA: 0.68, tC: 0.88, tF: 1.5 }),                                         // 4 DAY 3 moody/clumsy/forgetful
    sc(4, T.d4, T.d11, { hrs: [[0, 72], [4.5, 84]], tA: 0.64, tP: 1.32, tH: 2.16 }),                                       // 5 DAY 4 hallucinations
    sc(5, T.d11, T.slept, { hrs: [[0, 240], [1.3, 264]], cnt: [[0, 0], [1.3, 1]], tA: 0.1, tR: 2.46 }),                   // 6 DAY 11 record
    sc(6, T.slept, T.guin, { sl: [[0, 0], [1.1, 1]], tA: 0.05 }),                                                          // 7 slept 14 h
    sc(7, T.guin, T.ask, { tG: 0.1, tD: 2.38 }),                                                                           // 8 Guinness + don't try this
    sc(8, T.ask, T.END, { z: [1.15, 1.25], fx: 105, fy: 188 }),                                                            // 9 question
    sc(0, 100, 106, { hp: [[0, 1], [0.25, 0.95], [1.5, 0]], tEnd: 1.52 }),                                                   // 10 hook only (off-timeline)
  ],
  captions: [
    [1.86, 2.9, "In 1964,"],
    [2.94, 4.04, "17-year-old Randy Gardner"],
    [4.06, 4.95, "really did it."],
    [5.1, 5.9, "Hour 17:"],
    [5.96, 6.86, "your reactions match"],
    [6.88, 7.98, "a blood alcohol level"],
    [8.0, 9.4, "of 0.05%."],
    [9.9, 11.1, "Day 2:"],
    [11.16, 11.88, "Microsleeps."],
    [11.92, 13.2, "Your brain shuts off for seconds,"],
    [13.26, 14.1, "eyes wide open."],
    [14.32, 14.95, "Day 3:"],
    [15.0, 15.8, "moody, clumsy,"],
    [15.82, 16.95, "forgetting what you just said."],
    [17.1, 17.7, "Day 4:"],
    [17.74, 19.1, "hallucinations and paranoia."],
    [19.26, 20.38, "Randy believed he was"],
    [20.4, 21.4, "a famous football player."],
    [21.62, 22.85, "Day 11:"],
    [22.9, 24.0, "264 hours."],
    [24.08, 24.95, "A world record."],
    [25.08, 26.42, "Then he slept 14 hours straight."],
    [26.44, 27.68, "Guinness stopped tracking it"],
    [27.7, 28.6, "because it's dangerous,"],
    [28.7, 29.95, "so please, don't try this."],
    [30.02, 30.84, "How long have you stayed awake?"],
  ],
  bigs: [],
  huds: [],
  flashes: [
    { at: T.h17, dur: 0.2, color: "#FFD23F" },
    { at: T.d2, dur: 0.2, color: "#FFD23F" },
    { at: T.d3, dur: 0.2, color: "#FF8A3D" },
    { at: T.d4, dur: 0.25, color: "#FF4FA3" },
    { at: T.d11, dur: 0.25, color: "#FF3B4E" },
    { at: T.slept, dur: 0.2, color: "#7CFF6B" },
    { at: T.guin + 2.38, dur: 0.2, color: "#FF3B4E" },
  ],
  endCard: {
    at: T.end, series: "WHAT IF · PIXEL NIGHT", title: "Your longest night awake?",
    choices: [{ k: "A", text: "Under 24 hours" }, { k: "B", text: "Over 24 hours" }],
    cta: "A OR B? TELL US BELOW", small: ["SAVE THIS FOR PART 2", "FOLLOW FOR MORE WHAT IFS"],
  },
};
