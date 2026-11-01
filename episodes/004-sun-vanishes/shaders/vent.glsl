// Deep-sea hydrothermal vent (black smoker) lit by its own glow, with tube worms.
float gT=0.0;
vec2 map(vec3 p){
  vec2 r = vec2(p.y + 0.15*noise2(p.xz*1.3) + 0.05*noise2(p.xz*5.0), 0.0);
  vec3 q = p - vec3(0.0,0.0,-6.0);
  float wob = 0.12*noise2(vec2(q.y*2.0, atan(q.z,q.x)*2.0));
  float ch = sdCapsule(q, vec3(0.0,0.0,0.0), vec3(0.15,3.2,0.0), 0.55 - 0.1*q.y/3.2 + wob);
  ch = smin(ch, sdCapsule(q-vec3(1.4,0.0,0.6), vec3(0.0), vec3(-0.1,1.8,0.0), 0.38+wob), 0.4);
  ch = smin(ch, sdEllipsoid(q-vec3(0.0,0.2,0.0), vec3(2.2,0.7,1.8)), 0.6);
  r = opU(r, vec2(ch, 1.0));
  vec3 w = p - vec3(-1.6,0.0,-4.6);
  vec3 bq = abs(w - vec3(1.22,0.7,0.0)) - vec3(1.35,0.9,0.5);
  float bb = length(max(bq,0.0));
  if (bb > 0.2) { r.x = min(r.x, bb); return r; }
  float cid = clamp(floor(w.x/0.35), 0.0, 6.0);
  vec3 ww = w; ww.x = w.x - (cid+0.5)*0.35; ww.z += (hash2(vec2(cid,2.0))-0.5)*0.6;
  float hgt = 0.6+0.7*hash2(vec2(cid,5.0));
  float sway = 0.06*sin(gT*1.5+cid);
  float tube = sdCapsule(ww, vec3(0.0), vec3(sway,hgt,0.0), 0.06);
  float plume = sdSphere(ww-vec3(sway,hgt+0.05,0.0), 0.1);
  float cb = 0.175 - abs(ww.x) + 0.12;
  r = opU(r, vec2(min(tube, max(cb,0.02)), 2.0)); r = opU(r, vec2(plume, 3.0));
  return r;
}
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  vec3 ro = vec3(-1.8+1.4*u_cam, 1.2+0.4*u_cam, 4.2-1.8*u_cam);
  vec3 ta = vec3(-0.2, 2.1, -5.5);
  vec3 rd = camRay(p, ro, ta, 1.2);
  vec3 bg = vec3(0.0,0.012,0.03);
  vec3 col = bg;
  vec3 VL = vec3(0.15, 3.5, -6.0);
  vec3 m = march(ro, rd, 30.0, 0.0);
  if (m.x > 0.0) {
    vec3 pos = ro+rd*m.x; vec3 n = calcNormal(pos);
    vec3 alb = m.y < 0.5 ? vec3(0.18,0.16,0.14) : m.y < 1.5 ? vec3(0.12,0.1,0.09) : m.y < 2.5 ? vec3(0.85,0.82,0.75) : vec3(0.85,0.08,0.06);
    vec3 Lv = VL - pos; float dl = length(Lv); Lv /= dl;
    float glow = (0.6+0.4*sin(gT*3.0+pos.y))*u_glow;
    vec3 lc = vec3(1.0,0.45,0.12)*glow*clamp(dot(n,Lv),0.0,1.0)*4.0/(1.0+dl*dl*0.25);
    float ao = calcAO(pos,n);
    col = alb*(lc + vec3(0.02,0.05,0.09)*ao) ;
    if (m.y > 0.5 && m.y < 1.5) col += vec3(1.0,0.35,0.05)*smoothstep(2.6,3.3,pos.y)*glow*0.8*noise2(pos.xz*8.0+gT);
    col = mix(col, bg, clamp(m.x*0.06,0.0,1.0));
    col = pow(max(col,0.0), vec3(0.4545));
  }
  vec3 cp = ro + rd*max(dot(VL-ro, rd),0.0);
  float ph = 0.0;
  for (int i=0;i<5;i++){ float fi=float(i); vec3 q = VL + vec3(0.25*sin(gT*0.7+fi), 0.6+fi*0.9, 0.0) - vec3(0.0,0.0,0.0); q.y += mod(gT*0.6, 0.9);
    float d = length(cross(rd, q-ro)); ph += exp(-d*d*(3.0-fi*0.4))*(0.5-fi*0.08); }
  col = mix(col, vec3(0.16,0.08,0.05)*u_glow, clamp(ph,0.0,0.8));
  col += vec3(1.0,0.5,0.15)*exp(-length(cross(rd, VL-ro))*1.5)*0.25*u_glow;
  for (int i=0;i<2;i++){ vec2 q = p*vec2(26.0+float(i)*18.0) + vec2(gT*0.1, gT*(0.2+0.15*float(i))); vec2 c=floor(q);
    col += vec3(0.3,0.8,1.0)*smoothstep(0.1,0.0,length(fract(q)-0.5))*step(0.965,hash2(c+float(i)*9.0))*0.6*u_bio; }
  return vec4(col, 1.0);
}
