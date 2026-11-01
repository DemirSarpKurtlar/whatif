#!/usr/bin/env bash
# post_list.sh <gap_seconds> <ep> [<ep>...] : publish the given episodes now, in order, skipping any already on the account.
cd "$(dirname "$0")/.."
gap="$1"; shift
for ep in "$@"; do
  python3 scripts/ig_publish.py --posted-titles > /tmp/ig_posted_titles.txt
  first=$(head -1 "episodes/$ep/caption.txt" | sed 's/[[:space:]]*$//')
  grep -qxF "$first" /tmp/ig_posted_titles.txt && { echo "skip $ep (already posted)"; continue; }
  url=$(python3 -c "import json;print(json.load(open('posts/media.json')).get('$ep',''))")
  cover=$(python3 -c "import json;print(json.load(open('posts/media.json')).get('${ep}_cover',''))")
  [ -z "$url" ] && { echo "skip $ep (not uploaded yet)"; continue; }
  src=(--video-url "$url"); [ -n "$cover" ] && src+=(--cover-url "$cover")
  fc="Part 2 or a new What If? 👇 Comment your idea - the best one gets simulated next! 🔁 Save this so you can find Part 2."
  [ -f "episodes/$ep/first_comment.txt" ] && fc=$(cat "episodes/$ep/first_comment.txt")
  out=$(python3 scripts/ig_publish.py "${src[@]}" --caption-file "episodes/$ep/caption.txt" --thumb-ms 1500 --first-comment "$fc" 2>&1)
  link=$(echo "$out" | tail -1 | python3 -c "import json,sys;print(json.load(sys.stdin).get('permalink',''))" 2>/dev/null)
  if [ -n "$link" ]; then echo "$ep $link"; echo "$ep" >> posts/posted.txt; echo "| $(date -u +%F' '%H:%M) | $ep | $link |" >> posts.md
  else echo "FAIL $ep: $(echo "$out" | tail -2 | sed "s/$IG_ACCESS_TOKEN/REDACTED/g")"; fi
  sleep "$gap"
done
echo "batch done"
