// Whole squid hanging vertically in woodblock line style; camera pulls back from the suckers; 13 m ruler. p: zoom, cy, reach 0..1, rule 0..1, labk, sid
const z = p.zoom || 1, cy = p.cy || 960, S = 118, TOP = 230, rl = p.rule || 0;
depthBg(ctx, 0.92);
ctx.save(); cam(540, cy, z, 0);
const lg = ctx.createRadialGradient(540, 700, 50, 540, 900, 900); lg.addColorStop(0, "rgba(45,79,130,0.55)"); lg.addColorStop(1, "rgba(45,79,130,0)"); ctx.fillStyle = lg; ctx.fillRect(-400, -400, 1900, 2800);
snow(ctx, 100, 21, -12, 0.4);
squid(ctx, 540, TOP + Math.sin(t * 0.8) * 8, S, Math.PI / 2, { reach: p.reach ?? 1, suck: true, sw: 0.8, lw: 3 });
ctx.restore();
// ruler (screen space): fin tip to tentacle tip
if (rl > 0) { const y0 = TOP, y1 = TOP + 13 * S * eout(rl), x = 110; ctx.save(); ctx.strokeStyle = K.red; ctx.fillStyle = K.cream; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); ctx.lineWidth = 3; ctx.font = "26px LSerif"; ctx.textAlign = "left";
  for (let m = 0; m <= 13; m++) { const y = y0 + m * S; if (y > y1 + 1) break; ctx.beginPath(); ctx.moveTo(x - (m % 5 ? 12 : 24), y); ctx.lineTo(x + (m % 5 ? 12 : 24), y); ctx.stroke(); if (m % 5 === 0 || m === 13) ctx.fillText(m + " m", x + 30, y + 9); }
  ctx.restore(); }
plaque(ctx, 790, 420, [{ t: "FIN TO TENTACLE TIP", s: 26, sp: 4 }, { t: "UP TO 13 m", s: 76, c: K.red }], p.labk || 0);
finish(ctx);
