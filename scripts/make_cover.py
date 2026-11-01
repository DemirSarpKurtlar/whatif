#!/usr/bin/env python3
"""make_cover.py <episode_slug> : designed Reels cover -> out/covers/<slug>.jpg
Dramatic frame (~45% into the video), dark gradient, big centered serif title (grid-safe 3:4 area), accent 'WHAT IF'."""
import re, subprocess, sys, textwrap, json, os
slug = sys.argv[1]
src = f"out/{slug}.mp4"
dur = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",src],capture_output=True,text=True).stdout)
spec = open(f"episodes/{slug}/spec.mjs").read()
m = re.search(r'title:\s*\{\s*text:\s*"([^"]+)"', spec)
title = m.group(1) if m else slug
body = re.sub(r"^What if\s+", "", title, flags=re.I)
lines = textwrap.wrap(body, 16)
mc = re.search(r"\bcover:\s*([\d.]+)", spec)
t = float(os.environ.get("COVER_T", mc.group(1) if mc else dur * 0.42))
FS = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
SB = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
esc = lambda s: s.replace("\\","\\\\").replace(":","\\:").replace("'","\u2019").replace("%","\\%")
n = len(lines); fs = 118 if n <= 3 else 100; lh = int(fs * 1.12)
y0 = 960 - (n * lh) // 2 + 40
dt = [f"drawtext=fontfile={SB}:text='WHAT IF':fontsize=64:fontcolor=0xFFD866:x=(w-text_w)/2:y={y0-110}:shadowcolor=black@0.7:shadowx=0:shadowy=4"]
for i, l in enumerate(lines):
    dt.append(f"drawtext=fontfile={FS}:text='{esc(l)}':fontsize={fs}:fontcolor=white:x=(w-text_w)/2:y={y0+i*lh}:shadowcolor=black@0.8:shadowx=0:shadowy=6")
vf = ("scale=1080:1920,eq=brightness=-0.06:saturation=1.15,"
      "drawbox=x=0:y=560:w=1080:h=820:color=black@0.38:t=fill,"
      + ",".join(dt))
os.makedirs("out/covers", exist_ok=True)
# clean 3D frame (no HUD/captions) straight from the engine; t is in the audio timeline
tmp = f"/tmp/cover_{slug}"
env = dict(os.environ, WHATIF_CLEAN="1")
subprocess.run(["node","engine/render.mjs",f"episodes/{slug}/spec.mjs","--gl","1080x1920","--preview",f"{round(t,1):g}","--out",tmp],check=True,env=env,capture_output=True)
subprocess.run(["ffmpeg","-v","error","-y","-i",f"{tmp}/f{round(t,1):g}.jpg","-vf",vf,"-q:v","2",f"out/covers/{slug}.jpg"],check=True)
print("cover", slug, f"t={t:.1f}", lines)
