// Open park/meadow at the edge of a city: sky events (sun, moon, Jupiter, Saturn-like rings), night, frost.
float gT = 0.0;
vec2 map(vec3 p){
  vec3 q = p; q.z += 26.0;
  float bt = max(abs(q.z)-5.0, q.y-6.0);
  if (bt > 0.5) return vec2(bt, 0.0);
  float cx = floor((q.x+3.0)/6.0);
  q.x = mod(q.x+3.0,6.0)-3.0;
  q.z += (hash2(vec2(cx,1.0))-0.5)*5.0;
  float s = 0.8+0.5*hash2(vec2(cx,2.0));
  float can = sdEllipsoid(q-vec3(0.0,2.7*s,0.0), vec3(1.8,1.6,1.8)*s);
  float tr = sdCylinder(q-vec3(0.0,0.8,0.0), 0.9, 0.17);
  return opU(vec2(can*0.9, 2.0), vec2(tr, 3.0));
}
vec3 ringCol(vec3 rd, out float a){
  a = 0.0;
  if (u_ring <= 0.0 || rd.y <= 0.0) return vec3(0.0);
  float phi = radians(u_lat);
  vec3 upE = vec3(cos(phi), sin(phi), 0.0), nE = vec3(-sin(phi), cos(phi), 0.0), eE = vec3(0.0,0.0,1.0);
  vec3 d = normalize(rd.x*eE + rd.y*upE + rd.z*nE);
  vec3 O = upE*1.0003;
  vec3 Ls = normalize(vec3(cos(u_hour), u_dec, sin(u_hour)));
  vec3 col = vec3(0.0);
  if (abs(u_lat) < 0.6) {
    float w = smoothstep(0.004, 0.0, abs(d.y));
    a = w*0.95; return vec3(0.98,0.95,0.88);
  }
  if (abs(d.y) < 1e-5) return col;
  float s = -O.y/d.y;
  if (s <= 0.0) return col;
  vec3 H = O + d*s;
  float r = length(H.xz);
  float op = 0.0;
  if (r > 1.24 && r < 1.53) op = 0.28;
  else if (r >= 1.53 && r < 1.95) op = 0.92;
  else if (r >= 1.95 && r < 2.03) op = 0.06;
  else if (r >= 2.03 && r < 2.27) op = 0.62;
  op *= 0.72 + 0.28*noise2(vec2(r*160.0, 0.5));
  op *= smoothstep(1.24,1.26,r)*smoothstep(2.27,2.25,r);
  float lit = 1.0;
  float hl = dot(H, Ls);
  if (hl < 0.0 && length(H - Ls*hl) < 1.0) lit = 0.08;
  col = mix(vec3(0.62,0.58,0.52), vec3(1.0,0.96,0.86), noise2(vec2(r*55.0,3.0))) * lit;
  a = op*u_ring;
  return col;
}
vec3 skyline(vec3 rd, vec3 base, float night){
  float az = atan(rd.x, -rd.z);
  float el = rd.y;
  float w = 0.045;
  float cid = floor(az/w);
  float hh = hash2(vec2(cid, 3.0));
  float h = 0.02 + 0.07*hh*hh + (hash2(vec2(cid,8.0))>0.86 ? 0.07 : 0.0);
  float fx = fract(az/w);
  float inset = 0.08+0.1*hash2(vec2(cid,5.0));
  vec3 c = base;
  if (el < h && fx > inset && fx < 1.0-inset*0.5) {
    vec3 bc = mix(vec3(95.0,108.0,128.0), vec3(140.0,150.0,165.0), hash2(vec2(cid,6.0)))/255.0;
    bc = mix(bc, vec3(0.03,0.035,0.05), night);
    float wx = step(0.45, fract(fx*9.0)), wy = step(0.5, fract(el*260.0));
    float on = step(0.45, hash2(vec2(floor(fx*9.0)+cid*13.0, floor(el*260.0))));
    bc += wx*wy*mix(vec3(0.05), vec3(1.0,0.78,0.42)*0.9*on, night);
    c = mix(bc, base, 0.25*(1.0-night));
  }
  return c;
}
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  float yaw = u_yaw, pit = u_pitch;
  vec3 ro = vec3(0.0, 1.7, 6.0-2.0*u_cam);
  vec3 fw = vec3(sin(yaw)*cos(pit), sin(pit), -cos(yaw)*cos(pit));
  vec3 rd = camRay(p, ro, ro+fw, u_lens);
  float N = clamp(u_night, 0.0, 1.0);
  vec3 hor = vec3(173.0,198.0,226.0)/255.0, top = vec3(70.0,104.0,152.0)/255.0;
  float e = clamp(rd.y,0.0,1.0);
  vec3 sky = mix(hor, top, pow(e,0.6));
  vec3 nsky = mix(vec3(0.05,0.06,0.10), vec3(0.01,0.012,0.03), pow(e,0.5));
  sky = mix(sky, nsky, N);
  vec2 cp = rd.xz/(rd.y+0.08)*2.2;
  float cl = smoothstep(0.55,0.85,noise2(cp*1.3+vec2(gT*0.02,0.0))*0.65+noise2(cp*3.1)*0.35);
  sky = mix(sky, mix(vec3(0.93,0.95,0.98), vec3(0.08,0.09,0.12), N), cl*0.5*smoothstep(0.02,0.2,rd.y)*(1.0-0.6*N));
  vec2 sq = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*140.0;
  vec2 sc = floor(sq); float sh = hash2(sc);
  sky += vec3(smoothstep(0.3,0.0,length(fract(sq)-0.5))*(sh>0.982?1.0:0.0)*(0.5+0.5*hash2(sc+3.0)))*N*smoothstep(0.0,0.08,rd.y);
  vec3 S = normalize(vec3(sin(u_sunaz)*cos(u_sunel), sin(u_sunel), -cos(u_sunaz)*cos(u_sunel)));
  float sd = dot(rd, S);
  sky += vec3(1.0,0.92,0.75)*(smoothstep(0.9993,0.9996,sd)*2.0 + pow(max(sd,0.0),60.0)*0.35 + pow(max(sd,0.0),6.0)*0.08)*u_sun;
  vec3 M = normalize(vec3(-0.35, 0.42, -1.0));
  float md = dot(rd, M);
  float mdisk = smoothstep(0.99955,0.99965,md);
  sky = mix(sky, vec3(0.92,0.92,0.88)*(0.75+0.25*noise2(rd.xy*900.0))*u_moon + sky*(1.0-u_moon)*0.3, mdisk*max(u_moon, 0.85*N));
  sky += vec3(0.8,0.85,1.0)*pow(max(md,0.0),300.0)*0.25*u_moon;
  vec3 J = normalize(vec3(0.42, 0.55, -1.0));
  float jd = dot(rd, J);
  sky += vec3(1.0,0.93,0.8)*(smoothstep(0.99994,0.99998,jd)*2.0 + pow(max(jd,0.0),4000.0)*0.6)*u_jup;
  float ra; vec3 rc = ringCol(rd, ra);
  rc *= mix(1.0, 0.7, N);
  sky = mix(sky, rc, ra*(1.0-0.25*N)) + rc*ra*0.15*N;
  vec3 bg = skyline(rd, sky, N);
  vec3 col = bg;
  float tg = rd.y < 0.0 ? -ro.y/rd.y : 1e9;
  vec3 m = march(ro, rd, min(tg, 60.0), 0.0);
  vec3 L = normalize(vec3(sin(u_sunaz)*0.6, 1.0, -0.4));
  float day = 1.0 - N;
  vec3 key = vec3(1.25,1.15,1.0)*day*mix(1.0,0.45,u_rshadow);
  vec3 amb = mix(lin(vec3(0.62,0.72,0.86))*0.55, vec3(0.02,0.025,0.05) + vec3(0.05,0.06,0.09)*u_frost + vec3(0.06,0.055,0.05)*u_ring, N);
  vec3 hz = mix(lin(vec3(173.0,198.0,226.0)/255.0), vec3(0.004,0.005,0.01), N);
  vec3 frostC = vec3(0.85,0.9,0.97);
  if (m.x > 0.0) {
    vec3 pos = ro+rd*m.x; vec3 n = calcNormal(pos);
    vec3 alb = m.y < 2.5 ? lin(mix(vec3(79.0,127.0,51.0), vec3(104.0,148.0,62.0), noise2(pos.xz*0.7))/255.0) : lin(vec3(90.0,70.0,50.0)/255.0);
    if (m.y < 2.5) n = facet(n, 4.0);
    alb = mix(alb, lin(frostC), u_frost*smoothstep(-0.2,0.6,n.y));
    float dif = clamp((dot(n,L)+0.3)/1.3,0.0,1.0);
    col = alb*(key*dif + amb*(0.6+0.4*n.y));
    col = grade(col, hz, m.x, 14.0, 0.28, 0.02);
  } else if (tg < 1e8) {
    vec3 pos = ro+rd*tg;
    vec3 gcol = mix(vec3(67.0,98.0,47.0), vec3(110.0,140.0,70.0), noise2(pos.xz*0.35))/255.0;
    float bl = noise2(pos.xz*vec2(14.0,40.0))*noise2(pos.xz*vec2(31.0,9.0)+3.0);
    gcol *= 0.78+0.55*bl*smoothstep(30.0,3.0,tg);
    vec3 a = lin(gcol);
    a = mix(a, lin(frostC)*(0.85+0.3*bl), u_frost);
    col = a*(key*0.85 + amb*1.2);
    float gl = step(0.996, hash2(floor(pos.xz*40.0)))*u_frost*N*smoothstep(12.0,2.0,tg);
    col += vec3(0.6,0.75,1.0)*gl*0.6;
    col = grade(col, hz, tg, 16.0, 0.3, 0.02);
  }
  return vec4(col, 1.0);
}
