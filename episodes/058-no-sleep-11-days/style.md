# Style — "Pixel Night" (Higgsfield Content Factory)

Same look as `episodes/035-internet-down-worldwide`, `044-carrington-solar-storm` and `054-electricity-gone-week`
(palette, pixel font, game-HUD panels, flat captions). Only the LOOK is reused; story, scenes and wording are new.

- Engine: `style: "flat"`, every scene is `draw: "px"` (episode `draw/px.js`, the 054 kit copied verbatim + new scenes):
  180x320 low-res canvas, 6x nearest upscale, own 5x7 bitmap font, `big()` popping pixel numbers, glitch-in `blit()`.
- Format hook from our best-watched 035/054 countdowns: a giant **DAY counter** (DAY 1 … DAY 11, chunky pixel font, 11 pips that
  go red one by one, "HOURS AWAKE T+xxxH" ticker) top-centre in every day scene, flipping with glitch + flash on each "Day N".
- New game framing: a **PLAYER: YOU / ENERGY** bar (green → orange → red, 20 segments) drains across the episode; at 0% it blinks
  "!! LOW ENERGY !!". Cold open = the bar crashing to 0% while the room glitches.
- Palette additions: bedroom navy `#120F2E`, alarm-clock red digits `#FF3B4E`, sleepy lilac `#A9A4E0`, beer-amber `#FFB13B`
  for the BAC stat, hallucination pink/cyan `#FF4FA3`/`#3DE0FF` RGB-split glitches, pillow cream `#F7E8C6`.
- New scenes: bedroom with the teen at a desk + glowing alarm clock 23:59 → morning (hook/intro), hour-17 car-keys/BAC meter,
  microsleep eyelid blackout (screen cuts to black for "seconds", eyes-open face), day-3 messy desk with fading memory text,
  day-4 hallucination room (walls breathing, floating shapes, the teen "sees" himself in a football helmet), day-11 record
  trophy + 264 h counter, bed with Zzz and a 14 h sleep timer, a red "DON'T TRY THIS" warning card, closing question card.
