// "Pixel Night" scene kit for 058 (no sleep for 11 days) — helpers copied verbatim from 054/044/035 draw/px.js (180x320 low-res
// canvas, 6x nearest-neighbour upscale, own 5x7 bitmap font, HUD cards, pixel big numbers) + new 058 section at the bottom:
// topHud (giant DAY/HOUR counter + HOURS AWAKE ticker + PLAYER ENERGY bar) and bedroom / microsleep / hallucination scenes.
// p.s: 0 bedroom intro (hook: p.hp) · 1 hour 17 BAC · 2 microsleep face · 3 day 3 desk · 4 hallucination · 5 record
//      6 recovery sleep · 7 don't-try-this · 8 closing question
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
// ============ 058: no sleep for 11 days ============
const HRS = p.hrs ?? 0;
const energyOf = (h) => clamp(1 - Math.pow(clamp(h / 264), 0.6));
const ENC = (e) => (e > 0.6 ? K.lime : e > 0.3 ? K.orange : K.red);
// giant counter panel: label ("DAY 4" / "HOUR 17"), tag, hours-awake ticker and the PLAYER ENERGY bar
function topHud(label, tag, hrs, en, col) {
  if (!UI) return;
  const x = 48, y = 84, w = 984, h = 262;
  ctx.save(); ctx.globalAlpha = E["ease-out"](clamp(lt / 0.2));
  ctx.fillStyle = "rgba(5,4,18,0.6)"; ctx.fillRect(x + 12, y + 12, w, h);
  ctx.fillStyle = K.ink; ctx.fillRect(x - 6, y - 6, w + 12, h + 12);
  ctx.fillStyle = col; ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  ctx.fillStyle = K.ink; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#17143F"; ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
  const L0 = String(label).length, uMax = Math.min(17, Math.floor(520 / (L0 * 6 - 1)));
  const pop = E.back(clamp(lt / 0.32)), u = Math.max(5, Math.round(uMax * (0.55 + 0.45 * pop)));
  const fl = lt < 0.35 && blink(10);
  TXT(ctx, label, x + 36, y + 22 + (17 - u) * 3.5, u, fl ? "#FFFFFF" : col, { out: K.ink, ow: 4 });
  TXT(ctx, "HOURS AWAKE", x + w - 36, y + 22, 3, "#A9A4E0", { align: "right" });
  TXT(ctx, "T+" + String(Math.floor(hrs)).padStart(3, "0") + "H", x + w - 36, y + 48, 7, "#FFFFFF", { align: "right", sh: "#000000" });
  TXT(ctx, tag, x + w - 36, y + 112, 4, col, { align: "right" });
  // PLAYER: YOU · ENERGY bar
  const by = y + 176, segs = 20, bx0 = x + 36 + 168, bx1 = x + w - 36 - 150, sw = (bx1 - bx0) / segs, ec = ENC(en);
  TXT(ctx, "ENERGY", x + 36, by + 14, 4, "#A9A4E0");
  for (let i = 0; i < segs; i++) {
    const on = i < Math.ceil(en * segs - 0.001);
    ctx.fillStyle = on ? (en < 0.15 && blink(3) ? "#FFFFFF" : ec) : "#2E2A6A";
    ctx.fillRect(Math.round(bx0 + i * sw), by, Math.round(sw) - 6, 52);
  }
  TXT(ctx, Math.round(en * 100) + "%", x + w - 36, by + 8, 6, ec, { align: "right", sh: "#000000" });
  ctx.restore();
}
const TEENMAP = { h: "#4A2E1E", p: "#4A2E1E", s: K.skin, e: K.ink, m: K.brick2, t: "#3D6BE0", w: K.white, j: "#2A3A6A" };
function teen(x, y, o = {}) {
  spr(KID, x, y, TEENMAP);
  if (o.bags) { P(x + 3, y + 5, "#9A6AB8"); P(x + 6, y + 5, "#9A6AB8"); }
  if (o.mad) { P(x + 2, y + 3, K.ink); P(x + 3, y + 4, K.ink); P(x + 7, y + 3, K.ink); P(x + 6, y + 4, K.ink); }
  if (o.closed) { R(x + 2, y + 4, 2, 1, K.skin2); R(x + 6, y + 4, 2, 1, K.skin2); P(x + 3, y + 4, K.skin2); P(x + 6, y + 4, K.skin2); }
  if (o.helmet) {
    R(x - 1, y - 2, 12, 5, "#C8343F"); R(x - 1, y + 3, 2, 4, "#C8343F"); R(x + 9, y + 3, 2, 4, "#C8343F"); R(x + 4, y - 2, 2, 5, "#FFFFFF");
    R(x + 1, y + 6, 8, 1, "#C8CCE0"); P(x + 2, y + 5, "#C8CCE0"); P(x + 7, y + 5, "#C8CCE0"); R(x + 3, y + 11, 4, 3, "#FFFFFF");
  }
}
// bedroom: clock hour drives the window sky
function room(o = {}) {
  const ck = ((6 + (o.hrs ?? HRS)) % 24 + 24) % 24, night = ck >= 20 || ck < 6;
  R(0, 0, LW, 250, o.wall || "#1E1A4A"); for (let x = 4; x < LW; x += 12) R(x, 0, 2, 250, o.wall2 || "#231E56");
  // window
  R(10, 112, 54, 50, K.ink); g.save(); g.beginPath(); g.rect(12, 114, 50, 46); g.clip(); g.translate(12, 114);
  if (night) { skyNight(46, ["#0B0A24", "#16123F", "#281D60"]); stars(16, 30, 5); moon(38, 10); }
  else { R(0, 0, 50, 46, "#5AA8F0"); R(0, 30, 50, 16, "#8FD0FF"); disc(12, 12, 5, K.yellow); R(26, 8, 14, 3, "#FFFFFF"); R(30, 6, 7, 2, "#FFFFFF"); }
  g.restore(); R(36, 112, 2, 50, K.ink); R(10, 136, 54, 2, K.ink); R(8, 162, 58, 3, "#3A4A7A");
  // pennant + poster
  R(118, 116, 30, 34, K.ink); R(119, 117, 28, 32, "#FF8A3D"); R(123, 121, 20, 20, "#2B6BFF"); disc(133, 131, 6, K.yellow); R(122, 143, 22, 2, K.ink);
  for (let i = 0; i < 16; i++) R(74, 120 + i * 0.6, 22 - i * 1.3, 1, "#C8343F");
  // floor
  R(0, 250, LW, 70, "#2A2450"); for (let y = 250; y < LH; y += 8) for (let x = ((y / 8) % 2) * 9; x < LW; x += 18) R(x, y, 9, 8, "#30295A");
  // bed (right)
  R(104, 214, 76, 36, "#3A3486"); R(104, 210, 76, 8, o.sheet || "#5D4FC0"); R(170, 186, 10, 64, "#5A3A2A"); R(154, 202, 18, 9, K.cream);
  R(106, 250, 4, 6, "#5A3A2A");
  // desk (left) + lamp + clock
  R(4, 206, 74, 5, "#8A5A3A"); R(4, 211, 74, 2, "#5A3A2A"); R(8, 213, 4, 37, "#5A3A2A"); R(70, 213, 4, 37, "#5A3A2A");
  R(12, 182, 2, 24, "#8A8FB8"); R(8, 178, 12, 5, "#FFB13B"); g.globalAlpha = o.lamp ?? 0.14; disc(14, 196, 22, K.win); g.globalAlpha = 1;
  R(26, 196, 22, 10, "#F4F1FF"); R(26, 196, 22, 2, "#C8C4E0"); for (let i = 0; i < 3; i++) R(29, 199 + i * 2, 15, 1, "#8A8FB8");
  R(54, 194, 20, 12, K.ink); R(55, 195, 18, 10, "#1A0A16");
  return ck;
}
function clockText(ck, cx, cy) { // digits drawn hi-res on the clock face (low-res coords cx,cy = centre)
  if (!UI) return; const hh = Math.floor(ck), mm = Math.floor((ck - hh) * 60);
  TXT(ctx, pad2(hh) + (blink(1) ? ":" : " ") + pad2(mm), hx(cx), hy(cy) - hu(2) * 3, hu(2), K.red, { align: "center" });
}
function zzz(x, y, k = 1) {
  for (let i = 0; i < 3; i++) { const l = (lt * 0.5 + i / 3) % 1; g.globalAlpha = (1 - l) * k; TXT(g, "Z", x + l * 14 + Math.sin(l * 6 + i) * 2, y - l * 34, 1 + (l > 0.5 ? 1 : 0), "#FFFFFF"); }
  g.globalAlpha = 1;
}
function sRoom() { // 0: intro bedroom (hook: energy crash)
  const hk = p.hp !== undefined, en = hk ? clamp(p.hp) : 1;
  const ck = room({ hrs: hk ? 18 : HRS });
  teen(84, 228, { bags: hk && en < 0.6 });
  if (hk && en < 0.5) { GLX = (rnd(Math.floor(t * 8)) < 0.4 ? 0.5 : 0.1) * (1 - en); }
  blit();
  clockText(ck, 64, 200);
  if (!UI) return;
  if (hk) {
    const x = 90, y = 470, w = 900, segs = 20, ec = ENC(en);
    ctx.fillStyle = K.ink; ctx.fillRect(x - 12, y - 12, w + 24, 250); ctx.fillStyle = ec; ctx.fillRect(x - 6, y - 6, w + 12, 238);
    ctx.fillStyle = K.ink; ctx.fillRect(x, y, w, 226); ctx.fillStyle = "#17143F"; ctx.fillRect(x + 6, y + 6, w - 12, 214);
    TXT(ctx, "PLAYER: YOU", x + 30, y + 24, 4, "#A9A4E0");
    TXT(ctx, en > 0.02 ? "ENERGY" : "NO SLEEP", x + 30, y + 64, 9, en > 0.02 ? "#FFFFFF" : K.red, { sh: "#000000" });
    TXT(ctx, Math.round(en * 100) + "%", x + w - 30, y + 64, 9, ec, { align: "right", sh: "#000000" });
    for (let i = 0; i < segs; i++) { const on = i < en * segs; ctx.fillStyle = on ? ec : "#2E2A6A"; ctx.fillRect(x + 30 + i * ((w - 60) / segs), y + 150, (w - 60) / segs - 8, 40); }
    if (en <= 0.02) big("11 DAYS AWAKE", 800, 8, K.yellow, p.tEnd ?? 0, { panel: K.yellow });
    return;
  }
  topHud("HOUR 0", "EXPERIMENT", HRS, energyOf(HRS), K.yellow);
  big("1964", 410, 12, K.yellow, p.tY ?? 0.1, { panel: K.yellow });
  if (lt >= (p.tR ?? 99)) { big("RANDY GARDNER", 560, 7, "#FFFFFF", p.tR); big("AGE 17 · SAN DIEGO", 640, 4, K.cyan, p.tR + 0.2); }
}
function sBac() { // 1: hour 17 = 0.05% blood alcohol
  const ck = room({ hrs: HRS, lamp: 0.22 }), b = clamp(p.bac ?? 0);
  teen(84, 228, { bags: true });
  // reaction-time test: a light on the desk the teen is slow to hit
  // giant BAC meter on the wall (glass filling)
  const gx = 98, gy = 162, gh = 40;
  R(gx - 1, gy - gh - 1, 18, gh + 2, K.ink); R(gx, gy - gh, 16, gh, "#2A2A4A");
  const fh = Math.round(gh * b); R(gx + 1, gy - fh, 14, fh, "#FFB13B"); if (fh > 2) R(gx + 1, gy - fh, 14, 2, "#FFF3B0");
  for (let i = 0; i < 4; i++) { const l = (lt * 0.8 + i / 4) % 1; if (fh > 6) P(gx + 3 + i * 3, gy - 2 - l * (fh - 4), "#FFF3B0"); }
  blit();
  clockText(ck, 64, 200);
  topHud("HOUR " + Math.floor(HRS), "AWAKE", HRS, energyOf(HRS), K.yellow);
  if (!UI) return;
  TXT(ctx, "BAC", hx(gx + 8), hy(gy - gh - 9), hu(2), "#FFFFFF", { align: "center", out: K.ink, ow: 2 });
  big("YOUR REACTIONS =", 410, 5, "#FFFFFF", p.tA ?? 0.2);
  if (lt >= (p.tB ?? 99)) { big("0.05%", 490, 13, K.orange, p.tB, { panel: K.orange }); big("BLOOD ALCOHOL", 640, 5, K.orange, p.tB + 0.2); }
}
function sMicro() { // 2: microsleep — eyes wide open, brain off
  const bo = (p.bo ?? 0) > 0.5;
  R(0, 0, LW, LH, "#1E1A4A"); for (let x = 4; x < LW; x += 12) R(x, 0, 2, LH, "#231E56");
  // big face close-up
  const cx = 90, cy = 196;
  R(cx - 14, cy + 44, 28, 30, K.skin2); R(cx - 46, cy + 66, 92, 60, "#3D6BE0");
  disc(cx, cy, 52, K.skin); R(cx - 52, cy - 4, 6, 16, K.skin2); R(cx + 46, cy - 4, 6, 16, K.skin2);
  for (let i = 0; i < 26; i++) R(cx - 52 + i * 4, cy - 56 + Math.round(rnd(i) * 6), 6, 28 - Math.round(Math.abs(i - 13) * 0.6), "#4A2E1E");
  R(cx - 54, cy - 30, 10, 26, "#4A2E1E"); R(cx + 44, cy - 30, 10, 26, "#4A2E1E");
  for (const s of [-1, 1]) {
    const ex = cx + s * 21, ey = cy + 4;
    R(ex - 11, ey - 6, 22, 13, "#FFFFFF"); R(ex - 12, ey - 5, 1, 11, K.ink); R(ex + 11, ey - 5, 1, 11, K.ink); R(ex - 11, ey - 7, 22, 1, K.ink); R(ex - 11, ey + 7, 22, 1, K.ink);
    for (let i = 0; i < 4; i++) P(ex - 9 + i * 5, ey + 4 - (i % 2), "#FF8A8A");
    const jx = Math.round(Math.sin(t * 0.7) * 1.5); R(ex - 3 + jx, ey - 4, 7, 9, "#3A5A2A"); R(ex - 1 + jx, ey - 2, 3, 5, K.ink); P(ex + jx, ey - 3, "#FFFFFF");
    R(ex - 11, ey + 9, 22, 2, "#9A6AB8"); R(ex - 9, ey + 11, 18, 1, "#B88AC8");
    R(ex - 10, ey - 13, 20, 3, "#4A2E1E");
  }
  R(cx - 3, cy + 18, 6, 10, K.skin2); R(cx - 10, cy + 34, 20, 3, K.brick2);
  blit();
  if (bo) {
    ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, W, H);
    // only the open eyes remain — the brain is off
    ctx.globalAlpha = 0.5; for (const s of [-1, 1]) { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(hx(cx + s * 21 - 11), hy(cy - 2), hu(22) * 1, hu(13)); ctx.fillStyle = "#000"; ctx.fillRect(hx(cx + s * 21 - 3), hy(cy), hu(7), hu(9)); } ctx.globalAlpha = 1;
    if (UI) {
      const ms = Math.max(0, lt - (p.boAt ?? 0));
      TXT(ctx, "BRAIN: OFF", 540, 520, 10, K.red, { align: "center" });
      TXT(ctx, "00:0" + Math.min(9, Math.floor(ms * 2 + 1)), 540, 680, 6, "#FFFFFF", { align: "center" });
    }
  }
  topHud("DAY 2", "MICROSLEEPS", HRS, energyOf(HRS), K.yellow);
  if (!UI || bo) return;
  big("MICROSLEEPS", 410, 10, K.cyan, p.tA ?? 0.15, { panel: K.cyan });
  if (lt >= (p.tB ?? 99)) big("EYES OPEN · BRAIN OFF", 580, 5, "#FFFFFF", p.tB);
}
function sDesk() { // 3: moody, clumsy, forgetful
  const ck = room({ hrs: HRS, lamp: 0.2 });
  teen(84, 228, { bags: true, mad: true });
  // knocked-over cup + spill
  const sp = clamp((lt - (p.tC ?? 99)) / 0.6);
  if (sp <= 0) { R(40, 199, 6, 7, "#F4F1FF"); R(46, 201, 2, 3, "#F4F1FF"); }
  else { R(38, 203, 8, 3, "#F4F1FF"); R(40, 204, 4, 1, "#7A4A2A"); R(30 - sp * 20, 205, sp * 30, 1, "#7A4A2A"); R(28 - sp * 16, 206, sp * 4, Math.round(sp * 30), "#7A4A2A"); }
  // angry steam over the head
  if (lt > (p.tA ?? 0)) for (let i = 0; i < 3; i++) { const l = (lt * 1.2 + i / 3) % 1; g.globalAlpha = 1 - l; R(86 + i * 3, 200 - l * 14, 2, 2, K.red); } g.globalAlpha = 1;
  SHK = sp > 0 && sp < 0.6 ? 0.6 : 0;
  blit();
  clockText(ck, 64, 200);
  topHud("DAY 3", "MOOD: BAD", HRS, energyOf(HRS), K.orange);
  if (!UI) return;
  big("MOODY", 410, 9, K.red, p.tA ?? 0.1);
  if (lt >= (p.tC ?? 99)) big("CLUMSY", 510, 9, K.orange, p.tC);
  if (lt >= (p.tF ?? 99)) {
    // forgetting: letters of the sentence vanish one by one
    const s = "WHAT WAS I SAYING?", k = clamp((lt - p.tF - 0.5) / 1.2);
    let out = ""; for (let i = 0; i < s.length; i++) out += rnd(i * 7.3) < k && s[i] !== " " ? " " : s[i];
    big("FORGETFUL", 610, 9, K.yellow, p.tF);
    TXT(ctx, out, 540, 740, 4, "#FFFFFF", { align: "center", out: K.ink, ow: 3 });
  }
}
function sHallu() { // 4: hallucinations + paranoia
  const ck = room({ hrs: HRS, lamp: 0.1, wall: "#2A1450", wall2: "#3A1A64" });
  // breathing wallpaper blobs
  for (let i = 0; i < 9; i++) { const x = 10 + (i % 3) * 60 + Math.sin(t * 1.3 + i) * 6, y = 20 + Math.floor(i / 3) * 34 + Math.cos(t + i) * 5; g.globalAlpha = 0.35; disc(x, y, 6 + Math.round(3 * Math.sin(t * 2 + i)), i % 2 ? K.pink : K.cyan); } g.globalAlpha = 1;
  // shadow figure at the window + eyes in the dark corners (paranoia)
  if (lt >= (p.tP ?? 99)) {
    R(28, 130, 12, 32, "#07061A"); disc(34, 126, 6, "#07061A");
    for (const [ex, ey, ph] of [[8, 236, 0], [156, 176, 1.3], [94, 300, 2.1], [168, 290, 0.6]]) if (blink(0.7, ph)) { R(ex, ey, 3, 2, K.red); R(ex + 6, ey, 3, 2, K.red); }
  }
  teen(84, 228, { bags: true, helmet: lt >= (p.tH ?? 99) });
  // floating football
  if (lt >= (p.tH ?? 99)) { const fx = 90 + Math.sin(lt * 2) * 30, fy = 182 + Math.cos(lt * 3) * 6; disc(fx, fy, 4, "#8A4A2A"); R(fx - 6, fy - 1, 3, 3, "#8A4A2A"); R(fx + 4, fy - 1, 3, 3, "#8A4A2A"); R(fx - 2, fy, 5, 1, "#FFFFFF"); }
  p.gl = 0.12 + (rnd(Math.floor(t * 6)) < 0.25 ? 0.5 : 0) + 0.3 * Math.max(0, 1 - Math.abs(lt - (p.tP ?? 99)) / 0.3);
  blit();
  // RGB split ghost
  ctx.globalAlpha = 0.18; ctx.globalCompositeOperation = "screen"; ctx.drawImage(lo, CAM.ox - 3 * CAM.s, CAM.oy, LW * CAM.s, LH * CAM.s); ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
  clockText(ck, 64, 200);
  topHud("DAY 4", "REALITY: ???", HRS, energyOf(HRS), K.pink);
  if (!UI) return;
  const jit = (rnd(Math.floor(t * 12)) - 0.5) * 12;
  big("HALLUCINATIONS", 410, 7, K.pink, p.tA ?? 0.1, { x: 540 + jit });
  if (lt >= (p.tP ?? 99)) big("+ PARANOIA", 490, 7, K.red, p.tP);
  if (lt >= (p.tH ?? 99)) { big("\"I'M A FAMOUS", 600, 5, "#FFFFFF", p.tH, { panel: K.pink }); big("FOOTBALL PLAYER\"", 660, 5, "#FFFFFF", p.tH + 0.1); }
}
function sRecord() { // 5: day 11, 264 hours, world record
  const ck = room({ hrs: HRS, lamp: 0.25 });
  teen(84, 228, { bags: true });
  // trophy on the desk
  const tk = E.back(clamp((lt - (p.tR ?? 99)) / 0.35));
  if (tk > 0) { const ty = 206 - Math.round(16 * tk); R(30, ty, 12, 8, K.yellow); R(28, ty, 2, 5, K.yellow); R(42, ty, 2, 5, K.yellow); R(34, ty + 8, 4, 4, K.win2); R(31, ty + 12, 10, 3, K.win2); P(33, ty + 2, "#FFFFFF");
    if (blink(3)) spark(46, ty - 2, 2); }
  blit();
  clockText(ck, 64, 200);
  const hrsShown = HRS;
  topHud("DAY 11", "FINAL DAY", hrsShown, energyOf(hrsShown), K.red);
  if (!UI) return;
  const c = clamp(p.cnt ?? 1); const v = 240 + 24.4 * c;
  big(v.toFixed(1) + " H", 410, 12, K.red, p.tA ?? 0.1, { panel: K.red });
  if (lt >= (p.tR ?? 99)) big("WORLD RECORD", 590, 8, K.yellow, p.tR, { panel: K.yellow });
}
function sSleep() { // 6: slept 14 hours straight, energy refills
  const sl = clamp(p.sl ?? 0), ck = room({ hrs: 6 + 18 + sl * 14 - 6, sheet: "#7A6AD8" });
  // teen lying in bed: head on pillow, blanket
  R(150, 198, 12, 11, "#4A2E1E"); R(151, 202, 9, 8, K.skin); R(152, 205, 3, 1, K.skin2); R(156, 205, 3, 1, K.skin2);
  R(108, 204, 44, 10, "#7A6AD8"); R(108, 204, 44, 2, "#9A8AF0");
  zzz(150, 192, 1);
  blit();
  clockText(ck, 64, 200);
  const en = clamp(sl);
  topHud("SLEEP", "RECHARGING", 264, en, K.lime);
  if (!UI) return;
  big(Math.round(sl * 14) + " HOURS", 410, 12, K.lime, p.tA ?? 0.1, { panel: K.lime });
  big("STRAIGHT", 560, 6, "#FFFFFF", (p.tA ?? 0.1) + 0.2);
}
function sWarn() { // 7: Guinness stopped tracking it — don't try this
  const ck = room({ hrs: 20 });
  // record book with a red X
  R(26, 186, 30, 20, K.ink); R(27, 187, 28, 18, "#2E8A4A"); R(40, 187, 2, 18, "#1E5A2A"); R(30, 191, 8, 2, K.yellow); R(44, 191, 8, 2, K.yellow);
  if (lt >= (p.tG ?? 0)) redX(41, 196, 9);
  teen(84, 228, { closed: true });
  zzz(92, 222, 0.8);
  blit();
  clockText(ck, 64, 200);
  if (!UI) return;
  // warning triangle panel
  const k = E.back(clamp((lt - (p.tD ?? 99)) / 0.3));
  big("GUINNESS STOPPED", 150, 6, "#FFFFFF", p.tG ?? 0.1);
  big("TRACKING IT", 230, 6, "#FFFFFF", (p.tG ?? 0.1) + 0.1);
  big("TOO DANGEROUS", 330, 5, K.orange, (p.tG ?? 0.1) + 0.3);
  if (k > 0) {
    ctx.save(); ctx.translate(540, 560); ctx.scale(k, k);
    ctx.fillStyle = K.ink; ctx.fillRect(-470, -100, 940, 200); ctx.fillStyle = blink(2) ? K.red : "#B8202E"; ctx.fillRect(-462, -92, 924, 184);
    ctx.fillStyle = K.ink; ctx.fillRect(-450, -80, 900, 160); ctx.fillStyle = "#2A0A12"; ctx.fillRect(-444, -74, 888, 148);
    icon("warn", -420, -55, 10, K.red);
    TXT(ctx, "DON'T", 60, -64, 9, "#FFFFFF", { align: "center", sh: "#000000" });
    TXT(ctx, "TRY THIS", 60, 6, 9, K.red, { align: "center", sh: "#000000" });
    ctx.restore();
  }
}
function sAsk() { // 8: closing question — awake at 3 am
  const ck = room({ hrs: 21, lamp: 0 });
  R(150, 198, 12, 11, "#4A2E1E"); R(151, 202, 9, 8, K.skin); P(153, 205, K.ink); P(157, 205, K.ink); R(108, 204, 44, 10, "#5D4FC0"); R(108, 204, 44, 2, "#7A6AD8");
  g.globalAlpha = 0.25 + 0.05 * Math.sin(lt * 5); disc(140, 200, 14, "#8FD8FF"); g.globalAlpha = 1; R(138, 196, 5, 8, "#8FD8FF"); R(139, 197, 3, 6, "#FFFFFF");
  blit();
  clockText(ck, 64, 200);
  card({ tag: "YOUR TURN", title: "HOURS AWAKE?", sub: "COMMENT YOUR RECORD", col: K.yellow, subCol: K.cyan, icon: "clock", fill: 24 });
}
[sRoom, sBac, sMicro, sDesk, sHallu, sRecord, sSleep, sWarn, sAsk][S]();
