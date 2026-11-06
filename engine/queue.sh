#!/usr/bin/env bash
# Render queue v2. Priority 1: episodes with READY or AUTHORED and no DONE/FAILED.
# Priority 2: finished episodes with REDO (re-render with the current engine).
cd "$(dirname "$0")/.."
run() {
  local d=$1
  echo "$(date +%T) START $d" >> engine/queue.log
  if node engine/render.mjs "$d/spec.mjs" --out "$d/video.mp4" --workers 2 --chunk 24 > "$d/render.log" 2>&1 \
     && bash engine/finish.sh "$d" >> "$d/render.log" 2>&1; then
    touch "$d/DONE"; rm -f "$d/REDO"; echo "$(date +%T) DONE $d" >> engine/queue.log
  else
    touch "$d/FAILED"; echo "$(date +%T) FAILED $d" >> engine/queue.log
  fi
}
while true; do
  next=""
  for d in episodes/*/; do d=${d%/}
    { [ -f "$d/READY" ] || [ -f "$d/AUTHORED" ]; } && [ ! -f "$d/DONE" ] && [ ! -f "$d/FAILED" ] && { next=$d; break; }
  done
  if [ -z "$next" ]; then
    for d in episodes/*/; do d=${d%/}; [ -f "$d/REDO" ] && [ ! -f "$d/FAILED" ] && { rm -f "$d/DONE"; next=$d; break; }; done
  fi
  [ -n "$next" ] && run "$next" || sleep 20
done
