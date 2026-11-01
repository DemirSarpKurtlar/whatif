// Episode 034 — falling into Jupiter. Body POV, two worlds sharing one camera:
//  * figure space (metres): "you" in a suit at the origin (belly-down skydiver pose), the Galileo probe on its parachute,
//    rising cloud particles, the entry plasma sheath;
//  * background: either the planet seen from space (u_space = 1; banded, Great Red Spot, optional cutaway)
//    or the atmosphere around you (km space): stacked cloud decks whose colour/darkness depend on u_depth,
//    lightning in the water clouds, then liquid (u_liq) and metallic (u_metal) hydrogen.
// params: u_depth (km below the cloud tops; < 0 = above them), u_look (camera elevation, + = above looking down),
//  u_orb (camera azimuth), u_md (camera distance to you, m), u_ty (look-at height offset, m), u_tx (sideways offset, m),
//  u_lens, u_sink (particle rise speed), u_man (0..1 you visible), u_burn (0..1 entry plasma), u_bolt (0..1 lightning
//  activity), u_zap (0..1 a big nearby strike), u_probe (0..1 Galileo probe visible), u_alive (probe beacon on), u_px/u_py/u_pz (probe pos, m),
//  u_chute (0..1 parachute), u_press (0..1 pressure squeeze), u_liq (0..1 liquid hydrogen), u_metal (0..1 metallic hydrogen),
//  u_space (0..1 planet-from-space view), u_pd (distance to planet centre, radii), u_pdy (planet shift down, radii),
//  u_spin (planet rotation), u_cut (0..1 cutaway wedge), u_you (depth marker in the cutaway, 0..1 of the radius),
//  u_gauge (0..1 depth gauge), u_shake.
float gT = 0.0;
float h3(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7)))*43758.5453); }
float n3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fbm2(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++){ s += a*noise2(p); p = p*2.07 + vec2(3.1, 1.7); a *= 0.5; } return s; }
float fbm3(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++){ s += a*n3(p); p = p*2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; } return s; }

// ------------------------------------------------------------------ figure space (metres)
vec3 PROBE;
float sdYou(vec3 p){
  p.xz = rot(0.08*sin(gT*0.6))*p.xz;
  p.yz = rot(0.05*sin(gT*0.9))*p.yz;
  vec3 a = vec3(abs(p.x), p.y, p.z);
  float fl = 0.04*sin(gT*3.1);
  float torso = sdRoundBox(p - vec3(0.0, 0.0, 0.02), vec3(0.15, 0.07, 0.24), 0.08);
  float pack = sdRoundBox(p - vec3(0.0, 0.15, -0.02), vec3(0.12, 0.05, 0.17), 0.04);
  float head = sdSphere(p - vec3(0.0, 0.04, 0.44), 0.15);
  float up = sdCapsule(a, vec3(0.2, 0.02, 0.22), vec3(0.5, 0.1 + fl, 0.28), 0.065);
  float fo = sdCapsule(a, vec3(0.5, 0.1 + fl, 0.28), vec3(0.64, 0.16 + fl, 0.54), 0.055);
  float hand = sdSphere(a - vec3(0.66, 0.17 + fl, 0.6), 0.06);
  float th = sdCapsule(a, vec3(0.1, 0.0, -0.26), vec3(0.2, 0.06, -0.68), 0.085);
  float sh = sdCapsule(a, vec3(0.2, 0.06, -0.68), vec3(0.24, 0.3 - fl, -0.95), 0.07);
  float boot = sdRoundBox(a - vec3(0.245, 0.36 - fl, -1.0), vec3(0.06, 0.1, 0.05), 0.03);
  return min(min(min(torso, pack), min(head, hand)), min(min(up, fo), min(min(th, sh), boot)));
}
float sdProbe(vec3 q){
  // Galileo descent module: squat drum + conical top, parachute canopy above on 4 lines
  float drum = sdRoundBox(q, vec3(0.38, 0.18, 0.38), 0.05);
  drum = max(drum, length(q.xz) - 0.43);
  float top = max(length(q.xz) - (0.36 - (q.y - 0.18)*0.9), max(-(q.y - 0.18), q.y - 0.42));
  float ant = sdCapsule(q, vec3(0.0, 0.42, 0.0), vec3(0.0, 0.62, 0.0), 0.02);
  float body = min(min(drum, top*0.7), ant);
  if (u_chute > 0.01) {
    vec3 c = q - vec3(0.0, 4.8, 0.0);
    float canopy = max(abs(length(c*vec3(1.0, 1.6, 1.0)) - 1.3) - 0.03, -c.y);
    vec3 r = vec3(abs(q.x), q.y, abs(q.z));
    float lines = sdCapsule(r, vec3(0.0, 0.62, 0.0), vec3(0.9, 4.8, 0.9), 0.012);
    body = min(body, min(canopy*0.6, lines));
  }
  return body;
}
vec2 map(vec3 p){
  vec2 r = vec2(1e5, 0.0);
  if (u_man > 0.01) r = vec2(sdYou(p), 1.0);
  if (u_probe > 0.01) r = opU(r, vec2(sdProbe(p - PROBE), 2.0));
  return r;
}

