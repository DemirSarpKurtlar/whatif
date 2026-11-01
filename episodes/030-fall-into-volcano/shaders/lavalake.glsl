// lavalake (ep 030): a deep pit crater at night with a lava lake at the bottom (y = 0, centre at origin).
// Crust plates (voronoi) separated by glowing cracks, terraced basalt walls lit orange from below,
// SO2 haze, an (artistically visualised) CO2 layer, heat shimmer, thermal-camera mode and a stylized
// figure in a silver heat suit (adapted from ep 025's jumper).
// params: cx, cy, cz (camera, m; added to the figure position when follow = 1), yaw, pitch, roll, lens, shake, follow,
//         man, fx, fy, fz (figure position, m), pose (0 standing .. 1 spread), froll, ftilt, fyaw,
//         crust (0 molten .. 1 fully crusted), glow (lake light), so2 (yellow haze), co2 (blue low layer),
//         steam (plume), heat (shimmer), therm (thermal camera 0..1), sink (how deep the figure sits, m; visual only),
//         cell (crust plate size, m; 0 = 7.5), ledge (1 = rock outcrop under the figure at the rim)
const float DEP = 240.0;   // rim height above the lake
float h3(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float n3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z); }
vec3 stars(vec3 rd){
  vec2 q = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*110.0;
  vec2 c = floor(q); vec2 f = fract(q)-0.5;
  float h = hash2(c);
  return vec3(h > 0.986 ? smoothstep(0.25,0.0,length(f))*(0.35+0.65*hash2(c+3.0)) : 0.0);
}
// ---------- crater walls + outer slope ----------
float wallR(vec3 p){
  float y = p.y;
  return 118.0 + 0.11*y + 24.0*smoothstep(96.0, 104.0, y) + 9.0*n3(p*0.03) + 3.5*n3(p*0.1);
}
float terr(vec3 p){
  float r = length(p.xz);
  float top = DEP - max(0.0, r - 178.0)*0.24 + 2.5*n3(p*0.04);
  float d = max(wallR(p) - r, p.y - top)*0.62;
  if (u_ledge > 0.5) {   // rock outcrop the figure stands on (top surface at the figure's feet)
    vec3 lq = p - vec3(u_fx, u_fy - 1.25 - 1.6, u_fz + 7.0);
    lq.y += 0.02*lq.z*lq.z*0.1;
    d = min(d, (sdRoundBox(lq, vec3(1.4 + 0.08*lq.z, 1.6, 8.0), 0.5) + 0.7*n3(p*0.6) + 0.25*n3(p*2.1) - 0.45)*0.7);
  }
  return d;
}
vec3 terrN(vec3 p, float e){
  vec2 k = vec2(e, 0.0);
  return normalize(vec3(terr(p+k.xyy)-terr(p-k.xyy), terr(p+k.yxy)-terr(p-k.yxy), terr(p+k.yyx)-terr(p-k.yyx)));
}
// ---------- lake: voronoi crust plates ----------
vec3 vor(vec2 x){ // returns F1, F2-F1, cell id
  vec2 n = floor(x), f = fract(x);
  float d1 = 8.0, d2 = 8.0; float id = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 o = vec2(hash2(n+g), hash2(n+g+17.3));
    o = 0.5 + 0.42*sin(u_time*0.25 + 6.2831*o);
    vec2 r = g + o - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; id = hash2(n+g+3.1); } else if (d < d2) d2 = d;
  }
  return vec3(sqrt(d1), sqrt(d2) - sqrt(d1), id);
}
// emission (linear) and temperature (°C) of the lake surface at xz
vec3 lakeCol(vec2 xz, float dist, out float T){
  vec2 q = xz + vec2(u_time*0.6, u_time*0.25);           // slow drift of the crust
  float cs = u_cell > 0.0 ? u_cell : 7.5;
  vec3 v = vor(q/cs);
  float w = mix(0.2, 0.022, u_crust);                    // crack width (cell units)
  float aa = clamp(dist*0.0005, 0.0, 0.05);               // widen with distance (anti-alias)
  float crack = smoothstep(w + aa + 0.012, w*0.3, v.y);
  vec3 v2 = vor(q/(cs*0.35) + 5.0);
  float fine = smoothstep(0.06 + aa*2.0, 0.0, v2.y)*(1.0 - u_crust*0.55)*smoothstep(70.0, 10.0, dist);
  // molten patches when the crust is thin
  float molten = smoothstep(0.6, 0.9, n3(vec3(q*0.05, u_time*0.05)) + (1.0 - u_crust)*0.55) * (1.0 - u_crust*0.9);
  float wr = n3(vec3(q*vec2(0.9, 2.6), 1.0))*0.6 + n3(vec3(q*3.0, 2.0))*0.4;   // ropy wrinkles
  vec3 crustC = mix(vec3(0.018,0.017,0.019), vec3(0.07,0.068,0.075), wr) * (0.75 + 0.5*v.z);
  float warm = smoothstep(w*4.5 + 0.1, w, v.y);           // dull red next to the cracks
  vec3 col = crustC + vec3(0.55,0.06,0.01)*warm*0.35;
  vec3 hot = mix(vec3(0.75,0.07,0.01)*1.4, vec3(1.0,0.48,0.09)*2.2, crack*crack);
  col = mix(col, hot, clamp(crack + fine*0.7, 0.0, 1.0));
  vec3 melt = mix(vec3(0.55,0.05,0.008), vec3(1.0,0.42,0.07)*1.9, smoothstep(0.25, 0.85, n3(vec3(q*0.4, u_time*0.3))));
  melt = mix(melt, vec3(0.08,0.02,0.01), smoothstep(0.62, 0.7, n3(vec3(q*vec2(0.25,0.7), u_time*0.2 + 4.0)))*0.8);
  col = mix(col, melt, molten);
  float hc = clamp(crack + fine*0.7 + molten, 0.0, 1.0);
  T = mix(380.0 + 120.0*warm, 1120.0, hc);
  return col*mix(0.35, 1.0, u_glow);
}
// ---------- figure (silver heat suit), from ep 025 ----------
vec3 FP = vec3(0.0);
float gPose = 0.0;
mat2 gR1, gR2, gR3;
vec3 figQ(vec3 p){ vec3 q = p - FP; q.xy = gR1*q.xy; q.yz = gR2*q.yz; q.xz = gR3*q.xz; return q; }
vec2 figure(vec3 q){
  float k = gPose;
  float torso = sdCapsule(q, vec3(0.0,-0.22,0.0), vec3(0.0,0.28,0.0), 0.2);
  float hood = sdSphere(q-vec3(0.0,0.6,-0.01), 0.165);
  float neck = sdCapsule(q, vec3(0.0,0.3,0.0), vec3(0.0,0.5,0.0), 0.12);
  float pack = sdRoundBox(q-vec3(0.0,0.06,0.19), vec3(0.15,0.22,0.06), 0.05);
  vec3 aDir = normalize(mix(vec3(0.25,-1.0,0.05), vec3(0.95,0.55,0.15), k));
  vec3 fDir = normalize(mix(vec3(0.1,-1.0,-0.15), vec3(0.35,1.0,0.2), k));
  vec3 qa = q; qa.x = abs(qa.x);
  vec3 sh = vec3(0.22,0.34,0.0), el = sh + aDir*0.3, wr = el + fDir*0.28;
  float arm = min(sdCapsule(qa, sh, el, 0.09), sdCapsule(qa, el, wr, 0.08));
  float glove = sdSphere(qa-wr, 0.08);
  vec3 lDir = normalize(mix(vec3(0.06,-1.0,0.0), vec3(0.42,-1.0,0.12), k));
  vec3 sDir = normalize(mix(vec3(0.0,-1.0,0.0), vec3(0.2,-0.75,0.55), k));
  vec3 hip = vec3(0.11,-0.3,0.0), kn = hip + lDir*0.44, ft = kn + sDir*0.42;
  float leg = min(sdCapsule(qa, hip, kn, 0.105), sdCapsule(qa, kn, ft, 0.09));
  float boot = sdEllipsoid(qa-ft-vec3(0.0,-0.02,-0.06), vec3(0.085,0.075,0.14));
  float suit = smin(smin(torso, neck, 0.06), min(arm, leg), 0.06);
  vec2 r = vec2(suit, 1.0);
  r = opU(r, vec2(hood, 2.0));
  r = opU(r, vec2(pack, 3.0));
  r = opU(r, vec2(min(glove, boot), 4.0));
  return r;
}
vec2 map(vec3 p){ return figure(figQ(p)); }
vec3 iron(float x){
  x = clamp(x, 0.0, 1.0);
  return vec3(smoothstep(0.12, 0.55, x), smoothstep(0.45, 0.88, x), 0.55*smoothstep(0.0, 0.25, x)*(1.0 - smoothstep(0.3, 0.55, x)) + smoothstep(0.82, 1.0, x));
}
vec4 pixel(vec2 uv){
  vec2 p = screenP(uv, 0.0);
  p += u_shake*vec2(noise2(vec2(u_time*23.0,1.0))-0.5, noise2(vec2(u_time*19.0,7.0))-0.5)*0.03;
  if (u_heat > 0.0) p += u_heat*0.006*vec2(noise2(p*vec2(18.0,30.0)+vec2(0.0,-u_time*5.0))-0.5, noise2(p*vec2(22.0,26.0)+vec2(3.0,-u_time*6.0))-0.5);
  p = rot(u_roll)*p;
  FP = vec3(u_fx, u_fy - u_sink, u_fz);
  gPose = u_pose; gR1 = rot(u_froll); gR2 = rot(u_ftilt); gR3 = rot(u_fyaw);
  vec3 ro = vec3(u_cx, u_cy, u_cz) + u_follow*FP;
  vec3 fw = vec3(sin(u_yaw)*cos(u_pitch), sin(u_pitch), -cos(u_yaw)*cos(u_pitch));
  vec3 rd = camRay(p, ro, ro + fw, u_lens > 0.0 ? u_lens : 1.2);
  vec3 glowC = vec3(1.0, 0.36, 0.08)*u_glow;
  // --- sky (night, lit orange over the crater)
  float e = clamp(rd.y, -0.2, 1.0);
  vec3 sky = mix(vec3(0.16,0.07,0.06), vec3(0.012,0.016,0.04), smoothstep(-0.05, 0.55, e)) + stars(rd)*0.6*smoothstep(0.1, 0.4, e);
  sky += vec3(0.5,0.16,0.04)*u_glow*0.25*exp(-max(e,0.0)*5.0);
  vec3 col = sky; float T = -10.0; float tHit = 1e4;
  // --- terrain + lake
  float tl = (rd.y < 0.0 && ro.y > 0.0) ? -ro.y/rd.y : 1e9;
  float tmax = min(tl, 1500.0);
  float t = 0.05; bool hit = false;
  for (int i = 0; i < 120; i++) {
    float h = terr(ro + rd*t);
    if (h < 0.0015*t + 0.002) { hit = true; break; }
    t += max(h, 0.002*t);
    if (t > tmax) break;
  }
  if (hit && t < tmax) {
    tHit = t;
    vec3 pos = ro + rd*t;
    vec3 n = terrN(pos, 0.04 + 0.002*t);
    float r = length(pos.xz);
    float top = DEP - max(0.0, r - 178.0)*0.24;
    float rimK = smoothstep(top - 4.0, top - 0.5, pos.y);   // plateau/outer slope vs crater wall
    // layered basalt: horizontal flow units
    float band = n3(vec3(pos.y*0.16, pos.x*0.02, pos.z*0.02) + vec3(0.0, n3(pos*0.06)*3.0, 0.0));
    float joint = n3(pos*vec3(0.3, 0.025, 0.3));
    vec3 alb = mix(vec3(0.07,0.065,0.065), vec3(0.17,0.14,0.12), smoothstep(0.4, 0.8, band)*0.7 + 0.3*joint);
    alb *= 0.7 + 0.6*n3(pos*0.5)*n3(pos*0.13 + 2.0);
    alb = mix(alb, vec3(0.55,0.48,0.14), smoothstep(0.78, 0.86, n3(pos*0.06 + 4.0))*smoothstep(150.0, 230.0, pos.y)*0.6); // sulfur
    alb = mix(alb, vec3(0.09,0.085,0.085)*(0.55+0.9*n3(pos*0.7)*n3(pos*0.09)), rimK);                    // ash plateau
    vec3 toL = normalize(vec3(-pos.x*0.75, -pos.y - 25.0, -pos.z*0.75));
    float lk = clamp(dot(n, toL), 0.0, 1.0);
    float fall = exp(-pos.y/60.0);
    vec3 li = glowC*(lk*4.0*fall + 0.12*exp(-pos.y/110.0)*(1.0 - rimK));
    li += vec3(0.05,0.065,0.11)*(0.5 + 0.5*n.y)*0.9;                        // night sky
    li += vec3(0.30,0.33,0.42)*(0.3 + 0.5*rimK)*clamp(dot(n, normalize(vec3(-0.5,0.55,0.35))), 0.0, 1.0); // moonlight
    li += vec3(0.6,0.2,0.05)*u_glow*0.25*rimK*smoothstep(260.0, 170.0, r);   // plume glow on the rim
    col = alb*li;
    // incandescent seams low on the wall
    col += vec3(1.0,0.3,0.05)*u_glow*smoothstep(0.93, 0.98, n3(pos*vec3(0.25,0.9,0.25)))*smoothstep(14.0, 0.0, pos.y)*1.5;
    col = mix(col, vec3(0.06,0.03,0.03) + glowC*0.05, clamp((t - 250.0)/1200.0, 0.0, 0.7));
    T = 15.0 + 120.0*lk*fall + 80.0*exp(-pos.y/20.0);
  } else if (tl < 1e8) {
    tHit = tl;
    vec3 pos = ro + rd*tl;
    float LT;
    col = lakeCol(pos.xz, tl, LT);
    // sky/glow sheen on the crust (fresh crust is glassy)
    float fr = pow(1.0 - clamp(-rd.y, 0.0, 1.0), 4.0);
    col += vec3(0.12,0.05,0.03)*fr*u_glow;
    T = LT;
    if (u_man > 0.5 && FP.y < 3.0) {   // body resting on the crust: dark imprint + glowing ring of pressed cracks
      vec2 dq = pos.xz - FP.xz; float de = length(dq*vec2(1.6, 0.85));
      col *= mix(1.0, 0.45, smoothstep(1.5, 0.7, de));
      col += vec3(1.0,0.32,0.05)*0.7*u_glow*smoothstep(0.12, 0.0, abs(de - 1.5 - 0.15*n3(vec3(dq*4.0, 1.0))))*(0.4 + 0.6*n3(vec3(dq*5.0, u_time)));
    }
  }
  // --- figure
  if (u_man > 0.5) {
    vec3 oc = ro - FP; float bb = dot(oc, rd), cc = dot(oc, oc) - 1.7*1.7;
    if (bb*bb - cc > 0.0) {
      float tf = max(-bb - sqrt(bb*bb - cc), 0.0); float tfe = -bb + sqrt(bb*bb - cc);
      bool fh = false; float mid = 0.0;
      for (int i = 0; i < 64; i++) {
        vec2 h = map(ro + rd*tf);
        if (h.x < 0.001) { fh = true; mid = h.y; break; }
        tf += h.x; if (tf > tfe) break;
      }
      if (fh && tf < tHit && (ro + rd*tf).y > 0.0) {
        tHit = tf;
        vec3 pos = ro + rd*tf; vec3 n = calcNormal(pos); vec3 q = figQ(pos);
        vec3 alb = vec3(0.62,0.63,0.66); float met = 1.0;
        if (mid > 1.5 && mid < 2.5) { if (q.z < -0.04 && q.y < 0.7 && q.y > 0.5) { alb = vec3(0.9,0.62,0.16); met = 1.0; } else alb = vec3(0.8,0.8,0.82); }
        else if (mid > 2.5 && mid < 3.5) { alb = vec3(0.3,0.31,0.34); met = 0.3; if (abs(q.y-0.06) < 0.025) alb = vec3(0.85,0.2,0.15); }
        else if (mid > 3.5) { alb = vec3(0.16,0.16,0.17); met = 0.2; }
        if (mid < 1.5 && abs(q.y+0.05) < 0.014) alb *= 0.7;
        vec3 Ld = normalize(vec3(-pos.x*0.3, -max(pos.y, 2.0), -pos.z*0.3));   // light comes up from the lake
        float dif = clamp(dot(n, -Ld)*0.6 + 0.4, 0.0, 1.0);
        float upGlow = 0.35 + 0.65*clamp(-n.y*0.5 + 0.5, 0.0, 1.0);
        float ex = exp(-max(pos.y, 0.0)/120.0);
        vec3 c = alb*(glowC*(dif*upGlow*2.2*ex + 0.25) + vec3(0.07,0.09,0.14)*(0.5 + 0.5*n.y) + vec3(0.12)*clamp(dot(n, -rd), 0.0, 1.0));
        vec3 rf = reflect(rd, n);
        vec3 env = rf.y < 0.0 ? glowC*(1.2*ex + 0.2)*(0.6 + 0.4*n3(rf*6.0)) : vec3(0.03,0.04,0.07);
        c += env*met*0.9*alb;
        c += glowC*0.6*pow(clamp(1.0 + dot(n, rd), 0.0, 1.0), 3.0)*ex;   // orange rim light
        col = c;
        T = 37.0;
      }
    }
  }
  // --- CO2 pooling low in the crater (visualised; real CO2 is invisible)
  if (u_co2 > 0.0) {
    float hC = 32.0 + 1.5*sin(u_time*0.8 + ro.x*0.01);
    float tIn = ro.y > hC ? (rd.y < 0.0 ? (hC - ro.y)/rd.y : 1e9) : 0.0;
    float len = max(0.0, min(tHit, 900.0) - tIn);
    if (len > 0.0) {
      vec3 pin = ro + rd*tIn;
      float wav = n3(vec3(pin.xz*0.04, u_time*0.3));
      float a = (1.0 - exp(-len*0.03))*u_co2;
      vec3 cc2 = mix(vec3(0.10,0.45,0.75), vec3(0.35,0.75,1.0), wav);
      col = mix(col, cc2*0.5 + col*0.25, clamp(a, 0.0, 0.85));
      if (ro.y > hC) col += vec3(0.2,0.55,0.9)*u_co2*0.35*smoothstep(0.62, 0.7, wav)*smoothstep(0.0, 0.02, len);
    }
  }
  // --- gas / steam volume inside the crater
  if (u_so2 + u_steam > 0.0) {
    float t1 = min(tHit, 700.0);
    float dt = t1/14.0; float acc = 0.0; vec3 gc = vec3(0.0);
    for (int i = 0; i < 14; i++) {
      float ts = dt*(float(i) + hash2(uv*u_resolution + float(i)));
      vec3 sp = ro + rd*ts;
      float rr = length(sp.xz);
      if (sp.y < DEP + 80.0 && rr < 200.0) {
        float nn = n3(sp*0.018 + vec3(0.0, -u_time*0.35, 0.0))*0.6 + n3(sp*0.05 + vec3(u_time*0.1, -u_time*0.8, 0.0))*0.4;
        float d = u_so2*smoothstep(DEP + 80.0, 20.0, sp.y)*smoothstep(0.3, 0.8, nn)*smoothstep(200.0, 120.0, rr)
                + u_steam*0.5*exp(-rr*rr/(60.0*60.0))*smoothstep(0.4, 0.8, nn)*smoothstep(0.0, 40.0, sp.y);
        if (d > 0.001) {
          vec3 c = mix(glowC*0.9 + vec3(0.1,0.06,0.03), vec3(0.16,0.13,0.1), smoothstep(0.0, DEP, sp.y));
          c = mix(c, vec3(0.42,0.38,0.12) + glowC*0.25, clamp(u_so2, 0.0, 1.0)*0.7);
          float a = d*dt*0.009;
          gc += c*a*(1.0 - acc); acc += a*(1.0 - acc);
        }
      }
    }
    col = mix(col, gc/max(acc, 1e-3), clamp(acc, 0.0, 0.85));
  }
  // --- tone map
  col = 1.0 - exp(-col*1.35);
  col = pow(max(col, 0.0), vec3(0.4545));
  // --- thermal camera
  if (u_therm > 0.0) {
    vec3 th = iron(pow(max(T + 20.0, 0.0)/1160.0, 0.55));
    th += 0.06*(hash2(uv*u_resolution*0.5 + floor(u_time*12.0)) - 0.5);
    col = mix(col, th, u_therm);
  }
  return vec4(col, 1.0);
}
