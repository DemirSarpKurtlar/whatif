#!/opt/cbx/bin/python
"""Free, high-quality local narration with Chatterbox (Resemble AI, MIT) on CPU.
Usage: /opt/cbx/bin/python scripts/tts_chatterbox.py script.txt out.wav [exaggeration] [cfg_weight]
Uses the model's built-in default voice (no cloning). Bracketed tags are stripped; [pause] -> 0.5 s silence.
"""
import re, sys, time
import torch, torchaudio
from chatterbox.tts import ChatterboxTTS

src, out = sys.argv[1], sys.argv[2]
exag = float(sys.argv[3]) if len(sys.argv) > 3 else 0.45
cfg = float(sys.argv[4]) if len(sys.argv) > 4 else 0.5
torch.set_num_threads(4)
text = open(src, encoding="utf-8").read()
model = ChatterboxTTS.from_pretrained(device="cpu")
sr = model.sr
blocks = re.split(r"\[pause\]", text)
pieces = []
t0 = time.time()
for bi, blk in enumerate(blocks):
    blk = re.sub(r"\[[^\]]*\]", "", blk).strip()
    if not blk:
        continue
    # sentence chunks of <= ~220 chars keep prosody stable
    sents = re.split(r"(?<=[.?!])\s+", blk)
    chunk, chunks = "", []
    for s in sents:
        if len(chunk) + len(s) > 220 and chunk:
            chunks.append(chunk); chunk = s
        else:
            chunk = (chunk + " " + s).strip()
    if chunk:
        chunks.append(chunk)
    for c in chunks:
        torch.manual_seed(7)
        wav = model.generate(c, exaggeration=exag, cfg_weight=cfg)
        pieces.append(wav)
        pieces.append(torch.zeros(1, int(sr * 0.18)))
        print(f"{time.time()-t0:6.1f}s  {c[:60]}", flush=True)
    if bi < len(blocks) - 1:
        pieces.append(torch.zeros(1, int(sr * 0.45)))
audio = torch.cat(pieces, dim=1)
torchaudio.save(out, audio, sr)
print("wrote", out, round(audio.shape[1] / sr, 2), "s in", round(time.time() - t0), "s")
