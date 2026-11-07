// Sperm whale opens its jaw; a 10 m squid slides in, swallowed whole. p: zoom, cx, gape 0..1, sq 0..1 (squid appears), slide 0..1 (squid pulled in), rule 0..1, labk, lab2k, sid
const z = p.zoom || 1, cx = p.cx || 540, gp = p.gape ?? 0.8, sl = ease(p.slide || 0), sqk = p.sq ?? 1, WX = 470, WY = 900, WS = 0.8, PXM = 47; // 47 px per metre (whale 16 m ≈ 750 px)
depthBg(ctx, 0.8); rays(ctx, 0.3);
ctx.save(); cam(cx, 960, z, p.shake || 0);
snow(ctx, 90, 51, -8, 0.35);
const mx = WX + 46 * WS, my = WY + 56 * WS; // mouth opening (screen)
spermWhale(ctx, WX, WY, WS, gp, { inner: (g, tip) => {
  if (sqk <= 0) return; g.save(); g.scale(1 / WS, 1 / WS); g.translate(-WX, -WY); // back to screen coords
  g.beginPath(); g.rect(-400, -400, mx + 60 - (-400), 2000); g.clip(); g.globalAlpha = cl(sqk * 2);
  squid(g, mx + 40 + sl * 330, my + 4, PXM, Math.PI + 0.02 + Math.sin(t * 1.3) * 0.03, { sw: 0.9 * (1 - sl * 0.6), reach: 1, tl: 10, lw: 2.4, ph: 1 });
  g.restore(); } });
ctx.restore();
const rl = p.rule || 0; if (rl > 0 && !isHook()) { const x1 = mx + 40 + sl * 330, x0 = x1 - 10 * PXM * eout(rl), y = 760; ctx.save(); ctx.strokeStyle = K.red; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(Math.min(x1, mx), y); ctx.moveTo(x0, y - 16); ctx.lineTo(x0, y + 16); ctx.stroke();
  ctx.font = "54px LSerif"; ctx.textAlign = "center"; const lx = Math.max(140, (x0 + Math.min(x1, mx)) / 2), tw = ctx.measureText("10 m").width + 30; ctx.fillStyle = K.cream; ctx.fillRect(lx - tw / 2, y - 40, tw, 70); ctx.fillStyle = K.red; ctx.fillText("10 m", lx, y + 18); ctx.restore(); }
plaque(ctx, 540, 130, [{ t: "SPERM WHALE", s: 68, sp: 6 }, { t: "A THROAT WIDE ENOUGH FOR YOU", s: 26, sp: 5, c: K.red }], p.labk || 0);
if ((p.lab2k || 0) > 0) plaque(ctx, 540, 1500, [{ t: "SQUID, SWALLOWED WHOLE", s: 40, sp: 4 }, { t: "AZORES · 1955", s: 26, sp: 6 }], p.lab2k);
finish(ctx);
