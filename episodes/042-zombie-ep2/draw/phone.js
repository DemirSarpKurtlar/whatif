// your phone in the dark attic: 11:58 PM, low battery. p: batt (%), alert 0..1, zoom, shake, blink
cam(W / 2, 980, p.zoom || 1, p.shake || 0);
rr(-W, -H, W * 3, H * 3, 0, "#0B0D26");
const gl = ctx.createRadialGradient(540, 980, 60, 540, 980, 760); gl.addColorStop(0, "rgba(150,170,255,0.32)"); gl.addColorStop(1, "rgba(150,170,255,0)"); ctx.fillStyle = gl; ctx.fillRect(-W, -H, W * 3, H * 3);
// hoodie sleeve + hand
rr(330, 1500, 420, 600, 120, PAL.hoodie2); rr(350, 1480, 380, 120, 50, PAL.hoodie);
rr(300, 1180, 480, 360, 150, PAL.skin);
// phone
rr(300, 420, 480, 1000, 64, "#05061A"); rr(316, 436, 448, 968, 52, "#1A1D52");
const sg = ctx.createLinearGradient(0, 436, 0, 1404); sg.addColorStop(0, "#2A2466"); sg.addColorStop(1, "#11153D"); ctx.fillStyle = sg; ctx.beginPath(); ctx.roundRect(324, 444, 432, 952, 46); ctx.fill();
rr(490, 460, 100, 28, 14, "#05061A"); // notch
// status bar: no signal + battery
ctx.font = "30px LHeavy"; ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.fillStyle = "#FFFFFF"; ctx.fillText("SOS", 360, 476);
const b = Math.round(p.batt ?? 7); const blink = Math.sin(t * 7) > -0.2 ? 1 : 0.35;
ctx.textAlign = "right"; ctx.fillStyle = `rgba(255,77,94,${blink})`; ctx.fillText(b + "%", 660, 476);
ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(672, 462, 56, 28, 7); ctx.stroke(); rr(730, 470, 6, 12, 2, "#FFFFFF");
rr(677, 467, Math.max(6, 46 * b / 100), 18, 3, `rgba(255,59,78,${blink})`);
// lock screen clock
ctx.textAlign = "center"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = "#FFFFFF"; ctx.font = "170px LHeavy"; ctx.fillText("11:58", 540, 720);
ctx.font = "36px LBold"; ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.fillText("PM  ·  Friday", 540, 780);
// emergency alert notification slides in
const ak = E.back(cl(p.alert || 0));
if (ak > 0) {
  ctx.save(); ctx.translate(0, (1 - ak) * -80); ctx.globalAlpha = cl(ak);
  rr(344, 830, 392, 210, 30, "rgba(255,255,255,0.93)");
  poly([392, 905, 416, 862, 440, 905], PAL.red); rr(413, 875, 6, 16, 2, "#FFFFFF"); rr(413, 895, 6, 6, 2, "#FFFFFF");
  ctx.textAlign = "left"; ctx.fillStyle = "#151A45"; ctx.font = "25px LHeavy"; ctx.fillText("EMERGENCY ALERT", 452, 895);
  ctx.font = "27px LBold"; ctx.fillStyle = "#30365F"; ctx.fillText("Stay indoors. Lock all", 370, 960); ctx.fillText("doors. Do not go outside.", 370, 1000);
  ctx.restore();
}
// low battery warning pill
if ((p.low || 0) > 0) { ctx.globalAlpha = p.low; rr(380, 1090, 320, 70, 35, "rgba(255,59,78,0.92)"); ctx.fillStyle = "#FFFFFF"; ctx.font = "30px LHeavy"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("LOW BATTERY", 540, 1126); ctx.globalAlpha = 1; }
// thumb over the phone edge
circ(300, 1120, 52, PAL.skin); circ(780, 1060, 46, PAL.skin); circ(785, 1150, 46, PAL.skin);
