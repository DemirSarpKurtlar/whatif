// 056 — Earth (radius 1) at the origin, the Moon (radius 0.273, true size ratio) on a schematic orbit of radius u_md.
// Adapted from 015 planets.glsl (Park Skyline space look).
// params: u_dist, u_orb, u_camy, u_tx, u_ty (camera) · u_md (orbit radius) · u_ma (orbit angle, rad) · u_pl (orbit-plane yaw)
//         u_ring (0..1 dashed orbit ring at u_md) · u_ghost (0..1 dashed old orbit at u_gr + ghost Moon) · u_gr
//         u_bulge (0..1 tidal water bulge toward the Moon) · u_ecl (0..1 Sun moves behind the Moon -> shadow on Earth)
//         u_umb (umbra radius on Earth, Earth radii) · u_spin (Earth rotation) · u_brake (0..1 red friction glow on the bulges)
float h3(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float n3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm3(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*n3(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=0.5; } return s; }
vec2 map(vec3 p){ return vec2(length(p)-1.0, 1.0); }
float sph(vec3 ro, vec3 rd, vec3 c, float r){ vec3 oc = ro - c; float b = dot(oc, rd), cc = dot(oc,oc) - r*r, d = b*b - cc; return d < 0.0 ? -1.0 : -b - sqrt(d); }
vec3 stars(vec3 rd){
  vec2 q = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*120.0;
  vec2 c = floor(q); vec2 f = fract(q)-0.5; float h = hash2(c);
  return vec3(h > 0.985 ? smoothstep(0.25,0.0,length(f))*(0.4+0.6*hash2(c+3.0)) : 0.0);
}
vec3 gUp = vec3(0.0,1.0,0.0), gW = vec3(0.0,0.0,1.0);
vec3 orbitPos(float r, float a){ return r*(cos(a)*gUp + sin(a)*gW); }
// dashed ring of radius r in the orbit plane; returns coverage
float ring(vec3 ro, vec3 rd, float r, float tmaxHit, float w){
  vec3 n = normalize(cross(gUp, gW));
  float dn = dot(rd, n); if (abs(dn) < 1e-4) return 0.0;
  float t = -dot(ro, n)/dn; if (t < 0.0 || t > tmaxHit) return 0.0;
  vec3 q = ro + rd*t; float rr = length(q);
  float a = atan(dot(q, gW), dot(q, gUp));
  float dash = step(0.42, fract(a*9.0/3.14159));
  return smoothstep(w*t, w*0.4*t, abs(rr - r))*dash;
}
vec3 shadeMoon(vec3 n, vec3 L){
  float cr = fbm3(n*5.0); float mare = smoothstep(0.52,0.56,fbm3(n*1.6+vec3(4.0)));
  vec3 alb = mix(vec3(0.72,0.71,0.68), vec3(0.42,0.42,0.42), mare) * (0.8 + 0.35*cr);
  return alb*(0.04 + 1.05*clamp(dot(n,L),0.0,1.0));
}
vec4 pixel(vec2 uv){
  gW = normalize(vec3(sin(u_pl), 0.0, cos(u_pl)));
  vec2 p = screenP(uv, 0.0);
  vec3 ro = vec3(sin(u_orb)*u_dist + u_tx, u_camy + u_ty, cos(u_orb)*u_dist);
  vec3 rd = camRay(p, ro, vec3(u_tx, u_ty, 0.0), 1.6);
  vec3 col = vec3(5.0,6.0,12.0)/255.0 + stars(rd);
  vec3 MC = orbitPos(u_md, u_ma);
  vec3 L = normalize(mix(normalize(vec3(-0.8,0.35,0.6)), normalize(MC), u_ecl));
  float te = sph(ro, rd, vec3(0.0), 1.0);
  float tm = sph(ro, rd, MC, 0.273);
  vec3 GC = orbitPos(u_gr, u_ma);
  float tg = u_ghost > 0.0 ? sph(ro, rd, GC, 0.273) : -1.0;
  float tHit = 1e9; if (te > 0.0) tHit = te; if (tm > 0.0) tHit = min(tHit, tm);
  if (tm > 0.0 && (te < 0.0 || tm < te)) {
    col = shadeMoon(normalize(ro + rd*tm - MC), L);
  } else if (te > 0.0) {
    vec3 pos = ro + rd*te; vec3 n = normalize(pos); vec3 q = n; q.xz = rot(u_spin)*q.xz;
    float land = fbm3(q*2.2+vec3(3.0,1.0,7.0)) + 0.06*(n3(q*24.0)-0.5);
    float isL = smoothstep(0.5,0.505,land);
    vec3 alb = mix(mix(vec3(34.0,82.0,150.0), vec3(58.0,120.0,186.0), smoothstep(0.35,0.5,land))/255.0,
                   mix(vec3(86.0,140.0,58.0), vec3(185.0,166.0,106.0), smoothstep(0.55,0.7,land))/255.0, isL);
    alb = mix(alb, vec3(0.94), smoothstep(0.86,0.9,abs(q.y)+0.08*(n3(q*9.0)-0.5)));
    vec3 cq = q; cq.xz = rot(u_time*0.01)*cq.xz;
    float cl = smoothstep(0.52,0.7,fbm3(cq*3.0+vec3(11.0,2.0,5.0)));
    alb = mix(alb, vec3(0.97), cl*0.85*(1.0 - 0.6*u_bulge));
    // tidal bulges: ocean water piles up toward (and away from) the Moon
    vec3 mdir = normalize(MC);
    float c2 = dot(n, mdir); float bul = clamp(1.5*c2*c2 - 0.5, -0.5, 1.0);
    float wat = (1.0 - isL);
    vec3 bulCol = vec3(0.30,0.62,0.95);
    alb = mix(alb, bulCol, u_bulge*smoothstep(0.35, 0.9, bul)*0.75);
    alb = mix(alb, alb*0.75, u_bulge*smoothstep(-0.1, -0.45, bul)*wat);
    float dif = clamp(dot(n,L),0.0,1.0);
    // Moon's shadow (eclipse): umbra core + soft penumbra, cast along -L from the Moon
    vec3 rel = pos - MC; float along = dot(rel, -L);
    float perp = length(rel + L*along);
    float shd = 0.0;
    if (along > 0.0 && u_ecl > 0.0) {
      shd = max(smoothstep(u_umb*1.08, u_umb*0.92, perp), 0.55*smoothstep(u_umb*3.2, u_umb, perp));
      shd *= smoothstep(0.6, 1.0, u_ecl);
    }
    vec3 c = pow(lin(alb)*(dif*1.3*(1.0 - 0.94*shd)+0.06), vec3(0.4545));
    float rim = pow(1.0-clamp(dot(n,-rd),0.0,1.0), 2.5);
    col = mix(c, vec3(0.55,0.75,1.0)*(0.3+0.9*dif), rim*0.6);
    // friction glow where the bulges are dragged ahead of the Moon by Earth's spin
    col += vec3(1.0,0.35,0.2)*u_brake*smoothstep(0.55, 0.95, bul)*(0.35 + 0.25*sin(u_time*5.0));
    if (u_ecl > 0.6) col = mix(col, vec3(0.02), 0.0);
  }
  // ghost Moon at the old distance
  if (tg > 0.0 && tg < tHit) {
    vec3 gn = normalize(ro + rd*tg - GC);
    col = mix(col, shadeMoon(gn, L)*0.6 + vec3(0.1,0.12,0.18), 0.45*u_ghost);
  }
  // atmosphere halo, stretched by the tidal bulge
  float b = dot(ro, rd); vec3 cp = ro + rd*max(-b, 0.0); float hgt = length(cp) - 1.0;
  if (hgt > 0.0 && (tm < 0.0 || length(cp - ro) < tm)) {
    vec3 mdir = normalize(MC); float c2 = dot(normalize(cp), mdir);
    float bh = u_bulge*0.13*clamp(1.5*c2*c2 - 0.5, 0.0, 1.0);
    col += vec3(0.45,0.7,1.0)*exp(-hgt*28.0)*0.85;
    col += vec3(0.30,0.62,1.0)*smoothstep(bh, bh*0.6, hgt)*step(0.001, bh)*0.75;
  }
  // orbit rings
  col = mix(col, vec3(1.0,0.85,0.45), ring(ro, rd, u_md, tHit, 0.0035)*u_ring*0.85);
  col = mix(col, vec3(0.75,0.8,0.95), ring(ro, rd, u_gr, tHit, 0.0025)*u_ghost*0.55);
  // sunlight glare during the eclipse beat
  return vec4(col, 1.0);
}
