// Elephant -> mammoth: an Asian elephant grows long hair, its ears shrink, a fat hump rises. Gold leader labels pop for each trait. p: hair, ear, m (hump/head/tusks), l1, l2, l3 (label alphas), zoom, cx, cy
// ---- Ink & Gold helpers (copied from episodes 038/045; inlined into every draw file by _build/build.sh) ----
const C8 = window.__c055 || (window.__c055 = {});
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
function circ2(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
// gold-leaf flame (flickering tongues)
function flame(g, x, yb, w, h, seed = 1, gl = 30) {
  goldShape(g, (q) => { for (let k = 0; k < 3; k++) { const ox = (k - 1) * w * 0.55, hh = h * (k === 1 ? 1 : 0.68) * (0.85 + 0.15 * Math.sin(t * 9 + seed + k * 2)), sw = Math.sin(t * 6 + seed * 3 + k) * w * 0.25;
    q.moveTo(x + ox - w * 0.5, yb); q.bezierCurveTo(x + ox - w * 0.6, yb - hh * 0.5, x + ox + sw - w * 0.1, yb - hh * 0.7, x + ox + sw, yb - hh); q.bezierCurveTo(x + ox + sw + w * 0.1, yb - hh * 0.6, x + ox + w * 0.6, yb - hh * 0.45, x + ox + w * 0.5, yb); q.closePath(); } }, gl);
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
// ---- episode 055 silhouettes (flat ink cut-outs; facing right, origin = feet on ground, y up is negative) ----
// tapered filled ribbon along a polyline (w0 -> w1), fill = colour or pattern
function ribbon(g, pts, w0, w1, fill) {
  const n = pts.length; if (n < 2) return; const L = [], R = [];
  for (let i = 0; i < n; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)]; const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; const w = lerp(w0, w1, i / (n - 1)) / 2;
    L.push([pts[i][0] - dy / l * w, pts[i][1] + dx / l * w]); R.push([pts[i][0] + dy / l * w, pts[i][1] - dx / l * w]); }
  g.fillStyle = fill; g.beginPath(); g.moveTo(L[0][0], L[0][1]); for (const q of L) g.lineTo(q[0], q[1]); for (let i = n - 1; i >= 0; i--) g.lineTo(R[i][0], R[i][1]); g.closePath(); g.fill();
  g.beginPath(); g.arc(pts[n - 1][0], pts[n - 1][1], w1 / 2, 0, TAU); g.fill();
}
function bez(x0, y0, x1, y1, x2, y2, x3, y3, n = 18) { const P = []; for (let i = 0; i <= n; i++) { const u = i / n, v = 1 - u; P.push([v * v * v * x0 + 3 * v * v * u * x1 + 3 * v * u * u * x2 + u * u * u * x3, v * v * v * y0 + 3 * v * v * u * y1 + 3 * v * u * u * y2 + u * u * u * y3]); } return P; }
function pw(arr, x) { if (x <= arr[0][0]) return arr[0][1]; for (let i = 1; i < arr.length; i++) if (x <= arr[i][0]) return lerp(arr[i - 1][1], arr[i][1], (x - arr[i - 1][0]) / (arr[i][0] - arr[i - 1][0])); return arr[arr.length - 1][1]; }
// Proboscidean: m = 0 Asian elephant ... 1 woolly mammoth (hump, domed head, small ears, long hair, big gold tusks).
// o: { m, walk, ph, eye, tusk (length mult), tr (trunk raise 0..1), hair (mult) }
function mammoth(g, x, yb, s = 1, dir = 1, col = INK.ink, o = {}) {
  const m = o.m ?? 1, walk = o.walk ?? 0, ph = o.ph ?? 0, tusk = o.tusk ?? 1, tr = o.tr ?? 0, hair = o.hair ?? m, me = o.ear ?? m, eye = o.eye ?? 1;
  g.save(); g.translate(x, yb); g.scale(s * dir, s); g.fillStyle = col; g.strokeStyle = col; g.lineCap = "round"; g.lineJoin = "round";
  const P = t * 2.6 * walk + ph, bob = walk ? -Math.abs(Math.sin(P)) * 6 : 0; g.translate(0, bob);
  const tl = lerp(0.35, 1, m) * tusk;
  // tusk path (gold leaf); far tusk slightly behind / higher
  const tuskPts = (dx, dy, k) => bez(318 + dx, -362 + dy, 330 + dx + 120 * k, -250 + dy + 40 * k, 330 + dx + 300 * k, -250 + dy - 30 * k, 330 + dx + 230 * k, -380 + dy - 120 * k * k, 22);
  if (tl > 0.05) { g.save(); g.globalAlpha = 0.75; ribbon(g, tuskPts(-26, -14, tl * 0.92), 20, 3, goldPat(g)); g.restore(); }
  // far legs
  const leg = (lx, o2, wdt, a) => { const sw = walk ? Math.sin(P + o2) : 0, lift = walk ? Math.max(0, Math.cos(P + o2)) * 16 : 0; g.globalAlpha = a; g.lineWidth = wdt;
    const fx = lx + sw * 34, fy = -lift; g.beginPath(); g.moveTo(lx, -300); g.quadraticCurveTo(lx + sw * 12, -150, fx, fy - 20); g.stroke(); g.fillRect(fx - wdt * 0.55, fy - 30, wdt * 1.1, 30); g.globalAlpha = 1;
    if (hair > 0.05) { g.lineWidth = 3.5; for (let i = 0; i < 6; i++) { const hx = lx - wdt * 0.5 + i * wdt / 5, hy = -250 + rnd(i + lx) * 40; g.beginPath(); g.moveTo(hx, hy); g.quadraticCurveTo(hx + sw * 6 - 4, hy + 40, hx - 6 + Math.sin(t * 3 + i) * 3, hy + (60 + rnd(i * 3 + lx) * 50) * hair); g.stroke(); } } };
  leg(70, Math.PI, 66, 0.82); leg(-235, 0, 70, 0.82);
  // body
  const back = [[-262, lerp(-365, -330, m)], [-140, lerp(-428, -392, m)], [0, lerp(-446, -452, m)], [100, lerp(-440, -508, m)], [180, lerp(-445, -492, m)], [250, lerp(-490, -575, m)]];
  g.beginPath(); g.moveTo(-250, -190);
  g.quadraticCurveTo(-318, -270, back[0][0], back[0][1]);
  g.bezierCurveTo(-200, back[1][1] + 10, -80, back[2][1], 0, back[2][1]);
  g.quadraticCurveTo(60, back[3][1] - 4, 100, back[3][1]);
  g.quadraticCurveTo(150, back[3][1] + 8, 180, back[4][1]);
  g.quadraticCurveTo(205, back[5][1] + 20, 255, back[5][1]);
  g.quadraticCurveTo(318, lerp(-480, -545, m), 342, lerp(-430, -470, m));
  g.quadraticCurveTo(360, -410, 352, -385);
  g.lineTo(300, -362); g.quadraticCurveTo(262, -322, 222, -292); g.quadraticCurveTo(170, -240, 120, -214); g.quadraticCurveTo(-60, -170, -250, -190); g.closePath(); g.fill();
  // tail
  g.lineWidth = lerp(10, 14, m); g.beginPath(); g.moveTo(-292, -300); g.quadraticCurveTo(-318 + Math.sin(t * 2 + ph) * 6, -260, -310 + Math.sin(t * 2 + ph) * 10, lerp(-170, -230, m)); g.stroke();
  // ear (outlined so it reads on the silhouette)
  const erx = lerp(70, 30, me), ery = lerp(96, 38, me), ey = lerp(-418, -455, m); g.beginPath(); g.ellipse(212, ey, erx, ery, 0.15, 0, TAU); g.fill();
  g.save(); g.strokeStyle = "rgba(207,200,185,0.28)"; g.lineWidth = 3; g.beginPath(); g.ellipse(212, ey, erx, ery, 0.15, -1.4, 2.0); g.stroke(); g.restore();
  // trunk: chain of discs along a curve (hanging -> raised)
  { let a = lerp(1.42, -0.55, tr), px = 346, py = -400; const n = 30, L = 340 * lerp(0.9, 1.0, m);
    for (let i = 0; i <= n; i++) { const u = i / n; g.beginPath(); g.arc(px, py, lerp(34, 11, u), 0, TAU); g.fill(); a += (lerp(-0.02, -0.06, tr) - (u > 0.75 ? lerp(0.13, 0.05, tr) : 0)) + Math.sin(t * 1.6 + ph) * 0.004; px += Math.cos(a) * L / n; py += Math.sin(a) * L / n; } }
  // hair: belly skirt, chest beard, shaggy back
  if (hair > 0.05) {
    const belly = [[-250, -192], [-60, -176], [120, -214], [222, -292], [300, -362]];
    g.lineWidth = 4;
    for (let i = 0; i < 58; i++) { const hx = -262 + i * 9.4, hy = pw(belly, hx) - 8, len = (50 + rnd(i * 2.3) * 80) * hair, sw = Math.sin(t * 2.2 + i * 0.7) * 5 + (walk ? Math.sin(P + i) * 4 : 0);
      g.beginPath(); g.moveTo(hx, hy); g.quadraticCurveTo(hx - 6, hy + len * 0.5, hx - 10 + sw, hy + len); g.stroke(); }
    g.lineWidth = 3.4;
    for (let i = 0; i < 46; i++) { const u = i / 45, bx = lerp(-262, 250, u), by = pw(back, bx); const len = (14 + rnd(i * 4.1) * 18) * hair;
      g.beginPath(); g.moveTo(bx + 6, by + 6); g.quadraticCurveTo(bx - 4, by - len * 0.6, bx - 14 + Math.sin(t * 2 + i) * 2, by - len * 0.5); g.stroke(); }
    // rump hair
    for (let i = 0; i < 10; i++) { const hy = -330 + i * 14; g.beginPath(); g.moveTo(-290 + i * 3, hy); g.quadraticCurveTo(-320, hy + 20, -326 - rnd(i) * 10, hy + 40 * hair); g.stroke(); }
  }
  // near legs
  leg(140, 0, 76, 1); leg(-170, Math.PI, 80, 1);
  // near tusk (gold leaf, glowing edge)
  if (tl > 0.05) { g.save(); g.shadowColor = "rgba(242,214,138,0.6)"; g.shadowBlur = 14; ribbon(g, tuskPts(0, 0, tl), 26, 4, goldPat(g)); g.restore(); }
  if (eye > 0) { g.fillStyle = `rgba(242,214,138,${eye})`; g.beginPath(); g.ellipse(282, lerp(-440, -478, m), 7, 5, 0, 0, TAU); g.fill(); }
  g.restore();
}
// person in a parka (facing right). arm: 0..1 raises the near arm toward the right
function person(g, x, yb, s = 1, dir = 1, col = INK.ink, arm = 0) {
  g.save(); g.translate(x, yb); g.scale(s * dir, s); g.fillStyle = col; g.strokeStyle = col; g.lineCap = "round";
  g.lineWidth = 26; g.beginPath(); g.moveTo(-14, -150); g.lineTo(-20, -10); g.stroke(); g.beginPath(); g.moveTo(14, -150); g.lineTo(22, -10); g.stroke();
  g.fillRect(-36, -18, 34, 18); g.fillRect(6, -18, 36, 18);
  g.beginPath(); g.moveTo(-42, -140); g.quadraticCurveTo(-50, -250, -30, -300); g.quadraticCurveTo(0, -318, 32, -300); g.quadraticCurveTo(52, -250, 44, -140); g.closePath(); g.fill();
  // hood
  g.beginPath(); g.arc(4, -336, 36, 0, TAU); g.fill();
  // far arm
  g.lineWidth = 22; g.beginPath(); g.moveTo(-26, -286); g.quadraticCurveTo(-46, -230, -40, -170); g.stroke();
  // near arm (raises)
  const ax = lerp(30, 120, arm), ay = lerp(-170, -330, arm); g.beginPath(); g.moveTo(26, -286); g.quadraticCurveTo(lerp(44, 90, arm), lerp(-230, -300, arm), ax, ay); g.stroke();
  g.restore();
}
// falling snow (screen-space flakes), a = alpha
function snow(g, n, seed = 1, a = 0.8, wind = 30, fall = 90) {
  for (let i = 0; i < n; i++) { const z = 0.4 + rnd(i * 1.7 + seed) * 0.6, x = ((rnd(i * 3.9 + seed) * (W + 200) + t * wind * z + Math.sin(t * 1.3 + i) * 14) % (W + 200) + W + 200) % (W + 200) - 100,
      y = ((rnd(i * 6.1 + seed) * (H + 100) + t * fall * z) % (H + 100)) - 50;
    g.fillStyle = `rgba(246,240,224,${a * z})`; g.beginPath(); g.arc(x, y, 1.5 + z * 3.2, 0, TAU); g.fill(); }
}
// brushed gold question mark
function goldQ(g, x, y, k, size = 330) { if (k <= 0) return; g.save(); g.globalAlpha = cl(k * 2); const sc = 0.8 + 0.2 * E["back"](cl(k)); g.translate(x, y); g.scale(sc, sc);
  g.font = `${size}px LSerif`; g.textAlign = "center"; g.fillStyle = goldPat(g); g.shadowColor = "rgba(242,214,138,0.8)"; g.shadowBlur = 30; g.fillText("?", 0, size / 3); g.restore(); }
