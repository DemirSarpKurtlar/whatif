// "Pixel Night" scene kit for 035 — every scene paints a 180x320 low-res canvas (6x nearest-neighbour upscale),
// then hi-res pixel-font HUD (own 5x7 bitmap font) is drawn on top.
// p.s selects the scene: 0 city, 1 shop, 2 airport, 3 bsod, 4 leaderboard, 5 hospital, 6 stocks,
// 7 phone, 8 gps, 9 ocean, 10 globe, 11 roof.  Common: p.z zoom, p.fx/p.fy focus (low-res px), p.ui (0 hides HUD), p.gl glitch.
const LW = 180, LH = 320, PX = 6;
const cvs = ctx.canvas;
if (!cvs._lo) { const c = document.createElement("canvas"); c.width = LW; c.height = LH; cvs._lo = c; }
const lo = cvs._lo, g = lo.getContext("2d");
g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.imageSmoothingEnabled = false; g.clearRect(0, 0, LW, LH);
const K = {
  ink: "#0B0A1E", n0: "#0B0A24", bldA: "#2B2A6B", bldB: "#3A3486", bldC: "#4B3C9E", bldD: "#5D4FC0", dk: "#1A1747",
  brick: "#B8343F", brick2: "#8E2532", win: "#FFD23F", win2: "#FFB13B", winOff: "#1E1B4A", pink: "#FF4FA3", cyan: "#3DE0FF",
  lime: "#7CFF6B", red: "#FF3B4E", white: "#F4F1FF", cream: "#F7E8C6", orange: "#FF8A3D", blue: "#2B6BFF", teal: "#20C3A8",
  skin: "#F2B48C", skin2: "#C98962", hair: "#2A1A14", grey: "#8A8FB8", grey2: "#5A5F8A", yellow: "#FFD23F",
};
const S = p.s | 0, UI = p.ui === undefined ? 1 : p.ui;
const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
const P = (x, y, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), 1, 1); };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const blink = (hz, ph = 0) => Math.floor(t * hz * 2 + ph) % 2 === 0;
const since = (a) => lt - a;

