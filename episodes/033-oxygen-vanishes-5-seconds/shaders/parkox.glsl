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
    float ek = u_ears*step(0.25, hash2(cid+17.0));
    ha = mix(ha, vec3(0.19,1.47,0.02), ek);
    vec3 hb = mix(vec3(-ha.x,ha.y,sw), vec3(-0.19,1.47,0.02), ek);
    float arms = min(sdCapsule(q, vec3(0.22,1.12,0.0), ha, 0.065), sdCapsule(q, vec3(-0.22,1.12,0.0), hb, 0.065));
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
vec3 G0 = vec3(-2.6, 0.0, -5.2);
vec3 G1 = vec3(0.9, 0.0, -9.0);
vec3 G2 = vec3(-5.6, 0.0, -11.5);
vec3 G3 = vec3(4.8, 0.0, -12.5);
vec3 gpos(int i){ return i==0 ? G0 : i==1 ? G1 : i==2 ? G2 : G3; }
vec2 grills(vec3 p){
  vec2 r = vec2(1e9, 0.0);
  float bs = length(p.xz - vec2(-0.4,-9.5)) - 8.5;
  if (bs > 3.0 && p.y < 4.0) return vec2(bs - 2.0, 0.0);
  for (int i=0;i<4;i++){
    vec3 q = p - gpos(i);
    float box = sdRoundBox(q - vec3(0.0,0.78,0.0), vec3(0.42,0.1,0.28), 0.04);
    float legs = min(sdCapsule(q, vec3(-0.3,0.0,0.0), vec3(-0.3,0.7,0.0), 0.03), sdCapsule(q, vec3(0.3,0.0,0.0), vec3(0.3,0.7,0.0), 0.03));
    r = opU(r, vec2(min(box,legs), 10.0));
    float f = u_fire*(0.7+0.3*hash2(vec2(float(i),3.0)));
    if (f > 0.02) {
      float h = 0.2 + 1.3*f;
      vec3 fq = q - vec3(0.0, 0.88 + h*0.5, 0.0);
      float wob = 0.12*f*sin(gT*9.0+float(i)*2.0 + fq.y*4.0);
      fq.x += wob;
      float fl = sdEllipsoid(fq, vec3(0.22+0.38*f, h*0.55, 0.18+0.3*f));
      fl += 0.12*(noise2(vec2(fq.x*4.0, fq.y*3.0 - gT*6.0)) - 0.5);
      r = opU(r, vec2(fl*0.7, 11.0));
    }
  }
  return r;
}
vec2 map(vec3 p){
  vec2 r = vec2(1e9, 0.0);
  if (gGround > 0.5) r = vec2(p.y, 0.0);
  r = opU(r, people(p));
  r = opU(r, trees(p));
  r = opU(r, fountain(p));
  r = opU(r, grills(p));
  return r;
}
vec3 skyCol(vec3 rd){
  vec3 hor = vec3(173.0,198.0,226.0)/255.0, top = vec3(80.0,112.0,156.0)/255.0;
  float e = clamp(rd.y,0.0,1.0);
  vec3 c = mix(hor, top, pow(e,0.6));
  vec2 cp = rd.xz/(rd.y+0.08)*2.2;
  float cl = smoothstep(0.55,0.85,noise2(cp*1.3+vec2(gT*0.02,0.0))*0.65+noise2(cp*3.1)*0.35);
  c = mix(c, vec3(0.93,0.95,0.98), cl*0.55*smoothstep(0.02,0.2,rd.y));
  c *= 1.0 - 0.2*u_dim*smoothstep(-0.02,0.3,rd.y);
  vec3 sd = normalize(vec3(0.12,0.6,-0.79));
  float sa = max(dot(rd, sd), 0.0);
  c += vec3(1.0,0.97,0.9)*(smoothstep(0.9993,0.9997,sa)*2.0 + pow(sa,60.0)*0.35 + pow(sa,6.0)*0.08);
  // unfiltered UV: harsh violet glare around the sun
  c += vec3(0.6,0.45,1.0)*u_uv*(pow(sa,24.0)*0.9 + pow(sa,5.0)*0.12);
  c += vec3(1.0)*u_uv*pow(sa,200.0)*1.5;
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
    c = mix(vec3(132.0,146.0,164.0)/255.0, base, 0.55);
  }
  if (hit > 0.5) {
    float side = hash2(vec2(cid,6.0));
    vec3 bc = mix(vec3(95.0,108.0,128.0), vec3(140.0,150.0,165.0), side)/255.0;
    float wx = step(0.45, fract(fx*9.0)), wy = step(0.5, fract(el*260.0));
    bc = mix(bc, bc*1.18+vec3(0.03,0.04,0.05), wx*wy*0.55);
    c = mix(bc, base, 0.22);
  }
  hit = max(hit, hit2);
  return c;
}
vec4 pixel(vec2 uv){
  gT = u_time;
  gLift = u_lift; gFloat = u_float;
  vec2 p = screenP(uv, 0.0);
  p *= 1.0 + u_pop*0.035*sin(length(p)*16.0 - u_time*26.0);
  float sh = u_shake;
  vec2 jit = sh*vec2(noise2(vec2(u_time*23.0,1.0))-0.5, noise2(vec2(u_time*19.0,7.0))-0.5)*0.12;
  vec3 ro = vec3(-0.6+u_panx + jit.x, 1.55+u_rise + jit.y, 6.0-3.0*u_cam);
  vec3 ta = vec3(0.6+u_panx*1.5, 1.6+u_rise*0.6+u_tilt, -14.0);
  vec3 rd = camRay(p, ro, ta, 1.15);
  vec3 sky = skyCol(rd);
  float hb;
  vec3 bgd = skyline(rd, sky, hb);
  gGround = 0.0;
  float tg = rd.y < 0.0 ? -ro.y/rd.y : 1e9;
  vec3 m = march(ro, rd, min(tg, 60.0), 0.0);
  vec3 col = bgd;
  vec3 L = normalize(vec3(-0.6,1.0,0.5));
  vec3 key = vec3(1.25,1.15,1.0), skyF = lin(vec3(0.62,0.72,0.86))*0.55, bnc = lin(vec3(0.42,0.5,0.28))*0.5;
  vec3 hazeC = lin(vec3(173.0,198.0,226.0)/255.0);
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
    else if (id < 8.5) alb = lin(vec3(175.0,212.0,232.0)/255.0);
    else if (id < 10.5) alb = lin(vec3(0.12,0.12,0.13));
    else if (id < 12.5) alb = lin(vec3(0.12,0.42,0.42));
    else alb = lin(vec3(0.78,0.86,0.9));
    float gl = (id > 7.5 && id < 8.5) || id > 11.5 ? 0.9 : 0.05;
    if (id > 10.5 && id < 11.5) {
      // flame: emissive, hotter at the base
      float hgt = clamp((pos.y - 0.85)/(0.25 + 1.3*u_fire), 0.0, 1.0);
      vec3 fc = mix(vec3(1.0,0.95,0.6), vec3(1.0,0.45,0.08), smoothstep(0.1,0.6,hgt));
      fc = mix(fc, vec3(0.75,0.12,0.03), smoothstep(0.6,1.0,hgt));
      float fl = 0.85 + 0.15*noise2(vec2(pos.x*6.0, pos.y*5.0 - gT*10.0));
      col = fc*fl*1.25;
    } else {
      col = shade(pos, n, rd, alb, L, key, skyF, bnc, gl);
      if (id > 7.5 && id < 8.5) col += lin(vec3(0.85,0.92,1.0))*0.25*pow(clamp(1.0+dot(n,rd),0.0,1.0),2.0);
      // warm firelight on nearby objects
      float fl = 0.0;
      for (int i=0;i<4;i++){ float d = length(pos - gpos(i) - vec3(0.0,1.2,0.0)); fl += 1.0/(1.0+d*d*0.5); }
      col += alb*vec3(1.0,0.5,0.15)*fl*u_fire*1.4;
    }
    col = grade(col, hazeC, m.x, 14.0, 0.28, 0.03);
  } else if (tg < 1e8) {
    vec3 pos = ro+rd*tg;
    float gn = noise2(pos.xz*0.35);
    vec3 gcol = mix(vec3(67.0,98.0,47.0), vec3(110.0,140.0,70.0), gn)/255.0;
    float bl = noise2(pos.xz*vec2(14.0,40.0))*noise2(pos.xz*vec2(31.0,9.0)+3.0);
    gcol *= 0.78+0.55*bl*smoothstep(30.0,3.0,tg);
    vec3 a = lin(gcol);
    vec2 sp = pos.xz + vec2(0.45,-0.35);
    vec2 cid = floor(sp/2.6);
    float s = 1.0;
    if (hash2(cid) > 0.42 && abs(cid.x) < 6.0 && cid.y > -8.0 && cid.y < -1.0) {
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
    float fl = 0.0; float near = 1e9;
    for (int i=0;i<4;i++){ vec3 gp = gpos(i); float d = length(pos.xz - gp.xz); near = min(near, d); fl += 1.0/(1.0+d*d*0.6); }
    col += a*vec3(1.0,0.5,0.15)*fl*u_fire*2.0;
    col = grade(col, hazeC, tg, 16.0, 0.3, 0.03);
  }
  // glow halos around flames
  if (u_fire > 0.0) {
    for (int i=0;i<4;i++){
      vec3 c = gpos(i) + vec3(0.0, 1.0 + 0.6*u_fire, 0.0);
      vec3 w = c - ro; float tt = max(dot(w, rd), 0.0);
      if (m.x > 0.0 && tt > m.x + 0.5) continue;
      float d = length(ro + rd*tt - c);
      col += vec3(1.0,0.45,0.1)*exp(-d*d/(0.25+0.9*u_fire))*0.35*u_fire;
    }
  }
  // sparks / embers rising (screen space)
  float emb = u_fire*0.8;
  if (emb > 0.0) {
    for (int k=0;k<3;k++){
      float fk = float(k);
      vec2 g = uv*vec2(26.0 + fk*12.0, 14.0 + fk*6.0) + vec2(fk*7.3, gT*(1.6 + fk*0.7));
      vec2 ci = floor(g); vec2 f = fract(g) - 0.5;
      float h = hash2(ci + fk*13.0);
      if (h > 0.86) {
        vec2 o = vec2(hash2(ci+1.7)-0.5, hash2(ci+3.1)-0.5)*0.6;
        float d = length(f - o);
        float tw = 0.5 + 0.5*sin(gT*12.0 + h*40.0);
        col += vec3(1.0,0.6,0.2)*smoothstep(0.08, 0.0, d)*tw*emb*smoothstep(0.15, 0.6, uv.y)*1.4;
      }
    }
  }
  // smoke wisps rising from snuffed grills
  if (u_smoke > 0.0) {
    for (int i=0;i<4;i++){
      vec3 c0 = gpos(i) + vec3(0.0, 0.9, 0.0);
      vec3 w = c0 - ro; float tt = max(dot(w, rd), 0.0);
      if (m.x > 0.0 && tt > m.x + 0.5) continue;
      vec3 pp = ro + rd*tt - c0;
      float hy = pp.y;
      if (hy > -0.1 && hy < 3.2) {
        float sway = 0.25*sin(hy*2.2 - gT*1.6 + float(i)) * clamp(hy,0.0,1.0);
        float wid = 0.08 + 0.16*hy;
        float d = abs(pp.x - sway + pp.z*0.0);
        float den = smoothstep(wid, 0.0, d) * smoothstep(3.2, 0.6, hy) * (0.55 + 0.45*noise2(vec2(pp.x*5.0, hy*3.0 - gT*2.5)));
        col = mix(col, vec3(0.78,0.78,0.8), den*u_smoke*0.75);
      }
    }
  }
  // UV overexposure: violet-white harshness
  col = mix(col, col*vec3(1.1,1.06,1.18) + vec3(0.05,0.03,0.09), u_uv*0.3);
  if (u_uv > 0.0) {
    // invisible-made-visible: violet UV streaks raining down from the sun
    vec2 sp = vec2(uv.x*1.0 - uv.y*0.32, uv.y);
    float st = smoothstep(0.82, 0.98, noise2(vec2(sp.x*70.0, sp.y*1.5 - u_time*2.4)));
    col += vec3(0.55,0.3,1.0)*st*u_uv*0.22;
  }
  // ear-pop: pressure wave ring
  if (u_pop > 0.0) {
    float r = length(p);
    float ring = smoothstep(0.06, 0.0, abs(r - (0.2 + 1.4*fract(u_time*1.4))));
    col += vec3(0.85,0.92,1.0)*ring*u_pop*0.25;
    col *= 1.0 - u_pop*0.35*smoothstep(0.35, 1.1, r);
  }
  return vec4(col, 1.0);
}
