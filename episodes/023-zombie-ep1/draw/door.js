// the back door: shadows of feet under it, scratches. p: scratch 0..1, shake, zoom
cam(W / 2, p.cy || 960, p.zoom || 1, p.shake || 0);
rr(-W, -H, W * 3, H * 3, 0, "#161A44"); rr(-W, 1500, W * 3, H, 0, "#101333");
rr(290, 420, 500, 1090, 16, "#2A2F78"); rr(320, 450, 440, 1060, 10, "#3A2F6E");
rr(360, 500, 160, 300, 8, "#2E2560"); rr(560, 500, 160, 300, 8, "#2E2560"); rr(360, 860, 160, 560, 8, "#2E2560"); rr(560, 860, 160, 560, 8, "#2E2560");
circ(710, 990, 20, "#C9A64B");
// light gap under the door with moving shadows
rr(320, 1500, 440, 12, 3, "#FF5B6A"); const s1 = 360 + 90 * Math.sin(lt * 2), s2 = s1 + 150; rr(s1, 1500, 70, 12, 3, "#0B0D26"); rr(s2, 1500, 70, 12, 3, "#0B0D26");
scratches(410, 980, p.scratch || 0);
