// 052 "Grain Poster" kit — two-ink (coral + cobalt) risograph look on cream paper, halftone dot screens, misregistered type.
// Scope from engine: ctx, W, H, t, lt, p, E (+ engine/draw/flatlib.js: TAU, cl, lerp, rnd ...). Globals used: SPEC, buildCaptionWords.
// p.s scene: 0 hook/title (off-timeline, a=100) · 1 nothing to stand on · 2 plasma vs air · 3 fall · 4 gravity 28x · 5 two tonnes
//            6 5,500 C · 7 63 MW · 8 microwaves · 9 skin boils · 10 photon escape · 11 one second? · 12 end poster
// Captions (SPEC.pcaps), header, slow-mo clock (SPEC.clock) and title are drawn here, corrected for the engine's push-in zoom.
const FC = globalThis.__sun52 || (globalThis.__sun52 = {});
const K = {
  paper: "#EFE5D0", cream: "#F6EEDC", coral: "#E8553D", coralD: "#C63D2C", coralL: "#F2937A",
  cobalt: "#3049A3", cobaltD: "#22357D", cobaltL: "#7286C8", ink: "#2B1D20",
};
const MONO = "'Liberation Mono','DejaVu Sans Mono',monospace";
const g = ctx;
const S = p.s | 0;
const HOOKA = 100;
const HOOK = t >= HOOKA - 0.001;
const T = HOOK ? t - HOOKA : t; // story time (audio timeline)
const ME = (typeof SPEC !== "undefined") ? SPEC.scenes.find((s) => s.p && s.p.s === S && t >= s.a - 1e-6 && t < s.b) : null;
const D = ME ? ME.b - ME.a : 3;
const eout = (x) => 1 - Math.pow(1 - cl(x), 3);
const ein = (x) => Math.pow(cl(x), 3);
const eio = (x) => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const eback = (x) => { x = cl(x); const c = 1.8; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const k01 = (a, d) => cl((lt - a) / d);
function vn(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi; const h = (a, b) => rnd(a * 57.13 + b * 131.71);
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return lerp(lerp(h(xi, yi), h(xi + 1, yi), u), lerp(h(xi, yi + 1), h(xi + 1, yi + 1), u), v);
}

// ---------------- print helpers ----------------
function paperTex() {
  if (FC.paper) return FC.paper;
  const c = document.createElement("canvas"); c.width = W; c.height = H; const q = c.getContext("2d");
  const id = q.createImageData(W, H), d = id.data; let s = 7; const R = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < d.length; i += 4) { const n = 255 - R() * 24 - (R() < 0.003 ? 60 : 0); d[i] = n; d[i + 1] = n; d[i + 2] = n * 0.985; d[i + 3] = 255; }
  q.putImageData(id, 0, 0);
  for (let i = 0; i < 70; i++) { const x = R() * W, y = R() * H, r = 40 + R() * 160; const rg = q.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, `rgba(${R() < 0.5 ? "120,100,80" : "255,255,255"},${0.015 + R() * 0.025})`); rg.addColorStop(1, "rgba(0,0,0,0)"); q.fillStyle = rg; q.fillRect(x - r, y - r, 2 * r, 2 * r); }
  return (FC.paper = c);
}
function printOver(a = 0.75) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "multiply"; g.globalAlpha = a; g.drawImage(paperTex(), 0, 0); g.restore(); }
function dotField(x0, y0, x1, y1, step, f, col) {
  g.fillStyle = col; g.beginPath();
  for (let y = Math.floor(y0 / step) * step; y <= y1; y += step) {
    const off = (Math.round(y / step) & 1) ? step / 2 : 0;
    for (let x = Math.floor(x0 / step) * step + off; x <= x1; x += step) { const r = f(x, y); if (r > 0.4) { g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); } }
  }
  g.fill();
}
// dot halo ring around (cx,cy): dots shrink from rIn to rOut
function halo(cx, cy, rIn, rOut, col, step = 14, maxR = 6.2, k = 1) {
  dotField(cx - rOut, cy - rOut, cx + rOut, cy + rOut, step, (x, y) => { const d = Math.hypot(x - cx, y - cy); if (d < rIn || d > rOut) return 0; return maxR * k * Math.pow(1 - (d - rIn) / (rOut - rIn), 1.5); }, col);
}
function cond(s, x, y, size, col, align = "center", sx = 0.84, font = "LHeavy") {
  g.save(); g.font = `${size}px ${font}`; g.textAlign = align; g.textBaseline = "alphabetic"; g.translate(x, y); g.scale(sx, 1); g.fillStyle = col; g.fillText(s, 0, 0); g.restore();
}
function condW(s, size, sx = 0.84, font = "LHeavy") { g.save(); g.font = `${size}px ${font}`; const w = g.measureText(s).width * sx; g.restore(); return w; }
// misregistered headline: coral copy up-left, cobalt copy down-right, key ink on top
function reg(s, x, y, size, o = {}) {
  const off = o.off ?? Math.max(3, size * 0.025), al = o.align || "center", sx = o.sx ?? 0.84, a = o.a ?? 1, sc = o.sc ?? 1;
  if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(sc, sc);
  g.save(); g.globalCompositeOperation = "multiply"; cond(s, -off, -off * 0.45, size, K.coral, al, sx); cond(s, off, off * 0.55, size, K.cobalt, al, sx); g.restore();
  cond(s, 0, 0, size, o.col || K.ink, al, sx);
  g.restore();
}
function mono(s, x, y, size, col, align = "left", a = 1, sp = 2) {
  if (a <= 0) return; g.save(); g.globalAlpha *= a; g.font = `700 ${size}px ${MONO}`; g.letterSpacing = sp + "px"; g.textAlign = align; g.textBaseline = "alphabetic"; g.fillStyle = col; g.fillText(s, x, y); g.restore();
}
function serifNote(s, x, y, size, col, a = 1, align = "left") {
  if (a <= 0) return; g.save(); g.globalAlpha *= a; g.font = `italic ${size}px LSerif`; g.textAlign = align; g.textBaseline = "alphabetic"; g.fillStyle = col; g.fillText(s, x, y);
  const w = g.measureText(s).width, x0 = align === "left" ? x : align === "right" ? x - w : x - w / 2;
  g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, y + 16); g.lineTo(x0 + w * cl(a * 1.3), y + 16); g.stroke();
  if (a > 0.7) { g.beginPath(); const xe = x0 + w; g.moveTo(xe - 12, y + 6); g.lineTo(xe + 2, y + 16); g.lineTo(xe - 12, y + 26); g.stroke(); }
  g.restore();
}
function regMark(x, y, col) {
  g.save(); g.strokeStyle = col; g.lineWidth = 2.5; g.beginPath(); g.arc(x, y, 12, 0, TAU); g.stroke();
  g.beginPath(); g.moveTo(x - 19, y); g.lineTo(x + 19, y); g.moveTo(x, y - 19); g.lineTo(x, y + 19); g.stroke();
  g.fillStyle = col; g.beginPath(); g.moveTo(x, y); g.arc(x, y, 12, -Math.PI / 2, 0); g.closePath(); g.fill(); g.restore();
}
function stamp(s, x, y, size, col, a = 1, rot = -0.06) {
  if (a <= 0) return; g.save(); g.globalAlpha *= cl(a * 1.5); g.translate(x, y); g.rotate(rot); const sc = 1.25 - 0.25 * eout(a); g.scale(sc, sc);
  g.font = `700 ${size}px ${MONO}`; g.letterSpacing = "3px"; const w = g.measureText(s).width + size * 1.1, h = size * 1.7;
  g.strokeStyle = col; g.lineWidth = 4; g.strokeRect(-w / 2, -h / 2, w, h); g.lineWidth = 1.5; g.strokeRect(-w / 2 + 7, -h / 2 + 7, w - 14, h - 14);
  g.fillStyle = col; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, 0, 3); g.restore();
}