// ------------------------------------------------------------------ atmosphere (km)
// colour of the cloud deck at depth d (km below the cloud tops)
vec3 deckCol(float d, float band){
  vec3 zone = vec3(0.96, 0.92, 0.84), belt = vec3(0.72, 0.47, 0.30);
  vec3 c0 = mix(zone, belt, band);                                // ammonia ice: white zones / brown belts from above
  vec3 c1 = vec3(0.70, 0.43, 0.24);                               // ammonium hydrosulfide: rusty brown
  vec3 c2 = vec3(0.50, 0.55, 0.64);                               // water clouds: blue-grey
  vec3 c3 = vec3(0.45, 0.20, 0.10);                               // hot deep haze
  vec3 c = mix(c0, c1, smoothstep(10.0, 20.0, d));
  c = mix(c, c2, smoothstep(36.0, 46.0, d));
  c = mix(c, c3, smoothstep(85.0, 140.0, d));
  return c;
}
// sunlight left at depth d, plus a faint thermal floor
float sunAt(float d){ return exp(-max(d, 0.0)/26.0); }
vec3 glowAt(float d){ return vec3(1.0, 0.35, 0.12)*0.05*smoothstep(60.0, 160.0, d); }
float bandAt(vec2 xz){ float z = xz.y*0.012 + 0.6*fbm2(xz*0.004 + 3.0); return smoothstep(0.25, 0.75, 0.5 + 0.5*sin(z*6.2832)); }
float boltCell(vec2 id){ float h = hash2(id); float ph = fract(gT*0.37 + h*13.0); return step(0.86, h)*pow(max(0.0, 1.0 - ph*9.0), 2.0)*step(0.5, fract(ph*61.0 + h)); }

