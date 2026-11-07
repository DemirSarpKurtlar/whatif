// a rescue helicopter crosses the dawn sky, loudspeaker blaring. p: hx (helicopter x), hy, zoom, cy, shake,
// say 0..1 (announcement banner), waves 0..1 (loudspeaker sound rings), n (zombies on the street, looking up)
cam(W / 2, p.cy || 960, p.zoom || 1, p.shake || 0);
{ const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#4A3F9A"); g.addColorStop(0.5, "#B9638F"); g.addColorStop(0.75, "#FF9A62"); g.addColorStop(1, "#FFC98B"); ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3); }
const sg = ctx.createRadialGradient(300, 1200, 40, 300, 1200, 600); sg.addColorStop(0, "rgba(255,226,150,0.8)"); sg.addColorStop(1, "rgba(255,180,100,0)"); ctx.fillStyle = sg; ctx.fillRect(-W, 0, W * 3, 2000);
circ(300, 1190, 110, "#FFE3A0");
skyline(1250, 0, 4, 0.9, "#6B4E93");
skyline(1330, 0, 9, 1.05, "#4D3F86");
ground(1330, "#3D3B7E", "#4C4A93"); road(1400, 170);
lamp(150, 1400, 380, 0); lamp(820, 1400, 380, 0); tree(980, 1400, 1.1);
const n = Math.round(p.n || 0);
for (let i = 0; i < n; i++) { const x = 60 + ((i * 211 + lt * 10) % 1000); zombie(x, 1620 + (i % 3) * 40, 0.42 + (i % 2) * 0.06, { flip: i % 2 === 0, speed: 0.9, phase: i * 1.3 }); }
// helicopter
const hx = p.hx ?? 540, hy = p.hy ?? 560;
ctx.save(); ctx.translate(hx, hy); ctx.rotate(-0.08);
const BODY = "#2E3A5E", STR = "#FF3B4E";
rr(120, -26, 300, 40, 18, BODY); // tail boom
poly([400, -30, 440, -110, 470, -110, 450, -10], BODY); // tail fin
ctx.save(); ctx.translate(455, -60); ctx.rotate(t * 40); rr(-6, -60, 12, 120, 6, "rgba(220,225,255,0.5)"); ctx.restore(); // tail rotor
ctx.beginPath(); ctx.ellipse(0, 0, 190, 110, 0, 0, TAU); ctx.fillStyle = BODY; ctx.fill();
rr(-150, 10, 300, 22, 10, STR); // stripe
ctx.save(); ctx.beginPath(); ctx.ellipse(-80, -20, 100, 70, 0, Math.PI * 0.95, Math.PI * 1.75); ctx.lineTo(-80, -20); ctx.closePath(); ctx.fillStyle = "#9DB5E8"; ctx.fill(); ctx.restore(); // cockpit glass
rr(-20, -150, 40, 50, 8, BODY); // mast
limb(-120, 120, -130, 160, 10, "#1B1F52"); limb(110, 110, 120, 160, 10, "#1B1F52"); limb(-200, 160, 200, 160, 12, "#1B1F52"); // skids
// main rotor blur
const rb = 0.6 + 0.4 * Math.abs(Math.sin(t * 30));
ctx.fillStyle = `rgba(230,235,255,${0.35 * rb})`; ctx.beginPath(); ctx.ellipse(0, -150, 360, 16, 0, 0, TAU); ctx.fill();
rr(-360 * rb, -156, 720 * rb, 10, 5, "rgba(30,36,80,0.6)");
// loudspeaker under the nose
rr(-170, 70, 60, 34, 8, "#1B1F52"); poly([-170, 66, -230, 46, -230, 128, -170, 108], "#F7E8C6");
ctx.restore();
// sound rings from the loudspeaker toward the ground
const wv = cl(p.waves || 0);
if (wv > 0) for (let i = 0; i < 4; i++) { const k = (lt * 0.9 + i / 4) % 1; ctx.strokeStyle = `rgba(255,210,63,${(1 - k) * 0.9 * wv})`; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.arc(hx - 230, hy + 80, 60 + k * 420, Math.PI * 0.35, Math.PI * 0.95); ctx.stroke(); }
// announcement banner
const sk = E.back(cl(p.say || 0));
if (sk > 0) {
  ctx.save(); ctx.translate(540, 960); ctx.scale(sk, sk);
  rr(-420, -110, 840, 220, 34, "rgba(255,255,255,0.95)"); poly([-60, 110, -10, 110, -90, 170], "rgba(255,255,255,0.95)");
  rr(-400, -92, 120, 184, 26, "#FF3B4E"); poly([-375, -20, -330, -20, -300, -50, -300, 50, -330, 20, -375, 20], "#FFFFFF");
  ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillStyle = "#151A45"; ctx.font = "40px LHeavy"; ctx.fillText("EVACUATION POINT:", -255, -38);
  ctx.fillStyle = "#FF3B4E"; ctx.font = "50px LHeavy"; ctx.fillText("HIGH SCHOOL", -255, 18); ctx.fillText("STADIUM", -255, 70);
  ctx.restore();
}
