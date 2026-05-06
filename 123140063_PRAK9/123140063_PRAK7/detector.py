import os
# --- PENANGKAL ERROR PROJ (BENTROK POSTGIS) ---
if 'PROJ_LIB' in os.environ: del os.environ['PROJ_LIB']
if 'PROJ_DATA' in os.environ: del os.environ['PROJ_DATA']

import cv2
import rasterio
import numpy as np
from ultralytics import YOLO
import asyncpg
import asyncio

# --- KONFIGURASI ---
IMAGE_PATH = 'tugas10.tif'
MODEL_PATH = 'yolov8n.pt'
# Pastikan password PostgreSQL Anda benar!
DATABASE_URL = "postgresql://postgres:figo1234@localhost:5432/sig_123140063"

async def run_spatial_ai():
    print("⏳ Menyiapkan Otak AI (YOLOv8)...")
    model = YOLO(MODEL_PATH)
    
    print(f"⏳ Membaca Citra Satelit: {IMAGE_PATH}...")
    try:
        with rasterio.open(IMAGE_PATH) as src:
            transform = src.transform
            
            # Memuat gambar asli
            img = cv2.imread(IMAGE_PATH)
            if img is None:
                print("❌ File .tif tidak bisa dibaca. Pastikan file ada di folder backend_sig.")
                return

            h, w = img.shape[:2]
            
            # TEKNIK SCANNING: Memotong gambar jadi kotak kecil agar AI teliti
            tile_size = 640
            stride = 450  # Overlap agar tidak ada area terlewat
            detections = []

            print(f"🔍 Mulai memindai area {w}x{h} piksel. Mencari objek nyata...")

            for y in range(0, h - tile_size + 1, stride):
                for x in range(0, w - tile_size + 1, stride):
                    tile = img[y:y+tile_size, x:x+tile_size]
                    
                    # Abaikan area hitam/kosong di pinggiran citra drone
                    if np.mean(tile) < 20: continue 

                    # Deteksi APAPUN dengan sensitivitas tinggi (conf=0.1)
                    results = model.predict(tile, conf=0.1, verbose=False)
                    
                    for box in results[0].boxes:
                        conf = float(box.conf[0])
                        label_name = model.names[int(box.cls[0])]
                        
                        # Hitung titik tengah piksel objek
                        x1, y1, x2, y2 = box.xyxy[0].tolist()
                        cx_pixel = ((x1 + x2) / 2) + x
                        cy_pixel = ((y1 + y2) / 2) + y
                        
                        # 🛰️ KONVERSI KE KOORDINAT BUMI ASLI
                        lon, lat = transform * (cx_pixel, cy_pixel)
                        
                        detections.append({
                            'label': label_name, 
                            'conf': conf, 
                            'lon': lon, 'lat': lat
                        })
            
            print(f"✅ Scanning Berhasil! Menemukan {len(detections)} objek nyata.")

    except Exception as e:
        print(f"❌ Terjadi kesalahan sistem: {e}")
        return

    # --- PROSES SIMPAN KE DATABASE ---
    if len(detections) > 0:
        print(f"💾 Menyimpan {len(detections)} data spasial ke PostGIS...")
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
        
        # Bersihkan data lama agar WebGIS tidak berantakan
        await conn.execute("TRUNCATE TABLE transportasi.ai_detections RESTART IDENTITY;")
        
        for det in detections:
            # Gunakan fungsi ST_Point untuk membuat titik geografis
            await conn.execute("""
                INSERT INTO transportasi.ai_detections (label, confidence, geom)
                VALUES ($1, $2, ST_SetSRID(ST_Point($3, $4), 4326))
            """, det['label'], det['conf'], det['lon'], det['lat'])
        
        await conn.close()
        print("🚀 Selesai! Silakan refresh WebGIS Anda.")
    else:
        print("⚠️ AI tidak menemukan benda yang cukup jelas di gambar ini.")

if __name__ == "__main__":
    asyncio.run(run_spatial_ai())