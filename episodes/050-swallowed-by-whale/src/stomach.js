// Inside a sperm whale: four stomach chambers (anatomical woodblock). p: mode (1 squeeze | 2 acid | 3 end question), cx, cy, zoom, slide 0..1 (diver down the throat), sq 0..1 squeeze strength, labk, lab2k, sid
const z = p.zoom || 1, cx = p.cx ?? 540, cy = p.cy ?? 960, md = p.mode || 1, sq = p.sq || 0, sl = p.slide ?? 1;
ctx.fillStyle = K.gut; ctx.fillRect(0, 0, W, H);
ctx.save(); cam(cx, cy, z, p.shake || 0);
// body cavity: dark folds + ribs
ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 26; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(1300, -200 + i * 300, 900, Math.PI * 0.75, Math.PI * 1.05); ctx.stroke(); }
ctx.fillStyle = K.gut2; for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.ellipse(rnd(i * 3.1) * 1100, rnd(i * 5.7) * 2100 - 100, 30 + rnd(i) * 80, 12 + rnd(i * 2) * 30, rnd(i * 7) * 3, 0, TAU); ctx.fill(); }
const pul = (k) => 1 - 0.1 * sq * (0.5 + 0.5 * Math.sin(t * 6 + k));
// chambers: [x, y, rx, ry]
const C = [[380, 640, 300, 250], [720, 1080, 280, 240], [400, 1500, 200, 170], [760, 1790, 170, 140]];
function tubeL(P, w) { tube(ctx, P, w, w, K.wall, K.ink, 4); tube(ctx, P, w * 0.55, w * 0.55, K.wallL, null); }
tubeL([[-160, 40], [40, 140], [200, 270], [300, 400]], 130); // esophagus
tubeL([[560, 820], [620, 900], [680, 960]], 110); tubeL([[560, 1250], [500, 1330], [440, 1380]], 100); tubeL([[560, 1590], [640, 1690], [700, 1730]], 90); tubeL([[900, 1850], [1000, 1950], [1150, 2050]], 80);
C.forEach(([x, y, rx, ry], i) => { const k = i === 0 ? pul(0) : 1, kx = i === 0 ? 1 + (1 - k) * 0.6 : 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(kx, k);
  ctx.fillStyle = K.wall; ctx.strokeStyle = K.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = i === 0 ? "#4A1C1C" : "#3A1616"; ctx.beginPath(); ctx.ellipse(0, 0, rx - 34, ry - 34, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.stroke();
  // rugae folds (muscle)
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, rx - 34, ry - 34, 0, 0, TAU); ctx.clip();
  ctx.strokeStyle = i === 0 ? "rgba(210,117,86,0.85)" : "rgba(210,117,86,0.5)"; ctx.lineWidth = i === 0 ? 7 : 4;
  for (let j = 0; j < 9; j++) { const yy = -ry + 40 + j * (ry * 2 - 60) / 8; ctx.beginPath(); for (let xx = -rx; xx <= rx; xx += 20) { const w = Math.sin(xx * 0.05 + j * 1.3 + (i === 0 ? t * 3 * sq : 0)) * 12; xx === -rx ? ctx.moveTo(xx, yy + w) : ctx.lineTo(xx, yy + w); } ctx.stroke(); }
  if (i === 1) { // acid pool
    const ay = -ry * 0.15 + Math.sin(t * 2) * 6; ctx.fillStyle = K.acid; ctx.beginPath(); ctx.moveTo(-rx, ay); for (let xx = -rx; xx <= rx; xx += 16) ctx.lineTo(xx, ay + Math.sin(xx * 0.04 + t * 3) * 7); ctx.lineTo(rx, ry); ctx.lineTo(-rx, ry); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = K.acidL; ctx.lineWidth = 4; ctx.stroke();
    ctx.strokeStyle = "rgba(240,234,200,0.6)"; ctx.lineWidth = 2.5; for (let j = 0; j < 7; j++) { ctx.beginPath(); const yy = ay + 40 + j * 26, x0 = -rx + 40 + rnd(j) * 120; ctx.moveTo(x0, yy); for (let q = 1; q <= 6; q++) ctx.lineTo(x0 + q * 40, yy + Math.sin(q + t * 2 + j) * 3); ctx.stroke(); }
    for (let b = 0; b < 26; b++) { const ph = (t * 0.6 + rnd(b * 3.3)) % 1, bx = -rx * 0.8 + rnd(b * 1.9) * rx * 1.6, by = lerp(ry - 40, ay - 60, ph), br = 5 + rnd(b) * 12;
      ctx.globalAlpha = ph < 0.85 ? 1 : (1 - ph) / 0.15; ctx.fillStyle = K.acidL; ctx.strokeStyle = K.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.fill(); ctx.stroke(); ctx.globalAlpha = 1; }
  }
  ctx.restore();
  ctx.restore();
  // number seal
  ctx.save(); ctx.translate(x + rx * 0.72, y - ry * 0.78); ctx.rotate(-0.06); ctx.fillStyle = K.red; ctx.fillRect(-34, -34, 68, 68); ctx.strokeStyle = K.cream; ctx.lineWidth = 3; ctx.strokeRect(-27, -27, 54, 54);
  ctx.fillStyle = K.cream; ctx.font = "48px LSerif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(i + 1), 0, 3); ctx.restore(); });
// the diver: slides down the throat into chamber 1 and tumbles
{ const P = [[-160, 40], [40, 140], [200, 270], [300, 400], [380, 600]]; const u = cl(sl) * (P.length - 1), i0 = Math.min(P.length - 2, Math.floor(u)), f = u - i0;
  const dx = lerp(P[i0][0], P[i0 + 1][0], f), dy = lerp(P[i0][1], P[i0 + 1][1], f) + (sl >= 1 ? Math.sin(t * 2) * 14 * (1 - (1 - pul(1)) * 2) : 0);
  ctx.save(); ctx.translate(dx, dy); ctx.rotate(sl < 1 ? -0.9 : t * 0.8); const sc = 0.42 * (sl >= 1 ? 0.9 + 0.1 * pul(0.5) : 1); diver(ctx, 0, 0, sc, K.cream); ctx.restore(); }
ctx.restore();
// labels
if (md === 1) { plaque(ctx, 540, 120, [{ t: "STOMACH 1 OF 4", s: 64, sp: 4 }, { t: "MUSCLE THAT SQUEEZES AND CRUSHES", s: 26, sp: 4 }], p.labk || 0);
  if ((p.lab2k || 0) > 0) plaque(ctx, 540, 1520, [{ t: "SQUEEZE", s: 80, sp: 10, c: K.red }], p.lab2k); }
if (md === 2) { plaque(ctx, 540, 120, [{ t: "STOMACH 2", s: 40, sp: 6 }, { t: "ACID", s: 110, sp: 14, c: K.red }], p.labk || 0);
  if ((p.lab2k || 0) > 0) plaque(ctx, 540, 1520, [{ t: "NO AIR", s: 64, sp: 8 }, { t: "OXYGEN 0 %", s: 34, sp: 5, c: K.red }], p.lab2k); }
if (md === 3) { plaque(ctx, 300, 1560, [{ t: "SQUEEZE", s: 62, sp: 6 }], p.labk || 0); plaque(ctx, 780, 1560, [{ t: "ACID", s: 62, sp: 8, c: K.red }], p.lab2k || 0); }
finish(ctx);
