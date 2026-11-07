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
// ============ SCENES ============
function sObs() {
  const tF = p.tFlash ?? 1.0, fl = lt >= tF;
  R(0, 0, LW, 250, "#2A1A2E"); for (let x = 0; x < LW; x += 9) R(x, 0, 1, 250, "#22142A");
  // dome slit (daylight)
  R(12, 0, 38, 66, "#0E0C26"); R(14, 0, 34, 64, "#4A86D8"); R(14, 0, 34, 22, "#6FA8F0"); disc(30, 14, 6, "#FFF6C8");
  g.globalAlpha = 0.1; for (let i = 0; i < 26; i++) R(16 + i * 0.4, 30 + i * 3, 30, 3, "#FFF6C8"); g.globalAlpha = 1;
  // telescope
  const ox = 30, oy = 46, ex = 94, ey = 140;
  L(62, 98, 40, 250, "#4A3018"); L(63, 98, 41, 250, "#4A3018"); L(62, 98, 84, 250, "#4A3018"); L(63, 98, 85, 250, "#4A3018"); L(62, 98, 63, 250, "#3A2410");
  for (let i = 0; i <= 44; i++) { const k = i / 44; disc(ox + (ex - ox) * k, oy + (ey - oy) * k, Math.round(6 - 3 * k), "#C8A050"); }
  for (let i = 0; i <= 44; i++) { const k = i / 44; P(ox + (ex - ox) * k - 2, oy + (ey - oy) * k - 3 + k * 2, "#F0D088"); }
  for (const k of [0.08, 0.4, 0.72]) disc(ox + (ex - ox) * k, oy + (ey - oy) * k, Math.round(6.5 - 3 * k), "#8A6A30");
  disc(ox, oy, 6, "#8A6A30"); disc(ox, oy, 3, "#1A1430"); R(ex - 2, ey - 1, 6, 6, "#5A4020");
  // projection screen
  R(110, 148, 68, 78, "#5A3428"); R(112, 150, 64, 74, "#F7E8C6"); R(142, 226, 4, 24, "#5A3428"); R(128, 248, 32, 2, "#5A3428");
  g.globalAlpha = 0.13; for (let i = 0; i < 26; i++) { const k = i / 26, x = ex + 3 + (144 - ex - 3) * k, y = ey + 3 + (186 - ey - 3) * k, hh = 2 + 22 * k; R(x, y - hh, 2, hh * 2, "#FFE9A0"); } g.globalAlpha = 1;
  disc(144, 186, 25, "#D86A2A"); disc(144, 186, 23, "#FFA040"); disc(143, 185, 18, "#FFC060"); disc(142, 184, 11, "#FFD27A");
  for (const [x, y, s] of [[137, 181, 3], [141, 183, 2], [147, 188, 2], [134, 184, 2], [150, 179, 1]]) { R(x - 1, y - 1, s + 1, s + 1, "#7A3A1A"); P(x, y, "#1A0A0A"); }
  if (fl) {
    const l = since(tF), r = Math.round(2 + Math.min(9, l * 28)), a = clamp(1.3 - l * 0.35);
    g.globalAlpha = a * 0.5; disc(139, 182, r + 5, "#FFFFFF"); g.globalAlpha = a; disc(138, 181, r, "#FFFFFF"); disc(145, 186, Math.round(r * 0.7), "#FFFFFF");
    for (let i = 0; i < 8; i++) { const an = i * TAU / 8 + l; if (blink(6, i)) L(139 + Math.cos(an) * (r + 2), 182 + Math.sin(an) * (r + 2), 139 + Math.cos(an) * (r + 8), 182 + Math.sin(an) * (r + 8), "#FFFFFF"); }
    g.globalAlpha = 1;
  }
  R(0, 250, LW, 70, "#3A2230"); R(0, 250, LW, 2, "#5A3428"); for (let y = 262; y < LH; y += 12) R(0, y, LW, 1, "#2E1A26");
  R(2, 214, 40, 4, "#5A3428"); R(4, 218, 3, 32, "#5A3428"); R(37, 218, 3, 32, "#5A3428"); R(8, 208, 16, 6, "#F7E8C6"); R(10, 209, 10, 1, "#8A7A6A"); R(10, 211, 8, 1, "#8A7A6A");
  R(28, 206, 2, 8, "#E8E0D0"); if (blink(3)) P(28, 205, K.orange); else P(29, 205, K.yellow);
  spr(KID, 97, 228, CARRMAP);
  SHK = fl && since(tF) < 0.45 ? 1 : 0;
  blit();
  card({ tag: "OBSERVER LOG", title: "1 SEPT 1859", sub: fl ? "WHITE FLASH ON THE SUN!" : "11:18 AM · R. CARRINGTON", col: K.orange, subCol: fl ? K.yellow : K.orange, icon: "sun", fill: fl ? 24 : 12 });
  if (UI) TXT(ctx, "SUN IMAGE", hx(144), hy(214), hu(2), "#8A5A3A", { align: "center" });
  if (fl) big("WHITE FLASH!", 360, 9, "#FFFFFF", tF, { panel: K.yellow });
}
function sFlare() {
  const tF = p.tFl ?? 0.25, tC = p.tCme ?? 1.1;
  skyNight(LH, DARK); stars(90, 200, 21);
  const cx = 90, cy = 340, r = 175, fx0 = 96, fy0 = 178;
  for (let i = 4; i >= 1; i--) { g.globalAlpha = 0.07 * (5 - i); disc(cx, cy, r + i * 5, "#FF8A3D"); } g.globalAlpha = 1;
  disc(cx, cy, r, "#E8562A"); disc(cx, cy, r - 4, "#FF8A3D"); disc(cx, cy, r - 12, "#FFB13B"); disc(cx, cy, r - 32, "#FFD23F");
  for (let i = 0; i < 320; i++) { const x = Math.floor(rnd(i * 1.3) * LW), y = Math.floor(165 + rnd(i * 2.7) * 155); if ((x - cx) ** 2 + (y - cy) ** 2 > (r - 2) ** 2) continue; P(x, y, Math.sin(t * 3 + i) > 0 ? "#FFE680" : "#F07A30"); }
  // prominence loop on the limb
  g.globalAlpha = 0.8; ring(28, 196, 10 + Math.sin(t * 2) * 1, "#FF5A3D", Math.PI * 1.05, Math.PI * 1.95); ring(28, 196, 8, "#FF8A3D", Math.PI * 1.1, Math.PI * 1.9); g.globalAlpha = 1;
  for (const [x, y, s] of [[90, 181, 3], [96, 184, 4], [103, 180, 2], [86, 186, 2]]) { R(x - 1, y - 1, s + 2, s, "#A0461E"); R(x, y, s, s - 1, "#3A1208"); }
  if (lt >= tF) {
    const l = since(tF), k = clamp(l / 0.3), r2 = Math.round(3 + 9 * k + Math.sin(l * 20));
    g.globalAlpha = 0.45; disc(fx0, fy0, r2 + 7, "#FFFFFF"); g.globalAlpha = 1; disc(fx0, fy0, r2, "#FFFFFF");
    for (let j = 0; j < 4; j++) ring(fx0, fy0 + 4, 9 + j * 5, j % 2 ? K.yellow : "#FFF6C8", Math.PI, TAU);
    for (let i = 0; i < 12; i++) { const an = i * TAU / 12 + l * 0.6, len = r2 + 6 + (blink(8, i) ? 6 : 0); L(fx0 + Math.cos(an) * (r2 + 1), fy0 + Math.sin(an) * (r2 + 1), fx0 + Math.cos(an) * len, fy0 + Math.sin(an) * len, "#FFFFFF"); }
  }
  if (lt >= tC) {
    const l = since(tC), R0 = 16 + l * 95, a0 = -Math.PI + 0.35, a1 = -0.35;
    for (let i = 0; i < 140; i++) { const a = a0 + (a1 - a0) * rnd(i), d = R0 * (0.35 + 0.62 * rnd(i * 3)); g.globalAlpha = clamp(1 - l * 0.3) * 0.8; P(fx0 + Math.cos(a) * d, fy0 + Math.sin(a) * d, rnd(i * 5) < 0.5 ? K.pink : K.orange); }
    for (let th = 0; th < 4; th++) { g.globalAlpha = clamp(1 - l * 0.3) * (1 - th * 0.2); ring(fx0, fy0, R0 - th * 1.5, th === 0 ? "#FFFFFF" : th === 1 ? K.pink : K.orange, a0, a1); }
    g.globalAlpha = 1;
  }
  SHK = lt >= tF && since(tF) < 0.5 ? 1.5 : 0;
  blit();
  card({ tag: "SPACE WEATHER", title: "SOLAR FLARE", sub: lt >= tC ? "CME LAUNCHED > EARTH" : "TYPE: WHITE-LIGHT FLARE", col: K.orange, subCol: lt >= tC ? K.pink : K.orange, icon: "sun", fill: lt >= tF ? 24 : 6 });
  if (lt >= tC) big("CME LAUNCHED", 400, 8, K.pink, tC, { panel: K.pink });
  else if (lt >= tF) big("FLARE!", 400, 13, "#FFFFFF", tF, { panel: K.yellow });
}
function sCme() {
  const cnt = clamp(p.cnt ?? 0), imp = cnt >= 0.999, tI = p.tImp ?? 99;
  skyNight(LH, DARK); stars(110, LH, 31);
  const sx = -14, sy = 60, ex = 136, ey = 204;
  for (let i = 4; i >= 1; i--) { g.globalAlpha = 0.07 * (5 - i); disc(sx, sy, 46 + i * 6, "#FF8A3D"); } g.globalAlpha = 1;
  disc(sx, sy, 46, "#FF8A3D"); disc(sx, sy, 42, "#FFB13B"); disc(sx, sy, 32, "#FFD23F");
  const ang = Math.atan2(sy - ey, sx - ex), li = lt - tI;
  const c = imp ? 0.62 + 0.08 * Math.sin(li * 14) * Math.exp(-li * 2) : 1;
  for (let j = 0; j < 3; j++) { g.globalAlpha = 0.8 - j * 0.2; ring(ex, ey, (22 + j * 7) * c, j ? "#2E8AB8" : K.cyan, ang - 1.25, ang + 1.25); } g.globalAlpha = 1;
  const D = Math.hypot(ex - sx, ey - sy), ac = Math.atan2(ey - sy, ex - sx);
  if (!imp) {
    const R0 = 52 + (D - 52 - 26) * cnt;
    for (let i = 0; i < 160; i++) { const a = ac + (rnd(i) - 0.5) * 0.9, d = 48 + (R0 - 48) * rnd(i * 3); g.globalAlpha = 0.25 + 0.5 * rnd(i * 7); P(sx + Math.cos(a) * d, sy + Math.sin(a) * d, rnd(i * 5) < 0.5 ? K.pink : K.orange); }
    for (let th = 0; th < 4; th++) { g.globalAlpha = 1 - th * 0.2; ring(sx, sy, R0 - th * 1.5, th === 0 ? "#FFFFFF" : th === 1 ? K.pink : K.orange, ac - 0.42, ac + 0.42); }
    g.globalAlpha = 1;
  }
  earth(ex, ey, 13, ang);
  if (imp) {
    if (li < 0.6) { g.globalAlpha = clamp(1 - li / 0.6); disc(ex, ey, Math.round(14 + li * 40), "#FFFFFF"); g.globalAlpha = 1; }
    for (let i = 0; i < 90; i++) { const a = ang + (rnd(i) - 0.5) * 2.6, d = 24 * c + rnd(i * 3) * 40; g.globalAlpha = 0.5 * rnd(i * 2); P(ex + Math.cos(a) * d, ey + Math.sin(a) * d, i % 2 ? K.pink : K.orange); } g.globalAlpha = 1;
    for (const s of [-1, 1]) { g.globalAlpha = 0.6 + 0.4 * Math.sin(t * 9); ring(ex, ey + s * 12, 5, K.lime, 0, TAU); ring(ex, ey + s * 12, 3, "#C8FFB8", 0, TAU); } g.globalAlpha = 1;
  }
  SHK = imp && li < 0.5 ? 1.5 : 0;
  blit();
  card({ tag: "CME ETA", title: imp ? "IMPACT" : "INCOMING", sub: "AVG SPEED 2,360 KM/S", col: K.pink, subCol: imp ? K.red : K.pink, icon: "clock", fill: Math.round(cnt * 24) });
  const hrs = 17.6 * cnt, hh = Math.floor(hrs + 1e-6), mm = Math.min(59, Math.floor((hrs - hh) * 60 + 1e-6));
  big("T+" + pad2(hh) + ":" + pad2(mm), 330, 12, imp ? K.red : K.yellow, 0.05);
  big("HOURS SUN TO EARTH", 450, 4, "#FFFFFF", 0.15);
  if (imp) big("IMPACT!", 600, 11, K.red, tI, { panel: K.red });
  if (UI) TXT(ctx, "EARTH", hx(ex), hy(ey + 18), hu(3), "#8FD8FF", { align: "center" });
}
function sAur() {
  skyNight(240); stars(70, 150, 41);
  aurora(160, 130, clamp(p.au ?? 1), 1);
  for (let x = 0; x < LW; x++) { const y = Math.round(206 + Math.sin(x * 0.04) * 4); R(x, y, 1, 50, "#141238"); }
  house(-4, 250, 34, 30, "#2A2046", "#1A1430", 1); house(34, 250, 28, 38, "#30264E", "#1E1636", 2);
  R(70, 162, 16, 88, "#261E42"); for (let i = 0; i < 26; i++) R(78 - i * 0.3, 136 + i, 1 + i * 0.6, 1, "#1A1430"); R(76, 176, 4, 6, "#FFC860"); R(77, 128, 2, 8, "#1A1430");
  house(92, 250, 30, 34, "#2A2046", "#1A1430", 3); house(126, 250, 26, 28, "#30264E", "#1E1636", 4); house(156, 250, 30, 40, "#2A2046", "#1A1430", 5);
  R(0, 250, LW, 70, "#1A1630"); for (let y = 254; y < LH; y += 5) for (let x = (y % 10); x < LW; x += 10) R(x, y, 6, 1, "#221C3C");
  for (const lx of [24, 150]) { R(lx, 216, 2, 34, "#2A2440"); R(lx - 2, 210, 6, 6, "#FFB13B"); g.globalAlpha = 0.18; disc(lx + 1, 213, 9, "#FFB13B"); g.globalAlpha = 1; }
  spr(KID, 60, 228, SILMAP); spr(KID, 108, 230, SILMAP, true);
  R(58, 220, 2, 10, "#141226"); R(118, 222, 2, 10, "#141226");
  g.globalAlpha = 0.07; R(0, 0, LW, LH, K.lime); g.globalAlpha = 1;
  blit();
  card({ tag: "AURORA ALERT", title: "SEPT 2 1859", sub: "SEEN AS FAR SOUTH AS CUBA", col: K.lime, icon: "aur", fill: 20, w: 680 });
  if (!UI) return;
  const tL = p.tLat ?? 0.3, lk = E["ease-out"](clamp(since(tL) / 1.3)), lat = 65 - (65 - 23) * lk;
  const yy = (la) => Math.round(420 + (70 - la) / 60 * 640), x = 948;
  ctx.fillStyle = K.ink; ctx.fillRect(x - 12, 396, 72, 690); ctx.fillStyle = "#17143F"; ctx.fillRect(x - 6, 402, 60, 678);
  for (let la = 70; la >= 15; la -= 5) { const y = yy(la); ctx.fillStyle = la >= lat ? (la > 45 ? K.lime : la > 30 ? "#2EE6A6" : K.pink) : "#2E2A6A"; ctx.fillRect(x, y - 12, 48, 44); }
  for (const la of [60, 45, 30]) TXT(ctx, la + "N", x - 24, yy(la) - 4, 4, "#A9A4E0", { align: "right", out: K.ink, ow: 2 });
  const my = yy(lat); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x - 20, my - 3, 88, 6);
  if (lk >= 1) { if (blink(2.5)) TXT(ctx, "CUBA!", x - 30, my - 50, 6, K.yellow, { align: "right", out: K.ink, ow: 3 }); TXT(ctx, "23N", x - 30, my + 12, 4, "#FFFFFF", { align: "right", out: K.ink, ow: 2 }); }
  TXT(ctx, "AURORA", x + 24, 350, 4, K.lime, { align: "center", out: K.ink, ow: 2 });
}
function sRead() {
  skyNight(LH, ["#0B0A24", "#100E31", "#16123F", "#1E174F", "#281D60"]); stars(60, 120, 51);
  aurora(230, 200, 1, 7);
  for (let i = 0; i < 6; i++) house(-6 + i * 32, 320, 28, 40 + (i % 3) * 8, "#1E1838", "#140F28", 20 + i, 0.4);
  // man in top hat
  R(56, 100, 68, 150, "#2A2440"); R(56, 100, 68, 3, "#3A3458"); R(88, 100, 4, 60, "#1E1A34");
  R(84, 95, 12, 6, "#FFFFFF"); R(88, 97, 4, 6, K.brick);
  R(80, 72, 20, 24, K.skin); R(80, 74, 3, 18, "#5A3A2A"); R(97, 74, 3, 18, "#5A3A2A"); R(85, 82, 3, 1, K.ink); R(92, 82, 3, 1, K.ink); R(84, 79, 5, 1, "#5A3A2A"); R(91, 79, 5, 1, "#5A3A2A"); R(85, 88, 10, 2, "#5A3A2A"); R(89, 85, 2, 2, K.skin2);
  R(74, 68, 32, 5, "#14101E"); R(79, 40, 22, 28, "#14101E"); R(79, 62, 22, 3, "#5A1F2A"); R(80, 41, 2, 20, "#2A2440");
  // newspaper
  const by = Math.round(Math.sin(lt * 2) * 1);
  R(44, 116 + by, 92, 74, "#C8B890"); R(46, 118 + by, 88, 70, "#F7E8C6"); R(90, 118 + by, 1, 70, "#D8C8A0");
  for (let c = 0; c < 4; c++) for (let l = 0; l < 6; l++) R(50 + c * 21, 150 + by + l * 6, 17 - ((l * 3 + c) % 4) * 2, 2, "#8A7A6A");
  R(50, 133 + by, 80, 1, "#5A4A3A");
  R(36, 140 + by, 10, 14, K.skin); R(134, 140 + by, 10, 14, K.skin); R(36, 152 + by, 10, 2, K.skin2); R(134, 152 + by, 10, 2, K.skin2);
  g.globalAlpha = 0.2; R(46, 118 + by, 88, 16, K.lime); R(80, 72, 20, 10, K.lime); R(79, 40, 22, 28, K.lime); g.globalAlpha = 1;
  blit();
  card({ tag: "SEPT 2 1859 · NIGHT", title: "NIGHT READING", sub: "LIGHT SOURCE: AURORA", col: K.lime, icon: "aur", fill: 18 });
  if (!UI) return;
  TXT(ctx, "THE EVENING NEWS", hx(90), hy(121 + by), 3, "#3A2A1A", { align: "center" });
  TXT(ctx, "AURORA!", hx(90), hy(137 + by) - 54, 8, "#1A1010", { align: "center" });
  big("NO LAMP NEEDED", 1190, 7, K.lime, p.tBig ?? 0.6, { panel: K.lime });
}
function sTele() {
  const tN = p.tNoBat ?? 1.5, nb = lt >= tN;
  R(0, 0, LW, 250, "#3A2230"); for (let y = 0; y < 180; y += 10) R(0, y, LW, 1, "#2E1A26"); R(0, 180, LW, 70, "#2E1A26"); R(0, 180, LW, 2, "#5A3428");
  R(118, 38, 54, 64, "#1A1414"); g.save(); g.beginPath(); g.rect(121, 41, 48, 58); g.clip(); skyNight(100, ["#0B0A24", "#16123F", "#281D60"]); aurora(96, 52, 1, 3); g.restore();
  R(144, 41, 2, 58, "#1A1414"); R(121, 69, 48, 2, "#1A1414");
  const W1 = [[121, 56], [40, 56], [40, 190]], W2 = [[121, 62], [46, 62], [46, 190]];
  const path = (pts, k) => { const segs = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); tot += d; } let d = k * tot; for (let i = 1; i < pts.length; i++) { if (d <= segs[i - 1]) { const f = d / segs[i - 1]; return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f]; } d -= segs[i - 1]; } return pts[pts.length - 1]; };
  for (const Wp of [W1, W2]) for (let i = 1; i < Wp.length; i++) L(Wp[i - 1][0], Wp[i - 1][1], Wp[i][0], Wp[i][1], "#141010");
  for (const ix of [70, 100]) { R(ix - 2, 53, 5, 4, "#7FD8C8"); R(ix - 2, 59, 5, 4, "#7FD8C8"); }
  for (let i = 0; i < 4; i++) { const k = (lt * 0.9 + i / 4) % 1; const [x, y] = path(i % 2 ? W1 : W2, k); R(x - 1, y - 1, 3, 3, K.yellow); P(x, y, "#FFFFFF"); }
  // operator (behind desk)
  spr(KID, 16, 176, OPMAP);
  // desk
  R(0, 196, LW, 8, "#6A4030"); R(0, 196, LW, 2, "#8A5A40"); R(0, 204, LW, 46, "#4A2A20"); R(0, 250, LW, 70, "#2A1620"); for (let x = 0; x < LW; x += 16) R(x, 250, 1, 70, "#22121A");
  const morse = [1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0], down = morse[Math.floor(lt * 7) % morse.length] === 1;
  R(50, 192, 36, 4, "#4A3018"); R(66, 189, 4, 3, "#8A6A30"); R(54, 187 + (down ? 2 : 0), 30, 2, "#C8A050"); R(52, 185 + (down ? 2 : 0), 6, 4, "#1A1414");
  R(96, 192, 24, 4, "#4A3018"); R(99, 184, 5, 8, "#8A2A2A"); R(108, 184, 5, 8, "#8A2A2A"); R(96, 182 + (down ? 1 : 0), 22, 2, "#C8A050");
  // battery jars + loose wire
  for (let i = 0; i < 3; i++) { const x = 130 + i * 14; g.globalAlpha = 0.6; R(x, 176, 11, 20, "#7FD8C8"); g.globalAlpha = 1; R(x + 1, 183, 9, 12, "#3A6A8A"); R(x + 3, 170, 1, 7, "#8A8A8A"); R(x + 7, 170, 1, 7, "#B87333"); }
  L(133, 170, 124, 160, "#141010"); L(124, 160, 121, 168, "#141010");
  if (nb && blink(2)) redX(150, 160, 5);
  // sparks
  const nS = nb ? 3 : 5;
  for (let i = 0; i < nS; i++) { const seed = Math.floor(t * 9) * 7 + i; if (rnd(seed) < 0.55) { const [x, y] = path(i % 2 ? W1 : W2, rnd(seed * 3)); spark(Math.round(x), Math.round(y), 2 + Math.floor(rnd(seed * 5) * 3)); } }
  if (blink(5)) { spark(56, 186, 4, "#FFFFFF"); g.globalAlpha = 0.3; disc(56, 186, 8, K.yellow); g.globalAlpha = 1; }
  SHK = blink(5) && !nb ? 0.5 : 0;
  blit();
  card({ tag: "TELEGRAPH OFFICE", title: nb ? "NO BATTERY" : "LINES SPARK", sub: nb ? "STILL SENDING MESSAGES!" : "SHOCKS + SPARKS ON WIRES", col: K.yellow, subCol: nb ? K.lime : K.yellow, icon: "bolt", fill: nb ? 24 : 16 });
  if (!UI) return;
  if (!nb) { if (blink(3)) big("ZAP!", 420, 13, K.yellow, p.tZap ?? 0.2); }
  else { big("BATTERY: OFF", 380, 7, K.red, tN, { panel: K.red }); big("STILL WORKING!", 520, 7, K.lime, tN + 0.25); }
  if (nb) TXT(ctx, "UNPLUGGED", hx(150), hy(205), hu(3), K.red, { align: "center", out: K.ink, ow: 2 });
}
function pylon(x, base, h) {
  const c = "#5A5F8A", top = base - h;
  L(x - 9, base, x - 2, top, c); L(x + 9, base, x + 2, top, c);
  for (let i = 0; i < 8; i++) { const y0 = base - i * h / 8, y1 = base - (i + 1) * h / 8, w0 = 9 - 7 * i / 8, w1 = 9 - 7 * (i + 1) / 8; L(x - w0, y0, x + w1, y1, "#44487A"); L(x + w0, y0, x - w1, y1, "#44487A"); }
  R(x - 13, top + 6, 26, 2, c); R(x - 10, top + 16, 20, 2, c); R(x - 1, top - 4, 2, 4, c);
}
function sGrid() {
  const hk = !!p.hp, hp = hk ? clamp(1 - (p.drain ?? 0)) : 1;
  skyNight(240); stars(70, 150, 51);
  aurora(150, 120, 1, 9);
  skyline(232, 2, ["#1E1A50", "#241F5E", "#171442"], 0.35 * hp, 50, 120, 12, 24);
  skyline(250, 5, [K.bldA, K.bldB, K.dk], 0.8 * hp, 40, 105, 18, 30);
  R(0, 250, LW, 70, "#120F2A"); R(0, 250, LW, 2, "#2C2860");
  pylon(30, 320, 170); pylon(150, 310, 150);
  const wires = [];
  for (const [ax, bx, dy] of [[-13, -13, 6], [13, 13, 6], [-10, -10, 16], [10, 10, 16]]) wires.push([[30 + ax, 150 + dy], [150 + bx, 160 + dy]]);
  const wy = (w, k) => w[0][1] + (w[1][1] - w[0][1]) * k + Math.sin(k * Math.PI) * 9;
  wires.forEach((w) => { for (let x = 0; x < LW; x++) { const k = (x - w[0][0]) / (w[1][0] - w[0][0]); if (k < 0 || k > 1) continue; P(x, wy(w, k), "#3A3E6A"); } L(0, w[0][1] + 4, w[0][0], w[0][1], "#3A3E6A"); L(w[1][0], w[1][1], LW, w[1][1] + 3, "#3A3E6A"); });
  if (hp > 0.05) wires.forEach((w, wi) => { for (let j = 0; j < 4; j++) { const k = (lt * 1.4 + j / 4 + wi * 0.13) % 1, x = w[0][0] + (w[1][0] - w[0][0]) * k, y = wy(w, k); g.globalAlpha = 0.35; R(x - 2, y - 2, 5, 5, K.red); g.globalAlpha = 1; R(x - 1, y, 3, 1, K.yellow); P(x, y, "#FFFFFF"); } });
  for (let i = 0; i < 3; i++) { const s2 = Math.floor(t * 8) * 5 + i; if (rnd(s2) < 0.5) { const w = wires[Math.floor(rnd(s2 * 3) * 4)], k = rnd(s2 * 7); spark(Math.round(w[0][0] + (w[1][0] - w[0][0]) * k), Math.round(wy(w, k)), 3); } }
  blit();
  if (hk) {
    const x = 90, y = 470, w = 900, segs = 20;
    ctx.fillStyle = K.ink; ctx.fillRect(x - 12, y - 12, w + 24, 250); ctx.fillStyle = hp > 0.6 ? K.cyan : K.red; ctx.fillRect(x - 6, y - 6, w + 12, 238);
    ctx.fillStyle = K.ink; ctx.fillRect(x, y, w, 226); ctx.fillStyle = "#17143F"; ctx.fillRect(x + 6, y + 6, w - 12, 214);
    TXT(ctx, "PLAYER: EARTH", x + 30, y + 24, 4, "#A9A4E0");
    TXT(ctx, hp > 0.02 ? "POWER GRID" : "BLACKOUT", x + 30, y + 64, 9, hp > 0.02 ? "#FFFFFF" : K.red, { sh: "#000000" });
    TXT(ctx, Math.round(hp * 100) + "%", x + w - 30, y + 64, 9, hp > 0.6 ? K.lime : K.red, { align: "right", sh: "#000000" });
    for (let i = 0; i < segs; i++) { const on = i < hp * segs; ctx.fillStyle = on ? (hp > 0.6 ? K.lime : K.red) : "#2E2A6A"; ctx.fillRect(x + 30 + i * ((w - 60) / segs), y + 150, (w - 60) / segs - 8, 40); }
    return;
  }
  card({ tag: "SAME STORM, TODAY", title: "POWER GRID", sub: "INDUCED CURRENT: SURGING", col: K.red, icon: "bolt", fill: Math.min(24, Math.round(6 + lt * 9)) });
  big("1859 > TODAY", 380, 9, K.yellow, 0.1, { panel: K.yellow });
}
function sTrans() {
  const heat = clamp(p.heat ?? 0), tB = p.tBoom ?? 99, boom = lt >= tB, tW = p.tWait ?? 99, lb = lt - tB;
  skyNight(200); stars(50, 140, 61);
  skyline(204, 7, ["#1E1A50", "#241F5E", "#171442"], boom ? (lb < 0.3 && blink(10) ? 0.6 : 0.03) : 0.75, 30, 80, 14, 26);
  R(0, 204, LW, 116, "#141230"); for (let i = 0; i < 80; i++) P(rnd(i * 3) * LW, 210 + rnd(i * 5) * 100, "#24204A");
  const x0 = 44 + (heat > 0.6 && !boom && blink(16) ? 1 : 0), col = boom ? "#2A1A22" : heat < 0.33 ? "#5A6A8A" : heat < 0.66 ? "#8A5A6A" : "#C8442A";
  if (heat > 0.35 && !boom) { g.globalAlpha = (heat - 0.35) * 0.55 * (0.8 + 0.2 * Math.sin(t * 12)); disc(x0 + 46, 190, 62, K.red); g.globalAlpha = 1; }
  for (const b of [x0 + 18, x0 + 46, x0 + 74]) { L(b, 40, b, 116, "#3A3E6A"); for (let k = 0; k < 7; k++) R(b - 3 + (k % 2), 146 - k * 4, 6 - (k % 2) * 2, 3, boom ? "#4A4458" : "#C8D0E0"); R(b - 1, 114, 2, 4, "#8A8FB8"); }
  R(x0 - 1, 149, 94, 82, K.ink); R(x0, 150, 92, 80, col);
  for (let i = 0; i < 10; i++) R(x0 + 6 + i * 8.4, 160, 4, 60, boom ? "#1E1218" : heat < 0.33 ? "#4A5878" : heat < 0.66 ? "#7A4A5A" : "#A8341E");
  for (const s of [-1, 1]) for (let f = 0; f < 6; f++) R(s < 0 ? x0 - 12 : x0 + 92, 156 + f * 11, 12, 6, boom ? "#24161C" : "#4A5878");
  R(x0 + 38, 196, 16, 14, K.yellow); TXT(g, "!", x0 + 44, 199, 1, K.ink);
  if (heat > 0.5 && !boom) for (let i = 0; i < 40; i++) { const x = x0 + rnd(i * 3 + Math.floor(t * 12)) * 92, y = 150 + rnd(i * 5 + Math.floor(t * 12)) * 80; P(x, y, rnd(i) < 0.5 ? K.orange : K.yellow); }
  const nSm = Math.round((boom ? 1 : heat) * 12);
  for (let i = 0; i < nSm; i++) { const l = (lt * 0.5 + i * 0.083) % 1, x = x0 + 46 + Math.sin(i * 3 + lt) * (6 + l * 22), y = 146 - l * 120, r = Math.round(3 + l * 8); g.globalAlpha = (1 - l) * 0.7; disc(x, y, r, boom ? "#2A2438" : "#4A4668"); } g.globalAlpha = 1;
  if (heat > 0.5 && !boom) for (let i = 0; i < 3; i++) { const s2 = Math.floor(t * 10) * 3 + i; if (rnd(s2) < 0.6) spark(x0 + 18 + 28 * Math.floor(rnd(s2 * 2) * 3), 118 + Math.floor(rnd(s2 * 4) * 26), 3); }
  if (boom) {
    if (lb < 0.9) { const r = Math.round(10 + Math.min(1, lb / 0.5) * 90), a = clamp(1 - lb / 0.9); g.globalAlpha = a; disc(x0 + 46, 170, r, K.orange); disc(x0 + 46, 170, Math.round(r * 0.7), K.yellow); disc(x0 + 46, 170, Math.round(r * 0.4), "#FFFFFF"); g.globalAlpha = 1; }
    for (let i = 0; i < 16; i++) { const fh = 8 + rnd(i + Math.floor(t * 12)) * 22 * clamp(lb / 0.4), x = x0 + 4 + i * 5.6; R(x, 150 - fh, 5, fh, K.red); R(x + 1, 150 - fh * 0.7, 3, fh * 0.7, K.orange); R(x + 2, 150 - fh * 0.35, 1, fh * 0.35, K.yellow); }
    for (let i = 0; i < 12; i++) { const l = lb * 1.2, a = rnd(i) * TAU; if (l < 1.2) R(x0 + 46 + Math.cos(a) * l * 70, 170 + Math.sin(a) * l * 70 + l * l * 40, 2, 2, "#3A2A2A"); }
  }
  R(0, 252, LW, 2, "#5A5F8A"); for (let x = 0; x < LW; x += 4) for (let y = 256; y < 310; y += 4) P(x + ((y >> 2) % 2) * 2, y, "#3A3E6A"); for (let x = 4; x < LW; x += 34) R(x, 250, 2, 64, "#5A5F8A");
  SHK = boom && lb < 0.6 ? 2 : heat > 0.7 && !boom ? 0.3 : 0;
  blit();
  card({ tag: "SUBSTATION", title: "TRANSFORMER", sub: boom ? "STATUS: BURNED OUT" : heat > 0.6 ? "TEMP: CRITICAL" : "LOAD: OVERHEATING", col: K.red, subCol: boom || heat > 0.6 ? K.red : K.orange, icon: "bolt", fill: boom ? 24 : Math.round(heat * 24) });
  if (boom && lt < tW) big("BURNED OUT", 380, 11, K.red, tB, { panel: K.red });
  if (lt >= tW) { big("REPLACEMENT", 350, 6, "#FFFFFF", tW); big("12+ MONTHS", 450, 11, K.yellow, tW + 0.1, { panel: K.yellow }); }
}
function sGps() {
  const gl = clamp(p.glit ?? 0);
  R(0, 0, LW, LH, "#0F2A22");
  R(0, 0, 26, 52, "#1A1838"); for (let i = 0; i < 8; i++) R(2 + (i % 3) * 8, 3 + Math.floor(i / 3) * 16, 6, 12, i % 2 ? "#3A3486" : "#2B2A6B");
  R(26, 0, 8, LH, "#2A2860"); R(0, 52, LW, 8, "#2A2860"); for (let y = 0; y < LH; y += 10) R(29, y, 2, 5, "#FFD23F88"); for (let x = 0; x < LW; x += 10) R(x, 55, 5, 2, "#FFD23F88");
  R(40, 0, 136, 46, "#163A2E"); for (let i = 0; i < 9; i++) disc(50 + i * 15, 18 + (i % 2) * 10, 5, "#1E5A3A");
  const xr = 130, yT = Math.max(76, 214 - lt * 24);
  const wob = (y) => gl * (Math.sin(y * 0.09 + 1) * 7 + Math.sin(y * 0.23) * 3);
  R(40, 66, 136, 250, "#3A2A1E");
  for (let i = 0; i < 15; i++) { const x = 46 + i * 6; if (x < xr) R(x, 66, 2, 250, "#2E8A4A"); else for (let y = 66; y < LH; y += 3) P(x, y, "#4A3626"); }
  for (let y = Math.round(yT); y < LH; y++) R(xr + wob(y), y, 2, 1, K.lime);
  const tx = Math.round(xr + wob(yT)) - 4, ty = Math.round(yT) - 8;
  R(tx, ty, 9, 10, "#2EA84A"); R(tx + 2, ty + 1, 5, 4, "#8FD8FF"); R(tx - 2, ty + 6, 3, 6, K.ink); R(tx + 8, ty + 6, 3, 6, K.ink); R(tx - 1, ty - 1, 2, 3, K.ink); R(tx + 8, ty - 1, 2, 3, K.ink); P(tx + 4, ty - 2, K.yellow);
  const q = Math.floor(t * 5), pxP = tx + 4 + gl * (rnd(q) - 0.5) * 70, pyP = ty - 14 + gl * (rnd(q + 7) - 0.5) * 50;
  for (let k = 1; k <= 3; k++) { const q2 = q - k; g.globalAlpha = 0.25; R(tx + 4 + gl * (rnd(q2) - 0.5) * 70 - 2, ty - 14 + gl * (rnd(q2 + 7) - 0.5) * 50 - 2, 5, 5, K.red); } g.globalAlpha = 1;
  if (blink(3)) ring(pxP, pyP + 2, 4 + gl * 18, K.cyan);
  spr(["..rrr..", ".rrrrr.", "rrwwwrr", "rrwwwrr", ".rrrrr.", "..rrr..", "...r..."], Math.round(pxP) - 3, Math.round(pyP) - 3, { r: K.red, w: "#FFFFFF" });
  GLX = gl > 0.3 && rnd(Math.floor(t * 8)) < 0.3 ? 0.4 * gl : 0;
  blit();
  card({ tag: "NAVIGATION", title: "GPS DRIFT", sub: "MAY 2024: TRACTORS OFF COURSE", col: K.cyan, subCol: gl > 0.2 ? K.orange : K.cyan, icon: "sat", fill: Math.round(24 - gl * 18), w: 720 });
  if (!UI) return;
  if (gl > 0.15 && blink(1.6)) big("RECALCULATING...", 380, 6, "#FFFFFF", p.tG ?? 0.4, { panel: K.cyan });
  TXT(ctx, "YOU?", hx(pxP) + 30, hy(pyP) - 30, 4, "#FFFFFF", { out: K.ink, ow: 2 });
}
function sSat() {
  const tH = p.tHit ?? 0.7, hit = lt >= tH, lh = lt - tH;
  skyNight(LH, DARK); stars(100, LH, 71);
  for (let i = 0; i < 130; i++) { const k = (lt * 0.8 + rnd(i)) % 1, x = -30 + k * 240, y = rnd(i * 7) * 230 - 20 + k * 50; g.globalAlpha = 0.6; R(x, y, 3, 1, [K.pink, K.orange, K.yellow][i % 3]); } g.globalAlpha = 1;
  const ecx = 90, ecy = 480, er = 230;
  for (let i = 3; i >= 1; i--) { g.globalAlpha = 0.12 * (4 - i); disc(ecx, ecy, er + i * 3, "#3DE0FF"); } g.globalAlpha = 1;
  disc(ecx, ecy, er, "#12285E");
  for (let i = 0; i < 260; i++) { const x = Math.floor(rnd(i * 1.7) * LW), y = Math.floor(250 + rnd(i * 2.3) * 70); if ((x - ecx) ** 2 + (y - ecy) ** 2 < (er - 2) ** 2) R(x, y, 2, 1, rnd(i * 9) < 0.5 ? "#1E3A6A" : "#163A2E"); }
  for (let x = 0; x < LW; x++) { const y = ecy - Math.sqrt(er * er - (x - ecx) ** 2); g.globalAlpha = 0.35 + 0.3 * Math.sin(x * 0.2 + t * 4); R(x, y - 9, 1, 8, K.lime); g.globalAlpha = 0.25; R(x, y - 14, 1, 5, K.pink); } g.globalAlpha = 1;
  satS(30 + lt * 6, 110, 0.2); satS(150 - lt * 4, 72, -0.3);
  const hx0 = 95 + (hit ? lh * 6 : 0), hy0 = 168 + (hit ? lh * lh * 6 : 0);
  satS(hx0, hy0, hit ? lh * 3.5 : 0.1, hit ? 1 : 0);
  if (hit) { for (let i = 0; i < 3; i++) { const s2 = Math.floor(t * 12) * 3 + i; if (rnd(s2) < 0.7) spark(Math.round(hx0 + (rnd(s2 * 2) - 0.5) * 24), Math.round(hy0 + (rnd(s2 * 3) - 0.5) * 12), 3); } if (lh < 0.3) { g.globalAlpha = 1 - lh / 0.3; disc(hx0, hy0, 18, "#FFFFFF"); g.globalAlpha = 1; } }
  GLX = hit && rnd(Math.floor(t * 10)) < 0.25 ? 0.35 : 0;
  SHK = hit && lh < 0.4 ? 1 : 0;
  blit();
  card({ tag: "ORBIT", title: "SATELLITES", sub: hit ? "STATUS: GLITCHING" : "STATUS: NOMINAL", col: K.pink, subCol: hit ? K.red : K.lime, icon: "sat", fill: hit ? 8 : 24 });
  if (!UI) return;
  if (hit && blink(3)) TXT(ctx, "SAT-07: ERROR", hx(hx0), hy(hy0) + 70, 4, K.red, { align: "center", out: K.ink, ow: 2 });
  const tf = p.tFact ?? tH + 0.5;
  if (lt >= tf) { big("2022: 38 STARLINKS LOST", 380, 5, K.yellow, tf, { panel: K.yellow }); big("TO A MINOR STORM", 470, 4, "#FFFFFF", tf + 0.15); }
}
function sCost() {
  const c = clamp(p.cnt ?? 0);
  skyNight(240); stars(80, 170, 81); aurora(150, 110, 0.8, 11);
  skyline(250, 5, [K.bldA, K.bldB, K.dk], 0.05, 40, 105, 18, 30);
  R(0, 250, LW, 70, "#120F2A"); R(0, 250, LW, 2, "#2C2860");
  for (let i = 0; i < 8; i++) { const n = Math.floor(c * (6 + rnd(i * 3) * 10)), x = 6 + i * 21; for (let k = 0; k < n; k++) { R(x, 316 - k * 3, 16, 3, k % 2 ? "#C89A2A" : K.yellow); R(x, 316 - k * 3, 16, 1, "#FFF2A0"); } }
  blit();
  card({ tag: "DAMAGE REPORT", title: "THE BILL", sub: "US ESTIMATE · LLOYD'S 2013", col: K.yellow, icon: "cash", fill: Math.round(c * 24) });
  if (!UI) return;
  const v = Math.round(2.6e12 * c / 1e9) * 1e9;
  big("UP TO", 330, 6, "#FFFFFF", 0.05);
  big("$" + v.toLocaleString("en-US"), 430, 8, K.yellow, 0.1);
  const tr = p.tRange ?? 1.2;
  big("$0.6 - 2.6 TRILLION", 580, 6, K.orange, tr, { panel: K.orange });
  big("20-40 MILLION PEOPLE AT RISK", 700, 4, "#FFFFFF", tr + 0.2);
}
function sMiss() {
  const tC = p.tCme ?? 0.3, tM = p.tMiss ?? 1.2;
  skyNight(LH, DARK); stars(120, LH, 91);
  const cx = 90, cy = 142, R0 = 64;
  for (let i = 4; i >= 1; i--) { g.globalAlpha = 0.08 * (5 - i); disc(cx, cy, 10 + i * 4, "#FF8A3D"); } g.globalAlpha = 1;
  disc(cx, cy, 10, "#FFB13B"); disc(cx, cy, 7, "#FFD23F");
  for (let i = 0; i < 200; i++) if (i % 3) { const a = i * TAU / 200; P(cx + Math.cos(a) * R0, cy + Math.sin(a) * R0, "#8A8FB8"); }
  const aE = Math.PI / 2 - lt * 0.03, aS = Math.PI / 2 - 2.11;
  const ex = cx + Math.cos(aE) * R0, ey = cy + Math.sin(aE) * R0, sx = cx + Math.cos(aS) * R0, sy = cy + Math.sin(aS) * R0;
  g.globalAlpha = blink(1.5) ? 1 : 0.45; for (const s of [-0.22, 0.22]) for (let d = 12; d < R0 + 8; d += 4) P(cx + Math.cos(Math.PI / 2 + s) * d, cy + Math.sin(Math.PI / 2 + s) * d, "#FF3B4E"); g.globalAlpha = 1;
  if (lt >= tC) {
    const rf = Math.min(R0 + 22, 12 + (lt - tC) * 70);
    for (let i = 0; i < 120; i++) { const a = aS + (rnd(i) - 0.5) * 0.6, d = 12 + (rf - 12) * rnd(i * 3); g.globalAlpha = 0.6; P(cx + Math.cos(a) * d, cy + Math.sin(a) * d, i % 2 ? K.pink : K.orange); }
    for (let th = 0; th < 3; th++) { g.globalAlpha = 1 - th * 0.25; ring(cx, cy, rf - th * 1.5, th ? K.pink : "#FFFFFF", aS - 0.32, aS + 0.32); } g.globalAlpha = 1;
    if (rf >= R0 && blink(6)) { g.globalAlpha = 0.6; disc(sx, sy, 6, "#FFFFFF"); g.globalAlpha = 1; }
  }
  R(sx - 2, sy - 2, 4, 4, "#E8B84A"); R(sx - 6, sy - 1, 4, 2, "#2B4BB8"); R(sx + 2, sy - 1, 4, 2, "#2B4BB8");
  earth(Math.round(ex), Math.round(ey), 6, aE + Math.PI);
  blit();
  card({ tag: "JULY 23, 2012", title: "NEAR MISS", sub: "AS STRONG AS 1859", col: K.orange, icon: "warn", fill: 20 });
  if (!UI) return;
  TXT(ctx, "EARTH", hx(ex), hy(ey + 10), 4, "#8FD8FF", { align: "center", out: K.ink, ow: 2 });
  TXT(ctx, "STEREO-A", hx(sx) - 10, hy(sy) - 70, 4, "#FFFFFF", { align: "center", out: K.ink, ow: 2 });
  if (lt >= tC + 1.1 && blink(3)) TXT(ctx, "HIT!", hx(sx) + 40, hy(sy) + 20, 5, K.red, { out: K.ink, ow: 2 });
  TXT(ctx, "1 WEEK EARLIER", hx(cx), hy(cy + 34), 4, K.red, { align: "center", out: K.ink, ow: 2 });
  big("MISSED US BY 1 WEEK", 310, 5, K.yellow, tM, { panel: K.yellow });
}
function sRoof() {
  skyNight(200); stars(100, 170, 17);
  aurora(150, 130, 1, 13);
  skyline(196, 4, ["#1E1A50", "#241F5E", "#171442"], 0.04, 30, 90, 12, 22);
  R(0, 196, LW, 8, "#3A3486"); R(0, 196, LW, 2, "#5D4FC0"); R(0, 204, LW, 116, "#1C1846");
  for (let x = 0; x < LW; x += 20) R(x, 204, 1, 116, "#16133A");
  R(130, 220, 34, 22, "#2A2860"); R(132, 222, 30, 18, "#211E50"); for (let i = 0; i < 5; i++) R(134 + i * 6, 224, 3, 14, "#16133A");
  g.globalAlpha = 0.08; R(0, 0, LW, LH, K.lime); g.globalAlpha = 1;
  const kx = 82, ky = 175; spr(KID, kx, ky, KIDMAP);
  R(kx + 7, ky + 13, 3, 4, "#BFF8FF"); g.globalAlpha = 0.3 + 0.15 * Math.sin(lt * 8); disc(kx + 8, ky + 12, 6, K.cyan); g.globalAlpha = 1;
  blit();
  card({ tag: "STORM WATCH", title: "NEXT ONE?", sub: "WOULD YOU BE READY?", col: K.lime, subCol: K.yellow, icon: "aur", fill: 12 });
  if (!UI) return;
  big("MAY 2024: AURORAS", 330, 4, "#FFFFFF", p.tMay ?? 0.4); big("AS FAR SOUTH AS FLORIDA", 380, 4, K.lime, (p.tMay ?? 0.4) + 0.1);
  const bob = Math.round(Math.sin(lt * 4) * 2) * 6, qx = hx(kx + 5), qy = hy(ky - 26) + bob;
  ctx.fillStyle = K.ink; ctx.fillRect(qx - 66, qy - 6, 132, 132); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(qx - 60, qy, 120, 120); ctx.fillRect(qx - 12, qy + 120, 24, 18);
  TXT(ctx, "?", qx, qy + 18, 12, K.pink, { align: "center" });
}
[sObs, sFlare, sCme, sAur, sRead, sTele, sGrid, sTrans, sGps, sSat, sCost, sMiss, sRoof][S]();
