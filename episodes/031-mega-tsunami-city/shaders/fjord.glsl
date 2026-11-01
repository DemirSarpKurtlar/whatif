// Lituya Bay, Alaska (units: metres). A narrow fjord (water y=0) between forested mountains; the head wall in front (-z).
// The 1958 wave stripped the forest up to 524 m: below u_run the slope is bare rock/soil.
// params: cx cy cz tx ty tz (camera), run (stripped height m), foam (0..1 white water at the run-up edge),
//         mark (0..1 cyan 100 m contour for scale), shake
float gT = 0.0;
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++){ s += a*noise2(p); p = rot(0.6)*p*2.03; a *= 0.5; } return s; }
float terr(vec2 xz){
  float x = xz.x, z = xz.y;
  float side = max(0.0, abs(x + 60.0*sin(z*0.0015)) - 420.0);
  float head = max(0.0, -z - 1300.0);
  float d = length(vec2(side, head*1.15));
  float h = d*1.05 - 0.00012*d*d;
  h = max(h, 0.0);
  float rough = fbm(xz*0.0022);
  h += (rough - 0.45)*300.0*smoothstep(10.0, 300.0, h);
  h += 1100.0*smoothstep(700.0, 2600.0, d)*fbm(xz*0.0009 + 3.0);
  return h - 6.0;
}
vec2 map(vec3 p){ return vec2(1e9, 0.0); }
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  vec2 jit = u_shake*vec2(noise2(vec2(u_time*23.0, 1.0)) - 0.5, noise2(vec2(u_time*19.0, 7.0)) - 0.5)*6.0;
  vec3 ro = vec3(u_cx + jit.x, u_cy + jit.y, u_cz);
  vec3 rd = camRay(p, ro, vec3(u_tx, u_ty, u_tz), 1.2);
  vec3 hor = vec3(190.0, 204.0, 218.0)/255.0, top = vec3(84.0, 112.0, 150.0)/255.0;
  vec3 col = mix(hor, top, pow(clamp(rd.y, 0.0, 1.0), 0.5));
  vec2 cp = rd.xz/(rd.y + 0.06)*2.0;
  float cl = smoothstep(0.5, 0.85, noise2(cp*1.1 + vec2(gT*0.02, 0.0))*0.65 + noise2(cp*2.9)*0.35);
  col = mix(col, vec3(0.95, 0.96, 0.98), cl*0.55*smoothstep(0.01, 0.2, rd.y));
  float t = 1.0, hit = -1.0, tp = 0.0;
  for (int i = 0; i < 200; i++) {
    vec3 q = ro + rd*t;
    float h = max(terr(q.xz), 0.0);
    float dh = q.y - h;
    if (dh < 0.0) { hit = t; break; }
    tp = t; t += max(dh*0.4, 1.0 + t*0.004);
    if (t > 9000.0) break;
  }
  if (hit > 0.0) {
    float a = tp, b = hit;
    for (int i = 0; i < 8; i++) { float m = 0.5*(a + b); vec3 q = ro + rd*m; if (q.y < max(terr(q.xz), 0.0)) b = m; else a = m; }
    hit = b;
    vec3 pos = ro + rd*hit;
    float h = terr(pos.xz);
    vec3 L = normalize(vec3(0.85, 0.5, 0.15));
    vec3 key = vec3(1.25, 1.15, 1.0), skyF = lin(vec3(0.6, 0.72, 0.88))*0.6;
    vec3 c;
    if (h <= 0.0) {
      vec2 wv = vec2(noise2(pos.xz*0.05 + gT*0.3), noise2(pos.xz*0.06 - gT*0.3 + 5.0)) - 0.5;
      vec3 n = normalize(vec3(wv.x*0.2, 1.0, wv.y*0.2));
      vec3 rr = reflect(rd, n);
      float fr = 0.04 + 0.96*pow(1.0 - clamp(dot(-rd, n), 0.0, 1.0), 5.0);
      c = mix(lin(vec3(0.16, 0.3, 0.32)), lin(mix(hor, top, pow(clamp(rr.y, 0.0, 1.0), 0.5))), fr*0.8 + 0.1);
      c = mix(c, lin(vec3(0.85, 0.9, 0.9)), smoothstep(30.0, 0.0, -terr(pos.xz) + 6.0)*0.0);
    } else {
      vec2 e = vec2(4.0, 0.0);
      vec3 n = normalize(vec3(terr(pos.xz - e.xy) - terr(pos.xz + e.xy), 2.0*e.x, terr(pos.xz - e.yx) - terr(pos.xz + e.yx)));
      float slope = 1.0 - n.y;
      float tn = noise2(pos.xz*0.35)*0.5 + noise2(pos.xz*1.3)*0.5;
      vec3 forest = mix(vec3(0.05, 0.13, 0.07), vec3(0.12, 0.24, 0.12), tn);
      forest *= 0.75 + 0.5*step(0.5, noise2(pos.xz*0.9));
      vec3 rock = mix(vec3(0.45, 0.43, 0.4), vec3(0.6, 0.58, 0.54), noise2(pos.xz*0.08));
      vec3 alb = mix(forest, rock, smoothstep(0.55, 0.75, slope + 0.1*tn));
      float tl = 820.0 + 160.0*noise2(pos.xz*0.004);
      alb = mix(alb, rock, smoothstep(tl - 80.0, tl + 80.0, pos.y));
      float snow = smoothstep(1350.0, 1500.0, pos.y + 150.0*noise2(pos.xz*0.004))*smoothstep(0.2, 0.6, n.y);
      alb = mix(alb, vec3(0.93, 0.95, 0.98), snow);
      // the 1958 trimline: forest stripped below u_run
      float edge = u_run + 14.0*(noise2(pos.xz*0.02) - 0.5);
      float strip = smoothstep(edge + 3.0, edge - 3.0, pos.y)*step(1.0, u_run);
      vec3 bare = mix(vec3(0.62, 0.55, 0.45), vec3(0.78, 0.72, 0.62), noise2(vec2(pos.x*0.03, pos.y*0.08)));
      alb = mix(alb, bare, strip*(1.0 - snow));
      float fo = smoothstep(edge - 60.0, edge - 4.0, pos.y)*strip*u_foam*(0.6 + 0.4*noise2(pos.xz*0.08 + gT*2.0));
      alb = mix(alb, vec3(0.95, 0.97, 0.98), fo);
      c = lin(alb)*(key*clamp(dot(n, L), 0.0, 1.0)*1.1 + skyF*(0.45 + 0.35*n.y));
      // 100 m contour for scale
      float ln = smoothstep(4.0, 1.0, abs(pos.y - 100.0))*u_mark;
      c = mix(c, lin(vec3(0.35, 0.95, 1.0))*1.4, ln);
    }
    col = grade(c, lin(hor), hit, 2500.0, 0.004, 0.02);
    col = mix(col, hor, clamp((hit - 3000.0)/6000.0, 0.0, 0.6));
  }
  return vec4(col, 1.0);
}
