// EP4: the high school stadium gate in the morning — floodlights, a chain-link gate, two soldiers, a checkpoint sign.
// p: cx, cy, zoom, shake, rx (your bike x, rolling in), sign 0..1 (sign pops), beam 0..1 (soldier's flashlight on you),
//    you 0..1 (you visible), crowd 0..1 (survivors inside)
cam(p.cx || W / 2, p.cy || 960, p.zoom || 1, p.shake || 0);
{ const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#5E7FD6"); g.addColorStop(0.5, "#E99A9A"); g.addColorStop(0.8, "#FFC27A"); g.addColorStop(1, "#FFE7B8"); ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3); }
circ(160, 520, 105, "#FFE6A6");
// stadium stands behind the fence
ctx.fillStyle = "#6A5AA2"; ctx.beginPath(); ctx.ellipse(540, 1100, 760, 420, 0, Math.PI, 0); ctx.fill();
for (let r = 0; r < 4; r++) rr(-200, 760 + r * 80, 1480, 16, 6, "rgba(255,255,255,0.12)");
for (const fx of [80, 1000]) { rr(fx - 10, 300, 20, 800, 4, "#4E4086"); rr(fx - 100, 250, 200, 80, 10, "#4E4086"); for (let i = 0; i < 5; i++) circ(fx - 72 + i * 36, 290, 13, "#FFF4C8"); }
// banner on the stands
rr(300, 720, 480, 90, 16, "#FF3B4E"); ctx.font = "50px LHeavy"; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("EVACUATION POINT", 540, 768);
ground(1300, "#3D3B7E", "#4C4A93");
// survivors waiting inside (behind the fence)
const cr = cl(p.crowd ?? 1);
for (let i = 0; i < 9; i++) { const x = 90 + i * 115 + rnd(i) * 30, s = 0.75 + rnd(i + 4) * 0.15; ctx.save(); ctx.globalAlpha = cr; const col = ["#E9E6F5", "#9DB5E8", "#C9A26B", "#2EC4B6"][i % 4];
  circ(x, 1250 - 150 * s, 30 * s, PAL.skin); rr(x - 34 * s, 1250 - 120 * s, 68 * s, 120 * s, 22 * s, col); ctx.restore(); }
// chain-link fence + gate
function chain(x0, x1, y0, y1) { ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip(); ctx.strokeStyle = "rgba(220,224,245,0.55)"; ctx.lineWidth = 4;
  for (let x = x0 - (y1 - y0); x < x1; x += 34) { ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x + (y1 - y0), y1); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + (y1 - y0), y0); ctx.lineTo(x, y1); ctx.stroke(); } ctx.restore(); }
chain(-200, 1280, 960, 1340);
for (let x = -100; x < 1300; x += 260) rr(x - 9, 940, 18, 400, 6, "#B9BCD8");
rr(-200, 940, 1480, 14, 6, "#B9BCD8");
// barbed wire on top
ctx.strokeStyle = "#C9CCE6"; ctx.lineWidth = 4; for (let x = -200; x < 1300; x += 40) { ctx.beginPath(); ctx.arc(x, 925, 18, 0, TAU); ctx.stroke(); }
// gate posts
rr(330, 900, 34, 440, 8, "#8A90C8"); rr(716, 900, 34, 440, 8, "#8A90C8");
// checkpoint sign on the gate
const sk = E.back(cl(p.sign ?? 1));
if (sk > 0) { ctx.save(); ctx.translate(540, 1080); ctx.scale(sk, sk);
  rr(-250, -130, 500, 260, 22, "#FFFFFF"); rr(-250, -130, 500, 70, [22, 22, 0, 0], PAL.red);
  ctx.font = "44px LHeavy"; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("CHECKPOINT", 0, -94);
  ctx.fillStyle = "#151A45"; ctx.font = "50px LHeavy"; ctx.fillText("NO BITES.", 0, -4); ctx.fillText("NO SCRATCHES.", 0, 64);
  ctx.restore(); }
