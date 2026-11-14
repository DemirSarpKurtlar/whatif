# Episode 056 — What if the Moon were twice as close?  Physics check (simplified: same Moon, same orbit shape/inclination,
# only the semi-major axis halves; Earth's rotation unchanged at the moment of the switch).
import math, random
G = 6.674e-11
ME, MM, MS = 5.972e24, 7.342e22, 1.989e30
RE, RM, RS = 6371e3, 1737.4e3, 696000e3
AU = 1.496e11
a0 = 384400e3
a1 = a0 / 2
DAY = 86400.0
YEAR = 365.25 * DAY

print("== distance & size ==")
print(f"new distance: {a1/1e3:,.0f} km")
ang = lambda a: math.degrees(2 * math.atan(RM / (a - RE)))   # seen from the surface (sub-lunar point)
ang_c = lambda a: math.degrees(2 * math.atan(RM / a))
sun = math.degrees(2 * math.atan(RS / AU))
print(f"angular diameter (from Earth's centre): {ang_c(a0):.3f} deg -> {ang_c(a1):.3f} deg  (x{ang_c(a1)/ang_c(a0):.2f}); area x{(ang_c(a1)/ang_c(a0))**2:.2f}")
print(f"Sun's angular diameter: {sun:.3f} deg")

print("\n== tides ==")
tid = lambda m, d: 2 * G * m * RE / d**3        # differential (tidal) acceleration at Earth's surface
t0, t1, ts = tid(MM, a0), tid(MM, a1), tid(MS, AU)
print(f"lunar tidal accel: {t0:.3e} -> {t1:.3e} m/s^2  (x{t1/t0:.1f}); solar: {ts:.3e} (sun/moon today {ts/t0:.2f})")
# equilibrium tide amplitude (M2-like) h = (3/2)(M/ME)(RE/d)^3 RE  (degree-2 amplitude at sub-lunar point)
heq = lambda m, d: (m / ME) * (RE / d) ** 3 * RE
print(f"equilibrium lunar tide height scale: {heq(MM,a0):.2f} m -> {heq(MM,a1):.2f} m")
print(f"spring-tide forcing (moon+sun): today {(t0+ts)/t0:.2f}, new {(t1+ts)/t0:.2f}  -> ratio x{(t1+ts)/(t0+ts):.1f}")
print(f"neap-tide forcing (moon-sun):   ratio x{(t1-ts)/(t0-ts):.1f}")
print(f"mean (lunar-dominated) range: 2 m tide -> {2*8:.0f} m (simplified linear ocean response)")

print("\n== orbit (Kepler III: T ∝ a^1.5) ==")
mu = G * (ME + MM)
T0 = 2 * math.pi * math.sqrt(a0**3 / mu) / DAY
T1 = 2 * math.pi * math.sqrt(a1**3 / mu) / DAY
syn = lambda T: 1 / (1 / T - 1 / 365.25)
print(f"sidereal month {T0:.2f} d -> {T1:.2f} d ; synodic (new moon to new moon) {syn(T0):.2f} d -> {syn(T1):.2f} d")
v0 = 2 * math.pi * a0 / (T0 * DAY); v1 = 2 * math.pi * a1 / (T1 * DAY)
print(f"orbital speed {v0/1e3:.2f} km/s -> {v1/1e3:.2f} km/s")
sid_day = 86164.1
lunar_day = lambda T: 1 / (1 / sid_day - 1 / (T * DAY)) / 3600
print(f"lunar day (moonrise to moonrise) {lunar_day(T0):.2f} h -> {lunar_day(T1):.2f} h ; high tide every {lunar_day(T0)/2:.2f} h -> {lunar_day(T1)/2:.2f} h")

print("\n== brightness ==")
print(f"full-moon illuminance ∝ 1/d^2 -> x{(a0/a1)**2:.1f}  ({2.5*math.log10(4):.2f} magnitudes brighter; -12.7 -> {-12.7-2.5*math.log10(4):.1f})")

