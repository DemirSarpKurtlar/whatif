// Earth with a quarter cut away to show its layers, a pole-to-pole tunnel and a falling dot.
// params: u_dist, u_orb (camera azimuth), u_camy, u_cut (0..1 cut opens), u_pos (dot along axis, 1 = north pole, -1 = south),
//         u_line (0..1 tunnel line reveal), u_spin, u_zoomy (look-at y)
float h3(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float n3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm3(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*n3(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=0.5; } return s; }
vec2 map(vec3 p){ return vec2(length(p)-1.0, 1.0); }
vec3 layer(float r, vec3 q){
  float n = n3(q*12.0)*0.08;
  if (r < 0.19) return vec3(1.0,0.95,0.75)+n;
  if (r < 0.55) return mix(vec3(1.0,0.62,0.18), vec3(1.0,0.8,0.35), (0.55-r)/0.36)+n;
  if (r < 0.985) return mix(vec3(0.95,0.42,0.12), vec3(0.62,0.24,0.12), (r-0.55)/0.435)+n;
  return vec3(0.45,0.38,0.3);
}
bool inCut(vec3 p){ return u_cut > 0.0 && p.x > 0.0 && p.z > 0.0; }
float segD(vec3 ro, vec3 rd, vec3 a, vec3 b, out float uu, out float sv){
  vec3 ba=b-a, w0=ro-a; float B=dot(rd,ba), C=dot(ba,ba), D=dot(rd,w0), E=dot(ba,w0);
  uu=clamp((E-B*D)/max(C-B*B,1e-5),0.0,1.0); sv=max(dot(rd,a+ba*uu-ro),0.0);
  return length(ro+rd*sv-(a+ba*uu));
}
vec3 stars(vec3 rd){
  vec2 q = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*120.0;
  vec2 c = floor(q); vec2 f = fract(q)-0.5; float h = hash2(c);
  return vec3(h > 0.985 ? smoothstep(0.25,0.0,length(f))*(0.4+0.6*hash2(c+3.0)) : 0.0);
}
vec4 pixel(vec2 uv){
  vec2 p = screenP(uv, 0.0);
  vec3 ro = vec3(sin(u_orb)*u_dist, u_camy, cos(u_orb)*u_dist);
  vec3 rd = camRay(p, ro, vec3(0.0, u_zoomy, 0.0), 1.6);
  vec3 col = vec3(5.0,6.0,12.0)/255.0 + stars(rd);
  vec3 L = normalize(vec3(0.6,0.5,0.8));
  float b = dot(ro, rd), c = dot(ro,ro)-1.0, disc = b*b-c;
  float tHit = 1e9; vec3 hitCol = vec3(0.0);
  if (disc > 0.0) {
    float s = sqrt(disc);
    float t0 = -b - s, t1 = -b + s;
    vec3 p0 = ro + rd*t0;
    if (!inCut(p0)) {
      tHit = t0;
      vec3 n = normalize(p0); vec3 q = n; q.xz = rot(u_spin)*q.xz;
      float land = fbm3(q*2.2+vec3(3.0,1.0,7.0));
      float isL = smoothstep(0.5,0.505,land);
      vec3 alb = mix(vec3(0.16,0.36,0.64), vec3(0.36,0.56,0.24), isL);
      alb = mix(alb, vec3(0.94), smoothstep(0.86,0.9,abs(q.y)));
      float cl = smoothstep(0.55,0.72,fbm3(q*3.0+vec3(11.0,2.0,5.0)));
      alb = mix(alb, vec3(0.97), cl*0.8);
      float dif = clamp(dot(n,L),0.0,1.0);
      hitCol = alb*(0.25+0.95*dif);
      float rim = pow(1.0-clamp(dot(n,-rd),0.0,1.0), 2.5);
      hitCol = mix(hitCol, vec3(0.55,0.75,1.0), rim*0.5);
    } else {
      // cut planes x=0 (z>0) and z=0 (x>0), inside sphere
      float best = 1e9; vec3 bp = vec3(0.0); float bn = 0.0;
      if (abs(rd.x) > 1e-5) { float tp = -ro.x/rd.x; vec3 h = ro+rd*tp; if (tp > t0 && tp < t1 && h.z > 0.0 && tp < best) { best = tp; bp = h; bn = 0.0; } }
      if (abs(rd.z) > 1e-5) { float tp = -ro.z/rd.z; vec3 h = ro+rd*tp; if (tp > t0 && tp < t1 && h.x > 0.0 && tp < best) { best = tp; bp = h; bn = 1.0; } }
      if (best < 1e8) {
        tHit = best;
        float r = length(bp);
        vec3 lc = layer(r, bp);
        float shadeF = bn < 0.5 ? 0.92 : 0.75;
        hitCol = lc*shadeF;
        // layer boundary lines
        float e = min(min(abs(r-0.19), abs(r-0.55)), abs(r-0.985));
        hitCol = mix(hitCol, hitCol*0.6, smoothstep(0.006,0.0,e));
      } else {
        // looking through the cut to the back hemisphere interior surface
        vec3 p1 = ro + rd*t1; tHit = t1; hitCol = vec3(0.3,0.12,0.06);
      }
    }
    col = hitCol;
  }
  // atmosphere halo
  float tmin = -b; vec3 cp = ro + rd*max(tmin,0.0); float hgt = length(cp)-1.0;
  if (disc <= 0.0 || hgt > 0.0) col += vec3(0.45,0.7,1.0)*exp(-max(hgt,0.0)*28.0)*0.8*smoothstep(-0.02,0.0,hgt);
  // tunnel line along the axis (drawn on top, dashed)
  if (u_line > 0.0) {
    float uu, sv;
    float top = 1.08, bot = 1.08 - 2.16*u_line;
    float d = segD(ro, rd, vec3(0.0,top,0.0), vec3(0.0,bot,0.0), uu, sv);
    float w = 0.0045*sv;
    float dash = step(0.35, fract((top - (top-bot)*uu)*14.0));
    col = mix(col, vec3(1.0), smoothstep(w, w*0.35, d)*mix(0.55, 1.0, dash));
  }
  // falling dot
  if (u_pos > -2.0) {
    vec3 P = vec3(0.0, u_pos, 0.0);
    float uu, sv; float d = segD(ro, rd, P, P+vec3(0.0,1e-4,0.0), uu, sv);
    float s = 0.018*sv/3.0 + 0.01;
    col = mix(col, vec3(1.0,0.85,0.3), smoothstep(s, s*0.5, d));
    col += vec3(1.0,0.75,0.3)*exp(-d*55.0)*0.6;
  }
  return vec4(col, 1.0);
}
