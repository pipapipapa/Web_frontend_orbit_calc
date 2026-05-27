import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearMissionDraft, fetchMissionDraftThunk } from './store/slices/missionSlice';
import { logoutThunk, restoreAuth } from './store/slices/authSlice';
import { OrbitsPage } from "./pages/Orbits";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { OrbitPage } from "./pages/OrbitPage";
import { MissionPage } from "./pages/MissionPage";
import { MissionsListPage } from "./pages/MissionListPage";
import type { AppDispatch } from "./store";
// ... (возможно, jwt-decode для восстановления сессии)

function App() {
    const dispatch = useDispatch<AppDispatch>();

    // Восстанавливаем сессию после перезагрузки страницы (F5)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          dispatch(clearMissionDraft()); 
        }
    }, [dispatch]);

    return (
        <BrowserRouter basename="/pipapipapa/Web_frontend_orbit_calc">
            <Routes>
                {/* Публичные роуты */}
                <Route path="/" element={<OrbitsPage />} />
                <Route path="/orbit/:id" element={<OrbitPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Роуты для авторизованных */}
                <Route path="/mission/:id" element={<MissionPage />} />
                <Route path="/missions" element={<MissionsListPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;