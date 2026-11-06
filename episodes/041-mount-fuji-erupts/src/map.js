// Print-style map: Fuji (west) → Edo/Tokyo (east), ash drifting 100 km downwind. p: zoom, route (0..1 dashed line), drift (ash 0..1), labk, name (0 EDO | 1 TOKYO), sid
const z = p.zoom || 1, rt = p.route || 0, dr = p.drift || 0;
const FX = 250, FY = 980, TX = 820, TY = 845; // Fuji, Edo (screen coords)
const base = cached("mapBase", 1300, 2200, (g) => {
  g.translate(110, 140);
  // sea
  g.fillStyle = K.indigo; g.fillRect(-110, -140, 1300, 2200);
  // land (Honshu, simplified, hand-drawn) — top part of frame, coast with Izu peninsula + Sagami/Tokyo bays
  const coast = [-110, 1230, 40, 1210, 120, 1170, 190, 1190, 250, 1230, 300, 1300, 330, 1420, 360, 1520, 400, 1560, 430, 1500, 440, 1380, 470, 1280, 520, 1220,
    600, 1190, 680, 1170, 730, 1120, 760, 1040, 790, 980, 820, 940, 850, 900, 880, 880, 860, 960, 840, 1060, 870, 1140, 930, 1180, 980, 1150, 1010, 1060, 1000, 960, 1020, 880, 1080, 820, 1190, 800, 1190, -140, -110, -140];
  g.beginPath(); g.moveTo(coast[0], coast[1]); for (let i = 2; i < coast.length; i += 2) g.lineTo(coast[i], coast[i + 1]); g.closePath();
  g.fillStyle = K.cream; g.fill(); g.lineWidth = 4; g.strokeStyle = K.ink; g.stroke();
  // coastal shading band (sand) inside coast
  g.save(); g.clip(); g.lineWidth = 26; g.strokeStyle = "rgba(217,192,143,0.7)"; g.beginPath(); g.moveTo(coast[0], coast[1]); for (let i = 2; i < coast.length - 6; i += 2) g.lineTo(coast[i], coast[i + 1]); g.stroke();
  // hills (green bands) and mountain chains
  for (let i = 0; i < 9; i++) { const x = 60 + rnd(i * 3.3) * 700, y = 200 + rnd(i * 5.1) * 700; g.fillStyle = i % 2 ? "rgba(63,107,74,0.55)" : "rgba(44,75,54,0.45)"; g.beginPath(); g.ellipse(x, y, 140 + rnd(i) * 120, 50 + rnd(i * 2) * 40, -0.3, 0, TAU); g.fill(); }
  for (let i = 0; i < 40; i++) { const x = 30 + rnd(i * 1.7) * 600, y = 260 + rnd(i * 2.9) * 640; if (Math.hypot(x - FX, y - FY) < 150) continue; g.fillStyle = K.mtnD; g.strokeStyle = K.ink; g.lineWidth = 2;
    g.beginPath(); g.moveTo(x - 22, y); g.lineTo(x, y - 30); g.lineTo(x + 22, y); g.closePath(); g.fill(); g.stroke(); }
  g.restore();
  // sea wave lines (static)
  g.strokeStyle = "rgba(240,234,220,0.7)"; g.lineWidth = 2.2; g.lineCap = "round";
  for (let i = 0; i < 90; i++) { const x = rnd(i * 2.2) * 1300 - 110, y = 1150 + rnd(i * 4.4) * 900; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 30, y - 10, x + 60, y); g.quadraticCurveTo(x + 90, y + 10, x + 120, y); g.stroke(); }
  // compass rose
  g.save(); g.translate(150, 1760); g.strokeStyle = K.cream; g.fillStyle = K.cream; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 60, 0, TAU); g.stroke();
  g.beginPath(); g.moveTo(0, -80); g.lineTo(12, 0); g.lineTo(0, 80); g.lineTo(-12, 0); g.closePath(); g.fill(); g.font = "34px LSerif"; g.textAlign = "center"; g.fillText("N", 0, -92); g.restore();
  // Fuji icon
  fuji(g, FX, FY + 40, 120, 150, { lw: 3, snow: 0.35 });
});
ctx.save(); cam(540, 960, z, 0); ctx.drawImage(base, -110, -140);
// route (dashed red line) Fuji → Edo with distance
if (rt > 0) {
  ctx.save(); ctx.strokeStyle = K.red; ctx.lineWidth = 6; ctx.setLineDash([22, 14]); ctx.lineDashOffset = -t * 30;
  const k = eout(rt), ex = lerp(FX + 40, TX, k), ey = lerp(FY - 160, TY, k); ctx.beginPath(); ctx.moveTo(FX + 40, FY - 160); ctx.quadraticCurveTo(lerp(FX + 40, 560, k), lerp(FY - 160, 700, k), ex, ey); ctx.stroke(); ctx.restore();
}
// ash cloud drifting east (west winds)
if (dr > 0) {
  ctx.save(); ctx.lineWidth = 2.6; ctx.strokeStyle = K.ink;
  const n = 18; for (let i = 0; i < n; i++) { const u = i / (n - 1); if (u > dr * 1.15) continue; const x = lerp(FX + 30, TX + 60, u) + Math.sin(t + i) * 8, y = lerp(FY - 170, TY - 40, u) - Math.sin(u * Math.PI) * 120 + Math.cos(i * 2.1) * 30;
    const r = 40 + 70 * u * (0.8 + 0.4 * rnd(i)); ctx.globalAlpha = 0.95; billow(ctx, x, y, r, 0); }
  ctx.restore();
  // ash dots falling on the city
  if (dr > 0.8) { ctx.save(); ctx.beginPath(); ctx.rect(TX - 140, TY - 60, 300, 200); ctx.clip(); ashFall(ctx, 0.5, TX - 140, TY - 60, 300, 200, 7, 60, "rgba(60,56,50,0.8)"); ctx.restore(); }
}
// city marker
ctx.fillStyle = K.red; ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(TX, TY, 16, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = K.cream; ctx.beginPath(); ctx.arc(TX, TY, 6, 0, TAU); ctx.fill();
ctx.restore();
const lk = p.labk || 0;
const nm = (p.name || 0) > 0.5;
plaque(ctx, TX - 60, 560, nm ? [{ t: "TOKYO", s: 60, sp: 6 }, { t: "14 MILLION PEOPLE", s: 24, sp: 6 }] : [{ t: "EDO", s: 60, sp: 8 }, { t: "1707", s: 26, sp: 8 }], lk, { minW: 250 });
plaque(ctx, 250, 1045, [{ t: "MT FUJI", s: 34, sp: 6 }], lk);
if (rt > 0.4) plaque(ctx, 560, 1000, [{ t: "100 km", s: 72, c: K.red }], cl((rt - 0.4) / 0.4));
finish(ctx);
