// Orchard meadow. params: u_cam (dolly), u_yaw, u_pitch, u_low (0 eye level .. 1 near the flowers),
// u_bugs (bees/butterflies 0..1), u_fruit (fruit on trees 0..1), u_birds (0..1), u_litter (dead leaves/dung 0..1), u_grey (0..1 drained colour)
float gT = 0.0;
vec2 trees(vec3 p){
  vec3 q = p; q.z += 16.0;
  float bt = max(abs(q.z) - 9.0, q.y - 5.5);
  if (bt > 0.5) return vec2(bt, 0.0);
  vec2 cs = vec2(5.0, 6.0);
  vec2 cid = floor(vec2((q.x + 2.5) / cs.x, (q.z + 3.0) / cs.y));
  vec3 l = vec3(mod(q.x + 2.5, cs.x) - 2.5, q.y, mod(q.z + 3.0, cs.y) - 3.0);
  l.xz += (vec2(hash2(cid), hash2(cid + 5.0)) - 0.5) * 1.2;
  float s = 0.8 + 0.35 * hash2(cid + 2.0);
  float can = sdEllipsoid(l - vec3(0.0, 2.3 * s, 0.0), vec3(1.5, 1.2, 1.5) * s);
  float tr = sdCylinder(l - vec3(0.0, 0.7, 0.0), 0.7, 0.14);
  return opU(vec2(can * 0.9, 2.0), vec2(tr, 3.0));
}
vec2 map(vec3 p){ return trees(p); }
vec3 bugCol(float k){ return k < 0.6 ? vec3(0.98, 0.78, 0.15) : k < 0.8 ? vec3(0.95, 0.55, 0.2) : vec3(0.55, 0.75, 1.0); }
vec4 pixel(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  float h = mix(1.6, 0.45, u_low);
  vec3 ro = vec3(0.4 * sin(u_time * 0.2), h, 6.0 - 2.5 * u_cam);
  vec3 ta = ro + vec3(sin(u_yaw), -0.12 + u_pitch - 0.15 * u_low, -cos(u_yaw));
  vec3 rd = camRay(p, ro, ta, 1.15);
  vec3 hor = vec3(190.0, 212.0, 230.0) / 255.0, top = vec3(88.0, 128.0, 176.0) / 255.0;
  vec3 col = mix(hor, top, pow(clamp(rd.y, 0.0, 1.0), 0.6));
  vec2 cp = rd.xz / (rd.y + 0.08) * 2.0;
  float cl = smoothstep(0.55, 0.85, noise2(cp * 1.2 + vec2(u_time * 0.02, 0.0)) * 0.6 + noise2(cp * 3.0) * 0.4);
  col = mix(col, vec3(0.96), cl * 0.5 * smoothstep(0.02, 0.25, rd.y));
  // distant hills
  float az = atan(rd.x, -rd.z);
  float hill = 0.03 + 0.025 * sin(az * 3.0 + 1.0) + 0.015 * noise2(vec2(az * 8.0, 1.0));
  if (rd.y < hill && rd.y > -0.02) col = mix(vec3(0.42, 0.55, 0.38), hor, 0.45);
  vec3 L = normalize(vec3(-0.5, 0.9, 0.4));
  float tg = rd.y < 0.0 ? -ro.y / rd.y : 1e9;
  vec3 m = march(ro, rd, min(tg, 45.0), 0.0);
  if (m.x > 0.0) {
    vec3 pos = ro + rd * m.x; vec3 n = calcNormal(pos);
    vec3 alb = m.y < 2.5 ? mix(vec3(70.0, 120.0, 50.0), vec3(95.0, 145.0, 60.0), noise2(pos.xz * 0.9)) / 255.0 : vec3(95.0, 72.0, 52.0) / 255.0;
    if (m.y < 2.5) {
      n = facet(n, 4.0);
      // fruit / blossoms: red dots on the canopy
      vec3 fp = pos * 3.2; vec3 fc = floor(fp); vec3 ff = fract(fp) - 0.5;
      float fh = hash2(fc.xy + fc.z * 7.0);
      float dot0 = smoothstep(0.32, 0.2, length(ff)) * step(1.0 - 0.28 * u_fruit, fh);
      alb = mix(alb, vec3(0.85, 0.14, 0.12), dot0);
    }
    float sh = mix(0.5, 1.0, softShadow(pos + n * 0.02, L, 8.0));
    col = lin(alb) * (clamp(dot(n, L), 0.0, 1.0) * 1.2 * sh + lin(vec3(0.6, 0.7, 0.85)) * 0.55);
    col = pow(col, vec3(0.4545));
    col = mix(col, hor, clamp((m.x - 10.0) / 50.0, 0.0, 0.6));
  } else if (tg < 1e8) {
    vec3 pos = ro + rd * tg;
    vec3 g = mix(vec3(72.0, 112.0, 46.0), vec3(110.0, 142.0, 64.0), noise2(pos.xz * 0.5)) / 255.0;
    float bl = noise2(pos.xz * vec2(18.0, 46.0)) * noise2(pos.xz * vec2(37.0, 11.0) + 3.0);
    g *= 0.8 + 0.5 * bl * smoothstep(20.0, 2.0, tg);
    // flowers
    vec2 c = floor(pos.xz * 3.0); vec2 f = fract(pos.xz * 3.0) - 0.5;
    float hf = hash2(c);
    float fl = smoothstep(0.2, 0.09, length(f + (vec2(hash2(c + 3.0), hash2(c + 7.0)) - 0.5) * 0.5)) * step(0.72, hf);
    vec3 fcol = hf > 0.93 ? vec3(0.98, 0.85, 0.2) : hf > 0.86 ? vec3(0.96, 0.45, 0.62) : hf > 0.79 ? vec3(0.65, 0.45, 0.9) : vec3(0.98, 0.97, 0.94);
    g = mix(g, fcol, fl * smoothstep(25.0, 3.0, tg));
    // dead leaves and debris piling up
    float lit = smoothstep(1.0 - u_litter, 1.0 - u_litter + 0.25, noise2(pos.xz * 1.3) * 0.7 + noise2(pos.xz * 6.0) * 0.3);
    vec3 leaf = mix(vec3(120.0, 82.0, 40.0), vec3(80.0, 58.0, 36.0), noise2(pos.xz * 9.0)) / 255.0;
    g = mix(g, leaf, lit * 0.95);
    col = lin(g) * (1.05 + 0.0) + lin(vec3(0.55, 0.65, 0.8)) * 0.18;
    col = pow(col, vec3(0.4545));
    col = mix(col, hor, clamp((tg - 12.0) / 40.0, 0.0, 0.7));
  }
  // bees and butterflies as soft 3D points near the camera
  if (u_bugs > 0.0) {
    for (int i = 0; i < 26; i++) {
      float fi = float(i);
      if (hash2(vec2(fi, 3.0)) > u_bugs * 1.05) continue;
      vec3 b = vec3((hash2(vec2(fi, 1.0)) - 0.5) * 3.4 + 0.8 * sin(gT * (1.3 + hash2(vec2(fi, 9.0))) + fi),
                    ro.y - 0.5 + 1.1 * hash2(vec2(fi, 2.0)) + 0.18 * sin(gT * 3.1 + fi * 2.0),
                    ro.z - 1.6 - 3.6 * hash2(vec2(fi, 4.0)) + 0.6 * cos(gT * 1.1 + fi));
      vec3 ob = b - ro; float t = dot(ob, rd); if (t < 0.2) continue;
      float d = length(ob - rd * t);
      float r = 0.055 * (1.0 + 0.5 * hash2(vec2(fi, 6.0)));
      float k = hash2(vec2(fi, 8.0));
      float wing = 0.5 + 0.5 * sin(gT * 40.0 + fi);
      vec3 bc = bugCol(k);
      float body = smoothstep(r, r * 0.6, d);
      vec3 lp = ob - rd * t; float stripe = step(0.5, fract((lp.x + lp.y) / r * 1.3));
      vec3 bb = k < 0.6 ? mix(bc, vec3(0.08), stripe * 0.8) : bc;
      col = mix(col, bb * (0.8 + 0.2 * wing), body);
      col = mix(col, vec3(0.92, 0.95, 1.0), smoothstep(r * 1.9, r * 1.2, d) * (1.0 - body) * 0.35 * wing);
      col += vec3(1.0, 0.95, 0.8) * smoothstep(r * 2.4, r, d) * 0.15 * wing;
    }
  }
  // birds: small dark Vs in the sky
  if (u_birds > 0.0) {
    for (int i = 0; i < 7; i++) {
      float fi = float(i);
      if (hash2(vec2(fi, 13.0)) > u_birds) continue;
      vec2 bp = vec2(-0.6 + fract(0.07 * gT * (0.6 + hash2(vec2(fi, 3.0))) + hash2(vec2(fi, 1.0))) * 1.2, 0.15 + 0.3 * hash2(vec2(fi, 2.0)) + 0.02 * sin(gT + fi));
      vec2 q = p - bp; float flap = 0.35 * sin(gT * 8.0 + fi * 2.0);
      q.x = abs(q.x);
      float d = abs(q.y - q.x * (0.55 + flap)) + max(q.x - 0.03, 0.0) * 4.0;
      col = mix(col, vec3(0.15, 0.17, 0.2), smoothstep(0.004, 0.0015, d) * step(q.x, 0.03));
    }
  }
  float lum = dot(col, vec3(0.3, 0.59, 0.11));
  col = mix(col, vec3(lum) * vec3(0.92, 0.94, 0.97), u_grey * 0.8) * (1.0 - 0.15 * u_grey);
  return vec4(col, 1.0);
}
