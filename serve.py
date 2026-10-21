#!/usr/bin/env python3
"""Server statis lokal untuk khainode (cocok untuk Termux).

Bedanya dengan `python -m http.server`: URL yang tidak ada akan
menampilkan 404.html (status 404), persis seperti di Vercel.

Pemakaian:
    python serve.py                  # http://127.0.0.1:8080
    python serve.py 3000             # ganti port
    python serve.py 8080 0.0.0.0     # bisa diakses dari perangkat lain di WiFi yang sama
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
HOST = sys.argv[2] if len(sys.argv) > 2 else "127.0.0.1"


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # server dev: jangan di-cache browser, supaya perubahan langsung terlihat
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_error(self, code, message=None, explain=None):
        page = ROOT / "404.html"
        if code == 404 and page.is_file():
            data = page.read_bytes()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(data)
            return
        super().send_error(code, message, explain)


if __name__ == "__main__":
    handler = partial(Handler, directory=str(ROOT))
    with ThreadingHTTPServer((HOST, PORT), handler) as httpd:
        print(f"Berjalan di http://{HOST}:{PORT}  (Ctrl+C untuk berhenti)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nBerhenti.")
