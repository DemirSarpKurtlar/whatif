// Yellowstone geyser basin, woodblock print. p: zoom, cx, cy, shake, gey (Old Faithful 0..1), erupt (super-eruption 0..1), dark (ash sky 0..1),
// blast (hydrothermal explosion 0..1), lava (lava flow 0..1), lab (0 none | 1 YELLOWSTONE | 2 3 SUPER-ERUPTIONS | 3 MORE LIKELY | 4 OLD FAITHFUL), labk, sid
const z = p.zoom || 1, cy = p.cy || 960, cx = p.cx || 540, er = p.erupt || 0, dk = p.dark || 0;
const OFX = 640, OFY = 1075, SPX = 250, SPY = 1150;
const far = cached("parkFar", 1400, 2300, (g) => {
  g.translate(160, 190);
  skyDay(g, 1000);
  snowRidge(g, 700, 260, 1.3, K.mtnL, 0.9);
  snowRidge(g, 830, 200, 4.2, K.mtn, 1.2);
});
const near = cached("parkNear", 1400, 2300, (g) => {
  g.translate(160, 190);
  ridge(g, 975, 95, 6.1, K.forest, K.ink, 0, 1.0);
  pineBand(g, 940, 70, 40, 80, 3, K.pineD, K.pine, -160, 1240);
  // caldera plain: sage with ochre hatch
  g.fillStyle = K.sage; g.fillRect(-160, 990, 1400, 1400); g.strokeStyle = K.ink; g.lineWidth = 3; g.beginPath(); g.moveTo(-160, 990); g.lineTo(1240, 990); g.stroke();
  g.strokeStyle = "rgba(111,124,85,0.8)"; g.lineWidth = 2; for (let i = 0; i < 260; i++) { const x = rnd(i * 2.3) * 1400 - 160, y = 1000 + Math.pow(rnd(i * 4.1), 0.7) * 1100; const l = 6 + (y - 990) * 0.03; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l * 0.3, y - l); g.moveTo(x + 5, y); g.lineTo(x + 2, y - l * 0.8); g.stroke(); }
  // sinter (white geyserite) apron around Old Faithful + steam vents' crust
  g.fillStyle = K.sinter; g.beginPath(); g.ellipse(OFX, OFY + 8, 300, 46, 0, 0, TAU); g.fill(); g.strokeStyle = "rgba(27,34,51,0.5)"; g.lineWidth = 2; g.stroke();
  g.fillStyle = "#D8CDB4"; g.beginPath(); g.ellipse(OFX, OFY, 60, 14, 0, 0, TAU); g.fill(); g.stroke();
  g.fillStyle = K.ochre; g.globalAlpha = 0.6; g.beginPath(); g.ellipse(OFX + 120, OFY + 20, 120, 16, 0, 0, TAU); g.fill(); g.globalAlpha = 1;
  spring(g, SPX, SPY, 190, 42);
  // boardwalk
  g.strokeStyle = K.wood; g.lineWidth = 8; g.beginPath(); g.moveTo(-160, 1250); g.quadraticCurveTo(300, 1215, 520, 1150); g.quadraticCurveTo(800, 1090, 1240, 1110); g.stroke();
  g.strokeStyle = "rgba(27,34,51,0.6)"; g.lineWidth = 1.5; for (let x = -150; x < 1240; x += 22) { const y = x < 520 ? 1250 - (x + 160) / 680 * 100 : 1150 - (x - 520) / 720 * 40; g.beginPath(); g.moveTo(x, y - 4); g.lineTo(x + 3, y + 4); g.stroke(); }
});
const fg = cached("parkFG", 1400, 2300, (g) => {
  g.translate(160, 190);
  // foreground grass bank
  g.fillStyle = K.forest; g.beginPath(); g.moveTo(-160, 1560); g.quadraticCurveTo(300, 1500, 600, 1540); g.quadraticCurveTo(900, 1580, 1240, 1520); g.lineTo(1240, 2200); g.lineTo(-160, 2200); g.closePath(); g.fill(); g.strokeStyle = K.ink; g.lineWidth = 3; g.stroke();
  g.strokeStyle = "rgba(241,230,204,0.25)"; g.lineWidth = 2; for (let i = 0; i < 160; i++) { const x = rnd(i * 3.9) * 1400 - 160, y = 1570 + rnd(i * 6.1) * 520; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 6, y - 14, x + 14, y - 24); g.stroke(); }
  // framing lodgepoles
  [[-40, 2100, 1250], [70, 2140, 1050], [-110, 2000, 900], [1010, 2100, 1200], [1120, 2050, 1000], [930, 2150, 820]].forEach(([x, yb, h]) => lpine(g, x, yb, h, "#1A3027", "#25463A"));
});
ctx.save(); cam(cx, cy, z, p.shake || 0);
ctx.drawImage(far, -160, -190);
if (dk > 0) { ctx.save(); ctx.globalAlpha = dk * 0.8; bokashi(ctx, -400, 990, [[0, "#26221E"], [0.65, "#57514A"], [1, "rgba(120,110,95,0.3)"]]); ctx.restore(); }
// super-eruption: several columns rising from the caldera rim behind the forest ridge
if (er > 0) {
  const gl = cl(er * 2); const rg = ctx.createRadialGradient(540, 940, 0, 540, 940, 600); rg.addColorStop(0, `rgba(255,150,70,${0.75 * gl})`); rg.addColorStop(1, "rgba(200,60,30,0)"); ctx.fillStyle = rg; ctx.fillRect(-100, 300, 1300, 700);
  plume(ctx, 230, 950, 1050, cl(er * 1.25), 0.1, 1.15, 2, 1);
  plume(ctx, 850, 950, 1050, cl(er * 1.25 - 0.08), -0.08, 1.15, 7, 1);
  plume(ctx, 540, 960, 1150, er, 0.04, 1.45, 4, 0);
}
ctx.drawImage(near, -160, -190);
// lava flow: glowing tongue down the forest ridge onto the plain (right)
const lv = p.lava || 0;
if (lv > 0) {
  // flat lava lobe spreading on the plain at the foot of the forest ridge (seen in perspective), fed by a channel
  const k = eout(lv), LX = 860, LY = 1035;
  ctx.save(); ctx.lineJoin = "round"; ctx.strokeStyle = K.ink; ctx.lineWidth = 3;
  ctx.fillStyle = K.lavaD; ctx.beginPath(); ctx.moveTo(LX + 70, 975); ctx.lineTo(LX + 110, 975);
  for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI; const r = (0.92 + 0.07 * Math.sin(i * 2.7)) * k; ctx.lineTo(LX + Math.cos(a) * 190 * r, LY + Math.sin(a) * 60 * r); }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = K.lava; ctx.beginPath(); ctx.moveTo(LX + 80, 978); ctx.lineTo(LX + 100, 978); for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI; const r = (0.62 + 0.05 * Math.sin(i * 2.7 + 1)) * k; ctx.lineTo(LX + 10 + Math.cos(a) * 150 * r, LY + Math.sin(a) * 42 * r); } ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "rgba(40,20,15,0.75)"; ctx.lineWidth = 3; for (let j = 1; j <= 3; j++) { const r = j / 4; ctx.beginPath(); for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI; const rr2 = (0.92 + 0.07 * Math.sin(i * 2.7)) * k * r; const x = LX + Math.cos(a) * 190 * rr2, y = LY + Math.sin(a) * 60 * rr2 + Math.sin(i * 3 + j) * 3; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  const rg = ctx.createRadialGradient(LX, LY, 0, LX, LY, 260); rg.addColorStop(0, `rgba(255,170,90,${0.3 * k})`); rg.addColorStop(1, "rgba(255,120,60,0)"); ctx.fillStyle = rg; ctx.fillRect(LX - 260, LY - 260, 520, 520); ctx.restore();
  for (let i = 0; i < 5; i++) { const ph = (t * 0.35 + i / 5) % 1; steam(ctx, LX - 120 + i * 60 + ph * 20, LY - 10 - ph * 150, 14 + ph * 24, (1 - ph) * 0.75 * k); }
}
// Old Faithful + small fumaroles
geyser(ctx, OFX, OFY, 600, p.gey || 0, 3);
[[420, 1040], [880, 1060], [140, 1090]].forEach(([x, y], i) => { for (let j = 0; j < 3; j++) { const ph = (t * 0.3 + j / 3 + i * 0.2) % 1; steam(ctx, x + ph * 40, y - ph * 110, 10 + ph * 22, (1 - ph) * 0.7); } });
// hydrothermal explosion at the hot spring
const bl = p.blast || 0;
if (bl > 0) {
  const k = eout(cl(bl * 1.4)), fade = cl((1 - bl) * 3);
  ctx.save(); ctx.globalAlpha = fade; ctx.lineWidth = 2.4; ctx.strokeStyle = K.ink;
  for (let i = 12; i >= 0; i--) { const u = i / 12; const y = SPY - 470 * k * u, r = (30 + 70 * u) * k; billow(ctx, SPX + Math.sin(i * 1.7) * 18 + u * 40, y, r, i % 3 === 0); steam(ctx, SPX + 40 + u * 70, y - r * 0.5, r * 0.6, 0.9); }
  ctx.fillStyle = "#5B564E"; for (let i = 0; i < 18; i++) { const a = -Math.PI / 2 + (rnd(i * 3.3) - 0.5) * 2.2, v = 300 + rnd(i) * 300, tt = bl * 1.2; const x = SPX + Math.cos(a) * v * tt, y = SPY + Math.sin(a) * v * tt + 500 * tt * tt; if (y < SPY + 20) { ctx.beginPath(); ctx.rect(x - 6, y - 6, 10 + rnd(i) * 8, 9 + rnd(i * 2) * 6); ctx.fill(); ctx.stroke(); } }
  ctx.restore();
}
// mist band
band(ctx, -300 + lt * 14 + Math.sin(t * 0.2) * 30, 900, 520, 40, K.cream, 0.9);
band(ctx, 700 - lt * 10, 960, 520, 34, K.cream2, 0.85);
// bison in the foreground meadow
ctx.drawImage(fg, -160, -190);
const bx = p.bx || 0;
bison(ctx, 330 + bx, 1700, 1.9, 1, 0.3); bison(ctx, 760 + bx * 0.7, 1625, 1.25, -1, 1.7); bison(ctx, 560 + bx * 0.8, 1810, 2.3, -1, 2.9);
if (er > 0.2) ashFall(ctx, cl((er - 0.2) * 1.4) * (0.5 + dk), -300, -300, 1700, 2500, 5, 130);
ctx.restore();
const lk = p.labk || 0;
if (p.lab === 1) plaque(ctx, 540, 140, [{ t: "YELLOWSTONE", s: 72, sp: 6 }, { t: "WYOMING · USA", s: 28, sp: 10 }], lk);
else if (p.lab === 2) plaque(ctx, 540, 140, [{ t: "3 SUPER-ERUPTIONS", s: 64, c: K.red, sp: 2 }, { t: "IN 2.1 MILLION YEARS", s: 30, sp: 8 }], lk);
else if (p.lab === 3) { plaque(ctx, 540, 120, [{ t: "FAR MORE LIKELY", s: 56, sp: 4 }], lk);
  plaque(ctx, 270, 1470, [{ t: "STEAM BLAST", s: 42, c: K.red, sp: 2 }], cl(lk * 1.4 - 0.2)); plaque(ctx, 810, 1470, [{ t: "LAVA FLOW", s: 42, c: K.red, sp: 2 }], cl(lk * 1.4 - 0.4)); }
else if (p.lab === 4) plaque(ctx, 540, 140, [{ t: "OLD FAITHFUL", s: 72, sp: 6 }, { t: "STILL ERUPTING · STILL VISITED", s: 26, sp: 6 }], lk);
finish(ctx);
