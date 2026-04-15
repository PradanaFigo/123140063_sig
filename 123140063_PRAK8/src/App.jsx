import MapView from './components/MapView'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>WebGIS Transportasi Kota Bandar Lampung</h1>
        <p>Distribusi Spasial Halte dan Rute Integrasi</p>
      </header>
      
      <main className="map-wrapper">
        <MapView />
        <div className="map-legend">
          <h4>Keterangan Halte</h4>
          <div className="legend-item">
            <span className="dot brt"></span> BRT / Trans
          </div>
          <div className="legend-item">
            <span className="dot bus"></span> Bus Reguler
          </div>
          <div className="legend-item">
            <span className="dot angkot"></span> Angkutan Kota
          </div>
        </div>
      </main>
    </div>
  )
}

export default App