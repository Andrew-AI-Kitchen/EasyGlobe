#!/bin/sh
cd "$(dirname "$0")" || exit 1
if command -v python3 >/dev/null 2>&1; then
  exec python3 launcher.py
elif command -v python >/dev/null 2>&1; then
  exec python launcher.py
else
  echo "Python 3 is required. Install it from https://python.org and try again."
  exit 1
fi
