# Style — "Lowpoly Skyline" (Higgsfield What-If style catalogue), as adapted for 047 gravity-reversed

Same look as `episodes/047-gravity-reversed/style.md` (series consistency for the gravity series). We adapt the LOOK only — no story,
characters, wording or shots from the reference video. Ours: gravity halves (Part 5) on a waterfront court, plaza, stormy sea and in orbit.

## Look
- Bright, clean low-poly 3D in daylight, game-engine diorama feel: flat-shaded facets, soft shadows, no textures beyond window grids,
  court lines and road markings.
- Skyline wall of pastel two-faced towers (cream, salmon, sky blue, mint, sand, pale grey) with dark window grids across a blue bay.
- Saturated lawn greens, light grey paving, periwinkle sky with soft white clouds, gentle haze on far towers, vignette.
- Moods by tinting: grey storm tint for the sea, deep navy space for orbit.

## Scenes / shaders (shaders/)
- `court.glsl` (new): low-poly outdoor basketball court on the waterfront, same tower/sky code as lowcity. A player (1.75 m, reach
  2.33 m) jumps on the exact half-g parabola (1.00 m, 1.28 s) and dunks; a translucent white "1 g ghost" does today's 0.50 m jump and
  misses. Same rig for the phone drop (pink phone at half g vs ghost phone at 1 g).
- `lowcity.glsl` (from 047, extended): waterfront plaza; new `hop` (people hopping on real half-g parabolas), `tree` (taller trees),
  `air` (thinner, deeper-blue sky). Keeps 047's `ph` flip kinematics for the "last time" recap.
- `ocean.glsl` (new): faceted triangulated storm sea (true piecewise-flat height field), striped lighthouse on a rock and a red boat for
  scale; the wave field scales ×2 (height and length) at constant speed, like a fully developed sea at half g.
- `orbit.glsl` (new): low-poly Voronoi-faceted Earth, satellites as gold/blue icons on three orbital planes; after the halving each
  follows its exact parabolic escape path (Barker's equation); the Moon leaves; atmosphere streaming off the limb.

## Overlays
- Default serif overlay engine: centred white serif title, left HUD counters (tiny caps label, big serif number, caps sub-line),
  big centre numbers, white italic word-highlight captions, dark end card.
