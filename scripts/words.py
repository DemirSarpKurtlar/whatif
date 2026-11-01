#!/usr/bin/env python3
"""words.py <audio> <out.json> : word timestamps with faster-whisper (small, int8). Prints the transcript with times."""
import json, sys, subprocess
import numpy as np
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=2)
pcm = subprocess.run(["ffmpeg","-v","error","-i",sys.argv[1],"-f","s16le","-ac","1","-ar","16000","-"],capture_output=True,check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32)/32768.0
segs, _ = m.transcribe(audio, word_timestamps=True)
W = [{"w": w.word.strip(), "s": round(w.start, 2), "e": round(w.end, 2)} for s in segs for w in s.words]
json.dump(W, open(sys.argv[2], "w"))
print(" ".join(f"{x['w']}@{x['s']}" for x in W))
print("LAST_END", W[-1]["e"] if W else 0)
