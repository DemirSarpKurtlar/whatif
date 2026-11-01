#!/usr/bin/env python3
"""Count A/B votes in the Instagram comments of an interactive episode.

Usage: python3 scripts/count_votes.py <episode-folder-name>
Finds the post whose caption starts with the first line of episodes/<ep>/caption.txt, reads every comment and
reply, and counts one vote per user (their latest vote wins). The account's own comments are ignored.
A vote is a comment that is just A or B (also "a!", "🅰️", "option b", "team A", "i pick b"), or one that mentions
only one option's keywords from episodes/<ep>/choices.json. Writes episodes/<ep>/votes.json and prints the tally.
Needs IG_ACCESS_TOKEN / IG_USER_ID (permission instagram_manage_comments). Never prints the token.
"""
import json, os, re, sys, urllib.parse, urllib.request
sys.path.insert(0, os.path.dirname(__file__))
import ig_publish as ig

ep = sys.argv[1]
base = os.path.join(os.path.dirname(__file__), "..", "episodes", ep)
first = open(os.path.join(base, "caption.txt"), encoding="utf-8").read().split("\n")[0].strip()
choices = json.load(open(os.path.join(base, "choices.json"))) if os.path.exists(os.path.join(base, "choices.json")) else {}
uid = os.environ["IG_USER_ID"].strip()
me = ig.call("GET", uid, fields="username").get("username", "")
media = [m for m in ig.call("GET", f"{uid}/media", fields="id,caption,permalink,timestamp", limit="50").get("data", [])
         if (m.get("caption") or "").split("\n")[0].strip() == first]
if not media:
    sys.exit(f"no post found for {ep} (caption first line: {first!r})")
m = media[0]

def pages(url):
    while url:
        with urllib.request.urlopen(url, timeout=60) as r:
            d = json.loads(r.read())
        yield from d.get("data", [])
        url = d.get("paging", {}).get("next")

q = urllib.parse.urlencode({"fields": "id,text,username,timestamp,replies{id,text,username,timestamp}", "limit": "50", "access_token": ig.TOKEN})
comments = []
for c in pages(f"{ig.BASE}/{m['id']}/comments?{q}"):
    comments.append(c)
    comments.extend((c.get("replies") or {}).get("data", []))

EMO = {"🅰": "A", "🅱": "B"}
def vote_of(text):
    s = (text or "").strip()
    for e, v in EMO.items():
        if s.startswith(e):
            return v
    u = re.sub(r"[^A-Za-z ]", " ", s).upper().split()
    if not u:
        return None
    if "A" in u and "B" in u:
        return None
    if len(u) == 1 and u[0] in ("A", "B"):
        return u[0]
    if u[0] in ("A", "B") and len(u) <= 6:
        return u[0]
    for i, w in enumerate(u[:-1]):
        if w in ("OPTION", "TEAM", "VOTE", "PICK", "CHOOSE", "CHOOSING", "GO", "DEFINITELY") and u[i + 1] in ("A", "B"):
            return u[i + 1]
    low = s.lower()
    hits = [k for k, c in choices.items() if any(re.search(r"\b" + re.escape(w) + r"\b", low) for w in c.get("keywords", []))]
    return hits[0] if len(hits) == 1 else None

votes = {}
for c in sorted(comments, key=lambda c: c.get("timestamp", "")):
    user = c.get("username") or c.get("id")
    if user == me:
        continue
    v = vote_of(c.get("text"))
    if v:
        votes[user] = v
tally = {"A": sum(1 for v in votes.values() if v == "A"), "B": sum(1 for v in votes.values() if v == "B")}
winner = "A" if tally["A"] > tally["B"] else "B" if tally["B"] > tally["A"] else "tie"
out = {"episode": ep, "permalink": m.get("permalink"), "posted": m.get("timestamp"), "comments": len(comments),
       "voters": len(votes), "tally": tally, "winner": winner}
json.dump(out, open(os.path.join(base, "votes.json"), "w"), indent=1)
print(json.dumps(out, ensure_ascii=False))
