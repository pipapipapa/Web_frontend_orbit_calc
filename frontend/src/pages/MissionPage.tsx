import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { api } from '../api';
import type { AppDispatch, RootState } from '../store';
import { fetchMissionDraftThunk } from '../store/slices/missionSlice';
import { MINIO_BASE_URL } from '../modules/mock';

export const MissionPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    const [mission, setMission] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [satelliteMass, setSatelliteMass] = useState<number>(0);
    const [payloads, setPayloads] = useState<Record<number, number>>({});

    const { role } = useSelector((state: RootState) => state.auth);

     useEffect(() => {
        if (mission) {
            setSatelliteMass(mission.satellite_mass_kg || 0);
            const initialPayloads: Record<number, number> = {};
            mission.orbit_items.forEach((item: any) => {
                initialPayloads[item.orbit_id] = item.payload; 
            });
            setPayloads(initialPayloads);
        }
    }, [mission]);

     useEffect(() => {
        if (mission) {
            setSatelliteMass(mission.satellite_mass_kg || 0);
            const initialPayloads: Record<number, number> = {};
            mission.orbit_items.forEach((item: any) => {
                initialPayloads[item.orbit_id] = item.payload; 
            });
            setPayloads(initialPayloads);
        }
    }, [mission]);

    const loadMission = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const res = await api.missions.detail(Number(id));
            setMission(res.data.data);
        } catch (e: any) {
            setError("Заявка не найдена или доступ запрещен");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

        // Обработчик изменения массы
    const handleMassChange = (val: string) => setSatelliteMass(Number(val));

    // Обработчик изменения нагрузки для конкретной орбиты
    const handlePayloadChange = (orbitId: number, val: string) => {
        setPayloads(prev => ({ ...prev, [orbitId]: Number(val) }));
    };

    useEffect(() => { loadMission() }, [id]);

    // 1. Формирование заявки (Создателем)
const handleForm = async () => {
    if (!mission) return;
    setLoading(true);
    try {
        // 1. Обновляем массу спутника в заявке (Миссия)
        await api.missions.update(mission.id, { satellite_mass_kg: satelliteMass });
        
        // 2. Обновляем полезную нагрузку для КАЖДОЙ орбиты в М-М
        for (const item of mission.orbit_items) {
            const payloadValue = payloads[item.orbit_id] || 0;
            await api.missionOrbitItems.update({
                orbit_id: item.orbit_id,
                payload_tons: payloadValue
            });
        }

        // 3. Формируем заявку (запуск расчетов на бэкенде)
        await api.missions.form(mission.id);
        
        // 4. Обновляем состояние страницы
        loadMission(); 
    } catch (e) {
        setError("Ошибка при формировании заявки");
    } finally {
        setLoading(false);
    }
};

    // 2. Завершение/Отклонение (Модератором)
    const handleModerate = async (action: "ACCEPT" | "REJECT") => {
        if (!mission) return;
        setLoading(true);
        try {
            await api.missions.complete(mission.id, { action });
            loadMission();
        } finally { setLoading(false); }
    };

    // 3. Удаление услуги из заявки (М-М)
    const handleRemoveItem = async (orbitId: number) => {
        if (!mission) return;
        await api.missionOrbitItems.delete({ orbit_id: orbitId });
        loadMission();
        dispatch(fetchMissionDraftThunk());
    };

    // 4. Удаление всей заявки
    const handleDeleteMission = async () => {
        if (!mission) return;
        await api.missions.delete(mission.id);
        navigate('/');
    };

    if (loading) return <Container className="mt-5 text-center text-white"><Spinner animation="border" /></Container>;
    if (error) return <Container className="mt-5 text-center text-white"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <>
            <Header />
            <Container className="mt-4">
                <BreadCrumbs current={`Проект #${id}`} />

                <div className="mission-table-wrapper">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h2 className="text-white fw-bold">Проект: {mission.satellite_name || 'Sat-X Experimental'}</h2>
                            <p className="text-white">
                                {mission.status === 'DRAFT' ? (
                                    <>
                                    <input 
                                    type="checkbox" className="input-checkbox"
                                    />
                                    <input type="number" value={satelliteMass} onChange={e => handleMassChange(e.target.value)} className="input-inline" />
                                    <span className="payload-text"> кг</span></>
                                ) : (
                                    <b>{mission.satellite_mass_kg} кг</b>
                                )}
                            </p>
                        </div>
                        <div className="text-end">
                            <span className={`status-badge status-${mission.status}`}>{mission.status}</span>
                        </div>
                    </div>

                    <Table variant="dark" hover responsive className="align-middle mt-4">
                        <thead className="text-muted" style={{ fontSize: '12px' }}>
                            <tr>
                                <th>ВИД</th>
                                <th>ОРБИТА</th>
                                <th>ПОЛЕЗНАЯ НАГРУЗКА</th>
                                <th>РАСЧЕТЫ</th>
                                <th className="text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {mission.orbit_items && mission.orbit_items.map((item: any) => (
                                <tr key={item.orbit.id}>
                                    <td>
                                        <img src={item.orbit.image_key ? `${MINIO_BASE_URL}${item.orbit.image_key}` : "/default.jpg"} 
                                             alt={item.orbit.name} className="mission-thumb" />
                                    </td>
                                    <td>
                                        <div className="fw-bold text-white">{item.orbit.name}</div>
                                        <div className="text-muted" style={{fontSize: '12px'}}>H = {item.orbit.altitude_km} км</div>
                                    </td>
                                    <td className="payload-text">
                                        <td className="col-payload">
                                            {mission.status === 'DRAFT' ? (
                                                <>
                                                <input 
                                                type="checkbox" className="input-checkbox"
                                                />
                                                <input type="number" step="0.1" value={payloads[item.orbit_id] || 0} onChange={e => handlePayloadChange(item.orbit_id, e.target.value)} className="input-table" /><span className="payload-text"> тонн</span>
                                                </>
                                            ) : (
                                                <span className="payload-text">{item.payload} тонн</span>
                                            )}
                                            
                                        </td>
                                    </td>
                                    <td className="res-text">
                                        {mission.status === "COMPLETED" ? (
                                            <>
                                                <div>V: <b>{item.velocity.toFixed(2)}</b> км/с</div>
                                                <div>T: <b className="highlight">{item.period.toFixed(1)}</b> мин</div>
                                            </>
                                        ) : "---"}
                                    </td>
                                    <td className="text-center">
                                        {mission.status === 'DRAFT' && (
                                            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveItem(item.orbit_id)}>×</Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* БЛОК УПРАВЛЕНИЯ ЗАЯВКОЙ */}
                    <div className="d-flex gap-3 mt-4 justify-content-center">
                        {mission.status === 'DRAFT' && (
                            <Button variant="success" onClick={handleForm}>СФОРМИРОВАТЬ ЗАЯВКУ</Button>
                        )}
                        {role === 'MODERATOR' && mission.status === 'FORMED' && (
                            <>
                                <Button variant="primary" onClick={() => handleModerate("ACCEPT")}>ЗАВЕРШИТЬ (РАСЧЕТ)</Button>
                                <Button variant="danger" onClick={() => handleModerate("REJECT")}>ОТКЛОНИТЬ</Button>
                            </>
                        )}
                        {mission.status !== 'COMPLETED' && (
                            <Button variant="outline-secondary" onClick={handleDeleteMission}>УДАЛИТЬ ПРОЕКТ</Button>
                        )}
                    </div>
                </div>
            </Container>
        </>
    );
};