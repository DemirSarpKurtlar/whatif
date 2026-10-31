#!/usr/bin/env python3
"""Free local narration with Kokoro-82M (ONNX). Usage: tts_kokoro.py script.txt out.wav [voice] [speed]
Bracketed delivery tags like [pause] are stripped; '[pause]' becomes a short silence."""
import re, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
src, out = sys.argv[1], sys.argv[2]
voice = sys.argv[3] if len(sys.argv) > 3 else "am_michael"
speed = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
text = open(src, encoding="utf-8").read()
k = Kokoro("/opt/tts/kokoro-v1.0.onnx", "/opt/tts/voices-v1.0.bin")
parts = re.split(r"\[pause\]", text)
audio = []
sr = 24000
for i, p in enumerate(parts):
    p = re.sub(r"\[[^\]]*\]", "", p).strip()
    if not p: continue
    a, sr = k.create(p, voice=voice, speed=speed, lang="en-us")
    audio.append(a)
    if i < len(parts) - 1: audio.append(np.zeros(int(sr * 0.45), dtype=a.dtype))
sf.write(out, np.concatenate(audio), sr)
print(out, round(sum(len(x) for x in audio) / sr, 2), "s")
