// Stylised atom on dark background. params: cam (orbit angle), zoom
float gT = 0.0;
vec2 map(vec3 p){
  vec2 r = vec2(1e9, 0.0);
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    vec3 c = 0.32 * vec3(sin(fi * 2.4), cos(fi * 1.7) * 0.9, sin(fi * 3.1 + 1.0));
    r = opU(r, vec2(sdSphere(p - c, 0.3), mod(fi, 2.0) < 0.5 ? 1.0 : 2.0));
  }
  for (int k = 0; k < 3; k++) {
    float a = float(k) * 1.0472;
    vec3 q = p; q.xy = rot(a) * q.xy; q.yz = rot(1.1) * q.yz;
    float ang = gT * (1.4 + 0.3 * float(k)) + float(k) * 2.0;
    vec3 e = vec3(cos(ang) * 2.2, 0.0, sin(ang) * 2.2);
    r = opU(r, vec2(sdSphere(q - e, 0.12), 3.0));
  }
  return r;
}
float orbitGlow(vec3 ro, vec3 rd){
  float g = 0.0;
  for (int k = 0; k < 3; k++) {
    float a = float(k) * 1.0472;
    vec3 o = ro, d = rd;
    o.xy = rot(a) * o.xy; d.xy = rot(a) * d.xy; o.yz = rot(1.1) * o.yz; d.yz = rot(1.1) * d.yz;
    float t = -o.y / d.y;
    if (t > 0.0) { vec3 h = o + d * t; float dd = abs(length(h.xz) - 2.2); g += smoothstep(0.035, 0.0, dd); }
  }
  return g;
}
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  float d = 7.5 / max(u_zoom, 0.2);
  vec3 ro = vec3(sin(u_cam) * d, 1.2, cos(u_cam) * d);
  vec3 rd = camRay(p, ro, vec3(0.0), 1.4);
  vec3 col = vec3(6.0, 8.0, 16.0) / 255.0;
  col += vec3(0.12, 0.2, 0.45) * exp(-length(p) * 2.5) * 0.6;
  col += vec3(0.45, 0.75, 1.0) * orbitGlow(ro, rd) * 0.7;
  vec3 m = march(ro, rd, 20.0, 0.0);
  if (m.x > 0.0) {
    vec3 pos = ro + rd * m.x; vec3 n = calcNormal(pos);
    vec3 alb = m.y < 1.5 ? vec3(0.92, 0.32, 0.3) : m.y < 2.5 ? vec3(0.45, 0.6, 0.95) : vec3(0.6, 0.95, 1.0);
    vec3 L = normalize(vec3(-0.5, 0.8, 0.6));
    float dif = clamp(dot(n, L), 0.0, 1.0);
    float sp = pow(clamp(dot(reflect(rd, n), L), 0.0, 1.0), 24.0);
    vec3 c = alb * (0.25 + 0.85 * dif) + sp * 0.5;
    if (m.y > 2.5) c = vec3(0.75, 1.0, 1.0);
    col = c;
  }
  return vec4(col, 1.0);
}
