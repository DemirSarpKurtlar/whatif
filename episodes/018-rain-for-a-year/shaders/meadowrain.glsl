// Meadow at the edge of a city with a controllable sky.
// params: u_cam (dolly), u_yaw, u_pitch, u_lens, u_sunel, u_sunaz, u_sunsize (1 = today's Sun), u_ash (0..1 volcanic haze),
//         u_snow (0..1 snow cover + snowfall), u_heat (0..1 scorched, orange haze), u_steam (0..1 white steam fog), u_shake
float gT = 0.0;
vec2 map(vec3 p){
  vec3 q = p; q.z += 26.0;
  float bt = max(abs(q.z)-5.0, q.y-6.0);
  if (bt > 0.5) return vec2(bt, 0.0);
  float cx = floor((q.x+3.0)/6.0);
  q.x = mod(q.x+3.0,6.0)-3.0;
  q.z += (hash2(vec2(cx,1.0))-0.5)*5.0;
  float s = 0.8+0.5*hash2(vec2(cx,2.0));
  float can = sdEllipsoid(q-vec3(0.0,2.7*s,0.0), vec3(1.8,1.6,1.8)*s);
  float tr = sdCylinder(q-vec3(0.0,0.8,0.0), 0.9, 0.17);
  return opU(vec2(can*0.9, 2.0), vec2(tr, 3.0));
}
vec3 skyline(vec3 rd, vec3 base, vec3 bcol){
  float az = atan(rd.x, -rd.z), el = rd.y, w = 0.05;
  float cid = floor(az/w); float hh = hash2(vec2(cid,3.0));
  float h = 0.03 + 0.09*hh*hh + (hash2(vec2(cid,8.0))>0.85 ? 0.09 : 0.0);
  float fx = fract(az/w); float inset = 0.08+0.1*hash2(vec2(cid,5.0));
  if (el < h && el > -0.02 && fx > inset && fx < 1.0-inset*0.5) {
    vec3 bc = bcol*mix(0.85,1.15,hash2(vec2(cid,6.0)));
    float wx = step(0.45, fract(fx*9.0)), wy = step(0.5, fract(el*260.0));
    bc *= 1.0 + 0.12*wx*wy;
    return mix(bc, base, 0.3);
  }
  return base;
}
vec4 pixel0(vec2 uv){
  gT = u_time;
  vec2 p = screenP(uv, 0.0);
  p += u_shake*vec2(noise2(vec2(u_time*23.0,1.0))-0.5, noise2(vec2(u_time*19.0,7.0))-0.5)*0.03;
  vec3 ro = vec3(0.0, 1.7, 6.0-2.0*u_cam);
  vec3 fw = vec3(sin(u_yaw)*cos(u_pitch), sin(u_pitch), -cos(u_yaw)*cos(u_pitch));
  vec3 rd = camRay(p, ro, ro+fw, u_lens);
  float e = clamp(rd.y,0.0,1.0);
  vec3 hor = vec3(173.0,198.0,226.0)/255.0, top = vec3(70.0,104.0,152.0)/255.0;
  vec3 sky = mix(hor, top, pow(e,0.6));
  // ash: brown-grey, dim; heat: bleached orange-white; steam: white
  vec3 ashSky = mix(vec3(0.42,0.36,0.30), vec3(0.20,0.17,0.15), pow(e,0.5));
  vec3 heatSky = mix(vec3(1.0,0.86,0.62), vec3(0.95,0.62,0.35), pow(e,0.6));
  sky = mix(sky, ashSky, u_ash);
  sky = mix(sky, heatSky, u_heat*0.85);
  vec2 cp = rd.xz/(rd.y+0.08)*2.2;
  float cl = smoothstep(0.55,0.85,noise2(cp*1.3+vec2(gT*0.02,0.0))*0.65+noise2(cp*3.1)*0.35);
  sky = mix(sky, mix(vec3(0.93,0.95,0.98), vec3(0.32,0.28,0.25), u_ash), cl*0.5*smoothstep(0.02,0.2,rd.y)*(1.0-u_heat));
  // the Sun: angular radius grows with u_sunsize
  vec3 S = normalize(vec3(sin(u_sunaz)*cos(u_sunel), sin(u_sunel), -cos(u_sunaz)*cos(u_sunel)));
  float ang = acos(clamp(dot(rd,S),-1.0,1.0));
  float rs = 0.0047*u_sunsize*2.2;
  float disk = smoothstep(rs*1.02, rs*0.97, ang);
  float vis = 1.0 - 0.85*u_ash;
  vec3 sunC = mix(vec3(1.0,0.95,0.82), vec3(1.0,0.8,0.55), u_heat);
  sky = mix(sky, sunC*(1.6 - 0.9*u_ash), disk*vis);
  sky += sunC*(exp(-(ang-rs)*max(6.0, 40.0/u_sunsize))*0.35*(0.5+u_heat) + exp(-(ang-rs)*3.0)*0.05*u_sunsize*0.2)*vis*step(rs, ang);
  vec3 bcol = mix(vec3(0.42,0.48,0.56), vec3(0.3,0.27,0.24), u_ash);
  bcol = mix(bcol, vec3(0.75,0.6,0.45), u_heat*0.6);
  vec3 bg = skyline(rd, sky, bcol);
  vec3 col = bg;
  float tg = rd.y < 0.0 ? -ro.y/rd.y : 1e9;
  vec3 m = march(ro, rd, min(tg, 60.0), 0.0);
  vec3 L = normalize(vec3(sin(u_sunaz)*0.6, 1.0, -0.4));
  float lightK = (1.0 - 0.7*u_ash)*(1.0 + 0.6*u_heat);
  vec3 key = vec3(1.25,1.15,1.0)*lightK;
  vec3 amb = mix(lin(vec3(0.62,0.72,0.86))*0.55, lin(vec3(0.5,0.42,0.36))*0.35, u_ash);
  vec3 hz = lin(mix(mix(hor, ashSky, u_ash), heatSky, u_heat*0.85));
  vec3 snowC = vec3(0.88,0.91,0.96);
  vec3 dryC = vec3(150.0,120.0,70.0)/255.0;
  if (m.x > 0.0) {
    vec3 pos = ro+rd*m.x; vec3 n = calcNormal(pos);
    vec3 a0 = m.y < 2.5 ? mix(vec3(79.0,127.0,51.0), vec3(104.0,148.0,62.0), noise2(pos.xz*0.7))/255.0 : vec3(90.0,70.0,50.0)/255.0;
    if (m.y < 2.5) { n = facet(n, 4.0); a0 = mix(a0, mix(dryC, vec3(0.25,0.18,0.1), 0.4), u_heat); }
    vec3 alb = lin(a0);
    alb = mix(alb, lin(snowC), u_snow*smoothstep(-0.2,0.6,n.y));
    float dif = clamp((dot(n,L)+0.3)/1.3,0.0,1.0);
    col = alb*(key*dif + amb*(0.6+0.4*n.y));
    col = grade(col, hz, m.x, 10.0, 0.35+0.4*max(u_ash,u_steam), 0.02);
  } else if (tg < 1e8) {
    vec3 pos = ro+rd*tg;
    vec3 gcol = mix(vec3(67.0,98.0,47.0), vec3(110.0,140.0,70.0), noise2(pos.xz*0.35))/255.0;
    gcol = mix(gcol, dryC*mix(0.8,1.1,noise2(pos.xz*0.5)), u_heat);
    float bl = noise2(pos.xz*vec2(14.0,40.0))*noise2(pos.xz*vec2(31.0,9.0)+3.0);
    gcol *= 0.78+0.55*bl*smoothstep(30.0,3.0,tg);
    vec3 a = lin(gcol);
    a = mix(a, lin(snowC)*(0.85+0.3*bl), u_snow);
    col = a*(key*0.85 + amb*1.2);
    col = grade(col, hz, tg, 14.0, 0.35+0.4*max(u_ash,u_steam), 0.02);
  }
  // steam fog
  float fogd = (tg < 1e8 ? tg : 60.0);
  col = mix(col, vec3(0.9,0.9,0.88), u_steam*(0.35 + 0.55*smoothstep(0.0, 25.0, fogd))*(0.85+0.15*noise2(p*3.0+vec2(u_time*0.1,0.0))));
  // heat shimmer tint
  col *= mix(vec3(1.0), vec3(1.08,0.98,0.85), u_heat);
  // falling snow / ash flakes
  if (u_snow > 0.0 || u_ash > 0.0) {
    float fl = 0.0;
    for (int i=0;i<3;i++){
      float sc = 18.0 + 14.0*float(i);
      vec2 q = p*sc + vec2(u_time*0.6*(1.0+float(i)*0.3), u_time*(2.2+float(i)));
      vec2 id = floor(q); vec2 f = fract(q)-0.5;
      vec2 o = vec2(hash2(id), hash2(id+7.0))-0.5;
      fl += smoothstep(0.09, 0.0, length(f-o*0.6))*step(0.6, hash2(id+3.0));
    }
    vec3 flC = u_snow > u_ash ? vec3(0.97) : vec3(0.35,0.32,0.3);
    col = mix(col, flC, clamp(fl,0.0,1.0)*0.75*max(u_snow,u_ash*0.7));
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
