// Mega-tsunami at a city beach (units: metres). Shoreline at z=0 bending out to sea on the left (a city headland, -x).
// Sea toward -z. Free camera.
// params: cx cy cz (camera pos), yaw (+ turns left toward -x), tilt (pitch rad, + up), lens (0 = 1.15), shake,
//         level (sea level m; negative = drawback, seabed exposed), wh (wave height m), wz (crest z m, negative = offshore),
//         fish (0..1 stranded fish), dark (0..1 storm light), boat (0/1 stranded boat), spray (0..1 mist over the crest)
float gT = 0.0;
const vec3 TW = vec3(-180.0, 0.0, -298.0);   // the 30-storey tower (90 m) on the headland
float bend(float x){ return 2.2*max(0.0, -x - 25.0) - 0.25*max(0.0, x - 60.0); }
float groundH(vec2 xz){
  float z = xz.y + bend(xz.x);
  float h = 0.035*z;
  h = z > 40.0 ? 1.4 + 0.01*(z - 40.0) : h;
  h += 0.1*noise2(xz*0.07) + 0.04*noise2(xz*0.5);
  h += z < 0.0 ? 0.035*sin(xz.y*1.3 + 0.8*sin(xz.x*0.21)) : 0.0;
  return h;
}
float waveW(vec2 xz, out float rel){
  float H = u_wh*(0.92 + 0.08*noise2(vec2(xz.x*0.015, 3.0)));
  float wzl = u_wz + 0.08*u_wh*sin(xz.x*0.009 + 1.0) + 0.04*u_wh*noise2(vec2(xz.x*0.025, 1.0));
  float dz = xz.y - wzl;
  float w = dz > 0.0 ? exp(-pow(dz/(0.22*H + 3.0), 2.0)) : 0.6 + 0.4*exp(-pow(dz/(1.3*H + 20.0), 2.0));
  rel = w;
  return H*w;
}
float seaH(vec2 xz){
  float calm = 1.0 - 0.7*smoothstep(-1.0, -5.0, u_level);
  float sw = (0.14*sin(xz.y*0.33 + gT*1.3) + 0.09*sin(xz.x*0.21 + xz.y*0.1 + gT*0.9) + 0.07*noise2(xz*0.25 + gT*0.3))*calm;
  float h = u_level + sw;
  if (u_wh > 0.0) { float r; float w = waveW(xz, r); h += w + 0.012*w*noise2(vec2(xz.x*0.09, xz.y*0.06 - gT*0.6)); }
  return h;
}
vec2 map(vec3 p){
  vec2 r = vec2(1e9, 0.0);
  // hero tower: 30 storeys x 3 m
  vec3 q = p - TW;
  float tw = sdRoundBox(q - vec3(0.0, 44.0, 0.0), vec3(13.0, 46.0, 11.0), 0.3);
  tw = min(tw, sdRoundBox(q - vec3(0.0, 92.5, 0.0), vec3(8.0, 2.5, 6.0), 0.2));
  tw = min(tw, sdCapsule(q, vec3(6.0, 94.0, 7.0), vec3(6.0, 104.0, 7.0), 0.35));
  r = opU(r, vec2(tw, 2.0));
  // headland city blocks along the bent shoreline
  float bb = max(max(p.x + 30.0, -900.0 - p.x), p.y - 70.0);
  if (bb > 2.0) r = opU(r, vec2(bb, 0.0));
  else {
    float cs = 38.0;
    float cx = floor(p.x/cs);
    for (int k = 0; k < 2; k++) {
      float c = cx + float(k) - 0.5;
      float xc = (c + 0.5)*cs;
      float zs = -bend(xc + 16.0);
      float hh = hash2(vec2(c, 7.0));
      for (int row = 0; row < 2; row++) {
        float fr = float(row);
        float ht = (row == 0 ? 14.0 + 26.0*hh*hh : 20.0 + 28.0*hash2(vec2(c, 11.0)));
        vec3 bp = vec3(xc, ht*0.5, zs + 16.0 + 40.0*fr + 6.0*hash2(vec2(c, 3.0 + fr)));
        if (abs(xc - TW.x) < 50.0) continue;
        float d = sdRoundBox(p - bp, vec3(12.0 + 3.0*hash2(vec2(c, 5.0)), ht*0.5, 11.0), 0.2);
        r = opU(r, vec2(d, 3.0 + 0.1*fr + 0.01*floor(hh*5.0)));
      }
    }
  }
  // stranded fishing boat on the seabed
  if (u_boat > 0.5) {
    vec3 b = p - vec3(10.0, -1.75, -55.0);
    b.xz = rot(0.5)*b.xz; b.xy = rot(0.22)*b.xy;
    float hull = max(sdEllipsoid(b, vec3(2.0, 1.3, 6.0)), b.y - 0.35);
    float cab = sdRoundBox(b - vec3(0.0, 1.0, 1.2), vec3(1.0, 0.75, 1.3), 0.1);
    r = opU(r, vec2(hull, 5.0));
    r = opU(r, vec2(cab, 6.0));
  }
  return r;
}
vec3 skyM(vec3 rd){
  vec3 hor = mix(vec3(178.0,202.0,226.0)/255.0, vec3(120.0,128.0,138.0)/255.0, u_dark);
  vec3 top = mix(vec3(70.0,108.0,158.0)/255.0, vec3(52.0,58.0,70.0)/255.0, u_dark);
  float e = pow(clamp(rd.y, 0.0, 1.0), 0.55);
  vec3 c = mix(hor, top, e);
  vec2 cp = rd.xz/(rd.y + 0.07)*2.0;
  float cl = smoothstep(0.5, 0.85, noise2(cp*1.2 + vec2(gT*0.02, 0.0))*0.65 + noise2(cp*3.0)*0.35);
  c = mix(c, mix(vec3(0.95,0.96,0.98), vec3(0.55,0.57,0.6), u_dark), cl*0.55*smoothstep(0.02, 0.2, rd.y));
  return c;
}
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  vec2 jit = u_shake*vec2(noise2(vec2(u_time*23.0, 1.0)) - 0.5, noise2(vec2(u_time*19.0, 7.0)) - 0.5);
  vec3 ro = vec3(u_cx, u_cy, u_cz);
  float yaw = u_yaw + jit.x*0.05, pit = u_tilt + jit.y*0.05;
  vec3 fw = vec3(-sin(yaw)*cos(pit), sin(pit), -cos(yaw)*cos(pit));
  float lens = u_lens > 0.0 ? u_lens : 1.15;
  vec3 rd = camRay(p, ro, ro + fw, lens);
  vec3 col = skyM(rd);
  // heightfield: ground / sea
  float t = 0.4, hit = -1.0, tp = 0.0;
  float maxH = max(2.5, u_level + u_wh*1.15 + 2.5);
  for (int i = 0; i < 170; i++) {
    vec3 q = ro + rd*t;
    if (q.y < max(groundH(q.xz), seaH(q.xz))) { hit = t; break; }
    if (q.y > maxH && rd.y > 0.0) break;
    tp = t; t += 0.25 + t*0.033;
    if (t > 4500.0) break;
  }
  float kind = 0.0;
  if (hit > 0.0) {
    float a = tp, b = hit;
    for (int i = 0; i < 8; i++) { float m = 0.5*(a + b); vec3 q = ro + rd*m; if (q.y < max(groundH(q.xz), seaH(q.xz))) b = m; else a = m; }
    hit = b; vec3 q = ro + rd*b; kind = seaH(q.xz) > groundH(q.xz) ? 1.0 : 0.0;
  }
  vec3 mo = march(ro, rd, hit > 0.0 ? hit : 2500.0, 0.0);
  vec3 L = normalize(vec3(-0.35, 0.62, 0.7));
  vec3 key = mix(vec3(1.3, 1.17, 1.0), vec3(0.55, 0.57, 0.62), u_dark);
  vec3 skyF = mix(lin(vec3(0.6, 0.72, 0.88))*0.6, lin(vec3(0.45, 0.48, 0.52))*0.55, u_dark);
  vec3 hazeD = mix(vec3(178.0,202.0,226.0)/255.0, vec3(120.0,128.0,138.0)/255.0, u_dark);
  if (mo.x > 0.0) {
    vec3 pos = ro + rd*mo.x; vec3 n = calcNormal(pos);
    float id = mo.y; vec3 alb;
    if (id < 2.5) {
      alb = vec3(0.86, 0.88, 0.9);
      float fl = fract(pos.y/3.0);
      float glass = step(0.28, fl)*step(abs(n.y), 0.5);
      alb = mix(alb, vec3(0.22, 0.36, 0.5), glass*0.85);
      if (pos.y > 89.5) alb = vec3(0.8);
    } else if (id < 4.5) {
      float k = fract(id*10.0);
      alb = k < 0.25 ? vec3(0.84, 0.8, 0.72) : k < 0.5 ? vec3(0.72, 0.76, 0.8) : k < 0.75 ? vec3(0.9, 0.86, 0.8) : vec3(0.78, 0.66, 0.56);
      float u = abs(n.x) > 0.5 ? pos.z : pos.x;
      float win = step(0.45, fract(pos.y/3.2))*step(0.35, fract(u*0.32))*step(abs(n.y), 0.5);
      alb = mix(alb, vec3(0.2, 0.28, 0.36), win*0.7);
    } else if (id < 5.5) {
      alb = fract(pos.y*1.2 + 0.3) < 0.2 ? vec3(0.75, 0.18, 0.15) : vec3(0.92, 0.92, 0.9);
    } else alb = vec3(0.3, 0.45, 0.6);
    vec3 c = shade(pos, n, rd, lin(alb), L, key, skyF, skyF*0.6, 0.2);
    col = grade(c, lin(hazeD), mo.x, 150.0, 0.06, 0.02);
  } else if (hit > 0.0) {
    vec3 pos = ro + rd*hit;
    if (kind < 0.5) {
      float g0 = groundH(pos.xz);
      float wet = smoothstep(0.6, -0.1, g0);               // below old sea level = seabed
      vec3 sand = mix(vec3(0.88, 0.8, 0.62), vec3(0.8, 0.72, 0.54), noise2(pos.xz*1.7));
      vec3 bed = mix(vec3(0.5, 0.43, 0.32), vec3(0.36, 0.32, 0.25), noise2(pos.xz*0.6))*(0.85 + 0.3*noise2(pos.xz*3.0));
      float weed = smoothstep(0.7, 0.8, noise2(pos.xz*0.3 + 4.0))*wet;
      bed = mix(bed, vec3(0.2, 0.26, 0.14), weed*0.6);
      float rock = smoothstep(0.74, 0.8, noise2(pos.xz*0.9 + 9.0))*wet;
      bed = mix(bed, vec3(0.3, 0.28, 0.25), rock*0.8);
      vec3 alb = mix(sand, bed, wet);
      vec2 e = vec2(0.15, 0.0);
      vec3 n = normalize(vec3(groundH(pos.xz - e.xy) - groundH(pos.xz + e.xy), 0.3, groundH(pos.xz - e.yx) - groundH(pos.xz + e.yx)));
      vec3 c = lin(alb)*(key*clamp(dot(n, L), 0.0, 1.0) + skyF*1.1);
      // glossy wet seabed + puddles reflecting the sky
      float pud = smoothstep(0.8, 0.84, noise2(pos.xz*0.3 + 7.3))*wet*(1.0 - rock);
      float fr = 0.04 + 0.96*pow(1.0 - clamp(-rd.y, 0.0, 1.0), 5.0);
      float rip = sin(dot(pos.xz, vec2(0.35, 1.0))*4.5 + 2.5*noise2(pos.xz*0.4));
      c *= 1.0 + wet*(0.12*rip + 0.1*(noise2(pos.xz*6.0) - 0.5));
      c = mix(c, lin(skyM(reflect(rd, vec3(0.0, 1.0, 0.0)))), clamp(pud*0.7 + wet*fr*0.12, 0.0, 1.0));
      c += key*pow(max(dot(reflect(rd, n), L), 0.0), 40.0)*wet*0.3;
      // stranded fish: small silver slivers that flash as they flap
      if (u_fish > 0.0) {
        vec2 fc = floor(pos.xz/1.3); vec2 ff = fract(pos.xz/1.3) - 0.5;
        float hs = hash2(fc + 31.0);
        if (hs > 0.45) {
          float an = hash2(fc + 5.0)*6.283 + 0.4*sin(gT*(9.0 + 6.0*hs) + hs*30.0);
          vec2 o = (vec2(hash2(fc + 1.0), hash2(fc + 2.0)) - 0.5)*0.6;
          vec2 fq = rot(an)*(ff - o)*1.3;
          float bd = length(fq/vec2(0.21, 0.06));
          float tl = step(-0.33, fq.x)*step(fq.x, -0.17)*step(abs(fq.y), (-0.15 - fq.x)*0.75);
          float fm = clamp(smoothstep(1.0, 0.8, bd) + tl, 0.0, 1.0)*wet*u_fish*step(g0, -0.3);
          float sh = smoothstep(1.6, 0.9, bd)*wet*u_fish*step(g0, -0.3);
          c *= 1.0 - 0.35*sh;
          float glint = 0.65 + 1.1*pow(max(sin(gT*(11.0 + 5.0*hs) + hs*40.0), 0.0), 6.0);
          vec3 fcl = mix(vec3(0.85, 0.88, 0.92), vec3(0.3, 0.38, 0.45), smoothstep(-0.01, 0.045, fq.y));
          c = mix(c, lin(fcl)*(key*0.75 + skyF)*glint, fm);
        }
      }
      col = grade(c, lin(hazeD), hit, 120.0, 0.03, 0.02);
    } else {
      vec2 e = vec2(0.6, 0.0);
      vec3 n = normalize(vec3(seaH(pos.xz - e.xy) - seaH(pos.xz + e.xy), 1.2, seaH(pos.xz - e.yx) - seaH(pos.xz + e.yx)));
      n = normalize(n + vec3(noise2(pos.xz*0.9 + gT) - 0.5, 0.0, noise2(pos.xz*1.1 - gT) - 0.5)*0.2);
      float rel = 0.0; float ww = u_wh > 0.0 ? waveW(pos.xz, rel) : 0.0;
      float hrel = u_wh > 0.0 ? clamp((pos.y - u_level)/u_wh, 0.0, 1.2) : 0.0;
      vec3 deep = mix(vec3(0.1, 0.36, 0.5), vec3(0.08, 0.2, 0.25), u_dark);
      vec3 rf = reflect(rd, n);
      float fres = 0.04 + 0.96*pow(1.0 - max(dot(n, -rd), 0.0), 5.0);
      vec3 c = mix(lin(deep)*(0.5 + 0.5*key), lin(skyM(rf)), clamp(0.15 + fres*0.8, 0.0, 1.0));
      c += key*pow(max(dot(rf, L), 0.0), 80.0)*1.2;
      // the wall: dark green-blue face, glassy translucent near the crest, foam streaks
      float face = smoothstep(0.06, 0.2, hrel)*step(0.5, u_wh);
      vec3 fcol = mix(vec3(0.02, 0.1, 0.13), vec3(0.06, 0.26, 0.29), smoothstep(0.1, 0.5, hrel));
      fcol = mix(fcol, vec3(0.16, 0.5, 0.48), smoothstep(0.55, 0.9, hrel)*0.85);
      fcol *= 0.9 + 0.2*noise2(vec2(pos.x*0.04, pos.y*0.3 - gT*0.8));
      float streak = smoothstep(0.6, 0.95, noise2(vec2(pos.x*0.35, pos.y*0.02 - gT*0.35)))*smoothstep(0.2, 0.7, hrel);
      vec3 fc2 = lin(fcol)*(0.55 + 0.6*clamp(dot(n, L), 0.0, 1.0)) + lin(skyM(rf))*fres*0.4;
      fc2 = mix(fc2, lin(vec3(0.8, 0.86, 0.88))*(key*0.5 + skyF), streak*0.35);
      c = mix(c, fc2, face);
      float fn = noise2(vec2(pos.x*0.07, pos.y*0.04 + gT*1.2))*0.6 + noise2(vec2(pos.x*0.25, pos.y*0.15 + gT*2.0))*0.4;
      float foam = smoothstep(0.86, 0.95, hrel + 0.16*(fn - 0.5))*step(0.5, u_wh);
      foam += smoothstep(0.62, 0.8, fn)*smoothstep(0.55, 0.85, hrel)*0.6*step(0.5, u_wh);
      // churning foot where the wall meets the drawn-down water / ground
      float foot = smoothstep(0.12, 0.0, hrel)*smoothstep(0.02, 0.2, rel)*step(0.5, u_wh)*(0.5 + 0.5*noise2(pos.xz*0.3 + gT*2.0));
      float shore = smoothstep(0.3, 0.0, abs(pos.y - groundH(pos.xz)))*0.55;
      c = mix(c, lin(vec3(0.94, 0.96, 0.97))*(key*0.65 + skyF*1.4), clamp(foam + foot + shore, 0.0, 1.0));
      col = grade(c, lin(hazeD), hit, 350.0, 0.03, 0.02);
    }
  }
  // spray / mist blowing off the crest
  if (u_wh > 0.5 && u_spray > 0.0 && abs(rd.z) > 0.01) {
    float tc = (u_wz - ro.z)/rd.z;
    float tSurf = mo.x > 0.0 ? mo.x : (hit > 0.0 ? hit : 1e9);
    if (tc > 0.0 && tc < tSurf + 40.0) {
      vec3 cp = ro + rd*tc;
      float top = u_level + u_wh*0.95;
      float above = cp.y - top;
      float m = exp(-max(above, 0.0)/(0.18*u_wh))*smoothstep(-0.12*u_wh, 0.03*u_wh, above);
      m *= 0.55 + 0.45*noise2(vec2(cp.x*0.05 - gT*0.4, cp.y*0.06 - gT*0.8));
      col = mix(col, vec3(0.9, 0.93, 0.95)*mix(1.0, 0.7, u_dark), clamp(m*u_spray*0.75, 0.0, 1.0));
    }
  }
  return vec4(col, 1.0);
}
