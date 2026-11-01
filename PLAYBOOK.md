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

## ⚡ Çalışma kuralı
- ⚡ **HER ZAMAN PARALEL VE HIZLI ÇALIŞ** (sahibin kalıcı kuralı): birden fazla bölümü aynı anda alt ajanlara ver, bekleme sürelerini başka işle doldur.

## 🔥 Viral kuralları (2026-11 güncellemesi, sadece Instagram)
- **Uzunluk 30-40 sn** → senaryo **85-105 kelime**. İlk cümle = başlık sorusu, son cümle = izleyiciye soru.
- **Aksiyonla açılış:** motor, başlık ekrandayken otomatik olarak videonun ~%55'indeki dramatik sahneyi gösterir
  (`spec.hook = {scene, at}` ile elle seçilebilir, `hook: false` ile kapatılır). İlk 0.5 sn'de hareket şart.
- Her 2-4 sn'de yeni görsel bilgi (sayı/HUD değişimi, kesme, flaş). Ölü an yok.
- Konu seçmeden önce `python3 scripts/ig_publish.py --insights` çıktısına bak (yeni oturumlarda token ortamda var):
  izlenme ve ortalama izlenme süresi en yüksek konunun **"Part 2"**'sini sıraya al (ör. "What if gravity switched off for 1 minute?").
- Zayıf (ortalamanın yarısından az izlenme) konu tipini 2 hafta tekrar etme.
- Ses: ElevenLabs Holden (kredi varsa) → yoksa Chatterbox (`scripts/tts_chatterbox.py`, ücretsiz). Kokoro kullanma.
- Yayın (2026-11-01 sahibin isteği): **her saat** (:59) zamanlanmış görev `scripts/post_next.sh` çalıştırır (günde ~24; IG limiti 50/24 sa).
  📦 Havuz kuralı: yüklü ama paylaşılmamış **en az 5-6 yan video** her zaman hazır olmalı; zombi serisi daha yavaş (oylamaya bağlı).
  Üretim paralel: her yeni bölümü ayrı bir alt ajan hazırlar (TTS için `scripts/voice.sh`), ana oturum render/QA/yükleme/sıra yönetir;
  yeni bölüm `posts/schedule.txt`'e eklenmeli ve videosu + kapağı `posts/media.json`'a (Higgsfield URL) girmeli.

### 📊 İlk veri (2026-11-01): gravity 1173 izlenme / %41 izlenme oranı, tunnel 777 / %30, ice-melts 3 sn'de kaybetti.
- İzleyici ortalama 16-25 sn izliyor → hedef 30-40 sn kesin. İlk saniyede aksiyon, yavaş açılış yok.
- Paylaşım/kaydetme 0 → caption'da "📤 Send this to a friend…" satırı + ilk yorumda "Save this for Part 2" zorunlu.
- Gönderiler arası en az 3 saat.
- 📦 Stok kuralı: `posts/media.json`'da yüklü ama paylaşılmamış en az 3 video her zaman hazır olmalı. Altına düşerse yeni üretim her şeyin önüne geçer.
- Seslendirme (Chatterbox) render ile aynı anda çok yavaş: `bash scripts/pause_render.sh` → TTS → `rm engine/PAUSED; bash scripts/resume.sh`.

## 🧟 Zombi Salgını (interaktif seri) — sabit stil
- Stil HER bölümde aynı: düz 2D vektör, lacivert gece, kalın Inter Display yazılar, kırmızı/krem dev sayılar
  (Higgsfield "Night Flat" görsel dili; referansın öğeleri/karakterleri KULLANILMAZ). Motor: `style: "flat"`, sahneler `draw:` (JS, engine/draw/flatlib.js).
- Kanon ve bölüm tablosu: `series/zombie/story.md`. Her bölüm 28-35 sn, sonunda A/B seçimi (endCard.choices) + "COMMENT A OR B".
- Bölüm klasöründe: `choices.json` (A/B metin + anahtar kelimeler), `first_comment.txt` (oylama yorumu).
- Paylaşımdan ~24 saat sonra: `python3 scripts/count_votes.py <bölüm>` → çoğunluk kazanır (beraberlikte daha dramatik seçenek).
  Kazananı story.md'ye yaz, bir sonraki bölümü o seçimle üret ve sıraya koy. `whatif-zombie-votes` görevi her gün 19:37'de oyları raporlar.
