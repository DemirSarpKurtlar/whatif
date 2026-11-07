// time-lapse in the dark attic: clock hands spin from midnight toward dawn, infected counter doubles.
// p: h (hours after midnight, 0 = 12:00 AM, 5.967 = 5:58 AM), zoom, cy, shake, dawn 0..1 (sky through the vent warms)
// Infected count follows EP1: first bite 11:42 PM, doubling every hour -> n = 2^floor(h + 0.3) (min 2, EP2 canon).
cam(W / 2, p.cy || 960, p.zoom || 1, p.shake || 0);
const h = Math.max(0, p.h || 0), DW = cl(p.dawn || 0);
rr(-W, -H, W * 3, H * 3, 0, "#0E1030");
// attic roof + rafters, very dim
poly([-200, 1700, 540, 380, 1280, 1700], "#191C4A");
ctx.save(); ctx.beginPath(); ctx.moveTo(-200, 1700); ctx.lineTo(540, 380); ctx.lineTo(1280, 1700); ctx.closePath(); ctx.clip();
for (let i = -4; i <= 4; i++) rr(540 + i * 150 - 8, 380, 16, 1400, 3, "#14173F");
rr(-200, 1000, 1500, 16, 3, "#14173F");
// little vent high on the wall: sky colour drifts from navy to orange as hours pass
const vk = cl(h / 6);
rr(800, 470, 120, 110, 8, "#0A0C26");
rr(808, 478, 104, 94, 4, `rgb(${Math.round(30 + 225 * vk * vk)},${Math.round(30 + 150 * vk * vk)},${Math.round(90 + 20 * vk)})`);
for (let i = 0; i < 5; i++) rr(806, 482 + i * 19, 108, 9, 3, "#1C1F4E");
ctx.restore();
// time-lapse streaks (motion feel)
for (let i = 0; i < 10; i++) { const y = ((rnd(i) * 1920 + lt * 900 * (0.6 + rnd(i + 4))) % 2100) - 100; rr(-100 + rnd(i * 2) * 1200, y, 4, 120, 2, "rgba(150,160,255,0.06)"); }
// digital readout
const hh = Math.floor(h) % 12 || 12, mm = Math.floor((h % 1) * 60 + 1e-6);
ctx.textAlign = "center"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = "#F7E8C6"; ctx.font = "150px LHeavy";
ctx.fillText(`${hh}:${String(mm).padStart(2, "0")}`, 540, 360);
ctx.font = "44px LHeavy"; ctx.fillStyle = "#FFD23F"; ctx.fillText("AM", 540, 420);
// analog clock
const CX = 540, CY = 780, R = 270;
circ(CX, CY + 14, R + 30, "rgba(0,0,0,0.35)");
circ(CX, CY, R + 26, "#2A2F78"); circ(CX, CY, R, "#F7E8C6"); circ(CX, CY, R - 18, "#FFF6E0");
// elapsed arc (from midnight) in red
ctx.strokeStyle = "rgba(255,59,78,0.85)"; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(CX, CY, R - 40, -Math.PI / 2, -Math.PI / 2 + (h / 12) * TAU); ctx.stroke();
for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; limb(CX + Math.sin(a) * (R - 70), CY - Math.cos(a) * (R - 70), CX + Math.sin(a) * (R - 44), CY - Math.cos(a) * (R - 44), i % 3 ? 8 : 14, "#1B1F52"); }
const ha = (h / 12) * TAU, ma = (h % 1) * TAU;
limb(CX, CY, CX + Math.sin(ha) * 140, CY - Math.cos(ha) * 140, 22, "#1B1F52");
limb(CX, CY, CX + Math.sin(ma) * 210, CY - Math.cos(ma) * 210, 12, "#FF3B4E");
circ(CX, CY, 20, "#1B1F52"); circ(CX, CY, 8, "#FF3B4E");
// infected counter (doubling every hour since 11:42 PM)
const n = Math.max(2, Math.pow(2, Math.floor(h + 0.3)));
rr(190, 1130, 700, 150, 30, "rgba(10,12,38,0.85)"); rr(190, 1130, 700, 150, 30, "rgba(147,196,108,0.08)");
ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.font = "34px LHeavy"; ctx.fillStyle = "rgba(247,232,198,0.75)"; ctx.fillText("INFECTED IN TOWN", 230, 1172);
ctx.font = "84px LHeavy"; ctx.fillStyle = "#93C46C"; ctx.fillText(String(n), 230, 1240);
const ni = Math.min(12, Math.round(Math.log2(n) * 2));
for (let i = 0; i < ni; i++) icon(615 + (i % 6) * 46, 1200 + Math.floor(i / 6) * 56, 0.55, true);
