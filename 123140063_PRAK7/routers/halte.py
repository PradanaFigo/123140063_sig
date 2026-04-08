from fastapi import APIRouter, HTTPException
from database import get_pool
from models import HalteCreate
import json

router = APIRouter(prefix="/api/halte", tags=["Transportasi - Data Halte"])

# 1. GET ALL
@router.get("/")
async def get_all_halte():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, nama, kode, jenis, alamat, kapasitas, fasilitas, ST_AsGeoJSON(geom) as geom 
            FROM transportasi.halte ORDER BY id ASC LIMIT 100
        """)
        return [dict(row) for row in rows]

# 2. GET BY ID
@router.get("/{id}")
async def get_halte_by_id(id: int):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            SELECT id, nama, kode, jenis, alamat, kapasitas, fasilitas, 
                   ST_X(geom) as longitude, ST_Y(geom) as latitude 
            FROM transportasi.halte WHERE id=$1
        """, id)
        if not row:
            raise HTTPException(status_code=404, detail="Data Halte tidak ditemukan")
        return dict(row)

# 3. GET GEOJSON
@router.get("/data/geojson")
async def get_halte_geojson():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, nama, kode, jenis, alamat, kapasitas, fasilitas, ST_AsGeoJSON(geom) as geom 
            FROM transportasi.halte
        """)
        features = []
        for row in rows:
            features.append({
                "type": "Feature",
                "geometry": json.loads(row["geom"]),
                "properties": {
                    "id": row["id"], "nama": row["nama"], "kode": row["kode"],
                    "jenis": row["jenis"], "alamat": row["alamat"],
                    "kapasitas": row["kapasitas"], "fasilitas": row["fasilitas"]
                }
            })
        return {"type": "FeatureCollection", "features": features}

# 4. GET NEARBY
@router.get("/search/nearby")
async def get_nearby_halte(lat: float, lon: float, radius_meter: int = 1000):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, nama, kode, jenis, alamat, 
            ROUND(ST_Distance(geom::geography, ST_Point($1,$2)::geography)::numeric) as jarak_m
            FROM transportasi.halte
            WHERE ST_DWithin(geom::geography, ST_Point($1,$2)::geography, $3)
            ORDER BY jarak_m ASC
        """, lon, lat, radius_meter)
        return [dict(row) for row in rows]

# 5. POST 
@router.post("/", status_code=201)
async def create_halte(data: HalteCreate):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            INSERT INTO transportasi.halte (nama, kode, jenis, alamat, kapasitas, fasilitas, geom)
            VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_Point($7,$8), 4326))
            RETURNING id, nama, kode, jenis, alamat, kapasitas, fasilitas, ST_X(geom) as longitude, ST_Y(geom) as latitude
        """, data.nama, data.kode, data.jenis, data.alamat, data.kapasitas, data.fasilitas, data.longitude, data.latitude)
        return dict(row)

# 6. DELETE:  
@router.delete("/{id}", status_code=204)
async def delete_halte(id: int):
    pool = await get_pool()
    async with pool.acquire() as conn:
        cek = await conn.fetchval("SELECT id FROM transportasi.halte WHERE id=$1", id)
        if not cek:
            raise HTTPException(status_code=404, detail="Halte tidak ditemukan untuk dihapus")
        await conn.execute("DELETE FROM transportasi.halte WHERE id=$1", id)
        return None