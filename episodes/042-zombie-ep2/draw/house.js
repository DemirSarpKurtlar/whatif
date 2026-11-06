// cross-section of your house: attic above, dark hallway + back door below.
// p: cx, cy, zoom, shake, climb 0..1 (you on the ladder; omit = you in the attic), pull 0..1 (ladder up + hatch shut),
//    dark 0..1 (attic darkness), door 0..1 (back door burst open), zx (zombie x below; omit = none), zflip,
//    rings 0..1 (sound waves), phone 0..1 (phone glow), vent 0..1 (siren light through the vent), dust 0..1
cam(p.cx || W / 2, p.cy || 960, p.zoom || 1, p.shake || 0);
sky(PAL.navy0, "#2A2466", 0.25); stars(90, 700, 31);
ground(1600, "#1B2153", "#232A66");
const FY = 900, FB = 945, GY = 1600; // attic floor top/bottom, ground
// --- ground floor (hallway) — power is out
rr(70, FB, 940, GY - FB, 0, "#1A1D4C");
rr(70, GY - 40, 940, 40, 0, "#14173E");
for (let i = 0; i < 9; i++) rr(70 + i * 105, FB, 4, GY - FB - 40, 2, "rgba(255,255,255,0.03)");
// kitchen counter + fridge (right)
rr(760, 1330, 230, 230, 10, "#262A66"); rr(750, 1315, 250, 26, 8, "#30357A"); rr(800, 1380, 60, 10, 4, "#3A3F9C"); rr(900, 1380, 60, 10, 4, "#3A3F9C");
rr(860, 1060, 130, 255, 12, "#2C3180"); rr(975, 1110, 8, 60, 4, "#1B1F52");
// picture frame
rr(560, 1080, 130, 100, 8, "#30357A"); rr(574, 1094, 102, 72, 4, "#1D2257"); circ(625, 1140, 18, "#2EC4B6");
// back door (left wall): frame + door that bursts open
const dk = cl(p.door || 0);
rr(120, 1150, 210, 410, 8, "#11143A");
if (dk > 0) { // outside through the open doorway: moonlit night
  const g = ctx.createLinearGradient(0, 1150, 0, 1560); g.addColorStop(0, "#4A3F9A"); g.addColorStop(1, "#2B2A70"); ctx.fillStyle = g; ctx.fillRect(132, 1162, 186, 398);
  circ(270, 1230, 26, "rgba(247,232,198,0.9)");
}
const dx2 = 318 - 230 * dk; // free edge swings in toward the hallway
poly([132, 1162, 132, 1560, dx2, 1560 + 26 * dk, dx2, 1162 - 26 * dk], dk > 0 ? "#3A2F6E" : "#3A2F6E");
if (dk < 0.5) { rr(150, 1190, 70, 140, 6, "#2E2560"); rr(232, 1190, 70, 140, 6, "#2E2560"); circ(300, 1370, 12, "#C9A64B"); }
if (dk > 0) for (let i = 0; i < 9; i++) { // splinters
  const a = rnd(i * 3) * 1.6 - 0.2, sp = 160 + rnd(i) * 260, k = cl((t - (p.doorAt || 0)) * 2.5);
  const x = 330 + Math.cos(a) * sp * k, y = Math.min(GY - 44 - rnd(i + 2) * 20, 1300 + Math.sin(a) * sp * k * 0.6 + 200 * k * k);
  poly([x, y, x + 26, y + 8, x + 4, y + 18], "#C9A26B");
}
// --- zombie downstairs
if (p.zx !== undefined) {
  zombie(p.zx, GY - 30, 0.82, { flip: !!p.zflip, speed: 2.4, phase: 1.3 });
}
// --- attic: roof triangle
const AX = 540, AY = 330, L = 60, R = 1020;
poly([L - 30, FY + 10, AX, AY - 50, R + 30, FY + 10], "#3B2C5E"); // roof tiles edge
poly([L + 20, FY, AX, AY, R - 20, FY], "#24285E");
// rafters
ctx.save(); ctx.beginPath(); ctx.moveTo(L + 20, FY); ctx.lineTo(AX, AY); ctx.lineTo(R - 20, FY); ctx.closePath(); ctx.clip();
for (let i = -3; i <= 3; i++) rr(AX + i * 120 - 7, AY, 14, FY - AY, 3, "#1C1F4E");
rr(L, 640, R - L, 16, 3, "#1C1F4E");
// boxes
rr(140, 790, 150, 110, 8, "#8C6A45"); rr(140, 790, 150, 20, 6, "#A07B50"); rr(205, 790, 20, 110, 2, "#C9A26B");
rr(800, 820, 120, 80, 8, "#7A5B3C"); rr(830, 760, 80, 60, 6, "#8C6A45");
// vent (louvres) on the right slope wall
const vx = 700, vy = 610; rr(vx, vy, 120, 110, 8, "#11143A");
const vk = p.vent || 0; if (vk > 0) { const on = Math.sin(t * 9) > 0; rr(vx + 8, vy + 8, 104, 94, 4, on ? `rgba(255,59,78,${0.75 * vk})` : `rgba(70,120,255,${0.75 * vk})`); }
for (let i = 0; i < 5; i++) rr(vx + 6, vy + 12 + i * 19, 108, 9, 3, "#2A2F78");
if (vk > 0) { const on = Math.sin(t * 9) > 0; const g = ctx.createRadialGradient(vx + 60, vy + 55, 10, vx + 60, vy + 55, 420); const c = on ? "255,59,78" : "70,120,255"; g.addColorStop(0, `rgba(${c},${0.28 * vk})`); g.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = g; ctx.fillRect(vx - 420, vy - 420, 900, 900); }
ctx.restore();
// attic floor slab with the hatch hole
const HX0 = 450, HX1 = 610, pull = cl(p.pull || 0);
rr(L - 10, FY, R - L + 20, FB - FY, 4, "#3A2F6E"); rr(L - 10, FY, R - L + 20, 10, 4, "#4A3F86");
rr(HX0, FY, HX1 - HX0, FB - FY, 0, pull > 0.85 ? "#2E2560" : "#0A0C26");
if (pull > 0.85) { rr(HX0, FY, HX1 - HX0, 8, 2, "#4A3F86"); rr(HX0 + 60, FY - 6, 40, 8, 3, "#C9A64B"); }
// ladder (folds up as you pull)
const lb = lerp(GY - 40, FB + 10, E["ease-in-out"](pull)); if (pull < 0.97) {
  limb(HX0 + 30, FB, HX0 + 30, lb, 16, "#B08E3F"); limb(HX1 - 30, FB, HX1 - 30, lb, 16, "#B08E3F");
  for (let y = FB + 60; y < lb - 10; y += 85) rr(HX0 + 30, y, HX1 - HX0 - 60, 14, 5, "#C9A64B");
}
// --- you
const cmb = p.climb;
if (cmb !== undefined && cmb < 1) {
  const fy = lerp(GY - 40, FY, E["ease-out"](cl(cmb / 0.85))), fx = lerp(530, p.px || 330, E["ease-in-out"](cl((cmb - 0.75) / 0.25)));
  person(fx, fy, 0.72, { pose: cmb < 0.85 ? "run" : "idle", look: -0.3, mouth: "o" });
} else if (p.you !== "none") {
  const px = p.px || 330;
  person(px, FY, 0.72, { pose: p.phone ? "phone" : p.scared ? "scared" : "idle", light: 0, mouth: "o", sweat: p.sweat ? 1 : 0, look: p.look ?? 0.6, flip: !!p.flip });
}
// dust falling from the attic floor when something bumps below
if (p.dust) for (let i = 0; i < 18; i++) { const x = HX0 - 80 + rnd(i) * 320, y = FB + ((t * 120 + rnd(i + 3) * 400) % 400); circ(x, y, 3 + rnd(i + 7) * 3, `rgba(200,190,230,${0.5 * p.dust})`); }
// darkness in the attic (and below)
const dkn = p.dark || 0;
if (dkn > 0) {
  ctx.fillStyle = `rgba(4,5,18,${0.88 * dkn})`; ctx.beginPath(); ctx.moveTo(L - 40, FB); ctx.lineTo(AX, AY - 60); ctx.lineTo(R + 40, FB); ctx.closePath(); ctx.fill();
  ctx.fillStyle = `rgba(4,5,18,${0.55 * dkn})`; ctx.fillRect(60, FB, 960, GY - FB);
  if (p.you !== "none" && (cmb === undefined || cmb >= 1)) { // only your eyes in the dark
    const px = p.px || 330, hy = FY - 330 * 0.72; const bl = (Math.sin(t * 1.3) > 0.97) ? 0.2 : 1;
    ctx.save(); ctx.globalAlpha = dkn; ctx.fillStyle = "#FFFFFF";
    ctx.beginPath(); ctx.ellipse(px - 18, hy + 12, 11, 11 * bl, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(px + 18, hy + 12, 11, 11 * bl, 0, 0, TAU); ctx.fill();
    circ(px - 18 + 5, hy + 13, 5, "#1B1F52"); circ(px + 18 + 5, hy + 13, 5, "#1B1F52"); ctx.restore();
  }
}
// phone glow on your face
if (p.phone) { const px = p.px || 330; const g = ctx.createRadialGradient(px + 50, FY - 200, 10, px + 50, FY - 200, 300); g.addColorStop(0, `rgba(190,220,255,${0.4 * p.phone})`); g.addColorStop(1, "rgba(190,220,255,0)"); ctx.fillStyle = g; ctx.fillRect(px - 300, FY - 500, 700, 600); }
// sound rings rising from the zombie towards the hatch
if (p.rings && p.zx !== undefined) for (let i = 0; i < 3; i++) {
  const k = ((lt * 0.9 + i / 3) % 1); ctx.strokeStyle = `rgba(255,210,63,${(1 - k) * 0.85 * p.rings})`; ctx.lineWidth = 8; ctx.beginPath();
  ctx.arc(p.zx + 40, GY - 330, 60 + k * 330, -Math.PI * 0.85, -Math.PI * 0.15); ctx.stroke();
}
