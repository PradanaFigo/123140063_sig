import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const form = new URLSearchParams();
        form.append('username', email);
        form.append('password', password);

        try {
            const res = await api.post('/auth/login', form);
            login(res.data.access_token);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.detail || "Login Gagal!");
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-form-card">
                <div className="auth-header-text">
                    <h2> Selamat Datang</h2>
                    <p>Silakan login untuk mengelola data WebGIS Transportasi</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input 
                            type="text" 
                            className="auth-input"
                            placeholder="Username atau Email" 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                        <input 
                            type="password" 
                            className="auth-input"
                            placeholder="Password" 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="auth-btn btn-primary">
                        Masuk ke Dashboard
                    </button>
                </form>

                <p className="auth-link">
                    Belum memiliki akun Admin? <Link to="/register">Daftar sekarang</Link>
                </p>
            </div>
        </div>
    );
}