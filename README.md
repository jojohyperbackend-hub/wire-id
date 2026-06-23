# WIRE.ID

> Kabar masuk, detik demi detik — tanpa basa-basi.

Agregator berita Indonesia real-time yang dibangun dengan React + Vite. Data bersumber dari [NewsAPI.org](https://newsapi.org) dan di-refresh otomatis setiap 60 detik. Tampilan mengikuti design system berbasis Apple HIG — full-bleed tiles, SF Pro typography, satu accent color, nol dekorasi berlebihan.

---

## Fitur

- **Live ticker** — headline berjalan otomatis di bagian atas halaman
- **Hero article** — berita utama tampil penuh dengan gambar produk-style
- **Side ranking** — 4 berita teratas dengan nomor urut di tile gelap
- **Grid berita** — semua artikel tersisa dalam card layout responsif
- **Kategori filter** — Semua, Bisnis, Teknologi, Olahraga, Hiburan, Kesehatan, Sains
- **Auto-refresh** — fetch ulang setiap 60 detik, countdown tampil di status bar
- **Reduced motion** — ticker berhenti otomatis kalau user aktifkan `prefers-reduced-motion`

---

## Tech stack

| Layer | Library |
|---|---|
| Framework | React 18 |
| Bundler | Vite |
| Styling | Tailwind CSS v4 |
| Data | NewsAPI.org REST API |
| Font | SF Pro (system stack) |

---

## Cara pakai

### 1. Clone repo

```bash
git clone https://github.com/jojohyperbackend-hub/wire-id.git
cd wire-id
```

### 2. Install dependencies

```bash
npm install
```

### 3. Buat file `.env`

Daftar API key gratis di [newsapi.org/register](https://newsapi.org/register), lalu buat file `.env` di root project:

```env
VITE_NEWS_API_KEY=isi_api_key_kamu_di_sini
```

> **Catatan:** NewsAPI free plan hanya bisa dipakai dari `localhost`. Untuk deploy ke production, perlu upgrade ke plan berbayar atau pakai proxy server sendiri.

### 4. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

### 5. Build untuk production

```bash
npm run build
```

Output ada di folder `dist/`.

---

## Struktur folder

```
wire-id/
├── public/
├── src/
│   ├── components/
│   │   ├── NewsCard.jsx   # Card berita individual
│   │   └── Ticker.jsx     # Running headline bar
│   ├── App.jsx            # Root component + data fetching
│   ├── App.css            # Global styles
│   └── main.jsx
├── .env                   # API key (jangan di-commit!)
├── .gitignore
├── index.html
└── package.json
```

---

## Environment variables

| Variable | Keterangan |
|---|---|
| `VITE_NEWS_API_KEY` | API key dari newsapi.org |

Pastikan `.env` masuk ke `.gitignore` supaya API key tidak ikut ter-push ke repo.

---

## Design system

Project ini mengikuti `DESIGN.md` — dokumen design system internal yang mendefinisikan token warna, tipografi, spacing, shape, dan motion. Prinsip utamanya:

- **UI chrome recedes** — konten yang bicara, bukan interface-nya
- **One accent color** — `#0066cc` (Action Blue) untuk semua interactive element
- **Shadow hanya untuk foto produk** — nol shadow dekoratif di UI element
- **Scale(0.95) only** — satu-satunya feedback animasi untuk press state

---

## Lisensi

MIT