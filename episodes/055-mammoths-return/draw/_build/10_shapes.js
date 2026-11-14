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
  g.shadowColor = "rgba(20,19,18,0.85)"; g.shadowBlur = 10; g.fillStyle = col; g.fillText(s, x, y); g.shadowBlur = 0; g.fillText(s, x, y); g.restore(); }
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
