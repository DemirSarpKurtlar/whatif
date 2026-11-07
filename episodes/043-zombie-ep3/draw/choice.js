// EP3 choice: A sneak to the stadium on foot   B take the neighbor's bike  (split screen, dawn). p: bAt
rr(0, 0, W, H, 0, "#151946");
function dawnSky() { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#4A3F9A"); g.addColorStop(0.5, "#B9638F"); g.addColorStop(0.75, "#FF9A62"); g.addColorStop(1, "#FFC98B"); ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3); }
// ---------- left: sneaking on foot between parked cars
ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2 - 6, H); ctx.clip();
dawnSky(); circ(120, 1180, 90, "#FFE3A0");
skyline(1250, 0, 6, 0.75, "#6B4E93");
ground(1300, "#3D3B7E", "#4C4A93"); rr(-W, 1420, W * 3, 160, 0, PAL.road);
for (let i = 0; i < 6; i++) rr(-40 + i * 140 - ((lt * 40) % 140), 1495, 70, 10, 5, "rgba(247,232,198,0.55)");
// slow zombies in the background
for (let i = 0; i < 3; i++) zombie(80 + i * 170, 1400, 0.36, { flip: i % 2 === 0, speed: 0.9, phase: i * 2.1 });
car(380, 1640, 0.55, "#5B6EAE", 0);
// you, crouched, tiptoeing
ctx.save(); ctx.translate(200, 1700); ctx.scale(1, 0.86); ctx.translate(-200, -1700);
person(200, 1700, 0.82, { pose: "idle", walk: 1, look: 0.8, mouth: "o", sweat: 1 });
ctx.restore();
for (let i = 0; i < 4; i++) { ctx.save(); ctx.globalAlpha = 0.5 - i * 0.1; ctx.fillStyle = "#F7E8C6"; ctx.beginPath(); ctx.ellipse(110 - i * 70, 1740 + (i % 2) * 18, 16, 8, 0, 0, TAU); ctx.fill(); ctx.restore(); }
rr(60, 360, 420, 80, 26, "rgba(14,18,54,0.8)"); ctx.font = "40px LHeavy"; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("ON FOOT · SILENT", 270, 402);
ctx.globalAlpha = 0.6 + 0.4 * Math.sin(t * 4) ** 2; ctx.font = "56px LHeavy"; ctx.fillStyle = "#F7E8C6"; ctx.fillText("shh...", 400, 1000); ctx.globalAlpha = 1;
ctx.restore();
// ---------- right: the neighbor's bike by the fence
ctx.save(); ctx.beginPath(); ctx.rect(W / 2 + 6, 0, W / 2, H); ctx.clip();
dawnSky();
ground(1300, "#3D3B7E", "#4C4A93");
rr(620, 760, 420, 540, 8, "#5A5FB0"); poly([600, 770, 830, 560, 1060, 770], "#3A3584");
rr(680, 860, 110, 120, 6, "#2B2F6A"); rr(870, 860, 110, 120, 6, "#2B2F6A"); rr(790, 1080, 90, 220, 6, "#2A2357");
for (let i = 0; i < 9; i++) rr(560 + i * 60, 1200, 26, 260, 6, "#E9E6F5"); rr(550, 1250, 560, 18, 4, "#E9E6F5"); rr(550, 1370, 560, 18, 4, "#E9E6F5");
// bicycle (scaled down to fit the half)
ctx.save(); ctx.translate(810, 1700); ctx.scale(0.76, 0.76); ctx.translate(-810, -1700);
const BX = 810, BY = 1700, wr = 120;
ctx.lineWidth = 14; ctx.strokeStyle = "#1B1F52";
ctx.beginPath(); ctx.arc(BX - 170, BY - wr, wr, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(BX + 170, BY - wr, wr, 0, TAU); ctx.stroke();
for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI + t * 2; limb(BX - 170 - Math.cos(a) * wr, BY - wr - Math.sin(a) * wr, BX - 170 + Math.cos(a) * wr, BY - wr + Math.sin(a) * wr, 3, "rgba(27,31,82,0.6)"); limb(BX + 170 - Math.cos(a) * wr, BY - wr - Math.sin(a) * wr, BX + 170 + Math.cos(a) * wr, BY - wr + Math.sin(a) * wr, 3, "rgba(27,31,82,0.6)"); }
const RED = "#FF3B4E";
limb2(BX - 170, BY - wr, BX - 30, BY - wr, BX - 80, BY - 330, 18, RED); limb2(BX - 80, BY - 330, BX + 110, BY - 320, BX - 30, BY - wr, 18, RED);
limb(BX + 110, BY - 320, BX + 170, BY - wr, 18, RED); limb(BX - 170, BY - wr, BX - 80, BY - 330, 18, RED);
rr(BX - 135, BY - 370, 110, 26, 12, "#1B1F52"); limb(BX + 110, BY - 320, BX + 90, BY - 400, 14, "#1B1F52"); limb(BX + 60, BY - 400, BX + 150, BY - 400, 14, "#1B1F52");
circ(BX - 30, BY - wr, 22, "#1B1F52");
ctx.restore();
// speed lines
for (let i = 0; i < 4; i++) rr(560 + ((i * 90 + lt * 300) % 160) - 40, 1300 + i * 60, 90, 10, 5, "rgba(255,255,255,0.6)");
rr(600, 360, 420, 80, 26, "rgba(14,18,54,0.8)"); ctx.font = "40px LHeavy"; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("FAST · EXPOSED", 810, 402);
ctx.restore();
rr(W / 2 - 6, 0, 12, H, 0, "#FFFFFF");
const k = E.back(cl(lt / 0.35));
ctx.save(); ctx.translate(W / 4, 200); ctx.scale(k, k); circ(0, 0, 80, PAL.red); ctx.font = "110px LHeavy"; ctx.fillStyle = "#FFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("A", 0, 6); ctx.restore();
const k2 = E.back(cl((lt - (p.bAt ?? 1.2)) / 0.35));
ctx.save(); ctx.translate(W * 0.75, 200); ctx.scale(k2, k2); circ(0, 0, 80, PAL.teal); ctx.font = "110px LHeavy"; ctx.fillStyle = "#FFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("B", 0, 6); ctx.restore();
