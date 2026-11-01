// Lunar surface: grey cratered regolith, black sky with Earth, harsh sunlight, a person in normal clothes.
// Units: metres. The person stands at the origin facing +z; the sun is low, behind the camera's left.
// params: u_dist camera distance, u_orb camera azimuth (rad, 0 = in front of the person), u_camy camera height,
// u_ty look-at height, u_tx look-at x, u_lens (0 -> 1.4), u_vapor breath plume 0..1, u_boil fizz at the mouth 0..1,
// u_steam vapour off the skin 0..1, u_swell 0..1, u_arms 0..1 (hands to chest), u_fall 0..1 (collapses sideways),
// u_dark 0..1 blackout vignette, u_thermal 0..1 false-colour thermal view, u_shake, u_man person visible (>0.5),
// u_lander 0..1 lander in the background, u_earth Earth size boost, u_eaz/u_eel Earth azimuth/elevation offsets (rad)
float gSw = 0.0, gArms = 0.0, gFall = 0.0, gMan = 1.0, gLand = 0.0;
const vec3 LPOS = vec3(-4.6, 0.0, -6.5);
vec3 sunDir(){ return normalize(vec3(-0.75, 0.42, 0.62)); }
vec3 gE = vec3(0.0, 0.3, -1.0);
vec3 earthDir(){ return gE; }

