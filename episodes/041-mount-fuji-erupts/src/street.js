// Close-up: car wheel sinking in ash, depth gauge to 10 cm. p: zoom, cy, depth (0..1 → 0..10 cm), spin (wheel spin 0..1), ash, labk, sid
const z = p.zoom || 1, cy = p.cy || 960, dp = p.depth || 0, GY = 1180, PXCM = 7; // px per cm at wheel scale (wheel r 220 px ≈ 32 cm)
const bg = cached("streetBg", 1300, 2200, (g) => {
  g.translate(110, 140);
  bokashi(g, -140, GY, [[0, "#2F2E31"], [0.55, "#5E5A55"], [1, "#9B9488"]]);
  // shopfronts silhouette
  for (let i = 0; i < 9; i++) { const x = -100 + i * 150, h = 300 + rnd(i * 4) * 260; g.fillStyle = i % 2 ? "#6E6A66" : "#7A7570"; g.fillRect(x, GY - h, 140, h); g.strokeStyle = "rgba(27,34,51,0.6)"; g.lineWidth = 2; g.strokeRect(x, GY - h, 140, h);
    g.fillStyle = "rgba(255,214,140,0.25)"; g.fillRect(x + 20, GY - 120, 100, 80); g.fillStyle = K.red; g.fillRect(x + 10, GY - h + 30, 18, 90); }
  // cutaway soil
  g.fillStyle = "#6B5A45"; g.fillRect(-110, GY, 1300, 1000); g.fillStyle = "#54473A"; for (let i = 0; i < 60; i++) { g.beginPath(); g.ellipse(rnd(i) * 1300 - 110, GY + 60 + rnd(i * 3) * 900, 12 + rnd(i * 5) * 20, 6 + rnd(i * 7) * 8, 0, 0, TAU); g.fill(); }
  g.fillStyle = "#3E3D3F"; g.fillRect(-110, GY, 1300, 40); g.strokeStyle = K.ink; g.lineWidth = 3; g.strokeRect(-115, GY, 1310, 40);
});
ctx.save(); cam(540, cy, z, p.shake || 0);
ctx.drawImage(bg, -110, -140);
// car body (side, facing right), wheel centre (560, GY-220)
const wx = 560, wy = GY - 220, R = 220, ang = (p.spin || 0) * t * 14;
ctx.fillStyle = "#2D4F82"; ctx.strokeStyle = K.ink; ctx.lineWidth = 4;
ctx.beginPath(); ctx.moveTo(-300, GY - 120); ctx.lineTo(1000, GY - 120); ctx.quadraticCurveTo(1060, GY - 130, 1060, GY - 230); ctx.lineTo(1040, GY - 420); ctx.quadraticCurveTo(1000, GY - 470, 880, GY - 480); ctx.lineTo(560, GY - 500);
ctx.quadraticCurveTo(380, GY - 760, 140, GY - 780); ctx.lineTo(-300, GY - 790); ctx.closePath(); ctx.fill(); ctx.stroke();
ctx.fillStyle = "#9DB9D4"; ctx.beginPath(); ctx.moveTo(500, GY - 520); ctx.quadraticCurveTo(360, GY - 720, 160, GY - 740); ctx.lineTo(120, GY - 520); ctx.closePath(); ctx.fill(); ctx.stroke();
ctx.fillStyle = K.cream; ctx.fillRect(960, GY - 400, 70, 40); ctx.strokeRect(960, GY - 400, 70, 40);
ctx.strokeStyle = "rgba(240,234,220,0.5)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-300, GY - 420); ctx.lineTo(900, GY - 420); ctx.stroke();
// wheel arch
ctx.fillStyle = "#1B2233"; ctx.beginPath(); ctx.arc(wx, wy, R + 30, Math.PI, 0); ctx.lineTo(wx + R + 30, GY - 120); ctx.lineTo(wx - R - 30, GY - 120); ctx.closePath(); ctx.fill();
// tyre + rim (spinning)
ctx.fillStyle = "#26252A"; ctx.beginPath(); ctx.arc(wx, wy, R, 0, TAU); ctx.fill(); ctx.strokeStyle = K.ink; ctx.lineWidth = 4; ctx.stroke();
ctx.fillStyle = "#C9C2B0"; ctx.beginPath(); ctx.arc(wx, wy, R * 0.6, 0, TAU); ctx.fill(); ctx.stroke();
ctx.save(); ctx.translate(wx, wy); ctx.rotate(ang); ctx.fillStyle = "#8C887F"; for (let i = 0; i < 5; i++) { ctx.rotate(TAU / 5); ctx.beginPath(); ctx.moveTo(-14, 30); ctx.lineTo(-24, R * 0.55); ctx.lineTo(24, R * 0.55); ctx.lineTo(14, 30); ctx.closePath(); ctx.fill(); ctx.stroke(); }
ctx.fillStyle = K.ink; ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.fill(); ctx.restore();
// ash layer on the road
const ah = dp * 10 * PXCM; // true scale vs the ~32 cm tyre radius
ctx.fillStyle = K.ashL; ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-300, GY + 2);
for (let x = -300; x <= W + 300; x += 30) ctx.lineTo(x, GY - ah - Math.sin(x * 0.02) * 4 * dp - (Math.abs(x - wx) < R + 40 ? 10 * dp : 0)); ctx.lineTo(W + 300, GY + 2); ctx.closePath(); ctx.fill(); ctx.stroke();
// spray from the spinning wheel
if ((p.spin || 0) > 0.1) { for (let i = 0; i < 26; i++) { const ph = (t * 1.6 + rnd(i)) % 1; ctx.fillStyle = `rgba(185,178,163,${1 - ph})`; ctx.beginPath(); ctx.arc(wx - R * 0.7 - ph * 320 * (0.5 + rnd(i * 2)), GY - ah - 20 - Math.sin(ph * Math.PI) * 160 * rnd(i * 3), 6 + 10 * ph, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = "rgba(240,234,220,0.8)"; ctx.lineWidth = 4; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(wx, wy, R + 50 + k * 18, Math.PI * 0.95 + k * 0.1, Math.PI * 1.35 + k * 0.1); ctx.stroke(); } }
ashFall(ctx, p.ash || 0, -200, -200, 1500, 2400, 17, 130, "rgba(60,56,50,0.8)");
ctx.restore();
// depth gauge (diagram scale) right side
const gx = 945, g0 = 1090, g1 = 520, val = dp * 10;
ctx.fillStyle = K.cream; ctx.strokeStyle = K.ink; ctx.lineWidth = 4; ctx.fillRect(gx - 60, g1 - 50, 135, g0 - g1 + 90); ctx.strokeRect(gx - 60, g1 - 50, 135, g0 - g1 + 90);
ctx.fillStyle = "#8D877C"; const fy = lerp(g0, g1, dp); ctx.fillRect(gx - 46, fy, 36, g0 - fy);
ctx.fillStyle = K.ink; ctx.font = "36px LSerif"; ctx.textAlign = "left"; ctx.lineWidth = 2;
for (let c = 0; c <= 10; c++) { const y = lerp(g0, g1, c / 10); ctx.beginPath(); ctx.moveTo(gx - 6, y); ctx.lineTo(gx + (c % 5 ? 6 : 14), y); ctx.stroke(); if (c % 5 === 0) ctx.fillText(String(c), gx + 18, y + 9); }
ctx.font = "28px LSerif"; ctx.fillText("cm", gx - 46, g1 - 16);
ctx.strokeStyle = K.red; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(gx - 46, fy); ctx.lineTo(gx + 46, fy); ctx.stroke();
plaque(ctx, 470, 140, [{ t: (val >= 9.95 ? "10" : val.toFixed(1)) + " cm", s: 120, c: K.red }, { t: "OF ASH · CARS STUCK", s: 30, sp: 6 }], p.labk || 0, { minW: 520 });
finish(ctx);
