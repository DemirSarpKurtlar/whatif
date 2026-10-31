# Otonom What-If döngüsü — playbook 🔁

Bu dosya her zamanlanmış oturumun (veya elle başlatılan bir turun) adım adım talimatıdır.
Bir tur = 1 video: fikir → araştırma → senaryo → ses → 3D sahne → render → ses tasarımı → QA → yayın → kayıt.
Format: 9:16, 1080x1920, 30 fps, ~60 sn, İngilizce anlatım (küresel erişim için).
Görsel stil: Higgsfield "Park Skyline" referansı (bkz. `episodes/001-gravity-off/refs/style.md`).

## 0. Hazırlık
- `git pull`, `ideas/backlog.md` içinden ilk `todo` satırını al, `wip` yap.
- Slug: kısa kebab-case (ör. `earth-stops-spinning`). Klasör: `episodes/<NNN>-<slug>/`.
- Ortam: Higgsfield MCP (sandbox_exec, media_upload), ffmpeg, Kokoro TTS (`/opt/tts`, yoksa
  `pip install kokoro-onnx soundfile` + model dosyaları, bkz. `scripts/setup.sh`).

## 1. Araştırma ve senaryo
- WebSearch ile 4-6 sayısal gerçek bul; `episodes/<..>/sources.md` dosyasına kaynak linkleriyle yaz.
- Senaryo ~150 kelime (≈55-60 sn). Yapı: kanca sorusu (0-3 sn) → normal an → olay → 3-5 tırmanan vuruş
  (her biri tek sayı + tek görsel) → çözülme → sürpriz son bilgi → izleyiciye soru.
- Sayıları kelimeyle yaz ("thirteen hundred"), tek tırnak etiketleri: `[pause]`, `[leaning in]`.
- `script.txt` olarak kaydet.

## 2. Seslendirme
- Varsayılan (ücretsiz): `python3 scripts/tts_kokoro.py script.txt voice.wav am_michael 1.0`
- Higgsfield kredisi ≥ 6 ise ElevenLabs v4 (Holden, stability 0.45) daha doğal: Content Factory
  voiceover referansındaki tek `generate_audio` çağrısı. (Bir video ≈ 4.6 kredi.)
- faster-whisper ile kelime zamanlarını çıkar (`words.json`), metinle karşılaştır; kopukluk varsa bir kez yeniden üret.

## 3. Sahne (Higgsfield sandbox, Higgsedit + GLSL)
- Önceki bölümün `edit/` klasörünü şablon al (lib/park/earth/sky.glsl, comps.jsx, edit.jsx).
  Dosyaları sandbox'a taşımak: zip → `media_upload` → PUT → sandbox'ta `curl` ile indir.
- Ses dosyası: `media_upload` (audio) → sandbox'ta `curl`.
- `edit.jsx`: SC (sahne listesi), CAP (altyazılar, kelime zamanlarından), HUD (kategori · etiket · büyük değer · alt satır),
  ELAPSED sayacı, bitiş kartı ("WHERE WOULD YOU BE STANDING?").
- Her sahnede kamera hareket etmeli; 4-6 sn'de bir kesme; ilk kare kanca başlığı.
- `higgsedit build edit.jsx` → 4-8 önizleme karesi (`higgsedit frame`) → 540x960 JPEG → gözle kontrol → düzelt.

## 4. Render
- `size: "xl"`, `background: true`, en fazla ~30 sn'lik `--range` parçaları (15 dk sınırı).
  `higgsedit render . --range 0:30 --bitrate 8M --out renders/part1.mp4`, sonra `30:<END>`.
- Parçaları ffmpeg concat (`-c copy`) ile birleştir.

## 5. Ses tasarımı
- `audio/sfx.py` (numpy): rüzgâr/ambiyans yatağı, uzay drone'u, ambient pad, olay anlarına efekt
  (power-down, whoosh, bloop, jet, deprem gürlemesi, darbe/thud, bitiş çanı). Zamanları senaryoya göre değiştir.
- Miks: ses + yatak, sidechaincompress ile ducking; final -14 LUFS, true peak ≤ -1 dB.

## 6. QA (yayından önce zorunlu) ✅
- ffprobe: 1080x1920, 30 fps, süre 55-65 sn, ses akışı var.
- 8 kare (her sahneden) 540x960 JPEG olarak incele: kırık geometri, siyah kare, taşan yazı,
  okunmayan altyazı, yanlış sayı, HUD çakışması yok mu?
- Altyazılar konuşmayla senkron mu (words.json)? Bilimsel iddialar sources.md ile tutarlı mı?
- `virality_predictor` (Higgsfield) kullanılabiliyorsa skoru `episodes/<..>/qa.md`'ye yaz.
- Herhangi bir madde başarısızsa düzelt ve tekrar render et (en fazla 3 tur). Hâlâ kötüyse yayınlama,
  `qa.md`'ye nedenini yaz, backlog'da `blocked` yap.

## 7. Yayın 📲
- Final dosyayı `media_upload` ile Higgsfield'a yükle → kalıcı cloudfront URL → `register_what_if_result`.
- Instagram: `scripts/ig_publish.py` Higgsfield sandbox'ında çalıştırılır (bu konteynerden instagram.com engelli).
  `IG_USER_ID` ve `IG_ACCESS_TOKEN` ortam değişkenleri komuta inline verilir (repo'ya ASLA yazılmaz).
  `python3 ig_publish.py --video-url <cloudfront mp4> --caption-file caption.txt --thumb-ms 1200`
- Caption: kanca cümlesi + 1 merak cümlesi + soru (yorum tetikler) + 5-8 hashtag
  (#whatif #science #physics #space #3danimation #didyouknow ...).

## 8. Kayıt
- `posts.md`'ye tarih, başlık, IG permalink, süre, ses motoru ekle; backlog satırını `done` yap.
- Commit + push (`claude/...` dalı).
- Instagram limitine dikkat: 24 saatte en fazla 50 API yayını; bu hesap için hedef günde 1-3 video.
