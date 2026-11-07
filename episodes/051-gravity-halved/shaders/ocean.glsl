// ocean.glsl — Episode 051 (Gravity Part 5). "Lowpoly Skyline" look at sea: a faceted low-poly storm sea, a striped lighthouse
// on a rock (28 m tall, for scale) and a small boat riding the swell.
// Physics: a fully developed sea scales as Hs ~ 0.21 U^2/g (Pierson-Moskowitz) and wavelength ~ U^2/g, so at half g the same wind
// builds waves twice as tall AND twice as long, travelling at the same speed (c = sqrt(g L / 2pi) unchanged when g/2, L*2).
// The whole wave field is therefore the 1 g sea scaled by S (S = 1 today -> S = 2 at half g) with unchanged phase speeds.
// Params: cx,cy,cz / tx,ty,tz camera position / look-at, S wave-field scale (1..2), shake, dark (storm tint 0..1)
float gT = 0.0, gS = 1.0;
vec3 gBoat = vec3(0.0); vec2 gBoatG = vec2(0.0);
float F(vec2 x){ // today's sea (S = 1), metres. Each wave moves at its 1 g deep-water speed c = sqrt(9.81 L / 2pi)
  float h = 0.0;
  vec4 Ls = vec4(62.0, 37.0, 23.0, 13.0), As = vec4(2.6, 1.3, 0.7, 0.3);
  vec2 d0 = normalize(vec2(0.25, 1.0)), d1 = normalize(vec2(-0.6, 1.0)), d2 = normalize(vec2(0.9, 1.0)), d3 = normalize(vec2(-1.0, 0.4));
  for (int i = 0; i < 4; i++) {
    float L = Ls[i], A = As[i];
    vec2 d = i==0 ? d0 : i==1 ? d1 : i==2 ? d2 : d3;
    float k = 6.2832/L, c = sqrt(9.81*L/6.2832);
    float ph = k*(dot(d, x) - c*gT) + float(i)*1.7;
    float s = 0.5 + 0.5*sin(ph);
    h += A*(2.0*pow(s, 1.7) - 0.8);      // sharper crests, flatter troughs
  }
  return h;
}
float Hs(vec2 x){ return gS*F(x/gS); }
// faceted (triangulated) height field: sample at triangle-grid vertices, interpolate linearly inside each triangle
const float CELL = 3.2;
float Hf(vec2 x, out vec3 nrm){
  float c = CELL*gS;
  vec2 g = x/c; vec2 i = floor(g), f = fract(g);
  vec2 a, b, e; vec2 off = (f.x > f.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  a = i; b = i + off; e = i + vec2(1.0);
  float ha = Hs(a*c), hb = Hs(b*c), he = Hs(e*c);
  vec3 A = vec3(a.x*c, ha, a.y*c), B = vec3(b.x*c, hb, b.y*c), E = vec3(e.x*c, he, e.y*c);
  nrm = normalize(cross(E - A, B - A)); if (nrm.y < 0.0) nrm = -nrm;
  // plane through A with normal nrm
  return A.y - (nrm.x*(x.x - A.x) + nrm.z*(x.y - A.z))/nrm.y;
}
float hOnly(vec2 x){ vec3 n; return Hf(x, n); }
vec2 map(vec3 p){
  vec2 r = vec2(1e9, 0.0);
  // rock + lighthouse at (16, -46)
  vec3 q = p - vec3(16.0, 0.0, -46.0);
  float rock = sdEllipsoid(q - vec3(0.0, -2.0, 0.0), vec3(12.0, 9.0, 10.0));
  rock += 0.9*sin(q.x*0.7)*sin(q.z*0.6+1.0);
  r = opU(r, vec2(rock*0.7, 1.0));
  float tw = max(sdCylinder(q - vec3(0.0, 17.0, 0.0), 11.0, 2.4 - 0.05*(q.y-6.0)), -1e9);
  r = opU(r, vec2(tw, 2.0));
  r = opU(r, vec2(sdCylinder(q - vec3(0.0, 29.5, 0.0), 1.6, 1.9), 3.0));
  r = opU(r, vec2(sdCylinder(q - vec3(0.0, 31.6, 0.0), 0.5, 2.3), 4.0));
  r = opU(r, vec2(sdSphere(q - vec3(0.0, 32.2, 0.0), 1.9)*1.0, 4.0));
  // boat riding the swell
  vec3 b = p - gBoat;
  b.xy = rot(-gBoatG.x*0.8)*b.xy; b.zy = rot(-gBoatG.y*0.8)*b.zy;
  b.xz = rot(0.5)*b.xz;
  float hull = sdRoundBox(b - vec3(0.0, 0.5, 0.0), vec3(4.2, 0.8, 1.5), 0.5);
  hull = max(hull, -(b.y - 1.6));
  r = opU(r, vec2(hull, 5.0));
  r = opU(r, vec2(sdRoundBox(b - vec3(-1.0, 2.2, 0.0), vec3(1.3, 0.9, 1.1), 0.15), 6.0));
  r = opU(r, vec2(sdCapsule(b, vec3(1.0, 1.5, 0.0), vec3(1.0, 6.0, 0.0), 0.12), 4.0));
  return r;
}
vec3 skyCol(vec3 rd){
  vec3 hor = mix(vec3(198.0,218.0,240.0), vec3(150.0,166.0,186.0), u_dark)/255.0;
  vec3 top = mix(vec3(92.0,148.0,222.0), vec3(70.0,86.0,116.0), u_dark)/255.0;
  float e = clamp(rd.y, 0.0, 1.0);
  vec3 c = mix(hor, top, pow(e, 0.55));
  vec2 cp = rd.xz/(rd.y+0.08)*1.6;
  float n = noise2(cp*1.1 + vec2(gT*0.06, 0.0))*0.65 + noise2(cp*2.7)*0.35;
  float cl = smoothstep(0.45 - 0.1*u_dark, 0.7, n);
  vec3 cc = mix(vec3(0.97,0.98,1.0), vec3(0.62,0.66,0.74), u_dark*smoothstep(0.5, 0.85, n));
  c = mix(c, cc, cl*0.85*smoothstep(0.0, 0.18, rd.y));
  return c;
}
vec4 pixel(vec2 uv){
  gT = u_time; gS = max(u_S, 1.0);
  vec2 bp = vec2(-9.0, -18.0);
  vec3 bn; float bh = Hf(bp, bn);
  gBoat = vec3(bp.x, bh - 0.4, bp.y); gBoatG = vec2(-bn.x, -bn.z)/max(bn.y, 0.3);
  vec2 p = screenP(uv, 0.0);
  vec2 jit = u_shake*vec2(noise2(vec2(u_time*13.0,1.0))-0.5, noise2(vec2(u_time*11.0,7.0))-0.5)*0.1;
  vec3 ro = vec3(u_cx + jit.x, u_cy + jit.y, u_cz);
  vec3 rd = camRay(p, ro, vec3(u_tx, u_ty, u_tz), 1.2);
  vec3 sky = skyCol(rd);
  vec3 col = sky;
  vec3 L = normalize(vec3(-0.5, 0.75, -0.45));
  vec3 key = mix(vec3(1.3,1.2,1.05), vec3(0.95,0.95,1.0), u_dark), skyF = lin(vec3(0.62,0.74,0.9))*0.6, bnc = lin(vec3(0.3,0.4,0.5))*0.45;
  vec3 hazeC = lin(mix(vec3(198.0,218.0,240.0), vec3(150.0,166.0,186.0), u_dark)/255.0);
  // height field march
  float tw = -1.0; vec3 wn = vec3(0.0, 1.0, 0.0);
  {
    float t = 0.5, lastD = 0.0, lastT = 0.0;
    for (int i = 0; i < 140; i++) {
      vec3 q = ro + rd*t;
      float d = q.y - hOnly(q.xz);
      if (d < 0.0) {
        float a = lastT, b = t;
        for (int j = 0; j < 6; j++) { float m = 0.5*(a+b); vec3 qq = ro + rd*m; if (qq.y - hOnly(qq.xz) < 0.0) b = m; else a = m; }
        tw = b; break;
      }
      lastT = t; lastD = d;
      t += max(0.35*d, 0.08 + t*0.004);
      if (t > 420.0) break;
    }
  }
  vec3 m = march(ro, rd, tw > 0.0 ? tw : 200.0, 0.0);
  if (m.x > 0.0) {
    vec3 pos = ro + rd*m.x;
    vec3 n = facet(calcNormal(pos), 2.5);
    vec3 alb = vec3(0.5);
    float id = m.y;
    if (id < 1.5) alb = lin(mix(vec3(104.0,98.0,92.0), vec3(140.0,132.0,120.0), step(0.5, noise2(pos.xz*0.4)))/255.0);
    else if (id < 2.5) alb = lin(mod(floor((pos.y - 6.0)/3.2), 2.0) < 0.5 ? vec3(0.95,0.95,0.93) : vec3(214.0,64.0,54.0)/255.0);
    else if (id < 3.5) alb = lin(vec3(1.0, 0.92, 0.6))*2.0;
    else if (id < 4.5) alb = lin(vec3(48.0,54.0,66.0)/255.0);
    else if (id < 5.5) alb = lin(vec3(230.0, 200.0, 70.0)/255.0);
    else alb = lin(vec3(0.95));
    col = shade(pos, n, rd, alb, L, key, skyF, bnc, 0.1);
    col = grade(col, hazeC, m.x, 60.0, 0.35, 0.02);
  } else if (tw > 0.0) {
    vec3 pos = ro + rd*tw;
    vec3 n; float h = Hf(pos.xz, n);
    float rel = (h/gS + 1.2)/5.0;                      // 0 trough .. 1 crest (in today's units)
    vec3 deep = vec3(28.0, 78.0, 150.0)/255.0, mid = vec3(52.0, 118.0, 190.0)/255.0, crest = vec3(96.0, 170.0, 214.0)/255.0;
    vec3 base = mix(deep, mid, smoothstep(0.1, 0.5, rel));
    base = mix(base, crest, smoothstep(0.55, 0.85, rel));
    base = mix(base, base*vec3(0.78,0.82,0.9), u_dark*0.6);
    vec3 c = lin(base);
    float dif = clamp(dot(n, L), 0.0, 1.0);
    c *= 0.62 + 0.55*dif;
    // foam on facets near crests
    vec2 cid = floor(pos.xz/(CELL*gS));
    float fo = step(0.78, rel + 0.25*(hash2(cid) - 0.5)) ;
    c = mix(c, lin(vec3(0.93,0.96,1.0))*(0.75+0.35*dif), fo*0.9);
    float fr = pow(clamp(1.0 + dot(rd, n), 0.0, 1.0), 4.0);
    c = mix(c, lin(skyCol(reflect(rd, n))), 0.15 + 0.5*fr);
    c += key*pow(clamp(dot(reflect(rd, n), L), 0.0, 1.0), 40.0)*0.35;
    col = grade(c, hazeC, tw, 50.0, 0.45, 0.02);
  }
  // spray streaks
  for (int k = 0; k < 2; k++) {
    float fk = float(k);
    vec2 q = p*(9.0 + 7.0*fk); q.x += u_time*(3.0 + 2.0*fk); q.y += u_time*(0.6);
    vec2 c = floor(q); vec2 f = fract(q) - 0.5;
    if (hash2(c + fk*5.0) > 0.86) {
      float d = length((f - (vec2(hash2(c+1.0), hash2(c+2.0)) - 0.5)*0.6)*vec2(0.5, 2.5));
      col = mix(col, vec3(0.95), smoothstep(0.12, 0.0, d)*0.25*(gS - 0.6));
    }
  }
  return vec4(col, 1.0);
}
