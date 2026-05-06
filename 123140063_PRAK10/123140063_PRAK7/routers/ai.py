from fastapi import APIRouter
from database import get_pool

router = APIRouter()

@router.get("/geojson")
async def get_ai_geojson():
    pool = await get_pool()
    async with pool.acquire() as conn:
        # Mengambil data dari tabel ai_detections yang baru saja diisi oleh detector.py
        rows = await conn.fetch("""
            SELECT id, label, confidence, ST_X(geom) as lon, ST_Y(geom) as lat 
            FROM transportasi.ai_detections
        """)
        
        features = [{
            "type": "Feature",
            "properties": {"id": r["id"], "label": r["label"], "confidence": r["confidence"]},
            "geometry": {"type": "Point", "coordinates": [r["lon"], r["lat"]]}
        } for r in rows]
        return {"type": "FeatureCollection", "features": features}