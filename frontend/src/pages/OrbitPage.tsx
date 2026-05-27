import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { type Orbit, ORBITS_MOCK, MINIO_BASE_URL } from '../modules/mock';
import { Header } from '../components/Header';
import { BreadCrumbs } from '../components/BreadCrumbs';

export const OrbitPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const [orbit, setOrbit] = useState<Orbit | null>(null);

    useEffect(() => {
        const found = ORBITS_MOCK.find(o => o.id === Number(id));
        if (found) setOrbit(found);
    }, [id]);

    if (!orbit) return <h2 className="text-center mt-5 text-white">Загрузка...</h2>;

    const videoSrc = orbit.videoKey ? `${MINIO_BASE_URL}${orbit.videoKey}` : "/default-orbit.mp4"; 

    return (
        <>
            <Header />
            <BreadCrumbs current={orbit.name} />

            <div className="vibes-wrapper">
                <div className="vibes-card">
                    {videoSrc ? (
                        <video autoPlay loop muted playsInline className="vibes-media">
                            <source src={videoSrc} type="video/mp4" />
                        </video>
                    ) : (
                        <video src={videoSrc} className="vibes-media" />
                    )}

                    <div className="vibes-overlay">
                        <h3 className="text-white fw-bold mb-2">{orbit.name}</h3>
                        <p className="orbit-card-text">{orbit.description}</p>
                    </div>
                </div>
            </div>
        </>
    );
};