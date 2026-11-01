// Inner solar system seen from above the ecliptic: glowing Sun, orbits of Mercury/Venus/Earth, Earth falling radially.
// params: u_r (Earth distance in AU), u_ang (Earth orbital angle), u_dist (camera distance), u_elev (camera elevation rad),
//         u_az (camera azimuth), u_look (0 = look at Sun, 1 = look at Earth), u_trail (0..1 show radial fall path), u_steam
vec2 map(vec3 p){ return vec2(1e9, 0.0); }
float sph(vec3 ro, vec3 rd, vec3 c, float r){ vec3 oc = ro-c; float b = dot(oc,rd), cc = dot(oc,oc)-r*r, h = b*b-cc; return h < 0.0 ? -1.0 : -b-sqrt(h); }
vec3 stars(vec3 rd){
  vec2 q = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*120.0;
  vec2 c = floor(q); vec2 f = fract(q)-0.5; float h = hash2(c);
  return vec3(h > 0.985 ? smoothstep(0.25,0.0,length(f))*(0.4+0.6*hash2(c+3.0)) : 0.0);
}
vec4 pixel(vec2 uv){
  vec2 p = screenP(uv, 0.0);
  vec3 E = vec3(cos(u_ang)*u_r, 0.0, sin(u_ang)*u_r);
  vec3 ta = mix(vec3(0.0), E, u_look);
  vec3 ro = ta + u_dist*vec3(cos(u_elev)*sin(u_az), sin(u_elev), cos(u_elev)*cos(u_az));
  vec3 rd = camRay(p, ro, ta, 1.6);
  vec3 col = vec3(5.0,6.0,12.0)/255.0 + stars(rd);
  // orbits in the plane y = 0
  if (abs(rd.y) > 1e-5) {
    float tp = -ro.y/rd.y;
    if (tp > 0.0) {
      vec3 X = ro + rd*tp; float rr = length(X.xz); float w = 0.0018*tp;
      float o1 = smoothstep(w, w*0.3, abs(rr-0.387));
      float o2 = smoothstep(w, w*0.3, abs(rr-0.723));
      float o3 = smoothstep(w, w*0.3, abs(rr-1.0));
      col += vec3(0.75,0.6,0.45)*o1*0.6 + vec3(0.95,0.8,0.5)*o2*0.6 + vec3(0.4,0.65,1.0)*o3*0.7;
      // radial fall path
      vec2 dir = normalize(E.xz + vec2(1e-5));
      float along = dot(X.xz, dir), perp = abs(dot(X.xz, vec2(-dir.y, dir.x)));
      float path = smoothstep(w, w*0.3, perp)*step(u_r, along)*step(along, 1.0)*step(0.45, fract(along*40.0));
      col += vec3(1.0,0.85,0.4)*path*u_trail*0.9;
    }
  }
  // Sun (exaggerated radius) + glow
  float Rs = 0.06;
  float ts = sph(ro, rd, vec3(0.0), Rs);
  vec3 toS = -ro; float bS = dot(toS, rd); float dS = length(toS - rd*bS);
  col += vec3(1.0,0.75,0.35)*(exp(-max(dS-Rs,0.0)*18.0)*0.7 + exp(-max(dS-Rs,0.0)*4.0)*0.15);
  // planets
  float t = u_time;
  vec3 Me = vec3(cos(t*0.45+1.0)*0.387, 0.0, sin(t*0.45+1.0)*0.387);
  vec3 Ve = vec3(cos(t*0.18+2.5)*0.723, 0.0, sin(t*0.18+2.5)*0.723);
  float tm = sph(ro, rd, Me, 0.012), tv = sph(ro, rd, Ve, 0.018), te = sph(ro, rd, E, 0.03);
  vec3 L;
  float best = 1e9;
  if (ts > 0.0) { best = ts; vec3 n = normalize(ro+rd*ts); float limb = pow(max(dot(n,-rd),0.0),0.4);
    col = mix(vec3(1.0,0.55,0.15), vec3(1.0,0.97,0.85), limb) * (1.0 + 0.08*noise2(n.xz*40.0 + t)); }
  if (tm > 0.0 && tm < best) { best = tm; vec3 pp = ro+rd*tm; vec3 n = normalize(pp-Me); L = normalize(-pp);
    col = vec3(0.6,0.55,0.5)*(0.08+max(dot(n,L),0.0)); }
  if (tv > 0.0 && tv < best) { best = tv; vec3 pp = ro+rd*tv; vec3 n = normalize(pp-Ve); L = normalize(-pp);
    col = vec3(0.95,0.85,0.6)*(0.08+max(dot(n,L),0.0)); }
  if (te > 0.0 && te < best) { best = te; vec3 pp = ro+rd*te; vec3 n = normalize(pp-E); L = normalize(-pp);
    vec3 alb = mix(vec3(0.2,0.45,0.85), vec3(0.95), 0.25*noise2(n.xz*6.0+n.y*3.0));
    alb = mix(alb, vec3(0.95,0.95,0.92), u_steam);
    float heat = clamp((0.5-u_r)*2.0, 0.0, 1.0);
    alb = mix(alb, vec3(1.0,0.5,0.2), heat*0.6);
    float rim = pow(1.0-max(dot(n,-rd),0.0), 3.0);
    col = alb*(0.28+1.1*max(dot(n,L),0.0)) + vec3(1.0,0.8,0.5)*rim*0.9 + vec3(0.3,0.5,0.9)*0.08; }
  // Earth halo marker so it reads at small size
  vec3 toE = E - ro; float bE = dot(toE, rd); float dE = length(toE - rd*bE);
  col += vec3(0.45,0.7,1.0)*exp(-dE/max(bE,0.01)*110.0)*0.6*step(0.0, bE);
  return vec4(col, 1.0);
}
