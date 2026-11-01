# Sources / math — 027 the Sun turns into a black hole
- Schwarzschild radius r_s = 2GM/c² with M☉ = 1.989e30 kg → 2.95 km, so the black hole would be ≈ 5.9 km (~6 km) across.
  The Sun today is ~696,000 km in radius, ≈ 236,000 times larger. https://en.wikipedia.org/wiki/Schwarzschild_radius · https://arxiv.org/pdf/1911.06608
- Orbit unchanged: outside a spherically symmetric mass the field depends only on the mass and the distance
  (shell theorem / Birkhoff's theorem). Same mass → same pull at 1 AU → Earth keeps orbiting at ≈ 29.8 km/s.
  https://en.wikipedia.org/wiki/Shell_theorem · https://interestingengineering.com/videos/if-the-sun-became-a-black-hole-would-earth-fall-in · https://thevlm.org/black-hole-sun/
- Light delay: 1 AU / c = 1.496e11 m / 2.998e8 m/s = 499 s ≈ 8 min 19 s (usually rounded to 8 min 20 s). Light already
  in flight keeps arriving, so the sky looks normal until then; then it goes dark at once (no sunset, Earth still turns normally).
  https://en.wikipedia.org/wiki/Astronomical_unit
- Cooling (no sunlight; figures from Caltech's David Stevenson for the "Sun switches off" case): average surface temperature
  falls below 0 °F (≈ −18 °C, a home freezer) within about a week; ~200 K (−73 °C) after a year; the ocean surface freezes
  over within about a year while deep water stays liquid under the insulating ice for a very long time.
  https://www.popsci.com/science/article/2013-07/if-sun-went-out-how-long-could-life-earth-survive/ ·
  https://experts.caltech.edu/news/caltech-question-month-if-sun-ceased-exist-right-now-how-long-would-mankind-survive-would
- Invisible: 5.9 km seen from 1 AU subtends ≈ 0.008 arcseconds (the naked eye resolves ~60 arcseconds). With almost nothing
  falling in, there is no bright accretion disk; it only lenses a tiny patch of background stars.
- Simplifications: the Sun cannot actually become a black hole (too little mass, it will end as a white dwarf); we assume all mass
  is kept and the collapse is instantaneous and spherical.
- Math checked with python (G = 6.674e-11, c = 2.998e8, AU = 1.496e11 m).
