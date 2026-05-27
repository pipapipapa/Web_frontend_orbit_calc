import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../api';
import { Header } from '../components/Header';
import type { RootState, AppDispatch } from '../store';
import { addOrbitToMissionThunk, fetchMissionDraftThunk } from '../store/slices/missionSlice';
import { MINIO_BASE_URL, type Orbit } from '../modules/mock';
import { useOrbitSearch } from '../hooks/useOrbitSearch';
import { SearchPanel } from '../components/SearchPanel';
import { setSearchQuery } from '../store/slices/filterSlice';

export const OrbitsPage: FC = () => {
    const [rawOrbits, setRawOrbits] = useState<any[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    
    // Хук для CLIP
    const { orbits, ready, progress, searchByImage, resetSearch } = useOrbitSearch(rawOrbits);
    
    // Состояние авторизации
    const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);
    const { searchQuery } = useSelector((state: RootState) => state.filter);

    // Функция загрузки данных по текстовому запросу
    const loadData = (query: string = "") => {
        api.orbits.list({ search: query }).then(res => {
            const backendData = res.data.data ||[];

            const frontendOrbits: Orbit[] = backendData.map((item: any) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                descriptionEn: item.description_en || item.description, 
                altitudeKm: item.altitude_km,
                imageKey: item.image_key,
                videoKey: item.video_key,
                embedding: item.embedding
            }));

            setRawOrbits(frontendOrbits);
        });
    };

    // Загрузка данных и корзины при входе
    useEffect(() => {
        loadData();
        if (isAuthenticated) {
            dispatch(fetchMissionDraftThunk());
        }
    }, [isAuthenticated, dispatch]);

    const handleAdd = (orbitId: number) => {
        dispatch(addOrbitToMissionThunk({ orbit_id: orbitId }));
    };

    useEffect(() => {
        loadData(searchQuery);
    }, []);

    const handleTextSearch = (query: string) => {
        dispatch(setSearchQuery(query)); // Сохраняем в Redux
        loadData(query);                 // Ищем на бэкенде
    };

    return (
        <>
            <Header />
            <Container className="mt-4">
                <SearchPanel
                    initialQuery={searchQuery} // Передаем начальное значение
                    onTextSearch={handleTextSearch}
                    onImageSearch={searchByImage}
                    onResetAi={resetSearch}
                    aiReady={ready}
                    aiProgress={progress}
                />
            </Container>
            <Container fluid className="px-5">
                <Row xs={1} md={2} lg={4} className="g-4 orbits-grid">
                    {orbits.map(orbit => {
                        const imgSrc = orbit.imageKey ? `${MINIO_BASE_URL}${orbit.imageKey}` : "/default-orbit.jpg";
                        return (
                            <Col key={orbit.id}>
                                <Card className="orbit-card">
                                    <Card.Img src={imgSrc} className="orbit-card-img" />
                                    <div className="orbit-card-body">
                                        <Link to={`/orbit/${orbit.id}`}><h5 className="orbit-card-title">{orbit.name}</h5></Link>
                                        <p className="orbit-card-text">Высота: ~{orbit.altitudeKm} км</p>
                                    </div>
                                    {isAuthenticated && role === 'CLIENT' && (
                                        <Button className="orbit-card-btn" onClick={() => handleAdd(orbit.id)}>
                                            Включить в план
                                        </Button>
                                    )}
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </>
    );
};