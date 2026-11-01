// Solar-system diagram in 3D: Sun, Earth on its orbit, light/gravity front, straight escape path.
vec2 map(vec3 p){ return vec2(1e9, 0.0); }
float sphHit(vec3 ro, vec3 rd, vec3 c, float r){ vec3 oc=ro-c; float b=dot(oc,rd), k=dot(oc,oc)-r*r, h=b*b-k; return h<0.0 ? -1.0 : -b-sqrt(h); }
vec4 pixel(vec2 uv){
  vec2 p = screenP(uv, 0.0);
  float az = u_orb;
  vec3 ta = vec3(u_tx, 0.0, u_tz);
  vec3 ro = ta + vec3(sin(az), 0.0, cos(az))*u_dist*cos(u_elev) + vec3(0.0, u_dist*sin(u_elev), 0.0);
  vec3 rd = camRay(p, ro, ta, 1.5);
  vec2 sq = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*110.0;
  vec2 sc = floor(sq);
  vec3 col = vec3(5.0,6.0,12.0)/255.0 + vec3(smoothstep(0.3,0.0,length(fract(sq)-0.5))*(hash2(sc)>0.985?1.0:0.0)*(0.4+0.6*hash2(sc+3.0)));
  float th = 0.9;
  vec3 E0 = vec3(cos(th), 0.0, sin(th));
  vec3 T = vec3(-sin(th), 0.0, cos(th));
  vec3 E = E0 + T*u_drift;
  float tp = abs(rd.y) > 1e-5 ? -ro.y/rd.y : -1.0;
  if (tp > 0.0) {
    vec3 X = ro + rd*tp;
    float r = length(X.xz);
    float w = 0.0035*tp;
    float ang = atan(X.z, X.x);
    float dash = step(0.5, fract(ang*20.0/6.2832));
    col = mix(col, vec3(0.55,0.65,0.85), smoothstep(w, w*0.3, abs(r-1.0))*0.55*dash*u_orbit);
    if (u_front > 0.0) col += vec3(1.0,0.85,0.5)*smoothstep(w*3.0, 0.0, abs(r-u_front))*0.9*step(u_front, 2.5)*u_frontA;
    if (u_drift > 0.0) {
      vec2 a = E0.xz, b = E.xz; vec2 pa = X.xz-a, ba = b-a; float hh = clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
      float dl = length(pa-ba*hh);
      col = mix(col, vec3(1.0,0.55,0.3), smoothstep(w*1.4, w*0.4, dl)*0.9);
    }
  }
  float sr = 0.13;
  float ts = sphHit(ro, rd, vec3(0.0), sr);
  vec3 oc = ro; float b = dot(oc, rd); float dmin = length(oc - rd*b);
  col += vec3(1.0,0.75,0.4)*exp(-max(dmin-sr,0.0)*9.0)*0.7*u_sun;
  if (ts > 0.0) {
    vec3 n = normalize(ro+rd*ts);
    float lim = 0.55+0.45*pow(clamp(dot(n,-rd),0.0,1.0),0.5);
    vec3 sc2 = mix(vec3(1.0,0.55,0.15), vec3(1.0,0.97,0.85), lim) * (0.9+0.1*noise2(n.xy*30.0+u_time));
    col = mix(col, sc2, u_sun);
  }
  float er = 0.065;
  float te = sphHit(ro, rd, E, er);
  if (te > 0.0) {
    vec3 n = normalize(ro+rd*te - E);
    vec3 L = normalize(-E);
    float land = noise2(n.xz*6.0+n.y*3.0);
    vec3 alb = mix(vec3(0.15,0.35,0.75), vec3(0.35,0.55,0.25), smoothstep(0.55,0.6,land));
    alb = mix(alb, vec3(0.95), smoothstep(0.6,0.75,noise2(n.yz*9.0+2.0))*0.6);
    alb = mix(alb, vec3(0.85,0.9,0.97), u_ice);
    float dif = clamp(dot(n,L),0.0,1.0)*u_lit;
    col = alb*(dif*1.2 + 0.05) + vec3(0.3,0.5,1.0)*pow(1.0-clamp(dot(n,-rd),0.0,1.0),3.0)*0.4*u_lit;
  }
  vec3 oe = ro - E; float be = dot(oe, rd); float de = length(oe - rd*be);
  if (te < 0.0) col += vec3(0.4,0.65,1.0)*exp(-max(de-er,0.0)*60.0)*0.35*(0.3+0.7*u_lit);
  float dpx = de/max(be*-1.0,0.01);
  col = mix(col, vec3(0.75,0.85,1.0), smoothstep(0.004,0.0,abs(de-er*2.0))*0.7*(1.0-u_lit)*step(te,0.0));
  return vec4(col, 1.0);
}
