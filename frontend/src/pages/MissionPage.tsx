import type { FC } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Header } from '../components/Header';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { useNavigate } from 'react-router-dom';
import { ROUTE_LABELS } from '../Routes';

export const MissionPage: FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            
            <Container className="mt-4">
                <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.MISSION }]} />

                <div className="mission-table-wrapper">
                    <h2 className="text-white fw-bold">Проект Миссии</h2>
                    <p className="text-muted mb-4"></p>

                    <h5 className="text-white mb-3">План маневров:</h5>

                    <div className="text-center p-5 border border-secondary rounded">
                        <p>Авторизуйтесь для просмотра корзины</p>
                        <Button variant="outline-light" onClick={() => navigate('/')}>Перейти в каталог</Button>
                    </div>
                </div>
            </Container>
        </>
    );
};