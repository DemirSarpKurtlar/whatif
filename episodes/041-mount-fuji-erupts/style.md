# Style — "Woodblock Wave" (Higgsfield Content Factory: Japanese woodblock print · indigo sea · paper label plaques)

Reference studied: `what-if-styles/published/327afb74…` (720x1280, 50 s, 12 frames + 3 full-res close-ups in /tmp/ref_041).
We reproduce the LOOK only — not its story (a giant bay wave), wording, or scenes. Ours is Mount Fuji / Tokyo ash.

## Palette (flat ukiyo-e colour areas, slightly desaturated, printed on paper)
- Indigo sea: deep prussian/indigo #1E3560 → mid #2D4F82, lighter bay water #6E93BC / #9DB9D4.
- Sky: bokashi gradient — dark indigo at the very top fading to pale blue-grey #C9D8DE and a warm cream horizon #EADFC4.
- Mountains: pale steel blue #8FAFCB with darker shadow side #6A8DB0; snow caps cream-white #F3EEE2 with jagged "dripping" lower edge.
- Forest: muted green #3F6B4A / dark #2C4B36, with tiny dark pine silhouettes on ridgelines.
- Paper / plaques: cream #F1E6CC, sand #D9C08F; key lines near-black indigo #1B2233.
- Accent: red #B5302A used ONLY for key words/numbers (like a printed red seal ink).

## Textures & line work
- Whole frame has a paper texture: soft mottling + fine speckle, colours look printed (slightly uneven, never glossy, no gradients except bokashi skies).
- Thin dark key lines outline mountains, snow, cliffs, buildings.
- Water = flat indigo with many thin white/cream wave strokes (short horizontal wavy dashes), denser near the bottom.
- Signature foam "claws" (Hokusai-style curling fingers) along wave crests; foam bubbles = rows of small cream circles.
- Cream rounded "cloud band" bars (kasumi mist) slide horizontally across the frame as transitions / framing.

## Typography / plaques
- Labels are cream paper plaques with a double dark border (thick outer, thin inner), old-style serif caps
  (e.g. place name + letter-spaced small subtitle; date; big number + small unit). A vertical plaque reads WHAT IF.
- Captions in the reference: cream plaque, dark serif, one red highlighted word. Our engine draws captions as white italic serif,
  so we draw an INDIGO plaque with a cream double border behind every caption (sized to the caption, from the scene code) and use a
  warm vermilion accent for the spoken word. In-scene label plaques (place, date, numbers) are cream with dark serif + red numbers.

## Camera + pacing
- Calm, slow push-ins / pans; layers parallax; occasional cloud-band wipe. New label or object every 2-4 s.
- Diagram moments drawn in the same print style (height ruler with ticks, red value label).

## How episode 041 uses it (2D canvas draw scenes; shared helpers in src/lib.js, built into draw/*.js by src/build.py)
- Cached paper texture + per-scene cached static layers (sky, mountains); animated plume, ash fall, waves, plaques on top.
- Scenes: calm Fuji over Suruga Bay → Hōei 1707 flank eruption (DAY counter plaque) → print-style map Fuji→Edo with ash drifting 100 km →
  Edo roofs becoming Tokyo skyline → ash cloud darkening Tokyo (+2 HOURS) → train halting on a viaduct (0.5 mm) → power lines sparking
  in wet ash, windows going dark (3 mm) → street, cars buried, ruler to 10 cm → ash volume vs Fuji (1.7 billion m³) → Tokyo Dome
  counter ×1,371 → quiet Fuji with the great wave (319 years) → Tokyo under ash, STAY / RUN plaques.