vec3 atmoBg(vec3 rd, float d){
  float s = sunAt(d);
  vec3 up = deckCol(d - 12.0, 0.2)*s*1.1 + glowAt(d);
  vec3 dn = deckCol(d + 15.0, 0.5)*sunAt(d + 25.0)*0.6 + glowAt(d + 30.0);
  if (d < 0.0) { up = mix(vec3(0.02, 0.03, 0.07), vec3(0.6, 0.62, 0.7), exp(rd.y*-4.0)*0.6*(1.0 - smoothstep(-200.0, -60.0, d)*0.0)); }
  return mix(dn, up, smoothstep(-0.6, 0.6, rd.y));
}
vec3 atmosphere(vec3 rd, float d, out float hitT){
  hitT = 1e9;
  vec3 ro = vec3(0.0, -d, 0.0);
  vec3 col = atmoBg(rd, d);
  const float S = 4.0;                                            // deck spacing (km)
  float k0 = rd.y < 0.0 ? ceil((d + 0.001)/S) : floor((d - 0.001)/S);
  float dir = rd.y < 0.0 ? 1.0 : -1.0;
  // composite back to front: farthest first
  for (int j = 7; j >= 0; j--) {
    float dk = (k0 + dir*float(j))*S;
    if (dk < -0.001) continue;                                    // nothing above the cloud tops
    float t = (-dk - ro.y)/rd.y;
    if (t <= 0.0 || t > 260.0) continue;
    vec2 xz = ro.xz + rd.xz*t + vec2(dk*7.3, dk*3.1);
    float lay = fbm2(xz*0.11 + vec2(gT*0.02, 0.0)) + 0.35*fbm2(xz*0.6);
    float cov = mix(0.62, 0.42, smoothstep(30.0, 60.0, dk));     // water clouds are thicker / towering
    float a = smoothstep(cov, cov + 0.25, lay);
    if (dk < 0.5) a = 1.0;                                        // top deck is solid from above
    float band = bandAt(xz);
    vec3 c = deckCol(dk, band)*(0.55 + 0.6*lay);
    float lit = sunAt(dk)*(0.75 + 0.25*lay);
    vec3 cc = c*lit + glowAt(dk)*(0.6 + lay);
    // lightning inside the water-cloud level
    float wz = smoothstep(34.0, 44.0, dk)*(1.0 - smoothstep(75.0, 90.0, dk));
    if (wz > 0.0 && u_bolt > 0.0) {
      vec2 g = xz*0.05; vec2 gi = floor(g); vec2 gf = fract(g) - 0.5;
      float f = boltCell(gi + dk);
      cc += vec3(0.75, 0.85, 1.0)*f*u_bolt*wz*3.5*exp(-dot(gf, gf)*9.0);
    }
    float fog = exp(-t/70.0);
    col = mix(col, cc, a*fog);
  }
  return col;
}
// a big nearby bolt: zig-zag vertical line at a fixed spot in the water-cloud layer
vec3 zapBolt(vec3 rd, float d){
  if (u_zap <= 0.0) return vec3(0.0);
  vec3 ro = vec3(0.0, -d, 0.0);
  vec3 B = vec3(9.0, -d - 2.0, -20.0);
  vec3 col = vec3(0.0);
  // closest approach of the ray to the vertical line through B
  vec3 w = ro - B; vec3 u = vec3(0.0, 1.0, 0.0);
  float b = dot(rd, u), dd = dot(rd, w), e = dot(u, w);
  float den = 1.0 - b*b;
  float tr = (b*e - dd)/max(den, 1e-4);
  if (tr <= 0.0) return col;
  vec3 P = ro + rd*tr;
  float y = P.y - B.y;
  float jx = (noise2(vec2(y*0.35, 3.0)) - 0.5)*5.0 + (noise2(vec2(y*1.7, 7.0)) - 0.5)*1.2;
  vec3 Q = B + vec3(jx, y, 0.0);
  float dist = length((P - Q).xz);
  float env = smoothstep(14.0, 4.0, abs(y));
  col += vec3(0.8, 0.88, 1.0)*(0.06/(dist*dist + 0.02) + 1.2*exp(-dist*0.6))*env*u_zap;
  // branch
  float y2 = y - 1.5; float bx = jx + max(0.0, -y2)*0.9 + (noise2(vec2(y*2.3, 1.0)) - 0.5)*0.8;
  float d2 = length(vec2(P.x - (B.x + bx), P.z - B.z));
  col += vec3(0.7, 0.8, 1.0)*0.02/(d2*d2 + 0.02)*step(y2, 0.0)*smoothstep(-6.0, -2.0, y2)*u_zap;
  return col;
}
// liquid / metallic hydrogen surroundings
vec3 fluid(vec3 rd){
  vec3 q = rd*2.2 + vec3(0.0, -gT*0.35*max(u_sink*0.1, 0.3), 0.0);
  vec3 wq = q + 0.8*vec3(fbm3(q + 1.7), fbm3(q + 5.2), fbm3(q + 9.4));
  float f = fbm3(wq*1.3);
  vec3 liq = mix(vec3(0.10, 0.012, 0.004), vec3(0.95, 0.30, 0.06), smoothstep(0.35, 0.8, f));
  liq += vec3(1.0, 0.6, 0.2)*pow(smoothstep(0.55, 0.85, f), 3.0)*0.5;
  // metal: chrome-like bands with blue currents
  float m = fbm3(wq*0.9 + 4.0);
  float stripes = 0.5 + 0.5*sin(m*14.0 + rd.y*3.0);
  vec3 met = mix(vec3(0.05, 0.06, 0.08), vec3(0.72, 0.76, 0.84), pow(stripes, 2.5));
  met += vec3(0.9, 0.95, 1.0)*pow(stripes, 30.0)*0.8;
  float arc = smoothstep(0.03, 0.0, abs(fbm3(wq*2.1 + vec3(0.0, gT*0.6, 0.0)) - 0.5));
  met += vec3(0.3, 0.6, 1.0)*arc*(0.6 + 0.4*sin(gT*7.0 + m*20.0));
  return mix(liq, met, u_metal);
}