float craterH(vec2 p, float cs, float seed){
  vec2 id = floor(p/cs); vec2 f = p - (id+0.5)*cs;
  if (hash2(id+seed) < 0.3) return 0.0;
  vec2 o = (vec2(hash2(id+seed+1.7), hash2(id+seed+4.3))-0.5)*cs*0.28;
  float R = cs*(0.13+0.17*hash2(id+seed+8.1));
  float r = length(f-o)/R;
  float bowl = -0.32*max(1.0-r*r, 0.0);
  float rim = 0.11*exp(-(r-1.0)*(r-1.0)*9.0);
  return (bowl+rim)*R;
}
float gh(vec2 p){
  float k = smoothstep(1.4, 3.5, length(p)) * smoothstep(2.2, 4.5, length(p-LPOS.xz));
  float h = craterH(p, 11.0, 0.0) + craterH(p+3.1, 3.7, 7.0) + 0.5*craterH(p+1.3, 1.3, 13.0);
  h += 0.35*(noise2(p*0.11)-0.5) + 0.04*(noise2(p*1.7)-0.5);
  return h*k + 0.05*(noise2(p*0.6)-0.5);
}
vec3 toLocal(vec3 p){
  vec3 q = p;
  float a = gFall*1.42;
  vec2 pv = vec2(0.16, 0.0);
  q.xy = rot(a)*(q.xy-pv)+pv;
  return q;
}
vec2 person(vec3 p){
  vec3 q = toLocal(p);
  float bb = length(q-vec3(0.0,0.9,0.0)) - 1.35;
  if (bb > 0.3) return vec2(bb, 0.0);
  float s = gSw;
  vec3 qa = vec3(abs(q.x), q.y, q.z);
  float shoes = sdEllipsoid(qa-vec3(0.1,0.05,0.05), vec3(0.065,0.055,0.135));
  float legs = sdCapsule(qa, vec3(0.1,0.12,0.0), vec3(0.095,0.9,0.0), 0.075*(1.0+0.3*s));
  float torso = sdCapsule(q, vec3(0.0,0.92,0.0), vec3(0.0,1.33,0.0), 0.15*(1.0+0.35*s));
  torso = smin(torso, sdCapsule(qa, vec3(0.0,1.36,0.0), vec3(0.16,1.37,0.0), 0.085*(1.0+0.35*s)), 0.06);
  vec3 sh = vec3(0.21, 1.37, 0.0);
  vec3 el = mix(vec3(0.27+0.03*s, 1.1, 0.03), vec3(0.25, 1.12, 0.16), gArms);
  vec3 hn = mix(vec3(0.3+0.04*s, 0.84, 0.08), vec3(0.07, 1.36, 0.19), gArms);
  float upper = sdCapsule(qa, sh, el, 0.055*(1.0+0.4*s));
  float fore = sdCapsule(qa, el, hn, 0.045*(1.0+0.45*s));
  fore = min(fore, length(qa-hn) - 0.05*(1.0+0.45*s));
  float neck = sdCapsule(q, vec3(0.0,1.4,0.0), vec3(0.0,1.52,0.01), 0.05*(1.0+0.4*s));
  float head = sdEllipsoid(q-vec3(0.0,1.62,0.01), vec3(0.105,0.125,0.115)*(1.0+0.28*s));
  float hair = sdEllipsoid(q-vec3(0.0,1.645,-0.01), vec3(0.113,0.122,0.124)*(1.0+0.28*s));
  hair = max(hair, min(1.665-q.y, q.z+0.035));
  vec2 r = vec2(shoes, 6.0);
  r = opU(r, vec2(legs, 2.0));
  r = opU(r, vec2(min(torso, upper), 3.0));
  r = opU(r, vec2(min(min(fore, neck), head), 4.0));
  r = opU(r, vec2(hair, 5.0));
  return r;
}
vec2 lander(vec3 p){
  vec3 q = p - LPOS;
  float bb = length(q-vec3(0.0,1.8,0.0)) - 3.2;
  if (bb > 0.3) return vec2(bb, 0.0);
  float body = sdRoundBox(q-vec3(0.0,1.55,0.0), vec3(1.15,0.45,1.15), 0.05);
  float cab = sdRoundBox(q-vec3(0.0,2.45,0.0), vec3(0.8,0.5,0.75), 0.12);
  vec3 qa = vec3(abs(q.x), q.y, abs(q.z));
  float legs = sdCapsule(qa, vec3(0.95,1.3,0.95), vec3(1.75,0.12,1.75), 0.06);
  legs = min(legs, sdCylinder(qa-vec3(1.75,0.05,1.75), 0.04, 0.28));
  float ant = sdCapsule(q, vec3(0.3,2.9,0.2), vec3(0.45,3.4,0.3), 0.025);
  vec2 r = vec2(body, 7.0);
  r = opU(r, vec2(min(cab, ant), 8.0));
  r = opU(r, vec2(legs, 9.0));
  return r;
}
vec2 map(vec3 p){
  vec2 r = vec2((p.y - gh(p.xz))*0.6, 1.0);
  if (gMan > 0.5) r = opU(r, person(p));
  if (gLand > 0.5) r = opU(r, lander(p));
  return r;
}
float hardShadow(vec3 ro, vec3 rd){
  float res = 1.0, t = 0.03;
  for (int i=0;i<40;i++){
    float h = map(ro+rd*t).x;
    res = min(res, 22.0*h/t);
    t += clamp(h, 0.03, 0.6);
    if (h < 0.001 || t > 14.0) break;
  }
  return clamp(res, 0.0, 1.0);
}
vec3 stars(vec3 rd){
  vec2 q = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*150.0;
  vec2 c = floor(q); vec2 f = fract(q)-0.5; float h = hash2(c);
  return h > 0.982 ? vec3(0.8,0.85,1.0)*smoothstep(0.32,0.0,length(f))*(0.25+0.6*hash2(c+3.0)) : vec3(0.0);
}
vec3 skyCol(vec3 rd, out float temp){
  temp = 0.0;
  vec3 col = stars(rd)*0.6;
  vec3 L = sunDir();
  float sd = dot(rd, L);
  col += vec3(1.0,0.97,0.9)*(smoothstep(0.9993,0.9996,sd)*8.0 + pow(max(sd,0.0),400.0)*0.6 + pow(max(sd,0.0),40.0)*0.06);
  vec3 E = earthDir();
  float R = 0.05*(1.0+u_earth);
  vec3 T = normalize(cross(E, vec3(0.0,1.0,0.0))); vec3 B = cross(T, E);
  vec2 d = vec2(dot(rd,T), dot(rd,B)) / R;
  float r2 = dot(d,d);
  float ce = dot(rd,E);
  if (ce > 0.0) {
    col += vec3(0.35,0.6,1.0)*exp(-max(sqrt(r2)-1.0,0.0)*9.0)*0.35*step(1.0, r2);
    if (r2 < 1.0) {
      vec3 nl = vec3(d, sqrt(1.0-r2));
      vec3 nw = normalize(nl.x*T + nl.y*B - nl.z*E);
      vec2 g = vec2(atan(nl.x, nl.z) + u_time*0.02, nl.y);
      float land = smoothstep(0.52, 0.6, noise2(g*3.0+1.7)*0.7 + noise2(g*7.0)*0.3);
      vec3 base = mix(vec3(0.05,0.2,0.55), mix(vec3(0.25,0.42,0.18), vec3(0.6,0.5,0.32), noise2(g*5.0)), land);
      float cl = smoothstep(0.5, 0.75, noise2(g*vec2(4.0,9.0)+5.0)*0.65 + noise2(g*12.0)*0.35);
      base = mix(base, vec3(0.95), cl*0.85);
      float lit = smoothstep(-0.08, 0.25, dot(nw, L));
      vec3 ec = base*(0.03 + 1.6*lit);
      ec += vec3(0.3,0.55,1.0)*pow(1.0-nl.z, 3.0)*0.6*lit;
      col = mix(col, ec, smoothstep(1.0, 0.96, r2));
      temp = 0.45;
    }
  }
  return col;
}
vec3 thermal(float x){
  x = clamp(x, 0.0, 1.0);
  vec3 c = mix(vec3(0.02,0.0,0.12), vec3(0.25,0.05,0.6), smoothstep(0.0,0.2,x));
  c = mix(c, vec3(0.85,0.1,0.45), smoothstep(0.2,0.45,x));
  c = mix(c, vec3(1.0,0.45,0.05), smoothstep(0.45,0.7,x));
  c = mix(c, vec3(1.0,0.9,0.3), smoothstep(0.7,0.9,x));
  return mix(c, vec3(1.0,1.0,0.9), smoothstep(0.9,1.0,x));
}
// soft puff seen along a ray, occluded beyond tmax
float puff(vec3 ro, vec3 rd, vec3 c, float r, float tmax){
  float tc = dot(c-ro, rd);
  if (tc < 0.0 || tc > tmax + r) return 0.0;
  vec3 dv = ro + rd*tc - c;
  return exp(-dot(dv,dv)/(r*r));
}
vec4 pixel(vec2 uv){
  gSw = u_swell; gArms = u_arms; gFall = u_fall; gMan = u_man; gLand = u_lander;
  vec2 sp = screenP(uv, 0.0);
  vec2 jit = u_shake*vec2(noise2(vec2(u_time*23.0,1.0))-0.5, noise2(vec2(u_time*19.0,7.0))-0.5)*0.08;
  vec3 ro = vec3(sin(u_orb)*u_dist, u_camy, cos(u_orb)*u_dist);
  ro.y = max(ro.y, gh(ro.xz)+0.15);
  ro.xy += jit;
  vec3 ta = vec3(u_tx, u_ty, 0.0);
  float lens = u_lens > 0.0 ? u_lens : 1.4;
  vec3 rd = camRay(sp, ro, ta, lens);
  // Earth is framed: it hangs at a fixed screen spot (upper right, below the HUD); u_eaz/u_eel nudge it (screen units).
  // It is only drawn where that spot shows sky, so the ground still hides it.
  { vec3 ww = normalize(ta-ro), uu = normalize(cross(ww, vec3(0.0,1.0,0.0))), vv = cross(uu, ww);
    gE = normalize((0.13+u_eaz)*uu + (0.235+u_eel)*vv + lens*ww); }
  vec3 L = sunDir();
  // march
  float t = 0.0; vec2 h = vec2(0.0); float hit = 0.0;
  for (int i=0;i<150;i++){
    h = map(ro+rd*t);
    if (h.x < 0.0008*(1.0+t)) { hit = 1.0; break; }
    t += h.x;
    if (t > 160.0) break;
  }
  vec3 col; float temp = 0.0;
  if (hit < 0.5) {
    col = skyCol(rd, temp);
    t = 1e4;
  } else {
    vec3 pos = ro + rd*t;
    vec3 n = calcNormal(pos);
    float id = h.y;
    vec3 alb; float rough = 1.0;
    if (id < 1.5) {
      float g = noise2(pos.xz*0.9)*0.6 + noise2(pos.xz*4.3)*0.4;
      alb = vec3(0.4,0.395,0.385)*(0.7 + 0.5*g);
      alb *= 0.92 + 0.12*smoothstep(-0.05, 0.1, gh(pos.xz) - gh(pos.xz+vec2(0.0,0.0))*0.0);
      // footprints around the person
      vec2 fp = pos.xz; float fpm = 1.0;
      if (length(fp) < 2.4 && gMan > 0.5) {
        vec2 c = floor(fp/0.55); vec2 f = fp - (c+0.5)*0.55;
        if (hash2(c+2.0) > 0.55 && length(fp) > 0.45) fpm = mix(0.78, 1.0, smoothstep(0.08, 0.13, length(f*vec2(1.6,0.8))));
      }
      alb *= fpm;
    }
    else if (id < 2.5) alb = vec3(0.16,0.26,0.45);   // jeans
    else if (id < 3.5) alb = vec3(0.62,0.1,0.09);    // t-shirt
    else if (id < 4.5) {
      alb = mix(vec3(0.86,0.62,0.48), vec3(0.92,0.55,0.48), gSw*0.6);  // skin
      vec3 q = toLocal(pos);
      vec3 hc = vec3(0.0,1.62,0.01);
      float sc = 1.0 + 0.28*gSw;
      vec3 hq = (q - hc)/sc;
      if (q.y > 1.5 && hq.z > 0.05) {
        float eye = length(vec2(abs(hq.x)-0.038, hq.y-0.018));
        alb = mix(vec3(0.05), alb, smoothstep(0.012, 0.018, eye));
        float mouth = length(vec2(hq.x*0.75, (hq.y+0.052)*1.6));
        alb = mix(vec3(0.25,0.06,0.06), alb, smoothstep(0.018, 0.026, mouth + (1.0-u_boil)*0.01));
        float brow = length(vec2(abs(hq.x)-0.04, (hq.y-0.05)*3.0));
        alb = mix(vec3(0.2,0.12,0.08), alb, smoothstep(0.018,0.026,brow));
      }
    }
    else if (id < 5.5) alb = vec3(0.16,0.1,0.06);    // hair
    else if (id < 6.5) alb = vec3(0.92,0.92,0.9);    // sneakers
    else if (id < 7.5) { alb = vec3(0.85,0.62,0.18)*(0.8+0.4*noise2(pos.xy*6.0+pos.z*3.0)); rough = 0.4; }  // gold foil
    else if (id < 8.5) alb = vec3(0.78,0.79,0.8);
    else alb = vec3(0.5,0.5,0.52);
    float sh = hardShadow(pos + n*0.02, L);
    float dif = max(dot(n, L), 0.0);
    if (id < 1.5) dif = pow(dif, 0.7);   // regolith: flat, bright, lunar look
    float lit = dif*sh;
    vec3 sunC = vec3(1.0,0.98,0.94)*2.1;
    vec3 earthshine = vec3(0.07,0.09,0.13)*(0.5+0.5*n.y);
    vec3 bounce = vec3(0.16,0.155,0.15)*clamp(-n.y*0.5+0.5, 0.0, 1.0)*(id > 1.5 ? 1.0 : 0.0);
    col = alb*(sunC*lit + earthshine + bounce);
    if (id > 1.5) {
      vec3 hv = normalize(L - rd);
      float spc = pow(max(dot(n,hv),0.0), id > 6.5 && id < 7.5 ? 30.0 : 12.0)*sh*(id > 6.5 && id < 7.5 ? 0.9 : 0.12);
      col += sunC*spc;
      col += vec3(0.25,0.3,0.4)*pow(clamp(1.0+dot(n,rd),0.0,1.0),3.0)*0.25;
    }
    temp = id < 1.5 ? 0.04 + 0.64*smoothstep(0.0, 0.3, lit) : (id < 6.5 ? 0.36 + 0.04*lit : 0.3 + 0.6*lit);
  }
  // vapour: breath plume, fizz at the mouth, steam off the skin
  if (gMan > 0.5 && (u_vapor + u_boil + u_steam) > 0.001) {
    vec3 mouth = vec3(0.0, 1.565 + 0.03*gSw, 0.125 + 0.03*gSw);
    vec3 vc = vec3(0.9,0.93,1.0);
    float a = 0.0;
    if (u_vapor > 0.001) for (int i=0;i<12;i++){
      float fi = float(i);
      float ph = fract(u_time*0.8 + fi/12.0);
      vec3 dir = normalize(vec3(0.75+(hash2(vec2(fi,1.0))-0.5)*0.5, 0.12+(hash2(vec2(fi,2.0))-0.4)*0.3, 0.9));
      vec3 c = mouth + dir*(0.05 + ph*0.9);
      float r = 0.02 + ph*0.17;
      a += puff(ro, rd, c, r, t)*u_vapor*pow(1.0-ph, 1.3)*0.5;
    }
    if (u_boil > 0.001) for (int i=0;i<16;i++){
      float fi = float(i);
      float ph = fract(u_time*2.3 + fi/16.0);
      vec3 o = (vec3(hash2(vec2(fi,5.0)), hash2(vec2(fi,6.0)), hash2(vec2(fi,7.0)))-0.5)*vec3(0.05,0.03,0.02);
      vec3 c = mouth + o + vec3(o.x*ph*3.0, 0.02*ph, 0.02+0.14*ph);
      float r = 0.005 + 0.012*ph;
      a += puff(ro, rd, c, r, t)*u_boil*(1.0-ph)*0.8;
    }
    if (u_steam > 0.001) for (int i=0;i<14;i++){
      float fi = float(i);
      float ph = fract(u_time*0.45 + fi/14.0);
      vec3 b = vec3((hash2(vec2(fi,8.0))-0.5)*0.55, 0.35+1.25*hash2(vec2(fi,9.0)), (hash2(vec2(fi,10.0))-0.3)*0.3);
      vec3 c = b + normalize(vec3(b.x, 0.6, b.z+0.3))*ph*0.55;
      float r = 0.06 + ph*0.26;
      a += puff(ro, rd, c, r, t)*u_steam*pow(1.0-ph,1.4)*0.2;
    }
    a = clamp(a, 0.0, 0.92);
    col = mix(col, vc*(0.35 + 0.9*max(dot(normalize(vec3(0.0,0.3,1.0)), L), 0.0)), a);
    temp = mix(temp, 0.35, a*0.6);
  }
  col = 1.0 - exp(-col*1.35);
  col = pow(max(col, 0.0), vec3(0.4545));
  // thermal false colour
  if (u_thermal > 0.001) {
    float sl = 0.04*sin(uv.y*900.0);
    col = mix(col, thermal(temp + sl*0.2), u_thermal);
  }
  // blackout: tunnel vision, desaturate, fade
  if (u_dark > 0.001) {
    float v = length((uv-0.5)*vec2(1.0, 1.5));
    float tun = smoothstep(0.75 - 0.7*u_dark, 0.15 - 0.15*u_dark, v);
    float g = dot(col, vec3(0.3,0.59,0.11));
    col = mix(col, vec3(g), u_dark*0.8);
    col *= mix(1.0, tun, clamp(u_dark*1.4, 0.0, 1.0)) * (1.0 - 0.75*u_dark*u_dark);
  }
  return vec4(col, 1.0);
}
