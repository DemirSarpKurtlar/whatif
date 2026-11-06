# Sources / math — 041 What if Mount Fuji erupted today?

## Facts used in the script
- **Last eruption = Hōei eruption, 1707.** Began 16 Dec 1707 (Gregorian); ash fell for **16 days** (to ~1 Jan 1708).
  Cabinet Office (Japan) ash-fall working group summary: "1707年富士山宝永噴火・16日間にわたり降灰が継続し、総噴出量約17億m³の火山灰が堆積".
  JMA volcano catalogue: a large amount of ash fell on Edo on the first day; ~5 cm at Kawasaki.
  - https://www.bousai.go.jp/kazan/kouikikouhaiworking/pdf/2019322siryo3.pdf (Cabinet Office, 広域降灰対策 WG)
  - https://www.data.jma.go.jp/vois/data/filing/souran_eng/volcanoes/055_fujisan.pdf (JMA, Fujisan)
  - https://en.wikipedia.org/wiki/H%C5%8Dei_eruption (Edo ash "several centimetres", Edo ~100 km away)
- **Total ejecta ≈ 1.7 billion m³** (17億m³, Cabinet Office figure; note JMA gives 0.7 km³ dense-rock-equivalent magma — DRE is a smaller, compacted measure, so both are consistent).
  - Tokyo Dome volume ≈ 1.24 million m³ → 1.7e9 / 1.24e6 ≈ **1,371 → "nearly fourteen hundred times"** (python).
- **Distance:** Fuji summit (35.3606 N, 138.7274 E) → Tokyo Station 100.6 km, → Shinjuku 94.6 km (haversine, python) → "a hundred kilometres".
- **Ash reaches Tokyo in ~1-2 hours:** Tokyo Metropolitan Government AI/CG simulation video (Volcano Disaster Prevention Day, 26 Aug 2025).
  - https://www.livescience.com/planet-earth/volcanos/see-what-would-happen-to-tokyo-if-mount-fuji-erupted-without-any-warning-in-new-ai-generated-video
  - https://www.asiae.co.kr/en/article/2025090510074707661
  - https://www.scmp.com/week-asia/health-environment/article/3323181/japan-warns-public-catastrophic-mount-fuji-eruption-alarmist-simulation
- **Thresholds (Cabinet Office, 大規模噴火時の広域降灰対策, 2020 report + 2025 follow-up):**
  - Railways stop at **0.5 mm** of ash ("鉄道運行停止（降灰厚0.5mm）"; "微量の降灰で地上路線の運行が停止する").
  - Power outages possible at **3 mm of ash when wet** (rain makes ash conductive on insulators: "降雨時0.3cm以上で碍子の絶縁低下による停電").
  - Roads: two-wheel-drive cars can't pass at **10 cm dry** (3 cm when wet) ("乾燥時10cm以上、降雨時3cm以上の降灰で二輪駆動車が通行不能").
  - Transport in the capital paralysed within ~3 hours; worst case ~10 cm in Shinjuku after 15 days; ~490 million m³ of ash to remove in the metro area.
  - https://www.bousai.go.jp/kazan/kouikikouhaiworking/pdf/2019322siryo3.pdf
  - https://www.bousai.go.jp/kazan/kouhaikyougikai/kyougikai1kai/pdf/shiryo3.pdf
  - https://www.scmp.com/news/asia/east-asia/article/3077811/experts-warn-mount-fuji-eruption-could-cripple-tokyos-transport
  - https://www.tbsnews.net/node/63343 (Japanese panel warns eruption could paralyse Tokyo, 2020)
  - https://bernama.com/en/news.php?id=2322244 (2-10 cm+ in many Tokyo areas; 10 cm Shinjuku after 15 days; 490 million m³)
- **Silent for 319 years:** 2026 − 1707 = 319 (python).
- Context: Tokyo officials stress there are currently **no signs** of an imminent eruption; outcomes depend heavily on wind direction (westerlies carry ash toward Tokyo) and rain. Some experts (e.g. Prof. Kimiro Meguro, U. Tokyo) call the video "alarmist".

## Python check
```
haversine Fuji→Shinjuku 94.6 km, Fuji→Tokyo Stn 100.6 km
date(1708,1,1) - date(1707,12,16) = 16 days
2026 - 1707 = 319
1.7e9 / 1.24e6 = 1371
```
Note: en.wikipedia.org and bousai.go.jp could not be fetched from this container (network allowlist); Cabinet Office quotes were taken from search-result excerpts of those PDFs.
