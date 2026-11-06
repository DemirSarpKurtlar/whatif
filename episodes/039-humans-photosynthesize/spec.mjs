// 039 — What if humans could photosynthesize like plants?  Style: Higgsfield "Bold Flat" (see style.md)
// Voice 30.29 s (Chatterbox), last word ends 29.70 → END 32.7. All scenes: draw/photo.js (p.k = scene id).
export default {
  END: 32.7,
  style: "flat",
  bg: "#0E1845",
  xf: 0.22,
  capY: 1470,
  hot: ["green", "green.", "chlorophyll", "red", "blue", "sun", "sun.", "half", "plant", "food", "light", "leaf", "skin", "lunch"],
  title: { text: "What if humans could photosynthesize like plants?", end: 2.35, tag: "WHAT IF...", y: 1420, hot: ["photosynthesize", "plants"] },
  hook: { scene: 9, at: 0.6 },
  cover: 1.4,
  scenes: [
    { a: 0, b: 2.35, draw: "photo", p: { k: 0, zoom: [1.0, 1.05] } },
    // "First, you'd turn green."
    { a: 2.35, b: 3.85, draw: "photo", p: { k: 1, zoom: [1.0, 1.05], g: [[0, 0], [0.6, 0], [1.0, 1]], lab: [[0, 0], [0.8, 0], [1.15, 1]] } },
    // "Chlorophyll eats red and blue light and bounces the green back."
    { a: 3.85, b: 7.1, draw: "photo", p: { k: 2, zoom: [1.0, 1.05], beam: [[0, 0], [0.3, 0], [1.0, 1]], eat: [[0, 0], [1.0, 0], [1.5, 1]], bounce: [[0, 0], [1.4, 0], [2.2, 1]] } },
    // "Step into the sun. On a good day, sunlight averages 250 watts on every square metre,"
    { a: 7.1, b: 12.3, draw: "photo", p: { k: 3, zoom: [1.0, 1.05], walkin: [[0, 0], [0.9, 1]], c1: [[0, 0], [2.6, 0], [2.95, 1]], panel: [[0, 0], [4.1, 0], [4.5, 1]] } },
    // "only half your skin faces it, about one square metre,"
    { a: 12.3, b: 15.05, draw: "photo", p: { k: 4, zoom: [1.0, 1.05], shade: [[0, 0], [0.2, 0], [0.7, 1]], c1: [[0, 0], [1.3, 0], [1.65, 1]] } },
    // "and like a plant, you'd turn one to two percent into food."
    { a: 15.05, b: 18.2, draw: "photo", p: { k: 5, zoom: [1.0, 1.04], head: [[0, 0], [0.35, 1], [1.7, 1], [1.85, 0]], grid: [[0, 0], [0.9, 1]], waste: [[0, 0], [1.2, 0], [2.2, 1]], food: [[0, 0], [1.85, 0], [2.3, 1]] } },
    // "All day long, that's 50 to 90 calories. You need 2,000."
    { a: 18.2, b: 22.0, draw: "photo", p: { k: 6, zoom: [1.0, 1.04], day: [[0, 0], [1.7, 1]], kc: [[0, 0], [0.9, 0], [1.6, 90]], need: [[0, 0], [2.5, 0], [2.8, 1]] } },
    // "To live on light alone, you'd need 40 square metres of green skin, spread out like a leaf."
    { a: 22.0, b: 26.6, draw: "photo", p: { k: 7, zoom: [[0, 2.7], [0.4, 2.7], [2.6, 1.0]], leaf: [[0, 0], [0.1, 0], [0.9, 1]], court: [[0, 0], [2.3, 0], [2.7, 1]] } },
    // "20 times the skin you have."
    { a: 26.6, b: 28.6, draw: "photo", p: { k: 8, zoom: [1.0, 1.04], lab: [[0, 0], [0.2, 1]], n: [[0, 0], [0.15, 1], [1.2, 20]] } },
    // "Would you still eat lunch?"
    { a: 28.6, b: 32.7, draw: "photo", p: { k: 9, zoom: [1.0, 1.06], q: [[0, 0], [0.7, 0], [1.0, 1]] } },
  ],
  captions: [
    [2.42, 3.6, "First, you'd turn green."],
    [3.82, 4.38, "Chlorophyll eats"], [4.4, 5.1, "red and blue light"], [5.12, 6.6, "and bounces the green back."],
    [7.2, 8.2, "Step into the sun."],
    [8.42, 9.2, "On a good day,"], [9.24, 10.9, "sunlight averages 250 watts"], [10.92, 12.1, "on every square metre,"],
    [12.38, 13.62, "only half your skin faces it,"], [13.66, 14.95, "about one square metre,"],
    [15.14, 16.0, "and like a plant,"], [16.1, 17.18, "you'd turn 1 to 2 percent"], [17.2, 18.1, "into food."],
    [18.32, 19.0, "All day long,"], [19.06, 20.45, "that's 50 to 90 calories."], [20.66, 21.9, "You need 2,000."],
    [22.08, 23.1, "To live on light alone,"], [23.26, 24.32, "you'd need 40 square metres"], [24.36, 25.16, "of green skin,"], [25.18, 26.5, "spread out like a leaf."],
    [26.74, 28.4, "20 times the skin you have."],
    [28.72, 30.1, "Would you still eat lunch?"],
  ],
  bigs: [
    { at: 16.9, dur: 1.3, text: "1–2%", tag: "BECOMES FOOD", y: 330, color: "#5BE36A", size: 200 },
    { at: 19.26, dur: 1.3, text: "50–90", tag: "KCAL FROM A WHOLE DAY OF SUN", x: 400, y: 470, color: "#FFD23F", size: 170 },
    { at: 20.9, dur: 1.05, text: "2,000", tag: "KCAL YOU ACTUALLY NEED", x: 400, y: 470, color: "#FF4B4B", size: 190 },
    { at: 23.52, dur: 1.7, text: "40 m²", tag: "OF GREEN SKIN", y: 560, color: "#5BE36A", size: 210 },
  ],
  huds: [
    { at: 25.0, dur: 1.55, cat: "FOR SCALE", value: "1/6", sub: "OF A TENNIS COURT", dot: "#E8413C" },
    { at: 29.3, dur: 1.0, cat: "SOLAR LUNCH", value: "≈ 1 APPLE", sub: "PER SUNNY DAY", dot: "#3FBF4A" },
  ],
  flashes: [{ at: 3.1, dur: 0.3, color: "#C9FF8A" }, { at: 23.52, dur: 0.2, color: "#FFFFFF" }],
  endCard: { at: 30.2, title: "Would you still eat lunch?", cta: "COMMENT YES OR NO", small: ["SAVE THIS FOR PART 2", "FOLLOW FOR MORE WHAT IFS"] },
};
