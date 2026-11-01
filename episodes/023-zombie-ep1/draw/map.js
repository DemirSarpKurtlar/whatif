// top-down town map; green infection spreads from the hospital. p: spread 0..1, zoom
cam(W / 2, H / 2, p.zoom || 1);
rr(-W, -H, W * 3, H * 3, 0, "#1A2058");
for (let gx = -2; gx < 9; gx++) for (let gy = -2; gy < 14; gy++) {
  const x = gx * 150 + 40, y = gy * 150 + 120, k = rnd(gx * 17 + gy * 5);
  rr(x, y, 118, 118, 10, k < 0.18 ? "#1F6E62" : k < 0.6 ? "#2F3790" : "#3A43A4");
  if (k >= 0.18) for (let i = 0; i < 4; i++) rr(x + 14 + (i % 2) * 52, y + 14 + Math.floor(i / 2) * 52, 38, 38, 5, rnd(k * 99 + i) < 0.5 ? "#454FB8" : "#2A3285");
}
const hx = 520, hy = 900; rr(hx - 50, hy - 50, 100, 100, 18, "#FFFFFF"); rr(hx - 12, hy - 36, 24, 72, 4, PAL.red); rr(hx - 36, hy - 12, 72, 24, 4, PAL.red);
const R = 30 + 1500 * E["ease-in"](p.spread || 0);
const g = ctx.createRadialGradient(hx, hy, R * 0.5, hx, hy, R); g.addColorStop(0, "rgba(147,196,108,0.62)"); g.addColorStop(0.85, "rgba(147,196,108,0.5)"); g.addColorStop(1, "rgba(147,196,108,0)");
ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, hy, R, 0, TAU); ctx.fill();
for (let i = 0; i < 260; i++) { const a = rnd(i) * TAU, d = Math.sqrt(rnd(i + 5)) * R * 0.95; if (d < 20) continue; circ(hx + Math.cos(a) * d, hy + Math.sin(a) * d, 5, "#C9F29A"); }
