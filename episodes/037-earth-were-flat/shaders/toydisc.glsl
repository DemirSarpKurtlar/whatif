// 037 — "Toy Planet" flat-earth diorama: chunky cookie disc, toy village, puffy clouds, gravity arrows,
// a chibi walker, an air dome, a toy sun, and a morph that crumples the disc into a round globe.
// Screen-space tilt-shift blur (golden-spiral taps in the top/bottom bands).
// Params (all default 0):
//  camera: u_cd dist, u_cyaw, u_cpit (rad), u_tx,u_ty,u_tz target, u_roll (rad), u_lens (+2.2), u_shk shake
//  look:   u_tsh tilt-shift blur (0..0.05 of screen height), u_foc focus band centre offset (0 = middle, + = lower)
//          u_space 0 sky / 1 starfield, u_night 0 day / 1 night
//  sun:    u_sun 0..1 visible sun (also becomes the key light), u_sunel elevation (rad), u_sunaz azimuth (rad)
//  world:  u_morph 0 disc .. 1 sphere, u_arw gravity arrows 0..1, u_cslide clouds pulled to centre 0..1
//          u_air air dome 0..1, u_pool 0 thin layer .. 1 pooled bubble in the middle
//  walker: u_pv visible 0..1, u_pr radius, u_pa angle (rad), u_lean (rad toward centre), u_walk 0..1, u_helm fishbowl helmet 0..1
#define RD 3.0
#define TH 0.42
#define LANDH 0.045

float landMask(vec2 q){
  float n = noise2(q*0.85 + vec2(3.1,1.7))*0.62 + noise2(q*2.0 + vec2(7.3,2.2))*0.38;
  float r = length(q);
  return n - 0.47 + 0.12*smoothstep(1.3,0.0,r) - 0.35*smoothstep(2.05,2.6,r);
}
float sdRoundCone(vec3 p, vec3 a, vec3 b, float r1, float r2){
  vec3 ba=b-a; float l2=dot(ba,ba); float rr=r1-r2; float a2=l2-rr*rr; float il2=1.0/l2;
  vec3 pa=p-a; float y=dot(pa,ba); float z=y-l2; vec3 xv=pa*l2-ba*y; float x2=dot(xv,xv); float y2=y*y*l2; float z2=z*z*l2;
  float k=sign(rr)*rr*rr*x2;
  if(sign(z)*a2*z2>k) return sqrt(x2+z2)*il2-r2;
  if(sign(y)*a2*y2<k) return sqrt(x2+y2)*il2-r1;
  return (sqrt(x2*a2*il2)+y*rr)*il2-r1;
}
float gravTilt(float r){ float x = clamp(r/RD, 0.0, 1.0); return radians(30.0*x + 30.0*pow(x, 6.0)); }
vec3 sphC(){ return vec3(0.0, -TH*0.5, 0.0); }
float sphR(){ return 1.42; }

