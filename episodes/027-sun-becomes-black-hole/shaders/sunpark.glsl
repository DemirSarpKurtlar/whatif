// Park POV (from ep 020) + visible Sun, instant blackout to a starry night, frost, frozen fountain.
// extra params: u_sun sun brightness 0..1, u_night 0..1, u_frost 0..1, u_ppl people visible (>=0.5), u_look extra camera pitch,
// u_glare sun glare boost, u_mark dashed marker ring where the Sun was, u_lens camera lens (0 -> 1.15)
float gGround = 1.0;
float gLift = 0.0;
float gFloat = 0.0;
float gT = 0.0;
vec3 FC = vec3(3.2, 0.0, -7.5);
float person(vec3 q, float h){
  float legs = sdCapsule(q, vec3(0.0,0.08,0.0), vec3(0.0,0.5,0.0), 0.11);
  float body = sdCapsule(q, vec3(0.0,0.62,0.0), vec3(0.0,1.18,0.0), 0.19);
  return min(legs, body);
}
vec2 people(vec3 p){
  if (u_ppl < 0.5) return vec2(1e9, 0.0);
  vec3 bq = abs(p - vec3(0.0, 1.6+gLift*0.8, -11.7)) - vec3(15.8, 1.8+gLift*0.9, 9.3);
  float bb = length(max(bq,0.0));
  if (bb > 0.4) return vec2(bb, 0.0);
  vec2 cs = vec2(2.6);
  vec2 cid = floor(p.xz/cs);
  vec2 f = abs(mod(p.xz,cs)-1.3);
  float bnd = (1.3-max(f.x,f.y)) + 0.5;
  vec2 res = vec2(bnd, 0.0);
  float hh = hash2(cid);
  if (hh > 0.42 && abs(cid.x) < 6.0 && cid.y > -8.0 && cid.y < -1.0) {
    vec2 j = (vec2(hash2(cid+7.1), hash2(cid+3.3))-0.5)*1.0;
    vec3 q = vec3(mod(p.x,cs.x)-1.3-j.x, p.y, mod(p.z,cs.y)-1.3-j.y);
    float lift = gLift*(0.55+0.9*hash2(cid+11.0));
    q.y -= lift;
    q.xy = rot(gLift*0.35*(hash2(cid+5.0)-0.5))*q.xy;
    float ph = gT*4.0+hash2(cid+2.0)*6.28;
    float sw = 0.12*sin(ph)*(1.0-clamp(gLift*2.0,0.0,1.0));
    float flail = clamp(gLift*1.5,0.0,1.0);
    float legs = min(sdCapsule(q, vec3(0.08,0.52,0.0), vec3(0.08,0.06,sw), 0.09), sdCapsule(q, vec3(-0.08,0.52,0.0), vec3(-0.08,0.06,-sw), 0.09));
    float body = sdCapsule(q, vec3(0.0,0.7,0.0), vec3(0.0,1.15,0.0), 0.2);
    vec3 ha = vec3(0.3+0.25*flail, 0.72+0.7*flail, -sw);
    float arms = min(sdCapsule(q, vec3(0.22,1.12,0.0), ha, 0.065), sdCapsule(q, vec3(-0.22,1.12,0.0), vec3(-ha.x,ha.y,sw), 0.065));
    float head = sdSphere(q-vec3(0.0,1.47,0.0), 0.15);
    res = opU(vec2(legs, 5.0), vec2(smin(body,arms,0.05), 4.0));
    res = opU(res, vec2(head, 6.0));
    res.x = min(res.x*0.9, bnd);
  }
  return res;
}
vec2 trees(vec3 p){
  vec3 q = p; q.z += 23.0;
  float bt = max(abs(q.z)-4.5, q.y-5.5);
  if (bt > 0.5) return vec2(bt, 2.0);
  float cx = floor((q.x+2.5)/5.0);
  q.x = mod(q.x+2.5,5.0)-2.5;
  q.z += (hash2(vec2(cx,1.0))-0.5)*4.0;
  float s = 0.8+0.5*hash2(vec2(cx,2.0));
  float can = sdEllipsoid(q-vec3(0.0,2.7*s,0.0), vec3(1.7,1.5,1.7)*s);
  float tr = sdCylinder(q-vec3(0.0,0.8,0.0), 0.9, 0.17);
  vec2 r = opU(vec2(can*0.9, 2.0), vec2(tr, 3.0));
  return r;
}
vec2 fountain(vec3 p){
  vec3 q = p - FC;
  float bs = length(q-vec3(0.0,1.6,0.0)) - 3.2;
  if (bs > 0.3) return vec2(bs, 7.0);
  float rim = sdTorus(q-vec3(0.0,0.42,0.0), vec2(1.55,0.16));
  float basin = sdCylinder(q-vec3(0.0,0.2,0.0), 0.2, 1.6);
  vec2 r = vec2(min(rim, basin), 7.0);
  float surf = sdCylinder(q-vec3(0.0,0.38+0.0*gFloat,0.0), 0.02, 1.45);
  float w = surf;
  float jet = sdCapsule(q, vec3(0.0,0.4,0.0), vec3(0.0,2.3,0.0), 0.11);
  float pillar = sdCylinder(q-vec3(0.0,0.6,0.0), 0.35, 0.22);
  r = opU(r, vec2(pillar, 7.0));
  if (gFloat < 0.02) {
    w = min(w, jet);
    for (int i=0;i<4;i++){
      float a = float(i)*1.5708;
      vec3 d = vec3(cos(a),0.0,sin(a));
      w = min(w, sdCapsule(q, vec3(0.0,2.2,0.0)+d*0.2, vec3(0.0,1.2,0.0)+d*1.0, 0.07));
      w = min(w, sdCapsule(q, vec3(0.0,1.2,0.0)+d*1.0, vec3(0.0,0.45,0.0)+d*1.2, 0.07));
    }
  } else {
    for (int i=0;i<9;i++){
      float fi = float(i);
      float a = fi*2.39996;
      float rr = 0.35+0.11*fi;
      float y = 0.8+0.32*fi*gFloat+0.6*gFloat*hash2(vec2(fi,4.0));
      vec3 c = vec3(cos(a)*rr, y, sin(a)*rr);
      float rad = (0.16+0.2*hash2(vec2(fi,9.0)))*(0.6+0.5*gFloat);
      vec3 qq = q-c;
      float wob = 1.0+0.12*sin(gT*6.0+fi*2.0);
      w = min(w, sdEllipsoid(qq, vec3(rad*wob, rad/wob, rad*wob)));
    }
  }
  r = opU(r, vec2(w, 8.0));
  return r;
}
vec2 map(vec3 p){
  vec2 r = vec2(1e9, 0.0);
  if (gGround > 0.5) r = vec2(p.y, 0.0);
  r = opU(r, people(p));
  r = opU(r, trees(p));
  r = opU(r, fountain(p));
  return r;
}
vec3 SUN = normalize(vec3(0.16, 0.2, -1.0));
vec3 skyCol(vec3 rd){
  float N = clamp(u_night, 0.0, 1.0);
  vec3 hor = vec3(173.0,198.0,226.0)/255.0, top = vec3(80.0,112.0,156.0)/255.0;
  float e = clamp(rd.y,0.0,1.0);
  vec3 c = mix(hor, top, pow(e,0.6));
  vec3 nc = mix(vec3(0.045,0.055,0.095), vec3(0.008,0.01,0.028), pow(e,0.5));
  c = mix(c, nc, N);
  vec2 cp = rd.xz/(rd.y+0.08)*2.2;
  float cl = smoothstep(0.55,0.85,noise2(cp*1.3+vec2(gT*0.02,0.0))*0.65+noise2(cp*3.1)*0.35);
  c = mix(c, mix(vec3(0.93,0.95,0.98), vec3(0.03,0.035,0.05), N), cl*0.55*smoothstep(0.02,0.2,rd.y)*(1.0-0.5*N));
  vec2 sq = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*150.0;
  vec2 sc = floor(sq); float sh = hash2(sc);
  float tw = 0.75+0.25*sin(gT*3.0+sh*40.0);
  c += vec3(0.9,0.93,1.0)*smoothstep(0.32,0.0,length(fract(sq)-0.5))*(sh>0.975?1.0:0.0)*(0.35+0.65*hash2(sc+3.0))*tw*N*smoothstep(0.0,0.1,rd.y)*(1.0-cl*0.8);
  float band = exp(-pow((rd.x*0.8 - rd.y*1.3 + 0.35)*3.0, 2.0))*0.05*noise2(rd.xy*9.0);
  c += vec3(0.4,0.45,0.65)*band*N;
  float sd = dot(rd, SUN);
  float S = clamp(u_sun, 0.0, 1.0);
  c += vec3(1.0,0.93,0.78)*(smoothstep(0.99975,0.99985,sd)*3.0 + pow(max(sd,0.0),180.0)*0.55*(1.0+u_glare) + pow(max(sd,0.0),12.0)*0.12)*S;
  float ang = acos(clamp(sd, -1.0, 1.0));
  float dsh = step(0.45, fract(atan(rd.y - SUN.y, rd.x - SUN.x)*12.0/6.2832));
  c = mix(c, vec3(1.0,0.85,0.4), smoothstep(0.0022, 0.0008, abs(ang-0.045))*u_mark*dsh);
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
  if (hit2 > 0.5) {
    c = mix(mix(vec3(132.0,146.0,164.0)/255.0, base, 0.55), vec3(0.02,0.025,0.04), clamp(u_night,0.0,1.0));
  }
  if (hit > 0.5) {
    float side = hash2(vec2(cid,6.0));
    vec3 bc = mix(vec3(95.0,108.0,128.0), vec3(140.0,150.0,165.0), side)/255.0;
    float wx = step(0.45, fract(fx*9.0)), wy = step(0.5, fract(el*260.0));
    float N = clamp(u_night, 0.0, 1.0);
    bc = mix(bc, bc*1.18+vec3(0.03,0.04,0.05), wx*wy*0.55);
    bc = mix(bc, vec3(0.025,0.03,0.045), N);
    float on = step(0.5, hash2(vec2(floor(fx*9.0)+cid*13.0, floor(el*260.0))));
    bc += wx*wy*vec3(1.0,0.78,0.42)*0.85*on*N;
    c = mix(bc, base, 0.22*(1.0-N));
  }
  hit = max(hit, hit2);
  return c;
}
vec4 pixel(vec2 uv){
  gT = u_time;
  gLift = u_lift; gFloat = u_float;
  vec2 p = screenP(uv, 0.0);
  float sh = u_shake;
  vec2 jit = sh*vec2(noise2(vec2(u_time*23.0,1.0))-0.5, noise2(vec2(u_time*19.0,7.0))-0.5)*0.12;
  vec3 ro = vec3(-0.6+u_panx + jit.x, 1.55+u_rise + jit.y, 6.0-3.0*u_cam);
  vec3 ta = vec3(0.6+u_panx*1.5, 1.6+u_rise*0.6+u_tilt+u_look, -14.0);
  vec3 rd = camRay(p, ro, ta, u_lens > 0.0 ? u_lens : 1.15);
  vec3 sky = skyCol(rd);
  float hb;
  vec3 bgd = skyline(rd, sky, hb);
  gGround = 0.0;
  float tg = rd.y < 0.0 ? -ro.y/rd.y : 1e9;
  float hz = 1.0 + max(u_rise,0.0)*0.09;
  vec3 m = march(ro, rd, min(tg, 60.0*hz), 0.0);
  vec3 col = bgd;
  vec3 L = normalize(vec3(-0.6,1.0,0.5));
  float N = clamp(u_night, 0.0, 1.0), FR = clamp(u_frost, 0.0, 1.0);
  vec3 key = vec3(1.25,1.15,1.0)*(1.0-N), skyF = mix(lin(vec3(0.62,0.72,0.86))*0.55, vec3(0.035,0.045,0.08)+vec3(0.08,0.11,0.17)*FR, N), bnc = lin(vec3(0.42,0.5,0.28))*0.5*(1.0-N);
  vec3 hazeC = mix(lin(vec3(173.0,198.0,226.0)/255.0), vec3(0.004,0.005,0.012), N);
  vec3 frostC = lin(vec3(0.86,0.9,0.97));
  if (m.x > 0.0) {
    vec3 pos = ro+rd*m.x;
    gGround = 1.0;
    vec3 n = calcNormal(pos);
    gGround = 0.0;
    vec3 alb = lin(vec3(0.3,0.5,0.2));
    float id = m.y;
    vec2 cid = floor(pos.xz/2.6);
    if (id < 2.5) { alb = lin(mix(vec3(79.0,127.0,51.0), vec3(104.0,148.0,62.0), noise2(pos.xz*0.7))/255.0); n = facet(n, 4.0); }
    else if (id < 3.5) alb = lin(vec3(90.0,70.0,50.0)/255.0);
    else if (id < 4.5) {
      float k = hash2(cid+21.0);
      vec3 c = k<0.17? vec3(200.0,68.0,58.0) : k<0.34? vec3(227.0,178.0,60.0) : k<0.5? vec3(60.0,111.0,176.0) : k<0.67? vec3(62.0,154.0,142.0) : k<0.83? vec3(123.0,90.0,166.0) : vec3(232.0,226.0,214.0);
      alb = lin(c/255.0);
    }
    else if (id < 5.5) alb = lin((hash2(cid+4.0)>0.5? vec3(46.0,52.0,64.0) : vec3(74.0,90.0,122.0))/255.0);
    else if (id < 6.5) alb = lin(mix(vec3(241.0,201.0,165.0), vec3(141.0,90.0,59.0), hash2(cid+9.0))/255.0);
    else if (id < 7.5) alb = lin(vec3(185.0,178.0,166.0)/255.0);
    else alb = lin(vec3(175.0,212.0,232.0)/255.0);
    if (id < 3.5 || id > 6.5) alb = mix(alb, frostC, FR*smoothstep(-0.3,0.5,n.y)*(id > 7.5 ? 1.0 : 0.9));
    float gl = id > 7.5 ? 0.9*(1.0-FR*0.6) : 0.05;
    col = shade(pos, n, rd, alb, L, key, skyF, bnc, gl);
    if (id > 7.5) col += lin(vec3(0.85,0.92,1.0))*0.25*pow(clamp(1.0+dot(n,rd),0.0,1.0),2.0)*(1.0-N*0.8);
    col = grade(col, hazeC, m.x/hz, 14.0, 0.28, 0.03);
  } else if (tg < 1e8) {
    vec3 pos = ro+rd*tg;
    float gn = noise2(pos.xz*0.35);
    vec3 gcol = mix(vec3(67.0,98.0,47.0), vec3(110.0,140.0,70.0), gn)/255.0;
    float bl = noise2(pos.xz*vec2(14.0,40.0))*noise2(pos.xz*vec2(31.0,9.0)+3.0);
    gcol *= 0.78+0.55*bl*smoothstep(30.0*hz,3.0,tg);
    vec3 a = lin(gcol);
    a = mix(a, frostC*(0.85+0.3*bl), FR*0.92);
    vec2 sp = pos.xz + vec2(0.45,-0.35);
    vec2 cid = floor(sp/2.6);
    float s = 1.0;
    if (u_ppl > 0.5 && hash2(cid) > 0.42 && abs(cid.x) < 6.0 && cid.y > -8.0 && cid.y < -1.0) {
      vec2 j = (vec2(hash2(cid+7.1), hash2(cid+3.3))-0.5)*1.0;
      vec2 c = cid*2.6+1.3+j;
      float lift = gLift*(0.55+0.9*hash2(cid+11.0));
      float d = length((sp-c)*vec2(1.0,0.7));
      s = mix(0.5,1.0,smoothstep(0.12,0.38+lift*0.5,d)*1.0);
      s = mix(1.0, s, 1.0/(1.0+lift*1.5));
    }
    float tz = pos.z + 23.0 - 1.2;
    float tcx = floor((pos.x+0.9+2.5)/5.0);
    float tx = mod(pos.x+0.9+2.5,5.0)-2.5;
    tz += (hash2(vec2(tcx,1.0))-0.5)*4.0;
    s *= mix(0.55,1.0,smoothstep(1.2,2.4,length(vec2(tx,tz*0.8))));
    float fd = length((pos.xz - FC.xz + vec2(0.5,-0.4)));
    s *= mix(0.6,1.0,smoothstep(1.5,2.2,fd));
    col = a*(key*0.85*s + skyF*1.2);
    col += vec3(0.7,0.85,1.0)*step(0.99, hash2(floor(pos.xz*40.0)))*FR*N*smoothstep(14.0,2.0,tg)*0.9;
    col = grade(col, hazeC, tg/hz, 16.0, 0.3, 0.03);
  }
  return vec4(col, 1.0);
}
