import { useState, useRef } from 'react';
import type { FC, FormEvent } from 'react';
import { ProgressBar, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { BreadCrumbs } from './BreadCrumbs';

interface SearchPanelProps {
    initialQuery: string;
    onTextSearch: (query: string) => void;
    onImageSearch: (file: File) => void;
    onResetAi: () => void;
    aiReady: boolean;
    aiProgress: number;
}

export const SearchPanel: FC<SearchPanelProps> = ({
    onTextSearch, onImageSearch, onResetAi, aiReady, aiProgress
}) => {
    const [query, setQuery] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Получаем данные корзины из Redux
    const { itemsCount, draftId } = useSelector((state: RootState) => state.mission);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const handleTextSubmit = (e: FormEvent) => {
        e.preventDefault();
        onTextSearch(query);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onImageSearch(file);
    };

    return (
        <div className="top-controls">
                <BreadCrumbs current="Каталог орбит" />
                
                <form className="search-form" onSubmit={handleTextSubmit}>
                    <input type="text" placeholder="Фильтр по названию..." value={query} onChange={e => setQuery(e.target.value)} />
                    <button type="submit" className="search-btn" title="Искать">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </button>
                </form>

<div className="ai-search-block">
                    {!aiReady && (
                        <ProgressBar now={aiProgress} label={`${Math.round(aiProgress)}%`} className="mb-2" style={{ height: '12px', fontSize: '10px' }} />
                    )}
                    
                    <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleImageChange} 
                    />
                    
                    <div className="ai-buttons">
                        <button 
                            type="button"
                            className="orbit-card-btn btn-ai-upload" 
                            onClick={() => fileInputRef.current?.click()} 
                            disabled={!aiReady}
                        >
                            Загрузить фото
                        </button>
                        <button 
                            type="button"
                            className="orbit-card-btn btn-ai-reset" 
                            onClick={onResetAi}
                        >
                            Сбросить
                        </button>
                    </div>
                </div>

                <button 
                    onClick={() => draftId && navigate(`/mission/${draftId}`)}
                    className="btn btn-dark position-relative"
                    disabled={!draftId || !isAuthenticated} // Неактивна для гостей или при пустой корзине
                    style={{ opacity: (draftId && isAuthenticated) ? 1 : 0.4, cursor: (draftId && isAuthenticated) ? 'pointer' : 'not-allowed' }}
                    title={draftId ? "Перейти в текущий проект" : "Корзина пуста"}
                >
                    <img src="/planet.svg" alt="Mission" style={{ width: '24px' }}/>
                    
                    {/* Бейдж с количеством виден, только если он не 0 */}
                    {(draftId && itemsCount > 0) && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                            {itemsCount}
                        </span>
                    )}
                </button>
            </div>
    );
};