- Instagram API Reels'e anket çıkartması ekleyemiyor; oylama yorumlarla yapılıyor.

## 🎨 Diğer (yan) videolar
- Higgsfield Content Factory stil kataloğundaki (get_preset_instructions /content-factory) stillerden konuya en uygun olanı seç
  (ör. Toy Planet, Pixel Night, Ink & Gold, Blueprint Line...). Görsel dili uyarla, referans videoların içeriğini/karakterlerini kopyalama.

## 🤝 Pluginler (sahibin isteği)
- **Ruflo Ai Team** plugini (beceriler, komutlar, ajanlar) oturumda yüklüyse iş bölme, takip ve hafıza için her turda kullan.
- **RuFlo Federation** araçlarını (mcp__RuFlo_Federation__*) KULLANMA: herkese açık bir ağ, proje bilgisi oraya gitmemeli.

## 1. Araştırma ve senaryo
- WebSearch ile 4-6 sayısal gerçek bul; `episodes/<..>/sources.md` dosyasına kaynak linkleriyle yaz.
- Senaryo 85-105 kelime (≈30-40 sn). Yapı: kanca sorusu (0-3 sn) → normal an → olay → 3-5 tırmanan vuruş
  (her biri tek sayı + tek görsel) → çözülme → sürpriz son bilgi → izleyiciye soru.
- Sayıları kelimeyle yaz ("thirteen hundred"), tek tırnak etiketleri: `[pause]`, `[leaning in]`.
- `script.txt` olarak kaydet.

## 2. Seslendirme
- Varsayılan (ücretsiz): `python3 scripts/tts_kokoro.py script.txt voice.wav am_michael 1.0`
- Higgsfield kredisi ≥ 6 ise ElevenLabs v4 (Holden, stability 0.45) daha doğal: Content Factory
  voiceover referansındaki tek `generate_audio` çağrısı. (Bir video ≈ 4.6 kredi.)
- faster-whisper ile kelime zamanlarını çıkar (`words.json`), metinle karşılaştır; kopukluk varsa bir kez yeniden üret.

## 3. Sahne (yerel motor — varsayılan)
- Motor: `engine/render.mjs` (headless Chromium + WebGL GLSL sahneler + Canvas2D HUD/altyazı katmanı).
- Bölüm klasörü: `script.txt`, `voice.mp3`, `words.json`, `spec.mjs`, `sfx.json`, `shaders/*.glsl` (isteğe bağlı yeni setler).
- Hazır setler `engine/shaders/`: park (şehir parkı, insanlar, fontan), earth (uzaydan Dünya), sky (uçak).
  Bölümlerin ürettiği ek setler: street, coast/ocean, crowd, earthcut, tunnel, parkslip, rings... (bkz. `episodes/*/shaders`).
- `spec.mjs` formatı: `episodes/001-gravity-off/spec.mjs` (title, scenes, hud, huds, captions, bigs, flashes, elapsed, endCard).
- Önizleme: `node engine/render.mjs episodes/<ep>/spec.mjs --preview 2,8,15,... --out /tmp/prev` → kareleri döşe, gözle kontrol et.
- Seslendirme: ElevenLabs `eleven_v4`, ses Oliver (`lo1O1Dz1Tu4FWVEPaxuT`), ~900 kredi/video; yedek: Kokoro (ücretsiz).
- Kelime zamanları: `python3 scripts/words.py voice.mp3 words.json`.

## 4-5. Render + ses tasarımı (otomatik kuyruk)
- `touch episodes/<ep>/READY` → `engine/queue.sh` (arka planda) render eder, `engine/finish.sh` ile
  `sfx.json`'dan SFX yatağı üretir, sesi ducking ile miksler, -14 LUFS, `final.mp4` + `qa_sheet.jpg` + `out/<ep>.mp4`.
- Kuyruk çalışmıyorsa: `nohup bash engine/queue.sh &`.

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