// ------------------------------------------------------------------ planet from space
vec3 planetTex(vec3 n){
  // n: unit vector in planet frame (y = spin axis)
  float lat = asin(clamp(n.y, -1.0, 1.0));
  float lon = atan(n.z, n.x) + u_spin + gT*0.01;
  vec2 ll = vec2(lon, lat);
  float wob = 0.05*fbm2(vec2(lon*3.0, lat*14.0)) + 0.02*sin(lon*9.0 + lat*30.0);
  float l2 = lat + wob;
  float bands = 0.5 + 0.5*sin(l2*15.5 + 0.6) ;
  float fine = 0.5 + 0.5*sin(l2*48.0 + 1.3*fbm2(vec2(lon*6.0, lat*20.0)));
  vec3 zone = vec3(0.93, 0.88, 0.78), belt = vec3(0.70, 0.46, 0.30), dark = vec3(0.45, 0.30, 0.22);
  vec3 c = mix(zone, belt, smoothstep(0.35, 0.75, bands));
  c = mix(c, dark, smoothstep(0.75, 1.0, bands)*0.6);
  c *= 0.86 + 0.14*fine;
  c = mix(c, vec3(0.62, 0.58, 0.55), smoothstep(0.85, 1.25, abs(lat)));   // grey-blue poles
  // Great Red Spot at ~22 S
  vec2 gs = vec2(atan(sin(lon - 0.9), cos(lon - 0.9)), lat + 0.385);
  vec2 e = gs*vec2(1.0/0.22, 1.0/0.085);
  float r = length(e);
  float sw = atan(e.y, e.x) + r*2.2 - gT*0.3;
  float swirl = 0.5 + 0.5*sin(sw*3.0 + fbm2(e*2.0)*2.0);
  vec3 grs = mix(vec3(0.78, 0.33, 0.18), vec3(0.88, 0.55, 0.38), swirl*0.6);
  c = mix(c, grs, smoothstep(1.05, 0.75, r));
  c = mix(c, vec3(0.95, 0.9, 0.82), smoothstep(0.12, 0.0, abs(r - 1.12))*0.5);
  return c;
}
vec3 layerAtR(float r){
  // cutaway colours vs fractional radius
  vec3 c = vec3(0.95, 0.75, 0.5);                                 // thin cloud layer
  c = mix(c, vec3(0.86, 0.36, 0.12), smoothstep(0.995, 0.97, r));  // molecular hydrogen (gas -> liquid)
  c = mix(c, vec3(0.45, 0.07, 0.04), smoothstep(0.95, 0.86, r));
  c = mix(c, vec3(0.62, 0.68, 0.80), smoothstep(0.865, 0.845, r)); // metallic hydrogen
  c = mix(c, vec3(0.30, 0.38, 0.55), smoothstep(0.8, 0.3, r));
  c = mix(c, vec3(0.95, 0.55, 0.2), smoothstep(0.24, 0.2, r));     // dense core
  return c;
}
float sdCut(vec3 p){ return max(length(p) - 1.0, min(p.x, p.z)); }
vec3 space(vec3 rd, vec3 fwd, vec3 upv, out float hitT){
  hitT = 1e9;
  // stars
  vec2 sq = vec2(atan(rd.z, rd.x), asin(clamp(rd.y, -1.0, 1.0)))*140.0;
  vec2 sc = floor(sq); vec2 sf = fract(sq) - 0.5; float hs = hash2(sc);
  vec3 col = vec3(0.004, 0.005, 0.012) + (hs > 0.985 ? smoothstep(0.25, 0.0, length(sf))*(0.3 + 0.7*hash2(sc + 3.0)) : 0.0)*vec3(0.9, 0.95, 1.0);
  vec3 C = fwd*u_pd - upv*u_pdy*u_pd;
  vec3 L = normalize(vec3(-0.9, 0.35, 0.55));
  // planet frame: tilt slightly
  mat2 tl = rot(0.05);
  float b = dot(C, rd); float c2 = dot(C, C) - 1.0; float disc = b*b - c2;
  float hh = length(C - rd*b) - 1.0;   // ray height above the planet at closest approach
  if (disc > 0.0) {
    float t = b - sqrt(disc);
    vec3 pos = rd*t - C; // planet-local
    vec3 n = normalize(pos);
    vec3 q = n; q.xy = tl*q.xy;
    bool cutHit = false;
    if (u_cut > 0.01) {
      // rotate the wedge so it faces the camera
      vec3 ro = -C; vec3 rr = rd;
      float ca = 0.75;
      ro.xz = rot(ca)*ro.xz; rr.xz = rot(ca)*rr.xz;
      float tt = t;
      vec3 pp = ro + rr*tt;
      if (min(pp.x, pp.z) > 0.0) {
        cutHit = true;
        for (int i = 0; i < 48; i++) { pp = ro + rr*tt; float dd = sdCut(pp); if (dd < 0.0005) break; tt += max(dd, 0.002); if (tt > t + 3.0) break; }
        pp = ro + rr*tt;
        if (length(pp) > 1.002) { cutHit = false; t = -1.0; }
        else {
          float r = length(pp);
          vec3 lc = layerAtR(r);
          float face = abs(pp.x) < abs(pp.z) ? 0.85 : 1.0;
          col = lc*face;
          // you: a glowing marker on the cut face, sinking
          float yr = 1.0 - u_you;
          vec2 fp = abs(pp.x) < abs(pp.z) ? vec2(pp.z, pp.y) : vec2(pp.x, pp.y);
          vec2 yp = vec2(yr*0.55, yr*0.835);
          float ds = length(fp - yp);
          col = mix(col, vec3(1.0, 0.95, 0.6), smoothstep(0.018, 0.010, ds)*u_cut);
          col += vec3(1.0, 0.85, 0.4)*exp(-ds*40.0)*0.6*u_cut;
          // faint layer rings
          col *= 0.92 + 0.08*sin(r*120.0);
          col = pow(col, vec3(1.0));
          col = lin(col);
          hitT = tt;
        }
      }
    }
    if (!cutHit && disc > 0.0) {
      t = b - sqrt(disc);
      pos = rd*t - C; n = normalize(pos); q = n; q.xy = tl*q.xy;
      vec3 alb = lin(planetTex(q));
      float dif = clamp(dot(n, L), 0.0, 1.0);
      float limb = clamp(dot(n, -rd), 0.0, 1.0);
      vec3 c = alb*(dif*1.35 + 0.02)*(0.65 + 0.35*pow(limb, 0.35));
      c += vec3(0.5, 0.42, 0.32)*pow(1.0 - limb, 3.0)*dif*0.25;
      col = c; hitT = t;
    }
  }
  // thin haze at the limb
  float atm = exp(-max(hh, 0.0)*90.0)*smoothstep(-0.01, 0.0, hh);
  vec3 sdir = normalize(C + rd*0.0);
  col += vec3(0.7, 0.6, 0.45)*atm*0.25*clamp(dot(normalize(rd*b - C), L) + 0.3, 0.0, 1.0);
  return col;
}