// ---------------- sun pieces ----------------
function limbY(x, y0, R) { const dx = x - 540; return y0 + dx * dx / (2 * R); }
function surface(y0, o = {}) {
  const R = o.R || 2600, wav = o.wav ?? 1, glow = o.glow ?? 1, x0 = o.x0 ?? -80, x1 = o.x1 ?? W + 80, yb = o.yb ?? H + 80;
  if (glow > 0) dotField(x0, y0 - 470, x1, y0 + 260, 13, (x, y) => { const d = limbY(x, y0, R) - y; if (d < -10 || d > 470) return 0; const u = 1 - Math.max(0, d) / 470;
    return 6.4 * glow * Math.pow(u, 1.7) * (0.7 + 0.3 * vn(x / 80 + t * 0.7, y / 80)); }, K.coral);
  const edge = (x) => limbY(x, y0, R) + (Math.sin(x * 0.021 + t * 3.1) * 7 + Math.sin(x * 0.053 - t * 2.3) * 4) * wav;
  // flame tongues
  g.fillStyle = K.coral;
  for (let i = 0; i < 40; i++) { const x = x0 + (i + 0.5) * (x1 - x0) / 40 + Math.sin(i * 3.7) * 8; const h = (16 + 46 * vn(i * 1.7, t * 2.2)) * wav; const w2 = 14 + 10 * rnd(i);
    const ey = edge(x); g.beginPath(); g.moveTo(x - w2, ey + 4); g.quadraticCurveTo(x - w2 * 0.2, ey - h * 0.6, x + Math.sin(t * 4 + i) * 6, ey - h); g.quadraticCurveTo(x + w2 * 0.3, ey - h * 0.4, x + w2, ey + 4); g.fill(); }
  g.beginPath(); g.moveTo(x0, yb); for (let x = x0; x <= x1; x += 18) g.lineTo(x, edge(x)); g.lineTo(x1, yb); g.closePath(); g.fill();
  // granulation (deep coral dot cells) + cobalt overprint deeper down
  dotField(x0, y0 - 30, x1, yb, 15, (x, y) => { const ly = edge(x); if (y < ly + 10) return 0; const n = vn(x / 62 + t * 0.3, y / 48 - t * 0.25); return n > 0.48 ? (n - 0.48) * 2 * (6 + 3 * cl((y - ly) / 600)) : 0; }, K.coralD);
  if (o.deep !== 0) { g.save(); g.globalCompositeOperation = "multiply"; dotField(x0, y0 + 120, x1, yb, 18, (x, y) => { const ly = edge(x); const dd = (y - ly - 160) / 900; if (dd <= 0) return 0; return 6.5 * cl(dd) * (0.6 + 0.4 * vn(x / 90, y / 90 + t * 0.2)); }, K.cobalt); g.restore(); }
  return edge;
}
function prominence(cx, cy, w, h, k, th = 26) {
  if (k <= 0) return; g.save(); g.strokeStyle = K.coral; g.lineCap = "round"; g.lineWidth = th;
  g.beginPath(); const n = 40; for (let i = 0; i <= n * k; i++) { const u = i / n; const a = Math.PI * u; const x = cx - w / 2 * Math.cos(a) + Math.sin(u * 9 + t * 2) * 6, y = cy - h * Math.sin(a) + Math.sin(u * 13 - t * 3) * 5; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  g.lineWidth = th * 0.35; g.strokeStyle = K.coralD; g.stroke(); g.restore();
}
function sunDisk(cx, cy, r, o = {}) {
  halo(cx, cy, r * 0.98, r * (o.haloK || 1.55), K.coral, 15, 6.5, o.hk ?? 1);
  g.fillStyle = K.coral; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill();
  g.save(); g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.clip();
  dotField(cx - r, cy - r, cx + r, cy + r, 15, (x, y) => { const d = Math.hypot(x - cx, y - cy) / r; const n = vn(x / 55 + t * 0.3, y / 55 - t * 0.2); return (n > 0.5 ? (n - 0.5) * 9 : 0) + 6.5 * Math.pow(cl((d - 0.72) / 0.28), 2); }, K.coralD);
  g.restore();
}

// ---------------- figure (cobalt cut-out person, printed twice) ----------------
function person(x, y, s = 1, o = {}) {
  const rot = o.rot || 0, st = o.stride || 0, aL = o.armL ?? -0.14, aR = o.armR ?? 0.14, sq = o.sq ?? 1;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s * (1 + (1 - sq) * 0.8), s * sq); g.globalAlpha *= o.a ?? 1;
  const drawP = (body, leg, head, dx, dy) => {
    g.save(); g.translate(dx, dy); g.lineCap = "round";
    g.strokeStyle = leg; g.lineWidth = 42;
    for (const [hx, a] of [[-19, st], [19, -st]]) { g.beginPath(); g.moveTo(hx, -205); g.lineTo(hx + Math.sin(a) * 190, -205 + Math.cos(a) * 190); g.stroke(); }
    g.fillStyle = body; g.beginPath(); g.roundRect(-52, -352, 104, 175, 36); g.fill();
    g.strokeStyle = body; g.lineWidth = 32;
    for (const [sx, a] of [[-44, aL], [44, aR]]) { g.beginPath(); g.moveTo(sx, -322); g.lineTo(sx + Math.sin(a) * 168, -322 + Math.cos(a) * 168); g.stroke(); }
    g.fillStyle = head; g.fillRect(-14, -372, 28, 30); g.beginPath(); g.arc(0, -405, 44, 0, TAU); g.fill();
    g.restore();
  };
  if (!o.noPrint) { g.save(); g.globalCompositeOperation = "multiply"; drawP(K.coral, K.coral, K.coral, 8, 5); g.restore(); }
  drawP(o.col || K.cobalt, o.leg || K.cobaltD, o.head || K.ink, 0, 0);
  g.restore();
}
// cached dot-sample of the figure for the dissolve shot
function figDots() {
  if (FC.fig) return FC.fig;
  const c = document.createElement("canvas"); c.width = 360; c.height = 520; const q = c.getContext("2d");
  q.translate(180, 500); q.lineCap = "round"; q.strokeStyle = "#000"; q.fillStyle = "#000";
  q.lineWidth = 42; for (const hx of [-19, 19]) { q.beginPath(); q.moveTo(hx, -205); q.lineTo(hx, -15); q.stroke(); }
  q.beginPath(); q.roundRect(-52, -352, 104, 175, 36); q.fill(); q.lineWidth = 32;
  for (const [sx, a] of [[-44, -0.14], [44, 0.14]]) { q.beginPath(); q.moveTo(sx, -322); q.lineTo(sx + Math.sin(a) * 168, -322 + Math.cos(a) * 168); q.stroke(); }
  q.fillRect(-14, -372, 28, 30); q.beginPath(); q.arc(0, -405, 44, 0, TAU); q.fill();
  const d = q.getImageData(0, 0, 360, 520).data, pts = [];
  for (let y = 0; y < 520; y += 9) for (let x = (y / 9) & 1 ? 4 : 0; x < 360; x += 9) if (d[(y * 360 + x) * 4 + 3] > 128) pts.push([x - 180, y - 500, rnd(x * 0.37 + y * 1.13)]);
  return (FC.fig = pts);
}

