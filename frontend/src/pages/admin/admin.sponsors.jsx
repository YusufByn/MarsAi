import React from 'react';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';
import { sponsorsService } from '../../services/sponsorsService';
import { API_URL } from '../../config';


export default function AdminSponsors() {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        img: '',
        cover: null,
        url: '',
        is_active: 1,
    });
    const [saving, setSaving] = useState(false);
    
    useEffect(() => {
        loadSponsors();
    }, []);

    const loadSponsors = async () => {
        try {
            const response = await sponsorsService.getAllAdmin();
            setSponsors(response.data || response || []);
            setError(null);
        } catch (error) {
            console.error('[ADMIN SPONSORS] Erreur chargement:', error);
            setError(error.message || 'Erreur lors du chargement des sponsors');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', img: '', cover: null, url: '', is_active: 1 });
        setEditingId(null);
        setShowForm(false);
    };
    
    const openCreate = () => {
        resetForm();
        setShowForm(true);
    };

    const openEdit = (sponsor) => {
        setFormData({
            name: sponsor.name || '',
            img: sponsor.img || '',
            cover: null,
            url: sponsor.url || '',
            is_active: Number(sponsor.is_active ?? 1),
        });
        setEditingId(sponsor.id);
        setShowForm(true);
    };

    const resolveImgUrl = (imgPath) => {
        if (!imgPath) return '';
        if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
        if (imgPath.startsWith('/')) return `${API_URL}${imgPath}`;
        return imgPath;
    };

    const normalizeSponsorUrl = (value) => {
        if (typeof value !== 'string') return '';
        const trimmedValue = value.trim();
        if (!trimmedValue) return '';
        return /^https?:\/\//i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                url: normalizeSponsorUrl(formData.url),
            };

            if (editingId) {
                const response = await sponsorsService.update(editingId, payload);
                const updatedSponsor = response?.data || { ...payload, id: editingId };
                setSponsors((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...updatedSponsor } : s)));
            } else {
                const response = await sponsorsService.create(payload);
                const createdSponsor = response?.data || { ...payload, id: Date.now(), is_active: 1 };
                setSponsors((prev) => [...prev, createdSponsor]);
            }
            resetForm();
            setError(null);
        } catch (error) {
            console.error('[ADMIN SPONSORS] Erreur sauvegarde:', error);
            setError(error.message || 'Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleVisibility = async (sponsor) => {
        try {
            const nextIsActive = Number(sponsor.is_active ?? 1) ? 0 : 1;
            const response = await sponsorsService.setVisibility(sponsor.id, nextIsActive);
            const updatedSponsor = response?.data || { ...sponsor, is_active: nextIsActive };
            setSponsors((prev) => prev.map((s) => (s.id === sponsor.id ? { ...s, ...updatedSponsor } : s)));
            setError(null);
        } catch (error) {
            console.error('[ADMIN SPONSORS] Erreur visibilité:', error);
            setError(error.message || 'Erreur lors du changement de visibilité');
        }
    };
    
    const handleDelete = async (id) => {
        try {
            await sponsorsService.delete(id);
            setSponsors(prev => prev.filter(s => s.id !== id));
            setDeleteConfirm(null);
        } catch (error) {
            console.error('[ADMIN SPONSORS] Erreur suppression:', error);
            setError(error.message || 'Erreur lors de la suppression');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-400">Chargement...</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Gestion des Sponsors</h1>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
                >
                    <Plus size={16} />
                    Ajouter un sponsor</button>
            </div>
            <p className="text-sm text-gray-400">{sponsors.length} sponsor{sponsors.length > 1 ? 's' : ''}</p>
            {showForm && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">
                            {editingId ? 'Modifier le sponsor' : 'Nouveau sponsor'}
                        </h2>
                        <button onClick={resetForm} className="text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                    {error && (
                        <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/20 text-sm text-red-400">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-400">Nom</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="cover" className="block text-sm font-medium text-gray-400">Image</label>
                                <input type="file" id="cover" name="cover" accept="image/*" onChange={(e) => setFormData({ ...formData, cover: e.target.files?.[0] || null })} className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="url" className="block text-sm font-medium text-gray-400">URL</label>
                                <input type="text" id="url" name="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                <Save size={16} />
                                {saving ? 'Sauvegarde...' : editingId ? 'Mettre a jour' : 'Creer'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 rounded-xl bg-gray-700 text-white text-sm font-bold hover:bg-gray-600 transition-colors"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {sponsors.length === 0 ? (
                <p className="text-center text-gray-400 py-10">Aucun sponsor</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sponsors.map((sponsor) => (
                        <div key={sponsor.id} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-bold">{sponsor.name}</h3>
                                    <span
                                        className={`text-[10px] px-2 py-1 rounded-full ${
                                            Number(sponsor.is_active ?? 1)
                                                ? 'bg-green-500/20 text-green-300'
                                                : 'bg-yellow-500/20 text-yellow-300'
                                        }`}
                                    >
                                        {Number(sponsor.is_active ?? 1) ? 'Actif' : 'Masqué'}
                                    </span>
                                </div>
                                {sponsor.img && (
                                    <img
                                        src={resolveImgUrl(sponsor.img)}
                                        alt={sponsor.name}
                                        className="w-full h-32 object-contain rounded-lg bg-white"
                                    />
                                )}
                                {sponsor.url && (
                                    <a
                                        href={normalizeSponsorUrl(sponsor.url)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-blue-400 hover:underline break-all"
                                    >
                                        {sponsor.url}
                                    </a>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleToggleVisibility(sponsor)}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                        Number(sponsor.is_active ?? 1)
                                            ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'
                                            : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                                    }`}
                                >
                                    {Number(sponsor.is_active ?? 1) ? <EyeOff size={12} /> : <Eye size={12} />}
                                    {Number(sponsor.is_active ?? 1) ? 'Masquer' : 'Afficher'}
                                </button>
                                <button
                                    onClick={() => openEdit(sponsor)}
                                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/30 transition-colors"
                                >
                                    <Pencil size={12} />
                                    Modifier
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(sponsor.id)}
                                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-colors"
                                >
                                    <Trash2 size={12} />
                                    Supprimer
                                </button>
                            </div>
                            {deleteConfirm === sponsor.id && (
                                <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/20 flex items-center justify-between">
                                    <p className="text-xs text-red-400">Confirmer ?</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDelete(sponsor.id)}
                                            className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                                        >
                                            Oui
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(null)}
                                            className="px-3 py-1 rounded-lg bg-gray-700 text-white text-xs font-bold hover:bg-gray-600"
                                        >
                                            Non
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}