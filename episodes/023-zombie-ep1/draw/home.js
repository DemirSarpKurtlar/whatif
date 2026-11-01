// you, home alone; the power goes out. p: power 1..0, siren, zoom, cx, cy, light (phone)
cam(p.cx || W / 2, p.cy || 1000, p.zoom || 1, p.shake || 0);
const pw = p.power ?? 1;
rr(-W, -H, W * 3, H * 3, 0, pw > 0.5 ? "#3B3F8F" : "#1A1D49");
rr(-W, 1450, W * 3, H, 0, pw > 0.5 ? "#2B2F75" : "#13163A");
// window with the street outside
rr(560, 520, 420, 520, 14, "#12163F"); rr(578, 538, 384, 484, 8, "#1D2466");
ctx.save(); ctx.beginPath(); ctx.rect(578, 538, 384, 484); ctx.clip();
for (let i = 0; i < 4; i++) rr(590 + i * 96, 700 + rnd(i) * 120, 80, 400, 4, "#2C3382");
if (p.siren) siren(770, 900, p.siren);
ctx.restore(); rr(762, 530, 16, 500, 4, "#12163F"); rr(570, 772, 400, 16, 4, "#12163F");
// lamp + sofa
rr(80, 1180, 360, 170, 40, pw > 0.5 ? "#6C43D4" : "#2E2470"); rr(60, 1260, 400, 140, 40, pw > 0.5 ? "#7A52E0" : "#34297C");
rr(420, 1010, 14, 400, 6, "#1B2050"); ctx.fillStyle = pw > 0.5 ? "#FFE9A3" : "#2B3068"; ctx.beginPath(); ctx.moveTo(370, 1010); ctx.lineTo(484, 1010); ctx.lineTo(460, 940); ctx.lineTo(394, 940); ctx.closePath(); ctx.fill();
if (pw > 0.5) { const g = ctx.createRadialGradient(427, 1000, 10, 427, 1000, 520); g.addColorStop(0, "rgba(255,226,140,0.35)"); g.addColorStop(1, "rgba(255,226,140,0)"); ctx.fillStyle = g; ctx.fillRect(-100, 500, 1100, 1100); }
person(300, 1560, 1.15, { pose: p.light ? "phone" : "idle", light: p.light, mouth: pw > 0.5 ? "" : "o", look: 0.6 });
if (pw <= 0.5) { ctx.fillStyle = "rgba(5,6,22,0.35)"; ctx.fillRect(-W, -H, W * 3, H * 3); }
