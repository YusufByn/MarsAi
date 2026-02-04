import React, { useState, useEffect } from 'react';

const QuickNotePanel = ({ 
    isOpen, 
    onClose, 
    videoData,
    initialNote = '',
    onSave 
}) => {
    const [note, setNote] = useState(initialNote);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setNote(initialNote);
    }, [initialNote, isOpen]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(note);
            onClose();
        } catch (error) {
            console.error('Erreur sauvegarde note:', error);
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

            {/* Panel */}
            <div 
                className="relative w-full sm:max-w-lg bg-gradient-to-b from-gray-900 to-black border-t sm:border border-purple-500/30 sm:rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gray-900/95 backdrop-blur-lg border-b border-white/10 p-4 flex items-center justify-between z-10">
                    <div>
                        <h3 className="text-white font-bold text-lg">Note rapide</h3>
                        <p className="text-gray-400 text-xs mt-0.5">Visible uniquement par vous</p>
                    </div>
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
                <div className="p-4 sm:p-6 space-y-4">
                    {/* Info vidéo */}
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-white font-semibold text-sm">{videoData?.title || 'Sans titre'}</p>
                        {videoData?.author && (
                            <p className="text-gray-400 text-xs mt-1">Par {videoData.author}</p>
                        )}
                    </div>

                    {/* Textarea */}
                    <div className="space-y-2">
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Vos observations sur cette video..."
                            rows={8}
                            autoFocus
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                        />
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{note.length} caracteres</span>
                            <span>Sauvegarde automatique</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-lg border-t border-white/10 p-4 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                    >
                        {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickNotePanel;
