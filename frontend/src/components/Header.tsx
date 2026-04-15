import type { FC } from 'react';
import { Link } from 'react-router-dom';

export const Header: FC = () => {
    return (
        <header className="site-header">
            <Link to="/" className="home-btn" title="На главную">
                <img src="/home.svg" alt="Home" />
            </Link>
        </header>
    );
};