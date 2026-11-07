# Style — "Lowpoly Skyline" (Higgsfield What-If style catalogue)

Reference studied: `what-if-styles/published/2edbd643…` (720x1280, 73.5 s; 12 frames every 6 s + 2 full-res close-ups in /tmp/ref_047).
We reproduce the LOOK only — not its story (humans disappearing / time-lapse decay), its red suspension bridge, wording or shots.
Ours is a waterfront city plaza where gravity flips for one second.

## Look
- Bright, clean low-poly 3D city in daylight, seen from an elevated/human-height 3/4 view. Everything reads like a game-engine
  diorama: flat-shaded facets, crisp soft shadows, no grime, no textures beyond simple window grids and road markings.
- Skyline: a dense wall of tall rectangular skyscrapers across a blue river/bay, in pastel colours — cream #E9DFC9, salmon/brick red
  #D8705E, sky blue #9CC3E6, mint/teal #8FC9BE, sand #D9B48F, pale grey #C9CED6 — each covered in a regular grid of small dark windows,
  two visible faces (lit side / shade side), staggered heights, many taller than the frame.
- Water: saturated mid blue #2F78C4 → #4A90D9, almost flat with faint facet ripples; a thin pale quay wall separates it from land.
- Land: bright saturated lawn green #4CA33A / #66BF45, light grey sidewalks #C9CBCF, dark slate roads #3A4150 with white dashes and
  zebra crossings, small white/coloured low-poly cars, round faceted trees (fresh green, yellow-orange autumn accents #E3A82B).
- Sky: soft periwinkle/blue gradient, pale at the horizon (#C6D9EE) to clear blue (#6FA3DD) at the top; very light haze on the far towers.
- Grade: high-key, slightly desaturated mid-tones, gentle vignette. Day "moods" are done by tinting the whole frame (warm orange, grey).

## Typography / overlays (matches our default serif overlay engine)
- Title: centred white serif (Liberation Serif), two lines, soft shadow, over the top third of the 3D scene.
- Live counter block on the left, mid-frame: tiny letter-spaced sans caps label ("TIME WITHOUT HUMANS"-style), big white serif number,
  tiny caps unit under it. Counters tick live.
- Big transient centre number ("+1 WEEK") in large serif with small caps unit and a thin underline.
- Captions: white italic serif, centred, sentence case, under the counter.

## How 047 uses it
- New shader `shaders/lowcity.glsl`: adapted from 020 `park.glsl` / 024 `park2g.glsl` (same camera params cam/rise/tilt/panx/shake,
  same crowd grid) but re-skinned as a bright faceted low-poly waterfront plaza: pastel two-face skyscraper wall with window grids
  (parallax-correct cylinder at ~120/180 m), bay with a liftable water slab (`wlift`), quay, road with low-poly cars, people & dogs that
  lift/tumble (`lift`, `spin`), faceted trees, rising debris (`dust`), sky pressure tint (`air`), splash foam (`splash`).
- `shaders/room.glsl`: tiny low-poly flat interior for the "indoors, you hit the ceiling" beat.
- Overlays: default (serif) style; HUD counters (`hud.counter`) + `elapsed` real-time clock in seconds ("SLOW MOTION").
