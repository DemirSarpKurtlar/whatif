// Tokyo Dome filled with ash, then ×1,371 domes. p: zoom, fill (big dome ash 0..1), out (0 big dome → 1 grid), n (count 0..1 → 1..1371), labk, sid
const z = p.zoom || 1, fl = p.fill || 0, out = p.out || 0, N = 1371, COLS = 37, CW = 26, CH = 17, GX = 540 - COLS * CW / 2, GYY = 560;
function domeIcon(g, x, y, s, ash = 0) { // centre-bottom at x,y ; width 100*s
  g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 3 / Math.max(0.25, s); g.strokeStyle = K.ink;
  g.fillStyle = "#9DA6B0"; g.fillRect(-50, -14, 100, 14); g.strokeRect(-50, -14, 100, 14);
  g.fillStyle = "#F3EEE2"; g.beginPath(); g.ellipse(0, -14, 50, 26, 0, Math.PI, 0); g.closePath(); g.fill(); g.stroke();
  if (ash > 0) { g.save(); g.beginPath(); g.ellipse(0, -14, 50, 26, 0, Math.PI, 0); g.closePath(); g.clip(); g.fillStyle = "#8D877C"; g.fillRect(-52, -14 - 28 * ash, 104, 28 * ash); g.restore(); g.beginPath(); g.ellipse(0, -14, 50, 26, 0, Math.PI, 0); g.closePath(); g.stroke(); }
  if (s > 0.5) { g.strokeStyle = "rgba(27,34,51,0.35)"; g.lineWidth = 1.5 / s; for (let k = -3; k <= 3; k++) { g.beginPath(); g.moveTo(k * 13, -14); g.quadraticCurveTo(k * 9, -36, 0, -40); g.stroke(); } }
  g.restore();
}
const grid = cached("domeGrid", 1080, 1000, (g) => { for (let i = 0; i < N; i++) { const c = i % COLS, r = Math.floor(i / COLS); domeIcon(g, GX + c * CW + CW / 2 + (r % 2) * 4, r * CH + CH, 0.24, 1); } });
const bg = cached("domeBg", 1300, 2200, (g) => { g.translate(110, 140); bokashi(g, -140, 2100, [[0, K.indigo0], [0.5, K.indigo], [1, K.indigo2]]); waveLines(g, 1450, 2000, 0, 1); });
ctx.save(); cam(540, 960, z, 0);
ctx.drawImage(bg, -110, -140);
waveLines(ctx, 1480, 1950, 40, 21);
// big dome phase
if (out < 1) { const s = lerp(5.2, 0.6, ease(out)); ctx.save(); ctx.globalAlpha = 1 - ease(cl(out * 1.4)); domeIcon(ctx, 540, lerp(1060, 700, ease(out)), s, fl);
  if (fl > 0 && fl < 1) { ctx.fillStyle = "rgba(141,135,124,0.9)"; for (let i = 0; i < 50; i++) { const x = 540 + (rnd(i) - 0.5) * 360, y = ((rnd(i * 3) * 500 + t * 600) % 500) + 300; if (y < 1060 - 200 * s / 5) ctx.fillRect(x, y, 6, 14); } }
  ctx.restore(); }
// grid phase: reveal first n domes (row-major)
if (out > 0) { const cnt = Math.max(1, Math.round(lerp(1, N, p.n || 0))); const full = Math.floor(cnt / COLS), part = cnt % COLS;
  ctx.save(); ctx.globalAlpha = cl(out * 1.6); ctx.beginPath(); ctx.rect(0, GYY, 1080, full * CH + 1); if (part) ctx.rect(0, GYY + full * CH, GX + part * CW + 2, CH + 2); ctx.clip(); ctx.drawImage(grid, 0, GYY); ctx.restore(); }
ctx.restore();
const cnt = Math.max(1, Math.round(lerp(1, N, p.n || 0)));
plaque(ctx, 540, 140, [{ t: "TOKYO DOME", s: 46, sp: 8 }, { t: "× " + cnt.toLocaleString("en-US"), s: 120, c: K.red }], p.labk || 0, { minW: 520 });
if (out > 0.5) plaque(ctx, 540, 1470, [{ t: "1.24 MILLION m³ EACH", s: 34, sp: 5 }], cl((out - 0.5) * 2));
finish(ctx);
