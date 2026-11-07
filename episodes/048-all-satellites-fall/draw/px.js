// "Pixel Night" scene kit for 048 (every satellite falls) — helpers copied from 044/035 draw/px.js (180x320 low-res canvas,
// 6x nearest-neighbour upscale, own 5x7 bitmap font, HUD cards, pixel big numbers), plus new scenes.
// p.s: 0 orbit · 1 meteor city (hook: p.hp) · 2 ISS · 3 phone map · 4 old-school nav · 5 clocks · 6 money · 7 weather · 8 timeline · 9 end.
// Common: p.z zoom, p.fx/p.fy focus, p.ui (0 hides HUD), p.gl glitch.
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
// ---------------- 048 extras ----------------
Object.assign(ICONS, {
  pin: ["....ccc....", "...ccccc...", "..ccwwwcc..", "..ccwwwcc..", "..ccwwwcc..", "...ccccc...", "...ccccc...", "....ccc....", "....ccc....", ".....c.....", "..........."],
  storm: ["...ccccc...", ".cc.....c..", "c...ccc..c.", "c..c...c..c", ".c.c.w.c..c", "c..c...c.c.", "c..ccc...c.", ".c......c..", "..ccccc....", "...........", "..........."],
  meteor: ["w..........", ".w.........", "..y........", "...y.......", "....y......", ".....r.....", "......rwww.", "......wwwww", ".....wwwwww", "......wwww.", ".......ww.."],
  chart: ["...........", ".........y.", "........y..", ".......y...", "......y....", "....yy.....", "..yy.......", ".y.........", "y..........", "wwwwwwwwwww", "..........."],
  night: ["...........", "...ww......", "..w........", ".w.........", ".w.........", ".w.......w.", "..w.....w..", "...wwwww...", "...........", ".y....y..y.", "..........."],
});
const fmt = (n) => Math.round(n).toLocaleString("en-US");
function issSpr(cx, cy, ang, sc = 1, dmg = 0) {
  const ca = Math.cos(ang), sa = Math.sin(ang);
  for (let u = -28; u <= 28; u += 0.5) for (let v = -17; v <= 17; v += 0.5) {
    const au = Math.abs(u), av = Math.abs(v); let col = null;
    if (av <= 1 && au <= 27) col = "#9A96C8";
    else if (au <= 5 && av <= 6) col = av > 4.5 ? "#B8B4D8" : "#F4F1FF";
    else if (au <= 2 && av <= 10) col = "#E8E6F5";
    else for (const pu of [11, 23]) if (Math.abs(au - pu) <= 3.5 && av >= 3 && av <= 16) { col = (Math.round(v * 2) % 4 === 0 || Math.abs(au - pu) > 3) ? "#7A5A1A" : "#E8A83A"; if (dmg && rnd(Math.floor(u * 3 + v * 7)) < dmg) col = null; }
    if (col) P(cx + (u * ca - v * sa) * sc, cy + (u * sa + v * ca) * sc, col);
  }
}
function streak(x, y, dx, dy, len, a = 1, w = 1) {
  const n = Math.max(2, Math.round(len));
  for (let i = n; i >= 0; i--) {
    const k = i / n, col = k < 0.08 ? "#FFFFFF" : k < 0.25 ? "#FFF2A0" : k < 0.5 ? K.yellow : k < 0.75 ? K.orange : K.red;
    g.globalAlpha = clamp(a * (1 - k * 0.85)); R(x - dx * i, y - dy * i, w, w, col);
  }
  g.globalAlpha = a * 0.35; disc(x, y, 2, "#FFF2A0"); g.globalAlpha = 1; R(x - 1, y - 1, 2, 2, "#FFFFFF");
}
function satDot(x, y, kind) { const c = kind === 0 ? "#FFFFFF" : kind === 1 ? K.yellow : kind === 2 ? K.pink : K.cyan; R(x, y, 2, 2, c); R(x - 2, y, 2, 1, kind === 0 ? "#6A8AF0" : "#2B6BFF"); R(x + 2, y + 1, 2, 1, kind === 0 ? "#6A8AF0" : "#2B6BFF"); }
function ocean(y0, seed = 1, col = "#0E2456") {
  R(0, y0, LW, LH - y0, col);
  for (let y = y0 + 2; y < LH; y += 4) for (let x = ((y >> 2) % 2) * 6; x < LW; x += 12) { const o = Math.round(Math.sin(t * 1.5 + y * 0.3 + x * 0.05 + seed) * 2); R(x + o, y, 5, 1, "#1E3A7A"); }
}
function moneyStack(x, base, n, burn) {
  for (let k = 0; k < n; k++) { R(x, base - k * 3, 16, 3, k % 2 ? "#2E8A4A" : "#3FBF5A"); R(x, base - k * 3, 16, 1, "#8FE8A0"); R(x + 6, base - k * 3 + 1, 4, 1, "#1E5A3A"); }
  if (burn) for (let i = 0; i < 5; i++) { const fh = 4 + rnd(i + x + Math.floor(t * 12)) * 9, xx = x + i * 3.3; R(xx, base - n * 3 - fh + 3, 3, fh, K.red); R(xx + 1, base - n * 3 - fh * 0.6 + 3, 1, fh * 0.6, K.yellow); }
}
// ============ SCENES ============
function sOrbit() {
  const tD = p.tDrop ?? 0.6, dk = Math.max(0, lt - tD), N = 170;
  skyNight(LH, DARK); stars(60, LH, 11);
  const ecx = 90, ecy = 440, er = 190;
  for (let i = 3; i >= 1; i--) { g.globalAlpha = 0.1 * (4 - i); disc(ecx, ecy, er + i * 3, "#3DE0FF"); } g.globalAlpha = 1;
  disc(ecx, ecy, er, "#12285E");
  for (let i = 0; i < 300; i++) { const x = Math.floor(rnd(i * 1.7) * LW), y = Math.floor(252 + rnd(i * 2.3) * 70); if ((x - ecx) ** 2 + (y - ecy) ** 2 < (er - 2) ** 2) R(x, y, 3, 1, rnd(i * 9) < 0.5 ? "#1E3A6A" : "#163A2E"); }
  for (let i = 0; i < 60; i++) { const x = Math.floor(rnd(i * 4.1) * LW), y = Math.floor(262 + rnd(i * 5.3) * 58); if ((x - ecx) ** 2 + (y - ecy) ** 2 < (er - 4) ** 2 && blink(1, i)) P(x, y, K.win); }
  for (const [rr, col] of [[er + 24, "#4A4E9A"], [er + 95, "#8A7A30"], [er + 150, "#8A3A6A"]]) for (let i = 0; i < 320; i++) if (i % 3 === 0) { const a = -Math.PI + i * Math.PI / 320; P(ecx + Math.cos(a) * rr, ecy + Math.sin(a) * rr, col); }
  let alive = 0;
  for (let i = 0; i < N; i++) {
    const kind = i < 120 ? 0 : i < 142 ? 3 : i < 158 ? 1 : 2;
    const r0 = kind === 0 ? er + 10 + rnd(i * 3) * 30 : kind === 3 ? er + 30 + rnd(i * 3) * 50 : kind === 1 ? er + 95 : er + 150;
    const w = 0.12 * Math.pow((er + 14) / r0, 1.5), span = Math.asin(Math.min(1, 96 / r0)), a = -Math.PI / 2 + (rnd(i * 1.3) * 2 - 1) * span + lt * w * (i % 7 === 0 ? -1 : 1);
    const st = rnd(i * 5) * 1.6, du = 0.7 + rnd(i * 7) * 1.1, kk = clamp((dk - st) / du), k2 = kk * kk;
    if (kk >= 1) continue; alive++;
    const r = r0 - (r0 - er) * k2, x = ecx + Math.cos(a) * r, y = ecy + Math.sin(a) * r;
    if (kk > 0) {
      const burn = r < er + 9;
      for (let j = 1; j <= 5; j++) { const kj = Math.max(0, kk - j * 0.03), rj = r0 - (r0 - er) * kj * kj; g.globalAlpha = 0.6 - j * 0.1; P(ecx + Math.cos(a - j * 0.004) * rj, ecy + Math.sin(a - j * 0.004) * rj, burn ? K.orange : "#8A8FB8"); }
      g.globalAlpha = 1;
      if (burn) { R(x - 1, y - 1, 3, 3, K.orange); P(x, y, "#FFFFFF"); if (blink(8, i)) { P(x - 2, y, K.yellow); P(x + 2, y, K.yellow); } continue; }
    }
    satDot(Math.round(x), Math.round(y), kind);
  }
  // burning band on the atmosphere
  if (dk > 0.3) for (let x = 0; x < LW; x++) { const y = ecy - Math.sqrt(er * er - (x - ecx) ** 2); g.globalAlpha = clamp((dk - 0.3) * 0.5) * (0.25 + 0.25 * Math.sin(x * 0.3 + t * 7)); R(x, y - 5, 1, 5, K.orange); } g.globalAlpha = 1;
  SHK = dk > 0 && dk < 0.35 ? 1 : 0;
  blit();
  const cnt = Math.round(16988 * alive / N);
  card({ tag: "ORBIT CONTROL", title: "ALL SATELLITES", sub: dk > 0 ? "STATUS: FALLING!" : "STATUS: ONLINE", col: dk > 0 ? K.red : K.cyan, subCol: dk > 0 ? K.red : K.lime, icon: "sat", fill: Math.round(24 * alive / N) });
  if (!UI) return;
  big(fmt(cnt), 330, 12, dk > 0 ? K.red : "#FFFFFF", 0.05);
  big("ACTIVE SATELLITES", 450, 4, "#FFFFFF", 0.15);
  if (dk > 0) big("ALL FALLING!", 560, 8, K.yellow, tD, { panel: K.red });
  if (dk <= 0) TXT(ctx, "GEO 36,000 KM", hx(ecx), hy(ecy - er - 150) - 40, 3, "#C86A9A", { align: "center", out: K.ink, ow: 2 });
  TXT(ctx, "GPS 20,200 KM", hx(ecx), hy(ecy - er - 95) - 40, 3, "#C8A050", { align: "center", out: K.ink, ow: 2 });
}
function sMeteor() {
  const hk = !!p.hp, dr = hk ? clamp(p.drain ?? 0) : 0;
  skyNight(240); stars(80, 160, 23);
  const n = hk ? 34 : 26;
  for (let i = 0; i < n; i++) {
    const sp = 0.45 + rnd(i * 2.1) * 0.5, ph = (lt * sp + rnd(i * 3.3)) % 1, x0 = -10 + rnd(i * 4.7) * 230, y0 = -20 + rnd(i * 5.9) * 70;
    const dx = -0.9 - rnd(i) * 0.4, dy = 0.75 + rnd(i * 8) * 0.3, d = ph * 230, len = 14 + rnd(i * 9) * 26;
    const x = x0 + dx * d, y = y0 + dy * d; if (y > 232) continue;
    streak(x, y, dx * 0.9, dy * 0.9, len, clamp(1.4 - ph * 1.2), rnd(i * 11) < 0.3 ? 2 : 1);
    if (rnd(i * 13) < 0.25 && ph > 0.4) for (let j = 1; j <= 2; j++) streak(x + j * 3, y - j * 5, dx * 0.9, dy * 0.9, len * 0.4, 0.6);
  }
  g.globalAlpha = 0.08; R(0, 0, LW, 240, K.orange); g.globalAlpha = 1;
  skyline(232, 3, ["#1E1A50", "#241F5E", "#171442"], hk ? 0.35 * (1 - dr) : 0.35, 50, 120, 12, 24);
  skyline(250, 6, [K.bldA, K.bldB, K.dk], hk ? 0.8 * (1 - dr * 0.7) : 0.8, 40, 105, 18, 30);
  R(0, 250, LW, 70, "#120F2A"); R(0, 250, LW, 2, "#2C2860");
  R(0, 262, LW, 6, "#3A3486"); R(0, 262, LW, 2, "#5D4FC0"); R(0, 268, LW, 52, "#1C1846");
  spr(KID, 120, 241, KIDMAP); R(118, 238, 3, 6, K.skin);
  for (const s of [-1, 1]) { g.globalAlpha = 0.15; disc(60 + s * 30, 300, 5, K.orange); g.globalAlpha = 1; }
  blit();
  if (hk) {
    const x = 90, y = 470, w = 900, segs = 20, hp = 1 - dr, v = Math.round(16988 * hp);
    ctx.fillStyle = K.ink; ctx.fillRect(x - 12, y - 12, w + 24, 250); ctx.fillStyle = hp > 0.6 ? K.cyan : K.red; ctx.fillRect(x - 6, y - 6, w + 12, 238);
    ctx.fillStyle = K.ink; ctx.fillRect(x, y, w, 226); ctx.fillStyle = "#17143F"; ctx.fillRect(x + 6, y + 6, w - 12, 214);
    TXT(ctx, "PLAYER: EARTH", x + 30, y + 24, 4, "#A9A4E0");
    TXT(ctx, v > 0 ? "SATELLITES" : "ORBIT EMPTY", x + 30, y + 64, 9, v > 0 ? "#FFFFFF" : K.red, { sh: "#000000" });
    TXT(ctx, fmt(v), x + w - 30, y + 132, 5, hp > 0.6 ? K.lime : K.red, { align: "right", sh: "#000000" });
    for (let i = 0; i < segs; i++) { const on = i < hp * segs; ctx.fillStyle = on ? (hp > 0.6 ? K.lime : K.red) : "#2E2A6A"; ctx.fillRect(x + 30 + i * ((w - 60) / segs), y + 176, (w - 60) / segs - 8, 34); }
    return;
  }
  const c = clamp(lt / 1.8);
  card({ tag: "SKY WATCH", title: "METEOR STORM", sub: "MOST SATELLITES BURN UP", col: K.orange, icon: "meteor", fill: Math.round(8 + c * 16) });
  if (!UI) return;
  big("SHOOTING STARS!", 360, 8, K.yellow, p.tBig ?? 0.2, { panel: K.orange });
  big("BURNED UP: " + fmt(15000 * c), 480, 5, "#FFFFFF", 0.3);
}
function sIss() {
  const tB = p.tBreak ?? 1.4, tS = p.tSplash ?? 3.0, l = lt, br = lt >= tB, lb = lt - tB;
  skyNight(250, ["#0B0A24", "#100E31", "#1A1440", "#2A1A4A", "#4A1E4A", "#7A2A3A"]); stars(60, 140, 33);
  // horizon: ocean left, coast right
  ocean(250, 3); for (let y = 250; y < LH; y++) { const xc = 112 + (y - 250) * 0.5 + Math.sin(y * 0.2) * 3; R(xc, y, LW - xc, 1, y % 6 < 3 ? "#2A4A2A" : "#24402A"); }
  R(0, 248, LW, 2, "#FF8A3D88");
  const k = clamp(l / (tS + 0.2)), cx = 30 + 70 * k, cy = 92 + 110 * k * k * 0.8 + 40 * k, ang = 0.4 + l * 0.7;
  const vx = 70, vy = 150, vl = Math.hypot(vx, vy), ux = vx / vl, uy = vy / vl;
  // plasma trail
  for (let i = 0; i < 120; i++) { const d = rnd(i * 2.3) * 70, sp = (rnd(i * 3.1) - 0.5) * (6 + d * 0.25); const x = cx - ux * d - uy * sp, y = cy - uy * d + ux * sp; g.globalAlpha = clamp(1 - d / 70) * 0.8; P(x, y, d < 12 ? "#FFFFFF" : d < 30 ? K.yellow : d < 50 ? K.orange : K.red); }
  g.globalAlpha = 0.5 + 0.2 * Math.sin(t * 20); for (let a = -1.4; a <= 1.4; a += 0.05) { const rr = 26; P(cx + (ux * Math.cos(a) - uy * Math.sin(a)) * rr, cy + (uy * Math.cos(a) + ux * Math.sin(a)) * rr, a > -0.5 && a < 0.5 ? "#FFFFFF" : K.orange); } g.globalAlpha = 1;
  if (!br) issSpr(cx, cy, ang, 0.85, clamp(l / tB) * 0.25);
  else {
    issSpr(cx, cy, ang, 0.6, 0.55);
    for (let j = 0; j < 6; j++) {
      const a = j * TAU / 6 + 0.5, d = Math.min(1, lb / 1.2) * (14 + j * 3);
      const fx = cx + Math.cos(a) * d + ux * lb * 10 * (j % 3), fy = cy + Math.sin(a) * d + uy * lb * 14 * (j % 3);
      if (fy < 252) { streak(fx, fy, ux * 1.2, uy * 1.2, 14 + j * 2, 1, 2); R(fx - 1, fy - 1, 3, 3, "#C8C4E0"); }
    }
  }
  // impacts
  if (lt >= tS) {
    const ls = lt - tS;
    for (const [ix, land] of [[60, 0], [96, 0], [150, 1]]) {
      const lk = ls - (ix % 7) * 0.05; if (lk < 0) continue;
      if (!land) { const hgt = Math.max(0, 40 * Math.sin(Math.min(Math.PI, lk * 2.2))); for (let i = 0; i < 9; i++) { const xo = (i - 4) * 1.5; R(ix + xo, 262 - hgt * (1 - Math.abs(i - 4) / 5), 1.5, hgt * (1 - Math.abs(i - 4) / 5) + 1, i % 2 ? "#BFF8FF" : "#FFFFFF"); } ring(ix, 264, 4 + lk * 18, "#8FD8FF", Math.PI, TAU); }
      else { const r = Math.min(20, 4 + lk * 40); g.globalAlpha = clamp(1.6 - lk); disc(ix, 262, r, K.orange); disc(ix, 262, r * 0.6, K.yellow); g.globalAlpha = clamp(1 - lk * 0.3) * 0.7; for (let i = 0; i < 6; i++) disc(ix + Math.sin(i * 2) * 6, 252 - i * 6 - lk * 10, 4 + i, "#3A3450"); g.globalAlpha = 1; }
    }
  }
  SHK = (lt >= tS && lt - tS < 0.5) ? 1.6 : br && lb < 0.3 ? 0.8 : 0.25;
  blit();
  card({ tag: "SPACE STATION", title: "ISS: REENTRY", sub: lt >= tS ? "CHUNKS HIT THE GROUND!" : br ? "BREAKING APART" : "MASS: 420 TONNES", col: K.orange, subCol: lt >= tS ? K.red : K.orange, icon: "sat", fill: Math.round(24 - k * 18) });
  if (!UI) return;
  big("420 TONNES", 360, 11, "#FFFFFF", p.tBig ?? 0.4, { panel: K.orange });
  if (lt >= tS) big("CHUNKS SURVIVE!", 500, 7, K.red, tS + 0.1);
}
function mapCol(x, y) {
  const rx = ((x % 26) + 26) % 26, ry = ((y % 34) + 34) % 34;
  if (Math.abs(y - x * 0.4 - 30) < 4) return "#1E4A9A";
  if (rx < 2 && Math.abs(x - 52) < 1.5 && y > -40 && y < 60) return K.cyan;
  if (rx < 2 || ry < 2) return Math.abs(Math.floor(y / 34)) % 3 === 1 && ry < 2 ? "#C88A2A" : "#4A5890";
  const bx = Math.floor(x / 26), by = Math.floor(y / 34);
  return rnd(bx * 7.1 + by * 3.3) < 0.18 ? "#1E5A3A" : (rx > 5 && rx < 21 && ry > 5 && ry < 28) ? "#2A3460" : "#222A50";
}
function sPhone() {
  const tL = p.tLost ?? 0.5, lost = lt >= tL, ll = lt - tL;
  R(0, 0, LW, LH, "#120F2A"); for (let i = 0; i < 40; i++) { g.globalAlpha = 0.25; disc(rnd(i) * LW, rnd(i * 3) * 120, 2 + rnd(i * 5) * 4, [K.pink, K.cyan, K.win][i % 3]); } g.globalAlpha = 1;
  const X0 = 38, Y0 = 70, PW = 104, PH = 210, sx0 = X0 + 6, sy0 = Y0 + 16, sw = PW - 12, sh = PH - 30;
  R(X0 - 1, Y0 - 1, PW + 2, PH + 2, "#05040E"); R(X0, Y0, PW, PH, "#2A2860"); R(X0 + 2, Y0 + 2, PW - 4, PH - 4, "#14123A"); R(X0 + PW / 2 - 8, Y0 + 7, 16, 3, "#05040E");
  const rot = lost ? ll * ll * 2.2 + ll * 1.5 : Math.sin(lt) * 0.05, dx = lost ? Math.sin(ll * 3) * 10 * clamp(ll) : lt * 3, dy = lost ? Math.cos(ll * 2.3) * 14 * clamp(ll) : -lt * 6;
  const cs = Math.cos(rot), sn = Math.sin(rot), cxs = sx0 + sw / 2, cys = sy0 + sh * 0.55;
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
    const ux = x + sx0 - cxs, uy = y + sy0 - cys, mx = ux * cs - uy * sn + dx + 52, my = ux * sn + uy * cs + dy;
    let c = mapCol(Math.floor(mx), Math.floor(my));
    if (lost && rnd(Math.floor(t * 15) * 31 + y) < 0.05) c = "#5A2A6A";
    P(sx0 + x, sy0 + y, c);
  }
  R(sx0, sy0, sw, 12, "#0B0A24"); R(sx0 + 4, sy0 + 4, 10, 4, lost ? "#5A5F8A" : "#FFFFFF");
  if (lost && blink(2)) { R(sx0 + sw - 20, sy0 + 3, 16, 6, K.red); }
  // blue dot
  if (!lost) { g.globalAlpha = 0.3 + 0.2 * Math.sin(lt * 6); disc(cxs, cys, 8, K.cyan); g.globalAlpha = 1; disc(cxs, cys, 4, "#FFFFFF"); disc(cxs, cys, 3, K.blue); L(cxs, cys - 5, cxs - 3, cys - 10, K.cyan); L(cxs, cys - 5, cxs + 3, cys - 10, K.cyan); }
  else { const a = ll * 9; for (let i = 0; i < 8; i++) { const an = a + i * TAU / 8; g.globalAlpha = (i + 1) / 8; R(cxs + Math.cos(an) * 9 - 1, cys + Math.sin(an) * 9 - 1, 2, 2, "#FFFFFF"); } g.globalAlpha = 1; disc(cxs, cys, 3, "#8A8FB8"); }
  // hand
  R(X0 - 14, Y0 + 120, 18, 100, K.skin); R(X0 - 14, Y0 + 120, 4, 100, K.skin2); R(X0 + PW - 4, Y0 + 130, 14, 16, K.skin); R(X0 + PW - 4, Y0 + 150, 14, 14, K.skin); R(X0 + PW - 4, Y0 + 168, 12, 12, K.skin);
  R(X0 - 4, Y0 + 150, 16, 10, K.skin); R(X0 + PW - 4, Y0 + 144, 14, 2, K.skin2); R(X0 + PW - 4, Y0 + 164, 14, 2, K.skin2);
  R(X0 - 20, Y0 + 210, 40, 40, "#3A4A9A");
  GLX = lost && ll < 0.25 ? 0.6 : 0;
  blit();
  card({ tag: "NAVIGATION", title: lost ? "GPS: OFFLINE" : "GPS: OK", sub: lost ? "0 OF 31 GPS SATELLITES" : "31 GPS SATELLITES", col: lost ? K.red : K.cyan, subCol: lost ? K.red : K.lime, icon: "pin", fill: lost ? 0 : 24 });
  if (!UI) return;
  if (lost && blink(1.6)) big("NO SIGNAL", 1020, 9, K.red, tL, { panel: K.red });
  if (lost) TXT(ctx, "SEARCHING...", hx(cxs), hy(cys) + 80, 4, "#FFFFFF", { align: "center", out: K.ink, ow: 2 });
  TXT(ctx, lost ? "NO GPS" : "GPS", hx(sx0 + sw - 4), hy(sy0) + 18, 3, lost ? "#FFFFFF" : K.lime, { align: "right" });
}
function ship(x, y) {
  for (let i = 0; i < 6; i++) R(x + i, y + 10 + i, 64 - i * 2, 1, "#8E2532"); R(x, y + 8, 66, 3, "#B8343F");
  const cc = [K.cyan, K.orange, K.yellow, K.pink, K.lime, K.blue];
  for (let c = 0; c < 8; c++) for (let r = 0; r < 2 + (c % 2); r++) R(x + 6 + c * 6, y + 5 - r * 4, 5, 3, cc[(c * 3 + r) % 6]);
  R(x + 54, y - 6, 9, 14, "#E8E6F5"); R(x + 55, y - 4, 7, 2, "#2A3A7A"); R(x + 57, y - 10, 2, 4, "#5A5F8A"); if (blink(1.2)) P(x + 58, y - 11, K.red);
}
function sNav() {
  const tC = p.tCmp ?? 0.4;
  skyNight(150); stars(60, 140, 43); moon(150, 30);
  // radio beacon on the hill, rings
  R(0, 130, LW, 20, "#141238"); for (let x = 0; x < 60; x++) R(x, 128 + Math.abs(x - 30) * 0.3, 1, 22, "#1A1640");
  R(29, 112, 2, 18, "#5A5F8A"); R(26, 128, 8, 2, "#5A5F8A"); if (blink(2)) P(30, 111, K.red);
  for (let j = 0; j < 3; j++) { const rr = ((lt * 30 + j * 20) % 60); g.globalAlpha = clamp(1 - rr / 60); ring(30, 112, rr, K.lime, Math.PI * 1.05, Math.PI * 1.95); } g.globalAlpha = 1;
  const px0 = 90 + Math.sin(lt * 0.8) * 4, py0 = 56 + Math.sin(lt * 1.3) * 2;
  for (let i = 0; i < 18; i++) P(px0 - 6 - i * 4, py0 + 4 + Math.sin(i * 0.7 + lt) * 2, "#8A8FB8");
  plane(px0, py0);
  // ocean + ship
  ocean(150, 7, "#0E1E4A");
  for (let i = 0; i < 20; i++) P(40 + i * 5, 210 + Math.sin(i * 0.6 + lt) * 2, "#8A8FB8");
  ship(30 + lt * 4, 186);
  g.globalAlpha = 0.2; for (let i = 0; i < 18; i++) R(30 + lt * 4 + 60 - i * 2, 203 + i, 4 + i, 1, "#BFF8FF"); g.globalAlpha = 1;
  // chart table with compass
  R(0, 240, LW, 80, "#5A3428"); R(0, 240, LW, 2, "#8A5A40");
  R(10, 246, 120, 66, "#E8D8B0"); R(10, 246, 120, 1, "#C8B890"); for (let i = 0; i < 6; i++) R(14 + i * 20, 250, 1, 58, "#C8B89088"); for (let j = 0; j < 4; j++) R(12, 254 + j * 16, 116, 1, "#C8B89088");
  L(22, 300, 70, 262, "#B8343F"); L(70, 262, 112, 280, "#B8343F"); for (const [a, b] of [[22, 300], [70, 262], [112, 280]]) R(a - 1, b - 1, 3, 3, "#B8343F");
  L(80, 300, 124, 254, "#C8A050"); L(81, 300, 125, 254, "#8A6A30");
  const ccx = 154, ccy = 278; disc(ccx, ccy, 16, "#8A6A30"); disc(ccx, ccy, 14, "#F4F1FF"); ring(ccx, ccy, 11, "#8A8FB8");
  const na = lt >= tC ? -Math.PI / 2 + Math.sin((lt - tC) * 3) * 0.6 * Math.exp(-(lt - tC)) + 0.25 : Math.sin(lt * 6) * 2;
  L(ccx, ccy, ccx + Math.cos(na) * 11, ccy + Math.sin(na) * 11, K.red); L(ccx, ccy, ccx - Math.cos(na) * 9, ccy - Math.sin(na) * 9, "#2A2860"); P(ccx, ccy, K.ink);
  blit();
  card({ tag: "BACKUP NAV", title: "OLD SCHOOL", sub: "COMPASS · CHARTS · RADIO", col: K.lime, icon: "plane", fill: 14 });
  if (!UI) return;
  TXT(ctx, "N", hx(ccx), hy(ccy - 14) - 36, 4, K.red, { align: "center", out: K.ink, ow: 2 });
  TXT(ctx, "RADIO BEACON", hx(30) + 10, hy(112) - 160, 3, K.lime, { out: K.ink, ow: 2 });
  big("NAVIGATE BY HAND", 1070, 6, K.yellow, tC, { panel: K.lime });
}
function cellTower(x, base) {
  L(x - 6, base, x, base - 60, "#8A8FB8"); L(x + 6, base, x, base - 60, "#8A8FB8"); for (let i = 1; i < 6; i++) { const y = base - i * 10, w = 6 - i; L(x - w, y, x + w, y, "#5A5F8A"); }
  R(x - 5, base - 56, 3, 9, "#E8E6F5"); R(x + 3, base - 56, 3, 9, "#E8E6F5"); R(x - 1, base - 66, 2, 6, "#8A8FB8");
}
function bank(x, base) {
  for (let i = 0; i < 10; i++) R(x - 22 + i * 2.2, base - 50 - i, 44 - i * 4.4, 1, "#C8C4E0");
  R(x - 22, base - 50, 44, 4, "#E8E6F5"); for (let c = 0; c < 5; c++) R(x - 18 + c * 9, base - 46, 4, 40, "#C8C4E0"); R(x - 24, base - 6, 48, 6, "#E8E6F5");
  TXT(g, "$", x - 2, base - 58, 1, K.yellow);
}
function pixClock(cx, cy, r, ok, ang, warn) {
  disc(cx, cy, r + 2, K.ink); disc(cx, cy, r + 1, ok ? K.lime : warn ? K.yellow : K.red); disc(cx, cy, r - 1, "#F4F1FF");
  for (let i = 0; i < 12; i++) P(cx + Math.cos(i * TAU / 12) * (r - 3), cy + Math.sin(i * TAU / 12) * (r - 3), "#5A5F8A");
  L(cx, cy, cx + Math.cos(ang) * (r - 4), cy + Math.sin(ang) * (r - 4), K.ink); L(cx, cy, cx + Math.cos(ang * 0.083 - 1) * (r - 7), cy + Math.sin(ang * 0.083 - 1) * (r - 7), K.ink); P(cx, cy, K.red);
}
function sClock() {
  const ts = p.tLose ?? [0.3, 0.7, 1.1];
  skyNight(240); stars(70, 120, 61);
  skyline(232, 9, ["#1E1A50", "#241F5E", "#171442"], 0.3, 30, 70, 12, 24);
  R(0, 232, LW, 88, "#120F2A"); R(0, 232, LW, 2, "#2C2860");
  cellTower(30, 232); pylon(90, 232, 70); bank(150, 232);
  const xs = [30, 90, 150];
  for (let i = 0; i < 3; i++) {
    const lost = lt >= ts[i], ll = lt - ts[i], bk = lost && ll > 0.5;
    const ang = lost && !bk ? lt * 30 : -Math.PI / 2 + lt * 6.28;
    pixClock(xs[i], 128, 13, !lost, ang, bk);
    if (lost && !bk) redX(xs[i], 128, 6);
    if (i === 0 && !lost) for (let j = 0; j < 2; j++) { const rr = 4 + ((lt * 12 + j * 6) % 12); g.globalAlpha = 0.7; ring(30, 172, rr, K.cyan, -Math.PI * 0.8, -Math.PI * 0.2); } g.globalAlpha = 1;
    if (lost) for (let j = 0; j < 2; j++) { const s2 = Math.floor(t * 8) + i * 9 + j; if (rnd(s2) < 0.4) spark(xs[i] + Math.round((rnd(s2 * 3) - 0.5) * 20), 180 + Math.round(rnd(s2 * 5) * 40), 2); }
  }
  blit();
  const nl = ts.filter((x) => lt >= x).length;
  card({ tag: "CLOCK SYNC", title: nl ? "GPS TIME: LOST" : "GPS TIME: OK", sub: nl === 3 ? "SWITCHING TO BACKUPS" : "SYNCING...", col: nl ? K.red : K.lime, subCol: nl === 3 ? K.yellow : K.lime, icon: "clock", fill: 24 - nl * 8, w: 720 });
  if (!UI) return;
  ["CELL", "GRID", "BANK"].forEach((s, i) => { TXT(ctx, s, hx(xs[i]), hy(104) - 20, 5, "#FFFFFF", { align: "center", out: K.ink, ow: 2 }); const lost = lt >= ts[i], bk = lost && lt - ts[i] > 0.5; if (bk) TXT(ctx, "BACKUP", hx(xs[i]), hy(148) , 3, K.yellow, { align: "center", out: K.ink, ow: 2 }); });
  big("GPS = THEIR CLOCK", 380, 6, K.yellow, 0.15, { panel: K.yellow });
}
function sMoney() {
  const c = clamp(p.cnt ?? 0);
  skyNight(240); stars(80, 170, 81);
  skyline(250, 5, [K.bldA, K.bldB, K.dk], 0.25, 40, 105, 18, 30);
  R(0, 250, LW, 70, "#120F2A"); R(0, 250, LW, 2, "#2C2860");
  for (let i = 0; i < 9; i++) moneyStack(4 + i * 19.5, 312, Math.floor(4 + rnd(i * 3) * 10 * (1 - c * 0.6)), c > 0.15);
  for (let i = 0; i < 14; i++) { const l = (lt * 0.5 + rnd(i)) % 1, x = rnd(i * 3) * LW + Math.sin(l * 6 + i) * 6, y = 300 - l * 140; g.globalAlpha = 1 - l; R(x, y, 6, 3, "#3FBF5A"); R(x + 2, y + 1, 2, 1, "#1E5A3A"); } g.globalAlpha = 1;
  blit();
  card({ tag: "DAMAGE REPORT", title: "GPS OUTAGE", sub: "US ESTIMATE · NIST 2019", col: K.yellow, icon: "cash", fill: Math.round(c * 24) });
  if (!UI) return;
  big("COST TO THE US", 330, 5, "#FFFFFF", 0.05);
  big("$" + fmt(Math.round(1e9 * c / 1e6) * 1e6), 430, 8, K.yellow, 0.1);
  big("EVERY DAY", 580, 9, K.red, p.tDay ?? 1.2, { panel: K.red });
}
function sWeather() {
  const d = clamp(p.data ?? 0), tU = p.tUnk ?? 99, unk = lt >= tU;
  R(0, 0, LW, LH, "#0E2456");
  for (let y = 0; y < LH; y += 6) for (let x = (y % 12) / 2; x < LW; x += 12) P(x, y, "#16306A");
  // coastline (land on the left)
  for (let y = 0; y < LH; y++) { const xc = 46 + Math.sin(y * 0.03) * 14 + Math.sin(y * 0.11) * 4 + (y > 200 ? (y - 200) * 0.25 : 0); R(0, y, xc, 1, "#1E3A2A"); R(xc, y, 2, 1, "#4A8A5A"); }
  for (const [x, y] of [[20, 120], [30, 200], [14, 260]]) { R(x - 1, y - 1, 3, 3, K.win); }
  // grid lines
  for (let x = 0; x < LW; x += 30) for (let y = 0; y < LH; y += 3) P(x, y, "#2A4A8A"); for (let y = 0; y < LH; y += 30) for (let x = 0; x < LW; x += 3) P(x, y, "#2A4A8A");
  // hurricane
  const hx0 = 128 - lt * 5, hy0 = 166 - lt * 3, rot = t * 1.8;
  for (let y = -44; y <= 44; y++) for (let x = -44; x <= 44; x++) {
    const r = Math.hypot(x, y); if (r > 44) continue;
    const th = Math.atan2(y, x), arm = Math.sin(th * 2 + Math.log(r + 1) * 3.2 - rot);
    if (r < 3) { P(hx0 + x, hy0 + y, "#0E2456"); continue; }
    const a = clamp((arm + 0.2) * 1.2) * clamp(1.3 - r / 44); if (a < 0.15) continue;
    g.globalAlpha = a; P(hx0 + x, hy0 + y, r < 12 ? "#FF3B4E" : r < 22 ? "#FFD23F" : r < 32 ? "#7CFF6B" : "#E8E6F5");
  }
  g.globalAlpha = 1;
  // forecast cone toward the coast: widens as data drops
  const spread = 0.12 + d * 0.9, ax = -Math.PI * 0.85;
  for (let s = 0; s < 70; s += 2) { for (const sg of [-1, 1]) { const a = ax + sg * spread; R(hx0 + Math.cos(a) * s * 1.4, hy0 + Math.sin(a) * s * 1.4, 2, 2, unk ? K.red : "#FFFFFF"); } }
  if (unk && blink(2)) for (const [x, y] of [[30, 110], [60, 80], [20, 160]]) TXT(g, "?", x, y, 3, K.red);
  GLX = d > 0.5 && rnd(Math.floor(t * 8)) < 0.2 ? 0.3 : 0;
  blit();
  const pc = Math.round(100 - 90 * d);
  card({ tag: "FORECAST", title: "SAT DATA: " + pc + "%", sub: unk ? "LANDFALL: UNKNOWN!" : "HURRICANE TRACKING", col: pc > 50 ? K.cyan : K.red, subCol: unk ? K.red : K.cyan, icon: "storm", fill: Math.round(24 * pc / 100) });
  if (!UI) return;
  if (d > 0.95) big("-90% DATA", 360, 11, K.red, p.tBig ?? 1.0, { panel: K.red });
  if (unk) big("LESS WARNING", 500, 7, K.yellow, tU);
  TXT(ctx, "HURRICANE", hx(hx0), hy(hy0 + 48), 4, "#FFFFFF", { align: "center", out: K.ink, ow: 2 });
}
const TL = [[1957, 1], [1970, 200], [1980, 400], [1990, 550], [2000, 800], [2010, 1000], [2015, 1400], [2019, 2200], [2021, 4800], [2023, 7500], [2024, 9500], [2025, 12500], [2026, 16988]];
const tlv = (yr) => { for (let i = 1; i < TL.length; i++) if (yr <= TL[i][0]) { const [a, va] = TL[i - 1], [b, vb] = TL[i]; return va + (vb - va) * (yr - a) / (b - a); } return TL[TL.length - 1][1]; };
function sTimeline() {
  const k = clamp(p.prog ?? 0), tC = p.tCrash ?? 99, cr = lt >= tC, lc = lt - tC;
  skyNight(LH, DARK); stars(80, LH, 91);
  const x0 = 18, x1 = 166, yb = 222, yt = 72;
  R(x0 - 2, yt - 6, 1, yb - yt + 8, "#5A5F8A"); R(x0 - 2, yb + 1, x1 - x0 + 6, 1, "#5A5F8A");
  for (let y = 0; y <= 4; y++) for (let x = x0; x < x1; x += 3) P(x, yb - y * (yb - yt) / 4, "#24204A");
  const yr = 1957 + 69 * k, px = (y) => x0 + (x1 - x0) * (y - 1957) / 69, py = (v) => yb - (yb - yt) * v / 17000;
  let lx = px(1957), ly = py(1);
  const drop = cr ? clamp(lc / 0.4) : 0;
  for (let y = 1957; y <= yr; y += 0.25) { const X = px(y), Y = py(tlv(y)) + (yb - py(tlv(y))) * drop; L(lx, ly, X, Y, cr ? K.red : K.yellow); g.globalAlpha = 0.25; R(X, Y, 1, yb - Y, cr ? K.red : K.yellow); g.globalAlpha = 1; lx = X; ly = Y; }
  R(lx - 1, ly - 1, 3, 3, "#FFFFFF");
  // sputnik at the start
  disc(px(1957) + 4, yb - 18, 3, "#C8C4E0"); P(px(1957) + 3, yb - 19, "#FFFFFF"); L(px(1957) + 2, yb - 16, px(1957) - 4, yb - 6, "#8A8FB8"); L(px(1957) + 4, yb - 15, px(1957) + 1, yb - 4, "#8A8FB8");
  if (cr && lc < 0.6) { g.globalAlpha = 1 - lc / 0.6; disc(lx, yb, 6 + lc * 30, K.orange); g.globalAlpha = 1; }
  SHK = cr && lc < 0.5 ? 1.5 : 0;
  blit();
  card({ tag: "TIMELINE", title: "1957 > 2026", sub: cr ? "GONE IN ONE NIGHT" : "SPUTNIK TO 17,000", col: cr ? K.red : K.yellow, subCol: cr ? K.red : K.yellow, icon: "chart", fill: Math.round(k * 24) });
  if (!UI) return;
  TXT(ctx, String(Math.floor(yr)), hx(x1), hy(yb) + 30, 5, "#FFFFFF", { align: "right", out: K.ink, ow: 2 });
  TXT(ctx, "1957", hx(x0), hy(yb) + 30, 5, "#A9A4E0", { out: K.ink, ow: 2 });
  TXT(ctx, "SPUTNIK 1", hx(px(1957) + 8), hy(yb - 22), 3, "#C8C4E0", { out: K.ink, ow: 2 });
  if (!cr && k > 0.98) TXT(ctx, "16,988", hx(lx) - 16, hy(ly) - 10, 4, K.yellow, { align: "right", out: K.ink, ow: 2 });
  if (k > 0.98 && !cr) big("69 YEARS", 1070, 12, K.yellow, p.tBig ?? 0, { panel: K.yellow });
  if (cr) big("0", 1070, 14, K.red, tC, { panel: K.red });
}
function sEnd() {
  skyNight(200); stars(120, 180, 17);
  for (let i = 0; i < 3; i++) { const ph = (lt * 0.3 + i * 0.37) % 1; if (ph < 0.3) streak(150 - ph * 300 + i * 20, 20 + ph * 200 + i * 15, -0.9, 0.8, 18, 1 - ph * 3); }
  skyline(196, 4, ["#1E1A50", "#241F5E", "#171442"], 0.15, 30, 90, 12, 22);
  R(0, 196, LW, 8, "#3A3486"); R(0, 196, LW, 2, "#5D4FC0"); R(0, 204, LW, 116, "#1C1846");
  for (let x = 0; x < LW; x += 20) R(x, 204, 1, 116, "#16133A");
  R(130, 220, 34, 22, "#2A2860"); R(132, 222, 30, 18, "#211E50");
  R(20, 176, 2, 22, "#5A5F8A"); for (let i = 0; i < 9; i++) R(12 + i * 0.4, 168 + i, 18 - i * 0.8, 1, "#8A8FB8"); P(21, 174, K.red);
  const kx = 82, ky = 175; spr(KID, kx, ky, KIDMAP);
  R(kx + 7, ky + 13, 3, 4, "#BFF8FF"); if (blink(1)) { R(kx + 7, ky + 13, 3, 1, K.red); }
  blit();
  card({ tag: "NIGHT SKY", title: "ORBIT: EMPTY", sub: "WHAT WOULD YOU MISS FIRST?", col: K.lime, subCol: K.yellow, icon: "night", fill: 0 });
  if (!UI) return;
  const bob = Math.round(Math.sin(lt * 4) * 2) * 6, qx = hx(kx + 5), qy = hy(ky - 26) + bob;
  ctx.fillStyle = K.ink; ctx.fillRect(qx - 66, qy - 6, 132, 132); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(qx - 60, qy, 120, 120); ctx.fillRect(qx - 12, qy + 120, 24, 18);
  TXT(ctx, "?", qx, qy + 18, 12, K.pink, { align: "center" });
  big("SATELLITES: 0", 360, 7, K.red, 0.1, { panel: K.red });
}
[sOrbit, sMeteor, sIss, sPhone, sNav, sClock, sMoney, sWeather, sTimeline, sEnd][S]();
