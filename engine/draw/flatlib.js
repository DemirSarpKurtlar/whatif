// flatlib.js — flat 2D vector drawing helpers (prepended to every draw scene).
// Scope: ctx, W, H, t (global time), lt (scene time), p (scene params), E (easings).
const PAL = {
  navy0: "#0E1236", navy1: "#171C4F", navy2: "#252C74", violet: "#3A3F9C", bld1: "#2C3382", bld2: "#363E96", bld3: "#424AA8",
  roof: "#20265F", win: "#FFD45C", winOff: "#1A1E50", red: "#FF3B4E", teal: "#2EC4B6", grass: "#245E57", grass2: "#2E7366",
  road: "#262A5C", line: "#F7E8C6", cream: "#F7E8C6", zskin: "#93C46C", zskin2: "#6F9F4F", zcloth: "#55627F", zcloth2: "#7A5B4A",
  skin: "#F2C29B", skin2: "#DFA77F", hair: "#3B2A20", hoodie: "#8A5CF6", hoodie2: "#6C43D4", jeans: "#4A5578", shoe: "#FF3B4E", beanie: "#E8434F",
};
const TAU = Math.PI * 2;
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
function rnd(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function rr(x, y, w, h, r, fill) { ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); }
function circ(x, y, r, fill) { ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
function poly(pts, fill) { ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.closePath(); ctx.fill(); }
function limb(x1, y1, x2, y2, w, col) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function limb2(x1, y1, xm, ym, x2, y2, w, col) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(xm, ym); ctx.lineTo(x2, y2); ctx.stroke(); }

