from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  
from contextlib import asynccontextmanager
from database import get_pool, close_pool
from routers import halte, auth  # <-- Cukup satu baris ini saja untuk router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_pool()
    print("Database PostGIS Berhasil Terkoneksi!")
    yield
    await close_pool()
    print("Koneksi Database Ditutup.")

app = FastAPI(
    title="WebGIS API Transportasi - Praktikum 7 & 9",
    description="REST API Lengkap untuk Manajemen Spasial Data Halte dengan Auth",
    version="1.0.0",
    lifespan=lifespan
)

# Konfigurasi CORS agar React (Frontend) tidak diblokir
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mendaftarkan rute API
app.include_router(auth.router)
app.include_router(halte.router)