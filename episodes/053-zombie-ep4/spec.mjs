// Zombie Outbreak — Episode 4 (EP3 vote: B — take the neighbor's bike, 1–0). Interactive: viewers vote A/B in the comments.
// Narration sped 1.1x (atempo) to fit 35 s; words.json rescaled to match.
export default {
  END: 34.6,
  style: "flat",
  bg: "#11153D",
  xf: 0.25,
  capY: 1420,
  hot: ["bike", "chain", "clicks", "click", "click,", "sound", "heads", "turn", "sun", "warming", "faster", "hand", "grabs", "sleeve", "rip", "free", "infected", "double", "stadium", "gate", "soldiers", "bites", "scratches", "wrist", "scratch", "zombie", "fence", "guards", "hide", "kilometers", "kilometer", "meters", "a", "b"],
  title: { text: "Episode 4: You took the bike...", end: 1.5, tag: "ZOMBIE OUTBREAK · EP 4", hot: ["bike"] },
  hook: { scene: 4, at: 1.75 },
  cover: 1.1,
  scenes: [
    // 0 — the neighbor's house + broken fence, you pedal off: 6:35 AM, 2.0 km
    { a: 0, b: 5.3, draw: "ride", p: { fence: 1, fx0: 1350, spd: 380, sun: [0.05, 0.2], hud: [[0, 0], [1.45, 0], [1.8, 1]], km: [[0, 2.0], [5.3, 1.95]], min: 35, inf: 64 } },
    // 1 — pedal hard, the rusty chain clicks
    { a: 5.3, b: 9.25, draw: "ride", p: { spd: 900, sun: [0.2, 0.35], hud: 1, km: [1.95, 1.75], min: [35, 36.9], inf: 64, click: [[0, 0], [1.6, 0], [1.9, 1]], rings: [[0, 0], [1.6, 0], [2.0, 1]] } },
    // 2 — they hunt by sound: heads turn
    { a: 9.25, b: 11.1, draw: "ride", p: { spd: 900, sun: [0.35, 0.45], hud: 1, km: [1.75, 1.6], min: 37, inf: 64, rings: 1, click: 0.7, nz: 4, turn: [[0, 0], [1.05, 0], [1.7, 1]], zoom: 1.4 } },
    // 3 — the sun warms them up: they get faster and chase you
    { a: 11.1, b: 14.15, draw: "ride", p: { spd: 1000, sun: [0.45, 1], hud: 1, km: [1.6, 1.05], min: [37, 39], inf: 64, chase: [[0, 0], [1.1, 0], [1.6, 1]], zsp: [[0, 1.5], [1.2, 1.5], [3.0, 8]], gap: [[0, 520], [1.2, 520], [3.0, 250]], zoom: 1.35, cy: 1260 } },
    // 4 — 1 km left: a hand grabs your sleeve, you rip free
    { a: 14.15, b: 17.6, draw: "ride", p: { spd: 1000, sun: 1, hud: 1, km: 1.0, min: [39, 41], inf: 64, zg: [[0, 640], [1.3, 170], [2.7, 150], [3.45, -420]], grab: [[0, 0], [1.25, 0], [1.7, 1]], rip: [[0, 0, "hold"], [2.65, 0], [3.0, 1]], shake: [[0, 0], [1.55, 0], [1.7, 0.7], [2.9, 0.7], [3.2, 0]], zoom: [[0, 1.45], [1.6, 1.65]], cy: 1330, cx: 560 } },
    // 5 — 6:42 AM: 7 hours since the first bite, the infected double: 128
    { a: 17.6, b: 21.2, draw: "double", p: { dbl: [[0, 0], [1.3, 0], [2.45, 1]], zoom: [1.0, 1.05] } },
    // 6 — 300 m: the stadium floodlights ahead
    { a: 21.2, b: 22.5, draw: "ride", p: { spd: 800, sun: 1, hud: 1, km: 0.3, min: 42, inf: 128, infPop: [[0, 1], [0.6, 0]], stad: [0.7, 1] } },
    // 7 — the stadium gate, soldiers, the checkpoint sign
    { a: 22.5, b: 26.4, draw: "gate", p: { you: 1, rx: [[0, 260], [1.0, 560]], beam: [[0, 0], [1.1, 0], [1.4, 1]], sign: [[0, 0], [1.4, 0], [1.85, 1]], zoom: [[0, 1.0], [1.4, 1.0], [2.4, 1.3]], cy: [[0, 960], [1.4, 960], [2.4, 1080]] } },
    // 8 — your wrist: a thin red scratch. The zombie... or the fence?
    { a: 26.4, b: 29.45, draw: "wrist", p: { scr: [[0, 0], [0.85, 0], [1.6, 1]], glow: [[0, 0], [1.2, 0], [1.6, 1]], q: [[0, 0], [1.85, 0], [2.9, 1]], zoom: [1.0, 1.06] } },
    // 9 — A or B
    { a: 29.45, b: 32.1, draw: "choice", p: { bAt: 1.19 } },
  ],
  captions: [
    [1.5, 3.55, "6:35 AM."], [3.69, 5.1, "2 kilometers to the stadium."],
    [5.45, 6.2, "You pedal hard,"], [6.27, 7.4, "but the rusty chain clicks."],
    [7.69, 9.2, "Click, click, click, click,"],
    [9.31, 10.2, "and they hunt by sound."], [10.35, 11.0, "Heads turn."],
    [11.18, 12.0, "The sun is up now."], [12.27, 14.0, "They're warming up... and getting faster."],
    [14.25, 15.3, "1 kilometer left."], [15.49, 16.6, "A hand grabs your sleeve!"], [16.8, 17.5, "You rip free."],
    [17.71, 18.8, "6:42 AM:"], [18.87, 19.8, "the infected double."], [19.91, 21.0, "128."],
    [21.33, 22.4, "300 meters."],
    [22.58, 23.5, "The stadium gate."], [23.62, 24.8, "Soldiers. A sign:"], [24.89, 26.2, "No bites. No scratches."],
    [26.49, 27.2, "You look at your wrist..."], [27.25, 28.15, "a thin red scratch."], [28.27, 29.4, "The zombie... or the fence?"],
    [29.55, 30.5, "A: show the guards."], [30.64, 32.0, "B: hide it under your sleeve."],
  ],
  bigs: [],
  flashes: [{ at: 15.82, dur: 0.18, color: "#FF3B4E" }, { at: 16.85, dur: 0.14, color: "#FFFFFF" }, { at: 27.3, dur: 0.16, color: "#FF3B4E" }],
  endCard: { at: 32.1, series: "ZOMBIE OUTBREAK · EP 4", title: "What do you do?", choices: [{ k: "A", text: "Show the guards the scratch" }, { k: "B", text: "Hide it under your sleeve" }], cta: "COMMENT A OR B", small: ["MOST VOTES DECIDES EPISODE 5", "FOLLOW SO YOU DON'T MISS IT"] },
};
