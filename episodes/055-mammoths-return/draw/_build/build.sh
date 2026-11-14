#!/usr/bin/env bash
# Build: each scene body s_<name>.js -> ../<name>.js with the Ink & Gold helpers (00_ink.js, copied from 038/045) and the 055 silhouettes (10_shapes.js) inlined.
cd "$(dirname "$0")"
for f in s_*.js; do n=${f#s_}; { head -1 "$f"; cat 00_ink.js 10_shapes.js; tail -n +2 "$f"; } > "../$n"; done
ls ..
