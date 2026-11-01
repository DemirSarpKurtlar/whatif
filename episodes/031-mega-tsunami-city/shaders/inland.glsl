// Aerial view of a coastal city as a tsunami floods inland (adapted from 003 flood.glsl). World unit = 10 m.
// Sea for z > 0, city on flat land (y = 0.3) for z < 0, stretching far inland (-z).
// params: cx cy cz tx ty tz (camera), water (flood depth, units), front (z of the flood front, units; starts ~0, moves to -z),
//         dark (0..1 storm light), shake
float gT = 0.0;
float gNoBnd = 0.0;
vec2 city(vec3 p){
  float by = p.y - 14.0;
  float bz = max(-p.z - 900.0, p.z + 2.0);
  float bx = abs(p.x) - 300.0;
  float bb = max(max(by, bz), bx);
  if (bb > 0.4) return vec2(bb, 0.0);
  vec2 cs = vec2(4.0);
  vec2 cid = floor(p.xz/cs);
  vec2 f = abs(mod(p.xz, cs) - 2.0);
  float bnd = (2.0 - max(f.x, f.y)) + 0.3;
  vec3 q = vec3(mod(p.x, cs.x) - 2.0, p.y, mod(p.z, cs.y) - 2.0);
  float hh = hash2(cid);
  float near = smoothstep(-40.0, -4.0, p.z);
  float h = 0.8 + 3.5*hh*hh + 4.0*near*hash2(cid + 3.0) + (hash2(cid + 9.0) > 0.93 ? 4.0 : 0.0);
  vec2 sz = vec2(0.9 + 0.6*hash2(cid + 1.0), 0.9 + 0.6*hash2(cid + 2.0));
  float d = sdRoundBox(q - vec3(0.0, h*0.5, 0.0), vec3(sz.x, h*0.5, sz.y), 0.03);
  if (hash2(cid + 4.0) > 0.6) d = min(d, sdRoundBox(q - vec3(0.0, h + 0.4, 0.0), vec3(sz.x*0.6, 0.4, sz.y*0.6), 0.03));
  return vec2(gNoBnd > 0.5 ? d : min(d, bnd), 2.0);
}
float floodH(vec2 xz){
  // inland of the front the land is dry; behind it, a churning sheet of water that thins toward the front
  float behind = xz.y - u_front - 0.8*noise2(vec2(xz.x*0.12, 2.0)) - 0.6*sin(xz.x*0.05);
  float sheet = u_water*smoothstep(0.0, 6.0, behind)*(0.55 + 0.45*smoothstep(0.0, 60.0, behind));
  float sea = xz.y > 0.0 ? u_water*0.8 + 0.0 : 0.0;
  float ripple = 0.05*noise2(xz*1.3 + vec2(0.0, gT*2.0)) + 0.04*sin(xz.y*2.0 + gT*4.0);
  return max(sheet, sea) + ripple + step(behind, 0.0)*-5.0;
}
vec2 map(vec3 p){ return city(p); }
vec3 skyc(vec3 rd){
  vec3 hor = mix(vec3(178.0,200.0,222.0)/255.0, vec3(128.0,134.0,142.0)/255.0, u_dark);
  vec3 top = mix(vec3(76.0,108.0,152.0)/255.0, vec3(58.0,64.0,76.0)/255.0, u_dark);
  float e = clamp(rd.y, 0.0, 1.0);
  vec3 c = mix(hor, top, pow(e, 0.6));
  vec2 cp = rd.xz/(rd.y + 0.08)*2.2;
  float cl = smoothstep(0.55, 0.85, noise2(cp*1.3 + vec2(gT*0.02, 0.0))*0.65 + noise2(cp*3.1)*0.35);
  return mix(c, mix(vec3(0.93,0.95,0.98), vec3(0.6,0.62,0.66), u_dark), cl*0.55*smoothstep(0.02, 0.2, rd.y));
}
vec3 litc(vec3 pos, vec3 rd, float dist){
  vec3 n = calcNormal(pos);
  vec2 cid = floor(pos.xz/4.0);
  float k = hash2(cid + 21.0);
  vec3 c = k < 0.3 ? vec3(205.0,198.0,184.0) : k < 0.55 ? vec3(158.0,170.0,184.0) : k < 0.8 ? vec3(128.0,144.0,160.0) : vec3(214.0,186.0,156.0);
  float u = abs(n.x) > 0.5 ? pos.z : pos.x;
  float win = step(0.5, fract(pos.y*3.0))*step(0.4, fract(u*2.2))*step(abs(n.y), 0.5);
  c = mix(c, c*0.6 + vec3(12.0, 22.0, 38.0), win*0.65*smoothstep(60.0, 20.0, dist)*smoothstep(0.12, 0.4, abs(dot(n, rd))));
  vec3 alb = lin(c/255.0);
  vec3 L = normalize(vec3(-0.6, 0.9, 0.5));
  vec3 key = mix(vec3(1.25, 1.15, 1.0), vec3(0.6, 0.62, 0.66), u_dark);
  float dif = clamp((dot(n, L) + 0.2)/1.2, 0.0, 1.0);
  float sky = 0.5 + 0.5*n.y;
  return alb*(dif*key + sky*lin(vec3(0.62, 0.72, 0.86))*0.55 + 0.08);
}
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  vec2 jit = u_shake*vec2(noise2(vec2(u_time*23.0, 1.0)) - 0.5, noise2(vec2(u_time*19.0, 7.0)) - 0.5)*0.4;
  vec3 ro = vec3(u_cx + jit.x, u_cy + jit.y, u_cz);
  vec3 ta = vec3(u_tx, u_ty, u_tz);
  vec3 rd = camRay(p, ro, ta, 1.2);
  vec3 hazeC = lin(mix(vec3(178.0,200.0,222.0), vec3(128.0,134.0,142.0), u_dark)/255.0);
  // flood heightfield (water over the land / sea)
  float t = 0.2, hitW = 1e9, tp = 0.0;
  if (rd.y < 0.0) {
    for (int i = 0; i < 120; i++) {
      vec3 q = ro + rd*t;
      float g = q.z > 0.0 ? 0.0 : 0.3;
      if (q.y < max(floodH(q.xz), g)) { hitW = t; break; }
      tp = t; t += 0.05 + t*0.03;
      if (t > 1200.0) break;
    }
    if (hitW < 1e8) {
      float a = tp, b = hitW;
      for (int i = 0; i < 7; i++) { float m = 0.5*(a + b); vec3 q = ro + rd*m; float g = q.z > 0.0 ? 0.0 : 0.3; if (q.y < max(floodH(q.xz), g)) b = m; else a = m; }
      hitW = b;
    }
  }
  float tm = 0.0, hitB = -1.0;
  for (int i = 0; i < 150; i++) { vec2 h = map(ro + rd*tm);
    if (h.x < 0.0006*tm + 0.0005) { hitB = tm; break; }
    tm += h.x; if (tm > min(hitW, 1200.0)) break; }
  vec3 col = skyc(rd);
  if (hitB > 0.0) {
    vec3 pos = ro + rd*hitB;
    col = grade(litc(pos, rd, hitB), hazeC, hitB, 40.0, 0.35, 0.03);
  } else if (hitW < 1e8) {
    vec3 wp = ro + rd*hitW;
    float fh = floodH(wp.xz);
    float g = wp.z > 0.0 ? 0.0 : 0.3;
    if (fh > g + 0.01 || wp.z > 0.0) {
      // muddy, churning tsunami water with foam streaks and debris
      vec2 wv = vec2(noise2(wp.xz*1.2 + gT*0.8), noise2(wp.xz*1.4 - gT*0.7 + 5.0)) - 0.5;
      vec3 n = normalize(vec3(wv.x*0.35, 1.0, wv.y*0.35));
      vec3 rr = reflect(rd, n);
      float fr = 0.04 + 0.96*pow(1.0 - clamp(dot(-rd, n), 0.0, 1.0), 5.0);
      float sea = smoothstep(-6.0, 6.0, wp.z);
      vec3 mud = mix(vec3(112.0, 96.0, 70.0), vec3(70.0, 92.0, 92.0), sea)/255.0;
      vec3 c = mix(mud*(0.8 + 0.3*noise2(wp.xz*0.4)), skyc(rr), fr*0.25 + 0.04);
      float behind = wp.z - u_front;
      float foam = smoothstep(0.55, 0.85, noise2(vec2(wp.x*1.4, wp.z*0.6 + gT*1.5)))*0.6*(1.0 - 0.6*sea);
      foam += smoothstep(7.0, 0.0, behind)*(0.7 + 0.3*noise2(wp.xz*3.0 + gT*3.0));
      gNoBnd = 1.0; float dd = map(wp).x; gNoBnd = 0.0;
      foam += smoothstep(0.35, 0.0, dd)*0.7;
      c = mix(c, vec3(0.93, 0.92, 0.88)*mix(1.0, 0.75, u_dark), clamp(foam, 0.0, 1.0));
      float deb = step(0.985, hash2(floor(wp.xz*2.0)))*step(0.0, -wp.z);
      c = mix(c, vec3(0.3, 0.25, 0.2), deb*0.8);
      col = mix(c, pow(hazeC, vec3(0.4545)), clamp((hitW - 60.0)*0.006, 0.0, 0.6));
    } else {
      float gn = noise2(wp.xz*0.8);
      vec3 a = lin(mix(vec3(150.0, 146.0, 134.0), vec3(170.0, 166.0, 150.0), gn)/255.0);
      vec2 f = abs(mod(wp.xz, 4.0) - 2.0);
      a = mix(a, lin(vec3(0.42, 0.42, 0.44)), step(1.6, max(f.x, f.y))*0.6);
      col = grade(a*(1.1 - 0.4*u_dark), hazeC, hitW, 35.0, 0.4, 0.03);
    }
  }
  return vec4(col, 1.0);
}
