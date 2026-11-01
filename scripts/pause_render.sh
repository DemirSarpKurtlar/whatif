#!/usr/bin/env bash
# Pause the render queue (finished chunks are kept; resume with: rm engine/PAUSED; bash scripts/resume.sh)
cd "$(dirname "$0")/.."
touch engine/PAUSED
for p in $(ps -eo pid,args | awk '/engine\/queue.sh|engine\/render.mjs|engine\/finish.sh/ && !/awk/ {print $1}'); do kill $p 2>/dev/null; done
sleep 2
for p in $(ps -eo pid,args | awk '(/headless_shell|chrom(e|ium).*headless/ || /ffmpeg .*\.parts\//) && !/awk/ {print $1}'); do kill $p 2>/dev/null; done
sleep 1; rm -f episodes/*/video.mp4.parts/*.tmp.mp4
echo paused
