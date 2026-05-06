import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/api';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { email: email, password: password });
            alert("Registrasi berhasil! Silakan login.");
            navigate('/login'); 
        } catch (err) {
            alert(err.response?.data?.detail || "Registrasi Gagal!");
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-form-card">
                <div className="auth-header-text">
                    <h2>Daftar Admin Baru</h2>
                    <p>Buat akun untuk mengakses fitur manajemen WebGIS</p>
                </div>

                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <input 
                            type="text" 
                            className="auth-input"
                            placeholder="Buat Username / Email" 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                        <input 
                            type="password" 
                            className="auth-input"
                            placeholder="Buat Password" 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="auth-btn btn-success">
                        Daftar & Buat Akun
                    </button>
                </form>

                <p className="auth-link">
                    Sudah memiliki akun? <Link to="/login">Login di sini</Link>
                </p>
            </div>
        </div>
    );
}