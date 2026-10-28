#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
for task_binary in xfwm4 xprop xsel; do
  if ! command -v "$task_binary" >/dev/null 2>&1; then
    echo "E2E prerequisite missing: $task_binary" >&2
    exit 1
  fi
done
: "${DISPLAY:?Run this script inside xvfb-run or an X display}"
task_wm_log=$(mktemp /tmp/vimmatic-window-manager.XXXXXX)
xfwm4 --compositor=off > "$task_wm_log" 2>&1 &
task_wm_pid=$!
trap 'kill "$task_wm_pid" 2>/dev/null || true' EXIT
task_wm_ready=0
for task_attempt in {1..50}; do
  case "$(xprop -root _NET_SUPPORTING_WM_CHECK 2>/dev/null)" in
    *"window id #"*) task_wm_ready=1; break ;;
  esac
  sleep 0.1
done
if [ "$task_wm_ready" != 1 ]; then
  echo "E2E window manager did not become ready" >&2
  cat "$task_wm_log" >&2
  exit 1
fi
pnpm test:e2e --headed "$@"
