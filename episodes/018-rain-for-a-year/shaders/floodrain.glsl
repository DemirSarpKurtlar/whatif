// Coastal city with rising sea. World unit = 10 m. Sea level y=0, land y=0.3 for z<-14.
// params: cx cy cz tx ty tz (camera), water (sea level, units), statue (0/1), dusk (0..1), shake
float gT = 0.0;
vec3 STP = vec3(7.0, 0.0, -6.0);
float gNoBnd = 0.0;
vec2 city(vec3 p){
  float by = p.y - 16.5;
  float bz = max(-p.z - 72.0, p.z + 15.5);
  float bx = abs(p.x) - 44.0;
  float bb = max(max(by, bz), bx);
  if (bb > 0.4) return vec2(bb, 0.0);
  vec2 cs = vec2(4.0);
  vec2 cid = floor(p.xz / cs);
  vec2 f = abs(mod(p.xz, cs) - 2.0);
  float bnd = (2.0 - max(f.x, f.y)) + 0.3;
  vec3 q = vec3(mod(p.x, cs.x) - 2.0, p.y, mod(p.z, cs.y) - 2.0);
  float far = clamp((-p.z - 16.0) / 50.0, 0.0, 1.0);
  float hh = hash2(cid);
  float h = 1.5 + 8.0 * hh * hh + 5.0 * far * hash2(cid + 3.0) + (hash2(cid + 9.0) > 0.9 ? 4.0 : 0.0);
  vec2 sz = vec2(1.0 + 0.7 * hash2(cid + 1.0), 1.0 + 0.7 * hash2(cid + 2.0));
  float d = sdRoundBox(q - vec3(0.0, h * 0.5, 0.0), vec3(sz.x, h * 0.5, sz.y), 0.03);
  if (hash2(cid + 4.0) > 0.55) d = min(d, sdRoundBox(q - vec3(0.0, h + 0.5, 0.0), vec3(sz.x * 0.6, 0.5, sz.y * 0.6), 0.03));
  return vec2(gNoBnd > 0.5 ? d : min(d, bnd), 2.0);
}
float sdRoundCone(vec3 p, float r1, float r2, float h){
  float b = (r1 - r2) / h; float a = sqrt(1.0 - b * b);
  vec2 q = vec2(length(p.xz), p.y); float k = dot(q, vec2(-b, a));
  if (k < 0.0) return length(q) - r1;
  if (k > a * h) return length(q - vec2(0.0, h)) - r2;
  return dot(q, vec2(a, b)) - r1;
}
vec2 statue(vec3 p){
  vec3 q = p - STP;
  float bb = length(q - vec3(0.0, 4.8, 0.0)) - 5.6;
  if (bb > 0.4) return vec2(bb, 0.0);
  float isl = sdRoundBox(q - vec3(0.0, 0.0, 0.0), vec3(3.4, 0.3, 3.4), 0.2);
  float ped = sdRoundBox(q - vec3(0.0, 0.75, 0.0), vec3(1.55, 0.45, 1.55), 0.03);
  ped = min(ped, sdRoundBox(q - vec3(0.0, 2.8, 0.0), vec3(1.0, 1.65, 1.0), 0.03));
  ped = min(ped, sdRoundBox(q - vec3(0.0, 4.5, 0.0), vec3(1.18, 0.14, 1.18), 0.03));
  ped = min(ped, sdRoundBox(q - vec3(0.0, 3.6, 0.0), vec3(1.08, 0.08, 1.08), 0.02));
  vec2 r = opU(vec2(isl, 1.0), vec2(ped, 3.0));
  float s = sdRoundCone(q - vec3(0.0, 5.0, 0.0), 0.6, 0.4, 2.25);
  s = smin(s, sdEllipsoid(q - vec3(0.0, 5.15, 0.05), vec3(0.72, 0.3, 0.66)), 0.25);
  s = min(s, sdRoundBox(q - vec3(0.0, 4.86, 0.0), vec3(0.8, 0.1, 0.72), 0.04));
  s = smin(s, sdCapsule(q, vec3(-0.42, 7.42, 0.0), vec3(0.42, 7.42, 0.0), 0.16), 0.12);
  s = smin(s, sdCapsule(q, vec3(0.0, 7.45, 0.0), vec3(0.0, 7.78, 0.02), 0.11), 0.06);
  s = min(s, sdSphere(q - vec3(0.0, 7.98, 0.03), 0.21));
  s = min(s, sdTorus(q - vec3(0.0, 8.13, 0.03), vec2(0.21, 0.045)));
  for (int i = 0; i < 7; i++) {
    float a = 3.14159 * (0.12 + 0.76 * float(i) / 6.0);
    vec3 d = vec3(cos(a), 0.35, sin(a) * 0.6 + 0.4);
    s = min(s, sdCapsule(q, vec3(0.0, 8.13, 0.03) + d * 0.2, vec3(0.0, 8.13, 0.03) + d * 0.5, 0.025));
  }
  s = smin(s, sdCapsule(q, vec3(0.4, 7.42, 0.0), vec3(0.55, 8.85, 0.05), 0.095), 0.08);
  s = min(s, sdCapsule(q, vec3(0.55, 8.85, 0.05), vec3(0.57, 9.1, 0.05), 0.085));
  s = smin(s, sdCapsule(q, vec3(-0.4, 7.38, 0.0), vec3(-0.5, 6.75, 0.25), 0.09), 0.06);
  s = min(s, sdRoundBox(q - vec3(-0.55, 6.7, 0.32), vec3(0.16, 0.36, 0.06), 0.02));
  r = opU(r, vec2(s, 4.0));
  r = opU(r, vec2(sdEllipsoid(q - vec3(0.57, 9.27, 0.05), vec3(0.11, 0.2, 0.11)), 5.0));
  return r;
}
vec2 map(vec3 p){
  vec2 r = city(p);
  if (u_statue > 0.5) r = opU(r, statue(p));
  return r;
}
vec3 skyc(vec3 rd){
  vec3 hor = mix(vec3(173.0,198.0,226.0)/255.0, vec3(222.0,176.0,146.0)/255.0, u_dusk);
  vec3 top = mix(vec3(80.0,112.0,156.0)/255.0, vec3(64.0,62.0,104.0)/255.0, u_dusk);
  float e = clamp(rd.y, 0.0, 1.0);
  vec3 c = mix(hor, top, pow(e, 0.6));
  vec2 cp = rd.xz / (rd.y + 0.08) * 2.2;
  float cl = smoothstep(0.55, 0.85, noise2(cp * 1.3 + vec2(gT * 0.02, 0.0)) * 0.65 + noise2(cp * 3.1) * 0.35);
  return mix(c, mix(vec3(0.93,0.95,0.98), vec3(0.96,0.82,0.74), u_dusk), cl * 0.55 * smoothstep(0.02, 0.2, rd.y));
}
float shd(vec3 ro, vec3 rd){ float res = 1.0, t = 0.05; gNoBnd = 1.0;
  for (int i = 0; i < 24; i++){ float h = map(ro + rd * t).x; res = min(res, 4.0 * h / t); t += clamp(h, 0.05, 1.5); if (h < 0.002 || t > 30.0) break; }
  gNoBnd = 0.0; return clamp(res, 0.0, 1.0); }
