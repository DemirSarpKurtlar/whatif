# Style — "Park Skyline" 3D (our GLSL engine look, as in 015 "What if Earth shrank to the size of the Moon?")

015 is our best watch-time post (22 s avg), so 056 reuses its LOOK, not its story or shots.

## Look
- Low-poly, matte, realistic-ish 3D rendered live in GLSL (ray-marched SDFs). Soft daylight from the upper left, blue sky gradient
  with drifting noise clouds, mild distance haze; night = deep navy sky, stars, moon glow on the water.
- Space shots: near-black #05060A starfield, Earth globe with procedural continents (blues #22528F/#3A78BA, greens #568C3A, sand #B9A66A),
  white polar caps and clouds, a thin blue atmosphere rim; the Moon grey with darker maria. Dashed gold (#FFD873) orbit ring, dashed
  pale ghost ring + ghost Moon for "where it used to be".
- Beach shots: sand, beach huts, palms, red/yellow/blue umbrellas (from 015's coast set) plus a NEW pastel seafront town
  (cream/salmon/sky-blue blocks with window grids, lit windows at night) so the flooding reads as "coastal cities".
- Grade: gentle vignette + film grain from the engine; dark top gradient behind the HUD.

## Typography / overlays (engine default serif set)
- Title: big white serif, centred upper third, words rise in. HUD top-left: coloured dot + tiny letter-spaced caps category, caps
  label, big serif value / live counter, accent rule, caps sub-line. Captions: italic serif with the spoken word highlighted in gold.
- End card: black, serif question, tiny caps disclaimers, pulsing gold CTA.

## Shaders (copied from 015 and adapted)
- `shaders/planets.glsl` (from 015 planets): orbit angle/radius params, dashed orbit + ghost orbit, ghost Moon, tidal water bulge
  toward the Moon, eclipse mode (Sun swings behind the Moon, umbra + penumbra spot on Earth at true 1,750 km scale), friction glow.
- `shaders/coast.glsl` (from 015 coastcurve): camera yaw/height, seafront town, Moon angular size `mrad` (2× = 2× wider),
  moonlight multiplier `mlight`, full solar eclipse mode `ecl` (Moon slides over the Sun, corona, 360° horizon glow, stars).