print("\n== solar eclipses ==")
L = AU * RM / (RS - RM)                       # length of the Moon's umbra cone
for a in (a0, a1):
    x = a - RE                                 # Moon to sub-lunar surface
    r_umb = RM * (1 - x / L)                   # >0 total, <0 annular (antumbra)
    print(f"a={a/1e3:,.0f} km: umbra length {L/1e3:,.0f} km, umbra diameter at surface {2*r_umb/1e3:,.0f} km ({'total' if r_umb>0 else 'annular'})")
# apogee with today's eccentricity
e = 0.0549
x_ap = a1 * (1 + e) - RE
print(f"new apogee {a1*(1+e)/1e3:,.0f} km: Moon {math.degrees(2*math.atan(RM/x_ap)):.3f} deg vs Sun {sun:.3f} -> every central eclipse is total")
# totality duration (upper bound): umbra diameter / (shadow speed - equatorial rotation speed)
r_umb1 = RM * (1 - (a1 - RE) / L)
v_rot = 2 * math.pi * RE / sid_day
dur = 2 * r_umb1 / (v1 - v_rot) / 60
r_umb0 = RM * (1 - (a0 * (1 - e) - RE) / L)
dur0 = 2 * r_umb0 / (2 * math.pi * a0 * (1 - e) / (T0 * DAY) * math.sqrt((1 + e) / (1 - e)) - v_rot) / 60
print(f"max totality (shadow width / ground speed, equator): today ~{dur0:.1f} min (real record 7.5 min), new ~{dur:.0f} min")

# frequency: Monte-Carlo the geometry. Central/total eclipse somewhere on Earth if the shadow axis passes within
# RE + r_umb of Earth's centre: a*sin(beta) < RE + r_umb, beta = Moon's ecliptic latitude at new moon.
inc = math.radians(5.145)
def per_year(a, T, years=20000, seed=1):
    rnd = random.Random(seed)
    s = syn(T); node_rate = 360 / 18.6 / 365.25        # keep today's nodal regression (simplification)
    r_umb = max(RM * (1 - (a - RE) / L), 0.0)
    n_tot = n_any = 0
    t = 0.0; node = rnd.uniform(0, 360)
    sun_rel = 360 / 365.25 + node_rate                  # Sun's motion relative to the node, deg/day
    phase = rnd.uniform(0, 360)
    nmoons = int(years * 365.25 / s)
    for k in range(nmoons):
        u = math.radians(phase + k * s * sun_rel)       # Sun's (=new Moon's) argument from the node
        beta = math.asin(math.sin(inc) * math.sin(u))
        d = a * abs(math.sin(beta))
        if d < RE + r_umb: n_tot += 1
        if d < RE + RM + (RS - RM) * (a / AU) + RM: n_any += 1   # penumbra touches Earth (partial somewhere)
    return n_tot / years, n_any / years
c0 = per_year(a0 * 1.0, T0); c1 = per_year(a1, T1)
print(f"central eclipses / yr (shadow axis region hits Earth): today {c0[0]:.2f} (real: ~1.5 central, ~0.7 total), new {c1[0]:.1f} (all total)")
print(f"any solar eclipse / yr: today {c0[1]:.1f} (real 2-5), new {c1[1]:.1f}")

print("\n== tidal braking of Earth's spin (torque ∝ M^2 / d^6, same ocean dissipation) ==")
k = (a0 / a1) ** 6
print(f"torque x{k:.0f}")
lod_tidal = 2.3e-3   # s per century, tidal part today (Stephenson et al. 2016 ~2.3 ms/cy)
print(f"day lengthening {lod_tidal*1e3:.1f} ms/century -> {lod_tidal*k*1e3:.0f} ms/century = {lod_tidal*k*1e4/60:.0f} min per million years (today {lod_tidal*1e4:.0f} s)")
rec = 3.82e-2  # m/yr lunar recession today (LLR)
print(f"Moon recession ∝ a^-5.5: 3.8 cm/yr -> {rec*2**5.5:.2f} m/yr")
roche = 2.44 * RE * (5514 / 3344) ** (1 / 3)
print(f"fluid Roche limit {roche/1e3:,.0f} km  << {a1/1e3:,.0f} km : the Moon is safe")
