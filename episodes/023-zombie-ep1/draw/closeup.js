// close-up of you, scared. p: zoom, sweat
cam(W / 2, 760, p.zoom || 1.9, p.shake || 0);
rr(-W, -H, W * 3, H * 3, 0, "#1A1D49");
const r = ctx.createRadialGradient(540, 700, 50, 540, 700, 700); r.addColorStop(0, "rgba(255,59,78,0.28)"); r.addColorStop(1, "rgba(255,59,78,0)"); ctx.fillStyle = r; ctx.fillRect(-W, -H, W * 3, H * 3);
person(540, 1150, 1.2, { pose: "scared", mouth: "o", sweat: 1, look: -0.8 });
