import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const response = await authService.login(formData);
      localStorage.setItem('auth_token', response.token || '');
      localStorage.setItem('auth_user', JSON.stringify(response.user || {}));
      setStatus('success');
      setMessage(t('login.success'));
      const isAdmin = response.user?.role === 'admin' || response.user?.role === 'superadmin';
      navigate(isAdmin ? '/admin/dashboard' : '/');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || t('login.error'));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 pt-20 pb-10">

      {/* Background glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-mars-blue/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-mars-pink/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/30 font-bold mb-3">
            ConneXION
          </p>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">
            mars<span className="mars-gradient-text" style={{ display: 'inline-block', paddingRight: '3px' }}>AI</span>
          </h1>
          <p className="text-white/40 text-sm mt-3">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 space-y-5"
        >
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] tracking-[0.2em] uppercase text-white/40">
              Adresse mail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/[0.03] border border-white/10 px-8 py-5 text-base text-white placeholder-white/50 focus:outline-none focus:border-white/30 transition"
              style={{ borderRadius: '24px', boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.05)' }}
              placeholder="user@marsai.com"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[10px] tracking-[0.2em] uppercase text-white/40">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/[0.03] border border-white/10 px-8 py-5 text-base text-white placeholder-white/50 focus:outline-none focus:border-white/30 transition"
              style={{ borderRadius: '24px', boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.05)' }}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-5 text-sm font-bold uppercase tracking-widest transition disabled:opacity-50 flex items-center justify-center gap-3"
            style={{ background: 'linear-gradient(135deg, #2B7FFF 0%, #AD46FF 100%)', borderRadius: '32px' }}
          >
            {status === 'loading' ? t('login.logging') : t('login.submit')}
          </button>

          {/* Message */}
          {message && (
            <div className={`text-xs text-center py-1 ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
              {message}
            </div>
          )}
        </form>

        {/* Liens */}
        <div className="mt-6 flex items-center justify-center gap-3 text-sm">
          <span className="text-white/30">Pas encore de compte ?</span>
          <Link
            to="/register"
            className="font-bold text-white hover:mars-gradient-text transition"
            style={{ background: 'linear-gradient(135deg, #51A2FF, #AD46FF, #FF2B7F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Inscription
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-white/20 text-xs hover:text-white/50 transition">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
