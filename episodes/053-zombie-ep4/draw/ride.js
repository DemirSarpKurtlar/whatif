// EP4: side-scrolling bike ride through town at sunrise, you on the neighbor's red bike (same flat world as EP1–EP3).
// p: spd (scroll px/s), sun 0..1 (dawn -> morning), cx, cy, zoom, shake, rx (rider x),
//    fence 0..1 (neighbor's picket fence + gap you squeeze through, scrolls away), nz (zombies on the sidewalk),
//    turn 0..1 (their heads turn toward you), chase 0..1 (zombies chasing behind), gap (px behind you), zsp (their stride speed),
//    rings 0..1 (sound rings from the chain), click 0..1 ("CLICK" pops), stad 0..1 (stadium ahead on the horizon),
//    hud 0..1, km, min (minutes after 6:00), inf (infected), infPop 0..1 (counter flash),
//    zg (x of a zombie lunging from the sidewalk, relative to you), grab 0..1 (its hand reaches your sleeve), rip 0..1 (you tear free)
cam(p.cx || W / 2, p.cy || 1240, p.zoom || 1.45, p.shake || 0);
const SUN = cl(p.sun ?? 0), off = lt * (p.spd ?? 820);
function hx2(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
function mixc(a, b, k) { const A = hx2(a), B = hx2(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",")})`; }
// --- sky: EP3 dawn palette warming into morning
{ const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mixc("#4A3F9A", "#5E7FD6", SUN)); g.addColorStop(0.5, mixc("#B9638F", "#E99A9A", SUN)); g.addColorStop(0.78, mixc("#FF9A62", "#FFC27A", SUN)); g.addColorStop(1, mixc("#FFC98B", "#FFE7B8", SUN)); ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3); }
const sy = lerp(1180, 620, E["ease-out"](SUN));
{ const sg = ctx.createRadialGradient(820, sy, 40, 820, sy, 620); sg.addColorStop(0, "rgba(255,230,160,0.85)"); sg.addColorStop(1, "rgba(255,190,110,0)"); ctx.fillStyle = sg; ctx.fillRect(-W, -H, W * 3, H * 3); }
circ(820, sy, 115, "#FFE6A6");
// --- parallax skylines
function scrollLayer(f, fn) { const o = ((off * f) % W + W) % W; ctx.save(); ctx.translate(-o, 0); fn(); ctx.translate(W, 0); fn(); ctx.restore(); }
// stadium on the horizon (does not scroll: it is where you are going)
const st = cl(p.stad || 0);
if (st > 0) {
  const sx = 830, syb = 1240, s = lerp(0.55, 1.05, st);
  ctx.save(); ctx.globalAlpha = cl(st * 3);
  for (const fx of [-300, 300]) { rr(sx + fx * s - 8 * s, syb - 560 * s, 16 * s, 560 * s, 4, "#5A4C8E"); rr(sx + fx * s - 70 * s, syb - 600 * s, 140 * s, 60 * s, 8, "#5A4C8E");
    for (let i = 0; i < 4; i++) circ(sx + fx * s - 48 * s + i * 32 * s, syb - 570 * s, 11 * s, "#FFF4C8"); }
  ctx.fillStyle = "#6A5AA2"; ctx.beginPath(); ctx.ellipse(sx, syb - 40 * s, 360 * s, 190 * s, 0, Math.PI, 0); ctx.fill();
  rr(sx - 360 * s, syb - 60 * s, 720 * s, 60 * s, 4, "#6A5AA2");
  for (let i = 0; i < 9; i++) rr(sx - 300 * s + i * 72 * s, syb - 150 * s, 40 * s, 90 * s, 6, "#4E4086");
  ctx.restore();
}
scrollLayer(0.12, () => skyline(1300, 0, 4, 0.8, mixc("#6B4E93", "#7C77B8", SUN)));
scrollLayer(0.3, () => skyline(1330, 0, 9, 1.0, mixc("#4D3F86", "#5B5AA6", SUN)));
// --- sidewalk + road
ground(1330, mixc("#3D3B7E", "#4A4A92", SUN), mixc("#4C4A93", "#5C5CA6", SUN));
rr(-W, 1420, W * 3, 230, 0, PAL.road);
for (let i = -1; i < 10; i++) rr(i * 160 - ((off % 160) + 160) % 160, 1530, 80, 12, 6, "rgba(247,232,198,0.55)");
rr(-W, 1420, W * 3, 14, 0, "#1E2250");
// props on the sidewalk (scroll 1:1)
function wrapX(x0, P) { return ((x0 - off) % P + P) % P - 300; }
for (let i = 0; i < 3; i++) { const x = wrapX(200 + i * 560, 1680); lamp(x, 1335, 380, 0); }
for (let i = 0; i < 2; i++) { const x = wrapX(520 + i * 840, 1680); tree(x, 1335, 0.95); }
// the neighbor's picket fence with a broken gap (only in the opening shot)
const fk = cl(p.fence || 0);
if (fk > 0) { const fx = 120 - off; ctx.save(); ctx.globalAlpha = fk;
  rr(fx - 420, 820, 420, 515, 8, "#5A5FB0"); poly([fx - 440, 830, fx - 210, 640, fx + 20, 830], "#3A3584"); rr(fx - 330, 900, 100, 110, 6, "#FFD45C");
  for (let i = 0; i < 14; i++) { if (i === 9) continue; const x = fx - 120 + i * 52, h = i === 10 ? 120 : 190; rr(x, 1335 - h, 30, h, 6, "#E9E6F5"); poly([x, 1335 - h, x + 15, 1335 - h - 22, x + 30, 1335 - h], "#E9E6F5"); }
  rr(fx - 130, 1205, 740, 16, 4, "#E9E6F5"); rr(fx - 130, 1280, 740, 16, 4, "#E9E6F5");
  circ(fx - 120 + 10 * 52 + 15, 1222, 6, "#8A8FB8"); // a bent nail on the broken picket
  ctx.restore(); }
// --- zombies on the sidewalk: heads turn toward the clicking
const nz = Math.round(p.nz || 0), turn = cl(p.turn || 0), RX = p.rx ?? 430;
for (let i = 0; i < nz; i++) {
  const x = wrapX(700 + i * 430 + rnd(i) * 120, Math.max(1600, nz * 430)), yb = 1400 + (i % 2) * 18, s = 0.5 + (i % 2) * 0.05;
  const turned = turn > rnd(i * 5 + 1) * 0.8;
  const face = turned ? (x > RX ? true : false) : i % 2 === 0;
  zombie(x, yb, s, { flip: face, speed: turned ? 3.2 : 1.0, phase: i * 1.9, skin: i % 2 ? "#8DB967" : PAL.zskin, cloth: i % 3 ? PAL.zcloth : "#6A4E66" });
  if (turned) { const a = cl((turn - rnd(i * 5 + 1) * 0.8) * 5); ctx.save(); ctx.globalAlpha = a; const hy = yb - 330 * s - 120;
    rr(x - 26, hy - 44, 52, 70, 18, "#FFFFFF"); ctx.font = "56px LHeavy"; ctx.fillStyle = PAL.red; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("!", x, hy - 6); ctx.restore(); }
}
// --- zombies chasing on the road behind you
const ch = cl(p.chase || 0);
if (ch > 0) for (let i = 0; i < 4; i++) {
  const gx = RX - (p.gap ?? 420) - i * 190 + Math.sin(t * 2 + i) * 20, yb = 1640 - (i % 2) * 40;
  ctx.save(); ctx.globalAlpha = cl(ch * 4 - i); zombie(gx, yb, 0.62 - (i % 2) * 0.05, { speed: p.zsp || 3, phase: i * 1.4, skin: i % 2 ? "#8DB967" : PAL.zskin, cloth: i % 2 ? "#6A4E66" : PAL.zcloth });
  for (let j = 0; j < 3; j++) rr(gx - 200 - j * 40, yb - 260 + j * 60, 90 - j * 20, 9, 5, `rgba(255,255,255,${0.35 * ch})`); // speed lines
  ctx.restore();
}
// --- you on the neighbor's bike
function rider(BX, BY, s) {
  ctx.save(); ctx.translate(BX, BY); ctx.scale(s, s); ctx.translate(-BX, -BY);
  const wr = 120, RED = "#FF3B4E", ph = t * 9;
  for (const wx of [BX - 170, BX + 170]) { ctx.lineWidth = 14; ctx.strokeStyle = "#1B1F52"; ctx.beginPath(); ctx.arc(wx, BY - wr, wr, 0, TAU); ctx.stroke();
    for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI + t * 11; limb(wx - Math.cos(a) * wr, BY - wr - Math.sin(a) * wr, wx + Math.cos(a) * wr, BY - wr + Math.sin(a) * wr, 3, "rgba(27,31,82,0.55)"); } }
  const C = [BX - 30, BY - wr], HIP = [BX - 85, BY - 395];
  // far leg (behind the frame)
  function leg(a, col) { const F = [C[0] + Math.cos(a) * 52, C[1] + Math.sin(a) * 52]; const dx = F[0] - HIP[0], dy = F[1] - HIP[1], d = Math.hypot(dx, dy), L = 175;
    const h = Math.sqrt(Math.max(0, L * L - d * d / 4)); const mx = (HIP[0] + F[0]) / 2, my = (HIP[1] + F[1]) / 2; const K = [mx + (-dy / d) * -h, my + (dx / d) * -h];
    if (K[0] < mx) { K[0] = mx + (dy / d) * h; K[1] = my - (dx / d) * h; }
    limb2(HIP[0], HIP[1], K[0], K[1], F[0], F[1], 40, col); rr(F[0] - 24, F[1] - 14, 66, 28, 12, "#FFFFFF"); rr(F[0] - 24, F[1], 66, 14, 7, PAL.shoe); }
  leg(ph + Math.PI, "#3C466A");
  limb2(BX - 170, BY - wr, BX - 30, BY - wr, BX - 80, BY - 330, 18, RED); limb2(BX - 80, BY - 330, BX + 110, BY - 320, BX - 30, BY - wr, 18, RED);
  limb(BX + 110, BY - 320, BX + 170, BY - wr, 18, RED); limb(BX - 170, BY - wr, BX - 80, BY - 330, 18, RED);
  rr(BX - 135, BY - 370, 110, 26, 12, "#1B1F52"); limb(BX + 110, BY - 320, BX + 95, BY - 405, 14, "#1B1F52"); limb(BX + 70, BY - 405, BX + 150, BY - 410, 14, "#1B1F52");
  // chain + sprocket
  ctx.strokeStyle = "#8A90C8"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(C[0], C[1] - 26); ctx.lineTo(BX - 170, BY - wr - 12); ctx.moveTo(C[0], C[1] + 26); ctx.lineTo(BX - 170, BY - wr + 12); ctx.stroke();
  circ(C[0], C[1], 28, "#1B1F52"); circ(C[0], C[1], 12, "#8A90C8");
  // torso, leaning forward
  const SH = [BX + 5, BY - 600];
  limb(HIP[0], HIP[1] - 20, SH[0] - 10, SH[1] + 30, 128, PAL.hoodie); rr(HIP[0] + 10, BY - 500, 90, 40, 14, PAL.hoodie2);
  // near arm to the handlebar
  limb2(SH[0], SH[1] + 10, BX + 70, BY - 470, BX + 140, BY - 415, 34, PAL.hoodie); circ(BX + 140, BY - 415, 18, PAL.skin);
  // head (same face as EP1–EP3)
  const hy = BY - 700 + Math.sin(ph) * 4, hx = BX + 40;
  circ(hx, hy, 70, PAL.skin); circ(hx - 52, hy + 10, 22, PAL.hair); circ(hx + 52, hy + 10, 22, PAL.hair);
  ctx.fillStyle = PAL.beanie; ctx.beginPath(); ctx.arc(hx, hy - 12, 74, Math.PI, 0); ctx.fill(); rr(hx - 78, hy - 22, 156, 26, 12, "#C9313E"); circ(hx, hy - 92, 16, "#FFFFFF");
  const ex = 9; circ(hx - 25, hy + 16, 17, "#FFFFFF"); circ(hx + 25, hy + 16, 17, "#FFFFFF"); circ(hx - 25 + ex, hy + 18, 7, "#1B1F52"); circ(hx + 25 + ex, hy + 18, 7, "#1B1F52");
  circ(hx + 5, hy + 48, 11, "#7A2333");
  circ(hx + 66, hy - 6 + ((t * 60) % 30), 7, "#9DD9FF");
  leg(ph, PAL.jeans);
  ctx.restore();
  return C;
}
const BYr = 1600;
if (p.zg !== undefined) zombie(RX + p.zg, 1470, 0.6, { flip: true, speed: 4, phase: 0.7, skin: "#8DB967", cloth: "#6A4E66" });
const crank = rider(RX, BYr + Math.sin(t * 18) * 2, 0.6);
// wind streaks around you
for (let i = 0; i < 5; i++) { const y = 1000 + i * 110, x = RX - 260 - ((lt * 900 + i * 170) % 500); rr(x, y, 120, 8, 4, "rgba(255,255,255,0.4)"); }
// --- the chain clicks: sound rings + CLICK pops
const rg = cl(p.rings || 0), cx0 = RX + (crank[0] - RX) * 0.6, cy0 = BYr + (crank[1] - BYr) * 0.6;
if (rg > 0) for (let i = 0; i < 3; i++) { const k = (lt * 1.2 + i / 3) % 1; ctx.strokeStyle = `rgba(255,210,63,${(1 - k) * 0.9 * rg})`; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(cx0, cy0, 40 + k * 520, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); }
const ck = cl(p.click || 0);
if (ck > 0) { const n = Math.floor(lt * 2.6), ph2 = (lt * 2.6) % 1, a = ck * cl((1 - ph2) * 2), sc = 0.6 + 0.4 * E.back(cl(ph2 * 3));
  ctx.save(); ctx.globalAlpha = a; ctx.translate(cx0 + (n % 2 ? 150 : -170), cy0 + 40 - ph2 * 60); ctx.rotate(n % 2 ? 0.12 : -0.12); ctx.scale(sc, sc);
  ctx.font = "62px LHeavy"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineWidth = 12; ctx.strokeStyle = "#151A45"; ctx.strokeText("CLICK", 0, 0); ctx.fillStyle = "#FFD23F"; ctx.fillText("CLICK", 0, 0); ctx.restore(); }
// --- a zombie lunges from the sidewalk and grabs your sleeve; you rip free
if (p.zg !== undefined) {
  const zx = RX + p.zg, zy = 1470, zs = 0.6, gk = cl(p.grab || 0), rip = cl(p.rip || 0);
  const EL = [RX + 0.6 * 70, BYr - 0.6 * 470], SH0 = [zx - 30 * zs, zy - 250 * zs];
  const rest = [zx - 175 * zs, zy - 265 * zs];
  let HX = lerp(rest[0], EL[0], E["ease-out"](gk)), HY = lerp(rest[1], EL[1], E["ease-out"](gk));
  if (rip > 0) { HX = lerp(EL[0], zx - 40, E["ease-out"](rip)); HY = lerp(EL[1], zy - 120, E["ease-out"](rip)); }
  limb(SH0[0], SH0[1], HX, HY, 30 * zs * 1.6, "#6A4E66");
  circ(HX, HY, 20, PAL.zskin); for (let i = 0; i < 4; i++) { const a = Math.PI * (0.7 + i * 0.17); limb(HX, HY, HX + Math.cos(a) * 34, HY + Math.sin(a) * 34, 11, PAL.zskin); }
  if (rip > 0) { poly([HX - 30, HY - 20, HX + 26, HY - 34, HX + 34, HY + 10, HX - 10, HY + 30, HX - 36, HY + 8], PAL.hoodie); // torn scrap of your hoodie
    for (let i = 0; i < 4; i++) limb(EL[0] - 10 + i * 8, EL[1] + 10, EL[0] - 20 + i * 12, EL[1] + 40 + rnd(i) * 20, 4, PAL.hoodie2); }
  // impact bursts
  function burst(x, y, k, col) { if (k <= 0 || k >= 1) return; ctx.save(); ctx.globalAlpha = 1 - k; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; limb(x + Math.cos(a) * 30 * (1 + k * 2), y + Math.sin(a) * 30 * (1 + k * 2), x + Math.cos(a) * 70 * (1 + k * 2), y + Math.sin(a) * 70 * (1 + k * 2), 8, col); } ctx.restore(); }
  burst(EL[0], EL[1], cl((gk - 0.85) * 4), "#FFD23F"); burst(EL[0], EL[1], cl(rip * 2.2), "#FFFFFF");
  if (rip > 0.03) { const k = E.back(cl(rip * 4)); ctx.save(); ctx.globalAlpha = cl(2.4 - rip * 2.4); ctx.translate(EL[0] + 40, EL[1] - 260); ctx.rotate(-0.1); ctx.scale(k, k);
    ctx.font = "96px LHeavy"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineWidth = 16; ctx.strokeStyle = "#151A45"; ctx.strokeText("RIIIP!", 0, 0); ctx.fillStyle = "#FFFFFF"; ctx.fillText("RIIIP!", 0, 0); ctx.restore(); }
  // red danger vignette while it holds you (screen space)
  const vk = cl((gk - 0.5) * 2) * (1 - rip);
  if (vk > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const g = ctx.createRadialGradient(540, 960, 350, 540, 960, 1150); g.addColorStop(0, "rgba(255,59,78,0)"); g.addColorStop(1, `rgba(255,59,78,${0.5 * vk})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}