// ---------------- props ----------------
function microwave() {
  if (FC.mw) return FC.mw;
  const c = document.createElement("canvas"); c.width = 132; c.height = 88; const q = c.getContext("2d");
  q.fillStyle = K.cobalt; q.beginPath(); q.roundRect(4, 4, 124, 78, 10); q.fill();
  q.fillStyle = K.coral; q.beginPath(); q.roundRect(14, 14, 78, 58, 6); q.fill();
  q.fillStyle = K.coralD; for (let y = 20; y < 70; y += 8) for (let x = 20 + ((y / 8) & 1) * 4; x < 90; x += 8) { q.beginPath(); q.arc(x, y, 2.2, 0, TAU); q.fill(); }
  q.fillStyle = K.cream; q.fillRect(100, 16, 20, 10); q.fillStyle = K.ink; for (let i = 0; i < 3; i++) { q.beginPath(); q.arc(110, 40 + i * 13, 4, 0, TAU); q.fill(); }
  return (FC.mw = c);
}
function suv(x, y, s = 1) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.save(); g.globalCompositeOperation = "multiply"; g.translate(7, 5); suvShape(K.coral, K.coral); g.restore(); suvShape(K.cobalt, K.ink); g.restore();
}
function suvShape(body, wheel) {
  g.fillStyle = body; g.beginPath(); g.moveTo(-170, -40); g.lineTo(-165, -95); g.lineTo(-120, -100); g.lineTo(-80, -160); g.lineTo(90, -160); g.lineTo(130, -100); g.lineTo(170, -92); g.lineTo(175, -40); g.closePath(); g.fill();
  g.fillStyle = K.cream; g.fillRect(-68, -146, 70, 40); g.fillRect(14, -146, 66, 40);
  g.fillStyle = wheel; for (const wx of [-100, 105]) { g.beginPath(); g.arc(wx, -38, 38, 0, TAU); g.fill(); }
  g.fillStyle = K.cream; for (const wx of [-100, 105]) { g.beginPath(); g.arc(wx, -38, 12, 0, TAU); g.fill(); }
}
function bigNum(s, y, size, k, o = {}) { if (k <= 0) return; reg(s, o.x ?? W / 2, y, size, { sc: 0.7 + 0.3 * eback(k), a: cl(k * 3), align: o.align, off: o.off }); }

