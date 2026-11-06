// Edo → Tokyo skyline by the river, Fuji on the horizon. p: zoom, cy, morph (0 Edo roofs → 1 Tokyo), grey (ash front sweeping in 0..1),
// ash (falling ash density), cover (ash on roofs/ground 0..1), plume (Fuji plume 0..1), lab (1 EDO→TOKYO | 2 +2 HOURS | 3 STAY/RUN), labk, sid
const z = p.zoom || 1, cy = p.cy || 960, mo = p.morph || 0, gr = p.grey || 0, cov = p.cover || 0;
const GY = 1170; // ground line
const skyC = cached("citySky", 1300, 1400, (g) => { g.translate(110, 140); skyDay(g, GY + 20); ridge(g, GY - 40, 50, 3.3, K.mtnL, "rgba(27,34,51,0.45)", 0, 0.8); fuji(g, 190, GY - 30, 230, 260, { lw: 2.5, snow: 0.38 }); });
ctx.save(); cam(540, cy, z, p.shake || 0);
ctx.drawImage(skyC, -110, -140);
if (p.plume) plume(ctx, 225, GY - 205, 520, p.plume, 0.45, 0.45, 9, 0);
// ash front: sky darkens from the west (left) and a wall of billows rolls across
if (gr > 0) {
  const fx = lerp(-500, 1700, eout(gr));
  ctx.save(); const lg = ctx.createLinearGradient(fx - 900, 0, fx, 0); lg.addColorStop(0, "rgba(72,66,58,0.88)"); lg.addColorStop(0.75, "rgba(110,102,90,0.7)"); lg.addColorStop(1, "rgba(110,102,90,0)");
  ctx.fillStyle = lg; ctx.fillRect(-300, -300, fx + 300, GY + 300); ctx.restore();
  ctx.save(); ctx.strokeStyle = K.ink; ctx.lineWidth = 2.6;
  for (let i = 0; i < 9; i++) { const y = -60 + i * 95, x = fx - 120 - (i % 2) * 70 + Math.sin(t * 0.8 + i) * 12; billow(ctx, x, y, 90 + 25 * rnd(i), 1); billow(ctx, x - 150, y + 40, 80, 1); }
  ctx.restore();
}
// ---- Edo (sinks away as morph grows)
if (mo < 1) {
  ctx.save(); ctx.beginPath(); ctx.rect(-300, -300, W + 600, GY + 300 + 6); ctx.clip(); ctx.translate(0, eout(mo) * 360);
  for (let row = 0; row < 4; row++) { const y = GY - 150 + row * 45, s = 0.6 + row * 0.18;
    for (let i = -1; i < 12; i++) { const x = i * 120 * s + (row % 2) * 50 + rnd(row * 9 + i) * 20 - 40, w = 110 * s, h = 46 * s;
      ctx.fillStyle = K.cream2; ctx.fillRect(x + 8 * s, y - 2, w - 16 * s, 34 * s); ctx.strokeStyle = K.ink; ctx.lineWidth = 2; ctx.strokeRect(x + 8 * s, y - 2, w - 16 * s, 34 * s);
      ctx.fillStyle = K.wood; ctx.fillRect(x + w * 0.45, y + 8 * s, 12 * s, 24 * s);
      ctx.fillStyle = K.roof; ctx.beginPath(); ctx.moveTo(x - 6 * s, y); ctx.lineTo(x + 16 * s, y - h); ctx.lineTo(x + w - 16 * s, y - h); ctx.lineTo(x + w + 6 * s, y); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "rgba(240,234,220,0.35)"; ctx.lineWidth = 1.5; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x + k * w / 4, y - h + 2); ctx.lineTo(x + k * w / 4 - 4, y - 2); ctx.stroke(); }
      if (cov > 0) { ctx.fillStyle = K.ashL; ctx.fillRect(x + 16 * s, y - h - 6 * cov, w - 32 * s, 6 * cov + 2); } } }
  // fire watchtower
  const tx = 700, ty = GY - 150; ctx.strokeStyle = K.ink; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(tx - 30, ty); ctx.lineTo(tx - 12, ty - 200); ctx.moveTo(tx + 30, ty); ctx.lineTo(tx + 12, ty - 200); ctx.stroke();
  ctx.lineWidth = 3; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(tx - 28 + k * 4, ty - k * 50); ctx.lineTo(tx + 24 - k * 4, ty - k * 50 - 50); ctx.stroke(); }
  ctx.fillStyle = K.roof; ctx.beginPath(); ctx.moveTo(tx - 40, ty - 200); ctx.lineTo(tx, ty - 235); ctx.lineTo(tx + 40, ty - 200); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// ---- Tokyo (rises as morph grows)
