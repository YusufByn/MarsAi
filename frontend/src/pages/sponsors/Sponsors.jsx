import React from 'react';
import { useEffect, useState } from 'react';
import SponsorsTemplate from './sponsorsOption/SponsorsTemplate';

function Sponsors() {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const response = await fetch(`${API_URL}/api/cms/homepage`);
            }
        }
    }, []);

    return (
        <section className="grid grid-cols-3 gap-4">
            <SponsorsTemplate />
            <SponsorsTemplate />
            <SponsorsTemplate />
            <SponsorsTemplate />
            <SponsorsTemplate />
            <SponsorsTemplate />
            <SponsorsTemplate />
        </section>
    )
}

export default Sponsors;