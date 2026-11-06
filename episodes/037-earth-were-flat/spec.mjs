// Episode 037 — What if Earth were actually flat?  Style: Higgsfield "Toy Planet" (tilt-shift toy diorama), see style.md
// One custom shader: shaders/toydisc.glsl (all params listed at the top of that file; every scene sets all of them).
const D = { cd: 9.5, cyaw: 0.3, cpit: 0.42, tx: 0, ty: 0, tz: 0, roll: 0, lens: 0, shk: 0, tsh: 0.032, foc: 0, space: 1, night: 0,
  sun: 0, sunel: 0.4, sunaz: 0.5, morph: 0, arw: 0, cslide: 0, air: 0, pool: 0, pv: 0, pr: 1.5, pa: 0, lean: 0, walk: 0, helm: 0 };
// walker close-ups: camera on the tangent side of the walker (yaw 0 → outward = screen right), rolled so gravity is screen-down
const WK = (r, lean) => ({ pv: 1, pa: 0, pr: r, lean, roll: Array.isArray(lean) ? lean.map((x) => -x) : -lean, tx: r, ty: 0.14, tz: 0, cyaw: 0, walk: 1, space: 0 });
const SUN = { sun: 1, sunaz: -1.77 };
export default {
  END: 31.2,
  style: "flat",
  bg: "#0B0E1F",
  xf: 0.3,
  capY: 1430,
  hot: ["flat", "middle", "centre", "tilted", "rim", "slope", "air", "breathe", "sun", "once", "sunrise", "hour", "ball", "round", "edge"],
  title: { text: "What if Earth were actually flat?", end: 1.95, tag: "PHYSICS · THOUGHT EXPERIMENT", hot: ["flat"] },
  hook: { scene: 4, at: 0.4 },
  cover: 3.4,
  scenes: [
    // 0 title (mostly covered by the hook)
    { a: 0, b: 1.95, glsl: "toydisc", p: { ...D, cyaw: [0.1, 0.3] } },
    // 1 gravity → middle of the mass
    { a: 1.95, b: 4.0, glsl: "toydisc", p: { ...D, cyaw: [0.3, 0.55], cpit: [0.5, 0.36], cd: [10.0, 9.0], arw: [[0, 0], [0.35, 0], [0.9, 1, "back"], [2.05, 1]] },
      hud: { at: 0.1, cat: "GRAVITY PULLS TOWARD", value: "The middle", sub: "OF ALL THE MASS", dot: "#F2A93B" } },
    // 2 on a disc: centre = down (low side view, arrows lean inward)
    { a: 4.0, b: 6.45, glsl: "toydisc", p: { ...D, arw: 1, cd: [7.6, 7.0], cyaw: [0.55, 0.7], cpit: [0.24, 0.18], ty: 0.35, tsh: 0.03 },
      hud: { at: 0.05, cat: "ON A DISC", value: "Down = centre", sub: "EVERY ARROW LEANS INWARD", dot: "#F2A93B" } },
    // 3 walk outward: the ground starts to feel tilted
    { a: 6.45, b: 9.05, glsl: "toydisc", p: { ...D, ...WK([1.15, 1.95], [0.18, 0.5]), cd: [2.0, 1.85], cpit: 0.2, tsh: 0.034 },
      hud: { cat: "WALKING OUTWARD", label: "", value: "10°", sub: "GRAVITY LEANS TOWARD THE CENTRE", dot: "#4FB3E8", counter: { at: 0.3, dur: 2.0, from: 10, to: 28, suffix: "° tilt", easing: "ease-in-out" } } },
    // 4 near the rim: a sixty-degree slope (hook)
    { a: 9.05, b: 11.45, glsl: "toydisc", p: { ...D, ...WK([2.6, 2.74], [0.9, 1.02]), cd: [1.75, 1.6], cpit: 0.14, tsh: 0.034 },
      hud: { at: 0.05, cat: "NEAR THE RIM", value: "Uphill", sub: "FLAT GROUND, STEEP CLIMB", dot: "#FF5A4E" } },
    // 5 the air slides downhill and pools over the middle
    { a: 11.45, b: 13.8, glsl: "toydisc", p: { ...D, air: 1, pool: [[0, 0], [0.4, 0], [2.2, 1]], cslide: [[0, 0], [0.4, 0], [2.2, 1]], cd: [9.4, 8.6], cpit: [0.3, 0.26], cyaw: [0.9, 1.05], ty: 0.2 },
      hud: { at: 0.05, cat: "THE AIR", value: "Slides inward", sub: "AND POOLS OVER THE MIDDLE", dot: "#4FB3E8" } },
    // 6 at the edge: nothing to breathe
    { a: 13.8, b: 15.55, glsl: "toydisc", p: { ...D, ...WK(2.74, 1.02), walk: 0.3, space: 1, helm: [[0, 0], [0.5, 0], [0.9, 1]], air: 1, pool: 1, cslide: 1, cd: [1.9, 2.2], cpit: 0.18, tsh: 0.03 },
      hud: { at: 0.05, cat: "AT THE RIM", value: "No air", sub: "HIGHER THAN ANY MOUNTAIN", vcol: "#FF5A4E", dot: "#FF5A4E" } },
    // 7 sunrise: the whole disc lights up at once
    { a: 15.55, b: 17.55, glsl: "toydisc", p: { ...D, ...SUN, night: [[0, 1], [0.35, 1], [1.6, 0]], sunel: [[0, -0.16], [1.7, 0.3, "ease-out"]], cd: 9.6, cyaw: [0.0, 0.1], cpit: 0.2, ty: 0.45 },
      hud: { at: 0.3, cat: "THE SUN RISES", value: "All at once", sub: "EVERY TOWN, SAME MOMENT", vcol: "#FFD23F", dot: "#F2A93B" } },
    // 8 same sunrise for everyone, no time zones (low glide over the village)
    { a: 17.55, b: 20.2, glsl: "toydisc", p: { ...D, ...SUN, sunel: 0.32, space: 0, cd: [3.4, 3.0], cyaw: [0.15, 0.45], cpit: [0.42, 0.36], tx: 0.6, tz: 0.4, ty: 0.05 },
      hud: { at: 0.05, cat: "SUNRISE", value: "6:00 AM", sub: "FOR EVERYONE ON THE DISC", dot: "#F2A93B" } },
    // 9 but it wouldn't last: rock can't hold that shape
    { a: 20.2, b: 22.5, glsl: "toydisc", p: { ...D, cd: [9.6, 9.2], cyaw: [1.6, 1.75], cpit: 0.36, shk: [[0, 0], [1.0, 0], [2.3, 0.7]], morph: [[0, 0], [1.3, 0], [2.3, 0.07]] },
      hud: { at: 0.9, cat: "ROCK STRENGTH", value: "Too weak", sub: "≈1,000× LESS THAN THE SQUEEZE", vcol: "#FF5A4E", dot: "#FF5A4E" } },
    // 10 in about an hour the disc crumples into a ball
    { a: 22.5, b: 24.9, glsl: "toydisc", p: { ...D, cd: [9.0, 7.4], cyaw: [1.75, 2.1], cpit: [0.34, 0.22], ty: [0, -0.2], shk: [[0, 0.8], [2.0, 0.5], [2.4, 0.1]], morph: [[0, 0.07], [2.1, 1, "ease-in-out"], [2.4, 1]] },
      hud: { at: 0.1, cat: "SELF-GRAVITY", value: "Crumpling", sub: "A DISC THIS BIG CAN'T SURVIVE", vcol: "#FF5A4E", dot: "#FF5A4E" } },
    // 11 that's why every planet is round
    { a: 24.9, b: 26.75, glsl: "toydisc", p: { ...D, morph: 1, cd: [6.6, 6.2], cyaw: [2.1, 2.5], cpit: 0.12, ty: -0.2, tsh: 0.028 },
      hud: { at: 0.05, cat: "HYDROSTATIC EQUILIBRIUM", value: "Round", sub: "BIG WORLDS PULL THEMSELVES INTO BALLS", vcol: "#7BD88F", dot: "#4FD1A5" } },
    // 12 question: back at the edge
    { a: 26.75, b: 31.2, glsl: "toydisc", p: { ...D, ...WK(2.7, 0.98), walk: 1, space: 1, cd: [1.7, 2.4], cpit: 0.16, tsh: 0.03 } },
  ],
  captions: [
    [2.04, 3.92, "Gravity pulls toward the middle of the mass."],
    [4.06, 6.3, "On a disc, that's the centre."],
    [6.54, 8.95, "Walk outward, and flat ground starts to feel tilted."],
    [9.14, 11.35, "Near the rim, it's like climbing a 60° slope."],
    [11.52, 13.75, "The air slides downhill too, pooling over the middle."],
    [13.9, 15.5, "At the edge, there's nothing to breathe."],
    [15.66, 17.5, "And the sun lights the whole disc at once."],
    [17.64, 19.1, "Same sunrise for everyone."],
    [19.24, 20.15, "No time zones."],
    [20.28, 21.2, "But it wouldn't last."],
    [21.3, 22.45, "Rock can't hold that shape."],
    [22.58, 24.85, "In about an hour, the disc crumples into a ball."],
    [24.96, 26.65, "That's why every planet is round."],
    [26.8, 28.35, "Would you race to the edge first?"],
  ],
  bigs: [
    { at: 10.4, dur: 1.0, text: "60°", tag: "SLOPE", y: 600, color: "#FFD23F" },
    { at: 19.24, dur: 0.95, text: "0", tag: "TIME ZONES", y: 600, color: "#FFD23F" },
    { at: 22.68, dur: 1.3, text: "1 HOUR", tag: "TO COLLAPSE", y: 600, size: 170, color: "#FF5A4E" },
  ],
  flashes: [{ at: 22.58, dur: 0.25 }],
  endCard: { at: 28.4, title: "What if Earth were actually flat?", cta: "WOULD YOU RACE TO THE EDGE?", small: ["SIMPLIFIED PHYSICS · TOY MODEL", "EARTH'S MASS AS A 20,000 KM-WIDE DISC"] },
};
