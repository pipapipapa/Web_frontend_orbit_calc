import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { ORBITS_MOCK, MISSION_MOCK, type Orbit } from '../modules/mock';
import { Header } from '../components/Header';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { ROUTE_LABELS } from '../Routes';

export const OrbitsPage: FC = () => {
    const [query, setQuery] = useState("");
    const[orbits, setOrbits] = useState<Orbit[]>(ORBITS_MOCK);
    const navigate = useNavigate();

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const filtered = ORBITS_MOCK.filter(o => 
            o.name.toLowerCase().includes(query.toLowerCase())
        );
        setOrbits(filtered);
    };

    const missionIsEmpty = MISSION_MOCK.items.length === 0;

    return (
        <>
            <Header />
            
            <Container className="mt-4">
                <div className="top-controls">
                    <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.HOME }]} />
                    
                <div 
                    className={`mission-banner ${missionIsEmpty ? 'empty-cart' : ''}`} 
                    onClick={() => navigate('/mission')}
                >
                    <img src="/planet.svg" alt="Planet" className="planet-icon" />
                    <h4> : 0</h4>
                </div>


                    <form className="search-form" onSubmit={handleSearch}>
                        <input 
                            type="text" 
                            placeholder="Фильтр орбит" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)} 
                        />

                        <button type="submit" className="search-btn" title="Искать">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                        </button>
                    </form>
                </div>

                <Row xs={1} md={2} lg={4} className="g-4">
                    {orbits.map(orbit => {
                        const imgSrc = orbit.imageKey || "/default-orbit.jpg";
                        
                        return (
                            <Col key={orbit.id}>
                                <Card className="orbit-card">
                                    <Card.Img variant="top" src={imgSrc} className="orbit-card-img" />
                                    <div className="orbit-card-body">
                                        <Link to={`/orbit/${orbit.id}`}>
                                            <h5 className="orbit-card-title">{orbit.name}</h5>
                                        </Link>
                                        <p className="orbit-card-text">Высота: ~{orbit.altitudeKm} км</p>
                                    </div>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </>
    );
};