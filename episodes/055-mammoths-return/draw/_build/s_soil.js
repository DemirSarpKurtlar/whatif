// Pleistocene Park: bison and horses trample the snow; a cut-away shows the snow blanket squashed thin behind them, the soil and permafrost below, and a gold thermometer dropping ~1.9 °C. p: tr (0..1 trampled extent), cool (0..1 thermometer drop), zoom, cx, cy
frameIn(p);
const tr = p.tr ?? 1, cool = p.cool ?? 0;
const GY = 820; // ground (top of soil) line
const bg = cached("soil_bg", W + 400, H + 400, (g) => { g.translate(200, 200); drawPaper(g);
  vwash(g, -200, 520, "26,25,23", 0.95, 0);
  blob(g, 540, 640, 760, 260, "246,240,224", 0.55);
  streak(g, 280, 420, 760, 60, "30,29,27", 0.3, 12);
  ridge(g, 700, 90, 3.7, "120,115,106", 0.55, 7, 60, 0.9);
  // soil cross-section: dark active layer, then permafrost (grey with ice lenses)
  vwash(g, GY, 960, "52,48,42", 1, 1); g.fillStyle = "rgb(52,48,42)"; g.fillRect(-300, GY, W + 600, 140);
  g.fillStyle = "rgb(88,90,92)"; g.fillRect(-300, 960, W + 600, 260);
  const R = prng(55);
  for (let i = 0; i < 70; i++) { const x = R() * (W + 200) - 100, y = 975 + R() * 230, w = 20 + R() * 70; g.fillStyle = `rgba(200,214,222,${0.25 + R() * 0.35})`; g.beginPath(); g.ellipse(x, y, w, 3 + R() * 5, (R() - 0.5) * 0.3, 0, TAU); g.fill(); }
  for (let i = 0; i < 160; i++) { const x = R() * (W + 200) - 100, y = GY + 10 + R() * 130; g.fillStyle = `rgba(20,19,18,${0.3 + R() * 0.4})`; g.fillRect(x, y, 2 + R() * 5, 2 + R() * 4); }
  brush(g, [-100, 960, 500, 956, 1200, 962], 8, "#C9CED2", 0.5, 7, 0.5);
  vwash(g, 1150, 1230, "20,19,18", 0, 0.9); vwash(g, 1230, H + 200, "20,19,18", 0.9, 1);
});
ctx.drawImage(bg, -200, -200);
// snow layer: thick (90) ahead of the herd, packed thin (28) behind it
const front = lerp(-100, 1180, tr);
ctx.fillStyle = "rgba(240,236,226,0.97)"; ctx.beginPath(); ctx.moveTo(-300, GY);
for (let x = -300; x <= W + 300; x += 10) { const th = x < front - 60 ? 26 : x > front + 60 ? 92 : lerp(26, 92, (x - front + 60) / 120); ctx.lineTo(x, GY - th - 4 * Math.sin(x / 70)); }
ctx.lineTo(W + 300, GY); ctx.closePath(); ctx.fill();
// hoof prints in packed snow
for (let i = 0; i < 40; i++) { const x = -60 + i * 32; if (x > front - 40) break; ctx.fillStyle = "rgba(120,115,106,0.55)"; ctx.beginPath(); ctx.ellipse(x + rnd(i) * 10, GY - 22, 8, 3, 0, 0, TAU); ctx.fill(); }
// the herd, walking on the snow at the trampling front
const hx = front - 120;
horse(ctx, hx - 330, GY - 26, 0.42, 1, "rgba(60,58,54,0.97)", 1, 1.2);
bison(ctx, hx - 60, GY - 24, 0.6, 1, INK.ink, 1, 0.3);
horse(ctx, hx + 110, GY - 30, 0.5, 1, INK.ink, 1, 2.4);
bison(ctx, hx - 520, GY - 24, 0.46, 1, "rgba(60,58,54,0.95)", 1, 3.3);
// layer labels (left edge)
label(ctx, "SOIL", 40, GY + 80, 32, "#F2EAD6", "left", 0.9);
label(ctx, "PERMAFROST", 40, 1060, 32, "#F2EAD6", "left", 0.9);
// thermometer (gold) in the soil, right side
const TX = 960, TB = 1110, TT = 860;
ctx.fillStyle = "rgba(20,19,18,0.7)"; ctx.beginPath(); ctx.roundRect(TX - 22, TT - 16, 44, TB - TT + 16, 22); ctx.fill();
ctx.strokeStyle = "#E9C877"; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(TX - 22, TT - 16, 44, TB - TT + 16, 22); ctx.stroke();
const lvl = lerp(TT + 40, TB - 110, E["ease-out"](cl(cool)));
goldShape(ctx, (q) => { q.roundRect(TX - 10, lvl, 20, TB - lvl, 10); }, 12);
goldDisc(ctx, TX, TB + 10, 34, 0.8);
for (let i = 0; i < 6; i++) { ctx.strokeStyle = "rgba(242,214,138,0.8)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(TX + 26, TT + 20 + i * 36); ctx.lineTo(TX + 40, TT + 20 + i * 36); ctx.stroke(); }
if (cool > 0.05) { ctx.save(); ctx.globalAlpha = cl(cool * 2); ctx.strokeStyle = "#F2D68A"; ctx.lineWidth = 6; ctx.lineCap = "round"; const ay = lerp(TT + 20, TB - 120, cl(cool));
  ctx.beginPath(); ctx.moveTo(TX - 70, TT + 10); ctx.lineTo(TX - 70, ay); ctx.stroke(); ctx.beginPath(); ctx.moveTo(TX - 88, ay - 20); ctx.lineTo(TX - 70, ay); ctx.lineTo(TX - 52, ay - 20); ctx.stroke(); ctx.restore(); }
snow(ctx, 30, 11, 0.5, 30, 70);
goldDust(ctx, 12, 0, 420, W, 400, 51, 0.5, 10);
finish(ctx);
