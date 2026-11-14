// Cut-away: Yellowstone surface above, the shallow magma reservoir as a crystal mush (5-15% melt) below.
// p: zoom, cx, cy, cut (0..1 reveal crust), glow (melt pulse), labk (top), lab2k (melt plaque), sid
const z = p.zoom || 1, cx = p.cx || 540, cy = p.cy || 960, GY = 470, RX = 540, RY = 880, rx = 430, ry = 165;
const lensPath = (g, x, y, a, b) => { g.beginPath(); for (let i = 0; i <= 60; i++) { const u = i / 60 * TAU; const k = 1 + 0.06 * Math.sin(u * 3 + 1) + 0.04 * Math.sin(u * 7); g.lineTo(x + Math.cos(u) * a * k, y + Math.sin(u) * b * k * (Math.sin(u) > 0 ? 0.8 : 1.1)); } g.closePath(); };
const sec = cached("chSec", 1400, 2300, (g) => {
  g.translate(160, 190);
  skyDay(g, GY, "#2A3550");
  snowRidge(g, GY - 60, 150, 3.1, K.mtnL, 1.0);
  // crust strata
  const bands = ["#B89A6A", "#A88B5E", "#9A7E55", "#8B714D", "#7C6545", "#6E593D", "#5E4B33"];
  for (let i = 0; i < 18; i++) { const y = GY + i * 100; g.fillStyle = bands[i % bands.length]; g.beginPath(); g.moveTo(-160, y); for (let x = -160; x <= 1240; x += 40) g.lineTo(x, y + Math.sin(x * 0.006 + i * 1.7) * 18); g.lineTo(1240, y + 140); g.lineTo(-160, y + 140); g.closePath(); g.fill();
    g.strokeStyle = "rgba(27,34,51,0.45)"; g.lineWidth = 2; g.beginPath(); for (let x = -160; x <= 1240; x += 40) { const yy = y + Math.sin(x * 0.006 + i * 1.7) * 18; x === -160 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
  g.fillStyle = "rgba(27,34,51,0.25)"; for (let i = 0; i < 900; i++) g.fillRect(rnd(i * 1.9) * 1400 - 160, GY + 20 + rnd(i * 3.3) * 1800, 3, 3);
  // surface: sage strip + pines + sinter
  g.fillStyle = K.sage; g.fillRect(-160, GY - 6, 1400, 26); g.strokeStyle = K.ink; g.lineWidth = 4; g.beginPath(); g.moveTo(-160, GY - 6); g.lineTo(1240, GY - 6); g.stroke();
  pineBand(g, GY - 4, 34, 40, 90, 21, K.pineD, K.pine, -160, 360); pineBand(g, GY - 4, 30, 40, 90, 27, K.pineD, K.pine, 760, 1240);
  g.fillStyle = K.sinter; g.beginPath(); g.ellipse(560, GY - 4, 130, 12, 0, 0, TAU); g.fill();
  // hydrothermal plumbing (cream cracks) from the reservoir to the surface
  g.strokeStyle = "rgba(241,230,204,0.75)"; g.lineWidth = 4; g.setLineDash([14, 10]);
  [[430, 560], [560, 560], [690, 640]].forEach(([x0, x1], i) => { g.beginPath(); g.moveTo(x0, RY - ry + 20); g.bezierCurveTo(x0 + 40, 700, x1 - 50, 600, x1, GY); g.stroke(); });
  g.setLineDash([]);
  // deep reservoir hint (bigger, dimmer, ~2% melt)
  lensPath(g, 540, 1720, 620, 190); g.fillStyle = "#5A3A2E"; g.fill(); g.strokeStyle = K.ink; g.lineWidth = 3; g.stroke();
  g.save(); lensPath(g, 540, 1720, 620, 190); g.clip(); g.fillStyle = "rgba(200,180,150,0.55)"; for (let i = 0; i < 600; i++) { g.save(); g.translate(rnd(i * 2.3) * 1300 - 110, 1500 + rnd(i * 4.1) * 440); g.rotate(rnd(i) * 3); g.fillRect(-11, -6, 22, 12); g.restore(); } g.restore();
  // shallow reservoir: red melt + packed crystals
  lensPath(g, RX, RY, rx, ry); g.fillStyle = K.lavaD; g.fill();
  g.save(); lensPath(g, RX, RY, rx, ry); g.clip();
  const sp = 30; for (let r = 0; r * sp * 0.866 < 2 * ry + 120; r++) for (let c = -1; c * sp < 2 * rx + 60; c++) {
    const x = RX - rx - 30 + c * sp + (r % 2) * sp / 2, y = RY - ry - 60 + r * sp * 0.866; const s = sp * 0.53 * (0.97 + 0.03 * rnd(r * 31 + c)); const rot = Math.PI / 6 + (rnd(r * 7 + c * 3) - 0.5) * 0.08;
    g.fillStyle = ["#E9DFC8", "#D7CDB6", "#C9C2B4", "#EFE6D2"][(r * 3 + c) % 4]; g.beginPath(); for (let k = 0; k < 6; k++) { const a = rot + k / 6 * TAU; g.lineTo(x + Math.cos(a) * s, y + Math.sin(a) * s); } g.closePath(); g.fill(); g.strokeStyle = "rgba(27,34,51,0.35)"; g.lineWidth = 1.2; g.stroke(); }
  g.restore();
  lensPath(g, RX, RY, rx, ry); g.strokeStyle = K.ink; g.lineWidth = 4; g.stroke();
});
ctx.save(); cam(cx, cy, z, 0);
ctx.drawImage(sec, -160, -190);
// melt glow pulse in the gaps
const gp = (p.glow || 0) * (0.6 + 0.4 * Math.sin(t * 3)); if (gp > 0) { ctx.save(); lensPath(ctx, RX, RY, rx, ry); ctx.clip(); ctx.globalCompositeOperation = "screen"; const rg = ctx.createRadialGradient(RX, RY, 0, RX, RY, rx); rg.addColorStop(0, `rgba(255,140,60,${0.35 * gp})`); rg.addColorStop(1, "rgba(255,140,60,0)"); ctx.fillStyle = rg; ctx.fillRect(RX - rx, RY - ry * 1.3, rx * 2, ry * 2.6); ctx.restore(); }
geyser(ctx, 560, GY - 6, 230, 0.6, 9);
bison(ctx, 860, GY - 4, 0.55, -1, 1); bison(ctx, 240, GY - 4, 0.5, 1, 2);
ctx.restore();
const lk = p.labk || 0;
plaque(ctx, 540, 110, [{ t: "UNDER YELLOWSTONE", s: 56, sp: 4 }, { t: "THE MAGMA RESERVOIR, 5–17 km DOWN", s: 26, sp: 4 }], lk);
plaque(ctx, 540, 1450, [{ t: "ONLY 5–15% MELT", s: 76, c: K.red }, { t: "THE REST IS SOLID CRYSTAL", s: 30, sp: 6 }], p.lab2k || 0);
finish(ctx);
