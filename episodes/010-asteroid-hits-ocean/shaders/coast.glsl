// Beach looking out to sea (-z). params: cam, level (sea level m), surge (0..1 giant wave), night (0..1),
// moon, shake, tilt, panx, wet, milky; + meteor (0..1 streak progress), flash (0..1 horizon flash), plume (0..1 steam column height)
float gT = 0.0;
vec2 map(vec3 p){
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
float groundH(vec2 xz){ return 0.9 + 0.055*(xz.y - 8.0) + 0.05*noise2(xz*0.3); }
float seaH(vec2 xz){
  float zc = mix(-140.0 - 760.0*u_big, 4.0, u_surge);
  float A = (17.0+70.0*u_big)*smoothstep(0.0, 0.3, u_surge);
  float dz = xz.y - zc; float crest = A*exp(-pow(dz/((dz < 0.0 ? 13.0 : 7.0)*(1.0 + 3.0*u_big)), 2.0));
  float behind = 0.0;
  return u_level + crest + behind + 0.08*sin(xz.y*0.9 + gT*1.6) + 0.05*sin(xz.x*0.7 + gT*1.1);
}
vec3 skyN(vec3 rd){
  vec3 dh = vec3(173.0,198.0,226.0)/255.0, dt = vec3(78.0,114.0,164.0)/255.0;
  vec3 nh = vec3(28.0,36.0,62.0)/255.0, nt = vec3(6.0,8.0,20.0)/255.0;
  float e = pow(clamp(rd.y, 0.0, 1.0), 0.55);
  vec3 c = mix(mix(dh, dt, e), mix(nh, nt, e), u_night);
  vec2 cp = rd.xz/(rd.y + 0.08)*2.0;
  float cl = smoothstep(0.55, 0.85, noise2(cp*1.3 + vec2(gT*0.02, 0.0))*0.65 + noise2(cp*3.1)*0.35);
  c = mix(c, mix(vec3(0.95,0.96,0.98), vec3(0.16,0.18,0.26), u_night), cl*0.45*smoothstep(0.02, 0.2, rd.y));
  // --- meteor streak
  if (u_meteor > 0.0 && u_meteor < 1.0) {
    vec3 A0 = normalize(vec3(-1.2, 0.9, -0.6)), B0 = normalize(vec3(0.15, 0.02, -1.0));
    vec3 hd = normalize(mix(A0, B0, u_meteor));
    vec3 tl = normalize(mix(A0, B0, max(u_meteor - 0.3, 0.0)));
    vec3 ba = tl - hd; float h = clamp(dot(rd - hd, ba)/dot(ba, ba), 0.0, 1.0);
    float d = length(rd - hd - ba*h);
    c += vec3(1.0, 0.8, 0.55)*smoothstep(0.004*(1.0 - h) + 0.0008, 0.0, d)*(1.0 - h)*1.6;
    c += vec3(1.0, 0.85, 0.6)*exp(-length(rd - hd)/0.006)*1.3;
  }
  // --- plume rising over the horizon + flash
  float az = atan(rd.x, -rd.z) - 0.12;
  float el = rd.y;
  if (u_flash > 0.0) c += vec3(1.0, 0.85, 0.65)*u_flash*exp(-az*az/0.02)*exp(-max(el, 0.0)/0.06)*1.6;
  if (u_plume > 0.0) {
    float H = 0.32*u_plume;
    float yy = clamp(el, 0.0, H);
    float w = 0.022 + 0.03*smoothstep(0.0, H, yy) + 0.09*smoothstep(H*0.68, H, yy)*u_plume;
    vec2 q = vec2(az, el - yy);
    float n = noise2(vec2(az*40.0, el*40.0 - gT*0.6))*0.5 + noise2(vec2(az*110.0, el*110.0))*0.25;
    float dd = length(q) - w + 0.012*n;
    float m = smoothstep(0.004, -0.004, dd)*step(-0.01, el);
    vec3 pc = mix(vec3(0.55, 0.53, 0.52), vec3(0.97, 0.96, 0.95), smoothstep(-0.03, 0.03, az + 0.02*n) * 0.6 + 0.4*smoothstep(0.0, H, el));
    pc = mix(pc, vec3(1.0, 0.55, 0.25), exp(-el/0.02)*0.6);
    c = mix(c, pc, m);
  }
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
    // the Moon
    vec3 md = normalize(vec3(0.1, 0.36, -1.0));
    float cosA = dot(rd, md);
    float disc = smoothstep(0.99955, 0.99965, cosA);
    vec2 mp = vec2(dot(rd, normalize(cross(md, vec3(0,1,0)))), rd.y - md.y);
    float mare = 0.75 + 0.25*noise2(mp*900.0);
    c = mix(c, vec3(0.93,0.92,0.86)*mare, disc*u_moon*u_night);
    c += vec3(0.6,0.65,0.8)*pow(max(cosA, 0.0), 300.0)*0.35*u_moon*u_night;
    c += vec3(0.2,0.25,0.4)*pow(max(cosA, 0.0), 20.0)*0.12*u_moon*u_night;
  }
  return c;
}
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  vec2 jit = u_shake*vec2(noise2(vec2(u_time*23.0,1.0))-0.5, noise2(vec2(u_time*19.0,7.0))-0.5)*0.14;
  vec3 ro = vec3(0.0 + u_panx + jit.x, 2.4 + jit.y, 10.0 - 4.0*u_cam);
  vec3 ta = vec3(u_panx*0.6, 2.2 + u_tilt*8.0, -30.0);
  vec3 rd = camRay(p, ro, ta, 1.15);
  vec3 col = skyN(rd);
  // ground / sea: linear search along the ray
  float t = 0.2, hit = -1.0, kind = 0.0;
  for (int i = 0; i < 110; i++) {
    vec3 q = ro + rd*t;
    float g = groundH(q.xz), s = seaH(q.xz);
    if (q.y < max(g, s)) { hit = t; kind = s > g ? 1.0 : 0.0; break; }
    t += 0.15 + t*0.045;
    if (t > 900.0) break;
  }
  if (hit > 0.0) { // refine
    float a = hit - (0.15 + hit*0.045), b = hit;
    for (int i = 0; i < 6; i++) { float m = 0.5*(a+b); vec3 q = ro + rd*m; if (q.y < max(groundH(q.xz), seaH(q.xz))) b = m; else a = m; }
    hit = b; vec3 q = ro + rd*b; kind = seaH(q.xz) > groundH(q.xz) ? 1.0 : 0.0;
  }
  vec3 mo = march(ro, rd, hit > 0.0 ? hit : 80.0, 0.0);
  vec3 L = normalize(mix(vec3(0.5, 0.8, -0.4), vec3(0.1, 0.36, -1.0), u_night));
  vec3 key = mix(vec3(1.3,1.15,1.0), vec3(0.22,0.24,0.32)*(0.25 + 0.75*u_moon), u_night);
  vec3 skyF = mix(lin(vec3(0.6,0.72,0.88))*0.6, lin(vec3(0.12,0.15,0.25))*0.25, u_night);
  vec3 hazeD = mix(vec3(173.0,198.0,226.0)/255.0, vec3(24.0,30.0,52.0)/255.0, u_night);
  if (mo.x > 0.0) {
    vec3 pos = ro + rd*mo.x; vec3 n = calcNormal(pos);
    float id = mo.y; vec3 alb;
    if (id < 2.5) { float k = floor((id-2.0)*100.0+0.5); alb = k < 0.5 ? vec3(0.85,0.35,0.3) : k < 1.5 ? vec3(0.3,0.6,0.75) : vec3(0.95,0.8,0.35); if (fract(pos.y*1.4) < 0.12) alb *= 0.8; }
    else if (id < 3.5) alb = vec3(0.92,0.9,0.86);
    else if (id < 4.5) alb = vec3(0.45,0.34,0.24);
    else if (id < 5.5) alb = vec3(0.25,0.5,0.22);
    else { float k = floor((id-6.0)*100.0+0.5); alb = k < 0.5 ? vec3(0.9,0.25,0.25) : k < 1.5 ? vec3(0.95,0.85,0.3) : vec3(0.25,0.55,0.85); }
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
      float rel = (pos.y - u_level)/max(1.0, (17.0+70.0*u_big)*u_surge);
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
