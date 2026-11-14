// The odds: one red dot among a vast cream field; camera pulls back. p: zoom (big -> 1), labk, sid
const z = p.zoom || 1;
const field = cached("oddsField", 1080, 1920, (g) => {
  bokashi(g, 0, 1920, [[0, "#16284A"], [0.5, "#1E3560"], [1, "#16284A"]]);
  g.fillStyle = "rgba(241,230,204,0.8)"; const s = 12; for (let y = 4; y < 1920; y += s) for (let x = 4 + ((y / s) % 2) * 6; x < 1080; x += s) g.fillRect(x, y, 4, 4);
});
const DX = 540, DY = 760;
ctx.save(); ctx.translate(DX, DY); ctx.scale(z, z); ctx.translate(-DX, -DY); ctx.drawImage(field, 0, 0);
ctx.fillStyle = K.red; ctx.fillRect(DX - 1.5, DY - 1.5, 4, 4);
ctx.restore();
// ring marking the red dot (screen space, stays readable)
const pr = 1 + 0.08 * Math.sin(t * 5); ctx.strokeStyle = K.red; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(DX, DY, Math.max(26, 6 * z) * pr, 0, TAU); ctx.stroke();
ctx.fillStyle = K.red; ctx.beginPath(); ctx.arc(DX, DY, Math.max(7, 2 * z), 0, TAU); ctx.fill();
plaque(ctx, 540, 130, [{ t: "CHANCE IN ANY YEAR", s: 44, sp: 6 }, { t: "1 in 730,000", s: 104, c: K.red }, { t: "USGS ESTIMATE · 0.00014%", s: 26, sp: 6 }], p.labk || 0);
finish(ctx);
