// Episode 021 — What if you dug a straight tunnel from London to New York? (Tunnel Part 2)
const EC = { dist: 4.2, orb: 0.1, camy: 0.5, cut: 1, line: 1, spin: 0, zoomy: 0.1, multi: 0, cpos: 0, dot: 0, tx: 0.55 };
const TU = { depth: 0, speed: 0, look: 0, roll: 0, sky: 0 };
export default {
  END: 31.6,
  title: { text: "What if you dug a straight tunnel from London to New York?", end: 2.7 },
  hook: { scene: 7, at: 3.6 },
  cover: 25.2,
  elapsed: { start: 5.25, end: 22.2, label: "TRIP TIME", unit: " min", dec: 1, note: "NO AIR · NO FRICTION",
    points: [[5.25, 0], [8.9, 4], [12.4, 21.1], [19.5, 42.2], [22.2, 42.2]] },
  scenes: [
    { a: 0, b: 2.7, glsl: "chordcut", p: { ...EC, cut: 0, orb: [0.7, 0.5], tx: 0.3, line: [[0, 0], [0.5, 0], [2.3, 1]] } },
    { a: 2.7, b: 5.2, glsl: "tunnel", p: { ...TU, depth: [0, 2], look: [[0, 2.6], [1.3, 2.6], [2.5, 0.2]], sky: [[0, 0.9], [1.3, 0.9], [2.5, 0.4]] },
      hud: { cat: "LONDON → NEW YORK", label: "POWER NEEDED", value: "0 W", sub: "NO ENGINE · NO FUEL", dot: "#4FD1A5" } },
    { a: 5.2, b: 8.95, glsl: "tunnel", p: { ...TU, depth: [2, 250], speed: [0.15, 0.75], roll: [0, 0.6], look: [0.2, 0.3], sky: [0.4, 0.0] },
      hud: { cat: "YOU JUST FALL", label: "YOUR SPEED", value: "", sub: "FASTER AND FASTER", counter: { at: 0.3, dur: 3.2, from: 0, to: 6000, suffix: " km/h" } } },
    { a: 8.95, b: 11.95, glsl: "chordcut", p: { ...EC, dist: [4.2, 3.3], zoomy: [0.1, 0.5], camy: [0.5, 0.8], tx: [0.55, 0.62], dot: 1, cpos: [0.15, 0.35] },
      hud: { cat: "UNDER THE ATLANTIC", label: "DEEPEST POINT", value: "", sub: "BELOW THE SEA FLOOR", counter: { at: 0.6, dur: 1.6, from: 0, to: 599, suffix: " km" } } },
    { a: 11.95, b: 14.9, glsl: "tunnel", p: { ...TU, depth: [300, 600], speed: 1.0, roll: [0.6, 1.5], look: [0.25, 0.4] },
      hud: { cat: "HALFWAY · 21 MINUTES", label: "TOP SPEED", value: "12,000 km/h", sub: "4× FASTER THAN A RIFLE BULLET", vcol: "#FFE7A8" } },
    { a: 14.9, b: 20.0, glsl: "chordcut", p: { ...EC, dist: [3.4, 3.9], zoomy: [0.5, 0.35], camy: [0.8, 0.7], tx: [0.62, 0.6], dot: 1, cpos: [[0, 0.5], [4.6, 1.0, "ease-out"], [5.1, 1.0]] },
      hud: { cat: "THE SLOPE TURNS UPHILL", label: "GRAVITY NOW", value: "Slows you down", sub: "UNTIL YOU STOP · RIGHT AT THE END" } },
    { a: 20.0, b: 22.25, glsl: "tunnel", p: { ...TU, depth: [5390, 5394], speed: [0.2, 0], look: [[0, 0.4], [0.9, 3.1], [2.25, 3.1]], sky: [[0, 0.05], [0.9, 0.5], [2.25, 1.0]], roll: [1.5, 1.6] },
      hud: { cat: "NEW YORK", label: "YOUR SPEED", value: "0 m/s", sub: "STEP OUT · NO TICKET NEEDED", dot: "#4FD1A5" } },
    { a: 22.25, b: 27.0, glsl: "chordcut", p: { ...EC, dist: [3.6, 4.4], zoomy: [0.4, 0.05], camy: [0.8, 0.5], tx: [0.6, 0.55], dot: 1, multi: [[0, 0], [1.6, 1]], cpos: [[0, 0], [1.6, 0], [4.3, 1.0]] },
      hud: { at: 1.2, cat: "ANY TWO CITIES", label: "TRIP TIME", value: "42 min", sub: "SHORT OR LONG · ALWAYS THE SAME", vcol: "#FFD866" } },
    { a: 27.0, b: 31.6, glsl: "chordcut", p: { ...EC, dist: [4.4, 5.0], orb: [0.1, 0.3], dot: 1, multi: 1, cpos: 1 } },
  ],
  captions: [
    [3.58, 4.9, "No engines, no fuel."], [5.26, 6.4, "You just step in and fall."],
    [6.6, 8.8, "Gravity pulls you down the slope, faster and faster."], [9.0, 11.9, "The tunnel dips 600 km below the Atlantic."],
    [12.1, 14.8, "At the middle, you're flying at 12,000 km/h."], [15.04, 17.4, "Then the slope turns uphill,"],
    [17.48, 19.9, "gravity slows you down, until you stop at the New York end."], [20.22, 21.9, "Total time: 42 minutes."],
    [22.3, 23.4, "Here's the crazy part."], [23.52, 26.9, "Any straight tunnel, between any two cities, takes the same 42 minutes."],
  ],
  bigs: [{ at: 20.86, dur: 1.3, text: "42 min" }, { at: 26.3, dur: 1.0, text: "42 min" }],
  flashes: [{ at: 5.25, dur: 0.35 }],
  endCard: { at: 28.3, title: "What if you dug a straight tunnel from London to New York?", small: ["TUNNEL PART 2 · SIMPLIFIED PHYSICS", "NO AIR · NO FRICTION · UNIFORM EARTH"], cta: "WHERE WOULD YOU DIG YOURS?" },
};