// ---------------- walker frame ----------------
vec3 walkerP(){ return vec3(cos(u_pa), 0.0, sin(u_pa))*u_pr + vec3(0.0, LANDH*0.6, 0.0); }
// local body coords: x = outward (walking direction), y = body up, z = tangent
vec3 toBody(vec3 p){
  vec3 er = vec3(cos(u_pa), 0.0, sin(u_pa)), et = vec3(-sin(u_pa), 0.0, cos(u_pa));
  vec3 q = p - walkerP();
  vec2 rq = vec2(dot(q, er), q.y);
  float c = cos(u_lean), s = sin(u_lean);
  vec2 b = vec2(rq.x*c + rq.y*s, -rq.x*s + rq.y*c);
  return vec3(b.x, b.y, dot(q, et));
}
#define WS 0.26
vec3 headWorld(){
  vec3 er = vec3(cos(u_pa), 0.0, sin(u_pa));
  vec2 up = vec2(-sin(u_lean), cos(u_lean));
  return walkerP() + (er*up.x + vec3(0.0, up.y, 0.0))*(0.97*WS);
}
vec2 walker(vec3 p){
  vec3 b = toBody(p)/WS;
  if (length(b - vec3(0.0,0.55,0.0)) > 1.0) return vec2((length(b - vec3(0.0,0.55,0.0)) - 0.8)*WS, 0.0);
  float sw = sin(u_time*9.0)*0.22*u_walk;
  vec2 res = vec2(1e9, 0.0);
  float legL = sdCapsule(b, vec3(0.0,0.40,-0.10), vec3(sw,0.07,-0.10), 0.085);
  float legR = sdCapsule(b, vec3(0.0,0.40, 0.10), vec3(-sw,0.07, 0.10), 0.085);
  res = opU(res, vec2(min(legL, legR), 12.0));
  float body = sdCapsule(b, vec3(0.0,0.42,0.0), vec3(0.0,0.66,0.0), 0.2);
  float armL = sdCapsule(b, vec3(0.0,0.64,-0.2), vec3(-sw*0.8,0.40,-0.27), 0.07);
  float armR = sdCapsule(b, vec3(0.0,0.64, 0.2), vec3( sw*0.8,0.40, 0.27), 0.07);
  res = opU(res, vec2(smin(body, min(armL, armR), 0.04), 10.0));
  float scarf = sdTorus(b - vec3(0.0,0.74,0.0), vec2(0.14,0.06));
  res = opU(res, vec2(scarf, 13.0));
  float head = sdSphere(b - vec3(0.0,0.97,0.0), 0.24);
  res = opU(res, vec2(head, 11.0));
  float hair = max(sdSphere(b - vec3(-0.03,1.02,0.0), 0.245), -(b.x - 0.06) + (b.y - 1.0)*0.4);
  hair = min(hair, sdSphere(b - vec3(-0.04,1.24,0.0), 0.08));
  res = opU(res, vec2(hair, 14.0));
  res.x *= WS;
  return res;
}

// ---------------- village (grid repetition) ----------------
vec2 deco(vec3 p, float s){
  if (p.y > 0.36) return vec2(p.y - 0.33, 0.0);
  float CS = 0.40;
  vec2 cid = floor(p.xz/CS);
  vec2 cc = (cid + 0.5)*CS;
  vec3 q = vec3(p.x - cc.x, p.y - LANDH, p.z - cc.y);
  vec2 bq = CS*0.5 - abs(q.xz);
  float bd = max(min(bq.x, bq.y), 0.0) + 0.05;
  float h = hash2(cid);
  float rr = length(cc);
  if (h > 0.78 || rr > RD - 0.5) return vec2(bd, 0.0);
  float lm = landMask(cc);
  if (lm < 0.07) return vec2(bd, 0.0);
  vec2 jo = (vec2(hash2(cid + 1.3), hash2(cid + 4.1)) - 0.5)*CS*0.3;
  q.xz -= jo;
  q.xz = rot(hash2(cid + 9.7)*6.2831)*q.xz;
  q /= s;
  vec2 res = vec2(1e9, 0.0);
  if (h < 0.36) {
    float wall = sdRoundBox(q - vec3(0.0,0.055,0.0), vec3(0.06,0.05,0.048), 0.012);
    vec3 rq = q - vec3(0.0,0.105,0.0);
    rq.yz = rot(0.785398)*rq.yz;
    float roof = sdRoundBox(rq, vec3(0.075,0.045,0.045), 0.01);
    roof = max(roof, -(q.y - 0.1));
    res = opU(vec2(wall, 3.0), vec2(roof, 4.0 + floor(hash2(cid + 2.7)*3.0)*0.25));
  } else {
    float tall = 0.8 + 0.5*hash2(cid + 5.5);
    float trunk = sdCapsule(q, vec3(0.0,0.0,0.0), vec3(0.0,0.09*tall,0.0), 0.014);
    float fol = sdSphere(q - vec3(0.0,0.12*tall,0.0), 0.05*tall);
    fol = smin(fol, sdSphere(q - vec3(0.025,0.095*tall,0.015), 0.035*tall), 0.02);
    res = opU(vec2(trunk, 5.0), vec2(fol, 6.0));
  }
  res.x = min(res.x*s, bd);
  return res;
}