vec3 litc(vec3 pos, vec3 rd, float id, float dist){
  vec3 n = calcNormal(pos);
  vec3 c;
  if (id < 1.5) c = vec3(118.0,128.0,100.0);
  else if (id < 2.5) {
    vec2 cid = floor(pos.xz / 4.0);
    float k = hash2(cid + 21.0);
    c = k < 0.3 ? vec3(205.0,198.0,184.0) : k < 0.55 ? vec3(158.0,170.0,184.0) : k < 0.8 ? vec3(128.0,144.0,160.0) : vec3(214.0,186.0,156.0);
    float u = abs(n.x) > 0.5 ? pos.z : pos.x;
    float win = step(0.5, fract(pos.y * 3.0)) * step(0.4, fract(u * 2.2)) * step(abs(n.y), 0.5);
    c = mix(c, c * 0.6 + vec3(12.0, 22.0, 38.0), win * 0.65 * smoothstep(60.0, 20.0, dist) * smoothstep(0.12, 0.4, abs(dot(n, rd))));
  }
  else if (id < 3.5) c = vec3(168.0,156.0,138.0);
  else if (id < 4.5) c = vec3(108.0,170.0,152.0);
  else return vec3(2.5, 1.8, 0.7);
  vec3 alb = lin(c / 255.0);
  vec3 L = normalize(vec3(-0.6, mix(1.0, 0.4, u_dusk), 0.5));
  vec3 key = mix(vec3(1.25,1.15,1.0), vec3(1.35,0.88,0.62), u_dusk);
  float sh = (dist < 22.0 && id > 1.5 && id < 2.5) ? mix(0.45, 1.0, shd(pos + n * 0.08, L)) : 1.0;
  float dif = clamp((dot(n, L) + 0.2) / 1.2, 0.0, 1.0) * sh;
  float sky = 0.5 + 0.5 * n.y;
  vec3 hh = normalize(L - rd);
  float sp = pow(clamp(dot(n, hh), 0.0, 1.0), 32.0) * (id > 3.5 ? 0.35 : 0.05) * sh;
  return alb * (dif * key + sky * lin(vec3(0.62,0.72,0.86)) * 0.55 + 0.08) + sp * key;
}
vec3 march2(vec3 ro, vec3 rd, float tmax){
  float t = 0.0;
  for (int i = 0; i < 140; i++) { vec2 h = map(ro + rd * t);
    if (h.x < 0.0006 * t + 0.0005) return vec3(t, h.y, 0.0);
    t += h.x; if (t > tmax) break; }
  return vec3(-1.0, 0.0, 0.0);
}
vec4 pixel0(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  vec2 jit = u_shake * vec2(noise2(vec2(u_time*23.0,1.0))-0.5, noise2(vec2(u_time*19.0,7.0))-0.5) * 0.4;
  vec3 ro = vec3(u_cx + jit.x, max(u_cy, u_water + 0.6) + jit.y, u_cz);
  vec3 ta = vec3(u_tx, u_ty, u_tz);
  vec3 rd = camRay(p, ro, ta, 1.2);
  vec3 hazeC = lin(mix(vec3(173.0,198.0,226.0), vec3(222.0,176.0,146.0), u_dusk)/255.0);
  float wl = u_water;
  // analytic plane: water (sea) or land
  float tp = 1e9; float isWater = 1.0;
  if (rd.y < 0.0) {
    tp = (wl - ro.y) / rd.y;
    vec3 hp0 = ro + rd * tp;
    if (hp0.z < -14.0 && wl < 0.3) { tp = (0.3 - ro.y) / rd.y; isWater = 0.0; }
  }
  vec3 m = march2(ro, rd, min(tp, 150.0));
  vec3 col = skyc(rd);
  if (m.x > 0.0) {
    vec3 pos = ro + rd * m.x;
    col = grade(litc(pos, rd, m.y, m.x), hazeC, m.x, 40.0, 0.3, 0.03);
  } else if (tp < 1e8) {
    vec3 wp = ro + rd * tp;
    if (isWater > 0.5) {
      vec2 wv = vec2(noise2(wp.xz * 1.2 + gT * 0.5), noise2(wp.xz * 1.4 - gT * 0.45 + 5.0)) - 0.5;
      vec3 n = normalize(vec3(wv.x * 0.22, 1.0, wv.y * 0.22));
      vec3 rr = reflect(rd, n);
      float fr = 0.04 + 0.96 * pow(1.0 - clamp(dot(-rd, n), 0.0, 1.0), 5.0);
      vec3 deep = mix(vec3(36.0,88.0,116.0), vec3(44.0,56.0,86.0), u_dusk) / 255.0;
      col = mix(deep, skyc(rr), fr * 0.85 + 0.12);
      // contact foam around submerged geometry
      gNoBnd = 1.0; float dd = map(wp).x; gNoBnd = 0.0;
      col = mix(col, vec3(0.92), smoothstep(0.25, 0.0, dd) * 0.6 * (0.6 + 0.4 * noise2(wp.xz * 6.0 + gT)));
      col = mix(col, pow(hazeC, vec3(0.4545)), clamp((tp - 45.0) * 0.01, 0.0, 0.55));
    } else {
      float gn = noise2(wp.xz * 0.8);
      vec3 a = lin(mix(vec3(150.0,146.0,134.0), vec3(170.0,166.0,150.0), gn) / 255.0);
      col = grade(a * (lin(vec3(1.0)) * 0.9 + 0.2), hazeC, tp, 35.0, 0.4, 0.03);
    }
  }
  return vec4(col, 1.0);
}

