// 048 — What if every satellite fell out of the sky?  Style: Higgsfield "Pixel Night" (16-bit pixel art, retro game HUD, neon night city)
// — same kit as 035/044 (draw/px.js: 180x320 pixel canvas, 6x nearest upscale, own 5x7 font), new scenes for this episode.
// HUD cards and big numbers are drawn IN-SCENE with the pixel font, so the engine's sans "huds"/"bigs" stay empty on purpose.
// s: 0 orbit · 1 meteor city · 2 ISS · 3 phone map · 4 old-school nav · 5 clocks · 6 money · 7 weather · 8 timeline · 9 end
//    (scene 10 = cold-open hook only, off-timeline: meteor city + "SATELLITES" HP bar draining)
const sc = (s, a, b, p = {}) => ({ a, b, draw: "px", p: { s, ...p } });
export default {
  END: 34.4,
  style: "flat",
  bg: "#0B0A1E",
  accent: "#FFD23F",
  xf: 0,
  capY: 1450,
  hot: ["satellites", "dropping", "burn", "shooting", "stars", "station", "tonnes", "chunks", "ground", "gps", "dark", "spin", "old", "clock", "billion", "day", "hurricanes", "warning", "years", "miss"],
  title: { text: "What if every satellite fell out of the sky?", end: 2.2, tag: "ALL 17,000 OF THEM", hot: ["satellite", "fell", "sky"], y: 1400 },
  // cold open: burning satellites streak over the city while "SATELLITES" HP drains from 16,988 to 0
  hook: { scene: 10, at: 0 },
  cover: 1.4,
  scenes: [
    sc(0, 2.2, 6.45, { tDrop: 2.5 }),                                                   // 0 orbit view, 16,988 -> falling
    sc(1, 6.45, 8.15, { tBig: 0.2 }),                                                    // 1 meteor storm over the city
    sc(2, 8.15, 11.95, { tBig: 0.95, tBreak: 2.3, tSplash: 2.95 }),                       // 2 ISS 420 t reentry, chunks hit
    sc(3, 11.95, 14.6, { tLost: 1.1 }),                                                  // 3 phone map: GPS lost, map spins
    sc(4, 14.6, 16.85, { tCmp: 0.4 }),                                                   // 4 pilots + ship crews, old-school nav
    sc(5, 16.85, 20.5, { tLose: [0.15, 0.95, 1.65] }),                                   // 5 cell / grid / bank clocks -> backup
    sc(6, 20.5, 24.2, { cnt: [[0, 0], [1.2, 0], [2.55, 1]], tDay: 2.98 }),                // 6 $1 billion per day
    sc(7, 24.2, 28.25, { data: [[0, 0], [0.8, 0], [1.4, 1]], tBig: 1.45, tUnk: 3.4 }),   // 7 weather data -90%, hurricane
    sc(8, 28.25, 30.95, { prog: [[0, 0], [1.55, 1]], tBig: 1.55, tCrash: 2.3 }),        // 8 1957 -> 2026 timeline, crash to 0
    sc(9, 30.95, 34.4),                                                                   // 9 empty sky, question
    sc(1, 100, 106, { ui: 0, hp: 1, drain: [[0, 0], [0.3, 0.03], [2.15, 1]] }),           // 10 hook only (off-timeline)
  ],
  captions: [
    [2.3, 3.9, "Tonight, about 17,000"],
    [3.92, 5.5, "working satellites start dropping."],
    [6.48, 8.1, "Most burn up as shooting stars."],
    [8.2, 9.98, "But the space station weighs 400 tonnes,"],
    [10.02, 11.75, "and big chunks could hit the ground."],
    [12.02, 13.6, "Then GPS goes dark."],
    [13.8, 14.62, "Phone maps spin,"],
    [14.66, 16.65, "and pilots and ship crews navigate the old way."],
    [16.92, 18.42, "Cell towers, power grids"],
    [18.44, 20.2, "and banks lose their GPS clock."],
    [20.72, 22.3, "In the US, losing GPS"],
    [22.32, 23.95, "could cost a billion dollars a day."],
    [24.36, 26.68, "Weather forecasts lose 90% of their data,"],
    [26.72, 28.25, "so hurricanes hit with less warning."],
    [28.3, 30.55, "Building them took almost 70 years."],
    [31.0, 32.0, "What would you miss first?"],
  ],
  bigs: [],
  huds: [],
  flashes: [
    { at: 4.7, dur: 0.25, color: "#FF8A3D" },
    { at: 6.45, dur: 0.15, color: "#FFFFFF" },
    { at: 11.1, dur: 0.3, color: "#FFFFFF" },
    { at: 13.05, dur: 0.2, color: "#FF3B4E" },
    { at: 30.55, dur: 0.25, color: "#FF3B4E" },
  ],
  endCard: {
    at: 32.0, series: "WHAT IF · PIXEL NIGHT", title: "Orbit: empty",
    choices: [{ k: "A", text: "GPS and maps" }, { k: "B", text: "Weather forecasts" }],
    cta: "A OR B? TELL US BELOW", small: ["SAVE THIS FOR PART 2", "FOLLOW FOR MORE WHAT IFS"],
  },
};
