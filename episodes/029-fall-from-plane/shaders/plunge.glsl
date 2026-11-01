// plunge (ep 029, adapted from 025 stratos): falling from an airliner at cruise altitude.
// extra params: pl (airliner on), plx/ply/pld (airliner position in camera space, m), ppit/pyaw/proll (orientation),
//   brk (0 = whole airliner, 1 = broken tail section only), trail (contrails), cloud (fly-through cloud 0..1),
//   blk (blackout / tunnel vision 0..1), snow (snowy wooded ground 0..1), red (hypoxia tint).
// stratos: high-altitude jump. Curved Earth below (exaggerated radius), black sky, thin blue limb,
// tiny suited jumper in front of the camera (camera space, metres), optional capsule door, chute, mach ring, speed streaks.
// params: alt (km), rad (planet radius km, exaggerated), pitch, roll, lens, fish (barrel), shake,
//         man, mx, my, md (figure position in camera space, m), pose (0 standing .. 1 spread), froll, ftilt, fyaw,
//         cap (capsule door 0..1), chute (0..1), mach (ring progress 0..1, 0 = off), streak (0..1), frost
float h3(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float n3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm3(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*n3(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=0.5; } return s; }
vec3 stars(vec3 rd){
  vec2 q = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*120.0;
  vec2 c = floor(q); vec2 f = fract(q)-0.5;
  float h = hash2(c);
  float s = h > 0.985 ? smoothstep(0.25,0.0,length(f))*(0.4+0.6*hash2(c+3.0)) : 0.0;
  return vec3(s);
}
vec3 FP = vec3(0.0, 0.0, -4.0);
float gPose = 1.0;
mat2 gR1, gR2, gR3;
vec3 figQ(vec3 p){
  vec3 q = p - FP;
  q.xy = gR1*q.xy; q.yz = gR2*q.yz; q.xz = gR3*q.xz;
  return q;
}
vec2 figure(vec3 q){
  float k = gPose;
  // torso + helmet + container
  float torso = sdCapsule(q, vec3(0.0,-0.22,0.0), vec3(0.0,0.28,0.0), 0.2);
  float helm = sdSphere(q-vec3(0.0,0.58,-0.01), 0.135);
  float neck = sdCapsule(q, vec3(0.0,0.3,0.0), vec3(0.0,0.5,0.0), 0.11);
  float pack = sdRoundBox(q-vec3(0.0,0.06,0.2), vec3(0.15,0.24,0.07), 0.05);
  float chestbox = sdRoundBox(q-vec3(0.0,0.12,-0.2), vec3(0.12,0.08,0.05), 0.03);
  // arms: standing -> along the sides; spread -> out and up (freefall box position)
  vec3 aDir = normalize(mix(vec3(0.25,-1.0,0.05), vec3(0.95,0.55,0.15), k));
  vec3 fDir = normalize(mix(vec3(0.1,-1.0,-0.15), vec3(0.35,1.0,0.2), k));
  vec3 qa = q; qa.x = abs(qa.x);
  vec3 sh = vec3(0.22,0.34,0.0), el = sh + aDir*0.3, wr = el + fDir*0.28;
  float arm = min(sdCapsule(qa, sh, el, 0.085), sdCapsule(qa, el, wr, 0.075));
  float glove = sdSphere(qa-wr, 0.075);
  // legs: standing -> straight down; spread -> apart, knees bent back (arched)
  vec3 lDir = normalize(mix(vec3(0.06,-1.0,0.0), vec3(0.42,-1.0,0.12), k));
  vec3 sDir = normalize(mix(vec3(0.0,-1.0,0.0), vec3(0.2,-0.75,0.55), k));
  vec3 hip = vec3(0.11,-0.3,0.0), kn = hip + lDir*0.44, ft = kn + sDir*0.42;
  float leg = min(sdCapsule(qa, hip, kn, 0.1), sdCapsule(qa, kn, ft, 0.085));
  float boot = sdEllipsoid(qa-ft-vec3(0.0,-0.02,-0.06), vec3(0.08,0.07,0.13));
  float suit = smin(smin(torso, neck, 0.06), min(arm, leg), 0.06);
  vec2 r = vec2(suit, 1.0);
  r = opU(r, vec2(helm, 2.0));
  // no parachute pack: a passenger, not a skydiver
  r = opU(r, vec2(min(glove, boot), 4.0));
  return r;
}
float gObj = 0.0;
vec3 PC = vec3(0.0, 0.0, -120.0);
mat2 gP1, gP2, gP3;
vec3 planeQ(vec3 p){
  vec3 q = p - PC;
  q.yz = gP1*q.yz; q.xz = gP2*q.xz; q.xy = gP3*q.xy;
  return q;
}
vec2 airliner(vec3 q){
  // ~42 m long airliner, built at 1/3 scale (same proportions as engine sky.glsl)
  q /= 3.0;
  float brk = u_brk;
  float fx0 = mix(6.5, -1.6, brk);
  float fus = sdCapsule(q, vec3(-6.0,0.0,0.0), vec3(fx0,0.0,0.0), 0.75);
  if (brk > 0.5) { // jagged torn end
    float j = 0.25*sin(q.y*9.0)*sin(q.z*7.0);
    fus = max(fus, q.x - (fx0 + 0.4 + j));
  }
  float tail = sdRoundBox(q-vec3(-5.6,1.3,0.0), vec3(0.8,1.3,0.08), 0.05);
  float stab = sdRoundBox(q-vec3(-5.7,0.2,0.0), vec3(0.6,0.06,2.6), 0.04);
  vec2 r = vec2(fus, 11.0);
  if (brk < 0.5) {
    float nose = sdEllipsoid(q-vec3(6.6,-0.05,0.0), vec3(1.4,0.7,0.72));
    vec3 qw = q; qw.z = abs(qw.z);
    float wing = sdRoundBox(qw-vec3(0.3-0.25*qw.z,-0.3,3.8), vec3(1.0,0.07,3.8), 0.05);
    float eng = sdCapsule(qw, vec3(0.3,-0.9,2.6), vec3(2.0,-0.9,2.6), 0.42);
    r.x = smin(fus, nose, 0.3);
    r = opU(r, vec2(wing, 12.0));
    r = opU(r, vec2(eng, 13.0));
  }
  r = opU(r, vec2(min(stab, tail), 12.0));
  r.x *= 3.0;
  return r;
}
vec2 map(vec3 p){
  vec2 r = vec2(1e5, 0.0);
  if (gObj > 0.5) return airliner(planeQ(p));
  if (u_man > 0.5) {
    vec3 q = figQ(p);
    r = figure(q);
    if (u_cap > 0.01) {
      float step0 = sdRoundBox(q-vec3(0.0,-1.24,-0.1), vec3(0.75,0.035,0.55), 0.02);
      r = opU(r, vec2(step0, 5.0));
    }
    if (u_chute > 0.01) {
      vec3 c = q - vec3(0.0, 4.3 - 0.6*(1.0-u_chute), 0.0);
      c.y -= -0.14*c.x*c.x;
      vec3 sz = vec3(mix(0.4,2.7,u_chute), 0.22, mix(0.3,1.0,u_chute));
      float can = sdRoundBox(c, sz, 0.12);
      r = opU(r, vec2(can, 6.0));
      vec3 qa = q; qa.x = abs(qa.x); qa.z = abs(qa.z);
      float w = mix(0.3,2.3,u_chute);
      float ln = min(sdCapsule(qa, vec3(0.2,0.4,0.0), vec3(w,3.7,0.75), 0.012), sdCapsule(qa, vec3(0.2,0.4,0.0), vec3(w*0.4,3.95,0.75), 0.012));
      r = opU(r, vec2(ln, 7.0));
    }
  }
  return r;
}
vec3 skyEarth(vec3 rd, vec3 ro, float R, out float hitG){
  vec3 C = vec3(0.0, -R, 0.0);
  vec3 oc = ro - C;
  float b = dot(oc, rd), c = dot(oc, oc) - R*R, disc = b*b - c;
  float alt = ro.y;
  vec3 L = normalize(vec3(-0.55, 0.32, -0.75));
  float dark = smoothstep(9.0, 32.0, alt);
  vec3 col;
  hitG = 0.0;
  if (disc > 0.0 && -b - sqrt(disc) > 0.0) {
    hitG = 1.0;
    float t = -b - sqrt(disc);
    vec3 pos = ro + rd*t;
    vec3 n = normalize(pos - C);
    vec2 g = pos.xz + vec2(37.0, 11.0);
    float big = fbm3(vec3(g/110.0, 1.3));
    float mid = fbm3(vec3(g/16.0, 4.1));
    float det = n3(vec3(g*0.9, 2.0))*0.6 + fbm3(vec3(g/2.5, 5.0))*0.8 - 0.3;
    vec3 sand = vec3(0.66,0.53,0.38), rock = vec3(0.40,0.31,0.24), scrub = vec3(0.42,0.44,0.30), salt = vec3(0.86,0.84,0.78);
    vec3 alb = mix(sand, rock, smoothstep(0.45,0.65,big*0.7+mid*0.3));
    alb = mix(alb, scrub, smoothstep(0.55,0.7,mid)*0.6);
    alb = mix(alb, salt, smoothstep(0.78,0.82,big+0.1*det)*0.7);
    alb *= 0.75 + 0.5*det;
    float riv = smoothstep(0.03, 0.0, abs(n3(vec3(g/7.0, 11.0)) - 0.5));
    alb = mix(alb, vec3(0.30,0.33,0.26), riv*0.5);
    // ridges
    float rid = 1.0 - abs(2.0*n3(vec3(g/4.0, 7.0)) - 1.0);
    alb *= 0.9 + 0.2*smoothstep(0.7,1.0,rid);
    // clouds (cast faint shadow)
    float cl = smoothstep(0.6, 0.75, fbm3(vec3(g/26.0 + vec2(u_time*0.01, 0.0), 9.0)));
    float cls = smoothstep(0.6, 0.75, fbm3(vec3((g+vec2(1.2,0.8))/26.0 + vec2(u_time*0.01, 0.0), 9.0)));
    cl *= 1.0 - u_snow; cls *= 1.0 - u_snow;
    alb *= 1.0 - 0.35*cls;
    alb = mix(alb, vec3(0.97,0.98,1.0), cl*0.9);
    if (u_snow > 0.0) {
      vec2 gs = pos.xz*70.0;                       // ~14 m tree cells
      float patch = smoothstep(0.36, 0.46, fbm3(vec3(pos.xz*1.6, 3.0)));
      float hgt = fbm3(vec3(pos.xz*1.3, 6.0));
      float hgx = fbm3(vec3((pos.xz+vec2(0.03,0.0))*1.3, 6.0));
      float hgz = fbm3(vec3((pos.xz+vec2(0.0,0.03))*1.3, 6.0));
      float hs = clamp(0.95 + 6.0*((hgx-hgt)*0.6 - (hgz-hgt)*0.75), 0.72, 1.12);
      vec2 cid0 = floor(gs);
      float tr = 0.0, shd = 0.0, tv = 1.0;
      for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
        vec2 cid = cid0 + vec2(float(i), float(j));
        float on = step(0.15, hash2(cid+2.1)) * step(0.5, fbm3(vec3(cid/70.0*1.6, 3.0)) + 0.14);
        if (on < 0.5) continue;
        vec2 tc = gs - cid - 0.5 - (vec2(hash2(cid), hash2(cid+7.3)) - 0.5)*0.7;
        float tsz = 0.3 + 0.22*hash2(cid+4.4);
        float d = length(tc);
        float a = atan(tc.y, tc.x);
        d *= 1.0 + 0.12*sin(a*7.0 + hash2(cid)*6.0);          // star-shaped conifer crown
        float tt = smoothstep(tsz, tsz*0.7, d);
        if (tt > tr) { tr = tt; tv = 0.75 + 0.5*hash2(cid+9.0) - 0.35*smoothstep(tsz, 0.0, length(tc + vec2(0.06,0.08))); }
        shd = max(shd, smoothstep(tsz*1.15, tsz*0.6, length(tc - vec2(0.2, 0.24))));
      }
      shd *= 1.0 - tr;
      float px = t*0.0008*70.0;                    // tree cells per pixel
      float far = smoothstep(0.12, 0.45, px);
      tr = mix(tr, patch*0.6, far); shd = mix(shd, patch*0.2, far);
      vec3 snowc = vec3(0.97,0.98,1.0)*hs*(1.0 - 0.4*shd) + vec3(-0.08,-0.03,0.04)*shd;
      vec3 tree = vec3(0.08,0.17,0.11)*(0.75+0.5*hs)*tv;
      vec3 sAlb = mix(snowc, tree, tr);
      sAlb = mix(sAlb, vec3(0.45,0.5,0.55)*hs, smoothstep(0.72, 0.8, hgt)*0.5); // rocky ridges
      alb = mix(alb, sAlb, u_snow);
    }
    float dif = clamp(dot(n, L)*0.6 + 0.55, 0.0, 1.0);
    dif = mix(dif, 1.12, 0.6*u_snow);
    col = alb*dif;
    float mu = clamp(dot(n, -rd), 0.0, 1.0);
    float haze = clamp(0.1 + 0.9*pow(1.0 - mu, 3.0) + 0.25*(1.0-dark)*(1.0-mu), 0.0, 1.0);
    col = mix(col, vec3(0.62,0.76,0.95), haze*mix(1.0, 0.45, u_snow));
  } else {
    vec3 hor = vec3(0.70,0.82,0.96), zen = vec3(0.22,0.43,0.80);
    float tc = max(-b, 0.0);
    float hmin = max(length(oc + rd*tc) - R, 0.0);
    float el = clamp(exp(-hmin/6.0), 0.0, 1.0);
    vec3 low = mix(zen, hor, el);
    vec3 high = vec3(0.003,0.005,0.016) + stars(rd)*0.7;
    col = mix(low, high, dark);
    // thin glowing limb: white at the surface, deep blue above
    col += dark*(vec3(0.15,0.42,1.0)*exp(-hmin/9.0)*0.95 + vec3(0.65,0.8,1.0)*exp(-hmin/2.2)*0.6);
    float sd = max(dot(rd, L), 0.0);
    col += vec3(1.0,0.95,0.85)*(pow(sd, 900.0)*5.0 + pow(sd, 30.0)*0.12*(0.4+dark));
  }
  return col;
}
vec4 pixel(vec2 uv){
  vec2 p = screenP(uv, 0.0);
  p += u_shake*vec2(noise2(vec2(u_time*24.0,1.0))-0.5, noise2(vec2(u_time*21.0,5.0))-0.5)*0.025;
  vec2 p0 = p;
  p *= 1.0 + u_fish*dot(p, p);
  p = rot(u_roll)*p;
  // world camera (km) — yaw 0, looking toward -z, pitched
  vec3 ro = vec3(0.0, u_alt, 0.0);
  float cp = cos(u_pitch), spp = sin(u_pitch);
  vec3 ww = normalize(vec3(0.0, spp, -cp));
  vec3 uu = normalize(cross(ww, vec3(0.0,1.0,0.0)));
  vec3 vv = cross(uu, ww);
  vec3 rd = normalize(p.x*uu + p.y*vv + u_lens*ww);
  float hitG;
  vec3 col = skyEarth(rd, ro, u_rad, hitG);
  // speed streaks: ice/dust rushing out from the view centre
  if (u_streak > 0.0) {
    vec2 sp = p0;
    float a = atan(sp.y, sp.x), r = length(sp);
    float s = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float N = 70.0 + 30.0*fi;
      float cell = floor((a/6.2832 + 0.5)*N + fi*0.37);
      float h = hash2(vec2(cell, fi*13.1));
      if (h > 0.55) {
        float ph = fract(h*9.7 + u_time*(0.7 + 0.6*h + 0.4*fi));
        float rr = 0.06 + ph*ph*0.9;
        float len = 0.03 + 0.12*ph*u_streak;
        float ac = abs(fract((a/6.2832 + 0.5)*N + fi*0.37) - 0.5);
        float lin0 = smoothstep(0.18, 0.0, ac*r*N*0.05/(0.02+0.02*ph)) * smoothstep(rr-len, rr, r) * smoothstep(rr+0.004, rr, r);
        s += lin0*(0.35 + 0.65*ph);
      }
    }
    col = mix(col, vec3(0.92,0.96,1.0), clamp(s*u_streak*0.55, 0.0, 0.8));
  }
  // airliner (camera space, metres)
  if (u_pl > 0.5) {
    PC = vec3(u_plx, u_ply, -u_pld);
    gP1 = rot(u_ppit); gP2 = rot(u_pyaw); gP3 = rot(u_proll);
    gObj = 1.0;
    vec3 rdc = normalize(vec3(p.x, p.y, -u_lens));
    // contrails from the engines, trailing behind (local -x)
    if (u_trail > 0.0) {
      float tsum = 0.0;
      for (int i = 0; i < 2; i++) {
        float side = i == 0 ? 7.8 : -7.8;
        // local -> camera: invert rotations (transpose)
        vec3 la = vec3(3.0, -2.7, side), lb = vec3(-260.0, -2.0, side*1.3);
        vec3 a = la, b = lb;
        a.xy = a.xy*gP3; a.xz = a.xz*gP2; a.yz = a.yz*gP1; a += PC;
        b.xy = b.xy*gP3; b.xz = b.xz*gP2; b.yz = b.yz*gP1; b += PC;
        vec3 ba = b - a;
        float B = dot(rdc, ba), C = dot(ba, ba), D = dot(rdc, -a), E = dot(ba, -a);
        float den = max(C - B*B, 1e-4);
        float ku = clamp((E - B*D)/den, 0.0, 1.0);
        vec3 pa = a + ba*ku;
        float ss = max(dot(rdc, pa), 0.0);
        float d = length(rdc*ss - pa);
        float w = 0.8 + ku*6.0;
        tsum += smoothstep(w, 0.0, d)*(1.0 - ku)*smoothstep(0.0, 0.04, ku);
      }
      col = mix(col, vec3(0.97,0.98,1.0), clamp(tsum*u_trail, 0.0, 0.85));
    }
    vec3 bc = PC;
    float bR = 70.0;
    float bb = dot(-bc, rdc), cc = dot(bc, bc) - bR*bR;
    if (bb*bb - cc > 0.0) {
      vec3 m = march(rdc*max(-bb - bR, 0.0), rdc, 2.0*bR, 0.0);
      if (m.x > 0.0) {
        vec3 pos = rdc*(m.x + max(-bb - bR, 0.0)); vec3 n = calcNormal(pos);
        vec3 Lw = normalize(vec3(-0.55, 0.32, -0.75));
        vec3 Lc = normalize(vec3(dot(Lw,uu), dot(Lw,vv), -dot(Lw,ww)));
        vec3 Uc = vec3(dot(vec3(0,1,0),uu), dot(vec3(0,1,0),vv), -dot(vec3(0,1,0),ww));
        vec3 q = planeQ(pos)/3.0;
        vec3 alb = vec3(0.93,0.94,0.96);
        if (m.y > 11.5 && m.y < 12.5) alb = vec3(0.80,0.82,0.86);
        if (m.y > 12.5) alb = vec3(0.55,0.58,0.64);
        if (m.y < 11.5 && abs(q.y+0.12) < 0.1) alb = vec3(0.18,0.34,0.68);           // cheat line
        if (m.y < 11.5 && abs(q.y-0.25) < 0.06 && fract(q.x*2.2) < 0.45 && q.x > -4.8 && q.x < 5.6 && abs(q.z) > 0.5) alb = vec3(0.12,0.14,0.2); // windows
        if (m.y > 11.5 && m.y < 12.5 && q.x < -4.6 && q.y > 0.6) alb = vec3(0.85,0.22,0.2); // tail fin
        if (u_brk > 0.5 && m.y < 11.5 && q.x > -2.2) alb *= 0.45;                    // scorched torn edge
        float dif = clamp(dot(n, Lc), 0.0, 1.0);
        float sky = 0.5 + 0.5*dot(n, Uc);
        vec3 h = normalize(Lc - rdc);
        float spec = pow(clamp(dot(n, h), 0.0, 1.0), 40.0)*0.35;
        vec3 c = lin(alb)*(dif*vec3(1.25,1.18,1.05) + sky*vec3(0.38,0.48,0.62) + 0.06) + spec;
        c = pow(max(c, 0.0), vec3(0.4545));
        float fogd = clamp(length(pos)/2500.0, 0.0, 0.6);
        col = mix(c, col, fogd);
      }
    }
    gObj = 0.0;
  }
  // jumper (camera space, metres)
  if (u_man > 0.5) {
    FP = vec3(u_mx, u_my, -u_md);
    gPose = u_pose;
    gR1 = rot(u_froll); gR2 = rot(u_ftilt); gR3 = rot(u_fyaw);
    vec3 rdc = normalize(vec3(p.x, p.y, -u_lens));
    float bR = u_chute > 0.01 ? 5.5 : (u_cap > 0.01 ? 1.6 : 1.3);
    vec3 bc = FP + (u_chute > 0.01 ? vec3(0.0, 2.0, 0.0) : vec3(0.0));
    float bb = dot(-bc, rdc), cc = dot(bc, bc) - bR*bR;
    if (bb*bb - cc > 0.0) {
      vec3 m = march(vec3(0.0), rdc, u_md + 8.0, 0.0);
      if (m.x > 0.0) {
        vec3 pos = rdc*m.x; vec3 n = calcNormal(pos);
        // light directions into camera space
        vec3 Lw = normalize(vec3(-0.55, 0.32, -0.75));
        vec3 Lc = normalize(vec3(dot(Lw,uu), dot(Lw,vv), -dot(Lw,ww)));
        vec3 Uc = vec3(dot(vec3(0,1,0),uu), dot(vec3(0,1,0),vv), -dot(vec3(0,1,0),ww));
        vec3 q = figQ(pos);
        vec3 alb = q.y < -0.27 ? vec3(0.22,0.32,0.52) : vec3(0.93,0.42,0.16); float gloss = 0.15; // jeans / orange hoodie
        if (m.y > 1.5 && m.y < 2.5) { alb = vec3(0.86,0.64,0.5); gloss = 0.3; if (q.y > 0.62 || q.z > -0.03) alb = vec3(0.16,0.11,0.08); } // face / hair
        else if (m.y > 2.5 && m.y < 3.5) { alb = vec3(0.32,0.34,0.38); if (abs(q.y-0.06) < 0.03) alb = vec3(0.85,0.2,0.18); }
        else if (m.y > 3.5 && m.y < 4.5) alb = q.y > -0.3 ? vec3(0.86,0.64,0.5) : vec3(0.15,0.15,0.17); // hands / shoes
        else if (m.y > 4.5 && m.y < 5.5) { alb = vec3(0.78,0.62,0.32); gloss = 0.7; }
        else if (m.y > 5.5 && m.y < 6.5) { float st = step(0.5, fract(q.x*1.6)); alb = mix(vec3(0.9,0.18,0.15), vec3(0.95,0.95,0.92), st); }
        else if (m.y > 6.5) alb = vec3(0.7);
        if (m.y < 1.5 && abs(q.y+0.25) < 0.025) alb = vec3(0.12,0.12,0.14); // belt
        float sky = 0.5 + 0.5*dot(n, Uc);
        float bounce = 0.5 - 0.5*dot(n, Uc);
        float dark = smoothstep(9.0, 32.0, u_alt);
        vec3 c = shade(pos, n, rdc, lin(alb), Lc, vec3(1.25,1.18,1.05), mix(vec3(0.35,0.45,0.6), vec3(0.06,0.08,0.14), dark), vec3(0.45,0.38,0.3), gloss);
        c += lin(alb)*bounce*vec3(0.32,0.28,0.24)*0.5;
        c = pow(max(c, 0.0), vec3(0.4545));
        col = mix(c, col, 0.04 + 0.05*(1.0-dark));
      }
    }
    // mach ring around the jumper
    if (u_mach > 0.0 && u_mach < 1.0) {
      vec2 sc = FP.xy/(-FP.z)*u_lens;
      float d = length(p - sc);
      float rr = 0.04 + 0.42*u_mach;
      float ring = smoothstep(0.035 + 0.05*u_mach, 0.0, abs(d - rr));
      float inner = smoothstep(rr, rr*0.3, d)*smoothstep(0.0, rr*0.3, d);
      col = mix(col, vec3(0.97,0.99,1.0), clamp(ring*(1.0 - u_mach)*1.1 + inner*0.25*(1.0-u_mach), 0.0, 1.0));
      col += vec3(0.6,0.8,1.0)*exp(-d*6.0)*(1.0 - u_mach)*0.6;
    }
  }
  // flying through cloud: wisps zooming outward
  if (u_cloud > 0.0) {
    float f = 0.0;
    for (int i = 0; i < 2; i++) {
      float ph = fract(u_time*0.55 + 0.5*float(i));
      vec2 q = p0*mix(3.2, 0.7, ph) + vec2(float(i)*7.1, 2.3);
      f += sin(ph*3.1416)*fbm3(vec3(q, float(i)*4.0));
    }
    float wh = smoothstep(0.35, 0.85, f + (u_cloud - 0.5)*1.4);
    col = mix(col, vec3(0.93,0.95,0.98), clamp(wh, 0.0, 1.0));
  }
  if (u_red > 0.0) {
    float lum = dot(col, vec3(0.3,0.59,0.11));
    col = mix(col, vec3(lum)*vec3(1.05,0.9,0.88), u_red*0.7);
  }
  if (u_blk > 0.0) {
    float r = length(p0*vec2(1.0, 0.62));
    float edge = mix(0.95, -0.05, u_blk);
    float vis = smoothstep(edge, edge - 0.32, r);
    col *= vis*(1.0 - 0.25*u_blk);
    col = mix(col, vec3(0.0), smoothstep(0.85, 1.0, u_blk));
  }
  // frost on the edges (cold)
  if (u_frost > 0.0) {
    float e = max(abs(p0.x)/0.28, abs(p0.y)/0.5);
    float fr = smoothstep(0.6, 1.0, e + 0.25*(fbm3(vec3(p0*18.0, 3.0)) - 0.5));
    col = mix(col, vec3(0.78,0.88,0.98), fr*u_frost*0.75);
  }
  // capsule door frame (screen space)
  if (u_cap > 0.0) {
    vec2 q = p0 - vec2(0.0, 0.03);
    vec2 hb = vec2(0.205, 0.37)*mix(1.6, 1.0, u_cap);
    vec2 dq = abs(q) - hb + 0.07;
    float dd = length(max(dq, 0.0)) + min(max(dq.x, dq.y), 0.0) - 0.07;
    if (dd > 0.0) {
      float gr = 0.5 + 0.5*q.y;
      vec3 metal = mix(vec3(0.10,0.11,0.12), vec3(0.24,0.25,0.27), gr);
      metal *= 0.85 + 0.15*n3(vec3(p0*40.0, 1.0));
      metal += vec3(0.8,0.85,0.9)*smoothstep(0.012, 0.0, dd)*0.5;
      float riv = smoothstep(0.006, 0.003, length(vec2(fract(q.y*14.0)-0.5, (dd-0.03)*14.0)/14.0));
      metal += riv*0.25*smoothstep(0.02,0.03,dd)*smoothstep(0.045,0.035,dd);
      col = mix(col, metal, 1.0);
    } else {
      col *= 1.0 - 0.35*smoothstep(-0.05, 0.0, dd);
    }
  }
  return vec4(col, 1.0);
}
