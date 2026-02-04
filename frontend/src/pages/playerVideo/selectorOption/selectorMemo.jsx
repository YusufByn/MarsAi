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
        <div className="space-y-2">
            <div>
                <label className="block text-sm font-semibold text-white mb-1">
                    Note rapide
                </label>
                <p className="text-xs text-gray-400">
                    Visible uniquement par vous
                </p>
            </div>
            <textarea
                value={memo}
                onChange={handleChange}
                placeholder="Observations sur cette video..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
            />
            <p className="text-xs text-gray-500 text-right">{memo.length} caracteres</p>
        </div>
    );
};

export default SelectorMemo;