# Style — "Pixel Night" (Higgsfield Content Factory)

Same look as `episodes/035-internet-down-worldwide/style.md` and `episodes/044-carrington-solar-storm/style.md`
(palette, pixel font, game-HUD cards, flat captions). Only the LOOK is reused; story, scenes and wording are new.

- Engine: `style: "flat"`, every scene is `draw: "px"` (episode `draw/px.js`). Helpers copied from 035/044: 180x320 low-res
  canvas, 6x nearest upscale, own 5x7 bitmap font, `card()` status panels, `big()` popping pixel numbers, glitch-in `blit()`.
- Format hook, borrowed from our best-watched 035 "hour by hour": a giant **DAY COUNTER** (DAY 1 … DAY 7, chunky pixel font,
  yellow → orange → red as the week gets worse, 7 battery pips that empty one by one) sits top-centre in every day scene
  and flips with a glitch + flash when the narrator says the next day.
- Palette additions: blackout navy `#07061A`, candle/flashlight amber `#FFB13B` cones, ice blue `#8FD8FF` for the freezer,
  water blue `#3DA0E0`, warning red `#FF3B4E` for "OFFLINE / EMPTY / DEAD" stamps, lime `#7CFF6B` for the day-7 power return.
- New scenes: city lights dying (hook + intro), phone with signal bars dropping + cell tower battery draining, dry kitchen
  tap with a pressure gauge and Texas boil-water stat, open freezer dripping with a 48 h thaw timer, hospital on a humming
  generator with a 96 h fuel gauge, gas station with "NO POWER" pumps and a queue of cars, ATM "OUT OF SERVICE" + card
  terminal declined + cash, grid restart with substations lighting up district by district, kid with a flashlight asking
  the closing question.
- Game framing: each day is a HUD "event card" (DAY 01 · SIGNAL, DAY 02 · WATER, …) with a segmented bar; the cold open is
  a "PLAYER: CITY / POWER" HP bar dropping to 0% as the skyline blacks out.
