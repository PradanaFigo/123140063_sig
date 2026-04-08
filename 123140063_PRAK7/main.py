from fastapi import FastAPI
from contextlib import asynccontextmanager
from database import get_pool, close_pool
from routers import halte

@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_pool()
    print("Database PostGIS Berhasil Terkoneksi!")
    yield
    await close_pool()
    print("Koneksi Database Ditutup.")

app = FastAPI(
    title="WebGIS API Transportasi - Praktikum 7",
    description="REST API Lengkap untuk Manajemen Spasial Data Halte",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(halte.router)