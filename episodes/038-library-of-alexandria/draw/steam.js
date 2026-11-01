// Hero's aeolipile: gold sphere spinning on a cauldron over fire, steam jets. p: zoom, cx, cy, spin (rad/s), steam (0..1)
// ---- Ink & Gold helpers (episode 038; inlined into every draw file by the episode's build step) ----
const C8 = window.__c038 || (window.__c038 = {});
const INK = { paper: "#CFC8B9", mid: "#9C978E", dark: "#55524D", ink: "#141312", g0: "#7E5E19", g1: "#C9A64B", g2: "#F2D68A", seal: "#B8322A" };
function prng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t2 = Math.imul(a ^ (a >>> 15), 1 | a); t2 = (t2 + Math.imul(t2 ^ (t2 >>> 7), 61 | t2)) ^ t2; return ((t2 ^ (t2 >>> 14)) >>> 0) / 4294967296; }; }
function mkC(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
function cached(key, w, h, fn) { if (!C8[key]) { const c = mkC(w, h); fn(c.getContext("2d"), w, h); C8[key] = c; } return C8[key]; }
// paper: warm grey rice paper (blotches, fibres, grain). Drawn larger than the frame so camera moves never show edges.
function paperTex() {
  return cached("paper", 1400, 2400, (g, w, h) => {
    const R = prng(38); g.fillStyle = INK.paper; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) { const x = R() * w, y = R() * h, r = 60 + R() * 380, d = R() < 0.6; const rg = g.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, d ? `rgba(70,64,56,${0.03 + R() * 0.05})` : `rgba(255,250,236,${0.04 + R() * 0.06})`); rg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    g.lineCap = "round";
    for (let i = 0; i < 1600; i++) { const x = R() * w, y = R() * h, l = 8 + R() * 50, a = R() * TAU; g.strokeStyle = R() < 0.5 ? `rgba(60,55,48,${0.05 + R() * 0.07})` : `rgba(255,252,240,${0.08 + R() * 0.1})`;
      g.lineWidth = 0.6 + R() * 1.1; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
    const id = g.getImageData(0, 0, w, h), d = id.data; for (let i = 0; i < d.length; i += 4) { const n = (R() - 0.5) * 22; d[i] += n; d[i + 1] += n; d[i + 2] += n; } g.putImageData(id, 0, 0);
  });
}
function drawPaper(g) { g.drawImage(paperTex(), -160, -240); }
// soft wash blob (ellipse), any context
function blob(g, x, y, rx, ry, rgb, a) { g.save(); g.translate(x, y); g.scale(1, ry / rx); const rg = g.createRadialGradient(0, 0, 0, 0, 0, rx); rg.addColorStop(0, `rgba(${rgb},${a})`); rg.addColorStop(0.55, `rgba(${rgb},${a * 0.6})`); rg.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = rg; g.fillRect(-rx, -rx, 2 * rx, 2 * rx); g.restore(); }
// vertical wash gradient band
function vwash(g, y0, y1, rgb, a0, a1) { const lg = g.createLinearGradient(0, y0, 0, y1); lg.addColorStop(0, `rgba(${rgb},${a0})`); lg.addColorStop(1, `rgba(${rgb},${a1})`); g.fillStyle = lg; g.fillRect(-300, y0, W + 600, y1 - y0); }
// ink ridge (mountains / hills / clouds) fading downward into mist; static use (uses blur filter)
function ridge(g, yb, amp, seed, rgb, a, blur = 6, fade = 380, freq = 1) {
  g.save(); if (blur) g.filter = `blur(${blur}px)`;
  const lg = g.createLinearGradient(0, yb - amp, 0, yb + fade); lg.addColorStop(0, `rgba(${rgb},${a})`); lg.addColorStop(0.45, `rgba(${rgb},${a * 0.75})`); lg.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = lg; g.beginPath(); g.moveTo(-300, yb + fade);
  for (let x = -300; x <= W + 300; x += 12) { const u = x / W * freq; const y = yb - amp * (0.55 * Math.abs(Math.sin(u * 2.3 + seed)) + 0.3 * Math.sin(u * 5.1 + seed * 2) ** 2 + 0.15 * Math.sin(u * 13 + seed * 3)); g.lineTo(x, y); }
  g.lineTo(W + 300, yb + fade); g.closePath(); g.fill(); g.restore();
}
// long horizontal cloud streak (static; blurred)
function streak(g, x, y, w, h, rgb, a, blur = 10) { g.save(); g.filter = `blur(${blur}px)`; g.fillStyle = `rgba(${rgb},${a})`; g.beginPath(); g.ellipse(x, y, w / 2, h / 2, 0, 0, TAU); g.fill(); g.fillStyle = `rgba(${rgb},${a * 0.8})`; g.beginPath(); g.ellipse(x + w * 0.18, y - h * 0.35, w * 0.3, h * 0.45, 0, 0, TAU); g.fill(); g.restore(); }
// bristle brush stroke along a polyline [x0,y0,x1,y1,...] (tapered, dry-brush gaps). k = reveal 0..1
function brush(g, pts, w, col = INK.ink, a = 1, seed = 1, dry = 0.35, k = 1) {
  const P = []; for (let i = 0; i + 3 < pts.length; i += 2) { const [x0, y0, x1, y1] = [pts[i], pts[i + 1], pts[i + 2], pts[i + 3]]; const n = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 10)); for (let j = 0; j < n; j++) P.push([lerp(x0, x1, j / n), lerp(y0, y1, j / n)]); }
  P.push([pts[pts.length - 2], pts[pts.length - 1]]);
  const m = Math.max(2, Math.floor(P.length * cl(k))); if (m < 2) return;
  const nb = Math.max(5, Math.round(w / 3)); g.save(); g.globalAlpha = a; g.strokeStyle = col; g.fillStyle = col; g.lineCap = "round";
  const nrm = (j) => { const p0 = P[Math.max(0, j - 1)], p1 = P[Math.min(P.length - 1, j + 1)]; const dx = p1[0] - p0[0], dy = p1[1] - p0[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; };
  const tp = (j) => Math.pow(Math.sin(Math.PI * cl((j + 0.5) / P.length * 0.92 + 0.04)), 0.55);
  // solid core
  g.beginPath(); for (let j = 0; j < m; j++) { const [nx, ny] = nrm(j), s = w * 0.3 * tp(j); j ? g.lineTo(P[j][0] + nx * s, P[j][1] + ny * s) : g.moveTo(P[j][0] + nx * s, P[j][1] + ny * s); }
  for (let j = m - 1; j >= 0; j--) { const [nx, ny] = nrm(j), s = -w * 0.3 * tp(j); g.lineTo(P[j][0] + nx * s, P[j][1] + ny * s); } g.closePath(); g.fill();
  // bristles
  g.lineWidth = Math.max(1, (w / nb) * 1.5);
  for (let b = 0; b < nb; b++) { const o = (b / (nb - 1) - 0.5) * w; let on = false; g.beginPath();
    for (let j = 0; j < m; j++) { const u = j / P.length; const gap = rnd(seed * 7.3 + b * 3.1 + Math.floor(j / 3)) < dry * Math.pow(u, 1.6) * (Math.abs(o) / w * 2 + 0.3);
      const [nx, ny] = nrm(j), s = o * tp(j), x = P[j][0] + nx * s, y = P[j][1] + ny * s; if (gap) { on = false; continue; } on ? g.lineTo(x, y) : g.moveTo(x, y); on = true; }
    g.stroke(); }
  g.restore();
}
// mottled gold leaf texture as a pattern
function goldPat(g) {
  const c = cached("gold", 512, 512, (q, w, h) => {
    const R = prng(7); q.fillStyle = "#D2AE5C"; q.fillRect(0, 0, w, h);
    const wrap = (fn) => { for (const ox of [-w, 0, w]) for (const oy of [-h, 0, h]) fn(ox, oy); };
    for (let i = 0; i < 300; i++) { const x = R() * w, y = R() * h, r = 8 + R() * 60, L = R() < 0.5, al = 0.2 + R() * 0.3;
      wrap((ox, oy) => { const rg = q.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r); rg.addColorStop(0, L ? `rgba(255,240,190,${al})` : `rgba(120,84,22,${al})`); rg.addColorStop(1, "rgba(0,0,0,0)"); q.fillStyle = rg; q.fillRect(x + ox - r, y + oy - r, 2 * r, 2 * r); }); }
    q.lineWidth = 1; for (let i = 0; i < 220; i++) { const x = R() * w, y = R() * h, d = [(R() - 0.5) * 50, (R() - 0.5) * 50, (R() - 0.5) * 70, (R() - 0.5) * 70]; const col = R() < 0.5 ? "rgba(255,246,210,0.45)" : "rgba(120,86,24,0.4)";
      wrap((ox, oy) => { q.strokeStyle = col; q.beginPath(); q.moveTo(x + ox, y + oy); q.lineTo(x + ox + d[0], y + oy + d[1]); q.lineTo(x + ox + d[2], y + oy + d[3]); q.stroke(); }); }
    for (let i = 0; i < 1400; i++) { q.fillStyle = R() < 0.5 ? "rgba(90,62,14,0.5)" : "rgba(255,250,225,0.7)"; q.fillRect(R() * w, R() * h, 1 + R() * 2, 1 + R() * 2); }
  });
  return g.createPattern(c, "repeat");
}
function glow(g, x, y, r, a = 0.5, rgb = "242,214,138") { const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, `rgba(${rgb},${a})`); rg.addColorStop(0.4, `rgba(${rgb},${a * 0.35})`); rg.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
function goldDisc(g, x, y, r, gl = 1) {
  if (gl > 0) { glow(g, x, y, r * 2.4, 0.45 * gl); }
  g.save(); g.beginPath(); for (let i = 0; i <= 90; i++) { const a = i / 90 * TAU; const rr2 = r * (1 + 0.012 * Math.sin(a * 7 + 1) + 0.008 * Math.sin(a * 19)); i ? g.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2) : g.moveTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); }
  g.closePath(); g.fillStyle = goldPat(g); g.fill(); g.clip();
  const rg = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r); rg.addColorStop(0, "rgba(255,248,220,0.35)"); rg.addColorStop(0.7, "rgba(0,0,0,0)"); rg.addColorStop(1, "rgba(90,60,10,0.35)"); g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r);
  g.restore();
}
function goldShape(g, pathFn, gl = 0) { g.save(); if (gl) { g.shadowColor = "rgba(242,214,138,0.75)"; g.shadowBlur = gl; } g.beginPath(); pathFn(g); g.fillStyle = goldPat(g); g.fill(); g.restore(); }
function sparkle(g, x, y, s, a = 1) { g.save(); g.globalAlpha = a; g.fillStyle = "#FFF4CF"; g.beginPath(); g.moveTo(x, y - s); g.quadraticCurveTo(x, y, x + s * 0.3, y); g.quadraticCurveTo(x, y, x, y + s); g.quadraticCurveTo(x, y, x - s * 0.3, y); g.quadraticCurveTo(x, y, x, y - s); g.fill();
  g.beginPath(); g.moveTo(x - s * 0.6, y); g.quadraticCurveTo(x, y, x, y - s * 0.2); g.quadraticCurveTo(x, y, x + s * 0.6, y); g.quadraticCurveTo(x, y, x, y + s * 0.2); g.fill(); glow(g, x, y, s * 1.2, 0.5); g.restore(); }
