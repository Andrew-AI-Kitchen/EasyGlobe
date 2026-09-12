#!/bin/zsh
cd "${0:A:h}" || exit 1
if command -v python3 >/dev/null 2>&1; then
  exec python3 launcher.py
elif command -v python >/dev/null 2>&1; then
  exec python launcher.py
else
  echo "未找到 Python。请先从 python.org 安装 Python 3。"
  read -k 1 "?按任意键关闭…"
fi
