float h3(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float n3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm3(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*n3(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=0.5; } return s; }
vec2 map(vec3 p){ return vec2(length(p)-1.0, 1.0); }
vec3 stars(vec3 rd){
  vec2 q = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*120.0;
  vec2 c = floor(q); vec2 f = fract(q)-0.5;
  float h = hash2(c);
  float s = h > 0.985 ? smoothstep(0.25,0.0,length(f))*(0.4+0.6*hash2(c+3.0)) : 0.0;
  return vec3(s);
}
float segD(vec3 ro, vec3 rd, vec3 a, vec3 b, out float uu, out float ss){
  vec3 ba=b-a, w0=ro-a; float B=dot(rd,ba), C=dot(ba,ba), D=dot(rd,w0), E=dot(ba,w0);
  uu=clamp((E-B*D)/max(C-B*B,1e-5),0.0,1.0); ss=max(dot(rd,a+ba*uu-ro),0.0);
  return length(ro+rd*ss-(a+ba*uu));
}
vec4 pixel(vec2 uv){
  vec2 p = screenP(uv, 0.0);
  float sh = u_shake;
  p += sh*vec2(noise2(vec2(u_time*25.0,1.0))-0.5, noise2(vec2(u_time*21.0,5.0))-0.5)*0.02;
  float dist = u_dist;
  float ang = u_orb;
  vec3 ro = vec3(sin(ang)*dist, 0.35*dist*0.25+u_camy, cos(ang)*dist);
  vec3 ta = vec3(u_tx, u_ty, 0.0);
  vec3 rd = camRay(p, ro, ta, 1.6);
  vec3 col = vec3(5.0,6.0,12.0)/255.0 + stars(rd);
  vec3 L = normalize(normalize(ro) * 0.9 + vec3(-0.8,0.45,0.3));
  float sunGlow = pow(max(dot(rd,L),0.0), 400.0)*u_sun*3.0 + pow(max(dot(rd,L),0.0), 12.0)*u_sun*0.25;
  col += vec3(1.0,0.85,0.6)*sunGlow;
  float b = dot(ro, rd), c = dot(ro,ro)-1.0, disc = b*b-c;
  float tmin = -b;
  vec3 cp = ro + rd*max(tmin,0.0);
  float hgt = length(cp)-1.0;
  float spin = u_spin;
  if (disc > 0.0) {
    float t = -b - sqrt(disc);
    vec3 pos = ro + rd*t;
    vec3 n = normalize(pos);
    vec3 q = n; q.xz = rot(spin)*q.xz;
    float lat = q.y;
    float land = fbm3(q*2.2+vec3(3.0,1.0,7.0)) + 0.06*(n3(q*24.0)-0.5);
    vec3 alb;
    float thr = 0.5 + 0.035*u_sea;
    float isLand = smoothstep(thr,thr+0.005,land);
    float flooded = smoothstep(0.5,0.505,land)*(1.0-isLand);
    vec3 ocean = mix(vec3(34.0,82.0,150.0), vec3(58.0,120.0,186.0), smoothstep(0.35,0.5,land))/255.0;
    vec3 grn = mix(vec3(86.0,140.0,58.0), vec3(185.0,166.0,106.0), smoothstep(0.55,0.7,land)+0.3*smoothstep(0.1,0.35,abs(lat)-0.1)*0.0)/255.0;
    alb = mix(ocean, grn, isLand);
    alb = mix(alb, vec3(70.0,150.0,190.0)/255.0, flooded);
    float capT = mix(1.1, 0.8, u_ice);
    float capN = abs(lat) + 0.1*(n3(q*7.0)-0.5) + (lat > 0.0 ? 0.0 : 0.04);
    float gl = smoothstep(0.11, 0.07, length(q - normalize(vec3(-0.35, 0.82, 0.45)))) * u_ice;
    float iceAmt = max(smoothstep(capT, capT + 0.02, capN), gl);
    alb = mix(alb, mix(vec3(0.86,0.9,0.96), vec3(0.97,0.98,1.0), n3(q*18.0)), iceAmt);
    vec3 cq = q; cq.xz = rot(u_time*0.01)*cq.xz;
    float cl = smoothstep(0.52,0.7,fbm3(cq*3.0+vec3(11.0,2.0,5.0)));
    alb = mix(alb, vec3(0.97), cl*0.85);
    float dif = clamp(dot(n,L),0.0,1.0);
    vec3 lc = lin(alb)*(dif*1.3 + 0.06);
    float spec = pow(clamp(dot(reflect(rd,n),L),0.0,1.0),40.0)*(1.0-isLand)*(1.0-cl)*0.6;
    lc += vec3(spec);
    vec3 ec = pow(lc, vec3(0.4545));
    float rim = pow(1.0-clamp(dot(n,-rd),0.0,1.0), 2.5);
    ec = mix(ec, vec3(0.55,0.75,1.0)*(0.3+0.9*dif), rim*0.6);
    if (u_quake > 0.0) {
      vec2 g = vec2(atan(q.z,q.x), asin(q.y))*vec2(9.0,9.0);
      vec2 gc = floor(g); vec2 gf = fract(g)-0.5;
      float hq = hash2(gc);
      if (hq > 0.55 && isLand > 0.5) {
        float ph = fract(u_time*0.9 + hq*7.0);
        float ring = smoothstep(0.06,0.0,abs(length(gf)-ph*0.45))*(1.0-ph);
        float dot0 = smoothstep(0.12,0.04,length(gf));
        ec = mix(ec, vec3(1.0,0.29,0.22), clamp((ring*0.9+dot0)*u_quake,0.0,1.0));
      }
      ec += vec3(0.25,0.03,0.0)*u_quake*0.25*(0.5+0.5*sin(u_time*9.0));
    }
    if (u_coast > 0.0) {
      vec2 g = vec2(atan(q.z,q.x), asin(q.y))*vec2(28.0,28.0);
      vec2 gc = floor(g); vec2 gf = fract(g)-0.5;
      float near = smoothstep(0.05, 0.0, abs(land - 0.5));
      float dotc = smoothstep(0.32, 0.08, length(gf)) * step(0.35, hash2(gc)) * near;
      ec = mix(ec, vec3(1.0, 0.7, 0.3), dotc * u_coast); ec += vec3(1.0,0.5,0.15)*near*0.25*u_coast;
    }
    if (u_current > 0.0) {
      vec3 V = normalize(ro);
      vec3 N = normalize(cross(V, normalize(vec3(-0.7, 1.0, 0.0))));
      vec3 A = V; vec3 B = cross(N, A);
      float dpl = dot(n, N);
      float phi = atan(dot(n,B), dot(n,A));
      float seg = smoothstep(-1.0, -0.7, phi) * smoothstep(1.0, 0.7, phi);
      float band = smoothstep(0.035, 0.018, abs(dpl - 0.25)) * seg;
      float dash = 0.45 + 0.55 * smoothstep(0.3, 0.0, abs(fract(phi*4.0 - u_flow) - 0.5) - 0.12);
      vec3 cc = mix(vec3(0.35, 0.65, 1.0), vec3(1.0, 0.36, 0.22), smoothstep(-0.8, 0.8, phi));
      ec = mix(ec, cc * dash, band * u_current * 0.9);
    }
    col = ec;
  }
  float hh = max(hgt, 0.0);
  float atm = exp(-hh*28.0)*smoothstep(-0.02,0.0,hgt);
  if (disc > 0.0) atm *= 0.0;
  vec3 ac = vec3(0.45,0.7,1.0)*atm*0.9;
  if (u_leak > 0.0 && hgt > 0.0) {
    vec3 dir = normalize(cp);
    float a2 = atan(dir.y, dir.x + dir.z*0.3);
    float streak = 0.5+0.5*n3(vec3(a2*14.0, hh*3.0 - u_time*0.6, 1.0));
    float plume = exp(-hh*mix(28.0,3.0,u_leak))*streak*u_leak;
    ac += vec3(0.5,0.75,1.0)*plume*0.9;
  }
  col += ac;
  if (u_sun > 1.0) {
    vec3 C = vec3(-60.0, 0.0, -20.0); float R = length(C);
    if (abs(rd.y) > 1e-4) {
      float tp = -ro.y/rd.y;
      if (tp > 0.0) {
        vec3 X = ro + rd*tp;
        float dd = abs(length(X.xz-C.xz)-R);
        float w = 0.004*tp;
        float occ = (disc > 0.0 && tp > (-b - sqrt(max(disc,0.0)))) ? 0.0 : 1.0;
        col = mix(col, vec3(1.0,0.85,0.45), smoothstep(w, w*0.3, dd)*0.8*occ);
      }
    }
  }
  if (u_diag > 0.0) {
    vec3 P0 = normalize(vec3(-0.25,1.0,0.35))*1.002;
    vec3 T = normalize(cross(P0, vec3(0.0,0.0,1.0)))*-1.0;
    float uu, ss;
    float d = segD(ro, rd, P0, P0+T*2.2*u_diag, uu, ss);
    float w = 0.006*ss;
    float dash = step(0.45, fract(uu*2.2*u_diag*9.0 - u_time*1.5));
    float vis = (disc > 0.0 && ss > (-b - sqrt(max(disc,0.0)))+0.01) ? 0.0 : 1.0;
    col = mix(col, vec3(1.0), smoothstep(w, w*0.4, d)*dash*vis*0.95);
    float dd = segD(ro, rd, P0, P0+T*0.0001, uu, ss);
    float pulse = 0.5+0.5*sin(u_time*6.0);
    col = mix(col, vec3(1.0,0.82,0.25), smoothstep(0.03*ss/3.0+0.01, 0.0, dd)*u_diag);
    col += vec3(1.0,0.8,0.3)*exp(-dd*60.0)*0.4*pulse*u_diag;
  }
  return vec4(col, 1.0);
}
