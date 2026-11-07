// "Pixel Night" scene kit for 044 (Carrington storm) — helpers copied from 035's draw/px.js (180x320 low-res canvas,
// 6x nearest-neighbour upscale, own 5x7 bitmap font, HUD cards, pixel big numbers), plus new scenes.
// p.s: 0 observatory · 1 flare · 2 cme · 3 aurora town · 4 reader · 5 telegraph · 6 grid (hook: p.hp) · 7 transformer
//      8 gps · 9 satellites · 10 cost · 11 near miss · 12 roof.  Common: p.z zoom, p.fx/p.fy focus, p.ui (0 hides HUD), p.gl glitch.
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
