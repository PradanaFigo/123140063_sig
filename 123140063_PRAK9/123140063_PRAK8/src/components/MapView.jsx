import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import api from '../config/api';

function MapView({ isAdmin }) {
  const [geojsonData, setGeojsonData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null, nama: '', kode: '', jenis: 'Bus', alamat: '', 
    kapasitas: 20, fasilitas: '', longitude: 105.26, latitude: -5.39
  });

  const fetchGeoJSON = async () => {
    try {
      const response = await api.get('/halte/data/geojson');
      setGeojsonData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchGeoJSON();

    // Event Listener untuk tombol Edit & Hapus di dalam Popup Leaflet
    const handleHapus = async (e) => {
      const id = e.detail;
      if (window.confirm("Yakin ingin menghapus halte ini?")) {
        try {
          await api.delete(`/halte/${id}`);
          alert("Data berhasil dihapus!");
          fetchGeoJSON();
        } catch (err) {
          alert("Gagal menghapus data!");
        }
      }
    };

    const handleEdit = (e) => {
      const id = e.detail;
      const feature = geojsonData?.features.find(f => f.properties.id === id);
      if (feature) {
        setFormData({
          id: feature.properties.id,
          nama: feature.properties.nama,
          kode: feature.properties.kode,
          jenis: feature.properties.jenis,
          alamat: feature.properties.alamat,
          kapasitas: feature.properties.kapasitas || 0,
          fasilitas: feature.properties.fasilitas ? feature.properties.fasilitas.join(', ') : '',
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1]
        });
        setShowForm(true);
      }
    };

    document.addEventListener('hapusHalte', handleHapus);
    document.addEventListener('editHalte', handleEdit);

    return () => {
      document.removeEventListener('hapusHalte', handleHapus);
      document.removeEventListener('editHalte', handleEdit);
    };
  }, [geojsonData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nama: formData.nama,
      kode: formData.kode,
      jenis: formData.jenis,
      alamat: formData.alamat,
      kapasitas: parseInt(formData.kapasitas),
      fasilitas: formData.fasilitas.split(',').map(f => f.trim()).filter(f => f),
      longitude: parseFloat(formData.longitude),
      latitude: parseFloat(formData.latitude)
    };

    try {
      if (formData.id) {
        await api.put(`/halte/${formData.id}`, payload);
        alert("Data berhasil diperbarui!");
      } else {
        await api.post(`/halte/`, payload);
        alert("Data halte baru berhasil ditambahkan!");
      }
      setShowForm(false);
      fetchGeoJSON();
    } catch (err) {
      alert("Gagal menyimpan data. Pastikan semua kolom terisi dengan benar.");
    }
  };

  const getStyle = (feature) => {
    const jenis = feature.properties.jenis.toLowerCase();
    let mapColor = "#64748b"; 
    if (jenis === "brt") mapColor = "#D32F2F"; 
    else if (jenis === "bus") mapColor = "#1976D2"; 
    else if (jenis === "angkot") mapColor = "#388E3C"; 

    return { color: mapColor, weight: 2, fillColor: mapColor, fillOpacity: 0.95 };
  };

  const pointToLayer = (feature, latlng) => {
    return L.circleMarker(latlng, { radius: 8, fillColor: getStyle(feature).fillColor, color: "#ffffff", weight: 2.5, opacity: 1, fillOpacity: 1 });
  };

  const onEachFeature = (feature, layer) => {
    const { id, nama, kode, jenis, alamat, fasilitas } = feature.properties;
    const color = getStyle(feature).color;
    const popupContent = `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; min-width: 240px; padding: 2px;">
        <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">${nama}</h3>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: #475569;">
          <div style="display: flex; justify-content: space-between;"><span>Kode:</span> <strong>${kode}</strong></div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Tipe:</span> <span style="background-color: ${color}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold;">${jenis.toUpperCase()}</span>
          </div>
          <div style="background: #f8fafc; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <span style="display: block; font-size: 11px; color: #94a3b8; font-weight: bold; margin-bottom: 3px;">LOKASI</span>
            <span style="color: #334155;">${alamat || '-'}</span>
          </div>
          <div style="margin-top: 2px;">
            <span style="font-size: 11px; color: #94a3b8; font-weight: bold;">FASILITAS:</span>
            <p style="margin: 3px 0 0 0; color: #64748b; font-style: italic;">${fasilitas ? fasilitas.join(' • ') : '-'}</p>
          </div>
          
          ${isAdmin ? `
          <div style="display: flex; gap: 5px; margin-top: 10px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            <button onclick="document.dispatchEvent(new CustomEvent('editHalte', {detail: ${id}}))" style="flex: 1; background-color: #f59e0b; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-weight: bold;">Edit</button>
            <button onclick="document.dispatchEvent(new CustomEvent('hapusHalte', {detail: ${id}}))" style="flex: 1; background-color: #ef4444; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-weight: bold;">Hapus</button>
          </div>
          ` : ''}
        </div>
      </div>
    `;
    
    layer.bindPopup(popupContent);
    layer.on({
      mouseover: (e) => { e.target.setStyle({ radius: 11, weight: 3 }); e.target.bringToFront(); },
      mouseout: (e) => { e.target.setStyle({ radius: 8, weight: 2.5 }); }
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Tombol Tambah Data Floating (Hanya untuk Admin) */}
      {isAdmin && (
        <button 
          onClick={() => {
            setFormData({ id: null, nama: '', kode: '', jenis: 'Bus', alamat: '', kapasitas: 20, fasilitas: '', longitude: 105.26, latitude: -5.39 });
            setShowForm(true);
          }}
          style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000, backgroundColor: '#10b981', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: '14px' }}
        >
          ➕ Tambah Halte Baru
        </button>
      )}

      {showForm && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginTop: 0, color: '#1e293b' }}>{formData.id ? 'Edit Data Halte' : 'Tambah Halte Baru'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Nama Halte" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Kode (Cth: HLT-01)" value={formData.kode} onChange={e => setFormData({...formData, kode: e.target.value})} required style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                <select value={formData.jenis} onChange={e => setFormData({...formData, jenis: e.target.value})} style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                  <option value="BRT">BRT / Trans</option>
                  <option value="Bus">Bus Reguler</option>
                  <option value="Angkot">Angkutan Kota</option>
                </select>
              </div>
              <textarea placeholder="Alamat Lengkap" value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', minHeight: '60px' }} />
              <input type="number" placeholder="Kapasitas Orang" value={formData.kapasitas} onChange={e => setFormData({...formData, kapasitas: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Fasilitas (Pisahkan dengan koma)" value={formData.fasilitas} onChange={e => setFormData({...formData, fasilitas: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="number" step="any" placeholder="Longitude" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} required style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                <input type="number" step="any" placeholder="Latitude" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} required style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#3b82f6', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Simpan</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, backgroundColor: '#94a3b8', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MapContainer center={[-5.385, 105.26]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }} zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
        {geojsonData && (
          <GeoJSON key={JSON.stringify(geojsonData)} data={geojsonData} style={getStyle} pointToLayer={pointToLayer} onEachFeature={onEachFeature} />
        )}
      </MapContainer>
    </div>
  );
}

export default MapView;