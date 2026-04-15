import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import api from '../config/api';

function MapView() {
  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await api.get('/halte/data/geojson');
        setGeojsonData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };
    fetchGeoJSON();
  }, []);

  const getStyle = (feature) => {
    const jenis = feature.properties.jenis.toLowerCase();
    let mapColor = "#64748b"; 

    if (jenis === "brt") mapColor = "#D32F2F"; 
    else if (jenis === "bus") mapColor = "#1976D2"; 
    else if (jenis === "angkot") mapColor = "#388E3C"; 

    return {
      color: mapColor,
      weight: 2,
      fillColor: mapColor,
      fillOpacity: 0.95
    };
  };

  const pointToLayer = (feature, latlng) => {
    const style = getStyle(feature);
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: style.fillColor,
      color: "#ffffff", 
      weight: 2.5,
      opacity: 1,
      fillOpacity: 1
    });
  };

  const onEachFeature = (feature, layer) => {
    const { nama, kode, jenis, alamat, fasilitas } = feature.properties;
    const color = getStyle(feature).color;
    
    const popupContent = `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; min-width: 240px; padding: 2px;">
        <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          ${nama}
        </h3>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: #475569;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Kode Halte:</span> 
            <strong style="color: #0f172a;">${kode}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Tipe Kendaraan:</span> 
            <span style="background-color: ${color}; color: white; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; text-transform: uppercase;">
              ${jenis}
            </span>
          </div>
          <div style="background: #f8fafc; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0; margin-top: 4px;">
            <span style="display: block; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: bold; margin-bottom: 3px;">Lokasi</span>
            <span style="color: #334155; line-height: 1.4;">${alamat || 'Tidak ada detail alamat'}</span>
          </div>
          <div style="margin-top: 2px;">
            <span style="font-size: 11px; color: #94a3b8; font-weight: bold; text-transform: uppercase;">Fasilitas:</span>
            <p style="margin: 3px 0 0 0; color: #64748b; font-style: italic;">
              ${fasilitas ? fasilitas.join(' • ') : 'Tidak ada data'}
            </p>
          </div>
        </div>
      </div>
    `;
    
    layer.bindPopup(popupContent);   
    layer.on({
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({ radius: 11, weight: 3 });
        target.bringToFront();
      },
      mouseout: (e) => {
        const target = e.target;
        target.setStyle({ radius: 8, weight: 2.5 });
      }
    });
  };

  return (
    <MapContainer
      center={[-5.385, 105.26]} 
      zoom={13}
      style={{ height: '100%', width: '100%', zIndex: 1 }}
      zoomControl={false} 
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {geojsonData && (
        <GeoJSON
          data={geojsonData}
          style={getStyle}
          pointToLayer={pointToLayer}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
}
export default MapView;