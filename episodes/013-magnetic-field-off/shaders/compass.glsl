// A brass compass on a wooden table, seen from above at a slight angle.
// params: u_needle (needle angle, radians), u_wobble (0..1 aimless drift), u_rot (camera roll), u_zoom (0.8..1.6), u_tilt (perspective)
vec2 map(vec3 p){ return vec2(1e9, 0.0); }
vec4 pixel(vec2 uv){
  vec2 p = screenP(uv, 0.0);
  p = rot(u_rot)*p;
  p.y *= 1.0 + u_tilt*0.35; p.y += u_tilt*0.08;
  p /= u_zoom;
  // wood
  vec2 wq = rot(0.3)*p;
  float grainW = noise2(vec2(wq.x*3.0, wq.y*40.0))*0.6 + noise2(wq*vec2(1.0,9.0))*0.4;
  vec3 col = mix(vec3(0.24,0.13,0.07), vec3(0.42,0.25,0.13), grainW);
  float r = length(p);
  // drop shadow
  col *= 1.0 - 0.55*smoothstep(0.47, 0.36, length(p - vec2(0.02,-0.025)));
  // brass ring
  float ring = smoothstep(0.405, 0.4, r) * smoothstep(0.33, 0.335, r);
  vec3 brass = mix(vec3(0.55,0.38,0.12), vec3(0.95,0.78,0.4), 0.5 + 0.5*sin(atan(p.y,p.x)*1.0 + 1.2));
  col = mix(col, brass, ring);
  // dial
  if (r < 0.335) {
    vec3 dial = mix(vec3(0.93,0.9,0.82), vec3(0.8,0.76,0.66), r*2.2);
    float a = atan(p.y, p.x);
    float tick = step(0.29, r)*smoothstep(0.012, 0.0, abs(fract(a/6.2832*72.0 + 0.5) - 0.5)*r*0.09/0.012*0.012*8.0);
    float big = step(0.25, r)*smoothstep(0.02, 0.0, abs(fract(a/6.2832*8.0 + 0.5) - 0.5)*r*0.8);
    dial = mix(dial, vec3(0.15,0.12,0.1), max(tick*0.8, big));
    // N marker
    vec2 nm = p - vec2(0.0, 0.265);
    float tri = max(abs(nm.x)*2.2 + nm.y, -nm.y - 0.035);
    dial = mix(dial, vec3(0.8,0.12,0.1), smoothstep(0.004, 0.0, tri - 0.03));
    // compass rose
    float rose = abs(sin(a*4.0))*0.08 + 0.02;
    dial = mix(dial, vec3(0.75,0.7,0.6), smoothstep(0.005, 0.0, r - rose - 0.1)*0.35);
    col = dial;
    // needle
    float ang = u_needle + u_wobble*(1.6*sin(u_time*0.9) + 0.9*sin(u_time*2.3 + 1.0));
    vec2 q = rot(-ang)*p;
    float half1 = abs(q.x)*7.0 + abs(q.y) - 0.24;
    float needle = smoothstep(0.004, 0.0, half1);
    vec3 nc = q.y > 0.0 ? vec3(0.82,0.1,0.08) : vec3(0.92,0.92,0.9);
    nc *= 0.8 + 0.4*step(0.0, q.x);
    col = mix(col*(1.0 - 0.4*smoothstep(0.02, 0.0, half1 + 0.01)), nc, needle);
    col = mix(col, vec3(0.75,0.6,0.3), smoothstep(0.02, 0.016, r));
    // glass highlight
    col += vec3(1.0)*0.18*smoothstep(0.2, 0.0, length(p - vec2(-0.12, 0.14)))*smoothstep(0.33, 0.3, r);
  }
  col *= 1.0 - 0.35*smoothstep(0.5, 1.1, length(p));
  return vec4(col, 1.0);
}
