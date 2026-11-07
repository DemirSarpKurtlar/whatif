// orbit.glsl — Episode 051 (Gravity Part 5). "Lowpoly Skyline" look in space: a faceted low-poly Earth (radius 1), satellites on
// three orbital planes, the Moon, and the atmosphere slowly streaming off the limb. Orbit radii are compressed for the frame.
// Physics: halving Earth's mass halves GM. A circular orbit has v = sqrt(GM/r); the new escape speed there is sqrt(2(GM/2)/r) =
// sqrt(GM/r) = v. Every satellite is exactly at escape speed: its new path is a PARABOLA with periapsis at its old radius q,
// r = 2q / (1 + cos nu), timed with Barker's equation  D + D^3/3 = M,  D = tan(nu/2),  M = sqrt(GM'/(2 q^3)) t = n t / 2
// (n = old angular speed). The Moon (own mass included) ends on an orbit reaching far past Earth's shrunken Hill sphere: it leaves.
// Params:
//   dist, orb, camy, tx, ty : camera distance / azimuth / height, look-at x,y      lens : focal (0 -> 1.6)
//   cyc  : display time driving the circular orbits (freeze it at the moment of halving)
//   et   : display time since the halving (0 = still circular); satellites follow their parabolas
//   leak : atmosphere streaming into space (0..1)     moon : 0 hide, 1 show the Moon     mq : Moon's old orbit radius (display)
//   met  : display time since halving for the Moon's path     sats : satellite visibility (0..1)   shake
float gT = 0.0;
float h3(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float n3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm3(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*n3(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=0.5; } return s; }
vec2 map(vec3 p){ return vec2(length(p) - 1.0, 1.0); }
vec3 stars(vec3 rd){
  vec2 q = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*110.0;
  vec2 c = floor(q); vec2 f = fract(q)-0.5;
  float h = hash2(c);
  float s = h > 0.982 ? smoothstep(0.28,0.0,length(f))*(0.35+0.65*hash2(c+3.0)) : 0.0;
  return vec3(s);
}
float nuOf(float M){ float A = 1.5*M; float B = pow(A + sqrt(A*A + 1.0), 1.0/3.0); return 2.0*atan(B - 1.0/B); }
void planeOf(int i, out vec3 N, out vec3 e1, out vec3 e2, out float q){
  N = i==0 ? normalize(vec3(0.05,1.0,0.32)) : i==1 ? normalize(vec3(0.55,1.0,-0.35)) : normalize(vec3(-0.6,1.0,0.15));
  q = i==0 ? 1.42 : i==1 ? 1.85 : 2.45;
  e1 = normalize(cross(N, vec3(0.0,0.0,1.0))); e2 = cross(N, e1);
}
float rateOf(float q){ return 1.15*pow(q, -1.5); }
// position of satellite on plane i with start angle th0
vec3 satPos(int i, float th0){
  vec3 N, e1, e2; float q; planeOf(i, N, e1, e2, q);
  float n = rateOf(q);
  float the = th0 + n*u_cyc;
  float r = q, ang = the;
  if (u_et > 0.0) { float nu = nuOf(n*u_et*0.5); r = 2.0*q/(1.0 + cos(nu)); ang = the + nu; }
  return (e1*cos(ang) + e2*sin(ang))*r;
}
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  p += u_shake*vec2(noise2(vec2(u_time*25.0,1.0))-0.5, noise2(vec2(u_time*21.0,5.0))-0.5)*0.02;
  vec3 ro = vec3(sin(u_orb)*u_dist, u_camy, cos(u_orb)*u_dist);
  vec3 ta = vec3(u_tx, u_ty, 0.0);
  float lens = u_lens > 0.0 ? u_lens : 1.6;
  vec3 ww = normalize(ta-ro), uu = normalize(cross(ww,vec3(0.0,1.0,0.0))), vv = cross(uu,ww);
  vec3 rd = normalize(p.x*uu + p.y*vv + lens*ww);
  vec3 col = vec3(8.0,10.0,22.0)/255.0 + stars(rd);
  col += vec3(0.04,0.05,0.1)*(1.0-abs(rd.y));
  vec3 L = normalize(vec3(-0.85,0.3,0.45));
  col += vec3(1.0,0.86,0.6)*(pow(max(dot(rd,L),0.0), 600.0)*3.0 + pow(max(dot(rd,L),0.0), 14.0)*0.12);
  float b = dot(ro, rd), c = dot(ro,ro)-1.0, disc = b*b-c;
  float tE = disc > 0.0 ? -b - sqrt(disc) : 1e9;
  // atmosphere halo + leak (behind / around the planet)
  vec3 cp = ro + rd*max(-b, 0.0);
  float hgt = length(cp) - 1.0;
  if (disc <= 0.0) {
    float hh = max(hgt, 0.0);
    vec3 dir = normalize(cp);
    float lit = 0.35 + 0.65*clamp(dot(dir, L)+0.4, 0.0, 1.0);
    col += vec3(0.42,0.68,1.0)*exp(-hh*24.0)*0.9*lit;
    if (u_leak > 0.0) {
      float a2 = atan(dir.y, dir.x + dir.z*0.3);
      float streak = 0.5 + 0.5*n3(vec3(a2*12.0, hh*2.5 - u_time*0.5, 1.0));
      float plume = exp(-hh*mix(24.0, 2.2, u_leak))*streak*u_leak*smoothstep(0.0, 0.05, hh);
      col += vec3(0.5,0.76,1.0)*plume*0.7*lit;
      // escaping specks
      vec2 sp = vec2(a2*30.0, hh*9.0 - u_time*1.6);
      vec2 sc = floor(sp); vec2 sf = fract(sp) - 0.5;
      if (hash2(sc) > 0.8) col += vec3(0.6,0.85,1.0)*smoothstep(0.18, 0.0, length(sf))*u_leak*exp(-hh*1.2)*0.8;
    }
  }
  if (disc > 0.0) {
    vec3 pos = ro + rd*tE;
    vec3 n = normalize(pos);
    // low-poly facets: nearest jittered lattice point (3D Voronoi on the sphere) -> one flat normal per facet
    vec3 fn = n; { vec3 g = n*5.0; vec3 gi = floor(g); float best = 1e9;
      for (int x = -1; x <= 1; x++) for (int y = -1; y <= 1; y++) for (int z = -1; z <= 1; z++) {
        vec3 c3 = gi + vec3(float(x), float(y), float(z));
        vec3 j = c3 + 0.5 + 0.38*(vec3(h3(c3), h3(c3+7.1), h3(c3+3.3)) - 0.5);
        vec3 jn = normalize(j);
        float dd = length(n - jn*1.0);
        if (dd < best) { best = dd; fn = jn; } } }
    vec3 q = fn; q.xz = rot(0.4 + u_time*0.02)*q.xz;
    float land = fbm3(q*2.1 + vec3(3.0,1.0,7.0));
    float isLand = step(0.52, land);
    vec3 alb = mix(mix(vec3(38.0,98.0,178.0), vec3(60.0,132.0,206.0), hash2(fn.xy*31.0+fn.z*7.0))/255.0,
                   mix(vec3(86.0,160.0,64.0), vec3(214.0,184.0,120.0), step(0.62, land))/255.0, isLand);
    alb = mix(alb, vec3(0.94,0.96,0.98), step(0.84, abs(q.y) + 0.05*hash2(fn.xz*17.0)));
    float cl = step(0.6, fbm3(q*3.2 + vec3(11.0, 2.0, 5.0 + u_time*0.01)));
    alb = mix(alb, vec3(0.97), cl*0.9);
    float dif = clamp(dot(fn, L), 0.0, 1.0);
    vec3 lc = lin(alb)*(dif*1.35 + 0.05);
    vec3 ec = pow(lc, vec3(0.4545));
    float rim = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 2.5);
    ec = mix(ec, vec3(0.55,0.78,1.0)*(0.25 + 0.9*dif), rim*0.65);
    col = ec;
  }
  // orbit paths: old circles (faint) and new parabolic escape paths (bright)
  for (int i = 0; i < 3; i++) {
    vec3 N, e1, e2; float q; planeOf(i, N, e1, e2, q);
    float dn = dot(rd, N);
    if (abs(dn) < 1e-4) continue;
    float tp = -dot(ro, N)/dn;
    if (tp <= 0.0) continue;
    vec3 X = ro + rd*tp;
    float occ = (tp > tE) ? 0.18 : 1.0;
    float rho = length(X);
    float phi = atan(dot(X, e2), dot(X, e1));
    float w = 0.0035*tp/lens*1.6/max(abs(dn), 0.25);
    float wc = 0.0022*tp;
    float circ = smoothstep(wc, wc*0.3, abs(rho - q));
    float dash = u_et > 0.0 ? step(0.5, fract(phi*9.0)) : 1.0;
    col = mix(col, vec3(0.8,0.88,1.0), circ*dash*occ*(u_et > 0.0 ? 0.35 : 0.5)*u_sats);
    if (u_et > 0.0) {
      float n = rateOf(q);
      int cnt = i==1 ? 2 : 3;
      for (int k = 0; k < 3; k++) {
        if (k >= cnt) break;
        float th0 = float(k)*6.2832/float(cnt) + float(i)*0.7;
        float the = th0 + n*u_cyc;
        float nuMax = nuOf(n*u_et*0.5);
        float d = mod(phi - the + 6.2832*4.0, 6.2832);
        if (d < nuMax) {
          float rp = 2.0*q/(1.0 + cos(d));
          float tr = smoothstep(wc*1.4, wc*0.4, abs(rho - rp));
          float fade = 0.35 + 0.65*smoothstep(nuMax - 1.2, nuMax, d);
          col = mix(col, vec3(1.0,0.82,0.3), tr*fade*occ*0.9*u_sats);
        }
      }
    }
  }
  // satellites (screen-space low-poly icons: gold body + two blue panels)
  for (int i = 0; i < 3; i++) {
    int cnt = i==1 ? 2 : 3;
    for (int k = 0; k < 3; k++) {
      if (k >= cnt) break;
      float th0 = float(k)*6.2832/float(cnt) + float(i)*0.7;
      vec3 P = satPos(i, th0);
      vec3 v = P - ro; float z = dot(v, ww);
      if (z <= 0.1) continue;
      vec2 s = vec2(dot(v, uu), dot(v, vv))/z*lens;
      float occl = (length(P - ro) > tE && dot(normalize(v), rd) > 0.0 && disc > 0.0) ? 1.0 : 0.0;
      // occluded if the ray to P hits the Earth first
      float bb = dot(ro, normalize(v)), cc = dot(ro,ro) - 1.0, dd = bb*bb - cc;
      float hidden = (dd > 0.0 && -bb - sqrt(dd) < length(v)) ? 1.0 : 0.0;
      float sz = 0.019*clamp(5.0/z, 0.6, 2.0);
      vec2 o = (p - s)/sz;
      o = rot(0.4)*o;
      float body = max(abs(o.x) - 0.55, abs(o.y) - 0.55);
      float pan = max(abs(abs(o.x) - 1.8) - 1.0, abs(o.y) - 0.42);
      float m1 = smoothstep(0.12, 0.0, body), m2 = smoothstep(0.12, 0.0, pan);
      float vis = (1.0 - hidden)*u_sats;
      col = mix(col, vec3(0.32,0.55,0.95), m2*vis);
      col = mix(col, vec3(1.0,0.84,0.35), m1*vis);
      col += vec3(1.0,0.9,0.6)*exp(-length(p - s)/sz*0.9)*0.25*vis;
    }
  }
  // the Moon
  if (u_moon > 0.01) {
    vec3 N = normalize(vec3(0.08,1.0,0.1)); vec3 e1 = normalize(cross(N, vec3(0.0,0.0,1.0))), e2 = cross(N, e1);
    float q = u_mq, n = rateOf(q)*1.0;
    float the = 2.3 + n*u_cyc;
    float r = q, ang = the;
    if (u_met > 0.0) { float nu = nuOf(n*u_met*0.5); r = 2.0*q/(1.0 + cos(nu)); ang = the + nu; }
    vec3 MP = (e1*cos(ang) + e2*sin(ang))*r;
    float mr = 0.27;
    vec3 oc = ro - MP; float mb = dot(oc, rd), mc = dot(oc,oc) - mr*mr, md = mb*mb - mc;
    if (md > 0.0) {
      float tm = -mb - sqrt(md);
      if (tm > 0.0 && tm < tE) {
        vec3 mn = facet(normalize(ro + rd*tm - MP), 4.0);
        float cr = hash2(floor(mn.xy*5.0) + floor(mn.z*5.0));
        vec3 ma = mix(vec3(0.78,0.77,0.74), vec3(0.6,0.6,0.6), step(0.7, cr));
        col = mix(col, pow(lin(ma)*(clamp(dot(mn, L),0.0,1.0)*1.3 + 0.04), vec3(0.4545)), u_moon);
      }
    }
    // the Moon's old orbit (faint) and its escape path
    float dn = dot(rd, N);
    if (abs(dn) > 1e-4) {
      float tp = -dot(ro, N)/dn;
      if (tp > 0.0) {
        vec3 X = ro + rd*tp; float rho = length(X); float phi = atan(dot(X, e2), dot(X, e1));
        float wc = 0.0022*tp; float occ = tp > tE ? 0.15 : 1.0;
        col = mix(col, vec3(0.8,0.85,0.95), smoothstep(wc, wc*0.3, abs(rho - q))*0.35*occ*u_moon*step(0.5, fract(phi*14.0)));
        if (u_met > 0.0) {
          float nuMax = nuOf(n*u_met*0.5);
          float d = mod(phi - the + 6.2832*4.0, 6.2832);
          if (d < nuMax) col = mix(col, vec3(0.95,0.95,1.0), smoothstep(wc*1.4, wc*0.4, abs(rho - 2.0*q/(1.0+cos(d))))*0.8*occ*u_moon);
        }
      }
    }
  }
  return vec4(col, 1.0);
}
