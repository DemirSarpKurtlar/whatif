// Low-poly volcanic landscape: big cone with crater, distant cones, ash plume, lava, lightning.
// params: u_cam (dolly 0..2), u_yaw, u_pitch, u_erupt (0..1 plume growth), u_light (0..1 lightning),
//         u_ash (0..1 sky darkening), u_lava (0..1 lava glow), u_shake
float gT = 0.0;
const vec3 VC = vec3(0.0, 0.0, -48.0);
float h3(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float n3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z); }
float cone(vec3 p, float r, float h){
  float q = length(p.xz);
  float k = r/h;
  float d = (q - r*(1.0 - p.y/h))/sqrt(1.0+k*k);
  return max(d, -p.y);
}
vec2 map(vec3 p){
  vec3 q = p - VC;
  float c = cone(q, 16.0, 11.0);
  c = max(c, q.y - 9.6);                                   // truncated top
  c = max(c, -(length(q.xz) - 2.4 + (q.y-9.6)*0.3));        // crater bowl
  c += 0.25*n3(q*0.6);                                       // rough slopes
  vec2 r = vec2(c*0.8, 1.0);
  vec3 q2 = p - vec3(-38.0, 0.0, -95.0);
  r = opU(r, vec2(cone(q2, 20.0, 12.0)*0.8 + 0.3*n3(q2*0.4), 2.0));
  vec3 q3 = p - vec3(42.0, 0.0, -110.0);
  r = opU(r, vec2(cone(q3, 18.0, 14.0)*0.8 + 0.3*n3(q3*0.4), 2.0));
  return r;
}
float plumeDensity(vec3 p){
  vec3 q = p - VC - vec3(0.0, 9.0, 0.0);
  float top = 2.0 + 46.0*u_erupt;
  if (q.y < -1.0 || q.y > top + 10.0) return 0.0;
  float yy = max(q.y, 0.0);
  float rad = 2.2 + 0.32*yy + 9.0*smoothstep(top-8.0, top+4.0, yy);   // mushroom head
  float dxz = length(q.xz + vec2(yy*yy*0.004, 0.0));                    // drift with wind
  float edge = smoothstep(rad, rad*0.35, dxz) * smoothstep(top+10.0, top-2.0, yy);
  float nn = n3(q*0.16 + vec3(0.0, -gT*0.9, 0.0))*0.65 + n3(q*0.42 + vec3(gT*0.2, -gT*1.6, 0.0))*0.35;
  return clamp(edge*(nn*1.6-0.25), 0.0, 1.0);
}
float segD(vec3 ro, vec3 rd, vec3 a, vec3 b){
  vec3 ba=b-a, w0=ro-a; float B=dot(rd,ba), C=dot(ba,ba), D=dot(rd,w0), E=dot(ba,w0);
  float uu=clamp((E-B*D)/max(C-B*B,1e-5),0.0,1.0); float sv=max(dot(rd,a+ba*uu-ro),0.0);
  return length(ro+rd*sv-(a+ba*uu))/max(sv,1.0);
}
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  p += u_shake*vec2(noise2(vec2(u_time*23.0,1.0))-0.5, noise2(vec2(u_time*19.0,7.0))-0.5)*0.03;
  vec3 ro = vec3(0.0, 2.2, 14.0 - 10.0*u_cam);
  vec3 fw = vec3(sin(u_yaw)*cos(u_pitch), sin(u_pitch), -cos(u_yaw)*cos(u_pitch));
  vec3 rd = camRay(p, ro, ro+fw, 1.1);
  float e = clamp(rd.y, 0.0, 1.0);
  vec3 sky = mix(vec3(173.0,198.0,226.0)/255.0, vec3(70.0,104.0,152.0)/255.0, pow(e,0.6));
  vec3 ashSky = mix(vec3(0.36,0.30,0.26), vec3(0.12,0.10,0.09), pow(e,0.5));
  sky = mix(sky, ashSky, u_ash);
  vec3 L = normalize(vec3(-0.6, 0.8, 0.4));
  float tg = rd.y < 0.0 ? -ro.y/rd.y : 1e9;
  vec3 m = march(ro, rd, min(tg, 160.0), 0.0);
  float tHit = m.x > 0.0 ? m.x : (tg < 1e8 ? tg : 200.0);
  vec3 col = sky;
  float lightK = 1.0 - 0.65*u_ash;
  vec3 hz = mix(vec3(173.0,198.0,226.0)/255.0, vec3(0.3,0.26,0.23), u_ash);
  if (m.x > 0.0) {
    vec3 pos = ro + rd*m.x; vec3 n = facet(calcNormal(pos), 4.0);
    vec3 q = pos - VC;
    vec3 alb = mix(vec3(0.24,0.21,0.2), vec3(0.36,0.31,0.27), n3(pos*0.3));
    alb = mix(alb, vec3(0.3,0.42,0.2), smoothstep(3.5, 1.0, pos.y)*0.6);   // green foot
    float dif = clamp((dot(n,L)+0.25)/1.25, 0.0, 1.0);
    col = alb*(vec3(1.2,1.1,0.95)*dif*lightK + vec3(0.35,0.38,0.45)*0.35);
    // lava rivers on the main cone
    if (m.y < 1.5 && u_lava > 0.0) {
      float a = atan(q.z, q.x);
      float ch = smoothstep(0.82, 0.95, n3(vec3(a*5.0, q.y*0.15, 3.0)) + 0.25*(q.y/9.6));
      float hot = ch * smoothstep(0.0, 9.6, q.y + 9.6*(1.0-u_lava)) * u_lava;
      col = mix(col, vec3(1.0,0.45,0.08)*1.6, clamp(hot,0.0,1.0));
      col += vec3(1.0,0.35,0.05)*0.6*u_lava*smoothstep(3.5, 0.0, length(q.xz)-1.5)*step(8.5, q.y);
    }
    col = mix(col, hz, clamp((m.x-30.0)/140.0, 0.0, 0.75));
  } else if (tg < 1e8) {
    vec3 pos = ro + rd*tg;
    vec3 g = mix(vec3(0.28,0.36,0.18), vec3(0.36,0.42,0.22), noise2(pos.xz*0.15));
    g *= 0.8 + 0.35*noise2(pos.xz*vec2(3.0,9.0));
    col = g*(vec3(1.15,1.05,0.9)*0.85*lightK + vec3(0.3,0.33,0.4)*0.3);
    col = mix(col, hz, clamp((tg-20.0)/140.0, 0.0, 0.8));
  }
  // ash plume: coarse volume march along the ray up to the hit
  if (u_erupt > 0.0) {
    float acc = 0.0; vec3 pc = vec3(0.0);
    float t0 = 20.0, t1 = min(tHit, 140.0);
    float dt = (t1 - t0)/20.0;
    for (int i = 0; i < 20; i++) {
      float t = t0 + dt*(float(i) + hash2(uv*u_resolution + float(i)));
      vec3 sp = ro + rd*t;
      float d = plumeDensity(sp);
      if (d > 0.001) {
        float yy = sp.y - VC.y - 9.0;
        vec3 c = mix(vec3(0.42,0.38,0.35), vec3(0.18,0.16,0.15), clamp(yy/40.0,0.0,1.0));
        c += vec3(1.0,0.4,0.08)*u_lava*0.9*exp(-max(yy,0.0)*0.18);          // lit from the vent
        c *= 0.6 + 0.5*lightK;
        float a = d*dt*0.26;
        pc += c*a*(1.0-acc); acc += a*(1.0-acc);
        if (acc > 0.97) break;
      }
    }
    col = mix(col, pc/max(acc,1e-3), acc);
    // lightning inside the column
    if (u_light > 0.0) {
      float k = floor(u_time*2.3);
      float flash = step(0.55, h3(vec3(k,1.0,2.0))) * (1.0 - fract(u_time*2.3)*1.8);
      if (flash > 0.0) {
        vec3 a0 = VC + vec3((h3(vec3(k,3.0,0.0))-0.5)*8.0, 18.0 + 20.0*u_erupt, 0.0);
        float bolt = 0.0; vec3 a = a0;
        for (int j = 0; j < 5; j++) {
          vec3 b = a + vec3((h3(vec3(k, float(j), 5.0))-0.5)*6.0, -4.5, (h3(vec3(k, float(j), 9.0))-0.5)*3.0);
          bolt = max(bolt, smoothstep(0.0025, 0.0, segD(ro, rd, a, b)));
          a = b;
        }
        col += vec3(0.75,0.82,1.0)*(bolt*1.5 + acc*0.35)*flash*u_light;
      }
    }
  }
  col = pow(max(col, 0.0), vec3(0.95));
  return vec4(col, 1.0);
}
