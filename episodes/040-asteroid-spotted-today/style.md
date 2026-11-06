# Style — "Ops Console" (Higgsfield Content Factory)
"Dark command-center dashboards · red alert numerals · world maps"

Reference studied: 12 frames + 2 full-res stills from the published Ops Console sample (720x1280, 50 s). Only the LOOK is
reproduced here; none of its story (an internet outage), wording, panels or specific scenes.

## Palette
- Room: pure black `#000` / near-black `#08090A`; the video wall floats in darkness.
- Panels: charcoal `#111315`–`#16191B`, hairline borders `rgba(255,255,255,0.10)`, 8-12 px black bezels between monitors.
- Text: off-white `#E8EAEC` for hero numerals, grey `#8E949A` labels, dim `#4E5358` for rulers/codes.
- Alert: signal red `#FF3B3B` (numerals, "T+", status dots, failing rows, map arcs), dark red bars `#5A1414`.
- Rare accents: amber `#F2A33A` (warning banner), white "accepted/ok" blocks. No blue/teal cast — grey-on-black.

## Typography
- Everything on the wall is MONOSPACE (OCR/terminal look): tiny ALL-CAPS labels with letter-spacing ("CARD AUTHORIZATIONS · GLOBAL"),
  panel codes ("PAY-01"), "■ NOMINAL", "T+00:00:00.78" stamps. We use JetBrains Mono (system font).
- Hero numerals: huge thin monospace digits with a small unit ("16,012 /s" style). Healthy = white, failing = red with a soft glow.
- Captions (NOT on the wall): clean bold sans, centred under the wall, 2 lines max; spoken words bright, rest grey. → engine `style: "flat"`.

## Panels & widgets
- Monitor grid with headers: left "CODE · TITLE", right "■ STATUS  T+clock". Thin separators, row tables with index numbers
  (01, 02 ...), percent columns, flight-board style lists, segmented horizontal bars, line charts that collapse to zero.
- Dark dotted/low-contrast world maps with red city markers, red/white great-circle arcs, small boxed labels.
- Top strip: timeline ruler "DAY 06 · DAY 07 ..." with tick marks; a big "T+ 00:00:00.01" elapsed clock (red "T+").
- Wireframe globes/constellations; amber "DOWNTIME / PAPER" banner for crisis states.

## Room & camera
- Silhouetted operators (heads, headsets, shoulders) in the foreground, rim-lit by the screens.
- Soft white light pools reflected on a glossy black floor under the wall; strong vignette.
- Camera: slow lateral dolly along the wall, push-ins on a single monitor, neighbouring screens peeking at the frame edges;
  occasional glitch/smear cut and a stutter of the wall.

## Pacing
- Every 2-4 s a new panel or a number that changes state (white → red, count-up, collapse). Clock always ticking.

## How we build it here (episode 040)
- One 2D canvas draw file `draw/ops.js`; `p.s` picks the sub-scene. Shared wall chrome: ruler + T+ clock, bezels, panel headers,
  scanlines (cached), operators + floor glow (cached), mono text helpers.
- World map = hand-made lon/lat polygons rasterised ONCE into a dotted grid canvas (cached on window), so frames stay cheap on CPU.
- Hero numbers / HUDs live in-scene in mono; engine `bigs`/`huds` stay empty (same approach as 035); captions, title and end card
  use the engine's flat overlay; `hot` only for a few words, numbers turn red automatically (fits "red alert numerals").
