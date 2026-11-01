// Night ocean that freezes over (u_ice), then a view from under the ice (u_under).
vec2 map(vec3 p){ return vec2(1e9, 0.0); }
vec2 vor(vec2 x){ vec2 n=floor(x), f=fract(x); float m1=8.0, m2=8.0;
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){ vec2 g=vec2(float(i),float(j)); vec2 o=vec2(hash2(n+g), hash2(n+g+17.3));
    float d=length(g+o-f); if(d<m1){m2=m1;m1=d;} else if(d<m2) m2=d; }
  return vec2(m1, m2-m1); }
vec3 stars(vec3 rd){ vec2 sq=vec2(atan(rd.z,rd.x), asin(clamp(rd.y,-1.0,1.0)))*140.0; vec2 sc=floor(sq);
  return vec3(smoothstep(0.3,0.0,length(fract(sq)-0.5))*(hash2(sc)>0.982?1.0:0.0)*(0.5+0.5*hash2(sc+3.0))); }
vec4 pixel(vec2 uv){
  vec2 p = screenP(uv, 0.0);
  float t = u_time;
  if (u_under < 0.5) {
    vec3 ro = vec3(0.0, 3.0+u_camy, 4.0 - 3.0*u_cam);
    vec3 rd = camRay(p, ro, ro+vec3(0.0, -0.18+u_pitch, -1.0), 1.1);
    vec3 col = mix(vec3(0.03,0.035,0.06), vec3(0.008,0.01,0.025), pow(clamp(rd.y,0.0,1.0),0.5)) + stars(rd)*smoothstep(0.0,0.06,rd.y);
    col += vec3(1.0,0.93,0.8)*(smoothstep(0.99994,0.99998,dot(rd,normalize(vec3(0.35,0.4,-1.0))))*1.5);
    if (rd.y < 0.0) {
      float tp = -ro.y/rd.y; vec3 X = ro+rd*tp;
      vec2 w = X.xz;
      float h = noise2(w*0.8+vec2(t*0.3,t*0.2))*0.6+noise2(w*2.3-vec2(t*0.5,0.0))*0.4;
      vec3 n = normalize(vec3((noise2(w*0.8+vec2(t*0.3+0.05,t*0.2))-noise2(w*0.8+vec2(t*0.3,t*0.2)))*6.0, 1.0, (noise2(w*2.3+vec2(0.0,0.05)-vec2(t*0.5,0.0))-noise2(w*2.3-vec2(t*0.5,0.0)))*4.0));
      vec3 r = reflect(rd, n);
      vec3 water = vec3(0.015,0.03,0.06) + stars(r)*0.6 + vec3(0.06,0.08,0.13)*pow(1.0-abs(dot(n,rd)),3.0);
      vec2 v = vor(w*0.45);
      float edge = smoothstep(0.04, 0.0, v.y);
      float cov = smoothstep(u_ice*1.15-0.15, u_ice*1.15, hash2(floor(w*0.45)+0.0)*0.0 + 1.0 - length(w-vec2(0.0,-6.0))*0.012 - 0.35*v.x);
      cov = smoothstep(0.45, 0.55, u_ice*1.05 + 0.35*noise2(w*0.15) - 0.25*v.x);
      vec3 ice = mix(vec3(0.3,0.36,0.46), vec3(0.5,0.58,0.7), noise2(w*3.0))*(1.0-0.55*edge) + stars(reflect(rd,vec3(0.0,1.0,0.0)))*0.15;
      col = mix(water, ice, cov);
      col = mix(col, vec3(0.05,0.06,0.1), clamp(tp*0.01,0.0,1.0));
    }
    return vec4(col, 1.0);
  } else {
    vec3 ro = vec3(0.0, -4.0, 0.0 - 2.0*u_cam);
    vec3 rd = camRay(p, ro, ro+vec3(0.0, 0.9, -1.0), 1.0);
    vec3 col = mix(vec3(0.0,0.012,0.03), vec3(0.0,0.004,0.012), clamp(-rd.y*2.0,0.0,1.0));
    if (rd.y > 0.0) {
      float tp = (0.0-ro.y)/rd.y; vec3 X = ro+rd*tp;
      vec2 v = vor(X.xz*0.45);
      float edge = smoothstep(0.05, 0.0, v.y);
      vec3 ice = mix(vec3(0.05,0.1,0.16), vec3(0.09,0.16,0.24), noise2(X.xz*2.0))*(1.0+edge*1.5);
      col = mix(ice, col, clamp(tp*0.03,0.0,1.0));
    }
    float snow = 0.0;
    for (int i=0;i<3;i++){ vec2 q = p*vec2(30.0+float(i)*20.0) + vec2(0.0, t*(0.5+0.3*float(i))); vec2 c=floor(q);
      snow += smoothstep(0.08,0.0,length(fract(q)-0.5))*step(0.93,hash2(c+float(i)*7.0)); }
    col += vec3(0.25,0.35,0.45)*snow*0.35;
    return vec4(col, 1.0);
  }
}
