// parkstorm: the park set (from park/park2g) at night in a thunderstorm.
// u_cam/rise/tilt/panx/yaw/zoom/shake: camera · u_rain: rain · u_flash: sky+scene flash · u_dark: heart-stop vignette
// u_bolt: main bolt intensity, strike point (u_bx,u_by,u_bz), u_seed: bolt shape, u_heat: hotter/whiter, wider glow
// u_you: show "you" (yellow raincoat, back to camera) · u_hair: hair standing on end · u_glow: current flashing over the skin
// u_side: side flash from the lone tree to the person under it · u_rings: ground-current rings, u_ripple: ring radius 0..1
float gGround = 1.0;
float gT = 0.0;
vec3 FC = vec3(3.2, 0.0, -7.5);
vec3 HP = vec3(0.05, 0.0, 0.3);     // you
vec3 LT = vec3(-3.6, 0.0, -6.0);    // lone tree
vec3 TP = vec3(-2.55, 0.0, -5.4);   // person under the tree

vec2 human(vec3 q, float sw, float flail, float idB, float idL, float idH){
  float legs = min(sdCapsule(q, vec3(0.08,0.52,0.0), vec3(0.08,0.06,sw), 0.09), sdCapsule(q, vec3(-0.08,0.52,0.0), vec3(-0.08,0.06,-sw), 0.09));
  float body = sdCapsule(q, vec3(0.0,0.7,0.0), vec3(0.0,1.15,0.0), 0.2);
  vec3 ha = vec3(0.3+0.25*flail, 0.72+0.7*flail, -sw);
  float arms = min(sdCapsule(q, vec3(0.22,1.12,0.0), ha, 0.065), sdCapsule(q, vec3(-0.22,1.12,0.0), vec3(-ha.x,ha.y,sw), 0.065));
  float head = sdSphere(q-vec3(0.0,1.47,0.0), 0.15);
  vec2 res = opU(vec2(legs, idL), vec2(smin(body,arms,0.05), idB));
  return opU(res, vec2(head, idH));
}
vec2 people(vec3 p){
  vec3 bq = abs(p - vec3(0.0, 1.6, -11.7)) - vec3(15.8, 1.8, 9.3);
  float bb = length(max(bq,0.0));
  if (bb > 0.4) return vec2(bb, 0.0);
  vec2 cs = vec2(2.6);
  vec2 cid = floor(p.xz/cs);
  vec2 f = abs(mod(p.xz,cs)-1.3);
  float bnd = (1.3-max(f.x,f.y)) + 0.5;
  vec2 res = vec2(bnd, 0.0);
  float hh = hash2(cid);
  vec2 cc = cid*2.6+1.3;
  bool nearTree = length(cc - LT.xz) < 3.6 || length(cc - HP.xz) < 4.2;
  if (hh > 0.72 && !nearTree && abs(cid.x) < 6.0 && cid.y > -8.0 && cid.y < -1.0) {
    vec2 j = (vec2(hash2(cid+7.1), hash2(cid+3.3))-0.5)*1.0;
    vec3 q = vec3(mod(p.x,cs.x)-1.3-j.x, p.y, mod(p.z,cs.y)-1.3-j.y);
    float ph = gT*5.0+hash2(cid+2.0)*6.28;
    float sw = 0.16*sin(ph);
    res = human(q, sw, 0.15, 4.0, 5.0, 6.0);
    res.x = min(res.x*0.9, bnd);
  }
  return res;
}
vec2 you(vec3 p){
  vec3 q = p - HP;
  float bs = length(q - vec3(0.0,0.95,0.0)) - 1.25;
  if (bs > 0.3) return vec2(bs, 0.0);
  vec2 r = human(q, 0.0, 0.0, 10.0, 5.0, 11.0);
  // hair cap (seen from behind) + spikes when the hair stands on end
  vec3 hq = q - vec3(0.0,1.5,0.025);
  float cap = sdEllipsoid(hq, vec3(0.158,0.13,0.155));
  float hs = u_hair;
  if (hs > 0.01) {
    for (int i=0;i<9;i++){
      float fi = float(i);
      float a = fi*2.39996;
      float el = 0.35+0.55*hash2(vec2(fi,3.0));
      vec3 d = normalize(vec3(cos(a)*el, 1.0, sin(a)*el*0.8+0.25));
      float wob = 0.02*sin(gT*14.0+fi*1.7)*hs;
      float L = (0.05+0.13*hs)*(0.7+0.5*hash2(vec2(fi,8.0)));
      cap = min(cap, sdCapsule(hq, d*0.1, d*(0.1+L)+vec3(wob,0.0,0.0), 0.022*(1.0-0.3*hs)));
    }
  }
  r = opU(r, vec2(cap*0.9, 12.0));
  return r;
}
vec2 trees(vec3 p){
  vec3 q = p; q.z += 23.0;
  float bt = max(abs(q.z)-4.5, q.y-5.5);
  if (bt > 0.5) return vec2(bt, 2.0);
  float cx = floor((q.x+2.5)/5.0);
  q.x = mod(q.x+2.5,5.0)-2.5;
  q.z += (hash2(vec2(cx,1.0))-0.5)*4.0;
  float s = 0.8+0.5*hash2(vec2(cx,2.0));
  float sway = 0.12*sin(gT*1.7+cx);
  float can = sdEllipsoid(q-vec3(sway,2.7*s,0.0), vec3(1.7,1.5,1.7)*s);
  float tr = sdCylinder(q-vec3(0.0,0.8,0.0), 0.9, 0.17);
  return opU(vec2(can*0.9, 2.0), vec2(tr, 3.0));
}
vec2 loneTree(vec3 p){
  vec3 q = p - LT;
  float bs = length(q - vec3(0.0,2.8,0.0)) - 3.6;
  if (bs > 0.3) return vec2(bs, 2.0);
  float sway = 0.15*sin(gT*1.9);
  float can = sdEllipsoid(q-vec3(sway,3.6,0.0), vec3(2.3,1.9,2.3));
  can = smin(can, sdEllipsoid(q-vec3(0.9+sway,3.0,0.4), vec3(1.3,1.1,1.3)), 0.4);
  float tr = sdCapsule(q, vec3(0.0,0.0,0.0), vec3(0.05,2.6,0.0), 0.26);
  tr = min(tr, sdCapsule(q, vec3(0.0,1.9,0.0), vec3(0.8,2.9,0.3), 0.12));
  return opU(vec2(can*0.9, 2.0), vec2(tr, 3.0));
}
vec2 fountain(vec3 p){
  vec3 q = p - FC;
  float bs = length(q-vec3(0.0,1.6,0.0)) - 3.2;
  if (bs > 0.3) return vec2(bs, 7.0);
  float rim = sdTorus(q-vec3(0.0,0.42,0.0), vec2(1.55,0.16));
  float basin = sdCylinder(q-vec3(0.0,0.2,0.0), 0.2, 1.6);
  vec2 r = vec2(min(rim, basin), 7.0);
  float w = sdCylinder(q-vec3(0.0,0.38,0.0), 0.02, 1.45);
  float pillar = sdCylinder(q-vec3(0.0,0.6,0.0), 0.35, 0.22);
  r = opU(r, vec2(pillar, 7.0));
  w = min(w, sdCapsule(q, vec3(0.0,0.4,0.0), vec3(0.0,2.3,0.0), 0.11));
  for (int i=0;i<4;i++){
    float a = float(i)*1.5708;
    vec3 d = vec3(cos(a),0.0,sin(a));
    w = min(w, sdCapsule(q, vec3(0.0,2.2,0.0)+d*0.2, vec3(0.0,1.2,0.0)+d*1.0, 0.07));
    w = min(w, sdCapsule(q, vec3(0.0,1.2,0.0)+d*1.0, vec3(0.0,0.45,0.0)+d*1.2, 0.07));
  }
  return opU(r, vec2(w, 8.0));
}
vec2 map(vec3 p){
  vec2 r = vec2(1e9, 0.0);
  if (gGround > 0.5) r = vec2(p.y, 0.0);
  r = opU(r, people(p));
  r = opU(r, trees(p));
  r = opU(r, loneTree(p));
  r = opU(r, fountain(p));
  r = opU(r, human(p - TP, 0.0, 0.0, 13.0, 5.0, 6.0));
  if (u_you > 0.5) r = opU(r, you(p));
  return r;
}
// ---- storm sky
vec3 skyCol(vec3 rd){
  vec3 hor = vec3(70.0,78.0,94.0)/255.0, top = vec3(22.0,25.0,34.0)/255.0;
  float e = clamp(rd.y,0.0,1.0);
  vec3 c = mix(hor, top, pow(e,0.5));
  vec2 cp = rd.xz/(rd.y+0.12)*1.6 + vec2(gT*0.06, 0.0);
  float n = noise2(cp*0.9)*0.5 + noise2(cp*2.1+3.0)*0.3 + noise2(cp*5.3)*0.2;
  float lo = smoothstep(0.3,0.75,n);
  c = mix(c*0.6, c*1.35+vec3(0.02,0.02,0.03), lo);
  // clouds lit from inside by the flash
  float fl = u_flash;
  c += vec3(0.62,0.62,0.85)*fl*(0.35+0.9*lo)*smoothstep(-0.05,0.25,rd.y);
  return c;
}
vec3 skyline(vec3 rd, vec3 base, out float hit){
  float az = atan(rd.x, -rd.z);
  float el = rd.y;
  float w = 0.045;
  float cid = floor(az/w);
  float hh = hash2(vec2(cid, 3.0));
  float h = 0.035 + 0.11*hh*hh + (hash2(vec2(cid,8.0))>0.86 ? 0.12 : 0.0);
  float fx = fract(az/w);
  float inset = 0.08+0.1*hash2(vec2(cid,5.0));
  hit = (el < h && fx > inset && fx < 1.0-inset*0.5) ? 1.0 : 0.0;
  float cid2 = floor((az+w*0.5)/(w*1.3));
  float h2 = 0.025 + 0.07*hash2(vec2(cid2, 13.0));
  float hit2 = el < h2 ? 1.0 : 0.0;
  vec3 c = base;
  if (hit2 > 0.5) c = mix(vec3(40.0,45.0,56.0)/255.0, base, 0.45);
  if (hit > 0.5) {
    vec3 bc = mix(vec3(26.0,30.0,40.0), vec3(44.0,50.0,62.0), hash2(vec2(cid,6.0)))/255.0;
    vec2 wc = vec2(floor(fx*9.0), floor(el*260.0));
    float lit = step(0.45, fract(fx*9.0))*step(0.5, fract(el*260.0))*step(0.62, hash2(wc+cid*3.1));
    bc = mix(bc, vec3(0.95,0.78,0.45), lit*0.75);
    c = mix(bc, base, 0.15);
  }
  hit = max(hit, hit2);
  return c;
}
// ---- lightning: closest distance between the view ray and a segment
float raySeg(vec3 ro, vec3 rd, vec3 a, vec3 b, out float tr){
  vec3 ba = b-a, oa = a-ro;
  float d1 = dot(rd,ba), d2 = dot(ba,ba), d3 = dot(rd,oa), d4 = dot(ba,oa);
  float den = max(d2 - d1*d1, 1e-5);
  float s = clamp((d1*d3 - d4)/den, 0.0, 1.0);
  vec3 sp = a + ba*s;
  tr = max(dot(sp-ro, rd), 0.0);
  return length(ro + rd*tr - sp);
}
vec2 segGlow(vec3 ro, vec3 rd, vec3 a, vec3 b, float hitT, float wk){
  float tr;
  float d = raySeg(ro, rd, a, b, tr);
  if (tr > hitT + 0.3) return vec2(0.0);
  float cw = max(0.0024*tr, 0.045)*wk*(1.0+0.8*u_heat);
  float hw = max(0.028*tr, 0.28)*(1.0+1.6*u_heat);
  return vec2(smoothstep(cw, cw*0.25, d), exp(-d/hw));
}
vec3 boltPt(vec3 T, vec3 P, float f, float k, float seed, float sl){
  vec3 b = mix(T, P, f);
  float envB = clamp((1.0-f)*4.0, 0.0, 1.0);
  float envF = clamp((1.0-f)*60.0, 0.0, 1.0);
  float big = 5.0*(noise2(vec2(f*4.0, seed*7.3))-0.5)*envB + 1.5*sl*(hash2(vec2(k, seed))-0.5)*envF;
  float big2 = 5.0*(noise2(vec2(f*4.0+9.0, seed*3.1))-0.5)*envB + 1.0*sl*(hash2(vec2(k+5.0, seed))-0.5)*envF;
  return b + vec3(big, 0.0, big2);
}
vec2 lightning(vec3 ro, vec3 rd, float hitT){
  vec2 g = vec2(0.0);
  if (u_bolt > 0.001) {
    vec3 P = vec3(u_bx, u_by, u_bz);
    float sd = floor(u_seed+0.5);
    vec3 T = P + vec3(-6.0+12.0*hash2(vec2(sd,1.0)), 60.0, -6.0);
    vec3 prev = T;
    vec3 b0 = T, b1 = T, b2 = T;
    for (int k=1;k<=22;k++){
      float u = float(k)/22.0;
      float f = 1.0 - pow(1.0-u, 2.2);
      float sl = 60.0*(2.2/22.0)*pow(1.0-u+0.03, 1.2);
      vec3 c = (k==22) ? P : boltPt(T, P, f, float(k), sd, sl);
      vec2 s = segGlow(ro, rd, prev, c, hitT, 1.0);
      g.x = max(g.x, s.x); g.y += s.y*0.35;
      if (k==5) b0 = c;
      if (k==10) b1 = c;
      if (k==15) b2 = c;
      prev = c;
    }
    // branches
    for (int j=0;j<3;j++){
      vec3 s0 = j==0 ? b0 : (j==1 ? b1 : b2);
      float fj = float(j);
      float sg = hash2(vec2(sd, fj+3.0)) > 0.5 ? 1.0 : -1.0;
      vec3 dir = normalize(vec3(sg*(0.8+0.6*hash2(vec2(sd,fj))), -1.0, 0.3*(hash2(vec2(fj,sd))-0.5)));
      float len = (9.0 - 2.0*fj)*(0.7+0.5*hash2(vec2(sd+fj,7.0)));
      vec3 pv = s0;
      for (int k=1;k<=6;k++){
        float f = float(k)/6.0;
        float fk = float(k);
        vec3 c = s0 + dir*len*f + vec3(hash2(vec2(fk,fj+sd))-0.5, hash2(vec2(fj,fk+sd))-0.5, hash2(vec2(fk+sd,fj+2.0))-0.5)*1.4*len/9.0;
        vec2 s = segGlow(ro, rd, pv, c, hitT, 0.65*(1.0-0.6*f));
        g.x = max(g.x, s.x*(1.0-0.55*f)); g.y += s.y*0.12*(1.0-f);
        pv = c;
      }
    }
    g *= u_bolt;
  }
  if (u_side > 0.001) {
    vec3 a = LT + vec3(0.25,1.7,0.2);
    vec3 b = TP + vec3(0.0,1.35,0.0);
    vec3 pv = a;
    for (int k=1;k<=4;k++){
      float f = float(k)/4.0;
      vec3 c = mix(a, b, f) + (k<4 ? vec3(0.0, 0.25*(hash2(vec2(k, floor(gT*20.0)))-0.5), 0.2*(hash2(vec2(floor(gT*20.0),k))-0.5)) : vec3(0.0));
      vec2 s = segGlow(ro, rd, pv, c, hitT, 0.8);
      g.x = max(g.x, s.x*u_side); g.y += s.y*0.25*u_side;
      pv = c;
    }
  }
  return g;
}
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  float sh = u_shake;
  vec2 jit = sh*vec2(noise2(vec2(u_time*23.0,1.0))-0.5, noise2(vec2(u_time*19.0,7.0))-0.5)*0.14;
  vec3 ro = vec3(-0.6+u_panx + jit.x, 1.55+u_rise + jit.y, 6.0-3.0*u_cam);
  vec3 ta = vec3(0.6+u_panx*1.5+u_yaw, 1.6+u_rise*0.6+u_tilt, -14.0);
  vec3 rd = camRay(p, ro, ta, 1.15+u_zoom);
  vec3 sky = skyCol(rd);
  float hb;
  vec3 bgd = skyline(rd, sky, hb);
  gGround = 0.0;
  float tg = rd.y < 0.0 ? -ro.y/rd.y : 1e9;
  vec3 m = march(ro, rd, min(tg, 60.0), 0.0);
  vec3 col = bgd;
  float fl = u_flash;
  vec3 P = vec3(u_bx, u_by, u_bz);
  vec3 L = normalize(vec3(-0.3,1.0,0.6));
  vec3 key = vec3(0.32,0.34,0.42)*(1.0+4.5*fl), skyF = lin(vec3(0.42,0.47,0.58))*(0.5+1.6*fl), bnc = lin(vec3(0.2,0.25,0.18))*0.4;
  vec3 hazeC = lin(vec3(62.0,70.0,86.0)/255.0)*(1.0+2.0*fl);
  vec3 boltC = vec3(0.75,0.82,1.0);
  float hitT = 1e9;
  if (m.x > 0.0) {
    hitT = m.x;
    vec3 pos = ro+rd*m.x;
    gGround = 1.0;
    vec3 n = calcNormal(pos);
    gGround = 0.0;
    vec3 alb = lin(vec3(0.3,0.5,0.2));
    float id = m.y;
    vec2 cid = floor(pos.xz/2.6);
    if (id < 2.5) { alb = lin(mix(vec3(38.0,66.0,34.0), vec3(58.0,86.0,44.0), noise2(pos.xz*0.7))/255.0); n = facet(n, 4.0); }
    else if (id < 3.5) alb = lin(vec3(60.0,46.0,36.0)/255.0);
    else if (id < 4.5) {
      float k = hash2(cid+21.0);
      vec3 c = k<0.17? vec3(170.0,58.0,50.0) : k<0.34? vec3(60.0,90.0,150.0) : k<0.5? vec3(50.0,50.0,58.0) : k<0.67? vec3(52.0,124.0,116.0) : k<0.83? vec3(103.0,76.0,140.0) : vec3(190.0,186.0,176.0);
      alb = lin(c/255.0);
    }
    else if (id < 5.5) alb = lin(vec3(40.0,44.0,54.0)/255.0);
    else if (id < 6.5) alb = lin(mix(vec3(241.0,201.0,165.0), vec3(141.0,90.0,59.0), hash2(cid+9.0))/255.0);
    else if (id < 7.5) alb = lin(vec3(150.0,146.0,138.0)/255.0);
    else if (id < 8.5) alb = lin(vec3(120.0,150.0,170.0)/255.0);
    else if (id < 10.5) alb = lin(vec3(236.0,186.0,40.0)/255.0);   // your yellow raincoat
    else if (id < 11.5) alb = lin(vec3(214.0,160.0,120.0)/255.0);
    else if (id < 12.5) alb = lin(vec3(58.0,40.0,30.0)/255.0);
    else alb = lin(vec3(200.0,70.0,60.0)/255.0);                   // red jacket under the tree
    float gl = (id > 7.5 && id < 8.5) ? 0.9 : (id > 9.5 && id < 10.5) ? 0.75 : id < 3.5 ? 0.04 : 0.25;
    col = shade(pos, n, rd, alb, L, key, skyF, bnc, gl);
    // light from the bolt itself
    float dp = length(pos - P);
    col += alb*boltC*u_bolt*(6.0/(1.0+dp*dp*0.35))*clamp(dot(n, normalize(P-pos))*0.7+0.3, 0.0, 1.0);
    if (u_side > 0.0) { float ds = length(pos - (TP+vec3(0.0,1.3,0.0))); col += alb*boltC*u_side*3.0/(1.0+ds*ds*1.2); }
    // current flashing over your skin and wet raincoat
    if (id > 9.5 && id < 12.5 && u_glow > 0.0) {
      vec2 sp = vec2(pos.x*7.0 + pos.z*3.0, pos.y*5.0);
      float r1 = 1.0-abs(noise2(sp + vec2(0.0, gT*9.0))*2.0-1.0);
      float r2 = 1.0-abs(noise2(sp*2.1 + vec2(gT*7.0, 3.0))*2.0-1.0);
      float lines = pow(r1, 18.0) + 0.6*pow(r2, 22.0);
      float rim = pow(clamp(1.0+dot(n,rd),0.0,1.0), 2.0);
      col = mix(col, col*0.55, u_glow);
      col += vec3(0.5,0.68,1.0)*u_glow*(0.05 + 1.6*lines + 0.9*rim);
    }
    col = grade(col, hazeC, m.x, 10.0, 0.45, 0.02);
  } else if (tg < 1e8) {
    hitT = tg;
    vec3 pos = ro+rd*tg;
    float gn = noise2(pos.xz*0.35);
    vec3 gcol = mix(vec3(30.0,52.0,30.0), vec3(50.0,72.0,40.0), gn)/255.0;
    float bl = noise2(pos.xz*vec2(14.0,40.0))*noise2(pos.xz*vec2(31.0,9.0)+3.0);
    gcol *= 0.78+0.55*bl*smoothstep(30.0,3.0,tg);
    vec3 a = lin(gcol);
    float s = 1.0;
    float tz = pos.z + 23.0 - 1.2;
    float tcx = floor((pos.x+0.9+2.5)/5.0);
    float tx = mod(pos.x+0.9+2.5,5.0)-2.5;
    tz += (hash2(vec2(tcx,1.0))-0.5)*4.0;
    s *= mix(0.55,1.0,smoothstep(1.2,2.4,length(vec2(tx,tz*0.8))));
    s *= mix(0.55,1.0,smoothstep(1.6,2.8,length((pos.xz-LT.xz)*vec2(1.0,0.8))));
    if (u_you > 0.5) s *= mix(0.55,1.0,smoothstep(0.15,0.45,length(pos.xz-HP.xz)));
    col = a*(key*0.85*s + skyF*1.2);
    // wet ground: reflect the sky
    vec3 rr = reflect(rd, vec3(0.0,1.0,0.0));
    col += lin(skyCol(rr))*0.18*(0.6+0.4*noise2(pos.xz*3.0));
    float dp = length(pos - P);
    col += boltC*u_bolt*(4.0/(1.0+dp*dp*0.4));
    if (u_side > 0.0) { float ds = length(pos.xz - TP.xz); col += boltC*u_side*1.2/(1.0+ds*ds*2.0); }
    // ground current: rings and filaments spreading out from the strike point
    if (u_rings > 0.0) {
      vec2 dv = pos.xz - P.xz;
      float d = length(dv);
      float ang = atan(dv.y, dv.x);
      float rr2 = u_ripple*10.0;
      float band = exp(-abs(d-rr2)*3.0)*smoothstep(rr2+0.2, 0.0, d - 0.0);
      float fil = pow(1.0-abs(noise2(vec2(ang*6.0, d*1.5 - gT*4.0))*2.0-1.0), 8.0);
      float inside = smoothstep(rr2, rr2*0.3, d);
      col += boltC*u_rings*(band*1.4 + fil*inside*1.6*exp(-d*0.18));
    }
    col = grade(col, hazeC, tg, 12.0, 0.45, 0.02);
  }
  vec2 lg = lightning(ro, rd, hitT);
  vec3 halo = vec3(0.55,0.6,1.0)*(1.0+0.3*u_heat);
  col += halo*min(lg.y, 2.5)*0.55;
  col = mix(col, vec3(1.0, 0.98, 1.0), clamp(lg.x*(1.15+0.4*u_heat), 0.0, 1.0));
  // rain streaks (screen space, slanted, 3 layers)
  if (u_rain > 0.0) {
    float rn = 0.0;
    for (int i=0;i<3;i++){
      float fi = float(i);
      vec2 q = vec2(p.x + p.y*0.12, p.y)*vec2(55.0+30.0*fi, 5.0+2.0*fi);
      q.y += gT*(9.0+3.0*fi);
      vec2 ci = floor(q);
      float h = hash2(ci+fi*13.0);
      float fx = fract(q.x);
      float fy = fract(q.y + h*7.0);
      rn += step(0.86, h)*smoothstep(0.12, 0.0, abs(fx-0.5))*smoothstep(0.0,0.4,fy)*smoothstep(1.0,0.6,fy)*(0.55-0.12*fi);
    }
    col += vec3(0.6,0.66,0.78)*rn*u_rain*(0.32+0.9*fl);
  }
  col += vec3(0.75,0.78,1.0)*fl*0.06;
  // heart-stop vignette (from park2g)
  float dk = u_dark*(0.85+0.15*sin(u_time*7.5));
  float rr = length(p*vec2(1.25,0.95));
  float lum = dot(col, vec3(0.3,0.59,0.11));
  col = mix(col, vec3(lum)*vec3(1.05,0.85,0.85), 0.55*u_dark);
  col *= mix(1.0, smoothstep(0.62-0.3*dk, 0.04, rr), dk);
  col = mix(col, col*vec3(1.0,0.45,0.42), 0.5*dk*smoothstep(0.1,0.45,rr));
  return vec4(col, 1.0);
}
