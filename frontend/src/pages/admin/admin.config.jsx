import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminConfig() {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadCms = async () => {
      try {
        const data = await adminService.getCms();
        setSections(data);
      } catch (error) {
        console.error('[ADMIN CONFIG] Erreur chargement CMS:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCms();
  }, []);

  const handleChange = (sectionKey, field, value) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        data: { ...prev[sectionKey]?.data, [field]: value },
      },
    }));
  };

  const handleTitleChange = (sectionKey, field, value) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const promises = Object.entries(sections).map(([sectionType, sectionData]) =>
        adminService.updateCms(sectionType, {
          title: sectionData.title || '',
          sub_title: sectionData.sub_title || '',
          data: sectionData.data || {},
        })
      );
      await Promise.all(promises);
      setMessage('Configuration sauvegardee');
    } catch (error) {
      console.error('[ADMIN CONFIG] Erreur sauvegarde:', error);
      setMessage('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  const sectionKeys = Object.keys(sections);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuration CMS</h1>
          <p className="text-sm text-gray-400 mt-1">Personnalisez les sections du site</p>
        </div>
        <div className="flex items-center gap-4">
          {message && (
            <span className={`text-sm ${message.includes('Erreur') ? 'text-red-400' : 'text-green-400'}`}>
              {message}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Save size={16} />
            {saving ? 'Sauvegarde...' : 'Publier les modifications'}
          </button>
        </div>
      </div>

      {sectionKeys.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Aucune section CMS configuree</p>
      ) : (
        <div className="space-y-6">
          {sectionKeys.map((key) => {
            const section = sections[key];
            const dataFields = section.data ? Object.entries(section.data) : [];

            return (
              <div key={key} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold uppercase">{key}</h2>
                </div>

                {/* Title & Subtitle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Titre de la section</label>
                    <input
                      type="text"
                      value={section.title || ''}
                      onChange={(e) => handleTitleChange(key, 'title', e.target.value)}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Sous-titre</label>
                    <input
                      type="text"
                      value={section.sub_title || ''}
                      onChange={(e) => handleTitleChange(key, 'sub_title', e.target.value)}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                {/* Data fields */}
                {dataFields.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-3">Donnees de configuration</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dataFields.map(([field, value]) => (
                        <div key={field} className="space-y-2">
                          <label className="text-xs text-gray-400">{field.replace(/_/g, ' ').toUpperCase()}</label>
                          {typeof value === 'string' && value.startsWith('#') && value.length === 7 ? (
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={value}
                                onChange={(e) => handleChange(key, field, e.target.value)}
                                className="w-10 h-10 rounded border-none cursor-pointer"
                              />
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => handleChange(key, field, e.target.value)}
                                className="flex-1 rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                              />
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={typeof value === 'string' ? value : JSON.stringify(value)}
                              onChange={(e) => handleChange(key, field, e.target.value)}
                              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
