# Style — "Ink & Gold" (Higgsfield Content Factory: sumi-ink wash · silhouettes · gold-leaf accents)

Same look as episodes 038 and 045 (our best-viewed post) — see `episodes/038-library-of-alexandria/style.md` for the full reference notes.
We reuse the LOOK only; none of the reference video's story, characters, wording or shots.

## Reused from 038/045
- The helper library (rice-paper texture, ink washes/ridges/streaks, bristle brush, mottled gold-leaf pattern, gold discs, glow, sparkles, gold dust,
  seal, camera `frameIn`, final `finish` pass) is copied verbatim into `draw/_build/00_ink.js` (cache namespace `__c055`) and inlined at the top of
  every `draw/*.js` by `draw/_build/build.sh`.
- Palette: warm grey paper, mid/dark ink washes, near-black ink #141312, gold #C9A64B / #F2D68A. Dark ink sky at the top for the HUD,
  light misty middle where the silhouettes stand, dark ground below ~y 1180 so the serif caption band (y≈1180-1500) stays readable.
- Engine overlay: serif captions with the spoken word in gold, gold HUD dots/values (counters for 4,000 yrs / 150+ edits / 22 months / -1.9 °C).

## New for 055 (`draw/_build/10_shapes.js`)
- One proboscidean silhouette with a morph parameter: m = 0 Asian elephant (big ears, arched back) ... 1 woolly mammoth (domed head, shoulder hump,
  sloping back, small ears, hair skirt + shaggy back, big curved tusks in gold leaf, single gold eye); separate hair/ear controls, walk cycle,
  trunk that hangs or lifts. Also a parka-clad person, steppe bison, Yakutian horse, falling snow, tundra band, small serif scene labels.
- Scenes: Wrangel Island in a grey Arctic sea with the last tiny herd and a gold dashed ring (island); split frame, gold pyramids of Giza vs snowy
  Wrangel cut by a diagonal ink stroke (pyramid); a turning gold double helix whose rungs flare as "edited" over a faint elephant (dna); an elephant that
  grows hair, shrinks its ears and raises a fat hump with gold leader labels (morph); a mother elephant with a gold calf inside and an arc of 22 gold moons
  (womb); a woolly calf beside its surrogate mother at a gold dawn (calf); a herd + near bull crossing the tundra in snow — also the cold open (herd);
  a cut-away of snow/soil/permafrost with bison and horses packing the snow and a gold thermometer dropping (soil); two gold-rimmed columns, atmosphere x1
  vs permafrost x2 (carbon); a small person facing a huge mammoth before the gold sun with a gold "?" (meet).
- Effects stay cheap: backgrounds/mist/ground layers are cached canvases; per frame only silhouettes, a few strokes, gradients and particles.
