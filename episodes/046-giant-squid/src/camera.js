// 2012 footage frame plaque: grainy dark screen, golden squid at the bait, REC + timecode. p: zoom, labk, sid
const z = p.zoom || 1, SX = 90, SY = 330, SW = 900, SH = 820;
bokashi(ctx, -100, H + 100, [[0, K.deep], [1, K.abyss]]); snow(ctx, 60, 41, -15, 0.3);
// screen
ctx.save(); ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(SX + 12, SY + 14, SW, SH); ctx.beginPath(); ctx.rect(SX, SY, SW, SH); ctx.clip();
ctx.fillStyle = "#04070F"; ctx.fillRect(SX, SY, SW, SH);
const lg = ctx.createRadialGradient(540, 760, 20, 540, 760, 520); lg.addColorStop(0, "rgba(60,80,110,0.55)"); lg.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = lg; ctx.fillRect(SX, SY, SW, SH);
ctx.save(); ctx.translate(540, 740); ctx.scale(z, z); ctx.translate(-540, -740);
squid(ctx, 230 + Math.sin(t * 0.6) * 20, 420 + Math.sin(t * 0.5) * 10, 78, 0.75, { pal: "gold", sw: 0.6, reach: 0.55, ph: 1 });
// bait light
const bl = ctx.createRadialGradient(700, 930, 2, 700, 930, 70); bl.addColorStop(0, "rgba(160,230,255,0.9)"); bl.addColorStop(1, "rgba(160,230,255,0)"); ctx.fillStyle = bl; ctx.fillRect(620, 850, 160, 160);
ctx.restore();
// grain + scanlines (cheap)
const f = Math.floor(t * 24); for (let i = 0; i < 260; i++) { const x = SX + rnd(i * 1.7 + f) * SW, y = SY + rnd(i * 2.9 + f * 1.3) * SH; ctx.fillStyle = `rgba(200,210,220,${0.08 + 0.1 * rnd(i + f)})`; ctx.fillRect(x, y, 3, 3); }
ctx.fillStyle = "rgba(0,0,0,0.18)"; for (let y = SY; y < SY + SH; y += 6) ctx.fillRect(SX, y, SW, 2);
// HUD
ctx.font = "36px LSerif"; ctx.textAlign = "left"; if (Math.sin(t * 6) > -0.3) { ctx.fillStyle = "#E0453A"; ctx.beginPath(); ctx.arc(SX + 56, SY + 60, 13, 0, TAU); ctx.fill(); }
ctx.fillStyle = K.cream; ctx.fillText("REC", SX + 82, SY + 73); ctx.textAlign = "right"; const ss = 14 + Math.floor(lt); ctx.fillText("2012 · 07   00:" + String(23 + Math.floor(ss / 60)).padStart(2, "0") + ":" + String(ss % 60).padStart(2, "0"), SX + SW - 40, SY + 73);
ctx.strokeStyle = K.cream; ctx.lineWidth = 4; const c = 60; for (const [cx, cy, dx, dy] of [[SX + 30, SY + 110, 1, 1], [SX + SW - 30, SY + 110, -1, 1], [SX + 30, SY + SH - 30, 1, -1], [SX + SW - 30, SY + SH - 30, -1, -1]]) { ctx.beginPath(); ctx.moveTo(cx + dx * c, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + dy * c); ctx.stroke(); }
ctx.restore();
// cream double frame
ctx.save(); ctx.strokeStyle = K.cream; ctx.lineWidth = 12; ctx.strokeRect(SX - 8, SY - 8, SW + 16, SH + 16); ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.strokeRect(SX - 15, SY - 15, SW + 30, SH + 30); ctx.strokeRect(SX - 1, SY - 1, SW + 2, SH + 2); ctx.restore();
plaque(ctx, 540, 110, [{ t: "FIRST FILMED ALIVE IN THE DEEP", s: 30, sp: 4 }, { t: "2012", s: 100, c: K.red }], p.labk || 0, { minW: 620 });
plaque(ctx, 540, 1480, [{ t: "OGASAWARA ISLANDS · JAPAN", s: 34, sp: 5 }, { t: "NHK · DISCOVERY · NATIONAL MUSEUM OF NATURE AND SCIENCE", s: 21, sp: 1 }], cl((p.labk || 0) * 1.5 - 0.4));
finish(ctx);
