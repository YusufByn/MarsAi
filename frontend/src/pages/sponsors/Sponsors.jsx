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
            const typeCode = Number(sponsor.is_active ?? 0);
            const key = Number.isFinite(typeCode) ? typeCode : 0;
            if (!groups[key]) {
                groups[key] = { typeCode: key, typeName: '', sponsors: [] };
            }
            const labelCandidate = typeof sponsor.name === 'string' ? sponsor.name.trim() : '';
            if (!groups[key].typeName && labelCandidate) {
                groups[key].typeName = labelCandidate;
            }
            groups[key].sponsors.push(sponsor);
        });
        return Object.values(groups).sort((a, b) => a.typeCode - b.typeCode);
    }, [sponsors]);

    if (loading) {
        return <section className="py-6 text-center text-white/60">Chargement des sponsors...</section>;
    }

    if (error) {
        return <section className="py-6 text-center text-red-400">Impossible de charger les sponsors.</section>;
    }

    return (
        <div className="space-y-10">
            {groupedSponsors.map(({ typeCode, typeName, sponsors: typeSponsors }) => (
                <section key={typeCode} className="space-y-4">
                    <h1 className="text-2xl font-bold text-white">
                        {typeName || `Type ${typeCode}`}
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {typeSponsors.map((sponsor) => (
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