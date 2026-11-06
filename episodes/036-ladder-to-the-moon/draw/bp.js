// bp.js — "Blueprint Line" sheets for episode 036 (ladder to the Moon).
// One draw file, many sheets: p.sc selects the sheet, p.D = scene duration (added by spec.mjs), p.h = hero on/off,
// p.alt = draw the altitude cell (engine's elapsed counter sits in it), other p.* are per-sheet beat times.
const INK = "#E8F4FF", INK2 = "rgba(170,205,250,0.62)", INK3 = "rgba(170,205,250,0.3)", CY = "#7FD3FF", AMB = "#F2B84B", RED = "#FF5E5E";
const MONO = "'JetBrains Mono','DejaVu Sans Mono',monospace", THIN = "Inter,'Inter Display',sans-serif";
const SC = Math.round(p.sc || 0), D = p.D || 3;
const ez = E["ease-out"], eio = E["ease-in-out"];
const kk = (a, b) => cl((lt - a) / Math.max(1e-6, b - a));
function G(on, b = 12, c = "rgba(120,195,255,0.85)") { ctx.shadowColor = c; ctx.shadowBlur = on ? b : 0; }
function sl(x1, y1, x2, y2, w = 1.5, c = INK, dash) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]); }
function pl(pts, w = 1.5, c = INK, close = false, dash) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); if (close) ctx.closePath(); ctx.stroke(); ctx.setLineDash([]); }
function mt(s, x, y, size = 20, c = INK, align = "left", sp = 3, wt = 500) {
  ctx.font = `${wt} ${size}px ${MONO}`; ctx.fillStyle = c; ctx.textAlign = align; ctx.textBaseline = "alphabetic"; ctx.letterSpacing = sp + "px";
  ctx.fillText(s, align === "right" ? x + sp : align === "center" ? x + sp / 2 : x, y); ctx.letterSpacing = "0px";
}
function mw(s, size = 20, sp = 3, wt = 500) { ctx.font = `${wt} ${size}px ${MONO}`; ctx.letterSpacing = sp + "px"; const w = ctx.measureText(s).width; ctx.letterSpacing = "0px"; return w; }
function ah(x, y, ang, len = 14, c = INK, w = 1.5) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x + len * Math.cos(ang + 2.75), y + len * Math.sin(ang + 2.75)); ctx.lineTo(x, y); ctx.lineTo(x + len * Math.cos(ang - 2.75), y + len * Math.sin(ang - 2.75)); ctx.stroke(); }
function arr(x1, y1, x2, y2, c = INK, w = 2, len = 18) { sl(x1, y1, x2, y2, w, c); ah(x2, y2, Math.atan2(y2 - y1, x2 - x1), len, c, w); }
// dimension line with end ticks, arrows and a knocked-out label
function dim(x1, y1, x2, y2, label, k = 1, c = INK2, tc = INK) {
  if (k <= 0) return;
  const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1) * k, xe = x1 + Math.cos(a) * L, ye = y1 + Math.sin(a) * L;
  sl(x1, y1, xe, ye, 1.3, c); ah(x1, y1, a + Math.PI, 13, c, 1.3); if (k >= 1) ah(x2, y2, a, 13, c, 1.3);
  const nx = -Math.sin(a) * 16, ny = Math.cos(a) * 16; sl(x1 - nx, y1 - ny, x1 + nx, y1 + ny, 1.3, c); if (k >= 1) sl(x2 - nx, y2 - ny, x2 + nx, y2 + ny, 1.3, c);
  if (label && k > 0.6) {
    ctx.save(); ctx.globalAlpha *= cl((k - 0.6) / 0.4); ctx.translate((x1 + x2) / 2, (y1 + y2) / 2);
    let r = a; if (r > Math.PI / 2) r -= Math.PI; if (r < -Math.PI / 2) r += Math.PI; ctx.rotate(r);
    const tw = mw(label, 21, 3, 600) + 18; ctx.fillStyle = "#0F2C5A"; ctx.fillRect(-tw / 2, -17, tw, 32);
    mt(label, 0, 7, 21, tc, "center", 3, 600); ctx.restore();
  }
}
// leader: dot on the part, line to an elbow, shelf with label (+ optional sub label)
function lead(x, y, x2, y2, label, sub, k = 1, c = INK) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= cl(k * 2);
  ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 4, 0, TAU); ctx.fill();
  const q = cl(k * 1.6); sl(x, y, x + (x2 - x) * q, y + (y2 - y) * q, 1.3, c);
  if (k > 0.6) {
    ctx.globalAlpha *= cl((k - 0.6) / 0.4);
    const dir = x2 >= x ? 1 : -1, tw = Math.max(mw(label, 21, 3, 600), sub ? mw(sub, 16, 2.5) : 0);
    sl(x2, y2, x2 + dir * (tw + 14), y2, 1.3, c);
    mt(label, x2 + dir * 7, y2 - 10, 21, c, dir > 0 ? "left" : "right", 3, 600);
    if (sub) mt(sub, x2 + dir * 7, y2 + 26, 16, INK2, dir > 0 ? "left" : "right", 2.5);
  }
  ctx.restore();
}
function stamp(s, x, y, rot, c, k, size = 40) {
  if (k <= 0) return; const e = E["back"](cl(k)); ctx.save(); ctx.globalAlpha *= cl(k * 3); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1.6 - 0.6 * e, 1.6 - 0.6 * e);
  const w = mw(s, size, 6, 700) + 44, h = size * 1.6; ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.lineWidth = 1.5; ctx.strokeRect(-w / 2 + 7, -h / 2 + 7, w - 14, h - 14);
  mt(s, 0, size * 0.36, size, c, "center", 6, 700); ctx.restore();
}
// wireframe sphere (orthographic): front grid lines bright, back lines faint
function globe(cx, cy, r, o = {}) {
  const tilt = o.tilt ?? 0.4, spin = o.spin ?? 0, k = o.k ?? 1, nl = o.lat ?? 6, nm = o.lon ?? 12, col = o.col || INK;
  if (k <= 0) return;
  const ct = Math.cos(tilt), st = Math.sin(tilt);
  const P = (la, lo) => { const x = Math.cos(la) * Math.sin(lo + spin), y = Math.sin(la), z = Math.cos(la) * Math.cos(lo + spin); return [cx + r * x, cy - r * (y * ct - z * st), y * st + z * ct]; };
  const F = new Path2D(), B = new Path2D();
  const curve = (f, n) => { let pr = f(0); for (let i = 1; i <= n; i++) { const q = f(i / n); const Pth = (q[2] > 0 && pr[2] > 0) ? F : B; Pth.moveTo(pr[0], pr[1]); Pth.lineTo(q[0], q[1]); pr = q; } };
  for (let i = 1; i < nl; i++) { const la = -Math.PI / 2 + Math.PI * i / nl; curve((u) => P(la, u * TAU), 64); }
  for (let j = 0; j < nm; j++) { const lo = j * TAU / nm; curve((u) => P(-Math.PI / 2 + u * Math.PI, lo), 40); }
  ctx.save(); ctx.globalAlpha *= cl(k * 1.5 - 0.3);
  ctx.strokeStyle = INK3; ctx.lineWidth = 0.9; ctx.stroke(B);
  ctx.strokeStyle = o.gcol || "rgba(215,235,255,0.62)"; ctx.lineWidth = 1.2; ctx.stroke(F);
  if (o.craters) for (const [la, lo, rad] of o.craters) {
    const q = P(la, lo); if (q[2] < 0.15) continue; const ang = Math.atan2(q[1] - cy, q[0] - cx) + Math.PI / 2;
    ctx.beginPath(); ctx.ellipse(q[0], q[1], rad * r, rad * r * Math.max(0.2, q[2]), ang, 0, TAU); ctx.strokeStyle = "rgba(215,235,255,0.8)"; ctx.lineWidth = 1.3; ctx.stroke();
  }
  ctx.restore();
  G(true, 14); ctx.strokeStyle = col; ctx.lineWidth = o.w || 2.6; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + TAU * cl(k * 1.4)); ctx.stroke(); G(false);
}
// vertical ladder in elevation; off scrolls rungs downward (climbing)
function ladV(x, y1, y2, w = 40, step = 18, off = 0, c = INK, lw = 2.2) {
  G(true, 9); ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x - w / 2, y1); ctx.lineTo(x - w / 2, y2); ctx.moveTo(x + w / 2, y1); ctx.lineTo(x + w / 2, y2); ctx.stroke(); G(false);
  ctx.lineWidth = lw * 0.6; ctx.beginPath(); const o = ((off % step) + step) % step;
  for (let y = y2 - step + o; y > y1; y -= step) { ctx.moveTo(x - w / 2, y); ctx.lineTo(x + w / 2, y); } ctx.stroke();
}
// wireframe climber, front view, feet at (x, y). ph = climbing phase (1 per rung). o.float = spread pose
function climber(x, y, s = 1, ph = 0, o = {}) {
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.scale(s, s);
  const c = o.col || CY, sw = Math.sin(ph * Math.PI);
  let hl, hr, fl, fr, kl, kr;
  if (o.float) { const f = Math.sin(t * 1.3) * 6; hl = [-44, -128 + f]; hr = [46, -120 - f]; fl = [-30, 4 - f]; fr = [32, 0 + f]; kl = [-22, -26]; kr = [24, -26]; }
  else { hl = [-20, -136 + 10 * sw]; hr = [20, -136 - 10 * sw]; fl = [-17, -2 - 10 * sw]; fr = [17, -2 + 10 * sw]; kl = [-24, -28 - 10 * sw]; kr = [24, -28 + 10 * sw]; }
  G(true, 10, "rgba(127,211,255,0.9)"); ctx.strokeStyle = c; ctx.lineWidth = 2.6 / s; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath(); ctx.arc(0, -112, 11, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-15, -94); ctx.lineTo(15, -94); ctx.lineTo(10, -54); ctx.lineTo(-10, -54); ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-15, -92); ctx.lineTo((hl[0] - 15) / 2 - 4, (hl[1] - 92) / 2 + 8); ctx.lineTo(hl[0], hl[1]);
  ctx.moveTo(15, -92); ctx.lineTo((hr[0] + 15) / 2 + 4, (hr[1] - 92) / 2 + 8); ctx.lineTo(hr[0], hr[1]);
  ctx.moveTo(-8, -54); ctx.lineTo(kl[0], kl[1]); ctx.lineTo(fl[0], fl[1]); ctx.moveTo(8, -54); ctx.lineTo(kr[0], kr[1]); ctx.lineTo(fr[0], fr[1]); ctx.stroke();
  G(false); ctx.lineCap = "butt"; ctx.restore();
}
function stars(n, y0, y1, seed = 3, a = 1) {
  ctx.strokeStyle = `rgba(200,225,255,${0.55 * a})`; ctx.lineWidth = 1.2; ctx.beginPath();
  for (let i = 0; i < n; i++) { const x = 50 + rnd(i * 3.3 + seed) * (W - 100), y = y0 + rnd(i * 5.1 + seed) * (y1 - y0), s = 3 + rnd(i + seed) * 5; ctx.moveTo(x - s, y); ctx.lineTo(x + s, y); ctx.moveTo(x, y - s); ctx.lineTo(x, y + s); }
  ctx.stroke();
}
// ---------------- sheet chrome ----------------
function paper() {
  const g = ctx.createRadialGradient(W / 2, H * 0.45, 80, W / 2, H * 0.5, H * 0.78); g.addColorStop(0, "#17386B"); g.addColorStop(0.55, "#0E2B58"); g.addColorStop(1, "#061A39");
  ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600);
}
function grid(ox = 0, oy = 0) {
  const m = 27, M = 108; ox = ((ox % M) + M) % M; oy = ((oy % M) + M) % M;
  ctx.lineWidth = 1; ctx.strokeStyle = "rgba(150,195,255,0.05)"; ctx.beginPath();
  for (let x = -M + ox; x < W + M; x += m) { ctx.moveTo(x, -M); ctx.lineTo(x, H + M); } for (let y = -M + oy; y < H + M; y += m) { ctx.moveTo(-M, y); ctx.lineTo(W + M, y); } ctx.stroke();
  ctx.strokeStyle = "rgba(150,195,255,0.11)"; ctx.beginPath();
  for (let x = -M + ox; x < W + M; x += M) { ctx.moveTo(x, -M); ctx.lineTo(x, H + M); } for (let y = -M + oy; y < H + M; y += M) { ctx.moveTo(-M, y); ctx.lineTo(W + M, y); } ctx.stroke();
}
const SHEETS = [
  ["01", "LADDER L-1 · GENERAL ARRANGEMENT", "NTS", "A · 2026"],
  ["01", "LADDER L-1 · GENERAL ARRANGEMENT", "NTS", "A · 2026"],
  ["02", "DETAIL B · RUNGS · CLIMB RATE", "1 : 5", "B · 2026"],
  ["03", "ELEVATION · 11 KM · AIRLINER", "1 : 500", "C · 2026"],
  ["04", "ELEVATION · 100 KM · KÁRMÁN LINE", "NTS", "D · 2026"],
  ["05", "ELEVATION · 408 KM · ISS PASS", "1 : 400", "E · 2026"],
  ["06", "ORBIT PLAN · GPS / GEO", "NTS", "F · 2026"],
  ["07", "DETAIL C · GEOSTATIONARY FORCES", "1 : 20", "G · 2026"],
  ["08", "LUNAR ORBIT · PLAN VIEW", "NTS", "H · 2026"],
  ["09", "FAILURE MODE · LADDER SNAPS", "NTS", "J · 2026"],
  ["10", "MATERIAL CHECK · SELF-WEIGHT", "LOG", "K · 2026"],
];
function chromeBegin() { const z = 1 + 0.035 * cl(lt / Math.max(0.5, D)); ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(1 / z, 1 / z); ctx.translate(-W / 2, -H / 2); }
function chrome() {
  const S = SHEETS[SC] || SHEETS[0], L = "rgba(200,225,255,0.55)";
  ctx.strokeStyle = "rgba(200,225,255,0.6)"; ctx.lineWidth = 2; ctx.strokeRect(20, 20, W - 40, H - 40);
  ctx.strokeStyle = "rgba(200,225,255,0.32)"; ctx.lineWidth = 1; ctx.strokeRect(32, 32, W - 64, H - 64);
  ctx.fillStyle = "rgba(7,26,58,0.88)"; ctx.fillRect(32, 32, W - 64, 78); ctx.strokeStyle = L; ctx.lineWidth = 1.3; ctx.strokeRect(32, 32, W - 64, 78);
  for (const x of [168, 776, 902]) sl(x, 32, x, 110, 1.3, L);
  mt("SHEET", 46, 56, 13, INK2, "left", 3); mt(S[0] + " / 10", 46, 93, 24, INK, "left", 1.5, 600);
  mt("WHAT IF YOU CLIMBED A LADDER TO THE MOON?", 182, 56, 13, INK2, "left", 2.4); mt(S[1], 182, 93, 20, INK, "left", 1.6, 600);
  mt("SCALE", 790, 56, 13, INK2, "left", 3); mt(S[2], 790, 93, 22, INK, "left", 2, 600);
  mt("REV", 916, 56, 13, INK2, "left", 3); mt(S[3], 916, 93, 20, INK, "left", 1.5, 600);
  if (p.alt) { ctx.fillStyle = "rgba(7,26,58,0.88)"; ctx.fillRect(776, 110, W - 32 - 776, 172); ctx.strokeStyle = L; ctx.strokeRect(776, 110, W - 32 - 776, 172); }
  mt("036 · L-1 · DWG " + S[0], W - 46, H - 44, 14, INK3, "right", 3);
  mt("ALL DIMENSIONS IN KM UNLESS NOTED", 46, H - 44, 14, INK3, "left", 3);
}
// big thin hero number, top-left, static on the sheet
function hero(top, num, unit, sub, k, o = {}) {
  if (k <= 0) return; const x = o.x || 62, y = o.y || 418, size = o.size || 176, e = ez(cl(k));
  ctx.save(); ctx.globalAlpha *= e;
  mt(top, x + 6, y - size * 0.74 - 26, 19, CY, "left", 4, 600);
  ctx.font = `200 ${size}px ${THIN}`; ctx.fillStyle = INK; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.letterSpacing = "-3px";
  G(true, 22, "rgba(120,195,255,0.45)"); ctx.fillText(num, x, y + (1 - e) * 24); G(false); const nw = ctx.measureText(num).width; ctx.letterSpacing = "0px";
  if (unit) mt(unit, x + nw + 16, y - 8, 36, CY, "left", 3, 700);
  if (sub) mt(sub, x + 6, y + 48, 19, "rgba(205,228,255,0.8)", "left", 3.5, 500);
  ctx.restore();
}
const fmt = (v) => Math.round(v).toLocaleString("en-US");

