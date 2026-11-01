// Aerial view of the open ocean at the impact site (units: km).
// params: u_dist, u_orb, u_camh (camera height km), u_rock (0..1 incoming asteroid), u_flash (0..1),
//         u_cav (0..1 transient cavity), u_col (0..1 steam column), u_ring (ring radius km), u_wave (0..1 ring amplitude),
//         u_shake
float gT = 0.0;
float waterH(vec2 xz){
  float r = length(xz);
  float cav = u_cav*(-4.2*exp(-pow(r/9.5, 6.0)) + 1.6*exp(-pow((r-11.5)/2.6, 2.0)));
  float A = u_wave*1.4*12.0/max(u_ring, 12.0);
  float ring = A*exp(-pow((r - u_ring)/3.2, 2.0)) - 0.35*A*exp(-pow((r - u_ring + 6.0)/3.5, 2.0));
  float sw = 0.02*sin(xz.x*0.9 + gT*0.8) + 0.02*sin(xz.y*1.1 - gT*0.6) + 0.015*noise2(xz*2.0 + gT*0.2);
  return cav + ring + sw;
}
float floorH(vec2 xz){ return -4.0 + 0.15*noise2(xz*0.3); }
float h3(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float n3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z); }
vec2 map(vec3 p){
  if (u_col <= 0.0) return vec2(1e9, 0.0);
  float H = 38.0*u_col;
  float y = clamp(p.y, 0.0, H);
  float rad = 3.0 + 2.5*smoothstep(0.0, H, y) + 9.0*smoothstep(H*0.72, H, y)*u_col;
  float d = length(vec3(p.x, p.y - y, p.z)) - rad;
  d += 1.4*(n3(p*0.18 + vec3(0.0, -gT*0.25, 0.0)) - 0.5) + 0.6*(n3(p*0.5) - 0.5);
  return vec2(d*0.7, 1.0);
}
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  p += u_shake*vec2(noise2(vec2(u_time*23.0,1.0))-0.5, noise2(vec2(u_time*19.0,7.0))-0.5)*0.03;
  vec3 ro = vec3(sin(u_orb)*u_dist, u_camh, cos(u_orb)*u_dist);
  vec3 ta = vec3(0.0, 4.0 + 8.0*u_col, 0.0);
  vec3 rd = camRay(p, ro, ta, 1.25);
  vec3 hor = vec3(176.0,198.0,222.0)/255.0, top = vec3(70.0,104.0,150.0)/255.0;
  vec3 col = mix(hor, top, pow(clamp(rd.y, 0.0, 1.0), 0.5));
  vec2 cp = rd.xz/(rd.y + 0.06)*2.0;
  float cl = smoothstep(0.55, 0.85, noise2(cp*1.2)*0.65 + noise2(cp*3.0)*0.35);
  col = mix(col, vec3(0.95,0.96,0.98), cl*0.5*smoothstep(0.02, 0.2, rd.y));
  vec3 L = normalize(vec3(-0.5, 0.8, 0.4));
  // heightfield search
  float t = 0.5, hit = -1.0;
  for (int i = 0; i < 110; i++) {
    vec3 q = ro + rd*t;
    if (q.y < max(waterH(q.xz), floorH(q.xz))) { hit = t; break; }
    t += 0.25 + t*0.03;
    if (t > 420.0) break;
  }
  if (hit > 0.0) {
    float a = hit - (0.25 + hit*0.03), b = hit;
    for (int i = 0; i < 7; i++) { float m = 0.5*(a+b); vec3 q = ro + rd*m; if (q.y < max(waterH(q.xz), floorH(q.xz))) b = m; else a = m; }
    hit = b;
  }
  vec3 cm = march(ro, rd, hit > 0.0 ? hit : 400.0, 0.0);
  vec3 hazeD = hor;
  if (cm.x > 0.0) {
    vec3 pos = ro + rd*cm.x; vec3 n = calcNormal(pos);
    float hgt = pos.y/max(38.0*u_col, 1.0);
    vec3 alb = mix(vec3(0.62,0.6,0.58), vec3(0.95,0.95,0.97), smoothstep(0.1, 0.7, hgt));
    float dif = clamp(dot(n, L)*0.5 + 0.5, 0.0, 1.0);
    vec3 c = alb*(0.35 + 0.75*dif);
    c += vec3(1.0, 0.45, 0.15)*exp(-pos.y*0.25)*(0.4 + 0.6*u_flash)*0.9;
    col = mix(c, hazeD, clamp(cm.x/500.0, 0.0, 0.6));
  } else if (hit > 0.0) {
    vec3 pos = ro + rd*hit;
    bool isFloor = floorH(pos.xz) >= waterH(pos.xz);
    if (isFloor) {
      vec3 c = mix(vec3(0.35,0.28,0.22), vec3(0.5,0.42,0.32), noise2(pos.xz*2.0));
      col = c*0.85;
    } else {
      vec2 e = vec2(0.15, 0.0);
      vec3 n = normalize(vec3(waterH(pos.xz - e.xy) - waterH(pos.xz + e.xy), 0.3, waterH(pos.xz - e.yx) - waterH(pos.xz + e.yx)));
      vec3 deep = vec3(0.05, 0.22, 0.36);
      vec3 rf = reflect(rd, n);
      vec3 sky = mix(hor, top, pow(clamp(rf.y, 0.0, 1.0), 0.5));
      float fr = 0.2 + 0.6*pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
      vec3 c = mix(deep*(0.6 + 0.6*clamp(dot(n, L), 0.0, 1.0)), sky, fr);
      c += vec3(1.0, 0.95, 0.85)*pow(max(dot(rf, L), 0.0), 80.0)*0.8;
      float slope = 1.0 - n.y;
      float foam = smoothstep(0.08, 0.35, slope);
      float rr = length(pos.xz);
      foam = max(foam, u_wave*exp(-pow((rr - u_ring)/2.0, 2.0))*0.8*noise2(pos.xz*1.5 + gT));
      c = mix(c, vec3(0.92, 0.95, 0.97), clamp(foam, 0.0, 0.9));
      // inner cavity walls look darker and greener
      c = mix(c, vec3(0.04, 0.16, 0.2), u_cav*smoothstep(-0.5, -3.5, pos.y)*0.7);
      col = mix(c, hazeD, clamp((hit - 60.0)/360.0, 0.0, 0.85));
    }
    // flash light on the water
    col += vec3(1.0, 0.7, 0.4)*u_flash*1.2*exp(-length(pos.xz)*0.08);
  }
  // incoming asteroid: glowing head + trail from high in the sky
  if (u_rock > 0.0 && u_rock < 1.0) {
    vec3 A0 = vec3(-90.0, 120.0, -60.0);
    vec3 head = mix(A0, vec3(0.0), u_rock);
    vec3 tail = mix(A0, vec3(0.0), max(u_rock - 0.35, 0.0));
    vec3 ba = tail - head, w0 = ro - head;
    float B = dot(rd, ba), C = dot(ba, ba), D = dot(rd, w0), E = dot(ba, w0);
    float uu = clamp((E - B*D)/max(C - B*B, 1e-5), 0.0, 1.0);
    float sv = max(dot(rd, head + ba*uu - ro), 0.0);
    float d = length(ro + rd*sv - (head + ba*uu));
    float w = 0.012*sv*(0.3 + 0.7*(1.0 - uu));
    col += vec3(1.0, 0.75, 0.45)*smoothstep(w, 0.0, d)*(1.0 - uu)*1.5;
    col += vec3(1.0, 0.6, 0.3)*exp(-d/(0.004*sv + 0.01))*0.0;
    float dh = length(cross(rd, head - ro));
    col += vec3(1.0, 0.9, 0.7)*exp(-dh/(0.006*length(head - ro)))*1.2;
  }
  // blinding flash
  col = mix(col, vec3(1.0, 0.95, 0.85), clamp(u_flash*0.85, 0.0, 1.0)*exp(-length(p)*1.2));
  return vec4(col, 1.0);
}
