#!/usr/bin/env bash
# Render queue: picks episodes with READY (and no DONE/FAILED), renders + finishes them one at a time.
cd "$(dirname "$0")/.."
while true; do
  for d in episodes/*/; do
    d=${d%/}
    [ -f "$d/READY" ] && [ ! -f "$d/DONE" ] && [ ! -f "$d/FAILED" ] || continue
    echo "$(date +%T) START $d" >> engine/queue.log
    if node engine/render.mjs "$d/spec.mjs" --out "$d/video.mp4" --workers 2 > "$d/render.log" 2>&1 \
       && bash engine/finish.sh "$d" >> "$d/render.log" 2>&1; then
      touch "$d/DONE"; echo "$(date +%T) DONE $d" >> engine/queue.log
    else
      touch "$d/FAILED"; echo "$(date +%T) FAILED $d" >> engine/queue.log
    fi
  done
  sleep 15
done
