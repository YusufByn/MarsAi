import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { juryService } from '../../services/juryService';

export default function AdminJury() {
  const [juryList, setJuryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    illustration: '',
    biographie: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadJury();
  }, []);

  const loadJury = async () => {
    try {
      const response = await juryService.getAll();
      setJuryList(response.data || []);
    } catch (error) {
      console.error('[ADMIN JURY] Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', lastname: '', illustration: '', biographie: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (jury) => {
    setFormData({
      name: jury.name || '',
      lastname: jury.lastname || '',
      illustration: jury.illustration || '',
      biographie: jury.biographie || '',
    });
    setEditingId(jury.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await juryService.update(editingId, formData);
        setJuryList(prev => prev.map(j => j.id === editingId ? { ...j, ...formData } : j));
      } else {
        const response = await juryService.create(formData);
        setJuryList(prev => [...prev, { id: response.data?.id, ...formData }]);
      }
      resetForm();
    } catch (error) {
      console.error('[ADMIN JURY] Erreur sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await juryService.delete(id);
      setJuryList(prev => prev.filter(j => j.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('[ADMIN JURY] Erreur suppression:', error);
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
        <h1 className="text-3xl font-bold">Gestion du Jury</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Ajouter un membre
        </button>
      </div>

      <p className="text-sm text-gray-400">{juryList.length} membre{juryList.length > 1 ? 's' : ''} du jury</p>

      {/* Formulaire */}
      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">
              {editingId ? 'Modifier le membre' : 'Nouveau membre du jury'}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Prenom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Nom</label>
                <input
                  type="text"
                  value={formData.lastname}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastname: e.target.value }))}
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400">URL illustration (photo)</label>
              <input
                type="text"
                value={formData.illustration}
                onChange={(e) => setFormData(prev => ({ ...prev, illustration: e.target.value }))}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400">Biographie</label>
              <textarea
                value={formData.biographie}
                onChange={(e) => setFormData(prev => ({ ...prev, biographie: e.target.value }))}
                rows={4}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              />
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

      {/* Liste */}
      {juryList.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Aucun membre du jury</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {juryList.map((jury) => (
            <div key={jury.id} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
              <div className="flex items-start gap-3">
                {jury.illustration ? (
                  <img
                    src={jury.illustration}
                    alt={`${jury.name} ${jury.lastname}`}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-gray-400">
                      {jury.name?.[0]}{jury.lastname?.[0]}
                    </span>
                  </div>
                )}
                <div className="flex-grow">
                  <h3 className="font-bold">{jury.name} {jury.lastname}</h3>
                  {jury.biographie && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-3">{jury.biographie}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(jury)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/30 transition-colors"
                >
                  <Pencil size={12} />
                  Modifier
                </button>
                <button
                  onClick={() => setDeleteConfirm(jury.id)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 size={12} />
                  Supprimer
                </button>
              </div>

              {deleteConfirm === jury.id && (
                <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/20 flex items-center justify-between">
                  <p className="text-xs text-red-400">Confirmer ?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(jury.id)}
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
