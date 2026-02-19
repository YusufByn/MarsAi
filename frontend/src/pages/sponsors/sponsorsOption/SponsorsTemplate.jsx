import { API_URL } from '../../../config';

function SponsorsTemplate({ img, url }) {
    const resolvedImg = img?.startsWith('/') ? `${API_URL}${img}` : img;
    const resolvedUrl = url
        ? /^https?:\/\//i.test(url.trim())
            ? url.trim()
            : `https://${url.trim()}`
        : '';

    return (
       <section id="sponsors-template">
        <div className="bg-white border border-white/10 rounded-lg p-4">
            {resolvedUrl ? (
                <a href={resolvedUrl} target="_blank" rel="noreferrer">
                    <img
                    src={resolvedImg}
                    alt="Sponsor"
                    />
                </a>
            ) : (
                <img
                src={resolvedImg}
                alt="Sponsor"
                />
            )}
        </div>
       </section>
    )
}

export default SponsorsTemplate;