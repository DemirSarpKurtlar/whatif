#!/usr/bin/env python3
"""Publish a finished vertical video to Instagram as a Reel (official Graph API).

Runs anywhere with internet access (the Higgsfield sandbox can reach Instagram;
this repo's cloud container cannot). Standard library only.

Required environment variables:
  IG_USER_ID       Instagram professional account id (Business or Creator)
  IG_ACCESS_TOKEN  long-lived token with instagram_content_publish permission
Optional:
  IG_API_HOST      graph.facebook.com (Facebook Login token, default)
                   or graph.instagram.com (Instagram Login token)
  IG_API_VERSION   default v21.0

Usage:
  python3 ig_publish.py --video-url https://.../final.mp4 --caption-file caption.txt [--thumb-ms 1200]
  python3 ig_publish.py --video-file out/001.mp4 --caption-file caption.txt [--first-comment "..."]
  python3 ig_publish.py --check        # only verifies the token and account
Network: graph.facebook.com (+ rupload.facebook.com for --video-file) must be reachable.
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

HOST = os.environ.get("IG_API_HOST", "graph.facebook.com")
VER = os.environ.get("IG_API_VERSION", "v21.0")
BASE = f"https://{HOST}/{VER}"


def call(method, path, **params):
    params["access_token"] = os.environ["IG_ACCESS_TOKEN"]
    data = urllib.parse.urlencode(params).encode()
    url = f"{BASE}/{path}"
    if method == "GET":
        req = urllib.request.Request(f"{url}?{data.decode()}")
    else:
        req = urllib.request.Request(url, data=data, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        sys.exit(f"Instagram API error {e.code} on {path}: {body}")


def refresh():
    """Extend a long-lived Instagram-Login token by another 60 days (prints the new token's expiry, not the token)."""
    q = urllib.parse.urlencode({"grant_type": "ig_refresh_token", "access_token": os.environ["IG_ACCESS_TOKEN"]})
    with urllib.request.urlopen(f"https://graph.instagram.com/refresh_access_token?{q}", timeout=60) as r:
        d = json.loads(r.read())
    print(json.dumps({"expires_in_days": round(d.get("expires_in", 0) / 86400, 1)}))


def check():
    uid = os.environ["IG_USER_ID"]
    me = call("GET", uid, fields="username,media_count")
    lim = call("GET", f"{uid}/content_publishing_limit", fields="config,quota_usage")
    print(json.dumps({"account": me, "publishing_limit": lim}, indent=1))


def upload_file(path, cid_uri):
    size = os.path.getsize(path)
    req = urllib.request.Request(cid_uri, data=open(path, "rb").read(), method="POST", headers={
        "Authorization": "OAuth " + os.environ["IG_ACCESS_TOKEN"], "offset": "0", "file_size": str(size)})
    with urllib.request.urlopen(req, timeout=600) as r:
        return json.loads(r.read())


def publish(video_url, caption, thumb_ms, video_file=None, first_comment=None):
    uid = os.environ["IG_USER_ID"]
    params = dict(media_type="REELS", caption=caption, share_to_feed="true", thumb_offset=str(thumb_ms))
    if video_file:
        params["upload_type"] = "resumable"
    else:
        params["video_url"] = video_url
    c = call("POST", f"{uid}/media", **params)
    cid = c["id"]
    if video_file:
        print("upload", upload_file(video_file, c["uri"]), flush=True)
    print("container", cid, flush=True)
    for _ in range(90):  # up to ~15 min
        st = call("GET", cid, fields="status_code,status")
        code = st.get("status_code")
        print("status", code, flush=True)
        if code == "FINISHED":
            break
        if code in ("ERROR", "EXPIRED"):
            sys.exit(f"container failed: {json.dumps(st)}")
        time.sleep(10)
    else:
        sys.exit("container never finished processing")
    pub = call("POST", f"{uid}/media_publish", creation_id=cid)
    mid = pub["id"]
    info = call("GET", mid, fields="permalink,timestamp")
    if first_comment:
        call("POST", f"{mid}/comments", message=first_comment)
    print(json.dumps({"media_id": mid, **info}))


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--video-url")
    ap.add_argument("--video-file")
    ap.add_argument("--first-comment")
    ap.add_argument("--caption-file")
    ap.add_argument("--thumb-ms", type=int, default=1200)
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--refresh", action="store_true")
    a = ap.parse_args()
    if a.check:
        check()
    elif a.refresh:
        refresh()
    else:
        cap = open(a.caption_file, encoding="utf-8").read().strip()
        publish(a.video_url, cap, a.thumb_ms, a.video_file, a.first_comment)
