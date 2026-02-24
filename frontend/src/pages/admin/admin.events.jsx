import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Save, Calendar, Pencil, SwatchBook } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';

// Page d'administration des evenements
export default function AdminEvents() {

  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    duration: '',
    stock: '',
    illustration: '',
    location: '',
  });

  // Chargement des events au montage du composant
  useEffect(() => {
    loadEvents();
  }, []);

  // Chargement de la liste des events
  const loadEvents = async () => {
    try {
      // Appel à l'API pour récupérer les events
      const res = await adminService.listEvents();
      const list = Array.isArray(res) ? res : (res?.data ?? []);
      setEvents(list);
    } catch (error) {
      // Affiche une erreur en cas de problème lors du chargement
      console.error('[ADMIN EVENTS] Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Réinitialisation du formulaire de création
  const resetForm = () => {
    setFormData({ title: '', description: '', date: '', duration: '', stock: '', illustration: '', location: '' });
    setShowForm(false);
  };

  const normalizePayload = (raw) => ({
    title: raw.title.trim(),
    location: raw.location.trim(),
    date: raw.date,
    description: raw.description.trim() || null,
    illustration: raw.illustration.trim() || null,
    duration: raw.duration === '' ? null : Number(raw.duration),
    stock: raw.stock === '' ? null : Number(raw.stock)
  })

  const toMysqlDatetime = (v) => {
    if (!v) return null;
    // convertit ç"2026-04-15T14:30" en "2026-04-15 14:30:00"
    return v.replace('T', ' ') + ':00';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

      try {
        const payload = {
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          date: toMysqlDatetime(formData.date),
          duration: formData.duration === '' ? null : Number(formData.duration),
          stock: formData.stock === '' ? null : Number(formData.stock),
          illustration: formData.illustration.trim() || null,
          location: formData.location.trim(),
        }

        const result = await adminService.createEvent(payload);

        const newId = result?.id;
        setEvents(prev => [
          ...prev,
          { id: newId, ...payload, created_at: new Date().toISOString() }
        ]);

        resetForm(); // Ferme le formulaire après création
      } catch (error) {
        // Affiche une erreur en cas de problème lors de la création
        console.error('[ADMIN EVENTS] Erreur creation:', error);
      } finally {
        setSaving(false);
      }
  }

  // // Creation d'un nouvel event
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setSaving(true);

  //   try {
  //     const payload = normalizePayload(formData);
  //     const result = await adminService.createEvent(payload);

  //     const newId = result?.data?.id;
      
  //     // Ajoute le nouvel event à la liste sans recharger
  //     setEvents(prev =>[
  //       ...prev,
  //       { id: newId, ...payload, created_at: new Date().toISOString() }
  //     ]);

  //     resetForm(); // Ferme le formulaire après création
  //   } catch (error) {
  //     // Affiche une erreur en cas de problème lors de la création
  //     console.error('[ADMIN EVENTS] Erreur creation:', error);
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  // Suppression d'un event
  const handleDelete = async (id) => {
    try {
      await adminService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('[ADMIN EVENTS] Erreur suppression:', error);
    }
  };

  // Formatage de la date pour l'affichage
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des Evenements</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Nouvel evenement
        </button>
      </div>

      <p className="text-sm text-gray-400">{events.length} evenement{events.length > 1 ? 's' : ''}</p>

      {/* Form create */}
      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Nouvel evenement</h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs text-gray-400">Titre *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                  placeholder="Titre de l’événement"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">Date *</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">Lieu *</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                  placeholder="Paris, Marseille…"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-gray-400">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white min-h-[90px]"
                  placeholder="Détails de l’événement…"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">Durée (min)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                  min="0"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">Places</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                  min="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-gray-400">Illustration (URL)</label>
                <input
                  name="illustration"
                  value={formData.illustration}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save size={16} />
                {saving ? 'Creation...' : 'Creer'}
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

      {/* Liste */}
      {events.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Aucun evenement</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/20 transition-colors">
              <div className="flex flex-col md:flex-row gap-4">
                {event.illustration && (
                  <div className="w-full md:w-48 h-28 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={event.illustration} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex-grow space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-gray-400 mt-1">{event.description}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                        className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs font-bold hover:bg-white/15 transition-colors"
                        title="Modifier"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={() => setDeleteConfirm(event.id)}
                        className="px-3 py-1 rounded-lg bg-red-900/30 text-red-300 text-xs font-bold hover:bg-red-900/50 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(event.date)}
                    </span>
                    {event.location && <span>Lieu: {event.location}</span>}
                    {event.duration && <span>Duree: {event.duration} min</span>}
                    {event.stock != null && <span>Places: {event.stock}</span>}
                  </div>
                </div>
              </div>

              {deleteConfirm === event.id && (
                <div className="mt-3 p-3 rounded-lg bg-red-900/20 border border-red-500/20 flex items-center justify-between">
                  <p className="text-xs text-red-400">Supprimer cet evenement ?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(event.id)}
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
    </div>
  );
}

