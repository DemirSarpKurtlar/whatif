// court.glsl — Episode 051 (Gravity Part 5: gravity cut in half). "Lowpoly Skyline" look (same palette/towers as lowcity.glsl):
// a bright low-poly outdoor basketball court on the waterfront, pastel skyline across the bay.
// Physics (calc.py): same take-off speed 3.13 m/s -> 0.50 m jump at 9.81, 1.00 m at 4.905 (airtime 0.64 s -> 1.28 s).
// Average man (1.75 m, standing reach 2.33 m): hand reaches 2.83 m at 1 g (rim 3.05 m: no dunk), 3.33 m at half g (dunk).
// Params:
//   cx,cy,cz / tx,ty,tz : camera position / look-at (m). Rim centre is at (0, 3.05, 0); player stands at z = 0.45
//   lens  : focal (0 -> 1.25)      shake : camera shake
//   jt    : physical seconds since take-off (<= 0: standing). Player follows the half-g parabola, ghost (1 g) the normal one
//   ghost : opacity of the 1 g "normal gravity" ghost player / ghost phone (0..1)
//   phone : 1 = show the phone-drop setup (phone released from 1.2 m at x = 1.2, z = 1.6)
//   drop  : physical seconds since the phone was released
float gT = 0.0;
bool gG = false;            // true: map() returns only the ghost (1 g) objects
const float GF = 9.81, GH = 4.905, V0 = 3.1321;
const vec3 RIM = vec3(0.0, 3.05, 0.0);
const vec3 PH0 = vec3(3.2, 1.2, 3.4);
float jumpY(float t, float g){ if (t <= 0.0) return 0.0; return max(V0*t - 0.5*g*t*t, 0.0); }
float dropY(float t, float g){ if (t <= 0.0) return PH0.y; return max(PH0.y - 0.5*g*t*t, 0.006); }
vec3 ballPos(float t, float g){
  float tA = V0/g;
  vec3 hand = vec3(0.0, 2.43 + jumpY(min(t, tA), g), 0.27);
  if (t <= tA) return vec3(0.0, 2.43 + jumpY(t, g), 0.27);
  float u = t - tA;
  if (g > 7.0) return vec3(0.0, max(2.93 - 0.5*g*u*u, 0.12), 0.27 + 0.4*u); // 1 g ghost: ball bounces off the front of the rim
  float y = 3.43 - 1.6*u - 0.5*g*u*u;
  return vec3(0.0, max(y, 0.12), mix(0.27, 0.0, clamp(u/0.18, 0.0, 1.0)));
}
vec2 player(vec3 p, float t, float g){
  float y = jumpY(t, g);
  vec3 q = p - vec3(0.0, y, 0.45);
  float bb = sdRoundBox(q - vec3(0.0, 1.25, 0.0), vec3(0.45, 1.3, 0.45), 0.0);
  if (bb > 0.3) return vec2(bb, 0.0);
  float air = clamp(y*3.0, 0.0, 1.0);
  float kn = 0.12*air;
  float legs = min(sdCapsule(q, vec3(0.1,0.92,0.0), vec3(0.11,0.48,-kn), 0.085), sdCapsule(q, vec3(-0.1,0.92,0.0), vec3(-0.11,0.48,-kn*0.4), 0.085));
  float shins = min(sdCapsule(q, vec3(0.11,0.48,-kn), vec3(0.11,0.08,0.02+kn*0.6), 0.07), sdCapsule(q, vec3(-0.11,0.48,-kn*0.4), vec3(-0.11,0.08,0.02+kn*0.3), 0.07));
  float shoes = min(sdRoundBox(q - vec3(0.11,0.05,-0.04+kn*0.6), vec3(0.06,0.04,0.13), 0.02), sdRoundBox(q - vec3(-0.11,0.05,-0.04+kn*0.3), vec3(0.06,0.04,0.13), 0.02));
  float shorts = sdRoundBox(q - vec3(0.0,0.86,0.0), vec3(0.2,0.14,0.13), 0.04);
  float torso = sdCapsule(q, vec3(0.0,1.04,0.0), vec3(0.0,1.4,0.0), 0.18);
  float head = sdSphere(q - vec3(0.0,1.62,-0.02), 0.12);
  float arms = min(sdCapsule(q, vec3(0.2,1.42,0.0), vec3(0.07,2.24,-0.16), 0.055), sdCapsule(q, vec3(-0.2,1.42,0.0), vec3(-0.07,2.24,-0.16), 0.055));
  vec2 r = vec2(min(legs, shins), 6.0);              // skin
  r = opU(r, vec2(shoes, 7.0));
  r = opU(r, vec2(shorts, 5.0));
  r = opU(r, vec2(smin(torso, arms, 0.05), 4.0));   // jersey (arms = jersey colour sleeves -> simplified)
  r = opU(r, vec2(head, 6.0));
  if (abs(q.x) < 0.2 && q.y > 1.6) r = opU(r, vec2(sdSphere(q - vec3(0.0,1.66,0.0), 0.118), 8.0)); // hair cap
  return r;
}
vec2 phoneSD(vec3 p, float t, float g){
  vec3 q = p - vec3(PH0.x, dropY(t, g), PH0.z);
  float rr = clamp(t, 0.0, 1.0);
  q.xy = rot(0.6*rr)*q.xy; q.yz = rot(0.35*rr)*q.yz;
  return vec2(sdRoundBox(q, vec3(0.034, 0.072, 0.004), 0.006), 9.0);
}
vec2 map(vec3 p){
  float jt = u_jt;
  if (gG) {
    vec2 r = vec2(1e9, 0.0);
    if (u_phone > 0.5) r = phoneSD(p, u_drop, GF);
    else { r = player(p, jt, GF); r = opU(r, vec2(sdSphere(p - ballPos(jt, GF), 0.12), 3.0)); }
    return r;
  }
  vec2 r = player(p, jt, GH);
  r = opU(r, vec2(sdSphere(p - ballPos(jt, GH), 0.12), 3.0));
  // hoop: rim, net strings, backboard, arm, pole
  vec3 q = p - RIM;
  r = opU(r, vec2(sdTorus(q, vec2(0.23, 0.018)), 10.0));
  float net = 1e9;
  for (int i = 0; i < 8; i++) {
    float a = float(i)*0.785;
    vec3 a0 = vec3(cos(a)*0.23, 0.0, sin(a)*0.23), a1 = vec3(cos(a+0.39)*0.15, -0.42, sin(a+0.39)*0.15);
    net = min(net, sdCapsule(q, a0, a1, 0.008));
  }
  net = min(net, sdTorus(q - vec3(0.0,-0.42,0.0), vec2(0.15, 0.008)));
  r = opU(r, vec2(net, 11.0));
  r = opU(r, vec2(sdRoundBox(p - vec3(0.0, 3.4, -0.4), vec3(0.9, 0.53, 0.025), 0.01), 12.0));
  r = opU(r, vec2(sdRoundBox(p - vec3(0.0, 3.3, -0.85), vec3(0.05, 0.05, 0.45), 0.01), 13.0));
  r = opU(r, vec2(sdCylinder(p - vec3(0.0, 1.85, -1.3), 1.85, 0.08), 13.0));
  r = opU(r, vec2(sdRoundBox(p - vec3(0.0, 0.25, -1.3), vec3(0.35, 0.25, 0.35), 0.03), 13.0));
  if (u_phone > 0.5) r = opU(r, phoneSD(p, u_drop, GH));
  return r;
}
vec3 skyCol(vec3 rd){
  vec3 hor = vec3(198.0,218.0,240.0)/255.0, top = vec3(92.0,148.0,222.0)/255.0;
  float e = clamp(rd.y,0.0,1.0);
  vec3 c = mix(hor, top, pow(e,0.55));
  vec2 cp = rd.xz/(rd.y+0.08)*2.0;
  float cl = smoothstep(0.58,0.8,noise2(cp*1.2+vec2(gT*0.03,0.0))*0.65+noise2(cp*2.9)*0.35);
  c = mix(c, vec3(0.97,0.98,1.0), cl*0.7*smoothstep(0.03,0.22,rd.y));
  return c;
}
vec3 towers(vec3 ro, vec3 rd, float R, float wcell, float seed, float hmin, float hrng, out float hit){
  hit = 0.0;
  float dh = max(length(rd.xz), 1e-4);
  float y = ro.y + rd.y*R/dh;
  if (y < 0.0) return vec3(0.0);
  float a = atan(rd.x, -rd.z);
  float u = a*R/wcell + seed*13.0;
  float cid = floor(u), fx = fract(u);
  float h1 = hash2(vec2(cid, seed));
  float ht = hmin + hrng*pow(h1, 1.3);
  float inset = 0.03 + 0.14*hash2(vec2(cid, seed+5.0));
  float step2 = hash2(vec2(cid, seed+9.0)) > 0.7 ? 0.82 : 1.0;
  float topY = (fx > 0.25 && fx < 0.75) ? ht : ht*step2;
  if (fx < inset || fx > 1.0-inset*0.5 || y > topY) return vec3(0.0);
  hit = 1.0;
  float k = hash2(vec2(cid, seed+3.0));
  vec3 pc = k<0.16? vec3(233.0,223.0,201.0) : k<0.32? vec3(216.0,112.0,94.0) : k<0.46? vec3(156.0,195.0,230.0) : k<0.6? vec3(143.0,201.0,190.0)
          : k<0.74? vec3(217.0,180.0,143.0) : k<0.88? vec3(201.0,206.0,214.0) : vec3(196.0,84.0,70.0);
  pc /= 255.0;
  float split = 0.45 + 0.3*hash2(vec2(cid, seed+7.0));
  bool lit = fx < split;
  vec3 c = lit ? pc*1.04 : pc*vec3(0.70,0.73,0.80);
  float wx = (lit ? (fx-inset) : (fx-split))*wcell;
  float wm = step(0.42, fract(wx/1.9)) * step(0.36, fract(y/2.6)) * step(2.0, y);
  vec3 wc = mix(c*0.48 + vec3(0.03,0.05,0.09), vec3(0.78,0.86,0.95), step(0.93, hash2(vec2(floor(wx/1.9)+cid*7.0, floor(y/2.6)))));
  c = mix(c, wc, wm*0.85);
  return c;
}
vec3 farView(vec3 ro, vec3 rd, vec3 sky){
  float h1, h2;
  vec3 c = sky;
  vec3 t2 = towers(ro, rd, 175.0, 13.0, 21.0, 16.0, 62.0, h2);
  if (h2 > 0.5) c = mix(t2, sky, 0.34);
  vec3 t1 = towers(ro, rd, 128.0, 15.5, 3.0, 10.0, 48.0, h1);
  if (h1 > 0.5) c = mix(t1, sky, 0.17);
  float dh = max(length(rd.xz), 1e-4);
  float ys = ro.y + rd.y*105.0/dh;
  if (ys < 1.4) { vec3 sc = ys > 0.9 ? vec3(0.86,0.86,0.84) : vec3(0.74,0.74,0.72); c = mix(sc, sky, 0.15); }
  return c;
}
vec3 albedo(float id, vec3 pos){
  if (id < 3.5) { // basketball with seams
    vec3 b = pos - ballPos(u_jt, gG ? GF : GH);
    float s = min(abs(b.x), min(abs(b.y), abs(length(b.xz)-0.085)));
    return lin(mix(vec3(0.12), vec3(226.0,110.0,40.0)/255.0, smoothstep(0.006, 0.012, s)));
  }
  if (id < 4.5) return lin(vec3(222.0,62.0,56.0)/255.0);
  if (id < 5.5) return lin(vec3(36.0,52.0,96.0)/255.0);
  if (id < 6.5) return lin(vec3(176.0,116.0,78.0)/255.0);
  if (id < 7.5) return lin(vec3(0.96));
  if (id < 8.5) return lin(vec3(40.0,30.0,26.0)/255.0);
  if (id < 9.5) { // phone: dark glass front with a lit screen
    return lin(vec3(32.0,40.0,58.0)/255.0);
  }
  if (id < 10.5) return lin(vec3(240.0,104.0,40.0)/255.0);
  if (id < 11.5) return lin(vec3(0.97));
  if (id < 12.5) { // backboard: white with orange target square
    vec2 b = pos.xy - vec2(0.0, 3.25);
    float sq = max(abs(b.x)-0.3, abs(b.y)-0.22);
    float edge = max(abs(pos.x)-0.86, abs(pos.y-3.4)-0.49);
    return lin(abs(sq) < 0.025 || edge > -0.035 ? vec3(240.0,104.0,40.0)/255.0 : vec3(0.95,0.97,1.0));
  }
  return lin(vec3(60.0,66.0,80.0)/255.0);
}
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  vec2 jit = u_shake*vec2(noise2(vec2(u_time*23.0,1.0))-0.5, noise2(vec2(u_time*19.0,7.0))-0.5)*0.12;
  vec3 ro = vec3(u_cx + jit.x, u_cy + jit.y, u_cz);
  vec3 ta = vec3(u_tx, u_ty, u_tz);
  vec3 rd = camRay(p, ro, ta, u_lens > 0.0 ? u_lens : 1.25);
  vec3 sky = skyCol(rd);
  vec3 L = normalize(vec3(-0.55,0.9,0.5));
  vec3 key = vec3(1.3,1.2,1.05), skyF = lin(vec3(0.62,0.74,0.9))*0.6, bnc = lin(vec3(0.62,0.5,0.4))*0.45;
  vec3 hazeC = lin(vec3(198.0,218.0,240.0)/255.0);
  float dh = max(length(rd.xz), 1e-4);
  float te = 1e9;
  if (rd.y < 0.0) te = -ro.y/rd.y;
  gG = false;
  vec3 m = march(ro, rd, min(te, 60.0), 0.0);
  vec3 col = farView(ro, rd, sky);
  if (m.x > 0.0) {
    vec3 pos = ro + rd*m.x;
    vec3 n = calcNormal(pos);
    float id = m.y;
    vec3 alb = albedo(id, pos);
    if (id > 3.5 && id < 8.5) n = facet(n, 3.0);
    float gl = id > 9.5 ? 0.4 : (id > 8.5 ? 0.9 : 0.08);
    col = shade(pos, n, rd, alb, L, key, skyF, bnc, gl);
    if (id > 8.5 && id < 9.5 && n.z > 0.5) col += lin(vec3(0.35,0.62,0.95))*0.5; // screen glow
    col = grade(col, hazeC, m.x, 30.0, 0.25, 0.02);
  } else if (te < 1e8) {
    vec3 pos = ro + rd*te;
    float rr = length(pos.xz);
    vec3 a;
    vec2 c = pos.xz - vec2(0.0, 2.6);
    if (abs(c.x) < 7.5 && c.y > -4.6 && c.y < 9.0) {
      // court: blue key + green-blue court, orange surround, white lines
      a = vec3(62.0,124.0,177.0)/255.0;
      if (abs(pos.x) < 2.45 && pos.z < 4.5) a = vec3(214.0,104.0,62.0)/255.0;
      float ln = 0.0;
      ln = max(ln, step(abs(abs(pos.x)-2.45), 0.03)*step(pos.z, 4.5)*step(-1.6, pos.z));
      ln = max(ln, step(abs(pos.z-4.5), 0.03)*step(abs(pos.x), 2.45));
      ln = max(ln, step(abs(length(pos.xz - vec2(0.0,4.5))-1.8), 0.03)*step(4.5, pos.z));
      ln = max(ln, step(abs(length(pos.xz)-6.75), 0.035)*step(-1.6, pos.z));
      ln = max(ln, step(abs(abs(pos.x)-7.4), 0.04));
      ln = max(ln, step(abs(pos.z+1.6), 0.04)*step(abs(pos.x), 7.4));
      a = mix(a, vec3(0.97), ln);
    } else if (rr < 40.0 || pos.z > -12.0) {
      a = vec3(206.0,204.0,198.0)/255.0;
      vec2 tl = abs(fract(pos.xz/1.5)-0.5);
      a *= 0.94 + 0.06*smoothstep(0.46,0.44,max(tl.x,tl.y));
      if (pos.z < -12.0) a = vec3(225.0,224.0,218.0)/255.0;
      if (abs(pos.x) > 11.0 || pos.z > 13.0) { vec2 tc = floor(pos.xz*0.9); a = mix(vec3(78.0,166.0,58.0), vec3(104.0,192.0,70.0), hash2(tc))/255.0; }
    } else {
      a = vec3(0.0);
    }
    if (a.x + a.y + a.z > 0.0) {
      a = lin(a);
      // blob shadows (player, ball, phone), offset along the light
      vec2 so = vec2(0.45,-0.35);
      vec2 sp = pos.xz + so*0.0;
      float s = 1.0;
      float py = jumpY(u_jt, GH);
      s *= mix(0.5, 1.0, smoothstep(0.2+py*0.15, 0.5+py*0.35, length((pos.xz - vec2(0.0,0.45) + so*py*0.6)*vec2(1.0,1.3))));
      vec3 bp = ballPos(u_jt, GH);
      s *= mix(0.55, 1.0, smoothstep(0.08, 0.2+bp.y*0.08, length(pos.xz - bp.xz + so*bp.y*0.6)));
      s *= mix(0.55, 1.0, smoothstep(0.1, 0.5, length(pos.xz - vec2(0.0,-1.3) + so*1.5) ));
      if (u_phone > 0.5) { float yy = dropY(u_drop, GH); s *= mix(0.5, 1.0, smoothstep(0.03, 0.09+yy*0.08, length(pos.xz - PH0.xz))); }
      col = a*(key*0.9*s + skyF*1.15);
      col = grade(col, hazeC, te, 30.0, 0.25, 0.02);
    } else {
      // bay
      vec2 fc = floor(pos.xz*vec2(0.55,0.8) + vec2(pos.z*0.3, 0.0));
      vec3 wn = normalize(vec3((hash2(fc)-0.5)*0.16, 1.0, (hash2(fc+3.7)-0.5)*0.16));
      vec3 base = lin(mix(vec3(40.0,112.0,196.0), vec3(70.0,145.0,215.0), hash2(fc+1.3)*0.5)/255.0);
      float fr = pow(clamp(1.0+dot(rd,wn),0.0,1.0), 4.0);
      col = mix(base*(0.75+0.35*dot(wn,L)), lin(skyCol(reflect(rd,wn))), 0.25+0.55*fr);
      col = grade(col, hazeC, te, 30.0, 0.3, 0.02);
      if (rr > 104.0) col = farView(ro, rd, sky);
    }
  }
  // 1 g ghost: translucent white silhouette with a rim
  if (u_ghost > 0.01) {
    gG = true;
    vec3 g = march(ro, rd, min(te, 60.0), 0.0);
    if (g.x > 0.0 && (m.x < 0.0 || g.x < m.x + 0.02)) {
      vec3 pos = ro + rd*g.x;
      vec3 n = calcNormal(pos);
      float fr = pow(clamp(1.0+dot(rd,n),0.0,1.0), 1.5);
      vec3 gc = mix(vec3(0.85,0.92,1.0), vec3(1.0), fr);
      col = mix(col, gc, u_ghost*(0.38 + 0.5*fr));
    }
    gG = false;
  }
  return vec4(col, 1.0);
}
