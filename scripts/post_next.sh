#!/usr/bin/env bash
# Publish the next finished, unposted episode to Instagram Reels and log it.
# Video source: public URL from posts/media.json (preferred, works in any fresh session) or local out/<ep>.mp4.
set -euo pipefail
cd "$(dirname "$0")/.."
: "${IG_ACCESS_TOKEN:?set IG_ACCESS_TOKEN in the environment settings}"; : "${IG_USER_ID:?set IG_USER_ID}"
touch posts/posted.txt
# Stateless dedupe: what is already on the account (works even when this session cannot push to git)
python3 scripts/ig_publish.py --posted-titles > /tmp/ig_posted_titles.txt
for ep in $(grep -v '^#' posts/schedule.txt); do
  grep -qx "$ep" posts/posted.txt && continue
  first=$(head -1 "episodes/$ep/caption.txt" | sed 's/[[:space:]]*$//')
  grep -qxF "$first" /tmp/ig_posted_titles.txt && { echo "$ep" >> posts/posted.txt; continue; }
  url=$(python3 -c "import json,sys;print(json.load(open('posts/media.json')).get('$ep',''))" 2>/dev/null || true)
  cover=$(python3 -c "import json;print(json.load(open('posts/media.json')).get('${ep}_cover',''))" 2>/dev/null || true)
  if [ -n "$url" ]; then src=(--video-url "$url")
  elif [ -f "out/$ep.mp4" ]; then src=(--video-file "out/$ep.mp4")
  else continue; fi
  [ -n "$cover" ] && src+=(--cover-url "$cover")
  fc="Part 2 or a new What If? 👇 Comment your idea - the best one gets simulated next! 🔁 Save this so you can find Part 2."
  [ -f "episodes/$ep/first_comment.txt" ] && fc=$(cat "episodes/$ep/first_comment.txt")
  out=$(python3 scripts/ig_publish.py "${src[@]}" --caption-file "episodes/$ep/caption.txt" --thumb-ms 1500 --first-comment "$fc")
  echo "$out"
  echo "$ep" >> posts/posted.txt
  link=$(echo "$out" | tail -1 | python3 -c "import json,sys;print(json.load(sys.stdin).get('permalink',''))")
  echo "| $(date -u +%F' '%H:%M) | $ep | $link |" >> posts.md
  exit 0
done
echo "nothing to post"
