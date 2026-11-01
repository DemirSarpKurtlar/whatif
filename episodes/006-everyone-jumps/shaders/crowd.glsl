// Endless packed crowd. Units: metres. params: cx cy cz tx ty tz jump arms dusk shake road
float gT = 0.0;
const float CS = 0.78;
float roadMask(vec2 xz){ return u_road > 0.5 ? step(abs(xz.x - 7.0), 4.2) : 0.0; }
vec2 crowd(vec3 p){
  float top = p.y - (2.0 + u_jump * 0.8);
  if (top > 0.3) return vec2(top, 0.0);
  vec2 cid = floor(p.xz / CS);
  vec2 f = abs(mod(p.xz, CS) - 0.5 * CS);
  float bnd = (0.5 * CS - max(f.x, f.y)) + 0.12;
  if (roadMask(cid * CS + 0.5 * CS) > 0.5) return vec2(max(bnd, top), 0.0);
  vec2 j = (vec2(hash2(cid + 7.1), hash2(cid + 3.3)) - 0.5) * 0.24;
  vec3 q = vec3(mod(p.x, CS) - 0.5 * CS - j.x, p.y, mod(p.z, CS) - 0.5 * CS - j.y);
  float hgt = 0.88 + 0.22 * hash2(cid + 5.0);
  q.y -= u_jump * (0.4 + 0.2 * hash2(cid + 11.0));
  q.y /= hgt;
  float legs = sdCapsule(q, vec3(0.0, 0.1, 0.0), vec3(0.0, 0.78, 0.0), 0.11);
  float body = sdCapsule(q, vec3(0.0, 0.92, 0.0), vec3(0.0, 1.34, 0.0), 0.165);
  float up = clamp(u_arms, 0.0, 1.0);
  vec3 hnd = mix(vec3(0.24, 0.85, 0.05), vec3(0.24, 1.72, 0.04), up);
  float arms = min(sdCapsule(q, vec3(0.17, 1.3, 0.0), hnd, 0.048), sdCapsule(q, vec3(-0.17, 1.3, 0.0), vec3(-hnd.x, hnd.y, hnd.z), 0.048));
  float head = sdSphere(q - vec3(0.0, 1.55, 0.0), 0.115);
  vec2 r = opU(vec2(legs, 5.0), vec2(smin(body, arms, 0.04), 4.0));
  r = opU(r, vec2(head, 6.0));
  r.x *= hgt * 0.9;
  r.x = min(r.x, bnd);
  return r;
}
vec2 cars(vec3 p){
  if (u_road < 0.5) return vec2(1e9, 0.0);
  vec3 q = p - vec3(7.0, 0.0, 0.0);
  if (abs(q.x) > 4.6 || p.y > 2.2) return vec2(max(abs(q.x) - 4.4, p.y - 2.0), 0.0);
  float lane = q.x > 0.0 ? 2.0 : -2.0;
  vec3 c = vec3(q.x - lane, q.y, mod(q.z + (lane > 0.0 ? 0.0 : 2.5), 5.2) - 2.6);
  float b = sdRoundBox(c - vec3(0.0, 0.55, 0.0), vec3(0.85, 0.35, 2.0), 0.18);
  b = min(b, sdRoundBox(c - vec3(0.0, 1.05, -0.2), vec3(0.75, 0.28, 1.1), 0.15));
  return vec2(b * 0.9, 7.0);
}
vec2 map(vec3 p){ return opU(crowd(p), cars(p)); }
vec3 skyc(vec3 rd){
  vec3 hor = mix(vec3(176.0,200.0,226.0), vec3(232.0,168.0,128.0), u_dusk) / 255.0;
  vec3 top = mix(vec3(84.0,116.0,160.0), vec3(48.0,52.0,96.0), u_dusk) / 255.0;
  vec3 c = mix(hor, top, pow(clamp(rd.y, 0.0, 1.0), 0.55));
  vec2 cp = rd.xz / (rd.y + 0.08) * 2.0;
  float cl = smoothstep(0.55, 0.85, noise2(cp * 1.3 + vec2(gT * 0.02, 0.0)) * 0.65 + noise2(cp * 3.1) * 0.35);
  return mix(c, mix(vec3(0.94,0.95,0.98), vec3(0.98,0.8,0.7), u_dusk), cl * 0.5 * smoothstep(0.02, 0.2, rd.y));
}
vec3 shirt(vec2 cid){
  float k = hash2(cid + 21.0);
  vec3 c = k<0.15? vec3(200.0,68.0,58.0) : k<0.3? vec3(227.0,178.0,60.0) : k<0.45? vec3(60.0,111.0,176.0) : k<0.6? vec3(62.0,154.0,142.0) : k<0.72? vec3(123.0,90.0,166.0) : k<0.86? vec3(232.0,226.0,214.0) : vec3(60.0,64.0,72.0);
  return c / 255.0;
}
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  vec2 jit = u_shake * vec2(noise2(vec2(u_time*29.0,1.0))-0.5, noise2(vec2(u_time*23.0,7.0))-0.5) * 0.6;
  vec3 ro = vec3(u_cx + jit.x, u_cy + jit.y, u_cz);
  vec3 ta = vec3(u_tx, u_ty, u_tz);
  vec3 rd = camRay(p, ro, ta, 1.25);
  vec3 L = normalize(vec3(-0.5, mix(1.0, 0.35, u_dusk), 0.45));
  vec3 key = mix(vec3(1.2,1.12,1.0), vec3(1.3,0.8,0.55), u_dusk);
  vec3 skyF = mix(lin(vec3(0.62,0.72,0.86)), lin(vec3(0.5,0.45,0.6)), u_dusk) * 0.6;
  vec3 hazeC = lin(mix(vec3(176.0,200.0,226.0), vec3(200.0,150.0,130.0), u_dusk) / 255.0);
  float tg = rd.y < 0.0 ? -ro.y / rd.y : 1e9;
  float tnear = min(tg, 70.0);
  vec3 m = march(ro, rd, tnear, 0.0);
  vec3 col = skyc(rd);
  if (m.x > 0.0) {
    vec3 pos = ro + rd * m.x; vec3 n = calcNormal(pos);
    vec2 cid = floor(pos.xz / CS);
    vec3 alb;
    if (m.y < 4.5) alb = shirt(cid);
    else if (m.y < 5.5) alb = hash2(cid + 4.0) > 0.5 ? vec3(0.18,0.2,0.25) : vec3(0.29,0.35,0.48);
    else if (m.y < 6.5) alb = mix(vec3(0.95,0.79,0.65), vec3(0.45,0.3,0.2), hash2(cid + 9.0));
    else { vec2 kc = floor(vec2(pos.x, pos.z / 5.2)); float k = hash2(kc); alb = k < 0.3 ? vec3(0.8,0.15,0.12) : k < 0.6 ? vec3(0.85,0.85,0.88) : k < 0.8 ? vec3(0.15,0.2,0.3) : vec3(0.9,0.75,0.2); }
    alb = lin(alb);
    float hy = clamp((pos.y - u_jump * 0.45) / 1.6, 0.0, 1.0);
    float ao = mix(0.25, 1.0, smoothstep(0.0, 1.0, hy));
    if (m.y > 6.5) ao = 1.0;
    float dif = clamp((dot(n, L) + 0.25) / 1.25, 0.0, 1.0);
    vec3 c = alb * (dif * key * ao + (0.5 + 0.5 * n.y) * skyF * ao + 0.05);
    if (m.y > 6.5 && u_dusk > 0.2) {
      vec3 q = pos - vec3(7.0, 0.0, 0.0);
      float tail = step(0.0, q.y - 0.4) * step(q.y, 0.75) * step(abs(abs(q.x - (q.x > 0.0 ? 2.0 : -2.0)) - 0.6), 0.18);
      c += vec3(2.5, 0.2, 0.1) * tail * u_dusk * step(n.z, -0.5);
    }
    col = grade(c, hazeC, m.x, 35.0, 0.35, 0.03);
  } else if (tg < 1e8) {
    vec3 pos = ro + rd * tg;
    vec2 cid = floor(pos.xz / CS);
    vec3 a;
    if (roadMask(cid * CS + 0.5 * CS) > 0.5) {
      a = lin(vec3(0.24, 0.25, 0.27));
    } else {
      vec2 f = fract(pos.xz / CS) - 0.5;
      float headDot = smoothstep(0.24, 0.16, length(f));
      vec3 s0 = shirt(cid);
      vec3 sk = mix(vec3(0.6,0.45,0.35), vec3(0.3,0.2,0.15), hash2(cid + 9.0));
      vec3 cellc = mix(s0 * 0.75, sk, headDot * 0.6);
      float pix = tg * 0.0011 / max(abs(rd.y), 0.12);
      vec3 avg = mix(vec3(0.42, 0.42, 0.45), vec3(0.55, 0.45, 0.42), noise2(pos.xz * 0.15)) * (0.8 + 0.3 * noise2(pos.xz * 0.6));
      a = lin(mix(cellc, avg, smoothstep(0.25 * CS, 0.6 * CS, pix)));
      a *= 0.8 + 0.2 * noise2(pos.xz * 0.05);
      a = mix(lin(vec3(0.12, 0.12, 0.13)), a, smoothstep(60.0, 70.0, tg));
    }
    col = grade(a * (key * 0.75 + skyF * 1.2), hazeC, tg, 40.0, 0.45, 0.03);
  }
  return vec4(col, 1.0);
}
