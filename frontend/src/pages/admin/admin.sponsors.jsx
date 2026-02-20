import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { sponsorsService } from '../../services/sponsorsService';
import { API_URL } from '../../config';

const MAX_TYPE_CODE = 255;
const MAX_NAME_LENGTH = 120;
const MAX_URL_LENGTH = 500;
const MAX_SORT_ORDER = 32767;
const MAX_COVER_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_COVER_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const toTypeCode = (value, fallback = 0) => {
    const raw = Number(value);
    if (!Number.isFinite(raw)) return fallback;
    const normalized = Math.trunc(raw);
    if (normalized < 0) return 0;
    if (normalized > MAX_TYPE_CODE) return MAX_TYPE_CODE;
    return normalized;
};

const getTypeLabel = (typeCode, typeName = '') => {
    const normalizedName = typeof typeName === 'string' ? typeName.trim() : '';
    if (normalizedName) return normalizedName;
    return typeCode === 0 ? 'Masqué (0)' : `Type ${typeCode}`;
};

const buildFieldErrorsMap = (errors = []) =>
    errors.reduce((acc, err) => {
        const field = typeof err?.field === 'string' ? err.field : '';
        const message = typeof err?.message === 'string' ? err.message : 'Valeur invalide';
        if (!field) return acc;
        if (!acc[field]) acc[field] = [];
        acc[field].push(message);
        return acc;
    }, {});

const getActionErrorMessage = (error, fallbackMessage) => {
    if (error?.status === 401) {
        return 'Session invalide ou expirée. Reconnectez-vous.';
    }
    if (error?.status === 403) {
        return "Accès refusé. Seul un superadmin peut gérer les sponsors.";
    }
    return error?.message || fallbackMessage;
};

const validateSponsorForm = ({ formData, createNewType, editingId, nextTypeCode }) => {
    const errors = [];
    const trimmedName = String(formData.name || '').trim();
    const trimmedUrl = String(formData.url || '').trim();

    if (createNewType && !trimmedName) {
        errors.push({ field: 'name', message: 'Le nom du type est obligatoire' });
    }
    if (createNewType && (nextTypeCode === null || nextTypeCode === undefined)) {
        errors.push({
            field: 'is_active',
            message: `Impossible de creer un nouveau type: limite atteinte (${MAX_TYPE_CODE})`,
        });
    }
    if (trimmedName.length > MAX_NAME_LENGTH) {
        errors.push({
            field: 'name',
            message: `Le nom ne doit pas dépasser ${MAX_NAME_LENGTH} caractères`,
        });
    }

    if (trimmedUrl.length > MAX_URL_LENGTH) {
        errors.push({
            field: 'url',
            message: `L'URL ne doit pas dépasser ${MAX_URL_LENGTH} caractères`,
        });
    }
    if (/\s/.test(trimmedUrl)) {
        errors.push({
            field: 'url',
            message: "L'URL ne doit pas contenir d'espaces",
        });
    }

    if (editingId) {
        const sortOrder = Number(formData.sort_order);
        if (!Number.isFinite(sortOrder) || !Number.isInteger(sortOrder)) {
            errors.push({ field: 'sort_order', message: "L'ordre doit être un entier" });
        } else if (sortOrder < 1 || sortOrder > MAX_SORT_ORDER) {
            errors.push({
                field: 'sort_order',
                message: `L'ordre doit être compris entre 1 et ${MAX_SORT_ORDER}`,
            });
        }
    }

    if (!createNewType) {
        const typeCode = Number(formData.is_active);
        if (!Number.isFinite(typeCode) || !Number.isInteger(typeCode) || typeCode < 1 || typeCode > MAX_TYPE_CODE) {
            errors.push({
                field: 'is_active',
                message: `Le type doit être un entier entre 1 et ${MAX_TYPE_CODE}`,
            });
        }
    }

    if (formData.cover instanceof File) {
        if (!ALLOWED_COVER_MIME_TYPES.includes(formData.cover.type)) {
            errors.push({
                field: 'cover',
                message: 'Image invalide. Formats autorisés: JPEG, PNG, WEBP',
            });
        }
        if (formData.cover.size > MAX_COVER_SIZE_BYTES) {
            errors.push({
                field: 'cover',
                message: 'Image trop lourde. Taille maximale: 5MB',
            });
        }
    }

    return errors;
};

