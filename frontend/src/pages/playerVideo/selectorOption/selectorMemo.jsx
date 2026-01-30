// ici il y aura tout le code concernant la gestion des options de sélection des jurys
// c'est à dire le vote, le dislike, le bookmark, le commentaire, etc.
import React, { useState } from 'react';

const SelectorMemo = ({ initialMemo = '', onMemoChange }) => {
    const [memo, setMemo] = useState(initialMemo);

    const handleChange = (event) => {
        const nextValue = event.target.value;
        setMemo(nextValue);
        if (onMemoChange) {
            onMemoChange(nextValue);
        }
    };

    return (
        <div className="space-y-3">
            <div>
                <h2 className="text-sm font-semibold text-white">Memo du selector</h2>
                <p className="text-xs text-gray-500">
                    Notes internes, visibles uniquement par l&apos;équipe.
                </p>
            </div>
            <textarea
                value={memo}
                onChange={handleChange}
                placeholder="Ajoute un memo rapide sur cette video..."
                className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-mars-primary/40"
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{memo.length} caracteres</span>
                <span>Memo non sauvegarde</span>
            </div>
        </div>
    );
};

export default SelectorMemo;