import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const KeyboardShortcuts = () => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    return (
        <>
            {/* Bouton aide raccourcis - coin supérieur droit */}
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="fixed top-20 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center transition-all shadow-lg group"
            >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>

                {/* Tooltip */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {t('shortcuts.title')}
                </div>
            </button>

            {/* Panel des raccourcis */}
            {isVisible && (
                <div
                    className="fixed inset-0 z-[90] flex items-start justify-end p-4 pt-32"
                    onClick={() => setIsVisible(false)}
                >
                    {/* Backdrop transparent */}
                    <div className="absolute inset-0" />

                    {/* Panel */}
                    <div
                        className="relative bg-gradient-to-b from-gray-900 to-black border border-white/20 rounded-2xl shadow-2xl p-5 w-full max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                            <h3 className="text-white font-bold text-lg">{t('shortcuts.title')}</h3>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                            </button>
                        </div>

                        {/* Liste des raccourcis */}
                        <div className="space-y-3">
                            {/* Oui */}
                            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <span className="text-white text-sm">{t('shortcuts.yesRate')}</span>
                                <kbd className="px-3 py-1.5 bg-white/10 border border-white/20 rounded text-white text-xs font-mono">
                                    Y
                                </kbd>
                            </div>

                            {/* Non */}
                            <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <span className="text-white text-sm">{t('shortcuts.no')}</span>
                                <kbd className="px-3 py-1.5 bg-white/10 border border-white/20 rounded text-white text-xs font-mono">
                                    {t('shortcuts.delete')}
                                </kbd>
                            </div>

                            {/* À discuter */}
                            <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                <span className="text-white text-sm">{t('shortcuts.discuss')}</span>
                                <kbd className="px-3 py-1.5 bg-white/10 border border-white/20 rounded text-white text-xs font-mono">
                                    →
                                </kbd>
                            </div>

                            {/* Note rapide */}
                            <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                <span className="text-white text-sm">{t('shortcuts.quickNote')}</span>
                                <div className="flex items-center gap-1">
                                    <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs font-mono">
                                        Tab
                                    </kbd>
                                    <span className="text-white text-xs">+</span>
                                    <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs font-mono">
                                        Enter
                                    </kbd>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <span className="text-white text-sm">{t('shortcuts.email')}</span>
                                <div className="flex items-center gap-1">
                                    <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs font-mono">
                                        Tab
                                    </kbd>
                                    <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs font-mono">
                                        Tab
                                    </kbd>
                                    <span className="text-white text-xs">+</span>
                                    <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs font-mono">
                                        Enter
                                    </kbd>
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="mt-4 p-3 bg-white/5 rounded-lg">
                            <p className="text-xs text-gray-400 text-center">
                                {t('shortcuts.disabledInModals')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default KeyboardShortcuts;
