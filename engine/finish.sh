#!/usr/bin/env bash
# finish.sh <episode_dir> : bed.wav (sfx) + voice -> ducked mix -> -14 LUFS -> mux with video.mp4 -> final.mp4 + QA sheet
set -euo pipefail
EP=$(cd "$1" && pwd); ENG=$(cd "$(dirname "$0")" && pwd)
END=$(python3 -c "import json,os;w='$EP/warp.json';print(json.load(open(w))['end_new'] if os.path.exists(w) else json.load(open('$EP/sfx.json'))['END'])")
python3 "$ENG/sfx.py" "$EP"
VOICE="$EP/voice.mp3"; [ -f "$VOICE" ] || VOICE="$EP/voice.wav"
ffmpeg -v error -y -i "$VOICE" -i "$EP/bed.wav" -filter_complex \
 "[0:a]aresample=48000,highpass=f=75,equalizer=f=250:t=q:w=1.2:g=-2.5,equalizer=f=3200:t=q:w=1.0:g=2.5,equalizer=f=9000:t=q:w=1.5:g=1.2,deesser=i=0.35,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=140:makeup=2,pan=stereo|c0=c0|c1=c0,apad=whole_dur=$END[v];[v]asplit=2[v1][v2];[1:a][v1]sidechaincompress=threshold=0.03:ratio=4:attack=20:release=300[bd];[v2][bd]amix=inputs=2:normalize=0[m]" \
 -map "[m]" -t "$END" -ar 48000 "$EP/mix.wav"
I=$(ffmpeg -i "$EP/mix.wav" -af ebur128 -f null - 2>&1 | awk '/I:/{v=$2} END{print v}')
G=$(python3 -c "print(round(-14-($I),2))")
ffmpeg -v error -y -i "$EP/video.mp4" -i "$EP/mix.wav" -map 0:v -map 1:a -c:v copy \
 -af "volume=${G}dB,alimiter=limit=0.84:level=false" -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$EP/final.mp4"
# QA
ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate:format=duration -of compact "$EP/final.mp4" | tee "$EP/qa_probe.txt"
ffmpeg -i "$EP/final.mp4" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2 | tee -a "$EP/qa_probe.txt"
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$EP/final.mp4")
ffmpeg -v error -y -i "$EP/final.mp4" -vf "fps=12/$D,scale=270:480,tile=6x2" -frames:v 1 -q:v 4 "$EP/qa_sheet.jpg"
mkdir -p "$ENG/../out"; cp "$EP/final.mp4" "$ENG/../out/$(basename "$EP").mp4"
# Instagram-ready copy + designed cover
SLUG=$(basename "$EP"); mkdir -p "$ENG/../out/ig"
ffmpeg -v error -y -i "$EP/final.mp4" -c:v libx264 -preset fast -crf 20 -maxrate 10M -bufsize 20M -pix_fmt yuv420p -profile:v high \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$ENG/../out/ig/.$SLUG.tmp.mp4" && mv "$ENG/../out/ig/.$SLUG.tmp.mp4" "$ENG/../out/ig/$SLUG.mp4"
(cd "$ENG/.." && python3 scripts/make_cover.py "$SLUG") || true
echo "FINISHED $SLUG"
