#!/usr/bin/env bash
# render_and_post.sh <slot> : for a fresh cloud session with no Higgsfield access.
# Takes the <slot>-th (0-based) pending episode in posts/schedule.txt (not yet on Instagram), renders it if
# there is no uploaded copy, and publishes it (local resumable upload). Slots let two schedules work in parallel.
set -uo pipefail
cd "$(dirname "$0")/.."
slot="${1:-0}"
python3 -c "import numpy, scipy" 2>/dev/null || pip install -q numpy scipy 2>/dev/null || pip install -q --break-system-packages numpy scipy
python3 -c "import numpy, scipy" || { echo "numpy/scipy missing and could not be installed"; exit 1; }
python3 scripts/ig_publish.py --posted-titles > /tmp/ig_posted_titles.txt || exit 1
pending=()
for ep in $(grep -v '^#' posts/schedule.txt); do
  [ -f "episodes/$ep/caption.txt" ] || continue
  first=$(head -1 "episodes/$ep/caption.txt" | sed 's/[[:space:]]*$//')
  grep -qxF "$first" /tmp/ig_posted_titles.txt && continue
  url=$(python3 -c "import json;print(json.load(open('posts/media.json')).get('$ep',''))")
  if [ -z "$url" ] && { [ ! -f "episodes/$ep/spec.mjs" ] || [ ! -f "episodes/$ep/voice.mp3" ]; }; then continue; fi
  pending+=("$ep")
done
[ ${#pending[@]} -gt "$slot" ] || { echo "nothing pending for slot $slot"; exit 0; }
ep="${pending[$slot]}"; d="episodes/$ep"
echo "slot $slot -> $ep"; [ -n "${DRYRUN:-}" ] && { echo "pending: ${pending[*]}"; exit 0; }
url=$(python3 -c "import json;print(json.load(open('posts/media.json')).get('$ep',''))")
cover=$(python3 -c "import json;print(json.load(open('posts/media.json')).get('${ep}_cover',''))")
fc="Part 2 or a new What If? 👇 Comment your idea - the best one gets simulated next! 🔁 Save this so you can find Part 2."
[ -f "$d/first_comment.txt" ] && fc=$(cat "$d/first_comment.txt")
if [ -n "$url" ]; then
  src=(--video-url "$url"); [ -n "$cover" ] && src+=(--cover-url "$cover")
else
  echo "rendering $ep ..."
  node engine/render.mjs "$d/spec.mjs" --out "$d/video.mp4" --workers 2 --chunk 24 > /tmp/render_$ep.log 2>&1 || { tail -5 /tmp/render_$ep.log; exit 1; }
  bash engine/finish.sh "$d" > /tmp/finish_$ep.log 2>&1 || { tail -5 /tmp/finish_$ep.log; exit 1; }
  [ -f "out/ig/$ep.mp4" ] || { echo "no out/ig/$ep.mp4"; exit 1; }
  src=(--video-file "out/ig/$ep.mp4")
fi
# re-check right before publishing (another session may have posted it meanwhile)
python3 scripts/ig_publish.py --posted-titles > /tmp/ig_posted_titles.txt
first=$(head -1 "$d/caption.txt" | sed 's/[[:space:]]*$//')
grep -qxF "$first" /tmp/ig_posted_titles.txt && { echo "already posted meanwhile: $ep"; exit 0; }
python3 scripts/ig_publish.py "${src[@]}" --caption-file "$d/caption.txt" --thumb-ms 1500 --first-comment "$fc"
