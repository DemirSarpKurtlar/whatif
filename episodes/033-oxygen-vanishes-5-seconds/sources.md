# Sources — 033 What if Earth lost all its oxygen for 5 seconds?

Scenario as narrated: the free oxygen in the air (O2, and with it ozone, O3) vanishes for 5 s and then returns.
Oxygen that is chemically bound (water, rock, concrete, CO2) stays where it is.

## Facts used on screen
1. **Air is ~20.95 % oxygen, ~78.08 % nitrogen, ~0.93 % argon (dry air, by volume).**
   - https://en.wikipedia.org/wiki/Gas_composition (US Std. Atmosphere 1976: O2 20.9476 %)
   - https://sciencenotes.org/chemical-composition-air/
   - https://jan.ucc.nau.edu/jclark/Education%20Mesonet/Composition of the Atmosphere.htm
   → "a fifth of the air is gone".
2. **Pressure drop ≈ 21 % (≈ 21 kPa of 101.3 kPa).** Partial pressure of O2 ≈ 0.2095 × 101.325 = 21.2 kPa.
   Python check: remaining pressure 0.7905 atm ↔ standard-atmosphere altitude
   44330·(1 − 0.7905^(1/5.255)) = **1 939 m**; scale-height estimate −8.4 km·ln(0.7905) = 1 975 m → "like rocketing two kilometres up".
   - Ears: on ascent (falling outside pressure) middle-ear air normally vents passively through the Eustachian tube → a "pop".
     https://www.msdmanuals.com/home/ear-nose-and-throat-disorders/middle-ear-disorders/barotrauma-of-the-ear ,
     https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6779601/
   - When O2 returns, pressure rises back by the same amount → ears pop again (like descending).
3. **Fire needs oxygen** (fire triangle). Flames generally cannot sustain themselves below roughly 15–16 % O2; at 0 % every open flame goes out.
   - https://en.wikipedia.org/wiki/Fire_triangle
   - Petrol and diesel engines burn fuel with air oxygen → no O2, no combustion → they stall.
4. **Ozone layer**: O2 screens out UV below ~200 nm, ozone screens UV-C above ~200 nm and absorbs ~97–99 % of UV-B (NASA, via Wikipedia).
   - https://en.wikipedia.org/wiki/Ozone_layer
   - "Dozens of times harder than a summer noon" is our **rough estimate** (python, order-of-magnitude):
     erythemally weighted solar UV at the top of the atmosphere ≈ 10–15 W/m² (UV-C+UV-B below ~300 nm, weight ≈ 1),
     Rayleigh optical depth with N2 only ≈ 1.9 at 250 nm, 0.9 at 300 nm → maybe 30–50 % reaches the ground (direct + diffuse)
     → ≈ 4–7 W/m² vs. ≈ 0.25 W/m² at UV index 10 → roughly **20–30×** a strong summer noon.
     Over 5 s that is ≈ 20–35 J/m², well under one sunburn dose (~200–250 J/m²): **no instant sunburn**, but a real UV jolt.
5. **The sky stays blue**: Rayleigh scattering by both N2 and O2 molecules makes the sky blue; N2 is 78 % of the air,
   so the sky stays blue, only ~a fifth dimmer (fewer molecules scattering).
   - https://en.wikipedia.org/wiki/Rayleigh_scattering
   - https://www.atoptics.co.uk/blog/why-is-the-sky-blue/
6. **Oxygen in rock/concrete is chemically bound**: Earth's crust is ~46 % oxygen by mass, locked in silicates and oxides.
   Concrete hardens by cement reacting with water (hydration), not with air oxygen.
   - http://hyperphysics.gsu.edu/hbase/Tables/elabund.html
   - https://www.weforum.org/stories/nature-and-biodiversity/abundance-elements-earth-crust/

## Viral claims (popular "lose oxygen for 5 seconds" lists) — checked
| Claim | Verdict |
|---|---|
| "Concrete buildings crumble because oxygen is the binder" | **MYTH** (debunked on screen). The oxygen in concrete/rock is chemically bound in minerals; removing O2 gas does nothing to it. |
| "Water splits into hydrogen and the oceans evaporate" | **MYTH**. H2O is a compound; removing O2 gas does not break water molecules. |
| "The sky turns dark" | **MYTH**. Nitrogen does most of the Rayleigh scattering; the sky stays blue (slightly dimmer). |
| "Everyone at the beach gets an instant sunburn" | **Exaggerated**. UV jumps dozens of times, but 5 s is a fraction of a sunburn dose. |
| "Every human's eardrums/inner ears burst" | **Exaggerated**. A ~21 % drop is like a ~2 km climb in an instant; ears pop (painful for people with blocked ears), but this is a decompression the ear vents fairly well. |
| "Fires go out, combustion engines stop" | **TRUE**. No oxygen, no combustion. |
| "You suffocate" | **Mostly false for 5 s**. Blood carries oxygen for well over 5 s (people hold their breath far longer). |

Collected via web search (2026-11-01); viral lists e.g. greenmatters.com, unanswered.io, vocal.media, scienceabc.com.
