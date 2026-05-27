import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { logoutThunk } from '../store/slices/authSlice';
import { clearMissionDraft } from '../store/slices/missionSlice';
import { Button } from 'react-bootstrap';

export const Header: FC = () => {
    // Получаем состояние авторизации и корзины из глобального хранилища Redux
    const { isAuthenticated, login, role } = useSelector((state: RootState) => state.auth);
    
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Обработчик выхода из системы
    const handleLogout = async () => {
        await dispatch(logoutThunk()); // Вызываем асинхронный Thunk для логаута
        dispatch(clearMissionDraft());  // Сбрасываем данные корзины в Redux
        navigate('/'); // Перенаправляем на главную страницу
    };

    return (
        <header className="site-header d-flex justify-content-between align-items-center p-3">
            
            {/* Левая часть: Навигация */}
            <div className="d-flex align-items-center gap-3">
                <Link to="/" className="home-btn" title="На главную">
                    <img src="/home.svg" alt="Home" />
                </Link>
                
                {/* Ссылки, которые видны только авторизованным */}
                {isAuthenticated && (
                    <>
                        {/* Для клиента */}
                        {role === 'CLIENT' && <Link to="/missions" className="text-light">Мои Заявки</Link>}
                        
                        {/* Для модератора (с другим стилем) */}
                        {role === 'MODERATOR' && <Link to="/missions" className="text-light">Панель Модератора</Link>}
                    </>
                )}
            </div>

            {/* Правая часть: Управление сессией и корзина */}
            <div className="d-flex align-items-center gap-4">
                
                {/* Отображаем либо информацию о пользователе, либо кнопку входа */}
                {isAuthenticated ? (
                    <>
                        <span className="text-light" style={{ fontSize: '14px' }}>
                            {login}
                        </span>
                        <Button variant="outline-danger" size="sm" onClick={handleLogout}>Выйти</Button>
                    </>
                ) : (
                    <>
                    <Link to="/login" className="btn btn-primary btn-sm">Войти</Link>
                    <Link to="/register" className="btn btn-primary btn-sm">Зарегистрироваться</Link>
                    </>
                )}

            </div>
        </header>
    );
};