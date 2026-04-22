from pydantic import BaseModel, Field
from typing import Optional, List

class HalteBase(BaseModel):
    nama: str = Field(..., min_length=3, description="Nama Halte (Minimal 3 Karakter)")
    kode: str = Field(..., description="Kode unik halte (Misal: HLT-001)")
    jenis: str = Field(..., description="Jenis kendaraan: brt, bus, atau angkot")
    alamat: Optional[str] = None
    kapasitas: Optional[int] = Field(default=0, ge=0, description="Kapasitas daya tampung penumpang")
    fasilitas: Optional[List[str]] = Field(default=[], description="Daftar fasilitas, misal: ['atap', 'kursi']")
 
class HalteCreate(HalteBase):
    longitude: float = Field(..., ge=-180, le=180, description="Garis Bujur (X)")
    latitude: float = Field(..., ge=-90, le=90, description="Garis Lintang (Y)")