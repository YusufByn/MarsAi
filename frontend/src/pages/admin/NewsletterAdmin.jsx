import React, { useState, useEffect } from 'react';
import { newsletterService } from '../../services/newsletterService';

// Composant pour l'aperçu Smartphone
const EmailPreview = ({ subject, message }) => (
  <div className="glass-card rounded-[2.5rem] border border-white/20 p-2 w-[320px] mx-auto shadow-2xl relative overflow-hidden bg-black">
    {/* Notch */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
    
    {/* Screen Content */}
    <div className="bg-white h-[600px] rounded-[2rem] overflow-y-auto custom-scrollbar text-black relative">
      {/* Fake Gmail Header */}
      <div className="bg-red-600 p-4 pt-8 text-white flex items-center justify-between sticky top-0 z-10 shadow-md">
        <div className="w-6 h-6 rounded-full bg-white/20"></div>
        <span className="text-sm font-medium">Boîte de réception</span>
        <div className="w-6 h-6 rounded-full bg-white/20"></div>
      </div>

      {/* Email Item Open */}
      <div className="p-4">
        <h2 className="text-lg font-bold leading-tight mb-4 text-gray-900">
          {subject || 'Sans objet'}
        </h2>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mars-primary to-mars-secondary flex items-center justify-center text-white font-bold text-xs">
            MA
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">MarsAI Festival</span>
            <span className="text-xs text-gray-500">à moi</span>
          </div>
        </div>

        {/* Email Body Preview (Simulated HTML) */}
        <div className="bg-[#0a0a0a] rounded-xl p-4 text-white min-h-[300px] border border-gray-200">
            <div className="text-center mb-6">
                <span className="text-xl font-black tracking-tighter">MARS<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">AI</span></span>
            </div>
            
            <div className="text-sm leading-relaxed text-gray-300 whitespace-pre-line font-light">
                {message || 'Commencez à rédiger votre message...'}
            </div>
            
            <div className="mt-8 pt-4 border-t border-white/10 text-center">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold py-2 px-6 rounded-full">
                    DÉCOUVRIR
                </button>
            </div>
        </div>
      </div>
    </div>
  </div>
);

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
      setRecipientCounts(prev => ({ ...prev, total: 0 }));
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
      
      setFormData({ subject: '', message: '', recipients: [] });
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 10000);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Une erreur est survenue lors de l\'envoi');
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
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/60">Système de Diffusion</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                Mars<span className="mars-text-gradient">Broadcast</span>
            </h1>
          </div>
          
          <div className="flex gap-8">
            <div className="text-right">
                <span className="block text-3xl font-bold text-white">{recipientCounts.total}</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">Cible Actuelle</span>
            </div>
            <div className="w-px h-12 bg-white/10"></div>
            <div className="text-right">
                <span className="block text-3xl font-bold text-white">2/2</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">Quota Quotidien</span>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Colonne Gauche : Formulaire */}
            <div className="lg:col-span-7 space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Sujet */}
                    <div className="glass-card p-1 rounded-2xl border border-white/10 focus-within:border-mars-primary/50 transition-colors">
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Sujet de la campagne..."
                            className="w-full bg-transparent border-none px-6 py-4 text-xl font-bold placeholder:text-gray-600 focus:outline-none focus:ring-0 text-white"
                            disabled={status === 'loading'}
                        />
                    </div>

                    {/* Message */}
                    <div className="glass-card p-1 rounded-3xl border border-white/10 focus-within:border-mars-primary/50 transition-colors h-[400px]">
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Rédigez votre message ici..."
                            className="w-full h-full bg-transparent border-none px-6 py-6 text-base leading-relaxed placeholder:text-gray-700 focus:outline-none focus:ring-0 text-gray-200 resize-none font-light custom-scrollbar"
                            disabled={status === 'loading'}
                        />
                    </div>

                    {/* Destinataires */}
                    <div>
                        <h3 className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-6">Ciblage de l'audience</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'newsletter', label: 'Newsletter', desc: 'Abonnés publics', count: recipientCounts.newsletter },
                                { id: 'realisateurs', label: 'Réalisateurs', desc: 'Films soumis', count: recipientCounts.realisateurs },
                                { id: 'selectionneurs', label: 'Sélectionneurs', desc: 'Staff Admin', count: recipientCounts.selectionneurs },
                                { id: 'jury', label: 'Jury', desc: 'Membres officiels', count: recipientCounts.jury }
                            ].map((item) => (
                                <div 
                                    key={item.id}
                                    onClick={() => handleRecipientToggle(item.id)}
                                    className={`
                                        cursor-pointer group relative overflow-hidden rounded-xl p-5 border transition-all duration-300
                                        ${formData.recipients.includes(item.id) 
                                            ? 'bg-mars-primary/20 border-mars-primary text-white shadow-[0_0_30px_rgba(139,92,246,0.2)]' 
                                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20'}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`font-bold uppercase tracking-wider text-sm ${formData.recipients.includes(item.id) ? 'text-white' : 'text-gray-500'}`}>{item.label}</span>
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.recipients.includes(item.id) ? 'border-mars-primary bg-mars-primary' : 'border-gray-600'}`}>
                                            {formData.recipients.includes(item.id) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs opacity-60">{item.desc}</span>
                                        <span className="text-2xl font-black">{item.count || 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6 pt-8 border-t border-white/10">
                        <button
                            type="submit"
                            disabled={status === 'loading' || recipientCounts.total === 0}
                            className="flex-1 bg-gradient-to-r from-mars-primary to-mars-secondary h-14 rounded-xl font-bold tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:shadow-[0_0_60px_rgba(139,92,246,0.6)]"
                        >
                            {status === 'loading' ? 'Transmission...' : 'Envoyer la Campagne'}
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
                    <span className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">Aperçu Live</span>
                </div>
                <EmailPreview subject={formData.subject} message={formData.message} />
            </div>

        </div>

        {/* Modal de Confirmation */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="glass-card rounded-[2rem] p-10 border border-white/20 max-w-lg w-full animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mars-primary to-mars-secondary"></div>
              
              <h2 className="text-3xl font-black mb-2 uppercase italic">Confirmation</h2>
              <p className="text-gray-400 mb-8 text-lg font-light">
                Vous allez toucher <span className="text-white font-bold">{recipientCounts.total} personnes</span>.
              </p>
              
              <div className="space-y-3 mb-10">
                {formData.recipients.map(type => (
                    <div key={type} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                      <span className="capitalize font-medium text-gray-300">{type}</span>
                      <span className="text-mars-primary font-bold text-xl">{recipientCounts[type]}</span>
                    </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="h-12 border border-white/10 rounded-xl font-bold uppercase tracking-wider hover:bg-white/5 transition-colors text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmSend}
                  className="h-12 bg-white text-black rounded-xl font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors text-sm"
                >
                  Confirmer
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
