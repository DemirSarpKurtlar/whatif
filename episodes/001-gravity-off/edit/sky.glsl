vec3 PP = vec3(0.0);
float gPitch = 0.0;
vec2 map(vec3 p){
  vec3 q = p - PP;
  q.xy = rot(-gPitch)*q.xy;
  float fus = sdCapsule(q, vec3(-6.0,0.0,0.0), vec3(6.5,0.0,0.0), 0.75);
  float nose = sdEllipsoid(q-vec3(6.6,-0.05,0.0), vec3(1.4,0.7,0.72));
  float wing = sdRoundBox(q-vec3(0.5,-0.3,0.0), vec3(1.3,0.08,7.5), 0.06);
  float tail = sdRoundBox(q-vec3(-5.6,1.3,0.0), vec3(0.8,1.3,0.08), 0.05);
  float stab = sdRoundBox(q-vec3(-5.7,0.2,0.0), vec3(0.6,0.06,2.6), 0.04);
  float eng = min(sdCapsule(q, vec3(0.3,-0.9,2.6), vec3(2.0,-0.9,2.6), 0.42), sdCapsule(q, vec3(0.3,-0.9,-2.6), vec3(2.0,-0.9,-2.6), 0.42));
  float body = smin(fus, nose, 0.3);
  vec2 r = vec2(body, 1.0);
  r = opU(r, vec2(min(min(wing, stab), tail), 2.0));
  r = opU(r, vec2(eng, 3.0));
  return r;
}
vec4 pixel(vec2 uv){
  vec2 p = screenP(uv, 0.0);
  float cl = u_climb;
  PP = vec3(-28.0 + 26.0*u_fly, 62.0 + 75.0*cl*cl, -120.0);
  gPitch = 0.18 + 0.35*clamp(cl*3.0,0.0,1.0);
  vec3 ro = vec3(0.0, 1.6, 0.0);
  vec3 ta = vec3(PP.x*0.5, PP.y*0.62 + 8.0, -120.0);
  vec3 rd = camRay(p, ro, ta, 1.25);
  vec3 hor = vec3(173.0,198.0,226.0)/255.0, top = vec3(64.0,98.0,148.0)/255.0;
  vec3 col = mix(hor, top, pow(clamp(rd.y,0.0,1.0),0.55));
  vec2 cp = rd.xz/(rd.y+0.05)*2.0;
  float c1 = smoothstep(0.55,0.85,noise2(cp*1.1+vec2(u_time*0.03,0.0))*0.65+noise2(cp*2.7)*0.35);
  col = mix(col, vec3(0.95,0.96,0.99), c1*0.6*smoothstep(0.05,0.3,rd.y));
  vec3 tp = PP + vec3(-6.0,0.0,0.0);
  vec3 trailA = tp;
  vec3 m = march(ro, rd, 200.0, 0.0);
  float trail = 0.0;
  for (int i=0;i<2;i++){
    float side = i==0 ? 2.6 : -2.6;
    vec3 a = PP + vec3(0.3*cos(gPitch), -0.9 + 0.3*sin(gPitch), side);
    vec3 b = a - vec3(60.0*cos(gPitch*0.7), 60.0*sin(gPitch*0.7) + 30.0*cl, 0.0);
    vec3 ba = b-a; vec3 w0 = ro-a;
    float B = dot(rd,ba), C = dot(ba,ba), D = dot(rd,w0), E = dot(ba,w0);
    float den = C - B*B;
    float uu = clamp((E - B*D)/den, 0.0, 1.0);
    float ss = max(dot(rd, a + ba*uu - ro), 0.0);
    float d = length(ro + rd*ss - (a + ba*uu));
    float tt = uu;
    trail += smoothstep(0.5+tt*2.5, 0.0, d)*(1.0-tt)*0.8;
  }
  col = mix(col, vec3(0.98), clamp(trail,0.0,0.85));
  if (m.x > 0.0) {
    vec3 pos = ro+rd*m.x; vec3 n = calcNormal(pos);
    vec3 alb = m.y < 1.5 ? vec3(0.92,0.93,0.95) : m.y < 2.5 ? vec3(0.78,0.8,0.84) : vec3(0.55,0.58,0.64);
    vec3 q = pos-PP; q.xy = rot(-gPitch)*q.xy;
    if (m.y < 1.5 && abs(q.y+0.15) < 0.12) alb = vec3(0.2,0.36,0.7);
    if (m.y > 1.5 && m.y < 2.5 && q.x < -4.5 && q.y > 0.6) alb = vec3(0.85,0.25,0.22);
    vec3 L = normalize(vec3(-0.5,1.0,0.6));
    float dif = clamp(dot(n,L),0.0,1.0);
    vec3 c = lin(alb)*(dif*1.1 + lin(vec3(0.55,0.65,0.8))*(0.5+0.5*n.y)*0.7 + 0.08);
    c = pow(c, vec3(0.4545));
    col = mix(c, hor, 0.25);
  }
  float tl = 0.10 + 0.05*noise2(vec2(p.x*7.0, 1.0)) + 0.03*noise2(vec2(p.x*23.0,4.0));
  float ys = p.y + 0.5;
  if (ys < tl) col = mix(vec3(52.0,82.0,44.0)/255.0, vec3(38.0,60.0,34.0)/255.0, smoothstep(tl, tl-0.08, ys));
  return vec4(col, 1.0);
}
