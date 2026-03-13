import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:4000/api/admin';

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
}

// ─── Films (logique originale inchangée) ─────────────────────────────────────

export function useModeration() {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', status: '' });

    const fetchFilms = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(filters).toString();
            const res = await fetch(`${API_BASE}/videos?${query}`, {
                headers: authHeaders()
            });
            const data = await res.json();
            setFilms(data.films || []);
        } catch (err) {
            console.error("Erreur chargement films", err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await fetch(`${API_BASE}/videos/${id}/status`, {
                method: 'PATCH',
                headers: authHeaders(),
                body: JSON.stringify({ status: newStatus })
            });
            setFilms(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
        } catch (err) {
            console.error("Erreur update", err);
        }
    };

    useEffect(() => {
        fetchFilms();
    }, [filters]);

    return { films, loading, filters, setFilters, updateStatus, refresh: fetchFilms };
}

// ─── Assignation (nouveaux fetch) ─────────────────────────────────────────────

export function useAssignation() {
    const [juries, setJuries] = useState([]);
    const [videos, setVideos] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/assignations/data`, {
                headers: authHeaders()
            });
            if (!res.ok) throw new Error('Erreur chargement assignations');
            const data = await res.json();
            setJuries(data.juries ?? []);
            setVideos(data.videos ?? []);
            setStats(data.stats ?? null);
        } catch (err) {
            console.error("Erreur assignation data", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const assignManual = async ({ juryIds, videoIds }) => {
        const res = await fetch(`${API_BASE}/assignations/manual`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ juryIds, videoIds })
        });
        if (!res.ok) throw new Error((await res.json()).message || 'Erreur assignation manuelle');
        const data = await res.json();
        await fetchData(); // refresh stats
        return data;
    };

    const assignRandom = async ({ juryIds, limit, classification }) => {
        const res = await fetch(`${API_BASE}/assignations/random`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ juryIds, limit, classification })
        });
        if (!res.ok) throw new Error((await res.json()).message || 'Erreur tirage aléatoire');
        const data = await res.json();
        await fetchData(); // refresh stats
        return data;
    };

    return { juries, videos, stats, loading, error, fetchData, assignManual, assignRandom };
}