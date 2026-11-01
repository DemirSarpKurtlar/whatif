// Episode 007 — What if Earth had rings like Saturn?
const RE = { dist: 7.5, orb: 0.6, elev: 0.32, tx: 0, ty: 0, spin: 0, sunaz: 0.9, sundec: 0.35, ring: 1, debris: 0, shadowhi: 0 };
const SK = { cam: 0, yaw: 0, pitch: 0.3, lens: 0.85, night: 0, sun: 0, sunaz: 2.6, sunel: 0.5, moon: 0, jup: 0, frost: 0, ring: 1, lat: 40.7, hour: 0, dec: 0.2, rshadow: 0 };
export default {
  END: 54.6,
  title: { text: "What if Earth had rings like Saturn?", end: 2.75 },
  scenes: [
    { a: 0, b: 2.8, glsl: "ringearth", p: { ...RE, dist: [8.5, 7.8], orb: [0.4, 0.55], spin: [0, 0.2] } },
    { a: 2.8, b: 7.95, glsl: "ringearth", p: { ...RE, dist: [7.8, 5.6], orb: [0.55, 0.8], elev: [0.32, 0.22], spin: [0.2, 0.5], tx: [0, 0.5] }, hud: { cat: "SCALED DOWN FROM SATURN", label: "THE RINGS START", value: "1,500 km up", sub: "INNER EDGE · 1.24 EARTH RADII", dot: "#F2C14E" } },
    { a: 7.95, b: 11.55, glsl: "ringearth", p: { ...RE, dist: [5.6, 6.4], orb: [0.8, 1.0], elev: [0.22, 0.18], spin: [0.5, 0.7], tx: [0.5, 0.9] }, hud: { cat: "SCALED DOWN FROM SATURN", label: "AND END", value: "8,000 km up", sub: "OUTER EDGE · 2.27 EARTH RADII", dot: "#F2C14E" } },
    { a: 11.55, b: 14.35, glsl: "ringearth", p: { ...RE, dist: [6.4, 6.0], orb: [1.0, 1.15], elev: [0.12, 0.004], spin: [0.7, 0.85] }, hud: { cat: "YET", label: "THICKNESS", value: "~10 m", sub: "ABOUT A THREE-STOREY HOUSE" } },
    { a: 14.35, b: 19.85, glsl: "skyscape", p: { ...SK, lat: 0.0, cam: [0, 0.6], pitch: [0.35, 0.75], yaw: [1.5708, 1.5708], lens: 0.55, sun: 0 }, hud: { cat: "FROM THE EQUATOR", label: "LATITUDE", value: "0°", sub: "A RAZOR-THIN LINE STRAIGHT OVERHEAD" } },
    { a: 19.85, b: 25.45, glsl: "skyscape", p: { ...SK, lat: [[0, 1.0], [0.8, 1.0], [4.8, 21.0]], cam: [0.6, 1.3], pitch: [0.75, 0.6], yaw: [0.0, 0.05], lens: 0.5 }, hud: { cat: "TRAVEL NORTH", label: "THE LINE OPENS INTO", value: "A glowing arch", sub: "ACROSS THE SOUTHERN SKY", dot: "#F2C14E" } },
    { a: 25.45, b: 29.5, glsl: "skyscape", p: { ...SK, lat: 40.7, cam: [1.3, 2.0], pitch: [0.3, 0.26], yaw: [-0.15, 0.1], lens: 0.5 }, hud: { cat: "FROM NEW YORK", label: "THE ARCH RISES", value: "26°", sub: "ABOVE THE SOUTHERN HORIZON" } },
    { a: 29.5, b: 36.1, glsl: "skyscape", p: { ...SK, lat: [[0, 41.0], [3.6, 66.0]], cam: [2.0, 2.8], pitch: [0.26, 0.14], yaw: [0.1, 0.0], lens: 0.5, frost: [0.2, 0.9] }, hud: { at: 1.4, cat: "PAST 64° NORTH", label: "YOU SEE THE RINGS", value: "Never", sub: "THEY SINK BELOW THE HORIZON", vcol: "#FF6B5E", dot: "#5CB8F0" } },
    { a: 36.1, b: 40.85, glsl: "skyscape", p: { ...SK, lat: 30, night: 1, hour: 3.1416, dec: 0.25, cam: [2.8, 3.4], pitch: [0.42, 0.38], yaw: [-1.1, -0.75], lens: 0.5 }, hud: { cat: "AT MIDNIGHT", label: "THE SKY GLOWS LIKE", value: "Dusk", sub: "SUNLIGHT BOUNCING OFF THE RINGS", dot: "#F2C14E" } },
    { a: 40.85, b: 46.15, glsl: "ringearth", p: { ...RE, sundec: -0.41, sunaz: [0.3, 0.45], dist: [5.2, 4.6], orb: [0.1, 0.35], elev: [0.55, 0.6], ty: 0.15, spin: [1.0, 1.3], shadowhi: 1 }, hud: { cat: "IN WINTER", label: "THE RING SHADOW COVERS", value: "Your hemisphere", sub: "MAKING WINTERS EVEN COLDER", dot: "#5CB8F0" } },
    { a: 46.15, b: 54.6, glsl: "ringearth", p: { ...RE, dist: [5.4, 4.8], orb: [1.6, 1.8], elev: [0.2, 0.16], ty: 0.45, tx: [1.0, 1.3], spin: [1.3, 1.4], debris: [[0, 0.3], [2.5, 1.0]] }, hud: { cat: "ANY SATELLITE INSIDE THEM", label: "BETWEEN 1,500 AND 8,000 KM UP", value: "Shredded", sub: "RING PARTICLES HIT AT KM/S SPEEDS", vcol: "#FF6B5E" } },
  ],
  captions: [
    [2.88, 5.5, "Scale Saturn's rings down to our planet,"], [5.58, 7.9, "and they'd start 1,500 km up"],
    [8.06, 11.2, "and end 8,000 km above your head."], [11.68, 13.9, "Yet they'd be only about 10 metres thick."],
    [14.46, 16.9, "From the equator, you'd barely see them."], [17.04, 19.4, "Just a razor-thin line, straight overhead."],
    [19.96, 21.0, "Travel north,"], [21.0, 25.0, "and that line opens into a giant glowing arch across the southern sky."],
    [25.56, 29.3, "From New York, it rises 26 degrees above the horizon."], [29.6, 31.9, "But go past 64 degrees north,"],
    [31.98, 34.0, "and the rings sink below the horizon."], [34.4, 35.9, "You would never see them at all."],
    [36.24, 38.6, "At night, they keep reflecting sunlight,"], [38.74, 40.6, "so midnight glows like dusk."],
    [40.92, 43.9, "In winter, their shadow falls across your half of the planet,"], [44.24, 46.0, "making winters even colder."],
    [46.28, 48.4, "And any satellite orbiting inside them?"], [48.68, 49.4, "Shredded."],
  ],
  flashes: [{ at: 48.68, dur: 0.25, color: "#FFB27A" }],
  endCard: { at: 49.45, title: "What if Earth had rings like Saturn?", small: ["SATURN'S RINGS SCALED TO EARTH", "SIMPLIFIED · FOR FUN"], cta: "WHERE WOULD YOU LIVE TO SEE THEM?" },
};
