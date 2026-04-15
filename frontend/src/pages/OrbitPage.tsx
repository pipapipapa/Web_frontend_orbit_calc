import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { ORBITS_MOCK, type Orbit } from '../modules/mock';
import { Header } from '../components/Header';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { ROUTE_LABELS } from '../Routes';

export const OrbitPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    
    const[orbit, setOrbit] = useState<Orbit | null>(null);

    useEffect(() => {
        const found = ORBITS_MOCK.find(o => o.id === Number(id));
        if (found) {
            setOrbit(found);
        }
    }, [id]);

    if (!orbit) {
        return (
            <>
                <Header />
                <h2 className="text-center" style={{ color: 'white', marginTop: '100px' }}>
                    Загрузка или орбита не найдена...
                </h2>
            </>
        );
    }

    const videoSrc = orbit.videoKey ? orbit.videoKey : "/default-orbit.mp4";

    return (
        <>
            <Header />
            
            <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.ORBIT }]} />

            <div className="vibes-container">
                
                <div className="vibes-card">
                    
                    {videoSrc ? (
                        <video autoPlay loop muted playsInline className="vibes-video">
                            <source src={videoSrc} type="video/mp4" />
                        </video>
                    ) : (
                        <video src={videoSrc} className="vibes-img" />
                    )}

                    {/* Затемнение снизу и текстовый контент */}
                    <div className="vibes-overlay">
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                            {orbit.name}
                        </h3>
                        
                        <p style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '20px', lineHeight: '1.4' }}>
                            {orbit.description}
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
};