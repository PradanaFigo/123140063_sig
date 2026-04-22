# 🗺️ WebGIS Transportasi Bandar Lampung (Full-Stack)

Sistem Informasi Geografis (WebGIS) *Full-Stack* untuk memetakan, memvisualisasikan, dan mengelola data spasial fasilitas transportasi umum (Halte BRT, Bus Reguler, dan Angkutan Kota) di wilayah Bandar Lampung.

Proyek ini dikembangkan sebagai penyelesaian **Tugas Praktikum 9 - Sistem Informasi Geografis**, Program Studi Teknik Informatika, Institut Teknologi Sumatera (ITERA).

---

## ✨ Fitur Utama

- **Peta Interaktif Publik:** Menampilkan persebaran titik halte di atas peta dasar OpenStreetMap menggunakan React-Leaflet, lengkap dengan interaksi *hover* dan *popup* informatif.
- **Sistem Keamanan Terpusat (JWT Auth):** Melindungi rute API untuk operasi modifikasi data menggunakan JSON Web Token (JWT).
- **Manajemen Data Spasial (CRUD) Langsung dari Peta:**
  - **Create:** Admin dapat menambahkan koordinat halte baru melalui form *modal* yang interaktif.
  - **Read:** Penarikan data format GeoJSON dari pangkalan data spasial secara *real-time*.
  - **Update:** Pengeditan detail atribut halte (nama, tipe, fasilitas, dsb) langsung melalui tombol di dalam *popup*.
  - **Delete:** Penghapusan titik halte dengan validasi keamanan.

---

## 🛠️ Teknologi yang Digunakan

**Frontend:**
- React JS + Vite
- React-Leaflet (Pemetaan)
- Axios (HTTP Client & Interceptors)
- React-Router-DOM (Navigasi Halaman)
- Vanilla CSS & Flexbox (UI/UX Dashboard)

**Backend:**
- Python FastAPI
- Asyncpg (Asynchronous Database Driver)
- Pydantic (Validasi Skema Data)
- Passlib & Bcrypt (Hashing Password)
- Python-Jose (Pemrosesan Token JWT)

**Database:**
- PostgreSQL
- Ekstensi PostGIS (Pemrosesan Data Spasial)

---

## 🚀 Panduan Instalasi dan Menjalankan Aplikasi

Pastikan Anda telah menginstal Node.js, Python (3.9+), dan PostgreSQL dengan ekstensi PostGIS di komputer Anda.

### 1. Persiapan Database
1. Buka **pgAdmin 4** masuk database bernama `sig_123140063`.
2. Aktifkan ekstensi spasial dengan menjalankan *query*: 
   ```sql
   CREATE EXTENSION postgis;
Buat tabel users untuk sistem autentikasi:

SQL
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);
2. Konfigurasi Backend (FastAPI)
Buka terminal dan arahkan ke direktori backend (123140063_PRAK7).

Buat dan aktifkan Virtual Environment:

Bash
python -m venv venv

# Di Windows:
venv\Scripts\activate
# Di Mac/Linux:
source venv/bin/activate
Install seluruh pustaka yang dibutuhkan:

Bash
pip install fastapi uvicorn asyncpg python-dotenv "python-jose[cryptography]" "passlib[bcrypt]" python-multipart bcrypt==3.2.0
Buat file .env di direktori utama backend dan isi dengan konfigurasi database Anda:

Cuplikan kode
DATABASE_URL=postgresql://postgres:PASSWORD_PGADMIN_ANDA@localhost:5432/sig_123140063
Jalankan server backend:

Bash
uvicorn main:app --reload
Backend akan berjalan di http://localhost:8000. Dokumentasi Swagger dapat diakses di http://localhost:8000/docs.

3. Konfigurasi Frontend (React JS)
Buka terminal baru dan arahkan ke direktori frontend (123140063_PRAK8).

Install seluruh modul Node.js:

Bash
npm install
Jalankan server pengembangan Vite:

Bash
npm run dev
Frontend akan berjalan di http://localhost:5173.

📖 Cara Penggunaan Sistem
Buka peramban web dan akses http://localhost:5173/register untuk membuat akun Admin pertama Anda.

Akses http://localhost:5173/login dan masuk menggunakan kredensial yang baru saja dibuat.

Setelah masuk, status di panel kiri akan berubah menjadi Admin Aktif dan tombol hijau "+ Tambah Halte Baru" akan muncul di pojok kanan atas peta.

Klik pada titik halte mana pun di peta untuk memunculkan tombol Edit dan Hapus.

📸 Dokumentasi Antarmuka (Screenshots)
(Ganti baris ini dengan gambar screenshot Halaman Utama / Peta)

(Ganti baris ini dengan gambar screenshot Form Tambah/Edit Data)

(Ganti baris ini dengan gambar screenshot Halaman Login/Register)

Dikembangkan oleh:
👤 Pradana Figo Ariansya (NIM: 123140063)

Mahasiswa Teknik Informatika, Institut Teknologi Sumatera (ITERA).