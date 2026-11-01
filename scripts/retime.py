#!/usr/bin/env python3
"""retime.py <episode_dir>
After re-voicing an episode, align the new narration (words.json) to the old one (words_old.json)
and write warp.json so the engine and SFX follow the new voice without hand-editing the spec.
warp.json = {"pairs": [[new_t, old_t], ...] (increasing), "end_new": float, "end_old": float}
"""
import json, os, re, sys, difflib

ep = sys.argv[1]
new = json.load(open(os.path.join(ep, "words.json")))
old = json.load(open(os.path.join(ep, "words_old.json")))
end_old = json.load(open(os.path.join(ep, "sfx.json")))["END"]
norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())
A = [norm(w["w"]) for w in old]; B = [norm(w["w"]) for w in new]
sm = difflib.SequenceMatcher(None, A, B, autojunk=False)
pairs = [[0.0, 0.0]]
for blk in sm.get_matching_blocks():
    for k in range(blk.size):
        o, n = old[blk.a + k], new[blk.b + k]
        for nt, ot in ((n["s"], o["s"]), (n["e"], o["e"])):
            if nt > pairs[-1][0] + 0.02 and ot > pairs[-1][1] + 0.02:
                pairs.append([round(nt, 3), round(ot, 3)])
end_new = round(new[-1]["e"] + (end_old - old[-1]["e"]), 3)
pairs.append([end_new, end_old])
matched = sum(b.size for b in sm.get_matching_blocks())
json.dump({"pairs": pairs, "end_new": end_new, "end_old": end_old}, open(os.path.join(ep, "warp.json"), "w"))
print(f"{os.path.basename(ep.rstrip('/'))}: matched {matched}/{len(A)} old words, END {end_old} -> {end_new}")
