#!/usr/bin/env bash
# voice.sh <episode-folder> [exaggeration] : Chatterbox narration + word timings, serialized with a lock.
# The render keeps running at the lowest CPU priority while the TTS runs.
set -euo pipefail
cd "$(dirname "$0")/.."
EP="episodes/$1"; EX="${2:-0.5}"
[ -f "$EP/script.txt" ] || { echo "missing $EP/script.txt"; exit 1; }
exec 9>/tmp/whatif_tts.lock
flock 9
# The render queue runs at nice 19, so TTS gets the CPU without stopping the render.
for p in $(ps -eo pid,args | awk '/engine\/queue.sh|engine\/render.mjs|headless_shell|ffmpeg .*\.parts\// && !/awk/ {print $1}'); do renice -n 19 -p $p >/dev/null 2>&1 || true; done
/opt/cbx/bin/python scripts/tts_chatterbox.py "$EP/script.txt" "$EP/voice.wav" "$EX" 0.5 > "/tmp/tts_$1.log" 2>&1
python3 scripts/words.py "$EP/voice.wav" "$EP/words.json" >> "/tmp/tts_$1.log" 2>&1
grep -E "^wrote|LAST_END" "/tmp/tts_$1.log"
grep -oE "^[A-Z][a-z]*@0\.0.*" "/tmp/tts_$1.log" | head -1