// soldiers (olive uniforms, helmets) — one each side of the gate
function soldier(x, y, s, flip, beam) {
  ctx.save(); if (flip) { ctx.translate(x, 0); ctx.scale(-1, 1); ctx.translate(-x, 0); }
  const OL = "#5E6B3A", OL2 = "#4B5730", hy = y - 330 * s;
  limb(x - 22 * s, y - 150 * s, x - 26 * s, y - 22 * s, 42 * s, OL2); limb(x + 22 * s, y - 150 * s, x + 26 * s, y - 22 * s, 42 * s, OL2);
  rr(x - 60 * s, y - 34 * s, 70 * s, 34 * s, 12 * s, "#1B1F2E"); rr(x - 4 * s, y - 34 * s, 70 * s, 34 * s, 12 * s, "#1B1F2E");
  rr(x - 74 * s, y - 285 * s, 148 * s, 160 * s, 40 * s, OL); rr(x - 64 * s, y - 250 * s, 128 * s, 80 * s, 16 * s, OL2); // vest
  rr(x - 74 * s, y - 150 * s, 148 * s, 18 * s, 6, "#2E3320");
  limb2(x - 62 * s, y - 255 * s, x - 95 * s, y - 185 * s, x - 82 * s, y - 128 * s, 34 * s, OL); circ(x - 82 * s, y - 128 * s, 17 * s, PAL.skin);
  limb2(x + 62 * s, y - 255 * s, x + 110 * s, y - 220 * s, x + 170 * s, y - 250 * s, 34 * s, OL); circ(x + 170 * s, y - 250 * s, 17 * s, PAL.skin);
  rr(x + 170 * s, y - 266 * s, 60 * s, 30 * s, 8, "#2A2E3E"); // flashlight
  if (beam > 0) { const g = ctx.createLinearGradient(x + 230 * s, 0, x + 560 * s, 0); g.addColorStop(0, `rgba(255,250,210,${0.6 * beam})`); g.addColorStop(1, "rgba(255,250,210,0)"); poly([x + 230 * s, y - 262 * s, x + 520 * s, y - 120 * s, x + 520 * s, y + 230 * s, x + 230 * s, y - 238 * s], g); }
  rr(x - 16 * s, hy + 40 * s, 32 * s, 30 * s, 8 * s, PAL.skin2); circ(x, hy, 66 * s, PAL.skin);
  ctx.fillStyle = OL; ctx.beginPath(); ctx.arc(x, hy - 8 * s, 82 * s, Math.PI, 0); ctx.fill(); rr(x - 92 * s, hy - 16 * s, 184 * s, 22 * s, 10 * s, OL2);
  circ(x + 6 * s, hy + 18 * s, 9 * s, "#1B1F52"); circ(x + 42 * s, hy + 18 * s, 9 * s, "#1B1F52"); limb(x + 4 * s, hy + 46 * s, x + 36 * s, hy + 46 * s, 6 * s, "#7A2333");
  ctx.restore();
}
soldier(200, 1640, 0.85, false, cl(p.beam || 0));
soldier(900, 1640, 0.85, true, 0);
// you, rolling up on the bike (small, front)
const yk = cl(p.you ?? 0);
if (yk > 0) { const x = p.rx ?? 560; ctx.save(); ctx.globalAlpha = yk;
  const BY = 1730, s = 0.6, wr = 120 * s;
  for (const wx of [x - 170 * s, x + 170 * s]) { ctx.lineWidth = 10; ctx.strokeStyle = "#1B1F52"; ctx.beginPath(); ctx.arc(wx, BY - wr, wr, 0, TAU); ctx.stroke(); }
  limb2(x - 170 * s, BY - wr, x - 30 * s, BY - wr, x - 80 * s, BY - 330 * s, 10, "#FF3B4E"); limb2(x - 80 * s, BY - 330 * s, x + 110 * s, BY - 320 * s, x - 30 * s, BY - wr, 10, "#FF3B4E"); limb(x + 110 * s, BY - 320 * s, x + 170 * s, BY - wr, 10, "#FF3B4E");
  person(x - 48, BY - 48, 0.62, { pose: "idle", look: -0.4, mouth: "o", sweat: 1 });
  ctx.restore(); }
