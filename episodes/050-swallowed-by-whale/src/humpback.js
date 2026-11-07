// Cape Cod, June 2021: a humpback lunges up, the diver ends up in its closed mouth (x-ray window), 0->40 s counter, then it spits him out.
// p: rise 0..1, gape 0..1, xray 0..1, timer 0..1 (0->40 s), spit 0..1, lab (1 place+name | 2 timer | 3 alive), labk, sid, zoom
const z = p.zoom || 1, rs = p.rise ?? 1, gp = p.gape ?? 0, sp = p.spit || 0, HZ = 880, WL = 1180;
const bg = cached("capeBg", 1300, 1300, (g) => { g.translate(110, 140); skyDay(g, HZ + 10);
  // low dunes + Provincetown tower
  g.fillStyle = K.sand; g.strokeStyle = K.ink; g.lineWidth = 2; g.beginPath(); g.moveTo(-200, HZ + 2); for (let x = -200; x <= 1300; x += 20) g.lineTo(x, HZ - 14 - 16 * Math.sin(x * 0.012) ** 2 - (x > 600 ? 10 : 0)); g.lineTo(1300, HZ + 2); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = K.forestD; for (let i = 0; i < 26; i++) { const x = rnd(i * 2.2) * 1250 - 100; g.beginPath(); g.ellipse(x, HZ - 18 - rnd(i) * 10, 14 + rnd(i * 3) * 18, 7, 0, 0, TAU); g.fill(); }
  g.fillStyle = K.mtnL; g.fillRect(806, HZ - 150, 22, 130); g.strokeRect(806, HZ - 150, 22, 130); g.fillRect(800, HZ - 162, 34, 14); g.strokeRect(800, HZ - 162, 34, 14);
  for (let i = 0; i < 4; i++) { g.fillRect(800 + i * 10, HZ - 172, 6, 10); } g.beginPath(); g.moveTo(812, HZ - 172); g.lineTo(817, HZ - 190); g.lineTo(822, HZ - 172); g.fill(); });
ctx.save(); cam(540, 960, z, p.shake || 0);
ctx.drawImage(bg, -110, -140);
band(ctx, -260 + t * 12 % 200, 420, 560, 46, K.cream, 0.9); band(ctx, 640 - lt * 10, 560, 520, 40, K.cream, 0.85);
const seaG = (y0) => bokashi(ctx, y0, H + 300, [[0, K.indigo2], [1, K.indigo0]]);
ctx.save(); ctx.beginPath(); ctx.rect(-400, HZ, W + 800, H); ctx.clip(); bokashi(ctx, HZ, H + 300, [[0, K.indigo2], [1, K.indigo0]]); waveLines(ctx, HZ + 6, H + 100, 70, 8); ctx.restore();
// whale: head up, rising through the surface; sinks back when it spits
const lift = eout(rs) - 0.35 * ease(sp), HX = 600 - 60 * sp, HY = lerp(WL + 260, 380, lift), th = Math.PI / 2 - 0.22 + 0.5 * ease(sp);
humpback(ctx, HX, HY, 0.95, th, { gape: gp, pouch: 0.6 * (1 - gp) * cl(rs * 2), xray: p.xray || 0 });
// diver flying out of the mouth on spit
if (sp > 0.25) { const u = cl((sp - 0.25) / 0.6), mx = HX + 60, my = HY + 120; const dx = lerp(mx, 220, u), dy = lerp(my, WL + 40, u) - Math.sin(u * Math.PI) * 260;
  ctx.save(); ctx.translate(dx, dy); ctx.rotate(-1.2 + u * 4); diver(ctx, 0, 0, 0.42, K.cream); ctx.restore(); }
// front sea band covering the body below the waterline + foam
ctx.save(); ctx.beginPath(); ctx.moveTo(-400, WL); for (let x = -400; x <= W + 400; x += 20) ctx.lineTo(x, WL + Math.sin(x * 0.02 + t * 2) * 10); ctx.lineTo(W + 400, H + 400); ctx.lineTo(-400, H + 400); ctx.closePath(); ctx.clip();
bokashi(ctx, HZ, H + 300, [[0, K.indigo2], [1, K.indigo0]]); waveLines(ctx, WL + 10, H + 100, 50, 12); ctx.restore();
const fa = cl(rs * 3); for (let i = 0; i < 8; i++) claw(ctx, HX - 300 + i * 80, WL + 6 + Math.sin(i + t * 2) * 6, 1.2, i < 4 ? -1 : 1, fa);
bubbles(ctx, [HX - 220, WL - 20, HX - 160, WL - 40, HX + 180, WL - 30, HX + 240, WL - 10, HX - 60, WL - 50, HX + 90, WL - 60], 9, fa);
if (sp > 0.8) { const k = cl((sp - 0.8) / 0.2); for (let i = 0; i < 5; i++) claw(ctx, 140 + i * 40, WL + 20, 0.9 + k * 0.3, i % 2 ? 1 : -1, 1); bubbles(ctx, [180, WL - 30 - k * 40, 230, WL - 50 - k * 60, 270, WL - 20 - k * 30], 8, 1); }
ctx.restore();
const lk = p.labk || 0;
if (p.lab === 1) { plaque(ctx, 540, 120, [{ t: "CAPE COD · JUNE 2021", s: 52, sp: 5 }, { t: "PROVINCETOWN, USA · 14 m DEEP", s: 24, sp: 5 }], lk);
  plaque(ctx, 540, 1500, [{ t: "LOBSTER DIVER", s: 30, sp: 8 }, { t: "MICHAEL PACKARD", s: 56, sp: 4, c: K.red }], p.namek || 0); }
if (p.lab === 2) { const sec = Math.round(40 * cl(p.timer || 0)); plaque(ctx, 540, 120, [{ t: "INSIDE ITS MOUTH", s: 34, sp: 8 }, { t: "0:" + String(sec).padStart(2, "0"), s: 120, c: K.red }], lk, { minW: 420 }); }
if (p.lab === 3) { plaque(ctx, 540, 120, [{ t: "INSIDE ITS MOUTH", s: 34, sp: 8 }, { t: "0:40", s: 120, c: K.red }], 1, { minW: 420 });
  stamp(ctx, 540, 1560, "SPAT OUT ALIVE", 64, lk); }
finish(ctx);
