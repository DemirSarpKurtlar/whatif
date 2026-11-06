// the back door bursts open; a silhouette in the doorway. p: open 0..1, shake, zoom, cy, step 0..1 (silhouette steps in)
cam(W / 2, p.cy || 960, p.zoom || 1, p.shake || 0);
rr(-W, -H, W * 3, H * 3, 0, "#161A44"); rr(-W, 1500, W * 3, H, 0, "#101333");
for (let i = -2; i < 12; i++) rr(i * 120, 1500, 4, 600, 2, "rgba(255,255,255,0.04)");
const k = E["ease-out"](cl(p.open || 0));
// frame + outside (moonlit garden)
rr(290, 420, 500, 1090, 16, "#2A2F78");
ctx.save(); ctx.beginPath(); ctx.rect(320, 450, 440, 1060); ctx.clip();
const g = ctx.createLinearGradient(0, 450, 0, 1510); g.addColorStop(0, "#5B4BB0"); g.addColorStop(0.7, "#3A3290"); g.addColorStop(1, "#262463"); ctx.fillStyle = g; ctx.fillRect(320, 450, 440, 1060);
circ(650, 600, 70, "rgba(247,232,198,0.95)"); circ(630, 585, 14, "rgba(220,205,170,0.8)");
tree(420, 1300, 0.9); rr(320, 1300, 440, 220, 0, "#232A66");
const st = p.step || 0;
silhouette(520, 1530 + 30 * st, 2.0 + 0.25 * st, "rgba(8,10,30,0.97)", 0.5);
ctx.restore();
// the door swinging in toward you
const fx = 760 - 700 * k, grow = 160 * k;
poly([320, 450, 320, 1510, fx, 1510 + grow, fx, 450 - grow], "#3A2F6E");
if (k < 0.3) { rr(360, 500, 160, 300, 8, "#2E2560"); rr(560, 500, 160, 300, 8, "#2E2560"); rr(360, 860, 160, 560, 8, "#2E2560"); rr(560, 860, 160, 560, 8, "#2E2560"); circ(710, 990, 20, "#C9A64B"); }
else { ctx.strokeStyle = "rgba(20,16,50,0.6)"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(lerp(320, fx, 0.5), 500); ctx.lineTo(lerp(320, fx, 0.5), 1460); ctx.stroke(); }
// old scratch marks stay on the frame
scratches(300, 900, 1);
// splinters + impact lines
if (k > 0) {
  const lk = cl(lt / 0.9);
  for (let i = 0; i < 14; i++) { const a = rnd(i * 5) * TAU, d = (120 + rnd(i) * 520) * lk; const x = 760 + Math.cos(a) * d, y = 980 + Math.sin(a) * d + 300 * lk * lk;
    ctx.save(); ctx.translate(x, y); ctx.rotate(a + lt * 6); poly([0, 0, 46, 10, 8, 26], "#C9A26B"); ctx.restore(); }
  if (lt < 0.5) { ctx.strokeStyle = `rgba(255,255,255,${0.8 * (1 - lt / 0.5)})`; ctx.lineWidth = 8; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; ctx.beginPath(); ctx.moveTo(760 + Math.cos(a) * 140, 980 + Math.sin(a) * 140); ctx.lineTo(760 + Math.cos(a) * 260, 980 + Math.sin(a) * 260); ctx.stroke(); } }
}
