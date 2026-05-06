import os
if 'PROJ_LIB' in os.environ: del os.environ['PROJ_LIB']
if 'PROJ_DATA' in os.environ: del os.environ['PROJ_DATA']

import rasterio
import numpy as np
import cv2
from ultralytics import YOLO
import asyncpg
import asyncio

IMAGE_PATH = 'tugas10.tif'
MODEL_PATH = 'yolov8n.pt'
DATABASE_URL = "postgresql://postgres:figo1234@localhost:5432/sig_123140063"

GIS_MAPPING = {
    2: 'Kendaraan',
    3: 'Kendaraan',
    5: 'Bangunan/Struktur',
    7: 'Bangunan/Struktur',
    8: 'Kapal/Perahu',
    58: 'Vegetasi/Pohon'
}

async def run_spatial_ai():
    print("Mulai pemrosesan AI...")
    model = YOLO(MODEL_PATH)
    
    try:
        with rasterio.open(IMAGE_PATH) as src:
            transform = src.transform
            img_data = src.read([1, 2, 3])
            img = np.moveaxis(img_data, 0, -1)
            
            if img.dtype != 'uint8':
                img = cv2.normalize(img, None, 0, 255, cv2.NORM_MINMAX).astype('uint8')

            h, w, _ = img.shape
            tile_size = 640
            stride = 400
            detections = []

            for y in range(0, h, stride):
                for x in range(0, w, stride):
                    tile = img[y:y+tile_size, x:x+tile_size]
                    th, tw = tile.shape[:2]
                    
                    if th != tile_size or tw != tile_size:
                        tile = cv2.copyMakeBorder(tile, 0, tile_size - th, 0, tile_size - tw, cv2.BORDER_CONSTANT, value=[0,0,0])

                    if np.mean(tile) < 15: continue 

                    results = model.predict(tile, conf=0.18, iou=0.4, classes=list(GIS_MAPPING.keys()), verbose=False)
                    
                    for box in results[0].boxes:
                        cls_id = int(box.cls[0])
                        label = GIS_MAPPING[cls_id]
                        conf = float(box.conf[0])
                        
                        x1, y1, x2, y2 = box.xyxy[0].tolist()
                        cx_pixel = ((x1 + x2) / 2) + x
                        cy_pixel = ((y1 + y2) / 2) + y
                        
                        lon, lat = transform * (cx_pixel, cy_pixel)
                        detections.append({'label': label, 'conf': conf, 'lon': lon, 'lat': lat})
            
            print(f"Selesai! {len(detections)} titik diekstrak.")

    except Exception as e:
        print(f"Error: {e}")
        return

    if len(detections) > 0:
        print("Menyimpan ke database...")
        conn = await asyncpg.connect(DATABASE_URL)
        
        await conn.execute("CREATE SCHEMA IF NOT EXISTS transportasi;")
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS transportasi.ai_detections (
                id SERIAL PRIMARY KEY,
                label VARCHAR(100),
                confidence FLOAT,
                geom GEOMETRY(Point, 4326)
            );
        """)
        
        await conn.execute("TRUNCATE TABLE transportasi.ai_detections RESTART IDENTITY;")
        
        for det in detections:
            await conn.execute("""
                INSERT INTO transportasi.ai_detections (label, confidence, geom)
                VALUES ($1, $2, ST_SetSRID(ST_Point($3, $4), 4326))
            """, det['label'], det['conf'], det['lon'], det['lat'])
        
        await conn.close()
        print("Berhasil! Silakan cek WebGIS.")
    else:
        print("Tidak menemukan objek.")

if __name__ == "__main__":
    asyncio.run(run_spatial_ai())