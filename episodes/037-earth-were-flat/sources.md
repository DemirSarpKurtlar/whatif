# Sources / math — 037 What if Earth were actually flat?

Model used for the numbers (python, /tmp/calc_037/disc.py + pot.py): a uniform disc with Earth's mass (5.97e24 kg) and Earth's volume,
radius 20,000 km (the usual "flat-earth map": north pole in the centre, Antarctica as the rim) → thickness ≈ 860 km, density 5,510 kg/m³.
Gravity integrated numerically over the disc volume.

- **Gravity points to the centre of mass, i.e. toward the middle of the disc.** Tilt of gravity from "straight down" on the top surface:
  0° at the centre, 16° at half-way, 28° at 75 %, 41° at 90 %, ≈ 59° at 98 % of the radius (→ "near the rim, like a sixty-degree slope").
  Over the rim the pull is fully sideways (90°).
  - ScienceABC, "If Earth were flat, would you fall off its edge?": walking toward the rim would feel like a steep uphill climb —
    https://www.scienceabc.com/nature/universe/if-earth-were-flat-would-you-fall-off-its-edge-and-into-space.html
  - Univ. of Leicester Physics Special Topics (2023): an observer on a flat Earth would need to stand and walk at an angle —
    https://journals.le.ac.uk/index.php/pst/article/download/4494/3826/15027
  - Side fact (not in the script): on this disc, g at the centre is only ≈ 1.9 m/s² (≈ 2GM/R² for a wide slab), about 1/5 of today.
- **Air slides "downhill" to the middle.** Gravitational potential at 98 % of the radius is ≈ 1.3e7 J/kg higher than at the centre
  (= climbing ~6,500 km at g ≈ 2 m/s²); the air's scale height at g ≈ 1.9 m/s² is only ~43 km, so the atmosphere pools as a
  dome over the centre and the rim region is effectively airless ("nothing to breathe").
- **Sun lights the whole disc at once / no time zones.** A distant Sun illuminates a flat face at the same angle everywhere, so sunrise
  and sunset happen at the same moment for every point on that face (time zones only exist because a sphere turns different parts
  toward the Sun at different times). https://en.wikipedia.org/wiki/Time_zone
- **It would collapse into a ball in about an hour.** Caltech planetary scientist Dave Stevenson (via Gizmodo / The A.V. Club):
  a flattened Earth would collapse from a hockey-puck shape to a sphere on a timescale of about an hour, catastrophically.
  - https://gizmodo.com/what-if-the-earth-suddenly-turned-flat-1795819464
  - https://avclub.com/read-this-what-would-happen-if-the-world-actually-beca-1798263176
  - Own check: rim material feels ≈ 3 m/s² inward; t ≈ √(2·20,000 km / 3 m/s²) ≈ 3,650 s ≈ 1 hour. The radial stress (~ρ·g·R ≈ 300 GPa)
    is ~1,000× the compressive strength of rock (~0.2 GPa), so rock cannot hold the shape.
- **That's why planets are round (hydrostatic equilibrium).** Self-gravity pulls bodies round above roughly 200 km radius (icy) to
  400 km radius (rocky); rounding is not guaranteed below a few hundred km.
  - Big Think / Starts With A Bang: https://bigthink.com/starts-with-a-bang/round-allowable-shape-planets/
  - https://bigthink.com/starts-with-a-bang/why-planets-round/
  - https://australiascience.tv/education/why-are-stars-planets-and-moons-round/
  - https://en.wikipedia.org/wiki/Hydrostatic_equilibrium
- Earth is in fact an oblate spheroid; this is a physics thought experiment (no mockery intended).
