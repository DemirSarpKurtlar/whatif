// lowcity.glsl — Episode 047 (Gravity Part 4: gravity reversed for 1 second). "Lowpoly Skyline" look:
// bright faceted low-poly waterfront plaza, pastel skyscraper wall across a blue bay, saturated sky.
// Adapted from 020 park.glsl / 024 park2g.glsl (same camera params + crowd grid), re-skinned and with new physics params.
// Params (every scene sets all of them):
//   cam, rise, tilt, panx, shake : camera (as in park.glsl). rise = extra camera height (m), tilt = look-at offset (m)
//   ph    : physical seconds since gravity flipped (drives every lift with the real 1-second-reversal kinematics, see H())
//   pov   : 1 = camera rides up with "you" (eye height + H(ph)), 0 = fixed camera
//   wat   : 1 = bay water slab follows H(ph) too
//   lift, wlift : extra manual lift (m) for loose objects / water
//   spin  : tumble amount of people, dogs, cars
//   dust  : rising debris specks (screen space)   air : thin-air sky tint + stretched clouds   splash : foam/spray at the quay
float gT = 0.0, gLift = 0.0, gW = 0.0, gSpin = 0.0, gSplash = 0.0;
const float QZ = -15.0;            // quay line (land for z > QZ, bay for z < QZ)
const float WTOP0 = -0.6;          // normal water surface
const float WBOT0 = -4.0;          // bay floor
const float SHORE = 105.0;         // far shore distance (cylinder around the camera)

float Hph(float t){ // height (m) of a loose object t seconds after gravity flips upward for exactly 1 s
  float g = 9.81;
  if (t <= 0.0) return 0.0;
  if (t < 1.0) return 0.5*g*t*t;
  float u = t - 1.0;
  return max(4.905 + 9.81*u - 0.5*g*u*u, 0.0);
}

