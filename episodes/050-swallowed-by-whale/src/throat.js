// Throat chart: blue whale throat (20 cm) vs beach ball vs your shoulders (40 cm). Scale 12 px / cm. p: ring 0..1, ball 0..1, bust 0..1, cmp 0..1 (20 cm ring laid on the shoulders), sid
const S = 12, rk = eout(p.ring ?? 1), bk = eout(p.ball ?? 1), uk = eout(p.bust ?? 1), ck = p.cmp || 0;
bokashi(ctx, -100, H + 100, [[0, K.indigo], [1, K.deep]]); waveLines(ctx, 1450, 1900, 40, 31);
const PX = 50, PY = 230, PW = 980, PH = 980;
ctx.save(); ctx.fillStyle = "rgba(10,14,28,0.45)"; ctx.fillRect(PX + 10, PY + 12, PW, PH); ctx.fillStyle = K.cream; ctx.fillRect(PX, PY, PW, PH);
ctx.strokeStyle = K.ink; ctx.lineWidth = 5; ctx.strokeRect(PX + 3, PY + 3, PW - 6, PH - 6); ctx.lineWidth = 1.6; ctx.strokeRect(PX + 14, PY + 14, PW - 28, PH - 28);
ctx.fillStyle = K.ink; ctx.font = "44px LSerif"; ctx.textAlign = "center"; ctx.letterSpacing = "6px"; ctx.fillText("A BLUE WHALE'S THROAT", 540, PY + 80); ctx.letterSpacing = "0px";
ctx.beginPath(); ctx.rect(PX + 16, PY + 16, PW - 32, PH - 32); ctx.clip();
// throat: dark hole in pink flesh
const TX = 280, TY = 520, TR = 10 * S;
if (rk > 0) { ctx.save(); ctx.translate(TX, TY); ctx.scale(rk, rk); ctx.fillStyle = K.wallL; ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, TR + 60, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "rgba(110,38,32,0.6)"; ctx.lineWidth = 3; for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a) * TR, Math.sin(a) * TR); ctx.quadraticCurveTo(Math.cos(a + 0.15) * (TR + 30), Math.sin(a + 0.15) * (TR + 30), Math.cos(a) * (TR + 56), Math.sin(a) * (TR + 56)); ctx.stroke(); }
  const rg = ctx.createRadialGradient(0, 0, 4, 0, 0, TR); rg.addColorStop(0, "#05070E"); rg.addColorStop(1, K.mouthD); ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(0, 0, TR, 0, TAU); ctx.fill(); ctx.strokeStyle = K.ink; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); }
// beach ball (36 cm)
const BX = 760, BY = 552, BR = 17 * S, bx = lerp(1400, BX, bk);
if (bk > 0) { ctx.save(); ctx.translate(bx, BY); ctx.rotate((1 - bk) * 3 + Math.sin(t) * 0.05); const cols = [K.red, K.cream, K.gold, K.cream, K.indigo2, K.cream];
  for (let i = 0; i < 6; i++) { ctx.fillStyle = cols[i]; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, BR, i / 6 * TAU, (i + 1) / 6 * TAU); ctx.closePath(); ctx.fill(); }
  ctx.strokeStyle = K.ink; ctx.lineWidth = 3; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(i / 6 * TAU) * BR, Math.sin(i / 6 * TAU) * BR); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(0, 0, BR, 0, TAU); ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = K.cream; ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); }
// person's bust, shoulders 40 cm wide
const HX = 540, SY = 1060, SW = 40 * S;
if (uk > 0) { ctx.save(); ctx.translate(0, (1 - uk) * 400); ctx.fillStyle = K.indigo; ctx.strokeStyle = K.ink; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(HX - SW / 2 - 10, 1240); ctx.lineTo(HX - SW / 2, SY + 30); ctx.quadraticCurveTo(HX - SW / 2 + 10, SY - 30, HX - 70, SY - 40); ctx.lineTo(HX - 34, SY - 60); ctx.lineTo(HX - 34, SY - 95);
  ctx.lineTo(HX + 34, SY - 95); ctx.lineTo(HX + 34, SY - 60); ctx.lineTo(HX + 70, SY - 40); ctx.quadraticCurveTo(HX + SW / 2 - 10, SY - 30, HX + SW / 2, SY + 30); ctx.lineTo(HX + SW / 2 + 10, 1240); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = K.sand; ctx.beginPath(); ctx.ellipse(HX, SY - 160, 62, 76, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = K.ink; ctx.beginPath(); ctx.ellipse(HX, SY - 205, 64, 36, 0, Math.PI, TAU); ctx.fill(); ctx.restore(); }
ctx.restore();
// dimension bars (outside the clip so labels sit on top)
function dim(y, x0, x1, label, a, col = K.red) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = cl(a); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y);
  ctx.moveTo(x0, y - 14); ctx.lineTo(x0, y + 14); ctx.moveTo(x1, y - 14); ctx.lineTo(x1, y + 14); ctx.stroke(); ctx.font = "50px LSerif"; ctx.textAlign = "center";
  const tw = ctx.measureText(label).width + 30; ctx.fillStyle = K.cream; ctx.fillRect((x0 + x1) / 2 - tw / 2, y - 38, tw, 66); ctx.strokeStyle = K.ink; ctx.lineWidth = 2; ctx.strokeRect((x0 + x1) / 2 - tw / 2, y - 38, tw, 66); ctx.fillStyle = col; ctx.fillText(label, (x0 + x1) / 2, y + 16); ctx.restore(); }
dim(TY + TR + 95, TX - TR, TX + TR, "≈ 20 cm", cl((rk - 0.85) * 7));
if (bk > 0.9) { ctx.save(); ctx.globalAlpha = cl((bk - 0.9) * 10); ctx.fillStyle = K.ink; ctx.font = "30px LSerif"; ctx.textAlign = "center"; ctx.letterSpacing = "4px"; ctx.fillText("BEACH BALL", BX, BY + BR + 50); ctx.letterSpacing = "0px"; ctx.restore(); }
if (ck > 0) { ctx.save(); ctx.globalAlpha = cl(ck * 2); ctx.setLineDash([14, 10]); ctx.strokeStyle = K.red; ctx.lineWidth = 6; const r = TR * (0.6 + 0.4 * eback(cl(ck)));
  ctx.beginPath(); ctx.arc(HX - TR, SY - 10, r, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(HX + TR, SY - 10, r, 0, TAU); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
  plaque(ctx, 540, 1460, [{ t: "YOUR SHOULDERS", s: 30, sp: 6 }, { t: "TWICE AS WIDE", s: 64, c: K.red }], ck); }
if (uk > 0.9) dim(SY + 70, HX - SW / 2, HX + SW / 2, "≈ 40 cm", cl((uk - 0.9) * 10));
finish(ctx);
