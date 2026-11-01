// Earth (radius u_er) at the origin and the Moon (radius 0.273) at (u_mx, 0, u_mz).
// params: u_dist, u_orb, u_camy, u_tx, u_er, u_mx, u_mz, u_spin, u_leak, u_path (0..1 moon escape path), u_ghost (0..1 outline of old Earth size)
float h3(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float n3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm3(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*n3(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=0.5; } return s; }
vec2 map(vec3 p){ return vec2(length(p)-u_er, 1.0); }
float sph(vec3 ro, vec3 rd, vec3 c, float r){ vec3 oc = ro - c; float b = dot(oc, rd), cc = dot(oc,oc) - r*r, d = b*b - cc; return d < 0.0 ? -1.0 : -b - sqrt(d); }
vec3 stars(vec3 rd){
  vec2 q = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*120.0;
  vec2 c = floor(q); vec2 f = fract(q)-0.5; float h = hash2(c);
  return vec3(h > 0.985 ? smoothstep(0.25,0.0,length(f))*(0.4+0.6*hash2(c+3.0)) : 0.0);
}
vec4 pixel(vec2 uv){
  vec2 p = screenP(uv, 0.0);
  vec3 ro = vec3(sin(u_orb)*u_dist + u_tx, u_camy, cos(u_orb)*u_dist);
  vec3 rd = camRay(p, ro, vec3(u_tx, 0.0, 0.0), 1.6);
  vec3 col = vec3(5.0,6.0,12.0)/255.0 + stars(rd);
  vec3 L = normalize(vec3(-0.8,0.35,0.6));
  vec3 MC = vec3(u_mx, 0.0, u_mz);
  float te = sph(ro, rd, vec3(0.0), u_er);
  float tm = sph(ro, rd, MC, 0.273);
  if (tm > 0.0 && (te < 0.0 || tm < te)) {
    vec3 n = normalize(ro + rd*tm - MC);
    float cr = fbm3(n*5.0); float mare = smoothstep(0.52,0.56,fbm3(n*1.6+vec3(4.0)));
    vec3 alb = mix(vec3(0.72,0.71,0.68), vec3(0.42,0.42,0.42), mare) * (0.8 + 0.35*cr);
    float dif = clamp(dot(n,L),0.0,1.0);
    col = alb*(0.04 + 1.05*dif);
  } else if (te > 0.0) {
    vec3 n = normalize(ro + rd*te); vec3 q = n; q.xz = rot(u_spin)*q.xz;
    float land = fbm3(q*2.2+vec3(3.0,1.0,7.0)) + 0.06*(n3(q*24.0)-0.5);
    float isL = smoothstep(0.5,0.505,land);
    vec3 alb = mix(mix(vec3(34.0,82.0,150.0), vec3(58.0,120.0,186.0), smoothstep(0.35,0.5,land))/255.0,
                   mix(vec3(86.0,140.0,58.0), vec3(185.0,166.0,106.0), smoothstep(0.55,0.7,land))/255.0, isL);
    alb = mix(alb, vec3(0.94), smoothstep(0.86,0.9,abs(q.y)+0.08*(n3(q*9.0)-0.5)));
    vec3 cq = q; cq.xz = rot(u_time*0.01)*cq.xz;
    float cl = smoothstep(0.52,0.7,fbm3(cq*3.0+vec3(11.0,2.0,5.0)));
    alb = mix(alb, vec3(0.97), cl*0.85);
    float dif = clamp(dot(n,L),0.0,1.0);
    vec3 c = pow(lin(alb)*(dif*1.3+0.06), vec3(0.4545));
    float rim = pow(1.0-clamp(dot(n,-rd),0.0,1.0), 2.5);
    col = mix(c, vec3(0.55,0.75,1.0)*(0.3+0.9*dif), rim*0.6);
  }
  // atmosphere halo + leaking plumes
  float b = dot(ro, rd); vec3 cp = ro + rd*max(-b, 0.0); float hgt = length(cp) - u_er;
  if (hgt > 0.0 && (tm < 0.0 || length(cp - ro) < tm)) {
    float hh = hgt/u_er;
    col += vec3(0.45,0.7,1.0)*exp(-hh*28.0)*0.85;
    if (u_leak > 0.0) {
      vec3 dir = normalize(cp); float a2 = atan(dir.y, dir.x + dir.z*0.3);
      float streak = 0.5 + 0.5*n3(vec3(a2*14.0, hh*3.0 - u_time*0.6, 1.0));
      col += vec3(0.5,0.75,1.0)*exp(-hh*mix(28.0,3.0,u_leak))*streak*u_leak*0.9;
    }
  }
  // ghost outline of the old Earth size
  if (u_ghost > 0.0) {
    float tt = max(-b, 0.0); float d = abs(length(ro + rd*tt) - 1.0);
    col = mix(col, vec3(1.0), smoothstep(0.012, 0.004, d)*u_ghost*0.7*step(0.5, fract(atan(cp.y, cp.x)*12.0)));
  }
  // moon escape path (dashed arc from the old orbit outward)
  if (u_path > 0.0 && abs(rd.y) > 1e-4) {
    float tp = -ro.y/rd.y;
    if (tp > 0.0) {
      vec3 X = ro + rd*tp;
      float ang = atan(X.z, X.x);
      float r0 = 2.2;
      float spiral = r0 + max(ang + 0.6, 0.0)*0.9*u_path;
      float dd = abs(length(X.xz) - spiral);
      float on = step(-0.6, ang)*step(ang, -0.6 + 3.2*u_path);
      float occ = (te > 0.0 && tp > te) ? 0.0 : 1.0;
      col = mix(col, vec3(1.0,0.85,0.45), smoothstep(0.006*tp, 0.002*tp, dd)*on*occ*step(0.4, fract(ang*8.0))*0.85);
    }
  }
  return vec4(col, 1.0);
}
