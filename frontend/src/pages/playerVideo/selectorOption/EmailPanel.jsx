import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const EmailPanel = ({
    isOpen,
    onClose,
    videoData,
    onSend
}) => {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) {
            alert(t('emailPanel.alertNoMessage'));
            return;
        }

        setIsSending(true);
        try {
            await onSend(message);
            setMessage('');
            onClose();
        } catch (error) {
            console.error('Erreur envoi email:', error);
            alert(t('emailPanel.alertSendError'));
        } finally {
            setIsSending(false);
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
                className="relative w-full sm:max-w-lg bg-gradient-to-b from-gray-900 to-black border-t sm:border border-blue-500/30 sm:rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gray-900/95 backdrop-blur-lg border-b border-white/10 p-4 flex items-center justify-between z-10">
                    <div>
                        <h3 className="text-white font-bold text-lg">{t('emailPanel.title')}</h3>
                        <p className="text-gray-400 text-xs mt-0.5">{t('emailPanel.sentDirectly')}</p>
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
                        <p className="text-white font-semibold text-sm">{videoData?.title || t('emailPanel.noTitle')}</p>
                        {videoData?.author && (
                            <p className="text-gray-400 text-xs mt-1">{t('emailPanel.by', { author: videoData.author })}</p>
                        )}
                    </div>

                    {/* Email destinataire */}
                    <div className="space-y-2">
                        <label className="block text-white font-semibold text-sm">
                            {t('emailPanel.recipient')}
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-white text-sm">
                                {videoData?.email || t('emailPanel.noEmail')}
                            </span>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <label className="block text-white font-semibold text-sm">
                            {t('emailPanel.yourMessage')} <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={t('emailPanel.placeholder')}
                            rows={10}
                            autoFocus
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                        />
                        <p className="text-xs text-gray-500 text-right">{message.length} {t('emailPanel.characters')}</p>
                    </div>

                    {/* Warning */}
                    <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p className="text-xs text-blue-300">
                            {t('emailPanel.warning')}
                        </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-lg border-t border-white/10 p-4 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isSending}
                        className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
                    >
                        {t('emailPanel.cancel')}
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={isSending || !message.trim() || !videoData?.email}
                        className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {isSending ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('emailPanel.sending')}
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                {t('emailPanel.send')}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailPanel;
