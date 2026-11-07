# Style — "Pixel Night" (Higgsfield Content Factory)

Same look as `episodes/035-internet-down-worldwide/style.md` (palette, pixel font, game-HUD cards, captions); this file only lists what is new for 044.

- Engine: `style: "flat"`, every scene is `draw: "px"` (episode `draw/px.js`, helpers copied from 035: 180x320 low-res canvas, 6x nearest upscale, own 5x7 bitmap font, `card()` status panels, `big()` popping pixel numbers, glitch-in `blit()`).
- New palette accents: sun/flare `#FFF6C8` → `#FFD23F` → `#FF8A3D` → `#FF3B4E`; CME plasma pink/orange; aurora curtains lime `#7CFF6B` → teal → magenta `#FF4FA3` with red tops `#FF3B4E`; 1859 scenes add warm wood browns (`#3A2230`, `#5A3428`) and gas-lamp amber.
- New scenes: Victorian observatory (projected Sun disc + white flash), close-up flaring Sun launching a CME, CME crossing space with an ETA timer, aurora over an 1859 town, newspaper reader lit by aurora, sparking telegraph office (battery unplugged), modern neon grid with surging current, overheating/exploding transformer, glitching GPS map, satellites tumbling in a particle storm, trillion-dollar cost counter, 2012 near-miss orbit diagram, rooftop kid under the aurora in a blacked-out city.
- Game framing: each beat is a HUD "event card" (LOG 1859, SPACE WEATHER, CME ETA, AURORA ALERT, TELEGRAPH, POWER GRID, SUBSTATION, NAVIGATION, ORBIT, DAMAGE REPORT, NEAR MISS, STORM WATCH); the cold open is a "PLAYER: EARTH / POWER GRID" HP bar draining while the city goes dark under the aurora.
