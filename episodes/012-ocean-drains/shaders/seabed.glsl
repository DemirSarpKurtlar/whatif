// The drained ocean floor. params:
// u_cam (metres travelled forward, -z), u_camh (camera height above ground), u_panx, u_tilt (pitch, + up),
// u_ridge (0..1 mid-ocean ridge range ahead), u_trench (0..1 trench chasm ahead), u_wreck (0..1 shipwreck),
// u_fish (0..1 stranded fish glints), u_dusk (0 day .. 1 dusk), u_mud (0 dry .. 1 wet glossy), u_yaw
float gT = 0.0;
float Hmud(vec2 xz){
  float h = 0.35*noise2(xz*0.12) + 0.12*noise2(xz*0.6) + 0.03*noise2(xz*3.0);
  return h;
}
float H(vec2 xz){
  float h = Hmud(xz);
  if (u_ridge > 0.0) {
    float band = exp(-pow((xz.y + 170.0)/45.0, 2.0));
    float peaks = noise2(vec2(xz.x*0.025, 3.0))*0.6 + noise2(xz*0.05)*0.4;
    h += u_ridge*band*(28.0 + 55.0*peaks*peaks);
    // central rift valley along the ridge crest
    h -= u_ridge*12.0*exp(-pow((xz.y + 170.0)/6.0, 2.0));
  }
  return h;
}
float sdShip(vec3 p){
  vec3 q = p - vec3(9.0, 0.0, -32.0);
  q.xz = rot(0.55)*q.xz;
  q.xy = rot(0.06)*q.xy;
  float hull = sdRoundBox(q - vec3(0.0, 1.2, 0.0), vec3(13.0, 2.4, 2.0), 0.6);
  hull = max(hull, q.y - 3.4);
  float deck = sdRoundBox(q - vec3(0.0, 4.0, 0.0), vec3(9.0, 0.8, 1.6), 0.2);
  float f = 1e9;
  for (int i = 0; i < 4; i++) {
    float fx = -5.4 + 3.6*float(i);
    vec3 c = q - vec3(fx, 6.0, 0.0); c.xy = rot(0.12)*c.xy;
    f = min(f, sdCylinder(c, 1.5, 0.55));
  }
  // broken stern: cut a jagged gap
  float gap = abs(q.x - 6.5) - 0.9 - 0.4*sin(q.y*3.0);
  float s = min(min(hull, deck), f);
  s = max(s, -gap);
  return s;
}
vec2 map(vec3 p){
  float g = (p.y - H(p.xz))*0.5;
  if (u_trench > 0.0) {
    float zc = p.z + 36.0 + 5.0*sin(p.x*0.035);
    float w = mix(5.0, 16.0, u_trench) + 1.6*noise2(vec2(p.x*0.2, p.y*0.15)) + 0.04*max(-p.y,0.0);
    float depth = mix(70.0, 900.0, u_trench);
    float slot = max(abs(zc) - w, -(p.y + depth));
    g = max(g, -slot);
  }
  vec2 r = vec2(g, 0.0);
  if (u_wreck > 0.0) {
    float sp = sdShip(p + vec3(0.0, 2.6*(1.0-u_wreck) + 0.9, 0.0));
    r = opU(r, vec2(sp, 2.0));
  }
  return r;
}
vec3 skyC(vec3 rd){
  vec3 hor = mix(vec3(0.82,0.86,0.9), vec3(0.98,0.72,0.52), u_dusk);
  vec3 top = mix(vec3(0.33,0.47,0.66), vec3(0.24,0.25,0.45), u_dusk);
  vec3 c = mix(hor, top, pow(clamp(rd.y,0.0,1.0),0.55));
  vec2 cp = rd.xz/(rd.y+0.08)*2.0;
  float cl = smoothstep(0.6,0.88,noise2(cp*1.1+vec2(gT*0.02,0.0))*0.65+noise2(cp*2.7)*0.35);
  c = mix(c, mix(vec3(0.96), vec3(1.0,0.82,0.7), u_dusk), cl*0.5*smoothstep(0.03,0.25,rd.y));
  return c;
}
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  float z0 = -u_cam;
  vec3 ro = vec3(u_panx, 0.0, z0);
  ro.y = H(ro.xz) + u_camh;
  vec3 fwd = normalize(vec3(sin(u_yaw), u_tilt, -cos(u_yaw)));
  vec3 rd = camRay(p, ro, ro + fwd, 1.1);
  vec3 L = normalize(vec3(-0.5, mix(0.55, 0.18, u_dusk), -0.6));
  vec3 sky = skyC(rd);
  sky += vec3(1.0,0.8,0.55)*pow(max(dot(rd,L),0.0), 300.0)*1.5 + vec3(1.0,0.75,0.5)*pow(max(dot(rd,L),0.0), 8.0)*0.18;
  vec3 m = march(ro, rd, 900.0, 0.0);
  vec3 col = sky;
  vec3 hazeC = lin(mix(vec3(0.82,0.86,0.9), vec3(0.95,0.72,0.55), u_dusk));
  if (m.x > 0.0) {
    vec3 pos = ro + rd*m.x;
    vec3 n = calcNormal(pos);
    vec3 alb;
    if (m.y < 0.5) {
      float depthFromPlain = clamp(-pos.y/300.0, 0.0, 1.0);
      vec3 mudA = mix(vec3(122.0,100.0,74.0), vec3(96.0,80.0,62.0), noise2(pos.xz*0.3))/255.0;
      vec3 rock = mix(vec3(70.0,64.0,62.0), vec3(40.0,38.0,42.0), noise2(pos.xz*0.7 + pos.y*0.2))/255.0;
      float steep = smoothstep(0.75, 0.45, n.y);
      alb = mix(mudA, rock, max(steep, smoothstep(8.0, 30.0, pos.y)));
      alb = mix(alb, vec3(0.1,0.09,0.1), depthFromPlain*0.85);
      float cn = noise2(pos.xz*1.1) + 0.5*noise2(pos.xz*2.3 + 7.0);
      float crack = smoothstep(0.035, 0.0, abs(fract(cn*2.5) - 0.5) - 0.46);
      alb *= 1.0 - 0.45*crack*(1.0-u_mud)*smoothstep(30.0, 4.0, m.x)*(1.0-steep);
      alb = lin(alb);
      col = shade(pos, n, rd, alb, L, mix(vec3(1.2,1.12,1.0), vec3(1.3,0.9,0.65), u_dusk), lin(vec3(0.55,0.62,0.75))*0.5, lin(vec3(0.45,0.4,0.33))*0.4, 0.05 + 0.55*u_mud);
      // stranded fish glints
      if (u_fish > 0.0 && m.x < 35.0) {
        vec2 fc = pos.xz*1.3; vec2 fi = floor(fc); vec2 ff = fract(fc) - 0.5;
        float hf = hash2(fi);
        if (hf > 0.86) {
          vec2 o = ff - (vec2(hash2(fi+3.0), hash2(fi+7.0)) - 0.5)*0.5;
          o = rot(hf*6.28)*o;
          float fish = smoothstep(0.0, -0.02, length(o*vec2(1.0, 2.6)) - 0.12);
          float glint = 0.6 + 0.4*sin(gT*7.0 + hf*40.0);
          col = mix(col, lin(vec3(0.82,0.86,0.9))*(0.8+1.6*glint), fish*u_fish);
        }
      }
    } else {
      vec3 q = pos;
      alb = lin(mix(vec3(52.0,30.0,22.0), vec3(110.0,58.0,34.0), noise2(q.xz*2.0 + q.y))/255.0);
      col = shade(pos, n, rd, alb, L, vec3(1.15,1.05,0.95), lin(vec3(0.55,0.62,0.75))*0.5, lin(vec3(0.4,0.35,0.3))*0.4, 0.2);
    }
    col = grade(col, hazeC, m.x, 60.0, 0.22, 0.03);
    col = mix(col, pow(hazeC, vec3(0.4545)), smoothstep(250.0, 850.0, m.x));
  }
  return vec4(col, 1.0);
}
