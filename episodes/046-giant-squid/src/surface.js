// Indigo sea surface: fishing boat, wave claws both sides, a long dark shape gliding under the boat. p: zoom, cy, shadow 0..1, dive 0..1 (camera tilts down under water), lab, labk, sid
const z = p.zoom || 1, cy = p.cy || 960, sh = p.shadow || 0, dv = ease(p.dive || 0), WL = 980;
const bg = cached("surfBg", 1300, 1300, (g) => { g.translate(110, 140); skyDay(g, WL + 10); ridge(g, WL - 10, 70, 5.2, K.mtnL, "rgba(27,34,51,0.45)", 0, 0.5);
  ridge(g, WL, 40, 8.1, "#7E9DBB", "rgba(27,34,51,0.55)", 0.2, 0.9); });
ctx.save(); cam(540, cy + dv * 700, z, 0);
ctx.drawImage(bg, -110, -140);
band(ctx, -200 + lt * 20, 560, 520, 44, K.cream, 0.9); band(ctx, 620 - lt * 14, 680, 560, 38, K.cream, 0.85);
// sea body, gets darker below
bokashi(ctx, WL, 2900, [[0, K.indigo2], [0.35, K.indigo], [1, K.abyss]]);
waveLines(ctx, WL + 8, 1900, 80, 6);
// the shadow under the boat
if (sh > 0) { ctx.save(); ctx.globalAlpha = 0.85 * cl(sh * 2); squid(ctx, lerp(1000, -150, sh), 1330 + Math.sin(t) * 10, 62, 0.04, { pal: "sil", sw: 0.8 }); ctx.restore(); }
// boat, rocking on the swell
boat(ctx, 560, WL + 8 + Math.sin(t * 1.6) * 8, 1.0, Math.sin(t * 1.6) * 0.05);
// foam row along the near swell
for (let i = 0; i < 9; i++) claw(ctx, 120 + i * 105, WL + 60 + Math.sin(i + t * 2) * 6, 0.9, i % 2 ? 1 : -1, 0.9);
ctx.restore();
// great wave claws framing (left normal, right mirrored, smaller)
ctx.save(); ctx.globalAlpha = 1 - cl(dv * 1.6); ctx.translate(0, dv * -600); greatWave(ctx, 1); ctx.restore();
ctx.save(); ctx.globalAlpha = 1 - cl(dv * 1.6); ctx.translate(W, 120 + dv * -600); ctx.scale(-0.8, 0.8); ctx.translate(0, 480); greatWave(ctx, 1); ctx.restore();
if (p.lab === 1) plaque(ctx, 540, 150, [{ t: "PACIFIC OCEAN", s: 58, sp: 6 }, { t: "OGASAWARA ISLANDS · JAPAN", s: 26, sp: 6 }], p.labk || 0);
finish(ctx);
