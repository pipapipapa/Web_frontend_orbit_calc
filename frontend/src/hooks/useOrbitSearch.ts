import { useState, useRef, useEffect } from 'react';
import type { Orbit } from '../modules/mock';
import { cosineSimilarity } from '../modules/math';

export interface IProcessedOrbit extends Orbit {
    score: number;
    isVisible: boolean;
}

export const useOrbitSearch = (initialItems: Orbit[]) => { 
    const[orbits, setOrbits] = useState<IProcessedOrbit[]>([]);
    const [imageEmbedding, setImageEmbedding] = useState<number[] | null>(null);
    const [ready, setReady] = useState(false);
    const[progress, setProgress] = useState(0);
    
    const workerRef = useRef<Worker | null>(null);

    // Обновляем список, когда приходят новые данные с бэкенда/мока
    useEffect(() => {
        setOrbits(initialItems.map(item => ({ ...item, score: 0, isVisible: true })));
        
        // Переинициализируем воркер с новыми описаниями
        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'init', data: initialItems });
        }
    }, [initialItems]);

    useEffect(() => {
        if (!workerRef.current) {
            workerRef.current = new Worker(new URL('../workers/search.worker.ts', import.meta.url), { type: 'module' });
            
            workerRef.current.onmessage = (e) => {
                const { type, data } = e.data;

                switch (type) {
                    case 'progress':
                        if (data.status === 'progress') setProgress(data.progress);
                        else if (data.status === 'ready') setReady(true);
                        break;
                    case 'text_embeddings_ready':
                        setOrbits(prev => prev.map(item => ({ ...item, embedding: data[item.id] })));
                        setReady(true);
                        break;
                    case 'image_embedding_ready':
                        setImageEmbedding(data);
                        break;
                }
            };
        }

        // ВАЖНО: Инициализируем воркер ТОЛЬКО если есть данные
        if (initialItems.length > 0 && !ready) {
             workerRef.current.postMessage({ type: 'init', data: initialItems });
        }

        // Очистка при размонтировании
        return () => {
            if (workerRef.current && initialItems.length === 0) {
                 workerRef.current.terminate();
                 workerRef.current = null;
            }
        };
    }, [initialItems, ready]); // <-- ВАЖНО: Добавляем initialItems в зависимости!

    // Логика CLIP: Сходство + Порог + TopK
    useEffect(() => {
        if (!imageEmbedding) return;
        setOrbits(prevItems => {
            if (!prevItems[0]?.embedding) return prevItems;

            // ТРЕБОВАНИЯ: Порог и максимальное кол-во результатов
            const THRESHOLD = 0.45; // Порог косинусного сходства
            const TOP_K = 4;        // Максимум 4 результата

            let processed = prevItems.map(item => {
                const similarity = item.embedding ? cosineSimilarity(imageEmbedding, item.embedding) : 0;
                return {
                    ...item,
                    score: similarity,
                    isVisible: similarity > THRESHOLD // Скрываем те, что ниже порога
                };
            });

            // Сортировка по убыванию совпадения
            processed.sort((a, b) => b.score - a.score);
            
            // Оставляем только TopK (обрезаем массив)
            return processed.slice(0, TOP_K);
        });
    }, [imageEmbedding]);

    const searchByImage = (file: File) => {
        workerRef.current?.postMessage({ type: 'image', data: file });
    }
    
    const resetSearch = () => {
        setImageEmbedding(null);
        setOrbits(initialItems.map(item => ({ ...item, score: 0, isVisible: true })));
    };

    return { orbits, ready, progress, searchByImage, resetSearch };
};