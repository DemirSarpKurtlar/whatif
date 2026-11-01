// Low-poly desert dunes that bloom after rain.
// params: u_cam (dolly 0..), u_bloom (0 = bare sand .. 1 = green with flowers), u_rain, u_gloom, u_pitch, u_yaw
vec2 map(vec3 p){ return vec2(1e9, 0.0); }
float dune(vec2 x){
  float h = 1.6*sin(x.x*0.11 + 0.7*sin(x.y*0.07)) + 0.9*sin(x.y*0.17 + x.x*0.05) + 0.35*noise2(x*0.25);
  return h;
}
vec3 duneN(vec2 x){ float e = 0.05; return normalize(vec3(dune(x - vec2(e,0.0)) - dune(x + vec2(e,0.0)), 2.0*e, dune(x - vec2(0.0,e)) - dune(x + vec2(0.0,e)))); }
vec4 pixel0(vec2 uv){
  vec2 p = screenP(uv, 0.0);
  vec3 ro = vec3(0.0 + u_cam*1.5, 3.4, 10.0 - u_cam*6.0);
  vec3 ta = ro + vec3(sin(u_yaw), -0.18 + u_pitch, -cos(u_yaw));
  vec3 rd = camRay(p, ro, ta, 1.1);
  vec3 hor = mix(vec3(222.0,200.0,170.0), vec3(185.0,205.0,225.0), u_bloom*0.7)/255.0;
  vec3 top = mix(vec3(96.0,140.0,200.0), vec3(80.0,120.0,175.0), u_bloom)/255.0;
  vec3 col = mix(hor, top, pow(clamp(rd.y,0.0,1.0), 0.5));
  // sun
  vec3 S = normalize(vec3(0.5, 0.45, -0.7));
  col += vec3(1.0,0.9,0.7)*pow(max(dot(rd,S),0.0), 300.0)*1.5*(1.0-u_gloom);
  // clouds band
  vec2 cp = rd.xz/(rd.y+0.08)*1.6;
  float cl = smoothstep(0.55,0.85,noise2(cp*1.2+vec2(u_time*0.02,0.0))*0.6+noise2(cp*3.0)*0.4);
  col = mix(col, vec3(0.95), cl*0.45*smoothstep(0.02,0.25,rd.y));
  // heightfield march
  float t = 0.5, hit = -1.0;
  for (int i=0;i<110;i++){
    vec3 q = ro + rd*t;
    float d = q.y - dune(q.xz);
    if (d < 0.01*t) { hit = t; break; }
    t += max(0.05, d*0.55);
    if (t > 140.0) break;
  }
  if (hit > 0.0) {
    vec3 q = ro + rd*hit;
    vec3 n = duneN(q.xz);
    n = facet(n, 5.0);
    vec3 sand = mix(vec3(214.0,168.0,110.0), vec3(196.0,146.0,92.0), noise2(q.xz*0.3))/255.0;
    // bloom: greener in hollows first, then everywhere
    float hollow = smoothstep(0.8, -1.2, dune(q.xz));
    float g = clamp(u_bloom*1.6 - (1.0-hollow)*0.8, 0.0, 1.0);
    vec3 green = mix(vec3(96.0,140.0,62.0), vec3(126.0,160.0,72.0), noise2(q.xz*0.8))/255.0;
    vec3 alb = mix(sand, green, g*smoothstep(0.3,0.6,noise2(q.xz*0.6)+0.35*g));
    // flowers: small coloured dots on the ground
    vec2 cell = floor(q.xz*2.2); vec2 f = fract(q.xz*2.2) - 0.5;
    float hf = hash2(cell);
    float fl = smoothstep(0.17, 0.08, length(f + (vec2(hash2(cell+3.0), hash2(cell+7.0))-0.5)*0.5)) * step(1.0 - g*0.55, hf);
    vec3 fc = hf > 0.93 ? vec3(0.95,0.85,0.25) : hf > 0.86 ? vec3(0.95,0.45,0.65) : hf > 0.79 ? vec3(0.62,0.42,0.86) : vec3(0.98,0.97,0.93);
    alb = mix(alb, fc, fl*smoothstep(80.0, 10.0, hit));
    vec3 L = normalize(vec3(0.5,0.6,-0.5));
    float dif = clamp(dot(n,L),0.0,1.0);
    vec3 c = lin(alb)*(dif*1.15*(1.0-0.5*u_gloom) + lin(vec3(0.62,0.72,0.86))*(0.45+0.25*n.y));
    c = pow(c, vec3(0.4545));
    col = mix(c, hor, clamp((hit-25.0)/110.0, 0.0, 0.85));
  }
  return vec4(col, 1.0);
}
vec4 pixel(vec2 uv){
  vec3 col = pixel0(uv).rgb;
  float lum = dot(col, vec3(0.3,0.59,0.11));
  col = mix(col, vec3(lum)*vec3(0.86,0.9,1.0), u_gloom*0.6) * (1.0 - 0.38*u_gloom);
  vec2 p = uv*vec2(u_resolution.x/u_resolution.y, 1.0);
  float r = 0.0;
  for (int i=0;i<3;i++){
    float fi = float(i);
    float sc = 34.0 + fi*30.0;
    vec2 q = vec2(p.x*sc + p.y*sc*0.10, p.y*sc*0.16 - u_time*(7.0+fi*3.0));
    vec2 cid = floor(q); vec2 f = fract(q);
    float h = hash2(cid + fi*13.0);
    float d = abs(f.x - 0.5 - (h-0.5)*0.6);
    r += smoothstep(0.05,0.0,d) * step(h,0.3) * smoothstep(0.0,0.35,f.y)*smoothstep(1.0,0.55,f.y) * (0.55 - fi*0.13);
  }
  col += vec3(0.78,0.82,0.9)*r*u_rain*0.55;
  col = mix(col, vec3(0.55,0.58,0.62)*(1.0-0.3*u_gloom), u_rain*0.12*smoothstep(0.2,1.0,uv.y));
  return vec4(col, 1.0);
}
