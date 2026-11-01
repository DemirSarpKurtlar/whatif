# Style — "Pixel Night" (Higgsfield Content Factory)

Reference studied: 12 frames from the published Pixel Night sample (720x1280, 24 fps, 50 s). Only the LOOK is reproduced; none of its story, wording, characters or scenes.

## Palette
- Night base: deep indigo/navy `#14123A` → `#241F5C`, near-black `#0B0A1E` for blackouts.
- Buildings: purple `#4B3C9E`/`#5D4FC0`, slate blue `#2E3A7A`, brick red `#B8343F`, dark outlines `#0E0C26`.
- Lit windows: warm yellow `#FFD23F` / `#FFB13B`; neon accents: hot pink `#FF4FA3`, cyan `#3DE0FF`, lime `#7CFF6B`.
- Sunset/sky bands (daytime frames): pink `#F48FB1`, lavender `#B39DDB`. We stay at night.
- Danger: red `#FF3B4E`; "wireframe / echo" mode: cyan lines `#2EE6D6` on black.

## Fonts & text
- Chunky pixel display font (yellow fill, dark outline, slight drop shadow) for "WHAT IF..." and giant numbers ("300,000,000").
- Captions: two lines, centre-lower third (~y 75%), white with key words in yellow, dark 1-2px outline. No box.
- Small HUD labels in tiny 5x7-style pixel font, ALL CAPS.

## HUD elements
- Top-left status card: dark navy panel, 2px light border, square icon portrait on the left, tiny "ACTIVE" label, name in caps, dotted progress bar + small value in the corner.
- "POWER-UP!" tag: small orange label sitting on top of a bigger panel (icon + title + sub-stat + segmented bar).
- Floating game numbers ("x2", "200M") near objects, little scan rings / reticles.
- "POWER OFF" black screen with tiny red label and a "?" — used as a dramatic beat.

## Camera & transitions
- 2D side-view scenes, slow horizontal pans and push-ins on a pixel grid; occasional circular "lens" reveal (iris) between views.
- Hard cuts, a blackout beat, a mode switch to cyan wireframe.
- Pixel character in a red hoodie walks through the scene (we use our own different character: a kid in a teal jacket with headphones).

## Pacing
- New panel/number/scene every ~2-4 s; captions phrase-by-phrase (3-6 words).
- Game-UI framing: each beat feels like a level/power-up card.

## How we build it here
- Every scene is a `draw:` scene that paints into a 180x320 offscreen canvas (6x upscale, smoothing off) => crisp 6-px pixels.
- Our own 5x7 bitmap font for in-scene HUD cards ("HOUR 01 / STATUS: OFFLINE"), pixel big numbers and signs.
- Engine `style: "flat"` captions (bold Inter, white + yellow hot words + red numbers) for maximum legibility.
