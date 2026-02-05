// ici il y aura tout le code concernant le rating de la video par les jurys

import React, { useMemo, useState } from 'react';

const RatingSelector = ({
    initialRating = 0,
    initialStatus = 'no',
    onRatingChange,
    onStatusChange,
}) => {
    const [rating, setRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0);
    const [statut, setStatut] = useState(initialStatus);

    const stars = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], []);
    const activeRating = hoverRating || rating;

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        if (onRatingChange) {
            onRatingChange(newRating);
        }
    };

    const handleHoverRating = (newHoverRating) => {
        setHoverRating(newHoverRating);
    };

    const handleStatusChange = (nextStatus) => {
        setStatut(nextStatus);
        if (nextStatus === 'no') {
            setRating(0);
            if (onRatingChange) {
                onRatingChange(0);
            }
        }
        if (onStatusChange) {
            onStatusChange(nextStatus);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Decision du selector</span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleStatusChange('yes')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                            statut === 'yes'
                                ? 'bg-green-500/20 text-green-300 border-green-500/40'
                                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                        }`}
                    >
                        Oui
                    </button>
                    <button
                        type="button"
                        onClick={() => handleStatusChange('discuss')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                            statut === 'discuss'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                        }`}
                    >
                        A discuter
                    </button>
                    <button
                        type="button"
                        onClick={() => handleStatusChange('no')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                            statut === 'no'
                                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                        }`}
                    >
                        Non
                    </button>
                </div>
            </div>

            <div
                className={`flex items-center gap-2 ${
                    statut === 'no' ? 'opacity-40 pointer-events-none' : ''
                }`}
            >
                {stars.map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        onMouseEnter={() => handleHoverRating(star)}
                        onMouseLeave={() => handleHoverRating(0)}
                        className={`text-2xl transition-colors ${
                            activeRating >= star ? 'text-amber-400' : 'text-gray-600'
                        }`}
                        aria-label={`Noter ${star} sur 10`}
                    >
                        ★
                    </button>
                ))}
                <span className="text-sm text-gray-400 ml-2">
                    {rating > 0 ? `${rating}/10` : 'Pas de note'}
                </span>
            </div>
        </div>
    );
};

export default RatingSelector;
