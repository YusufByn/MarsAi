import React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { sponsorsService } from '../../services/sponsorsService';
import { API_URL } from '../../config';


export default function AdminSponsors() {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [sections, setSections] = useState([]);
    const [newSectionDraft, setNewSectionDraft] = useState('');
    const [sectionCreationInfo, setSectionCreationInfo] = useState('');
    const [renameSectionForm, setRenameSectionForm] = useState({ old_section: '', new_section: '' });
    const [deleteSectionForm, setDeleteSectionForm] = useState({ section: '', target_section: 'general' });
    const [formData, setFormData] = useState({
        name: '',
        img: '',
        cover: null,
        url: '',
        section: 'general',
        sort_order: 0,
        is_active: 1,
    });
    const [saving, setSaving] = useState(false);
    const sponsorFormRef = useRef(null);
    
    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (showForm && editingId && sponsorFormRef.current) {
            sponsorFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [showForm, editingId]);

    const loadInitialData = async () => {
        await Promise.all([loadSponsors(), loadSections()]);
    };

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

    const loadSections = async () => {
        try {
            const response = await sponsorsService.getSections();
            setSections(response.data || []);
        } catch (error) {
            console.error('[ADMIN SPONSORS] Erreur sections:', error);
            setError(error.message || 'Erreur lors du chargement des sections');
        }
    };

    const sectionOptions = useMemo(() => {
        const names = new Set(['general']);
        sections.forEach((section) => {
            if (section?.section) names.add(section.section);
        });
        sponsors.forEach((sponsor) => {
            if (sponsor?.section) names.add(sponsor.section);
        });
        return Array.from(names).sort((a, b) => a.localeCompare(b, 'fr'));
    }, [sections, sponsors]);

    const groupedSponsors = useMemo(() => {
        const groups = {};
        sponsors.forEach((sponsor) => {
            const key = sponsor.section?.trim() || 'general';
            if (!groups[key]) groups[key] = [];
            groups[key].push(sponsor);
        });
        return Object.entries(groups);
    }, [sponsors]);

    const resetForm = () => {
        setFormData({ name: '', img: '', cover: null, url: '', section: 'general', sort_order: 0, is_active: 1 });
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
            section: sponsor.section || 'general',
            sort_order: Number(sponsor.sort_order ?? 0),
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
                section: (formData.section || 'general').trim() || 'general',
                sort_order: Number(formData.sort_order || 0),
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
            await loadSections();
            setError(null);
        } catch (error) {
            console.error('[ADMIN SPONSORS] Erreur sauvegarde:', error);
            setError(error.message || 'Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const handlePrepareNewSection = () => {
        const nextSection = (newSectionDraft || '').trim();
        if (!nextSection) {
            setError('Le nom de section est obligatoire');
            setSectionCreationInfo('');
            return;
        }

        const alreadyExists = sectionOptions.some(
            (section) => section.toLowerCase() === nextSection.toLowerCase()
        );

        if (alreadyExists) {
            setError('Cette section existe deja');
            setSectionCreationInfo('');
            return;
        }

        setEditingId(null);
        setFormData({
            name: '',
            img: '',
            cover: null,
            url: '',
            section: nextSection,
            sort_order: 0,
            is_active: 1,
        });
        setShowForm(true);
        setError(null);
        setSectionCreationInfo(
            `Section "${nextSection}" preparee. Cree maintenant un sponsor pour l'enregistrer.`
        );
    };

    const handleRenameSection = async () => {
        const oldSection = (renameSectionForm.old_section || '').trim();
        const newSection = (renameSectionForm.new_section || '').trim();
        if (!oldSection || !newSection) {
            setError('Sélectionne une section et renseigne le nouveau nom');
            return;
        }

        try {
            await sponsorsService.renameSection(oldSection, newSection);
            setRenameSectionForm({ old_section: '', new_section: '' });
            await Promise.all([loadSections(), loadSponsors()]);
            setError(null);
        } catch (error) {
            console.error('[ADMIN SPONSORS] Erreur renommage section:', error);
            setError(error.message || 'Erreur lors du renommage de section');
        }
    };

    const handleDeleteSection = async () => {
        const section = (deleteSectionForm.section || '').trim();
        const targetSection = (deleteSectionForm.target_section || 'general').trim() || 'general';
        if (!section) {
            setError('Sélectionne une section à supprimer');
            return;
        }

        try {
            await sponsorsService.deleteSection(section, targetSection);
            setDeleteSectionForm({ section: '', target_section: 'general' });
            await Promise.all([loadSections(), loadSponsors()]);
            setError(null);
        } catch (error) {
            console.error('[ADMIN SPONSORS] Erreur suppression section:', error);
            setError(error.message || 'Erreur lors de la suppression de section');
        }
    };

    const handleMoveSection = async (section, direction) => {
        try {
            await sponsorsService.moveSection(section, direction);
            await Promise.all([loadSections(), loadSponsors()]);
            setError(null);
        } catch (error) {
            console.error('[ADMIN SPONSORS] Erreur ordre section:', error);
            setError(error.message || 'Erreur lors du deplacement de la section');
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

    const handleMoveOrder = async (id, direction) => {
        try {
            await sponsorsService.moveOrder(id, direction);
            await loadSponsors();
            setError(null);
        } catch (error) {
            console.error('[ADMIN SPONSORS] Erreur ordre:', error);
            setError(error.message || "Erreur lors du deplacement de l'ordre");
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
                <div ref={sponsorFormRef} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
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
                            <div>
                                <label htmlFor="section" className="block text-sm font-medium text-gray-400">Section</label>
                                <input
                                    type="text"
                                    id="section"
                                    name="section"
                                    list="sections-list"
                                    value={formData.section}
                                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
                                />
                                <datalist id="sections-list">
                                    {sectionOptions.map((section) => (
                                        <option key={section} value={section} />
                                    ))}
                                </datalist>
                            </div>
                            <div>
                                <label htmlFor="sort_order" className="block text-sm font-medium text-gray-400">Ordre d'affichage</label>
                                <input
                                    type="number"
                                    id="sort_order"
                                    name="sort_order"
                                    min="0"
                                    max="65535"
                                    value={formData.sort_order}
                                    onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
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
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
                <h2 className="text-lg font-bold">Gestion des sections</h2>
                <p className="text-xs text-gray-400">
                    Sans table dédiée, une section existe dès qu&apos;au moins un sponsor lui est associé.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-white/10 bg-black/10 p-4 space-y-3">
                        <h3 className="font-semibold">Créer une section</h3>
                        <input
                            type="text"
                            value={newSectionDraft}
                            onChange={(e) => setNewSectionDraft(e.target.value)}
                            placeholder="Ex: Premium"
                            className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handlePrepareNewSection}
                            className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                        >
                            Creer la section
                        </button>
                        {sectionCreationInfo && (
                            <p className="text-xs text-green-300">{sectionCreationInfo}</p>
                        )}
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/10 p-4 space-y-3">
                        <h3 className="font-semibold">Renommer une section</h3>
                        <select
                            value={renameSectionForm.old_section}
                            onChange={(e) => setRenameSectionForm((prev) => ({ ...prev, old_section: e.target.value }))}
                            className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Choisir une section</option>
                            {sections.map((section) => (
                                <option key={section.section} value={section.section}>
                                    {section.section}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={renameSectionForm.new_section}
                            onChange={(e) => setRenameSectionForm((prev) => ({ ...prev, new_section: e.target.value }))}
                            placeholder="Nouveau nom"
                            className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handleRenameSection}
                            className="px-3 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700"
                        >
                            Renommer
                        </button>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/10 p-4 space-y-3">
                        <h3 className="font-semibold">Supprimer une section</h3>
                        <select
                            value={deleteSectionForm.section}
                            onChange={(e) => setDeleteSectionForm((prev) => ({ ...prev, section: e.target.value }))}
                            className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Section à supprimer</option>
                            {sections.map((section) => (
                                <option key={section.section} value={section.section}>
                                    {section.section}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={deleteSectionForm.target_section}
                            onChange={(e) => setDeleteSectionForm((prev) => ({ ...prev, target_section: e.target.value }))}
                            placeholder="Réaffecter vers (default: general)"
                            className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handleDeleteSection}
                            className="px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                        >
                            Supprimer et réaffecter
                        </button>
                    </div>
                </div>
                {sections.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {sections.map((section, index) => (
                            <div
                                key={section.section}
                                className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/10 text-gray-200"
                            >
                                <button
                                    type="button"
                                    title="Monter la section"
                                    onClick={() => handleMoveSection(section.section, 'up')}
                                    disabled={index === 0}
                                    className="p-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ArrowUp size={12} />
                                </button>
                                <button
                                    type="button"
                                    title="Descendre la section"
                                    onClick={() => handleMoveSection(section.section, 'down')}
                                    disabled={index === sections.length - 1}
                                    className="p-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ArrowDown size={12} />
                                </button>
                                <span>{section.section} ({section.sponsors_count})</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {sponsors.length === 0 ? (
                <p className="text-center text-gray-400 py-10">Aucun sponsor</p>
            ) : (
                <div className="space-y-6">
                    {groupedSponsors.map(([sectionName, sectionSponsors]) => (
                        <section key={sectionName} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-lg font-bold capitalize">{sectionName}</h3>
                                <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">
                                    {sectionSponsors.length} sponsor{sectionSponsors.length > 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sectionSponsors.map((sponsor) => (
                                    <div key={sponsor.id} className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-3">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="font-bold">{sponsor.name}</h4>
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
                                            <p className="text-xs text-gray-400">
                                                Section: {sponsor.section || 'general'} | Ordre: {Number(sponsor.sort_order ?? 0)}
                                            </p>
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
                                        <div className="flex flex-wrap items-center gap-2">
                                            <button
                                                onClick={() => handleMoveOrder(sponsor.id, 'up')}
                                                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 text-gray-200 text-xs font-bold hover:bg-white/20 transition-colors"
                                                title="Monter"
                                            >
                                                <ArrowUp size={12} />
                                            </button>
                                            <button
                                                onClick={() => handleMoveOrder(sponsor.id, 'down')}
                                                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 text-gray-200 text-xs font-bold hover:bg-white/20 transition-colors"
                                                title="Descendre"
                                            >
                                                <ArrowDown size={12} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleVisibility(sponsor)}
                                                title={Number(sponsor.is_active ?? 1) ? 'Masquer' : 'Afficher'}
                                                className={`flex items-center justify-center p-2 rounded-lg text-xs font-bold transition-colors ${
                                                    Number(sponsor.is_active ?? 1)
                                                        ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'
                                                        : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                                                }`}
                                            >
                                                {Number(sponsor.is_active ?? 1) ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                            <button
                                                onClick={() => openEdit(sponsor)}
                                                title="Modifier"
                                                className="flex items-center justify-center p-2 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/30 transition-colors"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(sponsor.id)}
                                                title="Supprimer"
                                                className="flex items-center justify-center p-2 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        {deleteConfirm === sponsor.id && (
                                            <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <p className="text-xs text-red-400">Confirmer ?</p>
                                                <div className="flex flex-wrap gap-2">
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
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}