// ---------------- clouds ----------------
vec2 clouds(vec3 p){
  float cy = 0.85;
  if (abs(p.y - cy) > 0.5) return vec2(abs(p.y - cy) - 0.4, 0.0);
  float R0 = mix(2.15, 0.75, u_cslide);
  float a = atan(p.z, p.x) - u_time*0.06;
  float sec = 6.2831853/7.0;
  float id = floor(a/sec + 0.5);
  float la = a - id*sec;
  float r = length(p.xz);
  float hh = hash2(vec2(id, 3.0));
  vec3 q = vec3(r*cos(la) - R0*(0.85 + 0.3*hh), p.y - cy - 0.15*(hh - 0.5), r*sin(la));
  float sc = 0.8 + 0.5*hash2(vec2(id, 7.0));
  q /= sc;
  float d = sdSphere(q, 0.17);
  d = smin(d, sdSphere(q - vec3(0.17,-0.05,0.06), 0.12), 0.07);
  d = smin(d, sdSphere(q - vec3(-0.16,-0.06,-0.02), 0.11), 0.07);
  d = smin(d, sdSphere(q - vec3(0.03,0.09,-0.05), 0.13), 0.07);
  d = smin(d, sdSphere(q - vec3(-0.02,-0.07,0.13), 0.1), 0.07);
  return vec2(d*sc, 7.0);
}

// ---------------- gravity arrows ----------------
float arrowAt(vec3 p, float R, float n, float Y, float sc){
  float a = atan(p.z, p.x) + 0.3;
  float sec = 6.2831853/n;
  float la = a - floor(a/sec + 0.5)*sec;
  float r = length(p.xz);
  vec3 q = vec3(r*cos(la) - R, p.y - Y, r*sin(la));
  float g = gravTilt(R);
  vec3 D = normalize(vec3(-sin(g), -cos(g), 0.0));
  float shaft = sdCapsule(q, -D*0.2*sc, D*0.05*sc, 0.035*sc);
  float head = sdRoundCone(q, D*0.03*sc, D*0.22*sc, 0.09*sc, 0.012*sc);
  return smin(shaft, head, 0.01);
}
float arrows(vec3 p){
  if (u_arw < 0.01) return 1e9;
  if (p.y > 0.95 || p.y < 0.15) return max(p.y - 0.95, 0.15 - p.y) + 0.05;
  float s = u_arw;
  float d = arrowAt(p, 2.55, 9.0, 0.5, s);
  d = min(d, arrowAt(p, 1.45, 6.0, 0.5, s*0.95));
  float c = sdCapsule(p, vec3(0.0,0.7,0.0), vec3(0.0,0.45,0.0), 0.035*s);
  c = smin(c, sdRoundCone(p, vec3(0.0,0.48,0.0), vec3(0.0,0.3,0.0), 0.09*s, 0.012*s), 0.01);
  return min(d, c);
}

// ---------------- planet body ----------------
float bodyD(vec3 p){
  float r = length(p.xz);
  float rb = 0.1;
  vec2 d2 = vec2(r - (RD - rb), abs(p.y + TH*0.5) - (TH*0.5 - rb));
  float dDisc = min(max(d2.x, d2.y), 0.0) + length(max(d2, 0.0)) - rb;
  if (u_morph < 0.001) {
    if (p.y > -0.06 && p.y < 0.12 && r < RD - 0.05) {
      float lm = landMask(p.xz);
      dDisc -= LANDH*smoothstep(-0.01, 0.06, lm);
    }
    return dDisc;
  }
  float m = u_morph;
  float dS = length(p - sphC()) - sphR();
  float d = mix(dDisc, dS, m);
  float cr = sin(3.14159*m);
  d += 0.09*cr*sin(p.x*4.1 + 1.3)*sin(p.y*5.3 + 0.7)*sin(p.z*3.7 + 2.1);
  return d*0.8;
}

vec2 map(vec3 p){
  vec2 res = vec2(bodyD(p), 1.0);
  if (u_morph < 0.001) {
    float rim = sdTorus(p - vec3(0.0, -0.005, 0.0), vec2(RD - 0.075, 0.05));
    res = opU(res, vec2(rim, 2.0));
  }
  float ds = 1.0 - smoothstep(0.0, 0.3, u_morph);
  if (ds > 0.01) {
    res = opU(res, deco(p, ds));
    vec2 c = clouds(p / ds); c.x *= ds;
    res = opU(res, c);
  }
  res = opU(res, vec2(arrows(p), 8.0));
  if (u_pv > 0.01) res = opU(res, walker(p));
  return res;
}