if (mo > 0) {
  ctx.save(); ctx.beginPath(); ctx.rect(-300, -300, W + 600, GY + 300 + 4); ctx.clip();
  const lit = cl((gr - 0.45) * 3);
  const B = [[-40, 110, 120], [60, 90, 90], [140, 120, 150], [250, 100, 120], [350, 110, 260], [420, 120, 380], [610, 110, 520], [700, 130, 640], [820, 90, 460], [880, 120, 340], [1000, 110, 420], [560, 80, 220]];
  const cols = ["#C9C2B0", "#8FA7BF", "#A7B6C4", "#B9AE98", "#7F95AE"];
  B.forEach(([x, w, h], i) => { const k = eout(cl((mo - i * 0.035) / 0.5)); if (k <= 0) return; const hh = h * k, y = GY - hh;
    ctx.fillStyle = cols[i % 5]; ctx.fillRect(x, y, w, hh + 4); ctx.strokeStyle = K.ink; ctx.lineWidth = 2.5; ctx.strokeRect(x, y, w, hh + 4);
    ctx.fillStyle = "rgba(27,34,51,0.18)"; ctx.fillRect(x + w * 0.68, y, w * 0.32, hh);
    // window grid
    for (let r = y + 18; r < GY - 10; r += 26) for (let c = x + 12; c < x + w - 14; c += 22) { const on = lit > 0 && rnd(r * 0.13 + c * 0.7 + i) < 0.7;
      ctx.fillStyle = on ? `rgba(255,214,120,${0.35 + 0.6 * lit})` : "rgba(27,34,51,0.35)"; ctx.fillRect(c, r, 10, 12); }
    if (cov > 0) { ctx.fillStyle = K.ashL; ctx.fillRect(x - 3, y - 10 * cov, w + 6, 10 * cov + 2); } });
  // Tokyo Tower (red/white lattice)
  const k2 = eout(cl((mo - 0.25) / 0.5)), th = 560 * k2, tx = 545, base = GY;
  if (k2 > 0) { ctx.save(); ctx.strokeStyle = K.red; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(tx - 70, base); ctx.quadraticCurveTo(tx - 20, base - th * 0.5, tx - 4, base - th); ctx.moveTo(tx + 70, base); ctx.quadraticCurveTo(tx + 20, base - th * 0.5, tx + 4, base - th); ctx.stroke();
    ctx.lineWidth = 3; for (let k = 1; k < 10; k++) { const yy = base - th * k / 10, hw = lerp(70, 6, Math.pow(k / 10, 0.6)); ctx.strokeStyle = k % 2 ? K.red : K.cream; ctx.beginPath(); ctx.moveTo(tx - hw, yy); ctx.lineTo(tx + hw, yy); ctx.stroke(); }
    ctx.fillStyle = K.cream; ctx.fillRect(tx - 30, base - th * 0.42, 60, 18); ctx.strokeStyle = K.ink; ctx.lineWidth = 2; ctx.strokeRect(tx - 30, base - th * 0.42, 60, 18); ctx.fillRect(tx - 18, base - th * 0.68, 36, 12); ctx.restore(); }
  // Skytree
  const k3 = eout(cl((mo - 0.4) / 0.5)), sh = 880 * k3, sx = 960;
  if (k3 > 0) { ctx.fillStyle = "#DCE3E8"; ctx.strokeStyle = K.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(sx - 36, GY); ctx.lineTo(sx - 9, GY - sh * 0.92); ctx.lineTo(sx, GY - sh); ctx.lineTo(sx + 9, GY - sh * 0.92); ctx.lineTo(sx + 36, GY); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#AFC0CE"; ctx.fillRect(sx - 22, GY - sh * 0.62, 44, 26); ctx.strokeRect(sx - 22, GY - sh * 0.62, 44, 26); ctx.fillRect(sx - 16, GY - sh * 0.76, 32, 18); ctx.strokeRect(sx - 16, GY - sh * 0.76, 32, 18); }
  ctx.restore();
}
// ---- river + embankment (foreground)
ctx.fillStyle = K.forestD; ctx.fillRect(-300, GY, W + 600, 24); ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-300, GY); ctx.lineTo(W + 300, GY); ctx.stroke();
sea(ctx, GY + 24, 1660, K.indigo2, K.indigo, 40, 8);
ctx.fillStyle = gr > 0 ? `rgb(${Math.round(lerp(217, 150, cov))},${Math.round(lerp(192, 144, cov))},${Math.round(lerp(143, 132, cov))})` : K.sand; ctx.fillRect(-300, 1660, W + 600, 700);
ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-300, 1660); ctx.lineTo(W + 300, 1660); ctx.stroke();
for (let i = 0; i < 9; i++) pine(ctx, 40 + i * 125 + rnd(i) * 30, 1665, 60 + rnd(i * 3) * 30, K.forestD);
band(ctx, -200 + lt * 14, 1010, 520, 40, K.cream, 0.9 * (1 - gr));
// ash fall
if (p.ash) ashFall(ctx, p.ash, -200, -200, 1500, 2400, 5, 110);
ctx.restore();
// labels
const lk = p.labk || 0;
if (p.lab === 1) { plaque(ctx, 540, 150, [{ t: "EDO → TOKYO", s: 66, sp: 4 }, { t: "SAME CITY · 319 YEARS LATER", s: 24, sp: 6 }], lk); }
else if (p.lab === 2) {
  plaque(ctx, 540, 140, [{ t: "ASH ARRIVES", s: 40, sp: 6 }, { t: "≈ 2 HOURS", s: 96, c: K.red }], lk);
} else if (p.lab === 3) {
  const a = eback(cl(lk * 1.4)), b = eback(cl(lk * 1.4 - 0.35));
  plaque(ctx, 300, 300, [{ t: "STAY", s: 110, sp: 6 }, { t: "SHELTER AT HOME", s: 22, sp: 5 }], cl(lk * 1.4), { minW: 360 });
  plaque(ctx, 780, 300, [{ t: "RUN", s: 110, sp: 6, c: K.red }, { t: "LEAVE THE CITY", s: 22, sp: 5 }], cl(lk * 1.4 - 0.35), { minW: 360 });
  ctx.fillStyle = K.cream; ctx.font = "italic 64px LSerif"; ctx.textAlign = "center"; ctx.globalAlpha = cl(lk * 2 - 0.6); ctx.fillText("or", 540, 400); ctx.globalAlpha = 1;
}
finish(ctx);
