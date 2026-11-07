// Sperm whale vs giant squid, silhouette battle; then sucker scars on the whale's head. p: zoom, cx, cy, scars 0..1, labk, lab2k, sid
const z = p.zoom || 1, cx = p.cx || 540, cy = p.cy || 960, sc = p.scars || 0, WX = 170 - lt * 8, WY = 820, WS = 1.15;
depthBg(ctx, 0.85); rays(ctx, 0.35);
ctx.save(); cam(cx, cy, z, p.shake || 0);
snow(ctx, 90, 51, -8, 0.35);
whaleShape(ctx, WX, WY, WS);
// scars: cream rings over the head
if (sc > 0) { const n = Math.floor(44 * sc); for (let i = 0; i < n; i++) { const x = WX + (20 + rnd(i * 3.7) * 300) * WS, y = WY + (-95 + rnd(i * 5.3) * 160) * WS; ring(ctx, x, y, 8 + rnd(i * 2.2) * 18, cl((sc * 44 - i) / 3)); } }
// the squid fighting: arms wrapped toward the jaw
squid(ctx, 900 + Math.sin(t * 1.2) * 14, 1180, 100, -2.75 + Math.sin(t * 1.4) * 0.06, { sw: 1.2, reach: 0.25, ph: 2 });
ctx.restore();
plaque(ctx, 540, 140, [{ t: "SPERM WHALE", s: 66, sp: 6 }, { t: "ITS ONLY REAL ENEMY", s: 28, sp: 7 }], p.labk || 0);
if ((p.lab2k || 0) > 0) plaque(ctx, 540, 1500, [{ t: "SUCKER SCARS", s: 54, sp: 6, c: K.red }, { t: "LEFT BY GIANT SQUID", s: 24, sp: 6 }], p.lab2k);
finish(ctx);
