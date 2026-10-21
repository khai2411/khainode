# khainode

Situs portofolio **Khairul Huda** (<https://khainode.my.id>) berisi galeri sertifikat dengan modal detail, mode gelap/terang, dan filter berdasarkan penerbit.

Situs ini statis (HTML + Tailwind via CDN + `script.js`), jadi tidak perlu build apa pun untuk menjalankannya.

## Struktur

```
khainode/
├── index.html        # halaman utama + semua kartu sertifikat + modal
├── script.js         # tema, menu mobile, filter penerbit, modal
├── style.css         # CSS kustom (dipakai index.html)
├── src/input.css     # sumber CSS (style.css + 3 baris @tailwind di atas)
├── 404.html          # halaman 404
├── privacy.html      # kebijakan privasi
├── serve.py          # server lokal dengan fallback 404.html
├── vercel.json       # header keamanan untuk Vercel
├── manifest.json, robots.txt, sitemap.xml, favicon.ico
└── assets/           # sertifikat-N.webp dan icons/
```

## Menjalankan di Termux

### 1. Siapkan Termux

```bash
pkg update && pkg upgrade
pkg install python unzip
termux-setup-storage        # sekali saja, untuk akses folder Download
```

### 2. Ekstrak proyek

```bash
cp ~/storage/downloads/khainode.zip ~
cd ~
unzip khainode.zip
cd khainode
```

### 3. Jalankan server

```bash
python serve.py
```

Buka **http://localhost:8080** di browser HP. Tekan `Ctrl+C` di Termux untuk menghentikan.

Opsi lain:

```bash
python serve.py 3000              # ganti port (jangan di bawah 1024)
python serve.py 8080 0.0.0.0      # bisa dibuka dari perangkat lain di WiFi yang sama
```

Untuk akses dari perangkat lain, cek IP HP dengan `ifconfig` (cari `wlan0`), lalu buka `http://IP-HP:8080`.

Agar server tidak mati saat layar mati, jalankan `termux-wake-lock` sebelum `python serve.py`.

### 4. Uji halaman 404

Buka alamat yang tidak ada, misalnya **http://localhost:8080/ngawur**. Seharusnya muncul halaman 404 dengan status HTTP 404. (`python -m http.server` biasa tidak menampilkan `404.html`, makanya dipakai `serve.py`.)

> **Perlu internet:** Tailwind, Font Awesome, dan Google Fonts dimuat dari CDN. Tanpa koneksi, tampilan akan berantakan walau server lokal jalan.

## Menambah sertifikat

1. Simpan gambar sebagai `assets/sertifikat-N.webp` (N = nomor berikutnya, lebar sekitar 1080 px).
2. Salin satu blok `<article class="project-item ...">` di `index.html` (di dalam `#projects-grid`), lalu ubah:
   - `data-title`, `data-category`, `data-image`, `data-desc`
   - `data-type`, `data-month`, `data-validity`, `data-issuer`, `data-recipient`
   - `src`, `width`, `height`, dan `alt` pada `<img>`
   - judul (`<h3>`) dan baris penerbit · tanggal di bawahnya
3. Nilai `data-issuer` harus sama persis dengan `data-issuer-filter` di menu mobile agar filter berfungsi. Kalau penerbitnya baru, tambahkan juga tombol filternya di menu.

Grid memakai bingkai rasio tetap 4:3, jadi `width` dan `height` cukup perkiraan ukuran asli gambar.

## Deploy ke Vercel

1. Push proyek ke GitHub.
2. Di Vercel: **Add New → Project**, pilih repo, lalu **Deploy**. Tidak perlu framework atau build command.
3. `404.html` di root otomatis dipakai Vercel untuk URL yang tidak ada, dan `vercel.json` menambahkan header keamanan.

## Catatan CSS

`index.html` memakai Tailwind CDN, jadi `npm run build:css` (yang menghasilkan `dist/style.min.css`) tidak diperlukan untuk saat ini. Kalau kamu mengubah `style.css`, ubah juga `src/input.css` agar isinya tetap sama (selain 3 baris `@tailwind` di bagian atas).