vec2 people(vec3 p){
  float L = gLift;
  vec3 bq = abs(p - vec3(-1.3, 1.2+L, -5.2)) - vec3(14.8, 2.6, 6.2);
  float bb = length(max(bq,0.0));
  if (bb > 0.4) return vec2(bb, 0.0);
  vec2 cs = vec2(2.6);
  vec2 cid = floor(p.xz/cs);
  vec2 f = abs(mod(p.xz,cs)-1.3);
  float bnd = (1.3-max(f.x,f.y)) + 0.5;
  vec2 res = vec2(bnd, 0.0);
  float hh = hash2(cid);
  if (hh > 0.36 && cid.x > -6.0 && cid.x < 5.0 && cid.y > -5.0 && cid.y < 0.0) {
    vec2 j = (vec2(hash2(cid+7.1), hash2(cid+3.3))-0.5)*1.0;
    vec3 q = vec3(mod(p.x,cs.x)-1.3-j.x, p.y, mod(p.z,cs.y)-1.3-j.y);
    q.xz = rot(hash2(cid+41.0)*6.28)*q.xz;
    float lift = L*(0.94+0.12*hash2(cid+11.0));
    q.y -= lift + 0.75;
    float sp = gSpin*(hash2(cid+5.0)-0.5)*2.0;
    q.xy = rot(sp*0.9)*q.xy; q.yz = rot(sp*0.55)*q.yz;
    q.y += 0.75;
    float fl = clamp(L*1.2, 0.0, 1.0);
    if (hash2(cid+31.0) < 0.22) {
      float body = sdCapsule(q, vec3(-0.3,0.45,0.0), vec3(0.28,0.47,0.0), 0.16);
      float head = min(sdSphere(q-vec3(0.45,0.66,0.0), 0.13), sdSphere(q-vec3(0.58,0.62,0.0), 0.07));
      float lx = 0.1*fl, lz = 0.08*fl;
      float legs = min(min(sdCapsule(q, vec3(0.22,0.4,0.09), vec3(0.22+lx,0.05,0.1+lz),0.05), sdCapsule(q, vec3(0.22,0.4,-0.09), vec3(0.22+lx,0.05,-0.1-lz),0.05)),
                       min(sdCapsule(q, vec3(-0.25,0.4,0.09), vec3(-0.25-lx,0.05,0.1+lz),0.05), sdCapsule(q, vec3(-0.25,0.4,-0.09), vec3(-0.25-lx,0.05,-0.1-lz),0.05)));
      float tail = sdCapsule(q, vec3(-0.42,0.5,0.0), vec3(-0.6,0.75,0.0), 0.035);
      res = vec2(min(min(smin(body, head, 0.06), legs), tail), 12.0);
    } else {
      float ph = gT*4.0+hash2(cid+2.0)*6.28;
      float sw = 0.12*sin(ph)*(1.0-fl);
      float legs = min(sdCapsule(q, vec3(0.08,0.52,0.0), vec3(0.08+0.12*fl,0.06,sw), 0.09), sdCapsule(q, vec3(-0.08,0.52,0.0), vec3(-0.08-0.12*fl,0.06,-sw), 0.09));
      float body = sdCapsule(q, vec3(0.0,0.7,0.0), vec3(0.0,1.15,0.0), 0.2);
      vec3 ha = vec3(0.3+0.3*fl, 0.72+0.85*fl, -sw);
      float arms = min(sdCapsule(q, vec3(0.22,1.12,0.0), ha, 0.065), sdCapsule(q, vec3(-0.22,1.12,0.0), vec3(-ha.x,ha.y,sw), 0.065));
      float head = sdSphere(q-vec3(0.0,1.47,0.0), 0.15);
      res = opU(vec2(legs, 5.0), vec2(smin(body,arms,0.05), 4.0));
      res = opU(res, vec2(head, 6.0));
    }
    res.x = min(res.x*0.85, bnd);
  }
  return res;
}
float carX(float fi){ return -9.0 + 5.6*fi + 0.8*hash2(vec2(fi,2.0)); }
vec2 cars(vec3 p){
  float bb = max(abs(p.z+12.1)-1.9, max(p.y-gLift-3.2, gLift-0.8-p.y));
  if (bb > 0.5) return vec2(bb, 0.0);
  vec2 r = vec2(1e9, 0.0);
  for (int i=0;i<4;i++){
    float fi = float(i);
    float z = -12.1 + (mod(fi,2.0) < 0.5 ? 0.75 : -0.75);
    vec3 q = p - vec3(carX(fi), 0.0, z);
    q.y -= gLift*(0.96+0.08*hash2(vec2(fi,3.0))) + 0.6;
    float sp = gSpin*(hash2(vec2(fi,4.0))-0.5)*1.2;
    q.xy = rot(sp)*q.xy; q.yz = rot(sp*0.5)*q.yz;
    q.y += 0.6;
    float body = sdRoundBox(q-vec3(0.0,0.55,0.0), vec3(1.85,0.26,0.78), 0.12);
    float cab = sdRoundBox(q-vec3(-0.15,1.02,0.0), vec3(0.95,0.22,0.68), 0.1);
    vec3 w = vec3(abs(q.x)-1.2, q.y-0.32, abs(q.z)-0.72);
    float wh = max(length(w.xy)-0.3, abs(w.z)-0.13);
    r = opU(r, vec2(body, 10.0));
    r = opU(r, vec2(cab, 11.0));
    r = opU(r, vec2(wh, 5.0));
  }
  return r;
}
float treeIdx(float x){ return clamp(floor((abs(x)-2.25)/5.5), 0.0, 2.0); }
vec2 trees(vec3 p){
  vec3 q = p - vec3(0.0,0.0,-14.3);
  float bt = max(abs(q.z)-2.0, q.y-5.6);
  if (bt > 0.5) return vec2(bt, 2.0);
  float side = sign(q.x);
  float cx = treeIdx(q.x);
  vec3 tq = vec3(abs(q.x) - (5.0 + 5.5*cx), q.y, q.z);
  float s = 0.85 + 0.35*hash2(vec2(cx*side, 2.0));
  float can = sdEllipsoid(tq-vec3(0.0,2.6*s,0.0), vec3(1.45,1.55,1.45)*s);
  float tr = sdCylinder(tq-vec3(0.0,0.9,0.0), 0.9, 0.16);
  return opU(vec2(can*0.9, 2.0), vec2(tr, 3.0));
}
vec2 boats(vec3 p){
  if (p.z > -24.0) return vec2(p.z+24.0+0.5, 0.0);
  float wt = WTOP0 + gW;
  vec2 r = vec2(1e9, 0.0);
  for (int i=0;i<2;i++){
    float fi = float(i);
    vec3 q = p - vec3(fi < 0.5 ? -4.5 : 6.5, wt, fi < 0.5 ? -30.0 : -48.0);
    q.xz = rot(0.4+fi*2.2)*q.xz;
    q.xy = rot(gSpin*0.15*(fi-0.5))*q.xy;
    float hull = sdRoundBox(q-vec3(0.0,0.12,0.0), vec3(2.2,0.32,0.8), 0.25);
    float cab = sdRoundBox(q-vec3(-0.3,0.72,0.0), vec3(0.8,0.3,0.58), 0.08);
    r = opU(r, vec2(hull, 13.0));
    r = opU(r, vec2(cab, 14.0));
  }
  return r;
}
vec2 map(vec3 p){
  vec2 r = people(p);
  r = opU(r, cars(p));
  r = opU(r, trees(p));
  r = opU(r, boats(p));
  if (gSplash > 0.01) {
    // crashing wall of white water along the quay (low-poly crest)
    vec3 q = p - vec3(0.0, WTOP0 + gW, -16.3);
    float hx = gSplash*(0.7 + 1.9*noise2(vec2(p.x*0.6, 3.0)) + 0.9*noise2(vec2(p.x*2.1, 9.0)));
    float wz = 0.9 + 0.5*noise2(vec2(p.x*0.7, 5.0));
    float d = (length(vec2(q.y/(hx+0.05), q.z/wz)) - 1.0)*min(hx, wz)*0.8;
    d = max(d, -q.y);
    r = opU(r, vec2(d, 15.0));
  }
  return r;
}
vec3 skyCol(vec3 rd){
  vec3 hor = vec3(198.0,218.0,240.0)/255.0, top = mix(vec3(92.0,148.0,222.0), vec3(52.0,92.0,178.0), u_air)/255.0;
  float e = clamp(rd.y,0.0,1.0);
  vec3 c = mix(hor, top, pow(e,0.55));
  vec2 cp = rd.xz/(rd.y+0.08)*2.0;
  cp.y *= 1.0 - 0.6*u_air;
  float cl = smoothstep(0.58,0.8,noise2(cp*1.2+vec2(gT*0.03,0.0))*0.65+noise2(cp*2.9)*0.35);
  c = mix(c, vec3(0.97,0.98,1.0), cl*0.7*smoothstep(0.03,0.22,rd.y));
  return c;
}
// pastel low-poly tower wall on a cylinder of radius R around the camera
vec3 towers(vec3 ro, vec3 rd, float R, float wcell, float seed, float hmin, float hrng, out float hit){
  hit = 0.0;
  float dh = max(length(rd.xz), 1e-4);
  float y = ro.y + rd.y*R/dh;
  if (y < 0.0) return vec3(0.0);
  float a = atan(rd.x, -rd.z);
  float u = a*R/wcell + seed*13.0;
  float cid = floor(u), fx = fract(u);
  float h1 = hash2(vec2(cid, seed));
  float ht = hmin + hrng*pow(h1, 1.3);
  float inset = 0.03 + 0.14*hash2(vec2(cid, seed+5.0));
  float step2 = hash2(vec2(cid, seed+9.0)) > 0.7 ? 0.82 : 1.0;          // setback crown
  float topY = (fx > 0.25 && fx < 0.75) ? ht : ht*step2;
  if (fx < inset || fx > 1.0-inset*0.5 || y > topY) return vec3(0.0);
  hit = 1.0;
  float k = hash2(vec2(cid, seed+3.0));
  vec3 pc = k<0.16? vec3(233.0,223.0,201.0) : k<0.32? vec3(216.0,112.0,94.0) : k<0.46? vec3(156.0,195.0,230.0) : k<0.6? vec3(143.0,201.0,190.0)
          : k<0.74? vec3(217.0,180.0,143.0) : k<0.88? vec3(201.0,206.0,214.0) : vec3(196.0,84.0,70.0);
  pc /= 255.0;
  float split = 0.45 + 0.3*hash2(vec2(cid, seed+7.0));
  bool lit = fx < split;
  vec3 c = lit ? pc*1.04 : pc*vec3(0.70,0.73,0.80);
  float wx = (lit ? (fx-inset) : (fx-split))*wcell;
  float wm = step(0.42, fract(wx/1.9)) * step(0.36, fract(y/2.6)) * step(2.0, y);
  vec3 wc = mix(c*0.48 + vec3(0.03,0.05,0.09), vec3(0.78,0.86,0.95), step(0.93, hash2(vec2(floor(wx/1.9)+cid*7.0, floor(y/2.6)))));
  c = mix(c, wc, wm*0.85);
  c *= 0.93 + 0.07*smoothstep(0.0, 40.0, y);
  return c;
}
vec3 farView(vec3 ro, vec3 rd, vec3 sky){
  float h1, h2;
  vec3 c = sky;
  vec3 t2 = towers(ro, rd, 175.0, 13.0, 21.0, 16.0, 62.0, h2);
  if (h2 > 0.5) c = mix(t2, sky, 0.34);
  vec3 t1 = towers(ro, rd, 128.0, 15.5, 3.0, 10.0, 48.0, h1);
  if (h1 > 0.5) c = mix(t1, sky, 0.17);
  float dh = max(length(rd.xz), 1e-4);
  float ys = ro.y + rd.y*SHORE/dh;
  if (ys < 1.4) {
    vec3 sc = ys > 0.9 ? vec3(0.86,0.86,0.84) : vec3(0.74,0.74,0.72);
    if (ys < -0.2) sc = vec3(0.55,0.57,0.6);
    c = mix(sc, sky, 0.15);
  }
  return c;
}
vec4 pixel(vec2 uv){
  gT = u_time;
  float H0 = Hph(u_ph);
  gLift = H0 + u_lift;
  gW = H0*u_wat + u_wlift;
  gSpin = u_spin; gSplash = u_splash;
  vec2 p = screenP(uv, 0.0);
  float sh = u_shake;
  vec2 jit = sh*vec2(noise2(vec2(u_time*23.0,1.0))-0.5, noise2(vec2(u_time*19.0,7.0))-0.5)*0.14;
  float eye = u_pov*H0;
  vec3 ro = vec3(-0.6+u_panx + jit.x, 1.55+u_rise+eye + jit.y, 6.0-3.0*u_cam);
  vec3 ta = vec3(0.6+u_panx*1.5, 1.6+u_rise*0.6+eye+u_tilt, -14.0);
  vec3 rd = camRay(p, ro, ta, 1.15);
  vec3 sky = skyCol(rd);
  vec3 L = normalize(vec3(-0.55,0.9,0.5));
  vec3 key = vec3(1.3,1.2,1.05), skyF = lin(vec3(0.62,0.74,0.9))*0.6, bnc = lin(vec3(0.5,0.58,0.4))*0.45;
  vec3 hazeC = lin(vec3(198.0,218.0,240.0)/255.0);

  // analytic environment: plaza ground, water slab (top / front / underside), bay floor
  float wt = WTOP0 + gW, wb = WBOT0 + gW;
  float dh = max(length(rd.xz), 1e-4);
  float te = 1e9, eid = 0.0;
  if (rd.y < 0.0 && ro.y > 0.0) { float t = -ro.y/rd.y; if (ro.z+rd.z*t > QZ) { te = t; eid = 20.0; } }
  if (rd.z < 0.0) { float t = (QZ-ro.z)/rd.z; float y = ro.y+rd.y*t; if (t > 0.0 && y > max(wb,0.0) && y < wt && t < te) { te = t; eid = 22.0; } }
  if (rd.y < 0.0 && ro.y > wt) { float t = (wt-ro.y)/rd.y; if (ro.z+rd.z*t < QZ && t*dh < SHORE && t < te) { te = t; eid = 21.0; } }
  if (rd.y > 0.0 && ro.y < wb) { float t = (wb-ro.y)/rd.y; if (ro.z+rd.z*t < QZ && t*dh < SHORE && t < te) { te = t; eid = 23.0; } }
  if (rd.y < 0.0) { float t = (WBOT0-ro.y)/rd.y; if (ro.z+rd.z*t < QZ && t*dh < SHORE && t < te) { te = t; eid = 24.0; } }

  vec3 m = march(ro, rd, min(te, 75.0), 0.0);
  vec3 col = farView(ro, rd, sky);
  if (m.x > 0.0) {
    vec3 pos = ro+rd*m.x;
    vec3 n = calcNormal(pos);
    float id = m.y;
    vec3 alb = vec3(0.5);
    float gl = 0.05;
    vec2 cid = floor(pos.xz/2.6);
    if (id < 2.5) {
      float tix = treeIdx(pos.x)*sign(pos.x);
      float k = hash2(vec2(tix, 4.0));
      alb = lin((k < 0.3 ? vec3(227.0,168.0,43.0) : k < 0.65 ? vec3(96.0,176.0,62.0) : vec3(126.0,196.0,72.0))/255.0);
      n = facet(n, 2.2);
    }
    else if (id < 3.5) alb = lin(vec3(110.0,80.0,55.0)/255.0);
    else if (id < 4.5) {
      float k = hash2(cid+21.0);
      vec3 c = k<0.17? vec3(226.0,72.0,60.0) : k<0.34? vec3(245.0,196.0,60.0) : k<0.5? vec3(62.0,120.0,200.0) : k<0.67? vec3(58.0,178.0,160.0) : k<0.83? vec3(150.0,96.0,190.0) : vec3(246.0,240.0,228.0);
      alb = lin(c/255.0); n = facet(n, 3.0);
    }
    else if (id < 5.5) { alb = lin((hash2(cid+4.0)>0.5? vec3(46.0,52.0,64.0) : vec3(70.0,92.0,140.0))/255.0); n = facet(n, 3.0); }
    else if (id < 6.5) alb = lin(mix(vec3(244.0,206.0,170.0), vec3(141.0,90.0,59.0), hash2(cid+9.0))/255.0);
    else if (id < 10.5) {
      float ci = clamp(floor((pos.x+9.0+2.8)/5.6), 0.0, 3.0);
      vec3 c = ci < 0.5 ? vec3(244.0,244.0,240.0) : ci < 1.5 ? vec3(222.0,64.0,52.0) : ci < 2.5 ? vec3(246.0,204.0,62.0) : vec3(64.0,118.0,206.0);
      alb = lin(c/255.0); gl = 0.55;
    }
    else if (id < 11.5) { alb = lin(vec3(72.0,98.0,130.0)/255.0); gl = 0.85; }
    else if (id < 12.5) {
      float k = hash2(cid+33.0);
      alb = lin((k < 0.4 ? vec3(160.0,104.0,58.0) : k < 0.7 ? vec3(236.0,230.0,218.0) : vec3(60.0,54.0,50.0))/255.0); n = facet(n, 3.0);
    }
    else if (id < 13.5) alb = lin(vec3(240.0,240.0,236.0)/255.0);
    else if (id < 14.5) alb = lin(vec3(210.0,72.0,60.0)/255.0);
    else { float fy = clamp((pos.y - WTOP0 - gW)/2.5, 0.0, 1.0); alb = lin(mix(vec3(0.55,0.82,0.92), vec3(0.97,0.99,1.0), fy*0.8 + 0.2*step(0.6, noise2(pos.xy*vec2(3.0,1.2))))); n = facet(n, 2.5); }
    col = shade(pos, n, rd, alb, L, key, skyF, bnc, gl);
    if (id > 14.5) col = alb*(0.8 + 0.45*clamp(dot(n,L),0.0,1.0)) + lin(vec3(0.85,0.93,1.0))*0.12*(0.5+0.5*n.y);
    col = grade(col, hazeC, m.x, 22.0, 0.25, 0.02);
  } else if (eid > 19.5) {
    vec3 pos = ro+rd*te;
    vec3 a;
    if (eid < 20.5) {
      // plaza ground with analytic soft shadows
      float z = pos.z;
      if (z < -13.6) {
        a = vec3(206.0,204.0,198.0)/255.0;
        vec2 tl = abs(fract(pos.xz/1.5)-0.5);
        a *= 0.94 + 0.06*smoothstep(0.46,0.44,max(tl.x,tl.y));
        if (z < -14.85) a = vec3(225.0,224.0,218.0)/255.0;
      } else if (z < -10.6) {
        a = vec3(60.0,67.0,82.0)/255.0;
        if (abs(z+12.1) < 0.07 && fract(pos.x/3.0) < 0.5) a = vec3(0.95);
        if (abs(pos.x-0.3) < 1.7 && fract(pos.x/0.7) < 0.5 && z > -13.3 && z < -10.9) a = vec3(0.93);
      } else if (z < -10.25) {
        a = vec3(222.0,222.0,216.0)/255.0;
      } else {
        vec2 tc = floor(pos.xz*0.9 + vec2(pos.z*0.45, 0.0));
        float gn = hash2(tc);
        a = mix(vec3(78.0,166.0,58.0), vec3(104.0,192.0,70.0), gn)/255.0;
        if (abs(pos.x-0.3) < 1.6) { a = vec3(216.0,208.0,192.0)/255.0; vec2 tl = abs(fract(pos.xz/1.2)-0.5); a *= 0.95+0.05*smoothstep(0.47,0.45,max(tl.x,tl.y)); }
      }
      a = lin(a);
      float s = 1.0;
      vec2 sp = pos.xz + vec2(0.45,-0.35);
      vec2 c2 = floor(sp/2.6);
      if (hash2(c2) > 0.36 && c2.x > -6.0 && c2.x < 5.0 && c2.y > -5.0 && c2.y < 0.0) {
        vec2 j = (vec2(hash2(c2+7.1), hash2(c2+3.3))-0.5)*1.0;
        vec2 cc = c2*2.6+1.3+j;
        float d = length((sp-cc)*vec2(1.0,0.7));
        float lf = gLift;
        float ss = mix(0.45,1.0,smoothstep(0.1,0.36+lf*0.12,d));
        s = mix(1.0, ss, 1.0/(1.0+lf*0.35));
      }
      // cars
      for (int i=0;i<4;i++){
        float fi = float(i);
        float zc = -12.1 + (mod(fi,2.0) < 0.5 ? 0.75 : -0.75);
        vec2 dd = abs(pos.xz + vec2(0.5,-0.4) - vec2(carX(fi), zc)) - vec2(1.9, 0.75);
        float d = length(max(dd,0.0)) + min(max(dd.x,dd.y),0.0);
        s *= mix(1.0, mix(0.45,1.0,smoothstep(-0.1,0.3+gLift*0.1,d)), 1.0/(1.0+gLift*0.35));
      }
      // trees
      float tz = pos.z + 14.3 - 0.9;
      float tx = abs(pos.x+0.9) - (5.0 + 5.5*treeIdx(pos.x+0.9));
      s *= mix(0.55,1.0,smoothstep(1.1,2.2,length(vec2(tx,tz*0.8))));
      col = a*(key*0.9*s + skyF*1.15);
      col = grade(col, hazeC, te, 26.0, 0.25, 0.02);
    } else if (eid < 21.5) {
      // water top: faceted low-poly ripples + sky reflection
      vec2 fc = floor(pos.xz*vec2(0.55,0.8) + vec2(pos.z*0.3, 0.0));
      vec3 wn = normalize(vec3((hash2(fc)-0.5)*0.16, 1.0, (hash2(fc+3.7)-0.5)*0.16));
      vec3 base = lin(mix(vec3(40.0,112.0,196.0), vec3(70.0,145.0,215.0), hash2(fc+1.3)*0.5)/255.0);
      float fr = pow(clamp(1.0+dot(rd,wn),0.0,1.0), 4.0);
      vec3 refl = lin(skyCol(reflect(rd,wn)));
      col = mix(base*(0.75+0.35*dot(wn,L)), refl, 0.25+0.55*fr);
      col += key*pow(clamp(dot(reflect(rd,wn),L),0.0,1.0), 60.0)*0.6;
      float foam = gSplash*smoothstep(4.0, 0.0, QZ-pos.z)*step(0.45, noise2(pos.xz*2.5));
      col = mix(col, vec3(0.92), clamp(foam,0.0,1.0));
      col = grade(col, hazeC, te, 30.0, 0.3, 0.02);
    } else if (eid < 22.5) {
      // lifted water slab, front face: turquoise, darker with depth, foam lip, bubbles
      float dep = wt - pos.y;
      vec3 c = mix(vec3(92.0,196.0,222.0), vec3(28.0,98.0,170.0), smoothstep(0.0, 3.4, dep))/255.0;
      float band = noise2(vec2(pos.x*0.6, pos.y*3.0 + gT*0.8));
      c *= 0.9 + 0.2*band;
      vec2 bq = vec2(pos.x*2.2, pos.y*2.2 - gT*1.5);
      vec2 bc = floor(bq); vec2 bf = fract(bq)-0.5;
      if (hash2(bc) > 0.88) c = mix(c, vec3(0.85,0.95,1.0), smoothstep(0.16,0.08,length(bf))*0.6);
      vec2 fq = vec2(pos.x*0.5, pos.y*1.5); vec2 fcid = floor(fq);
      if (hash2(fcid+17.0) > 0.9) { vec2 ff = fract(fq)-0.5; float fd = length(ff*vec2(1.0,2.6)); c = mix(c, vec3(0.16,0.26,0.36), smoothstep(0.2,0.14,fd)*0.8); }
      if (dep < 0.22) c = mix(c, vec3(0.97,0.99,1.0), smoothstep(0.22,0.05,dep));
      col = lin(c)*(key*0.55 + skyF*1.1);
      col = grade(col, hazeC, te, 30.0, 0.25, 0.02);
    } else if (eid < 23.5) {
      // underside of the lifted water
      float cs = noise2(pos.xz*0.8+gT*0.5)*noise2(pos.xz*1.7-gT*0.3);
      vec3 c = mix(vec3(30.0,92.0,160.0), vec3(110.0,200.0,230.0), cs*1.4)/255.0;
      col = lin(c)*(skyF*1.4 + key*0.2);
      col = grade(col, hazeC, te, 30.0, 0.25, 0.02);
    } else {
      // bay floor, now exposed under the lifted water (wet mud, stones, stranded fish)
      vec2 fc = floor(pos.xz*1.3);
      vec3 c = mix(vec3(104.0,82.0,58.0), vec3(70.0,58.0,46.0), noise2(pos.xz*0.6))/255.0;
      if (noise2(pos.xz*0.35+7.0) > 0.62) c = mix(c, vec3(120.0,150.0,180.0)/255.0, 0.6);
      if (hash2(fc) > 0.93) c = vec3(150.0,146.0,140.0)/255.0;
      vec2 fq = pos.xz*vec2(0.9,1.6); vec2 fcid = floor(fq);
      if (hash2(fcid+9.0) > 0.95) { vec2 ff = fract(fq)-0.5; if (length(ff*vec2(1.0,2.0)) < 0.25) c = vec3(0.78,0.82,0.86); }
      float shadeU = gW > 0.3 ? 0.42 : 1.0;
      col = lin(c)*(key*0.75*shadeU + skyF*1.0);
      col = grade(col, hazeC, te, 40.0, 0.15, 0.0);
    }
  }
  // rising debris: paper, leaves, dust
  if (u_dust > 0.01) {
    for (int k=0;k<2;k++){
      float fk = float(k);
      float scl = 6.0 + 6.0*fk;
      vec2 q = p*scl; q.y -= u_time*(1.4+1.2*fk)*(0.6+u_dust); q.x += 0.4*sin(q.y*0.7+fk);
      vec2 c = floor(q); vec2 f = fract(q)-0.5;
      float h = hash2(c+fk*13.0);
      if (h > 0.72) {
        vec2 o = (vec2(hash2(c+3.1),hash2(c+5.7))-0.5)*0.5;
        vec2 ff = rot(h*40.0+u_time*(2.0+3.0*h))*(f-o);
        float d = max(abs(ff.x)-0.07, abs(ff.y)-0.04);
        float mk = smoothstep(0.03,0.0,d)*clamp(u_dust,0.0,1.0);
        float k2 = hash2(c+2.0);
        vec3 dc = k2 > 0.6 ? vec3(0.97,0.96,0.92) : k2 > 0.3 ? vec3(0.5,0.75,0.28) : vec3(0.93,0.66,0.2);
        col = mix(col, dc, mk);
      }
    }
  }
  return vec4(col, 1.0);
}
