// Inside a vertical shaft through the Earth, looking down the axis while falling.
// params: u_depth (km from the entry pole, 0..12714), u_speed (0..1 streak strength),
//         u_look (0 = straight down, 1 = tilted toward the wall), u_roll, u_sky (0..1 opening visible above)
vec2 map(vec3 p){ return vec2(1e9, 0.0); }
float h3(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float n3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z); }
// rock colour by depth below the entry surface (km); symmetric about the centre (6357 km)
vec3 layerCol(float km, out float glow){
  float r = abs(6357.0 - km);            // distance from Earth's centre (km)
  float dEarth = 6357.0 - r;              // depth below the nearest surface
  vec3 crust = vec3(0.42,0.36,0.30), mantleTop = vec3(0.55,0.28,0.16), mantleDeep = vec3(0.85,0.36,0.12);
  vec3 outer = vec3(1.0,0.62,0.22), inner = vec3(1.0,0.93,0.72);
  vec3 c = crust; glow = 0.0;
  if (dEarth > 35.0) { float k = clamp((dEarth-35.0)/2850.0,0.0,1.0); c = mix(mantleTop, mantleDeep, k); glow = 0.15 + 0.5*k; }
  if (r < 3480.0) { c = outer; glow = 1.0; }
  if (r < 1220.0) { c = inner; glow = 1.4; }
  return c;
}
vec4 pixel(vec2 uv){
  vec2 p = screenP(uv, 0.0);
  p = rot(u_roll) * p;
  vec3 ro = vec3(0.0);
  float tilt = 0.25 + 0.9*u_look;
  vec3 ta = vec3(sin(tilt)*1.0, -cos(tilt)*1.0, 0.001);
  vec3 rd = camRay(p, ro, ta, 0.9);
  float R = 3.0;
  float a = dot(rd.xz, rd.xz);
  float t = 1e9;
  if (a > 1e-6) t = R / sqrt(a);
  vec3 hit = ro + rd*t;
  float ang = atan(hit.z, hit.x);
  // world y below camera in metres -> km depth along the wall
  float yKm = u_depth - hit.y*0.001*40.0;       // exaggerate so strata pass visibly
  float glow;
  vec3 base = layerCol(yKm, glow);
  float strat = n3(vec3(ang*3.0, yKm*0.9, 1.0))*0.6 + n3(vec3(ang*9.0, yKm*3.1, 4.0))*0.4;
  float cracks = smoothstep(0.62,0.7,n3(vec3(ang*6.0, yKm*0.4, 9.0)));
  vec3 col = base*(0.45+0.55*strat);
  // scrolling rings make the fall readable
  float yy = hit.y + u_time*(2.0+60.0*u_speed);
  float ring = smoothstep(0.0,0.12,fract(yy/2.5))*smoothstep(1.0,0.85,fract(yy/2.5));
  col *= 0.55+0.45*ring;
  float streak = n3(vec3(ang*40.0, yy*0.08, 2.0));
  col *= 1.0 + u_speed*0.3*(streak-0.5);
  float dist = t;
  float lamp = 1.3/(1.0+0.06*dist*dist);
  vec3 hot = vec3(1.0,0.42,0.1)*glow*0.55;
  col = col*(lamp + 0.35*glow) + hot*(0.15+0.35*cracks)/(1.0+0.02*dist*dist);
  vec3 fogC = mix(vec3(0.01,0.01,0.015), vec3(0.35,0.12,0.03), clamp(glow*0.8,0.0,1.0));
  col = mix(col, fogC, smoothstep(3.0, 40.0, dist));
  col = col/(1.0+col*0.6);
  // looking along the axis: far end
  if (rd.y < -0.999) col = fogC;
  // the opening above (sky disk) when looking up early in the fall
  if (rd.y > 0.0 && u_sky > 0.0) {
    float r2 = length(rd.xz/rd.y);
    float disk = smoothstep(u_sky*0.5+0.015, u_sky*0.5, r2);
    col = mix(col, mix(vec3(0.68,0.8,0.95), vec3(0.95,0.97,1.0), smoothstep(0.0, u_sky*0.5, u_sky*0.5-r2)), disk);
    col += vec3(0.7,0.8,0.95)*0.25*exp(-max(r2-u_sky*0.5,0.0)*6.0)*u_sky;
  }
  col = pow(max(col,0.0), vec3(0.95));
  col += (hash2(uv*u_resolution+fract(u_time)*91.0)-0.5)*0.025;
  return vec4(col, 1.0);
}
