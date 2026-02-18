import React from 'react';
import { useEffect, useState } from 'react';
import SponsorsTemplate from './sponsorsOption/SponsorsTemplate';
import { API_URL } from '../../config';

function Sponsors() {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const response = await fetch(`${API_URL}/api/sponsors`);
                if (!response.ok) {
                    throw new Error('Failed to fetch sponsors');
                }
                const data = await response.json();
                setSponsors(data.data || []);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);  
            }
        }
        fetchSponsors();
    }, []);

    if (loading) {
        return <section className="py-6 text-center text-white/60">Chargement des sponsors...</section>;
    }

    if (error) {
        return <section className="py-6 text-center text-red-400">Impossible de charger les sponsors.</section>;
    }

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sponsors.map((sponsor) => (
                <SponsorsTemplate
                    key={sponsor.id}
                    {...sponsor}
                />
            ))}
        </section>
    );
}

export default Sponsors;