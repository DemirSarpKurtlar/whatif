# whatif 🌍 — otonom "What If" 3D Reels fabrikası

Kodla çizilen 3D sahnelerde "What if…?" senaryoları anlatan 60 sn'lik dikey videolar üretir,
kendi kendine test eder ve Instagram'a Reels olarak yükler.

- `PLAYBOOK.md` — her turun adım adım otonom akışı (fikir → senaryo → ses → 3D → render → SFX → QA → yayın)
- `ideas/backlog.md` — fikir havuzu (her tur en üstteki `todo`'yu alır)
- `episodes/NNN-slug/` — her bölümün senaryosu, sesi, sahne kodu (GLSL + Higgsedit JSX), SFX scripti, kaynaklar
- `scripts/tts_kokoro.py` — ücretsiz yerel seslendirme (Kokoro-82M)
- `scripts/ig_publish.py` — Instagram Graph API ile Reels yayını
- `scripts/setup.sh` — yeni oturumda araç kurulumu
- `.mcp.json` — ffmpeg MCP sunucusu

Referans: @morrow.studio3d videoları ve Higgsfield Content Factory "What-If Shorts" (Park Skyline stili).
