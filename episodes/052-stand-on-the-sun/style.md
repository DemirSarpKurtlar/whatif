# Style — "Grain Poster" (Higgsfield Content Factory: two-tone grainy print · coral and cobalt · bold condensed labels)

Reference studied: the catalog's Grain Poster preview video (720x1280, 50 s), frames at 1/5/10/16/22/30/40/46 s.
Only the LOOK is adapted. The reference's story, figure, props, wording and shot list are not reused.

## What the reference looks like
- A risograph / screen-print poster in motion: warm cream paper (#EFE5D0) printed with only two inks, coral-red and cobalt-blue,
  plus a near-black brown "key" ink used for type and heads. Overlaps multiply (coral over cobalt reads dark violet-brown).
- Everything has print grain: paper fibre noise, slightly blotchy solids, and **halftone dot screens** for every soft tone
  (sky glows, haze, shadows, light halos are rows of dots that shrink with distance, never smooth gradients).
- Misregistration: big headline letters are dark ink with a coral copy nudged up-left and a cobalt copy nudged down-right.
- Type: heavy condensed grotesque all-caps for headlines and big numbers; small typewriter-mono labels with
  registration-mark crosshairs in the top corners (issue number left, edition note right); occasional italic serif
  "annotation" words with a thin hand-drawn arrow rule.
- Captions: one line of heavy caps on a cream rectangle near the lower third, words in cobalt with the key words in coral,
  revealed word by word as they are spoken.
- Shapes are flat paper cut-outs: simple round-headed figures, flat horizons, wavy band edges; motion is gentle drift,
  hard cuts between panels, short holds.

## How 052 adapts it (engine: `style: "flat"`, every scene `draw: "sun"`, episode `draw/sun.js`)
- Palette: paper #EFE5D0, coral #E8553D / deep coral #C63D2C, cobalt #3049A3 / deep cobalt #22357D, key ink #2B1D20.
- The Sun is the coral ink: a curved plasma horizon with halftone granulation dots, dot-screen glow halos, flickering
  flame tongues and prominence loops. Space/sky stays bare paper so the poster contrast stays high.
- Our own figure: a cobalt cut-out person with a dark round head, always printed twice (coral copy offset = misregistration).
- Headline numbers (6,000×, 28×, 2,230 KG, 5,500 °C, 63 MW, 60,000, 0.1 s, 100,000 YEARS) are condensed heavy caps with
  coral/cobalt misregistration; units and notes are typewriter mono.
- Header on every panel: crosshair + "WHAT IF Nº052" (cobalt) left, "SOL · 5,772 K" + crosshair (coral) right.
- A slow-motion stopwatch (top right, mono label + heavy numerals) runs from 0.000 s to 1.000 s across the story,
  tying every beat to the "one second".
- Captions are drawn by the scene code (engine captions are left empty) in the reference's cream-box style; numbers and
  key words in coral. Title and end card are also drawn in-scene as print posters (engine title is parked off-screen
  so the cover script can still read `title.text`).
- Whole frame gets a multiplied paper-grain texture; hard cuts (xf 0) with short cream/coral flashes on the big hits.
