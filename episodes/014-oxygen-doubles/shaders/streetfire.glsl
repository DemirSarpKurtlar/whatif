// City street looking north (-z). East = +x = screen right.
// params: cam (forward drift), fling (0..1 loose objects thrown east), lean (0..1 top floors shear east),
//         wind (0..1 dust streaks), shake, tilt (camera pitch), dust (0..1 haze/debris), panx
float gFling = 0.0;
float gLean = 0.0;
float gT = 0.0;
float bheight(float cid, float side){ return 9.0 + 22.0*hash2(vec2(cid, side*3.1)); }
vec2 buildings(vec3 p){
  float side = p.x > 0.0 ? 1.0 : -1.0;
  float c0 = floor((p.z + 4.0)/8.0);
  float d = 1e9;
  for (int k = -1; k <= 1; k++) {
    float cid = c0 + float(k);
    float h = bheight(cid, side);
    float sh = gLean * 3.2 * pow(clamp(p.y/h, 0.0, 1.0), 2.0);
    vec3 r = vec3(abs(p.x - sh), p.y, p.z - cid*8.0);
    d = min(d, sdRoundBox(r - vec3(12.0, h*0.5, 0.0), vec3(4.6, h*0.5, 3.7), 0.05));
  }
  return vec2(d*(gLean > 0.01 ? 0.6 : 1.0), 2.0);
}
vec2 cars(vec3 p){
  vec2 res = vec2(1e9, 0.0);
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float x0 = (i == 0 || i == 3) ? -2.2 : 2.2;
    if (i == 4) x0 = -5.0;
    float z0 = -6.0 - fi*7.5;
    float fl = gFling * (0.6 + 0.5*hash2(vec2(fi, 2.0)));
    float x = min(x0 + fl*14.0, 6.2 - 0.3*fi);
    float y = 0.75 + gFling*(1.0-gFling)*4.0*hash2(vec2(fi,5.0));
    vec3 q = p - vec3(x, y, z0);
    q.xy = rot(-fl*1.7*hash2(vec2(fi,7.0)))*q.xy;
    float body = sdRoundBox(q - vec3(0.0,-0.05,0.0), vec3(0.88, 0.26, 2.0), 0.12);
    float cab = sdRoundBox(q - vec3(0.0, 0.42, 0.1), vec3(0.74, 0.24, 1.05), 0.16);
    vec3 w = q; w.x = abs(w.x) - 0.82; w.z = abs(w.z) - 1.3; w.y += 0.32;
    float wh = sdCylinder(w.yxz, 0.32, 0.13);
    res = opU(res, vec2(min(body, cab), 4.0 + fi*0.01));
    res = opU(res, vec2(wh, 3.0));
  }
  return res;
}
vec2 people(vec3 p){
  vec2 res = vec2(1e9, 0.0);
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    float side = mod(fi, 2.0) < 0.5 ? -1.0 : 1.0;
    float x0 = side*(4.5 + 0.8*hash2(vec2(fi,1.0)));
    float z0 = -4.0 - fi*4.3;
    float fl = gFling*(0.7 + 0.6*hash2(vec2(fi,3.0)));
    float x = min(x0 + fl*16.0, 6.6);
    float y = gFling*(1.0-gFling)*6.0*hash2(vec2(fi,4.0));
    vec3 q = p - vec3(x, y, z0);
    q.xy = rot(-fl*2.5)*q.xy;
    float d = min(sdCapsule(q, vec3(0.0,0.1,0.0), vec3(0.0,1.15,0.0), 0.2), sdSphere(q-vec3(0.0,1.48,0.0), 0.15));
    res = opU(res, vec2(d, 5.0 + fi*0.01));
  }
  return res;
}
vec2 props(vec3 p){
  // lamp posts (bolted down) and trash bins (loose)
  vec3 q = p; q.x = abs(q.x); float cid = floor((q.z+5.0)/10.0); q.z = mod(q.z+5.0,10.0)-5.0;
  float pole = sdCapsule(q, vec3(6.8,0.0,0.0), vec3(6.8,5.0,0.0), 0.08);
  float lamp = sdRoundBox(q - vec3(6.3,5.0,0.0), vec3(0.5,0.08,0.15), 0.05);
  vec2 r = vec2(min(pole, lamp), 6.0);
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float x = min(-6.3 + gFling*(13.0 + 3.0*fi), 6.3);
    vec3 b = p - vec3(x, 0.45 + gFling*(1.0-gFling)*3.0, -3.0 - fi*9.0);
    b.xy = rot(-gFling*4.0)*b.xy;
    r = opU(r, vec2(sdCylinder(b, 0.45, 0.3), 7.0));
  }
  return r;
}
float gGround = 1.0;
vec2 map(vec3 p){
  vec2 r = vec2(1e9, 0.0);
  r = opU(r, buildings(p));
  if (p.y < 5.0) { r = opU(r, cars(p)); r = opU(r, people(p)); }
  r = opU(r, props(p));
  if (gGround > 0.5) r = opU(r, vec2(p.y, 0.0));
  return r;
}
vec3 skyC(vec3 rd){
  vec3 hor = vec3(214.0,206.0,198.0)/255.0, top = vec3(92.0,128.0,176.0)/255.0;
  vec3 c = mix(hor, top, pow(clamp(rd.y,0.0,1.0),0.6));
  vec2 cp = rd.xz/(rd.y+0.08)*2.0;
  float cl = smoothstep(0.55,0.85,noise2(cp*1.3+vec2(gT*0.02,0.0))*0.65+noise2(cp*3.1)*0.35);
  return mix(c, vec3(0.96,0.95,0.93), cl*0.5*smoothstep(0.02,0.2,rd.y));
}
vec4 pixel(vec2 uv){
  gT = u_time; gFling = u_fling; gLean = u_lean;
  vec2 p = screenP(uv, 0.0);
  vec2 jit = u_shake*vec2(noise2(vec2(u_time*23.0,1.0))-0.5, noise2(vec2(u_time*19.0,7.0))-0.5)*0.14;
  vec3 ro = vec3(-1.0 + u_panx + jit.x, 1.7 + jit.y, 8.0 - 6.0*u_cam);
  vec3 ta = vec3(0.3 + u_panx, 2.6 + u_tilt*6.0, -30.0);
  vec3 rd = camRay(p, ro, ta, 1.1);
  vec3 col = skyC(rd);
  gGround = 0.0;
  float tg = rd.y < 0.0 ? -ro.y/rd.y : 1e9;
  vec3 m = march(ro, rd, min(tg, 160.0), 0.0);
  vec3 L = normalize(vec3(0.7, 0.8, 0.3));
  vec3 haze = vec3(214.0,206.0,198.0)/255.0;
  float th = -1.0; vec3 pos; vec3 n; float id = 0.0;
  if (m.x > 0.0) { th = m.x; pos = ro + rd*m.x; n = calcNormal(pos); id = m.y; }
  else if (tg < 1e8) { th = tg; pos = ro + rd*tg; n = vec3(0.0,1.0,0.0); id = 0.0; }
  if (th > 0.0) {
    vec3 alb;
    if (id < 0.5) {
      float lane = abs(pos.x) < 7.0 ? 1.0 : 0.0;
      alb = lane > 0.5 ? vec3(0.25,0.26,0.28) : vec3(0.66,0.63,0.59);
      if (lane > 0.5 && abs(pos.x) < 0.1 && fract(pos.z*0.2) < 0.5) alb = vec3(0.92,0.86,0.55);
      if (abs(abs(pos.x)-7.0) < 0.12) alb = vec3(0.8,0.78,0.74);
      alb *= 0.9 + 0.2*noise2(pos.xz*3.0);
    } else if (id < 2.5) {
      float side = pos.x > 0.0 ? 1.0 : -1.0;
      float cid = floor((pos.z + 4.0)/8.0);
      float hk = hash2(vec2(cid, side));
      alb = mix(vec3(0.76,0.66,0.55), vec3(0.58,0.63,0.7), hk);
      if (hk > 0.7) alb = vec3(0.82,0.78,0.7);
      float wx = step(0.35, fract(pos.z*0.55)), wy = step(0.4, fract(pos.y*0.33));
      if (abs(n.x) > 0.5 && pos.y > 1.2) alb = mix(alb, vec3(0.3,0.4,0.5), wx*wy*0.85);
    } else if (id < 3.5) alb = vec3(0.08);
    else if (id < 4.5) {
      float k = hash2(vec2(floor((id-4.0)*100.0+0.5), 9.0));
      alb = k < 0.3 ? vec3(0.75,0.15,0.12) : k < 0.55 ? vec3(0.9,0.88,0.85) : k < 0.8 ? vec3(0.15,0.3,0.6) : vec3(0.9,0.7,0.15);
      vec3 q = pos; if (pos.y > 0.95 + gFling*2.0*0.0 && n.y < 0.7) alb = mix(alb, vec3(0.12,0.16,0.2), 0.8);
    } else if (id < 5.5) {
      float k = hash2(vec2(floor((id-5.0)*100.0+0.5), 4.0));
      alb = k < 0.33 ? vec3(0.78,0.27,0.23) : k < 0.66 ? vec3(0.24,0.43,0.69) : vec3(0.89,0.7,0.24);
    } else if (id < 6.5) alb = vec3(0.2,0.22,0.24);
    else alb = vec3(0.3,0.45,0.32);
    vec3 a = lin(alb);
    vec3 c;
    if (id > 2.5) {
      c = shade(pos, n, rd, a, L, vec3(1.3,1.12,0.95), lin(vec3(0.6,0.7,0.85))*0.6, lin(vec3(0.5,0.48,0.45))*0.4, (id > 3.5 && id < 4.5) ? 0.7 : 0.1);
    } else {
      float dif = clamp(dot(n, L), 0.0, 1.0);
      float ao = id < 0.5 ? 1.0 : clamp(0.55 + pos.y*0.03, 0.0, 1.0);
      float sh = 1.0;
      if (id < 0.5) {
        // cheap building shadow on the street: sun from +x, east-side buildings shade the west half late
        sh = mix(0.55, 1.0, smoothstep(-6.5, -2.0, pos.x));
      }
      c = a*(vec3(1.3,1.12,0.95)*dif*sh + lin(vec3(0.6,0.7,0.85))*(0.45+0.25*n.y)*ao);
    }
    col = grade(c, lin(haze), th, 60.0, 0.3, 0.03);
  }
  // wind: dust streaks racing east (+x = right)
  if (u_wind > 0.0) {
    vec2 s = vec2(uv.x*3.0 - u_time*9.0, uv.y*90.0);
    float st = smoothstep(0.75, 0.95, noise2(vec2(s.x, floor(s.y)))) * u_wind;
    col = mix(col, vec3(0.85,0.8,0.72), st*0.55);
    col = mix(col, vec3(0.78,0.72,0.62), u_wind*0.18);
  }
  if (u_dust > 0.0) col = mix(col, vec3(0.7,0.64,0.56), u_dust*0.35*(0.6+0.4*noise2(uv*4.0+u_time*0.3)));
  // street fire overlay: power-line sparks, burning cars glow, embers, smoke tint
  if (u_fire > 0.0) {
    // fire light pools along the street at a few spots
    for (int k=0;k<4;k++){
      float fk = float(k);
      vec3 c = vec3(k==0 ? -3.4 : k==1 ? 3.6 : k==2 ? -3.0 : 3.2, 0.8, -6.0 - fk*9.0);
      vec3 w = c - ro; float tt = max(dot(w, rd), 0.0);
      float d = length(ro + rd*tt - c);
      float fl = 0.8 + 0.2*sin(u_time*13.0 + fk*3.0);
      col += vec3(1.0,0.42,0.08)*exp(-d*d/(0.6 + 2.5*u_fire))*u_fire*fl*1.1;
      // flame tongue
      vec2 sp = vec2(dot(ro + rd*tt - c, normalize(cross(rd, vec3(0,1,0)))), (ro + rd*tt - c).y);
      float tongue = smoothstep(0.6*u_fire, 0.0, abs(sp.x) + max(sp.y,0.0)*0.25 - 0.15*noise2(vec2(sp.x*5.0, sp.y*4.0 - u_time*7.0)))*step(-0.3, sp.y)*step(sp.y, 2.5*u_fire);
      col = mix(col, mix(vec3(1.0,0.9,0.5), vec3(1.0,0.35,0.05), clamp(sp.y/(2.5*u_fire+0.01),0.0,1.0)), tongue*0.9);
    }
    // a sparking power line across the street
    float ly = 4.6;
    vec3 a = vec3(-7.0, ly, -10.0), b = vec3(7.0, ly - 0.5, -10.0);
    vec3 ba = b - a, w0 = ro - a; float B = dot(rd,ba), C = dot(ba,ba), D = dot(rd,w0), E = dot(ba,w0);
    float uu = clamp((E - B*D)/max(C - B*B,1e-5),0.0,1.0); float sv = max(dot(rd, a + ba*uu - ro), 0.0);
    float dl = length(ro + rd*sv - (a + ba*uu));
    col = mix(col, vec3(0.05), smoothstep(0.03, 0.01, dl));
    float spk = step(0.6, fract(u_time*3.0))*smoothstep(0.6, 0.0, length(ro + rd*sv - vec3(1.0, ly - 0.25, -10.0)));
    col += vec3(1.0,0.85,0.5)*spk*3.0*u_fire;
    // embers
    for (int k=0;k<2;k++){
      float fk = float(k);
      vec2 g = uv*vec2(24.0 + fk*14.0, 12.0 + fk*7.0) + vec2(fk*5.1, u_time*(1.8 + fk*0.8));
      vec2 ci = floor(g); vec2 f = fract(g) - 0.5; float h = hash2(ci + fk*9.0);
      if (h > 0.84) col += vec3(1.0,0.6,0.2)*smoothstep(0.08,0.0,length(f))*(0.5+0.5*sin(u_time*11.0+h*30.0))*u_fire*1.4;
    }
    col = mix(col, col*vec3(1.1,0.85,0.7) + vec3(0.06,0.02,0.0), u_fire*0.6);
  }
  return vec4(col, 1.0);
}
