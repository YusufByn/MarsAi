import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, Trash2, Users, Shuffle, CheckSquare, Square, Loader2, Check, X, Zap, Film, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { uploadCover, uploadStills } from '../../services/api.service';
import { API_URL } from '../../config';
import { useAssignation } from '../../hooks/useModeration';

// ─────────────────────────────────────────────
// Modal Assignation
// ─────────────────────────────────────────────

function AssignationModal({ onClose }) {
    const { juries, videos, stats, loading, fetchData, assignManual, assignRandom } = useAssignation();
    const [tab, setTab] = useState('manuel');
    const [toast, setToast] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Manuel state
    const [selJuries, setSelJuries] = useState([]);
    const [selVideos, setSelVideos] = useState([]);
    const [videoSearch, setVideoSearch] = useState('');
    const [classFilter, setClassFilter] = useState('all');

    // Aléatoire state
    const [randJuries, setRandJuries] = useState([]);
    const [randLimit, setRandLimit] = useState(150);
    const [randClass, setRandClass] = useState('all');

    useEffect(() => { fetchData(); }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const filteredVideos = videos.filter(v => {
        const matchSearch = !videoSearch || v.title.toLowerCase().includes(videoSearch.toLowerCase());
        const matchClass = classFilter === 'all' || v.classification === classFilter;
        return matchSearch && matchClass;
    });
    const allVideosSelected = filteredVideos.length > 0 && filteredVideos.every(v => selVideos.includes(v.id));

    const handleManual = async () => {
        if (!selJuries.length || !selVideos.length) return showToast('Sélectionnez au moins un juré et une vidéo.', 'error');
        setIsSubmitting(true);
        try {
            const res = await assignManual({ juryIds: selJuries, videoIds: selVideos });
            showToast(res.message || 'Assignation réussie !');
            setSelJuries([]); setSelVideos([]);
        } catch (e) { showToast(e.message, 'error'); }
        finally { setIsSubmitting(false); }
    };

    const handleRandom = async () => {
        if (!randJuries.length) return showToast('Sélectionnez au moins un juré.', 'error');
        setIsSubmitting(true);
        try {
            const res = await assignRandom({ juryIds: randJuries, limit: randLimit, classification: randClass });
            showToast(res.message || 'Tirage effectué !');
            setRandJuries([]);
        } catch (e) { showToast(e.message, 'error'); }
        finally { setIsSubmitting(false); }
    };

    const toggleItem = (id, list, setList) =>
        setList(list.includes(id) ? list.filter(i => i !== id) : [...list, id]);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div>
                        <h2 className="text-lg font-bold text-white">Assignation des vidéos aux jurés</h2>
                        {stats && (
                            <p className="text-xs text-gray-400 mt-0.5">
                                {stats.assigned_videos} / {stats.total_videos} assignées —&nbsp;
                                <span className="font-bold text-violet-400">{Math.round(stats.percentage)}%</span>
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Progress bar */}
                {stats && (
                    <div className="px-6 py-3 border-b border-white/5">
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${stats.percentage}%`, background: 'linear-gradient(90deg,#7c3aed,#2563eb,#06b6d4)' }} />
                        </div>
                    </div>
                )}

                {/* Toast */}
                {toast && (
                    <div className={`mx-6 mt-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white
                        ${toast.type === 'success' ? 'bg-green-500/20 border border-green-500/30 text-green-400' : 'bg-red-500/20 border border-red-500/30 text-red-400'}`}>
                        {toast.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
                        {toast.message}
                    </div>
                )}

                {/* Sub-tabs */}
                <div className="flex gap-1 px-6 pt-4">
                    {[
                        { id: 'manuel', label: 'Manuel', icon: CheckSquare },
                        { id: 'aleatoire', label: 'Aléatoire', icon: Shuffle },
                    ].map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setTab(id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                                ${tab === id
                                    ? 'bg-white/10 text-white border border-white/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Icon size={14} />{label}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* ── MANUEL ── */}
                    {tab === 'manuel' && (
                        <div className="grid grid-cols-3 gap-4">
                            {/* Jurés */}
                            <div className="col-span-1 border border-white/10 rounded-xl p-4 bg-white/5">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Jurés</p>
                                    <button
                                        onClick={() => setSelJuries(selJuries.length === juries.length ? [] : juries.map(j => j.id))}
                                        className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
                                    >
                                        {selJuries.length === juries.length ? 'Décocher' : 'Tout cocher'}
                                    </button>
                                </div>
                                <div className="space-y-1 overflow-y-auto" style={{ maxHeight: 300 }}>
                                    {loading
                                        ? <div className="flex justify-center py-6"><Loader2 className="animate-spin text-violet-400" size={20} /></div>
                                        : juries.map(j => {
                                            const checked = selJuries.includes(j.id);
                                            return (
                                                <button key={j.id}
                                                    onClick={() => toggleItem(j.id, selJuries, setSelJuries)}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all
                                                        ${checked ? 'bg-violet-500/20 border border-violet-500/30 text-violet-300' : 'hover:bg-white/5 border border-transparent text-gray-300'}`}
                                                >
                                                    <span className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors
                                                        ${checked ? 'bg-violet-600 border-violet-600' : 'border-gray-600'}`}>
                                                        {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                                                    </span>
                                                    {j.name} {j.lastname}
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>

                            {/* Vidéos */}
                            <div className="col-span-2 border border-white/10 rounded-xl overflow-hidden bg-white/5">
                                <div className="p-3 border-b border-white/10 flex gap-2">
                                    <div className="relative flex-1">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input type="text" placeholder="Rechercher..."
                                            value={videoSearch} onChange={e => setVideoSearch(e.target.value)}
                                            className="w-full pl-8 pr-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        />
                                    </div>
                                    <select value={classFilter} onChange={e => setClassFilter(e.target.value)}
                                        className="text-sm px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none">
                                        <option value="all">Toutes</option>
                                        <option value="ia">IA</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                    <span className="text-xs text-gray-500 self-center px-1 whitespace-nowrap">
                                        {selVideos.length} sél.
                                    </span>
                                </div>
                                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                                    <table className="w-full text-left">
                                        <thead className="sticky top-0 bg-[#1a1a2e] text-xs uppercase text-gray-500 font-bold border-b border-white/10">
                                            <tr>
                                                <th className="p-2 pl-3">
                                                    <button onClick={() => setSelVideos(allVideosSelected ? [] : filteredVideos.map(v => v.id))}>
                                                        {allVideosSelected
                                                            ? <CheckSquare size={14} className="text-violet-400" />
                                                            : <Square size={14} className="text-gray-500" />}
                                                    </button>
                                                </th>
                                                <th className="p-2">Titre</th>
                                                <th className="p-2">Cat.</th>
                                                <th className="p-2">Pays</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-sm">
                                            {loading ? (
                                                <tr><td colSpan={4} className="p-6 text-center">
                                                    <Loader2 className="animate-spin inline text-violet-400" size={18} />
                                                </td></tr>
                                            ) : filteredVideos.map(v => {
                                                const checked = selVideos.includes(v.id);
                                                return (
                                                    <tr key={v.id}
                                                        onClick={() => toggleItem(v.id, selVideos, setSelVideos)}
                                                        className={`cursor-pointer transition-colors ${checked ? 'bg-violet-500/10' : 'hover:bg-white/5'}`}
                                                    >
                                                        <td className="p-2 pl-3">
                                                            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors
                                                                ${checked ? 'bg-violet-600 border-violet-600' : 'border-gray-600 bg-transparent'}`}>
                                                                {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                                                            </span>
                                                        </td>
                                                        <td className="p-2 font-medium text-white max-w-[180px] truncate">{v.title}</td>
                                                        <td className="p-2">
                                                            {v.classification === 'ia'
                                                                ? <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-bold"><Zap size={9} />IA</span>
                                                                : <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs font-bold"><Film size={9} />Hybrid</span>
                                                            }
                                                        </td>
                                                        <td className="p-2 text-gray-400">{v.country ?? '—'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="col-span-3 flex justify-end pt-2">
                                <button onClick={handleManual}
                                    disabled={isSubmitting || !selJuries.length || !selVideos.length}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
                                >
                                    {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                                    Assigner {selVideos.length} vidéo{selVideos.length !== 1 ? 's' : ''} à {selJuries.length} juré{selJuries.length !== 1 ? 's' : ''}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── ALÉATOIRE ── */}
                    {tab === 'aleatoire' && (
                        <div className="grid grid-cols-3 gap-4">
                            {/* Jurés */}
                            <div className="col-span-1 border border-white/10 rounded-xl p-4 bg-white/5">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs"
                                        style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>1</span>
                                    Groupe de jurés
                                </p>
                                <div className="space-y-1 overflow-y-auto" style={{ maxHeight: 300 }}>
                                    {loading
                                        ? <div className="flex justify-center py-6"><Loader2 className="animate-spin text-violet-400" size={20} /></div>
                                        : juries.map(j => {
                                            const checked = randJuries.includes(j.id);
                                            return (
                                                <button key={j.id}
                                                    onClick={() => toggleItem(j.id, randJuries, setRandJuries)}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all
                                                        ${checked ? 'bg-violet-500/20 border border-violet-500/30 text-violet-300' : 'hover:bg-white/5 border border-transparent text-gray-300'}`}
                                                >
                                                    <span className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors
                                                        ${checked ? 'bg-violet-600 border-violet-600' : 'border-gray-600'}`}>
                                                        {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                                                    </span>
                                                    {j.name} {j.lastname}
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>

                            {/* Config */}
                            <div className="col-span-2 flex flex-col gap-4">
                                {/* Quantité */}
                                <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs"
                                            style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>2</span>
                                        Nombre de vidéos à tirer
                                    </p>
                                    <input type="number" min={1} max={videos.length}
                                        value={randLimit} onChange={e => setRandLimit(Math.max(1, Number(e.target.value)))}
                                        className="w-full px-4 py-3 text-xl font-black text-center bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-blue-500/50"
                                    />
                                    <p className="text-xs text-gray-500 text-center mt-1">{videos.length} vidéos disponibles</p>
                                </div>

                                {/* Catégorie */}
                                <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs"
                                            style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>3</span>
                                        Catégorie
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'all', label: 'Toutes', sub: 'IA + Hybrid' },
                                            { id: 'ia', label: 'IA Pure', sub: 'Uniquement IA' },
                                            { id: 'hybrid', label: 'Hybrid', sub: 'Uniquement Hybrid' },
                                        ].map(({ id, label, sub }) => (
                                            <button key={id} onClick={() => setRandClass(id)}
                                                className={`py-3 rounded-xl border-2 text-center transition-all
                                                    ${randClass === id
                                                        ? 'border-violet-500 bg-violet-500/20'
                                                        : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                                            >
                                                <p className={`font-bold text-sm ${randClass === id ? 'text-violet-300' : 'text-gray-300'}`}>{label}</p>
                                                <p className={`text-xs ${randClass === id ? 'text-violet-500' : 'text-gray-500'}`}>{sub}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Récap */}
                                {randJuries.length > 0 && (
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm flex items-center gap-4 text-gray-300">
                                        <span className="flex items-center gap-1.5"><Users size={13} className="text-violet-400" />{randJuries.length} juré{randJuries.length > 1 ? 's' : ''}</span>
                                        <span className="text-gray-600">·</span>
                                        <span className="flex items-center gap-1.5"><Film size={13} className="text-blue-400" />{randLimit} vidéos</span>
                                        <span className="text-gray-600">·</span>
                                        <span className="flex items-center gap-1.5"><Zap size={13} className="text-yellow-400" />
                                            {randClass === 'all' ? 'Toutes' : randClass === 'ia' ? 'IA Pure' : 'Hybrid'}
                                        </span>
                                    </div>
                                )}

                                <button onClick={handleRandom}
                                    disabled={isSubmitting || !randJuries.length}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
                                >
                                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Shuffle size={18} />}
                                    Lancer le tirage et assigner
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// AdminFilms — original intact + bouton modale
// ─────────────────────────────────────────────

export default function AdminFilms() {
  const [films, setFilms] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(null);
  const [uploadingStills, setUploadingStills] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false); // 👈 nouveau
  const coverInputRefs = useRef({});
  const stillsInputRefs = useRef({});

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

  const handleCoverUpload = async (filmId, file) => {
    if (!file) return;
    setUploadingCover(filmId);
    try {
      const result = await uploadCover(filmId, file);
      setFilms(prev => prev.map(f => f.id === filmId ? { ...f, poster_url: result.data.cover } : f));
    } catch (error) {
      console.error('[ADMIN FILMS] Erreur upload cover:', error);
    } finally {
      setUploadingCover(null);
    }
  };

  const handleStillsUpload = async (filmId, files) => {
    if (!files || files.length === 0) return;
    setUploadingStills(filmId);
    try {
      await uploadStills(filmId, Array.from(files));
    } catch (error) {
      console.error('[ADMIN FILMS] Erreur upload stills:', error);
    } finally {
      setUploadingStills(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchFilms();
  };

  const getCoverUrl = (cover) => {
    if (!cover) return null;
    if (cover.startsWith('http')) return cover;
    return `${API_URL}/uploads/covers/${cover}`;
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
    <div className="relative min-h-full space-y-6">

      {/* Header — titre + bouton assignation */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des Films</h1>
        <button
          onClick={() => setShowAssignModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
        >
          <Users size={15} />
          Assigner aux jurés
        </button>
      </div>

      {/* Filtres — inchangé */}
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

      {/* Stats — inchangé */}
      <p className="text-sm text-gray-400">{total} film{total > 1 ? 's' : ''} trouve{total > 1 ? 's' : ''}</p>

      {/* Liste — inchangé */}
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
                {getCoverUrl(film.poster_url) && (
                  <div className="w-full md:w-40 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={getCoverUrl(film.poster_url)} alt={film.title} className="w-full h-full object-cover" />
                  </div>
                )}
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
                  <div className="flex gap-2 mt-2">
                    {film.status !== 'validated' && (
                      <button onClick={() => handleStatusChange(film.id, 'validated')}
                        className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500/30 transition-colors">
                        Valider
                      </button>
                    )}
                    {film.status !== 'rejected' && (
                      <button onClick={() => handleStatusChange(film.id, 'rejected')}
                        className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-colors">
                        Rejeter
                      </button>
                    )}
                    {film.status !== 'pending' && (
                      <button onClick={() => handleStatusChange(film.id, 'pending')}
                        className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs font-bold hover:bg-yellow-500/30 transition-colors">
                        En attente
                      </button>
                    )}
                    <button onClick={() => coverInputRefs.current[film.id]?.click()}
                      disabled={uploadingCover === film.id}
                      className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/30 transition-colors disabled:opacity-50">
                      {uploadingCover === film.id ? 'Upload...' : 'Cover'}
                    </button>
                    <input ref={el => { coverInputRefs.current[film.id] = el; }}
                      type="file" accept="image/jpeg,image/jpg,image/png" className="hidden"
                      onChange={e => handleCoverUpload(film.id, e.target.files[0])} />
                    <button onClick={() => stillsInputRefs.current[film.id]?.click()}
                      disabled={uploadingStills === film.id}
                      className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-bold hover:bg-purple-500/30 transition-colors disabled:opacity-50">
                      {uploadingStills === film.id ? 'Upload...' : 'Stills'}
                    </button>
                    <input ref={el => { stillsInputRefs.current[film.id] = el; }}
                      type="file" accept="image/jpeg,image/jpg,image/png" multiple className="hidden"
                      onChange={e => handleStillsUpload(film.id, e.target.files)} />
                    <button onClick={() => setDeleteConfirm(film.id)}
                      className="px-3 py-1 rounded-lg bg-red-900/30 text-red-300 text-xs font-bold hover:bg-red-900/50 transition-colors ml-auto">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
              {deleteConfirm === film.id && (
                <div className="mt-3 p-3 rounded-lg bg-red-900/20 border border-red-500/20 flex items-center justify-between">
                  <p className="text-xs text-red-400">Supprimer definitivement ce film ?</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(film.id)}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700">
                      Confirmer
                    </button>
                    <button onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1 rounded-lg bg-gray-700 text-white text-xs font-bold hover:bg-gray-600">
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination — inchangé */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-gray-400">Page {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Modale assignation */}
      {showAssignModal && <AssignationModal onClose={() => setShowAssignModal(false)} />}
    </div>
  );
}