// ---------------- sheets ----------------
paper();
ctx.save();
if (SC === 0 || SC === 1) {
  // GENERAL ARRANGEMENT: Earth, ladder, Moon, 384,400 km dimension
  const dy = -12 * lt; grid(0, dy * 0.5); ctx.translate(0, 0);
  const ex = 640, ey = 1640, er = 360, mx = 640, my = 640, mr = 112;
  globe(ex, ey, er, { tilt: 0.42, spin: t * 0.06, k: cl(lt / 0.9 + (SC === 1 ? 1 : 0)), lat: 7, lon: 14 });
  const kL = SC === 1 ? 1 : ez(kk(0.2, 1.6)), yTop = lerp(ey - er, my + mr, kL);
  ladV(mx, yTop, ey - er + 2, 28, 13, SC === 1 ? lt * 13 : 0);
  globe(mx, my, mr, { tilt: 0.25, spin: -0.4 + t * 0.03, k: SC === 1 ? 1 : kk(0.8, 1.8), lat: 5, lon: 10, craters: [[0.4, 0.3, 0.16], [-0.3, -0.5, 0.11], [0.1, -0.1, 0.08], [-0.6, 0.4, 0.13], [0.7, -0.6, 0.07]] });
  const kd = SC === 1 ? ez(kk(0.0, 0.9)) : 0;
  sl(mx + mr + 8, my, 960, my, 1, INK3, [6, 6]); sl(ex + 18, ey - er, 960, ey - er, 1, INK3, [6, 6]);
  dim(930, ey - er, 930, my, "384,400 KM", kd);
  const kl = SC === 1 ? kk(0.4, 1.4) : 0;
  lead(mx - 70, my - 80, 330, 560, "MOON", "Ø 3,474 KM", kl);
  lead(ex - 250, ey - 255, 170, 1180, "EARTH", "Ø 12,742 KM", kl);
  lead(mx - 14, 980, 330, 900, "LADDER L-1", "1.28 BILLION RUNGS", SC === 1 ? kk(0.9, 1.9) : 0);
  chromeBegin(); chrome();
  if (SC === 1) {
    const k = kk(0.05, 1.0);
    hero("MEAN DISTANCE · EARTH → MOON", fmt(384400 * ez(k)), "KM", "1 RUNG = 30 CM · NOT TO SCALE", p.h ? cl(lt / 0.3) : 0, { size: 168 });
  }
  ctx.restore();
} else if (SC === 2) {
  // RUNG DETAIL: perspective view up the ladder, rungs scroll down at one per second
  grid(0, 0);
  const f = 900, a = 1.22, ca = Math.cos(a), sa = Math.sin(a), off = (t * 0.3) % 0.3;
  const P3 = (x, y, z) => { const cz = y * sa + z * ca, cy = y * ca - z * sa; return [W / 2 + f * x / cz, H / 2 - f * cy / cz, cz]; };
  const vpY = H / 2 - f * ca / sa;
  globe(W / 2, vpY - 34, 34, { tilt: 0.2, spin: t * 0.05, lat: 4, lon: 8, w: 1.8, craters: [[0.3, 0.2, 0.2], [-0.3, -0.4, 0.15]] });
  lead(W / 2 + 30, vpY - 60, 760, 520, "MOON", "384,400 KM AWAY", kk(0.6, 1.5));
  // rails (tubes)
  G(true, 10);
  for (const sx of [-1, 1]) for (const d of [-0.016, 0.016]) { const A = P3(sx * (0.23 + d), 0.08, 0.5), B2 = P3(sx * (0.23 + d), 80, 0.5); sl(A[0], A[1], B2[0], B2[1], 2, INK); }
  G(false);
  sl(W / 2, H, W / 2, vpY, 1, INK3, [10, 8]);
  // rungs
  let dimI = null;
  for (let i = 1; i < 260; i++) {
    const y = i * 0.3 - off; if (y < 0.1) continue;
    const A = P3(-0.23, y + 0.016, 0.5), B2 = P3(0.23, y + 0.016, 0.5), A2 = P3(-0.23, y - 0.016, 0.5), B3 = P3(0.23, y - 0.016, 0.5);
    const al = cl(1.2 - y / 40);
    ctx.globalAlpha = al; sl(A[0], A[1], B2[0], B2[1], y < 2 ? 2 : 1.2, INK); if (y < 6) sl(A2[0], A2[1], B3[0], B3[1], y < 2 ? 1.6 : 1, INK2); ctx.globalAlpha = 1;
    if (dimI === null && y > 0.62) dimI = y;
  }
  if (dimI !== null) {
    const r1 = P3(0.25, dimI, 0.5), r2 = P3(0.25, dimI + 0.3, 0.5), xx = r1[0] + 70;
    sl(r1[0] + 10, r1[1], xx + 16, r1[1], 1, INK3, [5, 5]); sl(r2[0] + 10, r2[1], xx + 16, r2[1], 1, INK3, [5, 5]);
    ctx.save(); ctx.globalAlpha *= kk(0.3, 0.9); dim(xx, r1[1], xx, r2[1], "300", 1); ctx.restore();
    lead(xx, (r1[1] + r2[1]) / 2 + 40, 700, 1600, "PITCH 300 MM", "1 RUNG / SECOND", kk(0.9, 1.8));
  }
  lead(P3(-0.23, 1.2, 0.5)[0], P3(-0.23, 1.2, 0.5)[1], 120, 1100, "RAIL", "Ø 32 MM TUBE", kk(1.2, 2.1));
  chromeBegin(); chrome();
  hero("CLIMB RATE · NON-STOP", "0.3", "M/S", "= 26 KM PER DAY", cl(lt / 0.3));
  ctx.restore();
} else if (SC === 3) {
  // AIRLINER passes beneath your feet
  const scroll = t * 16; grid(0, scroll * 0.5);
  // clouds (contour lines)
  ctx.save(); ctx.strokeStyle = INK3; ctx.lineWidth = 1.2;
  for (let j = 0; j < 5; j++) { ctx.beginPath(); for (let x = 30; x <= W - 30; x += 12) { const y = 1290 + j * 22 + 14 * Math.sin(x * 0.012 + j + t * 0.2) + 8 * Math.sin(x * 0.031 - j * 2); x === 30 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
  ctx.restore();
  ladV(690, 120, H, 44, 18, scroll * 1.125);
  climber(690, 760, 1.25, t);
  // airliner (side view, facing left), drawn in front of the ladder
  const px = lerp(1300, -500, (lt - (p.plane || 0)) / 4.0), py = 1050, s = 1.15;
  ctx.save(); ctx.translate(px, py); ctx.scale(s, s);
  const fus = [[-232, 0], [-224, -14], [-205, -24], [-170, -27], [140, -27], [232, -34], [236, -26], [232, -20], [150, 12], [-170, 22], [-212, 16], [-228, 8]];
  ctx.fillStyle = "rgba(14,43,88,0.92)"; ctx.beginPath(); fus.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fill();
  poly([140, -27, 196, -112, 222, -112, 232, -34], "rgba(14,43,88,0.92)");
  G(true, 10); pl(fus, 2.4 / s, INK, true); pl([[140, -27], [196, -112], [222, -112], [232, -34]], 2.2 / s, INK); G(false);
  pl([[176, -22], [236, -44], [248, -40], [200, -14]], 1.6 / s, INK2, true);
  pl([[-70, 6], [70, 30], [96, 30], [10, 8]], 1.8 / s, INK, true);
  ctx.strokeStyle = INK; ctx.lineWidth = 1.6 / s; ctx.beginPath(); ctx.roundRect(-58, 16, 70, 26, 12); ctx.stroke(); sl(-58, 29, 12, 29, 1 / s, INK3);
  ctx.strokeStyle = INK2; ctx.lineWidth = 1.2 / s; ctx.beginPath(); for (let x = -160; x < 132; x += 13) { ctx.moveTo(x, -15); ctx.lineTo(x + 6, -15); } ctx.stroke();
  pl([[-218, -12], [-206, -18], [-194, -18], [-194, -11]], 1.4 / s, INK2, true);
  sl(-150, -24, -150, 10, 1 / s, INK3); sl(110, -24, 110, 10, 1 / s, INK3);
  for (const yy of [30, 36]) sl(98, yy, 98 + 700, yy - 20, 1 / s, "rgba(200,225,255,0.22)", [14, 10]);
  ctx.restore();
  lead(px + 120, py - 70, Math.min(px + 300, 740), py - 200, "AIRLINER", "CRUISE ≈ 11 KM · 900 KM/H", px < 700 && px > -200 ? 1 : 0);
  dim(160, 760, 160, 1250, "11 KM", kk(0.3, 1.1));
  sl(160, 760, 650, 760, 1, INK3, [6, 6]); mt("GROUND ↓", 160, 1290, 17, INK2, "center", 3);
  chromeBegin(); chrome();
  hero("T + 10 HOURS", "36,000", "RUNGS", "ALTITUDE 11 KM · CRUISE LEVEL", cl(lt / 0.3), { size: 160 });
  ctx.restore();
} else if (SC === 4) {
  // KÁRMÁN LINE: atmosphere layers sink below you
  const k = kk(0, D), base = 1500 + 350 * k, s = 6, R = 2800, cx = W / 2;
  grid(0, 350 * k);
  const arc = (h, w, c, dash) => { const r = R + h * s; ctx.strokeStyle = c; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.arc(cx, base + R, r, -Math.PI / 2 - 0.42, -Math.PI / 2 + 0.42); ctx.stroke(); ctx.setLineDash([]); };
  stars(46, 150, base - 100 * s - 30, 7, cl((1000 - (base - 100 * s)) / -200 + 1));
  // ground with section hatching
  G(true, 10); arc(0, 3, INK); G(false);
  ctx.save(); ctx.beginPath(); ctx.arc(cx, base + R, R, 0, TAU); ctx.clip(); ctx.strokeStyle = INK3; ctx.lineWidth = 1.2; ctx.beginPath();
  for (let x = -400; x < W + 400; x += 22) { ctx.moveTo(x, base - 40); ctx.lineTo(x - 60, base + 60); } ctx.stroke(); ctx.restore();
  arc(12, 1.2, INK2, [4, 6]); arc(50, 1.2, INK2, [4, 6]); arc(85, 1.2, INK2, [4, 6]);
  G(true, 16, "rgba(127,211,255,0.9)"); arc(100, 3, CY, [18, 10]); G(false);
  const yl = (h) => base - h * s;
  mt("TROPOSPHERE", 70, yl(6) + 8, 18, INK2, "left", 3); mt("STRATOSPHERE", 70, yl(31) + 8, 18, INK2, "left", 3); mt("MESOSPHERE", 70, yl(68) + 8, 18, INK2, "left", 3);
  mt("KÁRMÁN LINE · 100 KM", W - 70, yl(100) - 18, 22, CY, "right", 3, 700); mt("EDGE OF SPACE", W - 70, yl(100) + 34, 17, INK2, "right", 3);
  ladV(540, 120, base, 40, 18, t * 18);
  climber(540, 1130, 1.2, t);
  dim(800, base, 800, yl(100), "100 KM", kk(0.4, 1.3));
  chromeBegin(); chrome();
  hero("T + 4 DAYS", "100", "KM", "YOU CROSS INTO SPACE", cl(lt / 0.3));
  ctx.restore();
} else if (SC === 5) {
  // ISS rushes past at 7.66 km/s
  grid(0, t * 9);
  stars(40, 140, 1850, 11, 0.8);
  ladV(880, 282, H, 40, 18, t * 18);
  climber(880, 1120, 1.2, t);
  const pass = (lt - (p.iss || 0)) / 3.0, cx = lerp(1750, -760, pass), cy = 820;
  // speed lines behind it
  if (pass > -0.1 && pass < 1.3) {
    ctx.save(); for (let j = 0; j < 9; j++) { const yy = cy - 230 + j * 58 + rnd(j) * 20, x0 = cx + 380 + rnd(j + 3) * 120, len = 300 + rnd(j + 7) * 500; ctx.globalAlpha = 0.5; sl(x0, yy, x0 + len, yy, 1.4, INK2, [26, 14]); } ctx.restore();
  }
  // 3D wireframe of the station (orthographic, yaw/pitch)
  const yaw = 0.55, pit = 0.32, sc3 = 7.2, cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pit), sp2 = Math.sin(pit);
  const Q = (x, y, z) => { const X = x * cyw + z * syw, Z = -x * syw + z * cyw; return [cx + sc3 * X, cy - sc3 * (y * cp - Z * sp2)]; };
  const box = (x0, x1, y0, y1, z0, z1, c, w) => { const v = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) v.push(Q(x, y, z));
    const E2 = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]]; ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); for (const [a2, b2] of E2) { ctx.moveTo(v[a2][0], v[a2][1]); ctx.lineTo(v[b2][0], v[b2][1]); } ctx.stroke(); };
  if (cx > -900 && cx < 1900) {
    G(true, 10);
    box(-54, 54, -1.6, 1.6, -1.6, 1.6, INK, 2);
    // truss lattice
    ctx.strokeStyle = INK2; ctx.lineWidth = 1; ctx.beginPath(); for (let x = -54; x < 54; x += 4) { const a2 = Q(x, -1.6, 1.6), b2 = Q(x + 4, 1.6, 1.6); ctx.moveTo(a2[0], a2[1]); ctx.lineTo(b2[0], b2[1]); } ctx.stroke();
    // solar array wings
    for (const xw of [-50, -36, 36, 50]) for (const sgn of [1, -1]) {
      const y0 = 3 * sgn, y1 = 36 * sgn, c1 = Q(xw - 5.5, y0, 0), c2 = Q(xw + 5.5, y0, 0), c3 = Q(xw + 5.5, y1, 0), c4 = Q(xw - 5.5, y1, 0);
      ctx.fillStyle = "rgba(14,43,88,0.6)"; poly([c1[0], c1[1], c2[0], c2[1], c3[0], c3[1], c4[0], c4[1]], "rgba(14,43,88,0.55)");
      pl([c1, c2, c3, c4], 1.8, INK, true);
      ctx.strokeStyle = INK2; ctx.lineWidth = 0.9; ctx.beginPath();
      for (let u = 1; u < 10; u++) { const a2 = Q(xw - 5.5, lerp(y0, y1, u / 10), 0), b2 = Q(xw + 5.5, lerp(y0, y1, u / 10), 0); ctx.moveTo(a2[0], a2[1]); ctx.lineTo(b2[0], b2[1]); }
      const m1 = Q(xw, y0, 0), m2 = Q(xw, y1, 0); ctx.moveTo(m1[0], m1[1]); ctx.lineTo(m2[0], m2[1]); ctx.stroke();
      const s1 = Q(xw, 1.6 * sgn, 0); sl(s1[0], s1[1], m1[0], m1[1], 1.4, INK);
    }
    // pressurised modules along z
    for (const [z0, z1, r] of [[-26, -14, 2.1], [-14, -2, 2.2], [2, 14, 2.2], [14, 24, 2.1], [24, 30, 1.6]]) box(-r, r, -r - 3, r - 3, z0, z1, INK, 1.6);
    // radiators
    for (const xr of [-16, 16]) { const r1 = Q(xr - 1.5, 0, 3), r2 = Q(xr + 1.5, 0, 3), r3 = Q(xr + 1.5, 0, 20), r4 = Q(xr - 1.5, 0, 20); pl([r1, r2, r3, r4], 1.3, INK2, true); }
    G(false);
  }
  const kv = kk((p.iss || 0) + 1.8, (p.iss || 0) + 2.6);
  if (kv > 0) { ctx.save(); ctx.globalAlpha *= kv; sl(W - 60, cy, 60, cy, 1, INK3, [8, 8]); G(true, 12, "rgba(242,184,75,0.8)"); arr(800, cy + 150, 800 - 600 * ez(kv), cy + 150, AMB, 3, 22); G(false);
    mt("v = 7.66 KM/S", 800, cy + 205, 26, AMB, "right", 3, 700); mt("ISS ORBIT · 92 MIN PER LAP", 800, cy + 240, 17, INK2, "right", 3); ctx.restore(); }
  lead(cx - 40, cy - 40, cx - 160, cy - 300, "ISS", "ALT 408 KM · 420 T", cx > 470 && cx < 1060 ? 1 : 0);
  chromeBegin(); chrome();
  hero("T + 16 DAYS · ALT 408 KM", "7.66", "KM/S", "≈ 27,600 KM/H PAST YOUR LADDER", p.h ? cl(lt / 0.3) : 0);
  ctx.restore();
} else if (SC === 6) {
  // ORBIT PLAN: pull back to GPS and GEO rings
  grid(0, 0);
  const z = lerp(2.4, 1, ez(kk(0, 1.6))), ex = 540, ey = 1300;
  ctx.save(); ctx.translate(ex, ey); ctx.scale(z, z); ctx.translate(-ex, -ey);
  const rE = 112, rL = 120, rG = 468, rS = 742;
  ctx.strokeStyle = INK3; ctx.lineWidth = 1 / z; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.arc(ex, ey, rL, 0, TAU); ctx.stroke();
  ctx.lineWidth = 1.4 / z; ctx.strokeStyle = INK2; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.arc(ex, ey, rS, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
  G(true, 12, "rgba(127,211,255,0.8)"); ctx.strokeStyle = CY; ctx.lineWidth = 2 / z; ctx.beginPath(); ctx.arc(ex, ey, rG, -Math.PI / 2, -Math.PI / 2 + TAU * ez(kk(0.3, 1.5))); ctx.stroke(); G(false);
  globe(ex, ey, rE, { tilt: 0.45, spin: t * 0.4, lat: 6, lon: 12 });
  // ladder: radial, straight up
  ctx.strokeStyle = INK; ctx.lineWidth = 1.6 / z; ctx.beginPath(); ctx.moveTo(ex - 5, ey - rE); ctx.lineTo(ex - 5, ey - rS - 30); ctx.moveTo(ex + 5, ey - rE); ctx.lineTo(ex + 5, ey - rS - 30); ctx.stroke();
  sl(ex, ey - rS - 36, ex, ey - rS - 70, 1.4 / z, INK2, [5, 5]);
  ctx.lineWidth = 1 / z; ctx.beginPath(); for (let y = ey - rE; y > ey - rS - 30; y -= 9) { ctx.moveTo(ex - 5, y); ctx.lineTo(ex + 5, y); } ctx.stroke();
  // GPS satellites
  for (let j = 0; j < 6; j++) {
    const th = j * TAU / 6 + t * 0.22 + 0.3, sx = ex + rG * Math.cos(th), sy = ey + rG * Math.sin(th);
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(th); ctx.strokeStyle = INK; ctx.lineWidth = 1.6 / z; ctx.strokeRect(-7, -7, 14, 14);
    ctx.strokeRect(-6, -30, 12, 20); ctx.strokeRect(-6, 10, 12, 20); ctx.restore();
  }
  ctx.restore();
  const ky = kk(0.8, 1.4);
  if (ky > 0) { ctx.save(); ctx.globalAlpha *= ky; const yy = ey - rG; ctx.strokeStyle = CY; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ex, yy, 14 + 6 * Math.sin(t * 6), 0, TAU); ctx.stroke(); circ(ex, yy, 6, CY); ctx.restore(); }
  lead(ex + 10, ey - rG, 760, 690, "YOU · YEAR 2", "20,200 KM UP", ky, CY);
  lead(ex + rG * Math.cos(-2.5), ey + rG * Math.sin(-2.5), 150, 620, "GPS", "MEO · 12 H ORBIT", kk(0.6, 1.2));
  lead(ex + rS * Math.cos(-0.5), ey + rS * Math.sin(-0.5), 900, 1180, "GEO", "35,786 KM", kk(1.0, 1.6));
  chromeBegin(); chrome();
  hero("T + 2 YEARS", "20,200", "KM", "GPS SATELLITE ALTITUDE", cl(lt / 0.3), { size: 168 });
  ctx.restore();
} else if (SC === 7) {
  // GEOSTATIONARY: forces cancel, you float off the rungs
  grid(0, 0);
  stars(36, 140, 1850, 21, 0.7);
  sl(40, 1000, W - 40, 1000, 1.4, INK2, [16, 10]); mt("GEOSTATIONARY RING · 35,786 KM", 60, 1036, 17, INK2, "left", 3);
  ladV(880, 282, H, 44, 18, 0);
  const fx = 700 + 14 * Math.sin(t * 0.7), fy = 1060 + 26 * Math.sin(t * 0.9) - 40 * ez(kk(0.2, 2.5)), rot = -0.25 * Math.sin(t * 0.5) - 0.12 * lt;
  climber(fx, fy, 1.3, 0, { float: 1, rot });
  const F0 = p.f ?? 0.5, cyc = fy - 75, kf = ez(kk(F0, F0 + 0.9)), L = 200 * kf;
  if (kf > 0) {
    G(true, 12, "rgba(127,211,255,0.8)"); arr(fx, cyc - 95, fx, cyc - 95 - L, CY, 3, 22); G(false);
    G(true, 12, "rgba(242,184,75,0.8)"); arr(fx, cyc + 95, fx, cyc + 95 + L, AMB, 3, 22); G(false);
    ctx.save(); ctx.globalAlpha *= kf;
    mt("SPIN-OUT  ω²r", fx - 30, cyc - 230, 22, CY, "right", 3, 700); mt("0.224 M/S²", fx - 30, cyc - 198, 19, INK2, "right", 3);
    mt("GRAVITY  GM/r²", fx - 30, cyc + 220, 22, AMB, "right", 3, 700); mt("0.224 M/S²", fx - 30, cyc + 252, 19, INK2, "right", 3);
    ctx.restore();
  }
  const kn = kk(F0 + 1.0, F0 + 1.5); if (kn > 0) { ctx.save(); ctx.globalAlpha *= kn; ctx.fillStyle = "#10305F"; ctx.fillRect(fx - 380, cyc - 30, 250, 60); ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.strokeRect(fx - 380, cyc - 30, 250, 60); mt("NET = 0", fx - 255, cyc + 10, 28, INK, "center", 4, 700); ctx.restore(); }
  // geostationary satellite
  const gx = 260, gy = 620 + 10 * Math.sin(t * 0.6);
  G(true, 8); ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.strokeRect(gx - 26, gy - 22, 52, 44); ctx.strokeRect(gx - 150, gy - 14, 110, 28); ctx.strokeRect(gx + 40, gy - 14, 110, 28);
  sl(gx - 40, gy, gx - 26, gy, 1.5, INK); sl(gx + 26, gy, gx + 40, gy, 1.5, INK); ctx.beginPath(); ctx.ellipse(gx, gy + 40, 26, 9, 0, 0, Math.PI); ctx.stroke(); G(false);
  ctx.strokeStyle = INK3; ctx.lineWidth = 1; ctx.beginPath(); for (let u = 1; u < 5; u++) { ctx.moveTo(gx - 150 + u * 22, gy - 14); ctx.lineTo(gx - 150 + u * 22, gy + 14); ctx.moveTo(gx + 40 + u * 22, gy - 14); ctx.lineTo(gx + 40 + u * 22, gy + 14); } ctx.stroke();
  ctx.save(); ctx.globalAlpha *= kk(0.8, 1.4); mt("COMSAT", gx, gy + 92, 21, INK, "center", 3, 600); mt("ALSO HANGS STILL · 24 H ORBIT", gx, gy + 120, 15, INK2, "center", 2.5); ctx.restore();
  chromeBegin(); chrome();
  if (lt < F0 + 0.6) hero("T + 3.8 YEARS", "35,786", "KM", "GEOSTATIONARY ORBIT", cl(lt / 0.3), { size: 168 });
  else hero("T + 3.8 YEARS · 35,786 KM", "0.00", "G", "YOU WEIGH NOTHING", cl((lt - F0 - 0.6) / 0.3));
  ctx.restore();
} else if (SC === 8) {
  // LUNAR ORBIT: the Moon swings closer and farther, the ladder buckles then tears
  grid(0, 0);
  const ex = 560, ey = 960, a = 400, e = 0.12, Rm = (th) => a * (1 - e * e) / (1 + e * Math.cos(th));
  const pt = (th) => [ex - Rm(th) * Math.cos(th), ey - Rm(th) * Math.sin(th)];
  ctx.strokeStyle = INK2; ctx.lineWidth = 1.6; ctx.setLineDash([12, 9]); ctx.beginPath(); for (let i = 0; i <= 120; i++) { const q = pt(i / 120 * TAU); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke(); ctx.setLineDash([]);
  sl(ex - a * (1 - e) - 20, ey, ex + a * (1 + e) + 20, ey, 1, INK3, [3, 6]);
  globe(ex, ey, 46, { tilt: 0.4, spin: t * 0.8, lat: 5, lon: 10, w: 2 });
  const th = p.th ?? lerp(-0.25, Math.PI + 0.25, eio(kk(0.3, D - 0.2))), m = pt(th), r = Rm(th), km = lerp(363300, 405500, (r - a * (1 - e)) / (2 * a * e));
  const st = (km - 384400) / 21100, col = st < -0.15 ? AMB : st > 0.15 ? RED : INK;
  // ladder Earth -> Moon
  const ang = Math.atan2(m[1] - ey, m[0] - ex), nx = -Math.sin(ang) * 6, ny = Math.cos(ang) * 6, sx0 = ex + Math.cos(ang) * 50, sy0 = ey + Math.sin(ang) * 50;
  const wob = st < -0.15 ? Math.sin(t * 9) * 10 * (-st) : 0;
  const mxp = (sx0 + m[0]) / 2 + nx / 6 * wob, myp = (sy0 + m[1]) / 2 + ny / 6 * wob;
  G(true, 10, col === INK ? "rgba(120,195,255,0.8)" : col); ctx.strokeStyle = col; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(sx0 + nx, sy0 + ny); ctx.quadraticCurveTo(mxp + nx, myp + ny, m[0] + nx, m[1] + ny); ctx.moveTo(sx0 - nx, sy0 - ny); ctx.quadraticCurveTo(mxp - nx, myp - ny, m[0] - nx, m[1] - ny); ctx.stroke(); G(false);
  globe(m[0], m[1], 40, { tilt: 0.2, spin: t * 0.1, lat: 4, lon: 8, w: 2, craters: [[0.3, 0.2, 0.2], [-0.3, -0.5, 0.15]] });
  // velocity arrow
  const m2 = pt(th + 0.18); arr(m[0], m[1], m[0] + (m2[0] - m[0]) * 1.6, m[1] + (m2[1] - m[1]) * 1.6, INK2, 2, 16);
  const lx = Math.min(870, Math.max(210, m[0])), ly = m[1] > ey - 5 && m[1] + 126 < 1310 ? m[1] + 96 : m[1] - 100;
  mt(fmt(Math.round(km / 100) * 100) + " KM", lx, ly, 24, col, "center", 3, 700);
  if (Math.abs(st) > 0.15) mt(st < 0 ? "COMPRESSION · BUCKLES" : "TENSION · TEARS", lx, ly + 30, 18, col, "center", 3, 600);
  dim(ex - a * (1 - e), ey + 60, ex, ey + 60, "363,300", kk(p.dp ?? 0.4, (p.dp ?? 0.4) + 0.6));
  dim(ex, ey - 60, ex + a * (1 + e), ey - 60, "405,500", kk(p.da ?? 0.8, (p.da ?? 0.8) + 0.6));
  mt("PERIGEE", ex - a * (1 - e) + 6, ey - 26, 16, INK2, "left", 3); mt("APOGEE", ex + a * (1 + e) - 6, ey + 40, 16, INK2, "right", 3);
  mt("ECCENTRICITY EXAGGERATED ×2", 60, 1500, 15, INK3, "left", 3);
  chromeBegin(); chrome();
  hero("EVERY 27.5 DAYS", "42,200", "KM", "THE MOON'S DISTANCE SWINGS", cl((lt - (p.hh ?? 0)) / 0.3), { size: 168 });
  ctx.restore();
} else if (SC === 9) {
  // FAILURE: the ladder snaps
  const sn = p.snap || 0.4, ks = cl((lt - sn) / 1.2), shake = lt < sn ? 4 * kk(0, sn) : 10 * Math.max(0, 1 - (lt - sn) * 2.5);
  ctx.translate((rnd(Math.floor(t * 30)) - 0.5) * shake, (rnd(Math.floor(t * 30) + 7) - 0.5) * shake);
  grid(0, 0);
  const by = 900;
  if (lt < sn) {
    ladV(540, 120, H, 44, 18, 0);
    const k = kk(0, sn); ctx.strokeStyle = RED; ctx.lineWidth = 2; ctx.beginPath(); for (let j = 0; j < 6; j++) { const yy = by - 30 + j * 12; ctx.moveTo(510 - 18 * k, yy); ctx.lineTo(570 + 18 * k, yy + 4); } ctx.stroke();
    G(true, 12, "rgba(255,94,94,0.8)"); arr(540, 520, 540, 360, RED, 3, 22); arr(540, 1280, 540, 1440, RED, 3, 22); G(false);
  } else {
    const e1 = ez(ks);
    ctx.save(); ctx.translate(540, by - 10 - 260 * e1); ctx.rotate(-0.22 * e1); ctx.translate(-540, -(by - 10)); ladV(540, -400, by - 10, 44, 18, 0); ctx.restore();
    ctx.save(); ctx.translate(540, by + 10 + 140 * e1); ctx.rotate(0.12 * e1 * Math.sin(lt * 5) * Math.exp(-(lt - sn))); ctx.translate(-540, -(by + 10)); ladV(540, by + 10, H + 300, 44, 18, 0); ctx.restore();
    // jagged break edges
    G(true, 14, "rgba(255,94,94,0.9)");
    pl([[510, by - 10 - 260 * e1], [522, by - 22 - 260 * e1], [534, by - 6 - 260 * e1], [548, by - 24 - 260 * e1], [570, by - 8 - 260 * e1]], 2.5, RED);
    pl([[510, by + 10 + 140 * e1], [524, by + 26 + 140 * e1], [538, by + 8 + 140 * e1], [552, by + 28 + 140 * e1], [570, by + 12 + 140 * e1]], 2.5, RED);
    G(false);
    for (let j = 0; j < 12; j++) { const a2 = rnd(j) * TAU, v = 260 + rnd(j + 4) * 520, d = (lt - sn); const x = 540 + Math.cos(a2) * v * d, y = by + Math.sin(a2) * v * d + 140 * d * d;
      ctx.save(); ctx.translate(x, y); ctx.rotate(d * (3 + rnd(j + 9) * 6)); sl(-16 - rnd(j) * 18, 0, 16 + rnd(j) * 18, 0, 2, j % 3 ? INK : RED); ctx.restore(); }
    stamp("FAILURE", 760, 1180, -0.12, RED, kk(sn + 0.35, sn + 0.75), 44);
    lead(540, by - 260 * e1 - 80, 230, 640, "UPPER SECTION", "PULLED AWAY BY THE MOON", kk(sn + 0.7, sn + 1.4), INK);
  }
  chromeBegin(); chrome(); ctx.restore();
} else if (SC === 10) {
  // MATERIAL CHECK: max self-supporting height, log scale
  grid(0, 0);
  const y0 = 1300, dec = 118, X0 = 170, yv = (v) => y0 - dec * Math.log10(v);
  sl(X0, y0 + 10, X0, yv(1e6) - 30, 1.6, INK); sl(X0 - 10, y0, 1000, y0, 1.6, INK);
  ["1", "10", "100", "1K", "10K", "100K", "1M"].forEach((s, i) => { const y = yv(Math.pow(10, i)); sl(X0 - 12, y, X0, y, 1.4, INK); sl(X0, y, 1000, y, 1, "rgba(170,205,250,0.12)"); mt(s, X0 - 20, y + 7, 18, INK2, "right", 2); });
  mt("KM", X0 - 20, yv(1e6) - 44, 16, INK2, "right", 3);
  const bars = [[330, 3.2, "STEEL", "≈ 3 KM", INK, 0.2], [530, 13, "HIGH-STRENGTH", "≈ 13 KM", INK, 0.6], [790, 384400, "LADDER NEEDS", "384,400 KM", RED, 1.0]];
  for (const [x, v, nm, val, c, at] of bars) {
    const k = ez(kk(at, at + 0.7)); if (k <= 0) continue; const top = lerp(y0, yv(v), k);
    ctx.fillStyle = c === RED ? "rgba(255,94,94,0.12)" : "rgba(127,211,255,0.14)"; ctx.fillRect(x - 55, top, 110, y0 - top);
    G(true, 10, c === RED ? "rgba(255,94,94,0.8)" : "rgba(120,195,255,0.8)"); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.setLineDash(c === RED ? [10, 6] : []); ctx.strokeRect(x - 55, top, 110, y0 - top); ctx.setLineDash([]); G(false);
    if (c !== RED) { ctx.save(); ctx.beginPath(); ctx.rect(x - 55, top, 110, y0 - top); ctx.clip(); ctx.strokeStyle = INK3; ctx.lineWidth = 1; ctx.beginPath(); for (let u = -200; u < 300; u += 14) { ctx.moveTo(x - 55 + u, y0); ctx.lineTo(x - 55 + u + 200, y0 - 200); } ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.globalAlpha *= cl(k * 2 - 1); mt(nm, x, top - 52, 18, c === RED ? RED : INK2, "center", 2.5, 600); mt(val, x, top - 22, 21, c, "center", 2.5, 700); ctx.restore();
  }
  const kx = kk(1.5, 2.1);
  if (kx > 0) { ctx.save(); ctx.globalAlpha *= kx; dim(660, yv(13), 660, yv(384400), "×30,000", 1, INK2, AMB); ctx.restore(); }
  stamp("REJECTED", 560, 820, -0.14, RED, kk(p.rej || 2.0, (p.rej || 2.0) + 0.4), 46);
  mt("MAX HEIGHT BEFORE IT CRUSHES UNDER ITS OWN WEIGHT", 540, 1350, 15, INK2, "center", 2.5);
  chromeBegin(); chrome();
  hero("MATERIAL CHECK · STEEL", "3", "KM", "THEN IT CRUSHES ITSELF", cl(lt / 0.3));
  ctx.restore();
}
ctx.restore();