// ---------------- shading ----------------
vec3 sunDir(){ return normalize(vec3(cos(u_sunel)*cos(u_sunaz), sin(u_sunel), cos(u_sunel)*sin(u_sunaz))); }
vec3 keyDir(){ vec3 Ld = normalize(vec3(0.55, 0.85, 0.5)); return normalize(mix(Ld, sunDir(), u_sun)); }

vec3 terrainCol(vec3 p, vec3 n){
  float r = length(p.xz);
  vec3 col;
  // flat disc colours
  if (p.y > -0.035 && n.y > 0.35) {
    float lm = landMask(p.xz);
    vec3 water = mix(vec3(0.28,0.58,0.86), vec3(0.50,0.78,0.95), smoothstep(-0.22, 0.0, lm));
    vec3 grass = mix(vec3(0.52,0.76,0.34), vec3(0.68,0.85,0.42), noise2(p.xz*3.0));
    vec3 sand = vec3(0.96,0.86,0.62);
    col = mix(water, vec3(0.97,0.99,1.0), smoothstep(-0.03, -0.005, lm)*0.8);
    col = mix(col, sand, smoothstep(-0.005, 0.01, lm));
    col = mix(col, grass, smoothstep(0.03, 0.06, lm));
  } else {
    float y = p.y + 0.02*sin(atan(p.z, p.x)*9.0);
    vec3 soil = vec3(0.80,0.56,0.36);
    col = mix(vec3(0.55,0.78,0.36), soil, smoothstep(-0.02, -0.05, y));
    col = mix(col, vec3(0.62,0.40,0.26), smoothstep(0.02, 0.0, abs(y + 0.17) - 0.03));
    col = mix(col, vec3(0.70,0.62,0.58), smoothstep(-0.27, -0.33, y));
    col *= 0.9 + 0.2*noise2(vec2(atan(p.z, p.x)*12.0, y*30.0));
  }
  if (u_morph > 0.001) {
    vec3 d = normalize(p - sphC());
    float lm = noise2(d.xz*2.2 + d.y*1.3 + 4.0)*0.6 + noise2(d.zy*4.0 + 1.7)*0.4 - 0.48;
    vec3 water = mix(vec3(0.26,0.55,0.85), vec3(0.45,0.74,0.94), smoothstep(-0.2, 0.0, lm));
    vec3 g = mix(water, vec3(0.96,0.86,0.62), smoothstep(-0.005, 0.01, lm));
    g = mix(g, vec3(0.56,0.78,0.36), smoothstep(0.03, 0.06, lm));
    g = mix(g, vec3(0.97,0.98,1.0), smoothstep(0.78, 0.86, abs(d.y)));
    col = mix(col, g, smoothstep(0.35, 0.85, u_morph));
  }
  return col;
}

vec3 albedo(float m, vec3 p, vec3 n, out float gloss){
  gloss = 0.0;
  if (m < 1.5) { vec3 c = terrainCol(p, n); gloss = c.b > c.g && c.b > 0.7 ? 0.5 : 0.0; return c; }
  if (m < 2.5) return vec3(0.96,0.97,1.0);
  if (m < 3.5) return vec3(0.96,0.91,0.83);
  if (m < 4.6) {
    float k = fract(m)*4.0;
    gloss = 0.2;
    return k < 0.5 ? vec3(0.88,0.45,0.30) : (k < 1.5 ? vec3(0.84,0.34,0.27) : vec3(0.38,0.56,0.84));
  }
  if (m < 5.5) return vec3(0.60,0.42,0.27);
  if (m < 6.5) return vec3(0.42,0.74,0.36);
  if (m < 7.5) return vec3(1.0);
  if (m < 8.5) { gloss = 0.35; return vec3(1.0,0.80,0.25); }
  if (m < 10.5) return vec3(0.95,0.70,0.24);
  if (m < 11.5) return vec3(0.96,0.79,0.64);
  if (m < 12.5) return vec3(0.22,0.27,0.45);
  if (m < 13.5) return vec3(0.91,0.33,0.24);
  return vec3(0.42,0.27,0.18);
}

