// The Sun collapsing into a bare (diskless) black hole, adapted from ep 022's lensed black hole.
// Units: event horizon radius = 1.  params: u_dist camera distance, u_orb azimuth, u_tilt elevation (rad),
// u_srad radius of the glowing Sun sphere (collapses toward 1), u_sun Sun visibility 0..1, u_ring photon-ring glow,
// u_glow white-hot bloom during the collapse, u_tx look-at x offset, u_lens lens (0 -> 1.5)
vec2 map(vec3 p){ return vec2(1e9, 0.0); }
float bhH(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
vec3 bhStars(vec3 rd){
  vec2 q = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)))*130.0;
  vec2 c = floor(q); vec2 f = fract(q)-0.5; float h = bhH(c);
  float s = h > 0.965 ? smoothstep(0.32,0.0,length(f))*(0.35+0.65*bhH(c+3.0)) : 0.0;
  vec3 tint = mix(vec3(0.75,0.85,1.0), vec3(1.0,0.85,0.7), bhH(c+7.0));
  float band = exp(-pow(rd.y*3.0 + 0.4*sin(atan(rd.z,rd.x)*2.0), 2.0))*0.08;
  float neb = noise2(vec2(atan(rd.z,rd.x)*6.0, rd.y*9.0));
  return tint*s + vec3(0.35,0.4,0.6)*band*(0.5+neb) + vec3(0.25,0.12,0.3)*band*0.6*smoothstep(0.5,0.9,neb);
}
vec3 sunSurf(vec3 n, vec3 rd){
  float mu = clamp(dot(n, -rd), 0.0, 1.0);
  float gr = 0.75*noise2(n.xy*18.0+n.z*7.0+u_time*0.3) + 0.25*noise2(n.yz*55.0-u_time*0.5);
  vec3 c = mix(vec3(1.0,0.36,0.05), vec3(1.0,0.86,0.55), pow(mu,0.6));
  c *= 0.82 + 0.3*gr;
  float hot = clamp(u_glow, 0.0, 1.0);
  return mix(c, vec3(1.0,0.97,0.92)*1.6, hot*0.7)*1.15;
}
vec4 pixel(vec2 uv){
  vec2 sp = screenP(uv, 0.0);
  float el = u_tilt;
  vec3 ro = vec3(sin(u_orb)*cos(el), sin(el), cos(u_orb)*cos(el))*u_dist;
  vec3 ta = vec3(u_tx, 0.0, 0.0);
  vec3 rd = camRay(sp, ro, ta, u_lens > 0.0 ? u_lens : 1.5);
  float R = max(u_srad, 1.0);
  float S = clamp(u_sun, 0.0, 1.0);
  vec3 p = ro; vec3 v = rd;
  vec3 hcross = cross(p, v); float h2 = dot(hcross, hcross);
  float absorbed = 0.0; vec3 col = vec3(0.0); float hitSun = 0.0;
  // bend only outside the Sun's surface (outside a spherical mass the field is the same as a black hole's)
  for (int i=0;i<150;i++){
    float r = length(p);
    float dt = clamp((r - (S > 0.01 ? R : 1.0))*0.25 + r*0.03, 0.015, 0.8);
    vec3 a = -1.5*h2*p/pow(r,5.0);
    v += a*dt; p += v*dt;
    float rn = length(p);
    if (S > 0.01 && rn < R) { hitSun = 1.0; break; }
    if (rn < 1.0) { absorbed = 1.0; break; }
    if (rn > u_dist*2.5 && dot(p,v) > 0.0) break;
  }
  vec3 bg = bhStars(normalize(v));
  if (hitSun > 0.5) col = mix(bg, sunSurf(normalize(p), normalize(v)), S);
  else if (absorbed > 0.5) col = vec3(0.0);
  else col = bg;
  // corona / glow around the Sun (closest approach of the straight ray)
  float b0 = length(cross(ro, rd));
  float dc = max(b0 - R, 0.0)/R;
  col += vec3(1.0,0.62,0.25)*exp(-dc*5.0)*0.55*S*(1.0-hitSun) + vec3(1.0,0.75,0.45)*exp(-dc*1.4)*0.12*S;
  // photon ring
  float b = sqrt(h2)/length(rd);
  col += vec3(1.0,0.85,0.65)*exp(-abs(b-2.6)*9.0)*0.22*u_ring*(1.0-hitSun);
  col += vec3(1.0,0.9,0.75)*u_glow*0.25*exp(-max(b-1.0,0.0)*0.6);
  col = 1.0 - exp(-col*1.25);
  return vec4(col, 1.0);
}
