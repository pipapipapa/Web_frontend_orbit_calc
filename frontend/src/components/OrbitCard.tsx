import type { FC } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../Routes";
import type { Orbit } from "../modules/mock";


interface Props {
    orbit: Orbit;
}

export const OrbitCard: FC<Props> = ({ orbit }) => {
    const navigate = useNavigate();
    
    const imageSrc = orbit.imageKey ? orbit.imageKey : "/default-orbit.mp4";

    return (
        <Card bg="dark" text="white" style={{ height: '100%' }}>
            <Card.Img variant="top" src={imageSrc} style={{ height: "150px", objectFit: "cover" }} />
            <Card.Body>
                <Card.Title>{orbit.name}</Card.Title>
                <Card.Text>Высота: {orbit.altitudeKm} км</Card.Text>
                <Button variant="outline-primary" onClick={() => navigate(`${ROUTES.ORBIT}/${orbit.id}`)}>
                    Подробнее
                </Button>
            </Card.Body>
        </Card>
    );
};