// EP3 (adapted from EP1 map.js): top-down town map at dawn, a 2 km route from your house to the high school stadium.
// p: route 0..1 (dashed path draws in), zoom, cx, cy, pins 0..1, dots (number of infected dots)
cam(p.cx || W / 2, p.cy || H / 2, p.zoom || 1);
rr(-W, -H, W * 3, H * 3, 0, "#3A3A86");
for (let gx = -2; gx < 9; gx++) for (let gy = -2; gy < 14; gy++) {
  const x = gx * 150 + 40, y = gy * 150 + 120, k = rnd(gx * 17 + gy * 5);
  rr(x, y, 118, 118, 10, k < 0.18 ? "#2E7F6E" : k < 0.6 ? "#4B4CA6" : "#5656B4");
  if (k >= 0.18) for (let i = 0; i < 4; i++) rr(x + 14 + (i % 2) * 52, y + 14 + Math.floor(i / 2) * 52, 38, 38, 5, rnd(k * 99 + i) < 0.5 ? "#6464C4" : "#45469E");
}
// warm dawn wash from the east
const wg = ctx.createLinearGradient(0, 0, W, 0); wg.addColorStop(0, "rgba(255,170,100,0)"); wg.addColorStop(1, "rgba(255,170,100,0.22)"); ctx.fillStyle = wg; ctx.fillRect(-W, -H, W * 3, H * 3);
// stadium (top right): oval stands, green field, track
const SX = 774, SY = 470;
ctx.fillStyle = "#E9E6F5"; ctx.beginPath(); ctx.ellipse(SX, SY, 190, 130, 0, 0, TAU); ctx.fill();
ctx.fillStyle = "#C9603F"; ctx.beginPath(); ctx.ellipse(SX, SY, 150, 98, 0, 0, TAU); ctx.fill();
ctx.fillStyle = "#3FA35A"; ctx.beginPath(); ctx.ellipse(SX, SY, 118, 70, 0, 0, TAU); ctx.fill();
limb(SX, SY - 70, SX, SY + 70, 4, "rgba(255,255,255,0.8)");
// infected dots scattered through town (64), avoiding the stadium a bit
const nd = Math.round(p.dots ?? 64);
for (let i = 0; i < nd; i++) { const x = 40 + rnd(i * 3.3) * 1000, y = 200 + rnd(i * 7.1 + 2) * 1500; if (Math.hypot(x - SX, y - SY) < 230) continue;
  const pu = 0.75 + 0.25 * Math.sin(t * 3 + i); circ(x, y, 13 * pu, "rgba(147,196,108,0.35)"); circ(x, y, 7, "#C9F29A"); }
// route along the streets (dashed, drawing in)
const pts = [[249, 1330], [249, 1304], [324, 1304], [324, 1004], [624, 1004], [624, 704], [774, 704], [774, 604]];
let tot = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; }
const rk = E["ease-in-out"](cl(p.route || 0)); let left = tot * rk;
ctx.strokeStyle = "#FFD23F"; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.setLineDash([34, 26]); ctx.lineDashOffset = -lt * 60;
ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); let head = pts[0];
for (let i = 1; i < pts.length && left > 0; i++) { const k = Math.min(1, left / seg[i - 1]); head = [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; ctx.lineTo(head[0], head[1]); left -= seg[i - 1]; }
ctx.stroke(); ctx.setLineDash([]);
if (rk > 0 && rk < 1) circ(head[0], head[1], 18, "#FFD23F");
// pins
const pk = E.back(cl(p.pins ?? 1));
function pin(x, y, col, label) { ctx.save(); ctx.translate(x, y); ctx.scale(pk, pk);
  poly([-34, -60, 34, -60, 0, 0], col); circ(0, -78, 44, col); circ(0, -78, 18, "#FFFFFF");
  ctx.font = "38px LHeavy"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; const w = ctx.measureText(label).width + 40;
  rr(-w / 2, -186, w, 62, 20, "rgba(14,18,54,0.9)"); ctx.fillStyle = "#FFFFFF"; ctx.fillText(label, 0, -154); ctx.restore(); }
// your house icon
rr(204, 1350, 90, 70, 8, PAL.hoodie); poly([189, 1355, 249, 1300, 309, 1355], PAL.roof); rr(236, 1380, 26, 40, 4, "#2A2357");
pin(249, 1296, PAL.hoodie2, "YOU");
pin(SX, SY - 120, PAL.red, "STADIUM");
// distance label at the route midpoint
if (rk > 0.55) { const a = cl((rk - 0.55) / 0.2); ctx.save(); ctx.globalAlpha = a; rr(374, 830, 200, 90, 30, "#FFD23F"); ctx.font = "54px LHeavy"; ctx.fillStyle = "#151A45"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("2 KM", 474, 877); ctx.restore(); }
