import { useState, useEffect } from 'react';
import { useModeration, useAssignation } from '../hooks/useModeration';
import StatusBadge from '../components/StatusBadge';
import { Search, Check, X, Users, Shuffle, CheckSquare, Square, Loader2, ChevronRight, Zap, Film, AlertCircle } from 'lucide-react';

// ─────────────────────────────────────────────
// Modal Assignation
// ─────────────────────────────────────────────

function AssignationModal({ onClose }) {
    const { juries, videos, stats, loading, fetchData, assignManual, assignRandom } = useAssignation();
    const [tab, setTab] = useState('manuel'); // 'manuel' | 'aleatoire'
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

    // ✅ CORRIGÉ : useEffect et non useState
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

    const toggleJury = (id, list, setList) =>
        setList(list.includes(id) ? list.filter(j => j !== id) : [...list, id]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">Assignation des vidéos</h2>
                        {stats && (
                            <p className="text-xs text-slate-400 mt-0.5">
                                {stats.assigned_videos} / {stats.total_videos} vidéos assignées
                                <span className="ml-2 font-bold" style={{ color: '#7c3aed' }}>{Math.round(stats.percentage)}%</span>
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                        <X size={18} />
                    </button>
                </div>

                {/* Progress bar */}
                {stats && (
                    <div className="px-6 py-3 border-b border-slate-50">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${stats.percentage}%`, background: 'linear-gradient(90deg,#7c3aed,#2563eb,#06b6d4)' }} />
                        </div>
                    </div>
                )}

                {/* Toast */}
                {toast && (
                    <div className={`mx-6 mt-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white
                        ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
                        {toast.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
                        {toast.message}
                    </div>
                )}

                {/* Sub-tabs */}
                <div className="flex gap-1 px-6 pt-4 pb-0">
                    {[
                        { id: 'manuel', label: 'Manuel', icon: CheckSquare },
                        { id: 'aleatoire', label: 'Aléatoire', icon: Shuffle },
                    ].map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setTab(id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                                ${tab === id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                        >
                            <Icon size={14} />{label}
                        </button>
                    ))}
                </div>

                {/* Modal body — scrollable */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* ── MODE MANUEL ── */}
                    {tab === 'manuel' && (
                        <div className="grid grid-cols-3 gap-4">
                            {/* Jurés */}
                            <div className="col-span-1 border border-slate-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Jurés</p>
                                    <button onClick={() => setSelJuries(
                                        selJuries.length === juries.length ? [] : juries.map(j => j.id)
                                    )} className="text-xs text-violet-600 font-semibold">
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
                                                    onClick={() => toggleJury(j.id, selJuries, setSelJuries)}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all
                                                        ${checked ? 'bg-violet-50 border border-violet-200 text-violet-900' : 'hover:bg-slate-50 border border-transparent'}`}
                                                >
                                                    <span className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center
                                                        ${checked ? 'bg-violet-600 border-violet-600' : 'border-slate-300'}`}>
                                                        {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                                                    </span>
                                                    {j.name} {j.lastname}
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>

                            {/* Vidéos */}
                            <div className="col-span-2 border border-slate-200 rounded-xl overflow-hidden">
                                <div className="p-3 border-b border-slate-100 flex gap-2">
                                    <div className="relative flex-1">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="text" placeholder="Rechercher..."
                                            value={videoSearch} onChange={e => setVideoSearch(e.target.value)}
                                            className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                                        />
                                    </div>
                                    <select value={classFilter} onChange={e => setClassFilter(e.target.value)}
                                        className="text-sm px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-slate-700">
                                        <option value="all">Toutes</option>
                                        <option value="ia">IA</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                    <span className="text-xs text-slate-400 self-center px-1 whitespace-nowrap">
                                        {selVideos.length} sél.
                                    </span>
                                </div>
                                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                                    <table className="w-full text-left">
                                        <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-400 font-bold">
                                            <tr>
                                                <th className="p-2 pl-3">
                                                    <button onClick={() => setSelVideos(
                                                        allVideosSelected ? [] : filteredVideos.map(v => v.id)
                                                    )}>
                                                        {allVideosSelected
                                                            ? <CheckSquare size={14} className="text-violet-600" />
                                                            : <Square size={14} className="text-slate-400" />}
                                                    </button>
                                                </th>
                                                <th className="p-2">Titre</th>
                                                <th className="p-2">Cat.</th>
                                                <th className="p-2">Pays</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 text-sm">
                                            {loading ? (
                                                <tr><td colSpan={4} className="p-6 text-center">
                                                    <Loader2 className="animate-spin inline text-violet-400" size={18} />
                                                </td></tr>
                                            ) : filteredVideos.map(v => {
                                                const checked = selVideos.includes(v.id);
                                                return (
                                                    <tr key={v.id}
                                                        onClick={() => setSelVideos(checked
                                                            ? selVideos.filter(id => id !== v.id)
                                                            : [...selVideos, v.id]
                                                        )}
                                                        className={`cursor-pointer transition-colors ${checked ? 'bg-violet-50/60' : 'hover:bg-slate-50'}`}
                                                    >
                                                        <td className="p-2 pl-3">
                                                            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center
                                                                ${checked ? 'bg-violet-600 border-violet-600' : 'border-slate-300 bg-white'}`}>
                                                                {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                                                            </span>
                                                        </td>
                                                        <td className="p-2 font-medium text-slate-800 max-w-[180px] truncate">{v.title}</td>
                                                        <td className="p-2">
                                                            {v.classification === 'ia'
                                                                ? <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-bold"><Zap size={9} />IA</span>
                                                                : <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-bold"><Film size={9} />Hybrid</span>
                                                            }
                                                        </td>
                                                        <td className="p-2 text-slate-500">{v.country ?? '—'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* CTA manuel */}
                            <div className="col-span-3 flex justify-end pt-2">
                                <button onClick={handleManual}
                                    disabled={isSubmitting || !selJuries.length || !selVideos.length}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
                                >
                                    {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <ChevronRight size={15} />}
                                    Assigner {selVideos.length} vidéo{selVideos.length !== 1 ? 's' : ''} à {selJuries.length} juré{selJuries.length !== 1 ? 's' : ''}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── MODE ALÉATOIRE ── */}
                    {tab === 'aleatoire' && (
                        <div className="grid grid-cols-3 gap-4">
                            {/* Jurés */}
                            <div className="col-span-1 border border-slate-200 rounded-xl p-4">
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs mr-2"
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
                                                    onClick={() => toggleJury(j.id, randJuries, setRandJuries)}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all
                                                        ${checked ? 'bg-violet-50 border border-violet-200 text-violet-900' : 'hover:bg-slate-50 border border-transparent'}`}
                                                >
                                                    <span className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center
                                                        ${checked ? 'bg-violet-600 border-violet-600' : 'border-slate-300'}`}>
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
                                <div className="border border-slate-200 rounded-xl p-4">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs mr-2"
                                            style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>2</span>
                                        Nombre de vidéos à tirer
                                    </p>
                                    <input type="number" min={1} max={videos.length}
                                        value={randLimit} onChange={e => setRandLimit(Math.max(1, Number(e.target.value)))}
                                        className="w-full px-4 py-3 text-xl font-black text-center bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                                    />
                                    <p className="text-xs text-slate-400 text-center mt-1">{videos.length} vidéos disponibles</p>
                                </div>

                                {/* Catégorie */}
                                <div className="border border-slate-200 rounded-xl p-4">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs mr-2"
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
                                                    ${randClass === id ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300'}`}
                                            >
                                                <p className={`font-bold text-sm ${randClass === id ? 'text-violet-700' : 'text-slate-700'}`}>{label}</p>
                                                <p className={`text-xs ${randClass === id ? 'text-violet-400' : 'text-slate-400'}`}>{sub}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Récap + CTA */}
                                {randJuries.length > 0 && (
                                    <div className="bg-slate-900 text-white rounded-xl p-4 text-sm flex items-center gap-4">
                                        <span className="flex items-center gap-1.5"><Users size={13} className="text-violet-400" />{randJuries.length} juré{randJuries.length > 1 ? 's' : ''}</span>
                                        <span className="text-slate-600">·</span>
                                        <span className="flex items-center gap-1.5"><Film size={13} className="text-blue-400" />{randLimit} vidéos</span>
                                        <span className="text-slate-600">·</span>
                                        <span className="flex items-center gap-1.5"><Zap size={13} className="text-amber-400" />
                                            {randClass === 'all' ? 'Toutes' : randClass === 'ia' ? 'IA Pure' : 'Hybrid'}
                                        </span>
                                    </div>
                                )}

                                <button onClick={handleRandom}
                                    disabled={isSubmitting || !randJuries.length}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
// AdminFilms — original + bouton modale
// ─────────────────────────────────────────────

export default function AdminFilms() {
    const { films, loading, filters, setFilters, updateStatus } = useModeration();
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">FILMS SOUMIS</h1>
                    <p className="text-gray-500 mt-2">Gérez l'intégralité des soumissions et gérez les mises en avant.</p>
                </div>

                {/* Bouton ouvre la modale */}
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
                >
                    <Users size={16} />
                    Assigner aux jurés
                </button>
            </div>

            {/* Barre de recherche et filtres — inchangé */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher un film ou un réalisateur"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>
            </div>

            {/* Liste (Tableau) — inchangé */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-medium">
                        <tr>
                            <th className="p-4">Affiche</th>
                            <th className="p-4">Titre & Auteur</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Statut</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="5" className="p-8 text-center">Chargement...</td></tr>
                        ) : films.map((film) => (
                            <tr key={film.id} className="hover:bg-gray-50 transition">
                                <td className="p-4">
                                    <div className="w-16 h-10 bg-gray-200 rounded overflow-hidden">
                                        <img src={film.poster_url || "https://via.placeholder.com/150"} alt="cover" className="w-full h-full object-cover" />
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-gray-900">{film.title}</div>
                                    <div className="text-sm text-gray-500">{film.firstName} {film.lastName}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {new Date(film.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <StatusBadge status={film.status} />
                                </td>
                                <td className="p-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => updateStatus(film.id, 'approved')}
                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                                        title="Valider"
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={() => updateStatus(film.id, 'rejected')}
                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                        title="Refuser"
                                    >
                                        <X size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination — inchangé */}
            <div className="mt-6 flex justify-center text-sm text-gray-500">
                PAGE 1 SUR 20 - 120 FILMS TROUVÉS
            </div>

            {/* Modale assignation */}
            {showModal && <AssignationModal onClose={() => setShowModal(false)} />}
        </div>
    );
}