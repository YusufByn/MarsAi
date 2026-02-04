import React, { useState } from 'react';

const RatingSelector = ({
    initialStatus = 'no',
    onStatusChange,
    onYesClick,
}) => {
    const [statut, setStatut] = useState(initialStatus);

    const handleStatusChange = (nextStatus) => {
        setStatut(nextStatus);
        if (onStatusChange) {
            onStatusChange(nextStatus);
        }
        
        // Si "Oui" est cliqué, ouvrir le modal de notation
        if (nextStatus === 'yes' && onYesClick) {
            onYesClick();
        }
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Bouton NON */}
            <button
                type="button"
                onClick={() => handleStatusChange('no')}
                className={`w-full py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all ${
                    statut === 'no'
                        ? 'bg-red-500/30 text-red-200 border-red-500/60 shadow-lg shadow-red-500/20'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:border-red-500/40 hover:bg-red-500/10'
                }`}
            >
                Non selectionne
            </button>

            {/* Bouton À DISCUTER */}
            <button
                type="button"
                onClick={() => handleStatusChange('discuss')}
                className={`w-full py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all ${
                    statut === 'discuss'
                        ? 'bg-amber-500/30 text-amber-200 border-amber-500/60 shadow-lg shadow-amber-500/20'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:border-amber-500/40 hover:bg-amber-500/10'
                }`}
            >
                A discuter
            </button>

            {/* Bouton OUI */}
            <button
                type="button"
                onClick={() => handleStatusChange('yes')}
                className={`w-full py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all ${
                    statut === 'yes'
                        ? 'bg-green-500/30 text-green-200 border-green-500/60 shadow-lg shadow-green-500/20'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:border-green-500/40 hover:bg-green-500/10'
                }`}
            >
                Oui - Noter
            </button>
        </div>
    );
};

export default RatingSelector;
