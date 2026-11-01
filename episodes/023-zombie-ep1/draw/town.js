// town street at night with shambling silhouettes. p: zoom, cx, cy, n (zombies), siren, lit, glow
cam(p.cx || W / 2, p.cy || H / 2, p.zoom || 1, p.shake || 0);
sky(PAL.navy0, "#2A2466", p.glow || 0); stars(120, H * 0.55, 3);
skyline(1250, p.lit ?? 1, 4, 0.9, "#232A70");
skyline(1330, p.lit ?? 1, 9, 1.05, PAL.bld1);
ground(1330, "#1B2153", "#232A66"); road(1400, 170);
lamp(150, 1400, 380, p.lit ?? 1); lamp(820, 1400, 380, p.lit ?? 1);
tree(980, 1400, 1.1); tree(-20, 1400, 0.9);
if (p.siren) siren(540, 1250, p.siren);
const n = Math.round(p.n || 0);
for (let i = 0; i < n; i++) { const x = 80 + ((i * 197 + lt * (40 + i * 6)) % 1000); silhouette(x, 1600 + (i % 3) * 50, 0.62 + (i % 2) * 0.12, "rgba(10,12,40,0.96)", i * 1.7); }