// ------------------------------------------------------------------ main
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  p += u_shake*vec2(noise2(vec2(gT*25.0, 1.0)) - 0.5, noise2(vec2(gT*21.0, 5.0)) - 0.5)*0.03;
  p *= 1.0 - u_press*0.03*(0.5 + 0.5*sin(gT*2.6));
  float d = u_depth;
  float md = u_md > 0.0 ? u_md : 4.0;
  vec3 ta = vec3(0.0, u_ty, 0.0);
  vec3 ro = ta + vec3(sin(u_orb)*cos(u_look), sin(u_look), cos(u_orb)*cos(u_look))*md;
  vec3 fwd0 = normalize(ta - ro);
  vec3 side = normalize(cross(fwd0, vec3(0.0, 1.0, 0.0)));
  ro += side*u_tx; ta += side*u_tx;
  vec3 rd = camRay(p, ro, ta, u_lens > 0.0 ? u_lens : 1.3);
  vec3 fwd = normalize(ta - ro);
  vec3 rgt = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 upv = cross(rgt, fwd);
  PROBE = vec3(u_px, u_py, u_pz);

  // ---- background
  float bgT;
  vec3 col;
  float fl = smoothstep(0.0, 1.0, max(u_liq, u_metal));
  if (u_space > 0.5) col = space(rd, fwd, upv, bgT);
  else {
    col = atmosphere(rd, d, bgT);
    col += zapBolt(rd, d);
    if (fl > 0.0) col = mix(col, lin(fluid(rd)), fl);
  }
  // environment light for the figure
  float s = sunAt(d);
  vec3 envUp = u_space > 0.5 ? vec3(1.0) : deckCol(d - 10.0, 0.2)*s + glowAt(d)*2.0;
  vec3 envDn = u_space > 0.5 ? vec3(0.35, 0.25, 0.18) : deckCol(d + 15.0, 0.5)*sunAt(d + 20.0)*0.6 + glowAt(d + 30.0)*2.0;
  vec3 fluidL = mix(vec3(1.0, 0.35, 0.1)*0.45, vec3(0.6, 0.7, 0.9)*0.7, u_metal);
  envUp = mix(envUp, fluidL*0.6, fl); envDn = mix(envDn, fluidL, fl);
  float zapL = u_zap*(0.6 + 0.4*hash2(vec2(floor(gT*20.0), 1.0)));

  // ---- figure / probe
  vec3 m = march(ro, rd, 40.0, 0.0);
  if (m.x > 0.0) {
    vec3 pos = ro + rd*m.x;
    vec3 n = calcNormal(pos);
    vec3 alb; float spec = 0.2;
    if (m.y < 1.5) {
      alb = lin(vec3(0.92, 0.92, 0.9));                                     // white suit
      if (length(pos - vec3(0.0, 0.04, 0.44)) < 0.16) {
        alb = lin(vec3(0.85, 0.85, 0.85));
        if (dot(normalize(pos - vec3(0.0, 0.04, 0.44)), normalize(vec3(0.0, -0.6, 0.8))) > 0.35) { alb = lin(vec3(0.75, 0.52, 0.12)); spec = 1.0; } // gold visor
      }
      if (pos.y > 0.11 && abs(pos.z + 0.02) < 0.22 && abs(pos.x) < 0.16) alb = lin(vec3(0.25, 0.27, 0.3)); // backpack
      if (abs(pos.z - 0.1) < 0.025 && pos.y < 0.0) alb = lin(vec3(0.85, 0.35, 0.12));
      if (abs(pos.x) > 0.58) alb = lin(vec3(0.2, 0.2, 0.22));               // gloves
      if (pos.z < -0.93) alb = lin(vec3(0.2, 0.2, 0.22));                   // boots
    } else {
      vec3 q = pos - PROBE;
      alb = lin(vec3(0.62, 0.55, 0.42));                                    // probe shell
      if (q.y > 0.18 && q.y < 0.45) alb = lin(vec3(0.8, 0.78, 0.72));
      if (q.y > 0.7) alb = lin(vec3(0.95, 0.93, 0.88));                     // parachute
      if (q.y > 0.7 && abs(fract(atan(q.z, q.x)*1.2732) - 0.5) < 0.25) alb = lin(vec3(0.9, 0.45, 0.15));
      spec = 0.5;
    }
    float up = 0.5 + 0.5*n.y;
    vec3 c = alb*(envUp*up*1.2 + envDn*(1.0 - up)*0.9 + 0.012);
    // sun key from space
    if (u_space > 0.5) { vec3 L = normalize(vec3(-0.9, 0.35, 0.55)); c = alb*(max(dot(n, L), 0.0)*1.6 + 0.04 + 0.15*(1.0 - up)*vec3(0.9, 0.6, 0.4)); }
    // entry plasma heats the underside
    c += alb*vec3(1.0, 0.55, 0.2)*u_burn*(1.0 - up)*4.0;
    // lightning flash light
    c += alb*vec3(0.75, 0.85, 1.0)*zapL*(0.4 + 0.6*max(dot(n, normalize(vec3(0.6, 0.0, -1.0))), 0.0))*2.0;
    float rim = pow(clamp(1.0 + dot(n, rd), 0.0, 1.0), 3.0);
    c += rim*(envUp*0.35 + vec3(0.03) + vec3(1.0, 0.5, 0.2)*u_burn*1.5);
    vec3 refl = reflect(rd, n);
    c += spec*pow(max(refl.y, 0.0), 8.0)*envUp*0.6;
    col = c;
  }
  // probe beacon
  if (u_probe > 0.01 && u_alive > 0.0) {
    vec3 bp = PROBE + vec3(0.0, 0.64, 0.0);
    vec3 wl = bp - ro; float tl = dot(wl, rd);
    if (tl > 0.0 && (m.x < 0.0 || tl < m.x + 0.05)) {
      float dd = length(wl - rd*tl);
      float blink = step(0.5, fract(gT*1.6));
      col += vec3(1.0, 0.25, 0.15)*u_alive*blink*(0.0004/(dd*dd + 0.0002) + 0.15*exp(-dd*12.0));
    }
  }

  // ---- entry plasma sheath (bow shock below you, streaming up)
  if (u_burn > 0.0) {
    float acc = 0.0;
    float tmax = m.x > 0.0 ? m.x : 12.0;
    for (int i = 0; i < 20; i++) {
      float tt = (float(i) + 0.5 + 0.5*hash2(uv*517.0 + float(i)))*min(tmax, 12.0)/20.0;
      vec3 P = ro + rd*tt;
      // paraboloid shell opening upward, apex 0.5 m below you
      float yy = P.y + 0.55;
      float rr = length(P.xz*vec2(1.0, 0.8));
      float shell = abs(rr - sqrt(max(yy, 0.0))*1.15) ;
      float e = exp(-shell*7.0)*step(0.0, yy)*exp(-yy*0.35);
      float flick = 0.6 + 0.4*noise2(vec2(atan(P.z, P.x)*4.0, P.y*3.0 - gT*14.0));
      acc += e*flick;
    }
    acc *= min(tmax, 12.0)/20.0;
    col += vec3(1.0, 0.5, 0.18)*acc*u_burn*1.6 + vec3(1.0, 0.85, 0.6)*acc*acc*u_burn*0.6;
    // hot glare under the body
    vec3 wl = vec3(0.0, -0.45, 0.1) - ro; float tl = dot(wl, rd);
    if (tl > 0.0) { float dd = length(wl - rd*tl); col += vec3(1.0, 0.7, 0.4)*u_burn*(0.004/(dd*dd + 0.002) + 0.25*exp(-dd*2.5)); }
  }

  // ---- rising cloud particles (ice crystals / droplets / sparks)
  float rise = gT*u_sink;
  float streak = 1.0 + min(u_sink, 14.0)*0.8;
  vec3 pc = mix(vec3(0.9, 0.92, 0.95), vec3(0.85, 0.6, 0.4), smoothstep(12.0, 25.0, d));
  pc = mix(pc, vec3(0.6, 0.75, 0.95), smoothstep(36.0, 46.0, d));
  pc = mix(pc, vec3(1.0, 0.5, 0.2), max(smoothstep(90.0, 160.0, d), u_burn));
  pc = mix(pc, mix(vec3(1.0, 0.45, 0.15), vec3(0.6, 0.8, 1.0), u_metal), fl);
  float pl = (u_space > 0.5 ? 0.0 : 1.0)*(s*1.3 + 0.1 + u_burn + fl*0.8 + zapL);
  if (pl > 0.0) for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float z = 1.3 + fi*fi*0.9 + fi*0.7;
    float tt = z/max(dot(rd, fwd), 0.2);
    if (m.x > 0.0 && tt > m.x) continue;
    vec3 P = ro + rd*tt;
    vec2 g = vec2(dot(P, rgt), P.y - rise*(0.85 + 0.1*fi) + fi*13.7);
    float cs = 0.25 + 0.1*z;
    vec2 gc = g/cs; vec2 gi = floor(gc); vec2 gf = fract(gc) - 0.5;
    float h = hash2(gi + fi*17.0);
    vec2 o = gf - (vec2(hash2(gi + 2.3), hash2(gi + 7.9)) - 0.5)*0.7;
    o.y /= streak;
    float r = (0.008 + 0.012*hash2(gi + 4.4))*(0.7 + 0.15*z)/cs;
    float dt0 = (1.0 - smoothstep(r*0.3, r, length(o)))*step(0.4, h);
    col += dt0*lin(pc)*pl*exp(-tt*0.06)*0.5;
  }

  // ---- pressure vignette
  float rv = length(p*vec2(1.25, 1.0));
  col *= 1.0 - u_press*0.7*smoothstep(0.25, 0.8, rv)*(0.85 + 0.15*sin(gT*2.6));

  // ---- tone map + gamma
  col = col/(1.0 + col*0.4);
  col = pow(max(col, 0.0), vec3(0.4545));

  // ---- depth gauge (right edge), log scale 0 .. 20,000 km
  if (u_gauge > 0.0) {
    float ax = uv.x*1080.0, ay = uv.y*1920.0;
    float x0 = 990.0, x1 = 1012.0, y0 = 420.0, y1 = 1130.0;
    float z = (ay - y0)/(y1 - y0);
    float LG = log(20001.0);
    float g = 0.0; vec3 gc = vec3(0.0);
    if (ax > x0 && ax < x1 && z > 0.0 && z < 1.0) {
      float dm = exp(z*LG) - 1.0;
      vec3 zc = vec3(0.96, 0.93, 0.86);
      zc = mix(zc, vec3(0.75, 0.47, 0.27), step(15.0, dm));
      zc = mix(zc, vec3(0.45, 0.58, 0.78), step(40.0, dm));
      zc = mix(zc, vec3(0.35, 0.14, 0.08), step(85.0, dm));
      zc = mix(zc, vec3(0.85, 0.3, 0.08), step(2000.0, dm));
      zc = mix(zc, vec3(0.7, 0.75, 0.85), step(10000.0, dm));
      gc = zc; g = 0.85;
      if (dm < d) gc = mix(gc, vec3(1.0, 0.85, 0.4), 0.2);
    }
    float frame = (abs(ax - x0) < 1.5 || abs(ax - x1) < 1.5) && z > -0.002 && z < 1.002 ? 1.0 : 0.0;
    frame += (abs(ay - y0) < 1.5 || abs(ay - y1) < 1.5) && ax > x0 - 1.5 && ax < x1 + 1.5 ? 1.0 : 0.0;
    if (frame > 0.0) { gc = vec3(1.0); g = 0.75; }
    // Galileo's last signal (150 km)
    float yG = y0 + (y1 - y0)*log(151.0)/LG;
    if (abs(ay - yG) < 2.0 && ax > x0 - 24.0 && ax < x0 - 3.0) { gc = vec3(1.0, 0.72, 0.45); g = 0.9; }
    float ym = y0 + (y1 - y0)*clamp(log(1.0 + max(d, 0.0))/LG, 0.0, 1.0);
    float mk = smoothstep(3.5, 1.5, abs(ay - ym))*step(x0 - 40.0, ax)*step(ax, x1 + 6.0);
    float tri = step(abs(ay - ym), (x0 - 24.0 - ax)*0.55)*step(x0 - 50.0, ax)*step(ax, x0 - 24.0);
    vec3 acc = vec3(1.0, 0.85, 0.4);
    col = mix(col, gc, g*u_gauge);
    col = mix(col, acc, clamp(max(mk, tri), 0.0, 1.0)*u_gauge);
  }
  return vec4(col, 1.0);
}
