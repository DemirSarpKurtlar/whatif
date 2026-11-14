// EP4: close-up of your wrist under the torn purple cuff — a thin red scratch. From the zombie... or the fence?
// p: scr 0..1 (scratch draws in), q 0..1 (two "?" bubbles: zombie hand vs fence nail), glow 0..1 (red pulse), zoom
cam(W / 2, 960, p.zoom || 1, p.shake || 0);
{ const g = ctx.createRadialGradient(540, 900, 100, 540, 900, 1200); g.addColorStop(0, "#3A3584"); g.addColorStop(1, "#11143A"); ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3); }
// forearm across the frame, palm down, hand to the right
ctx.save(); ctx.translate(540, 1000); ctx.rotate(-0.12);
rr(-760, -150, 900, 300, 140, PAL.skin); // forearm
rr(-760, -150, 900, 60, [140, 140, 0, 0], "rgba(223,167,127,0.5)");
circ(250, 0, 170, PAL.skin); // hand
for (let i = 0; i < 4; i++) rr(330, -120 + i * 64, 220 - Math.abs(i - 1.5) * 30, 56, 28, PAL.skin);
rr(200, -210, 160, 60, 30, PAL.skin); // thumb
// the torn hoodie cuff pulled back
rr(-900, -200, 420, 400, 80, PAL.hoodie); rr(-560, -200, 90, 400, 40, PAL.hoodie2);
for (let i = 0; i < 6; i++) limb(-480, -170 + i * 64, -440 + rnd(i) * 40, -160 + i * 64 + rnd(i + 2) * 30, 7, PAL.hoodie2);
// the scratch (3 thin lines) drawing in
const sk = cl(p.scr || 0);
const pulse = cl(p.glow || 0) * (0.5 + 0.5 * Math.sin(t * 7));
if (pulse > 0) { const g = ctx.createRadialGradient(-120, 0, 10, -120, 0, 260); g.addColorStop(0, `rgba(255,59,78,${0.45 * pulse})`); g.addColorStop(1, "rgba(255,59,78,0)"); ctx.fillStyle = g; ctx.fillRect(-400, -280, 560, 560); }
for (let i = 0; i < 3; i++) { const k = cl(sk * 3 - i * 0.6); if (k <= 0) continue; const x0 = -260 + i * 50, y0 = -70 + i * 16, x1 = x0 + 260 * k, y1 = y0 + 70 * k;
  limb(x0, y0, x1, y1, 12 - i * 2, "#C0213A"); limb(x0, y0, x1, y1, 4, "#FF6B7A"); }
ctx.restore();
// "?" bubbles: zombie hand vs fence
const q = cl(p.q || 0);
function bubble(x, y, k, draw, label) { if (k <= 0) return; const s = E.back(k); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circ(0, 0, 170, "rgba(255,255,255,0.95)"); circ(70 * (x < 540 ? 1 : -1), 200, 26, "rgba(255,255,255,0.95)"); circ(110 * (x < 540 ? 1 : -1), 250, 14, "rgba(255,255,255,0.95)");
  draw(); ctx.font = "40px LHeavy"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; const w = ctx.measureText(label).width + 40;
  rr(-w / 2, 130, w, 64, 32, "#151A45"); ctx.fillStyle = "#FFFFFF"; ctx.fillText(label, 0, 163); ctx.restore(); }
bubble(270, 420, cl(q * 2), () => { // zombie hand
  circ(0, 10, 60, PAL.zskin); for (let i = 0; i < 4; i++) { const a = -2.2 + i * 0.42; limb(Math.cos(a) * 50, 10 + Math.sin(a) * 50, Math.cos(a) * 110, 10 + Math.sin(a) * 110, 26, PAL.zskin); circ(Math.cos(a) * 110, 10 + Math.sin(a) * 110, 9, "#4A6A36"); }
  limb(-20, 60, -40, 130, 50, PAL.zcloth); }, "ZOMBIE?");
bubble(810, 420, cl(q * 2 - 0.7), () => { // picket fence with a bent nail
  for (let i = 0; i < 3; i++) { rr(-95 + i * 70, -80, 50, 170, 6, "#C9C4E3"); poly([-95 + i * 70, -80, -70 + i * 70, -110, -45 + i * 70, -80], "#C9C4E3"); }
  rr(-110, -20, 220, 16, 4, "#B0AACF"); rr(-110, 40, 220, 16, 4, "#B0AACF");
  limb(-15, 10, 40, -10, 8, "#5A5F8A"); limb(40, -10, 52, -34, 8, "#5A5F8A"); }, "FENCE?");
