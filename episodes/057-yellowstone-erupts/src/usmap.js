// Woodblock map of North America: ash fall bull's-eye from a modelled Yellowstone super-eruption (after Mastin et al. 2014, USGS).
// p: zoom, cx, cy, spread (0..1 ash zones grow), mpls (Minneapolis marker 0..1), labk, legk, sid
const z = p.zoom || 1, cy0 = p.cy || 960, cx0 = p.cx || 540, sp = p.spread || 0;
const PJ = (lon, lat) => [540 + (lon + 95.8) * 18.1, 780 - (lat - 38) * 23];
const US = [-124.7,48.4,-123.2,49,-95.2,49,-95.2,49.4,-89.6,48.0,-84.8,46.5,-83.5,46.1,-82.5,43.0,-79.0,43.3,-76.8,43.6,-75,45,-71.5,45,-70,46.7,-67.8,47.1,-67,44.8,-70.2,43.6,-70.6,42.6,-70,41.7,-71.9,41.3,-74,40.6,-74.9,38.9,-75.6,38,-76.0,37,-75.6,35.5,-77.9,33.9,-79.9,32.6,-81.4,30.7,-80.6,28.4,-80.1,25.4,-81.1,25.2,-82.6,27.8,-82.8,29.2,-84.3,30.0,-86.3,30.4,-88.9,30.4,-89.6,29.2,-91.5,29.5,-93.8,29.7,-95.0,29.0,-97.2,27.6,-97.2,25.9,-99.1,26.4,-101.0,29.8,-103.0,29.0,-104.6,29.9,-106.5,31.8,-108.2,31.8,-111.1,31.3,-114.8,32.5,-117.1,32.5,-118.5,34.0,-120.6,34.6,-121.9,36.6,-122.5,37.8,-123.8,39.8,-124.2,41.8,-124.5,43,-124.0,46.3];
const CA = [-140,49,-123.2,49,-95.2,49,-95.2,49.4,-89.6,48.0,-84.8,46.5,-83.5,46.1,-82.5,43.0,-79.0,43.3,-76.8,43.6,-75,45,-71.5,45,-70,46.7,-67.8,47.1,-67,44.8,-64,45.3,-61,45.6,-59.5,47.5,-56,51.5,-55,60,-140,60];
const MX = [-117.1,32.5,-114.8,32.5,-111.1,31.3,-108.2,31.8,-106.5,31.8,-104.6,29.9,-103.0,29.0,-101.0,29.8,-99.1,26.4,-97.2,25.9,-97.7,21.5,-96.5,19,-105.5,19,-108,22,-112,27,-114.7,30.5,-116.5,31.5];
const LAKES = [[-87.6, 47.6, 3.2, 0.75, 0.15], [-87.0, 43.9, 0.6, 2.0, 0], [-82.4, 44.8, 1.0, 1.4, -0.3], [-81.2, 42.2, 2.0, 0.45, -0.35], [-77.8, 43.6, 1.3, 0.35, 0]];
const path = (g, A) => { g.beginPath(); for (let i = 0; i < A.length; i += 2) { const [x, y] = PJ(A[i], A[i + 1]); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.closePath(); };
const YS = PJ(-110.6, 44.5), MP = PJ(-93.27, 44.98), DM = PJ(-93.6, 41.6);
const base = cached("mapBase", 1400, 2300, (g) => {
  g.translate(160, 190);
  g.fillStyle = K.indigo; g.fillRect(-160, -190, 1400, 2300);
  g.strokeStyle = "rgba(240,234,220,0.6)"; g.lineWidth = 2.2; g.lineCap = "round";
  for (let i = 0; i < 160; i++) { const x = rnd(i * 2.2) * 1400 - 160, y = rnd(i * 4.4) * 2300 - 190; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 22, y - 8, x + 44, y); g.quadraticCurveTo(x + 66, y + 8, x + 88, y); g.stroke(); }
  [CA, MX].forEach((A) => { path(g, A); g.fillStyle = K.cream2; g.fill(); g.strokeStyle = K.ink; g.lineWidth = 3; g.stroke(); });
  path(g, US); g.fillStyle = K.cream; g.fill(); g.strokeStyle = K.ink; g.lineWidth = 4; g.stroke();
  g.save(); path(g, US); g.clip(); g.lineWidth = 22; g.strokeStyle = "rgba(217,192,143,0.6)"; path(g, US); g.stroke();
  // Rockies: little mountain glyphs
  for (let i = 0; i < 46; i++) { const lon = -114 + rnd(i * 3.1) * 9 + (rnd(i) - 0.5) * 2, lat = 33 + rnd(i * 5.7) * 15; const [x, y] = PJ(lon - (lat - 33) * 0.25, lat); g.fillStyle = K.mtnD; g.strokeStyle = K.ink; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x - 13, y); g.lineTo(x, y - 18); g.lineTo(x + 13, y); g.closePath(); g.fill(); g.stroke(); }
  g.restore();
  LAKES.forEach(([lo, la, rx, ry, rot]) => { const [x, y] = PJ(lo, la); g.fillStyle = K.indigo2; g.strokeStyle = K.ink; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, rx * 18.1, ry * 23, rot, 0, TAU); g.fill(); g.stroke(); });
  // compass rose
  g.save(); g.translate(150, 1180); g.strokeStyle = K.cream; g.fillStyle = K.cream; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 50, 0, TAU); g.stroke();
  g.beginPath(); g.moveTo(0, -66); g.lineTo(10, 0); g.lineTo(0, 66); g.lineTo(-10, 0); g.closePath(); g.fill(); g.font = "30px LSerif"; g.textAlign = "center"; g.fillText("N", 0, -76); g.restore();
});
// ash zones: noisy bull's-eye centred a little east (downwind) of Yellowstone
function blob(g, r, seed, east) { g.beginPath(); for (let i = 0; i <= 64; i++) { const a = i / 64 * TAU; const n = 1 + 0.12 * Math.sin(a * 3 + seed) + 0.07 * Math.sin(a * 7 + seed * 2) + (Math.cos(a) > 0 ? east * Math.cos(a) : 0);
  const x = YS[0] + Math.cos(a) * r * n + r * east * 0.3, y = YS[1] + Math.sin(a) * r * n * 0.82; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.closePath(); }
const ZN = [[640, "rgba(150,143,130,0.42)", 1.1, 0.25], [345, "rgba(115,109,99,0.6)", 2.3, 0.2], [150, "rgba(85,80,72,0.75)", 3.7, 0.15], [55, "rgba(50,46,40,0.9)", 5.1, 0.1]];
ctx.save(); cam(cx0, cy0, z, 0);
ctx.drawImage(base, -160, -190);
if (sp > 0) {
  ctx.save(); path(ctx, US); path(ctx, CA); path(ctx, MX); ctx.beginPath(); [US, CA, MX].forEach((A) => { for (let i = 0; i < A.length; i += 2) { const [x, y] = PJ(A[i], A[i + 1]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); }); ctx.clip();
  ZN.forEach(([r, c, seed, east], i) => { const k = eout(cl(sp * 1.6 - (3 - i) * 0.16)); if (k <= 0) return; blob(ctx, r * k, seed, east); ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = "rgba(27,34,51,0.45)"; ctx.lineWidth = 2; ctx.setLineDash([8, 7]); ctx.stroke(); ctx.setLineDash([]); });
  // stipple
  ctx.fillStyle = "rgba(45,42,38,0.55)"; const R = 640 * eout(cl(sp * 1.6 - 0.48)); for (let i = 0; i < 700; i++) { const a = rnd(i * 1.3) * TAU, d = Math.pow(rnd(i * 2.9), 1.6) * R; ctx.fillRect(YS[0] + Math.cos(a) * d + d * 0.12, YS[1] + Math.sin(a) * d * 0.8, 3, 3); }
  ctx.restore();
  ashFall(ctx, cl(sp * 1.2) * 0.4, -300, -300, 1700, 2500, 4, 70, "rgba(60,56,50,0.6)");
}
// Yellowstone marker (red seal with volcano glyph)
ctx.fillStyle = K.red; ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(YS[0], YS[1], 17, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = K.cream; ctx.beginPath(); ctx.moveTo(YS[0] - 9, YS[1] + 6); ctx.lineTo(YS[0], YS[1] - 8); ctx.lineTo(YS[0] + 9, YS[1] + 6); ctx.closePath(); ctx.fill();
const mk = p.mpls || 0;
if (mk > 0) { ctx.save(); ctx.globalAlpha = cl(mk * 2); [[MP, "MINNEAPOLIS"], [DM, "DES MOINES"]].forEach(([P, n], i) => { ctx.fillStyle = K.cream; ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(P[0], P[1], 10, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.font = "28px LSerif"; ctx.letterSpacing = "3px"; ctx.textAlign = "left"; const w = ctx.measureText(n).width; ctx.fillStyle = "rgba(241,230,204,0.92)"; ctx.fillRect(P[0] + 18, P[1] - 22 + i * 6, w + 16, 36); ctx.strokeRect(P[0] + 18, P[1] - 22 + i * 6, w + 16, 36); ctx.fillStyle = K.ink; ctx.fillText(n, P[0] + 26, P[1] + 5 + i * 6); });
  ctx.letterSpacing = "0px"; ctx.restore(); }
ctx.restore();
const lk = p.labk || 0;
plaque(ctx, 540, 120, [{ t: "IF IT ERUPTED: ASH FALL", s: 50, sp: 3 }, { t: "USGS COMPUTER MODEL, 2014", s: 26, sp: 6 }], lk);
plaque(ctx, YS[0] - 30, YS[1] - 150, [{ t: "YELLOWSTONE", s: 30, sp: 3 }], lk);
// legend (cream plaque with ash swatches)
const lg = p.legk || 0;
if (lg > 0 && !isHook()) { ctx.save(); const x0 = 170, y0 = 1450, w = 740, h = 250; ctx.globalAlpha = cl(lg * 2); ctx.translate(540, y0 + h / 2); ctx.scale(1, eback(lg)); ctx.translate(-540, -(y0 + h / 2));
  ctx.fillStyle = "rgba(27,34,51,0.35)"; ctx.fillRect(x0 + 7, y0 + 8, w, h); ctx.fillStyle = K.cream; ctx.fillRect(x0, y0, w, h); ctx.strokeStyle = K.ink; ctx.lineWidth = 4; ctx.strokeRect(x0 + 2, y0 + 2, w - 4, h - 4); ctx.lineWidth = 1.5; ctx.strokeRect(x0 + 10, y0 + 10, w - 20, h - 20);
  [["METRES", "near the park", ZN[3][1]], ["CENTIMETRES", "upper Midwest", ZN[1][1]], ["MILLIMETRES", "both coasts", ZN[0][1]]].forEach(([a, b, c], i) => { const y = y0 + 40 + i * 66; ctx.fillStyle = K.cream2; ctx.fillRect(x0 + 40, y, 70, 44); ctx.fillStyle = c; ctx.fillRect(x0 + 40, y, 70, 44); ctx.strokeStyle = K.ink; ctx.lineWidth = 2; ctx.strokeRect(x0 + 40, y, 70, 44);
    ctx.textAlign = "left"; ctx.font = "40px LSerif"; ctx.fillStyle = i === 1 ? K.red : K.ink; ctx.fillText(a, x0 + 135, y + 37); ctx.font = "italic 32px LSerif"; ctx.fillStyle = K.ink; ctx.fillText(b, x0 + 445, y + 35); });
  ctx.restore(); }
finish(ctx);
