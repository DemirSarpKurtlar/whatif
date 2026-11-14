# Sources / numbers — What if the Moon were twice as close?
Simplified scenario: same Moon, same orbit shape and tilt, only the distance halves (384,400 km → 192,200 km). All numbers are
recomputed in `calc.py` (run `python3 calc.py`).

- Mean Earth–Moon distance 384,400 km; Moon radius 1,737 km; Moon's apparent diameter ≈ 0.52°.
  NASA Moon fact sheet: https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
  → at 192,200 km the disc is 1.04° wide: **2× wider, 4× the area** (and ~2× the Sun's 0.53°).
- Tide-generating force varies with the inverse **cube** of distance (NOAA): https://oceanservice.noaa.gov/education/tutorial_tides/tides02_cause.html
  Sun's tidal pull ≈ 0.46 of the Moon's (HyperPhysics: https://hyperphysics.gsu.edu/hbase/tide.html).
  → half the distance = 2³ = **8× the lunar tidal pull**. Equilibrium lunar tide 0.36 m → 2.85 m. With a (simplified) linear ocean
  response a lunar-dominated **2 m tidal range becomes ~16 m** (spring tides ×5.8, neap tides ×14 because the Sun's share shrinks).
  Real coasts would also re-resonate; this is a first-order estimate.
- Tides follow the Moon: the lunar day becomes 26.7 h (Moon now moves faster across the sky), so high tide every **~13.3 h** (today 12.4 h).
- Kepler's third law T ∝ a^1.5: sidereal month 27.3 d → **9.65 d** (phases repeat every 9.9 d). Orbital speed 1.02 → 1.45 km/s.
  https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion
- Full-Moon brightness ∝ 1/d² (Sun distance unchanged) → **4× brighter** (−12.7 → −14.2 mag).
- Eclipses today: on average ~2.4 solar eclipses a year; a **total** one somewhere every ~18 months (≈0.7/yr), central (total+annular)
  ≈1.5/yr. https://www.timeanddate.com/eclipse/how-often-solar-eclipse.html , https://eclipsewise.com/solar/SEhelp/SEstatistics.html ,
  https://www.space.com/25644-total-solar-eclipses-frequency-explained.html
  → calc.py geometry Monte-Carlo (validated: gives 1.47 central/yr for today's orbit) gives **~10 total eclipses a year** at 192,200 km;
  the Moon (1.01–1.04°) always out-sizes the Sun, so there are no annular eclipses. Umbra on the ground ≈1,750 km wide (today ≤ ~270 km),
  ground speed ≈1 km/s → totality up to **~30 min** (today's maximum 7.5 min).
- Tidal braking torque on Earth ∝ M²/d⁶ → **64×**. Today's tidal friction lengthens the day by 2.3 ms per century (Stephenson et al. 2016,
  Proc. R. Soc. A, https://pmc.ncbi.nlm.nih.gov/articles/PMC5247521/) → ~147 ms per century ≈ 25 min per million years.
  Moon's recession (3.8 cm/yr today) ∝ a^−5.5 → ~1.7 m/yr. Fluid Roche limit ≈18,000 km, far inside 192,200 km → the Moon is safe.
