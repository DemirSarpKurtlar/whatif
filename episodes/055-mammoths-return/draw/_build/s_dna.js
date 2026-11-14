// Colossal edits Asian elephant cells: a gold double helix turning in front of a faint elephant silhouette; rungs flare as they are "edited". p: ed (0..1 edited fraction), zoom, cx, cy
frameIn(p);
const ed = p.ed ?? 0;
const bg = cached("dna_bg", W + 400, H + 400, (g) => { g.translate(200, 200); drawPaper(g);
  vwash(g, -200, 620, "26,25,23", 0.95, 0);
  blob(g, 540, 820, 700, 420, "246,240,224", 0.5);
  streak(g, 300, 420, 800, 80, "30,29,27", 0.35, 12);
  vwash(g, 1090, 1170, "20,19,18", 0, 0.85); vwash(g, 1170, H + 200, "20,19,18", 0.85, 1);
});
ctx.drawImage(bg, -200, -200);
// faint Asian elephant behind
ctx.save(); ctx.globalAlpha = 0.5; mammoth(ctx, 560, 1170, 0.95, 1, "rgba(70,67,62,1)", { m: 0, walk: 0, eye: 0, tusk: 0.6 }); ctx.restore();
glow(ctx, 540, 760, 520, 0.25);
// helix: horizontal, x 90..990, centre y 760
const N = 26, x0 = 90, x1 = 990, cy = 760, A = 150, rot = t * 1.6;
const strand = (off) => { const P = []; for (let i = 0; i <= 120; i++) { const u = i / 120, x = lerp(x0, x1, u), a = u * TAU * 2.2 + rot + off; P.push([x, cy + Math.sin(a) * A, Math.cos(a)]); } return P; };
const s1 = strand(0), s2 = strand(Math.PI);
const drawStrand = (P, front) => { ctx.lineCap = "round"; for (let i = 0; i < P.length - 1; i++) { const z = P[i][2]; if ((z > 0) !== front) continue;
  ctx.strokeStyle = front ? "#E9C877" : "rgba(150,122,60,0.75)"; ctx.lineWidth = front ? 14 : 9; ctx.beginPath(); ctx.moveTo(P[i][0], P[i][1]); ctx.lineTo(P[i + 1][0], P[i + 1][1]); ctx.stroke(); } };
drawStrand(s1, false); drawStrand(s2, false);
// rungs
for (let j = 0; j < N; j++) { const u = (j + 0.5) / N, x = lerp(x0, x1, u), a = u * TAU * 2.2 + rot; const y1 = cy + Math.sin(a) * A, y2 = cy - Math.sin(a) * A;
  const on = rnd(j * 3.7) < ed * 1.05 && ed > 0.02; const fl = on ? 0.6 + 0.4 * Math.sin(t * 6 + j) : 0;
  ctx.strokeStyle = on ? `rgba(255,236,170,${0.85 + 0.15 * fl})` : "rgba(40,38,35,0.75)"; ctx.lineWidth = on ? 9 : 6; ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke();
  if (on) { glow(ctx, x, cy, 60, 0.35 * fl); if (rnd(j * 9.1) < 0.35) sparkle(ctx, x, cy + (rnd(j) - 0.5) * 80, 16 + 8 * fl, 0.9); } }
ctx.save(); ctx.shadowColor = "rgba(242,214,138,0.8)"; ctx.shadowBlur = 16; drawStrand(s1, true); drawStrand(s2, true); ctx.restore();
// little brush "snips" travelling along the helix while editing
if (ed > 0.02 && ed < 0.99) { const sx = lerp(x0, x1, (t * 0.35) % 1); sparkle(ctx, sx, cy - 190, 30, 1); glow(ctx, sx, cy, 160, 0.4); }
goldDust(ctx, 26, 0, 420, W, 760, 21, 0.6, 14);
finish(ctx);
