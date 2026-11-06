// A: stay silent until dawn   B: text your neighbor  (split screen)
rr(0, 0, W, H, 0, "#151946");
// left: you in the dark attic, silent, waiting for 6 AM
ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2 - 6, H); ctx.clip();
rr(0, 0, W / 2, H, 0, "#0E1030");
poly([-260, 1500, 270, 720, 800, 1500], "#24285E");
ctx.save(); ctx.beginPath(); ctx.moveTo(-260, 1500); ctx.lineTo(270, 720); ctx.lineTo(800, 1500); ctx.closePath(); ctx.clip();
for (let i = -3; i <= 3; i++) rr(270 + i * 120 - 7, 720, 14, 800, 3, "#1C1F4E"); rr(-100, 1080, 800, 14, 3, "#1C1F4E");
rr(20, 1390, 120, 110, 8, "#8C6A45"); rr(20, 1390, 120, 18, 6, "#A07B50"); rr(410, 1420, 100, 80, 8, "#7A5B3C");
ctx.restore();
rr(-20, 1500, W / 2 + 40, 400, 0, "#2A2357"); rr(-20, 1500, W / 2 + 40, 14, 0, "#3A2F6E");
rr(150, 1540, 220, 26, 4, "#120F30"); rr(150, 1540, 220, 4, 2, "rgba(255,180,120,0.5)"); // the hatch, faint light below
person(270, 1500, 0.95, { pose: "idle", mouth: "", look: 0.2, sweat: 1 });
ctx.fillStyle = "rgba(4,5,18,0.55)"; ctx.fillRect(0, 0, W / 2, H);
const hy = 1500 - 330 * 0.95, bl = Math.sin(t * 1.3) > 0.96 ? 0.2 : 1; ctx.fillStyle = "#FFFFFF";
ctx.beginPath(); ctx.ellipse(270 - 24, hy + 16, 14, 14 * bl, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(270 + 24, hy + 16, 14, 14 * bl, 0, 0, TAU); ctx.fill();
circ(270 - 21, hy + 18, 6, "#1B1F52"); circ(270 + 27, hy + 18, 6, "#1B1F52");
// clock heading to 6 AM
circ(270, 470, 92, "#0B0D26"); ctx.strokeStyle = "#F7E8C6"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(270, 470, 84, 0, TAU); ctx.stroke();
limb(270, 470, 270, 520, 9, "#F7E8C6"); limb(270, 470, 270 + 60 * Math.sin(lt * 1.5), 470 - 60 * Math.cos(lt * 1.5), 7, "#FFD23F");
ctx.font = "34px LHeavy"; ctx.fillStyle = "#FFD23F"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("WAIT FOR 6 AM", 270, 605);
ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 4) ** 2; ctx.font = "60px LHeavy"; ctx.fillStyle = "#F7E8C6"; ctx.fillText("shh...", 400, 1000); ctx.globalAlpha = 1;
ctx.restore();
// right: the neighbor's lit window + your text
ctx.save(); ctx.beginPath(); ctx.rect(W / 2 + 6, 0, W / 2, H); ctx.clip();
sky(PAL.navy0, "#2A2466", 0.2); stars(40, 700, 23);
ground(1300, "#1B2153", "#232A66");
rr(620, 760, 420, 540, 8, "#2C3382"); poly([600, 770, 830, 560, 1060, 770], PAL.roof);
rr(680, 860, 110, 120, 6, "#FFD45C"); rr(870, 860, 110, 120, 6, PAL.winOff); rr(790, 1080, 90, 220, 6, "#1B1F52");
circ(735, 925, 22, "rgba(60,40,30,0.75)"); rr(705, 945, 60, 40, 18, "rgba(60,40,30,0.75)"); // the neighbor at the window
silhouette(960, 1560, 0.55, "rgba(6,8,26,0.95)", 1.2);
// phone with your message
ctx.save(); ctx.translate(810, 1390); ctx.rotate(-0.06);
rr(-150, -270, 300, 520, 38, "#05061A"); rr(-138, -258, 276, 496, 30, "#20245E");
rr(-118, -200, 236, 130, 24, "#2EC4B6"); ctx.font = "30px LHeavy"; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
ctx.fillText("HELP. I'm in", 0, -158); ctx.fillText("my attic!!", 0, -114);
const dots = Math.floor(t * 3) % 4; for (let i = 0; i < 3; i++) circ(-60 + i * 30, -20, 9, i < dots ? "#FFFFFF" : "rgba(255,255,255,0.3)");
ctx.font = "24px LBold"; ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.fillText("Delivered", 60, -48);
rr(-60, 180, 120, 14, 7, "rgba(255,59,78,0.9)"); ctx.font = "26px LHeavy"; ctx.fillStyle = "#FF4D5E"; ctx.fillText("7%", 0, 140);
ctx.restore();
ctx.restore();
rr(W / 2 - 6, 0, 12, H, 0, "#FFFFFF");
const k = E.back(cl(lt / 0.35));
ctx.save(); ctx.translate(W / 4, 200); ctx.scale(k, k); circ(0, 0, 80, PAL.red); ctx.font = "110px LHeavy"; ctx.fillStyle = "#FFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("A", 0, 6); ctx.restore();
const k2 = E.back(cl((lt - (p.bAt ?? 1.2)) / 0.35));
ctx.save(); ctx.translate(W * 0.75, 200); ctx.scale(k2, k2); circ(0, 0, 80, PAL.teal); ctx.font = "110px LHeavy"; ctx.fillStyle = "#FFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("B", 0, 6); ctx.restore();
