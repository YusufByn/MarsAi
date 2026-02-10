import React from 'react';
import { useTranslation } from 'react-i18next';

const ActionButtons = ({
    currentStatus = 'no',
    onStatusClick,
    onNoteClick,
    onEmailClick,
    rating = 0
}) => {
    const { t } = useTranslation();

    // Log pour debug
    console.log('[ActionButtons] Rendered with status:', currentStatus, 'rating:', rating);

    return (
        <>
            {/* Desktop : Boutons en bas au centre */}
            <div className="hidden md:block absolute bottom-0 left-0 right-0 z-30 pb-safe">
                {/* Gradient pour meilleure visibilité */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none"
                     style={{ height: '200px', bottom: 0 }}
                />

                {/* Indicateur d'état permanent au-dessus des boutons */}
                <div className="relative flex items-center justify-center pb-2">
                    <div className={`px-4 py-2 rounded-full backdrop-blur-md text-sm font-semibold transition-all ${
                        currentStatus === 'yes' ? 'bg-green-500/90 text-white' :
                        currentStatus === 'discuss' ? 'bg-amber-500/90 text-white' :
                        currentStatus === 'no' ? 'bg-red-500/70 text-white' :
                        'bg-white/20 text-white'
                    }`}>
                        {currentStatus === 'yes' ? (
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {t('actionButtons.selected')} {rating > 0 && `(${rating}/10)`}
                            </span>
                        ) : currentStatus === 'discuss' ? (
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                </svg>
                                {t('actionButtons.toDiscuss')}
                            </span>
                        ) : currentStatus === 'no' ? (
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                {t('actionButtons.rejected')}
                            </span>
                        ) : (
                            t('actionButtons.notRated')
                        )}
                    </div>
                </div>

                {/* Container des boutons en ligne (desktop) */}
                <div className="relative flex items-center justify-center gap-3 sm:gap-4 px-4 pb-6 pt-2">
                {/* Bouton NON */}
                <button
                    onClick={() => onStatusClick('no')}
                    className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl ${
                        currentStatus === 'no'
                            ? 'bg-red-500 scale-110 ring-4 ring-red-500/50'
                            : 'bg-white/10 backdrop-blur-md hover:bg-red-500/30 hover:scale-105'
                    }`}
                >
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>

                    {/* Label permanent sous le bouton */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white text-[10px] font-medium whitespace-nowrap opacity-70">
                        Non
                    </div>
                </button>

                {/* Bouton À DISCUTER */}
                <button
                    onClick={() => onStatusClick('discuss')}
                    className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl ${
                        currentStatus === 'discuss'
                            ? 'bg-amber-500 scale-110 ring-4 ring-amber-500/50'
                            : 'bg-white/10 backdrop-blur-md hover:bg-amber-500/30 hover:scale-105'
                    }`}
                >
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>

                    {/* Label permanent sous le bouton */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white text-[10px] font-medium whitespace-nowrap opacity-70">
                        Discuter
                    </div>
                </button>

                {/* Bouton OUI au centre pour faciliter la selection */}
                <button
                    onClick={() => onStatusClick('yes')}
                    className={`group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl ${
                        currentStatus === 'yes'
                            ? 'bg-green-500 scale-110 ring-4 ring-green-500/50'
                            : 'bg-white/10 backdrop-blur-md hover:bg-green-500/30 hover:scale-105'
                    }`}
                >
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>

                    {/* pop up de notation si le bouton oui est cliqué */}
                    {rating > 0 && (
                        <div className="absolute -top-1 -right-1 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-black shadow-lg">
                            {rating}
                        </div>
                    )}

                    {/* Label permanent sous le bouton */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white text-[10px] font-medium whitespace-nowrap opacity-70">
                        Oui + Note
                    </div>
                </button>

                {/* Bouton NOTE RAPIDE */}
                <button
                    onClick={onNoteClick}
                    className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-md hover:bg-purple-500/30 hover:scale-105 hover:ring-4 hover:ring-purple-500/50 flex items-center justify-center transition-all active:scale-90 shadow-2xl"
                >
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>

                    {/* Label permanent sous le bouton */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white text-[10px] font-medium whitespace-nowrap opacity-70">
                        Note
                    </div>
                </button>

                {/* Bouton EMAIL */}
                <button
                    onClick={onEmailClick}
                    className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-md hover:bg-blue-500/30 hover:scale-105 hover:ring-4 hover:ring-blue-500/50 flex items-center justify-center transition-all active:scale-90 shadow-2xl"
                >
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>

                    {/* Label permanent sous le bouton */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white text-[10px] font-medium whitespace-nowrap opacity-70">
                        Email
                    </div>
                </button>
            </div>
        </div>

        {/* Mobile : Boutons sur le cote droit style TikTok */}
        <div className="md:hidden absolute right-4 bottom-20 z-30 flex flex-col gap-4 items-center">
            {/* Indicateur d'état en haut des boutons mobiles */}
            <div className={`px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-semibold transition-all ${
                currentStatus === 'yes' ? 'bg-green-500/90 text-white' :
                currentStatus === 'discuss' ? 'bg-amber-500/90 text-white' :
                currentStatus === 'no' ? 'bg-red-500/70 text-white' :
                'bg-white/20 text-white'
            }`}>
                {currentStatus === 'yes' ? (
                    <span>{rating > 0 ? `${rating}/10` : '✓'}</span>
                ) : currentStatus === 'discuss' ? (
                    <span>💬</span>
                ) : currentStatus === 'no' ? (
                    <span>✕</span>
                ) : (
                    <span>?</span>
                )}
            </div>

            {/* Bouton OUI */}
            <button
                onClick={() => onStatusClick('yes')}
                className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl ${
                    currentStatus === 'yes'
                        ? 'bg-green-500 scale-110 ring-4 ring-green-500/50'
                        : 'bg-white/10 backdrop-blur-md'
                }`}
            >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {rating > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-black">
                        {rating}
                    </div>
                )}
            </button>

            {/* Bouton À DISCUTER */}
            <button
                onClick={() => onStatusClick('discuss')}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl ${
                    currentStatus === 'discuss'
                        ? 'bg-amber-500 scale-110 ring-4 ring-amber-500/50'
                        : 'bg-white/10 backdrop-blur-md'
                }`}
            >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            </button>

            {/* Bouton NON */}
            <button
                onClick={() => onStatusClick('no')}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl ${
                    currentStatus === 'no'
                        ? 'bg-red-500 scale-110 ring-4 ring-red-500/50'
                        : 'bg-white/10 backdrop-blur-md'
                }`}
            >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Bouton NOTE RAPIDE */}
            <button
                onClick={onNoteClick}
                className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-all active:scale-90 shadow-2xl"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </button>

            {/* Bouton EMAIL */}
            <button
                onClick={onEmailClick}
                className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-all active:scale-90 shadow-2xl"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </button>
        </div>
        </>
    );
};

export default ActionButtons;
