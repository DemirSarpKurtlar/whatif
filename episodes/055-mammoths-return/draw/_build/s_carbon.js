// Twice the carbon: two gold-rimmed glass columns; ATMOSPHERE fills to one unit with grey smoke, PERMAFROST to two units with frozen ink flecked with gold. p: f (0..1 fill), x2 (0..1 the "2x" mark), zoom, cx, cy
frameIn(p);
const f = p.f ?? 1, x2 = p.x2 ?? 1;
const bg = cached("carb_bg", W + 400, H + 400, (g) => { g.translate(200, 200); drawPaper(g);
  vwash(g, -200, 620, "26,25,23", 0.95, 0);
  blob(g, 540, 800, 720, 460, "246,240,224", 0.5);
  streak(g, 300, 420, 760, 70, "30,29,27", 0.3, 12);
  vwash(g, 1110, 1180, "20,19,18", 0, 0.85); vwash(g, 1180, H + 200, "20,19,18", 0.85, 1);
  g.fillStyle = INK.ink; g.beginPath(); g.moveTo(-200, 1150); g.quadraticCurveTo(540, 1130, 1300, 1148); g.lineTo(1300, 1200); g.lineTo(-200, 1200); g.fill();
});
ctx.drawImage(bg, -200, -200);
const BASE = 1130, U = 270, CW = 230;
const col = (x, units, k, kind) => {
  const top = BASE - U * 2 - 30, h = U * units * k;
  // contents
  ctx.save(); ctx.beginPath(); ctx.roundRect(x - CW / 2, top, CW, BASE - top, 18); ctx.clip();
  if (kind === 0) { for (let i = 0; i < 14; i++) { const yy = BASE - h + rnd(i) * h, xx = x + Math.sin(t * 0.8 + i) * 50; blob(ctx, xx, yy, 90, 50, "120,115,106", 0.55 * (h > 4 ? 1 : 0)); } }
  else { ctx.fillStyle = "rgb(36,34,31)"; ctx.fillRect(x - CW / 2, BASE - h, CW, h);
    for (let i = 0; i < 60; i++) { const yy = BASE - rnd(i * 2.7) * h, xx = x - CW / 2 + rnd(i * 5.1) * CW; ctx.fillStyle = rnd(i) < 0.5 ? "rgba(242,214,138,0.8)" : "rgba(190,205,214,0.45)"; ctx.fillRect(xx, yy, 3 + rnd(i * 3) * 5, 2 + rnd(i * 7) * 3); } }
  if (h > 4) { ctx.fillStyle = "rgba(242,214,138,0.9)"; ctx.fillRect(x - CW / 2, BASE - h - 3, CW, 5); }
  ctx.restore();
  // glass + gold rim
  ctx.save(); ctx.strokeStyle = "rgba(242,214,138,0.85)"; ctx.lineWidth = 4; ctx.shadowColor = "rgba(242,214,138,0.6)"; ctx.shadowBlur = 10; ctx.beginPath(); ctx.roundRect(x - CW / 2, top, CW, BASE - top, 18); ctx.stroke(); ctx.restore();
  ctx.fillStyle = "rgba(255,250,235,0.12)"; ctx.fillRect(x - CW / 2 + 16, top + 20, 18, BASE - top - 40);
  // unit ticks
  for (let u = 1; u <= 2; u++) { ctx.strokeStyle = "rgba(242,214,138,0.6)"; ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(x - CW / 2 - 20, BASE - U * u); ctx.lineTo(x + CW / 2 + 20, BASE - U * u); ctx.stroke(); ctx.setLineDash([]); }
};
col(300, 1, E["ease-out"](cl(f * 1.6)), 0);
col(760, 2, E["ease-out"](cl(f)), 1);
label(ctx, "ATMOSPHERE", 300, BASE - U * 2 - 60, 38, INK.ink, "center", 1);
label(ctx, "PERMAFROST", 760, BASE - U * 2 - 60, 38, INK.ink, "center", 1);
if (x2 > 0) { ctx.save(); ctx.globalAlpha = cl(x2 * 2); const sc = 0.7 + 0.3 * E["back"](cl(x2)); ctx.translate(530, 760); ctx.scale(sc, sc); ctx.font = "150px LSerif"; ctx.textAlign = "center"; ctx.fillStyle = goldPat(ctx); ctx.shadowColor = "rgba(242,214,138,0.8)"; ctx.shadowBlur = 26; ctx.fillText("×2", 0, 50); ctx.restore(); }
goldDust(ctx, 20, 0, 420, W, 760, 61, 0.5, 14);
finish(ctx);
