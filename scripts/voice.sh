#!/usr/bin/env bash
# voice.sh <episode-folder> [exaggeration] : Chatterbox narration + word timings, serialized with a lock.
# Pauses the render queue while the TTS runs (measured ~60x slower otherwise), then resumes it.
set -euo pipefail
cd "$(dirname "$0")/.."
EP="episodes/$1"; EX="${2:-0.5}"
[ -f "$EP/script.txt" ] || { echo "missing $EP/script.txt"; exit 1; }
exec 9>/tmp/whatif_tts.lock
flock 9
# Fairness: give the render queue at least 8 minutes of uninterrupted work after each resume before pausing it again.
while pgrep -f engine/queue.sh >/dev/null && [ -f /tmp/whatif_render_resumed ] && [ $(( $(date +%s) - $(cat /tmp/whatif_render_resumed) )) -lt 900 ]; do sleep 15; done
# Pause the render while the TTS runs: even at nice 19 the render makes Chatterbox ~60x slower (measured).
bash scripts/pause_render.sh 9>&- >/dev/null
trap 'rm -f engine/PAUSED; bash scripts/resume.sh 9>&- >/dev/null 2>&1 || true' EXIT
/opt/cbx/bin/python scripts/tts_chatterbox.py "$EP/script.txt" "$EP/voice.wav" "$EX" 0.5 > "/tmp/tts_$1.log" 2>&1
python3 scripts/words.py "$EP/voice.wav" "$EP/words.json" >> "/tmp/tts_$1.log" 2>&1
grep -E "^wrote|LAST_END" "/tmp/tts_$1.log"
grep -oE "^[A-Z][a-z]*@0\.0.*" "/tmp/tts_$1.log" | head -1
