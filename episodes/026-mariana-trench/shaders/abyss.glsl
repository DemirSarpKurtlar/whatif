// Underwater descent, body POV. Units: metres. The diver ("you") hangs at the origin, feet down, sinking.
// params: u_depth (metres below the surface; drives light, colour, sun rays, gauge), u_look (camera pitch, + = look up),
// u_dist (camera distance), u_orb (camera azimuth, rad), u_sink (marine-snow rise speed, m/s), u_lamp (0..1 head lamp),
// u_aim (lamp yaw, rad), u_wreck (0..1 Titanic bow beside you), u_floor (0..1 seabed rises under your feet),
// u_shrimp (0..1 amphipods crawling on the seabed), u_press (0..1 pressure squeeze), u_gauge (0..1 depth gauge),
// u_ty (look-at height offset), u_tz (look-at z offset), u_tx (look-at sideways offset; + puts the diver left of centre)
float gT = 0.0;
vec3 LP; vec3 LD; float AMB; vec3 HUE;

float sdDiver(vec3 p){
  p.xy = rot(0.06*sin(gT*0.7))*p.xy;
  vec3 ll = vec3(abs(p.x), p.y, p.z);
  float sw = 0.04*sin(gT*0.9);
  float thigh = sdCapsule(ll, vec3(0.1,-0.17,0.0), vec3(0.13,-0.52,0.09 + sw), 0.088);
  float shin = sdCapsule(ll, vec3(0.13,-0.52,0.09 + sw), vec3(0.14,-0.85,-0.03), 0.07);
  float fins = sdRoundBox(ll - vec3(0.15,-0.98,-0.05), vec3(0.07,0.13,0.008), 0.012);
  float torso = sdRoundBox(p - vec3(0.0,0.1,0.0), vec3(0.12,0.22,0.06), 0.085);
  float upper = sdCapsule(ll, vec3(0.19,0.36,0.0), vec3(0.31,0.56,0.06), 0.062);
  float fore = sdCapsule(ll, vec3(0.31,0.56,0.06), vec3(0.35,0.8 + 0.03*sin(gT*1.1),0.1), 0.052);
  float hand = sdSphere(ll - vec3(0.355,0.85,0.1), 0.05);
  float head = sdSphere(p - vec3(0.0,0.58,0.02), 0.13);
  float lamp = sdCylinder((p - vec3(0.0,0.66,0.13)).xzy, 0.035, 0.04);
  float tank = sdCapsule(p, vec3(0.0,-0.05,-0.2), vec3(0.0,0.38,-0.2), 0.1);
  float arms = min(min(upper, fore), hand);
  return min(min(min(min(thigh, shin), fins), min(torso, arms)), min(min(head, lamp), tank));
}
// Titanic-like bow. Local: stem tip at origin pointing +x, deck at y = 0, keel at y = -3.6.
float sdBow(vec3 q){
  float sx = q.x + 0.42*q.y;                       // raked stem
  float w = 2.0*sqrt(clamp(-sx/9.0, 0.0, 1.0));
  float hull = max(max(abs(q.z) - w, q.y), max(-(q.y + 3.6), max(sx, -(q.x + 40.0))));
  hull *= 0.55;
  float rail = length(vec2(abs(q.z) - w + 0.05, q.y - 0.9)) - 0.045;
  float px = mod(q.x, 0.9) - 0.45;
  float post = max(length(vec2(px, abs(q.z) - w + 0.05)) - 0.035, abs(q.y - 0.45) - 0.45);
  float rails = max(min(rail, post), max(sx + 0.1, -(q.x + 40.0)));
  float mast = sdCapsule(q, vec3(-7.0, 0.35, 0.9), vec3(-17.0, 0.6, -1.4), 0.2);
  float winch = sdRoundBox(q - vec3(-4.5, 0.35, 0.0), vec3(0.5, 0.35, 0.8), 0.08);
  float house = sdRoundBox(q - vec3(-12.0, 0.9, 0.0), vec3(1.5, 0.9, 1.7), 0.1);
  return min(min(hull, rails), min(mast, min(winch, house)));
}
vec3 bowLocal(vec3 p){
  vec3 w = p - vec3(1.6, -2.4, -4.0);
  vec3 dd = normalize(vec3(-0.55, 0.0, 1.0)); vec3 ss = vec3(-dd.z, 0.0, dd.x);
  vec3 q = vec3(dot(w, dd), w.y, dot(w, ss));
  q.xy = rot(-0.04)*q.xy;
  return q;
}
vec2 map(vec3 p){
  vec2 r = vec2(sdDiver(p), 1.0);
  if (u_wreck > 0.01) r = opU(r, vec2(sdBow(bowLocal(p)), 4.0));
  return r;
}
vec3 waterHue(float d){
  vec3 a = vec3(0.10,0.62,0.70), b = vec3(0.03,0.30,0.55), c = vec3(0.01,0.10,0.30);
  return mix(mix(a, b, smoothstep(0.0, 60.0, d)), c, smoothstep(60.0, 400.0, d));
}
float beamAt(vec3 s){
  vec3 v = s - LP; float al = dot(v, LD);
  if (al <= 0.0) return 0.0;
  float pp = dot(v, v) - al*al;
  float cone = 1.0 - smoothstep(pow(0.08*al + 0.02, 2.0), pow(0.3*al + 0.06, 2.0), pp);
  return cone*exp(-al*0.16);
}
vec3 bgCol(vec3 rd){
  float up = smoothstep(-0.7, 0.9, rd.y);
  vec3 c = HUE*AMB*(0.18 + 1.1*up*up);
  return c + vec3(0.0004,0.0012,0.003);
}
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  p *= 1.0 - u_press*0.035*(0.5 + 0.5*sin(gT*2.6));
  float d = max(u_depth, 0.0);
  AMB = exp(-d/140.0);
  HUE = lin(waterHue(d));
  float dist = u_dist > 0.0 ? u_dist : 5.5;
  vec3 ta0 = vec3(0.0, 0.05 + u_ty, u_tz);
  vec3 ro = ta0 + vec3(sin(u_orb)*cos(u_look)*dist, -sin(u_look)*dist, cos(u_orb)*cos(u_look)*dist);
  vec3 side = normalize(cross(normalize(ta0 - ro), vec3(0.0,1.0,0.0)));
  vec3 ta = ta0 + side*u_tx;
  ro += side*u_tx;
  vec3 rd = camRay(p, ro, ta, 1.25);
  vec3 fwd = normalize(ta - ro);
  vec3 rgt = normalize(cross(fwd, vec3(0.0,1.0,0.0)));
  // head lamp
  LP = vec3(0.0, 0.66, 0.14);
  LD = normalize(vec3(sin(u_aim)*0.85, -0.55, cos(u_aim)*0.85));
  float lamp = u_lamp;

  // ---- geometry
  float FY = mix(-40.0, -1.1, u_floor);
  vec3 m = march(ro, rd, 60.0, 0.0);
  float tHit = m.x > 0.0 ? m.x : 1e9;
  float tf = rd.y < 0.0 && u_floor > 0.01 ? (FY - ro.y)/rd.y : 1e9;
  vec3 col = bgCol(rd);
  // surface + Snell's window when shallow
  if (rd.y > 0.0 && d < 60.0) {
    float ts = (d + 0.0 - ro.y)/rd.y;
    if (ts > 0.0 && ts < tHit) {
      vec3 sp = ro + rd*ts;
      float win = smoothstep(0.6, 0.72, rd.y);
      vec2 w = sp.xz*0.35 + vec2(gT*0.15, gT*0.1);
      float rip = noise2(w*2.0)*0.6 + noise2(w*5.0 + 3.0)*0.4;
      float caus = pow(1.0 - abs(rip - 0.5)*2.0, 6.0);
      vec3 sc = mix(lin(vec3(0.35,0.75,0.85)), lin(vec3(0.92,0.98,1.0)), win);
      sc += caus*0.35*win + pow(max(dot(rd, normalize(vec3(0.25,1.0,-0.1))), 0.0), 220.0)*4.0;
      sc *= 0.55 + 0.45*rip;
      float att = exp(-ts*0.045);
      col = mix(col, sc*0.85, att*smoothstep(60.0, 5.0, d));
    }
  }
  // sun rays from above (screen-space shafts converging upward)
  float sunAmt = exp(-d/110.0)*(1.0 - smoothstep(500.0, 900.0, d));
  if (sunAmt > 0.002) {
    vec2 c0 = vec2(0.18, 1.3 - u_look*1.4);
    vec2 v = p - c0;
    float ang = atan(v.x, -v.y);
    float sh = noise2(vec2(ang*22.0, gT*0.25)) * noise2(vec2(ang*9.0 + 4.0, gT*0.17 + 2.0));
    sh = smoothstep(0.12, 0.55, sh);
    float fall = smoothstep(-0.9, 0.6, p.y + u_look*0.8);
    col += HUE*sh*fall*sunAmt*0.55*(m.x > 0.0 ? 0.6 : 1.0);
  }

  // ---- floor
  float tS = min(tHit, tf);
  if (tf < tHit && tf > 0.0) {
    vec3 F = ro + rd*tf;
    vec2 fz = F.xz;
    float hN = noise2(fz*1.3)*0.6 + noise2(fz*4.0)*0.3 + noise2(fz*11.0)*0.1;
    vec3 n = normalize(vec3((noise2(fz*1.3 + vec2(0.05,0.0)) - noise2(fz*1.3))*6.0, 1.0, (noise2(fz*1.3 + vec2(0.0,0.05)) - noise2(fz*1.3))*6.0));
    vec3 alb = lin(mix(vec3(0.62,0.58,0.5), vec3(0.78,0.74,0.64), hN));
    // xenophyophore lumps
    vec2 xc = fz*0.8; vec2 xi = floor(xc); vec2 xf = fract(xc) - 0.5;
    if (hash2(xi + 11.0) > 0.8) {
      float lr = length(xf - (vec2(hash2(xi), hash2(xi + 5.0)) - 0.5)*0.4);
      float lump = smoothstep(0.12, 0.08, lr + 0.03*noise2(fz*25.0));
      alb = mix(alb, lin(vec3(0.72,0.6,0.42))*(0.6 + 0.6*noise2(fz*30.0)), lump);
      n = normalize(mix(n, normalize(vec3(xf, 0.4)), lump*0.6));
    }
    // amphipods crawling toward the light
    if (u_shrimp > 0.0) {
      for (int k = 0; k < 1; k++) {
        float sc = 2.6;
        vec2 g = fz*sc + vec2(float(k)*7.3, 0.0);
        vec2 gi = floor(g); float hs = hash2(gi + 3.1);
        if (hs > 0.62) {
          vec2 c = gi + 0.5 + (vec2(hash2(gi + 1.7), hash2(gi + 9.2)) - 0.5)*0.5;
          vec2 tow = normalize(-c/sc + vec2(0.0001));
          float ph = gT*0.35 + hs*10.0;
          c += tow*sc*0.12*sin(ph);
          vec2 o = g - c;
          float a = atan(tow.y, tow.x);
          o = rot(a)*o;                                 // body along x
          o.y += 0.12*o.x*o.x;                          // curled body
          float body = length(o*vec2(2.6, 7.5)) - 1.0;
          float seg = 0.5 + 0.5*sin(o.x*55.0);
          float ant = min(length(vec2(o.x - 0.5 - 0.12*abs(o.y)*0.0, o.y - 0.06*sin(o.x*6.0 + gT*3.0)) - vec2(0.0, 0.07)) , 1.0);
          float legs = (abs(o.y) < 0.18 && abs(o.x) < 0.22) ? smoothstep(0.02, 0.0, abs(fract(o.x*18.0) - 0.5)*0.055 - 0.004) : 0.0;
          float sh = smoothstep(0.08, -0.05, body);
          float antenna = smoothstep(0.012, 0.0, abs(o.y - 0.05*(o.x - 0.38)) - 0.002)*step(0.36, o.x)*step(o.x, 0.6);
          antenna += smoothstep(0.012, 0.0, abs(o.y + 0.05*(o.x - 0.38)) - 0.002)*step(0.36, o.x)*step(o.x, 0.6);
          float shadow = smoothstep(0.35, -0.2, length((o - vec2(-0.03, -0.06))*vec2(2.6, 6.0)) - 1.0);
          alb *= 1.0 - 0.35*shadow*u_shrimp;
          vec3 sCol = lin(mix(vec3(0.95,0.86,0.82), vec3(0.98,0.7,0.62), seg*0.5))*(0.75 + 0.35*(1.0 - abs(o.y)*6.0));
          alb = mix(alb, sCol*1.25, clamp(sh + 0.6*legs*smoothstep(0.3, 0.1, abs(o.y)) + antenna*0.8, 0.0, 1.0)*u_shrimp);
          if (o.x > 0.27 && o.x < 0.33 && abs(o.y - 0.02) < 0.02) alb *= mix(1.0, 0.15, u_shrimp);
        }
      }
    }
    vec3 v = F - LP; float ld = length(v); vec3 l = -v/ld;
    float spot = smoothstep(0.7, 0.96, dot(-l, LD));
    float dif = max(dot(n, l), 0.0);
    vec3 lampC = lin(vec3(1.0,0.93,0.82));
    vec3 c = alb*(lampC*lamp*spot*dif*9.0/(1.0 + ld*ld*0.35) + HUE*AMB*0.9*n.y + vec3(0.0015,0.002,0.003));
    float fog = 1.0 - exp(-tf*mix(0.03, 0.06, smoothstep(0.0, 800.0, d)));
    col = mix(c, col, fog);
  } else if (m.x > 0.0) {
    vec3 pos = ro + rd*m.x;
    vec3 n = calcNormal(pos);
    vec3 alb;
    if (m.y < 2.0) {
      float hd = length(pos - vec3(0.0,0.6,0.02));
      float tk = length(pos.xz - vec2(0.0,-0.21));
      alb = lin(vec3(0.95,0.48,0.12));
      if (pos.y < -0.2) alb = lin(vec3(0.12,0.13,0.16));
      if (hd < 0.15) alb = lin(vec3(0.08,0.09,0.11));
      if (hd < 0.15 && pos.z > 0.08 && pos.y > 0.56) alb = lin(vec3(0.25,0.45,0.55));
      if (tk < 0.115 && pos.y > -0.08 && pos.y < 0.48) alb = lin(vec3(0.75,0.78,0.82));
      if (pos.y < -0.84) alb = lin(vec3(0.95,0.8,0.12));
      if (length(pos - vec3(0.0,0.66,0.15)) < 0.06) alb = lin(vec3(0.85,0.85,0.8));
    } else {
      vec3 q = bowLocal(pos);
      float rust = noise2(vec2(q.x*1.7, q.y*2.0 + q.z)) * 0.6 + noise2(vec2(q.x*9.0, q.y*9.0))*0.4;
      alb = lin(mix(vec3(0.13,0.07,0.05), vec3(0.4,0.19,0.09), rust));
      alb *= 0.7 + 0.6*smoothstep(0.55, 0.85, noise2(vec2(q.x*14.0, q.y*1.2 + q.z)));  // rusticles
      if (q.y > -0.05 && abs(q.z) < 1.8) alb *= 0.8;
    }
    vec3 v = pos - LP; float ld = length(v); vec3 l = -v/max(ld, 1e-3);
    float spot = smoothstep(0.62, 0.95, dot(-l, LD));
    float dif = max(dot(n, l), 0.0);
    vec3 lampC = lin(vec3(1.0,0.93,0.82));
    float up = 0.5 + 0.5*n.y;
    vec3 c = alb*(HUE*AMB*(0.25 + 1.4*up) + lampC*lamp*spot*dif*10.0/(1.0 + ld*ld*0.18));
    // self-glow from the lamp spill so the diver never vanishes
    if (m.y < 2.0) {
      vec3 kd = normalize(ro - pos + vec3(1.5, 2.5, 0.0));
      c += alb*lampC*lamp*(0.004 + 0.045*max(dot(n, kd), 0.0)) + alb*HUE*0.02 + lampC*lamp*0.05*pow(clamp(1.0 + dot(n, rd), 0.0, 1.0), 2.5);
    }
    else { vec3 q2 = bowLocal(pos); c += (lin(vec3(0.16,0.2,0.24))*(0.35 + 0.65*up)*0.22 + alb*0.5)*smoothstep(-4.8, 0.8, q2.y); }   // ghostly fill on the wreck
    float rim = pow(clamp(1.0 + dot(n, rd), 0.0, 1.0), 3.0);
    c += rim*HUE*(AMB*0.6 + 0.02);
    float fog = 1.0 - exp(-m.x*mix(0.03, 0.012, smoothstep(0.0, 800.0, d)));
    if (m.y > 2.0) { fog = 1.0 - exp(-m.x*0.035); c *= u_wreck; }
    col = mix(c, col, fog);
  }

  // ---- volumetric lamp beam + glare
  if (lamp > 0.0) {
    float tmax = min(tS, 22.0); float acc = 0.0; float dt = tmax/24.0;
    for (int i = 0; i < 24; i++) {
      vec3 s = ro + rd*(dt*(float(i) + 0.5 + 0.5*hash2(uv*733.0 + float(i))));
      acc += beamAt(s)*dt;
    }
    col += lin(vec3(0.8,0.92,1.0))*acc*0.022*lamp;
    vec3 wl = LP - ro; float tl = dot(wl, rd);
    if (tl > 0.0 && tl < tHit + 0.05) {
      float dd = length(wl - rd*tl);
      float face = 0.35 + 0.65*max(dot(-rd, LD), 0.0);
      col += lin(vec3(1.0,0.95,0.85))*lamp*face*(0.0015/(dd*dd + 0.0008) + 0.04*exp(-dd*5.0));
    }
  }

  // ---- marine snow (5 layers) + bioluminescence
  float rise = gT*u_sink;
  float streak = 1.0 + min(u_sink, 12.0)*0.9;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float z = 1.2 + fi*fi*0.85 + fi*0.6;
    float tt = z/max(dot(rd, fwd), 0.2);
    if (tt > tS) continue;
    vec3 P = ro + rd*tt;
    vec2 g = vec2(dot(P, rgt), P.y - rise*(0.85 + 0.08*fi) + fi*13.7);
    float cs = 0.22 + 0.09*z;
    vec2 gc = g/cs; vec2 gi = floor(gc); vec2 gf = fract(gc) - 0.5;
    float h = hash2(gi + fi*17.0);
    vec2 o = gf - (vec2(hash2(gi + 2.3), hash2(gi + 7.9)) - 0.5)*0.7;
    o.y /= streak;
    o.x += 0.05*sin(gT*0.8 + h*30.0);
    float r = (0.008 + 0.014*hash2(gi + 4.4))*(0.7 + 0.15*z)/cs;
    float dot0 = (1.0 - smoothstep(r*0.3, r, length(o)))*step(0.35, h);
    float lit = AMB*1.4 + lamp*beamAt(P)*5.0 + 0.004;
    col += dot0*lin(vec3(0.85,0.92,0.95))*lit*exp(-tt*0.05)*0.6;
    if (d > 600.0 && h > 0.965) {
      float fl = pow(0.5 + 0.5*sin(gT*2.2 + h*90.0), 6.0);
      vec3 bc = mix(lin(vec3(0.2,0.9,1.0)), lin(vec3(0.3,1.0,0.6)), hash2(gi + 0.7));
      col += bc*(1.0 - smoothstep(0.0, r*1.2, length(o*vec2(1.0, min(streak, 3.0)))))*fl*0.9*smoothstep(600.0, 1100.0, d);
    }
  }

  // ---- pressure vignette
  float rv = length(p*vec2(1.25, 1.0));
  col *= 1.0 - u_press*0.75*smoothstep(0.25, 0.75, rv)*(0.85 + 0.15*sin(gT*2.6));

  // ---- tone map + gamma
  col = col/(1.0 + col*0.35);
  col = pow(max(col, 0.0), vec3(0.4545));

  // ---- depth gauge (right edge): 0 m at top, 11,000 m at bottom
  if (u_gauge > 0.0) {
    float ax = uv.x*1080.0, ay = uv.y*1920.0;
    float x0 = 990.0, x1 = 1012.0, y0 = 400.0, y1 = 1130.0;
    float z = (ay - y0)/(y1 - y0);
    float g = 0.0; vec3 gc = vec3(0.0);
    if (ax > x0 && ax < x1 && z > 0.0 && z < 1.0) {
      float dm = z*11000.0;
      vec3 zc = mix(vec3(0.25,0.8,0.85), vec3(0.06,0.32,0.6), smoothstep(0.0, 250.0, dm));
      zc = mix(zc, vec3(0.03,0.06,0.14), smoothstep(250.0, 1000.0, dm));
      gc = zc; g = 0.85;
      if (dm < u_depth) { gc = mix(gc, vec3(1.0, 0.85, 0.4), 0.18); }
    }
    float frame = (abs(ax - x0) < 1.5 || abs(ax - x1) < 1.5) && z > -0.002 && z < 1.002 ? 1.0 : 0.0;
    frame += (abs(ay - y0) < 1.5 || abs(ay - y1) < 1.5) && ax > x0 - 1.5 && ax < x1 + 1.5 ? 1.0 : 0.0;
    if (frame > 0.0) { gc = vec3(1.0); g = 0.75; }
    // ticks every 1,000 m
    float tk = z*11.0; float tf2 = abs(fract(tk + 0.5) - 0.5)*(y1 - y0)/11.0;
    if (z > -0.001 && z < 1.001 && tf2 < 1.4 && ax > x0 - 16.0 && ax < x0 - 3.0) { gc = vec3(1.0); g = 0.6; }
    // Titanic (3,800 m) and bottom (10,935 m) marks
    float yT = y0 + (y1 - y0)*3800.0/11000.0;
    if (abs(ay - yT) < 2.0 && ax > x0 - 24.0 && ax < x0 - 3.0) { gc = vec3(1.0,0.72,0.45); g = 0.85; }
    // current depth marker
    float ym = y0 + (y1 - y0)*clamp(u_depth/11000.0, 0.0, 1.0);
    float mk = smoothstep(3.5, 1.5, abs(ay - ym))*step(x0 - 40.0, ax)*step(ax, x1 + 6.0);
    float tri = step(abs(ay - ym), (x0 - 24.0 - ax)*0.55)*step(x0 - 50.0, ax)*step(ax, x0 - 24.0);
    float glow = exp(-abs(ay - ym)*0.12)*step(x0 - 4.0, ax)*step(ax, x1 + 4.0)*0.35;
    vec3 acc = vec3(1.0, 0.85, 0.4);
    col = mix(col, gc, g*u_gauge);
    col = mix(col, acc, clamp(max(mk, tri), 0.0, 1.0)*u_gauge);
    col += acc*glow*u_gauge;
  }
  return vec4(col, 1.0);
}
