// Commuter train on a viaduct in falling ash; it brakes and stops at a red signal. p: zoom, cy, tx (train position 0..1), ash, cover, sig (0 green → 1 red), labk, sid
const z = p.zoom || 1, cy = p.cy || 960, cov = p.cover || 0, DY = 1060; // deck top
const bg = cached("trainBg", 1300, 2200, (g) => {
  g.translate(110, 140);
  bokashi(g, -140, DY + 40, [[0, "#3B3A3C"], [0.45, "#6F6B66"], [1, "#B7AFA0"]]);
  // muted city silhouettes
  for (let i = 0; i < 16; i++) { const x = -100 + i * 80 + rnd(i) * 30, w = 60 + rnd(i * 2) * 50, h = 160 + rnd(i * 3) * 300; g.fillStyle = i % 2 ? "#8C8B8C" : "#7C7D82"; g.fillRect(x, DY - 40 - h, w, h + 40);
    g.strokeStyle = "rgba(27,34,51,0.55)"; g.lineWidth = 2; g.strokeRect(x, DY - 40 - h, w, h + 40); g.fillStyle = "rgba(27,34,51,0.2)"; for (let r = DY - 30 - h; r < DY - 40; r += 24) g.fillRect(x + 8, r, w - 16, 6); }
  // ground under viaduct
  g.fillStyle = "#A39D91"; g.fillRect(-110, DY + 40, 1300, 1200);
  // viaduct deck + piers
  g.fillStyle = "#C9C2B0"; g.strokeStyle = K.ink; g.lineWidth = 3;
  for (let i = -1; i < 7; i++) { const x = i * 200 + 40; g.fillRect(x, DY + 60, 50, 700); g.strokeRect(x, DY + 60, 50, 700);
    g.beginPath(); g.moveTo(x + 50, DY + 60); g.quadraticCurveTo(x + 125, DY + 150, x + 200, DY + 60); g.stroke(); }
  g.fillRect(-110, DY, 1300, 60); g.strokeRect(-110, DY, 1300, 60);
  g.fillStyle = K.ink; g.fillRect(-110, DY - 6, 1300, 6);
  // catenary poles
  for (let i = 0; i < 6; i++) { const x = i * 230 + 60; g.fillStyle = "#5C5A57"; g.fillRect(x, DY - 330, 10, 330); g.fillRect(x - 40, DY - 330, 90, 8); }
  g.strokeStyle = "#3A3936"; g.lineWidth = 2; g.beginPath(); g.moveTo(-110, DY - 300); g.lineTo(1190, DY - 300); g.stroke();
});
ctx.save(); cam(540, cy, z, 0);
ctx.drawImage(bg, -110, -140);
// signal
const sx = 940, red = (p.sig || 0) > 0.5;
ctx.fillStyle = "#3A3936"; ctx.fillRect(sx, DY - 260, 12, 260); ctx.fillStyle = K.ink; ctx.beginPath(); ctx.roundRect(sx - 24, DY - 380, 60, 130, 14); ctx.fill();
ctx.fillStyle = red ? "#E2462F" : "#3A2A28"; ctx.beginPath(); ctx.arc(sx + 6, DY - 350, 18, 0, TAU); ctx.fill(); ctx.fillStyle = red ? "#23402E" : "#5BD38A"; ctx.beginPath(); ctx.arc(sx + 6, DY - 290, 18, 0, TAU); ctx.fill();
if (red) glow2(ctx, sx + 6, DY - 350, 70, "226,70,47"); else glow2(ctx, sx + 6, DY - 290, 60, "91,211,138");
// train (3 cars), moving right then stopping
const x0 = lerp(-1800, -420, p.tx || 0), vel = p.vel || 0;
for (let c = 0; c < 3; c++) { const x = x0 + c * 430, y = DY - 150;
  ctx.fillStyle = "#D9DCDA"; ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.beginPath(); if (c === 2) { ctx.moveTo(x, y); ctx.lineTo(x + 380, y); ctx.quadraticCurveTo(x + 425, y + 10, x + 425, y + 70); ctx.lineTo(x + 425, y + 140); ctx.lineTo(x, y + 140); ctx.closePath(); } else ctx.rect(x, y, 420, 140);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#3C9A4A"; ctx.fillRect(x + 2, y + 92, (c === 2 ? 421 : 416), 14); // Yamanote-green stripe
  ctx.fillStyle = "#33405A"; for (let w = 0; w < 5; w++) ctx.fillRect(x + 22 + w * 78, y + 22, 50, 46);
  if (c === 2) { ctx.fillStyle = "#33405A"; ctx.beginPath(); ctx.moveTo(x + 385, y + 18); ctx.quadraticCurveTo(x + 412, y + 24, x + 416, y + 64); ctx.lineTo(x + 385, y + 64); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = K.ink; for (const wx of [60, 110, 310, 360]) { ctx.beginPath(); ctx.arc(x + wx, y + 146, 14, 0, TAU); ctx.fill(); }
  // pantograph
  if (c === 1) { ctx.strokeStyle = "#3A3936"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 170, y); ctx.lineTo(x + 210, y - 60); ctx.lineTo(x + 250, y); ctx.moveTo(x + 185, y - 60); ctx.lineTo(x + 235, y - 60); ctx.stroke(); }
  if (cov > 0) { ctx.fillStyle = K.ashL; ctx.fillRect(x + 4, y - 7 * cov, (c === 2 ? 380 : 412), 7 * cov + 1); }
}
// brake sparks
if (vel > 0.05) for (let i = 0; i < 10; i++) { const ph = (t * 3 + rnd(i)) % 1; ctx.fillStyle = `rgba(255,200,90,${(1 - ph) * vel})`; ctx.fillRect(x0 + 1170 - ph * 80 - rnd(i * 2) * 40, DY - 6 - ph * 30 * rnd(i * 3), 5, 5); }
// ash layer on deck
if (cov > 0) { ctx.fillStyle = K.ashL; ctx.fillRect(-300, DY - 6 - 8 * cov, W + 600, 8 * cov + 2); }
ashFall(ctx, p.ash || 0, -200, -200, 1500, 2400, 11, 120, "rgba(60,56,50,0.8)");
ctx.restore();
const lk = p.labk || 0;
plaque(ctx, 540, 140, [{ t: "0.5 mm", s: 120, c: K.red }, { t: "OF ASH · TRAINS STOP", s: 30, sp: 6 }], lk);
finish(ctx);
function glow2(g, x, y, r, rgb) { const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, `rgba(${rgb},0.6)`); rg.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