// small serif label in scene space
function label(g, s, x, y, size = 34, col = "#F2D68A", align = "center", a = 1) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = `${size}px LSerif`; g.textAlign = align; g.textBaseline = "alphabetic";
  const dark = col === INK.ink; g.shadowColor = dark ? "rgba(246,240,224,0.9)" : "rgba(20,19,18,0.9)"; g.shadowBlur = 6; g.fillStyle = col; g.fillText(s, x, y); g.shadowBlur = 0; g.fillText(s, x, y); g.restore(); }
// snowy tundra ground band (cached by caller)
function tundra(g, y, seed, col = "236,231,218", a = 0.9) {
  g.fillStyle = `rgba(${col},${a})`; g.beginPath(); g.moveTo(-300, H + 300); g.lineTo(-300, y);
  for (let x = -300; x <= W + 300; x += 20) g.lineTo(x, y - 18 * Math.sin(x / 260 + seed) - 8 * Math.sin(x / 90 + seed * 2)); g.lineTo(W + 300, H + 300); g.closePath(); g.fill();
}
// steppe bison (facing right)
function bison(g, x, yb, s = 1, dir = 1, col = INK.ink, walk = 0, ph = 0) {
  g.save(); g.translate(x, yb); g.scale(s * dir, s); g.fillStyle = col; g.strokeStyle = col; g.lineCap = "round";
  const P = t * 3.2 * walk + ph;
  const leg = (lx, o, w) => { const sw = walk ? Math.sin(P + o) : 0, lift = walk ? Math.max(0, Math.cos(P + o)) * 10 : 0; g.lineWidth = w; g.beginPath(); g.moveTo(lx, -170); g.lineTo(lx + sw * 10, -80); g.lineTo(lx + sw * 22, -lift); g.stroke(); };
  leg(90, Math.PI, 24); leg(-150, 0, 26);
  g.beginPath(); g.moveTo(-200, -150); g.quadraticCurveTo(-232, -230, -190, -280); g.quadraticCurveTo(-80, -300, 20, -360); g.quadraticCurveTo(90, -412, 150, -370);
  g.quadraticCurveTo(210, -320, 236, -250); g.quadraticCurveTo(262, -190, 256, -150); g.lineTo(226, -142); g.quadraticCurveTo(200, -110, 170, -116); g.quadraticCurveTo(150, -150, 120, -140); g.quadraticCurveTo(-20, -120, -200, -150); g.closePath(); g.fill();
  g.lineWidth = 9; g.beginPath(); g.moveTo(206, -300); g.quadraticCurveTo(236, -330, 222, -350); g.stroke();
  g.lineWidth = 8; g.beginPath(); g.moveTo(-214, -250); g.quadraticCurveTo(-236, -200, -230, -150); g.stroke();
  leg(120, 0, 28); leg(-120, Math.PI, 30);
  g.restore();
}
// Yakutian horse (facing right)
function horse(g, x, yb, s = 1, dir = 1, col = INK.ink, walk = 0, ph = 0) {
  g.save(); g.translate(x, yb); g.scale(s * dir, s); g.fillStyle = col; g.strokeStyle = col; g.lineCap = "round";
  const P = t * 3.6 * walk + ph;
  const leg = (lx, o, w) => { const sw = walk ? Math.sin(P + o) : 0, lift = walk ? Math.max(0, Math.cos(P + o)) * 12 : 0; g.lineWidth = w; g.beginPath(); g.moveTo(lx, -190); g.lineTo(lx + sw * 12, -90); g.lineTo(lx + sw * 26, -lift); g.stroke(); };
  leg(95, Math.PI, 20); leg(-110, 0, 22);
  g.beginPath(); g.ellipse(0, -230, 150, 66, 0, 0, TAU); g.fill();
  g.beginPath(); g.moveTo(90, -280); g.quadraticCurveTo(150, -360, 190, -400); g.quadraticCurveTo(214, -410, 226, -392); g.lineTo(276, -320); g.quadraticCurveTo(282, -300, 260, -296); g.lineTo(210, -320); g.quadraticCurveTo(170, -270, 140, -200); g.closePath(); g.fill();
  g.lineWidth = 16; g.beginPath(); g.moveTo(-146, -250); g.quadraticCurveTo(-190, -200 + Math.sin(t * 2 + ph) * 6, -186, -130); g.stroke();
  leg(115, 0, 22); leg(-90, Math.PI, 24);
  g.restore();
}
frameIn(p);
const hair = p.hair ?? 0, ear = p.ear ?? 0, m = p.m ?? 0;
const bg = cached("mor_bg", W + 400, H + 400, (g) => { g.translate(200, 200); drawPaper(g);
  vwash(g, -200, 640, "26,25,23", 0.95, 0);
  blob(g, 560, 820, 700, 420, "246,240,224", 0.55);
  streak(g, 260, 380, 800, 80, "30,29,27", 0.35, 12);
  ridge(g, 1060, 70, 2.9, "130,125,115", 0.5, 8, 100, 1.1);
  vwash(g, 1100, 1180, "20,19,18", 0, 0.85); vwash(g, 1180, H + 200, "20,19,18", 0.85, 1);
  g.fillStyle = INK.ink; g.beginPath(); g.moveTo(-200, 1190); g.quadraticCurveTo(540, 1160, 1300, 1186); g.lineTo(1300, 1230); g.lineTo(-200, 1230); g.fill();
});
ctx.drawImage(bg, -200, -200);
goldDisc(ctx, 760, 700, 190, 1);
const X = 470, Y = 1180, S = 0.95;
glow(ctx, X + 100, 860, 420, 0.2);
mammoth(ctx, X, Y, S, 1, INK.ink, { m, hair, ear, walk: 0, eye: 1, tr: 0.08 * Math.sin(t * 1.3) + 0.05 });
// gold leader labels (scene space)
const lab = (a, ax, ay, lx, ly, txt1) => { if (a <= 0) return; const e = E["ease-out"](cl(a));
  ctx.save(); ctx.globalAlpha = cl(a * 1.5); ctx.strokeStyle = "#E9C877"; ctx.lineWidth = 3; ctx.shadowColor = "rgba(242,214,138,0.8)"; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(lerp(ax, lx, e), lerp(ay, ly, e)); ctx.stroke(); ctx.restore(); circ2(ctx, ax, ay, 7, "#F2D68A");
  label(ctx, txt1, lx, ly + (ly < ay ? -14 : 44), 44, INK.ink, "center", cl(a * 1.5 - 0.3)); };
lab(p.l1 ?? 0, X - 285 * S, Y - 290 * S, 190, 700, "SHAGGY FUR");
lab(p.l2 ?? 0, X + 212 * S, Y - 440 * S, 840, 560, "SMALL EARS");
lab(p.l3 ?? 0, X + 90 * S, Y - 500 * S, 430, 540, "EXTRA FAT");
goldDust(ctx, 20, 0, 420, W, 760, 31, 0.5, 12);
finish(ctx);
