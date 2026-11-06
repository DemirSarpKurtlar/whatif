// Utility poles in wet ash: insulators arc, the houses go dark. p: zoom, cy, rain, ash, spark (0..1 arc flash), dark (0 lights on → 1 out), cover, labk, sid
const z = p.zoom || 1, cy = p.cy || 960, dk = p.dark || 0, sp = p.spark || 0, cov = p.cover || 0, GY = 1180;
const bg = cached("powerBg", 1300, 2200, (g) => {
  g.translate(110, 140);
  bokashi(g, -140, GY, [[0, "#2B2B30"], [0.5, "#55524F"], [1, "#8E877C"]]);
  ridge(g, GY - 120, 40, 5.5, "#6E6C6A", "rgba(27,34,51,0.4)", 0, 0.7);
  g.fillStyle = "#8D877C"; g.fillRect(-110, GY, 1300, 1100);
  g.strokeStyle = K.ink; g.lineWidth = 3; g.beginPath(); g.moveTo(-110, GY); g.lineTo(1190, GY); g.stroke();
  // road edge lines
  g.strokeStyle = "rgba(240,234,220,0.5)"; g.lineWidth = 6; g.setLineDash([60, 40]); g.beginPath(); g.moveTo(-110, 1720); g.lineTo(1190, 1720); g.stroke(); g.setLineDash([]);
});
ctx.save(); cam(540, cy, z, p.shake || 0);
ctx.drawImage(bg, -110, -140);
// houses (two-storey, tiled roofs) with lit windows
const HS = [[-60, 300, 260], [270, 260, 300], [560, 300, 250], [890, 280, 290]];
HS.forEach(([x, w, h], i) => { const y = GY - h;
  ctx.fillStyle = i % 2 ? "#CFC6B2" : K.cream2; ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.fillRect(x, y, w, h); ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = K.roof; ctx.beginPath(); ctx.moveTo(x - 24, y + 4); ctx.lineTo(x + 30, y - 70); ctx.lineTo(x + w - 30, y - 70); ctx.lineTo(x + w + 24, y + 4); ctx.closePath(); ctx.fill(); ctx.stroke();
  if (cov > 0) { ctx.fillStyle = K.ashL; ctx.beginPath(); ctx.moveTo(x + 22, y - 62); ctx.lineTo(x + w - 22, y - 62); ctx.lineTo(x + w - 30, y - 70 - 9 * cov); ctx.lineTo(x + 30, y - 70 - 9 * cov); ctx.closePath(); ctx.fill(); }
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) { const wx = x + 40 + c * (w - 140), wy = y + 40 + r * (h / 2); const off = dk > rnd(i * 4 + r * 2 + c) * 0.8 + 0.1;
    ctx.fillStyle = off ? "#2E3442" : "#FFD27A"; ctx.fillRect(wx, wy, 60, 70); ctx.strokeRect(wx, wy, 60, 70); ctx.beginPath(); ctx.moveTo(wx + 30, wy); ctx.lineTo(wx + 30, wy + 70); ctx.stroke();
    if (!off) { const rg = ctx.createRadialGradient(wx + 30, wy + 35, 0, wx + 30, wy + 35, 90); rg.addColorStop(0, "rgba(255,210,120,0.35)"); rg.addColorStop(1, "rgba(255,210,120,0)"); ctx.fillStyle = rg; ctx.fillRect(wx - 60, wy - 55, 180, 180); } } });
// poles + wires (wires sag, sway slightly)
const PX = [150, 650, 1150], top = GY - 640;
const sway = Math.sin(t * 1.4) * 4;
ctx.strokeStyle = K.ink; ctx.lineWidth = 3;
for (let wv = 0; wv < 3; wv++) { const yy = top + 30 + wv * 40; ctx.beginPath(); ctx.moveTo(-200, yy + 30); PX.forEach((x) => ctx.quadraticCurveTo(x - 250, yy + 80 + sway, x, yy)); ctx.stroke(); }
PX.forEach((x, i) => { ctx.fillStyle = "#5C5650"; ctx.fillRect(x - 13, top, 26, GY - top); ctx.strokeRect(x - 13, top, 26, GY - top);
  ctx.fillRect(x - 110, top + 20, 220, 14); ctx.fillRect(x - 90, top + 60, 180, 12); ctx.fillStyle = "#4D4A46"; ctx.fillRect(x + 18, top + 180, 70, 90); ctx.strokeRect(x + 18, top + 180, 70, 90);
  for (const ix of [-90, -30, 30, 90]) { ctx.fillStyle = "#E8E3D8"; ctx.beginPath(); ctx.ellipse(x + ix, top + 14, 9, 13, 0, 0, TAU); ctx.fill(); ctx.stroke(); }
  if (cov > 0) { ctx.fillStyle = K.ashL; ctx.fillRect(x - 112, top + 14 - 5 * cov, 224, 6 * cov); } });
// arc flash at the middle pole's insulators
if (sp > 0) { const x = 650 + 30, y = top + 14; const fl = sp * (0.6 + 0.4 * Math.abs(Math.sin(t * 40)));
  const rg = ctx.createRadialGradient(x, y, 0, x, y, 260 * fl); rg.addColorStop(0, `rgba(200,230,255,${0.9 * fl})`); rg.addColorStop(0.3, `rgba(120,170,255,${0.4 * fl})`); rg.addColorStop(1, "rgba(120,170,255,0)"); ctx.fillStyle = rg; ctx.fillRect(x - 300, y - 300, 600, 600);
  ctx.strokeStyle = `rgba(240,248,255,${fl})`; ctx.lineWidth = 4; for (let b = 0; b < 4; b++) { ctx.beginPath(); ctx.moveTo(x, y); let bx = x, by = y; for (let s = 0; s < 6; s++) { bx += (rnd(b * 9 + s + Math.floor(t * 20)) - 0.5) * 60; by += 12 + rnd(b + s * 3) * 20; ctx.lineTo(bx, by); } ctx.stroke(); }
  for (let i = 0; i < 16; i++) { const ph = (t * 2 + rnd(i)) % 1; ctx.fillStyle = `rgba(255,220,120,${(1 - ph) * fl})`; ctx.fillRect(x + (rnd(i * 3) - 0.5) * 200 * ph, y + ph * ph * 400, 5, 5); } }
// ground ash
if (cov > 0) { ctx.fillStyle = "#A9A293"; ctx.fillRect(-300, GY - 4 * cov, W + 600, 4 * cov + 2); }
ashFall(ctx, p.ash || 0, -200, -200, 1500, 2400, 13, 140, "rgba(60,56,50,0.75)");
rain(ctx, p.rain || 0);
ctx.restore();
plaque(ctx, 540, 140, [{ t: "3 mm", s: 120, c: K.red }, { t: "OF WET ASH · POWER CUTS", s: 30, sp: 6 }], p.labk || 0);
finish(ctx);
