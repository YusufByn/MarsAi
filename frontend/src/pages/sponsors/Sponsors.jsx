import React from 'react';
import { useEffect, useMemo, useState } from 'react';
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

    const groupedSponsors = useMemo(() => {
        const groups = {};
        sponsors.forEach((sponsor) => {
            const section = sponsor.section?.trim() || 'general';
            if (!groups[section]) {
                groups[section] = [];
            }
            groups[section].push(sponsor);
        });
        return Object.entries(groups);
    }, [sponsors]);

    if (loading) {
        return <section className="py-6 text-center text-white/60">Chargement des sponsors...</section>;
    }

    if (error) {
        return <section className="py-6 text-center text-red-400">Impossible de charger les sponsors.</section>;
    }

    return (
        <div className="space-y-10">
            {groupedSponsors.map(([section, sectionSponsors]) => (
                <section key={section} className="space-y-4">
                    <h1 className="text-2xl font-bold text-white capitalize">{section}</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {sectionSponsors.map((sponsor) => (
                            <SponsorsTemplate
                                key={sponsor.id}
                                {...sponsor}
                            />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}

export default Sponsors;