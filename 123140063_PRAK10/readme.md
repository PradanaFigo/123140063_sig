# WebGIS Transportasi Bandar Lampung - Spatial AI Integration 

Proyek ini merupakan implementasi Arsitektur Full-Stack WebGIS yang diintegrasikan dengan Kecerdasan Buatan (Spatial AI) untuk mendeteksi objek secara otomatis dari citra geospasial (GeoTIFF) dan memvisualisasikannya di atas peta interaktif.

Tugas ini disusun untuk memenuhi Praktikum 10 Mata Kuliah Sistem Informasi Geografis (SIG).

---

##  Informasi Mahasiswa

| Field | Detail |
|---|---|
| **Nama** | Pradana Figo Ariansya |
| **NIM** | 123140063 |
| **Program Studi** | Teknik Informatika |
| **Instansi** | Institut Teknologi Sumatera (ITERA) |

---

## Fitur Utama

1. **Spatial AI Detection** — Menggunakan model YOLOv8 untuk mendeteksi objek (seperti bangunan, kendaraan, dan vegetasi) dari citra drone/satelit.
2. **Coordinate Extraction** — Otomatisasi konversi piksel gambar menjadi koordinat dunia nyata (Longitude & Latitude) menggunakan pustaka `rasterio`.
3. **Database Spasial** — Penyimpanan titik koordinat hasil deteksi ke dalam database PostgreSQL menggunakan ekstensi PostGIS.
4. **Interactive WebGIS** — Visualisasi data spasial secara *real-time* menggunakan React JS dan Leaflet.

---

## Hasil Eksekusi (Screenshots)

### 1. Proses Deteksi AI di Terminal
*Sistem berhasil membaca citra satelit, mendeteksi objek lahan, mengekstrak koordinat spasial, dan menyimpannya secara otomatis ke PostGIS.*

![Proses Terminal](taruh_link_atau_path_gambar_terminal_disini.png)

### 2. Visualisasi WebGIS
*Titik-titik hasil deteksi AI divisualisasikan secara presisi di atas peta interaktif OpenStreetMap.*

![Hasil WebGIS](taruh_link_atau_path_gambar_webgis_disini.png)

---

## Teknologi yang Digunakan

**Backend & AI:**
- Python 3
- FastAPI & Uvicorn (REST API)
- YOLOv8 (`ultralytics`)
- Rasterio & OpenCV (Pengolahan Citra Spasial)
- Asyncpg (Koneksi Database)

**Frontend:**
- React JS (Vite)
- React-Leaflet (Pemetaan)
- Axios (HTTP Client)

**Database:**
- PostgreSQL
- PostGIS Extension

---

## Persiapan (Prerequisites)

Pastikan Anda telah menginstal:
1. Python (Versi 3.8+)
2. Node.js & npm
3. PostgreSQL & pgAdmin 4 (beserta PostGIS)

### Konfigurasi Database

1. Buka pgAdmin 4.
2. Buat database baru bernama `sig_123140063`.
3. Buka Query Tool dan jalankan perintah berikut untuk mengaktifkan fitur spasial:

```sql
CREATE EXTENSION postgis;
```

---

## Cara Menjalankan Proyek

### 1. Menjalankan AI Detector (Ekstraksi Titik Spasial)

Buka terminal di folder `backend`, lalu jalankan perintah berikut:

```bash
# Buat dan aktifkan virtual environment (jika belum)
python -m venv venv
.\venv\Scripts\activate  # Untuk Windows

# Instal library yang dibutuhkan
pip install fastapi uvicorn ultralytics rasterio opencv-python asyncpg

# Jalankan script AI Detector
python detector.py
```

### 2. Menjalankan Backend API (FastAPI)

Masih di terminal backend yang sama, jalankan server API:

```bash
uvicorn main:app --reload
```

### 3. Menjalankan Frontend WebGIS (React)

Buka terminal baru, arahkan ke folder frontend (misal: `123140063_PRAK8`), lalu jalankan:

```bash
npm install
npm run dev
```

---

## Struktur Direktori Utama

```
📦 123140063_PRAK10
 ┣ 📂 backend_sig
 ┃ ┣ 📜 main.py          # Konfigurasi router FastAPI
 ┃ ┣ 📜 detector.py      # Script utama Spatial AI (YOLO + Rasterio)
 ┃ ┣ 📜 tugas10.tif      # File citra GeoTIFF (Sumber data AI)
 ┃ ┗ 📜 yolov8n.pt       # Model pre-trained YOLOv8
 ┣ 📂 frontend_sig
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components
 ┃ ┃ ┃ ┗ 📜 MapView.jsx  # Komponen React Leaflet
 ┃ ┃ ┣ 📜 App.jsx        # Tata letak utama Dashboard
 ┃ ┃ ┗ 📜 index.css      # Styling CSS
 ┃ ┗ 📜 package.json
 ┗ 📜 README.md
```