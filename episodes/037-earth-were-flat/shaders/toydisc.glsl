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
float gBlur = 0.0;
float gSec = 0.0; // 1 while sampling shadows/AO: empty village cells must not act as occluders
float hq(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y)*p3.z); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(hq(i), hq(i + vec2(1.0,0.0)), f.x), mix(hq(i + vec2(0.0,1.0)), hq(i + vec2(1.0,1.0)), f.x), f.y); }

float landMask(vec2 q){
  float n = vn(q*0.85 + vec2(3.1,1.7))*0.62 + vn(q*2.0 + vec2(7.3,2.2))*0.38;
  float r = length(q);
  float cape = smoothstep(0.42, 0.12, abs(q.y))*smoothstep(1.2, 1.7, q.x);   // land strip along +x to the rim (walker's path)
  return n - 0.47 + 0.12*smoothstep(1.3,0.0,r) - 0.35*smoothstep(2.05,2.6,r) + 0.6*cape;
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
  float hcut = (b.x - 0.02) - (b.y - 0.98)*0.9;
  float hh = sdSphere(b - vec3(-0.03,1.0,0.0), 0.255);
  float hair = -smin(-hh, -hcut, 0.04);
  hair = min(hair, sdSphere(b - vec3(-0.04,1.24,0.0), 0.08));
  res = opU(res, vec2(hair, 14.0));
  vec3 eb = vec3(b.x, b.y, abs(b.z));
  res = opU(res, vec2(sdSphere(eb - vec3(0.215,0.97,0.085), 0.034), 15.0));
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
  float bd = gSec > 0.5 ? 1e9 : max(min(bq.x, bq.y), 0.0) + 0.05;
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
float arrowShape(vec3 q, vec3 D, float sc){
  float shaft = sdCapsule(q, -D*0.42*sc, D*0.02*sc, 0.055*sc);
  float head = sdRoundCone(q, D*0.0, D*0.30*sc, 0.15*sc, 0.008*sc);
  head = max(head, -dot(q, D) + 0.03*sc);
  return smin(shaft, head, 0.015*sc);
}
float arrowAt(vec3 p, float R, float n, float Y, float sc){
  float a = atan(p.z, p.x) + 0.3;
  float sec = 6.2831853/n;
  float la = a - floor(a/sec + 0.5)*sec;
  float r = length(p.xz);
  vec3 q = vec3(r*cos(la) - R, p.y - Y, r*sin(la));
  float g = gravTilt(R);
  vec3 D = normalize(vec3(-sin(g), -cos(g), 0.0));
  return arrowShape(q, D, sc);
}
float arrows(vec3 p){
  if (u_arw < 0.01) return 1e9;
  if (p.y > 1.25 || p.y < 0.1) return max(p.y - 1.25, 0.1 - p.y) + 0.05;
  float s = u_arw;
  float d = arrowAt(p, 2.6, 8.0, 0.55, s);
  d = min(d, arrowAt(p, 1.55, 5.0, 0.55, s*0.95));
  d = min(d, arrowShape(p - vec3(0.0,0.55,0.0), vec3(0.0,-1.0,0.0), s*0.9));
  return d;
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
  float ds = 1.0 - smoothstep(0.0, 0.3, u_morph);
  if (ds > 0.01) {
    res = opU(res, deco(p, ds));
    if (u_ncl < 0.5) { vec2 c = clouds(p / ds); c.x *= ds; res = opU(res, c); }
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
  if (p.y > -0.035 && n.y > 0.35 || p.y > -0.01) {
    float lm = landMask(p.xz);
    vec3 water = mix(vec3(0.28,0.58,0.86), vec3(0.50,0.78,0.95), smoothstep(-0.22, 0.0, lm));
    vec3 grass = mix(vec3(0.52,0.76,0.34), vec3(0.68,0.85,0.42), mix(noise2(p.xz*3.0), 0.5, clamp(gBlur*6.0, 0.0, 1.0)));
    vec3 sand = vec3(0.96,0.86,0.62);
    float w = gBlur*0.9;
    col = mix(water, vec3(0.97,0.99,1.0), smoothstep(-0.03 - w, -0.005 + w*0.3, lm)*0.8);
    col = mix(col, sand, smoothstep(-0.005 - w*0.5, 0.01 + w*0.5, lm));
    col = mix(col, grass, smoothstep(0.03 - w*0.5, 0.06 + w, lm));
    col = mix(col, vec3(0.97,0.98,1.0), smoothstep(RD - 0.13 - w, RD - 0.09 + w, r));
  } else {
    float ang = atan(p.z, p.x);
    float y = p.y + 0.015*sin(ang*9.0) + 0.01*sin(ang*23.0 + 1.0);
    vec3 soil = vec3(0.80,0.56,0.36);
    col = mix(vec3(0.97,0.98,1.0), soil, smoothstep(-0.03, -0.06, y));
    col = mix(col, vec3(0.64,0.42,0.28), smoothstep(0.015, 0.0, abs(y + 0.18) - 0.035));
    col = mix(col, vec3(0.66,0.60,0.58), smoothstep(-0.28, -0.32, y));
  }
  if (u_morph > 0.001) {
    vec3 d = normalize(p - sphC());
    float lm = noise2(d.xz*2.2 + d.y*1.3 + 4.0)*0.6 + noise2(d.zy*4.0 + 1.7)*0.4 - 0.48;
    vec3 water = mix(vec3(0.26,0.55,0.85), vec3(0.45,0.74,0.94), smoothstep(-0.2, 0.0, lm));
    vec3 g = mix(water, vec3(0.96,0.86,0.62), smoothstep(-0.005, 0.01, lm));
    g = mix(g, vec3(0.56,0.78,0.36), smoothstep(0.03, 0.06, lm));
    g = mix(g, vec3(0.97,0.98,1.0), smoothstep(0.88, 0.93, abs(d.y)));
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
  if (m < 8.5) { gloss = 0.35; return vec3(1.0,0.72,0.16); }
  if (m < 10.5) return vec3(0.95,0.70,0.24);
  if (m < 11.5) return vec3(0.96,0.79,0.64);
  if (m < 12.5) return vec3(0.22,0.27,0.45);
  if (m < 13.5) return vec3(0.91,0.33,0.24);
  if (m < 14.5) return vec3(0.42,0.27,0.18);
  return vec3(0.08,0.07,0.1);
}

vec3 bgCol(vec3 rd, float blur){
  float day = 1.0 - u_night;
  vec3 skyA = mix(vec3(0.10,0.12,0.26), vec3(0.96,0.91,0.82), day);
  vec3 skyB = mix(vec3(0.04,0.05,0.13), vec3(0.72,0.84,0.94), day);
  vec3 sky = mix(skyA, skyB, smoothstep(-0.2, 0.7, rd.y));
  vec3 sp = mix(vec3(0.012,0.014,0.035), vec3(0.04,0.04,0.08), smoothstep(-0.5, 0.6, rd.y));
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
    col += vec3(1.0,0.72,0.38)*(pow(max(a, 0.0), 400.0)*0.6 + pow(max(a, 0.0), 60.0)*0.06*(1.0 - u_space*0.5))*u_sun;
    col = mix(col, vec3(1.0,0.86,0.45), smoothstep(0.9984 - blur*0.05, 0.9989, a)*u_sun);
  }
  return col;
}

float shadowT(vec3 ro, vec3 rd, float k){ float res = 1.0, t = 0.05;
  for (int i = 0; i < 20; i++) { float h = map(ro + rd*t).x; res = min(res, k*h/t); t += clamp(h, 0.04, 0.35); if (h < 0.001 || t > 5.0) break; }
  return clamp(res, 0.0, 1.0); }
float aoT(vec3 p, vec3 n){ float o = 0.0;
  o += (0.03 - map(p + n*0.03).x); o += (0.08 - map(p + n*0.08).x)*0.6; o += (0.16 - map(p + n*0.16).x)*0.35;
  return clamp(1.0 - 3.0*o, 0.0, 1.0); }
vec3 litCol(vec3 pos, vec3 n, vec3 rd, float mat, float t, float softK, bool shadows){
  float day = 1.0 - u_night;
  float gloss; vec3 alb = albedo(mat, pos, n, gloss);
  vec3 L = keyDir();
  float sh = 1.0, ao = 1.0;
  if (shadows) { gSec = 1.0; sh = shadowT(pos + n*(0.02 + 0.0015*t), L, softK)*smoothstep(-0.15, 0.25, dot(n, L)); ao = aoT(pos, n); gSec = 0.0; }
  sh = mix(0.42, 1.0, sh);
  float dif = clamp((dot(n, L) + 0.25)/1.25, 0.0, 1.0)*sh;
  float lit = mix(1.0, smoothstep(-0.05, 0.07, L.y), u_sun);
  vec3 key = mix(vec3(0.20,0.24,0.45)*0.35, vec3(1.0,0.92,0.80)*1.1, day)*lit;
  vec3 skyc = mix(vec3(0.14,0.18,0.36), vec3(0.62,0.68,0.84), day);
  if (mat > 6.5 && mat < 7.5) { dif = 0.55 + 0.45*dif; }
  float hemi = 0.55 + 0.45*n.y;
  vec3 col = alb*(dif*key + hemi*skyc*0.62*ao + vec3(0.32,0.26,0.20)*0.18*ao);
  vec3 hv = normalize(L - rd);
  col += key*pow(max(dot(n, hv), 0.0), mix(12.0, 70.0, gloss))*mix(0.04, 0.5, gloss)*sh;
  col += skyc*pow(1.0 - max(dot(n, -rd), 0.0), 4.0)*0.25*ao;
  if (mat > 2.5 && mat < 3.5) col += vec3(1.0,0.75,0.35)*u_night*0.35;
  vec3 bgc = mix(mix(vec3(0.85,0.86,0.9), vec3(0.06,0.07,0.14), u_space), vec3(0.06,0.07,0.15), u_night);
  return mix(col, bgc, clamp((t - u_cd*1.4)*0.05, 0.0, 0.35));
}
vec3 nrm(vec3 p, float e){ vec2 k = vec2(1.0, -1.0);
  return normalize(k.xyy*map(p + k.xyy*e).x + k.yyx*map(p + k.yyx*e).x + k.yxy*map(p + k.yxy*e).x + k.xxx*map(p + k.xxx*e).x); }

vec3 render(vec2 uv, float B){
  vec2 sp = screenP(uv, 0.0);
  sp = rot(u_roll)*sp;
  vec3 ta = vec3(u_tx, u_ty, u_tz) + u_shk*0.05*vec3(sin(u_time*37.0), sin(u_time*29.0 + 1.0), sin(u_time*31.0 + 2.0));
  vec3 ro = ta + u_cd*vec3(cos(u_cpit)*sin(u_cyaw), sin(u_cpit), cos(u_cpit)*cos(u_cyaw));
  float lens = 2.2 + u_lens;
  vec3 rd = camRay(sp, ro, ta, lens);
  // circle of confusion (world units per unit distance); minimum ~1.2 px for free anti-aliasing
  float cocK = (B + 1.2/u_resolution.y)/lens;
  float bnorm = clamp(B/0.03, 0.0, 1.0);
  // bounding cylinder around the whole diorama
  float t = 0.0, tmax = u_cd*2.5 + 8.0;
  {
    vec3 o = ro; vec3 d = rd;
    float a = dot(d.xz, d.xz), b = dot(o.xz, d.xz), c = dot(o.xz, o.xz) - 3.45*3.45;
    float disc = b*b - a*c;
    float y0 = -1.9, y1 = 1.6;
    float tc0 = -1e9, tc1 = 1e9;
    if (a > 1e-6) { if (disc < 0.0) { tc0 = 1.0; tc1 = 0.0; } else { float sq = sqrt(disc); tc0 = (-b - sq)/a; tc1 = (-b + sq)/a; } }
    else if (c > 0.0) { tc0 = 1.0; tc1 = 0.0; }
    float ty0 = (y0 - o.y)/d.y, ty1 = (y1 - o.y)/d.y;
    float e0 = max(tc0, min(ty0, ty1)), e1 = min(tc1, max(ty0, ty1));
    if (e1 < max(e0, 0.0)) tmax = -1.0; else { t = max(e0, 0.0); tmax = e1; }
  }
  float mat = -1.0;
  float mr = 1e9, mt = 0.0, mm = 0.0;
  if (tmax > 0.0) {
    for (int i = 0; i < 100; i++) {
      vec2 h = map(ro + rd*t);
      float cw = cocK*t;
      if (h.x < max(0.0007*t, min(0.25*cw, 0.012))) { mat = h.y; break; }
      float rr = h.x/cw;
      if (rr < mr && h.y > 0.5) { mr = rr; mt = t; mm = h.y; }
      t += h.x*0.9;
      if (t > tmax) break;
    }
  }
  vec3 col;
  if (mat < 0.0) { col = bgCol(rd, B); t = 1e9; }
  else {
    vec3 pos = ro + rd*t;
    gBlur = cocK*t;
    vec3 n = nrm(pos, clamp(0.5*cocK*t, 0.0015, 0.02));
    col = litCol(pos, n, rd, mat, t, mix(10.0, 2.5, bnorm), true);
  }
  // soft silhouette halo of a nearby object we passed in front of (cone-traced defocus)
  if (mr < 1.0 && mt < t - 0.03 && B > 0.002 && (mat < 0.0 || abs(mm - mat) > 0.01)) {
    vec3 pm = ro + rd*mt;
    gBlur = cocK*mt;
    vec3 n2 = nrm(pm, clamp(0.5*cocK*mt, 0.002, 0.02));
    vec3 c2 = litCol(pm, n2, rd, mm, mt, 4.0, false);
    float al = 1.0 - smoothstep(0.0, 1.0, mr);
    col = mix(col, c2, al*0.85);
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
      float ty = abs(rd.y) > 1e-5 ? (0.0 - ro.y)/rd.y : 1e9;
      if (ro.y > 0.0 && rd.y < 0.0) t1 = min(t1, ty);
      t1 = min(t1, t);
      float th = max(t1 - max(t0, 0.0), 0.0);
      if (th > 0.0) {
        vec3 pe = ro + rd*max(t0, 0.0);
        float fr = pow(1.0 - abs(dot(normalize(pe/(R*R)), rd)), 2.0);
        float al = (1.0 - exp(-th*1.6))*0.6 + fr*0.35;
        col = mix(col, mix(vec3(0.45,0.74,1.0), vec3(0.88,0.96,1.0), fr), clamp(al, 0.0, 0.8)*u_air);
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
  float B = u_tsh*smoothstep(0.08, 0.45, abs(dy));
  vec3 col = render(uv, B);
  col = pow(max(col, 0.0), vec3(0.4545));
  // pastel toy grade: soft lift, gentle warmth, slight vignette
  col = mix(col, vec3(1.0,0.97,0.92), 0.05);
  float l = dot(col, vec3(0.299,0.587,0.114));
  col = mix(vec3(l), col, 1.12);
  vec2 v = uv - 0.5; col *= 1.0 - 0.25*dot(v, v);
  if (!(col.r >= 0.0 && col.g >= 0.0 && col.b >= 0.0)) col = vec3(0.5);
  return vec4(clamp(col, 0.0, 1.0), 1.0);
}
