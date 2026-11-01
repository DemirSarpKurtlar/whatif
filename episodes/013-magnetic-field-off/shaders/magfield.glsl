// Earth from space with its magnetic shield. params:
// u_dist u_orb u_camy u_spin u_tx u_ty (camera), u_field (0..1 field lines), u_wind (0..1 solar wind from the left),
// u_aurora (0..1), u_spread (0 polar ovals .. 1 aurora reaches the equator), u_sats (0..1 satellites, sparks when unshielded),
// u_strip (0..1 atmosphere blown into a tail), u_mars (0..1 planet becomes Mars-like), u_core (0..1 cutaway glow of the core)
float h3(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float n3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm3(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*n3(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=0.5; } return s; }
vec2 map(vec3 p){ return vec2(length(p)-1.0, 1.0); }
vec3 stars(vec3 rd){
  vec2 q = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*120.0;
  vec2 c = floor(q); vec2 f = fract(q)-0.5; float h = hash2(c);
  return vec3(h > 0.985 ? smoothstep(0.25,0.0,length(f))*(0.4+0.6*hash2(c+3.0)) : 0.0);
}
vec4 pixel(vec2 uv){
  vec2 p = screenP(uv, 0.0);
  vec3 ro = vec3(sin(u_orb)*u_dist, u_camy, cos(u_orb)*u_dist);
  vec3 ta = vec3(u_tx, u_ty, 0.0);
  vec3 rd = camRay(p, ro, ta, 1.6);
  vec3 ww = normalize(ta - ro); vec3 rt = normalize(cross(ww, vec3(0.0,1.0,0.0)));
  vec3 col = vec3(4.0,5.0,11.0)/255.0 + stars(rd);
  // sun is to the screen-left
  vec3 L = normalize(-rt*0.9 + ww*-0.3 + vec3(0.0,0.25,0.0));
  float b = dot(ro, rd), c = dot(ro,ro)-1.0, disc = b*b-c;
  // plane through the origin facing the camera
  float tpl = -dot(ro, ww)/dot(rd, ww);
  vec3 X = ro + rd*tpl;
  float u = dot(X, rt), v = X.y;
  float r = length(vec2(u, v));
  // solar wind streaks from the left
  if (u_wind > 0.0) {
    float s = smoothstep(0.72, 1.0, noise2(vec2(u*1.5 - u_time*4.5, v*30.0)))*(0.35 + 0.65*smoothstep(0.35,0.9,noise2(vec2(u*0.4 - u_time*1.2, v*3.0))));
    float block = mix(smoothstep(2.4, 3.4, r + 0.9*max(u,0.0)), smoothstep(0.98, 1.08, r), 1.0 - u_field);
    // behind the shield the wind flows around
    col += vec3(1.0,0.72,0.35)*s*u_wind*block*2.2*smoothstep(-9.0,-1.0,u);
  }
  // field lines (dipole r = L sin^2(theta)), compressed on the sun side
  if (u_field > 0.0 && r > 1.0) {
    float rr = r*(u < 0.0 ? 1.25 : 0.85);
    float st = abs(u)/max(r, 1e-4);
    float Lv = rr/max(st*st, 1e-3);
    float f = fract(log(Lv)*3.2 - u_time*0.08);
    float line = smoothstep(0.07, 0.0, abs(f - 0.5) - 0.42)*smoothstep(9.0, 2.0, Lv)*smoothstep(1.0, 1.15, Lv);
    col += vec3(0.35,0.65,1.0)*line*u_field*0.55;
    col += vec3(0.2,0.4,0.9)*exp(-max(rr-1.0,0.0)*0.9)*0.12*u_field;
  }
  if (disc > 0.0) {
    float t = -b - sqrt(disc);
    vec3 pos = ro + rd*t; vec3 n = normalize(pos);
    vec3 q = n; q.xz = rot(u_spin)*q.xz;
    float land = fbm3(q*2.2+vec3(3.0,1.0,7.0)) + 0.06*(n3(q*24.0)-0.5);
    float isL = smoothstep(0.5,0.505,land);
    vec3 alb = mix(vec3(0.15,0.33,0.6), vec3(0.34,0.55,0.24), isL);
    alb = mix(alb, vec3(0.93), smoothstep(0.86,0.9,abs(q.y)));
    vec3 marsC = mix(vec3(0.62,0.3,0.16), vec3(0.78,0.48,0.3), land);
    alb = mix(alb, marsC, u_mars);
    vec3 cq = q; cq.xz = rot(u_time*0.01)*cq.xz;
    float cl = smoothstep(0.55,0.72,fbm3(cq*3.0+vec3(11.0,2.0,5.0)))*(1.0-u_mars);
    alb = mix(alb, vec3(0.97), cl*0.8);
    float dif = clamp(dot(n,L),0.0,1.0);
    vec3 e = alb*(0.04 + 1.1*dif);
    // night-side city lights
    float cityN = smoothstep(0.72, 0.9, n3(q*40.0))*isL*smoothstep(0.1, -0.15, dot(n,L))*(1.0-u_mars);
    e += vec3(1.0,0.75,0.4)*cityN*0.5;
    // aurora ovals
    if (u_aurora > 0.0) {
      float latc = mix(0.9, 0.12, u_spread), w = mix(0.05, 0.55, u_spread);
      float band = exp(-pow((abs(q.y) - latc)/w, 2.0));
      float curtain = 0.5 + 0.5*n3(vec3(atan(q.z,q.x)*8.0, q.y*6.0, u_time*0.6));
      e += mix(vec3(0.2,1.0,0.5), vec3(0.8,0.3,1.0), smoothstep(0.4,0.9,curtain))*band*curtain*u_aurora*(0.4 + 0.8*smoothstep(0.2,-0.2,dot(n,L)));
    }
    float rim = pow(1.0-clamp(dot(n,-rd),0.0,1.0), 2.5);
    e = mix(e, mix(vec3(0.55,0.75,1.0), vec3(0.9,0.6,0.45), u_mars)*(0.25+0.9*dif), rim*0.55*(1.0-0.7*u_mars));
    col = e;
  }
  // atmosphere halo and tail
  vec3 cp = ro + rd*max(-b, 0.0); float hgt = length(cp) - 1.0;
  float halo = exp(-max(hgt,0.0)*26.0)*smoothstep(-0.02,0.0,hgt)*(disc > 0.0 ? 0.0 : 1.0);
  col += mix(vec3(0.45,0.7,1.0), vec3(0.9,0.6,0.45), u_mars)*halo*0.8*(1.0-0.75*u_mars);
  if (u_strip > 0.0 && r > 1.0 && u > 0.0) {
    float tail = exp(-abs(v)*mix(5.0, 2.2, smoothstep(0.0, 6.0, u))/(0.6+0.2*u))*exp(-(r-1.0)*0.45);
    float wisps = 0.5 + 0.5*noise2(vec2(u*2.0 - u_time*1.5, v*14.0));
    col += vec3(0.45,0.7,1.0)*tail*wisps*u_strip*0.6;
  }
  // satellites (with faint orbit rings)
  if (u_sats > 0.0) {
    for (int i = 0; i < 10; i++) {
      float fi = float(i);
      float rad = 1.2 + 0.09*fi;
      float sq = 0.25 + 0.07*fi;
      float a = u_time*(0.35 + 0.04*fi) + fi*1.9;
      vec2 sp = vec2(cos(a)*rad, sin(a)*rad*sq);
      bool behind = sin(a) > 0.0 && length(sp) < 1.0;
      vec2 e = vec2(u/rad, v/(rad*sq));
      float ring = smoothstep(0.012, 0.0, abs(length(e) - 1.0))*0.12*u_sats;
      if (!(length(vec2(u,v)) < 1.0 && e.y > 0.0)) col += vec3(0.6,0.75,1.0)*ring;
      if (behind) continue;
      float d = length(vec2(u, v) - sp);
      float hit = (1.0 - u_field)*step(0.6, fract(u_time*1.7 + fi*0.37));
      vec3 sc = mix(vec3(0.9,0.95,1.0), vec3(1.0,0.35,0.2), hit);
      col += sc*(smoothstep(0.04, 0.0, d)*1.4 + exp(-d*30.0)*(0.3 + hit*1.2))*u_sats;
    }
  }
  return vec4(col, 1.0);
}
