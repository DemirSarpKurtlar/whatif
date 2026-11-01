// A: the attic   B: the car  (split screen)
rr(0, 0, W, H, 0, "#151946");
// left: attic hatch + ladder
ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2 - 6, H); ctx.clip();
rr(0, 0, W / 2, H, 0, "#2A2F78"); rr(70, 330, 400, 230, 12, "#0D1030"); rr(90, 350, 360, 190, 8, "#05061A");
for (let i = 0; i < 8; i++) rr(150 + i * 4, 600 + i * 110, 240, 18, 6, "#C9A64B"); limb(150, 560, 120, 1500, 18, "#B08E3F"); limb(390, 560, 420, 1500, 18, "#B08E3F");
person(270, 1650, 0.8, { pose: "point", look: -0.5 });
ctx.restore();
// right: car in the driveway, zombies near the road
ctx.save(); ctx.beginPath(); ctx.rect(W / 2 + 6, 0, W / 2, H); ctx.clip();
sky(PAL.navy0, "#2A2466", 0.3); stars(40, 700, 21);
ground(1250, "#1B2153", "#232A66"); car(810, 1400, 0.62, "#E8434F", 0);
silhouette(1000, 1600, 0.6, "rgba(6,8,26,0.95)", 1); silhouette(640, 1680, 0.5, "rgba(6,8,26,0.95)", 3);
ctx.restore();
rr(W / 2 - 6, 0, 12, H, 0, "#FFFFFF");
const k = E.back(cl(lt / 0.35));
ctx.save(); ctx.translate(W / 4, 200); ctx.scale(k, k); circ(0, 0, 80, PAL.red); ctx.font = "110px LHeavy"; ctx.fillStyle = "#FFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("A", 0, 6); ctx.restore();
const k2 = E.back(cl((lt - 1.2) / 0.35));
ctx.save(); ctx.translate(W * 0.75, 200); ctx.scale(k2, k2); circ(0, 0, 80, PAL.teal); ctx.font = "110px LHeavy"; ctx.fillStyle = "#FFF"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("B", 0, 6); ctx.restore();