vec3 bgCol(vec3 rd, float blur){
  float day = 1.0 - u_night;
  vec3 skyA = mix(vec3(0.10,0.12,0.26), vec3(0.96,0.91,0.82), day);
  vec3 skyB = mix(vec3(0.04,0.05,0.13), vec3(0.72,0.84,0.94), day);
  vec3 sky = mix(skyA, skyB, smoothstep(-0.2, 0.7, rd.y));
  vec3 sp = vec3(0.025,0.028,0.06);
  vec2 q = vec2(atan(rd.z, rd.x), asin(clamp(rd.y, -1.0, 1.0)))*38.0;
  vec2 c = floor(q); vec2 f = fract(q) - 0.5;
  float h = hash2(c);
  float sz = 0.12 + blur*6.0;
  float st = h > 0.93 ? smoothstep(sz, sz*0.3, length(f - (vec2(hash2(c + 1.1), hash2(c + 2.3)) - 0.5)*0.5))*(0.4 + 0.6*hash2(c + 5.0)) : 0.0;
  st /= 1.0 + blur*25.0;
  sp += vec3(1.0,0.86,0.62)*st*0.9;
  vec3 col = mix(sky, sp, u_space);
  if (u_sun > 0.01) {
    float a = dot(rd, sunDir());
    col += vec3(1.0,0.85,0.55)*pow(max(a, 0.0), 40.0)*0.6*u_sun;
    col = mix(col, vec3(1.0,0.93,0.70), smoothstep(0.9965, 0.9975, a)*u_sun);
  }
  return col;
}

