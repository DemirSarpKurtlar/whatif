# Sources / math — 051 What if Earth's gravity was cut in half? (Gravity Part 5)
All numbers checked with `calc.py` in this folder (g = 9.81 → 4.905 m/s²).
**Model (stated on the end card): Earth's MASS is halved instantly, its size stays the same**, so surface gravity halves and GM halves.
(If Newton's G halved instead, the Sun's pull on Earth would halve too and Earth itself would leave the Sun — not our scenario.)
The atmosphere and oceans keep their mass. Bodies adapt only over time (bones, trees); everything else is instant.

## You
- Weight = m·g: 70 kg → feels like **35 kg** ("seventy kilos feels like thirty-five").
- Jump: with the same take-off speed v, height h = v²/2g → **doubles**; airtime 2v/g doubles. A typical standing vertical jump of
  ~0.4–0.5 m (untrained men average ~45 cm) → v = 3.13 m/s → **0.50 m → 1.00 m**, airtime 0.64 s → 1.28 s.
  (Real legs would do slightly better: less body weight to push during take-off, so "doubles" is a lower bound.)
  https://www.topendsports.com/testing/norms/vertical-jump.htm · https://marathonhandbook.com/average-vertical-jump/
- Dunk: rim 10 ft = 3.05 m; an average man (~1.75 m) has a standing reach of ~1.33 × height ≈ 2.33 m. Peak hand height
  2.83 m today (no dunk) → **3.33 m at half g**, ≥ ~3.20 m needed to put the ball through → "the average man can dunk".
  https://en.wikipedia.org/wiki/Basketball_court (rim height 3.05 m) · https://en.wikipedia.org/wiki/Slam_dunk
- Falling: impact speed v = √(2gh) → × 1/√2 = 0.707 → **29 % slower**; fall time × √2 (+41 %). Phone from 1.2 m: 4.85 → 3.43 m/s,
  0.49 s → 0.70 s. https://en.wikipedia.org/wiki/Free_fall

## Air
- Surface pressure = weight of the air column per area = M_atm·g/A. Same air, half the weight → **101.3 → 50.7 kPa**.
  That equals today's pressure ~5,480 m up (ISA) — **Everest Base Camp (South, 5,364 m) is ~51–54 kPa** → "like breathing at
  Everest Base Camp". Air is still 21 % oxygen, but each breath has half the molecules. Water would boil at ~82 °C.
  The scale height RT/Mg doubles (8.4 → 16.9 km): the air spreads twice as high.
  https://en.wikipedia.org/wiki/Atmospheric_pressure · https://en.wikipedia.org/wiki/Barometric_formula
  · https://himalayanhero.com/blog/how-high-is-everest-base-camp/ (5,364 m, ~540 mb)
- Leaking into space: escape velocity √(2GM/R) **11.2 → 7.9 km/s**. Jeans thermal-escape parameter for atomic O at a ~1000 K
  exobase drops 112 → 56: the loss rate rises by ~10²³× but is still slow — "over millions of years, air leaks into space"
  (Mars, v_esc 5.0 km/s, lost most of its air over billions of years).
  https://en.wikipedia.org/wiki/Escape_velocity · https://en.wikipedia.org/wiki/Atmospheric_escape

## Ocean
- Fully developed sea (Pierson–Moskowitz): H_s ≈ 0.21 U²/g and wavelength ∝ U²/g → for the same wind, **storm waves twice as tall**
  (20 m/s wind: 8.6 m → 17 m) and twice as long; their speed c = √(gL/2π) stays the same. They take longer to build up.
  https://wikiwaves.org/Ocean-Wave_Spectra · https://archive.nptel.ac.in/content/storage2/courses/114106028/Module-6.pdf
- Tides (caption only): the lunar tide leaves with the Moon; the equilibrium solar tide ∝ M_sun/M_earth doubles (0.25 → 0.49 m).

## Body & trees (slow)
- Bones and muscles adapt to load. In microgravity astronauts lose ~1–1.5 % bone mineral density per month and muscle mass; half g is
  a smaller unloading, so the expected direction is weaker, lighter bones and muscles over months–generations.
  https://ntrs.nasa.gov/citations/20170004598 · https://www.doi.org/10.1038/S41526-020-0103-2
- Trees: max height is limited by pulling water up against gravity (Koch et al. 2004, Nature 428:851: ~122–130 m today) and by
  buckling under their own weight (Greenhill: critical height ∝ (E/ρg)^(1/3) → × 2^(1/3) = **+26 %**). Half g relaxes both →
  "trees grow taller". https://www.nature.com/news/2004/040419/full/news040419-5.html · https://en.wikipedia.org/wiki/Buckling

## Orbits
- Circular orbit speed v = √(GM/r). After halving M, the escape speed at the same r is √(2·(GM/2)/r) = √(GM/r) = **exactly v**:
  every satellite in a circular orbit (ISS 7.66 km/s, GPS 3.87 km/s, GEO 3.07 km/s) is suddenly at escape speed and follows a
  parabola (r = 2q/(1+cos ν), Barker's equation) outward. Shown with compressed radii.
  https://en.wikipedia.org/wiki/Orbital_speed · https://en.wikipedia.org/wiki/Parabolic_trajectory
- Moon (its own 1.23 % mass included): from perigee it is unbound outright; from mean distance its new orbit reaches ~32 million km,
  far beyond Earth's Hill sphere (1.50 → 1.19 million km), so the Sun pulls it away → "even the Moon drifts away".
  https://en.wikipedia.org/wiki/Hill_sphere · https://en.wikipedia.org/wiki/Orbit_of_the_Moon
- Previous parts: 020 (gravity off 1 min), 024 (doubled), 047 (reversed for 1 s).
