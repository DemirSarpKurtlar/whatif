// Episode 004 — What if the Sun vanished right now?
const SK = { cam: 0, yaw: 0, pitch: 0.12, lens: 1.1, night: 0, sun: 1, sunaz: 0.55, sunel: 0.28, moon: 0.6, jup: 0, frost: 0, ring: 0, lat: 40.7, hour: 0, dec: 0, rshadow: 0 };
const SP = { dist: 3.0, orb: 2.0, elev: 0.6, tx: 0.35, tz: 0.45, drift: 0, front: 0, frontA: 0, sun: 1, lit: 1, orbit: 1, ice: 0 };
const OC = { cam: 0, camy: 0, pitch: 0, ice: 0, under: 0 };
const VT = { cam: 0, glow: 1, bio: 1 };
export default {
  END: 55.8,
  title: { text: "What if the Sun vanished right now?", end: 2.9 },
  elapsed: { start: 3.18, end: 22.45, label: "SINCE IT VANISHED", unit: " min", dec: 1, note: "", points: [[3.18, 0], [13.6, 8.33], [17.4, 8.36], [22.4, 48.3]] },
  scenes: [
    { a: 0, b: 3.1, glsl: "skyscape", p: { ...SK, cam: [0, 0.5], pitch: [0.3, 0.26], yaw: [0.45, 0.52] } },
    { a: 3.1, b: 6.85, glsl: "space", p: { ...SP, dist: [5.2, 4.8], tx: 0.3, tz: 0.38, orb: [2.1, 2.3], front: [0, 1.0], frontA: 1 }, hud: { cat: "THE SUN IS GONE", label: "NEWS REACHES EARTH IN", value: "8 min 20 s", sub: "LIGHT TAKES THAT LONG TO ARRIVE", dot: "#F2C14E" } },
    { a: 6.85, b: 13.05, glsl: "skyscape", p: { ...SK, cam: [0.5, 1.4], yaw: [0.35, 0.5], pitch: [0.18, 0.3] }, hud: { cat: "NOTHING HAPPENS YET", label: "LAST SUNLIGHT STILL CROSSING", value: "150 million km", sub: "GRAVITY ALSO TRAVELS AT LIGHT SPEED", dot: "#F2C14E" } },
    { a: 13.05, b: 15.4, glsl: "skyscape", p: { ...SK, cam: [1.4, 1.7], yaw: 0.5, pitch: 0.3, night: [[0, 0], [0.55, 0, "ease-in"], [0.85, 1]], sun: [[0, 1], [0.55, 1, "linear"], [0.6, 0]], moon: [[0, 0.6], [0.55, 0.6], [0.85, 1]] }, hud: { at: 0.6, cat: "8 MIN 20 S LATER", label: "SUNLIGHT", value: "0%", sub: "THE SKY SWITCHES OFF", vcol: "#FF6B5E" } },
    { a: 15.4, b: 17.5, glsl: "skyscape", p: { ...SK, cam: [1.7, 1.9], yaw: [-0.3, -0.33], pitch: [0.38, 0.4], lens: 1.8, night: 1, sun: 0, moon: [[0, 1], [0.9, 1, "linear"], [1.0, 0]] }, hud: { cat: "THE MOON", label: "GOES DARK", value: "+1.3 s", sub: "IT ONLY REFLECTS SUNLIGHT" } },
    { a: 17.5, b: 22.9, glsl: "skyscape", p: { ...SK, cam: [1.9, 2.4], yaw: [0.35, 0.4], pitch: [0.45, 0.5], lens: [1.6, 2.4], night: 1, sun: 0, moon: 0, jup: 1 }, hud: { cat: "BUT JUPITER", label: "STILL SHINING FOR", value: "~40 min", sub: "LIT BY LIGHT ALREADY ON ITS WAY", dot: "#F2C14E" } },
    { a: 22.9, b: 28.75, glsl: "space", p: { ...SP, sun: 0, lit: 0.15, orb: [2.3, 2.5], tx: [0.4, 0.5], tz: [0.6, 0.8], drift: [0, 0.45] }, hud: { cat: "NOTHING TO ORBIT", label: "EARTH FLIES OFF AT", value: "30 km/s", sub: "IN A PERFECTLY STRAIGHT LINE" } },
    { a: 28.75, b: 32.15, glsl: "space", p: { ...SP, sun: 0, lit: 0.12, dist: [3.2, 4.4], orb: [2.5, 2.7], tx: [0.5, 0.3], tz: [0.8, 1.2], drift: [0.45, 1.3] }, hud: { cat: "EVERY DAY", label: "DISTANCE TRAVELLED", value: "0 km", sub: "INTO THE DARK", counter: { at: 0.2, dur: 2.6, from: 0, to: 2592000, suffix: " km", easing: "ease-out" } } },
    { a: 32.15, b: 35.3, glsl: "skyscape", p: { ...SK, cam: [2.4, 2.9], yaw: [-0.1, 0.05], pitch: [0.05, 0.12], night: 1, sun: 0, moon: 0, jup: 0, frost: [0.1, 0.6] }, hud: { cat: "ONE WEEK LATER", label: "AVERAGE SURFACE TEMPERATURE", value: "Below 0 °C", sub: "THE WHOLE PLANET", dot: "#5CB8F0", vcol: "#BFE3FF" } },
    { a: 35.3, b: 38.45, glsl: "skyscape", p: { ...SK, cam: [3.0, 3.5], yaw: [0.6, 0.45], pitch: [0.0, 0.08], night: 1, sun: 0, moon: 0, frost: 1 }, hud: { cat: "ONE YEAR LATER", label: "AVERAGE SURFACE TEMPERATURE", value: "−73 °C", sub: "COLDER THAN ANTARCTIC WINTER", dot: "#5CB8F0", vcol: "#BFE3FF" } },
    { a: 38.45, b: 42.4, glsl: "ocean", p: { ...OC, cam: [0, 1], camy: [0.5, 0.0], ice: [[0, 0.0], [3.9, 0.9]] }, hud: { cat: "THE OCEANS", label: "THE SURFACE", value: "Freezes over", sub: "THE ICE INSULATES THE WATER BELOW", dot: "#5CB8F0" } },
    { a: 42.4, b: 44.9, glsl: "ocean", p: { ...OC, under: 1, cam: [0, 1.2] }, hud: { cat: "DEEP DOWN", label: "UNDER THE ICE", value: "Still liquid", sub: "FOR HUNDREDS OF THOUSANDS OF YEARS", dot: "#5CB8F0" } },
    { a: 44.9, b: 55.8, glsl: "vent", p: { ...VT, cam: [0, 1], glow: [[0, 0.3], [1.0, 1.0]] }, hud: { cat: "HYDROTHERMAL VENTS", label: "LIFE KEEPS GOING FOR", value: "Millions of years", sub: "POWERED BY EARTH'S OWN INNER HEAT", dot: "#FF9A3C" } },
  ],
  captions: [
    [3.18, 5.3, "For 8 minutes and 20 seconds,"], [5.4, 6.8, "nothing happens."],
    [6.92, 9.3, "The last sunlight is still on its way to you."], [9.42, 10.7, "And the Sun's gravity?"],
    [10.8, 12.9, "It travels at the speed of light too."], [13.08, 15.2, "Then the sky switches off."],
    [15.44, 17.4, "The Moon goes dark a second later."], [17.54, 20.4, "But Jupiter keeps shining for another 40 minutes,"],
    [20.6, 22.8, "lit by light that had already left."], [23.02, 24.5, "With nothing to orbit,"],
    [24.56, 26.5, "Earth flies off in a straight line,"], [26.6, 28.6, "at 30 kilometres every second."],
    [28.8, 31.9, "That's 2.5 million kilometres a day."], [32.24, 35.1, "Within a week, the whole planet drops below freezing."],
    [35.36, 38.3, "Within a year, minus 73 degrees."], [38.52, 40.2, "The oceans freeze over the top,"],
    [40.32, 42.3, "but that ice works like a blanket."], [42.5, 44.7, "Deep down, around volcanic vents,"],
    [44.84, 47.2, "life keeps going for millions of years,"], [47.32, 49.6, "without a single ray of sunlight."],
  ],
  flashes: [],
  endCard: { at: 49.75, title: "What if the Sun vanished right now?", small: ["SIMPLIFIED PHYSICS · FOR FUN", "THE SUN CAN'T ACTUALLY VANISH"], cta: "SURFACE OR SEA FLOOR?" },
};