function goldDust(g, n, x0, y0, w, h, seed = 1, a = 0.8, rise = 20) { for (let i = 0; i < n; i++) { const x = x0 + rnd(i * 3.7 + seed) * w + Math.sin(t * 0.7 + i) * 10, y = y0 + ((rnd(i * 5.3 + seed) * h - t * rise * (0.5 + rnd(i))) % h + h) % h, s = 1.5 + rnd(i * 9.1 + seed) * 3.5;
  const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * (1 + rnd(i) * 2) + i)); g.fillStyle = `rgba(242,214,138,${a * tw})`; g.fillRect(x, y, s, s); } }
function splatter(g, x, y, r, n, seed, col = INK.ink, a = 0.85) { g.fillStyle = col; g.globalAlpha = a; for (let i = 0; i < n; i++) { const ang = rnd(seed + i) * TAU, d = r * Math.pow(rnd(seed * 3 + i), 0.7), s = 1 + rnd(seed * 7 + i) * 5; g.beginPath(); g.arc(x + Math.cos(ang) * d, y + Math.sin(ang) * d, s, 0, TAU); g.fill(); } g.globalAlpha = 1; }
function seal(g, x, y, s = 1, glyph = "Α") { g.save(); g.translate(x, y); g.rotate(-0.04); g.fillStyle = INK.seal; g.globalAlpha = 0.92; g.beginPath(); g.moveTo(-34 * s, -36 * s); g.lineTo(35 * s, -34 * s); g.lineTo(36 * s, 35 * s); g.lineTo(-35 * s, 36 * s); g.closePath(); g.fill();
  g.globalAlpha = 1; g.fillStyle = "#F3E7D0"; g.font = `${46 * s}px LSerif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(glyph, 0, 3 * s); g.restore(); }
// ---- silhouettes (fill = ink) ----
function column(g, x, yb, h, w, col = INK.ink, rim = 0) {
  g.fillStyle = col; g.fillRect(x - w * 0.75, yb - w * 0.28, w * 1.5, w * 0.28); g.fillRect(x - w * 0.62, yb - w * 0.46, w * 1.24, w * 0.2);
  g.beginPath(); g.moveTo(x - w * 0.5, yb - w * 0.46); g.lineTo(x - w * 0.42, yb - h + w * 0.5); g.lineTo(x + w * 0.42, yb - h + w * 0.5); g.lineTo(x + w * 0.5, yb - w * 0.46); g.closePath(); g.fill();
  g.fillRect(x - w * 0.6, yb - h + w * 0.3, w * 1.2, w * 0.22); g.fillRect(x - w * 0.8, yb - h, w * 1.6, w * 0.32);
  if (rim) { g.fillStyle = `rgba(242,214,138,${0.7 * rim})`; g.fillRect(x + w * 0.36, yb - h + w * 0.55, Math.max(2, w * 0.06), h - w * 1.05); }
}
function pharos(g, x, yb, s = 1, fire = 1, col = INK.ink) {
  g.fillStyle = col;
  g.beginPath(); g.moveTo(x - 210 * s, yb); g.lineTo(x - 230 * s, yb + 30 * s); g.lineTo(x + 230 * s, yb + 30 * s); g.lineTo(x + 210 * s, yb); g.closePath(); g.fill();
  g.fillRect(x - 200 * s, yb - 40 * s, 400 * s, 40 * s);
  g.beginPath(); g.moveTo(x - 120 * s, yb - 40 * s); g.lineTo(x - 98 * s, yb - 560 * s); g.lineTo(x + 98 * s, yb - 560 * s); g.lineTo(x + 120 * s, yb - 40 * s); g.closePath(); g.fill();
  g.fillRect(x - 112 * s, yb - 585 * s, 224 * s, 26 * s);
  g.beginPath(); g.moveTo(x - 72 * s, yb - 585 * s); g.lineTo(x - 62 * s, yb - 830 * s); g.lineTo(x + 62 * s, yb - 830 * s); g.lineTo(x + 72 * s, yb - 585 * s); g.closePath(); g.fill();
  g.fillRect(x - 80 * s, yb - 852 * s, 160 * s, 24 * s);
  g.fillRect(x - 40 * s, yb - 975 * s, 80 * s, 125 * s);
  for (let i = -1; i <= 1; i++) g.fillRect(x + i * 30 * s - 5 * s, yb - 1010 * s, 10 * s, 40 * s);
  g.beginPath(); g.moveTo(x - 50 * s, yb - 1010 * s); g.lineTo(x, yb - 1060 * s); g.lineTo(x + 50 * s, yb - 1010 * s); g.closePath(); g.fill();
  g.fillRect(x - 4 * s, yb - 1130 * s, 8 * s, 75 * s); circ2(g, x, yb - 1135 * s, 12 * s, col);
  // windows (gold slits)
  g.fillStyle = `rgba(242,214,138,${0.5 + 0.4 * fire})`; for (let i = 0; i < 6; i++) g.fillRect(x - 6 * s, yb - 120 * s - i * 72 * s, 12 * s, 30 * s);
  if (fire > 0) { glow(g, x, yb - 935 * s, 260 * s * fire, 0.7 * fire); flame(g, x, yb - 900 * s, 36 * s * fire, 70 * s * fire, 3); }
}
function circ2(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
// gold-leaf flame (flickering tongues)
function flame(g, x, yb, w, h, seed = 1, gl = 30) {
  goldShape(g, (q) => { for (let k = 0; k < 3; k++) { const ox = (k - 1) * w * 0.55, hh = h * (k === 1 ? 1 : 0.68) * (0.85 + 0.15 * Math.sin(t * 9 + seed + k * 2)), sw = Math.sin(t * 6 + seed * 3 + k) * w * 0.25;
    q.moveTo(x + ox - w * 0.5, yb); q.bezierCurveTo(x + ox - w * 0.6, yb - hh * 0.5, x + ox + sw - w * 0.1, yb - hh * 0.7, x + ox + sw, yb - hh); q.bezierCurveTo(x + ox + sw + w * 0.1, yb - hh * 0.6, x + ox + w * 0.6, yb - hh * 0.45, x + ox + w * 0.5, yb); q.closePath(); } }, gl);
}
function ship(g, x, y, s = 1, sail = 1, col = INK.ink, dir = 1) {
  g.save(); g.translate(x, y); g.scale(s * dir, s); g.fillStyle = col;
  g.beginPath(); g.moveTo(-230, -40); g.quadraticCurveTo(-120, 40, 0, 30); g.quadraticCurveTo(160, 30, 240, -60); g.lineTo(262, -92); g.lineTo(220, -50); g.lineTo(-210, -40); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(-230, -40); g.quadraticCurveTo(-260, -70, -250, -110); g.lineTo(-238, -104); g.quadraticCurveTo(-238, -70, -214, -44); g.fill();
  g.fillRect(-6, -330, 12, 300);
  g.strokeStyle = col; g.lineWidth = 4; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(-160 + i * 40, 10); g.lineTo(-180 + i * 40, 60); g.stroke(); }
  if (sail > 0) { g.beginPath(); g.moveTo(-120, -300); g.quadraticCurveTo(0, -280 + 30 * sail, 120, -300); g.lineTo(130, -90); g.quadraticCurveTo(0, -60 + 30 * sail, -130, -90); g.closePath(); g.fill(); g.fillRect(-140, -312, 280, 10); }
  g.restore();
}
// robed figure silhouette. pose: stand | read | run | point | sit. yb = feet.
function figure(g, x, yb, s = 1, pose = "stand", col = INK.ink, dir = 1, ph = 0) {
  g.save(); g.translate(x, yb); g.scale(s * dir, s); g.fillStyle = col; g.strokeStyle = col; g.lineCap = "round";
  const run = pose === "run", st = run ? Math.sin(t * 10 + ph) : 0, bob = run ? Math.abs(Math.sin(t * 10 + ph)) * -8 : 0; g.translate(0, bob);
  if (run) { g.lineWidth = 26; g.beginPath(); g.moveTo(0, -150); g.lineTo(40 * st, -70); g.lineTo(30 * st + 20, 0); g.stroke(); g.beginPath(); g.moveTo(0, -150); g.lineTo(-40 * st, -70); g.lineTo(-30 * st - 10, 0); g.stroke(); }
  // robe
  g.beginPath(); g.moveTo(-34, -290); g.quadraticCurveTo(-52, -160, run ? -60 : -64, run ? -110 : 0); g.lineTo(run ? 60 : 62, run ? -110 : 0); g.quadraticCurveTo(48, -170, 34, -290); g.closePath(); g.fill();
  if (pose === "sit") { g.fillRect(-60, -120, 120, 120); }
  // drape over shoulder
  g.beginPath(); g.moveTo(-40, -300); g.quadraticCurveTo(10, -240, 40, -150); g.lineTo(52, -170); g.quadraticCurveTo(30, -260, 30, -300); g.fill();
  // head + neck + beard
  g.fillRect(-10, -320, 20, 30); g.beginPath(); g.ellipse(4, -345, 27, 31, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(10, -335); g.lineTo(38, -342); g.lineTo(28, -318); g.fill();
  g.lineWidth = 20;
  if (pose === "read") { g.beginPath(); g.moveTo(-26, -275); g.lineTo(10, -215); g.lineTo(70, -225); g.stroke(); g.beginPath(); g.moveTo(26, -275); g.lineTo(60, -230); g.stroke(); }
  else if (pose === "point") { g.beginPath(); g.moveTo(22, -275); g.lineTo(80, -330); g.lineTo(120, -380); g.stroke(); g.beginPath(); g.moveTo(-26, -275); g.lineTo(-36, -200); g.lineTo(-30, -150); g.stroke(); }
  else if (pose === "run") { g.beginPath(); g.moveTo(-20, -275); g.lineTo(30, -230); g.lineTo(70, -250); g.stroke(); g.beginPath(); g.moveTo(20, -275); g.lineTo(60, -220); g.stroke(); }
  else if (pose === "talk") { g.beginPath(); g.moveTo(22, -275); g.lineTo(70, -250); g.lineTo(110, -275 + Math.sin(t * 3 + ph) * 12); g.stroke(); g.beginPath(); g.moveTo(-26, -275); g.lineTo(-36, -200); g.lineTo(-30, -150); g.stroke(); }
  else { g.beginPath(); g.moveTo(-26, -275); g.lineTo(-38, -190); g.lineTo(-32, -140); g.stroke(); g.beginPath(); g.moveTo(26, -275); g.lineTo(38, -190); g.lineTo(32, -140); g.stroke(); }
  g.restore();
}
// scroll seen end-on (for shelves); gold = gold cap
function scrollEnd(g, x, y, r, gold = 0) { if (gold > 0.5) { g.save(); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fillStyle = goldPat(g); g.fill(); g.restore(); circ2(g, x, y, r * 0.45, "#5A4214"); circ2(g, x, y, r * 0.18, "#F2D68A"); }
  else { circ2(g, x, y, r, "#D8D0BC"); g.strokeStyle = "rgba(20,19,18,0.85)"; g.lineWidth = Math.max(1.5, r * 0.12); g.beginPath(); g.arc(x, y, r * 0.95, 0, TAU); g.stroke();
    g.lineWidth = Math.max(1, r * 0.07); g.beginPath(); for (let i = 0; i <= 30; i++) { const a = i / 30 * TAU * 2.2, rr2 = r * (0.12 + 0.68 * i / 30); i ? g.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2) : g.moveTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } g.stroke(); } }
// pigeonhole shelf block. fill: fraction of scrolls left; seed varies order
function shelf(g, x, y, w, h, cols, rows, fill = 1, seed = 1, goldK = 0.12, col = INK.ink) {
  g.fillStyle = col; g.fillRect(x - 10, y - 10, w + 20, h + 20);
  const cw = w / cols, ch = h / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const cx = x + c * cw, cy = y + r * ch; g.fillStyle = "rgba(48,46,42,0.96)"; g.fillRect(cx + 5, cy + 5, cw - 10, ch - 10);
    const id = seed * 101 + r * 17 + c * 7; const n = 3 + Math.floor(rnd(id) * 3); const rad = Math.min(cw, ch) * 0.2;
    for (let k = 0; k < n; k++) { if (rnd(id * 3 + k * 11) > fill) continue; const ox = cx + cw * (0.25 + 0.5 * rnd(id + k * 5.1)), oy = cy + ch - 5 - rad * (1 + (k % 2) * 1.6) - (k > 2 ? rad * 1.6 : 0); scrollEnd(g, ox, oy, rad, rnd(id * 7 + k) < goldK ? 1 : 0); }
  }
}
// greek temple (pediment + columns + steps). crack: 0..1 gold fissure; tilt: collapse
function temple(g, x, yb, s = 1, ncol = 6, col = INK.ink, rim = 0) {
  const w = 620 * s; g.fillStyle = col;
  for (let i = 0; i < 3; i++) g.fillRect(x - w / 2 - 40 * s + i * 14 * s, yb - (i + 1) * 22 * s, w + 80 * s - i * 28 * s, 22 * s);
  const top = yb - 66 * s - 360 * s; for (let i = 0; i < ncol; i++) column(g, x - w / 2 + 40 * s + i * (w - 80 * s) / (ncol - 1), yb - 66 * s, 360 * s, 44 * s, col, rim);
  g.fillStyle = col; g.fillRect(x - w / 2 - 10 * s, top - 50 * s, w + 20 * s, 50 * s);
  g.beginPath(); g.moveTo(x - w / 2 - 30 * s, top - 50 * s); g.lineTo(x, top - 190 * s); g.lineTo(x + w / 2 + 30 * s, top - 50 * s); g.closePath(); g.fill();
}
// ---- standard frame pieces ----
function frameIn(px) { // camera: p.zoom, p.cx, p.cy, p.shake
  cam(px.cx ?? W / 2, px.cy ?? H / 2, px.zoom ?? 1, px.shake || 0);
}
// final pass: rice-paper grain over everything + ink bleeding in from the edges + a few splatters
function finish(g, edge = 0.55, spl = 1) {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.55; g.drawImage(paperTex(), -160, -240); g.globalAlpha = 1;
  g.globalCompositeOperation = "source-over";
  const vg = g.createRadialGradient(W / 2, H * 0.47, H * 0.3, W / 2, H * 0.5, H * 0.75); vg.addColorStop(0, "rgba(20,19,18,0)"); vg.addColorStop(1, `rgba(20,19,18,${edge})`); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  if (spl) { splatter(g, 60, 1820, 120, 14, 3, INK.ink, 0.7); splatter(g, 1030, 140, 90, 10, 8, INK.ink, 0.6); }
  g.restore();
}
frameIn(p);
const steam = p.steam ?? 1;
const bg = cached("steam_bg", W + 400, H + 400, (g) => { g.translate(200, 200); drawPaper(g);
  vwash(g, -200, H + 200, "30,29,27", 0.92, 0.85);
  blob(g, 540, 860, 600, 600, "110,105,96", 0.45);
  for (let i = 0; i < 6; i++) brush(g, [-100, 1500 + i * 70, 1200, 1500 + i * 70 + 4], 3, "rgba(150,144,132,1)", 0.25, i, 0.8);
});
ctx.drawImage(bg, -200, -200);
const sx = 540, sy = 800, R = 135, ang = (p.spin ?? 3) * lt;
glow(ctx, sx, 1280, 520, 0.4); glow(ctx, sx, sy, 420, 0.25);
// fire under the cauldron
flame(ctx, sx - 90, 1370, 70, 170, 1, 40); flame(ctx, sx + 80, 1370, 64, 150, 4, 40); flame(ctx, sx, 1375, 90, 220, 7, 50);
// tripod + cauldron
ctx.fillStyle = INK.ink; limb(sx - 150, 1180, sx - 210, 1400, 16, INK.ink); limb(sx + 150, 1180, sx + 210, 1400, 16, INK.ink); limb(sx, 1200, sx, 1400, 14, INK.ink);
ctx.beginPath(); ctx.moveTo(sx - 220, 1060); ctx.lineTo(sx + 220, 1060); ctx.quadraticCurveTo(sx + 220, 1260, sx, 1270); ctx.quadraticCurveTo(sx - 220, 1260, sx - 220, 1060); ctx.fill();
ctx.fillRect(sx - 240, 1046, 480, 22);
ctx.fillStyle = "rgba(242,214,138,0.8)"; ctx.fillRect(sx - 236, 1066, 472, 3);
// support pipe (seen along the axis: rises from the cauldron and bends in behind the sphere's centre)
ctx.fillStyle = INK.ink; ctx.fillRect(sx - 200, sy - 13, 26, 1060 - sy + 13); ctx.fillRect(sx - 200, sy - 13, 200, 26);
// nozzles rotate in the screen plane around the sphere centre (axis points at the viewer)
const dirS = Math.sign(p.spin ?? 3) || 1;
const noz = (a) => { const ux = Math.cos(a), uy = Math.sin(a), vx = -uy * dirS, vy = ux * dirS; const b = [sx + ux * R * 0.9, sy + uy * R * 0.9], m = [sx + ux * (R + 58), sy + uy * (R + 58)], e = [m[0] - vx * 52, m[1] - vy * 52]; return { b, m, e }; };
const nz = [noz(ang), noz(ang + Math.PI)];
goldDisc(ctx, sx, sy, R, 0.8);
// rotating meridians on the sphere
ctx.save(); ctx.beginPath(); ctx.arc(sx, sy, R, 0, TAU); ctx.clip(); ctx.strokeStyle = "rgba(90,62,14,0.6)"; ctx.lineWidth = 5;
for (let i = 0; i < 3; i++) { const a = ang + i * Math.PI / 3; ctx.beginPath(); ctx.ellipse(sx, sy, R, R * 0.3 + i * 18, a, 0, TAU); ctx.stroke(); } ctx.restore();
circ2(ctx, sx, sy, 16, INK.ink);
nz.forEach((n) => { ctx.strokeStyle = INK.ink; ctx.lineWidth = 20; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(n.b[0], n.b[1]); ctx.lineTo(n.m[0], n.m[1]); ctx.lineTo(n.e[0], n.e[1]); ctx.stroke(); });
// steam jets: puffs left behind along the circle, opposite to the motion
nz.forEach((n, j) => { for (let i = 0; i < 10; i++) { const ph = (lt * 1.8 + i / 10) % 1; const a = ang + j * Math.PI - dirS * (0.35 + ph * 1.3); const rr2 = R + 58 + ph * 60;
  blob(ctx, sx + Math.cos(a) * rr2, sy + Math.sin(a) * rr2, 26 + ph * 80, 22 + ph * 60, "236,230,216", 0.6 * steam * (1 - ph)); } });
// speed arcs (gold)
for (let i = 0; i < 2; i++) { const pts = []; for (let k = 0; k <= 14; k++) { const a = ang + i * Math.PI - dirS * (0.3 + k * 0.07); pts.push(sx + Math.cos(a) * (R + 120), sy + Math.sin(a) * (R + 120)); } brush(ctx, pts, 6, "#E6C677", 0.85, i + 3, 0.6); }
goldDust(ctx, 30, 200, 500, 680, 900, 41, 0.8, 30);
finish(ctx);
