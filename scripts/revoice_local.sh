#!/usr/bin/env bash
# revoice_local.sh <episode_dir>... : re-voice with free local Chatterbox, then time-warp and queue a re-render.
cd "$(dirname "$0")/.."
for EP in "$@"; do
  EP=${EP%/}; echo "$(date +%T) voicing $EP"
  /opt/cbx/bin/python scripts/tts_chatterbox.py "$EP/script.txt" "/tmp/$(basename $EP)_cb.wav" > "/tmp/$(basename $EP)_cb.log" 2>&1 || { echo "FAILED $EP"; continue; }
  rm -f "$EP/AWAIT_VOICE"
  bash scripts/revoice_apply.sh "$EP" "file:///tmp/$(basename $EP)_cb.wav" '{"engine":"chatterbox (local, free)","voice":"chatterbox default male"}'
done
echo "ALL DONE"
