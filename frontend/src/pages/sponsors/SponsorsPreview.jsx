import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SponsorsTemplate from './sponsorsOption/SponsorsTemplate';
import { API_URL } from '../../config';

const PREVIEW_LIMIT = 6;
const MAX_TYPE_CODE = 255;

const toTypeCode = (value, fallback = 0) => {
    const raw = Number(value);
    if (!Number.isFinite(raw)) return fallback;
    const normalized = Math.trunc(raw);
    if (normalized < 0) return 0;
    if (normalized > MAX_TYPE_CODE) return MAX_TYPE_CODE;
    return normalized;
};

function SponsorsPreview() {
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
            } catch (fetchError) {
                setError(fetchError);
            } finally {
                setLoading(false);
            }
        };

        fetchSponsors();
    }, []);

    const topType = useMemo(() => {
        const groups = {};

        sponsors.forEach((sponsor) => {
            const key = toTypeCode(sponsor.is_active, 0);
            if (!groups[key]) {
                groups[key] = { typeCode: key, typeName: '', sponsors: [] };
            }

            const labelCandidate = typeof sponsor.type_name === 'string' && sponsor.type_name.trim()
                ? sponsor.type_name.trim()
                : (typeof sponsor.name === 'string' ? sponsor.name.trim() : '');

            if (!groups[key].typeName && labelCandidate) {
                groups[key].typeName = labelCandidate;
            }

            groups[key].sponsors.push(sponsor);
        });

        const groupedSponsors = Object.values(groups).sort((a, b) => {
            if (a.typeCode === 0 && b.typeCode !== 0) return 1;
            if (b.typeCode === 0 && a.typeCode !== 0) return -1;
            return a.typeCode - b.typeCode;
        });

        return groupedSponsors.find((group) => group.typeCode > 0) || groupedSponsors[0] || null;
    }, [sponsors]);

    if (loading) {
        return <section className="py-6 text-center text-white/60">Chargement des sponsors...</section>;
    }

    if (error) {
        return <section className="py-6 text-center text-red-400">Impossible de charger les sponsors.</section>;
    }

    if (!topType || topType.sponsors.length === 0) {
        return null;
    }

    const previewSponsors = topType.sponsors.slice(0, PREVIEW_LIMIT);
    const hasMore = topType.sponsors.length > PREVIEW_LIMIT;

    return (
        <section className="space-y-4">
            <h1 className="text-2xl font-bold text-white">
                {topType.typeName || `Type ${topType.typeCode}`}
            </h1>

            <div className="relative">
                <div className={`grid gap-4 ${
                    (previewSponsors.length === 2 || previewSponsors.length === 4)
                        ? 'grid-cols-1 sm:grid-cols-2'
                        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                }`}>
                    {previewSponsors.map((sponsor) => (
                        <SponsorsTemplate key={sponsor.id} {...sponsor} />
                    ))}
                </div>

                {hasMore && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent via-[#0b1220]/70 to-[#0b1220]" />
                )}
            </div>

            <div className="flex flex-col items-center gap-3 pt-2 text-center">
                <p className="text-white/85 font-medium">Voulez-vous devenir partenaire ?</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                        to="/sponsors"
                        className="inline-flex items-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                    >
                        Voir tous les sponsors
                    </Link>
                    <a
                        href="/contact"
                        className="inline-flex items-center rounded-xl border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                        Nous contacter
                    </a>
                </div>
            </div>
        </section>
    );
}

export default SponsorsPreview;
