# Style — "Pixel Night" (Higgsfield Content Factory)

Same visual language as 035/044 (`episodes/044-carrington-solar-storm/style.md`): 16-bit pixel art on a 180x320 low-res canvas, 6x nearest-neighbour upscale,
own 5x7 bitmap font, neon night palette (navy `#0B0A1E`, violet buildings, gold windows, pink/cyan/lime neon), game-HUD "event cards" and popping pixel numbers.
Only the LOOK is adapted; the story, scenes and wording are our own.

- Engine: `style: "flat"`, every scene is `draw: "px"` (episode `draw/px.js`: 044 kit copied, new scenes added). HUD cards and big numbers are drawn in-scene with the pixel font.
- New palette accents: reentry fire `#FFFFFF` → `#FFD23F` → `#FF8A3D` → `#FF3B4E` streaks; GPS blue `#2B6BFF`/cyan map UI; weather-radar greens/yellows/reds; backup-clock amber.
- New scenes: orbital "constellation" view of Earth with ~150 satellite pixels that spiral down and flash out at the atmosphere; city meteor storm of burning satellites over a rooftop kid; tumbling pixel ISS with plasma sheath crashing chunks into the ocean; phone map losing its GPS fix (spinning blue dot, "NO SIGNAL"); cockpit/ship split with paper charts and compass; three-panel "CLOCK SYNC" board (cell tower, pylon, bank) flipping to BACKUP; $1-billion-per-day money counter burning; weather radar with a hurricane and a draining "DATA 100% → 10%" bar; 1957→2026 satellite-count timeline that crashes to zero; final empty sky.
- Game framing: each beat is a HUD event card (ORBIT CONTROL, SKY WATCH, SPACE STATION, NAVIGATION, TRAFFIC, CLOCK SYNC, DAMAGE REPORT, FORECAST, TIMELINE, NIGHT SKY). Cold open = "SATELLITES ONLINE" HP bar draining from 16,988 to 0 while burning satellites streak over the city.
