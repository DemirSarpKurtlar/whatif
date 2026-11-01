// Night in a tropical city near the equator, aurora overhead.
// params: u_aurora (0..1), u_lights (city lights 1 on .. 0 blackout), u_birds (0..1 confused flock), u_pan (yaw), u_tilt (pitch up), u_hue (0 green .. 1 pink)
vec2 map(vec3 p){ return vec2(1e9, 0.0); }
vec4 pixel(vec2 uv){
  vec2 p = screenP(uv, 0.0);
  vec3 ro = vec3(0.0, 1.6, 0.0);
  vec3 fwd = normalize(vec3(sin(u_pan), u_tilt, -cos(u_pan)));
  vec3 rd = camRay(p, ro, ro + fwd, 0.9);
  float az = atan(rd.x, -rd.z), el = rd.y;
  vec3 col = mix(vec3(0.03,0.04,0.09), vec3(0.01,0.01,0.03), clamp(el*1.5, 0.0, 1.0));
  // stars
  vec2 sq = vec2(az, el)*160.0; vec2 sc = floor(sq); vec2 sf = fract(sq) - 0.5;
  float hs = hash2(sc); col += vec3(hs > 0.982 ? smoothstep(0.3, 0.0, length(sf))*(0.5 + 0.5*hash2(sc+1.0)) : 0.0)*smoothstep(0.02, 0.15, el);
  // aurora curtains
  if (u_aurora > 0.0 && el > 0.0) {
    vec3 acc = vec3(0.0);
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float base = 0.22 + 0.13*fi + 0.05*sin(az*2.0 + u_time*0.25 + fi);
      float x = az*(6.0 + 2.0*fi) + 1.3*sin(az*3.0 + u_time*0.35 + fi*2.0);
      float rays = 0.45 + 0.55*noise2(vec2(x*7.0, u_time*0.8 + fi*5.0));
      float h = (el - base);
      float body = smoothstep(-0.03, 0.02, h)*exp(-max(h, 0.0)*(5.0 + 2.0*fi));
      vec3 g = mix(vec3(0.15,1.0,0.45), vec3(0.95,0.3,0.85), clamp(u_hue + max(h,0.0)*2.5, 0.0, 1.0));
      acc += g*body*rays*(0.9 - 0.2*fi);
    }
    col += acc*u_aurora*1.2;
    col += vec3(0.05,0.25,0.12)*u_aurora*exp(-el*3.0)*0.6;
  }
  // skyline silhouette with windows
  float bw = 0.06; float bc = floor(az/bw); float bh = 0.03 + 0.09*hash2(vec2(bc, 2.0))*hash2(vec2(bc, 5.0)) + (hash2(vec2(bc,9.0)) > 0.85 ? 0.08 : 0.0);
  if (el < bh && el > -0.02) {
    vec3 b = vec3(0.02,0.025,0.04);
    float wx = step(0.5, fract(az/bw*7.0)), wy = step(0.55, fract(el*220.0));
    float lit = step(0.45, hash2(vec2(floor(az/bw*7.0), floor(el*220.0))))*wx*wy;
    float flick = u_lights > 0.5 ? 1.0 : step(0.5, hash2(vec2(bc, floor(u_time*6.0))))*u_lights*2.0;
    b += vec3(1.0,0.78,0.45)*lit*0.7*clamp(flick, 0.0, 1.0)*clamp(u_lights*1.2, 0.0, 1.0);
    col = b + col*0.05;
  }
  // palm silhouettes (foreground)
  for (int i = 0; i < 2; i++) {
    float fi = float(i);
    float px = (fi < 0.5 ? -0.42 : 0.38);
    vec2 q = vec2(az - px, el);
    float lean = (fi < 0.5 ? 0.12 : -0.1);
    float topY = 0.36 + 0.04*fi;
    float tx = q.x - lean*max(q.y + 0.2, 0.0);
    float trunk = smoothstep(0.016, 0.009, abs(tx)) * step(q.y, topY) * step(-0.3, q.y);
    vec2 tq = q - vec2(lean*(topY + 0.2), topY);
    float fr = 0.0;
    for (int k = 0; k < 7; k++) {
      float a2 = float(k)*0.9 + fi*0.4 + 0.05*sin(u_time*0.8 + float(k));
      vec2 d = normalize(vec2(cos(a2), sin(a2)*0.5 + 0.1));
      float tt = clamp(dot(tq, d)/0.26, 0.0, 1.0);
      vec2 cl = tq - d*0.26*tt + vec2(0.0, 0.09*tt*tt);
      fr = max(fr, smoothstep(0.022*(1.0 - tt*0.8) + 0.002, 0.0, length(cl)));
    }
    col = mix(col, vec3(0.004,0.005,0.01), max(trunk, fr));
  }
  // birds circling in confusion
  if (u_birds > 0.0) {
    for (int i = 0; i < 9; i++) {
      float fi = float(i);
      float a = u_time*(0.6 + 0.1*fi) + fi*0.7;
      vec2 bp = vec2(0.22*cos(a + fi) + 0.03*fi - 0.12 + u_pan, 0.42 + 0.1*sin(a*1.3) + 0.015*fi);
      vec2 d = vec2(az, el) - bp;
      float flap = sin(u_time*12.0 + fi)*0.5;
      float wing = smoothstep(0.006, 0.0, abs(d.y - abs(d.x)*(0.6 + flap)))*step(abs(d.x), 0.034);
      col = mix(col, vec3(0.0), wing*u_birds);
    }
  }
  // ground
  if (el < -0.02) col = vec3(0.01,0.012,0.02) + vec3(0.0,0.06,0.03)*u_aurora*exp(el*6.0);
  col += (hash2(uv*u_resolution + fract(u_time)*77.0) - 0.5)*0.02;
  return vec4(col, 1.0);
}
