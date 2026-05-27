import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store';
import { Header } from '../components/Header';
import { Button } from 'react-bootstrap';
import { api } from '../api';
import { restoreAuth } from '../store/slices/authSlice';

export const LoginPage: FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.auth.login({ login, password });
            localStorage.setItem('token', response.data.token);
            
            dispatch(restoreAuth({ login: login, role: "CLIENT" }));
            navigate('/');
        } catch (error) {
        }
    };

    return (
        <>
            <Header />
            <div className="auth-page-container">
                <form onSubmit={handleSubmit} className="auth-form">
                    <h3 className="text-white text-center mb-4">Вход в систему</h3>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <input className="form-control text-black mb-3" value={login} onChange={e => setLogin(e.target.value)} placeholder="Логин" required />
                    <input className="form-control text-black mb-4" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" required />
                    <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </Button>
                    <div className="text-center text-muted" style={{ fontSize: '14px' }}>
                        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                    </div>
                </form>
            </div>
        </>
    );
};