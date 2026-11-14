// 22 months: a mother elephant, a glowing gold calf curled inside her, and an arc of 22 gold moons filling one by one. p: mo (0..1 moons filled), grow (0..1 calf size), zoom, cx, cy
frameIn(p);
const mo = p.mo ?? 1, grow = p.grow ?? 1;
const bg = cached("womb_bg", W + 400, H + 400, (g) => { g.translate(200, 200); drawPaper(g);
  vwash(g, -200, 640, "26,25,23", 0.95, 0);
  blob(g, 540, 820, 720, 420, "246,240,224", 0.5);
  streak(g, 760, 420, 700, 70, "30,29,27", 0.35, 12);
  ridge(g, 1070, 60, 1.4, "130,125,115", 0.5, 8, 100, 1.0);
  vwash(g, 1100, 1180, "20,19,18", 0, 0.85); vwash(g, 1180, H + 200, "20,19,18", 0.85, 1);
  g.fillStyle = INK.ink; g.beginPath(); g.moveTo(-200, 1190); g.quadraticCurveTo(540, 1166, 1300, 1186); g.lineTo(1300, 1230); g.lineTo(-200, 1230); g.fill();
});
ctx.drawImage(bg, -200, -200);
// arc of 22 moons
const n = 22, cx0 = 540, cy0 = 1000, R = 470;
for (let i = 0; i < n; i++) { const a = Math.PI + (i + 0.5) / n * Math.PI, x = cx0 + Math.cos(a) * R, y = cy0 + Math.sin(a) * R * 0.92; const f = cl(mo * n - i);
  ctx.strokeStyle = "rgba(201,166,75,0.55)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, 20, 0, TAU); ctx.stroke();
  if (f > 0) { goldDisc(ctx, x, y, 20 * (0.6 + 0.4 * E["back"](f)), f > 0.99 ? 0.4 : 1); } }
// mother (Asian elephant)
const X = 380, Y = 1185, S = 0.9;
mammoth(ctx, X, Y, S, 1, INK.ink, { m: 0, walk: 0, eye: 1, tusk: 0.5, tr: 0.04 });
// calf inside: gold glow + curled gold calf
const bx = X - 40 * S, by = Y - 300 * S, r = 120 * S;
glow(ctx, bx, by, r * 2.2, 0.55);
ctx.save(); ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.fillStyle = "rgba(242,214,138,0.16)"; ctx.fill(); ctx.strokeStyle = "rgba(242,214,138,0.7)"; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.lineDashOffset = -t * 20; ctx.stroke(); ctx.restore();
const cs = 0.12 + 0.13 * E["ease-out"](cl(grow));
ctx.save(); ctx.translate(bx, by + 40 * cs / 0.25); ctx.rotate(0.35); ctx.globalAlpha = 0.95;
ctx.save(); ctx.shadowColor = "rgba(242,214,138,0.9)"; ctx.shadowBlur = 20; mammoth(ctx, -10, 120 * cs, cs, 1, goldPat(ctx), { m: 0.3, hair: 0, ear: 0.5, eye: 0, tusk: 0, tr: 0.6 }); ctx.restore();
ctx.restore();
goldDust(ctx, 18, 0, 420, W, 760, 41, 0.5, 12);
finish(ctx);
