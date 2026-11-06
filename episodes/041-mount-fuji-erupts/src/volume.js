// 1.7 billion m³ of ash as one cube (1.19 km a side) next to Tokyo Skytree (634 m), same scale. p: zoom, cy, grow (0..1), dims (0..1), ash, labk, sid
const z = p.zoom || 1, cy = p.cy || 960, gw = p.grow || 0, GY = 1180, S = 0.57; // px per metre
const side = 1193 * S, cx0 = 300, dx = 60, dy = -60; // cube front-left x, iso offset
const bg = cached("volBg", 1300, 2200, (g) => {
  g.translate(110, 140);
  skyDay(g, GY + 10, "#2A3550");
  ridge(g, GY - 60, 60, 1.7, K.mtnL, "rgba(27,34,51,0.45)", 0, 0.8);
  fuji(g, 150, GY - 40, 170, 190, { lw: 2.5, snow: 0.38 });
  // low city band
  for (let i = 0; i < 40; i++) { const x = -110 + i * 34, h = 20 + rnd(i * 2.2) * 70; g.fillStyle = i % 2 ? "#8E99A8" : "#A3ACB8"; g.fillRect(x, GY - h, 30, h); g.strokeStyle = "rgba(27,34,51,0.5)"; g.lineWidth = 1.5; g.strokeRect(x, GY - h, 30, h); }
  g.fillStyle = K.sand; g.fillRect(-110, GY, 1300, 1000); g.strokeStyle = K.ink; g.lineWidth = 3; g.beginPath(); g.moveTo(-110, GY); g.lineTo(1190, GY); g.stroke();
  sea(g, GY + 160, 2100, K.indigo2, K.indigo0, 50, 12);
});
ctx.save(); cam(540, cy, z, 0);
ctx.drawImage(bg, -110, -140);
// Skytree to scale
const sh = 634 * S, sx = 105;
ctx.fillStyle = "#DCE3E8"; ctx.strokeStyle = K.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(sx - 24, GY); ctx.lineTo(sx - 6, GY - sh * 0.92); ctx.lineTo(sx, GY - sh); ctx.lineTo(sx + 6, GY - sh * 0.92); ctx.lineTo(sx + 24, GY); ctx.closePath(); ctx.fill(); ctx.stroke();
ctx.fillStyle = "#AFC0CE"; ctx.fillRect(sx - 15, GY - sh * 0.62, 30, 16); ctx.strokeRect(sx - 15, GY - sh * 0.62, 30, 16);
// the ash cube (fills from the ground up)
const hh = side * eout(gw), top = GY - hh;
if (hh > 1) {
  ctx.lineWidth = 3.5; ctx.strokeStyle = K.ink;
  ctx.fillStyle = "#6E685E"; ctx.beginPath(); ctx.moveTo(cx0 + side, GY); ctx.lineTo(cx0 + side + dx, GY + dy); ctx.lineTo(cx0 + side + dx, top + dy); ctx.lineTo(cx0 + side, top); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#8D877C"; ctx.fillRect(cx0, top, side, hh); ctx.strokeRect(cx0, top, side, hh);
  ctx.fillStyle = "#B9B2A3"; ctx.beginPath(); ctx.moveTo(cx0, top); ctx.lineTo(cx0 + dx, top + dy); ctx.lineTo(cx0 + side + dx, top + dy); ctx.lineTo(cx0 + side, top); ctx.closePath(); ctx.fill(); ctx.stroke();
  // strata lines + flecks (print texture on the face)
  ctx.save(); ctx.beginPath(); ctx.rect(cx0, top, side, hh); ctx.clip(); ctx.strokeStyle = "rgba(27,34,51,0.25)"; ctx.lineWidth = 2;
  for (let y = GY - 40; y > top; y -= 46) { ctx.beginPath(); ctx.moveTo(cx0, y); for (let x = cx0; x <= cx0 + side; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.03 + y) * 4); ctx.stroke(); }
  ctx.fillStyle = "rgba(40,36,32,0.35)"; for (let i = 0; i < 160; i++) ctx.fillRect(cx0 + rnd(i * 2.1) * side, GY - rnd(i * 3.7) * side, 3, 3); ctx.restore();
  // pouring ash from the top while growing
  if (gw < 0.98) { ctx.fillStyle = "rgba(141,135,124,0.85)"; for (let i = 0; i < 40; i++) { const x = cx0 + 40 + rnd(i) * (side - 80), y = ((rnd(i * 3) * 600 + t * 500) % 600) - 300 + top - 300; if (y < top) ctx.fillRect(x, y, 6, 14); } }
}
// dimension lines
const dm = p.dims || 0;
if (dm > 0) { ctx.save(); ctx.globalAlpha = cl(dm * 2); ctx.strokeStyle = K.red; ctx.fillStyle = K.red; ctx.lineWidth = 4; const lx = cx0 - 34;
  ctx.beginPath(); ctx.moveTo(lx, GY); ctx.lineTo(lx, GY - side * eout(dm)); ctx.stroke(); ctx.beginPath(); ctx.moveTo(lx - 14, GY); ctx.lineTo(lx + 14, GY); ctx.moveTo(lx - 14, GY - side * eout(dm)); ctx.lineTo(lx + 14, GY - side * eout(dm)); ctx.stroke();
  ctx.save(); ctx.translate(lx - 22, GY - side / 2); ctx.rotate(-Math.PI / 2); ctx.font = "44px LSerif"; ctx.textAlign = "center"; ctx.fillText("1.2 km", 0, 0); ctx.restore();
  ctx.font = "26px LSerif"; ctx.textAlign = "center"; ctx.fillStyle = K.ink; ctx.fillText("SKYTREE", sx, GY - sh - 52); ctx.fillText("634 m", sx, GY - sh - 22); ctx.restore(); }
ashFall(ctx, p.ash || 0, -200, -200, 1500, 2400, 19, 110, "rgba(60,56,50,0.7)");
ctx.restore();
plaque(ctx, 540, 1470, [{ t: "1.7 BILLION m³", s: 84, c: K.red }, { t: "OF ASH · HŌEI ERUPTION, 1707", s: 26, sp: 5 }], p.labk || 0);
finish(ctx);
