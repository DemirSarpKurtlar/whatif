// Diver sinking into the dark: rays fade, DEPTH counter. p: d (depth 0..1 -> 0..300 m), zoom, labk, sid
const d = p.d || 0, z = p.zoom || 1, m = Math.round(300 * d);
depthBg(ctx, 0.15 + 0.8 * d);
ctx.save(); cam(540, 960, z, 0);
// surface glimmer at top, receding
const sy = -200 - d * 900; if (sy > -700) { bokashi(ctx, sy - 200, sy + 260, [[0, "rgba(157,185,212,0.9)"], [1, "rgba(45,79,130,0)"]]); waveLines(ctx, sy, sy + 160, 30, 9, "rgba(240,234,220,0.6)"); }
rays(ctx, 1 - d * 1.05);
// fish shoal silhouettes drifting (only in the upper, brighter water)
if (d < 0.6) { ctx.save(); ctx.globalAlpha = 1 - d / 0.6; ctx.fillStyle = "#0E1830"; for (let i = 0; i < 22; i++) { const x = ((rnd(i) * 1300 + t * 60) % 1300) - 110, y = 380 + rnd(i * 3) * 380 - d * 500;
  ctx.beginPath(); ctx.ellipse(x, y, 26, 9, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 22, y); ctx.lineTo(x - 40, y - 10); ctx.lineTo(x - 40, y + 10); ctx.fill(); } ctx.restore(); }
snow(ctx, 140, 4, -160, 0.4 + 0.3 * d);
diver(ctx, 540, 1000 + Math.sin(t) * 12, 1.6, d > 0.6 ? "rgba(240,230,200,0.75)" : K.cream);
// headlamp beam appears as it gets dark
if (d > 0.5) { ctx.save(); ctx.globalCompositeOperation = "lighter"; const a = cl((d - 0.5) * 2); const lg = ctx.createRadialGradient(560, 860, 10, 560, 1500, 700);
  lg.addColorStop(0, `rgba(255,236,190,${0.22 * a})`); lg.addColorStop(1, "rgba(255,236,190,0)"); ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(560, 860); ctx.lineTo(260, 1900); ctx.lineTo(860, 1900); ctx.closePath(); ctx.fill(); ctx.restore(); }
ctx.restore();
// depth gauge plaque (left) + ruler ticks on the right
ctx.save(); ctx.strokeStyle = "rgba(240,230,200,0.6)"; ctx.fillStyle = "rgba(240,230,200,0.8)"; ctx.lineWidth = 3; ctx.font = "28px LSerif"; ctx.textAlign = "right";
for (let k = -2; k <= 14; k++) { const mm = Math.floor(m / 25) * 25 + k * 25, y = 960 + (mm - 300 * d) * 6; if (mm < 0 || y < 380 || y > 1700) continue; const big = mm % 100 === 0;
  ctx.beginPath(); ctx.moveTo(1040, y); ctx.lineTo(big ? 980 : 1010, y); ctx.stroke(); if (big) ctx.fillText(mm + " m", 970, y + 10); }
ctx.strokeStyle = K.red; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(1060, 960); ctx.lineTo(950, 960); ctx.stroke(); ctx.restore();
plaque(ctx, 540, 150, [{ t: "DEPTH", s: 30, sp: 10 }, { t: m + " m", s: 120, c: K.red }], p.labk || 0, { minW: 360 });
if (d > 0.85) plaque(ctx, 540, 1600, [{ t: "THE SUNLIGHT IS GONE", s: 34, sp: 5 }], cl((d - 0.85) / 0.1));
finish(ctx);
