import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from 'react-bootstrap';
import { api } from '../api';

interface RegisterRequest {
    login: string;
    password: string;
    role: string;
}

export const RegisterPage: FC = () => {
const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('CLIENT');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
        const requestData: any = { login, password, role };
        
        await api.auth.register(requestData);
        navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.error || "Ошибка регистрации");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Header />
            <div className="auth-page-container">
                <form onSubmit={handleSubmit} className="auth-form">
                    <h3 className="text-white text-center mb-4">Регистрация</h3>
                    <input className="form-control text-black mb-3" value={login} onChange={e => setLogin(e.target.value)} placeholder="Придумайте логин" required />
                    <input className="form-control text-black mb-3" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Придумайте пароль" required />
                    <select className="form-select bg-dark text-white mb-4" value={role} onChange={e => setRole(e.target.value)}>
                        <option value="CLIENT">Я Инженер</option>
                        <option value="MODERATOR">Я Баллистик</option>
                    </select>
                    <Button type="submit" variant="success" className="w-100 mb-3">
                        Зарегистрироваться
                    </Button>
                    <div className="text-center text-muted" style={{ fontSize: '14px' }}>
                        Уже есть аккаунт? <Link to="/login">Войти</Link>
                    </div>
                </form>
            </div>
        </>
    );
};