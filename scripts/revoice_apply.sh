#!/usr/bin/env bash
# revoice_apply.sh <episode_dir> <audio_url> <voice_json>
# Swap in a new narration: keep the old take as *_old, align timelines (warp.json), queue a re-render.
set -euo pipefail
EP=$1; URL=$2; META=$3
cd "$EP"
for f in voice.mp3 voice.wav; do [ -f "$f" ] && [ ! -f "${f%.*}_old.${f##*.}" ] && mv "$f" "${f%.*}_old.${f##*.}"; done
rm -f voice.mp3 voice.wav
[ -f words_old.json ] || mv words.json words_old.json
curl -sSfL -o voice.mp3 "$URL"
echo "$META" > voice.json
python3 ../../scripts/words.py voice.mp3 words.json > /dev/null 2>&1
python3 ../../scripts/retime.py .
rm -f DONE FAILED READY AUTHORED; touch REDO