// --- HUD (screen space): distance left · clock · infected
const hk = cl(p.hud || 0);
if (hk > 0) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = hk;
  function card(x, w, label, val, col, pop) { rr(x, 150, w, 150, 30, "rgba(14,18,54,0.86)"); ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = "26px LHeavy"; ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.fillText(label, x + w / 2, 190);
    ctx.save(); ctx.translate(x + w / 2, 250); const s = 1 + 0.25 * pop; ctx.scale(s, s); ctx.font = "62px LHeavy"; ctx.fillStyle = col; ctx.fillText(val, 0, 0); ctx.restore(); }
  const km = p.km ?? 2, dist = km >= 0.95 ? km.toFixed(1) + " KM" : Math.round(km * 100) * 10 + " M";
  const mm = Math.floor(p.min ?? 35), clock = `6:${String(mm).padStart(2, "0")} AM`;
  card(40, 330, "DISTANCE LEFT", dist, "#FFD23F", 0);
  card(390, 300, "TIME", clock, "#FFFFFF", 0);
  card(710, 330, "INFECTED", String(Math.round(p.inf ?? 64)), "#FF4D5E", cl(p.infPop || 0));
  if (p.infPop) { ctx.globalAlpha = hk * cl(p.infPop); rr(710, 150, 330, 150, 30, "rgba(255,59,78,0.25)"); }
  ctx.globalAlpha = 1;
}
