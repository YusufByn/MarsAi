import { useState, useEffect } from 'react';

/**
 * Composant TagInput - Système de tags dynamique
 * 
 * Permet à l'utilisateur d'ajouter/supprimer des tags de manière interactive.
 * Les tags s'affichent comme des badges avec une croix de suppression.
 * 
 * @param {Array} value - Tableau initial de tags
 * @param {Function} onChange - Callback appelé quand les tags changent
 * @param {String} error - Message d'erreur à afficher (optionnel)
 */
const TagInput = ({ value = [], onChange, error }) => {
  const [tags, setTags] = useState(value);
  const [inputValue, setInputValue] = useState('');
  const [showError, setShowError] = useState(false);

  // Synchroniser avec la prop value si elle change (ex: retour arrière)
  useEffect(() => {
    setTags(value);
  }, [value]);

  /**
   * Normalise un tag : trim externe, conversion minuscules, espaces → tirets
   */
  const normalizeTag = (text) => {
    return text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-'); // Espaces multiples deviennent un seul tiret
  };

  /**
   * Vérifie si un tag peut être ajouté
   */
  const canAddTag = (tag) => {
    // Tag vide après normalisation
    if (!tag || tag.length === 0) {
      return { valid: false, silent: true };
    }

    // Trop long
    if (tag.length > 20) {
      return { valid: false, silent: false };
    }

    // Limite de 10 tags atteinte
    if (tags.length >= 10) {
      return { valid: false, silent: false };
    }

    // Doublon (case-insensitive)
    if (tags.some(existingTag => existingTag.toLowerCase() === tag.toLowerCase())) {
      return { valid: false, silent: false };
    }

    return { valid: true };
  };

  /**
   * Affiche le feedback d'erreur visuel (border rouge)
   */
  const triggerError = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 500);
  };

  /**
   * Ajoute un tag à la liste
   */
  const addTag = (rawTag) => {
    const normalizedTag = normalizeTag(rawTag);
    const check = canAddTag(normalizedTag);

    if (!check.valid) {
      if (!check.silent) {
        triggerError();
      }
      return false;
    }

    const newTags = [...tags, normalizedTag];
    setTags(newTags);
    onChange(newTags);
    return true;
  };

  /**
   * Supprime un tag par index
   */
  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onChange(newTags);
  };

  /**
   * Gère la saisie clavier dans l'input
   */
  const handleKeyDown = (e) => {
    // Entrée ou Virgule → créer un tag
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      
      // Support du collage multiple avec virgules
      const parts = inputValue.split(',').map(part => part.trim()).filter(part => part);
      
      if (parts.length > 1) {
        // Multi-tags
        let added = 0;
        for (const part of parts) {
          if (addTag(part)) {
            added++;
          }
          if (tags.length + added >= 10) break; // Stopper si limite atteinte
        }
        setInputValue('');
      } else if (inputValue.trim()) {
        // Tag unique
        if (addTag(inputValue)) {
          setInputValue('');
        }
      }
    }
    
    // Backspace sur input vide → supprimer le dernier tag
    if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  /**
   * Gère le changement dans l'input
   */
  const handleInputChange = (e) => {
    const value = e.target.value;
    // Bloquer la virgule si elle est tapée (sera gérée par onKeyDown)
    if (value.endsWith(',')) {
      return;
    }
    setInputValue(value);
  };

  return (
    <div className="w-60">
      {/* Container des tags + input */}
      <div className={`bg-black/50 border rounded-xl p-2 w-60 flex flex-wrap gap-2 items-center min-h-[42px] ${
        showError ? 'border-red-500' : error ? 'border-red-500' : ''
      }`}>
        
        {/* Tags existants */}
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 bg-sky-400 text-black text-sm px-3 py-1 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:text-red-600 font-bold text-lg leading-none"
              aria-label={`Remove tag ${tag}`}
            >
              ×
            </button>
          </span>
        ))}

        {/* Input pour nouveau tag */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Add tags (Enter or comma)" : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-white placeholder-gray-500 text-sm"
          disabled={tags.length >= 10}
        />
      </div>

      {/* Texte d'aide */}
      <p className="text-gray-400 text-xs mt-1">
        Press Enter or comma to add tags (max 10, 20 chars each)
      </p>

      {/* Message d'erreur */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default TagInput;
