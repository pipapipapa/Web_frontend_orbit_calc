import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTE_LABELS } from '../Routes';

interface Props { current?: string; }

export const BreadCrumbs: FC<Props> = ({ current }) => {
    const location = useLocation();
    // Если передан prop current, используем его, иначе ищем в словаре
    const label = current || ROUTE_LABELS[location.pathname] || "Страница";

    return (
        <div className="breadcrumbs-container">
            <Link to="/">Главная</Link> 
            <span className="breadcrumbs-current">/ {label}</span>
        </div>
    );
};