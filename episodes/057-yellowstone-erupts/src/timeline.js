// Hand-scroll timeline of Yellowstone's three caldera-forming eruptions. p: cx (camera x in world), zoom, pop (markers appeared 0..3), labk, sid
const z = p.zoom || 1, cx = p.cx || 540, pop = p.pop ?? 3;
const X = (ma) => 260 + (2.1 - ma) / 2.1 * 2200, AY = 930;
const EV = [{ ma: 2.1, v: 2450, n: "HUCKLEBERRY RIDGE", d: "2.1 MILLION" }, { ma: 1.3, v: 280, n: "MESA FALLS", d: "1.3 MILLION" }, { ma: 0.631, v: 1000, n: "LAVA CREEK", d: "631,000" }];
const bg = cached("tlBg", 1080, 1920, (g) => { bokashi(g, 0, 1920, [[0, "#16284A"], [0.5, "#2D4F82"], [1, "#16284A"]]); waveLines(g, 1300, 1920, 50, 9, "rgba(240,234,220,0.35)"); });
const strip = cached("tlStrip", 2800, 900, (g) => {
  g.translate(0, -560);
  g.fillStyle = "rgba(10,14,28,0.4)"; g.fillRect(40 + 10, 620 + 12, 2700, 640);
  g.fillStyle = K.cream; g.fillRect(40, 620, 2700, 640); g.strokeStyle = K.ink; g.lineWidth = 4; g.strokeRect(42, 622, 2696, 636); g.lineWidth = 1.5; g.strokeRect(54, 634, 2672, 612);
  // rollers
  [30, 2750].forEach((x) => { g.fillStyle = K.wood; g.fillRect(x - 22, 590, 44, 700); g.strokeStyle = K.ink; g.lineWidth = 3; g.strokeRect(x - 22, 590, 44, 700); });
  // axis
  g.strokeStyle = K.ink; g.lineWidth = 5; g.beginPath(); g.moveTo(140, AY); g.lineTo(2600, AY); g.stroke();
  for (let ma = 2.0; ma >= 0; ma -= 0.1) { const x = X(ma), big = Math.abs(ma * 10 - Math.round(ma * 2) * 5) < 0.01; g.lineWidth = big ? 4 : 2; g.beginPath(); g.moveTo(x, AY - (big ? 22 : 12)); g.lineTo(x, AY + (big ? 22 : 12)); g.stroke(); }
  g.fillStyle = K.ink; g.font = "34px LSerif"; g.textAlign = "center"; g.fillText("TODAY", X(0), AY + 82);
  // today: geyser + bison icon
  bison(g, X(0) - 60, AY - 4, 0.6, 1, 0);
});
ctx.drawImage(bg, 0, 0);
ctx.save(); cam(cx, 960, z, 0);
ctx.drawImage(strip, 0, 560);
geyser(ctx, X(0) + 40, AY - 30, 180, 0.8, 5);
EV.forEach((e, i) => {
  const k = cl(pop - i); if (k <= 0) return; const x = X(e.ma), kk = eback(k);
  // mini volcano + plume sized by volume
  ctx.save(); ctx.translate(x, AY - 40); ctx.scale(kk, kk);
  ctx.fillStyle = K.mtnD; ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(-24, -70); ctx.lineTo(24, -70); ctx.lineTo(90, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  const hgt = 120 + Math.sqrt(e.v) * 6.5; plume(ctx, 0, -70, hgt, cl(k * 1.2), 0.05, 0.35 + e.v / 4000, 3 + i, i === 2 ? 0 : 1);
  ctx.restore();
  // red seal + labels
  ctx.save(); ctx.globalAlpha = cl(k * 2); ctx.fillStyle = K.red; ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, AY, 18, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.textAlign = "center"; ctx.fillStyle = K.red; ctx.font = "50px LSerif"; ctx.fillText(e.d, x, AY + 82); ctx.fillStyle = K.ink; ctx.font = "26px LSerif"; ctx.letterSpacing = "5px"; ctx.fillText("YEARS AGO", x, AY + 118); ctx.fillText(e.n, x, AY + 152);
  ctx.fillStyle = K.red; ctx.font = "34px LSerif"; ctx.fillText((e.v === 2450 ? "2,450" : e.v === 1000 ? "1,000" : "280") + " km³", x, AY + 200); ctx.letterSpacing = "0px"; ctx.restore();
});
ctx.restore();
const lk = p.labk || 0;
if (p.lab === 1) plaque(ctx, 540, 150, [{ t: "THE LAST ONE: LAVA CREEK", s: 48, sp: 3 }, { t: "631,000 YEARS AGO", s: 72, c: K.red }], lk);
finish(ctx);
