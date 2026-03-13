import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config';

// ─── useModeration (original inchangé) ───────────────────────────────────────

export function useModeration() {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', status: '' });

    const fetchFilms = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(filters).toString();
            const res = await fetch(`${API_URL}/api/admin/videos?${query}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            });
            const data = await res.json();
            setFilms(data.films || []);
        } catch (err) {
            console.error("[MODERATION] Erreur chargement films", err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await fetch(`${API_URL}/api/admin/videos/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            setFilms(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
        } catch (err) {
            console.error("[MODERATION] Erreur update", err);
        }
    };

    useEffect(() => {
        fetchFilms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    return { films, loading, filters, setFilters, updateStatus, refresh: fetchFilms };
}

// ─── useAssignation (nouveau) ─────────────────────────────────────────────────

export function useAssignation() {
    const [juries, setJuries] = useState([]);
    const [videos, setVideos] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/assignations/data`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            });
            if (!res.ok) throw new Error('Erreur chargement assignations');
            const data = await res.json();
            setJuries(data.juries ?? []);
            setVideos(data.videos ?? []);
            setStats(data.stats ?? null);
        } catch (err) {
            console.error("[ASSIGNATION] Erreur chargement data", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const assignManual = async ({ juryIds, videoIds }) => {
        const res = await fetch(`${API_URL}/api/admin/assignations/manual`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({ juryIds, videoIds })
        });
        if (!res.ok) throw new Error((await res.json()).message || 'Erreur assignation manuelle');
        const data = await res.json();
        await fetchData();
        return data;
    };

    const assignRandom = async ({ juryIds, limit, classification }) => {
        const res = await fetch(`${API_URL}/api/admin/assignations/random`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({ juryIds, limit, classification })
        });
        if (!res.ok) throw new Error((await res.json()).message || 'Erreur tirage aléatoire');
        const data = await res.json();
        await fetchData();
        return data;
    };

    return { juries, videos, stats, loading, fetchData, assignManual, assignRandom };
}