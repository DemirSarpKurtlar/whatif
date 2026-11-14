// 052 — What if you stood on the Sun for 1 second?  Style: Higgsfield "Grain Poster" (two-tone grainy print, coral + cobalt,
// bold condensed labels) — see style.md. Every scene is draw/sun.js (p.s selects the panel).
// Captions (pcaps), header, slow-mo clock and the title masthead are drawn IN-SCENE in the poster style, so the engine's
// captions/huds/bigs/endCard stay empty and the engine title is parked off-screen (y: -4000; make_cover.py still reads title.text).
// s: 1 nothing to stand on · 2 plasma vs air · 3 fall · 4 28x gravity · 5 two tonnes · 6 5,500 C · 7 63 MW · 8 microwaves
//    9 skin boils · 10 photon escape · 11 one second? · 12 end poster   (s 0 = cold-open hook, off-timeline at a=100)
const sc = (s, a, b, p = {}) => ({ a, b, draw: "sun", p: { s, ...p } });
export default {
  END: 33.0,
  style: "flat",
  bg: "#EFE5D0",
  accent: "#E8553D",
  xf: 0,
  title: { text: "What if you stood on the Sun for 1 second?", end: 2.55, y: -4000 },
  // cold open: you fall head-first into the Sun's plasma under the "THE SUN" masthead
  hook: { scene: 12, at: 0 },
  cover: 24.2,
  capY: 1440,
  hot: ["sun", "plasma", "nothing", "fall", "gravity", "tonnes", "megawatts", "microwave", "skin", "boils", "light", "core", "second", "second?", "second,"],
  scenes: [
    sc(1, 2.55, 5.35, { tSink: 1.5 }),
    sc(2, 5.35, 9.55, { tBig: 2.45 }),
    sc(3, 9.55, 10.95),
    sc(4, 10.95, 14.25),
    sc(5, 14.25, 15.9, { tCar: 0.95 }),
    sc(6, 15.9, 18.5),
    sc(7, 18.5, 20.9, { tBig: 1.35 }),
    sc(8, 20.9, 23.0),
    sc(9, 23.0, 25.35, { tGone: 1.55 }),
    sc(10, 25.35, 28.05),
    sc(11, 28.05, 30.0),
    sc(12, 30.0, 34.0),
    sc(0, 100, 106),
  ],
  pcaps: [
    [0.0, 2.5, "What if you stood on the Sun for one second?"],
    [2.6, 5.3, "Problem one: there is nothing to stand on."],
    [5.38, 6.8, "The Sun is plasma,"],
    [6.82, 9.5, "and its surface is thousands of times thinner than air,"],
    [9.6, 10.9, "so you fall."],
    [11.0, 14.2, "Gravity here is 28 times stronger than on Earth."],
    [14.3, 15.85, "You would weigh over two tonnes."],
    [15.95, 18.45, "The temperature is 5,500 degrees Celsius."],
    [18.55, 20.88, "Every square metre of you takes 63 megawatts,"],
    [20.92, 22.95, "like 60,000 microwave ovens."],
    [23.05, 25.3, "In a tenth of a second, your skin boils away,"],
    [25.4, 28.02, "and that light may have spent 100,000 years escaping the core."],
    [28.08, 29.95, "What would you do with your one second?"],
  ],
  endAt: 29.98,
  clock: [[9.55, 0], [10.95, 0.01], [15.9, 0.04], [18.5, 0.06], [23.0, 0.085], [25.35, 0.1], [28.05, 0.6]],
  clockEnd: 28.05,
  captions: [],
  bigs: [],
  huds: [],
  flashes: [
    { at: 2.55, dur: 0.25, color: "#F6EEDC" },
    { at: 10.95, dur: 0.2, color: "#E8553D" },
    { at: 15.9, dur: 0.2, color: "#E8553D" },
    { at: 24.6, dur: 0.25, color: "#F6EEDC" },
    { at: 30.0, dur: 0.3, color: "#F6EEDC" },
  ],
};
