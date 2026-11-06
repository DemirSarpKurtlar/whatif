export default {
  END: 10, bg: "#1B2233", accent: "#FF9A73", xf: 0.35,
  title: { text: "What if Mount Fuji erupted today?", end: 2.5 },
  hook: { scene: 1, at: 2.0 }, cover: 1.4,
  scenes: [
    { a: 0, b: 2.5, draw: "fuji", p: { sid: 0, zoom: [1.0, 1.05], what: 0 } },
    { a: 2.5, b: 10, draw: "fuji", p: { sid: 1, zoom: [1.0, 1.1], erupt: [[0, 0.1], [4, 1]], dark: [[0, 0], [5, 0.6]], lab: 1, labk: [[0, 0], [0.6, 1]], day: [[0, 1], [5, 16]] } },
  ],
  captions: [[3, 5, "Last time, in 1707,"], [5.1, 7, "ash fell for sixteen days."]],
  endCard: { at: 9.5, title: "x", cta: "y" },
};
