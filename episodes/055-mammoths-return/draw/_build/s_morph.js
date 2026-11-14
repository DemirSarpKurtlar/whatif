// Elephant -> mammoth: an Asian elephant grows long hair, its ears shrink, a fat hump rises. Gold leader labels pop for each trait. p: hair, ear, m (hump/head/tusks), l1, l2, l3 (label alphas), zoom, cx, cy
frameIn(p);
const hair = p.hair ?? 0, ear = p.ear ?? 0, m = p.m ?? 0;
const bg = cached("mor_bg", W + 400, H + 400, (g) => { g.translate(200, 200); drawPaper(g);
  vwash(g, -200, 640, "26,25,23", 0.95, 0);
  blob(g, 560, 820, 700, 420, "246,240,224", 0.55);
  streak(g, 260, 380, 800, 80, "30,29,27", 0.35, 12);
  ridge(g, 1060, 70, 2.9, "130,125,115", 0.5, 8, 100, 1.1);
  vwash(g, 1100, 1180, "20,19,18", 0, 0.85); vwash(g, 1180, H + 200, "20,19,18", 0.85, 1);
  g.fillStyle = INK.ink; g.beginPath(); g.moveTo(-200, 1190); g.quadraticCurveTo(540, 1160, 1300, 1186); g.lineTo(1300, 1230); g.lineTo(-200, 1230); g.fill();
});
ctx.drawImage(bg, -200, -200);
goldDisc(ctx, 760, 700, 190, 1);
const X = 470, Y = 1180, S = 0.95;
glow(ctx, X + 100, 860, 420, 0.2);
mammoth(ctx, X, Y, S, 1, INK.ink, { m, hair, ear, walk: 0, eye: 1, tr: 0.08 * Math.sin(t * 1.3) + 0.05 });
// gold leader labels (scene space)
const lab = (a, ax, ay, lx, ly, txt1) => { if (a <= 0) return; const e = E["ease-out"](cl(a));
  ctx.save(); ctx.globalAlpha = cl(a * 1.5); ctx.strokeStyle = "#E9C877"; ctx.lineWidth = 3; ctx.shadowColor = "rgba(242,214,138,0.8)"; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(lerp(ax, lx, e), lerp(ay, ly, e)); ctx.stroke(); ctx.restore(); circ2(ctx, ax, ay, 7, "#F2D68A");
  label(ctx, txt1, lx, ly + (ly < ay ? -14 : 44), 44, INK.ink, "center", cl(a * 1.5 - 0.3)); };
lab(p.l1 ?? 0, X - 285 * S, Y - 290 * S, 190, 700, "SHAGGY FUR");
lab(p.l2 ?? 0, X + 212 * S, Y - 440 * S, 840, 560, "SMALL EARS");
lab(p.l3 ?? 0, X + 90 * S, Y - 500 * S, 430, 540, "EXTRA FAT");
goldDust(ctx, 20, 0, 420, W, 760, 31, 0.5, 12);
finish(ctx);
