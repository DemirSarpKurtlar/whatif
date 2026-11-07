// EP3 (adapted from EP2 phone.js): your phone in the dark attic hits 1% and dies.
// p: batt (%), hh, mm (clock on lock screen), low 0..1 (warning pill), dead 0..1 (screen goes black), zoom, shake
cam(W / 2, 980, p.zoom || 1, p.shake || 0);
const dead = cl(p.dead || 0);
rr(-W, -H, W * 3, H * 3, 0, "#0B0D26");
const gl = ctx.createRadialGradient(540, 980, 60, 540, 980, 760); gl.addColorStop(0, `rgba(150,170,255,${0.32 * (1 - dead)})`); gl.addColorStop(1, "rgba(150,170,255,0)"); ctx.fillStyle = gl; ctx.fillRect(-W, -H, W * 3, H * 3);
// hoodie sleeve + hand
rr(330, 1500, 420, 600, 120, PAL.hoodie2); rr(350, 1480, 380, 120, 50, PAL.hoodie);
rr(300, 1180, 480, 360, 150, PAL.skin);
// phone
rr(300, 420, 480, 1000, 64, "#05061A"); rr(316, 436, 448, 968, 52, "#1A1D52");
const sg = ctx.createLinearGradient(0, 436, 0, 1404); sg.addColorStop(0, "#2A2466"); sg.addColorStop(1, "#11153D"); ctx.fillStyle = sg; ctx.beginPath(); ctx.roundRect(324, 444, 432, 952, 46); ctx.fill();
rr(490, 460, 100, 28, 14, "#05061A"); // notch
ctx.font = "30px LHeavy"; ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.fillStyle = "#FFFFFF"; ctx.fillText("SOS", 360, 476);
const b = Math.round(p.batt ?? 1); const blink = Math.sin(t * 9) > -0.2 ? 1 : 0.3;
ctx.textAlign = "right"; ctx.fillStyle = `rgba(255,77,94,${blink})`; ctx.fillText(b + "%", 660, 476);
ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(672, 462, 56, 28, 7); ctx.stroke(); rr(730, 470, 6, 12, 2, "#FFFFFF");
rr(677, 467, Math.max(4, 46 * b / 100), 18, 3, `rgba(255,59,78,${blink})`);
// lock screen clock
const hh = Math.round(p.hh ?? 3), mm = Math.round(p.mm ?? 17);
ctx.textAlign = "center"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = "#FFFFFF"; ctx.font = "170px LHeavy"; ctx.fillText(`${hh}:${String(mm).padStart(2, "0")}`, 540, 720);
ctx.font = "36px LBold"; ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.fillText("AM  ·  Saturday", 540, 780);
// low battery dialog
const lw = cl(p.low || 0);
if (lw > 0) {
  ctx.save(); ctx.globalAlpha = lw; rr(350, 860, 380, 250, 34, "rgba(255,255,255,0.94)");
  ctx.fillStyle = "#151A45"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = "34px LHeavy"; ctx.fillText("Battery 1%", 540, 920);
  ctx.font = "26px LBold"; ctx.fillStyle = "#30365F"; ctx.fillText("Your phone will turn", 540, 975); ctx.fillText("off soon.", 540, 1010);
  rr(380, 1045, 320, 4, 2, "rgba(48,54,95,0.2)"); ctx.font = "28px LHeavy"; ctx.fillStyle = "#FF3B4E"; ctx.fillText("OK", 540, 1078);
  ctx.restore();
}
// the screen dies: black, then the empty-battery icon flickers once
if (dead > 0) {
  ctx.save(); ctx.globalAlpha = dead; ctx.fillStyle = "#020208"; ctx.beginPath(); ctx.roundRect(324, 444, 432, 952, 46); ctx.fill(); ctx.restore();
  const ic = dead >= 1 ? cl(1 - (lt - (p.deadAt ?? 0)) / 1.2) : 0;
  if (ic > 0 && Math.sin(t * 20) > -0.6) {
    ctx.save(); ctx.globalAlpha = ic; ctx.strokeStyle = "#FF3B4E"; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(440, 860, 200, 100, 18); ctx.stroke(); rr(644, 890, 16, 40, 5, "#FF3B4E"); rr(456, 876, 18, 68, 5, "#FF3B4E"); ctx.restore();
  }
}
circ(300, 1120, 52, PAL.skin); circ(780, 1060, 46, PAL.skin); circ(785, 1150, 46, PAL.skin);
// darkness closing in once the screen is off
if (dead > 0) { ctx.fillStyle = `rgba(3,3,12,${0.55 * dead})`; ctx.fillRect(-W, -H, W * 3, H * 3); }
