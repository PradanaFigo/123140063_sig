# 🗺️ WebGIS Transportasi Bandar Lampung

Sistem Informasi Geografis (WebGIS) **Full-Stack** untuk memetakan, memvisualisasikan, dan mengelola data spasial fasilitas transportasi umum (Halte BRT, Bus Reguler, dan Angkutan Kota) di wilayah **Bandar Lampung**.

Dikembangkan sebagai penyelesaian **Tugas Praktikum SIG (Pertemuan 7, 8 & 9)**
Program Studi Teknik Informatika — Institut Teknologi Sumatera (ITERA)

---

## ✨ Fitur Utama

- 🗺️ **Peta Interaktif Publik** — Menampilkan persebaran titik halte di atas peta OpenStreetMap dengan interaksi *hover* dan *popup* informatif
- 🔐 **Autentikasi JWT** — Melindungi endpoint API untuk operasi modifikasi data menggunakan JSON Web Token
- ⚙️ **CRUD Spasial Langsung dari Peta:**
  - **Create** — Tambah koordinat halte baru via form modal interaktif
  - **Read** — Tampil data GeoJSON dari database spasial secara real-time
  - **Update** — Edit atribut halte langsung dari popup di peta
  - **Delete** — Hapus titik halte dengan validasi keamanan
- 🎨 **Styling Dinamis** — Warna marker berbeda per jenis transportasi (🔴 BRT · 🔵 Bus · 🟢 Angkot)

---

## 🛠️ Teknologi yang Digunakan

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | React JS + Vite, React-Leaflet, Axios, React-Router-DOM, CSS3 |
| **Backend** | Python FastAPI, Asyncpg, Pydantic, Passlib & Bcrypt, Python-Jose |
| **Database** | PostgreSQL + PostGIS |

---

## ⚙️ Instalasi & Menjalankan Proyek

> **Prasyarat:** Node.js, Python 3.9+, PostgreSQL + ekstensi PostGIS

### 1. Persiapan Database

Buka **pgAdmin 4**, buat database baru bernama `sig_123140063`, lalu jalankan query berikut:

```sql
-- Aktifkan ekstensi spasial
CREATE EXTENSION postgis;

-- Buat tabel autentikasi
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);
```

### 2. Konfigurasi Backend (FastAPI)

```bash
# Masuk ke direktori backend
cd 123140063_PRAK7

# Buat dan aktifkan virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependensi
pip install fastapi uvicorn asyncpg python-dotenv "python-jose[cryptography]" "passlib[bcrypt]" python-multipart bcrypt==3.2.0
```

Buat file `.env` di direktori backend:

```env
DATABASE_URL=postgresql://postgres:PASSWORD_PGADMIN_ANDA@localhost:5432/sig_123140063
```

Jalankan server:

```bash
uvicorn main:app --reload
```

> Backend berjalan di `http://localhost:8000`
> Dokumentasi Swagger: `http://localhost:8000/docs`

### 3. Konfigurasi Frontend (React JS)

```bash
# Masuk ke direktori frontend
cd 123140063_PRAK8

# Install modul
npm install

# Jalankan server development
npm run dev
```

> Frontend berjalan di `http://localhost:5173`

---

## 📖 Cara Penggunaan

1. Buka `http://localhost:5173/register` → buat akun Admin
2. Login di `http://localhost:5173/login`
3. Setelah login, panel kiri berubah menjadi **Admin Aktif** dan tombol **"+ Tambah Halte Baru"** muncul di pojok kanan atas peta
4. Klik titik halte di peta untuk memunculkan tombol **Edit** dan **Hapus**

---

## 📸 Screenshot

| Halaman Peta | Form Tambah Halte | Halaman Login |
|:---:|:---:|:---:|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

---

## 👤 Pengembang

**Pradana Figo Ariansya**
NIM: 123140063 · Kelas SIG-RB
Teknik Informatika — Institut Teknologi Sumatera (ITERA)

---

*© 2026 Informatika ITERA — Sistem Informasi Geografi*