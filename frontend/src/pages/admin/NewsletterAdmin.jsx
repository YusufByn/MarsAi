import React, { useState, useEffect } from 'react';
import { newsletterService } from '../../services/newsletterService';

const NewsletterAdmin = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    recipients: []
  });

  const [recipientCounts, setRecipientCounts] = useState({
    newsletter: 0,
    realisateurs: 0,
    selectionneurs: 0,
    jury: 0,
    total: 0
  });

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Récupérer le nombre de destinataires en temps réel
  useEffect(() => {
    if (formData.recipients.length > 0) {
      fetchRecipientCounts();
    } else {
      setRecipientCounts({
        newsletter: 0,
        realisateurs: 0,
        selectionneurs: 0,
        jury: 0,
        total: 0
      });
    }
  }, [formData.recipients]);

  const fetchRecipientCounts = async () => {
    try {
      const response = await newsletterService.previewRecipients(formData.recipients);
      setRecipientCounts({
        ...response.data.breakdown,
        total: response.data.total
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des destinataires:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRecipientToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.includes(type)
        ? prev.recipients.filter(r => r !== type)
        : [...prev.recipients, type]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.message || formData.recipients.length === 0) {
      setStatus('error');
      setMessage('Veuillez remplir tous les champs et sélectionner au moins un destinataire');
      return;
    }

    // Ouvrir la modal de confirmation
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
      setMessage(`${response.message} (${response.data.successful}/${response.data.totalSent} envoyés)`);
      
      // Reset le formulaire
      setFormData({
        subject: '',
        message: '',
        recipients: []
      });

      // Reset le message après 10 secondes
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 10000);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Une erreur est survenue lors de l\'envoi');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 10000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase">
            Créer une <span className="mars-text-gradient">Newsletter</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Envoyez des campagnes personnalisées à vos abonnés et utilisateurs
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 border border-white/10">
          
          {/* Sujet */}
          <div className="mb-6">
            <label htmlFor="subject" className="block text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">
              Sujet de la newsletter *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="🎬 Annonce importante..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-mars-primary transition-colors"
              disabled={status === 'loading'}
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Bonjour,&#10;&#10;Nous sommes ravis de vous annoncer..."
              rows="10"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-mars-primary transition-colors resize-none"
              disabled={status === 'loading'}
            />
            <p className="text-xs text-gray-500 mt-2">
              {formData.message.length} caractères (min. 20)
            </p>
          </div>

          {/* Destinataires */}
          <div className="mb-8">
            <label className="block text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
              Destinataires * 
              {recipientCounts.total > 0 && (
                <span className="text-mars-primary ml-2">({recipientCounts.total} personnes)</span>
              )}
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Newsletter */}
              <label className={`flex items-center justify-between glass-card p-4 rounded-xl border cursor-pointer transition-all ${formData.recipients.includes('newsletter') ? 'border-mars-primary bg-mars-primary/10' : 'border-white/10 hover:border-white/20'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.recipients.includes('newsletter')}
                    onChange={() => handleRecipientToggle('newsletter')}
                    disabled={status === 'loading'}
                    className="w-5 h-5 accent-mars-primary"
                  />
                  <div>
                    <span className="font-medium">Newsletter</span>
                    <p className="text-xs text-gray-400">Abonnés actifs</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-mars-primary">
                  {recipientCounts.newsletter || 0}
                </span>
              </label>

              {/* Réalisateurs */}
              <label className={`flex items-center justify-between glass-card p-4 rounded-xl border cursor-pointer transition-all ${formData.recipients.includes('realisateurs') ? 'border-mars-primary bg-mars-primary/10' : 'border-white/10 hover:border-white/20'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.recipients.includes('realisateurs')}
                    onChange={() => handleRecipientToggle('realisateurs')}
                    disabled={status === 'loading'}
                    className="w-5 h-5 accent-mars-primary"
                  />
                  <div>
                    <span className="font-medium">Réalisateurs</span>
                    <p className="text-xs text-gray-400">Films soumis</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-mars-primary">
                  {recipientCounts.realisateurs || 0}
                </span>
              </label>

              {/* Sélectionneurs */}
              <label className={`flex items-center justify-between glass-card p-4 rounded-xl border cursor-pointer transition-all ${formData.recipients.includes('selectionneurs') ? 'border-mars-primary bg-mars-primary/10' : 'border-white/10 hover:border-white/20'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.recipients.includes('selectionneurs')}
                    onChange={() => handleRecipientToggle('selectionneurs')}
                    disabled={status === 'loading'}
                    className="w-5 h-5 accent-mars-primary"
                  />
                  <div>
                    <span className="font-medium">Sélectionneurs</span>
                    <p className="text-xs text-gray-400">Admins</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-mars-primary">
                  {recipientCounts.selectionneurs || 0}
                </span>
              </label>

              {/* Jury */}
              <label className={`flex items-center justify-between glass-card p-4 rounded-xl border cursor-pointer transition-all ${formData.recipients.includes('jury') ? 'border-mars-primary bg-mars-primary/10' : 'border-white/10 hover:border-white/20'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.recipients.includes('jury')}
                    onChange={() => handleRecipientToggle('jury')}
                    disabled={status === 'loading'}
                    className="w-5 h-5 accent-mars-primary"
                  />
                  <div>
                    <span className="font-medium">Jury</span>
                    <p className="text-xs text-gray-400">Membres officiels</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-mars-primary">
                  {recipientCounts.jury || 0}
                </span>
              </label>
            </div>
          </div>

          {/* Message de feedback */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${status === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} animate-fade-in`}>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Boutons */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status === 'loading' || recipientCounts.total === 0}
              className="bg-gradient-to-r from-mars-primary to-mars-secondary px-8 py-3 rounded-lg font-bold tracking-widest uppercase hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Envoyer la Newsletter
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setFormData({ subject: '', message: '', recipients: [] })}
              disabled={status === 'loading'}
              className="border border-white/10 px-6 py-3 rounded-lg font-medium hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Réinitialiser
            </button>
          </div>

          {/* Info limite */}
          <p className="text-xs text-gray-500 mt-4">
            ⚠️ Limite : 2 newsletters maximum par jour
          </p>
        </form>

        {/* Modal de Confirmation */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="glass-card rounded-3xl p-8 border border-white/20 max-w-md mx-4 animate-fade-in">
              <h2 className="text-2xl font-black mb-4 uppercase">Confirmer l'envoi</h2>
              <p className="text-gray-300 mb-6">
                Vous êtes sur le point d'envoyer cette newsletter à <span className="text-mars-primary font-bold">{recipientCounts.total} personnes</span>.
              </p>
              
              <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Répartition</p>
                <ul className="space-y-1 text-sm">
                  {formData.recipients.map(type => (
                    <li key={type} className="flex justify-between">
                      <span className="capitalize">{type}</span>
                      <span className="text-mars-primary font-bold">{recipientCounts[type]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleConfirmSend}
                  className="flex-1 bg-gradient-to-r from-mars-primary to-mars-secondary px-6 py-3 rounded-lg font-bold tracking-widest uppercase hover:opacity-90 transition-all"
                >
                  Confirmer
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 border border-white/10 px-6 py-3 rounded-lg font-medium hover:bg-white/5 transition-colors"
                >
                  Annuler
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
