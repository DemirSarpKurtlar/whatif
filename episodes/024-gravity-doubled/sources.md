# Sources / math — 024 gravity doubled for 1 minute (Gravity Part 3)
Checked with python (g = 9.81 m/s²).
- Weight = mass × g, so at 2 g a 70 kg person presses on the ground like 140 kg (687 N → 1,373 N).
  https://en.wikipedia.org/wiki/Weight
- Blood pooling: under sustained +Gz, blood shifts to the abdomen and legs and venous return to the heart drops; relaxed +Gz tolerance is roughly 2.7–7.8 g (mean 4.7), so 2 g is survivable but hard work.
  https://thespacereview.com/article/402/1 · https://en.wikipedia.org/wiki/G-force#Human_tolerance
- Hydrostatic pressure the heart must overcome to lift blood ~0.30 m to the brain: ρgh = 1060 × 9.81 × 0.30 ≈ 23 mmHg at 1 g → ≈ 47 mmHg at 2 g ("twice the pressure"). Pressure scales with acceleration (JCI acceleration study).
  https://www.jci.org/articles/view/102443/version/1/pdf/render.pdf
- Jump height: with leg force F = k·m·g₀ over push distance d, h = (F − mg)·d / (mg). k = 2.5 → 0.60 m at 1 g vs 0.10 m at 2 g; k = 3 → 0.80 m vs 0.20 m. Always less than half (k < 2 → you can't leave the ground). "You barely leave the ground."
  https://www.physicsforums.com/threads/calculating-jump-height-with-higher-gravity-formula-and-tips-help-needed.230814/
- Dropped phone: v = √(2gh). From 1.2 m: 4.85 m/s at 1 g vs 6.86 m/s at 2 g → √2 = 1.414, i.e. 41 % faster; falls in 0.35 s instead of 0.49 s.
  https://en.wikipedia.org/wiki/Free_fall
- Planes: lift must equal weight; stall speed scales with √(load factor). At 2 g, stall speed × √2 = +41 % (same as a 60° banked turn).
  https://www.boldmethod.com/learn-to-fly/aerodynamics/what-is-load-factor/ · https://en.wikipedia.org/wiki/Stall_(fluid_dynamics)
- Fountain (visual only): same nozzle speed, jet height v²/2g halves.
- "A second you on your back": extra load = your own body weight, by definition of doubling weight.
- Simplifications: Earth's mass/orbit effects, atmosphere compression and structural loads ignored for the 60 s.
