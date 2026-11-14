// Volcanic winter: sulfur haze dims the sun over a snowy Yellowstone; thermometer plaque drops "a few degrees".
// p: zoom, cy, haze (0..1), drop (0..1 thermometer), snow (0..1 snowfall), labk, sid
const z = p.zoom || 1, cy = p.cy || 960, hz = p.haze || 0, dr = p.drop || 0;
const bg = cached("coolBg", 1400, 2300, (g) => {
  g.translate(160, 190);
  bokashi(g, -400, 1100, [[0, "#3E4A5E"], [0.5, "#7C8794"], [0.85, "#B9BEC0"], [1, "#D9D6CC"]]);
});
const land = cached("coolLand", 1400, 2300, (g) => {
  g.translate(160, 190);
  snowRidge(g, 900, 300, 2.2, "#A9BCCB", 0.9);
  snowRidge(g, 1020, 170, 5.4, "#8FA6B8", 1.3);
  g.fillStyle = K.snow; g.fillRect(-160, 1060, 1400, 1300); g.strokeStyle = K.ink; g.lineWidth = 3; g.beginPath(); g.moveTo(-160, 1060); g.quadraticCurveTo(540, 1030, 1240, 1065); g.stroke();
  pineBand(g, 1075, 40, 70, 130, 12, "#24392F", "#33503F", -160, 1240, 1);
  g.strokeStyle = "rgba(120,140,160,0.5)"; g.lineWidth = 2; for (let i = 0; i < 120; i++) { const x = rnd(i * 3.3) * 1400 - 160, y = 1200 + rnd(i * 5.5) * 900; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 30, y - 6, x + 60, y); g.stroke(); }
  [[-60, 2150, 1150], [1080, 2150, 1100], [990, 2200, 760]].forEach(([x, yb, h]) => lpine(g, x, yb, h, "#1A3027", "#25463A", 1));
});
ctx.save(); cam(540, cy, z, 0);
ctx.drawImage(bg, -160, -190);
// sun, dimming behind haze
const sx = 640, sy = 420, sr = 120; ctx.save(); ctx.globalAlpha = 1 - 0.65 * hz;
const rg = ctx.createRadialGradient(sx, sy, sr * 0.8, sx, sy, sr * 3); rg.addColorStop(0, "rgba(255,226,170,0.55)"); rg.addColorStop(1, "rgba(255,226,170,0)"); ctx.fillStyle = rg; ctx.fillRect(sx - sr * 3, sy - sr * 3, sr * 6, sr * 6);
ctx.fillStyle = "#F2D79A"; ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(sx, sy, sr, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
// haze bands (sulfur aerosol veil): ochre-grey kasumi bars sliding in
for (let i = 0; i < 7; i++) { const k = cl(hz * 1.6 - i * 0.09); if (k <= 0) continue; const y = 180 + i * 95 + Math.sin(i * 2.3) * 20, w = 700 + rnd(i) * 400;
  const x = (i % 2 ? -w - 100 + k * (w * 0.9 + 200) : 1180 - k * (w * 0.9 + 300)) + Math.sin(t * 0.3 + i) * 20;
  band(ctx, x, y, w, 58 + rnd(i * 3) * 30, i % 2 ? "#BFB49A" : "#A9A291", 0.75 * k); }
ctx.save(); ctx.globalAlpha = 0.45 * hz; ctx.fillStyle = "#6F6A60"; ctx.fillRect(-300, -300, 1700, 1400); ctx.restore();
ctx.drawImage(land, -160, -190);
bison(ctx, 360, 1640, 1.6, 1, 0.5, 1); bison(ctx, 700, 1560, 1.1, -1, 2.1, 1);
// snowfall
const sn = p.snow ?? hz; ctx.fillStyle = "rgba(250,248,240,0.9)"; for (let i = 0; i < Math.floor(200 * sn); i++) { const x = (rnd(i * 2.7) * 1300 + Math.sin(t + i) * 30 + t * 20) % 1300 - 110, y = (rnd(i * 5.1) * 2200 + t * 90 * (0.6 + rnd(i))) % 2200 - 140; ctx.beginPath(); ctx.arc(x, y, 2 + rnd(i * 3) * 3, 0, TAU); ctx.fill(); }
ctx.restore();
// thermometer plaque (left), mercury falls
if (!isHook()) { const k = cl((p.labk || 0) * 1.5); if (k > 0) { ctx.save(); ctx.globalAlpha = cl(k * 2); const x = 150, y0 = 330, h = 700;
  ctx.fillStyle = "rgba(27,34,51,0.35)"; ctx.fillRect(x - 70 + 7, y0 - 40 + 8, 140, h + 80); ctx.fillStyle = K.cream; ctx.fillRect(x - 70, y0 - 40, 140, h + 80); ctx.strokeStyle = K.ink; ctx.lineWidth = 4; ctx.strokeRect(x - 68, y0 - 38, 136, h + 76); ctx.lineWidth = 1.5; ctx.strokeRect(x - 60, y0 - 30, 120, h + 60);
  ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - 16, y0, 32, h - 60, 16); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y0 + h - 40, 34, 0, TAU); ctx.fill(); ctx.stroke();
  const lev = lerp(0.72, 0.38, eout(dr)); const col = dr > 0.5 ? "#2D6F95" : K.red; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y0 + h - 40, 26, 0, TAU); ctx.fill(); ctx.fillRect(x - 9, y0 + (h - 60) * (1 - lev), 18, (h - 60) * lev + 10);
  ctx.strokeStyle = K.ink; ctx.lineWidth = 2; for (let i = 0; i <= 10; i++) { const y = y0 + 30 + i * (h - 120) / 10; ctx.beginPath(); ctx.moveTo(x + 18, y); ctx.lineTo(x + (i % 5 ? 30 : 42), y); ctx.stroke(); }
  ctx.restore(); } }
plaque(ctx, 620, 130, [{ t: "VOLCANIC WINTER", s: 56, sp: 4 }, { t: "A FEW °C COLDER", s: 66, c: K.red }, { t: "FOR SEVERAL YEARS · ESTIMATES VARY", s: 22, sp: 4 }], p.labk || 0);
finish(ctx);
