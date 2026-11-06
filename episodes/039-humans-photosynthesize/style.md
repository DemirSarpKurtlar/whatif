# Style notes — "Bold Flat" (Higgsfield Content Factory)
"Bold flat 2D · navy starfield · thick cartoon type".
Reference studied: Higgsfield style reference video (720x1280, 60 s), 12 frames at 1/4/8/12/17/22/27/32/37/43/50/57 s
extracted to /tmp/ref_039/. Only the LOOK is reproduced; story, wording, characters and scenes are our own.

## Palette
- Two background families, alternated by scene:
  - **Day sky**: flat sky blue, slightly lighter towards the horizon (≈ #4FB8F0 → #9EDCFA), puffy white clouds with dark outlines.
  - **Navy starfield**: deep navy (≈ #0F1A47 → #1A2A66) with sparse tiny white square/round stars (twinkling).
- Saturated "kids' book" fills: grass green #5CC35A / #3E9E44, ocean blue #2E8FE0, sun yellow #FFD23F, orange #F28C28,
  red #E8413C, soil brown #6B4426. No gradients on objects (only a very soft highlight at most).
- Text colours: white with a black outline; key word in sun yellow; numbers in yellow with black outline; tags in red.

## Outlines
- Every object has a **thick near-black outline** (#14142A), ~5-8 px at 1080 w, round joins. Characters too.
- Shapes are simple primitives: circles, rounded rectangles, blobs. No textures, at most a few flat spots/dots.

## Characters
- Chibi proportions: big round head (~40 % of height), dot eyes, rosy cheeks, tiny body, stick-ish arms/legs with
  outlined round hands, white sneakers. Expressions: open "o" mouth for shock, smile, worried brow.
- Our own character for 039: **"Sol"** — a woman with a plum-purple bob + top bun, mustard-yellow tee, purple shorts,
  white sneakers with pink soles. Her skin morphs from tan to leaf green; a little sprout grows from her bun.

## Typography
- Rounded, ultra-heavy cartoon sans, ALL CAPS, white fill with a thick black outline (≈ 18-22 % of size).
- Captions: 1-3 words at a time, lower-middle of the screen; the stressed word in yellow.
- Scene labels: ALL CAPS thick-outline words floating in the scene ("MANTLE"-style) — we use "RED", "BLUE", "BOUNCED"...
- Opening "WHAT IF..." in yellow with black outline at the top.

## Callouts
- **White rounded rectangle with a black outline**: small red ALL-CAPS tag on top, a huge yellow outlined number in the
  middle, a tiny black ALL-CAPS sub-line below ("PRESSURE / 0X / TIMES WHAT YOU FEEL NOW").
- Small grey sign boxes with a coloured screen ("VACUUM"), magnifier circles pointing at things, thermometer gauges.
- Big outlined number pops ("12 KM") with a small outlined sub-label.

## Camera / motion
- Mostly locked-off flat frames with slow push-ins; vertical "falling" moves with speed lines; cut-away cross-sections.
- Pop-in (scale overshoot) for callouts and labels; light streak/speed lines; radial burst behind the character for big moments.
- Hard cuts / quick fades every ~2-3 s; the character re-appears in almost every scene as the anchor.

## Pacing
- Fast: a new label/number/cut every ~2 s; captions change every 1-3 words; ends on a big two-line question
  ("WOULD YOU ...?") in yellow/white thick type over a sky-blue frame.

## How we apply it in 039 (humans photosynthesize)
- Engine `style: "flat"` (bold LHeavy captions/bigs/HUD) + one draw file `draw/photo.js` with our own outlined helpers
  (oc/orr/opoly/olimb, thick-outline text `label()`, white `callout()` boxes with red tag + yellow number).
- Day-sky scenes for the character outdoors; navy starfield scenes for the "science diagrams" (light spectrum,
  100-square efficiency grid, ×20 skin grid). Tennis court seen from above for the area reveal (hook scene).
