// "Pixel Night" scene kit for 054 (electricity gone for a week) — helpers copied from 035/044 draw/px.js (180x320 low-res
// canvas, 6x nearest-neighbour upscale, own 5x7 bitmap font, HUD cards, pixel big numbers), plus a giant DAY counter HUD
// (dayHud) and new scenes.  p.d = day number (1..7) for the counter, p.hr = hour within that day (0..24).
// p.s: 0 city (hook: p.hp + p.drain) · 1 phone/tower · 2 tap · 3 freezer · 4 hospital · 5 gas · 6 cash · 7 grid restart · 8 roof
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
let SHK = p.sh || 0, GLX = 0;
const hx = (x) => CAM.ox + x * CAM.s, hy = (y) => CAM.oy + y * CAM.s, hu = (u) => Math.max(1, Math.round(u * CAM.s / PX));
function blit() {
  const z = p.z || 1, fx = p.fx ?? 90, fy = p.fy ?? 160, s = PX * z;
  const shx = Math.round((rnd(Math.floor(t * 30)) - 0.5) * SHK * 4) * PX, shy = Math.round((rnd(Math.floor(t * 30) + 7) - 0.5) * SHK * 4) * PX;
  const ox = Math.round(540 - fx * s) + shx, oy = Math.round(960 - fy * s) + shy;
  const gl = Math.max(0, 1 - lt / 0.16) * (p.noin ? 0 : 1) + (p.gl || 0) + GLX;
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
// ---------------- 044 extras ----------------
Object.assign(ICONS, {
  sun: [".....y.....", ".y...y...y.", "..y.yyy.y..", "...yyyyy...", "..yyyyyyy..", "yyyyyyyyyyy", "..yyyyyyy..", "...yyyyy...", "..y.yyy.y..", ".y...y...y.", ".....y....."],
  bolt: ["......cc...", ".....cc....", "....cc.....", "...cc......", "..ccccccc..", "......cc...", ".....cc....", "....cc.....", "...cc......", "..cc.......", "..........."],
  aur: ["...........", ".r..r..r..r", ".rc.rc.rc.r", "cc.cc.cc.cc", "cc.cc.cc.cc", "c.cc.cc.cc.", ".cc.cc.cc.c", "...........", "w.w.w.w.w.w", "wwwwwwwwwww", "wwwwwwwwwww"],
});
const CARRMAP = { h: "#7A5A3A", p: "#7A5A3A", s: K.skin, e: K.ink, m: K.brick2, t: "#2A2440", w: "#F4F1FF", j: "#3A3050" };
const OPMAP = { h: "#2E8A4A", p: "#5A3A2A", s: K.skin, e: K.ink, m: K.brick2, t: "#E8E0D0", w: "#2A2440", j: "#3A3050" };
const SILMAP = { h: "#0E0C1E", p: "#0E0C1E", s: "#1A1830", e: "#0E0C1E", m: "#1A1830", t: "#141226", w: "#2E5A3A", j: "#100E20" };
const DARK = ["#07061A", "#0B0A24", "#100E31", "#16123F"];
const pad2 = (n) => String(n).padStart(2, "0");
function L(x0, y0, x1, y1, c) { const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)))); for (let i = 0; i <= n; i++) P(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, c); }
// aurora curtains: base line yb, height h0, intensity k
function aurora(yb, h0, k = 1, seed = 1) {
  const bands = [[0, 0.1, "#C8FFB8", 0.9], [0.1, 0.42, "#7CFF6B", 0.75], [0.42, 0.62, "#2EE6A6", 0.55], [0.62, 0.84, "#FF4FA3", 0.4], [0.84, 1, "#FF3B4E", 0.28]];
  for (let x = 0; x < LW; x++) {
    const a = k * clamp(0.2 + 0.8 * (0.5 + 0.5 * Math.sin(x * 0.11 + t * 1.6 + seed * 3)) * (0.55 + 0.45 * Math.sin(x * 0.031 - t * 0.5 + seed)));
    const base = yb + Math.round(Math.sin(x * 0.045 + t * 0.8 + seed) * 8 + Math.sin(x * 0.13 - t * 1.3) * 3);
    const h = h0 * (0.6 + 0.4 * Math.sin(x * 0.05 + t * 0.6 + seed * 5));
    const st = x % 3 === 0 ? 1.25 : 1;
    for (const [b0, b1, col, al] of bands) { g.globalAlpha = clamp(a * al * st); R(x, base - h * b1, 1, Math.ceil(h * (b1 - b0)) + 1, col); }
  }
  g.globalAlpha = 1;
}
function earth(cx, cy, r, ang = Math.PI) { // ang: direction of the sun
  const lx = Math.cos(ang), ly = Math.sin(ang);
  for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
    if (x * x + y * y > r * r) continue;
    const u = x / r, v = y / r, lon = Math.atan2(u, Math.sqrt(Math.max(0, 1 - u * u - v * v))) + t * 0.2, lat = Math.asin(v);
    const land = Math.sin(lon * 3 + 1.3) * Math.cos(lat * 2.3) + 0.5 * Math.sin(lon * 7 + lat * 5) > 0.45;
    const day = u * lx + v * ly > -0.15;
    P(cx + x, cy + y, land ? (day ? "#3FBF5A" : "#163A2E") : (day ? "#2E7BFF" : "#12285E"));
  }
  ring(cx, cy, r + 1, "#8FD8FF");
}
function spark(x, y, s, col = K.yellow) {
  P(x, y, "#FFFFFF"); for (let i = 1; i <= s; i++) { P(x + i, y, col); P(x - i, y, col); P(x, y + i, col); P(x, y - i, col); }
  if (s > 2) { P(x + 1, y + 1, "#FFFFFF"); P(x - 1, y - 1, "#FFFFFF"); P(x + 1, y - 1, col); P(x - 1, y + 1, col); }
}
function house(x, base, w, h, col, roofCol, seed, litK = 1) {
  R(x, base - h, w, h, col); const rh = Math.round(w / 2.4);
  for (let i = 0; i < rh; i++) R(x - 1 + i * (w / 2) / rh, base - h - i, w + 2 - i * w / rh, 1, roofCol);
  R(x + w - 6, base - h - rh + 1, 3, rh - 1, roofCol);
  for (let yy = base - h + 4; yy < base - 5; yy += 8) for (let xx = x + 3; xx < x + w - 4; xx += 7) { const r = rnd(seed * 7.3 + xx * 0.7 + yy * 0.31); R(xx, yy, 3, 4, r < 0.45 * litK ? (r < 0.15 ? K.win2 : "#FFC860") : "#1A1530"); }
}
function satS(cx, cy, ang, glitch = 0) {
  const ca = Math.cos(ang), sa = Math.sin(ang);
  for (let u = -15; u <= 15; u += 0.5) for (let v = -3.5; v <= 3.5; v += 0.5) {
    const au = Math.abs(u), av = Math.abs(v); let col = null;
    if (au <= 3 && av <= 3.5) col = av > 2.5 ? "#B8862A" : "#E8B84A";
    else if (au > 4.5 && av <= 2.5) col = (Math.round(u) % 3 === 0) ? "#8AA8F0" : (glitch && rnd(Math.floor(t * 10) + u) < glitch * 0.5 ? K.red : "#2B4BB8");
    else if (au <= 4.5 && av <= 0.5) col = "#9A96C8";
    if (col) P(cx + u * ca - v * sa, cy + u * sa + v * ca, col);
  }
}
function pylon(x, base, h) {
  const c = "#5A5F8A", top = base - h;
  L(x - 9, base, x - 2, top, c); L(x + 9, base, x + 2, top, c);
  for (let i = 0; i < 8; i++) { const y0 = base - i * h / 8, y1 = base - (i + 1) * h / 8, w0 = 9 - 7 * i / 8, w1 = 9 - 7 * (i + 1) / 8; L(x - w0, y0, x + w1, y1, "#44487A"); L(x + w0, y0, x - w1, y1, "#44487A"); }
  R(x - 13, top + 6, 26, 2, c); R(x - 10, top + 16, 20, 2, c); R(x - 1, top - 4, 2, 4, c);
}
// ============ 054: day counter + scenes ============
const DCOL = [K.yellow, K.yellow, K.orange, K.orange, K.red, K.red, K.lime];
const DAY = p.d | 0;
function dayHud(d, tag) {
  if (!UI || !d) return;
  const col = DCOL[d - 1], x = 48, y = 84, w = 984, h = 262;
  ctx.save(); ctx.globalAlpha = E["ease-out"](clamp(lt / 0.2));
  ctx.fillStyle = "rgba(5,4,18,0.6)"; ctx.fillRect(x + 12, y + 12, w, h);
  ctx.fillStyle = K.ink; ctx.fillRect(x - 6, y - 6, w + 12, h + 12);
  ctx.fillStyle = col; ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  ctx.fillStyle = K.ink; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#17143F"; ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
  // giant DAY n (pops + flickers white when it flips)
  const pop = E.back(clamp(lt / 0.32)), u = Math.max(6, Math.round(17 * (0.55 + 0.45 * pop)));
  const fl = lt < 0.35 && blink(10);
  TXT(ctx, "DAY " + d, x + 36, y + 24 + (17 - u) * 7, u, fl ? "#FFFFFF" : col, { out: K.ink, ow: 4 });
  TXT(ctx, "/7", x + 36 + tw("DAY " + d, 17) + 22, y + 24 + 7 * 17 - 35, 5, "#A9A4E0");
  // hours-in-the-dark ticker + event tag
  const hrs = Math.min(168, (d - 1) * 24 + Math.floor(p.hr ?? 0));
  TXT(ctx, "HOURS IN THE DARK", x + w - 36, y + 22, 3, "#A9A4E0", { align: "right" });
  TXT(ctx, "T+" + String(hrs).padStart(3, "0") + "H", x + w - 36, y + 48, 7, "#FFFFFF", { align: "right", sh: "#000000" });
  TXT(ctx, tag, x + w - 36, y + 112, 5, col, { align: "right" });
  // 7 day pips
  const gap = 14, pw = (w - 72 - gap * 6) / 7, py = y + 176, ph = 60;
  for (let i = 0; i < 7; i++) {
    const px0 = Math.round(x + 36 + i * (pw + gap)), cur = i === d - 1, past = i < d - 1;
    ctx.fillStyle = past ? "#5A1A2A" : cur ? (blink(2) ? "#FFFFFF" : col) : "#2E2A6A"; ctx.fillRect(px0, py, Math.round(pw), ph);
    if (cur) { ctx.fillStyle = col; ctx.fillRect(px0 + 6, py + 6, Math.round(pw) - 12, ph - 12); }
    TXT(ctx, "D" + (i + 1), px0 + pw / 2, py + 16, 4, past ? K.red : cur ? K.ink : "#57539A", { align: "center" });
  }
  ctx.restore();
}
function hand(x, y, w) { // palm under an object, fingers on the right edge, thumb left, teal sleeve
  for (let i = 0; i < 3; i++) { R(x + w - 2, y - 46 + i * 15, 8, 12, K.skin); R(x + w + 4, y - 45 + i * 15, 2, 10, K.skin2); }
  R(x - 8, y - 30, 10, 26, K.skin); R(x - 8, y - 30, 2, 26, K.skin2);
  R(x - 4, y, w + 8, 22, K.skin); R(x - 4, y, w + 8, 2, K.skin2); R(x - 6, y + 20, w + 12, 70, K.teal); R(x - 6, y + 20, w + 12, 3, "#5FE6CF");
}
function bill(x, y, a = 0) {
  const c = Math.cos(a), s = Math.sin(a);
  for (let u = -6; u <= 6; u++) for (let v = -3; v <= 3; v++) {
    const col = Math.abs(u) === 6 || Math.abs(v) === 3 ? "#3A8A4A" : (u * u + v * v * 2 < 6 ? "#2E6A3A" : "#7ACB6A");
    P(x + u * c - v * s, y + u * s + v * c, col);
  }
}
function sCity() {
  const hk = !!p.hp, hp = hk ? clamp(1 - (p.drain ?? 0)) : clamp(1 - since(p.tOff ?? 99) / 1.0);
  skyNight(240); stars(90, 160, 3); moon(146, 40);
  skyline(214, 2, ["#1E1A50", "#241F5E", "#171442"], 0.5 * hp, 50, 120, 12, 24);
  skyline(250, 5, [K.bldA, K.bldB, K.dk], 0.9 * hp, 40, 110, 18, 30);
  R(0, 250, LW, 70, "#120F2A"); R(0, 250, LW, 2, "#2C2860");
  for (const lx of [20, 80, 140]) {
    R(lx, 222, 2, 28, "#2A2860"); R(lx - 3, 220, 8, 3, "#2A2860");
    if (hp > 0.35) { R(lx - 2, 223, 6, 1, K.win); g.globalAlpha = 0.16; for (let i = 0; i < 26; i++) R(lx + 1 - i * 0.45, 224 + i, 1 + i * 0.9, 1, K.win); g.globalAlpha = 1; }
  }
  R(0, 262, LW, 34, "#18153A"); for (let x = -(Math.floor(lt * 20) % 20); x < LW; x += 20) R(x, 278, 10, 1, "#4A4680");
  car(((lt * 30) % 220) - 30, 268, K.orange, 1); car(170 - ((lt * 24 + 80) % 220), 286, K.pink, -1);
  if (hp < 0.5 && rnd(Math.floor(t * 9)) < 0.3) GLX = 0.3;
  blit();
  if (hk) {
    const x = 90, y = 470, w = 900, segs = 20;
    ctx.fillStyle = K.ink; ctx.fillRect(x - 12, y - 12, w + 24, 250); ctx.fillStyle = hp > 0.6 ? K.cyan : K.red; ctx.fillRect(x - 6, y - 6, w + 12, 238);
    ctx.fillStyle = K.ink; ctx.fillRect(x, y, w, 226); ctx.fillStyle = "#17143F"; ctx.fillRect(x + 6, y + 6, w - 12, 214);
    TXT(ctx, "PLAYER: YOUR CITY", x + 30, y + 24, 4, "#A9A4E0");
    TXT(ctx, hp > 0.02 ? "ELECTRICITY" : "BLACKOUT", x + 30, y + 64, 9, hp > 0.02 ? "#FFFFFF" : K.red, { sh: "#000000" });
    TXT(ctx, Math.round(hp * 100) + "%", x + w - 30, y + 64, 9, hp > 0.6 ? K.lime : K.red, { align: "right", sh: "#000000" });
    for (let i = 0; i < segs; i++) { const on = i < hp * segs; ctx.fillStyle = on ? (hp > 0.6 ? K.lime : K.red) : "#2E2A6A"; ctx.fillRect(x + 30 + i * ((w - 60) / segs), y + 150, (w - 60) / segs - 8, 40); }
    if (hp <= 0.02) big("7 DAYS TO GO", 820, 8, K.yellow, (p.tEnd ?? 0), { panel: K.yellow });
    return;
  }
  if (hp < 1) big("POWER: OFF", 470, 10, K.red, p.tOff, { panel: K.red });
}
function sPhone() {
  const bat = clamp(p.bat ?? 1), dead = bat <= 0.001, tF = p.tFact ?? 0.5;
  skyNight(250, DARK.concat(["#1E174F", "#281D60"])); stars(70, 200, 13);
  skyline(250, 6, ["#16133C", "#1A1747", "#100E2E"], 0.03, 40, 100, 16, 28);
  R(0, 250, LW, 70, "#0E0C26");
  const tx = 36, base = 250, h = 140, top = base - h;
  pylon(tx, base, h);
  for (const [ax, ay] of [[-9, 4], [6, 4], [-2, -2]]) { R(tx + ax, top + ay, 3, 11, "#B8C4DC"); R(tx + ax, top + ay, 3, 1, "#FFFFFF"); }
  if (!dead) { for (let i = 0; i < 3; i++) { const r = (lt * 24 + i * 12) % 36; g.globalAlpha = (1 - r / 36) * (0.3 + 0.7 * bat); ring(tx, top + 6, 8 + r, K.cyan, -0.8, 0.8); ring(tx, top + 6, 8 + r, K.cyan, Math.PI - 0.8, Math.PI + 0.8); } g.globalAlpha = 1; }
  if (blink(1, 1) && !dead) P(tx, top - 3, K.red);
  // battery cabinet
  R(tx + 12, 176, 22, 34, "#3A3E6A"); R(tx + 14, 180, 18, 26, K.ink); R(tx + 19, 173, 8, 3, "#3A3E6A"); R(tx + 8, 190, 4, 3, "#3A3E6A");
  const bh = Math.round(24 * bat); R(tx + 15, 205 - bh, 16, bh, bat > 0.5 ? K.lime : bat > 0.2 ? K.orange : K.red);
  // phone in hand
  const X = 100, Y = 120, Wp = 60, Hp = 108;
  R(X, Y, Wp, Hp, K.ink); R(X + 2, Y + 2, Wp - 4, Hp - 4, "#2A2860"); R(X + 5, Y + 9, Wp - 10, Hp - 18, dead ? "#1A0A16" : "#14123A"); R(X + 24, Y + 4, 12, 2, K.ink);
  const bars = dead ? 0 : Math.ceil(bat * 4);
  for (let i = 0; i < 4; i++) R(X + 9 + i * 4, Y + 20 - i * 2, 3, 3 + i * 2, i < bars ? "#FFFFFF" : "#3A3870");
  R(X + 40, Y + 14, 10, 6, "#8A8FB8"); R(X + 41, Y + 15, Math.max(1, Math.round(8 * (0.35 + 0.1 * bat))), 4, K.lime);
  if (dead) { if (blink(2)) redX(X + 30, Y + 66, 9); }
  else for (let i = 0; i < 3; i++) R(X + 10, Y + 34 + i * 14, i % 2 ? 26 : 36, 9, i % 2 ? K.teal : "#3A3870");
  hand(X, Y + Hp, Wp);
  SHK = dead && lt - (p.tDead ?? 0) < 0.3 ? 1 : 0;
  blit();
  dayHud(1, "SIGNAL");
  if (!UI) return;
  TXT(ctx, dead ? "NO SERVICE" : bat < 0.35 ? "SEARCHING..." : "5G", hx(X + 30), hy(Y + 92), hu(3), dead ? K.red : "#FFFFFF", { align: "center" });
  TXT(ctx, "BATTERY " + Math.round(bat * 100) + "%", hx(tx + 23), hy(166), hu(3), bat > 0.2 ? K.lime : K.red, { align: "center", out: K.ink, ow: 2 });
  if (!dead) { big("CELL TOWER BATTERIES", 410, 4, "#FFFFFF", tF); big("4-8 HOURS", 480, 11, K.yellow, tF + 0.1, { panel: K.yellow }); }
  else big("NO SIGNAL", 470, 11, K.red, p.tDead ?? 0, { panel: K.red });
}
function sTap() {
  const fl = clamp(p.flow ?? 1), tT = p.tTex ?? 99, tex = lt >= tT, c = clamp(p.cnt ?? 0);
  R(0, 0, LW, 212, "#2A3A6A"); for (let y = 0; y < 212; y += 10) { R(0, y, LW, 1, "#22305A"); for (let x = ((y / 10) % 2) * 6; x < LW; x += 12) R(x, y, 1, 10, "#22305A"); }
  R(10, 70, 56, 52, K.ink); g.save(); g.beginPath(); g.rect(12, 72, 52, 48); g.clip(); g.translate(12, 72); skyNight(48, ["#0B0A24", "#16123F", "#281D60"]); stars(14, 34, 5); g.restore();
  R(37, 70, 2, 52, K.ink); R(10, 95, 56, 2, K.ink); R(8, 122, 60, 3, "#3A4A7A");
  // candle on the sill (no power)
  R(52, 112, 4, 10, K.cream); P(53 + (blink(4) ? 1 : 0), 110, K.orange); P(53, 111, K.yellow); g.globalAlpha = 0.15; disc(54, 112, 10, K.win2); g.globalAlpha = 1;
  // counter + cabinets
  R(0, 210, LW, 6, "#E8E0D0"); R(0, 216, LW, 4, "#B8B0A0"); R(0, 220, LW, 100, "#4B3C9E"); for (let x = 0; x < LW; x += 45) { R(x, 224, 1, 96, "#2B2A6B"); R(x + 36, 240, 4, 2, "#C8C0E0"); }
  R(64, 210, 64, 9, "#5A6688"); R(66, 211, 60, 7, "#3A4668");
  // faucet
  R(96, 146, 5, 64, "#B8C4DC"); R(96, 146, 5, 64, "#B8C4DC"); R(100, 146, 1, 64, "#8A96B8"); R(96, 142, 26, 5, "#B8C4DC"); R(96, 146, 26, 1, "#8A96B8"); R(118, 147, 5, 7, "#B8C4DC");
  R(92, 136, 13, 4, "#8A96B8"); R(97, 132, 3, 4, "#8A96B8");
  // water: steady -> sputter -> single drips
  const sx = 120, y0 = 154, y1 = 211;
  if (fl > 0.05) {
    const wd = fl > 0.6 ? 3 : fl > 0.3 ? 2 : 1;
    for (let y = y0; y < y1; y++) { const seg = Math.floor((y + lt * 90) / 6); if (fl < 0.6 && rnd(seg * 1.7) > fl + 0.25) continue; R(sx - (wd >> 1) + (rnd(y + Math.floor(t * 20)) < 0.2 ? 1 : 0), y, wd, 1, rnd(y * 3 + Math.floor(t * 15)) < 0.25 ? "#BFF0FF" : "#3DA0E0"); }
    for (let i = 0; i < 4; i++) { const s2 = Math.floor(t * 12) * 4 + i; if (rnd(s2) < fl) P(sx - 5 + rnd(s2 * 3) * 10, y1 - 1 - rnd(s2 * 5) * 4, "#BFF0FF"); }
  } else { const k = (lt * 0.8) % 1; if (k < 0.7) { const y = y0 + (y1 - y0) * (k / 0.7) ** 2; R(sx, y, 1, 2, "#3DA0E0"); } else R(sx, y0, 1, 1, "#3DA0E0"); }
  // pressure gauge
  const gx = 150, gy = 150; R(gx - 1, gy + 16, 3, 60, "#8A96B8"); disc(gx, gy, 17, K.ink); disc(gx, gy, 15, "#E8EEF8");
  for (let i = 0; i <= 6; i++) { const a = Math.PI * 0.75 + i * Math.PI * 1.5 / 6; P(gx + Math.cos(a) * 13, gy + Math.sin(a) * 13, i < 2 ? K.red : K.ink); }
  const na = Math.PI * 0.75 + fl * Math.PI * 1.5 + Math.sin(t * 30) * 0.03 * fl; L(gx, gy, gx + Math.cos(na) * 11, gy + Math.sin(na) * 11, K.red); disc(gx, gy, 2, K.ink);
  blit();
  dayHud(2, "WATER");
  if (!UI) return;
  TXT(ctx, Math.round(fl * 60) + " PSI", hx(gx), hy(gy + 20), hu(3), fl < 0.3 ? K.red : "#FFFFFF", { align: "center", out: K.ink, ow: 2 });
  if (!tex) big("PUMPS: NO POWER", 450, 7, K.red, p.tPump ?? 0.5, { panel: K.red });
  else {
    big("TEXAS 2021: NEARLY", 400, 5, "#FFFFFF", tT);
    big((Math.round(15e6 * c / 1e5) * 1e5).toLocaleString("en-US"), 480, 10, K.yellow, tT + 0.05);
    big("TOLD TO BOIL WATER", 610, 5, K.cyan, tT + 0.2, { panel: K.cyan });
  }
}
function sFreezer() {
  const th = clamp(p.th ?? 0), tm = clamp(p.tm ?? 0), tN = p.tNow ?? 99;
  R(0, 0, LW, 250, "#1E2550"); for (let x = 0; x < LW; x += 30) R(x, 0, 1, 250, "#1A2048");
  R(0, 250, LW, 70, "#2A2450"); for (let y = 250; y < LH; y += 10) for (let x = ((y / 10) % 2) * 10; x < LW; x += 20) R(x, y, 10, 10, "#352E62");
  // freezer body + open door
  const fx = 26, fy = 116, fw = 86, fh = 134;
  R(fx - 1, fy - 1, fw + 2, fh + 2, K.ink); R(fx, fy, fw, fh, "#D8DCEC"); R(fx + fw - 4, fy, 4, fh, "#AEB4CC");
  R(fx + 5, fy + 5, fw - 10, fh - 14, "#4A6A9A"); R(fx + 5, fy + 5, fw - 10, 3, "#3A5A8A");
  for (const sy of [fy + 44, fy + 88]) R(fx + 5, sy, fw - 10, 2, "#C8D8F0");
  // frost (fades as it thaws)
  for (let i = 0; i < 160; i++) if (rnd(i * 3.3) > th) { const side = i % 4; const x = side < 2 ? fx + 5 + (side ? fw - 12 : 0) + Math.floor(rnd(i) * 2) : fx + 5 + rnd(i * 2) * (fw - 10), y = side < 2 ? fy + 5 + rnd(i * 2) * (fh - 14) : fy + 5 + Math.floor(rnd(i) * 3); P(x, y, "#E8F6FF"); }
  // food
  R(fx + 10, fy + 26, 22, 18, "#FF8AB8"); R(fx + 10, fy + 26, 22, 3, "#FFFFFF"); R(fx + 14, fy + 32, 14, 6, "#FFD0E0");
  R(fx + 38, fy + 30, 34, 14, "#7CFF6B"); R(fx + 38, fy + 30, 34, 2, "#4ACB3A"); for (let i = 0; i < 6; i++) disc(fx + 42 + i * 5, fy + 38, 1, "#2E8A2A");
  R(fx + 12, fy + 74, 48, 12, "#8AA0C8"); R(fx + 56, fy + 72, 10, 16, "#8AA0C8"); P(fx + 18, fy + 78, K.ink); R(fx + 22, fy + 80, 24, 1, "#6A80A8");
  R(fx + 12, fy + 116, 30, 14, "#C84A4A"); R(fx + 12, fy + 116, 30, 2, "#FF8A8A"); R(fx + 48, fy + 120, 28, 10, "#E8E0D0"); for (let i = 0; i < 4; i++) R(fx + 50 + i * 7, fy + 122, 5, 6, th > 0.5 ? "#9AC8E8" : "#FFFFFF");
  // door
  R(fx + fw, fy, 30, fh, "#C8CCDC"); R(fx + fw, fy, 2, fh, "#9AA0B8"); for (const sy of [fy + 30, fy + 70, fy + 110]) R(fx + fw + 4, sy, 24, 3, "#E8ECF8"); R(fx + fw + 24, fy + 50, 3, 40, "#8A8FB8");
  // vapour while cold, drips + puddle as it thaws
  if (th < 0.5) for (let i = 0; i < 10; i++) { const l = (lt * 0.6 + i * 0.1) % 1; g.globalAlpha = (1 - l) * 0.4 * (1 - th * 2); disc(fx + 20 + i * 6 + Math.sin(l * 6 + i) * 3, fy + fh - 10 + l * 30, 3 + l * 4, "#E8F6FF"); }
  g.globalAlpha = 1;
  if (th > 0.15) for (let i = 0; i < 8; i++) { const k = (lt * 1.3 + rnd(i) ) % 1, x = fx + 10 + i * 9, y0 = i % 2 ? fy + 46 : fy + 90; if (rnd(i * 5) < th) R(x, y0 + k * (250 - y0), 1, 2, "#8FD8FF"); }
  const pw = Math.round(th * 120); if (pw > 1) { g.globalAlpha = 0.7; R(fx + 10 - pw * 0.2, 251, pw, 2, "#3DA0E0"); R(fx + 14 - pw * 0.2, 253, pw - 8, 1, "#3DA0E0"); g.globalAlpha = 1; }
  blit();
  dayHud(3, "FREEZER");
  if (!UI) return;
  const temp = Math.round(-18 + 23 * th);
  TXT(ctx, (temp > 0 ? "+" : "") + temp + "C", hx(fx + fw + 15), hy(fy + 14), hu(3), th > 0.6 ? K.red : K.cyan, { align: "center", out: K.ink, ow: 2 });
  const left = 48 * (1 - tm), hh = Math.floor(left + 1e-6), mm = Math.min(59, Math.floor((left - hh) * 60 + 1e-6));
  big("FULL FREEZER STAYS COLD", 400, 4, "#FFFFFF", 0.1);
  big(pad2(hh) + ":" + pad2(mm), 460, 11, tm >= 0.999 ? K.red : K.cyan, 0.15, { panel: tm >= 0.999 ? K.red : K.cyan });
  if (lt >= tN) big("THAWING!", 580, 8, blink(2.5) ? K.red : "#FFFFFF", tN, { panel: K.red });
}
function sHosp() {
  const fuel = clamp(p.fuel ?? 1), tB = p.tBig ?? 0.3;
  skyNight(240); stars(70, 150, 23);
  skyline(250, 8, ["#16133C", "#1A1747", "#100E2E"], 0.0, 40, 110, 16, 28);
  R(0, 250, LW, 70, "#120F2A"); R(0, 250, LW, 2, "#2C2860");
  // hospital: the only lit building
  const hx0 = 30, top = 118;
  g.globalAlpha = 0.12; disc(80, 190, 70, K.win); g.globalAlpha = 1;
  R(hx0 - 1, top - 1, 102, 251 - top, K.ink); R(hx0, top, 100, 250 - top, "#C8CCE0"); R(hx0 + 92, top, 8, 250 - top, "#9AA0B8"); R(hx0 - 2, top - 3, 104, 3, "#8A8FB8");
  for (let yy = top + 8; yy < 228; yy += 11) for (let xx = hx0 + 6; xx < hx0 + 88; xx += 9) {
    const r = rnd(xx * 0.7 + yy * 0.13), off = fuel < 0.35 && rnd(r * 99 + Math.floor(t * 6)) < (0.35 - fuel) * 2;
    R(xx, yy, 6, 6, off ? "#2A2846" : r < 0.2 ? "#BFF8FF" : "#FFF3B0");
  }
  R(hx0 + 38, 230, 24, 20, "#BFF8FF"); R(hx0 + 49, 230, 2, 20, "#8A96B8"); R(hx0 + 34, 226, 32, 4, "#8A8FB8");
  // red cross sign
  R(66, 94, 28, 22, K.ink); R(68, 96, 24, 18, "#FFFFFF"); R(77, 98, 6, 14, K.red); R(73, 102, 14, 6, K.red); R(79, 116, 2, 4, K.ink);
  g.globalAlpha = 0.18 + 0.06 * Math.sin(t * 4); disc(80, 105, 18, K.red); g.globalAlpha = 1;
  // ambulance
  R(2, 234, 26, 12, "#E8ECF8"); R(20, 236, 8, 5, "#8FD8FF"); R(2, 239, 18, 2, K.red); R(5, 246, 4, 3, K.ink); R(20, 246, 4, 3, K.ink); R(8, 231, 6, 3, blink(3) ? K.red : K.blue);
  // generator (shaking) + exhaust
  const sh = blink(16) ? 1 : 0, gx = 136;
  R(gx + sh, 220, 40, 30, "#2E6A4A"); R(gx + sh, 220, 40, 3, "#4A9A6A"); for (let i = 0; i < 5; i++) R(gx + 4 + i * 7 + sh, 227, 4, 16, "#1E4A34"); R(gx + 30 + sh, 210, 4, 10, "#5A5F8A");
  for (let i = 0; i < 7; i++) { const l = (lt * 0.9 + i / 7) % 1; g.globalAlpha = (1 - l) * 0.6; disc(gx + 32 + Math.sin(l * 5 + i) * 4 + l * 8, 206 - l * 70, 2 + l * 7, "#4A4668"); } g.globalAlpha = 1;
  for (let x = hx0 + 100; x < gx; x++) P(x, 244, K.ink);
  blit();
  dayHud(4, "HOSPITAL");
  if (!UI) return;
  big("96 HOURS", 420, 12, K.orange, tB, { panel: K.orange });
  big("HOSPITALS MUST PLAN TO RUN ALONE", 546, 3, "#FFFFFF", tB + 0.25);
  // generator fuel gauge
  const gxH = hx(gx), gyH = hy(196), segs = 8;
  TXT(ctx, "GEN FUEL", gxH, gyH - 34, 3, fuel < 0.3 ? K.red : "#FFFFFF", { out: K.ink, ow: 2 });
  for (let i = 0; i < segs; i++) { ctx.fillStyle = K.ink; ctx.fillRect(gxH + i * 30 - 3, gyH - 3, 30, 36); ctx.fillStyle = i < Math.ceil(fuel * segs) ? (fuel < 0.3 ? (blink(3) ? K.red : "#8A1A2A") : K.orange) : "#2E2A6A"; ctx.fillRect(gxH + i * 30, gyH, 24, 30); }
}
function sGas() {
  const tF = p.tFull ?? 99;
  skyNight(200); stars(60, 120, 33);
  skyline(200, 9, ["#16133C", "#1A1747", "#100E2E"], 0.0, 30, 70, 14, 26);
  R(0, 200, LW, 46, "#1A1838");
  // canopy (lights dead)
  R(4, 112, 172, 14, "#C8C0B0"); R(4, 122, 172, 3, K.red); R(4, 112, 172, 2, "#E8E0D0"); for (let i = 0; i < 4; i++) R(18 + i * 44, 126, 10, 2, "#3A3850");
  R(28, 127, 5, 110, "#8A8FB8"); R(148, 127, 5, 110, "#8A8FB8");
  // pumps
  for (const px0 of [48, 106]) {
    R(px0 - 1, 175, 24, 62, K.ink); R(px0, 176, 22, 60, "#D8DCEC"); R(px0, 176, 22, 6, K.red); R(px0 + 3, 186, 16, 12, "#120A22");
    if (blink(1.5, px0)) redX(px0 + 11, 192, 4);
    R(px0 + 22, 196, 3, 14, "#3A3850"); R(px0 + 24, 208, 2, 20, K.ink); R(px0 + 4, 204, 14, 22, "#AEB4CC");
  }
  // queue of stranded cars
  car(6, 238, K.orange, 1); car(72, 238, K.blue, 1); car(130, 238, K.pink, 1); car(160, 238, "#7CFF6B", 1);
  // ground + underground tank (full)
  R(0, 246, LW, 74, "#2A2030"); R(0, 246, LW, 2, "#4A3A50"); for (let i = 0; i < 90; i++) P(rnd(i * 3) * LW, 250 + rnd(i * 7) * 70, "#3A2C40");
  R(58, 248, 2, 20, "#5A5F8A"); R(116, 248, 2, 20, "#5A5F8A");
  const tx0 = 26, ty0 = 268, tw0 = 128, th0 = 34;
  R(tx0 + 4, ty0 - 1, tw0 - 8, th0 + 2, K.ink); R(tx0, ty0 + 3, tw0, th0 - 6, K.ink);
  R(tx0 + 4, ty0, tw0 - 8, th0, "#5A5F8A"); R(tx0 + 1, ty0 + 4, tw0 - 2, th0 - 8, "#5A5F8A");
  for (let x = tx0 + 2; x < tx0 + tw0 - 2; x++) { const s = Math.round(ty0 + 5 + Math.sin(x * 0.2 + t * 3) * 1); R(x, s, 1, ty0 + th0 - 3 - s, x % 7 ? "#FFB13B" : "#FFD23F"); }
  blit();
  dayHud(5, "FUEL");
  if (!UI) return;
  TXT(ctx, "NO POWER", hx(90), hy(158), hu(4), K.red, { align: "center", out: K.ink, ow: 3 });
  TXT(ctx, "TANK: 100% FULL", hx(90), hy(281), hu(3), K.ink, { align: "center" });
  big("PUMPS ARE ELECTRIC", 400, 6, K.red, 0.2, { panel: K.red });
  if (lt >= tF) { big("FULL TANKS", 490, 9, K.yellow, tF); big("= USELESS", 584, 7, K.red, tF + 0.3); }
}
function sCash() {
  const tA = p.tAtm ?? 0.8, tC = p.tCash ?? 99;
  R(0, 0, LW, 250, "#3A2A5A"); for (let y = 0; y < 250; y += 6) { R(0, y, LW, 1, "#30224C"); for (let x = ((y / 6) % 2) * 7; x < LW; x += 14) R(x, y, 1, 6, "#30224C"); }
  R(0, 250, LW, 70, "#1A1630"); R(0, 250, LW, 2, "#4A3A6A");
  // ATM
  const ax = 12, ay = 104;
  R(ax - 3, ay - 3, 66, 126, K.ink); R(ax, ay, 60, 120, "#5A5F8A"); R(ax, ay, 60, 12, "#2B6BFF"); R(ax + 6, ay + 18, 48, 32, K.ink); R(ax + 8, ay + 20, 44, 28, blink(1.5) ? "#3A0E18" : "#2A0A12");
  for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 3; c2++) R(ax + 10 + c2 * 8, ay + 60 + r * 8, 6, 6, "#8A8FB8");
  R(ax + 38, ay + 62, 16, 3, K.ink); R(ax + 38, ay + 82, 16, 4, K.ink); R(ax + 6, ay + 100, 48, 4, K.ink);
  // card terminal in hand
  const X = 104, Y = 134, Wt = 44, Ht = 70;
  R(X - 1, Y - 1, Wt + 2, Ht + 2, K.ink); R(X, Y, Wt, Ht, "#2A2A3A"); R(X + 4, Y + 5, Wt - 8, 20, "#120A22");
  for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 3; c2++) R(X + 7 + c2 * 11, Y + 31 + r * 9, 8, 6, r === 3 ? [K.red, K.yellow, K.lime][c2] : "#5A5F8A");
  R(X + 8, Y - 12, 28, 12, "#E8ECF8"); R(X + 8, Y - 12, 28, 3, K.blue);
  hand(X, Y + Ht, Wt);
  // cash rain
  if (lt >= tC) for (let i = 0; i < 16; i++) { const l = since(tC) - rnd(i) * 0.5; if (l < 0) continue; const x = 10 + rnd(i * 3) * 160 + Math.sin(l * 4 + i) * 6, y = -10 + l * (60 + rnd(i * 7) * 40); if (y < 250) bill(x, y, Math.sin(l * 5 + i) * 0.6); }
  blit();
  dayHud(6, "MONEY");
  if (!UI) return;
  TXT(ctx, "OUT OF", hx(ax + 30), hy(ay + 24), hu(3), K.red, { align: "center" });
  TXT(ctx, "SERVICE", hx(ax + 30), hy(ay + 34), hu(3), K.red, { align: "center" });
  TXT(ctx, "ATM", hx(ax + 30), hy(ay + 3), hu(3), "#FFFFFF", { align: "center" });
  if (blink(2)) TXT(ctx, "DECLINED", hx(X + Wt / 2), hy(Y + 12), hu(3), K.red, { align: "center" });
  big("NO CARDS", 410, 8, K.red, 0.15);
  big("NO ATMS", 500, 8, K.red, tA);
  if (lt >= tC) big("CASH ONLY", 610, 11, K.lime, tC, { panel: K.lime });
}
function sRestart() {
  const on = clamp(p.on ?? 0), tD = p.tDays ?? 99;
  skyNight(240); stars(80, 150, 43);
  // districts light up left -> right as the black start spreads
  let x = -4, i = 0; const base = 230;
  while (x < LW + 6) {
    const w = Math.round(14 + rnd(7 + i * 1.7) * 14), h = Math.round(50 + rnd(21 + i * 2.3) * 70), lit = on > 0.12 + 0.8 * (x / LW) ? 0.95 : 0.02;
    bld(x, base, w, h, [K.bldA, K.bldB, K.dk][i % 3], K.dk, 70 + i, lit, { ant: rnd(i + 7) > 0.7 }); x += w + 1 + Math.round(rnd(i * 5 + 7) * 3); i++;
  }
  R(0, 230, LW, 90, "#120F2A"); R(0, 230, LW, 2, "#2C2860");
  // hydro dam (black-start plant) at the left
  R(0, 196, 34, 40, "#5A5F8A"); for (let k = 0; k < 4; k++) R(2 + k * 8, 200, 5, 30, "#44487A"); R(0, 192, 34, 4, "#8A8FB8");
  for (let k = 0; k < 6; k++) { const yy = 236 + ((lt * 30 + k * 6) % 30); R(4 + k * 5, yy, 3, 2, "#3DA0E0"); }
  R(24, 184, 8, 8, on > 0.03 ? K.lime : "#2A2846");
  pylon(64, 300, 70); pylon(140, 300, 70);
  const wy = (k) => 236 + (250 - 236) * k + Math.sin(k * Math.PI) * 8;
  for (let xx = 0; xx < LW; xx++) { const k = xx / LW; P(xx, wy(k), "#3A3E6A"); P(xx, wy(k) + 10, "#3A3E6A"); }
  if (on > 0.03) for (let j = 0; j < 5; j++) { const k = ((lt * 0.7 + j / 5) % 1) * Math.min(1, on * 1.2), xx = k * LW; g.globalAlpha = 0.4; R(xx - 2, wy(k) - 2, 5, 5, K.lime); g.globalAlpha = 1; R(xx - 1, wy(k), 3, 1, "#C8FFB8"); }
  blit();
  dayHud(7, "RESTART");
  if (!UI) return;
  big("BLACK START", 410, 9, K.lime, 0.2, { panel: K.lime });
  big(Math.round(on * 100) + "% RESTORED", 540, 5, "#FFFFFF", 0.4);
  if (lt >= tD) big("TAKES DAYS", 630, 8, K.yellow, tD, { panel: K.yellow });
}
function sRoof() {
  skyNight(200); stars(130, 170, 17); moon(140, 48);
  skyline(196, 4, ["#1E1A50", "#241F5E", "#171442"], 0.02, 30, 90, 12, 22);
  R(0, 196, LW, 8, "#3A3486"); R(0, 196, LW, 2, "#5D4FC0"); R(0, 204, LW, 116, "#1C1846"); for (let x = 0; x < LW; x += 20) R(x, 204, 1, 116, "#16133A");
  const kx = 62, ky = 175; spr(KID, kx, ky, KIDMAP);
  // flashlight cone
  R(kx + 10, ky + 13, 5, 3, "#5A5F8A"); g.globalAlpha = 0.22 + 0.04 * Math.sin(lt * 9);
  for (let i = 0; i < 90; i++) R(kx + 15 + i, ky + 14 - i * 0.28, 1, 2 + i * 0.56, "#FFF3B0"); g.globalAlpha = 1;
  P(kx + 15, ky + 14, "#FFFFFF");
  blit();
  card({ tag: "SURVIVAL CHECK", title: "WHICH DAY?", sub: "DAY 1 > DAY 7", col: K.yellow, subCol: K.red, icon: "warn", fill: 24 });
  if (!UI) return;
  const bob = Math.round(Math.sin(lt * 4) * 2) * 6, qx = hx(kx + 5), qy = hy(ky - 30) + bob;
  ctx.fillStyle = K.ink; ctx.fillRect(qx - 66, qy - 6, 132, 132); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(qx - 60, qy, 120, 120); ctx.fillRect(qx - 12, qy + 120, 24, 18);
  TXT(ctx, "?", qx, qy + 18, 12, K.pink, { align: "center" });
}
[sCity, sPhone, sTap, sFreezer, sHosp, sGas, sCash, sRestart, sRoof][S]();
