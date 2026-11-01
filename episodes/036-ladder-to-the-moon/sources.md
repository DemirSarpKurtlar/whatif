# Sources / math — 036 What if you climbed a ladder to the Moon?

## Distances / speeds
- Mean Earth–Moon distance 384,400 km (semi-major axis 0.3844 million km); mean perigee 363,300 km, mean apogee 405,500 km;
  mean orbital velocity 1.023 km/s. NASA NSSDC Moon Fact Sheet: https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
  (archived copy: https://webarchive.library.unt.edu/eot2008/20080916005802/http://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html)
  · Space.com: https://www.space.com/18145-how-far-is-the-moon.html
  → apogee − perigee = 42,200 km on average (extremes 356,400–406,700 km = 50,300 km). Script says "forty thousand kilometres closer, then farther" (rounded down).
- Airliner cruise altitude ≈ 10–12 km (we use 11 km). https://en.wikipedia.org/wiki/Cruise_(aeronautics)
- Kármán line, conventional edge of space, 100 km. https://en.wikipedia.org/wiki/K%C3%A1rm%C3%A1n_line
- ISS: ~408 km altitude (it varies ~400–420 km), ~7.66 km/s, ~92 min per orbit. https://www.nasa.gov/reference/international-space-station-facts-and-figures/
  · check: v = √(GM/r) with r = 6,378 + 408 km → 7.664 km/s ("almost eight kilometres per second").
- GPS satellites: medium Earth orbit, ~20,200 km. https://www.gps.gov/systems/gps/space/
- Geostationary orbit: 35,786 km above the equator, period = 1 sidereal day. https://en.wikipedia.org/wiki/Geostationary_orbit

## Climb times (python, 30 cm per rung, 1 rung per second = 0.30 m/s, non-stop)
| milestone | altitude | time |
|---|---|---|
| airliners | 11 km | 10.2 h ("ten hours") |
| Kármán line | 100 km | 3.86 days ("day four") |
| ISS | 408 km | 15.7 days ("day sixteen") |
| GPS | 20,200 km | 2.13 years ("two years") |
| geostationary | 35,786 km | 3.78 years ("nearly four years") |
| Moon | 384,400 km | 40.6 years ("forty years") |

## Why you float at geostationary altitude
- A ladder fixed to the equator turns with the Earth once per sidereal day (ω = 7.292e-5 rad/s).
  At r = 6,378 + 35,786 km: gravity GM/r² = 0.2242 m/s², centripetal requirement ω²r = 0.2242 m/s² → they cancel, net weight ≈ 0.
  (This is the same reason space-elevator designs balance at GEO.) https://en.wikipedia.org/wiki/Space_elevator

## Why the ladder fails
- The Moon's distance swings by ~42,000 km between perigee and apogee every ~27.5 days (anomalistic month), so a rigid ladder would be crushed or pulled apart; the Moon also orbits at ~1 km/s while the Earth spins under it once a day.
- Material strength: a steel column crushes under its own weight at roughly 3 km (250 MPa yield) to 13 km (1 GPa high-strength steel): h = σ / (ρ g), ρ = 7,850 kg/m³.
  Even a hanging space-elevator tether (only to ~36,000 km + counterweight) needs a specific strength beyond any bulk material produced today. https://en.wikipedia.org/wiki/Space_elevator#Cable_materials
- Simplifications: we ignore the Earth's rotation sweeping the ladder away from the Moon, air/vacuum survival, food etc. — it is a thought experiment.
