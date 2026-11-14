// EP4 choice (split screen at the stadium gate): A show the guards the scratch · B hide it under your sleeve. p: bAt
rr(0, 0, W, H, 0, "#151946");
function morning() { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#5E7FD6"); g.addColorStop(0.5, "#E99A9A"); g.addColorStop(0.8, "#FFC27A"); g.addColorStop(1, "#FFE7B8"); ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3); }
function fence(x0, x1) { ctx.save(); ctx.beginPath(); ctx.rect(x0, 1000, x1 - x0, 300); ctx.clip(); ctx.strokeStyle = "rgba(220,224,245,0.5)"; ctx.lineWidth = 4;
  for (let x = x0 - 300; x < x1; x += 34) { ctx.beginPath(); ctx.moveTo(x, 1000); ctx.lineTo(x + 300, 1300); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 300, 1000); ctx.lineTo(x, 1300); ctx.stroke(); } ctx.restore(); rr(x0, 990, x1 - x0, 12, 5, "#B9BCD8"); }
function guard(x, y, s, flip) { ctx.save(); if (flip) { ctx.translate(x, 0); ctx.scale(-1, 1); ctx.translate(-x, 0); }
  const OL = "#5E6B3A", OL2 = "#4B5730", hy = y - 330 * s;
  limb(x - 22 * s, y - 150 * s, x - 26 * s, y - 22 * s, 42 * s, OL2); limb(x + 22 * s, y - 150 * s, x + 26 * s, y - 22 * s, 42 * s, OL2);
  rr(x - 74 * s, y - 285 * s, 148 * s, 160 * s, 40 * s, OL); rr(x - 64 * s, y - 250 * s, 128 * s, 80 * s, 16 * s, OL2);
  limb2(x - 62 * s, y - 255 * s, x - 95 * s, y - 185 * s, x - 82 * s, y - 128 * s, 34 * s, OL); limb2(x + 62 * s, y - 255 * s, x + 110 * s, y - 220 * s, x + 170 * s, y - 250 * s, 34 * s, OL);
  circ(x + 170 * s, y - 250 * s, 17 * s, PAL.skin); rr(x + 170 * s, y - 266 * s, 60 * s, 30 * s, 8, "#2A2E3E");
  const g = ctx.createLinearGradient(x + 230 * s, 0, x + 600 * s, 0); g.addColorStop(0, "rgba(255,250,210,0.6)"); g.addColorStop(1, "rgba(255,250,210,0)"); poly([x + 230 * s, y - 262 * s, x + 620 * s, y - 360 * s, x + 620 * s, y - 100 * s, x + 230 * s, y - 238 * s], g);
  circ(x, hy, 66 * s, PAL.skin); ctx.fillStyle = OL; ctx.beginPath(); ctx.arc(x, hy - 8 * s, 82 * s, Math.PI, 0); ctx.fill(); rr(x - 92 * s, hy - 16 * s, 184 * s, 22 * s, 10 * s, OL2);
  circ(x + 6 * s, hy + 18 * s, 9 * s, "#1B1F52"); circ(x + 42 * s, hy + 18 * s, 9 * s, "#1B1F52"); limb(x + 4 * s, hy + 46 * s, x + 36 * s, hy + 46 * s, 6 * s, "#7A2333"); ctx.restore(); }
// ---------- left: you hold your wrist up to the guard's flashlight
ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2 - 6, H); ctx.clip();
morning(); ground(1300, "#3D3B7E", "#4C4A93"); fence(-20, 540);
guard(110, 1700, 0.62, false);
person(380, 1720, 0.72, { pose: "point", look: -0.6, mouth: "o", flip: true });
// the raised wrist with a red mark
circ(380 - 200 * 0.72, 1720 - 330 * 0.72, 22, "#FF3B4E");
{ const pk = 0.5 + 0.5 * Math.sin(t * 6); ctx.strokeStyle = `rgba(255,59,78,${0.7 * pk})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(380 - 200 * 0.72, 1720 - 330 * 0.72, 46 + 10 * pk, 0, TAU); ctx.stroke(); }
rr(60, 360, 420, 80, 26, "rgba(14,18,54,0.8)"); ctx.font = "40px LHeavy"; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("TELL THE TRUTH", 270, 402);
ctx.restore();
// ---------- right: you tug the sleeve down and look away
ctx.save(); ctx.beginPath(); ctx.rect(W / 2 + 6, 0, W / 2, H); ctx.clip();
morning(); ground(1300, "#3D3B7E", "#4C4A93"); fence(546, 1100);
person(800, 1720, 0.72, { pose: "scared", look: -0.9, mouth: "o", sweat: 1 });
// the sleeve pulled down over the hand
rr(740, 1720 - 330 * 0.72 + 40, 120, 54, 22, PAL.hoodie2);
for (let i = 0; i < 3; i++) { const k = (lt * 1.1 + i / 3) % 1; ctx.save(); ctx.globalAlpha = (1 - k) * 0.8; ctx.font = "60px LHeavy"; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText("?", 920 + i * 30 - 40, 1150 - k * 160); ctx.restore(); }
rr(600, 360, 420, 80, 26, "rgba(14,18,54,0.8)"); ctx.font = "40px LHeavy"; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("KEEP THE SECRET", 810, 402);
ctx.restore();
rr(W / 2 - 6, 0, 12, H, 0, "#FFFFFF");
const k = E.back(cl(lt / 0.35));
ctx.save(); ctx.translate(W / 4, 200); ctx.scale(k, k); circ(0, 0, 80, PAL.red); ctx.font = "110px LHeavy"; ctx.fillStyle = "#FFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("A", 0, 6); ctx.restore();
const k2 = E.back(cl((lt - (p.bAt ?? 1.2)) / 0.35));
ctx.save(); ctx.translate(W * 0.75, 200); ctx.scale(k2, k2); circ(0, 0, 80, PAL.teal); ctx.font = "110px LHeavy"; ctx.fillStyle = "#FFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("B", 0, 6); ctx.restore();
