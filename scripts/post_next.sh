#!/usr/bin/env bash
# Publish the next finished, unposted episode to Instagram Reels and log it.
set -euo pipefail
cd "$(dirname "$0")/.."
: "${IG_ACCESS_TOKEN:?set IG_ACCESS_TOKEN in the environment settings}"; : "${IG_USER_ID:?set IG_USER_ID}"
for ep in $(grep -v '^#' posts/schedule.txt); do
  grep -qx "$ep" posts/posted.txt && continue
  [ -f "episodes/$ep/DONE" ] && [ -f "out/$ep.mp4" ] || continue
  out=$(python3 scripts/ig_publish.py --video-file "out/$ep.mp4" --caption-file "episodes/$ep/caption.txt" --thumb-ms 1500 \
        --first-comment "Which What If should we simulate next? 👇 Drop it in the comments!")
  echo "$out"
  echo "$ep" >> posts/posted.txt
  link=$(echo "$out" | tail -1 | python3 -c "import json,sys;print(json.load(sys.stdin).get('permalink',''))")
  echo "| $(date -u +%F' '%H:%M) | $ep | $link |" >> posts.md
  exit 0
done
echo "nothing to post"
