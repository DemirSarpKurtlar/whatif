// Blue whale cruising past a tiny diver (to scale: 30 m vs 1.8 m). p: zoom, wx (snout x), labk, nok (CAN'T stamp), sid
const z = p.zoom || 1, wx = p.wx ?? 300;
depthBg(ctx, 0.25); rays(ctx, 1.3);
ctx.save(); cam(540, 960, z, 0);
snow(ctx, 90, 7, -10, 0.35);
// distant shoal
ctx.fillStyle = "#1A2E55"; for (let i = 0; i < 30; i++) { const x = ((rnd(i) * 1300 + t * 40) % 1300) - 110, y = 1450 + rnd(i * 3) * 260; ctx.beginPath(); ctx.ellipse(x, y, 20, 7, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 18, y); ctx.lineTo(x - 32, y - 8); ctx.lineTo(x - 32, y + 8); ctx.fill(); }
blueWhale(ctx, wx, 860 + Math.sin(t * 0.7) * 10, 1.0);
diver(ctx, 170, 1110 + Math.sin(t * 1.1) * 6, 0.27, K.cream);
ctx.restore();
// scale ticks under the whale
plaque(ctx, 540, 130, [{ t: "BLUE WHALE", s: 70, sp: 8 }, { t: "UP TO 30 m · BIGGEST ANIMAL EVER", s: 26, sp: 4, c: K.red }], p.labk || 0);
if ((p.labk || 0) > 0.5 && !isHook()) { ctx.save(); ctx.globalAlpha = cl((p.labk - 0.5) * 2); ctx.fillStyle = K.cream; ctx.font = "26px LSerif"; ctx.textAlign = "center"; ctx.letterSpacing = "3px"; ctx.fillText("YOU, TO SCALE", 170, 1215); ctx.letterSpacing = "0px";
  ctx.strokeStyle = K.cream; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(170, 1190); ctx.lineTo(170, 1150); ctx.stroke(); ctx.restore(); }
stamp(ctx, 540, 1600, "CAN'T SWALLOW YOU", 58, p.nok || 0);
finish(ctx);
