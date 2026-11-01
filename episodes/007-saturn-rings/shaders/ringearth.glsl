// Earth from space with Saturn-scaled rings (1.24-2.27 Earth radii), mutual shadows, debris.
float h3(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float n3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm3(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*n3(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=0.5; } return s; }
vec2 map(vec3 p){ return vec2(length(p)-1.0, 1.0); }
float ringOp(float r){
  float op = 0.0;
  if (r > 1.24 && r < 1.53) op = 0.3;
  else if (r >= 1.53 && r < 1.95) op = 0.93;
  else if (r >= 1.95 && r < 2.03) op = 0.07;
  else if (r >= 2.03 && r < 2.27) op = 0.65;
  op *= 0.72 + 0.28*noise2(vec2(r*160.0, 0.5));
  return op*smoothstep(1.24,1.25,r)*smoothstep(2.27,2.26,r);
}
vec4 pixel(vec2 uv){
  vec2 p = screenP(uv, 0.0);
  vec3 ta = vec3(u_tx, u_ty, 0.0);
  vec3 ro = vec3(sin(u_orb)*cos(u_elev), sin(u_elev), cos(u_orb)*cos(u_elev))*u_dist;
  vec3 rd = camRay(p, ro, ta, 1.5);
  vec2 sq = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*120.0; vec2 sc = floor(sq);
  vec3 col = vec3(5.0,6.0,12.0)/255.0 + vec3(smoothstep(0.25,0.0,length(fract(sq)-0.5))*(hash2(sc)>0.985?1.0:0.0)*(0.4+0.6*hash2(sc+3.0)));
  vec3 L = normalize(vec3(cos(u_sunaz)*cos(u_sundec), sin(u_sundec), sin(u_sunaz)*cos(u_sundec)));
  float b = dot(ro, rd), c = dot(ro,ro)-1.0, disc = b*b-c;
  float te = disc > 0.0 ? -b - sqrt(disc) : 1e9;
  float tp = abs(rd.y) > 1e-6 ? -ro.y/rd.y : -1.0;
  // Earth
  if (disc > 0.0) {
    vec3 pos = ro + rd*te; vec3 n = normalize(pos);
    vec3 q = n; q.xz = rot(u_spin)*q.xz;
    float land = fbm3(q*2.2+vec3(3.0,1.0,7.0)) + 0.06*(n3(q*24.0)-0.5);
    float isLand = smoothstep(0.5,0.505,land);
    vec3 alb = mix(mix(vec3(34.0,82.0,150.0), vec3(58.0,120.0,186.0), smoothstep(0.35,0.5,land))/255.0,
                   mix(vec3(86.0,140.0,58.0), vec3(185.0,166.0,106.0), smoothstep(0.55,0.7,land))/255.0, isLand);
    alb = mix(alb, vec3(0.93,0.95,0.97), smoothstep(0.86,0.9,abs(q.y)+0.08*(n3(q*9.0)-0.5)));
    vec3 cq = q; cq.xz = rot(u_time*0.01)*cq.xz;
    float cl = smoothstep(0.52,0.7,fbm3(cq*3.0+vec3(11.0,2.0,5.0)));
    alb = mix(alb, vec3(0.97), cl*0.85);
    float dif = clamp(dot(n,L),0.0,1.0);
    float rs = 1.0;
    if (abs(L.y) > 1e-3) { float s = -pos.y/L.y; if (s > 0.0) { vec3 H = pos + L*s; rs = 1.0 - 0.85*ringOp(length(H.xz))*u_ring; } }
    float shadowTint = (1.0-rs)*u_shadowhi;
    vec3 lc = lin(alb)*(dif*1.3*rs + 0.05);
    // ringlight on the night side
    lc += lin(alb)*0.05*u_ring*smoothstep(0.2,-0.2,dot(n,L));
    vec3 ec = pow(lc, vec3(0.4545));
    ec = mix(ec, vec3(0.2,0.35,0.9), shadowTint*0.35*dif);
    float rim = pow(1.0-clamp(dot(n,-rd),0.0,1.0), 2.5);
    ec = mix(ec, vec3(0.55,0.75,1.0)*(0.3+0.9*dif), rim*0.6);
    col = ec;
  }
  // atmosphere halo
  vec3 cp = ro + rd*max(-b,0.0); float hgt = length(cp)-1.0;
  if (disc <= 0.0) col += vec3(0.45,0.7,1.0)*exp(-max(hgt,0.0)*28.0)*0.9;
  // rings
  if (tp > 0.0 && tp < te) {
    vec3 X = ro + rd*tp; float r = length(X.xz);
    float op = ringOp(r)*u_ring;
    if (op > 0.0) {
      float lit = 1.0; float hl = dot(X, L);
      if (hl < 0.0 && length(X - L*hl) < 1.0) lit = 0.06;
      float sunA = 0.3 + 0.7*smoothstep(0.0, 0.35, abs(L.y));
      vec3 rc = mix(vec3(0.62,0.58,0.52), vec3(1.0,0.96,0.86), noise2(vec2(r*55.0,3.0)))*lit*sunA;
      col = mix(col, rc, op);
      if (u_debris > 0.0) {
        vec2 g = X.xz*90.0; vec2 gc = floor(g);
        float sp = step(0.985, hash2(gc))*smoothstep(0.35,0.0,length(fract(g)-0.5));
        col += vec3(1.0,0.95,0.85)*sp*u_debris*(0.5+0.5*sin(u_time*8.0+hash2(gc)*20.0));
      }
    }
  }
  if (u_debris > 0.0) {
    vec3 S = vec3(cos(u_time*0.6)*1.9, 0.02, sin(u_time*0.6)*1.9);
    float d = length(cross(rd, S-ro));
    col += vec3(1.0,0.6,0.3)*exp(-d*d*4000.0)*u_debris*2.0;
  }
  return vec4(col, 1.0);
}
