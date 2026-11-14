// EP4: 6:42 AM — exactly 7 hours after the first bite (11:42 PM), the infected double again: 64 -> 128.
// p: dbl 0..1 (the second 64 icons turn green in a wave), mm (clock minutes), num 0..1 (number pops), zoom
cam(W / 2, 960, p.zoom || 1, 0);
sky("#141846", "#2A2466"); stars(50, 700, 7);
skyline(1700, 0, 3, 0.9, "#232A66");
// digital clock
const mm = Math.floor(p.mm ?? 42);
rr(250, 250, 580, 190, 40, "rgba(14,18,54,0.9)");
ctx.font = "130px LHeavy"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#FFB36B"; ctx.fillText(`6:${String(mm).padStart(2, "0")}`, 500, 350);
ctx.font = "44px LHeavy"; ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.fillText("AM", 735, 375);
// 128 people icons: 16 x 8; the first 64 already infected, the next 64 flip in a wave
const dk = cl(p.dbl || 0), cols = 16, rows = 8, gx = 105, gy = 500, sp = 58;
for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
  const i = r * cols + c, wave = (c + (rows - 1 - r) * 0.5) / (cols + 3.5);
  const inf = i < 64 || dk > wave + 0.02;
  const pop = i >= 64 && inf ? 1 + 0.5 * Math.max(0, 1 - (dk - wave) * 8) : 1;
  ctx.save(); ctx.translate(gx + c * sp + 6, gy + r * 76 + 40); ctx.scale(pop, pop); icon(0, 0, 0.95, inf); ctx.restore();
}
// counter: 64 -> 128
const n = Math.round(lerp(64, 128, E["ease-in"](dk))), nk = 1 + 0.18 * Math.max(0, 1 - Math.abs(dk - 1) * 10) * (dk >= 1 ? 1 : 0);
ctx.save(); ctx.translate(540, 1160); ctx.scale(nk, nk); ctx.font = "190px LHeavy"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
ctx.lineWidth = 26; ctx.strokeStyle = "rgba(10,12,40,0.6)"; ctx.strokeText(String(n), 0, 0); ctx.fillStyle = "#FF4D5E"; ctx.fillText(String(n), 0, 0); ctx.restore();
{ ctx.font = "34px LHeavy"; const label = "INFECTED IN TOWN"; const w = ctx.measureText(label).width + 60; rr(540 - w / 2, 1258, w, 56, 28, "#FFFFFF"); ctx.fillStyle = "#151A45"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(label, 540, 1288); }
// "x2" badge
if (dk > 0.15) { const k = E.back(cl((dk - 0.15) * 3)); ctx.save(); ctx.translate(850, 1120); ctx.rotate(0.15); ctx.scale(k, k); circ(0, 0, 80, PAL.red); ctx.font = "80px LHeavy"; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("×2", 0, 6); ctx.restore(); }
