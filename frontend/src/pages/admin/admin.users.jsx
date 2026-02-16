import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { adminService } from '../../services/adminService';

function getCurrentUserRole() {
  try {
    const raw = localStorage.getItem('auth_user');
    if (!raw) return null;
    return JSON.parse(raw).role;
  } catch {
    return null;
  }
}

function getRoleOptions(currentRole) {
  if (currentRole === 'superadmin') return ['jury', 'admin'];
  return ['jury'];
}

const roleLabels = {
  jury: 'Selector',
  admin: 'Admin',
};

const roleBadge = {
  jury: 'bg-purple-500/20 text-purple-400',
  admin: 'bg-blue-500/20 text-blue-400',
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    role: 'jury',
  });
  const [saving, setSaving] = useState(false);

  const currentRole = getCurrentUserRole();
  const roleOptions = getRoleOptions(currentRole);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminService.listUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('[ADMIN USERS] Erreur chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', lastname: '', email: '', password: '', role: 'jury' });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (user) => {
    setFormData({
      name: user.name || '',
      lastname: user.lastname || '',
      email: user.email || '',
      password: '',
      role: user.role || 'jury',
    });
    setEditingId(user.id);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        const { password, ...updateData } = formData;
        await adminService.updateUser(editingId, updateData);
        setUsers(prev => prev.map(u => u.id === editingId ? { ...u, ...updateData } : u));
      } else {
        if (!formData.password) {
          setError('Le mot de passe est requis pour la creation');
          setSaving(false);
          return;
        }
        const response = await adminService.createUser(formData);
        setUsers(prev => [...prev, { id: response.user?.id, ...formData, password: undefined, created_at: new Date().toISOString() }]);
      }
      resetForm();
    } catch (err) {
      console.error('[ADMIN USERS] Erreur sauvegarde:', err);
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('[ADMIN USERS] Erreur suppression:', err);
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
        <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Ajouter un utilisateur
        </button>
      </div>

      <p className="text-sm text-gray-400">{users.length} utilisateur{users.length > 1 ? 's' : ''}</p>

      {/* Formulaire */}
      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">
              {editingId ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
              {!editingId && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Mot de passe</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {roleOptions.map(r => (
                    <option key={r} value={r}>{roleLabels[r] || r}</option>
                  ))}
                </select>
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

      {/* Liste */}
      {users.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Aucun utilisateur</p>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-gray-400">
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Date creation</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-white">
                    {user.name} {user.lastname}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${roleBadge[user.role] || 'bg-gray-500/20 text-gray-400'}`}>
                      {roleLabels[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEdit(user)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/30 transition-colors"
                      >
                        <Pencil size={12} />
                        Modifier
                      </button>
                      {deleteConfirm === user.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-400">Confirmer ?</span>
                          <button
                            onClick={() => handleDelete(user.id)}
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
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(user.id)}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 size={12} />
                          Supprimer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}