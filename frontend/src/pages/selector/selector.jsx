import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { selectorMemoService } from '../../services/selectorMemoService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Selector = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtre actif (null = aucun encart selectionne, pas de liste affichee)
  const [activeFilter, setActiveFilter] = useState(null);


  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = localStorage.getItem('auth_user');

        if (!storedUser) {
          navigate('/login');
          return;
        }

        const authUser = JSON.parse(storedUser);

        // Vérifier que l'utilisateur a un rôle autorisé
        const allowedRoles = ['jury', 'admin', 'superadmin'];
        if (!allowedRoles.includes(authUser.role)) {
          setError('Acces reserve aux membres du jury');
          setLoading(false);
          return;
        }

        // Récupérer les données complètes de l'utilisateur
        const userResponse = await userService.getById(authUser.id);
        setUser(userResponse.data);

        // Récupérer tous les memos de cet utilisateur
        const memosResponse = await selectorMemoService.getAllByUser(authUser.id);
        setMemos(memosResponse.data);

        setLoading(false);
      } catch (err) {
        console.log('[SELECTOR ERROR]', err);
        setError('Erreur lors du chargement des donnees');
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleCardClick = (statut) => {
    setActiveFilter(prev => prev === statut ? null : statut);
  };

  const filteredMemos = useMemo(() => {
    if (!activeFilter) return [];
    return memos
      .filter(memo => memo.statut === activeFilter)
      .sort((a, b) => (b.updated_at > a.updated_at ? 1 : -1));
  }, [memos, activeFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-white text-black rounded-xl"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const cards = [
    {
      key: 'yes',
      label: 'Oui',
      activeClass: 'bg-green-500/30 border-2 border-green-400 ring-2 ring-green-400/30',
      inactiveClass: 'bg-green-500/10 border border-green-500/20 hover:bg-green-500/20',
      countClass: 'text-green-400',
    },
    {
      key: 'no',
      label: 'Non',
      activeClass: 'bg-red-500/30 border-2 border-red-400 ring-2 ring-red-400/30',
      inactiveClass: 'bg-red-500/10 border border-red-500/20 hover:bg-red-500/20',
      countClass: 'text-red-400',
    },
    {
      key: 'discuss',
      label: 'A discuter',
      activeClass: 'bg-yellow-500/30 border-2 border-yellow-400 ring-2 ring-yellow-400/30',
      inactiveClass: 'bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20',
      countClass: 'text-yellow-400',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-24 pb-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Profil du jury */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-3xl font-bold mb-6">Profil Selector</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Nom</p>
                <p className="text-lg">{user.name} {user.lastname}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Role</p>
                <p className="text-lg uppercase">{user.role}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Derniere connexion</p>
                <p className="text-lg">
                  {user.last_login_at
                    ? new Date(user.last_login_at).toLocaleString('fr-FR')
                    : 'Jamais'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Compte cree le</p>
                <p className="text-lg">
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Videos evaluees</p>
                <p className="text-lg font-bold">{memos.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard des memos */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold mb-6">Mes evaluations</h2>

          {/* Encarts cliquables */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            {cards.map(({ key, label, activeClass, inactiveClass, countClass }) => {
              const count = memos.filter(m => m.statut === key).length;
              const isActive = activeFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => handleCardClick(key)}
                  className={`rounded-xl p-4 text-left transition-all cursor-pointer ${
                    isActive ? activeClass : inactiveClass
                  }`}
                >
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className={`text-2xl font-bold ${countClass}`}>{count}</p>
                </button>
              );
            })}
          </div>

          {/* Liste des memos filtres */}
          {activeFilter === null ? (
            <p className="text-center text-gray-400 py-10">Cliquez sur un encart pour afficher les videos</p>
          ) : filteredMemos.length === 0 ? (
            <p className="text-center text-gray-400 py-10">Aucune video avec ce statut</p>
          ) : (
            <div className="space-y-4">
              {filteredMemos.map((memo) => (
                <div
                  key={memo.id}
                  onClick={() => navigate(`/video/player?videoId=${memo.video_id}`)}
                  className="rounded-xl border border-white/10 bg-black/40 p-4 hover:border-white/20 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Miniature video */}
                    {memo.cover && (
                      <div className="w-full md:w-48 h-28 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={`${API_URL}/uploads/covers/${memo.cover}`}
                          alt={memo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Infos video et memo */}
                    <div className="flex-grow space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-lg">{memo.title || 'Sans titre'}</h3>
                          <p className="text-xs text-gray-400">
                            Duree: {memo.duration ? `${Math.floor(memo.duration / 60)}min` : 'N/A'} |
                            Classification: {memo.classification || 'N/A'}
                          </p>
                        </div>

                        {/* Badge statut */}
                        {memo.statut && (
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            memo.statut === 'yes' ? 'bg-green-500/20 text-green-400' :
                            memo.statut === 'no' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {memo.statut === 'yes' ? 'Oui' : memo.statut === 'no' ? 'Non' : 'A discuter'}
                          </span>
                        )}
                      </div>

                      {/* Note */}
                      {memo.rating && (
                        <div>
                          <span className="text-xs text-gray-400">Note: </span>
                          <span className="text-lg font-bold text-yellow-400">{memo.rating}/10</span>
                        </div>
                      )}

                      {/* Commentaire */}
                      {memo.comment && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-400">Commentaire:</p>
                          <p className="text-sm text-gray-300 italic">{memo.comment}</p>
                        </div>
                      )}

                      {/* Dates */}
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Cree: {new Date(memo.created_at).toLocaleDateString('fr-FR')}</span>
                        <span>Modifie: {new Date(memo.updated_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Selector;
