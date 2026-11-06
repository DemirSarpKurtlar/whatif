// ops.js — episode 040 "Ops Console": dark command-center video wall, mono labels, red alert numerals, dotted world map.
// p.s picks the sub-scene:
// 0 survey feed · 1 global follow-up map · 2 orbit solution + Torino · 3 size / threat class · 4 blast model (hook)
// 5 2024 YR4 probability chart · 6 deflection plan · 7 DART · 8 evacuation · 9 full-wall red alert (question)
// Common p: z (zoom), fx, fy (camera focus), clk (T+ clock seconds at scene start), rate (clock speed), sh (shake)
const K = { txt: "#E8EAEC", lab: "#8E949A", dim: "#555A5F", red: "#FF3B3B", red2: "#4A1010", amb: "#F2A33A", line: "rgba(255,255,255,0.10)" };
const MONO = "'JetBrains Mono','DejaVu Sans Mono',monospace";
const C40 = window.__c040 || (window.__c040 = {});
function mk(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
function cache(k, w, h, fn) { if (!C40[k]) { const c = mk(w, h); fn(c.getContext("2d"), w, h); C40[k] = c; } return C40[k]; }
const S = p.s | 0;
const blink = (f, ph = 0) => Math.floor(t * f * 2 + ph) % 2 === 0;
const ease = (x) => E["ease-out"](cl(x));
const eio = (x) => E["ease-in-out"](cl(x));
function M(s, x, y, size, col, align = "left", wt = 500, sp = 0) {
  ctx.font = `${wt} ${size}px ${MONO}`; ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = "alphabetic";
  ctx.letterSpacing = sp + "px"; ctx.fillText(s, x, y); ctx.letterSpacing = "0px";
}
function MW(s, size, wt = 500, sp = 0) { ctx.font = `${wt} ${size}px ${MONO}`; ctx.letterSpacing = sp + "px"; const w = ctx.measureText(s).width; ctx.letterSpacing = "0px"; return w; }
function glow(s, x, y, size, col, align = "left", wt = 400, g = 28) {
  ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = g; M(s, x, y, size, col, align, wt, -2); ctx.restore(); M(s, x, y, size, col, align, wt, -2);
}
function line(x1, y1, x2, y2, col, w = 1.5) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function box(x, y, w, h, col, lw = 1.5) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.strokeRect(x, y, w, h); }
function sq(x, y, s, col) { ctx.fillStyle = col; ctx.fillRect(x, y, s, s); }
function corners(x, y, w, h, l, col, lw = 4) {
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
  ctx.moveTo(x, y + l); ctx.lineTo(x, y); ctx.lineTo(x + l, y); ctx.moveTo(x + w - l, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + l);
  ctx.moveTo(x + w, y + h - l); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - l, y + h); ctx.moveTo(x + l, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - l); ctx.stroke();
}
function clockStr(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = Math.floor(sec) % 60, c = Math.floor(sec * 100) % 100;
  const z = (n, d = 2) => String(n).padStart(d, "0"); return `${z(h, 3)}:${z(m)}:${z(s)}.${z(c)}`;
}
// ---------- cached layers ----------
const LAND = [
  [[-168, 66], [-162, 70], [-156, 71], [-140, 70], [-128, 70], [-115, 68], [-95, 72], [-82, 73], [-80, 63], [-94, 59], [-90, 57], [-82, 55], [-78, 52], [-79, 57], [-72, 62], [-64, 60], [-60, 55], [-56, 52], [-60, 47], [-66, 45], [-70, 42], [-75, 38], [-76, 35], [-81, 31], [-80, 26], [-82, 29], [-84, 30], [-90, 29], [-97, 27], [-97, 22], [-92, 19], [-87, 21], [-88, 16], [-83, 15], [-83, 10], [-79, 9], [-80, 7], [-84, 9], [-87, 13], [-92, 15], [-96, 16], [-105, 20], [-110, 23], [-114, 30], [-117, 32], [-120, 34], [-124, 40], [-124, 46], [-124, 49], [-130, 54], [-136, 58], [-145, 60], [-152, 59], [-158, 57], [-165, 55], [-160, 59], [-165, 62]],
  [[-73, 78], [-60, 82], [-30, 83], [-20, 80], [-20, 75], [-22, 70], [-30, 68], [-40, 65], [-44, 60], [-50, 62], [-54, 67], [-58, 75]],
  [[-80, 9], [-75, 11], [-72, 12], [-62, 11], [-60, 8], [-52, 5], [-50, 0], [-44, -2], [-35, -5], [-35, -9], [-39, -15], [-40, -22], [-48, -26], [-53, -34], [-58, -38], [-62, -40], [-65, -45], [-68, -50], [-69, -55], [-73, -53], [-75, -47], [-73, -40], [-71, -30], [-70, -18], [-76, -14], [-80, -6], [-81, -2], [-80, 1], [-78, 4], [-77, 8]],
  [[-10, 36], [-9, 43], [-2, 43.5], [-1, 46], [-5, 48], [2, 51], [5, 53], [8, 54], [8, 57], [10, 59], [5, 58], [5, 62], [12, 66], [18, 70], [25, 71], [30, 70], [40, 68], [44, 66], [42, 64], [50, 68], [60, 69], [70, 73], [80, 73], [90, 76], [100, 78], [112, 74], [125, 73], [140, 72], [150, 71], [160, 70], [170, 70], [180, 68], [180, 65], [175, 62], [165, 60], [160, 56], [156, 51], [155, 57], [150, 59], [142, 59], [136, 54], [140, 48], [135, 43], [130, 42], [127, 38], [126, 35], [122, 40], [118, 38], [122, 36], [121, 31], [122, 29], [118, 24], [110, 21], [108, 21], [106, 18], [109, 12], [105, 9], [103, 10], [100, 13], [99, 8], [103, 2], [101, 3], [98, 8], [98, 16], [94, 17], [92, 21], [88, 22], [85, 20], [80, 15], [77, 8], [73, 17], [72, 21], [67, 25], [60, 25], [57, 26], [56, 24], [59, 22], [55, 17], [52, 16], [45, 13], [43, 13], [40, 20], [35, 28], [34, 31], [35, 36], [30, 36], [27, 37], [26, 40], [29, 41], [23, 40], [22, 37], [20, 40], [19, 42], [13, 46], [12, 44], [16, 41], [18, 40], [16, 38], [12, 42], [9, 44], [3, 43], [3, 42], [0, 39], [-2, 37], [-6, 36]],
  [[-17, 21], [-16, 28], [-10, 30], [-6, 35], [10, 37], [11, 33], [20, 31], [30, 31], [33, 31], [35, 28], [39, 20], [43, 12], [51, 12], [51, 10], [44, 4], [40, -3], [40, -10], [40, -15], [35, -23], [33, -27], [28, -33], [20, -35], [18, -33], [15, -27], [12, -17], [13, -12], [12, -5], [9, -1], [9, 4], [5, 6], [-2, 5], [-8, 4], [-13, 8], [-17, 13]],
  [[44, -25], [47, -25], [50, -15], [49, -12], [44, -17]],
  [[114, -22], [114, -34], [118, -35], [124, -33], [131, -31], [138, -35], [141, -38], [147, -38], [150, -37], [153, -31], [153, -25], [146, -19], [142, -11], [141, -17], [136, -12], [131, -11], [126, -14], [122, -18]],
  [[-5, 50], [1, 51], [2, 53], [-1, 55], [-2, 58], [-5, 59], [-6, 56], [-3, 54], [-5, 52]], [[-10, 52], [-6, 52], [-6, 55], [-8, 55]],
  [[130, 31], [132, 34], [135, 34], [140, 36], [141, 41], [142, 45], [145, 44], [141, 39], [140, 35], [136, 33], [131, 33]],
  [[95, 5], [98, 4], [106, -6], [103, -5], [95, 3]], [[109, 1], [111, -3], [116, -4], [119, 1], [117, 7], [113, 3]], [[105, -6], [114, -8], [106, -7.5]],
  [[131, -1], [141, -3], [150, -10], [141, -9], [137, -5]], [[120, 18], [122, 18], [126, 7], [122, 7], [120, 14]],
  [[172, -35], [178, -38], [174, -41], [167, -46], [171, -44], [174, -39]], [[-24, 64], [-14, 64], [-15, 66], [-22, 66]], [[-85, 22], [-74, 20], [-77, 20], [-82, 23]],
];
const MAPW = 980, MAPH = 376;
const mx = (lon) => (lon + 180) / 360 * MAPW, my = (lat) => (80 - lat) / 138 * MAPH;
function worldDots() {
  return cache("map", MAPW, MAPH, (g, w, h) => {
    const m = mk(w, h), mg = m.getContext("2d"); mg.fillStyle = "#fff";
    for (const P of LAND) { mg.beginPath(); P.forEach(([lo, la], i) => i ? mg.lineTo(mx(lo), my(la)) : mg.moveTo(mx(lo), my(la))); mg.closePath(); mg.fill(); }
    const d = mg.getImageData(0, 0, w, h).data;
    for (let y = 4; y < h; y += 8) for (let x = 4; x < w; x += 8) {
      if (d[(y * w + x) * 4] > 128) { g.fillStyle = "#4A5056"; g.fillRect(x - 1.8, y - 1.8, 3.6, 3.6); }
      else { g.fillStyle = "rgba(255,255,255,0.035)"; g.fillRect(x - 0.6, y - 0.6, 1.2, 1.2); }
    }
    g.strokeStyle = "rgba(255,255,255,0.06)"; g.lineWidth = 1;
    for (let lo = -180; lo <= 180; lo += 30) { g.beginPath(); g.moveTo(mx(lo), 0); g.lineTo(mx(lo), h); g.stroke(); }
    for (let la = 60; la >= -60; la -= 30) { g.beginPath(); g.moveTo(0, my(la)); g.lineTo(w, my(la)); g.stroke(); }
  });
}
function scan() {
  return cache("scan", W, H, (g) => { g.fillStyle = "rgba(0,0,0,0.16)"; for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 1.5); });
}
function room() {
  return cache("room", W, 800, (g, w, h) => {
    // glossy floor light pools
    for (const [x, r, a] of [[180, 260, 0.13], [540, 330, 0.16], [900, 260, 0.13]]) {
      g.save(); g.translate(x, 560); g.scale(1, 0.32); const rg = g.createRadialGradient(0, 0, 0, 0, 0, r);
      rg.addColorStop(0, `rgba(235,238,242,${a})`); rg.addColorStop(1, "rgba(235,238,242,0)"); g.fillStyle = rg; g.fillRect(-r, -r, 2 * r, 2 * r); g.restore();
    }
    // operators (silhouettes, rim-lit by the wall)
    const op = (x, y, s, hs) => {
      g.save(); g.translate(x, y); g.scale(s, s);
      g.fillStyle = "#040405";
      g.beginPath(); g.moveTo(-190, 260); g.bezierCurveTo(-185, 120, -120, 95, -40, 88); g.lineTo(40, 88); g.bezierCurveTo(120, 95, 185, 120, 190, 260); g.closePath(); g.fill();
      g.fillRect(-30, 40, 60, 60);
      g.beginPath(); g.ellipse(0, 0, 52, 64, 0, 0, TAU); g.fill();
      g.strokeStyle = "rgba(225,230,235,0.20)"; g.lineWidth = 3;
      g.beginPath(); g.ellipse(0, 0, 52, 64, 0, Math.PI * 1.08, Math.PI * 1.92); g.stroke();
      g.beginPath(); g.moveTo(-150, 112); g.bezierCurveTo(-110, 96, -70, 92, -40, 90); g.stroke();
      g.beginPath(); g.moveTo(150, 112); g.bezierCurveTo(110, 96, 70, 92, 40, 90); g.stroke();
      if (hs) { g.lineWidth = 7; g.strokeStyle = "#0B0C0E"; g.beginPath(); g.arc(0, -4, 60, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
        g.fillStyle = "#0B0C0E"; g.beginPath(); g.roundRect(-70, -18, 22, 42, 8); g.fill(); g.beginPath(); g.roundRect(48, -18, 22, 42, 8); g.fill();
        g.strokeStyle = "rgba(225,230,235,0.22)"; g.lineWidth = 2.5; g.beginPath(); g.arc(0, -4, 63, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); }
      g.restore();
    };
    op(250, 150, 0.95, true); op(820, 175, 0.85, false); op(560, 230, 1.12, true);
  });
}
function vig() {
  return cache("vig", W, H, (g) => { const rg = g.createRadialGradient(W / 2, H * 0.42, H * 0.25, W / 2, H * 0.5, H * 0.75);
    rg.addColorStop(0, "rgba(0,0,0,0)"); rg.addColorStop(1, "rgba(0,0,0,0.75)"); g.fillStyle = rg; g.fillRect(0, 0, W, H); });
}
function cityMap() {
  return cache("city", 1000, 640, (g, w, h) => {
    const R = (i) => rnd(i * 1.37 + 5);
    g.fillStyle = "#0D0F11"; g.fillRect(0, 0, w, h);
    // river
    g.strokeStyle = "#1B2328"; g.lineWidth = 34; g.beginPath(); g.moveTo(-20, 520); g.bezierCurveTo(260, 420, 420, 610, 640, 470); g.bezierCurveTo(800, 370, 900, 300, 1020, 330); g.stroke();
    // block grid with slight rotation per district
    for (let i = 0; i < 1300; i++) {
      const x = R(i) * w, y = R(i + 999) * h; const s = 6 + R(i + 77) * 16;
      g.fillStyle = `rgba(120,128,136,${0.10 + R(i + 5) * 0.16})`; g.fillRect(x, y, s, s * (0.6 + R(i + 3)));
    }
    g.strokeStyle = "rgba(160,168,176,0.20)"; g.lineWidth = 2;
    for (let x = 30; x < w; x += 62) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 40, h); g.stroke(); }
    for (let y = 20; y < h; y += 58) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y - 30); g.stroke(); }
    g.strokeStyle = "rgba(200,206,212,0.35)"; g.lineWidth = 4; // highways
    for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + 0.3; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + Math.cos(a) * 900, h / 2 + Math.sin(a) * 900); g.stroke(); }
    g.beginPath(); g.ellipse(w / 2, h / 2, 330, 230, 0, 0, TAU); g.stroke();
  });
}
function stars() {
  return cache("stars", 1000, 600, (g, w, h) => {
    g.fillStyle = "#07080A"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) { const x = rnd(i * 3.3) * w, y = rnd(i * 5.9 + 2) * h, b = rnd(i * 1.7 + 9), r = 0.6 + b * b * 2.6;
      g.fillStyle = `rgba(220,225,230,${0.18 + b * 0.6})`; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
  });
}
// ---------- wall chrome ----------
function panel(x, y, w, h, code, title, stat, scol, clk) {
  ctx.fillStyle = "#000"; ctx.fillRect(x - 9, y - 9, w + 18, h + 18);
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, "#16191B"); g.addColorStop(1, "#0D0F11"); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  box(x + 0.5, y + 0.5, w - 1, h - 1, K.line);
  ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(x + 18, y + 50, w - 36, 1.5);
  M(code, x + 22, y + 34, 17, K.dim, "left", 600, 1);
  M(title, x + 30 + MW(code, 17, 600, 1), y + 34, 19, "#C9CDD1", "left", 700, 1.5);
  if (stat) {
    const tw = MW(stat, 17, 700, 1); const ct = clk !== undefined ? "T+" + clockStr(clk) : "";
    const cw = ct ? MW(ct, 16, 500, 0) + 18 : 0;
    M(stat, x + w - 22 - cw, y + 34, 17, scol || "#C9CDD1", "right", 700, 1);
    sq(x + w - 22 - cw - tw - 22, y + 21, 13, scol || "#C9CDD1");
    if (ct) M(ct, x + w - 22, y + 34, 16, K.dim, "right", 500, 0);
  }
}
function ghost(x, y, w, h, seed) { // side monitors peeking at the frame edges
  panel(x, y, w, h, "SYS-" + (10 + seed), ["TELEMETRY", "COMMS · DSN", "POWER GRID", "AIRSPACE"][seed % 4], "NOMINAL", K.lab);
  for (let i = 0; i < Math.floor((h - 90) / 34); i++) { const a = 0.25 + rnd(seed * 7 + i) * 0.35;
    ctx.fillStyle = `rgba(200,205,210,${a * 0.35})`; ctx.fillRect(x + 24, y + 80 + i * 34, 60 + rnd(seed + i * 3) * 200, 10);
    ctx.fillRect(x + w - 120, y + 80 + i * 34, 90, 10); }
}
function ruler(clk) {
  // top strip: mission timeline ruler + elapsed clock
  ctx.fillStyle = "#0B0C0E"; ctx.fillRect(-400, 60, W + 800, 150);
  const off = ((clk / 3600) * 60) % 200;
  for (let i = -3; i < 9; i++) { const x = i * 200 - off;
    line(x, 70, x, 98, "rgba(255,255,255,0.18)", 1.5);
    for (let k = 1; k < 5; k++) line(x + k * 40, 70, x + k * 40, 82, "rgba(255,255,255,0.09)", 1);
    const hr = Math.floor(clk / 3600 / (200 / 60)) * 0; }
  const day = Math.floor(clk / 86400);
  for (let i = -1; i < 7; i++) M("DAY " + String(day + i).padStart(2, "0"), i * 200 - off + 8 - 200 + 200, 122, 15, K.dim, "left", 600, 1);
  M("EVENT CLOCK · NEO WATCH", 40, 186, 17, K.lab, "left", 700, 2);
  M("T+", 540, 192, 52, K.red, "left", 500, 0);
  M(clockStr(clk), 1040, 192, 52, K.txt, "right", 400, 0);
}
// ---------- scene setup ----------
const z = p.z || 1, fx = p.fx || 540, fy = p.fy || 960;
const clk = (p.clk || 0) + lt * (p.rate || 1);
ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
ctx.save();
cam(fx, fy, z, p.sh || 0);
ctx.fillStyle = "#050607"; ctx.fillRect(-500, 40, W + 1000, 1250);
ghost(-1000, 230, 940, 620, 1); ghost(-1000, 870, 940, 380, 2); ghost(1120, 230, 940, 620, 3); ghost(1120, 870, 940, 380, 4);
ruler(clk);
const A = { x: 40, y: 230, w: 1000, h: 620 }, B = { x: 40, y: 870, w: 1000, h: 380 };
const alarm = p.alarm || 0;