vec3 render(vec2 uv, bool full, float blur){
  vec2 sp = screenP(uv, 0.0);
  sp = rot(u_roll)*sp;
  vec3 ta = vec3(u_tx, u_ty, u_tz) + u_shk*0.05*vec3(sin(u_time*37.0), sin(u_time*29.0 + 1.0), sin(u_time*31.0 + 2.0));
  vec3 ro = ta + u_cd*vec3(cos(u_cpit)*sin(u_cyaw), sin(u_cpit), cos(u_cpit)*cos(u_cyaw));
  vec3 rd = camRay(sp, ro, ta, 2.2 + u_lens);
  // march
  float t = 0.0; float mat = -1.0; float tmax = u_cd*2.5 + 8.0;
  for (int i = 0; i < 110; i++) {
    vec2 h = map(ro + rd*t);
    if (h.x < 0.0008*t + 0.0004) { mat = h.y; break; }
    t += h.x*0.9;
    if (t > tmax) break;
  }
  vec3 col;
  float day = 1.0 - u_night;
  if (mat < 0.0) {
    col = bgCol(rd, blur);
    t = 1e9;
  } else {
    vec3 pos = ro + rd*t;
    vec3 n = calcNormal(pos);
    float gloss; vec3 alb = albedo(mat, pos, n, gloss);
    vec3 L = keyDir();
    float sh = 1.0, ao = 1.0;
    if (full) { sh = softShadow(pos + n*0.004, L, 10.0); ao = calcAO(pos, n); }
    else ao = 0.9;
    sh = mix(0.42, 1.0, sh);
    float dif = clamp((dot(n, L) + 0.25)/1.25, 0.0, 1.0)*sh;
    // sun below the disc plane: the top face gets no direct light
    float lit = mix(1.0, smoothstep(-0.08, 0.12, L.y), u_sun);
    vec3 key = mix(vec3(0.20,0.24,0.45)*0.35, vec3(1.0,0.92,0.80)*1.1, day)*lit;
    vec3 skyc = mix(vec3(0.14,0.18,0.36), vec3(0.62,0.68,0.84), day);
    if (mat > 6.5 && mat < 7.5) { dif = 0.55 + 0.45*dif; }
    float hemi = 0.55 + 0.45*n.y;
    col = alb*(dif*key + hemi*skyc*0.62*ao + vec3(0.32,0.26,0.20)*0.18*ao);
    vec3 hv = normalize(L - rd);
    col += key*pow(max(dot(n, hv), 0.0), mix(12.0, 70.0, gloss))*mix(0.04, 0.5, gloss)*sh;
    col += skyc*pow(1.0 - max(dot(n, -rd), 0.0), 4.0)*0.25*ao;
    // night: warm windows glow on houses
    if (mat > 2.5 && mat < 3.5) col += vec3(1.0,0.75,0.35)*u_night*0.35;
    // depth haze toward background
    vec3 bgc = mix(mix(vec3(0.85,0.86,0.9), vec3(0.06,0.07,0.14), u_space), vec3(0.06,0.07,0.15), u_night);
    col = mix(col, bgc, clamp((t - u_cd*1.4)*0.05, 0.0, 0.35));
  }
  // air dome (analytic ellipsoid)
  if (u_air > 0.01) {
    vec3 R = vec3(mix(3.05, 1.75, u_pool), mix(0.28, 1.05, u_pool), mix(3.05, 1.75, u_pool));
    vec3 o = ro/R, d = rd/R;
    float a = dot(d, d), b = dot(o, d), c = dot(o, o) - 1.0;
    float disc = b*b - a*c;
    if (disc > 0.0) {
      float sq = sqrt(disc);
      float t0 = (-b - sq)/a, t1 = (-b + sq)/a;
      // only the part above the disc top
      float ty = rd.y != 0.0 ? (0.0 - ro.y)/rd.y : 1e9;
      if (ro.y > 0.0 && rd.y < 0.0) t1 = min(t1, ty);
      t1 = min(t1, t);
      float th = max(t1 - max(t0, 0.0), 0.0);
      if (th > 0.0) {
        vec3 pe = ro + rd*max(t0, 0.0);
        float fr = pow(1.0 - abs(dot(normalize(pe/(R*R)), rd)), 2.0);
        float al = (1.0 - exp(-th*0.9))*0.55 + fr*0.25;
        col = mix(col, mix(vec3(0.55,0.80,1.0), vec3(0.85,0.95,1.0), fr), clamp(al, 0.0, 0.8)*u_air);
      }
    }
  }
  // fishbowl helmet on the walker
  if (u_helm > 0.01 && u_pv > 0.01) {
    vec3 hc = headWorld(); float hr = 0.36*WS;
    vec3 oc = ro - hc; float b = dot(oc, rd); float c = dot(oc, oc) - hr*hr; float disc = b*b - c;
    if (disc > 0.0) {
      float th = -b - sqrt(disc);
      if (th > 0.0 && th < t) {
        vec3 nn = normalize(ro + rd*th - hc);
        float fr = pow(1.0 - abs(dot(nn, rd)), 2.5);
        col = mix(col, vec3(0.85,0.95,1.0), (0.12 + 0.6*fr)*u_helm);
        col += vec3(1.0)*pow(max(dot(reflect(rd, nn), normalize(vec3(0.4,0.8,0.4))), 0.0), 60.0)*0.9*u_helm;
      }
    }
  }
  return col;
}

vec4 pixel(vec2 uv){
  float dy = uv.y - (0.5 + u_foc);
  float B = u_tsh*smoothstep(0.1, 0.42, abs(dy));
  vec3 col = render(uv, true, B);
  if (B > 0.002) {
    vec3 acc = col; float ar = u_resolution.y/u_resolution.x;
    float rotA = 6.2831853*fract(52.9829189*fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
    for (int i = 0; i < 6; i++) {
      float fi = float(i) + 0.5;
      float rr = sqrt(fi/6.0)*B;
      float an = fi*2.39996 + rotA;
      acc += render(uv + vec2(cos(an)*ar, sin(an))*rr, false, B);
    }
    col = acc/7.0;
  }
  col = pow(max(col, 0.0), vec3(0.4545));
  // pastel toy grade: soft lift, gentle warmth, slight vignette
  col = mix(col, vec3(1.0,0.97,0.92), 0.05);
  float l = dot(col, vec3(0.299,0.587,0.114));
  col = mix(vec3(l), col, 1.12);
  vec2 v = uv - 0.5; col *= 1.0 - 0.25*dot(v, v);
  col += (hash2(uv*u_resolution + fract(u_time)*91.0) - 0.5)*0.012;
  return vec4(clamp(col, 0.0, 1.0), 1.0);
}
