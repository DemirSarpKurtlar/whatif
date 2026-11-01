// city hospital at 11:42 PM. p: zoom, cy, alarm, bite (0..1 window flash)
cam(W / 2, p.cy || 980, p.zoom || 1, p.shake || 0);
sky(PAL.navy0, "#2A2466", p.alarm * 0.6); stars(110, H * 0.5, 7);
skyline(1350, 0.6, 12, 0.8, "#232A70");
ground(1350, "#1B2153", "#232A66"); road(1420, 160);
hospital(W / 2, 1350, 1, p.alarm || 0);
// the bite: a silhouette pair in one lit window
const wx = W / 2 - 310 + 40 + 2 * 92, wy = 1350 - 640 + 80 + 2 * 86;
rr(wx, wy, 56, 52, 4, p.bite > 0.5 ? "#FF3B4E" : "#FFD45C");
ctx.fillStyle = "rgba(10,12,40,0.9)"; circ(wx + 18, wy + 24, 10, "rgba(10,12,40,0.9)"); circ(wx + 36 + 6 * Math.sin(lt * 6) * (p.bite > 0.2 ? 1 : 0), wy + 22, 10, "rgba(10,12,40,0.9)");
car(170, 1560, 0.75, "#F2F0FA", 1); rr(115, 1430, 60, 18, 6, Math.sin(t * 10) > 0 ? "#FF3B4E" : "#4C7BFF");
tree(960, 1350, 1);
