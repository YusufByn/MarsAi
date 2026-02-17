import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ActionButtons = ({
    currentStatus = 'no',
    onStatusClick,
    onNoteClick,
    onEmailClick,
    rating = 0,
    isMuted = true,
    volume = 0.5,
    onToggleMute,
    onVolumeChange,
    videoId,
}) => {
    const navigate = useNavigate();
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

    // Icone son selon l'etat
    const SoundIcon = ({ className }) => {
        if (isMuted || volume === 0) {
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
            );
        }
        if (volume < 0.5) {
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072" />
                </svg>
            );
        }
        return (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728" />
            </svg>
        );
    };

    return (
        <>
            {/* Desktop : Boutons en bas au centre */}
            <div className="hidden md:block absolute bottom-0 left-0 right-0 z-30 pb-safe">
                {/* Gradient pour meilleure visibilite */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none"
                     style={{ height: '200px', bottom: 0 }}
                />

                {/* Container des boutons en ligne (desktop) */}
                <div className="relative flex items-center justify-center gap-3 sm:gap-4 px-4 pb-6 pt-2">
                    {/* Bouton NON */}
                    <button
                        onClick={() => onStatusClick('no')}
                        className={`action-btn group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl ${
                            currentStatus === 'no'
                                ? 'bg-red-500 scale-110 ring-4 ring-red-500/50'
                                : 'bg-white/10 backdrop-blur-md hover:bg-red-500/30 hover:scale-105'
                        }`}
                    >
                        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white text-[10px] font-medium whitespace-nowrap opacity-70">
                            Non
                        </div>
                    </button>

                    {/* Bouton A DISCUTER */}
                    <button
                        onClick={() => onStatusClick('discuss')}
                        className={`action-btn group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl ${
                            currentStatus === 'discuss'
                                ? 'bg-amber-500 scale-110 ring-4 ring-amber-500/50'
                                : 'bg-white/10 backdrop-blur-md hover:bg-amber-500/30 hover:scale-105'
                        }`}
                    >
                        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white text-[10px] font-medium whitespace-nowrap opacity-70">
                            Discuter
                        </div>
                    </button>

                    {/* Bouton OUI au centre */}
                    <button
                        onClick={() => onStatusClick('yes')}
                        className={`action-btn group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl ${
                            currentStatus === 'yes'
                                ? 'bg-green-500 scale-110 ring-4 ring-green-500/50'
                                : 'bg-white/10 backdrop-blur-md hover:bg-green-500/30 hover:scale-105'
                        }`}
                    >
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {rating > 0 && (
                            <div className="absolute -top-1 -right-1 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-black shadow-lg">
                                {rating}
                            </div>
                        )}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white text-[10px] font-medium whitespace-nowrap opacity-70">
                            Oui + Note
                        </div>
                    </button>

                    {/* Bouton NOTE RAPIDE */}
                    <button
                        onClick={onNoteClick}
                        className="action-btn group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-md hover:bg-purple-500/30 hover:scale-105 hover:ring-4 hover:ring-purple-500/50 flex items-center justify-center transition-all active:scale-90 shadow-2xl"
                    >
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white text-[10px] font-medium whitespace-nowrap opacity-70">
                            Note
                        </div>
                    </button>

                    {/* Bouton EMAIL */}
                    <button
                        onClick={onEmailClick}
                        className="action-btn group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-md hover:bg-blue-500/30 hover:scale-105 hover:ring-4 hover:ring-blue-500/50 flex items-center justify-center transition-all active:scale-90 shadow-2xl"
                    >
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white text-[10px] font-medium whitespace-nowrap opacity-70">
                            Email
                        </div>
                    </button>

                    {/* Bouton SON + Slider volume (desktop) */}
                    <div
                        className="relative"
                        onMouseEnter={() => setShowVolumeSlider(true)}
                        onMouseLeave={() => setShowVolumeSlider(false)}
                    >
                        <button
                            onClick={onToggleMute}
                            className="action-btn group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-md hover:bg-cyan-500/30 hover:scale-105 hover:ring-4 hover:ring-cyan-500/50 flex items-center justify-center transition-all active:scale-90 shadow-2xl"
                        >
                            <SoundIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white text-[10px] font-medium whitespace-nowrap opacity-70">
                                Son
                            </div>
                        </button>

                        {/* Slider volume vertical au hover (desktop) */}
                        {showVolumeSlider && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 pb-2">
                                <div className="p-3 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-white text-xs font-bold">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.05"
                                            value={isMuted ? 0 : volume}
                                            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                                            className="appearance-none bg-transparent cursor-pointer"
                                            style={{
                                                writingMode: 'vertical-lr',
                                                direction: 'rtl',
                                                height: '100px',
                                                width: '20px',
                                                accentColor: '#06b6d4',
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bouton DETAILS VIDEO (desktop uniquement) */}
                    <button
                        onClick={() => navigate(`/videoDetails/${videoId}`)}
                        className="action-btn group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-105 hover:ring-4 hover:ring-white/30 flex items-center justify-center transition-all active:scale-90 shadow-2xl"
                    >
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white text-[10px] font-medium whitespace-nowrap opacity-70">
                            Details
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile : Boutons sur le cote droit style TikTok */}
            <div className="md:hidden absolute right-2 bottom-14 z-30 flex flex-col gap-2.5 items-center">
                {/* Bouton OUI */}
                <button
                    onClick={() => onStatusClick('yes')}
                    className={`action-btn relative w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg ${
                        currentStatus === 'yes'
                            ? 'bg-green-500 scale-110 ring-2 ring-green-500/50'
                            : 'bg-white/10 backdrop-blur-md'
                    }`}
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {rating > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold border border-black">
                            {rating}
                        </div>
                    )}
                </button>

                {/* Bouton A DISCUTER */}
                <button
                    onClick={() => onStatusClick('discuss')}
                    className={`action-btn w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg ${
                        currentStatus === 'discuss'
                            ? 'bg-amber-500 scale-110 ring-2 ring-amber-500/50'
                            : 'bg-white/10 backdrop-blur-md'
                    }`}
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </button>

                {/* Bouton NON */}
                <button
                    onClick={() => onStatusClick('no')}
                    className={`action-btn w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg ${
                        currentStatus === 'no'
                            ? 'bg-red-500 scale-110 ring-2 ring-red-500/50'
                            : 'bg-white/10 backdrop-blur-md'
                    }`}
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Bouton NOTE RAPIDE */}
                <button
                    onClick={onNoteClick}
                    className="action-btn w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-all active:scale-90 shadow-lg"
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>

                {/* Bouton EMAIL */}
                <button
                    onClick={onEmailClick}
                    className="action-btn w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-all active:scale-90 shadow-lg"
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </button>

            </div>
        </>
    );
};

export default ActionButtons;
