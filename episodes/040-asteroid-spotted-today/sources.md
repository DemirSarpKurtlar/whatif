# Sources / math — 040 What if a city-killer asteroid were spotted heading for Earth today?

## Detection (hour zero → day two)
- Survey telescopes that find near-Earth asteroids: ATLAS (Hawaii, Chile, South Africa), Catalina Sky Survey (Arizona), Pan-STARRS (Hawaii), and since 2025 the Vera C. Rubin Observatory (Chile).
  Rubin's first-look release (23 Jun 2025) already contained 2,104 previously unknown asteroids (7 near-Earth objects) from ~10 h of test data.
  https://www.foxweather.com/earth-space/vera-rubin-observatory-found-2000-asteroids-hours · https://starlust.org/spectacular-first-images-from-rubin-observatory-reveal-2-104-asteroids-millions-more-yet-to-be-explored
- "Hour six / day two" in the script are an illustrative timeline (follow-up by other telescopes, orbit fit). Short orbit-to-impact turnaround is real: 2008 TC3 was discovered by Catalina and its impact predicted ~19 h before it hit Sudan.
  https://en.wikipedia.org/wiki/2008_TC3

## The real near-miss: 2024 YR4
- Discovered 27 Dec 2024 by ATLAS-CHL (Río Hurtado, Chile), two days after it passed Earth. https://en.wikipedia.org/wiki/2024_YR4
- Reached level 3 on the Torino scale (0-10). https://cneos.jpl.nasa.gov/news/news210.html
- Probability passed 1% on 27 Jan 2025 (triggered the IAWN notification). Impact probability for 22 Dec 2032 peaked at 3.1% on 18 Feb 2025 (highest ever recorded by NASA for an object this size), then fell to 1.5% and 0.28% with new data (19-20 Feb) and to 0.004% ("no significant threat") by 24 Feb 2025.
  https://blogs.nasa.gov/planetarydefense/2025/02 · https://gizmodo.com/odds-of-asteroid-hitting-earth-in-2032-climb-again-as-impact-probability-hits-new-peak-2000565149
- Size: JPL "most likely 40-90 m"; JWST-based estimate ~60 m ± 7 m → script says "sixty metres wide". https://en.wikipedia.org/wiki/2024_YR4

## Damage: city killer vs planet killer
- Tunguska (30 Jun 1908): flattened ~80 million trees over ~2,150 km²; object estimated ~50-60 m (range 50-190 m), 3-50 Mt (commonly 10-15 Mt).
  https://en.wikipedia.org/wiki/Tunguska_event · https://www.livescience.com/space/asteroids/the-tunguska-event-was-the-biggest-asteroid-impact-in-recorded-history-how-did-it-vanish-without-a-trace
- Python check (stony, 2,600 kg/m³, 17 km/s): 50 m → 5.9 Mt, 60 m → 10.2 Mt (Tunguska-class), 100 m → 47 Mt, 1 km → ~47,000 Mt.
  2,150 km² is ~20× the area of Paris (105 km²), so "enough to flatten a city" is conservative.
- 1 km+ near-Earth asteroids: NASA lists 873 found with ~50 left (≈95% found, python 873/923); 140 m+: 11,343 found with ~14,000 left (≈45%). City killers (50-100 m) are mostly still undiscovered.
  https://science.nasa.gov/solar-system/asteroids-comets-meteors/near-earth-asteroids

## Defense
- NASA DART hit Dimorphos on 26 Sep 2022; orbit around Didymos went from 11 h 55 min to 11 h 23 min = 32 min shorter (±2 min; later refined to ~33 min). Success threshold was 73 s.
  https://www.sciencenews.org/article/dart-mission-deflected-asteroid-for-planetary-defense · https://space.com/nasa-dart-asteroid-impact-orbit-change-success
- Kinetic impactors give only a tiny velocity change, so they need years (ideally a decade or more) of lead time for the shift to grow to an Earth radius. With short warning (months), civil defense / evacuation of the impact zone is the only option.
  https://www.livescience.com/earth-asteroid-planetary-defense-dart-mission-reality · https://arxiv.org/pdf/2601.16255 (Rubin: median warning ~106 days for 50-140 m impactors)

## On-screen extras (verified / labelled as illustrative)
- Torino scale 0-10; level 8 = "collision is certain, capable of causing localized destruction for an impact over land" (used for the hypothetical object on day two). https://en.wikipedia.org/wiki/Torino_scale
- Observatory codes on the follow-up map are real MPC codes: W68 ATLAS-Chile, T08 ATLAS-Mauna Loa, M22 ATLAS-Sutherland, F51 Pan-STARRS 1, G96 Mt. Lemmon (Catalina), X05 Rubin, J04 ESA OGS Tenerife, E12 Siding Spring. https://minorplanetcenter.net/iau/lists/ObsCodesF.html
- YR4 chart: only the labelled points are data (discovery 27 Dec, >1% 27 Jan, 3.1% peak 18 Feb, 1.5% 19 Feb, 0.28% 20 Feb, 0.004% 24 Feb); the curve between them is schematic.
- "20 storeys" for 60 m: 60 m / ~3 m per storey = 20. "≈20× the area of Paris": 2,150 / 105 = 20.5.
- Hypothetical object designation "2026-VK", the 121-day countdown and the evacuation percentages are illustrative, not real data.
