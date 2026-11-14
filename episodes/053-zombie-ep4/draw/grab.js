// EP4: close-up — a zombie hand grabs your purple sleeve on the handlebar, you rip free.
// p: grab 0..1 (hand reaches + closes), rip 0..1 (you tear free, hand falls behind), shake, zoom
cam(W / 2, 960, p.zoom || 1, p.shake || 0);
const off = lt * 1400;
// blurred street rushing past
{ const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#5E6FC6"); g.addColorStop(0.55, "#E39A92"); g.addColorStop(1, "#FFD9A0"); ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3); }
for (let i = 0; i < 9; i++) { const x = ((i * 260 - off * 0.6) % 2340 + 2340) % 2340 - 600; rr(x, 380 + rnd(i) * 300, 180 + rnd(i + 3) * 160, 900, 10, i % 2 ? "rgba(77,63,134,0.55)" : "rgba(107,78,147,0.5)"); }
for (let i = 0; i < 26; i++) { const y = rnd(i * 2) * H, x = ((rnd(i) * 1600 - off * (1 + rnd(i + 1))) % 1600 + 1600) % 1600 - 300; rr(x, y, 260, 10, 5, "rgba(255,255,255,0.35)"); }
rr(-W, 1500, W * 3, 900, 0, PAL.road);
// handlebar + your arm reaching across from the left
const rip = cl(p.rip || 0), gk = cl(p.grab || 0), pull = E["ease-out"](rip);
const AY = 980 - 40 * pull;
limb(560, 1150, 1180, 1050, 40, "#1B1F52"); limb(880, 1110, 870, 1500, 34, "#1B1F52");
rr(940, 1010, 150, 70, 30, "#2A2E4E"); // grip
// your sleeve (purple hoodie), cuff, hand on the grip
limb(-200, AY + 150, 880, AY + 40, 190, PAL.hoodie);
limb(-200, AY + 190, 880, AY + 80, 50, PAL.hoodie2);
rr(800, AY - 50, 120, 190, 40, "#6C43D4"); // cuff
circ(985, 1040, 70, PAL.skin); for (let i = 0; i < 4; i++) rr(940 + i * 30, 1000, 26, 90, 12, PAL.skin2);
// torn threads where the hand was
if (rip > 0.2) for (let i = 0; i < 6; i++) limb(420 + i * 18, AY + 210, 400 + i * 22 + rnd(i) * 30, AY + 250 + rnd(i + 5) * 60, 5, PAL.hoodie2);
// the zombie hand: reaches up from bottom-left, closes on the sleeve, then gets torn away and falls behind
const hx = lerp(260, 470, E["ease-out"](cl(gk / 0.6))) - 700 * E["ease-in"](rip), hy = lerp(1650, AY + 180, E["ease-out"](cl(gk / 0.6))) + 500 * E["ease-in"](rip);
const close = cl((gk - 0.55) / 0.45);
ctx.save(); ctx.translate(hx, hy); ctx.rotate(-0.5 - rip * 1.2);
limb(0, 120, -60, 900, 120, PAL.zcloth); // ragged arm
poly([-80, 300, -20, 340, 30, 290, 60, 360, 70, 260, -70, 250], PAL.zcloth);
circ(0, 0, 95, PAL.zskin); circ(-30, 30, 30, PAL.zskin2);
for (let i = 0; i < 4; i++) { const a = -1.9 + i * 0.38, len = lerp(150, 70, close); const fx = Math.cos(a) * 70, fy = Math.sin(a) * 70;
  limb2(fx, fy, fx + Math.cos(a) * len * 0.6, fy + Math.sin(a) * len * 0.6, fx + Math.cos(a + close * 1.4) * len, fy + Math.sin(a + close * 1.4) * len, 34, PAL.zskin);
  circ(fx + Math.cos(a + close * 1.4) * len, fy + Math.sin(a + close * 1.4) * len, 12, "#4A6A36"); }
limb2(60, 40, 140, 10, 150 + close * 10, -40 + close * 50, 34, PAL.zskin); // thumb
ctx.restore();
// impact burst when it grabs, and when you rip free
function burst(x, y, k, col) { if (k <= 0 || k >= 1) return; ctx.save(); ctx.globalAlpha = 1 - k; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; limb(x + Math.cos(a) * 60 * (1 + k * 2), y + Math.sin(a) * 60 * (1 + k * 2), x + Math.cos(a) * 140 * (1 + k * 2), y + Math.sin(a) * 140 * (1 + k * 2), 12, col); } ctx.restore(); }
burst(470, AY + 180, cl((gk - 0.6) * 3), "#FFD23F");
burst(470, AY + 160, cl(rip * 1.8), "#FFFFFF");
// "RIIIP" pop
if (rip > 0.05) { const k = E.back(cl(rip * 3)); ctx.save(); ctx.globalAlpha = cl(2 - rip * 2); ctx.translate(560, 640); ctx.rotate(-0.1); ctx.scale(k, k);
  ctx.font = "120px LHeavy"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineWidth = 18; ctx.strokeStyle = "#151A45"; ctx.strokeText("RIIIP!", 0, 0); ctx.fillStyle = "#FFFFFF"; ctx.fillText("RIIIP!", 0, 0); ctx.restore(); }
// red danger vignette while it holds you
{ const k = cl(gk * 2) * (1 - rip); const g = ctx.createRadialGradient(540, 960, 300, 540, 960, 1100); g.addColorStop(0, "rgba(255,59,78,0)"); g.addColorStop(1, `rgba(255,59,78,${0.45 * k})`); ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3); }