export default function AdminSponsors() {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [createNewType, setCreateNewType] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        img: '',
        cover: null,
        url: '',
        sort_order: 0,
        is_active: 1,
    });
    const [saving, setSaving] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const sponsorFormRef = useRef(null);
    const fieldErrorsMap = useMemo(() => buildFieldErrorsMap(validationErrors), [validationErrors]);

    const getFieldError = (fieldName) => fieldErrorsMap[fieldName]?.[0] || null;

    const clearFieldErrors = (...fieldNames) => {
        if (!fieldNames.length) return;
        setValidationErrors((prev) =>
            prev.filter((item) => !fieldNames.includes(item?.field))
        );
    };

    useEffect(() => {
        loadSponsors();
    }, []);

    useEffect(() => {
        if (showForm && editingId && sponsorFormRef.current) {
            sponsorFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [showForm, editingId]);

    const groupedSponsors = useMemo(() => {
        const groups = {};
        sponsors.forEach((sponsor) => {
            const typeCode = toTypeCode(sponsor.is_active, 0);
            if (!groups[typeCode]) {
                groups[typeCode] = { typeCode, typeName: '', sponsors: [] };
            }
            const labelCandidate = typeof sponsor.type_name === 'string' && sponsor.type_name.trim()
                ? sponsor.type_name.trim()
                : (typeof sponsor.name === 'string' ? sponsor.name.trim() : '');
            if (!groups[typeCode].typeName && labelCandidate) {
                groups[typeCode].typeName = labelCandidate;
            }
            groups[typeCode].sponsors.push(sponsor);
        });
        return Object.values(groups).sort((a, b) => {
            if (a.typeCode === 0 && b.typeCode !== 0) return 1;
            if (b.typeCode === 0 && a.typeCode !== 0) return -1;
            return a.typeCode - b.typeCode;
        });
    }, [sponsors]);

    const activeTypeOptions = useMemo(
        () =>
            groupedSponsors
                .filter((group) => group.typeCode > 0)
                .map((group) => ({
                    value: group.typeCode,
                    label: getTypeLabel(group.typeCode, group.typeName),
                })),
        [groupedSponsors]
    );

    const defaultTypeCode = useMemo(
        () => activeTypeOptions[0]?.value ?? 1,
        [activeTypeOptions]
    );
    const activeTypeCodes = useMemo(
        () => groupedSponsors.filter((group) => group.typeCode > 0).map((group) => group.typeCode),
        [groupedSponsors]
    );
    const nextTypeCode = useMemo(() => {
        const usedTypeCodes = new Set(activeTypeCodes.map((value) => Number(value)));
        for (let code = 1; code <= MAX_TYPE_CODE; code += 1) {
            if (!usedTypeCodes.has(code)) {
                return code;
            }
        }
        return null;
    }, [activeTypeCodes]);
    const canCreateNewType = nextTypeCode !== null;

    const loadSponsors = async () => {
        try {
            const response = await sponsorsService.getAllAdmin();
            setSponsors(response.data || response || []);
            setError(null);
        } catch (loadError) {
            console.error('[ADMIN SPONSORS] Erreur chargement:', loadError);
            setError(getActionErrorMessage(loadError, 'Erreur lors du chargement des sponsors'));
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            img: '',
            cover: null,
            url: '',
            sort_order: 0,
            is_active: defaultTypeCode,
        });
        setCreateNewType(false);
        setEditingId(null);
        setShowForm(false);
        setValidationErrors([]);
    };

    const openCreate = () => {
        setFormData({
            name: '',
            img: '',
            cover: null,
            url: '',
            sort_order: 0,
            is_active: defaultTypeCode,
        });
        setCreateNewType(false);
        setEditingId(null);
        setShowForm(true);
        setValidationErrors([]);
        setError(null);
    };

    const openEdit = (sponsor) => {
        setFormData({
            name: sponsor.type_name || sponsor.name || '',
            img: sponsor.img || '',
            cover: null,
            url: sponsor.url || '',
            sort_order: Number(sponsor.sort_order ?? 0),
            is_active: toTypeCode(sponsor.is_active, 1),
        });
        setCreateNewType(false);
        setEditingId(sponsor.id);
        setShowForm(true);
        setValidationErrors([]);
        setError(null);
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
        setValidationErrors([]);
        setError(null);
        const localErrors = validateSponsorForm({ formData, createNewType, editingId, nextTypeCode });
        if (localErrors.length > 0) {
            setValidationErrors(localErrors);
            return;
        }

        setSaving(true);
        try {
            if (createNewType && !canCreateNewType) {
                setValidationErrors([
                    { field: 'is_active', message: `Limite de types atteinte (${MAX_TYPE_CODE})` },
                ]);
                return;
            }
            const selectedType = createNewType
                ? nextTypeCode
                : Math.max(1, toTypeCode(formData.is_active, defaultTypeCode));
            const editingSponsor = editingId
                ? sponsors.find((s) => Number(s.id) === Number(editingId))
                : null;
            const hasTypeChanged = editingSponsor
                ? toTypeCode(editingSponsor.is_active, defaultTypeCode) !== selectedType
                : false;
            const targetTypeSponsors = sponsors.filter(
                (s) =>
                    toTypeCode(s.is_active, 0) === selectedType &&
                    Number(s.id) !== Number(editingId)
            );
            const nextSortOrder = targetTypeSponsors.length
                ? Math.max(...targetTypeSponsors.map((s) => Number(s.sort_order ?? 0))) + 1
                : 1;

            const payload = {
                ...formData,
                sort_order:
                    editingId && !hasTypeChanged
                        ? Number(formData.sort_order || 0)
                        : nextSortOrder,
                is_active: selectedType,
                url: normalizeSponsorUrl(formData.url),
            };

            if (editingId) {
                const response = await sponsorsService.update(editingId, payload);
                const updatedSponsor = response?.data || { ...payload, id: editingId };
                setSponsors((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...updatedSponsor } : s)));
            } else {
                const response = await sponsorsService.create(payload);
                const createdSponsor = response?.data || { ...payload, id: Date.now() };
                setSponsors((prev) => [...prev, createdSponsor]);
            }

            resetForm();
            setError(null);
        } catch (saveError) {
            console.error('[ADMIN SPONSORS] Erreur sauvegarde:', saveError);
            if (Array.isArray(saveError?.errors) && saveError.errors.length > 0) {
                setValidationErrors(saveError.errors);
            }
            setError(getActionErrorMessage(saveError, 'Erreur lors de la sauvegarde'));
        } finally {
            setSaving(false);
        }
    };

    const handleMoveType = async (typeCode, direction) => {
        try {
            await sponsorsService.moveTypeOrder(typeCode, direction);
            await loadSponsors();
            setError(null);
        } catch (moveTypeError) {
            console.error('[ADMIN SPONSORS] Erreur ordre type:', moveTypeError);
            setError(getActionErrorMessage(moveTypeError, 'Erreur lors du deplacement du type'));
        }
    };

    const handleSetType = async (sponsor, nextType) => {
        try {
            const response = await sponsorsService.setVisibility(sponsor.id, toTypeCode(nextType, 0));
            const updatedSponsor = response?.data || { ...sponsor, is_active: toTypeCode(nextType, 0) };
            setSponsors((prev) => prev.map((s) => (s.id === sponsor.id ? { ...s, ...updatedSponsor } : s)));
            setError(null);
        } catch (updateError) {
            console.error('[ADMIN SPONSORS] Erreur type:', updateError);
            setError(getActionErrorMessage(updateError, 'Erreur lors de la mise à jour du type'));
        }
    };

    const handleMoveOrder = async (id, direction) => {
        try {
            await sponsorsService.moveOrder(id, direction);
            await loadSponsors();
            setError(null);
        } catch (moveError) {
            console.error('[ADMIN SPONSORS] Erreur ordre:', moveError);
            const moveMessage = String(moveError?.message || '').toLowerCase();
            const isBoundaryMoveError =
                moveError?.status === 400 &&
                (moveMessage.includes('deja en premiere position') ||
                    moveMessage.includes('deja en derniere position'));

            if (isBoundaryMoveError) {
                setError(null);
                return;
            }
            setError(getActionErrorMessage(moveError, "Erreur lors du deplacement de l'ordre"));
        }
    };

    const handleDelete = async (id) => {
        try {
            await sponsorsService.delete(id);
            setSponsors((prev) => prev.filter((s) => s.id !== id));
            setDeleteConfirm(null);
        } catch (deleteError) {
            console.error('[ADMIN SPONSORS] Erreur suppression:', deleteError);
            setError(getActionErrorMessage(deleteError, 'Erreur lors de la suppression'));
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
                    Ajouter un sponsor
                </button>
            </div>

            <p className="text-sm text-gray-400">{sponsors.length} sponsor{sponsors.length > 1 ? 's' : ''}</p>

            {showForm && (
                <div ref={sponsorFormRef} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">{editingId ? 'Modifier le sponsor' : 'Nouveau sponsor'}</h2>
                        <button onClick={resetForm} className="text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/20 text-sm text-red-400">
                            {error}
                        </div>
                    )}
                    {validationErrors.length > 0 && (
                        <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/20 text-sm text-red-300">
                            <ul className="space-y-1">
                                {validationErrors.map((item, index) => (
                                    <li key={`${item.field || 'unknown'}-${index}`}>
                                        {(item.field || 'unknown')}: {item.message || 'Valeur invalide'}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-400">Nom du type</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => {
                                        clearFieldErrors('name');
                                        setFormData({ ...formData, name: e.target.value });
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Ex: Partenaires Gold"
                                />
                                {getFieldError('name') && (
                                    <p className="mt-1 text-xs text-red-400">{getFieldError('name')}</p>
                                )}
                            </div>
                            {!editingId && (
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 text-sm text-gray-300">
                                        <input
                                            type="checkbox"
                                            checked={createNewType}
                                            disabled={!canCreateNewType}
                                            onChange={(e) => {
                                                clearFieldErrors('name', 'is_active');
                                                setCreateNewType(e.target.checked);
                                            }}
                                            className="rounded border-gray-600 bg-gray-800"
                                        />
                                        Créer un nouveau type
                                    </label>
                                    {!canCreateNewType && (
                                        <p className="text-xs text-yellow-300 mt-2">
                                            Limite atteinte ({MAX_TYPE_CODE} types max)
                                        </p>
                                    )}
                                </div>
                            )}
                            <div>
                                <label htmlFor="cover" className="block text-sm font-medium text-gray-400">Image</label>
                                <input
                                    type="file"
                                    id="cover"
                                    name="cover"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => {
                                        clearFieldErrors('cover');
                                        setFormData({ ...formData, cover: e.target.files?.[0] || null });
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
                                />
                                {getFieldError('cover') && (
                                    <p className="mt-1 text-xs text-red-400">{getFieldError('cover')}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="url" className="block text-sm font-medium text-gray-400">URL</label>
                                <input
                                    type="text"
                                    id="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={(e) => {
                                        clearFieldErrors('url');
                                        setFormData({ ...formData, url: e.target.value });
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
                                />
                                {getFieldError('url') && (
                                    <p className="mt-1 text-xs text-red-400">{getFieldError('url')}</p>
                                )}
                            </div>
                            {editingId && (
                                <div>
                                    <label htmlFor="sort_order" className="block text-sm font-medium text-gray-400">Ordre d'affichage</label>
                                    <input
                                        type="number"
                                        id="sort_order"
                                        name="sort_order"
                                        min="1"
                                        max="65535"
                                        value={formData.sort_order}
                                        onChange={(e) => {
                                            clearFieldErrors('sort_order');
                                            setFormData({ ...formData, sort_order: e.target.value });
                                        }}
                                        className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {getFieldError('sort_order') && (
                                        <p className="mt-1 text-xs text-red-400">{getFieldError('sort_order')}</p>
                                    )}
                                </div>
                            )}
                            <div>
                                <label htmlFor="is_active" className="block text-sm font-medium text-gray-400">Type</label>
                                {!editingId && createNewType ? (
                                    <div className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2">
                                        {canCreateNewType
                                            ? `Nouveau type: ${nextTypeCode}`
                                            : `Aucun type disponible (max ${MAX_TYPE_CODE})`}
                                    </div>
                                ) : (
                                    <select
                                        id="is_active"
                                        name="is_active"
                                        value={formData.is_active}
                                        onChange={(e) => {
                                            clearFieldErrors('is_active');
                                            setFormData({ ...formData, is_active: e.target.value });
                                        }}
                                        className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        {activeTypeOptions.length === 0 ? (
                                            <option value={defaultTypeCode}>Type {defaultTypeCode}</option>
                                        ) : (
                                            activeTypeOptions.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                )}
                                {getFieldError('is_active') && (
                                    <p className="mt-1 text-xs text-red-400">{getFieldError('is_active')}</p>
                                )}
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
                <div className="space-y-6">
                    {groupedSponsors.map(({ typeCode, typeName, sponsors: typeSponsors }) => (
                        <section key={typeCode} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    {typeCode > 0 && (
                                        <>
                                            {/*
                                              Les types visibles sont > 0, la position de déplacement
                                              doit ignorer le groupe "masqué (0)".
                                            */}
                                            <button
                                                type="button"
                                                title="Monter le type"
                                                onClick={() => handleMoveType(typeCode, 'up')}
                                                disabled={activeTypeCodes.indexOf(typeCode) === 0}
                                                className="p-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                <ArrowUp size={12} />
                                            </button>
                                            <button
                                                type="button"
                                                title="Descendre le type"
                                                onClick={() => handleMoveType(typeCode, 'down')}
                                                disabled={activeTypeCodes.indexOf(typeCode) === activeTypeCodes.length - 1}
                                                className="p-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                <ArrowDown size={12} />
                                            </button>
                                        </>
                                    )}
                                    <h3 className="text-lg font-bold">{getTypeLabel(Number(typeCode), typeName)}</h3>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">
                                    {typeSponsors.length} sponsor{typeSponsors.length > 1 ? 's' : ''}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {typeSponsors.map((sponsor, sponsorIndex) => {
                                    const sponsorType = toTypeCode(sponsor.is_active, 0);
                                    const isFirstSponsor = sponsorIndex === 0;
                                    const isLastSponsor = sponsorIndex === typeSponsors.length - 1;
                                    return (
                                        <div key={sponsor.id} className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-3">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span
                                                        className={`text-[10px] px-2 py-1 rounded-full ${
                                                            sponsorType > 0
                                                                ? 'bg-green-500/20 text-green-300'
                                                                : 'bg-yellow-500/20 text-yellow-300'
                                                        }`}
                                                    >
                                                        {getTypeLabel(sponsorType, sponsor.type_name || sponsor.name)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400">
                                                    Ordre: {Number(sponsor.sort_order ?? 0)}
                                                </p>
                                                {sponsor.img && (
                                                    <img
                                                        src={resolveImgUrl(sponsor.img)}
                                                        alt="Sponsor"
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
                                                    disabled={isFirstSponsor}
                                                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 text-gray-200 text-xs font-bold hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                    title="Monter"
                                                >
                                                    <ArrowUp size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleMoveOrder(sponsor.id, 'down')}
                                                    disabled={isLastSponsor}
                                                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 text-gray-200 text-xs font-bold hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                    title="Descendre"
                                                >
                                                    <ArrowDown size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleSetType(sponsor, sponsorType > 0 ? 0 : 1)}
                                                    title={sponsorType > 0 ? 'Masquer (type 0)' : 'Activer (type 1)'}
                                                    className={`flex items-center justify-center p-2 rounded-lg text-xs font-bold transition-colors ${
                                                        sponsorType > 0
                                                            ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'
                                                            : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                                                    }`}
                                                >
                                                    {sponsorType > 0 ? <EyeOff size={14} /> : <Eye size={14} />}
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
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}