// ---------------- 5x7 bitmap font ----------------
if (!cvs._font) {
  const src = {
    A: "01110 10001 10001 11111 10001 10001 10001", B: "11110 10001 10001 11110 10001 10001 11110", C: "01110 10001 10000 10000 10000 10001 01110",
    D: "11110 10001 10001 10001 10001 10001 11110", E: "11111 10000 10000 11110 10000 10000 11111", F: "11111 10000 10000 11110 10000 10000 10000",
    G: "01110 10001 10000 10111 10001 10001 01111", H: "10001 10001 10001 11111 10001 10001 10001", I: "01110 00100 00100 00100 00100 00100 01110",
    J: "00111 00010 00010 00010 00010 10010 01100", K: "10001 10010 10100 11000 10100 10010 10001", L: "10000 10000 10000 10000 10000 10000 11111",
    M: "10001 11011 10101 10101 10001 10001 10001", N: "10001 10001 11001 10101 10011 10001 10001", O: "01110 10001 10001 10001 10001 10001 01110",
    P: "11110 10001 10001 11110 10000 10000 10000", Q: "01110 10001 10001 10001 10101 10010 01101", R: "11110 10001 10001 11110 10100 10010 10001",
    S: "01111 10000 10000 01110 00001 00001 11110", T: "11111 00100 00100 00100 00100 00100 00100", U: "10001 10001 10001 10001 10001 10001 01110",
    V: "10001 10001 10001 10001 10001 01010 00100", W: "10001 10001 10001 10101 10101 10101 01010", X: "10001 10001 01010 00100 01010 10001 10001",
    Y: "10001 10001 01010 00100 00100 00100 00100", Z: "11111 00001 00010 00100 01000 10000 11111",
    0: "01110 10001 10011 10101 11001 10001 01110", 1: "00100 01100 00100 00100 00100 00100 01110", 2: "01110 10001 00001 00010 00100 01000 11111",
    3: "11111 00010 00100 00010 00001 10001 01110", 4: "00010 00110 01010 10010 11111 00010 00010", 5: "11111 10000 11110 00001 00001 10001 01110",
    6: "00110 01000 10000 11110 10001 10001 01110", 7: "11111 00001 00010 00100 01000 01000 01000", 8: "01110 10001 10001 01110 10001 10001 01110",
    9: "01110 10001 10001 01111 00001 00010 01100",
    ":": "00000 01100 01100 00000 01100 01100 00000", ".": "00000 00000 00000 00000 00000 01100 01100", ",": "00000 00000 00000 00000 01100 00100 01000",
    "%": "11000 11001 00010 00100 01000 10011 00011", "$": "00100 01111 10100 01110 00101 11110 00100", "!": "00100 00100 00100 00100 00100 00000 00100",
    "?": "01110 10001 00001 00010 00100 00000 00100", "-": "00000 00000 00000 11111 00000 00000 00000", "/": "00001 00001 00010 00100 01000 10000 10000",
    "+": "00000 00100 00100 11111 00100 00100 00000", ">": "01000 00100 00010 00001 00010 00100 01000", "<": "00010 00100 01000 10000 01000 00100 00010",
    "'": "00100 00100 01000 00000 00000 00000 00000", "#": "01010 01010 11111 01010 11111 01010 01010", "·": "00000 00000 00000 01100 01100 00000 00000",
    "=": "00000 00000 11111 00000 11111 00000 00000", "(": "00010 00100 01000 01000 01000 00100 00010", ")": "01000 00100 00010 00010 00010 00100 01000",
    "✓": "00000 00001 00010 10100 01000 00000 00000", "&": "01100 10010 10100 01000 10101 10010 01101",
  };
  const f = {}; for (const k in src) f[k] = src[k].replace(/ /g, ""); cvs._font = f;
}
const FONT = cvs._font;
function glyphs(c, s, x, y, u, col) {
  c.fillStyle = col; let cx = x;
  for (const ch of s) { const gl = FONT[ch]; if (gl) for (let i = 0; i < 35; i++) if (gl.charCodeAt(i) === 49) c.fillRect(cx + (i % 5) * u, y + Math.floor(i / 5) * u, u, u); cx += 6 * u; }
}
const tw = (s, u) => [...String(s)].length * 6 * u - u;
// TXT(target, str, x, y(top), unit, colour, {align, out, ow})
function TXT(c, s, x, y, u, col, o = {}) {
  s = String(s).toUpperCase();
  let x0 = o.align === "center" ? x - tw(s, u) / 2 : o.align === "right" ? x - tw(s, u) : x;
  x0 = Math.round(x0); y = Math.round(y);
  if (o.out) {
    const w = o.ow || u;
    glyphs(c, s, x0 + w * 2, y + w * 2, u, o.out);
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]]) glyphs(c, s, x0 + dx * w, y + dy * w, u, o.out);
  } else if (o.sh) glyphs(c, s, x0 + u, y + u, u, o.sh);
  glyphs(c, s, x0, y, u, col);
}
// ---------------- sprites ----------------
function spr(rows, x, y, map, flip = false) {
  for (let r = 0; r < rows.length; r++) { const row = rows[r]; for (let c = 0; c < row.length; c++) { const ch = row[c]; if (ch === "." || ch === " ") continue; const col = map[ch]; if (col) P(flip ? x + row.length - 1 - c : x + c, y + r, col); } }
}
const KID = [
  "...hhhh...", ".hhhhhhhh.", "phhhhhhhhp", "phsssssshp", "pssessessp", "pssssssssp", ".sssmmsss.", "..ssssss..", "...tsst...",
  ".tttttttt.", "tttttttttt", "ttttwwtttt", "tt.twwt.tt", "tt.tttt.tt", "tt.tttt.tt", "ss.tttt.ss", "..jjjjjj..", "..jjjjjj..",
  "..jj..jj..", "..jj..jj..", "..jj..jj..", ".ww...www.",
];
const KIDMAP = { h: K.hair, p: K.pink, s: K.skin, e: K.ink, m: K.brick2, t: K.teal, w: K.white, j: "#3A4A9A" };
const NURSEMAP = { h: "#5A3A2A", p: "#5A3A2A", s: K.skin2, e: K.ink, m: K.brick2, t: "#4FB3E8", w: K.white, j: "#3C8FC4" };
// ---------------- icons (11x11) for HUD cards ----------------
const ICONS = {
  clock: ["...wwwww...", "..w.....w..", ".w...c...w.", "w....c....w", "w....c....w", "w....ccc..w", "w.........w", "w.........w", ".w.......w.", "..w.....w..", "...wwwww..."],
  warn: [".....r.....", "....rrr....", "....rwr....", "...rrwrr...", "...rrwrr...", "..rrrwrrr..", "..rrrwrrr..", ".rrrrrrrrr.", ".rrrrwrrrr.", "rrrrrrrrrrr", "rrrrrrrrrrr"],
  phone: ["...kkkkk...", "..kwwwwwk..", "..kcccccck.", "..kcwccck..", "..kccwcck..", "..kcccwck..", "..kcccccck.", "..kcccccck.", "..kwwwwwk..", "..kwwkwwk..", "...kkkkk..."].map((r) => r.slice(0, 11)),
  sat: ["cc.......cc", "cc.......cc", "cc..yyy..cc", "cwwwyyywwwc", "cc..yyy..cc", "cc...w...cc", "cc...w...cc", ".....w.....", "....w.w....", "...w...w...", "..w.....w.."],
  cash: ["...........", "yyyyyyyyyyy", "y.........y", "y..yyyyy..y", "y.yy...yy.y", "y.yy...yy.y", "y..yyyyy..y", "y.........y", "yyyyyyyyyyy", "...........", "..........."],
  cross: ["...........", "....rrr....", "....rrr....", "....rrr....", ".rrrrrrrrr.", ".rrrrrrrrr.", ".rrrrrrrrr.", "....rrr....", "....rrr....", "....rrr....", "..........."],
  wave: ["...........", "...........", "c..c..c..c.", ".c.c.c.c.c.", "..c...c...c", "...........", "w..w..w..w.", ".w.w.w.w.w.", "..w...w...w", "...........", "..........."],
  plane: [".....w.....", "....www....", "....www....", "...wwwww...", ".wwwwwwwww.", "wwwwwwwwwww", "....www....", "....www....", "...wwwww...", "..ww.w.ww..", "..........."],
};
function icon(name, x, y, u, col) {
  const rows = ICONS[name] || ICONS.clock, map = { w: "#FFFFFF", c: col, r: K.red, y: K.yellow, k: K.ink };
  for (let r = 0; r < rows.length; r++) for (let c = 0; c < rows[r].length; c++) { const col2 = map[rows[r][c]]; if (col2) { ctx.fillStyle = col2; ctx.fillRect(x + c * u, y + r * u, u, u); } }
}
// ---------------- HUD (hi-res) ----------------
function card(o) {
  if (!UI) return;
  const k = E["ease-out"](clamp((lt - (o.at || 0)) / 0.3)); if (k <= 0) return;
  const w = o.w || 640, h = 156, y = 96, x = 48 - Math.round((1 - k) * 15) * 4, col = o.col || K.cyan;
  ctx.save(); ctx.globalAlpha = k;
  ctx.fillStyle = "rgba(5,4,18,0.6)"; ctx.fillRect(x + 12, y + 12, w, h);
  ctx.fillStyle = K.ink; ctx.fillRect(x - 6, y - 6, w + 12, h + 12);
  ctx.fillStyle = col; ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  ctx.fillStyle = K.ink; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#17143F"; ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
  ctx.fillStyle = col; ctx.fillRect(x + 15, y + 15, 126, 126); ctx.fillStyle = K.ink; ctx.fillRect(x + 19, y + 19, 118, 118);
  icon(o.icon || "clock", x + 23, y + 23, 10, col);
  TXT(ctx, o.tag || "", x + 160, y + 17, 3, "#A9A4E0");
  TXT(ctx, o.title || "", x + 160, y + 44, 6, "#FFFFFF", { sh: "#000000" });
  const segs = o.segs || 24, bw = w - 180, sw = bw / segs, fill = o.fill ?? 0;
  for (let i = 0; i < segs; i++) {
    const on = i < fill, last = i === Math.ceil(fill) - 1;
    ctx.fillStyle = on ? (last && blink(2) ? "#FFFFFF" : col) : "#2E2A6A";
    ctx.fillRect(Math.round(x + 160 + i * sw), y + 100, Math.max(3, Math.round(sw) - 4), 14);
  }
  TXT(ctx, o.sub || "", x + 160, y + 125, 3, o.subCol || col);
  ctx.restore();
}
const hourCard = (hr, sub, col, subCol, at = 0) => card({ tag: "WORLD OFFLINE", title: "HOUR " + String(hr).padStart(2, "0"), sub, col, subCol, fill: hr, at, icon: "clock" });
// big pixel text with a chunky pop (unit steps)
function big(s, y, u, col, at, o = {}) {
  if (!UI) return; const l = lt - at; if (l < 0 || (o.dur && l > o.dur)) return;
  const k = E.back(clamp(l / 0.25)); const uu = Math.max(1, Math.round(u * (0.45 + 0.55 * k)));
  if (o.blink && !blink(o.blink)) return;
  if (o.panel) { const wT = tw(String(s).toUpperCase(), uu), x0 = (o.x ?? 540) - wT / 2 - 30, y0 = y + (u - uu) * 3.5 - 24, hT = 7 * uu + 48;
    ctx.fillStyle = "rgba(11,10,30,0.82)"; ctx.fillRect(Math.round(x0), Math.round(y0), Math.round(wT + 60), Math.round(hT));
    ctx.fillStyle = o.panel; ctx.fillRect(Math.round(x0), Math.round(y0), Math.round(wT + 60), 6); ctx.fillRect(Math.round(x0), Math.round(y0 + hT - 6), Math.round(wT + 60), 6); }
  TXT(ctx, s, o.x ?? 540, y + (u - uu) * 3.5, uu, col, { align: o.align || "center", out: o.out || K.ink, ow: Math.max(3, Math.round(uu * 0.45)) });
}
const CAM = { ox: 0, oy: 0, s: PX };
const hx = (x) => CAM.ox + x * CAM.s, hy = (y) => CAM.oy + y * CAM.s, hu = (u) => Math.max(1, Math.round(u * CAM.s / PX));
function blit() {
  const z = p.z || 1, fx = p.fx ?? 90, fy = p.fy ?? 160, s = PX * z;
  const ox = Math.round(540 - fx * s), oy = Math.round(960 - fy * s);
  const gl = Math.max(0, 1 - lt / 0.16) * (p.noin ? 0 : 1) + (p.gl || 0);
  ctx.imageSmoothingEnabled = false; ctx.fillStyle = K.ink; ctx.fillRect(0, 0, W, H);
  if (gl > 0.02) {
    const n = 16;
    for (let i = 0; i < n; i++) {
      const sy = Math.floor(LH * i / n), sh = Math.ceil(LH / n), off = (rnd(i * 3.7 + Math.floor(t * 24)) - 0.5) * gl * 26;
      ctx.drawImage(lo, 0, sy, LW, sh, Math.round(ox + Math.round(off) * s), oy + sy * s, LW * s, sh * s);
    }
    ctx.globalAlpha = 0.35 * clamp(gl); ctx.globalCompositeOperation = "screen";
    ctx.drawImage(lo, ox + 2 * s, oy, LW * s, LH * s); ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
  } else ctx.drawImage(lo, ox, oy, LW * s, LH * s);
  CAM.ox = ox; CAM.oy = oy; CAM.s = s;
}
// ---------------- world pieces (low-res) ----------------
function skyNight(h = 220, cols = ["#0B0A24", "#100E31", "#16123F", "#1E174F", "#281D60", "#352270", "#46287C"]) {
  const bh = h / cols.length;
  for (let i = 0; i < cols.length; i++) {
    R(0, i * bh, LW, bh + 1, cols[i]);
    if (i < cols.length - 1) { const y = Math.round((i + 1) * bh) - 2; for (let x = 0; x < LW; x += 2) { P(x + (y % 2), y, cols[i + 1]); P(x + ((y + 1) % 2), y + 1, cols[i + 1]); } }
  }
}
function stars(n, ymax, seed = 1) {
  for (let i = 0; i < n; i++) {
    const x = Math.floor(rnd(i * 3.1 + seed) * LW), y = Math.floor(rnd(i * 7.7 + seed) * ymax), k = rnd(i + seed * 9);
    const on = Math.sin(t * (1 + k * 3) + i) > -0.4;
    P(x, y, k > 0.9 ? K.cyan : k > 0.8 ? K.pink : on ? "#FFFFFF" : "#57539A");
    if (k > 0.96 && on) { P(x - 1, y, "#8C88D0"); P(x + 1, y, "#8C88D0"); P(x, y - 1, "#8C88D0"); P(x, y + 1, "#8C88D0"); }
  }
}
function disc(cx, cy, r, col) { for (let y = -r; y <= r; y++) { const w = Math.floor(Math.sqrt(r * r - y * y) + 0.5); R(cx - w, cy + y, 2 * w + 1, 1, col); } }
function ring(cx, cy, r, col, a0 = 0, a1 = TAU) { const n = Math.max(12, Math.floor(r * 7)); for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; P(cx + Math.cos(a) * r, cy + Math.sin(a) * r, col); } }
function moon(x, y) { disc(x, y, 9, "#3A2F7A"); disc(x, y, 8, K.cream); P(x - 3, y - 2, "#D8C9A6"); R(x + 1, y + 2, 2, 2, "#D8C9A6"); P(x + 4, y - 4, "#D8C9A6"); }
function bld(x, base, w, h, col, dk, seed, lit = 1, o = {}) {
  R(x, base - h, w, h, col); R(x + w - 2, base - h, 2, h, dk); R(x - 1, base - h - 2, w + 2, 2, dk);
  for (let yy = base - h + 4; yy < base - 4; yy += 6) for (let xx = x + 3; xx < x + w - 4; xx += 5) {
    const r = rnd(seed * 13.1 + xx * 0.37 + yy * 0.113);
    R(xx, yy, 3, 3, r < lit * 0.55 ? (r < 0.06 ? K.cyan : r < 0.14 ? K.win2 : r < 0.18 ? K.pink : K.win) : K.winOff);
  }
  if (o.ant) { R(x + (w >> 1), base - h - 9, 1, 7, dk); if (blink(0.8, seed)) P(x + (w >> 1), base - h - 10, K.red); }
  if (o.tank) { R(x + 4, base - h - 8, 8, 6, dk); R(x + 5, base - h - 2, 1, 2, dk); R(x + 10, base - h - 2, 1, 2, dk); }
}
function skyline(base, seed, cols, lit, hmin, hmax, wmin, wmax) {
  let x = -6, i = 0;
  while (x < LW + 6) { const w = Math.round(wmin + rnd(seed + i * 1.7) * (wmax - wmin)), h = Math.round(hmin + rnd(seed * 3 + i * 2.3) * (hmax - hmin)); bld(x, base, w, h, cols[i % cols.length], cols[2] || K.dk, seed * 10 + i, lit, { ant: rnd(i + seed) > 0.7 }); x += w + 1 + Math.round(rnd(i * 5 + seed) * 3); i++; }
}
function neonBox(x, y, w, h, col, on = 1) {
  if (on) { g.globalAlpha = 0.22; R(x - 2, y - 2, w + 4, h + 4, col); g.globalAlpha = 1; }
  const c = on ? col : "#3A2A5A"; R(x, y, w, 1, c); R(x, y + h - 1, w, 1, c); R(x, y, 1, h, c); R(x + w - 1, y, 1, h, c);
}
function wifi(x, y, col) { spr(["..ccccc..", ".c.....c.", "c..ccc..c", "..c...c..", "....c....", "....c...."], x, y, { c: col }); }
function redX(cx, cy, r, col = K.red) { for (let i = -r; i <= r; i++) { R(cx + i, cy + i, 2, 1, col); R(cx + i, cy - i, 2, 1, col); } }
function screen(x, y, w, h, off, seed) {
  R(x - 1, y - 1, w + 2, h + 2, K.ink);
  if (!off) {
    for (let i = 0; i < h; i++) R(x, y + i, w, 1, ["#2B1A6B", "#5A1F8A", "#A02A8A", "#E2457F", "#FF7A5A"][Math.floor(((i + t * 8 + seed) / 3) % 5)]);
    wifi(x + (w >> 1) - 4, y + (h >> 1) - 3, "#FFFFFF");
  } else {
    R(x, y, w, h, "#120A22");
    if (rnd(Math.floor(t * 12) + seed) < 0.25) R(x, y + Math.floor(rnd(t + seed) * h), w, 1, "#5A2A6A");
    if (blink(1.5, seed)) redX(x + (w >> 1), y + (h >> 1), Math.min(4, (h >> 1) - 2));
  }
}
function car(x, y, col, dir = 1) {
  R(x, y, 18, 4, col); R(x + 4, y - 3, 10, 3, col); R(x + 5, y - 2, 3, 2, "#8FD8FF"); R(x + 10, y - 2, 3, 2, "#8FD8FF");
  R(x + 2, y + 4, 3, 2, K.ink); R(x + 13, y + 4, 3, 2, K.ink);
  const fx = dir > 0 ? x + 17 : x; P(fx, y + 1, "#FFF3B0"); P(dir > 0 ? x : x + 17, y + 1, K.red);
  g.globalAlpha = 0.16; for (let i = 0; i < 18; i++) R(dir > 0 ? fx + 1 + i : fx - 1 - i, y + 1 - i * 0.18, 1, 1 + i * 0.36, "#FFF3B0"); g.globalAlpha = 1;
}
function plane(x, y) {
  R(x + 4, y, 36, 6, "#E8E6F5"); R(x + 40, y + 1, 3, 5, "#E8E6F5"); R(x + 43, y + 2, 1, 3, "#E8E6F5"); R(x + 38, y + 1, 3, 2, "#2A3A7A");
  R(x, y - 7, 4, 7, K.blue); R(x + 4, y - 4, 3, 4, K.blue); R(x + 4, y + 4, 39, 2, "#B8B4D8");
  for (let i = 0; i < 9; i++) P(x + 9 + i * 3, y + 2, "#3DA0E0");
  R(x + 16, y + 5, 12, 2, "#9A96C8"); R(x + 19, y + 6, 6, 3, "#7A76A8"); R(x + 10, y + 6, 1, 3, K.ink); R(x + 34, y + 6, 1, 3, K.ink);
  if (blink(1.2, x)) P(x + 22, y - 1, K.red);
}
// ============ SCENES ============
function sCity() {
  const tOff = p.tOff ?? 0.25, off = lt >= tOff;
  skyNight(230); stars(80, 170, 3); moon(146, 30);
  skyline(232, 2, ["#1E1A50", "#241F5E", "#171442"], 0.35, 50, 120, 12, 24);
  skyline(250, 5, [K.bldA, K.bldB, K.dk], 0.8, 40, 105, 18, 30);
  // near hero buildings
  bld(0, 262, 48, 150, K.brick, K.brick2, 41, 1, { tank: 1 });
  neonBox(6, 118, 10, 34, K.pink, 1); TXT(g, "N", 8, 121, 1, K.pink); TXT(g, "E", 8, 130, 1, K.pink); TXT(g, "T", 8, 139, 1, K.pink);
  bld(56, 262, 60, 120, K.bldC, "#3A2F86", 52, 1, { ant: 1 });
  screen(64, 150, 44, 26, off, 3);
  bld(124, 262, 56, 168, K.bldD, "#463BA0", 63, 1, { ant: 1 });
  const wOn = !off || (since(tOff) < 0.5 && blink(9));
  neonBox(134, 110, 36, 18, wOn ? K.cyan : K.red, 1); wifi(148, 116, wOn ? K.cyan : "#3A2A5A"); if (!wOn) redX(152, 118, 5);
  // street
  R(0, 262, LW, 58, "#15132E"); R(0, 262, LW, 3, "#2C2860"); for (let x = (Math.floor(t * 20) % 16) - 16; x < LW; x += 16) R(x, 290, 8, 1, "#4A4680");
  car(((lt * 26) % 240) - 30, 280, K.pink, 1); car(200 - ((lt * 20 + 90) % 240), 300, K.cyan, -1);
  blit();
  hourCard(off ? 1 : 0, off ? "INTERNET: OFFLINE" : "INTERNET: ONLINE", K.cyan, off ? K.red : K.lime);
  if (off && UI) {
    const l = since(tOff); if (l < 1.6 || blink(2)) big("CONNECTION", 470, 9, K.red, tOff, { panel: K.red }); if (l < 1.6 || blink(2)) big("LOST", 590, 9, K.red, tOff + 0.08, { panel: K.red });
    big("ERR: NO INTERNET", 730, 4, "#FFFFFF", tOff + 0.3, { panel: "#5A2A6A" });
  }
}
function sShop() {
  const tF = p.tFail ?? 0.9, tC = p.tCash ?? 2.0;
  R(0, 0, LW, 200, "#221D52"); for (let x = 0; x < LW; x += 12) R(x, 0, 1, 200, "#1C1846");
  neonBox(122, 16, 50, 18, K.pink, blink(0.6) || 1); TXT(g, "OPEN", 135, 22, 1, K.pink);
  for (let s2 = 0; s2 < 3; s2++) {
    const y = 72 + s2 * 38; R(4, y + 26, 172, 3, "#3A3486"); R(4, y + 29, 172, 1, K.ink);
    for (let i = 0; i < 16; i++) { const h2 = 10 + Math.floor(rnd(i + s2 * 9) * 14), c = [K.pink, K.cyan, K.yellow, K.orange, K.lime, "#9C7CFF"][Math.floor(rnd(i * 3 + s2) * 6)]; R(8 + i * 10.5, y + 26 - h2, 8, h2, c); R(8 + i * 10.5, y + 26 - h2, 8, 2, "#FFFFFF33"); R(8 + i * 10.5 + 6, y + 26 - h2, 2, h2, "#00000033"); }
  }
  R(0, 190, LW, 7, "#A65A6E"); R(0, 197, LW, 123, "#5A2A3E"); for (let y = 210; y < LH; y += 14) R(0, y, LW, 1, "#4A2034");
  // terminal
  const fail = lt >= tF, shake = fail && since(tF) < 0.4 ? (blink(14) ? 1 : -1) : 0, tx = 64 + shake;
  R(tx, 118, 52, 76, K.ink); R(tx + 1, 119, 50, 74, "#2B2A4A"); R(tx + 1, 119, 50, 2, "#45437A");
  const scr = fail ? "#3A0E18" : "#0E3B3A"; R(tx + 6, 125, 40, 28, K.ink); R(tx + 7, 126, 38, 26, scr);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) R(tx + 10 + c * 12, 160 + r * 7, 9, 5, r === 3 && c === 2 ? "#2EA84A" : r === 3 && c === 0 ? K.red : "#5A5888");
  // card hand (in, then out at cash time)
  const inK = E["ease-out"](clamp(lt / 0.5)), outK = E["ease-in"](clamp(since(tC - 0.25) / 0.35));
  const cx2 = 150 - 38 * inK + 80 * outK;
  if (cx2 < LW) { R(cx2 + 14, 146, 60, 14, K.teal); R(cx2 + 14, 146, 60, 2, "#5FE6CF"); R(cx2 + 6, 145, 12, 16, K.skin); R(cx2 + 6, 158, 12, 3, K.skin2);
    R(cx2 - 8, 132, 20, 13, K.blue); R(cx2 - 8, 132, 20, 2, "#6FA0FF"); R(cx2 - 5, 136, 4, 3, K.yellow); R(cx2 - 8, 140, 20, 1, K.ink); }
  // cash hand + coins
  if (lt >= tC) {
    const k = E["ease-out"](clamp(since(tC) / 0.4)), x0 = LW - 70 * k;
    R(x0 + 30, 168, 60, 14, K.teal); R(x0 + 22, 166, 12, 16, K.skin);
    for (let i = 0; i < 3; i++) { R(x0 - 6 + i * 2, 160 - i * 3, 30, 12, i % 2 ? "#3FAF5A" : "#57D06E"); R(x0 - 2 + i * 2, 163 - i * 3, 6, 6, "#2A7A3E"); }
    for (let i = 0; i < 7; i++) { const tt = since(tC + 0.15 + i * 0.09); if (tt < 0) continue; const yy = Math.min(186 - Math.floor(i / 3) * 3, 150 + tt * tt * 260); disc(30 + (i % 3) * 7, Math.round(yy), 2, K.yellow); P(29 + (i % 3) * 7, Math.round(yy) - 1, "#FFF2A0"); }
    // crown
    const cy = 112 + Math.round(Math.sin(lt * 6) * 1.5) - Math.round((1 - k) * 10); const cxx = x0 + 6;
    spr(["y...y...y", "yy.yyy.yy", "yyyyyyyyy", "yryyByyry", "yyyyyyyyy"], cxx, cy, { y: K.yellow, r: K.red, B: K.cyan });
  }
  blit();
  // terminal screen text (hi-res)
  const sx = hx(tx + 26), sy = hy(129), u = hu(4);
  if (!fail) TXT(ctx, lt < 0.55 ? "TAP CARD" : "WAIT" + ".".repeat(1 + Math.floor(lt * 4) % 3), sx, sy + 20, u, "#7CFFD0", { align: "center" });
  else { TXT(ctx, "DECLINED", sx, sy + 6, u, K.red, { align: "center" }); TXT(ctx, "NO NETWORK", sx, sy + 56, hu(3), "#FFB0B8", { align: "center" }); }
  hourCard(1, fail ? "CARD PAYMENTS: DOWN" : "CARD PAYMENTS: ...", K.cyan, fail ? K.red : K.cyan);
  if (fail && lt < tC) big("DECLINED", 340, 11, K.red, tF, { panel: K.red });
  if (lt >= tC) { big("CASH IS KING", 340, 10, K.yellow, tC + 0.1, { panel: K.yellow }); }
}
function sAirport() {
  const tA = p.tFlip ?? 0.3;
  R(0, 0, LW, LH, "#120F30");
  R(4, 56, 172, 140, K.ink); R(6, 58, 168, 136, "#3A3486"); R(8, 60, 164, 132, "#07061A");
  for (let i = 0; i < 6; i++) R(10, 82 + i * 18, 160, 1, "#16143A");
  // window + tarmac
  skyNight(60, ["#0B0A24", "#130F38", "#1E174F"]); g.save(); g.translate(0, 200); skyNight(40, ["#0B0A24", "#16123F", "#281D60"]); g.restore();
  for (let i = 0; i < 20; i++) P(rnd(i) * LW, 202 + rnd(i + 4) * 30, "#FFFFFF");
  R(0, 240, LW, 80, "#1A1838"); R(0, 240, LW, 2, "#2A2860"); for (let x = 0; x < LW; x += 14) R(x, 300, 7, 1, K.yellow);
  for (let x = 6; x < LW; x += 30) { R(x, 236, 1, 4, "#5A5888"); if (blink(1, x)) P(x, 235, K.orange); }
  plane(10, 252); plane(96, 262); R(70, 284, 10, 4, K.yellow); R(72, 288, 2, 2, K.ink); R(77, 288, 2, 2, K.ink);
  R(0, 196, LW, 4, K.ink); for (let x = 0; x < LW; x += 45) R(x, 196, 3, 44, K.ink);
  blit();
  if (!UI) return;
  TXT(ctx, "DEPARTURES", hx(16), hy(63), hu(5), K.yellow);
  if (blink(1)) TXT(ctx, "21:40", hx(164), hy(63), hu(5), "#FFFFFF", { align: "right" });
  const rows = [["LONDON", "21:45", "CANCELLED"], ["NEW YORK", "21:50", "DELAYED"], ["TOKYO", "22:05", "CANCELLED"], ["DUBAI", "22:10", "DELAYED"], ["PARIS", "22:20", "CANCELLED"], ["SYDNEY", "22:35", "DELAYED"]];
  rows.forEach((r, i) => {
    const y = hy(86 + i * 18), u = hu(4), ft = tA + i * 0.22, l = lt - ft;
    TXT(ctx, r[0], hx(14), y, u, "#E8E6F5"); TXT(ctx, r[1], hx(92), y, u, "#A9A4E0");
    let st = "ON TIME", col = K.lime;
    if (l >= 0 && l < 0.16) { st = String.fromCharCode(65 + Math.floor(rnd(t * 40 + i) * 26)).repeat(3) + "#?"; col = "#FFFFFF"; }
    else if (l >= 0.16) { st = r[2]; col = r[2] === "CANCELLED" ? K.red : K.orange; }
    TXT(ctx, st, hx(168), y, u, col, { align: "right" });
  });
  hourCard(3, "FLIGHTS: GROUNDED", K.cyan, lt > tA ? K.orange : K.cyan);
}
function sBsod() {
  const blue = p.blue ?? 0, tB = p.tPlane ?? 2.5;
  R(0, 0, LW, LH, "#141238"); for (let y = 0; y < LH; y += 2) if (y % 8 === 0) R(0, y, LW, 1, "#181545");
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    const i = r * 4 + c, x = 7 + c * 43, y = 80 + r * 34, crashed = rnd(i * 7.31 + 2) < blue;
    R(x, y, 38, 28, K.ink); R(x + 1, y + 1, 36, 26, "#3A3870"); R(x + 2, y + 2, 34, 22, crashed ? "#1F5FD6" : "#13204A");
    if (crashed) { spr(["w.w", "...", "www", "w.w"], x + 6, y + 6, { w: "#FFFFFF" }); R(x + 6, y + 6, 1, 1, "#FFFFFF"); for (let k2 = 0; k2 < 3; k2++) R(x + 14, y + 7 + k2 * 4, 16 - k2 * 4, 1, "#BFD4FF"); R(x + 6, y + 19, 6, 3, "#FFFFFF"); }
    else { R(x + 2, y + 21, 34, 3, "#2A3A7A"); R(x + 5, y + 5, 14, 9, "#E8E6F5"); R(x + 5, y + 5, 14, 2, K.cyan); R(x + 20, y + 9, 12, 8, "#5A4FC0"); }
    R(x + 16, y + 28, 6, 3, "#2A2860"); R(x + 12, y + 31, 14, 1, "#2A2860");
  }
  R(0, 218, LW, 102, "#100E2C"); R(0, 218, LW, 2, "#2A2860");
  blit();
  card({ tag: "FLASHBACK", title: "JULY 2024", sub: "ONE BAD SOFTWARE UPDATE", col: K.orange, icon: "warn" });
  const n = Math.round(8500000 * E["ease-out"](clamp(p.cnt ?? 0)));
  const tC = p.tCnt ?? 0.15;
  big(n.toLocaleString("en-US"), 300, 11, K.yellow, tC);
  if (lt < tB) big("WINDOWS PCS CRASHED", 410, 4, "#FFFFFF", tC + 0.15);
  else { big("THOUSANDS OF FLIGHTS", 410, 4, K.orange, tB); big("GROUNDED", 450, 4, K.orange, tB + 0.05); }
}
function sBoard() {
  const tA = p.tNew ?? 0.35;
  skyNight(200, ["#0B0A24", "#140F38", "#22144A", "#3A1A5E", "#5A1F6E", "#7A2A78"]); stars(50, 150, 7);
  R(0, 200, LW, 120, "#0E0A26");
  for (let i = 0; i < 9; i++) { const y = 200 + Math.round(Math.pow(i / 8, 2) * 120 + ((lt * 12) % 6) * (i / 8)); R(0, y, LW, 1, "#FF4FA3"); }
  for (let i = -8; i <= 8; i++) { for (let y = 200; y < LH; y += 2) P(90 + i * 4 + i * (y - 200) * 0.35, y, "#B03A8A"); }
  R(0, 199, LW, 2, K.pink);
  blit();
  if (!UI) return;
  TXT(ctx, "BIGGEST OUTAGES", 540, 130, 7, K.pink, { align: "center", out: K.ink, ow: 3 });
  const rowY = [300, 520, 700];
  const rows = [
    { r: "1ST", n: "THE INTERNET", d: "24 HOURS · EVERYONE", c: K.yellow, at: tA },
    { r: "2ND", n: "CROWDSTRIKE", d: "2024 · 8.5M PCS", c: "#FFFFFF", at: 0 },
    { r: "3RD", n: "FACEBOOK", d: "2021 · 6 HOURS", c: "#FFFFFF", at: 0.08 },
  ];
  rows.forEach((o, i) => {
    const l = lt - o.at; if (l < 0) return; const k = E["ease-out"](clamp(l / 0.25)); const x = 80 + Math.round((1 - k) * 60) * 10;
    const y = rowY[i];
    if (i === 0) { ctx.fillStyle = blink(4) ? "#3A1A10" : "#2A1640"; ctx.fillRect(40, y - 24, 1000, 180); ctx.fillStyle = K.yellow; ctx.fillRect(40, y - 24, 1000, 6); ctx.fillRect(40, y + 150, 1000, 6); }
    TXT(ctx, o.r, x, y, 8, i === 0 ? K.red : K.cyan, { out: K.ink, ow: 4 });
    TXT(ctx, o.n, x + 200, y, 7, o.c, { out: K.ink, ow: 3 });
    TXT(ctx, o.d, x + 200, y + 72, 4, i === 0 ? K.orange : "#A9A4E0");
  });
  if (lt > tA + 0.2 && blink(3)) TXT(ctx, "NEW RECORD!", 540, 890, 8, K.yellow, { align: "center", out: K.ink, ow: 4 });
}
function sHospital() {
  const tP = p.tPaper ?? 0.6;
  R(0, 0, LW, 150, "#163552"); R(0, 150, LW, 100, "#12304A"); R(0, 148, LW, 3, "#2A5A7A"); R(0, 250, LW, 70, "#0F2236");
  for (let x = 0; x < LW; x += 12) R(x, 250, 1, 70, "#0B1A2C");
  // window
  R(116, 56, 56, 64, K.ink); g.save(); g.beginPath(); g.rect(118, 58, 52, 60); g.clip(); g.translate(118, 58); skyNight(60, ["#0B0A24", "#16123F", "#281D60"]); g.restore();
  for (let i = 0; i < 4; i++) bld(118 + i * 13, 118, 11, 18 + Math.round(rnd(i) * 22), K.bldA, K.dk, i + 70, 0.9);
  R(143, 56, 2, 64, K.ink); R(116, 87, 56, 2, K.ink);
  // ECG monitor (still powered)
  R(8, 64, 44, 30, K.ink); R(10, 66, 40, 26, "#04140C"); R(28, 94, 3, 40, "#5A6A8A");
  for (let x = 0; x < 40; x++) { const ph = (x + Math.floor(lt * 30)) % 22; const yy = ph === 8 ? -8 : ph === 9 ? 6 : ph === 10 ? -3 : 0; P(10 + x, 80 + yy, K.lime); }
  TXT(g, "72", 38, 67, 1, K.lime);
  // computer on cart — offline
  R(64, 92, 36, 26, K.ink); R(66, 94, 32, 22, blink(1.5) ? "#3A0E18" : "#2A0A12"); R(80, 118, 4, 14, "#5A6A8A"); R(70, 132, 24, 3, "#5A6A8A");
  // bed + patient
  R(56, 196, 110, 6, "#B8C4DC"); R(56, 202, 4, 22, "#8A96B8"); R(162, 202, 4, 22, "#8A96B8"); R(56, 176, 4, 26, "#8A96B8");
  R(60, 184, 104, 12, "#E8EEF8"); R(62, 182, 22, 8, "#FFFFFF"); disc(72, 179, 5, K.skin); R(68, 173, 9, 3, K.hair); R(84, 182, 80, 12, "#6A8AD8"); R(84, 182, 80, 2, "#8AA8F0");
  // nurse with clipboard
  spr(KID, 22, 182, NURSEMAP); R(23, 181, 8, 2, "#FFFFFF");
  R(30, 196, 9, 11, "#C8A070"); R(31, 198, 7, 8, "#FFFFFF"); for (let i = 0; i < 3; i++) R(32, 199 + i * 2, 5, 1, "#3A4A7A"); R(33, 195, 3, 2, "#8A8A9A");
  // flying paper sheets
  for (let i = 0; i < 6; i++) { const l = since(tP + i * 0.18); if (l < 0) continue; const k = clamp(l / 0.6); const x = 100 - 66 * k + Math.sin(l * 10 + i) * 4 * (1 - k), y = 60 + 140 * k - Math.sin(k * Math.PI) * 30; if (k < 1) { R(x, y, 6, 8, "#FFFFFF"); R(x + 1, y + 2, 4, 1, "#9AA8C8"); R(x + 1, y + 4, 4, 1, "#9AA8C8"); } }
  const stack = Math.min(6, Math.floor(clamp(since(tP) / 1.2) * 6)); for (let i = 0; i < stack; i++) R(4 + (i % 2), 222 - i * 2, 14, 2, i % 2 ? "#E8EEF8" : "#FFFFFF");
  blit();
  if (UI) TXT(ctx, "OFFLINE", hx(82), hy(101), hu(2), K.red, { align: "center" });
  hourCard(6, "PATIENT RECORDS: PAPER", K.cyan, lt > tP ? K.yellow : K.cyan);
  big("PEN + PAPER", 860, 8, K.yellow, tP + 0.2, { panel: K.yellow });
}
function sStocks() {
  const tH = p.tHalt ?? 0.4, halt = lt >= tH;
  R(0, 0, LW, LH, "#0D0B26");
  for (let i = 0; i < 6; i++) { const x = 6 + (i % 2) * 86, y = 70 + Math.floor(i / 2) * 30; R(x, y, 82, 26, K.ink); R(x + 1, y + 1, 80, 24, halt ? "#1A1838" : "#151345"); }
  R(6, 166, 168, 52, K.ink); R(7, 167, 166, 50, "#0A0920");
  for (let x = 0; x < 166; x += 10) R(7 + x, 167, 1, 50, "#14123A");
  let yy = 195; const frozenAt = Math.floor(tH * 40);
  for (let x = 0; x < 166; x++) {
    const k = Math.floor(lt * 40) + x - 166; const kk = halt ? Math.min(k, frozenAt + x - 166) : k;
    const y = 192 + Math.sin(kk * 0.21) * 7 + Math.sin(kk * 0.53) * 4 + (rnd(kk) - 0.5) * 5;
    const flat = halt && x > 166 - Math.floor(since(tH) * 40); const y2 = flat ? yy : y; if (!flat) yy = y;
    P(7 + x, y2, flat ? K.red : K.lime);
  }
  if (halt) {
    R(0, 124, LW, 34, K.ink);
    for (let i = 0; i < 5; i++) for (let x = 0; x < LW; x++) { const on = ((x + i + Math.floor(lt * 8)) % 10) < 5; P(x, 125 + i, on ? K.yellow : K.ink); P(x, 152 + i, on ? K.yellow : K.ink); } }
  blit();
  if (!UI) return;
  const names = [["TECH", "+2.1%"], ["BANKS", "-0.8%"], ["ENERGY", "+1.4%"], ["AIRLINES", "-6.3%"], ["RETAIL", "-1.9%"], ["GOLD", "+3.2%"]];
  names.forEach((n, i) => { if (halt && i >= 4) return; const x = hx(9 + (i % 2) * 86), y = hy(74 + Math.floor(i / 2) * 30);
    TXT(ctx, n[0], x + 6, y + 4, 4, halt ? "#7A76A8" : "#FFFFFF");
    const v = halt ? "--" : n[1]; TXT(ctx, v, x + 460, y + 56, 4, halt ? "#7A76A8" : v[0] === "+" ? K.lime : K.red, { align: "right" }); });
  if (halt) { if (blink(2.5) || since(tH) < 0.4) TXT(ctx, "TRADING FROZEN", 540, hy(132) + 4, 8, K.red, { align: "center", out: K.ink, ow: 4 }); }
  hourCard(6, halt ? "ONLINE TRADING: FROZEN" : "MARKETS: OPEN", K.cyan, halt ? K.red : K.lime);
}
function sPhone() {
  const msgs = p.msgs ?? 0;
  R(0, 0, LW, LH, "#120F30"); for (let i = 0; i < 14; i++) { const x = rnd(i * 2) * LW, y = rnd(i * 5) * LH, r = 3 + Math.floor(rnd(i) * 5); g.globalAlpha = 0.25; disc(x, y, r, [K.pink, K.cyan, K.yellow, "#9C7CFF"][i % 4]); g.globalAlpha = 1; }
  // phone
  R(40, 44, 100, 186, K.ink); R(42, 46, 96, 182, "#2A2860"); R(46, 52, 88, 166, "#14123A"); R(80, 47, 20, 3, K.ink);
  P(40, 44, "#120F30"); P(139, 44, "#120F30"); P(40, 229, "#120F30"); P(139, 229, "#120F30");
  // hand
  // fingers wrap the right edge, thumb on the left, palm under the phone, teal sleeve
  for (let i = 0; i < 3; i++) { R(134, 132 + i * 18, 12, 15, K.skin); R(144, 133 + i * 18, 3, 13, K.skin2); R(134, 145 + i * 18, 12, 2, K.skin2); }
  R(30, 168, 14, 44, K.skin); R(30, 168, 3, 44, K.skin2); R(32, 165, 10, 4, K.skin);
  R(36, 224, 108, 30, K.skin); R(40, 254, 100, 16, K.skin); R(36, 224, 108, 2, K.skin2); R(138, 226, 6, 40, K.skin2);
  R(34, 270, 112, 50, K.teal); R(34, 270, 112, 3, "#5FE6CF"); R(34, 300, 112, 2, "#178F7C");
  // status bar
  for (let i = 0; i < 4; i++) R(50 + i * 3, 59 - i * 2, 2, 2 + i * 2, "#FFFFFF");
  wifi(118, 55, "#5A5888"); redX(122, 58, 3);
  blit();
  if (!UI) return;
  TXT(ctx, "NO INTERNET", hx(115), hy(55), hu(2), K.red, { align: "right" });
  const bub = [["U OK??", 0, "#3A3870"], ["NET IS DOWN", 1, K.teal], ["MEET AT 6?", 0, "#3A3870"]];
  bub.forEach((b, i) => {
    const l = msgs - i; if (l <= 0) return; const k = E.back(clamp(l / 0.35));
    const u = 5, wB = tw(b[0], u) + 40, x = b[1] ? hx(130) - wB : hx(50), y = hy(74 + i * 26) + Math.round((1 - k) * 20);
    ctx.globalAlpha = clamp(k); ctx.fillStyle = b[2]; ctx.fillRect(x, y, wB, 70); ctx.fillRect(x + 6, y - 6, wB - 12, 82);
    ctx.fillRect(b[1] ? x + wB - 6 : x - 6, y + 52, 12, 24); TXT(ctx, b[0], x + 20, y + 18, u, "#FFFFFF"); ctx.globalAlpha = 1;
  });
  TXT(ctx, "SMS", hx(64), hy(56), hu(2), "#FFFFFF");
  if (msgs > 3.2) { const y = hy(170); ctx.fillStyle = "#1E7A3A"; ctx.fillRect(hx(50), y, hx(130) - hx(50), 110); TXT(ctx, "CALL CONNECTED", 540, y + 22, 4, "#FFFFFF", { align: "center" }); TXT(ctx, "00:0" + Math.min(9, Math.floor((msgs - 3.2) * 3)), 540, y + 66, 4, K.lime, { align: "center" }); }
  card({ tag: "STILL WORKING", title: "CALLS + SMS", sub: "ON SOME NETWORKS", col: K.lime, icon: "phone" });
}
function sGps() {
  skyNight(250); stars(90, 200, 11);
  const sx = 70 + lt * 3, sy = 116;
  for (let i = 0; i < 4; i++) { const r = ((lt * 30 + i * 22) % 88); g.globalAlpha = 1 - r / 88; ring(sx + 4, sy + 4, r, K.lime, 0.35, Math.PI - 0.35); g.globalAlpha = 1; }
  R(sx - 14, sy + 1, 12, 6, "#2B4BB8"); R(sx + 10, sy + 1, 12, 6, "#2B4BB8"); for (let i = 0; i < 3; i++) { R(sx - 14 + i * 4, sy + 1, 1, 6, "#8AA8F0"); R(sx + 10 + i * 4, sy + 1, 1, 6, "#8AA8F0"); }
  R(sx - 2, sy + 3, 12, 2, "#9A96C8"); R(sx, sy, 8, 8, "#D8A84A"); R(sx, sy, 8, 2, "#F8D88A"); R(sx + 3, sy + 8, 2, 3, "#9A96C8");
  skyline(262, 9, ["#1A1747", "#211D58", "#120F33"], 0.5, 30, 80, 14, 26);
  R(0, 262, LW, 58, "#15132E"); R(0, 262, LW, 3, "#2C2860"); for (let x = -(Math.floor(lt * 30) % 16); x < LW; x += 16) R(x, 288, 8, 1, "#4A4680");
  const cx = 80; car(cx, 276, K.orange, 1);
  for (let y = sy + 12; y < 262; y += 4) P(sx + 4 + (cx + 9 - sx - 4) * (y - sy) / (262 - sy), y, blink(4) ? K.lime : "#3A8A4A");
  const by = 250 + Math.round(Math.sin(lt * 5) * 2); spr(["..rrr..", ".rrrrr.", "rrwwwrr", "rrwwwrr", ".rrrrr.", "..rrr..", "...r..."], cx + 6, by, { r: K.red, w: "#FFFFFF" });
  blit();
  card({ tag: "STILL WORKING", title: "GPS", sub: "SATELLITES, NOT INTERNET", col: K.lime, icon: "sat" });
  big("SIGNAL OK", 330, 7, K.lime, p.tOk ?? 0.4);
  big("NO WIFI NEEDED", 440, 5, "#FFFFFF", p.tSat ?? 1.6);
}
function sOcean() {
  const dark = clamp(p.dark ?? 0);
  skyNight(34, ["#0B0A24", "#16123F", "#281D60"]); stars(20, 30, 4);
  // ship
  R(118, 26, 26, 5, "#2A2860"); R(124, 21, 10, 5, "#2A2860"); P(130, 20, blink(1) ? K.red : "#2A2860");
  for (let x = 0; x < LW; x++) { const y = 34 + Math.round(Math.sin(x * 0.25 + lt * 3) * 1.2); R(x, y, 1, 3, "#3A6AD8"); }
  const cols = ["#0A2A6A", "#09245E", "#081E52", "#061846", "#05133A", "#040E2E", "#030A24"];
  for (let i = 0; i < cols.length; i++) R(0, 37 + i * 22, LW, 23, cols[i]);
  for (let i = 0; i < 30; i++) { const x = rnd(i * 4) * LW, y = 300 - ((lt * (8 + rnd(i) * 10) + rnd(i * 2) * 260) % 260); P(x + Math.sin(lt * 2 + i) * 2, y, "#4A7AD8"); }
  // fish
  for (let i = 0; i < 4; i++) { const x = ((lt * (6 + i * 3) + i * 60) % 220) - 20, y = 70 + i * 26; spr(["..yy.", "yyyyy", "..yy."], x, y, { y: i % 2 ? K.orange : "#8AE8FF" }); }
  // seabed
  for (let x = 0; x < LW; x++) { const y = 196 + Math.round(Math.sin(x * 0.07) * 4 + Math.sin(x * 0.19) * 2); R(x, y, 1, LH - y, "#1C1640"); P(x, y, "#2E2660"); }
  for (let i = 0; i < 12; i++) { const x = rnd(i * 9) * LW; R(x, 200 - (i % 3), 1, 6 + (i % 4), "#2A6A5A"); }
  const C = [[K.cyan, 186, 0.9], [K.pink, 192, 1.7], [K.yellow, 198, 2.6]];
  C.forEach(([col, y0, ph], ci) => {
    const yAt = (x) => Math.round(y0 + Math.sin(x * 0.045 + ph) * 5);
    const live = 1 - dark;
    for (let x = 0; x < LW; x++) {
      const y = yAt(x);
      if (live > 0.02) { g.globalAlpha = 0.25 * live; R(x, y - 1, 1, 4, col); g.globalAlpha = 1; }
      R(x, y, 1, 2, live > 0.5 ? col : "#2A2850");
    }
    if (live > 0.02) for (let k = 0; k < 4; k++) { const x = Math.round(((lt * 40 + k * 47 + ci * 15) % 200) - 10); g.globalAlpha = live; R(x, yAt(x) - 1, 4, 4, "#FFFFFF"); g.globalAlpha = 1; }
  });
  blit();
  if (p.hp) { // cold-open game HUD: the world's "internet HP" drains as the cables die
    const hp = 1 - dark, x = 90, y = 470, w = 900, segs = 20;
    ctx.fillStyle = K.ink; ctx.fillRect(x - 12, y - 12, w + 24, 250); ctx.fillStyle = hp > 0.6 ? K.cyan : K.red; ctx.fillRect(x - 6, y - 6, w + 12, 238);
    ctx.fillStyle = K.ink; ctx.fillRect(x, y, w, 226); ctx.fillStyle = "#17143F"; ctx.fillRect(x + 6, y + 6, w - 12, 214);
    TXT(ctx, "PLAYER: EARTH", x + 30, y + 24, 4, "#A9A4E0");
    TXT(ctx, hp > 0.02 ? "INTERNET" : "OFFLINE", x + 30, y + 64, 9, hp > 0.02 ? "#FFFFFF" : K.red, { sh: "#000000" });
    TXT(ctx, Math.round(hp * 100) + "%", x + w - 30, y + 64, 9, hp > 0.6 ? K.lime : K.red, { align: "right", sh: "#000000" });
    for (let i = 0; i < segs; i++) { const on = i < hp * segs; ctx.fillStyle = on ? (hp > 0.6 ? K.lime : K.red) : "#2E2A6A"; ctx.fillRect(x + 30 + i * ((w - 60) / segs), y + 150, (w - 60) / segs - 8, 40); }
  }
  if (!UI) return;
  hourCard(12, dark > 0.5 ? "UNDERSEA CABLES: DARK" : "UNDERSEA CABLES: LIVE", K.cyan, dark > 0.5 ? K.red : K.cyan);
  big("99%", 330, 20, K.yellow, p.tBig ?? 0.3);
  big("OF DATA BETWEEN CONTINENTS", 500, 4, "#FFFFFF", (p.tBig ?? 0.3) + 0.15);
  big("RUNS THROUGH THESE CABLES", 540, 4, "#FFFFFF", (p.tBig ?? 0.3) + 0.2);
  if (dark > 0.5) big("GONE DARK", hy(150), 7, K.red, p.tDark ?? 3, { blink: 2 });
}
function sGlobe() {
  skyNight(LH, ["#07061A", "#0B0A24", "#100E31", "#16123F"]); stars(110, LH, 13);
  const cx = 90, cy = 160, r = 58, rot = lt * 0.25;
  for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
    const d = x * x + y * y; if (d > r * r) continue;
    const u = x / r, v = y / r, z = Math.sqrt(Math.max(0, 1 - u * u - v * v)), lat = Math.asin(v), lon = Math.atan2(u, z) + rot;
    const land = Math.sin(lon * 3 + 1.3) * Math.cos(lat * 2.3) + 0.55 * Math.sin(lon * 7 + lat * 5) + 0.3 * Math.cos(lat * 9 - lon * 2) > 0.45;
    let col = land ? (z < 0.35 ? "#241E52" : "#3A2F78") : (z < 0.35 ? "#0A1640" : "#12285E");
    if (land && rnd(Math.floor(lon * 40) * 13.7 + Math.floor(lat * 40)) < 0.16) col = rnd(Math.floor(lon * 40) + Math.floor(lat * 40) * 3.1) < 0.5 ? K.win : K.win2;
    P(cx + x, cy + y, col);
  }
  ring(cx, cy, r + 1, "#3DE0FF55"); ring(cx, cy, r + 3, blink(1.5) ? K.red : "#5A1A2A");
  for (let i = 0; i < 5; i++) { const a = i * 1.3 + 0.4; const x1 = cx + Math.cos(a) * r, y1 = cy + Math.sin(a) * r * 0.6; const x2 = cx + Math.cos(a + 1.6) * r, y2 = cy + Math.sin(a + 1.6) * r * 0.6;
    for (let k = 0; k <= 30; k++) { const s = k / 30; if ((k + i) % 3) continue; P(x1 + (x2 - x1) * s, y1 + (y2 - y1) * s - Math.sin(s * Math.PI) * 30, "#5A2A4A"); } redX(Math.round((x1 + x2) / 2), Math.round((y1 + y2) / 2 - 30), 2); }
  blit();
  hourCard(24, "DAMAGE: ESTIMATED", K.cyan, K.yellow);
  const k = E["ease-out"](clamp(since(p.tBill ?? 0.3) / 1.4));
  if (lt >= (p.tBill ?? 0.3)) { const v = Math.round(40e9 * k / 1e6) * 1e6; big("$" + v.toLocaleString("en-US"), 330, 9, K.yellow, p.tBill ?? 0.3); big("EST. COST OF ONE DAY OFFLINE", 440, 4, "#FFFFFF", (p.tBill ?? 0.3) + 0.1); }
}
function sRoof() {
  skyNight(200); stars(100, 170, 17); moon(30, 36);
  skyline(196, 4, ["#1E1A50", "#241F5E", "#171442"], 0.6, 30, 90, 12, 22);
  screen(118, 120, 28, 16, 1, 5); screen(30, 140, 22, 14, 1, 8);
  R(0, 196, LW, 8, "#3A3486"); R(0, 196, LW, 2, "#5D4FC0"); R(0, 204, LW, 116, "#1C1846");
  for (let x = 0; x < LW; x += 20) R(x, 204, 1, 116, "#16133A");
  R(130, 220, 34, 22, "#2A2860"); R(132, 222, 30, 18, "#211E50"); for (let i = 0; i < 5; i++) R(134 + i * 6, 224, 3, 14, "#16133A");
  const kx = 82, ky = 175; spr(KID, kx, ky, KIDMAP);
  R(kx + 7, ky + 13, 3, 4, "#BFF8FF"); g.globalAlpha = 0.3 + 0.15 * Math.sin(lt * 8); disc(kx + 8, ky + 12, 6, K.cyan); g.globalAlpha = 1;
  blit();
  hourCard(24, "WHAT'S YOUR MOVE?", K.cyan, K.yellow);
  if (UI) { const bob = Math.round(Math.sin(lt * 4) * 2) * 6; const qx = hx(kx + 5), qy = hy(ky - 26) + bob;
    ctx.fillStyle = K.ink; ctx.fillRect(qx - 66, qy - 6, 132, 132); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(qx - 60, qy, 120, 120); ctx.fillRect(qx - 12, qy + 120, 24, 18);
    TXT(ctx, "?", qx, qy + 18, 12, K.pink, { align: "center" }); }
}
[sCity, sShop, sAirport, sBsod, sBoard, sHospital, sStocks, sPhone, sGps, sOcean, sGlobe, sRoof][S]();
