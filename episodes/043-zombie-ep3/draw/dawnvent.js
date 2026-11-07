// EP3 (adapted from EP2 vent.js): the street at sunrise through the attic vent. More of them now, but slow in the cold.
// p: zoom, cy, n (zombies), sun 0..1 (sun rising), peek 0..1 (slats open), cold 0..1 (breath puffs + frost), slow 0..1
cam(W / 2, p.cy || 960, p.zoom || 1, p.shake || 0);
const VX = 110, VY = 470, VW = 860, VH = 860, sun = cl(p.sun ?? 1), cold = cl(p.cold ?? 1);
ctx.save(); ctx.beginPath(); ctx.rect(VX, VY, VW, VH); ctx.clip();
ctx.translate(0, -560);
{ const g = ctx.createLinearGradient(0, 300, 0, 1400); g.addColorStop(0, "#4A3F9A"); g.addColorStop(0.45, "#B9638F"); g.addColorStop(0.8, "#FF9A62"); g.addColorStop(1, "#FFC98B"); ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3); }
// the sun rising behind the skyline
const sy = 1330 - 140 * E["ease-out"](sun);
const sg = ctx.createRadialGradient(560, sy, 40, 560, sy, 520); sg.addColorStop(0, "rgba(255,226,150,0.85)"); sg.addColorStop(1, "rgba(255,180,100,0)"); ctx.fillStyle = sg; ctx.fillRect(-W, 0, W * 3, 2000);
circ(560, sy, 120, "#FFE3A0");
skyline(1250, 0, 6, 0.9, "#6B4E93");
skyline(1330, 0, 9, 1.05, "#4D3F86");
ground(1330, "#3D3B7E", "#4C4A93"); road(1400, 170);
lamp(160, 1400, 380, 0); lamp(860, 1400, 380, 0);
// the abandoned police car from last night, lights off now
car(760, 1560, 0.6, "#F2F0FA", 0); rr(700, 1440, 54, 16, 6, "#5B5F8F");
// morning mist low on the street
for (let i = 0; i < 5; i++) { const x = ((i * 300 + lt * 12) % 1500) - 200; ctx.fillStyle = `rgba(255,236,220,${0.12 * cold})`; ctx.beginPath(); ctx.ellipse(x, 1540 + (i % 2) * 40, 320, 50, 0, 0, TAU); ctx.fill(); }
// zombies, slow and stiff in the cold (daylight: you can see them now)
const n = Math.round(p.n || 8), slow = cl(p.slow ?? 1);
for (let i = 0; i < n; i++) {
  const sc = 0.34 + (i % 3) * 0.07, yb = 1500 + (i % 3) * 70;
  const x = -60 + ((i * 167 + rnd(i) * 120 + lt * (14 + i * 2) * (1 - 0.6 * slow)) % 1180);
  zombie(x, yb, sc, { flip: i % 2 === 1, speed: 2.6 * (1 - 0.65 * slow), phase: i * 1.7, skin: i % 2 ? "#8DB967" : PAL.zskin, cloth: i % 3 ? PAL.zcloth : "#6A4E66" });
  // breath puff from the mouth, drifting up
  if (cold > 0) for (let j = 0; j < 2; j++) { const k = ((lt * 0.5 + j * 0.5 + rnd(i * 4)) % 1); const fx = i % 2 ? -1 : 1;
    circ(x + fx * (45 + 50 * k) * sc / 0.4, yb - 330 * sc - 50 * k, (14 + 26 * k) * sc / 0.4, `rgba(255,255,255,${0.45 * (1 - k) * cold})`); }
}
ctx.restore();
// attic wall around the vent
ctx.fillStyle = "#1C1E4E"; ctx.beginPath(); ctx.rect(-W, -H, W * 3, H * 3); ctx.rect(VX, VY, VW, VH); ctx.fill("evenodd");
for (let i = -3; i < 10; i++) rr(i * 140, -200, 10, 2400, 3, "rgba(255,255,255,0.03)");
rr(VX - 30, VY - 30, VW + 60, 30, 8, "#2A2F78"); rr(VX - 30, VY + VH, VW + 60, 30, 8, "#2A2F78"); rr(VX - 30, VY - 30, 30, VH + 60, 8, "#2A2F78"); rr(VX + VW, VY - 30, 30, VH + 60, 8, "#2A2F78");
// louvres, warm light on their edges, frost on the top edges
const pk = p.peek ?? 0.8, slat = 172, th = 64 - 30 * pk;
for (let y = VY; y < VY + VH; y += slat) {
  rr(VX, y, VW, th, 4, "#23286A"); rr(VX, y + th - 8, VW, 8, 3, "rgba(255,184,107,0.8)");
  if (cold > 0) for (let i = 0; i < 18; i++) circ(VX + 20 + i * 48 + rnd(i + y) * 20, y + 4, 5 + rnd(i * 2 + y) * 5, `rgba(225,240,255,${0.7 * cold})`);
}
// warm glow spilling into the attic
const r = ctx.createRadialGradient(540, 900, 100, 540, 900, 900); r.addColorStop(0, "rgba(255,170,90,0.16)"); r.addColorStop(1, "rgba(255,170,90,0)"); ctx.fillStyle = r; ctx.fillRect(-W, -H, W * 3, H * 3);
circ(VX - 22, 820, 30, PAL.skin); circ(VX - 22, 876, 30, PAL.skin); circ(VX + VW + 22, 840, 30, PAL.skin); circ(VX + VW + 22, 896, 30, PAL.skin);
