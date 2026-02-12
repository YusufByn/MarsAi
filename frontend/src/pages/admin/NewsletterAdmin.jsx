import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { newsletterService } from '../../services/newsletterService';

// Composant pour l'aperçu Smartphone
const EmailPreview = ({ subject, message }) => {
  const { t } = useTranslation();

  return (
    <div className="glass-card rounded-[2.5rem] border border-white/20 p-2 w-[320px] mx-auto shadow-2xl relative overflow-hidden bg-black">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>

      {/* Screen Content */}
      <div className="bg-white h-[600px] rounded-[2rem] overflow-y-auto custom-scrollbar text-black relative">
        {/* Fake Gmail Header */}
        <div className="bg-red-600 p-4 pt-8 text-white flex items-center justify-between sticky top-0 z-10 shadow-md">
          <div className="w-6 h-6 rounded-full bg-white/20"></div>
          <span className="text-sm font-medium">{t('newsletter.inbox')}</span>
          <div className="w-6 h-6 rounded-full bg-white/20"></div>
        </div>

        {/* Email Item Open */}
        <div className="p-4">
          <h2 className="text-lg font-bold leading-tight mb-4 text-gray-900">
            {subject || t('newsletter.noSubject')}
          </h2>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mars-primary to-mars-secondary flex items-center justify-center text-white font-bold text-xs">
              MA
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">marsAI Festival</span>
              <span className="text-xs text-gray-500">{t('newsletter.toMe')}</span>
            </div>
          </div>

          {/* Email Body Preview (Simulated HTML) */}
          <div className="bg-[#0a0a0a] rounded-xl p-4 text-white min-h-[300px] border border-gray-200">
              <div className="text-center mb-6">
                  <span className="text-xl font-black tracking-tighter">mars<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">AI</span></span>
              </div>

              <div className="text-sm leading-relaxed text-gray-300 whitespace-pre-line font-light">
                  {message || t('newsletter.startWriting')}
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 text-center">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold py-2 px-6 rounded-full">
                      {t('newsletter.discover')}
                  </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewsletterAdmin = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    recipients: ['newsletter'], // Toujours newsletter par défaut
    sendMode: 'immediate', // immediate | scheduled
    scheduledDate: '',
    scheduledTime: ''
  });

  const [recipientCounts, setRecipientCounts] = useState({
    newsletter: 0,
    total: 0
  });

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Récupérer le nombre de destinataires (uniquement newsletter)
  useEffect(() => {
    let cancelled = false;
    newsletterService.previewRecipients(['newsletter'])
      .then(response => {
        if (!cancelled) {
          setRecipientCounts({
            newsletter: response.data.breakdown.newsletter,
            total: response.data.total
          });
        }
      })
      .catch(error => {
        console.error('[NEWSLETTER] Erreur lors de la recuperation des destinataires:', error);
      });
    return () => { cancelled = true; };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.message) {
      setStatus('error');
      setMessage(t('newsletter.fillAllFields'));
      return;
    }

    if (formData.sendMode === 'scheduled' && (!formData.scheduledDate || !formData.scheduledTime)) {
      setStatus('error');
      setMessage(t('newsletter.selectDateTime'));
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSend = async () => {
    setShowConfirmModal(false);
    setStatus('loading');
    setMessage('');

    try {
      const response = await newsletterService.sendCampaign(
        formData.subject,
        formData.message,
        formData.recipients
      );

      setStatus('success');
      setMessage(formData.sendMode === 'scheduled'
        ? t('newsletter.scheduledSuccess', { date: formData.scheduledDate, time: formData.scheduledTime })
        : `${response.message} (${response.data.successful}/${response.data.totalSent})`
      );

      setFormData({
        subject: '',
        message: '',
        recipients: ['newsletter'],
        sendMode: 'immediate',
        scheduledDate: '',
        scheduledTime: ''
      });
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 10000);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || t('newsletter.sendError'));
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 10000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 md:p-12 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-mars-primary/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-mars-secondary/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/60">{t('newsletter.broadcastSystem')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                Mars<span className="mars-text-gradient">Broadcast</span>
            </h1>
          </div>

          <div className="flex gap-8">
            <div className="text-right">
                <span className="block text-3xl font-bold text-white">{recipientCounts.total}</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">{t('newsletter.subscribersCount')}</span>
            </div>
            <div className="w-px h-12 bg-white/10"></div>
            <div className="text-right">
                <span className="block text-3xl font-bold text-white">2/2</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">{t('newsletter.dailyQuota')}</span>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">

            {/* Colonne Gauche : Formulaire Unique */}
            <div className="lg:col-span-7 space-y-8">

                <form onSubmit={handleSubmit} className="space-y-8">

                    <div className="space-y-8 animate-fade-in">
                        {/* Sujet */}
                        <div className="glass-card p-1 rounded-2xl border border-white/10 focus-within:border-mars-primary/50 transition-colors">
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                placeholder={t('newsletter.subjectPlaceholder')}
                                className="w-full bg-transparent border-none px-6 py-4 text-xl font-bold placeholder:text-gray-600 focus:outline-none focus:ring-0 text-white"
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* Message */}
                        <div className="glass-card p-1 rounded-3xl border border-white/10 focus-within:border-mars-primary/50 transition-colors h-[350px]">
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder={t('newsletter.messagePlaceholder')}
                                className="w-full h-full bg-transparent border-none px-6 py-6 text-base leading-relaxed placeholder:text-gray-700 focus:outline-none focus:ring-0 text-gray-200 resize-none font-light custom-scrollbar"
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* Paramétrage & Cible (Intégré) */}
                        <div className="grid md:grid-cols-2 gap-6">

                            {/* Section Programmation */}
                            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                                <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">{t('newsletter.sendSettings')}</h3>

                                <div className="space-y-3">
                                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.sendMode === 'immediate' ? 'border-mars-primary/50 bg-mars-primary/5' : 'border-white/5 bg-white/5'}`}>
                                        <input
                                            type="radio"
                                            name="sendMode"
                                            value="immediate"
                                            checked={formData.sendMode === 'immediate'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-mars-primary"
                                        />
                                        <span className="text-sm font-medium">{t('newsletter.immediate')}</span>
                                    </label>

                                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.sendMode === 'scheduled' ? 'border-mars-primary/50 bg-mars-primary/5' : 'border-white/5 bg-white/5'}`}>
                                        <input
                                            type="radio"
                                            name="sendMode"
                                            value="scheduled"
                                            checked={formData.sendMode === 'scheduled'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-mars-primary"
                                        />
                                        <span className="text-sm font-medium">{t('newsletter.scheduled')}</span>
                                    </label>

                                    {formData.sendMode === 'scheduled' && (
                                        <div className="space-y-3 pt-2 animate-fade-in">
                                            <input
                                                type="date"
                                                name="scheduledDate"
                                                value={formData.scheduledDate}
                                                onChange={handleInputChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                                            />
                                            <input
                                                type="time"
                                                name="scheduledTime"
                                                value={formData.scheduledTime}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section Cible Unique */}
                            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                                <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">{t('newsletter.audienceTarget')}</h3>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-mars-primary/10 border border-mars-primary/20 rounded-xl">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white uppercase tracking-wider">{t('newsletter.newsletterLabel')}</span>
                                            <span className="text-[10px] text-mars-primary font-bold uppercase tracking-widest">{t('newsletter.activePublic')}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-2xl font-black text-white leading-none">{recipientCounts.newsletter}</span>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">{t('newsletter.recipients')}</span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-gray-500 leading-relaxed italic text-center">
                                            {t('newsletter.sendInfo')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6 pt-4">
                        <button
                            type="submit"
                            disabled={status === 'loading' || recipientCounts.total === 0}
                            className="flex-1 bg-gradient-to-r from-mars-primary to-mars-secondary h-14 rounded-xl font-bold tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:shadow-[0_0_60px_rgba(139,92,246,0.6)]"
                        >
                            {status === 'loading'
                                ? t('newsletter.transmitting')
                                : formData.sendMode === 'scheduled'
                                    ? t('newsletter.schedule')
                                    : t('newsletter.sendCampaign')
                            }
                        </button>
                    </div>

                     {/* Message Feedback */}
                     {message && (
                        <div className={`p-4 rounded-xl border flex items-center gap-3 ${status === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} animate-fade-in`}>
                            <div className={`w-2 h-2 rounded-full ${status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <p className="text-sm font-medium">{message}</p>
                        </div>
                     )}

                </form>
            </div>

            {/* Colonne Droite : Preview */}
            <div className="lg:col-span-5 hidden lg:block sticky top-8">
                <div className="text-center mb-8">
                    <span className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">{t('newsletter.livePreview')}</span>
                </div>
                <EmailPreview subject={formData.subject} message={formData.message} />
            </div>

        </div>

        {/* Modal de Confirmation */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="glass-card rounded-[2rem] p-10 border border-white/20 max-w-lg w-full animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mars-primary to-mars-secondary"></div>

              <h2 className="text-3xl font-black mb-2 uppercase italic">
                {formData.sendMode === 'scheduled' ? t('newsletter.schedulingTitle') : t('newsletter.confirmationTitle')}
              </h2>
              <p className="text-gray-400 mb-8 text-lg font-light">
                {formData.sendMode === 'scheduled'
                    ? t('newsletter.scheduledFor', { date: formData.scheduledDate, time: formData.scheduledTime })
                    : t('newsletter.willReach', { count: recipientCounts.total })
                }
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="h-12 border border-white/10 rounded-xl font-bold uppercase tracking-wider hover:bg-white/5 transition-colors text-sm"
                >
                  {t('newsletter.cancel')}
                </button>
                <button
                  onClick={handleConfirmSend}
                  className="h-12 bg-white text-black rounded-xl font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors text-sm"
                >
                  {t('newsletter.confirm')}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NewsletterAdmin;
