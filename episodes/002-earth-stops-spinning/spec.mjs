// Episode 002 — What if Earth stopped spinning for 1 second?
const ST = { cam: 0, fling: 0, lean: 0, wind: 0, shake: 0, tilt: 0, dust: 0, panx: 0 };
const EA = { dist: 5.6, orb: 0.3, camy: 0, tx: 0, ty: 0, spin: 0, leak: 0, quake: 0, shake: 0, sun: 0.6, diag: 0 };
const CO = { cam: 0, level: 0, surge: 0, night: 0, moon: 0, shake: 0, tilt: 0, panx: 0, wet: 0 };
export default {
  END: 53.2,
  title: { text: "What if Earth stopped spinning for 1 second?", end: 3.45 },
  elapsed: { start: 14.1, end: 43.2, dec: 2, note: "TIME SLOWED ~28×", points: [[14.1, 0], [17.6, 0.1], [23.7, 0.3], [27.8, 0.45], [37.2, 0.75], [41.9, 1.0]] },
  scenes: [
    { a: 0, b: 3.5, glsl: "street", p: { ...ST, cam: [0, 0.4] } },
    { a: 3.5, b: 7.8, glsl: "street", p: { ...ST, cam: [0.4, 1.0], panx: [0, 0.6], tilt: [0, 0.08] }, hud: { cat: "A CALM MORNING", label: "ONE TURN OF THE EARTH", value: "24 hours", sub: "YOU DON'T FEEL A THING", dot: "#4FD1A5" } },
    { a: 7.8, b: 13.3, glsl: "earth", p: { ...EA, spin: [0, 0.7], orb: [0.2, 0.35] }, hud: { cat: "BUT YOU'RE MOVING", label: "EASTWARD, AT 40° LATITUDE", value: "1,280 km/h", sub: "WITH THE STREET, THE AIR AND THE OCEAN" } },
    { a: 13.3, b: 17.5, glsl: "earth", p: { ...EA, dist: [5.6, 5.2], spin: [[0, 0.7, "linear"], [0.8, 0.76, "ease-out"], [1.3, 0.77], [4.2, 0.77]], orb: 0.35 }, hud: { at: 0.8, cat: "THE PLANET STOPS", label: "EARTH'S SPIN", value: "0 km/h", sub: "THE GROUND FREEZES IN PLACE", vcol: "#FF6B5E" } },
    { a: 17.5, b: 23.6, glsl: "street", p: { ...ST, cam: [1.0, 1.4], fling: [[0, 0], [0.3, 0.05], [2.0, 0.3], [6.1, 0.5]], wind: [0.1, 0.4], shake: [[0, 0.8], [1.0, 0.2], [6.1, 0.15]] }, hud: { cat: "YOU DON'T", label: "STILL MOVING EAST AT", value: "1,280 km/h", sub: "FASTER THAN SOUND (1,235 km/h)" } },
    { a: 23.6, b: 27.7, glsl: "street", p: { ...ST, cam: [1.4, 1.6], fling: [0.5, 0.82], panx: [0, 1.4], wind: 0.4, shake: 0.15 }, hud: { cat: "IN THAT ONE SECOND", label: "YOU TRAVEL", value: "0 m", sub: "RELATIVE TO THE GROUND", counter: { at: 0.4, dur: 3.0, from: 0, to: 355, suffix: " m", easing: "ease-out" } } },
    { a: 27.7, b: 31.4, glsl: "street", p: { ...ST, cam: [1.6, 1.8], fling: 0.85, lean: [[0, 0], [0.8, 0.1], [3.7, 1.0]], tilt: [0.15, 0.9], wind: 0.4, shake: 0.25 }, hud: { cat: "BUILDINGS", label: "THEIR TOP FLOORS", value: "Keep moving", sub: "THE FOUNDATIONS STOPPED" } },
    { a: 31.4, b: 37.0, glsl: "street", p: { ...ST, cam: [1.8, 2.2], fling: [0.85, 1.0], lean: 1, tilt: [0.5, 0.2], wind: [0.5, 1.0], dust: [0.1, 0.7], shake: 0.35 }, hud: { cat: "THE AIR KEEPS MOVING", label: "WIND SPEED", value: "1,280 km/h", sub: "3× THE FASTEST GUST EVER RECORDED (408 km/h)" } },
    { a: 37.0, b: 39.9, glsl: "coast", p: { ...CO, cam: [0, 0.5], panx: [2.2, 2.6], surge: [0.05, 0.72], shake: [0.1, 0.6] }, hud: { cat: "THE OCEANS", label: "STILL FLOWING EAST AT", value: "1,280 km/h", sub: "SLAMMING INTO EVERY COASTLINE", dot: "#5CB8F0" } },
    { a: 39.9, b: 43.2, glsl: "earth", p: { ...EA, dist: [5.0, 5.6], spin: [[0, 0.77], [1.9, 0.77, "ease-in"], [3.3, 1.0]], orb: [0.35, 0.4] }, hud: { cat: "ONE SECOND LATER", label: "EARTH'S SPIN", value: "Back on", sub: "1,280 km/h EASTWARD AGAIN", dot: "#4FD1A5" } },
    { a: 43.2, b: 53.2, glsl: "street", p: { ...ST, cam: [2.2, 2.6], fling: 1, lean: 1, tilt: [0.3, 0.15], wind: [0.4, 0.0], dust: [0.5, 0.25], panx: [0.6, 0.2] }, hud: { cat: "THE TWIST", label: "DEBRIS SPEED VS THE GROUND", value: "0 km/h", sub: "MATCHED AGAIN · BUT THE DAMAGE IS DONE", dot: "#F2C14E" } },
  ],
  captions: [
    [3.6, 5.4, "It's a calm morning in a city."], [5.78, 7.8, "You can't feel it, but you're moving east"],
    [7.88, 10.3, "at almost 1,300 km/h,"], [10.42, 13.0, "along with the street, the air and the ocean."],
    [13.42, 14.95, "Then the planet stops."], [15.56, 17.4, "The ground freezes in place."], [17.62, 18.6, "You don't."],
    [18.74, 21.65, "Everything that isn't bolted down keeps flying east,"], [21.78, 23.55, "faster than the speed of sound."],
    [23.72, 27.6, "In that single second, you travel 350 metres."],
    [27.84, 29.45, "Buildings are anchored at the bottom,"], [29.52, 31.35, "but their top floors keep moving."],
    [31.5, 33.0, "The air keeps moving too:"], [33.14, 36.95, "a wind three times stronger than the fastest gust ever recorded."],
    [37.2, 39.85, "The oceans slam into every coastline."], [40.06, 43.1, "Then, one second later, the spin returns."],
    [43.3, 45.5, "Strangely, everything still flying east"], [45.58, 47.35, "now matches the ground again."],
    [47.48, 48.75, "But the damage is done."],
  ],
  flashes: [{ at: 14.1, dur: 0.45 }, { at: 41.86, dur: 0.35 }],
  endCard: { at: 48.85, title: "What if Earth stopped spinning for 1 second?", small: ["SIMPLIFIED PHYSICS · FOR FUN", "SPEEDS FOR A CITY AT 40° LATITUDE"] },
};
