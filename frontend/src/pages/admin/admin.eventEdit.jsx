import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
import { adminService } from '../../services/adminService';

// Convertit une date ISO vers le format attendu par <input type="datetime-local">
function toDatetimeLocalValue(dateStr) {
    if (!dateStr) return '';
    // On suppose que dateStr est au format ISO (ex: "2026-04-01T14:30:00Z")
    const d = new Date(dateStr);
    // On formate la date au format "YYYY-MM-DDTHH:mm" (sans les secondes) pour l'input
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminEventEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const eventId = useMemo(() => Number(id), [id]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        duration: '',
        stock: '',
        illustration: '',
        location: '',
    });

    useEffect(() => {
    if (!Number.isInteger(eventId) || eventId <= 0) {
        setError("ID d'event invalide");
        setLoading(false);
        return;
    }

    const load = async () => {
        try {
            const res = await adminService.getEventById(eventId);
            const e = res?.data;

            setFormData({
                title: e?.title || '',
                description: e?.description || '',
                date: toDatetimeLocalValue(e?.date),
                duration: e?.duration ?? '',
                stock: e?.stock ?? '',
                illustration: e?.illustration || '',
                location: e?.location || '',
            });
        } catch (err) {
            setError(err.message || 'Erreur chargement event');
        } finally {
            setLoading(false);
        }
    };

        load();
    }, [eventId]);

    const normalizePayload = (raw) => ({
        title: raw.title?.trim(),
        location: raw.location?.trim(),
        date: raw.date,
        description: raw.description?.trim() || null,
        illustration: raw.illustration?.trim() || null,
        duration: raw.duration === '' ? null : Number(raw.duration),
        stock: raw.stock === '' ? null : Number(raw.stock),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const payload = normalizePayload(formData);
            await adminService.updateEvent(eventId, payload);
            navigate('/admin/events'); // retour liste
        } catch (err) {
            setError(err.message || 'Erreur update');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        setError('');

    try {
        await adminService.deleteEvent(eventId);
        navigate('/admin/events');
    } catch (err) {
        setError(err.message || 'Erreur suppression');
    } finally {
        setDeleting(false);
    }
    };

    if (loading) {
        return <p className="text-gray-400">Chargement...</p>;
    }

    if (error) {

        return (
            <div className="space-y-4">
                <button
                    onClick={() => navigate('/admin/events')}
                    className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
                >
                    <ArrowLeft size={16} /> Retour
                </button>

                <div className="rounded-2xl border border-red-500/20 bg-red-900/10 p-4">
                    <p className="text-red-300 text-sm">{error}</p>
                </div>
            </div>
        );
    }

return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <button
                onClick={() => navigate('/admin/events')}
                className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
            >
                <ArrowLeft size={16} /> Retour
            </button>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setDeleteConfirm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-900/30 text-red-200 text-sm font-bold hover:bg-red-900/45"
                >
                    <Trash2 size={16} /> Supprimer
                </button>

                <button
                    form="edit-event-form"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                    <Save size={16} /> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
            </div>
        </div>

        {/* Form edit */}
        <form id="edit-event-form" onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h1 className="text-2xl font-bold">Modifier un evenement</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs text-gray-400">Titre</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-400">Lieu</label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs text-gray-400">Description</label>
                <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-xs text-gray-400">Date et heure</label>
                    <input
                        type="datetime-local"
                        value={formData.date}
                        onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-400">Duree (minutes)</label>
                    <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData((p) => ({ ...p, duration: e.target.value }))}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        min="1"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-400">Places disponibles</label>
                    <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData((p) => ({ ...p, stock: e.target.value }))}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        min="0"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs text-gray-400">URL illustration</label>
                <input
                    type="text"
                    value={formData.illustration}
                    onChange={(e) => setFormData((p) => ({ ...p, illustration: e.target.value }))}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="https://..."
                    />
            </div>
        </form>

        {/* Confirm delete */}
        {deleteConfirm && (
            <div className="rounded-2xl border border-red-500/20 bg-red-900/10 p-4 flex items-center justify-between">
                <p className="text-sm text-red-200">Confirmer la suppression ?</p>
                <div className="flex gap-2">
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
                    >
                        {deleting ? 'Suppression...' : 'Confirmer'}
                    </button>
                    <button
                        onClick={() => setDeleteConfirm(false)}
                        className="px-3 py-1 rounded-lg bg-gray-700 text-white text-xs font-bold hover:bg-gray-600"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        )}
    </div>
    );
}