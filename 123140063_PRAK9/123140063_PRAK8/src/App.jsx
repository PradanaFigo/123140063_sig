import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MapView from './components/MapView';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function Dashboard() {
    const { user, logout } = useAuth();
    
    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="brand-header">
                    <h1>🗺️ WebGIS Trans</h1>
                    <h2>Kota Bandar Lampung</h2>
                </div>
                
                <div className="sidebar-content">
                    {/* KARTU STATUS USER */}
                    <div className={`auth-card ${user ? 'admin-active' : 'public-active'}`}>
                        <div className="auth-header">
                            <span className="auth-icon">{user ? '👨‍💻' : '👁️'}</span>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>Status Akses</h3>
                                <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: user ? '#059669' : '#dc2626' }}>
                                    {user ? 'Admin Sistem Aktif' : 'Publik (Hanya Lihat)'}
                                </p>
                            </div>
                        </div>
                        
                        {user ? (
                            <button className="btn-action btn-logout" onClick={logout}>
                                 Logout dari Sistem
                            </button>
                        ) : (
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <button className="btn-action btn-login">
                                     Login sebagai Admin
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* KARTU LEGENDA PETA */}
                    <div className="legend-card">
                        <h3>📍 Legenda Transportasi</h3>
                        <ul className="legend-list">
                            <li><span className="dot brt"></span> BRT / Trans</li>
                            <li><span className="dot bus"></span> Bus Reguler</li>
                            <li><span className="dot angkot"></span> Angkutan Kota</li>
                        </ul>
                    </div>
                    
                    {/* INFO TAMBAHAN */}
                    <div className="info-box">
                        <p>ℹ️ <b>Petunjuk:</b> Klik titik pada peta untuk melihat detail fasilitas dan rute halte.</p>
                    </div>
                </div>
            </aside>
            
            <main className="map-area">
                <MapView isAdmin={user} />
            </main>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Dashboard />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}