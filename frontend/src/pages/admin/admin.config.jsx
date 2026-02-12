import React, { useState } from 'react';
import { Save } from 'lucide-react';

export default function AdminConfig() {
    // État local pour stocker la config (normalement fetché depuis l'API)
    const [sections, setSections] = useState({
        general: {
            title: "INFORMATIONS GÉNÉRALES",
            data: { festival_name: "Mars.AI", year: "2026", primary_color: "#246BAD", secondary_color: "#FF5845" }
        },
        hero: {
            title: "HERO SECTION",
            data: { badge: "FESTIVAL INTERNATIONAL DU FILM IA", main_title: "IMAGINEZ DES", sub_title: "FUTURS SOUHAITABLES", bg_image: "" }
        },
        // ... Ajoute les autres sections (Projet, Partenaires...) ici selon tes besoins
    });

    const handleChange = (sectionKey, field, value) => {
        setSections(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                data: { ...prev[sectionKey].data, [field]: value }
            }
        }));
    };

    const handleSave = async () => {
        // Logique de sauvegarde vers API (PUT /api/admin/cms)
        alert("Configuration sauvegardée !");
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen ml-64">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <p className="text-xs font-bold text-orange-500 mb-2 uppercase tracking-wide">CMS & IDENTITÉ</p>
                    <h1 className="text-4xl font-bold text-gray-900">CONFIGURATION FESTIVAL</h1>
                    <p className="text-gray-500 mt-2">Personnalisez chaque section pour une réutilisation totale de l'outil.</p>
                </div>
                <button 
                    onClick={handleSave}
                    className="bg-gray-800 text-white px-6 py-3 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-gray-900"
                >
                    <Save size={16} /> PUBLIER LES MODIFICATIONS
                </button>
            </div>

            <div className="space-y-8">
                {/* --- SECTION GÉNÉRALE (Couleurs) --- */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">🎨</div>
                        <h2 className="text-xl font-bold text-gray-900">{sections.general.title}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <InputGroup label="NOM DU FESTIVAL" value={sections.general.data.festival_name} onChange={(v) => handleChange('general', 'festival_name', v)} />
                        <InputGroup label="ÉDITION / ANNÉE" value={sections.general.data.year} onChange={(v) => handleChange('general', 'year', v)} />
                    </div>

                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">IDENTITÉ VISUELLE</h3>
                    <div className="grid grid-cols-3 gap-6">
                        <ColorPicker label="COULEUR PRINCIPALE" color={sections.general.data.primary_color} onChange={(v) => handleChange('general', 'primary_color', v)} />
                        <ColorPicker label="COULEUR SECONDAIRE" color={sections.general.data.secondary_color} onChange={(v) => handleChange('general', 'secondary_color', v)} />
                    </div>
                </div>

                {/* --- SECTION HERO --- */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">🖼️</div>
                        <h2 className="text-xl font-bold text-gray-900">{sections.hero.title}</h2>
                    </div>

                    <div className="space-y-6">
                        <InputGroup label="BADGE" value={sections.hero.data.badge} onChange={(v) => handleChange('hero', 'badge', v)} />
                        <div className="grid grid-cols-2 gap-6">
                            <InputGroup label="TITRE PRINCIPAL" value={sections.hero.data.main_title} onChange={(v) => handleChange('hero', 'main_title', v)} />
                            <InputGroup label="TITRE ACCENT" value={sections.hero.data.sub_title} onChange={(v) => handleChange('hero', 'sub_title', v)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Composants utilitaires pour le style
function InputGroup({ label, value, onChange }) {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{label}</label>
            <input 
                type="text" 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-gray-100 border-none rounded-lg p-3 text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>
    );
}

function ColorPicker({ label, color, onChange }) {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{label}</label>
            <div className="bg-gray-100 rounded-lg p-2 flex items-center gap-3">
                <input 
                    type="color" 
                    value={color} 
                    onChange={(e) => onChange(e.target.value)}
                    className="w-10 h-10 rounded border-none cursor-pointer"
                />
                <span className="text-xs font-bold text-gray-500 uppercase">{color}</span>
            </div>
        </div>
    );
}