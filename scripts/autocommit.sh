#!/usr/bin/env bash
# Background auto-commit while parallel agents work: every 90 s, commit and push any changes.
cd "$(dirname "$0")/.."
while true; do
  if [ -n "$(git status --porcelain)" ]; then
    git add -A . && git commit -qm "Auto-save: parallel episode work

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_016gMrsdtA5NQMKnRMRZrMt3" >/dev/null 2>&1
    git push -q origin claude/whatif-autopilot >/dev/null 2>&1 || true
  fi
  sleep 90
done
