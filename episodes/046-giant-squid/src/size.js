// Size plaque: giant squid (13 m) vs city bus (12 m), same scale. p: sq 0..1 (squid slides in), bus 0..1, labk, cmp (colossal note 0..1), sid
const S = 70, X0 = 85, sq = eout(p.sq ?? 1), bu = eout(p.bus ?? 1);
bokashi(ctx, -100, H + 100, [[0, K.indigo], [1, K.deep]]); waveLines(ctx, 1450, 1900, 40, 31);
// paper chart panel
ctx.save(); const PX = 50, PY = 300, PW = 980, PH = 880; ctx.fillStyle = "rgba(10,14,28,0.45)"; ctx.fillRect(PX + 10, PY + 12, PW, PH); ctx.fillStyle = K.cream; ctx.fillRect(PX, PY, PW, PH);
ctx.strokeStyle = K.ink; ctx.lineWidth = 5; ctx.strokeRect(PX + 3, PY + 3, PW - 6, PH - 6); ctx.lineWidth = 1.6; ctx.strokeRect(PX + 14, PY + 14, PW - 28, PH - 28);
ctx.fillStyle = K.ink; ctx.font = "46px LSerif"; ctx.textAlign = "center"; ctx.letterSpacing = "6px"; ctx.fillText("GIANT SQUID  vs  CITY BUS", 540, PY + 86); ctx.letterSpacing = "0px";
ctx.strokeStyle = "rgba(27,34,51,0.2)"; ctx.lineWidth = 1.5; for (let m = 0; m <= 13; m++) { const x = X0 + m * S; ctx.beginPath(); ctx.moveTo(x, PY + 120); ctx.lineTo(x, PY + PH - 40); ctx.stroke(); }
ctx.restore();
// squid (horizontal, fins left)
ctx.save(); ctx.beginPath(); ctx.rect(PX + 16, PY + 16, PW - 32, PH - 32); ctx.clip();
squid(ctx, X0 - (1 - sq) * 1100, 620, S, 0, { sw: 0.35, lw: 2.4 });
// bus
const bx = X0 + (1 - bu) * 1100, by = 1060, bw = 12 * S, bh = 3.2 * S;
ctx.save(); ctx.translate(bx, by); ctx.strokeStyle = K.ink; ctx.lineWidth = 3.5;
ctx.fillStyle = K.red; ctx.beginPath(); ctx.roundRect(0, -bh, bw, bh - 18, 22); ctx.fill(); ctx.stroke();
ctx.fillStyle = K.cream2; ctx.fillRect(0, -bh * 0.42, bw, 14); ctx.strokeRect(0, -bh * 0.42, bw, 14);
ctx.fillStyle = K.indigo2; for (let i = 0; i < 9; i++) { ctx.fillRect(40 + i * 86, -bh + 22, 66, 70); ctx.strokeRect(40 + i * 86, -bh + 22, 66, 70); }
ctx.fillStyle = K.indigo; ctx.fillRect(bw - 40, -bh + 22, 30, bh - 60); ctx.strokeRect(bw - 40, -bh + 22, 30, bh - 60);
ctx.fillStyle = K.ink; for (const wx of [130, bw - 170]) { ctx.beginPath(); ctx.arc(wx, -18, 40, 0, TAU); ctx.fill(); ctx.fillStyle = K.ashL; ctx.beginPath(); ctx.arc(wx, -18, 15, 0, TAU); ctx.fill(); ctx.fillStyle = K.ink; }
ctx.restore(); ctx.restore();
// dimension lines
function dim(y, x0, x1, label, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = K.red; ctx.fillStyle = K.red; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y);
  ctx.moveTo(x0, y - 14); ctx.lineTo(x0, y + 14); ctx.moveTo(x1, y - 14); ctx.lineTo(x1, y + 14); ctx.stroke(); ctx.font = "54px LSerif"; ctx.textAlign = "center";
  const tw = ctx.measureText(label).width + 30; ctx.fillStyle = K.cream; ctx.fillRect((x0 + x1) / 2 - tw / 2, y - 40, tw, 70); ctx.fillStyle = K.red; ctx.fillText(label, (x0 + x1) / 2, y + 18); ctx.restore(); }
dim(470, X0, X0 + 13 * S, "13 m", cl((sq - 0.9) * 10)); dim(1125, X0, X0 + 12 * S, "12 m", cl((bu - 0.9) * 10));
if ((p.cmp || 0) > 0) plaque(ctx, 540, 1500, [{ t: "ITS HEAVIER COUSIN, THE COLOSSAL SQUID", s: 26, sp: 3 }, { t: "495 kg", s: 70, c: K.red }], p.cmp);
finish(ctx);
