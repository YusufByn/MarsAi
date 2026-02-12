import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { selectorMemoService } from '../../services/selectorMemoService';

const Selector = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtres et tri
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatut, setFilterStatut] = useState('all');
  const [filterPlaylist, setFilterPlaylist] = useState('all');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = localStorage.getItem('auth_user');

        if (!storedUser) {
          navigate('/login');
          return;
        }

        const authUser = JSON.parse(storedUser);

        // Vérifier que l'utilisateur a le rôle jury
        if (authUser.role !== 'jury') {
          setError('Acces reserve aux membres du jury');
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

  // Fonction de tri et filtrage
  const filteredMemos = useMemo(() => {
    let result = [...memos];

    // Filtrage par statut
    if (filterStatut !== 'all') {
      result = result.filter(memo => memo.statut === filterStatut);
    }

    // Filtrage par playlist
    if (filterPlaylist !== 'all') {
      const playlistValue = filterPlaylist === 'yes' ? 1 : 0;
      result = result.filter(memo => memo.playlist === playlistValue);
    }

    // Tri
    result.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'rating') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [memos, sortBy, sortOrder, filterStatut, filterPlaylist]);

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

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-24 pb-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Profil du jury */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-3xl font-bold mb-6">Profil Jury</h1>

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
                <p className="text-xs text-gray-400">Nombre de memos</p>
                <p className="text-lg font-bold">{memos.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard des memos */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold mb-6">Dashboard - Mes evaluations</h2>

          {/* Filtres et tri */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tri par */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400">Trier par</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
              >
                <option value="updated_at">Date modification</option>
                <option value="created_at">Date creation</option>
                <option value="rating">Note</option>
                <option value="title">Titre video</option>
              </select>
            </div>

            {/* Ordre */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400">Ordre</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
              >
                <option value="desc">Decroissant</option>
                <option value="asc">Croissant</option>
              </select>
            </div>

            {/* Filtre statut */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400">Statut</label>
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
              >
                <option value="all">Tous</option>
                <option value="yes">Oui</option>
                <option value="no">Non</option>
                <option value="discuss">A discuter</option>
              </select>
            </div>

            {/* Filtre playlist */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400">Playlist</label>
              <select
                value={filterPlaylist}
                onChange={(e) => setFilterPlaylist(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-mars-primary/50"
              >
                <option value="all">Tous</option>
                <option value="yes">Dans playlist</option>
                <option value="no">Hors playlist</option>
              </select>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4">
              <p className="text-xs text-gray-400">Oui</p>
              <p className="text-2xl font-bold text-green-400">
                {memos.filter(m => m.statut === 'yes').length}
              </p>
            </div>
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-xs text-gray-400">Non</p>
              <p className="text-2xl font-bold text-red-400">
                {memos.filter(m => m.statut === 'no').length}
              </p>
            </div>
            <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4">
              <p className="text-xs text-gray-400">Discuss</p>
              <p className="text-2xl font-bold text-yellow-400">
                {memos.filter(m => m.statut === 'discuss').length}
              </p>
            </div>
            <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
              <p className="text-xs text-gray-400">Playlist</p>
              <p className="text-2xl font-bold text-blue-400">
                {memos.filter(m => m.playlist === 1).length}
              </p>
            </div>
          </div>

          {/* Liste des memos */}
          {filteredMemos.length === 0 ? (
            <p className="text-center text-gray-400 py-10">Aucun memo trouve</p>
          ) : (
            <div className="space-y-4">
              {filteredMemos.map((memo) => (
                <div
                  key={memo.id}
                  className="rounded-xl border border-white/10 bg-black/40 p-4 hover:border-white/20 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Miniature video */}
                    {memo.cover && (
                      <div className="w-full md:w-48 h-28 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={memo.cover}
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

                        {/* Badges statut et playlist */}
                        <div className="flex gap-2">
                          {memo.statut && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              memo.statut === 'yes' ? 'bg-green-500/20 text-green-400' :
                              memo.statut === 'no' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {memo.statut === 'yes' ? 'Oui' : memo.statut === 'no' ? 'Non' : 'A discuter'}
                            </span>
                          )}
                          {memo.playlist === 1 && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400">
                              Playlist
                            </span>
                          )}
                        </div>
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