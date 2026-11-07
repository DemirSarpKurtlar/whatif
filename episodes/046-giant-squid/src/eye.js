// The huge eye in the dark. p: open 0..1, glow 0..1, zoom, lab (1: 27 cm ruler | 2: dinner plate | 3: largest eyes + human eye | 4: end STAY/SWIM with diver), labk, look, sid
const z = p.zoom || 1, op = p.open ?? 1, lk = p.labk || 0, R = 300, EX = 540, EY = 820;
depthBg(ctx, 1);
ctx.save(); cam(540, 960, z, p.shake || 0);
snow(ctx, 90, 11, 10, 0.35);
// the squid's head emerging from black (glow = how much is lit)
const gl = p.glow ?? 1; ctx.save(); ctx.globalAlpha = gl; bigEye(ctx, EX, EY, R, op, p.look || 0); ctx.restore();
// darkness vignette
const vg = ctx.createRadialGradient(EX, EY, R * 1.2, EX, EY, R * 3.2); vg.addColorStop(0, "rgba(7,13,28,0)"); vg.addColorStop(1, "rgba(7,13,28,0.95)"); ctx.fillStyle = vg; ctx.fillRect(-400, -400, W + 800, H + 800);
// arms curling in from below
for (let a = 0; a < 5; a++) { const P = [], bx = 80 + a * 230; for (let i = 0; i <= 26; i++) { const u = i / 26; P.push([bx + Math.sin(u * 3 + t * 0.9 + a) * 70 * u, 2050 - u * (520 + 120 * rnd(a)) + Math.cos(u * 4 + t + a) * 20]); }
  tube(ctx, P, 90, 10, a % 2 ? K.sq : K.sqD, K.ink, 3); ctx.fillStyle = K.cream; for (let i = 3; i < 22; i += 3) { ctx.beginPath(); ctx.arc(P[i][0] + 18, P[i][1], 10 * (1 - i / 26), 0, TAU); ctx.fill(); } }
ctx.restore();
if (p.lab === 1) {
  const k = eout(cl(lk * 1.4)); ctx.save(); ctx.strokeStyle = K.red; ctx.fillStyle = K.red; ctx.lineWidth = 6; const y = EY + R * 0.86 + 40, x0 = EX - R * 0.86, x1 = lerp(x0, EX + R * 0.86, k);
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.moveTo(x0, y - 18); ctx.lineTo(x0, y + 18); if (k > 0.98) { ctx.moveTo(x1, y - 18); ctx.lineTo(x1, y + 18); } ctx.stroke(); ctx.restore();
  plaque(ctx, 540, 140, [{ t: "ITS EYE", s: 34, sp: 10 }, { t: "27 cm", s: 120, c: K.red }], lk, { minW: 360 });
}
if (p.lab === 2) { // dinner plate slides in beside, same size
  const k = eout(cl(lk)); const px = lerp(1500, 540, k), py = EY; ctx.save(); ctx.globalAlpha = 0.82; ctx.fillStyle = K.cream; ctx.strokeStyle = K.ink; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(px, py, R * 0.86, 0, TAU); ctx.fill(); ctx.stroke(); ctx.strokeStyle = K.indigo2; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(px, py, R * 0.86 - 22, 0, TAU); ctx.stroke();
  ctx.lineWidth = 3; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; ctx.beginPath(); ctx.arc(px + Math.cos(a) * (R * 0.86 - 22), py + Math.sin(a) * (R * 0.86 - 22), 12, 0, TAU); ctx.stroke(); }
  ctx.strokeStyle = "rgba(27,34,51,0.25)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, R * 0.5, 0, TAU); ctx.stroke(); ctx.restore();
  plaque(ctx, 540, 140, [{ t: "27 cm", s: 96, c: K.red }, { t: "THE SIZE OF A DINNER PLATE", s: 28, sp: 5 }], 1);
}
if (p.lab === 3) {
  plaque(ctx, 540, 120, [{ t: "THE LARGEST EYES", s: 54, sp: 4 }, { t: "IN THE ANIMAL KINGDOM", s: 28, sp: 7 }], lk);
  const k2 = cl((lk - 0.3) * 1.6); if (k2 > 0) { // human eye to scale (2.4 cm vs 27 cm)
    ctx.save(); ctx.globalAlpha = k2; const hr = R * 0.86 * 2.4 / 27, hx = 830, hy = 1530; ctx.fillStyle = K.cream; ctx.strokeStyle = K.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#4C78A8"; ctx.beginPath(); ctx.arc(hx, hy, hr * 0.5, 0, TAU); ctx.fill(); ctx.fillStyle = K.ink; ctx.beginPath(); ctx.arc(hx, hy, hr * 0.22, 0, TAU); ctx.fill(); ctx.restore();
    plaque(ctx, 830, 1575, [{ t: "HUMAN EYE", s: 24, sp: 4 }, { t: "2.4 cm", s: 34, c: K.red }], k2);
    plaque(ctx, 290, 1520, [{ t: "SHARED WITH THE", s: 22, sp: 4 }, { t: "COLOSSAL SQUID", s: 30, sp: 3 }], k2);
  }
}
if (p.lab === 4) {
  diver(ctx, 850, 1080 + Math.sin(t) * 10, 0.75);
  plaque(ctx, 300, 1640, [{ t: "STAY", s: 70, sp: 6 }], cl(lk * 1.5)); plaque(ctx, 780, 1640, [{ t: "SWIM", s: 70, sp: 6, c: K.red }], cl(lk * 1.5 - 0.3));
}
finish(ctx);
