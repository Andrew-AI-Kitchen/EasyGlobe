#!/usr/bin/env python3
"""Cross-platform local launcher for EasyGlobe."""

from __future__ import annotations

import argparse
import functools
import json
import os
import socket
import sys
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT_RANGE = range(8766, 8786)


def port_is_free(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.settimeout(0.12)
        return probe.connect_ex((HOST, port)) != 0


def choose_port() -> int:
    requested = os.environ.get("AAC_PORT", "").strip()
    if requested.isdigit():
        port = int(requested)
        if 1024 <= port <= 65535 and port_is_free(port):
            return port
    for port in PORT_RANGE:
        if port_is_free(port):
            return port
    raise RuntimeError("8766–8785 端口都被占用，请关闭一个本地服务后重试。")


def main() -> int:
    parser = argparse.ArgumentParser(description="启动 EasyGlobe 本地预览")
    parser.add_argument("--probe", action="store_true", help="只检查启动条件")
    args = parser.parse_args()
    try:
        port = choose_port()
    except RuntimeError as error:
        print(f"启动失败：{error}", file=sys.stderr)
        return 1

    index_found = (ROOT / "index.html").is_file()
    if args.probe:
        print(json.dumps({
            "host": HOST,
            "port": port,
            "indexFound": index_found,
            "platform": sys.platform,
        }))
        return 0 if index_found else 1
    if not index_found:
        print("启动失败：找不到 index.html。请保留完整的 02-rebuild 文件夹。", file=sys.stderr)
        return 1

    handler = functools.partial(SimpleHTTPRequestHandler, directory=str(ROOT))
    server = None
    candidates = list(dict.fromkeys([port, *PORT_RANGE]))
    for candidate in candidates:
        try:
            server = ThreadingHTTPServer((HOST, candidate), handler)
            port = candidate
            break
        except OSError:
            continue
    if server is None:
        print("启动失败：8766–8785 端口都无法使用。", file=sys.stderr)
        return 1
    url = f"http://{HOST}:{port}/"
    print("\nEasyGlobe 已准备好")
    print(f"浏览器地址：{url}")
    print("保持此窗口打开；结束体验时按 Ctrl+C。\n")
    threading.Timer(0.35, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n本地预览已停止。")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
