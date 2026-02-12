import { useState, useEffect } from 'react';

export function useModeration() {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', status: '' });

    // Charger les films
    const fetchFilms = async () => {
        setLoading(true);
        try {
            // Remplace par ton URL réelle
            const query = new URLSearchParams(filters).toString();
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/admin/videos?${query}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setFilms(data.films || []);
        } catch (err) {
            console.error("Erreur chargement films", err);
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un statut
    const updateStatus = async (id, newStatus) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/admin/videos/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            
            // Mise à jour optimiste de l'UI
            setFilms(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
        } catch (err) {
            console.error("Erreur update", err);
        }
    };

    // Recharger quand les filtres changent
    useEffect(() => {
        fetchFilms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    return { films, loading, filters, setFilters, updateStatus, refresh: fetchFilms };
}