// ================= SCENES =================
g.fillStyle = K.paper; g.fillRect(0, 0, W, H);
g.save();
const shake = (amp) => { if (amp > 0) g.translate((rnd(Math.floor(t * 30)) - 0.5) * amp, (rnd(Math.floor(t * 30) + 7) - 0.5) * amp); };

if (S === 0) { // HOOK / title: falling head-first into the Sun
  shake(10 * cl(T / 2));
  const y0 = 1240 - 60 * eout(T / 2.6);
  prominence(250, y0 + 30, 300, 340 + 60 * Math.sin(t * 1.3), 0.35 + 0.65 * eout(T / 1.2), 30);
  prominence(860, y0 + 40, 220, 230, 0.2 + 0.8 * eout((T - 0.3) / 1.2), 22);
  surface(y0, { R: 2200, wav: 1.3, glow: 1.15 });
  const fy = 960 + 260 * Math.pow(cl(T / 3.2), 1.4), fx = 560 + Math.sin(T * 2) * 20;
  // vapour trail (above the feet, the figure falls head-first)
  const fa = fy - 300;
  dotField(fx - 150, fa - 380, fx + 150, fa + 60, 12, (x, y) => { const dy = fa + 40 - y; if (dy < 0) return 0; const w = 60 + dy * 0.2; const dx = Math.abs(x - fx - Math.sin(y * 0.02 + t * 4) * 18); if (dx > w) return 0;
    return 5.5 * (1 - dx / w) * Math.max(0, 1 - dy / 380) * (0.6 + 0.4 * vn(x / 30, y / 30 - t * 3)); }, K.coral);
  person(fx, fa, 0.62, { rot: Math.PI + 0.25 + Math.sin(T * 1.7) * 0.12, armL: -2.75, armR: 2.75, stride: 0.25 + Math.sin(T * 5) * 0.12 });
}
else if (S === 1) { // nothing to stand on: the step sinks
  const y0 = 1180; const tS = p.tSink ?? 1.2; const sink = eio((lt - tS) / 0.9);
  surface(y0, { R: 3200, wav: 1 + sink * 1.2, glow: 0.9 });
  const fx = 470 + 90 * eout(lt / tS), walk = lt < tS ? Math.sin(lt * 7) * 0.32 : 0.32 * (1 - sink);
  // the ground "gives": figure sinks into the plasma, ripples
  g.save(); g.beginPath(); g.rect(-100, -200, W + 200, limbY(fx, y0, 3200) + 70 + 200); g.clip();
  person(fx, limbY(fx, y0, 3200) + 8 + 330 * sink, 0.78, { stride: walk, armL: -0.2 - 1.2 * sink, armR: 0.2 + 1.3 * sink });
  g.restore();
  if (sink > 0) { g.strokeStyle = K.coralD; g.lineWidth = 6; for (let i = 0; i < 3; i++) { const r = ((lt - tS) * 260 + i * 90) % 300; g.globalAlpha = cl(1 - r / 300); g.beginPath(); g.ellipse(fx, limbY(fx, y0, 3200) + 12, r * 1.3, r * 0.22, 0, 0, TAU); g.stroke(); } g.globalAlpha = 1; }
  serifNote("Problem one:", 110, 330, 92, K.cobalt, eout(lt / 0.5));
  stamp("NO SOLID GROUND", 540, 520, 46, K.coral, eout((lt - tS + 0.2) / 0.35), -0.05);
}
else if (S === 2) { // plasma vs air jars
  const jw = 330, jt = 600, jb = 1230, xs = [300, 780];
  bigNum("1/6,000", 430, 190, k01(p.tBig ?? 1.2, 0.35));
  mono("DENSITY OF AIR AT SEA LEVEL", W / 2, 500, 28, K.cobalt, "center", cl((lt - (p.tBig ?? 1.2) - 0.15) / 0.3));
  xs.forEach((cx, j) => {
    const a = eout((lt - j * 0.35) / 0.4); if (a <= 0) return;
    g.save(); g.globalAlpha = a;
    g.save(); g.beginPath(); g.roundRect(cx - jw / 2, jt, jw, jb - jt, 40); g.clip();
    if (j === 0) { g.fillStyle = "rgba(48,73,163,0.10)"; g.fillRect(cx - jw / 2, jt, jw, jb - jt); g.fillStyle = K.cobalt; g.beginPath();
      for (let i = 0; i < 520; i++) { const x = cx - jw / 2 + 14 + ((rnd(i * 1.3) * (jw - 28) + Math.sin(t * 9 + i) * 6) % (jw - 28)), y = jt + 14 + rnd(i * 2.9) * (jb - jt - 28) + Math.cos(t * 8 + i * 1.7) * 6; g.moveTo(x + 6, y); g.arc(x, y, 6, 0, TAU); } g.fill(); }
    else { halo(cx, (jt + jb) / 2, 0, 420, K.coral, 16, 3.2, 0.5); g.fillStyle = K.coral; g.beginPath();
      for (let i = 0; i < 7; i++) { const x = cx + (rnd(i * 4.1) - 0.5) * (jw - 80) + Math.sin(t * 2 + i) * 30, y = jt + 60 + rnd(i * 7.3) * (jb - jt - 120) + Math.cos(t * 1.7 + i) * 30; g.moveTo(x + 11, y); g.arc(x, y, 11, 0, TAU); } g.fill(); }
    g.restore();
    g.strokeStyle = K.ink; g.lineWidth = 7; g.beginPath(); g.roundRect(cx - jw / 2, jt, jw, jb - jt, 40); g.stroke();
    g.fillStyle = K.ink; g.fillRect(cx - jw / 2 - 12, jt - 22, jw + 24, 26);
    mono(j ? "SUN'S SURFACE" : "AIR", cx, jb + 62, 34, j ? K.coral : K.cobalt, "center");
    if (j) serifNote("plasma", cx - 95, jt + 120, 64, K.ink, cl((lt - 0.9) / 0.4));
    g.restore();
  });
}
else if (S === 3) { // free fall into the Sun
  const k = cl(lt / Math.max(0.6, D));
  g.fillStyle = K.coral; g.globalAlpha = 0.25 + 0.5 * k; g.fillRect(0, 0, W, H); g.globalAlpha = 1;
  dotField(0, 0, W, H, 16, (x, y) => { const yy = y + t * 1400; const n = vn(x / 60, yy / 70); return n > 0.45 ? (n - 0.45) * 13 : 0; }, K.coralD);
  g.strokeStyle = K.cobalt; g.lineCap = "round";
  for (let i = 0; i < 26; i++) { const x = rnd(i * 3.3) * W, L = 120 + rnd(i) * 260, y = ((rnd(i * 7.1) * (H + 600) - t * 2600) % (H + 600) + H + 600) % (H + 600) - 300; g.lineWidth = 6 + rnd(i * 2) * 8; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + L); g.stroke(); }
  person(540 + Math.sin(t * 3) * 25, 760, 0.85, { rot: Math.PI + Math.sin(t * 2.4) * 0.25, armL: -2.6 + Math.sin(t * 9) * 0.3, armR: 2.6 - Math.sin(t * 9) * 0.3, stride: 0.35 + Math.sin(t * 7) * 0.2 });
  stamp("FREE FALL", 540, 1180, 56, K.ink, eout(lt / 0.3), 0.04);
}
else if (S === 4) { // gravity 28x
  const k = eout((lt - 0.15) / 1.0), n = Math.max(1, Math.round(1 + 27 * k));
  surface(1230, { R: 4000, wav: 0.6, glow: 0.7 });
  // pressing chevrons
  g.fillStyle = K.cobalt; for (let i = 0; i < 4; i++) { const yy = 560 + ((lt * 380 + i * 110) % 440); g.globalAlpha = 0.85 * cl(k * 2) * (1 - ((lt * 380 + i * 110) % 440) / 440);
    for (const cx of [300, 780]) { g.beginPath(); g.moveTo(cx - 70, yy); g.lineTo(cx, yy + 50); g.lineTo(cx + 70, yy); g.lineTo(cx + 70, yy + 26); g.lineTo(cx, yy + 76); g.lineTo(cx - 70, yy + 26); g.closePath(); g.fill(); } }
  g.globalAlpha = 1;
  person(540, limbY(540, 1230, 4000) + 6, 0.8, { sq: 1 - 0.3 * k, armL: -0.5 * k - 0.14, armR: 0.5 * k + 0.14, stride: 0.2 * k });
  bigNum(n + "×", 470, 300, k01(0, 0.25));
  mono("EARTH'S GRAVITY", W / 2, 540, 30, K.cobalt, "center", cl((lt - 0.4) / 0.3));
}
else if (S === 5) { // two tonnes: seesaw vs an SUV
  const k = eout((lt - 0.1) / 1.1); const kg = Math.round(80 + 2150 * k);
  bigNum(kg.toLocaleString("en-US") + " KG", 450, 190, k01(0, 0.25));
  mono("YOU (80 KG) × 28", W / 2, 520, 30, K.cobalt, "center", cl((lt - 0.2) / 0.3));
  const ang = 0.2 * (1 - k) + Math.sin(t * 2) * 0.01 * k; // tilts from car-down to level
  g.save(); g.translate(540, 1100);
  g.fillStyle = K.ink; g.beginPath(); g.moveTo(0, 0); g.lineTo(-70, 120); g.lineTo(70, 120); g.closePath(); g.fill();
  g.rotate(ang); g.fillStyle = K.cobaltD; g.fillRect(-460, -18, 920, 22);
  person(-300, -18, 0.55, {}); suv(260, -18, 1.05);
  g.restore();
  surface(1260, { R: 5000, wav: 0.5, glow: 0.5 });
  if (lt > (p.tCar ?? 1.3)) mono("= A BIG SUV", 760, 840, 30, K.coral, "center", cl((lt - (p.tCar ?? 1.3)) / 0.3));
}
else if (S === 6) { // 5,500 C thermometer
  const k = eout((lt - 0.1) / 1.4); const temp = Math.round(20 + 5480 * k);
  const tx = 300, top = 640, bot = 1190; const lvl = bot - (bot - top) * k;
  halo(tx, top - 10, 30, 260, K.coral, 14, 6, cl((k - 0.85) / 0.15));
  g.fillStyle = K.cream; g.beginPath(); g.roundRect(tx - 46, top - 40, 92, bot - top + 60, 46); g.fill();
  g.fillStyle = K.coral; g.beginPath(); g.roundRect(tx - 26, lvl, 52, bot - lvl + 20, 26); g.fill();
  g.beginPath(); g.arc(tx, bot + 60, 76, 0, TAU); g.fill();
  g.strokeStyle = K.ink; g.lineWidth = 8; g.beginPath(); g.roundRect(tx - 46, top - 40, 92, bot - top + 60, 46); g.stroke(); g.beginPath(); g.arc(tx, bot + 60, 84, 0, TAU); g.stroke();
  const marks = [[100, "WATER BOILS · 100 °C"], [1200, "LAVA · UP TO 1,200 °C"], [5500, "SUN'S SURFACE"]];
  marks.forEach(([v, s], i) => { const y = bot - (bot - top) * (v - 20) / 5480; const a = cl((k * 5480 + 20 - v + 300) / 300); g.globalAlpha = a; g.fillStyle = K.ink; g.fillRect(tx + 50, y - 3, 60, 6); g.font = `700 30px ${MONO}`; g.letterSpacing = "2px"; g.fillStyle = K.cream; g.fillRect(tx + 115, y - 22, g.measureText(s).width + 20, 44); g.letterSpacing = "0px"; mono(s, tx + 125, y + 11, 30, i === 2 ? K.coral : K.cobalt, "left"); g.globalAlpha = 1; });
  bigNum(temp.toLocaleString("en-US") + " °C", 470, 180, k01(0, 0.25));
}
else if (S === 7) { // 63 MW per square metre
  const k = eout(lt / 0.8);
  halo(540, 940, 120, 560, K.coral, 15, 6.4, 0.6 + 0.4 * Math.sin(t * 6) ** 2);
  // incoming radiation wedges
  g.fillStyle = K.coral; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + 0.1; const ph = (lt * 1.6 + rnd(i)) % 1; const r = 560 - 330 * ph;
    g.save(); g.translate(540 + Math.cos(a) * r, 940 + Math.sin(a) * r); g.rotate(a + Math.PI); g.globalAlpha = cl(k * 2) * (0.3 + 0.7 * ph);
    g.beginPath(); g.moveTo(0, -14); g.lineTo(70, 0); g.lineTo(0, 14); g.closePath(); g.fill(); g.restore(); }
  g.globalAlpha = 1;
  person(540, 1180, 1.0, { armL: -0.35, armR: 0.35, stride: 0.12 });
  // 1 m2 frame on the torso
  const fa = cl((lt - 0.35) / 0.3); if (fa > 0) { g.save(); g.globalAlpha = fa; g.strokeStyle = K.ink; g.lineWidth = 6; g.setLineDash([22, 14]); g.lineDashOffset = -t * 40; g.strokeRect(540 - 120, 790, 240, 240); g.setLineDash([]);
    g.fillStyle = K.cream; g.fillRect(540 - 70, 1000, 140, 52); mono("1 m²", 540, 1038, 34, K.ink, "center"); g.restore(); }
  bigNum("63 MW", 450, 220, k01(p.tBig ?? 0.6, 0.3));
  mono("ON EVERY SQUARE METRE OF YOU", W / 2, 520, 28, K.cobalt, "center", cl((lt - (p.tBig ?? 0.6) - 0.2) / 0.3));
}
else if (S === 8) { // 60,000 microwave ovens
  const k = eio((lt - 0.2) / 1.6); const sc = lerp(3.2, 0.36, k); const img = microwave(); const cw = 140 * sc, ch = 96 * sc;
  g.save(); g.beginPath(); g.rect(0, 580, W, 760); g.clip();
  const cols = Math.ceil(W / cw / 2) + 1, rows = Math.ceil(380 / ch) + 1;
  for (let r = -rows; r <= rows; r++) for (let c = -cols; c <= cols; c++) { const x = 540 + c * cw - cw / 2 + 4, y = 960 + r * ch - ch / 2 + 4; const on = 0.85 + 0.15 * Math.sin(t * 10 + r * 1.7 + c * 2.3);
    g.globalAlpha = on; g.drawImage(img, x, y, cw - 8 * Math.min(1, sc), ch - 8 * Math.min(1, sc)); }
  g.restore(); g.globalAlpha = 1;
  g.fillStyle = K.ink; g.fillRect(0, 574, W, 8); g.fillRect(0, 1338, W, 8);
  const n = Math.round(1 + 59999 * ein(cl((lt - 0.2) / 1.5)) ** 0.5);
  bigNum(n.toLocaleString("en-US"), 450, 210, k01(0, 0.25));
  mono("MICROWAVE OVENS · FULL POWER", W / 2, 520, 28, K.cobalt, "center", cl((lt - 0.3) / 0.3));
}
else if (S === 9) { // skin boils away in 0.1 s: figure dissolves into dots
  const k = eio((lt - 0.6) / Math.max(1.0, D - 1.0)); const pts = figDots(); const s = 1.55, ox = 540, oy = 1250;
  halo(ox, 880, 160, 560, K.coral, 15, 6, 0.8);
  if (k < 0.5) person(ox, oy - 8, s, { a: 1 - k * 2 });
  g.save(); g.globalCompositeOperation = "multiply";
  for (const [col, dx, dy] of [[K.coral, 7, 5], [K.cobalt, 0, 0]]) { g.fillStyle = col; g.beginPath();
    for (const [x, y, r0] of pts) { const lift = cl((k * 1.4 - (1 - (y + 500) / 520) * 0.25 - r0 * 0.45)); const px = ox + x * s + dx + Math.sin(r0 * 40 + t * 3) * 90 * lift, py = oy + y * s + dy - lift * (160 + 240 * r0);
      const rr0 = 7.2 * (1 - lift * 0.6); if (rr0 > 0.4) { g.moveTo(px + rr0, py); g.arc(px, py, rr0, 0, TAU); } } g.fill(); }
  g.restore();
  // steam wisps
  g.strokeStyle = K.coral; g.lineWidth = 10; g.lineCap = "round"; for (let i = 0; i < 6; i++) { const x = 380 + i * 64; const ph = (lt * 0.8 + rnd(i)) % 1; g.globalAlpha = cl(k * 3) * (1 - ph); g.beginPath();
    for (let j = 0; j < 8; j++) { const yy = 900 - ph * 400 - j * 26; const xx = x + Math.sin(j * 0.9 + t * 4 + i) * 16; j ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
  g.globalAlpha = 1;
  bigNum("0.1 s", 450, 230, k01(0, 0.25));
  { const a = cl((lt - (p.tGone ?? 1.2)) / 0.3); if (a > 0) { g.save(); g.globalAlpha = a; g.fillStyle = K.cream; g.fillRect(W / 2 - 170, 484, 340, 46); g.restore(); } mono("SKIN: VAPORISED", W / 2, 517, 30, K.coral, "center", a); }
}
else if (S === 10) { // the light's 100,000-year escape
  const cx = 540, cy = 1300, R = 660; const k = eio((lt - 0.2) / Math.max(1, D - 1.0));
  halo(cx, cy, R, R * 1.32, K.coral, 15, 6.2, 1);
  g.fillStyle = K.coral; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.clip();
  dotField(cx - R, cy - R, cx + R, cy + R, 15, (x, y) => { const d = Math.hypot(x - cx, y - cy) / R; if (d > 0.68) { const n = vn(x / 45 + t * 0.4, y / 45); return n > 0.45 ? (n - 0.45) * 12 : 0; } if (d > 0.27) return 2.4 + 1.5 * Math.sin(d * 40); return 0; }, K.coralD);
  g.save(); g.globalCompositeOperation = "multiply"; g.fillStyle = K.cobalt; g.globalAlpha = 0.85; g.beginPath(); g.arc(cx, cy, R * 0.25, 0, TAU); g.fill(); g.restore();
  g.restore();
  g.strokeStyle = K.ink; g.lineWidth = 3; g.setLineDash([10, 10]); for (const f of [0.25, 0.68]) { g.beginPath(); g.arc(cx, cy, R * f, Math.PI, TAU); g.stroke(); } g.setLineDash([]);
  mono("CORE", cx, cy + 75, 32, K.cream, "center");
  // random-walk photon path from the core to the surface
  if (!FC.walk) { const P = [[0, 0]]; let x = 0, y = 0, i = 0; while (Math.hypot(x, y) < R * 0.97 && i < 4000) { const a = rnd(i * 2.71 + 0.3) * TAU - (i % 3 === 0 ? 0 : 0); x += Math.cos(a) * 34; y += Math.sin(a) * 34 - 6.5; if (y > R * 0.2) y = R * 0.2; P.push([x, y]); i++; } FC.walk = P; }
  const P = FC.walk, nShow = Math.floor(P.length * k);
  g.strokeStyle = K.ink; g.lineWidth = 5; g.lineJoin = "round"; g.beginPath(); for (let i = 0; i <= nShow && i < P.length; i++) { const [x, y] = P[i]; i ? g.lineTo(cx + x, cy + y) : g.moveTo(cx + x, cy + y); } g.stroke();
  if (nShow > 0) { const [x, y] = P[Math.min(nShow, P.length - 1)]; g.fillStyle = K.cream; g.beginPath(); g.arc(cx + x, cy + y, 16, 0, TAU); g.fill(); g.strokeStyle = K.ink; g.lineWidth = 4; g.stroke(); }
  const yrs = Math.round(100000 * ein(k) ** 0.45 / 100) * 100;
  bigNum(yrs.toLocaleString("en-US"), 420, 200, k01(0, 0.25));
  mono("YEARS FROM CORE TO SURFACE (EST.)", W / 2, 490, 28, K.cobalt, "center", cl((lt - 0.3) / 0.3));
}
else if (S === 11) { // what would you do with your one second?
  const k = eout((lt - 0.1) / 1.2); const cx = 540, cy = 860, r = 300;
  halo(cx, cy, r + 30, r + 260, K.coral, 15, 6, 0.9);
  g.fillStyle = K.cream; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill();
  g.fillStyle = K.coral; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, r - 24, -Math.PI / 2, -Math.PI / 2 + TAU * k); g.closePath(); g.fill();
  g.strokeStyle = K.ink; g.lineWidth = 16; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke();
  g.fillStyle = K.ink; g.fillRect(cx - 40, cy - r - 70, 80, 50); g.fillRect(cx - 14, cy - r - 30, 28, 24);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; g.fillRect(cx + Math.cos(a) * (r - 40) - 4, cy + Math.sin(a) * (r - 40) - 4, 8, 8); }
  g.save(); g.translate(cx, cy); g.rotate(TAU * k); g.fillStyle = K.ink; g.fillRect(-6, -r + 40, 12, r - 40); g.beginPath(); g.arc(0, 0, 20, 0, TAU); g.fill(); g.restore();
  reg((1 * k).toFixed(3) + " s", 540, 1300, 150, {});
  surface(1560, { R: 3000, wav: 0.8, glow: 0.6, deep: 0 });
}
else if (S === 12) { // end poster
  const le = lt; const sa = eout(le / 0.5);
  sunDisk(540, 1720, 520, { hk: sa });
  reg("WHAT WOULD", 540, 470, 150, { sc: 0.8 + 0.2 * eback(le / 0.35), a: cl(le * 4) });
  reg("YOU DO WITH", 540, 620, 150, { sc: 0.8 + 0.2 * eback((le - 0.1) / 0.35), a: cl((le - 0.1) * 4) });
  reg("1 SECOND?", 540, 800, 190, { sc: 0.8 + 0.2 * eback((le - 0.2) / 0.35), a: cl((le - 0.2) * 4), col: K.coralD });
  const chip = (s, y, bg, fg, d) => { const a = eback((le - d) / 0.35); if (a <= 0) return; g.save(); g.translate(540, y); g.scale(a, a); g.globalAlpha = cl((le - d) * 4);
    g.font = `52px LHeavy`; const w = g.measureText(s).width * 0.88 + 70; g.fillStyle = "rgba(43,29,32,0.85)"; g.fillRect(-w / 2 + 8, -44 + 8, w, 88); g.fillStyle = bg; g.fillRect(-w / 2, -44, w, 88); cond(s, 0, 19, 52, fg, "center", 0.88); g.restore(); };
  const pulse = 1 + 0.035 * Math.sin(le * 6);
  g.save(); g.translate(540, 1010); g.scale(pulse, pulse); g.translate(-540, -1010); chip("COMMENT BELOW", 1010, K.coral, K.cream, 0.45); g.restore();
  chip("SAVE THIS FOR PART 2", 1130, K.cream, K.cobalt, 0.6);
  chip("FOLLOW FOR MORE WHAT IFS", 1250, K.cobalt, K.cream, 0.8);
}
g.restore();
printOver(0.8);

