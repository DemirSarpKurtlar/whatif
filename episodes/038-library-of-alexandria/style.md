# Style — "Ink & Gold" (Higgsfield Content Factory: Sumi-ink wash · silhouettes · gold-leaf accents)

Reference studied: `what-if-styles/published/541d1820…` (720x1280, 60 s; 12 frames + 2 close-ups in /tmp/ref_038).
We reproduce the LOOK only — none of its story, wording, characters or scenes (its story is about money; ours is ancient history).

## Palette
- Paper: warm grey rice paper, mostly MID grey (not white): light areas ~#D6D0C2, mid wash #9C978E, dark wash #55524D, near-black ink #141312.
- Everything is greyscale except the gold: gold leaf #8C6A1E → #C9A64B → #F2D68A (mottled, crinkled, slightly speckled), plus a warm glow halo around gold.
- One tiny accent: a small red seal stamp (#B8322A, cream glyph) in a corner, like a hanko/chop. Used sparingly.

## Textures
- Paper fibre/noise over everything; washes have soft, bleeding edges (wet-on-wet), stacked in 2-4 translucent layers (far = pale, near = dark).
- Horizontal mist bands and low cloud streaks of wash; sky is often an ink-grey gradient with a lighter glow where the gold sits.
- Brush strokes: thick tapered calligraphic strokes (waves drawn as hooked "C" strokes, horizon lines as thin dry-brush lines with gaps).
- Dry-brush/bristle streaks, splatter dots, small flecks of gold drifting like dust.

## Silhouettes
- Solid black cut-outs with no interior detail except thin gold rim-light or gold windows/edges (e.g. a yacht with gold portholes, figures backlit).
- Figures are simple, slightly stylised humans seen in profile/back, flat black, often small against big washes.
- Big shapes: a huge gold-leaf sun/coin disc behind a black silhouette is the signature composition.

## Gold accents
- Gold leaf used for the focal object only (sun disc, coin, screen, key word). Glows softly; sparkles occasionally.
- Gold light on water: short horizontal gold dashes under the sun.
- Gold "crack" line splitting an image for a dramatic beat.

## Typography
- Elegant old-style serif (Garamond-like) for captions, white/black with ONE gold word highlighted; brush-script for big words.
- Our engine: default serif overlay (LiberationSerif), accent colour = gold #F2D68A for the spoken word, gold HUD dots and values;
  big words in gold serif. Ink-dark areas are kept behind the title (top) and caption band (y≈1180-1500) so white serif stays legible.

## Camera + pacing
- Slow push-ins and gentle lateral drifts (parallax between wash layers), occasional fast whip/cut on a beat.
- Cuts every ~2-5 s (scene-detect cuts at 2.2, 6.6, 10.3, 20.2, 37.9, 42.8, 44.3, 50.8, 52.3, 58.7 s) with soft dissolves in between;
  inside long shots the composition keeps changing (objects slide in, gold spreads, ink blooms).
- Mood: calm, elegant, slightly mysterious; motion is smooth, never jittery (except a short shake on an impact).

## How episode 038 uses it (2D canvas draw scenes, draw/*.js)
- Cached rice-paper layer (noise + fibres + blotches) and cached blurred ink washes per scene; animated silhouettes, brush waves and gold on top.
- Scenes: harbour with the Pharos + gold sun, Caesar's fire (gold-leaf flames, ink smoke, burning ships), the hall of scrolls emptying over
  centuries, the Serapeum cracking with a gold fissure, shelves of scroll-ends counting up, lost works (Aristotle, Eratosthenes' map,
  Aristarchus' gold Sun at the centre), Hero's aeolipile spinning with steam, a gold timeline "leap", a figure running out with scrolls.
