// 040 — What if a city-killer asteroid were spotted heading for Earth today?  Style: Higgsfield "Ops Console"
// (dark command-center video wall, mono labels, red alert numerals, dotted world map). All scenes are draw/ops.js; p.s picks
// the sub-scene. Hero numbers/HUD cards are drawn IN-SCENE in monospace (see style.md), so engine "bigs"/"huds" stay empty
// on purpose; captions/title/end card use the flat overlay. Timings aligned to words.json (voice 32.25 s, last word 31.72).
// s: 0 survey feed · 1 global follow-up · 2 orbit + Torino · 3 size/class · 4 blast (hook) · 5 2024 YR4 · 6 deflection
//    7 DART · 8 evacuation · 9 full-wall alert
const sc = (s, a, b, p = {}) => ({ a, b, draw: "ops", p: { s, ...p } });
const H = 3600;
export default {
  END: 34.7,
  style: "flat",
  bg: "#000000",
  accent: "#FF3B3B",
  xf: 0,
  capY: 1580,
  hot: [],
  title: { text: "What if a city-killer asteroid were spotted heading for Earth today?", end: 2.9, tag: "PLANETARY DEFENSE", hot: ["asteroid"], y: 1620 },
  // cold open: the airburst model detonating over a city (dedicated off-timeline hook scene, index 10)
  hook: { scene: 10, at: 0 },
  cover: 1.5,
  scenes: [
    sc(0, 2.9, 7.5, { clk: 0, tLock: 2.3, z: [[0, 1.0], [2.3, 1.1], [4.6, 1.12]], fy: [[0, 960], [2.3, 840], [4.6, 830]] }),       // 0 hour zero: survey flags a moving dot
    sc(1, 7.5, 10.25, { clk: 6 * H + 12, n: [[0, 0], [1.0, 0], [2.5, 9]], obs: [[0, 0], [2.75, 214]], z: 1.04, fx: [570, 510] }),   // 1 hour six: telescopes lock on
    sc(2, 10.25, 12.3, { clk: 48 * H + 31, tHit: 1.1, tor: [[0, 0], [1.1, 0], [1.9, 8]], z: [1.0, 1.08], fy: [960, 900] }),        // 2 day two: orbits cross, Torino 8
    sc(3, 12.3, 13.75, { clk: 48 * H + 2210, tCls: 0.55, z: 1.06, fy: 900, fx: [520, 560] }),                                       // 3 60 m · city killer vs planet killer
    sc(4, 13.75, 16.45, { clk: 48 * H + 2600, tBlast: 0.93, tRef: 1.3, z: [1.08, 1.0], sh: [[0, 0], [0.9, 0], [1.0, 0.45], [2.2, 0.06]] }), // 4 Tunguska-class blast
    sc(5, 16.45, 23.85, { clk: 49 * H + 400, dr: [[0, 0], [0.9, 0.03], [4.4, 0.855], [5.75, 0.855], [6.8, 1]], out: [[0, 0], [6.75, 0], [7.05, 1]],
      z: [[0, 1.0], [4.4, 1.13], [5.75, 1.13], [7.4, 1.02]], fy: [[0, 960], [4.4, 800], [5.75, 800], [7.4, 950]] }),                // 5 2024 YR4: 3.1% → ruled out
    sc(6, 23.85, 25.95, { clk: 50 * H + 90, tPush: 1.0, kd: 0.9, z: 1.05, fx: [560, 520] }),                                       // 6 years of warning: nudge
    sc(7, 25.95, 29.0, { clk: 50 * H + 400, tHit: 0.79, z: [[0, 1.12], [1.2, 1.12], [2.4, 1.0]], fy: [[0, 800], [1.2, 800], [2.4, 960]] }), // 7 DART −32 min
    sc(8, 29.0, 31.2, { clk: 52 * H + 77, days: 121, clr: [0, 0.35], alarm: 0.5, z: [1.0, 1.06] }),                                // 8 months: evacuate
    sc(9, 31.2, 34.7, { clk: 52 * H + 300, days: 121, clr: [0.36, 0.42], alarm: 1, z: [[0, 1.06], [1.2, 0.95]] }),                 // 9 would you leave?
    sc(4, 100, 106, { clk: 48 * H + 2600, tBlast: 0.25, tRef: 0.7, noGlitch: 1, sh: [[0, 0], [0.2, 0], [0.3, 0.5], [1.6, 0.1]] }), // 10 hook only (off-timeline)
  ],
  captions: [
    [3.0, 3.95, "Hour 0:"],
    [4.02, 5.1, "a sky survey like ATLAS"],
    [5.2, 6.9, "flags a faint dot that's moving."],
    [7.64, 8.4, "Hour 6:"],
    [8.56, 10.2, "Telescopes worldwide lock on."],
    [10.36, 10.95, "Day 2:"],
    [11.04, 12.2, "the orbit crosses Earth."],
    [12.4, 13.6, "It's 60 metres wide."],
    [13.84, 14.85, "A Tunguska-sized blast,"],
    [14.94, 16.4, "enough to flatten a city."],
    [16.56, 17.6, "This nearly happened."],
    [17.86, 19.0, "In 2025,"],
    [19.08, 20.05, "asteroid YR4"],
    [20.14, 21.95, "briefly had a 3% chance of hitting us,"],
    [22.18, 23.7, "until new data ruled it out."],
    [23.96, 25.7, "With years of warning, we push it aside."],
    [26.12, 27.85, "NASA's DART shifted an asteroid's orbit"],
    [28.06, 28.95, "by 32 minutes."],
    [29.0, 30.9, "With only months, we evacuate."],
    [31.28, 32.25, "Would you leave?"],
  ],
  bigs: [],
  huds: [],
  flashes: [
    { at: 11.4, dur: 0.18, color: "#FF3B3B" },
    { at: 14.68, dur: 0.3, color: "#FF3B3B" },
    { at: 31.2, dur: 0.22, color: "#FF3B3B" },
  ],
  endCard: {
    at: 32.35, series: "WHAT IF · OPS CONSOLE", title: "Impact in 4 months.",
    choices: [{ k: "A", text: "Leave the city" }, { k: "B", text: "Stay and watch" }],
    cta: "A OR B? TELL US BELOW", small: ["SAVE THIS FOR PART 2", "FOLLOW FOR MORE WHAT IFS"],
  },
};
