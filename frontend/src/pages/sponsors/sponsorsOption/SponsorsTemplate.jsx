import { API_URL } from '../../../config';

function SponsorsTemplate({ img, url }) {
    const resolvedImg = img?.startsWith('/') ? `${API_URL}${img}` : img;
    const resolvedUrl = url
        ? /^https?:\/\//i.test(url.trim())
            ? url.trim()
            : `https://${url.trim()}`
        : '';

    return (
       <section id="sponsors-template" className="h-full">
        <div className="group relative h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)] flex items-center justify-center">
            
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

            <div className="relative z-10 w-full h-32 flex items-center justify-center overflow-hidden">
                {resolvedUrl ? (
                    <a href={resolvedUrl} target="_blank" rel="noreferrer" className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                        <img
                            src={resolvedImg}
                            alt="Sponsor"
                            className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                        />
                    </a>
                ) : (
                    <div className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                        <img
                            src={resolvedImg}
                            alt="Sponsor"
                            className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                        />
                    </div>
                )}
            </div>
        </div>
       </section>
    )
}

export default SponsorsTemplate;