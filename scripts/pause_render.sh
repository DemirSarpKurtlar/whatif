#!/usr/bin/env bash
# Pause the render queue (finished chunks are kept; resume with: rm engine/PAUSED; bash scripts/resume.sh)
# Only the queue's full renders are stopped; agents' --preview renders are left alone.
cd "$(dirname "$0")/.."
touch engine/PAUSED
for p in $(ps -eo pid,args | awk '(/engine\/queue.sh|engine\/finish.sh/ || (/engine\/render.mjs/ && !/--preview/)) && !/awk/ {print $1}'); do kill $p 2>/dev/null; done
sleep 2
# orphaned browsers / encoders of the killed render (parent is init)
for p in $(ps -eo pid,ppid,args | awk '$2 == 1 && (/headless_shell|chrom(e|ium).*headless/ || /ffmpeg .*\.parts\//) && !/awk/ {print $1}'); do kill $p 2>/dev/null; done
sleep 1; rm -f episodes/*/video.mp4.parts/*.tmp.mp4
echo paused