vec4 pixel(vec2 uv){
  vec3 col = pixel0(uv).rgb;
  float lum = dot(col, vec3(0.3,0.59,0.11));
  col = mix(col, vec3(lum)*vec3(0.86,0.9,1.0), u_gloom*0.6) * (1.0 - 0.38*u_gloom);
  vec2 p = uv*vec2(u_resolution.x/u_resolution.y, 1.0);
  float r = 0.0;
  for (int i=0;i<3;i++){
    float fi = float(i);
    float sc = 34.0 + fi*30.0;
    vec2 q = vec2(p.x*sc + p.y*sc*0.10, p.y*sc*0.16 - u_time*(7.0+fi*3.0));
    vec2 cid = floor(q); vec2 f = fract(q);
    float h = hash2(cid + fi*13.0);
    float d = abs(f.x - 0.5 - (h-0.5)*0.6);
    r += smoothstep(0.05,0.0,d) * step(h,0.3) * smoothstep(0.0,0.35,f.y)*smoothstep(1.0,0.55,f.y) * (0.55 - fi*0.13);
  }
  col += vec3(0.78,0.82,0.9)*r*u_rain*0.55;
  col = mix(col, vec3(0.55,0.58,0.62)*(1.0-0.3*u_gloom), u_rain*0.12*smoothstep(0.2,1.0,uv.y));
  return vec4(col, 1.0);
}
