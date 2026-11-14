// Same moment in history: left, gold-leaf pyramids of Giza (c. 2560 BC, already old); right, the last mammoths on snowy Wrangel (c. 2000 BC). A diagonal ink brush splits the frame. p: k (0..1 divider + labels), zoom
frameIn(p);
const k = p.k ?? 1;
const bg = cached("pyr_bg", W + 400, H + 400, (g) => { g.translate(200, 200); drawPaper(g);
  vwash(g, -200, 600, "26,25,23", 0.95, 0);
  blob(g, 300, 820, 520, 340, "246,232,196", 0.55); blob(g, 820, 860, 520, 340, "236,236,232", 0.5);
  streak(g, 250, 420, 700, 70, "30,29,27", 0.35, 12); streak(g, 850, 360, 600, 60, "30,29,27", 0.35, 12);
});
ctx.drawImage(bg, -200, -200);
// left: desert + pyramids (clip to the left of the diagonal)
const dv = (y) => lerp(640, 440, (y - 380) / 800); // divider x at height y
ctx.save(); ctx.beginPath(); ctx.moveTo(-300, -300); ctx.lineTo(dv(-300), -300); ctx.lineTo(dv(H + 300), H + 300); ctx.lineTo(-300, H + 300); ctx.closePath(); ctx.clip();
goldDisc(ctx, 250, 740, 120, 1);
ctx.drawImage(cached("pyr_left", W + 400, H + 400, (g) => { g.translate(200, 200);
  vwash(g, 1000, 1100, "120,98,60", 0, 0.5);
  g.fillStyle = "rgba(150,128,88,0.55)"; g.beginPath(); g.moveTo(-200, 1060); g.quadraticCurveTo(300, 1020, 800, 1050); g.lineTo(800, 1200); g.lineTo(-200, 1200); g.fill();
}), -200, -200);
const pyr = (x, yb, w, h, sh) => { goldShape(ctx, (q) => { q.moveTo(x - w / 2, yb); q.lineTo(x, yb - h); q.lineTo(x + w / 2, yb); q.closePath(); }, 18);
  ctx.fillStyle = `rgba(60,44,14,${sh})`; ctx.beginPath(); ctx.moveTo(x, yb - h); ctx.lineTo(x + w / 2, yb); ctx.lineTo(x + w * 0.08, yb); ctx.closePath(); ctx.fill(); };
pyr(110, 1072, 240, 140, 0.45); pyr(300, 1068, 330, 200, 0.45); pyr(480, 1074, 170, 100, 0.45);
ctx.restore();
// right: snowy island + mammoths
ctx.save(); ctx.beginPath(); ctx.moveTo(dv(-300), -300); ctx.lineTo(W + 300, -300); ctx.lineTo(W + 300, H + 300); ctx.lineTo(dv(H + 300), H + 300); ctx.closePath(); ctx.clip();
ctx.drawImage(cached("pyr_right", W + 400, H + 400, (g) => { g.translate(200, 200);
  ridge(g, 1000, 120, 1.7, "120,115,106", 0.6, 7, 80, 1.1);
  tundra(g, 1050, 2.2, "236,231,218", 0.9);
}), -200, -200);
mammoth(ctx, 760 + lt * 14, 1080, 0.33, 1, INK.ink, { m: 1, walk: 1, ph: 0.5, eye: 1 });
mammoth(ctx, 640 + lt * 14, 1060, 0.15, 1, "rgba(60,58,54,0.95)", { m: 1, walk: 1, ph: 2.5, eye: 0, tusk: 0.2 });
snow(ctx, 30, 6, 0.6, 30, 80);
ctx.restore();
// near ground band (dark)
ctx.drawImage(cached("pyr_near", W + 400, H + 400, (g) => { g.translate(200, 200);
  vwash(g, 1070, 1160, "20,19,18", 0, 0.85); vwash(g, 1160, H + 200, "20,19,18", 0.85, 1); }), -200, -200);
// divider brush stroke
brush(ctx, [dv(300), 300, dv(760), 760, dv(1180), 1180], 22, INK.ink, 0.95, 9, 0.35, E["ease-out"](cl(k * 1.4)));
label(ctx, "GIZA", 250, 520, 46, "#F2D68A", "center", cl(k * 2 - 0.3));
label(ctx, "c. 2560 BC", 250, 570, 34, "#F2EAD6", "center", cl(k * 2 - 0.3));
label(ctx, "WRANGEL", 830, 520, 46, "#F2D68A", "center", cl(k * 2 - 0.8));
label(ctx, "c. 2000 BC", 830, 570, 34, "#F2EAD6", "center", cl(k * 2 - 0.8));
goldDust(ctx, 14, 0, 500, W, 600, 9, 0.5, 10);
finish(ctx);
