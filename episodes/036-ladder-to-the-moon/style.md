# Style notes — "Blueprint Line" (Higgsfield Content Factory)
Reference studied: Higgsfield style reference video (720x1280, 50 s), 12+ frames extracted to /tmp/ref_036/.
Only the LOOK is reproduced here; story, wording and scenes are our own.

## Palette
- Paper: deep blueprint navy, slightly lighter in the middle, darker at the edges
  (centre ≈ #142F5E, mid ≈ #0B2653, corners ≈ #051A37). No pure black anywhere.
- Grid: fine square grid of thin light-blue lines (~8-10 % white), with a heavier major line every 4-5 cells.
- Ink: near-white with a faint cyan tint (#E6F3FF) for main wireframes, with a soft glow (bloom) around strokes.
- Secondary ink: muted pale blue (#7FA6D6 / rgba(170,205,255,0.5)) for hidden lines, construction lines, dims.
- Accent 1: light cyan (#7FD3FF) for the highlighted caption word and key labels.
- Accent 2 (rare): amber (#F2B84B) for one small callout per scene (e.g. a "CL" marker). Redline red only for failure.

## Line weights
- Main object outlines 2-3 px (at 1080 w), glowing; interior detail and hatching 1 px.
- Construction / leader lines 1 px, often dashed (6/6) or dotted; dimension lines thin with small arrowheads/ticks.
- Double-rule sheet border: outer 2 px + inner 1 px, ~30-40 px margin from the frame edge.

## Typography
- Title block + labels: monospace, uppercase, wide tracking (JetBrains Mono / IBM Plex Mono style), small (18-26 px),
  mid-dot separators: "SHEET · 12 / 12", "SCALE 1 : 800", "REV A · 1912".
- Hero numbers: very thin geometric sans (Inter ExtraLight/Thin), huge (≈ 200-260 px), white, left-aligned,
  with a small bold-mono unit to the right ("KN", "ABOARD") and a tracked mono sub-label below.
- Captions: bold condensed uppercase sans at lower third, centred; spoken words white, the current word cyan,
  upcoming words dimmed.
- Stamps: rotated rectangular outline box with mono uppercase text ("SOLD FOR SCRAP" style).

## Layout
- Fixed engineering title block across the top: cells SHEET | TITLE (question + subject) | SCALE | REV.
  The cell contents change per "sheet" (REV letter advances as the story moves on).
- Hero number top-left, drawing occupies the middle, captions at ~78 % height.
- Leader lines from parts to labels; dimension lines with values; dashed trajectory lines; contour-line objects.

## Camera / motion
- Slow continuous drifts and push-ins on the wireframe (isometric / 3/4 views), occasional slow orbit.
- Lines "draw on" (stroke reveal) and labels type/fade in; numbers tick up.
- Hard cuts between sheets every ~3-4 s, plus a slow lateral pan across a long side elevation.
- Calm documentary pacing; new label/number every 2-3 s.

## How we apply it in 036 (ladder to the Moon)
- All scenes are 2D canvas line drawings (draw/*.js) on the same navy grid sheet with the title block
  "WHAT IF YOU CLIMBED A LADDER TO THE MOON? · LADDER L-1 · GENERAL ARRANGEMENT", scale and REV changing per sheet.
- Fake 3D: simple perspective projection of the ladder rails/rungs, wireframe Earth/Moon globes (lat/long lines),
  ISS truss wireframe, satellite wireframes, dimension lines with altitudes.
- Hero thin numbers drawn inside the scenes (Inter ExtraLight) with mono units; the engine's flat captions
  (bold sans, `style: "flat"`) stand in for the bold uppercase caption track.
