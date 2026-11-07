# Sources / math — 047 gravity reversed for 1 second (Gravity Part 4)
Checked with python (g = 9.81 m/s²). Model: for exactly 1 s, the gravitational acceleration on everything above the ground points
UP at 9.81 m/s²; then normal gravity returns. **Simplification (stated on the end card): the ground itself holds** — bedrock,
foundations and anything bolted down stay put; Earth's interior, rotation and soil/rock tensile limits are ignored.

## You (and every loose object)
- Kinematics: h = ½·g·t², v = g·t. After 1 s: **h = 4.905 m ("five metres")**, **v = 9.81 m/s = 35.3 km/h ("thirty-five km/h")**.
- Coasting after gravity returns: extra v²/2g = 4.905 m → **peak 9.81 m ("ten metres")** at t = 2.00 s.
  At ~3 m per storey that is 3.3 storeys → **"three storeys"**.
- Fall from the peak: t = √(2h/g) = 1.41 s; impact v = √(2gh) = 13.87 m/s = **49.9 km/h ("fifty km/h")**. Total airtime 3.41 s.
  https://en.wikipedia.org/wiki/Free_fall · https://en.wikipedia.org/wiki/Equations_of_motion
- In a uniform field everything loose accelerates the same, so people, cars, dogs and the water all rise together
  (cars, people, dogs: same 4.9 m / 9.8 m numbers; visuals add some tumbling for readability).
- Injury context for a ~10 m fall: falls ≥ 5 m have much lower survival odds than 2–3 m falls (Japanese cohort, OR 0.10);
  German series: deaths had a mean fall height of 8 m. We only say "three storeys at 50 km/h" — no survival claim.
  https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8324820/ · https://www.springermedizin.de/correlation-between-pattern-and-mechanism-of-injury-of-free-fall/9050984
- Indoors (simplified: 1.7 m tall person, 2.6 m ceiling): the head travels 0.9 m and hits after 0.43 s at 4.2 m/s ≈ 15 km/h,
  you are pressed to the ceiling for the rest of the second, then drop about a metre → "you'd only hit the ceiling".

## Water
- Lakes and oceans are not attached to their beds, so (same kinematics) the whole water layer accelerates upward with everything
  else: it peels off as one sheet, rises ~10 m and crashes back. Simplification: we ignore cavitation/boiling in the gap below the
  water and the details of how the sheet breaks up; visuals show a coherent slab + splash on return.

## Air ("the air pulls upward too, and your ears pop")
- In hydrostatic balance the pressure gradient force on air already points up (= ρg). Flip gravity and both push up → air parcels
  initially accelerate at ~2 g; the ground acts as a wall, so a rarefaction wave runs upward from the ground at the speed of sound.
- 1D Lagrangian simulation of a 40 km adiabatic (γ = 1.4) atmosphere column with a rigid ground, gravity flipped for 1 s
  (`calc.py` in this folder, 4000 cells): ground pressure drops **101.3 → 93.5 kPa (−7.7 %, −7.8 kPa)** after 1 s ≈ the pressure change of
  climbing ~680 m. Air at 1 km altitude moves up ~10 m and is rising at ~20 m/s.
- Ear popping: an ambient change of roughly 2 kPa (~20 mbar) can open the Eustachian tube / give a popping sensation; fast lifts and
  flights change ambient pressure by several kPa in seconds. 7.8 kPa in one second ⇒ ears pop. Far below eardrum-rupture levels.
  https://springerlink.bibliotecabuap.elogim.com/content/pdf/10.1007/978-1-4614-6591-1_5 (Quasi-static pressures in the middle ear cleft)
  · https://canadianaudiologist.ca/risk-factors-associated-with-environmental-pressure-changes-on-tympanic-membrane-rupture/?output=pdf
- Simplification: we ignore what the air does on the way back (a compression/overshoot as the column falls back).

## Anchored things / planes (visual only, not in the narration numbers)
- "Only things bolted down stay put": anchored structures only have to hold their own weight in tension for 1 s; we assume they do.
- Planes and birds already flying: lift + reversed gravity → extra ~9.8 m climb in that second; passengers' apparent weight is unchanged.

## Context
- Pop-science discussions of a 1-second gravity loss/reversal agree on the inertia reasoning (objects keep their velocity) and
  that it would be a jolt, not a planet-ending event: https://thescienceof.org/flash-gravity ·
  https://www.physicsforums.com/threads/can-gravitation-force-change-its-direction.7973
- Previous parts: 001/010-s (gravity off 10 s), 020 (1 minute), 024 (doubled).
