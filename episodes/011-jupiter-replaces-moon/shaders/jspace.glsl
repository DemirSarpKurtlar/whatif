// Space: Jupiter (radius 1) at origin, Earth orbiting at 5.5 R_J, Galilean moons.
// params: u_dist, u_orb, u_camy, u_focus (0 = look at Jupiter, 1 = look at Earth), u_eang (Earth orbit angle),
//         u_orbits (0..1 show orbit rings), u_moons (0..1 show Galilean moons), u_volc (0..1 Earth volcano glow), u_lens
vec2 map(vec3 p){ return vec2(1e9, 0.0); }
float sphHit(vec3 ro, vec3 rd, vec3 c, float r){ vec3 oc = ro - c; float b = dot(oc, rd); float h = b*b - dot(oc, oc) + r*r; return h < 0.0 ? -1.0 : -b - sqrt(h); }
float h3(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float n3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm3(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<4;i++){ s+=a*n3(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=0.5; } return s; }
// ---- Jupiter surface colour from latitude (-1..1) and longitude (radians)
vec3 jupCol(float lat, float lon, float tm){
  float tl = lat + 0.035*(noise2(vec2(lon*3.0, lat*22.0) + tm*0.05) - 0.5) + 0.012*sin(lon*7.0 + lat*30.0);
  float b = tl*9.5;
  vec3 cream = vec3(0.95, 0.9, 0.8), tan = vec3(0.84, 0.66, 0.48), brown = vec3(0.62, 0.43, 0.31), white = vec3(0.98, 0.96, 0.92);
  float s1 = 0.5 + 0.5*sin(b*3.14159), s2 = 0.5 + 0.5*sin(b*6.2832 + 1.3);
  vec3 c = mix(mix(cream, tan, s1), brown, smoothstep(0.62, 0.95, s2)*0.7*smoothstep(0.9, 0.2, abs(tl)));
  c = mix(c, white, smoothstep(0.1, 0.0, abs(tl - 0.05))*0.5);
  c *= 0.92 + 0.12*noise2(vec2(lon*14.0, tl*60.0));
  // Great Red Spot
  vec2 g = vec2((lon - 0.35)/0.28, (lat + 0.36)/0.11);
  float gr = length(g);
  float sw = noise2(vec2(atan(g.y, g.x)*2.0 + gr*6.0, gr*4.0));
  c = mix(c, mix(vec3(0.78, 0.36, 0.26), vec3(0.9, 0.55, 0.4), sw), smoothstep(1.0, 0.75, gr));
  c = mix(c, vec3(0.96, 0.88, 0.78), smoothstep(0.16, 0.0, abs(gr - 1.08))*0.5);
  return c;
}

vec3 stars(vec3 rd){
  vec2 q = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*120.0;
  vec2 c = floor(q); vec2 f = fract(q)-0.5; float h = hash2(c);
  return vec3(h > 0.985 ? smoothstep(0.25,0.0,length(f))*(0.4+0.6*hash2(c+3.0)) : 0.0);
}
vec4 pixel(vec2 uv){
  vec2 p = screenP(uv, 0.0);
  vec3 E = vec3(cos(u_eang)*5.5, 0.0, sin(u_eang)*5.5);
  vec3 ro = vec3(sin(u_orb)*u_dist, u_camy, cos(u_orb)*u_dist);
  vec3 ta = mix(vec3(0.0), E, u_focus);
  vec3 rd = camRay(p, ro, ta, u_lens);
  vec3 L = normalize(vec3(1.0, 0.15, 0.35));
  vec3 col = vec3(4.0, 5.0, 11.0)/255.0 + stars(rd);
  float tBest = 1e9;
  // orbit rings in the plane y = 0 (Earth 5.5, Io 6.03, Europa 9.6, Ganymede 15.3, Callisto 26.9)
  if (u_orbits > 0.0 && abs(rd.y) > 1e-4) {
    float tp = -ro.y/rd.y;
    if (tp > 0.0) {
      vec3 X = ro + rd*tp; float rr = length(X.xz); float w = 0.0022*tp;
      float occ = sphHit(ro, rd, vec3(0.0), 1.0); bool behind = occ > 0.0 && occ < tp;
      if (!behind) {
        col = mix(col, vec3(0.45, 0.75, 1.0), smoothstep(w, w*0.3, abs(rr - 5.5))*0.9*u_orbits);
        float mo = smoothstep(w, w*0.3, abs(rr - 6.03)) + smoothstep(w, w*0.3, abs(rr - 9.6)) + smoothstep(w, w*0.3, abs(rr - 15.3)) + smoothstep(w, w*0.3, abs(rr - 26.9));
        col = mix(col, vec3(0.9, 0.85, 0.7), clamp(mo, 0.0, 1.0)*0.45*u_moons);
      }
    }
  }
  // Jupiter
  float tj = sphHit(ro, rd, vec3(0.0), 1.0);
  if (tj > 0.0) {
    tBest = tj;
    vec3 n = normalize(ro + rd*tj);
    float lat = n.y; float lon = atan(n.z, n.x) + u_time*0.03;
    vec3 jc = jupCol(lat, lon, u_time);
    float dif = clamp(dot(n, L), 0.0, 1.0);
    col = jc*(0.03 + 1.05*dif)*(0.7 + 0.3*pow(max(dot(n, -rd), 0.0), 0.5));
    col += vec3(0.9, 0.8, 0.6)*pow(1.0 - max(dot(n, -rd), 0.0), 4.0)*0.15*dif;
  }
  // Earth
  float te = sphHit(ro, rd, E, 0.0892);
  if (te > 0.0 && te < tBest) {
    tBest = te;
    vec3 n = normalize(ro + rd*te - E);
    float land = fbm3(n*2.4 + vec3(3.0, 1.0, 7.0));
    vec3 alb = mix(vec3(0.12, 0.3, 0.6), vec3(0.32, 0.5, 0.22), smoothstep(0.5, 0.51, land));
    alb = mix(alb, vec3(0.95), smoothstep(0.55, 0.72, fbm3(n*3.3 + vec3(9.0, 2.0, 1.0)))*0.8);
    float dif = clamp(dot(n, L), 0.0, 1.0);
    col = alb*(0.02 + 1.1*dif) + vec3(0.4, 0.6, 1.0)*pow(1.0 - max(dot(n, -rd), 0.0), 3.0)*0.5;
    // Jupiter-shine on the night side
    vec3 toJ = normalize(-E);
    col += alb*vec3(0.45, 0.4, 0.32)*clamp(dot(n, toJ), 0.0, 1.0)*0.7;
    if (u_volc > 0.0) {
      vec2 g = vec2(atan(n.z, n.x), asin(n.y))*6.0; vec2 gc = floor(g); vec2 gf = fract(g) - 0.5;
      float on = step(0.6, hash2(gc))*smoothstep(0.5, 0.52, land);
      col += vec3(1.0, 0.35, 0.08)*smoothstep(0.18, 0.0, length(gf))*on*u_volc*(1.0 - dif*0.7)*(0.7 + 0.3*sin(u_time*5.0 + hash2(gc)*9.0));
    }
  } else if (u_focus > 0.3) {
    // halo marker around Earth so it is findable when tiny
    float dm = length(cross(rd, E - ro));
    col += vec3(0.4, 0.7, 1.0)*exp(-dm/0.06)*0.0;
  }
  // Io and Europa
  if (u_moons > 0.0) {
    vec3 Io = vec3(cos(u_eang + 0.35 + u_time*0.05)*6.03, 0.0, sin(u_eang + 0.35 + u_time*0.05)*6.03);
    vec3 Eu = vec3(cos(2.2 + u_time*0.03)*9.6, 0.0, sin(2.2 + u_time*0.03)*9.6);
    float ti = sphHit(ro, rd, Io, 0.026);
    if (ti > 0.0 && ti < tBest) { tBest = ti; vec3 n = normalize(ro + rd*ti - Io); col = vec3(0.95, 0.8, 0.4)*(0.03 + clamp(dot(n, L), 0.0, 1.0))*u_moons; }
    float tu = sphHit(ro, rd, Eu, 0.022);
    if (tu > 0.0 && tu < tBest) { tBest = tu; vec3 n = normalize(ro + rd*tu - Eu); col = vec3(0.9, 0.88, 0.84)*(0.03 + clamp(dot(n, L), 0.0, 1.0))*u_moons; }
  }
  return vec4(col, 1.0);
}
