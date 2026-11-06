// Fuji over Suruga Bay, woodblock print. p: zoom, cy, erupt (plume growth 0..1), dark (ash-dark sky 0..1), wave (foreground great wave 0..1),
// lab (0 none | 1 HŌEI 1707 + DAY counter | 2 319 YEARS), labk (plaque appear 0..1), day (counter value), what (vertical WHAT IF plaque 0..1), sid
const z = p.zoom || 1, cy = p.cy || 960, er = p.erupt || 0, dk = p.dark || 0;
// static backdrop cached: sky, Fuji, ridges (drawn once, 1300x2200 so the camera can move)
const bg = cached("fujiBg", 1300, 2200, (g) => {
  g.translate(110, 140);
  skyDay(g, 1260);
  // pale far ranges
  ridge(g, 1180, 120, 2.0, K.mtnL, "rgba(27,34,51,0.5)");
  fuji(g, 540, 1240, 540, 600, { lw: 3.5, snow: 0.3 });
  ridge(g, 1260, 70, 4.1, "#7E9DBB", "rgba(27,34,51,0.6)", 0, 1.3);
  ridge(g, 1330, 90, 7.3, K.forest, K.ink, 0.5, 1.1);
  ridge(g, 1400, 60, 9.9, K.forestD, K.ink, 0.6, 1.6);
});
ctx.save(); cam(540, cy, z, p.shake || 0);
ctx.drawImage(bg, -110, -140);
// ash darkening of the sky (drawn behind plume, above mountains' sky only via alpha band)
if (dk > 0) { ctx.save(); ctx.globalAlpha = dk * 0.75; bokashi(ctx, -300, 1250, [[0, "#2A2622"], [0.6, "#5B554C"], [1, "rgba(120,112,100,0.2)"]]); ctx.restore(); }
// mist bands drifting
band(ctx, -260 + Math.sin(t * 0.2) * 40 + lt * 12, 1105, 560, 46, K.cream, 0.95);
band(ctx, 640 - lt * 10, 1175, 640, 40, K.cream, 0.9);
// eruption from the SE flank (Hōei crater) — vent at the right flank
if (er > 0) { const vx = 540 + 150, vy = 1240 - 600 * 0.66; vent(ctx, vx, vy, cl(er * 3)); plume(ctx, vx, vy, 900, er, 0.3, 1.0, 3, 0); }
// sea
sea(ctx, 1400, 2300, K.indigo2, K.indigo0, 70, 4);
band(ctx, 700 + Math.sin(t * 0.3) * 30, 1470, 420, 34, K.cream2, 0.8);
// foreground great wave (left) with foam claws
const wv = p.wave || 0;
if (wv > 0) {
  ctx.save(); ctx.translate(-80, 2050 - 560 * eout(wv)); const sw = Math.sin(t * 0.9) * 10;
  ctx.fillStyle = K.indigo; ctx.strokeStyle = K.ink; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-100, 400); ctx.bezierCurveTo(60, 200, 160, -60, 360 + sw, -150); ctx.bezierCurveTo(470 + sw, -190, 560 + sw, -120, 540 + sw, -40);
  ctx.bezierCurveTo(470, -110, 400, -70, 400, 10); ctx.bezierCurveTo(420, 120, 560, 200, 760, 240); ctx.lineTo(900, 400); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = K.indigo2; ctx.beginPath(); ctx.moveTo(40, 400); ctx.bezierCurveTo(140, 220, 220, 60, 330, -40); ctx.bezierCurveTo(300, 80, 320, 200, 520, 300); ctx.lineTo(600, 400); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "rgba(240,234,220,0.8)"; ctx.lineWidth = 2.5; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(60 + i * 30, 380); ctx.quadraticCurveTo(180 + i * 25, 120 - i * 10, 340 + i * 12 + sw, -100 + i * 22); ctx.stroke(); }
  foamRow(ctx, 330 + sw, -150, 560 + sw, -60, 8, 1.15, 1); foamRow(ctx, 120, 160, 340 + sw, -140, 7, 1.0, 1);
  bubbles(ctx, [560, -20, 590, 10, 620, 30, 655, 52, 690, 70], 8);
  ctx.restore();
}
// ash fall when erupting
if (er > 0.25) ashFall(ctx, cl((er - 0.25) * 1.5) * (0.5 + dk), -200, -200, 1500, 2400, 3, 140);
ctx.restore();
// labels (screen space)
const lk = p.labk || 0;
if (p.lab === 1) {
  plaque(ctx, 540, 140, [{ t: "HŌEI ERUPTION", s: 64, sp: 4 }, { t: "MOUNT FUJI · 1707", s: 28, sp: 8 }], lk);
  const d = Math.round(p.day || 1);
  plaque(ctx, 540, 1540, [{ t: "DAY", s: 30, sp: 10 }, { t: String(d), s: 120, c: K.red }], cl((lk - 0.0) * 1.0), { minW: 230 });
} else if (p.lab === 2) {
  plaque(ctx, 540, 150, [{ t: "SILENT SINCE 1707", s: 34, sp: 6 }, { t: "319 YEARS", s: 96, c: K.red, sp: 2 }], lk);
}
if (p.what) vplaque(ctx, 960, 620, "WHATIF", 44, p.what);
finish(ctx);
