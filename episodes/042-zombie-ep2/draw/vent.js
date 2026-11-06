// the street seen through the attic vent: sirens, shuffling silhouettes. p: zoom, n, siren, peek 0..1 (slats open a bit)
cam(W / 2, 960, p.zoom || 1, p.shake || 0);
const VX = 110, VY = 470, VW = 860, VH = 860;
// --- outside (clipped to the vent opening)
ctx.save(); ctx.beginPath(); ctx.rect(VX, VY, VW, VH); ctx.clip();
ctx.translate(0, -560);
sky(PAL.navy0, "#2A2466", 0.35); stars(80, 1000, 13);
skyline(1250, 0, 6, 0.9, "#232A70");
skyline(1330, 0.15, 9, 1.05, PAL.bld1);
ground(1330, "#1B2153", "#232A66"); road(1400, 170);
lamp(160, 1400, 380, 0); lamp(860, 1400, 380, 0);
car(760, 1560, 0.6, "#F2F0FA", 1); rr(700, 1440, 54, 16, 6, Math.sin(t * 10) > 0 ? "#FF3B4E" : "#4C7BFF");
siren(720, 1430, p.siren ?? 1);
const n = Math.round(p.n || 4);
for (let i = 0; i < n; i++) { const x = 60 + ((i * 233 + lt * (36 + i * 7)) % 980); silhouette(x, 1640 + (i % 3) * 45, 0.72 + (i % 2) * 0.12, "rgba(8,10,30,0.96)", i * 1.9); }
ctx.restore();
// --- attic wall around the vent
ctx.fillStyle = "#14173E"; ctx.beginPath(); ctx.rect(-W, -H, W * 3, H * 3); ctx.rect(VX, VY, VW, VH); ctx.fill("evenodd");
for (let i = -3; i < 10; i++) rr(i * 140, -200, 10, 2400, 3, "rgba(255,255,255,0.03)");
rr(VX - 30, VY - 30, VW + 60, 30, 8, "#2A2F78"); rr(VX - 30, VY + VH, VW + 60, 30, 8, "#2A2F78"); rr(VX - 30, VY - 30, 30, VH + 60, 8, "#2A2F78"); rr(VX + VW, VY - 30, 30, VH + 60, 8, "#2A2F78");
// louvres (slats), with siren light on their edges
const pk = p.peek ?? 0.8, slat = 172, th = 64 - 30 * pk;
const on = Math.sin(t * 9) > 0;
for (let y = VY; y < VY + VH; y += slat) {
  rr(VX, y, VW, th, 4, "#23286A"); rr(VX, y + th - 8, VW, 8, 3, on ? "rgba(255,59,78,0.65)" : "rgba(70,120,255,0.65)");
}
// warm glow spilling into the attic
const r = ctx.createRadialGradient(540, 900, 100, 540, 900, 900); const c = on ? "255,59,78" : "70,120,255"; r.addColorStop(0, `rgba(${c},0.12)`); r.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = r; ctx.fillRect(-W, -H, W * 3, H * 3);
// your fingers gripping the sides of the frame
circ(VX - 22, 820, 30, PAL.skin); circ(VX - 22, 876, 30, PAL.skin); circ(VX + VW + 22, 840, 30, PAL.skin); circ(VX + VW + 22, 896, 30, PAL.skin);
