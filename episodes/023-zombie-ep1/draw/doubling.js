// 1 -> 2 -> 4 -> 8 infected icons. p: n (infected count shown)
sky(PAL.navy0, PAL.navy1); stars(80, H, 11);
const cols = 4, rows = 2, n = Math.round(p.n || 1);
for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
  const i = r * cols + c, inf = i < n; const x = 270 + c * 180, y = 980 + r * 250;
  const pop = inf ? 1 + 0.25 * Math.max(0, 1 - (lt - (p.at ? p.at[i] || 0 : 0)) * 3) : 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(pop * 2.2, pop * 2.2); icon(0, 0, 1, inf); ctx.restore();
}
