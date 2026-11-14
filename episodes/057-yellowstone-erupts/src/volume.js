// 2,450 km³ (Huckleberry Ridge) as one cube (13.5 km a side) vs Mount St Helens 1980 (~1 km³, 1 km cube), same scale.
// p: zoom, cy, grow (0..1), small (0..1), ash, labk (top plaque), lab2k (number plaque), sid
const z = p.zoom || 1, cy = p.cy || 960, gw = p.grow || 0, GY = 1170, S = 44; // px per km
const side = 13.48 * S, cx0 = 360, dx = 70, dy = -60;
const bg = cached("volBg", 1400, 2300, (g) => {
  g.translate(160, 190);
  skyDay(g, GY, "#2A3550");
  snowRidge(g, GY - 120, 200, 2.6, K.mtnL, 0.9);
  ridge(g, GY - 20, 70, 5.2, K.forest, K.ink, 0, 1.2); pineBand(g, GY - 10, 60, 26, 52, 8, K.pineD, K.pine, -160, 1240);
  g.fillStyle = K.sage; g.fillRect(-160, GY, 1400, 1200); g.strokeStyle = K.ink; g.lineWidth = 3; g.beginPath(); g.moveTo(-160, GY); g.lineTo(1240, GY); g.stroke();
  g.strokeStyle = "rgba(111,124,85,0.8)"; g.lineWidth = 2; for (let i = 0; i < 200; i++) { const x = rnd(i * 2.9) * 1400 - 160, y = GY + 10 + Math.pow(rnd(i * 4.7), 0.7) * 1000; const l = 6 + (y - GY) * 0.03; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l * 0.3, y - l); g.stroke(); }
});
function cube(x, yb, sd, h, cols) { const top = yb - h; ctx.lineWidth = 3.5; ctx.strokeStyle = K.ink;
  ctx.fillStyle = cols[0]; ctx.beginPath(); ctx.moveTo(x + sd, yb); ctx.lineTo(x + sd + dx * sd / side, yb + dy * sd / side); ctx.lineTo(x + sd + dx * sd / side, top + dy * sd / side); ctx.lineTo(x + sd, top); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = cols[1]; ctx.fillRect(x, top, sd, h); ctx.strokeRect(x, top, sd, h);
  ctx.fillStyle = cols[2]; ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x + dx * sd / side, top + dy * sd / side); ctx.lineTo(x + sd + dx * sd / side, top + dy * sd / side); ctx.lineTo(x + sd, top); ctx.closePath(); ctx.fill(); ctx.stroke(); return top; }
ctx.save(); cam(540, cy, z, 0);
ctx.drawImage(bg, -160, -190);
const hh = side * eout(gw);
if (hh > 1) {
  const top = cube(cx0, GY, side, hh, ["#6E685E", "#8D877C", "#B9B2A3"]);
  ctx.save(); ctx.beginPath(); ctx.rect(cx0, top, side, hh); ctx.clip(); ctx.strokeStyle = "rgba(27,34,51,0.25)"; ctx.lineWidth = 2;
  for (let y = GY - 40; y > top; y -= 44) { ctx.beginPath(); ctx.moveTo(cx0, y); for (let x = cx0; x <= cx0 + side; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.03 + y) * 4); ctx.stroke(); }
  ctx.fillStyle = "rgba(40,36,32,0.35)"; for (let i = 0; i < 160; i++) ctx.fillRect(cx0 + rnd(i * 2.1) * side, GY - rnd(i * 3.7) * side, 3, 3); ctx.restore();
  if (gw < 0.98) { ctx.fillStyle = "rgba(141,135,124,0.85)"; for (let i = 0; i < 46; i++) { const x = cx0 + 30 + rnd(i) * (side - 60), y = ((rnd(i * 3) * 600 + t * 520) % 600) - 300 + top - 300; if (y < top) ctx.fillRect(x, y, 6, 14); } }
  // red dimension line
  const lx = cx0 + side + dx + 26; ctx.strokeStyle = K.red; ctx.fillStyle = K.red; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(lx, GY + dy); ctx.lineTo(lx, GY + dy - hh); ctx.moveTo(lx - 12, GY + dy); ctx.lineTo(lx + 12, GY + dy); ctx.moveTo(lx - 12, GY + dy - hh); ctx.lineTo(lx + 12, GY + dy - hh); ctx.stroke();
  if (gw > 0.9) { ctx.save(); ctx.globalAlpha = cl((gw - 0.9) * 10); ctx.translate(lx + 34, GY + dy - hh / 2); ctx.rotate(Math.PI / 2); ctx.font = "40px LSerif"; ctx.textAlign = "center"; ctx.fillText("13.5 km", 0, 0); ctx.restore(); }
}
// Mount St Helens 1980: a 1 km cube (tiny)
const sm = p.small || 0;
if (sm > 0) { const sx = 170, s1 = S * eback(sm); cube(sx, GY, s1, s1, ["#A35B3A", "#C77A4E", "#E3A57B"]);
  ctx.save(); ctx.globalAlpha = cl(sm * 2); ctx.strokeStyle = K.red; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx + 22, GY - 52); ctx.lineTo(sx + 22, GY - 150); ctx.stroke();
  ctx.font = "30px LSerif"; ctx.textAlign = "center"; ctx.fillStyle = K.ink; ctx.fillText("ST HELENS 1980", sx + 22, GY - 196); ctx.fillStyle = K.red; ctx.fillText("1 km³", sx + 22, GY - 160); ctx.restore(); }
ashFall(ctx, p.ash || 0, -300, -300, 1700, 2500, 19, 110, "rgba(60,56,50,0.7)");
ctx.restore();
plaque(ctx, 540, 120, [{ t: "HUCKLEBERRY RIDGE", s: 60, sp: 4 }, { t: "2.1 MILLION YEARS AGO", s: 30, sp: 8 }], p.labk || 0);
plaque(ctx, 540, 1460, [{ t: "2,450 km³", s: 104, c: K.red }, { t: "OF ROCK AND ASH", s: 28, sp: 8 }], p.lab2k || 0);
finish(ctx);
