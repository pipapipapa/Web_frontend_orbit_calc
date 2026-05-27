import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { api } from '../api';
import { Header } from '../components/Header';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { useNavigate } from 'react-router-dom';

export const MissionsListPage: FC = () => {
    const [missions, setMissions] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState(''); // Для фильтра модератора
    const { role } = useSelector((state: RootState) => state.auth);
    
    const navigate = useNavigate();

    const fetchMissions = async () => {
        try {
            // Передаем параметры фильтрации в сгенерированный API
            const res = await api.missions.list({ 
                status: statusFilter, 
                date_from: dateFrom, 
                date_to: dateTo 
            });
            setMissions(res.data.data ||[]);
        } catch (e) { console.error(e); }
    };

    // SHORT POLLING (СТРОГО ПО МЕТОДИЧКЕ)
    // Этот хук будет перезапускаться при изменении фильтра
    useEffect(() => {
        fetchMissions(); // Первый вызов при загрузке или смене фильтра
        
        // Запускаем интервал только для модератора
        if (role === 'MODERATOR') {
            const intervalId = setInterval(fetchMissions, 1000); // Опрос каждые 5 секунд
            
            // Функция очистки: вызывается при размонтировании компонента или перед новым запуском useEffect
            return () => clearInterval(intervalId);
        }
    }, [statusFilter, role]); // Зависимости: перезапустит polling при смене фильтра

    const handleModerate = async (id: number, action: "ACCEPT" | "REJECT") => {
        await api.missions.complete(id, { action: action });
        fetchMissions(); // Немедленное обновление после действия
    };

    const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
    const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);



    return (
        <>
            <Header />
            <Container className="mt-4">
                <BreadCrumbs current={role === 'MODERATOR' ? 'Панель модератора' : 'Мои заявки'} />

                {/* ФИЛЬТРЫ ДЛЯ МОДЕРАТОРА */}
                {role === 'MODERATOR' && (
                    <div className="filter-panel bg-dark p-3 rounded mb-4">
                        <Row>
                            <Col md={4}>
                                <Form.Select 
                                    value={statusFilter} 
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-dark text-white"
                                >
                                    <option value="">Все статусы</option>
                                    <option value="FORMED">Сформированы</option>
                                    <option value="COMPLETED">Завершены</option>
                                    <option value="REJECTED">Отклонены</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </div>
                )}

                <div className="filter-panel bg-dark p-3 rounded mb-4">
                    <Row className="align-items-end">
                        <Col md={3}>
                            <Form.Label className="text-white">С:</Form.Label>
                            <Form.Control type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                        </Col>
                        <Col md={3}>
                            <Form.Label className="text-white">По:</Form.Label>
                            <Form.Control type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                        </Col>
                        <Col md={2}>
                            <Button variant="primary" onClick={fetchMissions}>Применить</Button>
                        </Col>
                    </Row>
                </div>
                
                <Table variant="dark" striped hover responsive className="mission-table-wrapper">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Статус</th>
                            <th>Дата</th>
                            <th>Автор</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {missions.length === 0 ? (
                            <tr><td colSpan={5} className="text-center text-white p-4">Заявок с такими параметрами не найдено</td></tr>
                        ) : (
                            missions.map(m => (
                                <tr key={m.id}>
                                    <td>#{m.id}</td>
                                    <td><span className={`status-badge status-${m.status}`}>{m.status}</span></td>
                                    <td>{m.formed_at || ""}</td>
                                    <td>{m.author_login}</td>
                                    <td>
                                        <Button variant="outline-light" size="sm" className="me-2" onClick={() => navigate(`/mission/${m.id}`)}>Просмотр</Button>
                                        
                                        {role === 'MODERATOR' && m.status === 'FORMED' && (
                                            <>
                                                <Button variant="success" size="sm" className="me-2" onClick={() => handleModerate(m.id, 'ACCEPT')}>Завершить</Button>
                                                <Button variant="danger" size="sm" onClick={() => handleModerate(m.id, 'REJECT')}>Отклонить</Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Container>
        </>
    );
};