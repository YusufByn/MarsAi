import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
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
      await authService.register(formData);
      setStatus('success');
      setMessage('Compte cree, tu peux te connecter');
      navigate('/login');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Erreur lors de la creation du compte');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-24 pb-10">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Inscription</h1>
          <p className="text-sm text-gray-400">Cree ton compte MarsIA</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-gray-400">Prenom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                placeholder="Prenom"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400">Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                placeholder="Nom"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                placeholder="email@marsai.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
                placeholder="********"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-xl bg-white text-black py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-200 disabled:opacity-50"
          >
            {status === 'loading' ? 'Creation...' : 'Creer mon compte'}
          </button>

          {message && (
            <div
              className={`text-xs text-center ${
                status === 'error' ? 'text-red-400' : 'text-green-400'
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
