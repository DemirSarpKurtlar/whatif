// Cross-section of the Mariana Trench with Mount Everest dropped in for scale. 2D, true vertical scale.
// params: u_ev (0..1 Everest drop: 0 = above the frame, 1 = resting on the trench floor), u_gap (0..1 dimension line
// from the summit to the surface), u_you (0..1 glowing "you" marker on the trench floor), u_splash (0..1 surface splash),
// u_pull (0..1 slow push-in toward the summit gap)
vec2 map(vec3 p){ return vec2(1e9, 0.0); }
float evH(float dx){
  // Everest silhouette, height fraction 0..1 at horizontal offset dx (screen-x units)
  float a = abs(dx + 0.012);
  float h = 1.0 - a/0.30;
  h = max(h, 0.86 - abs(dx - 0.075)/0.2);           // Lhotse-like shoulder
  h += 0.03*(noise2(vec2(dx*40.0, 1.0)) - 0.5) + 0.012*(noise2(vec2(dx*140.0, 3.0)) - 0.5);
  return h;
}
vec4 pixel(vec2 uv){
  float asp = u_resolution.x/u_resolution.y;            // 0.5625
  float pz = 1.0 + 0.18*u_pull;
  vec2 c = vec2(0.5, 0.36);
  vec2 q = (uv - c)/pz + c;
  float x = q.x, y = q.y;
  float YS = 0.25, YB = 0.89;
  float mPer = (YB - YS)/10935.0;
  vec3 col;
  // sky
  vec3 sky = mix(vec3(0.42,0.62,0.86), vec3(0.86,0.9,0.95), smoothstep(0.0, YS, y));
  col = sky;
  // water body
  float wv = YS + 0.0025*sin(x*60.0 + u_time*2.0);
  if (y > wv) {
    float dm = (y - YS)/mPer;
    vec3 w = mix(vec3(0.12,0.62,0.72), vec3(0.04,0.3,0.55), smoothstep(0.0, 300.0, dm));
    w = mix(w, vec3(0.025,0.08,0.2), smoothstep(300.0, 1200.0, dm));
    w = mix(w, vec3(0.012,0.03,0.08), smoothstep(1200.0, 10000.0, dm));
    // faint sun shafts in the top band
    float sh = smoothstep(0.55, 0.8, noise2(vec2(x*28.0 + y*6.0, u_time*0.2)));
    w += vec3(0.1,0.25,0.3)*sh*exp(-dm/250.0);
    // marine snow specks
    vec2 g = vec2(x, y - u_time*0.004)*vec2(140.0, 140.0/asp);
    vec2 gi = floor(g); float hs = hash2(gi);
    w += vec3(0.25,0.3,0.35)*step(0.985, hs)*smoothstep(0.35, 0.1, length(fract(g) - 0.5))*smoothstep(200.0, 2000.0, dm);
    col = w;
    // surface line highlight
    col = mix(col, vec3(0.85,0.97,1.0), smoothstep(0.0025, 0.0, abs(y - wv))*0.9);
  }
  // seafloor profile (abyssal plain ~5,500 m, trench to 10,935 m)
  float dx = x - 0.5;
  float D = mix(10935.0, 5600.0, smoothstep(0.045, 0.40, abs(dx)));
  D += 260.0*(noise2(vec2(x*18.0, 2.0)) - 0.5) + 90.0*(noise2(vec2(x*70.0, 5.0)) - 0.5);
  float yF = YS + D*mPer;
  if (y > yF) {
    float strata = 0.5 + 0.5*sin((y - yF)*900.0 + noise2(vec2(x*30.0, y*20.0))*3.0);
    col = mix(vec3(0.2,0.15,0.12), vec3(0.28,0.21,0.16), strata*0.5);
    col *= 1.0 - 0.5*smoothstep(0.0, 0.1, y - yF);
    col = mix(col, vec3(0.55,0.5,0.42), smoothstep(0.004, 0.0, y - yF));
  }
  // depth ticks on the left (every 1,000 m)
  if (y > YS && y < YB + 0.002 && x > 0.03 && x < 0.06) {
    float k = (y - YS)/mPer/1000.0;
    float fk = abs(fract(k + 0.5) - 0.5)*1000.0*mPer;
    float len = mod(floor(k + 0.5), 5.0) < 0.5 ? 0.06 : 0.048;
    if (fk < 0.0012 && x < len) col = mix(col, vec3(1.0), 0.65);
  }
  if (abs(x - 0.03) < 0.0015 && y > YS && y < YB) col = mix(col, vec3(1.0), 0.5);
  // "you" marker on the trench floor
  if (u_you > 0.0) {
    vec2 mp = vec2(0.5, YB - 0.006);
    float r = length((q - mp)*vec2(asp, 1.0));
    float pulse = 0.5 + 0.5*sin(u_time*5.0);
    col += vec3(1.0,0.85,0.4)*u_you*(smoothstep(0.008, 0.004, r) + 0.6*exp(-r*60.0)*pulse);
  }
  // Mount Everest dropping in
  if (u_ev > 0.0) {
    float Hm = 8849.0*mPer;
    float base = YB + (1.0 - u_ev)*(-1.15);
    float h = evH(dx);
    float top = base - h*Hm;
    if (y > top && y < base && h > 0.0) {
      float hf = (base - y)/Hm;
      float ridge = noise2(vec2(dx*55.0 + hf*8.0, hf*30.0));
      vec3 rock = mix(vec3(0.36,0.37,0.42), vec3(0.55,0.56,0.6), ridge);
      rock *= 0.8 + 0.35*smoothstep(0.0, 0.02, dx + 0.01*sin(hf*40.0));   // lit east face
      float snow = smoothstep(0.7, 0.76, hf + 0.05*(ridge - 0.5));
      vec3 mc = mix(rock, vec3(0.95,0.97,1.0), snow);
      if (y > wv) {                                      // underwater tint
        float dm = (y - YS)/mPer;
        mc = mix(mc, mc*vec3(0.35,0.6,0.9), 0.35 + 0.35*smoothstep(0.0, 8000.0, dm));
      }
      float edge = smoothstep(0.0025, 0.0, y - top);
      col = mix(mc, vec3(1.0), edge*0.8);
    }
  }
  // splash where it hits the surface
  if (u_splash > 0.0) {
    float sp = u_splash;
    float dxs = abs(dx);
    float plume = smoothstep(0.3*sp + 0.05, 0.0, dxs)*smoothstep(YS + 0.002, YS - 0.06*sin(sp*3.14)*(1.0 - dxs*3.0), y)*step(y, YS + 0.004);
    plume *= 0.6 + 0.4*noise2(vec2(x*90.0, y*90.0 - u_time*3.0));
    col = mix(col, vec3(0.95,0.98,1.0), clamp(plume, 0.0, 1.0)*sin(sp*3.14));
  }
  // dimension line: summit -> surface (2,086 m)
  if (u_gap > 0.0) {
    float yTop = YB - 8849.0*mPer;
    float xL = 0.80;
    vec3 acc = vec3(1.0, 0.85, 0.4);
    float a = 0.0;
    if (abs(x - xL) < 0.0022 && y > YS && y < yTop) a = 1.0;
    if (abs(y - yTop) < 0.0011 && x > 0.5 && x < xL + 0.02 && mod(x*160.0, 2.0) < 1.1) a = 0.9;
    if (abs(y - YS) < 0.0011 && x > xL - 0.02 && x < xL + 0.02) a = 1.0;
    // arrow heads
    float ay1 = y - YS, ay2 = yTop - y;
    if (ay1 > 0.0 && ay1 < 0.014 && abs(x - xL) < ay1*0.45/asp) a = 1.0;
    if (ay2 > 0.0 && ay2 < 0.014 && abs(x - xL) < ay2*0.45/asp) a = 1.0;
    col = mix(col, acc, a*u_gap);
  }
  col += (hash2(uv*u_resolution + fract(u_time)*91.0) - 0.5)*0.012;
  return vec4(col, 1.0);
}
