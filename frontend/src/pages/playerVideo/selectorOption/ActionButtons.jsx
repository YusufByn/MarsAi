import React from 'react';

const ActionButtons = ({ 
    currentStatus = 'no',
    onStatusClick,
    onNoteClick,
    onEmailClick,
    rating = 0
}) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
            {/* Gradient pour meilleure visibilité */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" 
                 style={{ height: '150px', bottom: 0 }} 
            />
            
            {/* Container des boutons */}
            <div className="relative flex items-center justify-center gap-3 sm:gap-4 px-4 pb-6 pt-8">
                {/* Bouton NON */}
                <button
                    onClick={() => onStatusClick('no')}
                    className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl ${
                        currentStatus === 'no'
                            ? 'bg-red-500 scale-110'
                            : 'bg-white/10 backdrop-blur-md hover:bg-red-500/30 hover:scale-105'
                    }`}
                >
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Non
                    </div>
                </button>

                {/* Bouton À DISCUTER */}
                <button
                    onClick={() => onStatusClick('discuss')}
                    className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl ${
                        currentStatus === 'discuss'
                            ? 'bg-amber-500 scale-110'
                            : 'bg-white/10 backdrop-blur-md hover:bg-amber-500/30 hover:scale-105'
                    }`}
                >
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        A discuter
                    </div>
                </button>

                {/* Bouton OUI (plus grand au centre) */}
                <button
                    onClick={() => onStatusClick('yes')}
                    className={`group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl ${
                        currentStatus === 'yes'
                            ? 'bg-green-500 scale-110'
                            : 'bg-white/10 backdrop-blur-md hover:bg-green-500/30 hover:scale-105'
                    }`}
                >
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    
                    {/* Badge notation si présente */}
                    {rating > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-black">
                            {rating}
                        </div>
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Oui - Noter
                    </div>
                </button>

                {/* Bouton NOTE RAPIDE */}
                <button
                    onClick={onNoteClick}
                    className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-md hover:bg-purple-500/30 hover:scale-105 flex items-center justify-center transition-all active:scale-90 shadow-2xl"
                >
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Note rapide
                    </div>
                </button>

                {/* Bouton EMAIL */}
                <button
                    onClick={onEmailClick}
                    className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-md hover:bg-blue-500/30 hover:scale-105 flex items-center justify-center transition-all active:scale-90 shadow-2xl"
                >
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Email realisateur
                    </div>
                </button>
            </div>
        </div>
    );
};

export default ActionButtons;