// ---- camera: call cam(cx, cy, zoom, shake) before drawing a scene, ctx is restored by the engine
function cam(cx, cy, zoom = 1, shake = 0) {
  const sx = shake * (rnd(Math.floor(t * 30)) - 0.5) * 30, sy = shake * (rnd(Math.floor(t * 30) + 9) - 0.5) * 30;
  ctx.translate(W / 2 + sx, H / 2 + sy); ctx.scale(zoom, zoom); ctx.translate(-cx, -cy);
}
// ---- sky + stars
function sky(top = PAL.navy0, bot = PAL.navy2, glow = 0, glowCol = "255,59,78") {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot);
  ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3);
  if (glow > 0) { const r = ctx.createRadialGradient(W / 2, H * 0.75, 50, W / 2, H * 0.75, H * 0.8); r.addColorStop(0, `rgba(${glowCol},${0.45 * glow})`); r.addColorStop(1, `rgba(${glowCol},0)`); ctx.fillStyle = r; ctx.fillRect(-W, -H, W * 3, H * 3); }
}
function stars(n = 140, yMax = H * 0.7, seed = 1) {
  for (let i = 0; i < n; i++) {
    const x = rnd(i * 3.1 + seed) * W * 1.4 - W * 0.2, y = rnd(i * 7.7 + seed) * yMax, s = 1.5 + rnd(i + seed * 5) * 2.5;
    const tw = 0.45 + 0.55 * Math.abs(Math.sin(t * (0.8 + rnd(i) * 2) + i));
    ctx.fillStyle = `rgba(255,255,255,${0.35 + 0.5 * tw})`; ctx.fillRect(x, y, s, s);
  }
}
// ---- town pieces
function building(x, yBase, w, h, col, lit = 1, seed = 0, roofCol = PAL.roof) {
  rr(x, yBase - h, w, h, 6, col);
  rr(x - 6, yBase - h - 14, w + 12, 18, 4, roofCol);
  const cw = 46, chh = 58, cols = Math.max(1, Math.floor((w - 30) / cw)), rows = Math.max(1, Math.floor((h - 50) / chh));
  const ox = x + (w - cols * cw) / 2 + 9;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const on = rnd(seed * 31 + r * 7 + c * 13) < 0.55 * lit;
    rr(ox + c * cw, yBase - h + 30 + r * chh, 28, 36, 3, on ? PAL.win : PAL.winOff);
  }
}
function skyline(yBase, lit = 1, seed = 1, scale = 1, col = PAL.bld1) {
  let x = -60; let i = 0;
  while (x < W + 60) { const w = (120 + rnd(seed + i) * 110) * scale, h = (260 + rnd(seed * 3 + i) * 420) * scale; building(x, yBase, w, h, i % 2 ? col : PAL.bld2, lit, seed * 10 + i); x += w + 14 * scale; i++; }
}
function ground(y, col = PAL.grass, col2 = PAL.grass2) { rr(-W, y, W * 3, H * 2, 0, col); rr(-W, y, W * 3, 22, 0, col2); }
function road(y, h = 160) { rr(-W, y, W * 3, h, 0, PAL.road); for (let x = -W; x < W * 2; x += 140) rr(x + ((t * 0) % 140), y + h / 2 - 5, 70, 10, 5, "rgba(247,232,198,0.55)"); }
function lamp(x, yBase, h = 330, on = 1) {
  rr(x - 7, yBase - h, 14, h, 6, "#1B2050"); rr(x - 7, yBase - h, 70, 12, 6, "#1B2050"); rr(x + 40, yBase - h + 6, 40, 16, 6, on > 0.5 ? "#FFE9A3" : "#2B3068");
  if (on > 0.5) { const g = ctx.createLinearGradient(0, yBase - h + 20, 0, yBase); g.addColorStop(0, "rgba(255,226,140,0.32)"); g.addColorStop(1, "rgba(255,226,140,0)"); poly([x + 42, yBase - h + 22, x + 78, yBase - h + 22, x + 150, yBase, x - 30, yBase], g); }
}
function tree(x, yBase, s = 1) { rr(x - 10 * s, yBase - 90 * s, 20 * s, 90 * s, 8, "#3B2C3F"); circ(x, yBase - 150 * s, 80 * s, "#1F7A6C"); circ(x - 45 * s, yBase - 110 * s, 55 * s, "#1C6A5E"); circ(x + 50 * s, yBase - 115 * s, 58 * s, "#23877A"); }
function hospital(x, yBase, s = 1, alarm = 0) {
  const w = 620 * s, h = 640 * s;
  rr(x - w / 2, yBase - h, w, h, 10, "#E9E6F5"); rr(x - w / 2, yBase - h, w, 40 * s, 8, "#C9C4E3");
  for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) rr(x - w / 2 + 40 * s + c * 92 * s, yBase - h + 80 * s + r * 86 * s, 56 * s, 52 * s, 4, (r * 6 + c) % 5 === 2 ? "#FFD45C" : "#9DB5E8");
  rr(x - 110 * s, yBase - 170 * s, 220 * s, 170 * s, 8, "#30368A"); rr(x - 90 * s, yBase - 150 * s, 180 * s, 150 * s, 6, "#9DB5E8");
  // red cross sign
  const cx = x, cy = yBase - h - 70 * s; rr(cx - 70 * s, cy - 70 * s, 140 * s, 140 * s, 18 * s, "#FFFFFF");
  rr(cx - 18 * s, cy - 52 * s, 36 * s, 104 * s, 6, PAL.red); rr(cx - 52 * s, cy - 18 * s, 104 * s, 36 * s, 6, PAL.red);
  if (alarm > 0) { const k = (Math.sin(t * 10) > 0 ? 1 : 0.2) * alarm; ctx.fillStyle = `rgba(255,59,78,${0.25 * k})`; ctx.fillRect(x - w / 2 - 200, yBase - h - 300, w + 400, h + 300); }
}
function car(x, yBase, s = 1, col = "#E8434F", lights = 0) {
  rr(x - 190 * s, yBase - 120 * s, 380 * s, 80 * s, 26 * s, col);
  poly([x - 120 * s, yBase - 118 * s, x - 70 * s, yBase - 190 * s, x + 80 * s, yBase - 190 * s, x + 130 * s, yBase - 118 * s], col);
  poly([x - 100 * s, yBase - 122 * s, x - 60 * s, yBase - 176 * s, x - 2 * s, yBase - 176 * s, x - 2 * s, yBase - 122 * s], "#9DB5E8");
  poly([x + 10 * s, yBase - 122 * s, x + 10 * s, yBase - 176 * s, x + 72 * s, yBase - 176 * s, x + 110 * s, yBase - 122 * s], "#9DB5E8");
  circ(x - 110 * s, yBase - 40 * s, 42 * s, "#14183F"); circ(x + 110 * s, yBase - 40 * s, 42 * s, "#14183F"); circ(x - 110 * s, yBase - 40 * s, 16 * s, "#8A90C8"); circ(x + 110 * s, yBase - 40 * s, 16 * s, "#8A90C8");
  rr(x + 168 * s, yBase - 104 * s, 26 * s, 20 * s, 6, lights ? "#FFF3B0" : "#F7E8C6");
  if (lights) { ctx.fillStyle = "rgba(255,243,176,0.25)"; poly([x + 190 * s, yBase - 104 * s, x + 700 * s, yBase - 200 * s, x + 700 * s, yBase + 20 * s, x + 190 * s, yBase - 84 * s], "rgba(255,243,176,0.22)"); }
}
function siren(x, y, k) { // flashing red/blue glow
  const on = Math.sin(t * 9) > 0; const r = ctx.createRadialGradient(x, y, 10, x, y, 420); const c = on ? "255,59,78" : "70,120,255";
  r.addColorStop(0, `rgba(${c},${0.55 * k})`); r.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = r; ctx.fillRect(x - 420, y - 420, 840, 840);
}
// ---- characters (y = feet baseline, s = scale; full height ~ 420*s)
function person(x, y, s = 1, o = {}) {
  const pose = o.pose || "idle", bob = o.walk ? Math.sin(t * 9) * 6 * s : Math.sin(t * 2) * 2 * s, look = o.look || 0;
  const hy = y - 330 * s + bob; // head centre
  ctx.save();
  if (o.flip) { ctx.translate(x, 0); ctx.scale(-1, 1); ctx.translate(-x, 0); }
  // legs
  const st = o.walk ? Math.sin(t * 9) * 26 * s : 0;
  limb(x - 22 * s, y - 150 * s + bob, x - 26 * s + st, y - 22 * s, 40 * s, PAL.jeans); limb(x + 22 * s, y - 150 * s + bob, x + 26 * s - st, y - 22 * s, 40 * s, PAL.jeans);
  rr(x - 58 * s + st, y - 30 * s, 64 * s, 30 * s, 14 * s, "#FFFFFF"); rr(x - 6 * s - st, y - 30 * s, 64 * s, 30 * s, 14 * s, "#FFFFFF");
  rr(x - 58 * s + st, y - 14 * s, 64 * s, 14 * s, 7 * s, PAL.shoe); rr(x - 6 * s - st, y - 14 * s, 64 * s, 14 * s, 7 * s, PAL.shoe);
  // torso (hoodie)
  rr(x - 72 * s, y - 280 * s + bob, 144 * s, 150 * s, 42 * s, PAL.hoodie); rr(x - 50 * s, y - 190 * s + bob, 100 * s, 44 * s, 16 * s, PAL.hoodie2);
  limb(x - 12 * s, y - 270 * s + bob, x - 14 * s, y - 225 * s + bob, 5 * s, "#FFFFFF"); limb(x + 12 * s, y - 270 * s + bob, x + 14 * s, y - 225 * s + bob, 5 * s, "#FFFFFF");
  // arms by pose
  const sh = [x - 62 * s, y - 255 * s + bob], sh2 = [x + 62 * s, y - 255 * s + bob];
  let L, R;
  if (pose === "scared") { L = [x - 100 * s, y - 300 * s, x - 40 * s, hy + 40 * s]; R = [x + 100 * s, y - 300 * s, x + 40 * s, hy + 40 * s]; }
  else if (pose === "phone") { L = [x - 95 * s, y - 180 * s, x - 70 * s, y - 120 * s]; R = [x + 95 * s, y - 215 * s, x + 70 * s, y - 280 * s]; }
  else if (pose === "point") { L = [x - 95 * s, y - 180 * s, x - 70 * s, y - 120 * s]; R = [x + 120 * s, y - 280 * s, x + 200 * s, y - 330 * s]; }
  else if (pose === "run") { const a = Math.sin(t * 9) * 40 * s; L = [x - 100 * s, y - 200 * s + a, x - 60 * s, y - 150 * s + a]; R = [x + 100 * s, y - 200 * s - a, x + 60 * s, y - 150 * s - a]; }
  else { L = [x - 95 * s, y - 185 * s, x - 82 * s, y - 128 * s]; R = [x + 95 * s, y - 185 * s, x + 82 * s, y - 128 * s]; }
  limb2(sh[0], sh[1], L[0], L[1], L[2], L[3], 34 * s, PAL.hoodie); limb2(sh2[0], sh2[1], R[0], R[1], R[2], R[3], 34 * s, PAL.hoodie);
  circ(L[2], L[3], 17 * s, PAL.skin); circ(R[2], R[3], 17 * s, PAL.skin);
  if (pose === "phone") { rr(R[2] - 14 * s, R[3] - 40 * s, 28 * s, 48 * s, 5 * s, "#1B1F52"); if (o.light) { const g = ctx.createRadialGradient(R[2], R[3] - 30 * s, 5, R[2] + 200 * s, R[3] - 30 * s, 420 * s); g.addColorStop(0, "rgba(255,248,210,0.55)"); g.addColorStop(1, "rgba(255,248,210,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(R[2], R[3] - 36 * s); ctx.lineTo(R[2] + 520 * s, R[3] - 250 * s); ctx.lineTo(R[2] + 520 * s, R[3] + 200 * s); ctx.closePath(); ctx.fill(); } }
  // head
  rr(x - 16 * s, hy + 40 * s, 32 * s, 30 * s, 8 * s, PAL.skin2);
  circ(x, hy, 70 * s, PAL.skin);
  // hair + beanie
  circ(x - 52 * s, hy + 10 * s, 22 * s, PAL.hair); circ(x + 52 * s, hy + 10 * s, 22 * s, PAL.hair);
  ctx.fillStyle = PAL.beanie; ctx.beginPath(); ctx.arc(x, hy - 12 * s, 74 * s, Math.PI, 0); ctx.fill(); rr(x - 78 * s, hy - 22 * s, 156 * s, 26 * s, 12 * s, "#C9313E"); circ(x, hy - 92 * s, 16 * s, "#FFFFFF");
  // face
  const ex = look * 10 * s, wide = o.mouth === "o" ? 1.15 : 1;
  circ(x - 25 * s, hy + 16 * s, 15 * s * wide, "#FFFFFF"); circ(x + 25 * s, hy + 16 * s, 15 * s * wide, "#FFFFFF");
  circ(x - 25 * s + ex, hy + 18 * s, 7 * s, "#1B1F52"); circ(x + 25 * s + ex, hy + 18 * s, 7 * s, "#1B1F52");
  if (o.mouth === "o") circ(x + ex * 0.5, hy + 48 * s, 11 * s, "#7A2333");
  else { ctx.strokeStyle = "#7A2333"; ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.arc(x + ex * 0.5, hy + 40 * s, 13 * s, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
  if (o.sweat) circ(x + 64 * s, hy - 6 * s + ((t * 60) % 30) * s, 7 * s, "#9DD9FF");
  ctx.restore();
}
function zombie(x, y, s = 1, o = {}) {
  const ph = (o.phase || 0) + t * (o.speed || 3), bob = Math.sin(ph * 2) * 7 * s, lean = 0.12 + 0.05 * Math.sin(ph);
  const skin = o.skin || PAL.zskin, cloth = o.cloth || PAL.zcloth;
  ctx.save(); ctx.translate(x, y); if (o.flip) ctx.scale(-1, 1); ctx.rotate(lean * 0.4); ctx.translate(-x, -y);
  const st = Math.sin(ph) * 24 * s;
  limb(x - 20 * s, y - 150 * s + bob, x - 24 * s + st, y - 18 * s, 38 * s, "#3E4566"); limb(x + 20 * s, y - 150 * s + bob, x + 22 * s - st, y - 18 * s, 38 * s, "#3E4566");
  rr(x - 52 * s + st, y - 22 * s, 58 * s, 22 * s, 10 * s, "#2A2E4E"); rr(x - 6 * s - st, y - 22 * s, 58 * s, 22 * s, 10 * s, "#2A2E4E");
  rr(x - 70 * s, y - 280 * s + bob, 140 * s, 150 * s, 36 * s, cloth);
  poly([x - 70 * s, y - 150 * s + bob, x - 40 * s, y - 120 * s + bob, x - 15 * s, y - 150 * s + bob, x + 20 * s, y - 118 * s + bob, x + 45 * s, y - 150 * s + bob, x + 70 * s, y - 128 * s + bob, x + 70 * s, y - 160 * s + bob, x - 70 * s, y - 160 * s + bob], cloth);
  circ(x - 20 * s, y - 220 * s + bob, 14 * s, PAL.zcloth2);
  // arms forward
  const ay = y - 255 * s + bob + Math.sin(ph * 1.3) * 8 * s;
  limb(x + 40 * s, y - 250 * s + bob, x + 175 * s, ay - 10 * s, 30 * s, cloth); limb(x - 30 * s, y - 250 * s + bob, x + 150 * s, ay + 22 * s, 30 * s, cloth);
  circ(x + 180 * s, ay - 10 * s, 16 * s, skin); circ(x + 155 * s, ay + 22 * s, 16 * s, skin);
  // head
  const hy = y - 330 * s + bob;
  circ(x + 8 * s, hy, 64 * s, skin); circ(x - 30 * s, hy - 30 * s, 22 * s, skin2(skin));
  rr(x - 50 * s, hy - 62 * s, 70 * s, 20 * s, 10 * s, "#3B4A2C");
  circ(x + 22 * s, hy + 6 * s, 15 * s, "#F4F7E8"); circ(x + 52 * s, hy + 4 * s, 12 * s, "#F4F7E8");
  circ(x + 24 * s, hy + 8 * s, 5 * s, o.eye || "#C0213A"); circ(x + 53 * s, hy + 6 * s, 4 * s, o.eye || "#C0213A");
  rr(x + 18 * s, hy + 32 * s, 44 * s, 18 * s, 6 * s, "#4A1F2A"); for (let i = 0; i < 3; i++) rr(x + 22 * s + i * 13 * s, hy + 32 * s, 8 * s, 8 * s, 2, "#F4F7E8");
  ctx.restore();
}
function skin2(c) { return PAL.zskin2; }
function silhouette(x, y, s, col = "rgba(8,10,30,0.92)", ph = 0) { // shambling zombie silhouette
  const b = Math.sin(t * 3 + ph) * 5 * s; ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(x + 6 * s, y - 330 * s + b, 58 * s, 0, TAU); ctx.fill();
  rr(x - 64 * s, y - 280 * s + b, 128 * s, 160 * s, 34 * s, col);
  limb(x + 30 * s, y - 250 * s + b, x + 170 * s, y - 250 * s + b + Math.sin(t * 4 + ph) * 10 * s, 28 * s, col);
  limb(x - 10 * s, y - 240 * s + b, x + 150 * s, y - 220 * s + b, 28 * s, col);
  const st = Math.sin(t * 3 + ph) * 20 * s; limb(x - 20 * s, y - 130 * s, x - 22 * s + st, y, 36 * s, col); limb(x + 20 * s, y - 130 * s, x + 22 * s - st, y, 36 * s, col);
  const glow = 0.7 + 0.3 * Math.sin(t * 5 + ph); circ(x + 22 * s, y - 336 * s + b, 8 * s, `rgba(255,70,90,${glow})`); circ(x + 46 * s, y - 338 * s + b, 7 * s, `rgba(255,70,90,${glow})`);
}
function icon(x, y, s, infected) { // tiny person icon for counters
  const c = infected ? PAL.zskin : "#F7E8C6"; circ(x, y - 46 * s, 16 * s, c); rr(x - 18 * s, y - 28 * s, 36 * s, 50 * s, 14 * s, c);
}
function scratches(x, y, k) { ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 6; ctx.lineCap = "round"; for (let i = 0; i < 4; i++) { const a = cl(k * 4 - i); if (a <= 0) continue; ctx.beginPath(); ctx.moveTo(x + i * 26, y); ctx.lineTo(x + i * 26 + 30 * a, y + 170 * a); ctx.stroke(); } }
