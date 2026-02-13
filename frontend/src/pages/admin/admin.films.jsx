import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminFilms() {
  const [films, setFilms] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const totalPages = Math.ceil(total / limit);

  const fetchFilms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.listVideos({ page, limit, search, status: statusFilter });
      setFilms(data.videos || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('[ADMIN FILMS] Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter]);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminService.updateVideoStatus(id, newStatus);
      setFilms(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
    } catch (error) {
      console.error('[ADMIN FILMS] Erreur update status:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteVideo(id);
      setFilms(prev => prev.filter(f => f.id !== id));
      setTotal(prev => prev - 1);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('[ADMIN FILMS] Erreur suppression:', error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchFilms();
  };

  const statusBadge = (status) => {
    const map = {
      draft: 'bg-gray-500/20 text-gray-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      validated: 'bg-green-500/20 text-green-400',
      rejected: 'bg-red-500/20 text-red-400',
      banned: 'bg-red-800/20 text-red-600',
    };
    const labels = { draft: 'Brouillon', pending: 'En attente', validated: 'Valide', rejected: 'Rejete', banned: 'Banni' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${map[status] || 'bg-gray-500/20 text-gray-400'}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestion des Films</h1>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre ou realisateur..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </form>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="validated">Valide</option>
          <option value="rejected">Rejete</option>
        </select>
      </div>

      {/* Stats rapides */}
      <p className="text-sm text-gray-400">{total} film{total > 1 ? 's' : ''} trouve{total > 1 ? 's' : ''}</p>

      {/* Liste */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-400">Chargement...</p>
        </div>
      ) : films.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Aucun film trouve</p>
      ) : (
        <div className="space-y-3">
          {films.map((film) => (
            <div key={film.id} className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/20 transition-colors">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Miniature */}
                {film.poster_url && (
                  <div className="w-full md:w-40 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={film.poster_url} alt={film.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Infos */}
                <div className="flex-grow space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{film.title || 'Sans titre'}</h3>
                      <p className="text-xs text-gray-400">
                        Realisateur: {film.director || 'N/A'} | Pays: {film.country || 'N/A'} | Duree: {film.duration ? `${Math.floor(film.duration / 60)}min` : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Soumis par: {film.submitter}</p>
                    </div>
                    {statusBadge(film.status)}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-2">
                    {film.status !== 'validated' && (
                      <button
                        onClick={() => handleStatusChange(film.id, 'validated')}
                        className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500/30 transition-colors"
                      >
                        Valider
                      </button>
                    )}
                    {film.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(film.id, 'rejected')}
                        className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-colors"
                      >
                        Rejeter
                      </button>
                    )}
                    {film.status !== 'pending' && (
                      <button
                        onClick={() => handleStatusChange(film.id, 'pending')}
                        className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs font-bold hover:bg-yellow-500/30 transition-colors"
                      >
                        En attente
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteConfirm(film.id)}
                      className="px-3 py-1 rounded-lg bg-red-900/30 text-red-300 text-xs font-bold hover:bg-red-900/50 transition-colors ml-auto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirmation suppression */}
              {deleteConfirm === film.id && (
                <div className="mt-3 p-3 rounded-lg bg-red-900/20 border border-red-500/20 flex items-center justify-between">
                  <p className="text-xs text-red-400">Supprimer definitivement ce film ?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(film.id)}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1 rounded-lg bg-gray-700 text-white text-xs font-bold hover:bg-gray-600"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-gray-400">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
