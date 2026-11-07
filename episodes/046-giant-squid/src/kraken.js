// Kraken legend hanging scroll unrolling: print of a ship and arms rising from a curling sea. p: un 0..1 (unroll), rise 0..1 (arms), labk, sid
const un = eout(p.un ?? 1), rs = eout(p.rise ?? 1), X0 = 150, X1 = 930, Y0 = 230, YMAX = 1210, Y1 = lerp(Y0 + 30, YMAX, un);
bokashi(ctx, -100, H + 100, [[0, K.indigo], [1, K.deep]]); waveLines(ctx, 1450, 1950, 40, 61);
// paper
ctx.save(); ctx.fillStyle = "rgba(10,14,28,0.5)"; ctx.fillRect(X0 + 12, Y0 + 12, X1 - X0, Y1 - Y0);
ctx.fillStyle = K.sand; ctx.fillRect(X0 - 20, Y0, X1 - X0 + 40, Y1 - Y0); // brocade border
ctx.fillStyle = K.cream; ctx.fillRect(X0 + 22, Y0 + 20, X1 - X0 - 44, Y1 - Y0 - 30);
ctx.beginPath(); ctx.rect(X0 + 22, Y0 + 20, X1 - X0 - 44, Y1 - Y0 - 30); ctx.clip();
// painting: sky bokashi + sea
const PY = 330, SEA = 900;
bokashi(ctx, PY, SEA, [[0, "#E9DEC4"], [1, "#B8C9D6"]]);
ctx.fillStyle = K.ink; ctx.font = "92px LSerif"; ctx.textAlign = "center"; ctx.letterSpacing = "14px"; ctx.fillText("KRAKEN", 540, 400); ctx.letterSpacing = "4px"; ctx.font = "24px LSerif"; ctx.fillText("SEA MONSTER OF NORSE LEGEND", 540, 446); ctx.letterSpacing = "0px";
// ship
ctx.save(); ctx.translate(560, SEA + 10); ctx.rotate(Math.sin(t * 1.3) * 0.08 - 0.06); ctx.strokeStyle = K.ink; ctx.lineWidth = 3;
for (const [mx, mh] of [[-90, 300], [0, 360], [90, 280]]) { ctx.beginPath(); ctx.moveTo(mx, -30); ctx.lineTo(mx, -30 - mh); ctx.stroke(); ctx.fillStyle = K.cream2; for (let k = 0; k < 3; k++) { const y = -30 - mh + 30 + k * mh * 0.3; ctx.beginPath(); ctx.moveTo(mx - 55 + k * 5, y); ctx.quadraticCurveTo(mx, y + 20, mx + 55 - k * 5, y); ctx.lineTo(mx + 50 - k * 5, y + mh * 0.24); ctx.quadraticCurveTo(mx, y + mh * 0.3, mx - 50 + k * 5, y + mh * 0.24); ctx.closePath(); ctx.fill(); ctx.stroke(); } }
ctx.fillStyle = K.ink; ctx.beginPath(); ctx.moveTo(-190, -40); ctx.lineTo(200, -50); ctx.lineTo(150, 20); ctx.lineTo(-150, 20); ctx.closePath(); ctx.fill(); ctx.restore();
// arms rising around the ship
for (let a = 0; a < 6; a++) { const bx = 220 + a * 125, P = [], h = (320 + 140 * rnd(a * 2.3)) * rs; if (h < 5) continue; const n = 24, dir = a < 3 ? 1 : -1;
  for (let i = 0; i <= n; i++) { const u = i / n; P.push([bx + Math.sin(u * 3.2 + t * 1.1 + a) * 40 * u + dir * u * u * 90, SEA + 120 - u * h]); }
  tube(ctx, P, 62, 8, a % 2 ? K.sq : K.sqD, K.ink, 3); ctx.fillStyle = K.cream; for (let i = 3; i < n - 2; i += 3) { ctx.beginPath(); ctx.arc(P[i][0] - dir * 14, P[i][1], 8 * (1 - i / n), 0, TAU); ctx.fill(); } }
// curling sea with claws
ctx.fillStyle = K.indigo; ctx.beginPath(); ctx.moveTo(X0, SEA + 40); for (let x = X0; x <= X1; x += 20) ctx.lineTo(x, SEA + 40 + Math.sin(x * 0.02 + t * 1.5) * 18); ctx.lineTo(X1, YMAX); ctx.lineTo(X0, YMAX); ctx.closePath(); ctx.fill(); ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.stroke();
waveLines(ctx, SEA + 70, YMAX - 20, 40, 63);
for (let i = 0; i < 8; i++) claw(ctx, 190 + i * 100, SEA + 44 + Math.sin(i * 0.02 * 100 + t * 1.5) * 18, 1.0, i % 2 ? 1 : -1);
// red seal
ctx.fillStyle = K.red; ctx.fillRect(800, 1100, 70, 70); ctx.fillStyle = K.cream; ctx.font = "22px LSerif"; ctx.fillText("1752", 835, 1143);
ctx.restore();
// rollers
function roller(y) { ctx.save(); ctx.fillStyle = K.wood; ctx.strokeStyle = K.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(X0 - 50, y - 18, X1 - X0 + 100, 36, 14); ctx.fill(); ctx.stroke();
  ctx.fillStyle = K.ink; for (const x of [X0 - 66, X1 + 46]) { ctx.beginPath(); ctx.roundRect(x, y - 24, 22, 48, 6); ctx.fill(); } ctx.restore(); }
roller(Y0); roller(Y1);
ctx.strokeStyle = K.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0 + 60, Y0 - 16); ctx.lineTo(540, Y0 - 110); ctx.lineTo(X1 - 60, Y0 - 16); ctx.stroke();
plaque(ctx, 540, 1500, [{ t: "PONTOPPIDAN · NORWAY · 1752", s: 30, sp: 5 }, { t: "INSPIRED BY GIANT SQUID?", s: 24, sp: 5, c: K.red }], p.labk || 0);
finish(ctx);
