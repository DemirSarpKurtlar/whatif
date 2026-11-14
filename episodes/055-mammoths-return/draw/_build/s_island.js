// Wrangel Island, ~4,000 years ago: an ink island in a grey Arctic sea with ice floes, a tiny last herd on its snowy back, a low gold sun. p: zoom, cx, cy, ring (0..1 gold dashed ring around the herd)
frameIn(p);
const ring = p.ring ?? 0;
const bg = cached("isl_bg", W + 400, H + 400, (g) => { g.translate(200, 200); drawPaper(g);
  vwash(g, -200, 640, "26,25,23", 0.95, 0);
  streak(g, 300, 330, 900, 100, "24,23,21", 0.45, 14); streak(g, 820, 520, 640, 60, "30,29,27", 0.35, 12);
  blob(g, 560, 860, 760, 360, "246,240,224", 0.55);
});
ctx.drawImage(bg, -200, -200);
goldDisc(ctx, 330, 850, 150, 1);
const isl = cached("isl_mid", W + 400, H + 400, (g) => { g.translate(200, 200);
  streak(g, 360, 820, 600, 28, "30,29,27", 0.45, 8);
  ridge(g, 935, 60, 5.2, "120,115,106", 0.55, 8, 60, 0.6);
  // sea
  vwash(g, 930, 1010, "70,67,62", 0.0, 0.7); vwash(g, 1010, H + 200, "28,27,25", 0.85, 1);
  // island: ink landmass with a snowy back
  g.fillStyle = INK.ink; g.beginPath(); g.moveTo(-60, 1040);
  for (let x = -60; x <= 1140; x += 20) { const u = (x + 60) / 1200; g.lineTo(x, 1040 - 150 * Math.sin(u * Math.PI) ** 0.7 - 26 * Math.sin(u * 17) * Math.sin(u * Math.PI) - 12 * Math.sin(u * 41)); }
  g.lineTo(1140, 1060); g.lineTo(-60, 1060); g.closePath(); g.fill();
  g.fillStyle = "rgba(232,227,214,0.92)"; g.beginPath(); g.moveTo(40, 1000);
  for (let x = 40; x <= 1040; x += 20) { const u = (x + 60) / 1200; g.lineTo(x, 1044 - 150 * Math.sin(u * Math.PI) ** 0.7 - 26 * Math.sin(u * 17) * Math.sin(u * Math.PI) - 12 * Math.sin(u * 41)); }
  for (let x = 1040; x >= 40; x -= 20) { const u = (x + 60) / 1200; g.lineTo(x, 1044 - 110 * Math.sin(u * Math.PI) ** 0.9 - 10 * Math.sin(u * 23)); }
  g.closePath(); g.fill();
  brush(g, [-40, 1046, 500, 1052, 1120, 1044], 10, "#D9D2C2", 0.4, 4, 0.5);
  // ice floes
  for (let i = 0; i < 16; i++) { const x = rnd(i * 3.3) * 1300 - 100, y = 1090 + rnd(i * 7.1) * 120, w = 40 + rnd(i * 1.9) * 120; g.fillStyle = `rgba(222,216,202,${0.35 + rnd(i) * 0.4})`; g.beginPath(); g.ellipse(x, y, w, w * 0.14, 0, 0, TAU); g.fill(); }
});
ctx.drawImage(isl, -200, -200);
// the last herd on the island's back
for (let i = 0; i < 4; i++) mammoth(ctx, 380 + i * 95 + lt * 6, 922 - Math.sin((380 + i * 95 + 60) / 1200 * Math.PI) * 4 + (i % 2) * 6, 0.1 + (i === 1 ? 0.02 : 0), i === 3 ? -1 : 1, INK.ink, { m: 1, walk: 1, ph: i * 1.7, eye: 0, hair: 1 });
mammoth(ctx, 470 + lt * 6, 930, 0.06, 1, INK.ink, { m: 1, walk: 1, ph: 4, eye: 0, tusk: 0.1 });
if (ring > 0) { ctx.save(); ctx.globalAlpha = cl(ring * 1.5); ctx.shadowColor = "rgba(242,214,138,0.9)"; ctx.shadowBlur = 14; ctx.strokeStyle = "#E9C877"; ctx.lineWidth = 4; ctx.setLineDash([18, 10]); ctx.lineDashOffset = -t * 30;
  ctx.beginPath(); ctx.ellipse(545, 885, 240 * (0.8 + 0.2 * E["back"](cl(ring))), 95, 0, -Math.PI / 2, -Math.PI / 2 + TAU * cl(ring)); ctx.stroke(); ctx.restore(); }
snow(ctx, 50, 2, 0.6, 30, 80);
goldDust(ctx, 14, 0, 500, W, 600, 3, 0.5, 10);
finish(ctx);
