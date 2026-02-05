import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RatingModal = ({
    isOpen,
    onClose,
    videoData,
    initialRating = 0,
    onSave
}) => {
    const { t } = useTranslation();
    const [rating, setRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    const activeRating = hoverRating || rating;

    useEffect(() => {
        setRating(initialRating);
    }, [initialRating, isOpen]);

    const handleSave = async () => {
        if (rating === 0) {
            alert(t('ratingModal.alertNoRating'));
            return;
        }

        setIsSaving(true);
        try {
            await onSave(rating);
            onClose();
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full sm:max-w-lg bg-gradient-to-b from-gray-900 to-black border-t sm:border border-purple-500/30 sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gray-900/95 backdrop-blur-lg border-b border-white/10 p-4 flex items-center justify-between z-10">
                    <h3 className="text-white font-bold text-lg">{t('ratingModal.title')}</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-6">
                    {/* Info vidéo */}
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-white font-semibold text-sm">{videoData?.title || t('ratingModal.noTitle')}</p>
                        {videoData?.author && (
                            <p className="text-gray-400 text-xs mt-1">{t('ratingModal.by', { author: videoData.author })}</p>
                        )}
                    </div>

                    {/* Notation 1-10 */}
                    <div className="space-y-4">
                        <label className="block text-white font-semibold text-base text-center">
                            {t('ratingModal.assignRating')} <span className="text-red-400">*</span>
                        </label>
                        <div className="flex items-center justify-between gap-1 sm:gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className={`flex-1 aspect-square max-w-[45px] rounded-xl flex items-center justify-center text-base sm:text-xl font-bold transition-all ${
                                        activeRating >= star
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50 scale-110'
                                            : 'bg-white/10 text-gray-500 hover:bg-white/20 hover:scale-105'
                                    }`}
                                >
                                    {star}
                                </button>
                            ))}
                        </div>
                        <p className="text-center text-base pt-2">
                            {rating > 0 ? (
                                <span className="text-purple-400 font-bold text-xl">{rating}/10</span>
                            ) : (
                                <span className="text-gray-500">{t('ratingModal.selectRating')}</span>
                            )}
                        </p>
                    </div>

                    {/* Info */}
                    <div className="flex items-start gap-2 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p className="text-xs text-purple-300">
                            {t('ratingModal.ratingInfo')}
                        </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-lg border-t border-white/10 p-4 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
                    >
                        {t('ratingModal.cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || rating === 0}
                        className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                    >
                        {isSaving ? t('ratingModal.saving') : t('ratingModal.validate')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;
