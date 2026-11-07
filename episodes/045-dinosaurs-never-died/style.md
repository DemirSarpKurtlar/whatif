# Style — "Ink & Gold" (Higgsfield Content Factory: sumi-ink wash · silhouettes · gold-leaf accents)

Same look as episode 038 — see `episodes/038-library-of-alexandria/style.md` for the full reference notes (palette, textures, typography, pacing).
We reuse the LOOK only; none of the reference video's story or characters.

## What is reused from 038
- The helper library (rice-paper texture, ink washes/ridges/streaks, bristle brush, mottled gold-leaf pattern, gold discs, glow, sparkles, gold dust,
  red seal stamp, camera `frameIn`, final `finish` pass) is copied verbatim and inlined at the top of every `draw/*.js` (cache namespace `__c045`).
- Palette: warm grey paper, mid/dark ink washes, near-black ink #141312, gold #C9A64B / #F2D68A, one small red seal (glyph "Δ").
- Engine overlay: serif captions with the spoken word in gold, gold HUD dots/values, gold big words; title on dark ink sky, caption band (y≈1180-1500) kept dark.

## New for 045 (dinosaur silhouettes, same block after the helpers)
- Flat ink cut-outs with a single gold eye: T. rex (walk cycle, head tilt), sauropod (walk, neck raise), small Cretaceous mammal, fern fronds,
  perched crow, flying-bird glyph, feathered raptor (Troodon-like), Russell's dinosauroid (gold eyes, raisable arm), mini icons for the
  extinction grid (triceratops, pterosaur, ammonite, turtle, crocodile...), ink skyline with sparse gold windows.
- Scenes: gold asteroid streak over ink mist + impact dome (sky), 20 species icons dissolving to ink smoke with 5 survivors turning gold (extinct),
  the streak rising away past a herd before a gold sun (herd), gold 165 My bar vs ink 66 My bar to scale (timeline), mammal under a fern as a giant
  three-toed foot lands (fern), gold-leaf ghost outlines of a badger and a mammoth with a gold "?" (grow), a modern ink city with long-necks and a
  T. rex in the street (city), a crow whose shadow is a raptor + a flock (bird), the dinosauroid before a gold halo with a gold "?" and later a
  glowing phone (dinosauroid).
- Effects stay cheap: every background/mist/fern/skyline/shadow layer is rendered once into a cached canvas; per frame only silhouettes,
  a few brush strokes, gradients and dust are drawn (no per-pixel loops, no per-frame blur filters).
