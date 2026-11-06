# Sources / math — 039 What if humans could photosynthesize like plants?

## Facts
- Daily food energy for an adult: ~2,000 kcal/day (reference value used on US/EU nutrition labels) = 2,000 × 4,184 J ≈ **8.37 MJ/day**.
  https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels
- Sunlight at the surface: ~1,000 W/m² at clear-sky noon (the "1 sun" standard used for solar panels). Averaged over 24 h
  (night included) the surface mean is ~187 W/m² globally; a clear summer day at mid latitudes averages ~250-300 W/m².
  We use **250 W/m² as a 24-h average on a good (sunny) day** ("On a good day" in the script).
  https://greenrhinoenergy.com/solar/radiation/modelling.php · https://arxiv.org/pdf/physics/0308061 · https://en.wikipedia.org/wiki/Solar_irradiance
- Human skin (body surface area): ~1.7-1.9 m² for a typical adult (Mosteller: 70 kg, 170 cm → 1.82 m²). We use **1.8 m²**;
  only about **half faces the sun** at any moment → ~0.9 m² ("about one square metre").
  https://www.omnicalculator.com/health/bsa · https://www.rxlist.com/body_surface_area/definition.htm
- Photosynthetic efficiency (sunlight → stored chemical energy): theoretical max **4.6% (C3) / 6.0% (C4)** (Zhu, Long & Ort 2010);
  best field values 3.5% / 4.3% short-term, 2.4% / 3.4% over a season; typical crops realise well under half the max → **~1-2%**.
  https://experts.illinois.edu/en/publications/what-is-the-maximum-efficiency-with-which-photosynthesis-can-conv/
  https://lab.igb.illinois.edu/ort/sites/lab.igb.illinois.edu.ort/files/2023-02/Photosynthetic%20Efficiency%20Improvemen.pdf
  https://bionumbers.hms.harvard.edu/bionumber.aspx?id=106364
- Why leaves are green: chlorophyll a/b absorb strongly in the blue (~430-450 nm) and red (~640-680 nm) and reflect green (~500-560 nm).
  https://en.wikipedia.org/wiki/Chlorophyll
- Tennis court (ITF Rule 1): 23.77 m × 10.97 m (doubles) = **260.8 m²**.
  https://dlgsc.wa.gov.au/sport-and-recreation/sports-dimensions-guide/tennis

## Calculation (python)
```
need = 2000 kcal × 4184 J = 8.368 MJ/day
sun on sun-facing skin = 250 W/m² × 0.9 m² × 86,400 s = 19.44 MJ/day
1 % efficiency → 0.194 MJ =  46 kcal = 2.3 % of daily need
2 % efficiency → 0.389 MJ =  93 kcal = 4.6 % of daily need       → script: "fifty to ninety calories" (≈ 2-5 %)
4.6 % (theoretical C3 max) → 214 kcal = 10.7 %
area needed (flat, all facing the sun) = 8.368 MJ / (250 W/m² × 86,400 s × eff)
  1 %  → 38.7 m²  ≈ "forty square metres"  = 21.5 × total skin of 1.8 m² → "twenty times the skin you have"
  2 %  → 19.4 m²
  4.6 % →  8.4 m²
global 24-h mean 187 W/m² at 1 % → 51.8 m²
```
- The popular "skin the size of a tennis court" line is an exaggeration: a tennis court (261 m²) would only be needed at
  ~0.15 % efficiency. With realistic 1 % plant efficiency the real answer is ~40 m² — about **one sixth of a tennis court**
  (shown visually as a green patch inside a tennis-court outline).
- Sanity check: even at noon peak (1,000 W/m²) on 0.9 m² for 8 hours at 1 % → only ~62 kcal.
