#!/usr/bin/env bash
# One-time tool setup for a fresh cloud session (idempotent).
set -e
command -v higgsfield >/dev/null || npm i -g @higgsfield/cli
command -v ffmpeg-mcp-server >/dev/null || npm i -g @ash_j1997/ffmpeg-mcp-server
python3 -c "import kokoro_onnx" 2>/dev/null || pip install -q kokoro-onnx soundfile faster-whisper
mkdir -p /opt/tts
[ -f /opt/tts/kokoro-v1.0.onnx ] || curl -sSfL -o /opt/tts/kokoro-v1.0.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
[ -f /opt/tts/voices-v1.0.bin ] || curl -sSfL -o /opt/tts/voices-v1.0.bin https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
echo "setup ok"
