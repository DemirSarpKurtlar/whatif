// room.glsl — Episode 047: low-poly flat interior for "Indoors, you'd only hit the ceiling".
// Same bright faceted look as lowcity.glsl. Everything loose (person, table, plant, ball) is thrown up with the real
// 1-second reversal kinematics and stops at the 2.6 m ceiling, then drops back when gravity returns.
// Params: ph (physical seconds since the flip), cam (dolly 0..1), rise, tilt, panx, shake
const float CEIL = 2.6;
float gPh = 0.0;
float D(float gap, float t){ // displacement of a loose object with `gap` metres of headroom
  if (t <= 0.0) return 0.0;
  if (t < 1.0) return min(4.905*t*t, gap);
  return max(gap - 4.905*(t-1.0)*(t-1.0), 0.0);
}
vec2 map(vec3 p){
  vec2 r = vec2(1e9, 0.0);
  // person (head top 1.62 m -> 0.98 m of headroom)
  {
    float d = D(0.98, gPh);
    float k = clamp(d/0.98, 0.0, 1.0);
    vec3 q = p - vec3(0.45, d, -1.0);
    q.xz = rot(0.5)*q.xz;
    q.xy = rot(0.08*k)*q.xy;
    float legs = min(sdCapsule(q, vec3(0.08,0.52,0.0), vec3(0.12+0.1*k,0.06,0.05), 0.09), sdCapsule(q, vec3(-0.08,0.52,0.0), vec3(-0.12-0.1*k,0.06,-0.05), 0.09));
    float body = sdCapsule(q, vec3(0.0,0.7,0.0), vec3(0.0,1.15,0.0), 0.2);
    vec3 ha = vec3(0.32+0.12*k, 0.75+0.7*k, 0.05);
    float arms = min(sdCapsule(q, vec3(0.22,1.12,0.0), ha, 0.065), sdCapsule(q, vec3(-0.22,1.12,0.0), vec3(-ha.x,ha.y,-0.05), 0.065));
    float head = sdSphere(q-vec3(0.0,1.47,0.0), 0.15);
    r = opU(vec2(legs, 5.0), vec2(smin(body,arms,0.05), 4.0));
    r = opU(r, vec2(head, 6.0));
  }
  // table (top 0.78 m -> 1.82 m headroom)
  {
    float d = D(1.82, gPh);
    vec3 q = p - vec3(-1.05, d, -1.9);
    float top = sdRoundBox(q-vec3(0.0,0.75,0.0), vec3(0.55,0.03,0.4), 0.01);
    vec3 lq = vec3(abs(q.x)-0.48, q.y-0.37, abs(q.z)-0.33);
    float legs = sdRoundBox(lq, vec3(0.03,0.37,0.03), 0.005);
    r = opU(r, vec2(min(top, legs), 7.0));
  }
  // potted plant (top 1.0 m -> 1.6 m headroom), slight tumble
  {
    float d = D(1.6, gPh);
    vec3 q = p - vec3(1.35, d, -2.7);
    q.xy = rot(0.25*clamp(d,0.0,1.0))*q.xy;
    float pot = sdCylinder(q-vec3(0.0,0.2,0.0), 0.2, 0.2);
    float lv = sdEllipsoid(q-vec3(0.0,0.62,0.0), vec3(0.32,0.38,0.32));
    r = opU(r, vec2(pot, 8.0));
    r = opU(r, vec2(lv, 2.0));
  }
  // ball (top 0.3 m -> 2.3 m headroom)
  {
    float d = D(2.3, gPh);
    r = opU(r, vec2(sdSphere(p - vec3(-0.35, 0.15+d, 0.3), 0.15), 9.0));
  }
  return r;
}
vec3 outside(vec3 rd){
  vec3 hor = vec3(198.0,218.0,240.0)/255.0, top = vec3(92.0,148.0,222.0)/255.0;
  vec3 c = mix(hor, top, pow(clamp(rd.y+0.1,0.0,1.0),0.55));
  float a = atan(rd.x, -rd.z);
  float u = a*14.0; float cid = floor(u), fx = fract(u);
  float ht = -0.05 + 0.2*hash2(vec2(cid,3.0));
  if (rd.y < ht && fx > 0.08) {
    float k = hash2(vec2(cid,5.0));
    vec3 pc = (k<0.25? vec3(233.0,223.0,201.0) : k<0.5? vec3(216.0,112.0,94.0) : k<0.75? vec3(156.0,195.0,230.0) : vec3(143.0,201.0,190.0))/255.0;
    float wm = step(0.45, fract(fx*6.0))*step(0.4, fract(rd.y*60.0));
    pc = mix(pc, pc*0.5, wm*0.8);
    c = mix(pc, hor, 0.15);
  }
  return c;
}
vec4 pixel(vec2 uv){
  gPh = u_ph;
  vec2 p = screenP(uv, 0.0);
  vec2 jit = u_shake*vec2(noise2(vec2(u_time*23.0,1.0))-0.5, noise2(vec2(u_time*19.0,7.0))-0.5)*0.1;
  vec3 ro = vec3(0.1+u_panx+jit.x, 1.45+u_rise+jit.y, 3.4-1.4*u_cam);
  vec3 ta = vec3(-0.05+u_panx*0.5, 1.35+u_tilt, -3.0);
  vec3 rd = camRay(p, ro, ta, 0.78);
  // room box x[-2.2,2.2] y[0,CEIL] z[-3.6,6]
  vec3 bmin = vec3(-2.2, 0.0, -3.6), bmax = vec3(2.2, CEIL, 6.0);
  vec3 t1 = (bmin-ro)/rd, t2 = (bmax-ro)/rd;
  vec3 tf = max(t1, t2);
  float tw = min(tf.x, min(tf.y, tf.z));
  vec3 pos = ro+rd*tw;
  vec3 L = normalize(vec3(-0.35,0.75,0.55));
  vec3 key = vec3(1.15,1.08,0.98), skyF = lin(vec3(0.7,0.76,0.86))*0.6, bnc = lin(vec3(0.6,0.5,0.4))*0.4;
  vec3 a; vec3 n;
  if (tw == tf.y) {
    if (rd.y < 0.0) { // floor: wooden planks
      n = vec3(0.0,1.0,0.0);
      float pl = floor(pos.x/0.32);
      a = mix(vec3(196.0,148.0,102.0), vec3(176.0,128.0,86.0), hash2(vec2(pl,1.0)))/255.0;
      if (fract(pos.x/0.32) < 0.04) a *= 0.8;
    } else { // ceiling with a flat light panel
      n = vec3(0.0,-1.0,0.0);
      a = vec3(246.0,244.0,238.0)/255.0;
      if (abs(pos.x-0.2) < 0.5 && abs(pos.z+1.2) < 0.5) a = vec3(1.0,0.99,0.93)*1.15;
    }
  } else if (tw == tf.x) {
    n = vec3(-sign(rd.x),0.0,0.0);
    a = rd.x < 0.0 ? vec3(168.0,202.0,182.0)/255.0 : vec3(238.0,226.0,204.0)/255.0;
    if (rd.x < 0.0 && abs(pos.z+1.0) < 0.55 && abs(pos.y-1.6) < 0.38) a = abs(pos.z+1.0) < 0.47 && abs(pos.y-1.6) < 0.3 ? vec3(238.0,150.0,70.0)/255.0 : vec3(70.0,60.0,55.0)/255.0;
  } else {
    n = vec3(0.0,0.0,-sign(rd.z));
    a = vec3(238.0,226.0,204.0)/255.0;
  }
  if (pos.y < 0.1 && tw != tf.y) a = vec3(250.0,248.0,244.0)/255.0; // skirting
  bool win = (tw == tf.z && rd.z < 0.0 && abs(pos.x+0.1) < 1.15 && pos.y > 0.85 && pos.y < 2.2);
  vec3 m = march(ro, rd, tw, 0.0);
  vec3 col;
  if (m.x > 0.0) {
    vec3 pp = ro+rd*m.x;
    vec3 nn = calcNormal(pp);
    float id = m.y;
    vec3 alb;
    if (id < 2.5) { alb = lin(vec3(96.0,176.0,62.0)/255.0); nn = facet(nn, 2.2); }
    else if (id < 4.5) { alb = lin(vec3(226.0,72.0,60.0)/255.0); nn = facet(nn, 3.0); }
    else if (id < 5.5) { alb = lin(vec3(62.0,78.0,120.0)/255.0); nn = facet(nn, 3.0); }
    else if (id < 6.5) alb = lin(vec3(240.0,200.0,164.0)/255.0);
    else if (id < 7.5) alb = lin(vec3(150.0,104.0,66.0)/255.0);
    else if (id < 8.5) alb = lin(vec3(204.0,110.0,70.0)/255.0);
    else { alb = lin(vec3(246.0,204.0,62.0)/255.0); nn = facet(nn, 2.5); }
    col = shade(pp, nn, rd, alb, L, key, skyF, bnc, 0.1);
    col = pow(max(col,0.0), vec3(0.4545));
  } else if (win) {
    col = outside(rd);
    float fr = step(abs(pos.x+0.1), 0.03) + step(abs(pos.y-1.55), 0.03);
    col = mix(col, vec3(0.97), clamp(fr,0.0,1.0));
  } else {
    float sh = mix(0.45, 1.0, softShadow(pos+n*0.01, L, 8.0));
    float sky = 0.6 + 0.4*n.y;
    col = lin(a)*(key*0.75*sh*clamp(dot(n,L)*0.5+0.6,0.0,1.0) + skyF*sky);
    col = pow(max(col,0.0), vec3(0.4545));
    if (tw == tf.y && rd.y > 0.0 && abs(pos.x-0.2) < 0.5 && abs(pos.z+1.2) < 0.5) col = vec3(1.0,0.99,0.94);
  }
  return vec4(col, 1.0);
}
