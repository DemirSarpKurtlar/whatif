// 056 — adapted from 015 coastcurve.glsl (Park Skyline beach). Beach + seafront town looking out to sea (-z).
// params: cam, level (sea level), surge (0..1 wave), night (0..1), moon (0..1), shake, tilt, panx, wet, milky, curve (kept from 015)
// new: yaw (look left toward the town), camh (camera height), mrad (Moon angular radius, rad), mlight (moonlight multiplier),
//      ecl (0..1 solar eclipse: Moon slides over the Sun, sky goes dark), srad (Sun angular radius)
float gT = 0.0;
vec2 gRo = vec2(0.0);
float curv(vec2 xz){ float R = mix(1e7, 110.0, u_curve); vec2 d = xz - gRo; return dot(d,d)/(2.0*R); }
vec2 map(vec3 p){
  p.y += curv(p.xz);
  vec2 r = vec2(1e9, 0.0);
  // beach huts on the left
  vec3 q = p - vec3(-5.2, 0.0, 0.0);
  float cz = floor((q.z + 4.0)/8.0);
  if (cz > -2.0 && cz < 1.0) {
    vec3 h = q; h.z = mod(h.z + 4.0, 8.0) - 4.0;
    float g = 0.9 - 0.05*(p.z - 8.0)*-1.0;
    float hut = sdRoundBox(h - vec3(0.0, 1.4, 0.0), vec3(1.4, 1.1, 1.6), 0.05);
    vec3 rf = h - vec3(0.0, 2.75, 0.0); rf.xy = rot(0.0)*rf.xy;
    float roof = sdRoundBox(rf, vec3(1.7, 0.18, 1.9), 0.05);
    r = opU(r, vec2(hut, 2.0 + 0.01*(cz+2.0)));
    r = opU(r, vec2(roof, 3.0));
  }
  // seafront town on the left: rows of pastel blocks with window bands
  {
    vec3 tq = p - vec3(-11.0, 0.0, 0.0);
    float tz = floor((tq.z + 3.0)/6.0);
    if (tz > -3.0 && tz < 2.0) {
      for (int k = 0; k < 2; k++) {
        float fk = float(k);
        vec3 bq = tq - vec3(-fk*5.5, 0.0, 0.0); bq.z = mod(bq.z + 3.0, 6.0) - 3.0;
        float hb = 3.5 + 4.5*hash2(vec2(tz, fk*7.0 + 1.0)) + fk*2.5;
        float gz = 0.9 + 0.055*(tz*6.0 - 8.0);
        float bx = sdRoundBox(bq - vec3(0.0, gz - 1.0 + hb*0.5 + 0.5, 0.0), vec3(2.0, hb*0.5 + 0.5, 2.4), 0.04);
        r = opU(r, vec2(bx, 7.0 + 0.01*mod(tz + 3.0 + fk*2.0, 4.0)));
      }
    }
  }
  // palms on the right
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    vec3 b = vec3(4.4 + 1.8*fi, 0.5, -3.0 - 8.0*fi);
    vec3 top = b + vec3(-0.8, 5.5 + fi*0.6, 0.0);
    float tr = sdCapsule(p, b, top, 0.16);
    vec3 l = p - top;
    float lv = 1e9;
    for (int k = 0; k < 5; k++) {
      float a = float(k)*1.2566 + fi;
      vec3 dir = vec3(cos(a), -0.35, sin(a));
      lv = min(lv, sdCapsule(l, vec3(0.0), dir*2.2, 0.12));
    }
    r = opU(r, vec2(tr, 4.0));
    r = opU(r, vec2(lv, 5.0));
  }
  // umbrellas
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    vec3 c = vec3(-3.6 + 1.3*fi, 0.0, 6.0 - 3.0*fi);
    float pole = sdCapsule(p, c, c + vec3(0.0, 2.2, 0.0), 0.04);
    vec3 u = p - c - vec3(0.0, 2.2, 0.0);
    float cap = max(sdSphere(u + vec3(0.0, 0.9, 0.0), 1.4), -u.y);
    r = opU(r, vec2(min(pole, cap), 6.0 + 0.01*fi));
  }
  return r;
}
float groundH(vec2 xz){ return 0.9 + 0.055*(xz.y - 8.0) + 0.05*noise2(xz*0.3) - curv(xz); }
float seaH(vec2 xz){
  float zc = mix(-140.0, 4.0, u_surge);
  float A = 17.0*smoothstep(0.0, 0.3, u_surge);
  float dz = xz.y - zc; float crest = A*exp(-pow(dz/(dz < 0.0 ? 13.0 : 7.0), 2.0));
  float behind = 0.0;
  return u_level + crest + behind + 0.08*sin(xz.y*0.9 + gT*1.6) + 0.05*sin(xz.x*0.7 + gT*1.1) - curv(xz);
}
vec3 skyN(vec3 rd){
  vec3 dh = vec3(173.0,198.0,226.0)/255.0, dt = vec3(78.0,114.0,164.0)/255.0;
  vec3 nh = vec3(28.0,36.0,62.0)/255.0, nt = vec3(6.0,8.0,20.0)/255.0;
  float e = pow(clamp(rd.y, 0.0, 1.0), 0.55);
  vec3 c = mix(mix(dh, dt, e), mix(nh, nt, e), u_night);
  vec2 cp = rd.xz/(rd.y + 0.08)*2.0;
  float cl = smoothstep(0.55, 0.85, noise2(cp*1.3 + vec2(gT*0.02, 0.0))*0.65 + noise2(cp*3.1)*0.35);
  c = mix(c, mix(vec3(0.95,0.96,0.98), vec3(0.16,0.18,0.26), u_night), cl*0.45*smoothstep(0.02, 0.2, rd.y));
  if (u_night > 0.0) {
    vec2 sq = vec2(atan(rd.z, rd.x), asin(clamp(rd.y, -1.0, 1.0)))*140.0;
    vec2 sc = floor(sq); vec2 sf = fract(sq) - 0.5;
    float st = hash2(sc) > 0.982 ? smoothstep(0.3, 0.0, length(sf))*(0.5 + 0.5*hash2(sc + 2.0)) : 0.0;
    float starBoost = 1.0 + 1.6*(1.0 - u_moon);
    c += vec3(st)*u_night*smoothstep(0.0, 0.1, rd.y)*0.7*starBoost;
    // the Milky Way (only once the moonlight is gone)
    vec3 mwN = normalize(vec3(0.85, 0.3, 0.15));
    float md0 = dot(rd, mwN);
    float band = exp(-md0*md0/0.012);
    vec2 bq = vec2(atan(rd.z, rd.x)*6.0, rd.y*6.0);
    float dust = 0.55 + 0.45*noise2(bq*3.0) - 0.18*smoothstep(0.5, 0.95, noise2(bq*2.5 + 3.0));
    vec2 sq2 = vec2(atan(rd.z, rd.x), asin(clamp(rd.y, -1.0, 1.0)))*420.0;
    float st2 = hash2(floor(sq2)) > 0.93 ? smoothstep(0.35, 0.0, length(fract(sq2) - 0.5)) : 0.0;
    c += (vec3(0.55,0.55,0.7)*band*dust*0.65 + vec3(st2)*band*0.9)*u_milky*u_night*smoothstep(0.02, 0.15, rd.y);
    // the Moon (angular radius u_mrad)
    vec3 md = normalize(vec3(0.1, 0.36, -1.0));
    float cosA = dot(rd, md);
    float ang = acos(clamp(cosA, -1.0, 1.0));
    float disc = smoothstep(u_mrad*1.02, u_mrad*0.98, ang);
    vec3 mu = normalize(cross(md, vec3(0,1,0))), mv = cross(mu, md);
    vec2 mp = vec2(dot(rd, mu), dot(rd, mv))/u_mrad;
    float mare = 1.0 - 0.28*smoothstep(0.45, 0.6, noise2(mp*2.2 + 3.0)) - 0.1*noise2(mp*9.0);
    float bright = min(1.0, 0.75 + 0.12*u_mlight);
    c = mix(c, vec3(0.97,0.96,0.9)*mare*bright, disc*u_moon*u_night);
    float halo = u_mrad/0.025;
    c += vec3(0.6,0.65,0.8)*pow(max(cosA, 0.0), 300.0/halo)*0.12*u_moon*u_night*u_mlight;
    c += vec3(0.2,0.25,0.4)*pow(max(cosA, 0.0), 20.0)*0.05*u_moon*u_night*u_mlight;
  }
  if (u_ecl > 0.0) {
    vec3 sd = normalize(vec3(0.1, 0.36, -1.0));
    float dark = smoothstep(0.82, 1.0, u_ecl);
    // sky dims to a deep twilight with a 360° sunset glow on the horizon
    vec3 tw = mix(vec3(0.05,0.07,0.16), vec3(0.01,0.015,0.05), pow(clamp(rd.y,0.0,1.0),0.5));
    tw += vec3(1.0,0.5,0.22)*exp(-max(rd.y,0.0)*14.0)*0.55;
    c = mix(c, tw, dark*0.92 + 0.08*u_ecl);
    float sa = acos(clamp(dot(rd, sd), -1.0, 1.0));
    // the Sun
    c = mix(c, vec3(1.0,0.97,0.88)*1.4, smoothstep(u_srad*1.05, u_srad*0.95, sa));
    c += vec3(1.0,0.9,0.7)*exp(-sa/u_srad*1.2)*0.5*(1.0 - dark);
    // corona once totality starts
    vec3 su = normalize(cross(sd, vec3(0,1,0))), sv = cross(su, sd);
    float pa = atan(dot(rd, sv), dot(rd, su));
    float streak = 0.6 + 0.4*noise2(vec2(pa*5.0, 1.0));
    c += vec3(0.85,0.9,1.0)*exp(-(sa - u_mrad)/(u_srad*0.9))*step(u_mrad*0.97, sa)*dark*streak*0.9;
    // the Moon slides across, offset along -su
    vec3 mdir = normalize(sd - su*(1.0 - u_ecl)*u_mrad*2.4 + sv*(1.0 - u_ecl)*u_mrad*0.5);
    float ma = acos(clamp(dot(rd, mdir), -1.0, 1.0));
    c = mix(c, vec3(0.015,0.015,0.02), smoothstep(u_mrad*1.02, u_mrad*0.98, ma));
    // stars and planets peek out
    vec2 sq = vec2(atan(rd.z, rd.x), asin(clamp(rd.y, -1.0, 1.0)))*90.0;
    float st = hash2(floor(sq)) > 0.992 ? smoothstep(0.3, 0.0, length(fract(sq) - 0.5)) : 0.0;
    c += vec3(st)*dark*0.6*smoothstep(0.05, 0.2, rd.y);
  }
  return c;
}
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  vec2 jit = u_shake*vec2(noise2(vec2(u_time*23.0,1.0))-0.5, noise2(vec2(u_time*19.0,7.0))-0.5)*0.14;
  vec3 ro = vec3(0.0 + u_panx + jit.x, 2.4 + u_camh + jit.y, 10.0 - 4.0*u_cam);
  vec3 fw = vec3(u_panx*0.6 - ro.x, 0.0, -30.0 - ro.z); fw.xz = rot(u_yaw)*fw.xz;
  vec3 ta = ro + fw; ta.y = 2.2 + u_camh*0.6 + u_tilt*8.0;
  vec3 rd = camRay(p, ro, ta, 1.15);
  gRo = ro.xz;
  vec3 col = skyN(rd);
  // ground / sea: linear search along the ray
  float t = 0.2, hit = -1.0, kind = 0.0;
  for (int i = 0; i < 90; i++) {
    vec3 q = ro + rd*t;
    float g = groundH(q.xz), s = seaH(q.xz);
    if (q.y < max(g, s)) { hit = t; kind = s > g ? 1.0 : 0.0; break; }
    t += 0.15 + t*0.045;
    if (t > 260.0) break;
  }
  if (hit > 0.0) { // refine
    float a = hit - (0.15 + hit*0.045), b = hit;
    for (int i = 0; i < 6; i++) { float m = 0.5*(a+b); vec3 q = ro + rd*m; if (q.y < max(groundH(q.xz), seaH(q.xz))) b = m; else a = m; }
    hit = b; vec3 q = ro + rd*b; kind = seaH(q.xz) > groundH(q.xz) ? 1.0 : 0.0;
  }
  vec3 mo = march(ro, rd, hit > 0.0 ? hit : 80.0, 0.0);
  vec3 L = normalize(mix(vec3(0.5, 0.8, -0.4), vec3(0.1, 0.36, -1.0), max(u_night, u_ecl)));
  float edk = smoothstep(0.82, 1.0, u_ecl);
  vec3 key = mix(vec3(1.3,1.15,1.0)*(1.0 - 0.96*edk - 0.25*u_ecl), vec3(0.22,0.24,0.32)*(0.25 + 0.75*u_moon)*u_mlight, u_night);
  vec3 skyF = mix(lin(vec3(0.6,0.72,0.88))*0.6*(1.0 - 0.9*edk), lin(vec3(0.12,0.15,0.25))*0.25*(0.6 + 0.4*u_mlight), u_night);
  vec3 hazeD = mix(mix(vec3(173.0,198.0,226.0)/255.0, vec3(0.08,0.08,0.14), edk), vec3(24.0,30.0,52.0)/255.0*(0.7 + 0.3*u_mlight), u_night);
  if (mo.x > 0.0) {
    vec3 pos = ro + rd*mo.x; vec3 n = calcNormal(pos);
    float id = mo.y; vec3 alb;
    if (id < 2.5) { float k = floor((id-2.0)*100.0+0.5); alb = k < 0.5 ? vec3(0.85,0.35,0.3) : k < 1.5 ? vec3(0.3,0.6,0.75) : vec3(0.95,0.8,0.35); if (fract(pos.y*1.4) < 0.12) alb *= 0.8; }
    else if (id < 3.5) alb = vec3(0.92,0.9,0.86);
    else if (id < 4.5) alb = vec3(0.45,0.34,0.24);
    else if (id < 5.5) alb = vec3(0.25,0.5,0.22);
    else if (id < 6.9) { float k = floor((id-6.0)*100.0+0.5); alb = k < 0.5 ? vec3(0.9,0.25,0.25) : k < 1.5 ? vec3(0.95,0.85,0.3) : vec3(0.25,0.55,0.85); }
    else { float k = floor((id-7.0)*100.0+0.5);
      alb = k < 0.5 ? vec3(0.91,0.86,0.76) : k < 1.5 ? vec3(0.85,0.55,0.45) : k < 2.5 ? vec3(0.62,0.74,0.82) : vec3(0.8,0.78,0.62);
      float wy = fract(pos.y*0.7), wz = fract((pos.z + pos.x)*0.9);
      float win = step(0.35, wy)*step(wy, 0.75)*step(0.3, wz)*step(wz, 0.7)*step(abs(n.y), 0.5);
      alb = mix(alb, mix(vec3(0.18,0.22,0.3), vec3(1.0,0.82,0.45), u_night*0.85), win*0.85); }
    vec3 c = shade(pos, n, rd, lin(alb), L, key, skyF, skyF, 0.1);
    col = grade(c, lin(hazeD), mo.x, 30.0, 0.5, 0.02);
  } else if (hit > 0.0) {
    vec3 pos = ro + rd*hit;
    if (kind < 0.5) {
      float wetLine = smoothstep(0.25, 0.0, pos.y - u_level);
      vec3 sand = mix(vec3(0.86,0.78,0.6), vec3(0.78,0.7,0.52), noise2(pos.xz*2.0));
      sand = mix(sand, vec3(0.55,0.5,0.4), wetLine*0.8);
      float oldTide = u_wet*smoothstep(0.12, 0.0, abs(pos.y - 0.9 - u_level + 0.2))*0.7;
      sand = mix(sand, vec3(0.45,0.4,0.33), oldTide);
      vec3 n = vec3(0.0, 1.0, 0.0);
      vec3 c = lin(sand)*(key*clamp(dot(n, L), 0.0, 1.0)*1.0 + skyF*1.2);
      col = grade(c, lin(hazeD), hit, 40.0, 0.5, 0.02);
    } else {
      vec2 e = vec2(0.2, 0.0);
      vec3 n = normalize(vec3(seaH(pos.xz - e.xy) - seaH(pos.xz + e.xy), 0.4, seaH(pos.xz - e.yx) - seaH(pos.xz + e.yx)));
      n = normalize(n + vec3(noise2(pos.xz*1.5 + gT) - 0.5, 0.0, noise2(pos.xz*1.7 - gT) - 0.5)*0.25);
      vec3 deep = mix(vec3(0.12,0.38,0.52), vec3(0.03,0.06,0.12), u_night);
      vec3 rf = reflect(rd, n);
      vec3 c = mix(lin(deep), lin(skyN(rf)), 0.25 + 0.5*pow(1.0 - max(dot(n, -rd), 0.0), 3.0));
      c += key*pow(max(dot(rf, L), 0.0), 60.0)*1.5;
      float rel = (pos.y - u_level)/max(1.0, 17.0*u_surge);
      float face = smoothstep(0.08, 0.3, rel)*u_surge;
      c = mix(c, lin(mix(vec3(0.05,0.3,0.36), vec3(0.2,0.55,0.55), smoothstep(0.2, 0.85, rel))), face*0.85);
      float foam = smoothstep(0.78, 0.97, rel + 0.08*noise2(pos.xz*2.0 + gT)) * step(0.05, u_surge);
      foam += smoothstep(0.25, 0.0, rel)*smoothstep(0.02, 0.1, rel)*u_surge*0.6*noise2(pos.xz*3.0 + gT*2.0);
      float shore = smoothstep(0.35, 0.0, abs(pos.y - groundH(pos.xz)))*0.6;
      c = mix(c, lin(vec3(0.93,0.95,0.97))*(key*0.6 + skyF*1.5), clamp(foam + shore*(1.0 - u_night*0.6), 0.0, 1.0));
      col = grade(c, lin(hazeD), hit, 90.0, 0.35, 0.02);
    }
  }
  return vec4(col, 1.0);
}
