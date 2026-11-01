// Schwarzschild-style lensed black hole with an accretion disk and a (spaghettified) astronaut.
// Units: event horizon radius = 1.  params: u_dist camera distance, u_orb azimuth, u_tilt elevation (rad),
// u_disk disk brightness 0..1, u_red red-shift/fade of the astronaut 0..1, u_man astronaut visible 0..1,
// u_str stretch factor (1 = normal), u_mpos astronaut distance from centre, u_tx look-at x offset, u_glow bloom
vec2 map(vec3 p){ return vec2(1e9, 0.0); }
float bhH(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
vec3 bhStars(vec3 rd){
  vec2 q = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*160.0;
  vec2 c = floor(q); vec2 f = fract(q)-0.5; float h = bhH(c);
  float s = h > 0.975 ? smoothstep(0.3,0.0,length(f))*(0.35+0.65*bhH(c+3.0)) : 0.0;
  vec3 tint = mix(vec3(0.75,0.85,1.0), vec3(1.0,0.85,0.7), bhH(c+7.0));
  // faint milky band
  float band = exp(-pow(rd.y*3.0 + 0.4*sin(atan(rd.z,rd.x)*2.0), 2.0))*0.06;
  return tint*s + vec3(0.35,0.4,0.6)*band;
}
vec3 diskCol(vec3 p, vec3 v){
  float r = length(p.xz);
  float a = atan(p.z, p.x);
  float sw = a + 2.2/sqrt(r) + u_time*0.35;
  float ring = 0.62 + 0.38*(0.6*noise2(vec2(r*2.2, sw*3.0)) + 0.4*noise2(vec2(r*6.5, sw*7.0)));
  float hot = smoothstep(12.0, 2.6, r);
  vec3 c = mix(vec3(0.9,0.25,0.05), vec3(1.0,0.85,0.55), hot);
  c = mix(c, vec3(1.0,0.97,0.9), smoothstep(4.0,2.6,r)*0.7);
  // doppler beaming: disk rotates around +y; side moving toward camera is brighter
  vec3 vel = normalize(vec3(-p.z, 0.0, p.x));
  float dop = 1.0 + 0.75*dot(vel, -normalize(v));
  float edge = smoothstep(2.6,3.0,r)*smoothstep(12.0,8.0,r);
  return c*ring*edge*dop*dop*1.25;
}
vec4 pixel(vec2 uv){
  vec2 sp = screenP(uv, 0.0);
  float el = u_tilt;
  vec3 ro = vec3(sin(u_orb)*cos(el), sin(el), cos(u_orb)*cos(el))*u_dist;
  vec3 ta = vec3(u_tx, 0.0, 0.0);
  vec3 rd = camRay(sp, ro, ta, 1.5);
  vec3 col = vec3(0.0);
  // astronaut: straight-line test (drawn unlensed, in front of the hole)
  float manT = 1e9; vec3 manC = vec3(0.0);
  if (u_man > 0.0) {
    vec3 cd = normalize(vec3(ro.x, 0.0, ro.z)); float ca = 0.13;
    vec3 U = normalize(vec3(cd.x*cos(ca)-cd.z*sin(ca), 0.3, cd.x*sin(ca)+cd.z*cos(ca)));
    vec3 C = U*u_mpos;
    vec3 Sd = normalize(cross(U, vec3(0.0,1.0,0.0))); vec3 W = cross(Sd, U);
    float st = max(u_str, 1.0), S = 0.55, ks = 1.0/sqrt(st);
    float t = 0.0; float hit = 0.0; vec3 lq = vec3(0.0); float part = 0.0;
    for (int i=0;i<64;i++){
      vec3 q = ro + rd*t - C;
      vec3 l = vec3(dot(q,Sd), dot(q,U), dot(q,W))/S;
      l.y /= st; l.xz /= ks;
      vec3 ll = vec3(abs(l.x), l.y, l.z);
      float legs = sdCapsule(ll, vec3(0.09,-0.25,0.0), vec3(0.08,-0.9,0.02), 0.085);
      float body = sdCapsule(l, vec3(0.0,-0.2,0.0), vec3(0.0,0.33,0.0), 0.18);
      float arms = sdCapsule(ll, vec3(0.2,0.28,0.0), vec3(0.44,-0.02,0.08), 0.065);
      float helm = length(l-vec3(0.0,0.58,0.0)) - 0.2;
      float d = min(min(legs, body), min(arms, helm));
      part = helm < min(min(legs,body),arms) ? 1.0 : 0.0;
      d *= S*min(ks, 1.0)*0.8;
      lq = l;
      if (d < 0.002) { hit = 1.0; break; }
      t += max(d, 0.004); if (t > u_dist*2.0) break;
    }
    if (hit > 0.5) {
      manT = t;
      float sh = 0.55 + 0.45*clamp(dot(normalize(lq - vec3(0.0,0.1,0.0)), normalize(vec3(-0.5,0.7,0.6))), 0.0, 1.0);
      manC = vec3(0.93,0.94,0.97)*sh;
      if (part > 0.5 && lq.z > 0.02) manC = mix(manC, vec3(1.0,0.72,0.3)*sh*1.1, 0.85);
      manC = mix(manC, vec3(0.75,0.08,0.03)*0.55, u_red);
    }
  }
  // lensed ray march
  vec3 p = ro; vec3 v = rd;
  vec3 hcross = cross(p, v); float h2 = dot(hcross, hcross);
  float absorbed = 0.0; vec3 acc = vec3(0.0); float trans = 1.0;
  for (int i=0;i<160;i++){
    float r = length(p);
    float dt = clamp(r*0.06, 0.02, 0.6);
    vec3 pPrev = p;
    vec3 a = -1.5*h2*p/pow(r,5.0);
    v += a*dt; p += v*dt;
    if (pPrev.y*p.y < 0.0) {
      vec3 hp = mix(pPrev, p, pPrev.y/(pPrev.y-p.y));
      float rr = length(hp.xz);
      if (rr > 2.6 && rr < 12.0) { vec3 dc = diskCol(hp, v)*u_disk; acc += trans*dc; trans *= 1.0 - 0.85*smoothstep(2.6,3.2,rr)*smoothstep(12.0,9.0,rr)*u_disk; }
    }
    if (length(p) < 1.0) { absorbed = 1.0; break; }
    if (length(p) > u_dist*2.5 && dot(p,v) > 0.0) break;
  }
  vec3 bg = absorbed > 0.5 ? vec3(0.0) : bhStars(normalize(v));
  col = acc + trans*bg;
  // photon ring glow
  float b = sqrt(h2)/length(v);
  col += vec3(1.0,0.8,0.55)*exp(-abs(b-2.6)*7.0)*0.35*u_disk*(1.0-absorbed*0.5);
  col += vec3(1.0,0.6,0.3)*u_glow*0.15;
  if (manT < 1e8) col = mix(manC, col, u_red*0.85);
  col = 1.0 - exp(-col*1.25);
  return vec4(col, 1.0);
}
