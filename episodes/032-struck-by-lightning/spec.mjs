// Episode 032 — What if you were struck by lightning? (body POV, science-first)
// parkstorm.glsl = the park set at night in a thunderstorm (copied from park/park2g): rain, storm clouds, jagged bolt with branches,
// u_flash lights clouds+scene, u_you = you in a yellow raincoat (back to camera), u_hair, u_glow (current over the skin),
// u_side (side flash from the lone tree), u_rings/u_ripple (ground current), u_dark (heart-stop vignette).
const ST = { cam: 0.8, rise: 0.15, tilt: 0, panx: 0, yaw: 0, zoom: 0, shake: 0, rain: 1, flash: 0, dark: 0,
  bolt: 0, bx: 0.05, by: 1.72, bz: 0.3, seed: 3, heat: 0, you: 1, hair: 0, glow: 0, side: 0, rings: 0, ripple: 0 };
// the lone tree, framed from the path (bolt target = top of its canopy)
const TREE = { ...ST, you: 0, cam: 0.0, rise: 0, tilt: 2.4, yaw: -6.2, bx: -3.6, by: 5.5, bz: -6.0, seed: 5 };
export default {
  END: 33.8,
  title: { text: "What if you were struck by lightning?", end: 1.44 },
  hook: { scene: 2, at: 2.66 },
  cover: 7.99,
  elapsed: { start: 5.08, end: 16.52, label: "ONE BOLT", unit: " µs", dec: 0, note: "SLOWED DOWN ~1,000,000×",
    points: [[5.08, 0], [16.52, 30]] },
  scenes: [
    // 0 cold open (hook replaces it while the title is up): the storm rolls in
    { a: 0, b: 1.54, glsl: "parkstorm", p: { ...ST, cam: [0.4, 0.6], rise: 0.25, flash: [[0, 0], [0.3, 0.35], [0.6, 0.05]] } },
    // 1 open field, hair stands on end
    { a: 1.54, b: 5.08, glsl: "parkstorm", p: { ...ST, cam: [0.6, 0.8], hair: [[0, 0], [1.54, 0], [2.44, 1.0, "ease-out"], [3.54, 1.05]], flash: [[0, 0], [2.44, 0], [2.54, 0.3], [2.94, 0]] },
      hud: { at: 1.44, cat: "WARNING SIGN", label: "YOUR HAIR", value: "Stands up", sub: "CHARGE IS BUILDING ABOVE YOU", dot: "#F2C14E" } },
    // 2 the strike
    { a: 5.08, b: 8.86, glsl: "parkstorm", p: { ...ST, hair: 1.1, tilt: [1.0, 1.8], bolt: [[0, 0], [0.1, 1]], flash: [[0, 0], [0.08, 1.0], [0.8, 0.45]], shake: [[0, 0], [0.08, 1.0], [1.2, 0.25]], heat: [0.0, 0.3] },
      hud: { at: 1.68, cat: "ONE LIGHTNING BOLT", label: "VOLTAGE", value: "", sub: "≈ 2.5 MILLION TIMES A WALL SOCKET", vcol: "#BFD4FF", dot: "#7FA8FF", counter: { at: 0.2, dur: 1.0, from: 0, to: 300, suffix: " million V", easing: "ease-out" } } },
    // 3 the heat: look up the channel
    { a: 8.86, b: 14.04, glsl: "parkstorm", p: { ...ST, hair: 1.1, cam: [0.8, 0.95], tilt: [1.8, 2.6], zoom: [0, 0.35], bolt: 1, flash: 0.45, heat: [0.3, 1.0], shake: 0.2 },
      hud: { at: 1.33, cat: "THE AIR AROUND THE BOLT", label: "TEMPERATURE", value: "", sub: "5× HOTTER THAN THE SUN'S SURFACE", vcol: "#FFD866", counter: { at: 0.1, dur: 1.0, from: 0, to: 30000, suffix: " °C", easing: "ease-out" } } },
    // 4 the current flashes over the skin
    { a: 14.04, b: 16.88, glsl: "parkstorm", p: { ...ST, hair: [1.1, 0.6], tilt: [1.2, 0.6], bolt: [[0, 1], [2.08, 0.8], [2.48, 0]], heat: [1.0, 0.4], flash: [0.45, 0.1], glow: [[0, 0.2], [0.4, 1.0], [2.38, 0.9], [2.84, 0.3]], shake: 0.15 },
      hud: { at: 0.05, cat: "THE CURRENT", label: "UP TO", value: "", sub: "MOST OF IT FLASHES OVER YOUR SKIN", vcol: "#BFD4FF", dot: "#7FA8FF", counter: { at: 0.1, dur: 0.9, from: 0, to: 30000, suffix: " A", easing: "ease-out" } } },
    // 5 the heart
    { a: 16.88, b: 19.9, glsl: "parkstorm", p: { ...ST, hair: 0.4, cam: [0.8, 0.7], tilt: [0.2, -0.3], glow: [0.25, 0], dark: [[0, 0.2], [0.5, 0.7], [1.1, 0.7], [1.6, 0.15, "ease-out"], [3.02, 0.05]] } },
    // 6 most strikes aren't direct: the lone tree
    { a: 19.9, b: 23.4, glsl: "parkstorm", p: { ...TREE, tilt: [2.6, 2.0], cam: [0.0, 0.25], bolt: [[0, 0], [0.12, 0], [0.2, 1], [1.72, 0.9], [3.34, 0.6], [3.5, 0.0]], flash: [[0, 0], [0.12, 0], [0.2, 0.9], [1.0, 0.35], [3.5, 0.15]],
      side: [[0, 0], [1.82, 0], [1.9, 1.0], [2.8200000000000003, 0.6], [3.12, 0]], rings: [[0, 0], [2.52, 0], [2.72, 1.0], [3.5, 0.8]], ripple: [[0, 0], [2.52, 0.05], [3.5, 0.8, "ease-out"]], shake: [[0, 0], [0.18, 0.7], [1.0, 0.1]] } },
    // 7 nine in ten survive
    { a: 23.4, b: 25.2, glsl: "parkstorm", p: { ...ST, cam: [0.55, 0.4], rise: [0.3, 0.45], tilt: -0.4, rain: 0.55, hair: 0, flash: [[0, 0.15], [0.4, 0]] },
      hud: { at: 0.1, cat: "THE GOOD NEWS", label: "PEOPLE STRUCK WHO SURVIVE", value: "", sub: "THE REST · MOSTLY CARDIAC ARREST", vcol: "#7CE3B8", dot: "#4FD1A5", counter: { at: 0.1, dur: 0.9, from: 0, to: 90, suffix: "%", easing: "ease-out" } } },
    // 8 Roy Sullivan: seven strikes
    { a: 25.2, b: 27.26, glsl: "parkstorm", p: { ...ST, you: 0, cam: 0.3, rise: 0.3, tilt: 3.0, yaw: 2.0, bx: 9.0, by: 0, bz: -34, bolt: [[0.1, 0], [0.14, 1], [0.25, 0.15], [0.35, 0], [0.37, 0], [0.41, 1], [0.51, 0.15], [0.62, 0], [0.63, 0], [0.67, 1], [0.78, 0.15], [0.88, 0], [0.9, 0], [0.94, 1], [1.04, 0.15], [1.15, 0], [1.16, 0], [1.2, 1], [1.31, 0.15], [1.42, 0], [1.43, 0], [1.47, 1], [1.57, 0.15], [1.68, 0], [1.69, 0], [1.73, 1], [1.84, 0.15], [1.95, 0]], seed: [[0.09, 2], [0.36, 2], [0.36, 3], [0.63, 3], [0.62, 4], [0.89, 4], [0.89, 5], [1.16, 5], [1.15, 6], [1.42, 6], [1.42, 7], [1.69, 7], [1.68, 8], [1.95, 8]], flash: [[0.1, 0.05], [0.14, 0.55], [0.34, 0.05], [0.37, 0.05], [0.41, 0.55], [0.6, 0.05], [0.63, 0.05], [0.67, 0.55], [0.87, 0.05], [0.9, 0.05], [0.94, 0.55], [1.14, 0.05], [1.16, 0.05], [1.2, 0.55], [1.4, 0.05], [1.43, 0.05], [1.47, 0.55], [1.67, 0.05], [1.69, 0.05], [1.73, 0.55], [1.93, 0.05]] },
      hud: { at: 0.1, cat: "PARK RANGER ROY SULLIVAN", label: "STRUCK BY LIGHTNING", value: "7 times", sub: "1942–1977 · SURVIVED ALL SEVEN", dot: "#F2C14E", vcol: "#FFD866" } },
    // 9 if you hear thunder, you're in range
    { a: 27.26, b: 28.84, glsl: "parkstorm", p: { ...ST, you: 0, cam: [0.1, 0.3], rise: 0.6, tilt: 2.2, yaw: -3.0, bx: -30, by: 0, bz: -75, seed: 11, bolt: [[0, 0], [0.37, 0], [0.42, 1], [0.77, 0.1], [0.87, 0.9], [1.32, 0]], flash: [[0, 0], [0.42, 0.35], [1.32, 0.03]] },
      hud: { at: 0.1, cat: "IF YOU HEAR THUNDER", label: "LIGHTNING CAN STRIKE", value: "16 km away", sub: "10 MILES · GET INDOORS", vcol: "#FFD866" } },
    // 10 would you still stand under that tree?
    { a: 28.84, b: 33.8, glsl: "parkstorm", p: { ...TREE, cam: [0.25, 0.75], yaw: [-6.4, -5.9], tilt: [2.0, 1.6], rain: 1, flash: [[0, 0], [1.8, 0], [1.9, 0.4], [2.4, 0.02], [4.96, 0]] } },
  ],
  huds: [
    { at: 16.93, dur: 0.95, cat: "THE SHOCK", label: "YOUR HEART", value: "Can stop", sub: "MOST LIGHTNING DEATHS ARE CARDIAC ARREST", vcol: "#FF6B5E" },
    { at: 17.93, dur: 1.95, cat: "THEN", label: "YOUR HEART", value: "Restarts", sub: "ITS OWN PACEMAKER KICKS BACK IN", dot: "#4FD1A5", vcol: "#7CE3B8" },
    { at: 20.0, dur: 1.52, cat: "HOW PEOPLE GET HIT", label: "DIRECT STRIKES", value: "Only 3–5%", sub: "OF LIGHTNING INJURIES", dot: "#F2C14E" },
    { at: 21.57, dur: 0.88, cat: "SIDE FLASH", label: "LIGHTNING JUMPS FROM A TREE", value: "20–30%", sub: "OF LIGHTNING INJURIES", dot: "#7FA8FF" },
    { at: 22.47, dur: 0.91, cat: "GROUND CURRENT", label: "SPREADS THROUGH THE GROUND", value: "40–50%", sub: "THE MOST COMMON WAY", dot: "#7FA8FF", vcol: "#BFD4FF" },
  ],
  captions: [
    [1.6, 3.98, "You're out in an open field, and your hair stands on end."],
    [5.14, 6.54, "Then, in 30 microseconds,"], [6.96, 8.42, "300 million volts hit you."],
    [8.92, 11.24, "The air around you flashes to 30,000 degrees,"], [11.82, 13.64, "five times hotter than the surface of the Sun."],
    [14.1, 16.42, "30,000 amps race mostly over your skin."],
    [16.94, 18.86, "Your heart can stop, then restart on its own."],
    [19.96, 21.2, "But most strikes aren't direct."], [21.54, 23.24, "They jump from a tree, or spread through the ground."],
    [23.24, 24.76, "And 9 in 10 people survive."],
    [25.26, 27.08, "Roy Sullivan was struck seven times."],
    [27.32, 28.9, "If you hear thunder, you're in range."],
  ],
  bigs: [{ at: 11.82, dur: 1.4, text: "5× SUN", size: 190, color: "#FFD866" }, { at: 23.85, dur: 1.1, text: "9 IN 10", size: 190, color: "#7CE3B8" }, { at: 26.3, dur: 1.0, text: "7×", size: 240 }],
  flashes: [{ at: 5.14, dur: 0.45, color: "#E6ECFF" }, { at: 20.11, dur: 0.35, color: "#E6ECFF" }, { at: 27.68, dur: 0.2, color: "#E6ECFF" }],
  endCard: { at: 31.0, title: "What if you were struck by lightning?", small: ["TYPICAL BOLT VALUES · NOAA / NWS · CDC", "WHEN THUNDER ROARS, GO INDOORS"], cta: "WOULD YOU STILL STAND UNDER THAT TREE?" },
};