if (S === 0) { // ---------------- survey feed: a faint moving dot
  const lock = cl((lt - (p.tLock || 1.2)) / 0.5);
  panel(A.x, A.y, A.w, A.h, "NEO-01", "SURVEY FEED · ATLAS-CHL (W68)", lock > 0 ? "FLAGGED" : "SCANNING", lock > 0 ? K.red : K.lab, clk);
  ctx.drawImage(stars(), A.x + 20, A.y + 62, 960, 540);
  const ex = Math.floor(lt / 0.32) % 4;
  const dx = A.x + 560 + ex * 26, dy = A.y + 330 - ex * 11;
  for (let k = 0; k <= ex; k++) { ctx.fillStyle = `rgba(255,255,255,${k === ex ? 0.95 : 0.12})`; ctx.beginPath(); ctx.arc(A.x + 560 + k * 26, A.y + 330 - k * 11, 4.2, 0, TAU); ctx.fill(); }
  M(`EXP ${ex + 1}/4 · 30 S`, A.x + 40, A.y + 590, 18, K.lab, "left", 600, 1);
  M("FIELD 2.1 MILLION STARS", A.x + 960, A.y + 590, 18, K.dim, "right", 600, 1);
  if (lock > 0) {
    const r = 220 - 150 * ease(lock); corners(dx - r / 2 - 6, dy - r / 2 - 6, r + 12, r + 12, 22, K.red, 4);
    if (lock >= 1) {
      line(dx + 46, dy - 46, dx + 120, dy - 120, K.red, 2); ctx.fillStyle = "rgba(20,4,4,0.85)"; ctx.fillRect(dx + 120, dy - 170, 300, 92); box(dx + 120, dy - 170, 300, 92, K.red, 2);
      M("NEW OBJECT", dx + 138, dy - 132, 28, K.red, "left", 800, 2); M("NOT IN ANY CATALOG", dx + 138, dy - 98, 17, "#FFB3B3", "left", 600, 1);
    }
  }
  panel(B.x, B.y, B.w, B.h, "NET-02", "SURVEY NETWORK", "4 ONLINE", K.lab);
  const rows = [["01", "ATLAS", "HAWAII · CHILE · S.AFRICA"], ["02", "CATALINA", "ARIZONA"], ["03", "PAN-STARRS", "HAWAII"], ["04", "RUBIN", "CHILE"]];
  rows.forEach(([n, a, b], i) => { const y = B.y + 108 + i * 62, hot = i === 0 && lock > 0;
    if (hot) { ctx.fillStyle = "rgba(255,59,59,0.13)"; ctx.fillRect(B.x + 16, y - 38, B.w - 32, 54); }
    M(n, B.x + 30, y, 24, K.dim, "left", 600); M(a, B.x + 100, y, 30, hot ? K.red : K.txt, "left", 700, 1); M(b, B.x + 400, y, 19, K.lab, "left", 600, 1);
    M(hot ? (blink(2) ? "● ALERT" : "  ALERT") : "SCANNING", B.x + 970, y, 22, hot ? K.red : K.lab, "right", 700, 1); });
} else if (S === 1) { // ---------------- telescopes worldwide lock on
  panel(A.x, A.y, A.w, A.h, "OBS-03", "FOLLOW-UP · GLOBAL", "TRACKING", K.red, clk);
  const ox = A.x + 10, oy = A.y + 140;
  ctx.drawImage(worldDots(), ox, oy);
  const obs = [[-155.6, 19.5, "T08"], [-156.3, 20.7, "F51"], [-110.8, 32.4, "G96"], [-70.7, -30.2, "W68"], [-70.7, -30.4, "X05"], [20.8, -32.4, "M22"], [-17.9, 28.8, "J04"], [149.1, -31.3, "E12"], [133.5, 34.6, "Q62"]];
  const tx = A.x + 520, ty = A.y + 96;
  const n = p.n !== undefined ? p.n : obs.length;
  obs.forEach(([lo, la, code], i) => { const a = cl(n - i); if (a <= 0) return;
    const x = ox + mx(lo), y = oy + my(la);
    ctx.globalAlpha = a; ctx.strokeStyle = "rgba(255,59,59,0.55)"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo((x + tx) / 2, Math.min(y, ty) - 30, tx, ty); ctx.stroke();
    ctx.globalAlpha = 1; circ(x, y, 7, K.red); ctx.strokeStyle = K.red; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 12 + 10 * ((t * 1.3 + i * 0.3) % 1), 0, TAU); ctx.stroke();
    if (i % 2 === 0 || i > 5) { ctx.fillStyle = "rgba(20,4,4,0.8)"; ctx.fillRect(x + 12, y + 10, 62, 26); box(x + 12, y + 10, 62, 26, "rgba(255,59,59,0.7)", 1.5); M(code, x + 43, y + 30, 17, "#FFB3B3", "center", 700); }
  });
  corners(tx - 18, ty - 18, 36, 36, 10, K.txt, 3); M("TARGET · 2026-VK", tx + 30, ty + 8, 18, K.txt, "left", 700, 1);
  M("TELESCOPES ON TARGET", A.x + 40, A.y + 590, 20, K.lab, "left", 700, 1);
  glow(String(Math.min(obs.length, Math.max(1, Math.ceil(n)))).padStart(2, "0"), A.x + 960, A.y + 600, 96, K.red, "right", 400, 22);
  panel(B.x, B.y, B.w, B.h, "AST-04", "ASTROMETRY STREAM", "RECEIVING", K.lab);
  const names = ["W68 ATLAS RIO HURTADO", "T08 ATLAS MAUNA LOA", "F51 PAN-STARRS 1", "G96 MT. LEMMON", "X05 RUBIN", "M22 ATLAS SUTHERLAND", "J04 OGS TENERIFE", "E12 SIDING SPRING"];
  const k0 = Math.floor(lt * 5);
  for (let i = 0; i < 5; i++) { const k = k0 + i, y = B.y + 100 + i * 52;
    M(String(400 + k).padStart(4, "0"), B.x + 30, y, 20, K.dim, "left", 600); M(names[k % names.length], B.x + 120, y, 22, i === 4 ? K.txt : "#AEB3B8", "left", 600, 1);
    M((0.05 + rnd(k) * 0.3).toFixed(2) + '"', B.x + 800, y, 20, K.lab, "right", 500); M("OK", B.x + 960, y, 20, K.lab, "right", 700, 1); }
  const cnt = Math.floor(3 + (p.obs || 0)); M("OBS", B.x + 620, B.y + 34, 17, K.dim, "left", 700, 1); M(cnt.toLocaleString("en-US"), B.x + 680, B.y + 34, 17, K.txt, "left", 700, 1);
} else if (S === 2) { // ---------------- orbit crosses Earth + Torino scale
  const hit = cl((lt - (p.tHit || 1.0)) / 0.4);
  panel(A.x, A.y, A.w, A.h, "ORB-05", "ORBIT SOLUTION · HELIOCENTRIC", hit > 0 ? "EARTH IMPACT" : "COMPUTING", hit > 0 ? K.red : K.lab, clk);
  const cx = A.x + 400, cy = A.y + 320;
  circ(cx, cy, 16, "#E8EAEC"); ctx.save(); ctx.globalAlpha = 0.25; circ(cx, cy, 30, "#E8EAEC"); ctx.restore();
  ctx.strokeStyle = "rgba(220,225,230,0.45)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy, 250, 230, 0, 0, TAU); ctx.stroke();
  // crossing point P on Earth's orbit; the asteroid ellipse has its left vertex exactly at P
  const ang = 2.8, px = cx + Math.cos(ang) * 250, py = cy + Math.sin(ang) * 230;
  const arx = 400, ary = 170, acx = px + arx, acy = py;
  const dr = ease(cl(lt / 0.9)); ctx.strokeStyle = K.red; ctx.lineWidth = 2.5; ctx.setLineDash([10, 8]);
  ctx.beginPath(); ctx.ellipse(acx, acy, arx, ary, 0, 0, TAU * dr); ctx.stroke(); ctx.setLineDash([]);
  const k2 = cl(lt / Math.max(0.5, (p.tHit || 1.0) + 0.3));
  const ea = ang - 0.7 * (1 - k2), exx = cx + Math.cos(ea) * 250, eyy = cy + Math.sin(ea) * 230;
  circ(exx, eyy, 12, "#9FB4C8"); M("EARTH", exx - 20, eyy + 40, 17, K.lab, "right", 700, 1);
  const th2 = Math.PI + 0.75 * (1 - k2); circ(acx + Math.cos(th2) * arx, acy + Math.sin(th2) * ary, 7, K.red);
  if (hit > 0) { const r = 60 - 30 * ease(hit); corners(px - r, py - r, 2 * r, 2 * r, 14, K.red, 3.5);
    if (blink(2.5)) { ctx.strokeStyle = K.red; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, 46, 0, TAU); ctx.stroke(); }
    ctx.fillStyle = "rgba(20,4,4,0.85)"; ctx.fillRect(px - 120, py + 70, 240, 44); box(px - 120, py + 70, 240, 44, K.red, 2); M("ORBITS CROSS", px, py + 100, 20, K.red, "center", 800, 2); }
  M("MIN. ORBIT INTERSECTION", A.x + 960, A.y + 100, 18, K.lab, "right", 700, 1);
  glow(hit > 0 ? "0.0000 AU" : (0.05 * (1 - cl(lt / 1.0))).toFixed(4) + " AU", A.x + 960, A.y + 170, 56, hit > 0 ? K.red : K.txt, "right", 400, hit > 0 ? 18 : 0);
  M("SUN", cx, cy + 56, 16, K.lab, "center", 700, 1);
  panel(B.x, B.y, B.w, B.h, "RSK-06", "TORINO IMPACT HAZARD SCALE", "LEVEL " + Math.round(p.tor || 0), (p.tor || 0) >= 5 ? K.red : K.amb);
  const lv = p.tor || 0;
  for (let i = 0; i <= 10; i++) { const x = B.x + 30 + i * 86, on = i <= lv + 0.01;
    const col = i >= 8 ? K.red : i >= 5 ? "#E8763A" : i >= 2 ? K.amb : i === 1 ? "#9BC48A" : "#CFD3D6";
    ctx.fillStyle = on ? col : "rgba(255,255,255,0.06)"; ctx.globalAlpha = on ? 0.9 : 1; ctx.fillRect(x, B.y + 80, 78, 70); ctx.globalAlpha = 1;
    M(String(i), x + 39, B.y + 128, 32, on ? "#0B0C0E" : K.dim, "center", 800); }
  const L = Math.round(lv); const desc = L >= 8 ? "COLLISION CERTAIN · LOCAL DESTRUCTION" : L >= 5 ? "THREATENING ENCOUNTER" : L >= 2 ? "MERITS ATTENTION" : "NO HAZARD";
  glow(String(L), B.x + 30, B.y + 330, 140, L >= 8 ? K.red : K.txt, "left", 400, L >= 8 ? 24 : 0);
  M(desc, B.x + 160, B.y + 250, 26, L >= 8 ? K.red : K.txt, "left", 800, 1);
  M("SCALE 0-10 · LEVEL " + L, B.x + 160, B.y + 292, 18, K.lab, "left", 600, 1);
} else if (S === 3) { // ---------------- size: 60 m, city killer vs planet killer
  panel(A.x, A.y, A.w, A.h, "PHY-07", "OBJECT PROFILE", "MEASURED", K.lab, clk);
  M("DIAMETER", A.x + 40, A.y + 110, 20, K.lab, "left", 700, 2);
  const v = Math.round(60 * ease(lt / 0.7));
  M(String(v), A.x + 30, A.y + 340, 250, K.txt, "left", 300, -8); M("M", A.x + 330, A.y + 340, 70, K.lab, "left", 500);
  // rock vs 20-storey tower, same height
  const gx = A.x + 600, gy = A.y + 520, hh = 380;
  ctx.fillStyle = "#2A2E32"; ctx.beginPath(); const rc = [[0, -1], [0.55, -0.85], [0.95, -0.35], [0.9, 0.3], [0.5, 0.85], [-0.2, 1], [-0.75, 0.7], [-0.98, 0.05], [-0.7, -0.6]];
  rc.forEach(([a, b], i) => { const X = gx + a * hh / 2 * 0.95, Y = gy - hh / 2 + b * hh / 2; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 2; ctx.stroke();
  const bx = gx + 220; ctx.strokeStyle = "rgba(220,225,230,0.6)"; ctx.lineWidth = 2; ctx.strokeRect(bx, gy - hh, 110, hh);
  for (let f = 1; f < 20; f++) line(bx, gy - f * hh / 20, bx + 110, gy - f * hh / 20, "rgba(220,225,230,0.18)", 1);
  line(A.x + 20, gy, A.x + 980, gy, "rgba(255,255,255,0.25)", 1.5);
  line(bx + 140, gy, bx + 140, gy - hh, K.red, 2); line(bx + 130, gy, bx + 150, gy, K.red, 2); line(bx + 130, gy - hh, bx + 150, gy - hh, K.red, 2);
  M("= 20-STOREY", A.x + 40, A.y + 430, 30, K.txt, "left", 700, 1); M("TOWER", A.x + 40, A.y + 470, 30, K.txt, "left", 700, 1);
  M("BUILDING", bx + 55, gy + 34, 16, K.lab, "center", 700, 1);
  const cls = cl((lt - (p.tCls || 1.2)) / 0.4);
  panel(B.x, B.y, B.w, B.h, "CLS-08", "THREAT CLASS", "CITY KILLER", K.red);
  ctx.globalAlpha = Math.max(0.25, cls);
  ctx.fillStyle = "rgba(255,59,59,0.14)"; ctx.fillRect(B.x + 16, B.y + 72, B.w - 32, 120);
  M("CITY KILLER", B.x + 34, B.y + 124, 38, K.red, "left", 800, 2); M("50-100 M · MOST STILL UNFOUND", B.x + 34, B.y + 168, 21, "#FFB3B3", "left", 600, 1);
  M("◀ THIS ONE", B.x + 966, B.y + 124, 24, K.red, "right", 800, 1);
  M("PLANET KILLER", B.x + 34, B.y + 262, 38, K.txt, "left", 800, 2); M("1 KM+ · ~95% ALREADY FOUND", B.x + 34, B.y + 306, 21, K.lab, "left", 600, 1);
  ctx.globalAlpha = 1;
} else if (S === 4) { // ---------------- blast model (also the cold-open hook)
  const bt = cl((lt - (p.tBlast || 0.3)) / 1.6);
  panel(A.x, A.y, A.w, A.h, "IMP-09", "AIRBURST MODEL · GROUND ZERO", "CRITICAL", K.red, clk);
  ctx.save(); ctx.beginPath(); ctx.rect(A.x + 2, A.y + 54, A.w - 4, A.h - 56); ctx.clip();
  ctx.drawImage(cityMap(), A.x, A.y + 40, 1000, 640);
  const cx = A.x + 500, cy = A.y + 360;
  if (bt > 0) {
    const R = 40 + 440 * ease(bt);
    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R); rg.addColorStop(0, "rgba(255,59,59,0.55)"); rg.addColorStop(0.7, "rgba(255,59,59,0.22)"); rg.addColorStop(1, "rgba(255,59,59,0.0)");
    ctx.fillStyle = rg; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    for (let k = 0; k < 3; k++) { const rr2 = R * (0.4 + 0.3 * k); ctx.strokeStyle = `rgba(255,59,59,${0.9 - k * 0.25})`; ctx.lineWidth = 3 - k * 0.6; ctx.beginPath(); ctx.arc(cx, cy, rr2, 0, TAU); ctx.stroke(); }
    if (bt < 0.25) { ctx.fillStyle = `rgba(255,240,235,${0.8 * (1 - bt / 0.25)})`; ctx.fillRect(A.x, A.y, A.w, A.h); }
  }
  corners(cx - 26, cy - 26, 52, 52, 12, K.red, 3); circ(cx, cy, 5, K.red);
  ctx.restore();
  ctx.fillStyle = "rgba(10,2,2,0.82)"; ctx.fillRect(A.x + 24, A.y + 74, 420, 176); box(A.x + 24, A.y + 74, 420, 176, "rgba(255,59,59,0.6)", 1.5);
  M("ENERGY · TNT EQUIV.", A.x + 44, A.y + 110, 18, "#FFB3B3", "left", 700, 1);
  glow((10 * ease(bt / 0.6)).toFixed(0) + " MT", A.x + 40, A.y + 222, 104, K.red, "left", 400, 26);
  panel(B.x, B.y, B.w, B.h, "REF-10", "HISTORICAL MATCH · TUNGUSKA 1908", "MATCH", K.red);
  const r1 = cl((lt - (p.tRef || 0.8)) / 0.5);
  ctx.globalAlpha = Math.max(0.2, r1);
  M("FOREST FLATTENED", B.x + 34, B.y + 110, 20, K.lab, "left", 700, 1);
  M(Math.round(2150 * ease(r1)).toLocaleString("en-US") + " KM²", B.x + 34, B.y + 200, 78, K.txt, "left", 400, -2);
  M("TREES DOWN", B.x + 600, B.y + 110, 20, K.lab, "left", 700, 1);
  M(Math.round(80 * ease(r1)) + " M", B.x + 600, B.y + 200, 78, K.txt, "left", 400, -2);
  M("≈ 20× THE AREA OF PARIS", B.x + 34, B.y + 280, 24, K.red, "left", 800, 1);
  ctx.globalAlpha = 1;
} else if (S === 5) { // ---------------- 2024 YR4: the real scare
  const dr = p.dr !== undefined ? p.dr : 1, out2 = p.out || 0;
  panel(A.x, A.y, A.w, A.h, "RSK-11", "2024 YR4 · EARTH IMPACT PROBABILITY · 2032", out2 > 0.5 ? "RULED OUT" : "WATCH", out2 > 0.5 ? K.txt : K.red, clk);
  const gx0 = A.x + 90, gx1 = A.x + 960, gy0 = A.y + 560, gy1 = A.y + 250;
  // days since 27 Dec 2024 → x ; % → y (0..3.5)
  const X = (d) => gx0 + (gx1 - gx0) * d / 62, Y = (v) => gy0 - (gy0 - gy1) * v / 3.5;
  for (let v = 0; v <= 3; v++) { line(gx0, Y(v), gx1, Y(v), "rgba(255,255,255,0.07)", 1); M(v + "%", gx0 - 14, Y(v) + 6, 17, K.dim, "right", 600); }
  [["DEC 27", 0], ["JAN 27", 31], ["FEB 18", 53], ["FEB 24", 59]].forEach(([s2, d]) => { line(X(d), gy0, X(d), gy0 + 10, "rgba(255,255,255,0.3)", 1.5); M(s2, X(d), gy0 + 34, 16, K.lab, "center", 600, 1); });
  const pts = [[0, 0.0], [10, 0.25], [20, 0.6], [31, 1.2], [42, 2.2], [53, 3.1], [54, 1.5], [55, 0.28], [59, 0.004], [62, 0.0]];
  const dEnd = 62 * dr;
  ctx.strokeStyle = K.red; ctx.lineWidth = 4; ctx.lineJoin = "round"; ctx.beginPath(); let last = null;
  for (let i = 0; i < pts.length; i++) { const [d, v] = pts[i]; if (d <= dEnd) { const xx = X(d), yy = Y(v); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); last = [xx, yy]; }
    else { const [d0, v0] = pts[i - 1]; const k = (dEnd - d0) / (d - d0); const xx = X(dEnd), yy = Y(v0 + (v - v0) * k); ctx.lineTo(xx, yy); last = [xx, yy]; break; } }
  ctx.stroke(); if (last) { circ(last[0], last[1], 8, K.red); }
  if (dr > 0.86) { circ(X(53), Y(3.1), 6, K.red); M("PEAK · FEB 18 2025", X(53) - 14, Y(3.1) - 22, 17, "#FFB3B3", "right", 700, 1); }
  const cur = dEnd >= 59 ? 0.004 : (() => { for (let i = 1; i < pts.length; i++) if (dEnd <= pts[i][0]) { const [d0, v0] = pts[i - 1], [d1, v1] = pts[i]; return v0 + (v1 - v0) * (dEnd - d0) / (d1 - d0); } return 0; })();
  const big = out2 > 0.5 ? "0.004%" : (dr > 0.84 && dr < 0.875 ? "3.1%" : cur.toFixed(1) + "%");
  glow(big, A.x + 60, A.y + 200, 120, out2 > 0.5 ? K.txt : K.red, "left", 400, out2 > 0.5 ? 0 : 26);
  M("CHANCE OF HITTING EARTH", A.x + 64, A.y + 100, 20, K.lab, "left", 700, 2);
  if (out2 > 0) { ctx.save(); ctx.globalAlpha = cl(out2); ctx.translate(A.x + 700, A.y + 170); ctx.rotate(-0.06); const s3 = 1.3 - 0.3 * ease(out2);
    ctx.scale(s3, s3); ctx.fillStyle = "rgba(8,9,10,0.85)"; ctx.fillRect(-180, -48, 360, 96); box(-180, -48, 360, 96, K.txt, 4); M("RULED OUT", 0, 16, 46, K.txt, "center", 800, 3); ctx.restore(); }
  panel(B.x, B.y, B.w, B.h, "TOR-12", "OBJECT · 2024 YR4", "ATLAS-CHL", K.lab);
  M("FOUND", B.x + 34, B.y + 100, 18, K.lab, "left", 700, 1); M("DEC 27 2024", B.x + 34, B.y + 146, 34, K.txt, "left", 600);
  M("SIZE", B.x + 380, B.y + 100, 18, K.lab, "left", 700, 1); M("~60 M", B.x + 380, B.y + 146, 34, K.txt, "left", 600);
  M("TORINO", B.x + 680, B.y + 100, 18, K.lab, "left", 700, 1);
  glow(out2 > 0.5 ? "0" : "3", B.x + 680, B.y + 250, 130, out2 > 0.5 ? K.txt : K.amb, "left", 400, out2 > 0.5 ? 0 : 20);
  M(out2 > 0.5 ? "NO HAZARD" : "MERITS ATTENTION", B.x + 780, B.y + 230, 18, out2 > 0.5 ? K.lab : K.amb, "left", 700, 1);
  M("HIGHEST ODDS NASA HAD EVER LOGGED FOR A ROCK THIS BIG", B.x + 34, B.y + 330, 19, K.lab, "left", 600, 0.5);
} else if (S === 6) { // ---------------- deflection with years of warning
  const k = eio((lt - (p.tPush || 0.5)) / 2.2);
  panel(A.x, A.y, A.w, A.h, "DEF-13", "DEFLECTION PLAN · KINETIC IMPACTOR", k > 0.6 ? "MISS" : "PLANNING", k > 0.6 ? K.txt : K.amb, clk);
  const ex = A.x + 820, ey = A.y + 380, er = 70;
  circ(ex, ey, er, "#1C2329"); ctx.strokeStyle = "rgba(160,190,215,0.6)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ex, ey, er, 0, TAU); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.arc(ex, ey, er, 0, TAU); ctx.clip(); ctx.drawImage(worldDots(), ex - 160, ey - 60, 320, 123); ctx.restore();
  M("EARTH", ex, ey + er + 34, 17, K.lab, "center", 700, 1);
  const sx = A.x + 90, sy = A.y + 470;
  ctx.setLineDash([8, 8]); line(sx, sy, ex - er, ey + 10, "rgba(255,59,59,0.45)", 2); ctx.setLineDash([]);
  const endY = ey + 10 - 200 * k; // new path bends away
  ctx.strokeStyle = K.txt; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo((sx + ex) / 2, sy - 40 * k - 20, ex - er + 10, endY); ctx.stroke();
  const rock = [sx + 4, sy - 2]; circ(rock[0], rock[1], 15, "#8E949A");
  if (lt > (p.tPush || 0.5) - 0.4) { const a = cl((lt - (p.tPush || 0.5) + 0.4) / 0.4); ctx.globalAlpha = a;
    line(sx - 6, sy + 110, sx - 2, sy + 22, K.red, 4); poly([sx - 2, sy + 18, sx - 14, sy + 40, sx + 10, sy + 40], K.red); M("NUDGE", sx + 20, sy + 90, 20, K.red, "left", 800, 2); ctx.globalAlpha = 1; }
  M("LEAD TIME", A.x + 40, A.y + 110, 20, K.lab, "left", 700, 2);
  glow("10 YR", A.x + 36, A.y + 230, 120, K.txt, "left", 300, 0);
  M("TINY PUSH · GROWS EVERY ORBIT", A.x + 40, A.y + 290, 21, K.lab, "left", 600, 1);
  panel(B.x, B.y, B.w, B.h, "ORB-14", "PATH SHIFT NEEDED", "≥ 1 EARTH RADIUS", K.lab);
  ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fillRect(B.x + 34, B.y + 120, 930, 50);
  ctx.fillStyle = k > 0.6 ? "#CFD3D6" : K.red; ctx.fillRect(B.x + 34, B.y + 120, 930 * k, 50);
  M(Math.round(6371 * k).toLocaleString("en-US") + " KM", B.x + 34, B.y + 270, 78, k > 0.6 ? K.txt : K.red, "left", 400, -2);
  M(k > 0.95 ? "CLEAR" : "SHIFTING", B.x + 966, B.y + 260, 30, k > 0.95 ? K.txt : K.amb, "right", 800, 2);
} else if (S === 7) { // ---------------- NASA DART: 32 minutes
  const th = p.tHit || 0.6, hk = cl((lt - th) / 0.15), post = lt > th;
  panel(A.x, A.y, A.w, A.h, "DRT-15", "NASA DART · DIDYMOS SYSTEM · SEP 26 2022", post ? "IMPACT CONFIRMED" : "TERMINAL", post ? K.red : K.lab, clk);
  ctx.save(); ctx.beginPath(); ctx.rect(A.x + 2, A.y + 54, A.w - 4, A.h - 56); ctx.clip();
  ctx.drawImage(stars(), A.x, A.y + 50, 1000, 600);
  const cx = A.x + 480, cy = A.y + 370;
  ctx.strokeStyle = "rgba(255,255,255,0.20)"; ctx.lineWidth = 1.5; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.ellipse(cx, cy, 330, 120, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
  if (post) { ctx.strokeStyle = "rgba(255,59,59,0.7)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy, 300, 108, 0, 0, TAU); ctx.stroke(); }
  // Didymos + Dimorphos (moon passes behind when its orbit angle is on the far side)
  const ang = -0.35 + lt * 0.32, dx = cx + Math.cos(ang) * (post ? 300 : 330), dy = cy + Math.sin(ang) * (post ? 108 : 120);
  const front = Math.sin(ang) > 0;
  const didy = () => { ctx.fillStyle = "#3A3F44"; ctx.beginPath(); ctx.ellipse(cx, cy, 110, 100, 0.2, 0, TAU); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 2; ctx.stroke(); };
  const dimo = () => { circ(dx, dy, 26, "#6A7076"); ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(dx, dy, 26, 0, TAU); ctx.stroke(); };
  if (front) { didy(); dimo(); } else { dimo(); didy(); }
  M("DIDYMOS", cx, cy + 150, 18, K.lab, "center", 700, 1);
  M("DIMORPHOS", dx, dy - 40, 17, K.txt, "center", 700, 1);
  if (!post) { const k = cl(lt / th); const sx = A.x + 980 - (980 - (dx - A.x)) * k, sy = A.y + 80 + (dy - A.y - 80) * k; line(sx + 60, sy - 30, sx, sy, K.red, 3); circ(sx, sy, 6, K.red); M("DART", sx + 16, sy - 16, 18, K.red, "left", 800, 1); }
  else { const e = cl((lt - th) / 1.4); for (let i = 0; i < 16; i++) { const a = -2.4 + i * 0.12 + rnd(i) * 0.1, L = (30 + rnd(i + 4) * 110) * ease(e);
      line(dx + Math.cos(a) * 26, dy + Math.sin(a) * 26, dx + Math.cos(a) * (26 + L), dy + Math.sin(a) * (26 + L), `rgba(255,220,210,${0.7 * (1 - e * 0.6)})`, 2); }
    if (hk < 1) { ctx.fillStyle = `rgba(255,245,240,${0.85 * (1 - hk)})`; ctx.fillRect(A.x, A.y, A.w, A.h); } }
  ctx.restore();
  panel(B.x, B.y, B.w, B.h, "PER-16", "MOON ORBIT PERIOD", post ? "CHANGED" : "BASELINE", post ? K.red : K.lab);
  const pk = cl((lt - th - 0.3) / 0.9);
  M("BEFORE", B.x + 34, B.y + 100, 18, K.lab, "left", 700, 1); M("11 H 55 M", B.x + 34, B.y + 160, 50, post ? K.lab : K.txt, "left", 500);
  if (post) { line(B.x + 30, B.y + 145, B.x + 34 + 300 * ease(pk), B.y + 145, K.red, 3);
    ctx.globalAlpha = pk; M("AFTER", B.x + 34, B.y + 230, 18, K.lab, "left", 700, 1); M("11 H 23 M", B.x + 34, B.y + 290, 50, K.txt, "left", 500); ctx.globalAlpha = 1;
    glow("−" + Math.round(32 * ease(pk)) + " MIN", B.x + 966, B.y + 260, 128, K.red, "right", 400, 26); }
} else if (S === 8 || S === 9) { // ---------------- evacuation / full-wall alert
  const ev = cl(lt / Math.max(0.1, p.evDur || 4));
  panel(A.x, A.y, A.w, A.h, "EVC-17", "IMPACT CORRIDOR · CIVIL DEFENSE", "EVACUATE", K.red, clk);
  ctx.save(); ctx.beginPath(); ctx.rect(A.x + 2, A.y + 54, A.w - 4, A.h - 56); ctx.clip();
  ctx.drawImage(cityMap(), A.x, A.y + 40, 1000, 640);
  const cx = A.x + 500, cy = A.y + 360;
  ctx.fillStyle = blink(1.5) ? "rgba(255,59,59,0.22)" : "rgba(255,59,59,0.12)"; ctx.beginPath(); ctx.ellipse(cx, cy, 300, 200, -0.3, 0, TAU); ctx.fill();
  ctx.strokeStyle = K.red; ctx.lineWidth = 3; ctx.setLineDash([16, 10]); ctx.beginPath(); ctx.ellipse(cx, cy, 300, 200, -0.3, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
  for (let i = 0; i < 90; i++) { const a = Math.floor(rnd(i) * 6) / 6 * TAU + 0.3, d = ((rnd(i + 3) + lt * (0.12 + rnd(i + 8) * 0.1)) % 1) * 460;
    sq(cx + Math.cos(a) * d - 3, cy + Math.sin(a) * d - 3, 6, d < 300 ? "#FFE1DC" : "rgba(220,225,230,0.7)"); }
  ctx.restore();
  ctx.fillStyle = "rgba(10,2,2,0.85)"; ctx.fillRect(A.x + 24, A.y + 74, 390, 170); box(A.x + 24, A.y + 74, 390, 170, "rgba(255,59,59,0.6)", 1.5);
  M("TIME TO IMPACT", A.x + 44, A.y + 110, 18, "#FFB3B3", "left", 700, 1);
  glow((p.days || 121) + " D", A.x + 40, A.y + 220, 100, K.red, "left", 400, 24);
  panel(B.x, B.y, B.w, B.h, "EVC-18", "ZONE STATUS", blink(2) ? "● LIVE" : "  LIVE", K.red);
  M("ZONE CLEARED", B.x + 34, B.y + 100, 20, K.lab, "left", 700, 1);
  ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fillRect(B.x + 34, B.y + 124, 930, 46); ctx.fillStyle = K.red; ctx.fillRect(B.x + 34, B.y + 124, 930 * (p.clr || 0), 46);
  glow(Math.round(100 * (p.clr || 0)) + "%", B.x + 34, B.y + 290, 110, K.txt, "left", 400, 0);
  M("ROADS · RAIL · AIR", B.x + 966, B.y + 280, 22, K.lab, "right", 700, 1);
  if (S === 9) { const a = cl(lt / 0.4); ctx.fillStyle = `rgba(255,30,30,${(blink(1.2) ? 0.16 : 0.07) * a})`; ctx.fillRect(-400, 40, W + 800, 1260);
    ctx.globalAlpha = a; ctx.fillStyle = "rgba(8,0,0,0.85)"; ctx.fillRect(140, 470, 800, 150); box(140, 470, 800, 150, K.red, 4);
    glow("EVACUATE?", 540, 580, 96, K.red, "center", 700, 26); ctx.globalAlpha = 1; }
}
ctx.drawImage(scan(), -400, 0, W + 800, H);
// scanning bar sweeping down the wall
const sb = ((t * 0.35) % 1) * 1300; const sg = ctx.createLinearGradient(0, sb - 80, 0, sb); sg.addColorStop(0, "rgba(255,255,255,0)"); sg.addColorStop(1, "rgba(255,255,255,0.045)");
ctx.fillStyle = sg; ctx.fillRect(-400, sb - 80, W + 800, 80);
if (alarm > 0) { ctx.fillStyle = `rgba(255,40,40,${alarm * (blink(1.6) ? 0.12 : 0.04)})`; ctx.fillRect(-400, 40, W + 800, 1260); }
ctx.restore();
// foreground room (operators + floor) with gentle parallax
ctx.save(); cam(540 + (fx - 540) * 0.4, 960 + (fy - 960) * 0.3, 1 + (z - 1) * 0.6, 0);
ctx.drawImage(room(), 0, 1150);
ctx.restore();
ctx.drawImage(vig(), 0, 0);
// glitch cut at scene start
if (lt < 0.14 && !p.noGlitch) { for (let i = 0; i < 7; i++) { const y = rnd(i + Math.floor(t * 60)) * 1300, h2 = 6 + rnd(i * 3 + Math.floor(t * 60)) * 40;
  ctx.drawImage(ctx.canvas, 0, y, W, h2, (rnd(i * 7 + Math.floor(t * 60)) - 0.5) * 120, y, W, h2);
  ctx.fillStyle = i % 3 === 0 ? "rgba(255,59,59,0.35)" : "rgba(255,255,255,0.08)"; ctx.fillRect(0, y, W, 2); } }
