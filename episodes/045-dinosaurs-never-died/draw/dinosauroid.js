// Dale Russell's 1982 "dinosauroid" thought experiment: a Troodon-like dinosaur beside the upright big-brained figure, gold halo and a brushed gold "?". Then it holds a glowing phone. p: ghost (0..1 Troodon), q (0..1 ?), phone (0..1), zoom, cx, cy
// ---- Ink & Gold helpers (copied from episode 038 and inlined into every draw file by the episode's build step) ----
const C8 = window.__c045 || (window.__c045 = {});
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
// ---- episode 045 silhouettes (flat ink cut-outs; facing right, origin = feet on ground, y up is negative) ----
function legStroke(g, hx, hy, yb, ph, w, len = 1) {
  // theropod leg: thigh forward, shin back, foot forward. ph swings the leg (walk cycle)
  const sw = Math.sin(ph), lift = Math.max(0, Math.cos(ph)) * 18 * len;
  const kx = hx + (28 + sw * 34) * len, ky = hy + 95 * len, ax = kx - (32 - sw * 30) * len, ay = yb - 34 * len - lift, tx = ax + 52 * len, ty = yb - lift * 0.4;
  g.lineCap = "round"; g.lineJoin = "round";
  g.lineWidth = w; g.beginPath(); g.moveTo(hx, hy); g.lineTo(kx, ky); g.stroke();
  g.lineWidth = w * 0.62; g.beginPath(); g.moveTo(kx, ky); g.lineTo(ax, ay); g.lineTo(tx, ty); g.stroke();
  g.lineWidth = w * 0.3; g.beginPath(); g.moveTo(ax, ay); g.lineTo(ax - 22 * len, ty + 2); g.stroke();
}
// T. rex. walk = phase speed multiplier (0 = standing). look: head tilt up (0..1). eye: gold eye 0..1
function trex(g, x, yb, s = 1, dir = 1, col = INK.ink, walk = 0, look = 0, eye = 1, ph = 0) {
  g.save(); g.translate(x, yb); g.scale(s * dir, s); g.fillStyle = col; g.strokeStyle = col;
  const P = t * 4 * walk + ph, bob = walk ? Math.abs(Math.sin(P)) * -6 : 0; g.translate(0, bob);
  legStroke(g, -30, -215, 0, P + Math.PI, 46); // far leg
  // body
  g.beginPath(); g.moveTo(-470, -228); g.quadraticCurveTo(-260, -262, -80, -300); g.quadraticCurveTo(40, -318, 118, -300);
  g.quadraticCurveTo(150, -296, 160, -310);
  g.lineTo(150, -230); g.quadraticCurveTo(70, -168, 0, -168); g.quadraticCurveTo(-90, -168, -150, -202); g.quadraticCurveTo(-290, -222, -470, -228); g.closePath(); g.fill();
  // head + neck (rotates up with look)
  g.save(); g.translate(150, -300); g.rotate(-0.55 * look);
  g.beginPath(); g.moveTo(-30, 10); g.quadraticCurveTo(-5, -40, 30, -52); g.lineTo(150, -50); g.quadraticCurveTo(178, -46, 176, -22); g.lineTo(172, -6);
  g.lineTo(110, 0); g.lineTo(166, 6); g.quadraticCurveTo(150, 24, 100, 28); g.quadraticCurveTo(40, 34, 10, 72); g.closePath(); g.fill();
  if (eye > 0) { g.fillStyle = `rgba(242,214,138,${eye})`; g.beginPath(); g.ellipse(88, -34, 7, 5, 0, 0, TAU); g.fill(); g.fillStyle = col; }
  g.restore();
  // tiny arm
  g.lineCap = "round"; g.lineWidth = 11; g.beginPath(); g.moveTo(120, -222); g.lineTo(150, -196); g.lineTo(172, -200); g.stroke();
  // thigh + near leg
  g.beginPath(); g.ellipse(-40, -232, 80, 66, -0.25, 0, TAU); g.fill();
  legStroke(g, -30, -215, 0, P, 50);
  g.restore();
}
// sauropod (long-neck). neck: 0..1 raise. walk speed.
function sauropod(g, x, yb, s = 1, dir = 1, col = INK.ink, walk = 0, neck = 0.6, ph = 0) {
  g.save(); g.translate(x, yb); g.scale(s * dir, s); g.fillStyle = col; g.strokeStyle = col;
  const P = t * 2.2 * walk + ph; g.lineCap = "round";
  const legs = [[150, 0], [-140, Math.PI], [110, Math.PI], [-180, 0]];
  legs.forEach(([lx, o], i) => { const sw = Math.sin(P + o) * 18 * (walk ? 1 : 0); g.lineWidth = i < 2 ? 62 : 70; g.globalAlpha = i < 2 ? 0.85 : 1;
    g.beginPath(); g.moveTo(lx, -250); g.lineTo(lx + sw * 0.4, -120); g.lineTo(lx + sw, -18); g.stroke(); g.fillRect(lx + sw - 38, -26, 76, 26); });
  g.globalAlpha = 1;
  // body
  g.beginPath(); g.ellipse(-10, -300, 250, 130, -0.08, 0, TAU); g.fill();
  // tail
  g.beginPath(); g.moveTo(-200, -360); g.quadraticCurveTo(-420, -330, -720, -140 + Math.sin(t * 1.5 + ph) * 12); g.quadraticCurveTo(-430, -260, -210, -240); g.closePath(); g.fill();
  // neck: from shoulder to head
  const hx = 300 + 140 * (1 - neck), hy = -540 - 300 * neck + Math.sin(t * 1.2 + ph) * 8;
  g.beginPath(); g.moveTo(140, -400); g.quadraticCurveTo(250, -440, hx - 10, hy - 8); g.lineTo(hx + 20, hy + 26); g.quadraticCurveTo(300, -360, 210, -220); g.closePath(); g.fill();
  g.beginPath(); g.ellipse(hx + 26, hy + 2, 44, 24, 0.25, 0, TAU); g.fill();
  g.restore();
}
// small Cretaceous mammal (shrew/opossum-like). eye = gold glint
function mammal(g, x, y, s = 1, dir = 1, col = INK.ink, eye = 1, sniff = 0) {
  g.save(); g.translate(x, y); g.scale(s * dir, s); g.fillStyle = col; g.strokeStyle = col; g.lineCap = "round";
  // tail
  g.lineWidth = 5; g.beginPath(); g.moveTo(-40, -18); g.quadraticCurveTo(-90, -10, -120, -40 + Math.sin(t * 3) * 6); g.stroke();
  // body
  g.beginPath(); g.ellipse(0, -26, 48, 26, -0.05, 0, TAU); g.fill();
  // head + snout
  const sn = Math.sin(t * 14) * 2 * sniff;
  g.beginPath(); g.moveTo(30, -48); g.quadraticCurveTo(62, -48, 88 + sn, -24); g.quadraticCurveTo(60, -10, 30, -12); g.closePath(); g.fill();
  g.beginPath(); g.arc(40, -50, 10, 0, TAU); g.fill();
  // legs
  g.lineWidth = 7; [[-28, 0], [-14, 0], [22, 0], [34, 0]].forEach(([lx], i) => { g.beginPath(); g.moveTo(lx, -14); g.lineTo(lx + (i % 2 ? 6 : -4), 0); g.stroke(); });
  // whiskers
  g.lineWidth = 1.2; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(80, -24); g.lineTo(104, -34 + i * 9); g.stroke(); }
  if (eye > 0) { g.fillStyle = `rgba(242,214,138,${eye})`; g.beginPath(); g.arc(58, -34, 3.6, 0, TAU); g.fill(); }
  g.restore();
}
// fern frond: curved stem with leaflets, drawn as tapered strokes (use in cached layers)
function frond(g, x, y, len, ang, curl, col, w = 6, seed = 1) {
  g.save(); g.strokeStyle = col; g.fillStyle = col; g.lineCap = "round";
  const pts = []; const n = 28; let a = ang, px = x, py = y; for (let i = 0; i <= n; i++) { pts.push([px, py, a]); const step = len / n; px += Math.cos(a) * step; py += Math.sin(a) * step; a += curl / n * (0.4 + i / n); }
  g.lineWidth = w; g.beginPath(); pts.forEach(([px2, py2], i) => i ? g.lineTo(px2, py2) : g.moveTo(px2, py2)); g.stroke();
  for (let i = 2; i < n; i++) { const [px2, py2, a2] = pts[i]; const ll = len * 0.2 * Math.sin(Math.PI * i / n) * (0.8 + 0.4 * rnd(seed + i));
    for (const sd of [-1, 1]) { const b = a2 + sd * 1.15; g.beginPath(); g.moveTo(px2, py2); g.quadraticCurveTo(px2 + Math.cos(b) * ll * 0.5 + Math.cos(a2) * ll * 0.15, py2 + Math.sin(b) * ll * 0.5 + Math.sin(a2) * ll * 0.15, px2 + Math.cos(b + sd * -0.25) * ll, py2 + Math.sin(b + sd * -0.25) * ll);
      g.quadraticCurveTo(px2 + Math.cos(b) * ll * 0.4, py2 + Math.sin(b) * ll * 0.4 + 4, px2, py2); g.fill(); } }
  g.restore();
}
// songbird / crow perched (facing right). y = perch point
function perchBird(g, x, y, s = 1, dir = 1, col = INK.ink, eye = 1, hop = 0) {
  g.save(); g.translate(x, y); g.scale(s * dir, s); g.fillStyle = col; g.strokeStyle = col; g.lineCap = "round";
  g.lineWidth = 5; g.beginPath(); g.moveTo(-6, -36); g.lineTo(-10, 0); g.moveTo(8, -36); g.lineTo(6, 0); g.stroke();
  g.translate(0, -hop);
  // tail
  g.beginPath(); g.moveTo(-40, -60); g.lineTo(-120, -10); g.lineTo(-100, 0); g.lineTo(-30, -44); g.closePath(); g.fill();
  // body
  g.beginPath(); g.ellipse(0, -66, 54, 36, -0.35, 0, TAU); g.fill();
  // head
  g.beginPath(); g.arc(46, -104, 26, 0, TAU); g.fill();
  // beak
  g.beginPath(); g.moveTo(64, -114); g.lineTo(108, -102); g.lineTo(66, -94); g.closePath(); g.fill();
  // wing edge
  g.strokeStyle = "rgba(242,214,138,0.55)"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-30, -90); g.quadraticCurveTo(10, -80, 30, -56); g.stroke();
  if (eye > 0) { g.fillStyle = `rgba(242,214,138,${eye})`; g.beginPath(); g.arc(52, -110, 4.5, 0, TAU); g.fill(); }
  g.restore();
}
// flying bird glyph (two-stroke V), flap phase
function flyBird(g, x, y, s, col = INK.ink, ph = 0) { const f = Math.sin(t * 7 + ph) * 0.6; g.save(); g.fillStyle = col; g.beginPath(); g.moveTo(x - 30 * s, y - 14 * s * f - 4 * s); g.quadraticCurveTo(x - 10 * s, y - 6 * s, x, y + 3 * s); g.quadraticCurveTo(x + 10 * s, y - 6 * s, x + 30 * s, y - 14 * s * f - 4 * s); g.quadraticCurveTo(x + 10 * s, y + 0 * s, x, y + 8 * s); g.quadraticCurveTo(x - 10 * s, y, x - 30 * s, y - 14 * s * f - 4 * s); g.fill(); g.restore(); }
// feathered raptor (dromaeosaur), facing right
function raptor(g, x, yb, s = 1, dir = 1, col = INK.ink, eye = 1) {
  g.save(); g.translate(x, yb); g.scale(s * dir, s); g.fillStyle = col; g.strokeStyle = col; g.lineCap = "round"; g.lineJoin = "round";
  legStroke(g, -10, -150, 0, Math.PI * 0.8, 26, 0.75);
  // stiff tail with feather fan
  g.beginPath(); g.moveTo(-40, -190); g.lineTo(-380, -205); g.lineTo(-420, -190); g.lineTo(-380, -178); g.lineTo(-40, -150); g.closePath(); g.fill();
  for (let i = 0; i < 6; i++) { const xx = -380 + i * 40; g.beginPath(); g.moveTo(xx, -200); g.lineTo(xx - 40, -232 + i * 3); g.lineTo(xx + 20, -200); g.fill(); }
  // body
  g.beginPath(); g.ellipse(10, -175, 80, 46, -0.15, 0, TAU); g.fill();
  // neck S-curve + head
  g.beginPath(); g.moveTo(50, -205); g.quadraticCurveTo(100, -230, 95, -275); g.quadraticCurveTo(100, -300, 130, -302); g.lineTo(196, -290); g.lineTo(200, -282); g.lineTo(140, -272);
  g.quadraticCurveTo(120, -250, 110, -190); g.closePath(); g.fill();
  // feathered arm/wing
  g.beginPath(); g.moveTo(60, -190); g.quadraticCurveTo(120, -170, 150, -120); for (let i = 0; i < 5; i++) { g.lineTo(140 - i * 22, -100 + i * 4); g.lineTo(130 - i * 22, -120 + i * 2); } g.lineTo(20, -150); g.closePath(); g.fill();
  // crest feathers
  for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(110 - i * 8, -300 + i * 8); g.lineTo(90 - i * 12, -322 + i * 6); g.lineTo(122 - i * 8, -298 + i * 8); g.fill(); }
  g.beginPath(); g.ellipse(-10, -170, 48, 40, -0.4, 0, TAU); g.fill();
  legStroke(g, -10, -150, 0, Math.PI * 0.2, 30, 0.8);
  if (eye > 0) { g.fillStyle = `rgba(242,214,138,${eye})`; g.beginPath(); g.arc(150, -290, 4.5, 0, TAU); g.fill(); }
  g.restore();
}
// Russell's dinosauroid (1982 thought experiment): upright, big cranium, big eyes, 3 fingers, no tail. facing right-ish 3/4.
function dinosauroid(g, x, yb, s = 1, dir = 1, col = INK.ink, eye = 1, arm = 0) {
  g.save(); g.translate(x, yb); g.scale(s * dir, s); g.fillStyle = col; g.strokeStyle = col; g.lineCap = "round"; g.lineJoin = "round";
  // legs (digitigrade)
  for (const sd of [-1, 1]) { g.lineWidth = 46; g.beginPath(); g.moveTo(sd * 40, -470); g.lineTo(sd * 48 + 14, -250); g.stroke(); g.lineWidth = 34; g.beginPath(); g.moveTo(sd * 48 + 14, -250); g.lineTo(sd * 44 - 6, -60); g.stroke();
    g.lineWidth = 22; g.beginPath(); g.moveTo(sd * 44 - 6, -60); g.lineTo(sd * 44 + 30, -6); g.stroke(); g.beginPath(); g.moveTo(sd * 44 - 6, -60); g.lineTo(sd * 44 - 30, -4); g.stroke(); }
  // torso
  g.beginPath(); g.moveTo(-74, -820); g.quadraticCurveTo(-96, -640, -70, -470); g.quadraticCurveTo(0, -430, 74, -470); g.quadraticCurveTo(96, -640, 74, -820); g.quadraticCurveTo(0, -850, -74, -820); g.fill();
  // neck
  g.fillRect(-26, -900, 52, 100);
  // head: large rounded cranium + short muzzle
  g.beginPath(); g.ellipse(4, -980, 92, 104, 0, 0, TAU); g.fill();
  g.beginPath(); g.moveTo(40, -960); g.quadraticCurveTo(120, -950, 112, -900); g.quadraticCurveTo(60, -880, 0, -900); g.closePath(); g.fill();
  if (eye > 0) { for (const ex of [-26, 46]) { g.fillStyle = `rgba(242,214,138,${eye})`; g.beginPath(); g.ellipse(ex, -990, 17, 12, 0, 0, TAU); g.fill(); g.fillStyle = col; g.fillRect(ex - 2.5, -1001, 5, 22); } }
  g.fillStyle = col; g.strokeStyle = col;
  // arms with 3 fingers. arm: 0 = hanging, 1 = raised holding something in front of chest
  for (const sd of [-1, 1]) { const raise = sd > 0 ? arm : arm * 0.8;
    const ex = sd * 100 + sd * 20 * (1 - raise), ey = lerp(-600, -660, raise), hx = lerp(sd * 108, sd * 30 + 40, raise), hy = lerp(-450, -720, raise);
    g.lineWidth = 30; g.beginPath(); g.moveTo(sd * 70, -800); g.lineTo(ex, ey); g.lineTo(hx, hy); g.stroke();
    g.lineWidth = 9; for (let f = -1; f <= 1; f++) { const fa = (raise > 0.5 ? -Math.PI / 2 : Math.PI / 2) + f * 0.35; g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx + Math.cos(fa) * 50, hy + Math.sin(fa) * 50); g.stroke(); } }
  g.restore();
}
// mini icons for the extinction grid (draw centred at x,y; size ~ 120)
function icon(g, k, x, y, s, col = INK.ink) {
  g.save(); g.translate(x, y); g.fillStyle = col; g.strokeStyle = col; g.lineCap = "round";
  if (k === 0) trex(g, 18 * s, 48 * s, 0.17 * s, 1, col, 0, 0, 0);
  else if (k === 1) sauropod(g, 18 * s, 50 * s, 0.11 * s, 1, col, 0, 0.6);
  else if (k === 2) { // triceratops
    g.scale(s, s); g.beginPath(); g.ellipse(-8, 6, 52, 30, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(26, -20); g.quadraticCurveTo(44, -50, 34, -52); g.quadraticCurveTo(62, -20, 66, 10); g.lineTo(40, 20); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(48, -6); g.lineTo(82, -26); g.lineTo(56, 4); g.fill(); g.beginPath(); g.moveTo(60, 8); g.lineTo(84, 14); g.lineTo(66, 22); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-58, 0); g.lineTo(-84, 14); g.lineTo(-56, 14); g.fill(); g.lineWidth = 13; for (const lx of [-36, -20, 14, 28]) { g.beginPath(); g.moveTo(lx, 20); g.lineTo(lx, 46); g.stroke(); } }
  else if (k === 3) raptor(g, 0, 46 * s, 0.24 * s, 1, col, 0);
  else if (k === 4) { // pterosaur
    g.scale(s, s); g.beginPath(); g.moveTo(-80, -6); g.quadraticCurveTo(-30, -26, 0, -6); g.quadraticCurveTo(30, -26, 80, -6); g.quadraticCurveTo(30, -2, 4, 12); g.lineTo(-4, 12); g.quadraticCurveTo(-30, -2, -80, -6); g.fill();
    g.beginPath(); g.moveTo(-4, -10); g.lineTo(42, -16); g.lineTo(-2, -2); g.fill(); g.beginPath(); g.moveTo(-2, -10); g.lineTo(-30, -26); g.lineTo(2, -6); g.fill(); }
  else if (k === 5) { // ammonite
    g.scale(s, s); g.lineWidth = 9; g.beginPath(); for (let i = 0; i <= 60; i++) { const a = i / 60 * TAU * 2.6, r = 4 + i * 0.75; i ? g.lineTo(Math.cos(a) * r, Math.sin(a) * r) : g.moveTo(Math.cos(a) * r, Math.sin(a) * r); } g.stroke();
    g.beginPath(); g.arc(0, 0, 50, 0, TAU); g.lineWidth = 5; g.stroke(); }
  else if (k === 6) mammal(g, -6 * s, 18 * s, 0.9 * s, 1, col, 0);
  else if (k === 7) perchBird(g, -4 * s, 50 * s, 0.75 * s, 1, col, 0);
  else if (k === 8) { // turtle
    g.scale(s, s); g.beginPath(); g.ellipse(0, 6, 56, 34, 0, Math.PI, 0); g.fill(); g.fillRect(-56, 4, 112, 8); g.beginPath(); g.ellipse(66, 2, 16, 11, 0, 0, TAU); g.fill(); g.lineWidth = 11; for (const lx of [-34, 34]) { g.beginPath(); g.moveTo(lx, 10); g.lineTo(lx + 4, 26); g.stroke(); } }
  else if (k === 9) { // crocodile
    g.scale(s, s); g.beginPath(); g.moveTo(-90, 8); g.quadraticCurveTo(-30, -14, 30, -8); g.lineTo(92, -2); g.lineTo(92, 6); g.lineTo(30, 10); g.quadraticCurveTo(-30, 18, -90, 8); g.fill(); g.lineWidth = 9; for (const lx of [-30, 20]) { g.beginPath(); g.moveTo(lx, 10); g.lineTo(lx - 8, 22); g.stroke(); } }
  g.restore();
}
// modern skyline (cached by caller). gold windows sparse.
function skylineInk(g, yb, seed, col, win = 0.15, hmin = 200, hmax = 760, x0 = -200, x1 = 1300) {
  let x = x0, i = 0; while (x < x1) { const w = 80 + rnd(seed + i * 1.7) * 130, h = hmin + rnd(seed * 3 + i * 2.3) * (hmax - hmin);
    g.fillStyle = col; g.fillRect(x, yb - h, w, h); if (rnd(i + seed) < 0.3) g.fillRect(x + w * 0.45, yb - h - 60, 6, 60); if (rnd(i * 2 + seed) < 0.25) { g.beginPath(); g.moveTo(x, yb - h); g.lineTo(x + w / 2, yb - h - 50); g.lineTo(x + w, yb - h); g.fill(); }
    if (win > 0) for (let r = 0; r < h / 34 - 1; r++) for (let c = 0; c < w / 26 - 1; c++) if (rnd(seed * 7 + i * 31 + r * 3.3 + c * 1.9) < win) { g.fillStyle = `rgba(242,214,138,${0.45 + 0.4 * rnd(r + c + i)})`; g.fillRect(x + 10 + c * 26, yb - h + 18 + r * 34, 9, 14); }
    x += w + 6 + rnd(i * 5 + seed) * 24; i++; }
}
frameIn(p);
const gh = p.ghost ?? 1, qk = p.q ?? 1, ph = p.phone ?? 0;
const bg = cached("droid_bg", W + 400, H + 400, (g) => { g.translate(200, 200); drawPaper(g);
  vwash(g, -200, H + 200, "30,29,27", 0.9, 0.85);
  blob(g, 560, 820, 560, 720, "120,115,106", 0.45);
  streak(g, 520, 1200, 1500, 60, "150,144,132", 0.35, 14);
  vwash(g, 1120, 1220, "16,15,14", 0, 0.4); vwash(g, 1220, H + 200, "16,15,14", 0.4, 1);
});
ctx.drawImage(bg, -200, -200);
// halo behind the head
goldDisc(ctx, 600, 560, 230 + 6 * Math.sin(t * 1.5), 1 - 0.6 * ph);
// Troodon on the left, smaller (what Russell started from)
if (gh > 0) { ctx.save(); ctx.globalAlpha = gh * (1 - 0.7 * ph); raptor(ctx, 200, 1260, 0.95, 1, "rgba(24,23,21,0.95)", 1); ctx.restore(); }
// the dinosauroid
const arm = E["ease-in-out"](cl(ph));
dinosauroid(ctx, 600, 1300, 0.86, 1, INK.ink, 1, arm);
// phone glow on its face
if (ph > 0) { const hx = 600 + (30 + 40) * 0.86, hy = 1300 - 760 * 0.86; ctx.save(); ctx.globalAlpha = arm;
  glow(ctx, hx, hy - 80, 360, 0.7); goldShape(ctx, (q) => { q.roundRect(hx - 34, hy - 40, 68, 120, 10); }, 40);
  ctx.fillStyle = "rgba(255,248,226,0.85)"; ctx.fillRect(hx - 24, hy - 28, 48, 90); ctx.restore(); }
// gold brushed "?"
if (qk > 0) { ctx.save(); ctx.globalAlpha = cl(qk * 2) * (1 - ph); const s = 0.8 + 0.2 * E["back"](cl(qk)); ctx.translate(900, 520); ctx.scale(s, s);
  ctx.font = "320px LSerif"; ctx.textAlign = "center"; ctx.fillStyle = goldPat(ctx); ctx.shadowColor = "rgba(242,214,138,0.8)"; ctx.shadowBlur = 30; ctx.fillText("?", 0, 110); ctx.restore(); }
// ground line
brush(ctx, [-60, 1302, 500, 1296, 1140, 1304], 8, INK.ink, 0.9, 2, 0.4);
goldDust(ctx, 26, 0, 300, W, 1000, 41, 0.7, 14);
seal(ctx, 990, 1830, 0.8, "Δ");
finish(ctx);
