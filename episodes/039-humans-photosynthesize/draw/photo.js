// 039 — "Bold Flat" scenes (thick outlines, flat fills, sky-blue days + navy starfield diagrams).
// One file, many scenes: p.k selects the scene. Our own character "Sol" (plum bob + bun, mustard tee, purple shorts).
const OL = "#14142A";
const C = {
  sky1: "#4FB8F0", sky2: "#A6E0FB", grass: "#5CC35A", grass2: "#43A647", sun: "#FFD23F", sun2: "#FFAA1F",
  red: "#FF4B4B", blue: "#3D8BFF", green: "#4CDB5A", navy1: "#0E1845", navy2: "#1D2C6E",
  tee: "#FFC83A", tee2: "#E8A823", shorts: "#6B4BD8", hair: "#3B1F4F", skin: "#EDB58C", skinD: "#D49470",
  leaf: "#5FCB46", leaf2: "#3D9F35", cheek: "#F47C8A", shoe: "#FFFFFF", sole: "#FF6FA0",
};
const hx = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
function mixc(a, b, k) { const A = hx(a), B = hx(b); k = cl(k); return `rgb(${Math.round(lerp(A[0], B[0], k))},${Math.round(lerp(A[1], B[1], k))},${Math.round(lerp(A[2], B[2], k))})`; }
function fs(fill, lw = 7) {
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (lw > 0) { ctx.lineWidth = lw; ctx.strokeStyle = OL; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke(); }
}
function oc(x, y, r, fill, lw = 7) { ctx.beginPath(); ctx.arc(x, y, Math.max(0.1, r), 0, TAU); fs(fill, lw); }
function oe(x, y, rx, ry, rot, fill, lw = 7) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot, 0, TAU); fs(fill, lw); }
function orr(x, y, w, h, r, fill, lw = 7) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); fs(fill, lw); }
function opoly(pts, fill, lw = 7) { ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.closePath(); fs(fill, lw); }
function oline(pts, w, col, lw = 6) {
  ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  if (lw > 0) { ctx.strokeStyle = OL; ctx.lineWidth = w + 2 * lw; ctx.stroke(); }
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
}
function label(s, x, y, size, col = "#FFFFFF", k = 1, rot = 0, align = "center") {
  if (k <= 0) return; const sc = 0.4 + 0.6 * E.back(cl(k));
  ctx.save(); ctx.globalAlpha *= cl(k * 3); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.font = `${size}px LHeavy`; ctx.textAlign = align; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
  ctx.lineWidth = size * 0.24; ctx.strokeStyle = OL; ctx.strokeText(s, 0, 0); ctx.fillStyle = col; ctx.fillText(s, 0, 0);
  ctx.restore();
}
// white outlined box: red tag, big yellow outlined value, small dark sub-line (reference "PRESSURE / 0X" box, our content)
function callout(x, y, w, h, tag, val, sub, k, valCol = C.sun, vsize = 120) {
  if (k <= 0) return; const s = 0.5 + 0.5 * E.back(cl(k));
  ctx.save(); ctx.globalAlpha *= cl(k * 4); ctx.translate(x, y); ctx.scale(s, s);
  orr(-w / 2 + 8, -h / 2 + 10, w, h, 30, "rgba(10,12,40,0.25)", 0);
  orr(-w / 2, -h / 2, w, h, 30, "#FFFFFF", 8);
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.font = "40px LHeavy"; ctx.fillStyle = "#E8413C"; ctx.fillText(tag, 0, -h / 2 + 52);
  ctx.restore(); ctx.save(); ctx.globalAlpha *= cl(k * 4); ctx.translate(x, y); ctx.scale(s, s);
  label(val, 0, sub ? 8 : 24, vsize, valCol);
  if (sub) { ctx.font = "30px LHeavy"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = OL; ctx.fillText(sub, 0, h / 2 - 40); }
  ctx.restore();
}
// ---- backgrounds
function grad(top, bot) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3); }
function navy(seed = 3) {
  grad(C.navy1, C.navy2);
  for (let i = 0; i < 120; i++) {
    const x = rnd(i * 3.1 + seed) * W * 1.3 - W * 0.15, y = rnd(i * 7.7 + seed) * H * 1.1 - 60, s = 2 + rnd(i + seed * 5) * 4;
    const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * (0.7 + rnd(i) * 2) + i));
    ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.6 * tw})`;
    if (i % 3) ctx.fillRect(x, y, s, s); else { ctx.beginPath(); ctx.arc(x, y, s * 0.6, 0, TAU); ctx.fill(); }
  }
}
function cloud(x, y, s = 1) {
  const cs = [[0, 0, 62], [-72, 18, 46], [74, 16, 50], [30, -34, 46], [-34, -22, 42]];
  const lw = 7;
  ctx.fillStyle = OL; for (const [a, b, r] of cs) { ctx.beginPath(); ctx.arc(x + a * s, y + b * s, r * s + lw, 0, TAU); ctx.fill(); }
  ctx.beginPath(); ctx.roundRect(x - 118 * s - lw, y + 10 * s - lw, 236 * s + 2 * lw, 56 * s + 2 * lw, 28 * s + lw); ctx.fill();
  ctx.fillStyle = "#FFFFFF"; for (const [a, b, r] of cs) { ctx.beginPath(); ctx.arc(x + a * s, y + b * s, r * s, 0, TAU); ctx.fill(); }
  ctx.beginPath(); ctx.roundRect(x - 118 * s, y + 10 * s, 236 * s, 56 * s, 28 * s); ctx.fill();
}
function day(top = C.sky1, bot = C.sky2) {
  grad(top, bot);
  cloud(190 + Math.sin(t * 0.3) * 20, 330, 0.9); cloud(900 - Math.sin(t * 0.25) * 18, 560, 0.7);
}
function sunD(x, y, r, rot = t * 0.4, face = 0) {
  for (let i = 0; i < 12; i++) {
    const a = rot + (i * TAU) / 12, a1 = a - 0.11, a2 = a + 0.11, r1 = r * 1.16, r2 = r * (i % 2 ? 1.5 : 1.68);
    opoly([x + Math.cos(a1) * r1, y + Math.sin(a1) * r1, x + Math.cos(a) * r2, y + Math.sin(a) * r2, x + Math.cos(a2) * r1, y + Math.sin(a2) * r1], C.sun2, 6);
  }
  oc(x, y, r, C.sun, 8); circ(x - r * 0.38, y - r * 0.38, r * 0.17, "rgba(255,255,255,0.55)");
  if (face) { circ(x - r * 0.28, y - r * 0.05, r * 0.08, OL); circ(x + r * 0.28, y - r * 0.05, r * 0.08, OL);
    ctx.strokeStyle = OL; ctx.lineWidth = r * 0.06; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(x, y + r * 0.12, r * 0.25, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
}
function hill(y, col = C.grass, col2 = C.grass2) {
  ctx.beginPath(); ctx.moveTo(-W, y + 70); ctx.quadraticCurveTo(W / 2, y - 80, W * 2, y + 70); ctx.lineTo(W * 2, H * 3); ctx.lineTo(-W, H * 3); ctx.closePath(); fs(col, 8);
  for (let i = 0; i < 9; i++) { const x = 60 + i * 120 + rnd(i) * 40, yy = y + 80 + rnd(i * 3) * 60; oe(x, yy, 18, 9, 0, col2, 0); }
  // soil cross-section under the grass (darker band so the captions stay readable)
  const sy = y + 175; orr(-W, sy, W * 3, H * 2, 0, "#7A4A2A", 8);
  for (let i = 0; i < 26; i++) { const x = rnd(i * 5.3) * W, yy = sy + 40 + rnd(i * 9.1) * 420; oe(x, yy, 14 + rnd(i) * 16, 9 + rnd(i * 2) * 8, rnd(i * 4) * 3, "#5E361C", 4); }
}
// sparkles (4-point stars)
function spark(x, y, r, col = "#FFFFFF") {
  ctx.beginPath(); ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r); ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r); fs(col, 4);
}
function burst(x, y, k, col = "rgba(255,255,255,0.22)", n = 16) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= cl(k); ctx.fillStyle = col;
  for (let i = 0; i < n; i++) { const a = t * 0.3 + (i * TAU) / n; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, 1600, a, a + TAU / n / 2); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
// ---- our character "Sol". y = feet baseline, s = scale (full height ~600*s). o.g = 0..1 green, o.pose, o.mouth, o.sprout
function hero(x, y, s = 1, o = {}) {
  const g = o.g || 0, lw = cl(6.5 * s, 4, 11);
  const skin = mixc(C.skin, C.leaf, g), skinD = mixc(C.skinD, C.leaf2, g), cheek = mixc(C.cheek, "#2E9A3A", g);
  const bob = Math.sin(t * 2.4 + (o.ph || 0)) * 4 * s, pose = o.pose || "idle";
  const walk = o.walk ? Math.sin(t * 10) : 0;
  const hipY = y - 160 * s + bob, fy = y - 18 * s;
  // legs + shoes
  oline([x - 28 * s, hipY, x - 30 * s + walk * 22 * s, fy], 30 * s, skin, lw);
  oline([x + 28 * s, hipY, x + 30 * s - walk * 22 * s, fy], 30 * s, skin, lw);
  oe(x - 40 * s + walk * 22 * s, y - 16 * s, 40 * s, 22 * s, 0, C.shoe, lw); oe(x + 40 * s - walk * 22 * s, y - 16 * s, 40 * s, 22 * s, 0, C.shoe, lw);
  ctx.fillStyle = C.sole; ctx.fillRect(x - 76 * s + walk * 22 * s, y - 8 * s, 72 * s, 5 * s); ctx.fillRect(x + 4 * s - walk * 22 * s, y - 8 * s, 72 * s, 5 * s);
  // shorts + tee
  orr(x - 72 * s, y - 240 * s + bob, 144 * s, 100 * s, 26 * s, C.shorts, lw);
  // arms (behind torso edges, in front for raised poses drawn after)
  const shL = [x - 64 * s, y - 330 * s + bob], shR = [x + 64 * s, y - 330 * s + bob];
  let L, R; const wv = Math.sin(t * 9) * 26 * s;
  if (pose === "up") { L = [x - 120 * s, y - 410 * s + bob, x - 165 * s, y - 500 * s + bob]; R = [x + 120 * s, y - 410 * s + bob, x + 165 * s, y - 500 * s + bob]; }
  else if (pose === "wave") { L = [x - 100 * s, y - 260 * s + bob, x - 96 * s, y - 196 * s + bob]; R = [x + 130 * s, y - 380 * s + bob, x + 150 * s + wv, y - 470 * s + bob]; }
  else if (pose === "hold") { L = [x - 105 * s, y - 250 * s + bob, x - 50 * s, y - 262 * s + bob]; R = [x + 105 * s, y - 250 * s + bob, x + 50 * s, y - 262 * s + bob]; }
  else if (pose === "spread") { L = [x - 150 * s, y - 330 * s + bob, x - 230 * s, y - 336 * s + bob]; R = [x + 150 * s, y - 330 * s + bob, x + 230 * s, y - 336 * s + bob]; }
  else if (pose === "shrug") { L = [x - 125 * s, y - 250 * s + bob, x - 150 * s, y - 330 * s + bob]; R = [x + 125 * s, y - 250 * s + bob, x + 150 * s, y - 330 * s + bob]; }
  else { L = [x - 98 * s, y - 265 * s + bob, x - 102 * s, y - 196 * s + bob]; R = [x + 98 * s, y - 265 * s + bob, x + 102 * s, y - 196 * s + bob]; }
  const arm = (sh, P) => { oline([sh[0], sh[1], P[0], P[1], P[2], P[3]], 26 * s, skin, lw); oc(P[2], P[3], 19 * s, skin, lw); };
  arm(shL, L); arm(shR, R);
  orr(x - 80 * s, y - 360 * s + bob, 160 * s, 140 * s, 44 * s, C.tee, lw);
  // sleeves
  oc(x - 72 * s, y - 322 * s + bob, 30 * s, C.tee, lw); oc(x + 72 * s, y - 322 * s + bob, 30 * s, C.tee, lw);
  orr(x - 66 * s, y - 352 * s + bob, 132 * s, 70 * s, 30 * s, C.tee, 0);
  // little sun badge on the tee
  oc(x + 34 * s, y - 296 * s + bob, 15 * s, "#FF8A3D", lw * 0.6);
  // head
  const hy = y - 470 * s + bob;
  orr(x - 18 * s, hy + 80 * s, 36 * s, 40 * s, 10 * s, skinD, lw);
  oe(x, hy - 4 * s, 122 * s, 116 * s, 0, C.hair, lw); // hair back (bob)
  orr(x - 124 * s, hy - 10 * s, 248 * s, 104 * s, 40 * s, C.hair, lw);
  oc(x, hy - 128 * s, 44 * s, C.hair, lw); // bun
  const sp = o.sprout || 0;
  if (sp > 0) { // sprout from the bun
    const k = E.back(cl(sp)); oline([x, hy - 160 * s, x + 4 * s, hy - (160 + 70 * k) * s], 10 * s, C.leaf2, lw * 0.8);
    oe(x - 34 * s * k, hy - (205 + 0 * k) * s * (0.8 + 0.2 * k), 34 * s * k, 18 * s * k, -0.5, C.leaf, lw * 0.8);
    oe(x + 40 * s * k, hy - (220) * s * (0.8 + 0.2 * k), 36 * s * k, 19 * s * k, 0.45, C.leaf, lw * 0.8);
  }
  oc(x, hy + 10 * s, 98 * s, skin, lw); // face
  // bangs + side locks
  ctx.beginPath(); ctx.ellipse(x, hy - 46 * s, 104 * s, 58 * s, 0, Math.PI * 0.98, Math.PI * 2.02); ctx.quadraticCurveTo(x + 40 * s, hy - 10 * s, x - 10 * s, hy - 30 * s); ctx.quadraticCurveTo(x - 60 * s, hy - 6 * s, x - 102 * s, hy - 40 * s); fs(C.hair, lw);
  orr(x - 120 * s, hy - 40 * s, 36 * s, 120 * s, 18 * s, C.hair, lw); orr(x + 84 * s, hy - 40 * s, 36 * s, 120 * s, 18 * s, C.hair, lw);
  // face features
  const m = o.mouth || "smile", ex = (o.look || 0) * 8 * s;
  oe(x - 36 * s + ex, hy + 22 * s, 12 * s, m === "o" ? 18 * s : 16 * s, 0, OL, 0); oe(x + 36 * s + ex, hy + 22 * s, 12 * s, m === "o" ? 18 * s : 16 * s, 0, OL, 0);
  circ(x - 32 * s + ex, hy + 15 * s, 4.5 * s, "#FFFFFF"); circ(x + 40 * s + ex, hy + 15 * s, 4.5 * s, "#FFFFFF");
  oe(x - 62 * s, hy + 52 * s, 16 * s, 10 * s, 0, cheek, 0); oe(x + 62 * s, hy + 52 * s, 16 * s, 10 * s, 0, cheek, 0);
  if (o.worry) { oline([x - 52 * s, hy - 12 * s, x - 22 * s, hy - 4 * s], 6 * s, OL, 0); oline([x + 52 * s, hy - 12 * s, x + 22 * s, hy - 4 * s], 6 * s, OL, 0); }
  if (m === "o") oe(x + ex * 0.5, hy + 64 * s, 15 * s, 20 * s, 0, "#7A1F2E", lw * 0.8);
  else if (m === "grin") { ctx.beginPath(); ctx.arc(x, hy + 50 * s, 26 * s, 0, Math.PI); ctx.closePath(); fs("#7A1F2E", lw * 0.8); }
  else { ctx.strokeStyle = OL; ctx.lineWidth = 6 * s; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(x, hy + 48 * s, 18 * s, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
  if (o.sweat) { const d = (t * 50) % 26; oe(x + 104 * s, hy - 20 * s + d * s, 9 * s, 13 * s, 0, "#9EDBFF", lw * 0.6); }
}
function arrowHead(x, y, a, s, col) { opoly([x + Math.cos(a) * s, y + Math.sin(a) * s, x + Math.cos(a + 2.4) * s, y + Math.sin(a + 2.4) * s, x + Math.cos(a - 2.4) * s, y + Math.sin(a - 2.4) * s], col, 6); }
function beam(x1, y1, x2, y2, k, col, w = 30) {
  if (k <= 0) return; const x = lerp(x1, x2, cl(k)), y = lerp(y1, y2, cl(k));
  oline([x1, y1, x, y], w, col, 6); arrowHead(x, y, Math.atan2(y2 - y1, x2 - x1), w * 1.25, col);
}
function leafShape(x, y, a, c, rot, fill, lw = 8, veins = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.beginPath(); ctx.moveTo(-a, 0); ctx.quadraticCurveTo(0, -c, a, 0); ctx.quadraticCurveTo(0, c, -a, 0); ctx.closePath(); fs(fill, lw);
  if (veins) { ctx.strokeStyle = C.leaf2; ctx.lineWidth = lw * 0.9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-a * 0.85, 0); ctx.lineTo(a * 0.9, 0);
    for (let i = -3; i <= 3; i++) { if (!i) continue; const vx = i * a * 0.22; ctx.moveTo(vx, 0); ctx.lineTo(vx + a * 0.16, -c * 0.32 * (1 - Math.abs(i) * 0.18)); ctx.moveTo(vx, 0); ctx.lineTo(vx + a * 0.16, c * 0.32 * (1 - Math.abs(i) * 0.18)); }
    ctx.stroke(); }
  ctx.restore();
}
function pot(x, y, s = 1) { // potted plant
  oline([x, y - 90 * s, x, y - 230 * s], 12 * s, C.leaf2, 5);
  leafShape(x - 48 * s, y - 190 * s, 52 * s, 50 * s, -0.5, C.leaf, 6, 0); leafShape(x + 50 * s, y - 225 * s, 55 * s, 52 * s, 0.45, C.leaf, 6, 0);
  leafShape(x - 4 * s, y - 270 * s, 46 * s, 46 * s, -1.4, C.leaf, 6, 0);
  opoly([x - 70 * s, y - 100 * s, x + 70 * s, y - 100 * s, x + 52 * s, y, x - 52 * s, y], "#E8743B", 7);
  orr(x - 80 * s, y - 118 * s, 160 * s, 30 * s, 10 * s, "#F28C4B", 7);
}
function burger(x, y, s = 1) {
  oe(x, y + 34 * s, 92 * s, 22 * s, 0, "#E9A23B", 7);
  orr(x - 96 * s, y + 2 * s, 192 * s, 30 * s, 14 * s, "#7A3E1D", 7);
  ctx.beginPath(); ctx.moveTo(x - 100 * s, y); for (let i = 0; i <= 8; i++) ctx.lineTo(x - 100 * s + i * 25 * s, y + (i % 2 ? 14 : -4) * s); ctx.lineTo(x + 100 * s, y - 8 * s); ctx.lineTo(x - 100 * s, y - 8 * s); ctx.closePath(); fs(C.leaf, 6);
  orr(x - 92 * s, y - 20 * s, 184 * s, 18 * s, 6 * s, "#FFD23F", 6);
  ctx.beginPath(); ctx.ellipse(x, y - 22 * s, 94 * s, 66 * s, 0, Math.PI, 0); ctx.closePath(); fs("#F2B04A", 7);
  for (let i = 0; i < 6; i++) oe(x - 50 * s + i * 20 * s, y - 60 * s + (i % 2) * 14 * s, 5 * s, 3 * s, 0.3, "#FFF3D0", 0);
}
function apple(x, y, r) { oc(x, y, r, "#FF4B4B", 6); oline([x, y - r, x + 4, y - r - 22], 7, "#6B4426", 4); leafShape(x + 22, y - r - 12, 18, 14, -0.4, C.leaf, 5, 0); circ(x - r * 0.4, y - r * 0.35, r * 0.18, "rgba(255,255,255,0.6)"); }

// ================= scenes =================
const k = p.k | 0;
if (k === 0) { // intro: Sol on a sunny hill, waving
  cam(W / 2, 960, p.zoom || 1);
  day(); sunD(850, 300, 95);
  hill(1180);
  hero(540, 1210, 1.15, { pose: "wave", mouth: "smile" });
} else if (k === 1) { // she turns green
  cam(W / 2, 960, p.zoom || 1);
  day("#56BDF2", "#B5E6FC");
  burst(540, 760, cl(p.g * 2) * (p.g < 1 ? 1 : 1));
  hero(540, 1660, 2.1, { g: p.g, mouth: p.g > 0.5 ? "o" : "smile", sprout: p.g, look: 0 });
  const tw = Math.sin(Math.PI * cl(p.g));
  if (tw > 0.02) for (let i = 0; i < 9; i++) { const a = i * 0.7 + t * 1.5, r = 330 + 60 * Math.sin(i * 2 + t * 3); spark(540 + Math.cos(a) * r, 760 + Math.sin(a) * r * 0.9, 26 * tw, i % 2 ? "#FFFFFF" : "#C9FF8A"); }
  label("CHLOROPHYLL", 540, 300, 104, "#8BF25E", p.lab || 0, -0.04);
} else if (k === 2) { // light spectrum: red + blue eaten, green bounced
  cam(W / 2, 960, p.zoom || 1);
  navy(5);
  leafShape(690, 1010, 330, 470, -0.45, C.leaf, 9, 1);
  // parallel sunbeams: red, green, blue
  const G = [640, 880], R = [740, 814], B = [540, 946], d = [0.55, 0.835], L = 520;
  const st = (P) => [P[0] - d[0] * L, P[1] - d[1] * L];
  beam(...st(R), ...R, p.beam, C.red); beam(...st(B), ...B, p.beam, C.blue); beam(...st(G), ...G, p.beam, C.green);
  sunD(330, 370, 115);
  if (p.eat > 0) for (const [ax, ay, col] of [[R[0], R[1], C.red], [B[0], B[1], C.blue]]) {
    const e = cl(p.eat); ctx.save(); ctx.globalAlpha = 1 - 0.7 * e; oc(ax, ay, 26 + 60 * e, col, 6); ctx.restore();
    for (let i = 0; i < 4; i++) { const a = i * 1.57 + 0.6 + t * 2; spark(ax + Math.cos(a) * 70 * e, ay + Math.sin(a) * 70 * e, 18 * e, "#FFF6A0"); }
  }
  if (p.bounce > 0) beam(G[0], G[1], 330, 1220, p.bounce, C.green);
  if (p.bounce > 0) { const e = E.back(cl(p.bounce * 1.6)); oe(235, 1290, 95 * e, 58 * e, 0, "#FFFFFF", 8); oc(250, 1290, 36 * e, "#3E7A2F", 6); circ(262, 1278, 10 * e, "#FFFFFF"); }
  label("RED", 800, 560, 74, C.red, cl(p.beam * 2 - 0.4), -0.08);
  label("BLUE", 210, 780, 74, C.blue, cl(p.beam * 2 - 0.6), -0.05);
  label("EATEN!", 860, 1255, 96, C.sun, p.eat || 0, -0.06);
  label("GREEN", 530, 1255, 70, C.green, cl((p.bounce || 0) * 1.5 - 0.3), 0.04);
} else if (k === 3) { // step into the sun: 250 W per m²
  cam(W / 2, 960, p.zoom || 1);
  day("#5BC2F5", "#C2EBFF");
  sunD(800, 690, 120, t * 0.5, 1);
  // sun rays onto a 1 m² panel
  const px = 760, py = 1265;
  if ((p.panel || 0) > 0) {
    ctx.save(); ctx.setLineDash([26, 18]); ctx.lineDashOffset = -t * 80; ctx.strokeStyle = "rgba(255,255,255,0.95)"; ctx.lineWidth = 9; ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(760 + (i - 1) * 70, 840); ctx.lineTo(px + (i - 1) * 70, py - 250); ctx.stroke(); }
    ctx.restore();
  }
  hill(1210);
  if ((p.panel || 0) > 0) { const e = E.back(cl(p.panel)); ctx.save(); ctx.translate(px, py); ctx.scale(e, e); orr(-115, -235, 230, 230, 10, "#FFE36B", 8);
    ctx.strokeStyle = "rgba(20,20,42,0.35)"; ctx.lineWidth = 4; ctx.beginPath(); for (let i = 1; i < 4; i++) { ctx.moveTo(-115 + i * 57.5, -235); ctx.lineTo(-115 + i * 57.5, -5); ctx.moveTo(-115, -235 + i * 57.5); ctx.lineTo(115, -235 + i * 57.5); } ctx.stroke();
    label("1 m²", 0, -120, 70, "#FFFFFF"); ctx.restore(); }
  hero(lerp(150, 330, cl(p.walkin)), 1250, 1.0, { pose: p.walkin < 1 ? "idle" : "up", walk: p.walkin < 1, mouth: "grin", g: 1, sprout: 1 });
  callout(540, 330, 760, 300, "SUNLIGHT", "250 W", "PER m², AVERAGED OVER 24 H", p.c1 || 0, C.sun, 130);
} else if (k === 4) { // only half the skin faces the sun
  cam(W / 2, 960, p.zoom || 1);
  day("#5BC2F5", "#C2EBFF");
  sunD(120, 640, 100);
  hill(1260);
  // sun rays from the left
  ctx.save(); ctx.globalAlpha = 0.5; for (let i = 0; i < 5; i++) poly([170, 560 + i * 40, 540, 600 + i * 120, 540, 640 + i * 120, 170, 580 + i * 40], "rgba(255,240,160,0.6)"); ctx.restore();
  hero(540, 1330, 1.35, { g: 1, sprout: 1, mouth: "smile", look: -1 });
  // shade on the far side
  const sh = cl(p.shade || 0);
  if (sh > 0) { ctx.fillStyle = `rgba(14,24,69,${0.42 * sh})`; ctx.fillRect(540, -200, 800, H + 400);
    ctx.save(); ctx.setLineDash([30, 20]); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(540, 560); ctx.lineTo(540, 1340 * sh + 560 * (1 - sh)); ctx.stroke(); ctx.restore(); }
  label("SUN SIDE", 250, 1190, 60, C.sun, sh, -0.05);
  label("SHADE", 850, 1190, 60, "#FFFFFF", sh, 0.05);
  callout(540, 330, 780, 300, "FACING THE SUN", "≈ 1 m²", "ONLY HALF OF YOUR 1.8 m² OF SKIN", p.c1 || 0, C.sun, 130);
} else if (k === 5) { // 1-2 % efficiency grid
  cam(W / 2, 960, p.zoom || 1);
  navy(9);
  label("100 UNITS OF SUNLIGHT", 540, 300, 64, C.sun, p.head || 0);
  const n = 10, cs = 58, gap = 8, gw = n * cs + (n - 1) * gap, x0 = W / 2 - gw / 2, y0 = 450;
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / n), c = i % n, food = i === 44 || i === 45;
    const order = rnd(i * 1.7 + 3); const waste = cl((p.waste || 0) * 1.25 - order * 0.25 * 1);
    const pin = cl((p.grid || 0) * 1.6 - (r + c) * 0.035);
    if (pin <= 0) continue;
    const e = E.back(pin); let col = mixc(C.sun, "#3A4580", food ? 0 : waste);
    if (food && (p.food || 0) > 0) col = mixc(C.sun, C.green, cl(p.food * 2));
    const pul = food && p.food > 0 ? 1 + 0.12 * Math.max(0, Math.sin(t * 7)) * cl(p.food) : 1;
    const cx = x0 + c * (cs + gap) + cs / 2, cy = y0 + r * (cs + gap) + cs / 2, hs = (cs / 2) * e * pul;
    orr(cx - hs, cy - hs, hs * 2, hs * 2, 10 * e, col, 5);
  }
  label("HEAT", 870, 1170, 60, "#9AA6E0", cl((p.waste || 0) * 2 - 0.6), 0.06);
  if ((p.food || 0) > 0) { label("FOOD", 560, 1170, 64, C.green, p.food, -0.06); oline([560, 1120, 560, 780], 8, C.green, 5); arrowHead(560, 772, -Math.PI / 2, 26, C.green); }
  pot(110, 1330, 0.7);
  hero(275, 1330, 0.5, { g: 1, sprout: 1, mouth: "smile" });
} else if (k === 6) { // a whole day of sun: 50-90 kcal vs 2,000 needed
  cam(W / 2, 960, p.zoom || 1);
  const d = cl(p.day || 0);
  const top = d < 0.5 ? mixc("#FF9E7A", C.sky1, d * 2) : mixc(C.sky1, "#4A3C8F", (d - 0.5) * 2);
  const bot = d < 0.5 ? mixc("#FFE0A6", C.sky2, d * 2) : mixc(C.sky2, "#FF9A6A", (d - 0.5) * 2);
  grad(top, bot); cloud(200, 380, 0.75);
  sunD(110 + 560 * d, 900 - 560 * Math.sin(Math.PI * d), 80, t * 0.6, 1);
  hill(1220);
  hero(380, 1250, 1.0, { g: 1, sprout: 1, pose: (p.need || 0) > 0.3 ? "shrug" : "up", mouth: (p.need || 0) > 0.3 ? "o" : "grin", worry: (p.need || 0) > 0.3, sweat: (p.need || 0) > 0.5 });
  // food meter
  const bx = 820, bt = 340, bb = 1200, bw = 130, kc = p.kc || 0, fh = (bb - bt) * (kc / 2000);
  orr(bx - bw / 2, bt, bw, bb - bt, 26, "#FFFFFF", 8);
  if (fh > 1) { ctx.save(); ctx.beginPath(); ctx.roundRect(bx - bw / 2, bt, bw, bb - bt, 26); ctx.clip(); ctx.fillStyle = C.green; ctx.fillRect(bx - bw / 2, bb - fh, bw, fh + 10); ctx.restore(); orr(bx - bw / 2, bt, bw, bb - bt, 26, null, 8); }
  for (let i = 1; i < 10; i++) { ctx.fillStyle = "rgba(20,20,42,0.25)"; ctx.fillRect(bx - bw / 2 + 10, bt + i * (bb - bt) / 10, 30, 5); }
  label(Math.round(kc) + " kcal", bx - 95, bb - fh - 40, 54, "#FFFFFF", cl(kc / 10), 0, "right");
  if (kc > 30) { ctx.font = "54px LHeavy"; const tw2 = ctx.measureText(Math.round(kc) + " kcal").width; apple(bx - 95 - tw2 - 55, bb - fh - 44, 32 * E.back(cl((kc - 30) / 20))); }
  label("2,000 kcal", bx - 40, bt - 50, 62, C.red, p.need || 0, -0.03);
  label("NEEDED", bx + 10, bt + 20, 40, "#FFFFFF", p.need || 0, -0.03);
} else if (k === 7) { // tennis court from above, 40 m² of leaf-skin
  const z = p.zoom || 1; cam(540, 880, z);
  ctx.fillStyle = "#4DB04F"; ctx.fillRect(-W, -H, W * 3, H * 3);
  for (let i = -20; i < 40; i++) if (i % 2) { ctx.fillStyle = "#46A548"; ctx.fillRect(-W, i * 110, W * 3, 110); }
  const ppm = 42, cw = 10.97 * ppm, chh = 23.77 * ppm, cx = 540, cy = 880;
  orr(cx - cw / 2 - 90, cy - chh / 2 - 110, cw + 180, chh + 220, 20, "#2E6FB8", 8);
  ctx.fillStyle = "#3F8EDB"; ctx.fillRect(cx - cw / 2, cy - chh / 2, cw, chh);
  ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 7; ctx.strokeRect(cx - cw / 2, cy - chh / 2, cw, chh);
  const sw = 8.23 * ppm, svc = 6.40 * ppm; ctx.beginPath();
  ctx.moveTo(cx - sw / 2, cy - chh / 2); ctx.lineTo(cx - sw / 2, cy + chh / 2); ctx.moveTo(cx + sw / 2, cy - chh / 2); ctx.lineTo(cx + sw / 2, cy + chh / 2);
  ctx.moveTo(cx - sw / 2, cy - svc); ctx.lineTo(cx + sw / 2, cy - svc); ctx.moveTo(cx - sw / 2, cy + svc); ctx.lineTo(cx + sw / 2, cy + svc);
  ctx.moveTo(cx, cy - svc); ctx.lineTo(cx, cy + svc); ctx.stroke();
  oline([cx - cw / 2 - 40, cy, cx + cw / 2 + 40, cy], 8, "#E9EEF8", 4); oc(cx - cw / 2 - 40, cy, 10, "#E9EEF8", 4); oc(cx + cw / 2 + 40, cy, 10, "#E9EEF8", 4);
  // leaf-skin: area = (4/3)·a·c = 40 m² → a = 4.6 m, c = 6.52 m
  const lk = E.back(cl(p.leaf || 0)), la = 4.6 * ppm, lc = 6.52 * ppm;
  const hx0 = cx, hy0 = cy + 250;
  if (lk > 0) leafShape(hx0, hy0, la * lk, lc * lk, -0.12, C.leaf, 6, 1);
  hero(hx0, hy0 + 40, 0.115 * 1.0, { g: 1, sprout: 1, pose: "spread", mouth: "grin" });
  label("TENNIS COURT · 261 m²", 540, cy - chh / 2 - 60, 46, "#FFFFFF", p.court || 0);
} else if (k === 8) { // twenty times your skin
  cam(W / 2, 960, p.zoom || 1);
  navy(13);
  const sheet = (x, y, sc, col, col2, e) => { if (e <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc * e, sc * e);
    orr(-70, -80, 140, 160, 22, col, 6); oc(0, -38, 26, col2, 5); oline([-34, 22, 34, 22], 10, col2, 0); ctx.restore(); };
  sheet(190, 470, 1.0, C.skin, C.skinD, E.back(cl(p.lab || 0)));
  label("YOUR SKIN", 300, 420, 50, "#FFFFFF", p.lab || 0, 0, "left");
  label("1.8 m²", 300, 492, 50, C.sun, p.lab || 0, 0, "left");
  const n = p.n || 0;
  for (let i = 0; i < 20; i++) { const r = Math.floor(i / 5), c = i % 5; sheet(540 + (c - 2) * 172, 730 + r * 168, 0.85, C.leaf, C.leaf2, E.back(cl(n - i))); }
  label("×20", 860, 455, 170, C.sun, cl(n / 20 * 1.2 - 0.2), -0.08);
} else if (k === 9) { // would you still eat lunch?
  cam(W / 2, 960, p.zoom || 1);
  grad(C.sky1, C.sky2); cloud(260, 560, 0.7); sunD(880, 330, 80, t * 0.4, 1);
  hill(1230);
  hero(540, 1270, 1.25, { g: 1, sprout: 1, pose: "hold", mouth: "o", worry: 1, look: 1 });
  burger(540, 1270 - 300 * 1.25 + 30, 0.95);
  const q = cl(p.q || 0);
  label("?", 840, 640 + Math.sin(t * 4) * 12, 220, C.sun, q, 0.15);
  label("?", 230, 760 + Math.sin(t * 4 + 1) * 12, 140, "#FFFFFF", cl(q * 1.5 - 0.3), -0.2);
}