// ================= OVERLAYS (screen space, undo the engine's push-in zoom) =================
(function overlays() {
  if (typeof SPEC === "undefined") return;
  let z = 1;
  if (HOOK) z = 1.14 - 0.1 * eout(T / 0.6);
  else if (ME) z = 1 + 0.035 * cl((t - ME.a) / Math.max(0.5, ME.b - ME.a));
  g.save(); g.setTransform(1 / z, 0, 0, 1 / z, W / 2 * (1 - 1 / z), H / 2 * (1 - 1 / z));
  // header
  if (S !== 12 || lt < 0) {
    regMark(52, 74, K.cobalt); mono("WHAT IF Nº052", 80, 84, 26, K.cobalt, "left");
    regMark(W - 52, 74, K.coral); mono("SOL · 5,772 K", W - 80, 84, 26, K.coral, "right");
  }
  // slow-motion stopwatch
  const CK = SPEC.clock;
  if (CK && T >= CK[0][0] && T < (SPEC.clockEnd || 1e9) && !SPEC.clean) {
    let v = CK[CK.length - 1][1]; for (let i = 1; i < CK.length; i++) if (T <= CK[i][0]) { const [a0, x0] = CK[i - 1], [b0, y0] = CK[i]; v = x0 + (y0 - x0) * (T - a0) / Math.max(1e-6, b0 - a0); break; }
    const a = cl((T - CK[0][0]) / 0.25);
    g.globalAlpha = a; mono("SLOW-MO · T+", W - 60, 150, 22, K.ink, "right");
    reg(v.toFixed(3) + " s", W - 60, 222, 64, { align: "right", off: 2.5 });
    g.fillStyle = "rgba(43,29,32,0.2)"; g.fillRect(W - 300, 240, 240, 6); g.fillStyle = K.coral; g.fillRect(W - 300, 240, 240 * cl(v), 6); g.globalAlpha = 1;
  }
  // title masthead (hook)
  if (HOOK && SPEC.title && T < SPEC.title.end) {
    const ta = Math.min(1, (SPEC.title.end - T) / 0.25);
    reg("THE SUN", 540, 400, 250, { sc: 0.85 + 0.15 * eback(T / 0.4), a: ta * cl(T * 5) });
    mono("FOR ONE SECOND", 540, 470, 34, K.coral, "center", ta * cl((T - 0.3) * 4), 6);
  }
  // captions (cream box, cobalt words, coral key words, revealed word by word)
  if (!SPEC.clean && SPEC.pcaps && !(SPEC.endAt && T >= SPEC.endAt)) {
    const CW = FC.capw || (FC.capw = buildCaptionWords({ captions: SPEC.pcaps, words: SPEC.words || [] }));
    const hot = (SPEC.hot || []).map((w) => w.toLowerCase());
    for (const C of CW) {
      if (T < C.a || T > C.b) continue; const a = Math.min(1, (T - C.a) / 0.12, (C.b - T) / 0.12); if (a <= 0) continue;
      const size = 60, sx = 0.88; g.font = `${size}px LHeavy`; const sp = 18;
      let nShow = C.toks.findIndex((_, i) => C.times[i] > T + 0.05); if (nShow < 0) nShow = C.toks.length; nShow = Math.max(1, nShow);
      const toks = C.toks.slice(0, nShow).map((s) => s.toUpperCase()); const ws = toks.map((s) => g.measureText(s).width * sx);
      const lines = []; let cur = [], w = 0; toks.forEach((s, i) => { if (cur.length && w + sp + ws[i] > 860) { lines.push([cur, w]); cur = []; w = 0; } w += (cur.length ? sp : 0) + ws[i]; cur.push(i); }); if (cur.length) lines.push([cur, w]);
      const lh = 74, cy = SPEC.capY || 1440, y0 = cy - (lines.length - 1) * lh / 2; const bw = Math.max(...lines.map((l) => l[1])) + 56, bh = lines.length * lh + 26;
      g.globalAlpha = a;
      g.save(); g.globalCompositeOperation = "multiply"; g.fillStyle = K.cobalt; g.globalAlpha = a * 0.55; g.fillRect(W / 2 - bw / 2 + 9, y0 - lh / 2 - 13 + 8, bw, bh); g.restore();
      g.globalAlpha = a; g.fillStyle = K.cream; g.fillRect(W / 2 - bw / 2, y0 - lh / 2 - 13, bw, bh);
      lines.forEach(([idx, lw], li) => { let x = W / 2 - lw / 2; idx.forEach((i) => { const s = toks[i], bare = s.toLowerCase().replace(/[^a-z0-9]/g, "");
        const isNum = /\d/.test(s), isHot = hot.includes(bare); const ts = C.times[i]; const pop = 1 + 0.08 * Math.max(0, 1 - (T - ts) / 0.15);
        g.save(); g.translate(x + ws[i] / 2, y0 + li * lh + 22); g.scale(pop, pop); cond(s, 0, 0, size, isNum || isHot ? K.coral : K.cobalt, "center", sx); g.restore(); x += ws[i] + sp; }); });
      g.globalAlpha = 1;
    }
  }
  g.restore();
})();
