// "Picture six-tonne giants roaming Siberia" (speculative): a mammoth herd crossing snowy tundra before a low gold sun, snow falling. p: walk, bull (0..1 near bull walks in), tr (bull trunk raise), zoom, cx, cy, shake
frameIn(p);
const wk = p.walk ?? 1, bull = p.bull ?? 1, tr = p.tr ?? 0;
const bg = cached("herd_bg", W + 400, H + 400, (g) => { g.translate(200, 200); drawPaper(g);
  vwash(g, -200, 720, "26,25,23", 0.95, 0);
  streak(g, 260, 300, 900, 110, "22,21,20", 0.5, 14); streak(g, 860, 470, 700, 70, "30,29,27", 0.4, 12);
  blob(g, 600, 900, 760, 420, "246,240,224", 0.55);
});
ctx.drawImage(bg, -200, -200);
goldDisc(ctx, 700, 880, 210, 1);
const mid = cached("herd_mid", W + 400, H + 400, (g) => { g.translate(200, 200);
  streak(g, 600, 840, 820, 36, "30,29,27", 0.45, 10);
  ridge(g, 1000, 170, 2.2, "110,106,98", 0.75, 7, 120, 0.8);
  streak(g, 540, 1010, 1500, 50, "225,219,204", 0.55, 12);
  tundra(g, 1060, 1.3, "232,227,214", 0.85);
  ridge(g, 1100, 40, 4.1, "200,194,180", 0.6, 4, 60, 2.0);
});
ctx.drawImage(mid, -200, -200);
// far herd (grey, small)
for (let i = 0; i < 5; i++) mammoth(ctx, -60 + i * 250 + lt * 12 + rnd(i) * 60, 1070 + rnd(i * 3) * 18, 0.17 + rnd(i * 5) * 0.04, 1, "rgba(96,92,86,0.9)", { m: 1, walk: wk, ph: i * 1.3, eye: 0, tusk: 0.9 });
ctx.drawImage(cached("herd_mist", W + 400, H + 400, (g) => { g.translate(200, 200); streak(g, 540, 1095, 1500, 34, "236,231,218", 0.45, 6); }), -200, -200);
// mid herd + a calf
mammoth(ctx, 120 + lt * 22, 1128, 0.36, 1, "rgba(52,50,46,0.97)", { m: 1, walk: wk, ph: 2, eye: 0.6 });
mammoth(ctx, 330 + lt * 22, 1134, 0.2, 1, "rgba(52,50,46,0.97)", { m: 1, walk: wk, ph: 3.1, eye: 0.5, tusk: 0.15, hair: 1.2 });
// near ground (dark, keeps the caption band readable)
const near = cached("herd_near", W + 400, H + 400, (g) => { g.translate(200, 200);
  vwash(g, 1110, 1190, "20,19,18", 0, 0.8); vwash(g, 1190, H + 200, "20,19,18", 0.8, 1);
  g.fillStyle = "rgba(20,19,18,0.95)"; g.beginPath(); g.moveTo(-200, 1240); g.quadraticCurveTo(500, 1170, 1300, 1215); g.lineTo(1300, H + 200); g.lineTo(-200, H + 200); g.fill();
  brush(g, [-80, 1214, 400, 1196, 1160, 1206], 12, "#D9D2C2", 0.35, 5, 0.5);
  for (let i = 0; i < 26; i++) { const x = rnd(i * 2.1) * 1300 - 100, y = 1222 + rnd(i * 4.3) * 30; brush(g, [x, y, x + 6, y - 40 - rnd(i) * 40], 5, INK.ink, 0.9, i + 3, 0.2); }
});
ctx.drawImage(near, -200, -200);
// the near bull walks in from the left
const bx = lerp(-520, 430, E["ease-out"](cl(bull))) + lt * 18;
glow(ctx, bx + 120, 900, 380, 0.18);
mammoth(ctx, bx, 1226, 0.92, 1, INK.ink, { m: 1, walk: wk, ph: 0.4, eye: 1, tr });
snow(ctx, 70, 5, 0.75, 40, 110);
goldDust(ctx, 16, 0, 500, W, 700, 13, 0.5, 10);
finish(ctx);
