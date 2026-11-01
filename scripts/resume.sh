#!/usr/bin/env bash
# Called on session start: make sure tools exist and the render queue is running.
cd "$(dirname "$0")/.."
python3 -c "import kokoro_onnx, scipy, faster_whisper" 2>/dev/null || pip install -q kokoro-onnx soundfile scipy faster-whisper >/dev/null 2>&1
[ -f /opt/tts/kokoro-v1.0.onnx ] || bash scripts/setup.sh >/dev/null 2>&1
if [ ! -f engine/PAUSED ] && ! ps -eo args | grep -q "^bash engine/queue.sh"; then
  rm -f episodes/*/FAILED   # a crash mid-render is not a real failure; chunks resume
  setsid nohup nice -n 19 bash engine/queue.sh > /tmp/queue.out 2>&1 < /dev/null 9>&- &
  echo "whatif: render queue (re)started"
fi
# keep the watchdog running too
pgrep -f scripts/render_watchdog.sh >/dev/null || (setsid nohup bash scripts/render_watchdog.sh > /tmp/watchdog.out 2>&1 < /dev/null 9>&- &)
