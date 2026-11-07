# calc.py — Episode 051: What if Earth's gravity was cut in half? (Gravity Part 5)
# Model: Earth's MASS is halved instantly, radius unchanged -> surface g halves (9.81 -> 4.905 m/s^2) and GM_E halves.
# (If instead G itself halved, the Sun's grip would halve too and Earth would leave the Sun: not our scenario.)
import math
g = 9.81; g2 = g / 2
print("== weight ==")
print(f"70 kg person: weight {70*g:.0f} N -> {70*g2:.0f} N, feels like {70*g2/g:.0f} kg")

print("== jumping (same take-off speed; real legs would do slightly better: less weight to push) ==")
h = 0.50                                 # typical untrained adult standing vertical jump ~0.4-0.6 m
v = math.sqrt(2 * g * h)
h2 = v * v / (2 * g2)
print(f"take-off {v:.2f} m/s: height {h:.2f} m -> {h2:.2f} m ; airtime {2*v/g:.2f} s -> {2*v/g2:.2f} s")
reach = 1.33 * 1.75                      # standing reach ~1.33 x height, average man 1.75 m
rim = 3.048                              # 10 ft
need = rim + 0.15                        # hand ~15 cm above the rim to dunk
print(f"avg man reach {reach:.2f} m: normal peak reach {reach+h:.2f} m, half-g {reach+h2:.2f} m, dunk needs ~{need:.2f} m"
      f" -> {'DUNK' if reach+h2 >= need else 'no'}")

print("== falling ==")
d = 1.2                                  # phone dropped from hand height
for gg, n in ((g, "1 g"), (g2, "1/2 g")):
    print(f"{n}: phone from {d} m: t = {math.sqrt(2*d/gg):.3f} s, impact {math.sqrt(2*gg*d):.2f} m/s")
print(f"impact speed ratio {1/math.sqrt(2):.3f} -> {100*(1-1/math.sqrt(2)):.0f}% slower ; fall time x{math.sqrt(2):.3f} (+41%)")
vt = 200                                 # belly-to-earth skydiver terminal speed, km/h, v_t ~ sqrt(m g / (0.5 rho Cd A))
print(f"skydiver terminal speed (same air density) {vt} -> {vt/math.sqrt(2):.0f} km/h ; with surface air density also halved -> {vt:.0f} km/h")

print("== air ==")
p0 = 101325.0
p = p0 / 2                               # same mass of air, half the weight -> half the surface pressure
print(f"surface pressure {p0/1000:.1f} -> {p/1000:.1f} kPa (column weight per area M_atm*g/A)")
def isa(z):                              # ISA troposphere pressure at altitude z (m)
    return p0 * (1 - 2.25577e-5 * z) ** 5.25588
z = 0
while isa(z) > p: z += 1
print(f"same pressure as ISA altitude {z} m today; Everest Base Camp (5364 m) ISA {isa(5364)/1000:.1f} kPa")
Rd, T = 287.05, 288.15
print(f"scale height RT/g {Rd*T/g/1000:.1f} km -> {Rd*T/g2/1000:.1f} km (air spreads twice as high)")
# boiling point at that pressure (Antoine, water, 1-100 C)
A, B, C = 8.07131, 1730.63, 233.426
Tb = B / (A - math.log10(p / 133.322)) - C
print(f"water boils at {Tb:.0f} C")

print("== escape & orbits ==")
GM = 3.986004e14; R = 6.371e6
ve = math.sqrt(2 * GM / R); ve2 = math.sqrt(2 * GM / 2 / R)
print(f"escape velocity {ve/1000:.2f} -> {ve2/1000:.2f} km/s")
# Jeans escape parameter for atomic O at a ~1000 K exobase (~500 km)
k = 1.380649e-23; mO = 16 * 1.6605e-27; rx = R + 500e3
vp = math.sqrt(2 * k * 1000 / mO)
lam1 = GM / rx / vp**2 * 2 / 2 * 2      # lambda = GM m/(k T r) = 2 GM/(r vp^2)
lam1 = 2 * GM / (rx * vp**2); lam2 = lam1 / 2
flux = lambda L: (1 + L) * math.exp(-L)
print(f"Jeans lambda (O, 1000 K): {lam1:.0f} -> {lam2:.0f}; thermal escape flux x{flux(lam2)/flux(lam1):.1e} (still slow -> geologic time)")
# Every circular orbit: v = sqrt(GM/r). New escape speed there: sqrt(2*(GM/2)/r) = sqrt(GM/r) = v. Exactly escape speed.
for name, alt in (("ISS", 420e3), ("GPS", 20200e3), ("GEO", 35786e3)):
    r = R + alt; vc = math.sqrt(GM / r); vesc_new = math.sqrt(2 * (GM / 2) / r)
    print(f"{name}: orbital speed {vc/1000:.2f} km/s, new escape speed {vesc_new/1000:.2f} km/s -> ratio {vc/vesc_new:.3f}")
# The Moon: two-body mu includes the Moon's own mass (Mm/ME = 0.0123); take mean distance & speed.
mME = 0.012300
mu = GM * (1 + mME); mu2 = GM * (0.5 + mME)
a_m = 384400e3
for rr, nm in ((363300e3, "perigee"), (a_m, "mean"), (405500e3, "apogee")):
    vv = math.sqrt(mu * (2 / rr - 1 / a_m))             # vis-viva on today's orbit
    E = vv * vv / 2 - mu2 / rr
    if E >= 0:
        print(f"Moon at {nm}: v {vv:.0f} m/s, energy >= 0 -> UNBOUND, escapes")
    else:
        a2 = -mu2 / (2 * E); print(f"Moon at {nm}: v {vv:.0f} m/s, new a = {a2/1e9:.1f} million km, apoapsis ~{(2*a2-rr)/1e9:.1f} million km")
au = 1.496e11; Ms_ME = 332946
for f, nm in ((1, "today"), (0.5, "half mass")):
    print(f"Earth Hill sphere ({nm}): {au*(f/(3*Ms_ME))**(1/3)/1e9:.2f} million km")
print(" -> any new Moon orbit reaches far beyond the Hill sphere: the Sun takes it, the Moon drifts away")

print("== ocean ==")
# fully developed sea (Pierson-Moskowitz): Hs ~ 0.21 U^2 / g ; deep-water wave speed c = sqrt(g L / 2 pi)
U = 20.0
print(f"20 m/s wind: Hs {0.21*U*U/g:.1f} m -> {0.21*U*U/g2:.1f} m (x2); same-wavelength wave speed x{1/math.sqrt(2):.2f}")
# equilibrium solar tide ~ (3/2)(Ms/ME)(R/d)^3 R  -> doubles when M_E halves; lunar tide leaves with the Moon
hs = 1.5 * Ms_ME * (R / au) ** 3 * R; hm = 1.5 * mME * (R / a_m) ** 3 * R
print(f"equilibrium tides today: Moon {hm:.2f} m, Sun {hs:.2f} m ; after: Moon -> 0 (gone), Sun -> {2*hs:.2f} m")

print("== trees ==")
# Greenhill elastic buckling: critical height ~ (E/(rho g))^(1/3) d^(2/3) -> x 2^(1/3)
print(f"buckling-limited max height x{2**(1/3):.2f} (+{100*(2**(1/3)-1):.0f}%) ; hydrostatic water-column tension per metre "
      f"{1000*g/1e6:.4f} -> {1000*g2/1e6:.4f} MPa/m")
