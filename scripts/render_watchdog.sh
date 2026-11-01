#!/usr/bin/env bash
# Keeps the render queue alive: if it is paused (or dead) and no TTS has run for 60 s, resume it.
cd "$(dirname "$0")/.."
idle=0
while true; do
  if pgrep -f tts_chatterbox >/dev/null || pgrep -f "scripts/words.py" >/dev/null; then idle=0; else idle=$((idle+15)); fi
  if [ $idle -ge 60 ] && ! pgrep -f engine/queue.sh >/dev/null; then
    if flock -n /tmp/whatif_tts.lock true; then rm -f engine/PAUSED; bash scripts/resume.sh 9>&- >/dev/null 2>&1; echo "$(date -u +%T) resumed"; fi
  fi
  sleep 15
done
